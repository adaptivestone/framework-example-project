# Controller Creation Pattern

This project uses a specific controller pattern based on the `AbstractController` class from the Adaptive Stone framework. All controllers must follow this standardized approach.

## Controller Structure

### Basic Template

```typescript
import type { RouteParams } from '@adaptivestone/framework/modules/AbstractController.js';
import AbstractController from '@adaptivestone/framework/modules/AbstractController.js';
import type { FrameworkRequest } from '@adaptivestone/framework/services/http/HttpServer.js';
import type { PaginationMiddlewareAppInfo } from '@adaptivestone/framework/services/http/middleware/Pagination.js';
import Pagination from '@adaptivestone/framework/services/http/middleware/Pagination.js';
import RoleMiddleware from '@adaptivestone/framework/services/http/middleware/Role.js';
import type { Response } from 'express';
import { object, string, array, number } from 'yup';

class YourController extends AbstractController {
  get routes(): RouteParams {
    return {
      get: {
        '/': {
          handler: this.getList,
          middleware: [Pagination],
          query: object().shape({
            // Define query parameters validation
            name: string(),
            status: string(),
          }),
        },
        '/:slug': {
          handler: this.getBySlug,
        },
      },
      post: {
        '/': {
          handler: this.create,
          middleware: [[RoleMiddleware, { roles: ['admin'] }]],
          request: object().shape({
            // Define request body validation
            name: array().of(string()).required(),
          }),
        },
      },
      put: {
        '/:slug': {
          handler: this.update,
          middleware: [[RoleMiddleware, { roles: ['admin'] }]],
          request: object().shape({
            // Define request body validation
            name: array().of(string()),
          }),
        },
      },
      delete: {
        '/:slug': {
          handler: this.delete,
          middleware: [[RoleMiddleware, { roles: ['admin'] }]],
        },
      },
    };
  }

  // Handler methods go here...

  static get middleware() {
    return new Map();
  }
}

export default YourController;
```

## Route Definition Rules

### HTTP Methods
- `get`: For retrieving data
- `post`: For creating new resources
- `put`: For updating existing resources
- `delete`: For deleting resources

### Route Structure
```typescript
get: {
  '/path': {
    handler: this.methodName,
    middleware: [MiddlewareClass],
    query: validationSchema, // For query parameters
  },
},
post: {
  '/path': {
    handler: this.methodName,
    middleware: [[MiddlewareClass, { options }]], // With options
    request: validationSchema, // For request body
  },
},
```

## Middleware Usage

### Common Middleware

#### Pagination
```typescript
import Pagination from '@adaptivestone/framework/services/http/middleware/Pagination.js';

// In routes
middleware: [Pagination]

// In handler method signature
async getList(
  req: FrameworkRequest & PaginationMiddlewareAppInfo,
  res: Response,
) {
  const { skip, limit, page } = req.appInfo.pagination;
  // Use pagination values
}
```

#### Role-based Access Control
```typescript
import RoleMiddleware from '@adaptivestone/framework/services/http/middleware/Role.js';

// In routes
middleware: [[RoleMiddleware, { roles: ['admin'] }]]
```

#### Authentication
```typescript
import Auth from '@adaptivestone/framework/services/http/middleware/Auth.js';
import GetUserByToken from '@adaptivestone/framework/services/http/middleware/GetUserByToken.js';

// In static middleware method
static get middleware() {
  return new Map([['/{*splat}', [GetUserByToken, Auth]]]);
}
```

## Validation Schemas

### Query Parameters
```typescript
import { object, string, number, array } from 'yup';

query: object().shape({
  name: string(),
  status: string(),
  page: number(),
  limit: number(),
  tags: array().of(string()),
})
```

### Request Body
```typescript
import { YupFile } from '@adaptivestone/framework/helpers/yup.js';

request: object().shape({
  name: array().of(string()).required(),
  description: array().of(string()),
  image: new YupFile().required(),
  tags: array().of(string()),
})
```

## Handler Method Patterns

### Basic GET Handler
```typescript
async getList(
  req: FrameworkRequest & PaginationMiddlewareAppInfo & {
    appInfo: {
      query: {
        name?: string;
        status?: string;
      };
    };
  },
  res: Response,
) {
  try {
    const Model = this.app.getModel('ModelName');
    const { name, status } = req.appInfo.query;
    const { skip, limit, page } = req.appInfo.pagination;

    const query: any = {};
    if (name) {
      query.name = new RegExp(name, 'i');
    }
    if (status) {
      query.status = status;
    }

    const [items, total] = await Promise.all([
      Model.find(query).skip(skip).limit(limit),
      Model.countDocuments(query),
    ]);

    const publicItems = await Promise.all(
      items.map(async (item: any) => await item.getPublic())
    );

    return res.status(200).json({
      data: publicItems,
      total,
      page,
      limit,
    });
  } catch (error) {
    console.error('Error fetching items:', error);
    return res.status(500).json({
      message: req.appInfo?.i18n?.t('common.serverError') || 'Server error',
      data: null,
    });
  }
}
```

### GET by Slug Handler
```typescript
async getBySlug(req: FrameworkRequest, res: Response) {
  try {
    const Model = this.app.getModel('ModelName');
    const { slug } = req.params;

    const item = await Model.findOne({ slug });
    if (!item) {
      return res.status(404).json({
        message: req.appInfo?.i18n?.t('model.notFound') || 'Item not found',
        data: null,
      });
    }

    return res.status(200).json({
      data: await item.getPublic(),
    });
  } catch (error) {
    console.error('Error fetching item:', error);
    return res.status(500).json({
      message: req.appInfo?.i18n?.t('common.serverError') || 'Server error',
      data: null,
    });
  }
}
```

### POST (Create) Handler
```typescript
async create(
  req: FrameworkRequest & {
    appInfo: {
      request: {
        name: string[];
        description?: string[];
        image?: File[];
      };
    };
  },
  res: Response,
) {
  try {
    const Model = this.app.getModel('ModelName');
    const { name, description, image } = req.appInfo.request;

    // Validation
    const existingItem = await Model.findOne({ name: name[0] });
    if (existingItem) {
      return res.status(409).json({
        message: req.appInfo.i18n?.t('model.nameExistsMessage', { name: name[0] }) || 
                 `Item with name "${name[0]}" already exists`,
        errors: {
          name: req.appInfo.i18n?.t('model.nameExists') || 'Name already exists',
        },
        data: null,
      });
    }

    // Handle file upload if needed
    let imageId = null;
    if (image?.[0]) {
      const FileModel = this.app.getModel('File');
      
      if (!image[0].mimetype?.includes('image')) {
        return res.status(400).json({
          errors: {
            image: req.appInfo.i18n?.t('validation.fileNotImage') || 'File must be an image',
          },
          data: null,
        });
      }

      const fileMongo = await FileModel.uploadFile(
        image[0].filepath,
        image[0].originalFilename,
        image[0].mimetype,
        'folder-name',
      );

      if (!fileMongo) {
        return res.status(500).json({
          message: req.appInfo.i18n?.t('common.fileUploadFailed') || 'File upload failed',
          data: null,
        });
      }

      imageId = fileMongo._id;
    }

    const newItem = await Model.create({
      name: name[0],
      description: description?.[0],
      image: imageId,
    });

    return res.status(201).json({
      data: await newItem.getPublic(),
    });
  } catch (error) {
    console.error('Error creating item:', error);
    return res.status(500).json({
      message: req.appInfo?.i18n?.t('common.serverError') || 'Server error',
      data: null,
    });
  }
}
```

### PUT (Update) Handler
```typescript
async update(
  req: FrameworkRequest & {
    appInfo: {
      request: {
        name?: string[];
        description?: string[];
        image?: File[];
      };
    };
  },
  res: Response,
) {
  try {
    const Model = this.app.getModel('ModelName');
    const { slug } = req.params;
    const { name, description, image } = req.appInfo.request;

    const item = await Model.findOne({ slug });
    if (!item) {
      return res.status(404).json({
        message: req.appInfo?.i18n?.t('model.notFound') || 'Item not found',
        data: null,
      });
    }

    // Check for duplicate name if updating
    if (name?.[0] && name[0] !== item.name) {
      const existingItem = await Model.findOne({
        name: name[0],
        slug: { $ne: slug },
      });

      if (existingItem) {
        return res.status(409).json({
          message: req.appInfo.i18n?.t('model.nameExistsMessage', { name: name[0] }) || 
                   `Item with name "${name[0]}" already exists`,
          errors: {
            name: req.appInfo.i18n?.t('model.nameExists') || 'Name already exists',
          },
          data: null,
        });
      }
    }

    // Update fields
    const updateData: any = {};
    if (name?.[0]) {
      updateData.name = name[0];
    }
    if (description?.[0]) {
      updateData.description = description[0];
    }

    // Handle image upload if provided
    if (image?.[0]) {
      // ... file upload logic similar to create
    }

    const updatedItem = await Model.findOneAndUpdate(
      { slug },
      updateData,
      { new: true }
    );

    return res.status(200).json({
      data: await updatedItem.getPublic(),
    });
  } catch (error) {
    console.error('Error updating item:', error);
    return res.status(500).json({
      message: req.appInfo?.i18n?.t('common.serverError') || 'Server error',
      data: null,
    });
  }
}
```

### DELETE Handler
```typescript
async delete(req: FrameworkRequest, res: Response) {
  try {
    const Model = this.app.getModel('ModelName');
    const { slug } = req.params;

    const item = await Model.findOne({ slug });
    if (!item) {
      return res.status(404).json({
        message: req.appInfo?.i18n?.t('model.notFound') || 'Item not found',
        data: null,
      });
    }

    await Model.findOneAndDelete({ slug });

    return res.status(200).json({
      data: null,
    });
  } catch (error) {
    console.error('Error deleting item:', error);
    return res.status(500).json({
      message: req.appInfo?.i18n?.t('common.serverError') || 'Server error',
      data: null,
    });
  }
}
```

## Important Rules

### 1. Response Format
- Always follow the project's response format (see `.clinerules/01-ResponceType.md`)
- Use proper HTTP status codes
- Include internationalization support

### 2. Error Handling
- Always wrap handlers in try-catch blocks
- Use appropriate HTTP status codes
- Provide meaningful error messages
- Use field-specific errors in the `errors` object

### 3. Model Access
- Use `this.app.getModel('ModelName')` to access models
- Always call `getPublic()` on model instances before returning

### 4. Validation
- Use Yup schemas for request/query validation
- Validate file uploads properly
- Check for duplicates before creating/updating

### 5. Pagination
- Use `Pagination` middleware for list endpoints
- Always return `total`, `page`, and `limit` for paginated responses

### 6. File Uploads
- Validate file types and presence
- Use `FileModel.uploadFile()` for file handling
- Store file references in the database

### 7. Internationalization
- Use `req.appInfo.i18n?.t()` for all user-facing messages
- Provide fallback English messages

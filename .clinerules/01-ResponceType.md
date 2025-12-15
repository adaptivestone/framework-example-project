# Project Response Type Standard

Project follows a standardized response type for all API endpoints.

## Response Format

```json
{
	"message": "Optional message. Error message on errors",
	"data": [ {} ], // can be object or array of objects
	"errors": { // optional in case of provided fields error
		"fieldName": "error description for field",
		"anotherField": "another field error"
	},
	"total": 400, //in case of pagination request should return total count 
	"page": 1,  //in case of pagination
	"limit": 30  //in case of pagination
}
```

## When to use each field:

- **message**: General error messages, system errors, or descriptive messages
- **errors**: Field-specific validation errors (maps field names to error messages)
- **data**: The actual response data (null for errors, object/array for success)
- **total, page, limit**: Only for paginated responses
 

## Examples:

### Success Response (Single Item)
```json
{
  "data": {
    "id": "123",
    "name": "Toyota"
  }
}
```


### Success Response (Paginated List)

```json
{
  "data": [
    {"id": "1", "name": "Toyota"},
    {"id": "2", "name": "Honda"}
  ],
  "total": 150,
  "page": 1,
  "limit": 30
}
```

### Field Validation Error

```json
{
  "errors": {
    "email": "Email is required",
    "password": "Password must be at least 8 characters"
  },
  "data": null
}

```

### General errors

```json
{
  "message": "Resource not found",
  "data": null
}
```


### Combined Error (with both message and field errors)


```json
{
  "message": "Validation failed",
  "errors": {
    "brandName": "Brand name already exists"
  },
  "data": null
}

```


## HTTP Status Code Guidelines

- **200**: Success
- **201**: Created successfully
- **400**: Validation errors (use `errors` field)
- **404**: Not found (use `message` field)
- **409**: Conflict (use both `message` and `errors` if field-specific)
- **500**: Server error (use `message` field)

## Internationalization Guidelines

- All error messages should use `req.appInfo.i18n.t()` with fallback to English
- Example: `req.appInfo.i18n.t('validation.required') || 'Field is required'`
- Field-specific errors should be placed in the `errors` object, not in `message`

## Important Rules:

1. **Field validation errors** (like "email is invalid", "file must be image") should ALWAYS go in the `errors` object with the field name as key
2. **General errors** (like "resource not found", "server error") should go in the `message` field
3. **Pagination fields** (total, page, limit) should only be included when the endpoint uses pagination middleware
4. **Success responses** should only include `data` field (and pagination fields if applicable)
5. **Error responses** should always include `data: null`

## Field-Specific Error Examples:

```javascript
// File validation error
return res.status(400).json({
  errors: {
    image: req.appInfo.i18n?.t('validation.fileNotImage') || 'File must be an image'
  },
  data: null
});

// Brand name duplicate error
return res.status(409).json({
  message: req.appInfo.i18n?.t('carBrand.brandNameExistsMessage', { brandName }) || `Brand "${brandName}" already exists`,
  errors: {
    brandName: req.appInfo.i18n?.t('carBrand.brandNameExists') || 'Brand name already exists'
  },
  data: null
});

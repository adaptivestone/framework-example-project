# Error Handling Standard

This project uses framework-level error handling. Controllers should not wrap their main logic in try-catch blocks unless handling specific, expected errors.

A handler **returns** its success response (`return HttpResponse.json(200, { data })`, framework ≥ 5.7) and **throws** its errors (see [Throwing HTTP Errors](#throwing-http-errors)). It never returns an error body.

## Framework Error Handling

The Adaptive Stone framework automatically wraps controller methods and handles errors appropriately, including:

- Converting errors to proper HTTP responses
- Logging errors with proper context
- Returning standardized error responses
- Handling different error types (validation, database, etc.)

## Controller Error Handling Rules

### ❌ Don't Wrap Entire Controller Methods

```typescript
async getMyList(req: FrameworkRequest) {
  try {
    // Don't wrap the entire method logic
    const data = await Model.find();
    return HttpResponse.json(200, { data });
  } catch (error) {
    // Framework already handles this: an uncaught error is answered with a 500
    throw new InternalServerError('Server error');
  }
}
```

### ✅ Let Framework Handle Errors

```typescript
async getMyList(req: FrameworkRequest) {
  // Framework will catch and handle any errors automatically
  const data = await Model.find();
  return HttpResponse.json(200, { data });
}
```

### ✅ Use Try-Catch Only for Specific Cases

```typescript
async updateUserProfile(req: FrameworkRequest) {
  const user = await User.findById(req.params.id);
  
  // Only use try-catch for non-critical operations that shouldn't fail the request
  if (user) {
    try {
      await sendNotificationEmail(user.email);
    } catch (error) {
      // Log but don't fail the request
      console.error('Failed to send notification:', error);
    }
  }
  
  return HttpResponse.json(200, { data: user });
}
```

## When to Use Try-Catch

### ✅ Acceptable Use Cases:

1. **Non-critical operations** that shouldn't fail the main request
2. **External API calls** where you want to continue on failure
3. **Cleanup operations** that might fail but shouldn't affect the response
4. **Logging operations** that are supplementary to the main logic

### ❌ Don't Use For:

1. **Main controller logic** - let framework handle these errors
2. **Database operations** - framework converts these to proper HTTP responses
3. **Validation errors** - framework handles these automatically
4. **Authentication/authorization** - middleware handles these

## Examples

### ✅ Good: Non-critical operation

```typescript
async createListing(req: FrameworkRequest) {
  const listing = await ListingModel.create(req.appInfo.request);
  
  // Non-critical: update user stats
  try {
    await updateUserStats(req.appInfo.user._id);
  } catch (error) {
    console.error('Failed to update user stats:', error);
  }
  
  return HttpResponse.json(201, { data: listing });
}
```

### ✅ Good: External service call

```typescript
async processPayment(req: FrameworkRequest) {
  const order = await OrderModel.create(req.appInfo.request);
  
  // External service that might be down
  try {
    await sendToAnalytics(order);
  } catch (error) {
    console.error('Analytics service unavailable:', error);
  }
  
  return HttpResponse.json(201, { data: order });
}
```

### ❌ Bad: Wrapping main logic

```typescript
async getMyAuctionsList(req: FrameworkRequest) {
  try {
    // Don't wrap the main controller logic
    const listings = await ListingModel.aggregate(pipeline);
    return HttpResponse.json(200, { data: listings });
  } catch (error) {
    // Framework handles this better
    throw new InternalServerError('Server error');
  }
}
```

## Important Rules

1. **Trust the framework** - it handles errors better than manual try-catch
2. **Only catch specific errors** you need to handle differently
3. **Don't suppress errors** unless they're truly non-critical
4. **Log appropriately** but let framework handle HTTP responses
5. **Use proper error types** when throwing custom errors

## Throwing HTTP Errors

To answer with an error status from a handler, a service or a middleware, throw
instead of building the response:

```typescript
import { NotFoundError } from '@adaptivestone/framework/services/http/httpErrors.js';

throw new NotFoundError({
  code: 'PERSON_NOT_FOUND', // clients branch on this; never translated
  i18nKey: 'person.notFound', // translates `message` per request
  message: 'Person not found', // English text and the log line
});
```

Field errors go in `errors`:
`throw new ConflictError({ message: 'Brand already exists', errors: { brandName: 'Brand name already exists' } })`.
Classes: `BadRequestError`, `UnauthorizedError`, `ForbiddenError`,
`NotFoundError`, `ConflictError`, or `new HttpError(status, details)` for any
other status. Thrown errors are logged at `verbose`, not as failures; a 5xx
`HttpError` is logged at `error`.

## Framework Error Response Format

Every error the framework answers (request validation, thrown `HttpError`s,
the built-in middleware, the 404 and 500 fallbacks) follows one contract:

```json
{
  "error": "PERSON_NOT_FOUND",
  "message": "Person not found",
  "errors": {
    "fieldName": ["Field-specific error"]
  }
}
```

`message` is always present; `error` (a machine-readable code) and `errors`
(an array of messages per field) are optional. This keeps every endpoint
consistent without manual error handling in controllers.

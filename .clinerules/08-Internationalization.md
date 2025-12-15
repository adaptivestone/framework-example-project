# Internationalization (i18n) Standard

This project supports multiple languages  and requires proper internationalization for all user-facing strings.

## Translation Requirements

### Mandatory Translation Rule
**IMPORTANT**: Whenever you add any new user-facing string (error messages, validation messages, success messages, etc.), you MUST add translations for all supported languages:

 (`src/locales/#{locale}/translation.json`)

### What Requires Translation

1. **Error Messages**: All error messages returned to users
2. **Validation Messages**: Field validation error messages
3. **Success Messages**: Confirmation and success messages
4. **UI Text**: Any text that users will see
5. **Email Templates**: Email content and subjects
6. **SMS Messages**: SMS text content

### Translation Structure

Organize translations in logical groups within the JSON files:

```json
{
  "validation": {
    "required": "Field is required",
    "passwordTooShort": "Password must be at least 6 characters",
    "passwordsDoNotMatch": "Passwords do not match"
  },
  "auth": {
    "loginSuccess": "Login successful",
    "invalidCredentials": "Invalid credentials"
  },
  "user": {
    "profileUpdated": "Profile updated successfully",
    "passwordChanged": "Password changed successfully"
  }
}
```

## Implementation Guidelines

### Using Translations in Controllers

Always use the i18n service with fallback to English:

```typescript
// ❌ Don't hardcode strings
return res.status(400).json({
  errors: {
    password: "Password is too short"
  },
  data: null
});

// ✅ Use i18n with fallback
return res.status(400).json({
  errors: {
    password: req.appInfo.i18n?.t('validation.passwordTooShort') || 'Password must be at least 6 characters long'
  },
  data: null
});
```

### Translation Keys Naming Convention

Use descriptive, hierarchical keys:

- `validation.required` - for required field validation
- `validation.passwordTooShort` - for password length validation
- `auth.invalidCredentials` - for authentication errors
- `user.profileUpdated` - for user profile success messages
- `listing.notFound` - for listing-specific errors


## Translation Workflow

### When Adding New Features

1. **Identify all user-facing strings** in your implementation
2. **Add translation keys** to both language files
3. **Use i18n service** in your code with proper fallbacks
4. **Test with both languages** to ensure translations work



## Important Rules

1. **Never commit code** with hardcoded user-facing strings without translations
2. **Always provide fallback** English text in case translation is missing
3. **Use consistent key naming** following the hierarchical structure
4. **Test both languages** before considering implementation complete
5. **Keep translations synchronized** - if you add a key to one language file, add it to all
6. **Use meaningful keys** that describe the context and purpose of the message

## Validation Checklist

Before submitting any code with user-facing strings:

- [ ] All error messages use i18n service
- [ ] All translations added to files
- [ ] Fallback English text provided in code
- [ ] Translation keys follow naming convention
- [ ] All languages tested and working

## Common Translation Categories

### Validation Messages
- `validation.required`
- `validation.invalid`
- `validation.tooShort`
- `validation.tooLong`
- `validation.mustMatch`

### Authentication
- `auth.loginSuccess`
- `auth.loginFailed`
- `auth.invalidCredentials`
- `auth.sessionExpired`

### General Errors
- `common.serverError`
- `common.notFound`
- `common.accessDenied`
- `common.operationFailed`

### Success Messages
- `common.success`
- `common.created`
- `common.updated`
- `common.deleted`

This ensures consistent, professional, and accessible user experience across all supported languages.

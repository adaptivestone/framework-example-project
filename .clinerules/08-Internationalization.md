# Internationalization (i18n) Standard

This project supports multiple languages  and requires proper internationalization for all user-facing strings.

## The engine is this project's dependency, not the framework's

Since framework 5.4, `i18next` and `i18next-fs-backend` are **optional peer
dependencies** of `@adaptivestone/framework` — they no longer arrive with it.
This project ships `src/locales/en` and `src/locales/ru`, so it depends on both
directly in `package.json`; do not remove them. Without them the framework does
not fail: every framework-emitted message falls back to its in-code English
default, `config/i18n.ts`'s `enabled: true` notwithstanding, and the first
request that needs a translator logs a single warning naming the two packages.
That is a silently English application, which is not what this project wants.

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

### Validation schema messages

Put translation keys directly in Standard Schema validation messages. The framework translates
those keys with the request's locale before it serializes the 400 response; controllers must not
catch validation failures or translate their messages a second time.

```typescript
const createUser = z.object({
  email: z.email({ error: 'validation.emailInvalid' }),
  password: z.string().min(8, { error: 'validation.passwordTooShort' }),
});
```

The normal test bootstrap does not load this project's locale resources
(`src/tests/setup.ts` deliberately leaves `TEST_FOLDER_LOCALES` unset), which
splits the two kinds of message under test since framework 5.4:

- **Keys this project authors** — the `validation.*` keys in the schemas above —
  have no catalog entry and no `defaultValue`, so `t()` hands back the key
  itself. API tests assert those **raw keys** and the status code.
- **Messages the framework emits** — auth validation, the auth 401, the 404/500
  sinks — now carry their English text as an in-code `defaultValue`, so they
  render as **English sentences**, never as a raw `auth.emailProvided`. Assert
  the English, or assert only the status code and the `errors` field names.

Only tests specifically covering rendered copy should set `TEST_FOLDER_LOCALES`
and assert localized text.

### Using Translations in Controllers

Always go through the i18n service, and put the English text in i18next's
`defaultValue` option. **Never** write `t('key') || 'English text'`: on a miss
`t()` returns the key *itself*, a truthy string, so the `||` branch is
unreachable and the raw key ships to the client.

```typescript
// ❌ Don't hardcode strings
return res.status(400).json({
  errors: {
    password: "Password is too short"
  },
  data: null
});

// ✅ Use i18n with an in-code English default
return res.status(400).json({
  errors: {
    password: req.appInfo.i18n?.t('validation.passwordTooShort', { defaultValue: 'Password must be at least 6 characters long' })
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


## Overriding framework messages

Framework 5.4 emits every one of its own messages as `t(key, { defaultValue })`
with the current English text as the default. Nothing is added to the
framework's locale files — the in-code default *is* the English source of truth
— and **a key present in this project's locales always wins**. So translating or
rewording a built-in message needs nothing but the key in
`src/locales/<lng>/translation.json`.

This project demonstrates that with the auth middleware's 401:

```jsonc
// src/locales/en/translation.json — reworded, not translated
{ "middleware": { "auth": { "notLoggedIn": "Please sign in to continue" } } }
// src/locales/ru/translation.json
{ "middleware": { "auth": { "notLoggedIn": "Пожалуйста, войдите в систему, чтобы продолжить" } } }
```

`GET /profile` without a token answers `Please sign in to continue` instead of
the framework's own `Please login to application`, and the Russian sentence with
`X-Lang: ru` (language detection reads the `X-Lang` header, the `?lng=` query
parameter, or `user.locale` — **not** `Accept-Language`).

The other overridable framework keys are `middleware.role.userRequired`,
`middleware.role.noAccess`, `middleware.rateLimiter.tooManyRequests`,
`middleware.requestParser.entityTooLarge`,
`middleware.requestParser.parseError`, `http.notFound`, `http.serverError`, and
the `auth.*` / `email.*` / `password.*` sets. Copying one is **optional** — each
already renders English on its own. Copy it only to translate it or to change
the wording, which is what the partial `auth.*` set in this project's locale
files is: a demonstration of the override, not an obligation, and no longer a
prerequisite for the other 20-odd framework messages to read as sentences.

The `validation.*` set is a different thing and stays mandatory: those are keys
**this project** authors for its own Standard Schema messages, so nothing
supplies an in-code default for them — a key missing from the catalog renders as
the raw key.

Two notes on the email keys: `email.greeating` was renamed to the correctly
spelled **`email.greeting`** in 5.4 (the old key still works as a fallback until
v6 — translate the new spelling), and the shipped email templates are JS
template modules that need `@adaptivestone/framework-module-email` `^2.1.0`.

Custom middleware get the same behavior from `AbstractMiddleware`'s protected
`translate(req, key, defaultValue)` helper.

To collect the ones worth translating, add a `src/config/i18n.ts` that spreads
the framework's own `config/i18n.js` and sets `saveMissing: true` (this project
has no such override yet, so the framework default `false` applies): a request
that then hits an untranslated framework message writes its English default into
`src/locales/<lng>/translation.missing.json` — a ready-made starter file for
translators.

## Translation Workflow

### When Adding New Features

1. **Identify all user-facing strings** in your implementation
2. **Add translation keys** to both language files
3. **Use i18n service** in your code with proper fallbacks
4. **Test with both languages** to ensure translations work



## Important Rules

1. **Never commit code** with hardcoded user-facing strings without translations
2. **Always pass a `defaultValue`** with the English text, so a missing key
   renders a sentence instead of the key
3. **Use consistent key naming** following the hierarchical structure
4. **Test both languages** before considering implementation complete
5. **Keep translations synchronized** - if you add a key to one language file, add it to all
6. **Use meaningful keys** that describe the context and purpose of the message

## Validation Checklist

Before submitting any code with user-facing strings:

- [ ] All error messages use i18n service
- [ ] All translations added to files
- [ ] English text passed as `defaultValue` (never behind `||`)
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

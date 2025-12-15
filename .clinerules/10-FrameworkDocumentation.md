# Framework Documentation Standard

This project uses the Adaptive Stone Framework. Complete framework documentation should be available locally for reference.

## Documentation Location

The framework documentation is stored at `.clinerules/framework-docs.md`.

**IMPORTANT**: Before answering questions about the framework or implementing features, you MUST check if the documentation file exists locally.

## Checking Documentation Availability

1. **First, check if `.clinerules/framework-docs.md` exists**
2. **If the file does NOT exist**, inform the user to download it:
   ```bash
   npm run docs:download
   ```
3. **If the file exists**, read it and use it as the authoritative source for framework information

## Download Script

The project includes a script to download the latest framework documentation:

```bash
npm run docs:download
```

This script:
- Downloads documentation from `https://framework.adaptivestone.com/llm-context.md`
- Saves it to `.clinerules/framework-docs.md`
- The file is git-ignored and must be downloaded locally

## When to Use Documentation

**Always consult the local documentation file when:**
- Implementing controllers, models, or services
- Working with middleware
- Creating CLI commands
- Setting up testing
- Using framework features (i18n, logging, caching, etc.)
- Answering questions about framework capabilities

## Documentation-First Workflow

1. ✅ Check if `.clinerules/framework-docs.md` exists
2. ✅ If not, instruct user to run `npm run docs:download`
3. ✅ Read the relevant documentation section
4. ✅ Implement based on framework patterns
5. ✅ Follow framework conventions and best practices

## Fallback

If documentation is not available locally and cannot be downloaded, refer to:
- Online documentation: https://framework.adaptivestone.com/docs/intro
- Existing project code patterns
- Framework source code in `node_modules/@adaptivestone/framework`

## Important Notes

- **Manual download required**: The documentation file is NOT committed to git
- **Keep updated**: Run `npm run docs:download` periodically for latest updates
- **Single source of truth**: Local docs file is the authoritative reference
- **Always check first**: Don't assume - verify documentation exists before proceeding

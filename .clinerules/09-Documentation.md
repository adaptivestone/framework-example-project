# Documentation-First Approach

**CRITICAL RULE**: Always consult the framework documentation BEFORE implementing features, asking questions, or making assumptions.

## Framework Documentation

The project is based on Adaptive Stone framework.  
**Documentation**: https://framework.adaptivestone.com/docs/intro

## Mandatory Documentation Check

Before implementing ANY feature or answering questions about:
- Controllers
- Models
- Services
- Middleware
- Configuration
- Logging
- Authentication
- Testing
- CLI commands
- Any other framework functionality

**YOU MUST**:
1. ✅ Visit the framework documentation first
2. ✅ Navigate to the relevant section
3. ✅ Read and understand the framework's approach
4. ✅ Follow the framework's patterns and conventions
5. ✅ Only then proceed with implementation

## Why This Matters

❌ **Don't**:
- Assume based on generic knowledge
- Ask questions that documentation already answers
- Implement custom solutions when framework provides them
- Guess at configuration patterns

✅ **Do**:
- Check documentation first
- Use framework's built-in features
- Follow framework conventions
- Ask clarifying questions ONLY if documentation is unclear or incomplete

## Documentation Structure

The framework documentation includes sections on:
- **Base Classes**: AbstractController, AbstractModel, etc.
- **Configuration**: Various config files and their purposes
- **Logging**: Winston-based logger configuration
- **Controllers**: Routing, middleware, validation patterns
- **Models**: Database models and schemas
- **i18n**: Internationalization support
- **Services**: Email, caching, and other services
- **Testing**: Testing patterns and setup
- **CLI**: Command-line tools
- **Deployment**: Production deployment guidelines

## Example: Correct Workflow

### ❌ Wrong Approach:
```
User: "Can I add a custom logger?"
Assistant: "What type of logger would you like? Winston, Pino, or custom?"
```

### ✅ Correct Approach:
```
User: "Can I add a custom logger?"
Assistant: "Let me check the framework documentation first..."
[Reads documentation]
"According to the framework docs, it uses Winston with configurable 
transports. You can customize it via config/log.ts file..."
```

## Self-Reflection Checklist

Before responding to any implementation request, ask yourself:
- [ ] Have I checked the framework documentation?
- [ ] Do I understand how the framework handles this?
- [ ] Am I following framework conventions?
- [ ] Is there a framework-provided solution I should use?

## When Documentation is Insufficient

If after reading the documentation you still need clarification:
1. ✅ State what you found in the documentation
2. ✅ Explain what specific aspect is unclear
3. ✅ Ask targeted questions about the gap in understanding

## Bottom Line

**The framework documentation is the source of truth.**  
Consulting it first saves time, ensures consistency, and prevents mistakes.

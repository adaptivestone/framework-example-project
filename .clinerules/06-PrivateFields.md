# Private Fields Standard

This project uses JavaScript private fields syntax (`#`) instead of TypeScript `private` keyword for class members that should be private.

## Use JavaScript Private Fields

### Correct Usage
```typescript
class MyClass {
  #privateField: string = 'private';
  #privateMethod(): void {
    // private method implementation
  }
  
  public publicMethod(): void {
    this.#privateMethod();
    console.log(this.#privateField);
  }
}
```

### Incorrect Usage
```typescript
class MyClass {
  private privateField: string = 'private'; // ❌ Don't use TypeScript private
  private privateMethod(): void {           // ❌ Don't use TypeScript private
    // private method implementation
  }
}
```

## Rules

1. **Use `#` prefix** for private fields and methods instead of TypeScript `private` keyword
2. **Access private members** using `this.#memberName` syntax
3. **Private fields are truly private** - they cannot be accessed from outside the class, even with bracket notation
4. **TypeScript support** - TypeScript fully supports JavaScript private fields with proper type checking

## Benefits

- **True privacy**: JavaScript private fields provide real privacy, not just compile-time privacy
- **Runtime enforcement**: Private fields are enforced at runtime, not just during compilation
- **Better encapsulation**: Prevents accidental access to private members
- **Future-proof**: Uses native JavaScript features rather than TypeScript-specific syntax

## Examples

### Private Properties
```typescript
class DataProcessor {
  #data: any[] = [];
  #isProcessing: boolean = false;
  
  addData(item: any): void {
    this.#data.push(item);
  }
  
  process(): void {
    if (this.#isProcessing) return;
    this.#isProcessing = true;
    // process this.#data
    this.#isProcessing = false;
  }
}
```

### Private Methods
```typescript
class ApiClient {
  #baseUrl: string;
  
  constructor(baseUrl: string) {
    this.#baseUrl = baseUrl;
  }
  
  #buildUrl(endpoint: string): string {
    return `${this.#baseUrl}/${endpoint}`;
  }
  
  #handleError(error: any): void {
    console.error('API Error:', error);
  }
  
  async get(endpoint: string): Promise<any> {
    try {
      const url = this.#buildUrl(endpoint);
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      this.#handleError(error);
      throw error;
    }
  }
}
```

## Important Notes

- Private fields must be declared in the class body, not in the constructor
- Private fields are not inherited by subclasses
- Private fields cannot be dynamically added to a class
- Use this syntax consistently throughout the codebase

# ai-functions

A convenience layer on top of the ai package that simplifies schema definition and function creation.

## Installation

```bash
npm install ai-functions
```

## Usage

### AI Function Proxy

Create AI functions on the fly using the magic `ai` proxy:

```typescript
import { ai } from 'ai-functions'

// Create a product categorization function
const categorizeProduct = ai.categorizeProduct({
  productType: 'App | API | Marketplace | Platform | Packaged Service | Professional Service | Website',
  customer: 'ideal customer profile in 3-5 words',
  solution: 'describe the offer in 4-10 words',
  description: 'website meta description'
})

// Use the function
const result = await categorizeProduct({
  name: 'My Product',
  description: 'A revolutionary product'
})

// With streaming and custom options
const streamingProduct = ai.categorizeProduct({
  productType: 'App | API | Website',
  description: 'product description'
}, {
  stream: true,
  system: 'You are an expert at marketing',
  model: 'gpt-4o-mini'
})

for await (const chunk of streamingProduct({
  name: 'Test Product'
}).partialObjectStream) {
  console.log(chunk)
}
```

### List Generation

Generate lists using template literals with async iteration or await:

```typescript
import { list, createListFunction } from 'ai-functions'

// Using async iteration
for await (const thing of list`fun things to do in Miami`) {
  console.log(thing)
}

// Using await
const items = await list.await`best restaurants in New York`
console.log(items)

// Create custom list function
const quickList = createListFunction({
  model: 'gpt-4o-mini',
  system: 'You are a local tour guide'
})

for await (const place of quickList`places to visit`) {
  console.log(place)
}
```

### Direct Object Generation

For simpler use cases, generate objects directly:

```typescript
import { generateObject } from 'ai-functions'

const { object } = await generateObject({
  model: 'gpt-4o', // Use gpt-4o for highest quality or gpt-4o-mini for quicker responses
  schema: {
    productType: 'App | API | Marketplace | Platform | Packaged Service | Professional Service | Website',
    customer: 'ideal customer profile in 3-5 words',
    solution: 'describe the offer in 4-10 words',
    description: 'website meta description',
    keywords: ['seo-optimized keywords']
  },
  prompt: 'Generate a product description.'
})
```

## Configuration

### Models

- `gpt-4o`: High-quality responses (default)
- `gpt-4o-mini`: Faster, more economical responses

### Options

All functions accept these common options:

```typescript
type Options = {
  model?: string        // Model to use (default: gpt-4o)
  system?: string       // System prompt
  stream?: boolean      // Enable streaming responses
  seed?: number         // Integer for deterministic outputs
  temperature?: number  // Response creativity (0-1)
  maxTokens?: number    // Maximum response length
}
```

## Error Handling

The package includes built-in retries with exponential backoff for improved reliability:

```typescript
const result = await generateObject({
  // ... options
  retry: {
    attempts: 3,    // Number of retry attempts
    delay: 1000,    // Initial delay in ms
    factor: 2       // Exponential backoff factor
  }
})
```
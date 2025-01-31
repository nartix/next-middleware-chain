# next-middleware-chain

A lightweight utility for composing Next.js middleware functions in a simple and maintainable way. Using a chain-of-responsibility style, you can easily combine multiple middleware steps into a single pipeline.

## Installation

```bash
npm install @nartix/next-middleware-chain
```

or

```bash
yarn add @nartix/next-middleware-chain
```

## Overview

This package provides a function that takes multiple middleware handlers and executes them in sequence until one of them decides to stop the chain or until all have processed the request.

**Key Features:**

- **Modular:** Build complex logic from simple, single-purpose middleware functions.
- **Flexible:** Any middleware can terminate the chain early, returning its final response.
- **Maintainable:** Clear and predictable middleware flows.

## Basic Usage

### Defining Your Middlewares

A middleware function accepts a `NextRequest` and a `NextResponse` and returns a `MiddlewareResult` object, which contains:
- `response`: A `NextResponse` or `Response` (the updated response).
- `next`: A boolean indicating whether to continue the chain (`true`) or stop (`false`).

Example middleware (e.g., `logRequestTime`):

```typescript
import { MiddlewareResult } from '@nartix/next-middleware-chain';

export const logRequestTimeFactory: MiddlewareFactory = (next) => {
  return async (req, event, incomingResponse) => {
  console.log('Request received at:', Date.now());
  // Continue the chain
  return next(req, event, incomingResponse);
}

export const addHeaderA: MiddlewareFactory = (next) => {
  return async (req, event, incomingResponse) => {
    // Use existing response or create a new one
    const response = incomingResponse ?? NextResponse.next();
    response.headers.set('X-Header-A', 'ValueA');
    // Continue the chain
    return next(req, event, response);
  };
};
```

### Composing Middlewares

Use `createMiddlewareChain` to create a composed handler:

```typescript
import { addHeaderA } from './logRequestTimeFactory';
import { addHeaderB } from './addHeaderAFactory';

const factories = [
  logRequestTimeFactory,
  addHeaderAFactory
  // ...add as many middleware functions as you like
  ];

export default createMiddlewareChain(factories);
```

When any middleware returns `{ next: false }`, the chain stops and that response is returned immediately.

## Advanced Usage

You might have a more complex scenario where you conditionally alter headers or short-circuit early based on certain conditions. For example:

```typescript
// Example: A middleware that checks for an auth token.
export const checkAuth: MiddlewareFactory = (next) => {
  return async (req: NextRequest, event: NextFetchEvent, incomingResponse?: NextResponse) => {
    const token = req.headers.get('Authorization');
    if (!token) {
      // Return a 401 immediately, short-circuiting the chain
      return new Response('Unauthorized', { status: 401 });
    }

    // Otherwise, continue to the next middleware.
    // If we received a shared response, reuse it; otherwise create a new one
    return next(req, event, incomingResponse ?? NextResponse.next());
  };
};

// Example: A middleware that adds a custom header to the response.
export const addCustomHeader: MiddlewareFactory = (next) => {
  return async (req: NextRequest, event: NextFetchEvent, incomingResponse?: NextResponse) => {
    const response = incomingResponse ?? NextResponse.next();
    response.headers.set('X-Custom-Header', 'MyValue');
    return next(req, event, response);
  };
};

// Example: Calling All Subsequent Factories, Then Editing the Final Response
export const addFinalHeader: MiddlewareFactory = (next) => {
  return async (req, event, incomingResponse) => {
    // Let other factories run first
    const result = await next(req, event, incomingResponse ?? NextResponse.next());

    // If we got a NextResponse back, add a final header
    if (result instanceof NextResponse) {
      result.headers.set('X-Final-Header', 'FinalValue');
      return result;
    }

    // If it's a plain Response or no return, just pass it along
    return result;
  };
};
```

**Happy coding!** If you have questions, feel free to open an issue or submit a pull request.
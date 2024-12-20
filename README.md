# next-middleware-chain

A lightweight utility for composing Next.js middleware functions in a simple and maintainable way. Using a chain-of-responsibility style, you can easily combine multiple middleware steps into a single pipeline.

## Installation

```bash
npm install next-middleware-chain
```

or

```bash
yarn add next-middleware-chain
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
import { NextRequest, NextResponse } from 'next/server';
import { MiddlewareResult } from 'next-middleware-chain';

export async function logRequestTime(req: NextRequest, res: NextResponse): Promise<MiddlewareResult> {
  console.log('Request received at:', Date.now());
  // Continue the chain
  return { response: res, next: true };
}
```

### Composing Middlewares

Use `combineMiddlewares` to create a composed handler:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createMiddlewareChain } from 'next-middleware-chain';
import { logRequestTime } from './logRequestTime';

const combined = createMiddlewareChain(
  logRequestTime,
  // ...add as many middleware functions as you like
);

export default async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  return combined(req, res);
}
```

When any middleware returns `{ next: false }`, the chain stops and that response is returned immediately.

## Advanced Usage

You might have a more complex scenario where you conditionally alter headers or short-circuit early based on certain conditions. For example:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { combineMiddlewares, MiddlewareResult } from 'middleware-chain';

// Example: A middleware that checks for an auth token.
async function checkAuth(req: NextRequest, res: NextResponse): Promise<MiddlewareResult> {
  const token = req.headers.get('Authorization');
  if (!token) {
    // Stop the chain and return a 401 immediately
    return { response: new Response('Unauthorized', { status: 401 }), next: false };
  }
  // Authorized, continue the chain
  return { response: res, next: true };
}

// Example: A middleware that adds a custom header to the response.
async function addCustomHeader(req: NextRequest, res: NextResponse): Promise<MiddlewareResult> {
  const updatedRes = res.clone();
  updatedRes.headers.set('X-Custom-Header', 'MyValue');
  return { response: updatedRes, next: true };
}

// Combine the advanced middlewares
const combined = combineMiddlewares(checkAuth, addCustomHeader);

export default async function middleware(req: NextRequest) {
  return combined(req, NextResponse.next());
}
```

**Result:**  
- If `Authorization` header is missing, chain stops with a `401 Unauthorized` response.
- Otherwise, `X-Custom-Header` is added before the final response is returned.

---

**Happy coding!** If you have questions, feel free to open an issue or submit a pull request.
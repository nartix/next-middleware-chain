import { NextRequest, NextResponse } from 'next/server';

export interface MiddlewareResult {
  response: Response | NextResponse;
  next: boolean;
}

export type MiddlewareHandler = (req: NextRequest, res: NextResponse) => Promise<MiddlewareResult>;


export function createMiddlewareChain(...middlewares: MiddlewareHandler[]) {
  return async (req: NextRequest, res: NextResponse): Promise<NextResponse | Response> => {
    let currentResponse: NextResponse = res;
    for (const middleware of middlewares) {
      const { response, next }: MiddlewareResult = await middleware(req, currentResponse);
      if (!next && (response instanceof NextResponse || response instanceof Response)) {
        return response;
      }
      if (response instanceof NextResponse) {
        currentResponse = response;
      }
    }
    return currentResponse;
  };
}

import { NextRequest, NextResponse, NextFetchEvent } from 'next/server';
export type NextMiddleware = (request: NextRequest, event: NextFetchEvent, response?: NextResponse) => NextResponse | Response | null | undefined | void | Promise<NextResponse | Response | null | undefined | void>;
export type MiddlewareFactory = (next: NextMiddleware) => NextMiddleware;
export declare function createMiddlewareChain(factories?: MiddlewareFactory[], index?: number): NextMiddleware;
//# sourceMappingURL=index.d.ts.map
import { NextRequest, NextResponse } from 'next/server';
export interface MiddlewareResult {
    response: Response | NextResponse;
    next: boolean;
}
export type MiddlewareHandler = (req: NextRequest, res: NextResponse) => Promise<MiddlewareResult>;
export declare function createMiddlewareChain(...middlewares: MiddlewareHandler[]): (req: NextRequest, res: NextResponse) => Promise<NextResponse | Response>;

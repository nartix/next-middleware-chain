import { NextResponse } from 'next/server';
export function createMiddlewareChain(...middlewares) {
    return async (req, res) => {
        let currentResponse = res;
        for (const middleware of middlewares) {
            const { response, next } = await middleware(req, currentResponse);
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

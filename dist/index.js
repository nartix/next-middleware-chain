import { NextResponse } from 'next/server';
export function createMiddlewareChain(factories = [], index = 0) {
    if (factories[index]) {
        return factories[index]((req, event, res) => {
            return createMiddlewareChain(factories, index + 1)(req, event, res);
        });
    }
    return (_req, _event, _res) => {
        return _res ?? NextResponse.next();
    };
}

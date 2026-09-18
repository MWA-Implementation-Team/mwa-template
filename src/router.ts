import path from 'path';
import { readFile } from 'fs/promises';
import { IncomingMessage, ServerResponse } from 'http';
import { OutgoingHttpHeaders } from 'http2';
import { getContentTypeForFile, httpStatus } from '#src/http.js';
import { RegisteredPageId, RegisteredPageProps } from './client/pages.js';
import { ClientContextType, ClientContextWrapperInit } from './client/context.js';
import { Root } from './root.js';
import { renderToString } from 'preact-render-to-string';
import { isDevMode } from './state.js';

export type RequestContext = {
    url: URL;
    req: IncomingMessage;
    res: ServerResponse;
    cookies: Record<string, string>;
    clientCtxInit: ClientContextWrapperInit;
};

export type RequestHandler = (ctx: RequestContext) => Promise<void>;

export function createRouterHandler(handlers: RequestHandler[]): RequestHandler {
    return async (ctx) => {
        for (const handler of handlers) {
            await handler(ctx);
            if (ctx.res.writableEnded) {
                break;
            }
        }
    };
}

export function endpoint(filter: string, inner: RequestHandler): RequestHandler {
    const parts = filter.split(' ');
    if (parts.length > 3) throw new Error('invalid endpoint');

    const method = parts.length === 2 ? parts[0] : '';
    const pathname = parts[parts.length - 1];

    return async (ctx) => {
        if (method !== '' && ctx.req.method !== method) {
            return;
        }
        if (ctx.url.pathname !== pathname) {
            return;
        }
        await inner(ctx);
    };
}

export function staticFileHandler(dir: string, prefix: string = '/'): RequestHandler {
    return async ({ url, req, res }) => {
        if (req.method !== 'GET' || !url.pathname.startsWith(prefix)) {
            return;
        }

        if (!isDevMode && url.pathname.toLowerCase().endsWith('.js.map')) {
            return;
        }

        const relativePath = url.pathname.substring(prefix.length);
        const fullPath = path.join(dir, relativePath);

        let buf: Buffer;
        try {
            buf = await readFile(fullPath);
        } catch {
            return; // file doesn't exist
        }

        res.writeHead(httpStatus.ok, {
            'Content-Type': getContentTypeForFile(relativePath),
        });
        res.end(buf);
    };
}

export function writePage<P extends RegisteredPageId>(args: {
    ctx: RequestContext;
    pageId: P;
    props: RegisteredPageProps<P>;
    extraHeaders?: OutgoingHttpHeaders;
    status?: number;
}) {
    const root = Root({
        pageId: args.pageId,
        props: args.props,
        ctxInit: args.ctx.clientCtxInit,
    });

    args.ctx.res.writeHead(args.status ?? httpStatus.ok, {
        'Content-Type': 'text/html',
        ...(args.extraHeaders ?? {}),
    });
    args.ctx.res.end('<!DOCTYPE html>' + renderToString(root));
}

export function writeErrorPage(ctx: RequestContext, status: number) {
    writePage({
        ctx,
        pageId: 'error',
        props: { status },
        status,
    });
}

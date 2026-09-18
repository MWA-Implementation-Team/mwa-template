import { IncomingMessage, ServerResponse } from 'http';
import path from 'path';
import {
    getContentTypeForFile,
    httpStatus,
    RequestHandler,
    writeErrorPage,
    writePage,
} from './http.js';
import { readFile } from 'fs/promises';
import { publicNodeModules } from './root.js';
import { isDevMode } from './state.js';
import { httpGetLogin, httpPostLogin } from './pages/login.js';
import { httpDashboardGet, httpDashboardPost } from './pages/dashboard.js';
import { RegisteredPageId } from './client/pages.js';

// Every handler in this pipeline is ran for every http request,
// until one of them sends a response. Otherwise, 404 is returned.
const pipeline: RequestHandler = createPipeline([
    endpoint('GET /', staticPage('home')),

    endpoint('GET /login', httpGetLogin),
    endpoint('POST /login', httpPostLogin),

    endpoint('GET /dashboard', httpDashboardGet),
    endpoint('POST /dashboard', httpDashboardPost),

    publicNodeModules,
    staticFileHandler('static'),
    staticFileHandler('dist'),

    ...(isDevMode ? [staticFileHandler('src')] : []),
]);

function createPipeline(handlers: RequestHandler[]): RequestHandler {
    return async (ctx) => {
        for (const handler of handlers) {
            await handler(ctx);
            if (ctx.res.writableEnded) {
                break;
            }
        }
    };
}

function endpoint(endpoint: string, inner: RequestHandler): RequestHandler {
    const parts = endpoint.split(' ');
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

function staticPage(id: RegisteredPageId): RequestHandler {
    return async ({ res }) => {
        writePage({
            res,
            pageId: id,
            props: {},
        });
    };
}

function staticFileHandler(dir: string): RequestHandler {
    return async ({ url, req, res }) => {
        if (req.method !== 'GET') {
            return;
        }

        const relativePath = url.pathname.substring(1); // remove / in beginning
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

export async function handleRequest(req: IncomingMessage, res: ServerResponse) {
    const url = new URL(`http://${process.env.HOST ?? 'localhost'}${req.url}`);
    await pipeline({ url, req, res });

    if (!res.writableEnded) {
        writeErrorPage(res, httpStatus.notFound);
    }
}

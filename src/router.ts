import { IncomingMessage, ServerResponse } from 'http';
import path from 'path';
import {
    getContentTypeForFile,
    httpStatus,
    readCookies,
    readFormData,
    writeErrorPage,
    writePage,
} from './http.js';
import { readFile } from 'fs/promises';
import { publicNodeModules } from './root.js';
import { isDevMode } from './state.js';

export type HttpContext = {
    url: URL;
    req: IncomingMessage;
    res: ServerResponse;
};

export type RequestHandler = (ctx: HttpContext) => Promise<void>;

const homepageHandler: RequestHandler = async ({ res }) => {
    writePage({
        res,
        pageId: 'home',
        props: {},
    });
};

const httpGetLogin: RequestHandler = async ({ req, res }) => {
    if ('username' in readCookies(req)) {
        res.writeHead(httpStatus.seeOther, {
            location: '/dashboard',
        });
        res.end();
        return;
    }

    writePage({
        res,
        pageId: 'login',
        props: {},
    });
};

const httpPostLogin: RequestHandler = async ({ req, res }) => {
    const form = await readFormData(req);
    let username = form.get('username');
    if (typeof username !== 'string' || username.trim() === '') {
        writePage({
            res,
            pageId: 'login',
            props: {
                errorMessage: 'Invalid username',
            },
        });
        return;
    }

    res.writeHead(httpStatus.seeOther, {
        location: '/dashboard',
        'set-cookie': `username=${encodeURIComponent(username)};`,
    });
    res.end();
};

const httpDashboardGet: RequestHandler = async ({ req, res }) => {
    const cookies = readCookies(req);
    const username = cookies['username'];
    if (!username) {
        res.writeHead(httpStatus.seeOther, {
            location: '/login',
        });
        res.end();
        return;
    }

    writePage({
        res,
        pageId: 'dashboard',
        props: { username },
    });
};

const httpDashboardPost: RequestHandler = async ({ res }) => {
    res.writeHead(httpStatus.seeOther, {
        location: '/login',
        'set-cookie': `username=; Max-Age=0; Path=/`,
    });
    res.end();
};

const pipeline: RequestHandler = createPipeline([
    endpoint('GET /', homepageHandler),

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

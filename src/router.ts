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

export type HttpContext = {
    url: URL;
    req: IncomingMessage;
    res: ServerResponse;
};

export type RequestHandler = (ctx: HttpContext) => Promise<void>;

const homepageHandler: RequestHandler = async ({ url, res }) => {
    if (url.pathname === '/') {
        writePage({
            res,
            pageId: 'home',
            props: {},
        });
    }
};

const loginHandler: RequestHandler = async ({ url, req, res }) => {
    if (url.pathname !== '/login') {
        return;
    }

    switch (req.method) {
        case 'GET':
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
            return;
        case 'POST':
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

            return;
        default:
            writeErrorPage(res, httpStatus.methodNotAllowed);
            return;
    }
};

const dashboardHandler: RequestHandler = async ({ url, req, res }) => {
    if (url.pathname !== '/dashboard') {
        return;
    }

    switch (req.method) {
        case 'GET':
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
            return;
        case 'POST':
            res.writeHead(httpStatus.seeOther, {
                location: '/login',
                'set-cookie': `username=; Max-Age=0; Path=/`,
            });
            res.end();
            return;
        default:
            writeErrorPage(res, httpStatus.methodNotAllowed);
            return;
    }
};

const pipeline: RequestHandler = createPipeline([
    homepageHandler,
    loginHandler,
    dashboardHandler,

    publicNodeModules,
    staticFileHandler('static'),
    staticFileHandler('dist'),
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

function staticFileHandler(dir: string): RequestHandler {
    return async ({ url, req, res }) => {
        if (req.method !== 'GET') {
            return;
        }

        const relativePath = url.pathname.substring(1); // remove / in beginning
        const fullPath = path.join(dir, relativePath);

        let buf: Buffer;
        try {
            console.log(fullPath);
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

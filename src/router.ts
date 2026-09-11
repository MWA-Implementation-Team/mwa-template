import { IncomingMessage, ServerResponse } from 'http';
import path from 'path';
import { publicNodeModules } from './root.js';
import {
    httpStatus,
    readCookies,
    readFormData,
    serveFile,
    writeErrorPage,
    writePage,
} from './http.js';
import { isDevMode } from './state.js';

export async function handleRequest(req: IncomingMessage, res: ServerResponse) {
    const url = new URL(`http://${process.env.HOST ?? 'localhost'}${req.url}`);

    switch (url.pathname) {
        case '/': {
            writePage({
                res,
                pageId: 'home',
                props: {},
            });
            return;
        }
        case '/login': {
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
        }
        case '/dashboard': {
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
        }
    }

    if (req.method === 'GET') {
        const relativePath = url.pathname.substring(1); // remove / in beginning

        const possiblePaths: string[] = [
            path.join('static', relativePath),
            path.join('dist', relativePath),
        ];
        if (url.pathname in publicNodeModules) {
            possiblePaths.push(publicNodeModules[url.pathname]);
        }
        if (isDevMode) {
            possiblePaths.push(relativePath);
        }

        await serveFile(res, possiblePaths);
        return;
    }

    writeErrorPage(res, httpStatus.notFound);
}

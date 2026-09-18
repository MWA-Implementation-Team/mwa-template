import { readFile } from 'fs/promises';
import { IncomingMessage, ServerResponse } from 'http';
import { renderToString } from 'preact-render-to-string';
import { OutgoingHttpHeaders } from 'http2';
import { Root } from './root.js';
import { RegisteredPageId, RegisteredPageProps } from './client/pages.js';

// define statuses on demand
export const httpStatus = {
    ok: 200,
    seeOther: 303,
    notFound: 404,
    methodNotAllowed: 405,
    internalServerError: 500,
};

export async function serveFile(res: ServerResponse, possiblePaths: string[]) {
    let buf: Buffer | undefined;
    let finalPath = '';
    for (const p of possiblePaths) {
        try {
            buf = await readFile(p);
            finalPath = p;
            break;
        } catch {
            continue;
        }
    }

    if (!buf) {
        writeErrorPage(res, httpStatus.notFound);
        return;
    }

    let contentType = 'text/plain';
    if (finalPath.endsWith('.js')) {
        contentType = 'text/javascript';
    } else if (finalPath.endsWith('.css')) {
        contentType = 'text/css';
    } else if (finalPath.endsWith('.png')) {
        contentType = 'image/png';
    }

    res.writeHead(httpStatus.ok, {
        'Content-Type': contentType,
    });
    res.end(buf);
}

export function writePage<P extends RegisteredPageId>(args: {
    res: ServerResponse;
    pageId: P;
    props: RegisteredPageProps<P>;
    extraHeaders?: OutgoingHttpHeaders;
    status?: number;
}) {
    const root = Root({
        pageId: args.pageId,
        props: args.props,
    });

    args.res.writeHead(args.status ?? httpStatus.ok, {
        'Content-Type': 'text/html',
        ...(args.extraHeaders ?? {}),
    });
    args.res.end('<!DOCTYPE html>' + renderToString(root));
}

export function writeErrorPage(res: ServerResponse, status: number) {
    writePage({
        res,
        pageId: 'error',
        props: { status },
        status,
    });
}

export async function readFormData(req: IncomingMessage): Promise<FormData> {
    return new Promise((res, rej) => {
        const chunks: Buffer[] = [];
        req.on('data', (c: Buffer) => chunks.push(c));
        req.on('error', (err) => rej(err));
        req.on('close', () => rej(new Error('Request closed before form data was fully received')));
        req.on('end', () => {
            let params: URLSearchParams;
            try {
                params = new URLSearchParams(Buffer.concat(chunks).toString());
            } catch (err) {
                rej(err);
                return;
            }

            const formData = new FormData();
            for (const [key, value] of params) {
                formData.append(key, value);
            }
            res(formData);
        });
    });
}

export function readCookies(req: IncomingMessage): Record<string, string> {
    const cookie = req.headers.cookie;
    if (!cookie) {
        return {};
    }

    // Cookie: theme=dark; session=abc123; user=asdf

    const cookies: Record<string, string> = {};
    for (const pair of cookie.split(';')) {
        const idx = pair.indexOf('=');
        if (idx === -1) continue;

        const [name, value] = pair.split('=');
        cookies[name.trim()] = decodeURIComponent(value.trim());
    }
    return cookies;
}

// Generic http related utilities.

import { IncomingMessage } from 'http';

// define statuses on demand
export const httpStatus = {
    ok: 200,
    seeOther: 303,
    notFound: 404,
    internalServerError: 500,
};

export function getContentTypeForFile(name: string): string {
    let contentType = 'text/plain';
    if (name.endsWith('.js')) {
        contentType = 'text/javascript';
    } else if (name.endsWith('.css')) {
        contentType = 'text/css';
    } else if (name.endsWith('.png')) {
        contentType = 'image/png';
    }
    return contentType;
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

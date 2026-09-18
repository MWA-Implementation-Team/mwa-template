import { cookieUsername } from '#src/constants.js';
import { httpStatus, readCookies, readFormData } from '#src/http.js';
import { RequestHandler, writePage } from '#src/router.js';

export const httpGetLogin: RequestHandler = async (ctx) => {
    const { req, res } = ctx;

    if (cookieUsername in readCookies(req)) {
        res.writeHead(httpStatus.seeOther, {
            location: '/dashboard',
        });
        res.end();
        return;
    }

    writePage({
        ctx,
        pageId: 'login',
        props: {},
    });
};

export const httpPostLogin: RequestHandler = async (ctx) => {
    const { req, res } = ctx;

    const form = await readFormData(req);
    let username = form.get('username');
    if (typeof username !== 'string' || username.trim() === '') {
        writePage({
            ctx,
            pageId: 'login',
            props: {
                errorMessage: 'Invalid username',
            },
        });
        return;
    }

    res.writeHead(httpStatus.seeOther, {
        location: '/dashboard',
        'set-cookie': `${cookieUsername}=${encodeURIComponent(username)};`,
    });
    res.end();
};

import { cookieUsername } from '#src/client/constants.js';
import { httpStatus, readFormData } from '#src/http.js';
import { RequestHandler, writePage } from '#src/router.js';

export const httpGetLogin: RequestHandler = async (ctx) => {
    const { res, cookies } = ctx;

    if (cookieUsername in cookies) {
        res.writeHead(httpStatus.seeOther, {
            location: '/app',
        });
        res.end();
        return;
    }

    writePage({
        ctx,
        id: 'login',
        props: {},
    });
};

export const httpPostLogin: RequestHandler = async (ctx) => {
    const { url, req, res } = ctx;

    const form = await readFormData(req);
    let username = form.get('username');
    if (typeof username !== 'string' || username.trim() === '') {
        writePage({
            ctx,
            id: 'login',
            props: {
                errorMessage: 'Invalid username',
            },
        });
        return;
    }

    const allowedGotos = new Set<string>(['/app', '/app/casino']);

    let goto = url.searchParams.get('goto') ?? null;
    if (goto && !allowedGotos.has(goto)) {
        goto = null;
    }
    goto = goto ?? '/app';

    res.writeHead(httpStatus.seeOther, {
        location: goto,
        'set-cookie': `${cookieUsername}=${encodeURIComponent(username)};`,
    });
    res.end();
};

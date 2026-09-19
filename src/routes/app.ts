import { cookieUsername } from '#src/client/constants.js';
import { httpStatus } from '#src/http.js';
import { RequestContext, RequestHandler, writePage } from '#src/router.js';

export const httpAppGet: RequestHandler = async (ctx) => {
    if (!ensureLoggedIn(ctx)) return;

    writePage({
        ctx,
        id: 'appHome',
        props: {},
    });
};

export const httpAppPost: RequestHandler = async ({ res }) => {
    res.writeHead(httpStatus.seeOther, {
        location: '/login',
        'set-cookie': `${cookieUsername}=; Max-Age=0; Path=/`,
    });
    res.end();
};

export const httpAppCasinoGet: RequestHandler = async (ctx) => {
    if (!ensureLoggedIn(ctx)) return;

    writePage({
        ctx,
        id: 'casino',
        props: {},
    });
};

function ensureLoggedIn({ url, res, cookies }: RequestContext): string | null {
    const username = cookies[cookieUsername];
    if (!username) {
        res.writeHead(httpStatus.seeOther, {
            location: `/login?goto=${encodeURIComponent(url.pathname)}`,
        });
        res.end();
        return null;
    }
    return username;
}

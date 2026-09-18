import { cookieUsername } from '#src/client/constants.js';
import { httpStatus } from '#src/http.js';
import { RequestContext, RequestHandler, writePage } from '#src/router.js';

export const httpDashboardGet: RequestHandler = async (ctx) => {
    const username = ensureLoggedIn(ctx);
    if (!username) return;

    writePage({
        ctx,
        pageId: 'dashboard',
        props: { username },
    });
};

export const httpDashboardPost: RequestHandler = async ({ res }) => {
    res.writeHead(httpStatus.seeOther, {
        location: '/login',
        'set-cookie': `${cookieUsername}=; Max-Age=0; Path=/`,
    });
    res.end();
};

export const httpDashboardCasinoGet: RequestHandler = async (ctx) => {
    if (!ensureLoggedIn(ctx)) return;

    writePage({
        ctx,
        pageId: 'casino',
        props: {},
    });
};

function ensureLoggedIn({ res, cookies }: RequestContext): string | null {
    const username = cookies[cookieUsername];
    if (!username) {
        res.writeHead(httpStatus.seeOther, {
            location: '/login',
        });
        res.end();
        return null;
    }
    return username;
}

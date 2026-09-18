import { cookieUsername } from '#src/client/constants.js';
import { httpStatus, readCookies } from '#src/http.js';
import { RequestHandler, writePage } from '#src/router.js';

export const httpDashboardGet: RequestHandler = async (ctx) => {
    const { req, res } = ctx;

    const cookies = readCookies(req);
    const username = cookies[cookieUsername];
    if (!username) {
        res.writeHead(httpStatus.seeOther, {
            location: '/login',
        });
        res.end();
        return;
    }

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

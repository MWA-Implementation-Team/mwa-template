import { httpStatus, readCookies, writePage } from '#src/http.js';
import { RequestHandler } from '#src/router.js';

export const httpDashboardGet: RequestHandler = async ({ req, res }) => {
    const cookies = readCookies(req);
    const username = cookies['mwa-username'];
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

export const httpDashboardPost: RequestHandler = async ({ res }) => {
    res.writeHead(httpStatus.seeOther, {
        location: '/login',
        'set-cookie': `mwa-username=; Max-Age=0; Path=/`,
    });
    res.end();
};

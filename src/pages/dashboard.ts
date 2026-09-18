import { RequestHandler, httpStatus, readCookies, writePage } from "../http.js";

export const httpDashboardGet: RequestHandler = async ({ req, res }) => {
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
};

export const httpDashboardPost: RequestHandler = async ({ res }) => {
    res.writeHead(httpStatus.seeOther, {
        location: '/login',
        'set-cookie': `username=; Max-Age=0; Path=/`,
    });
    res.end();
};


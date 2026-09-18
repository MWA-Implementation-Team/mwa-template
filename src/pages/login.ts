import { RequestHandler, httpStatus, readCookies, readFormData, writePage } from "../http.js";

export const httpGetLogin: RequestHandler = async ({ req, res }) => {
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
};

export const httpPostLogin: RequestHandler = async ({ req, res }) => {
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
};


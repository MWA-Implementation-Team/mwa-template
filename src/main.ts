import { createServer } from 'http';
import { httpStatus, readCookies } from '#src/http.js';
import { isDevMode } from '#src/state.js';
import { createRouterHandler, endpoint, RequestContext, staticFileHandler, writeErrorPage } from '#src/router.js';
import { publicNodeModules } from '#src/root.js';
import { httpGetLogin, httpPostLogin } from '#src/pages/login.js';
import { httpDashboardGet, httpDashboardPost } from '#src/pages/dashboard.js';
import { httpCasinoGet } from '#src/pages/casino.js';
import { httpHomeGet } from '#src/pages/home.js';
import { ClientContext } from './client/context.js';
import { cookieThemeOverride, cookieUsername } from './client/constants.js';

// Every handler in this array is ran for every http request,
// until one of them sends a response. Otherwise, 404 is returned.
const rootHandler = createRouterHandler([
    endpoint('GET /', httpHomeGet),

    endpoint('GET /login', httpGetLogin),
    endpoint('POST /login', httpPostLogin),

    endpoint('GET /dashboard', httpDashboardGet),
    endpoint('POST /dashboard', httpDashboardPost),

    endpoint('GET /casino', httpCasinoGet),

    publicNodeModules,
    staticFileHandler('static'),
    staticFileHandler('dist'),

    ...(isDevMode ? [staticFileHandler('src')] : []),
]);

const server = createServer(async (req, res) => {
    const url = new URL(`http://${process.env.HOST ?? 'localhost'}${req.url}`);
    const ctx: RequestContext = {
        url,
        req,
        res,
        cookies: {},
        clientContext: {
            themeOverride: null,
            username: null,
        },
    };

    try {
        ctx.cookies = readCookies(req);
        ctx.clientContext = {
            themeOverride: ctx.cookies[cookieThemeOverride] ?? null,
            username: ctx.cookies[cookieUsername] ?? null,
        };

        await rootHandler(ctx);

        if (!res.writableEnded) {
            writeErrorPage(ctx, httpStatus.notFound);
        }
    } catch (err) {
        console.error('Error during request', err);
        writeErrorPage(ctx, httpStatus.internalServerError);
    }
});

server.listen(3000, () => {
    let msg = 'Server running at http://localhost:3000/';
    if (isDevMode) {
        msg += ' (dev mode)';
    }
    console.log(msg);
});

import { createServer } from 'http';
import { httpStatus, readCookies } from '#src/http.js';
import { isDevMode } from '#src/state.js';
import {
    createRouterHandler,
    endpoint,
    RequestContext,
    staticFileHandler,
    writeErrorPage,
} from '#src/router.js';
import { publicNodeModules } from '#src/root.js';
import { httpGetLogin, httpPostLogin } from '#src/routes/login.js';
import { httpAppCasinoGet, httpAppGet, httpAppPost } from '#src/routes/app.js';
import { httpHomeGet } from '#src/routes/home.js';
import { cookieLanguage, cookieUsername } from '#src/client/constants.js';
import { defaultLanguage, LanguageCode } from './client/language.js';

// Every handler in this array is ran for every http request,
// until one of them sends a response. Otherwise, 404 is returned.
const rootHandler = createRouterHandler([
    endpoint('GET /', httpHomeGet),

    endpoint('GET /login', httpGetLogin),
    endpoint('POST /login', httpPostLogin),

    endpoint('GET /app', httpAppGet),
    endpoint('POST /app', httpAppPost),
    endpoint('GET /app/casino', httpAppCasinoGet),

    publicNodeModules,
    staticFileHandler('static'),
    staticFileHandler('dist/client', '/client'),

    ...(isDevMode ? [staticFileHandler('src', '/src')] : []),
]);

const server = createServer(async (req, res) => {
    const url = new URL(`http://${process.env.HOST ?? 'localhost'}${req.url}`);
    const ctx: RequestContext = {
        url,
        req,
        res,
        cookies: {},
        clientCtxInit: {
            lang: defaultLanguage,
            username: null,
        },
    };

    try {
        ctx.cookies = readCookies(req);
        ctx.clientCtxInit = {
            lang: (ctx.cookies[cookieLanguage] as LanguageCode) ?? defaultLanguage, // not validated
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

process.on('SIGINT', () => server.close());

server.listen(3000, () => {
    let msg = 'Server running at http://localhost:3000/';
    if (isDevMode) {
        msg += ' (dev mode)';
    }
    console.log(msg);
});

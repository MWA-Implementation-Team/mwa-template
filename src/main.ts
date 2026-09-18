import { createServer } from 'http';
import { httpStatus, writeErrorPage } from './http.js';
import { isDevMode } from './state.js';
import { createRouterHandler, endpoint, staticFileHandler } from './router.js';
import { publicNodeModules } from './root.js';
import { httpGetLogin, httpPostLogin } from './pages/login.js';
import { httpDashboardGet, httpDashboardPost } from './pages/dashboard.js';
import { httpCasinoGet } from './pages/casino.js';
import { httpHomeGet } from './pages/home.js';

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
    try {
        const url = new URL(`http://${process.env.HOST ?? 'localhost'}${req.url}`);
        await rootHandler({ url, req, res });

        if (!res.writableEnded) {
            writeErrorPage(res, httpStatus.notFound);
        }
    } catch (err) {
        console.error('Error during request', err);
        writeErrorPage(res, httpStatus.internalServerError);
    }
});

server.listen(3000, () => {
    let msg = 'Server running at http://localhost:3000/';
    if (isDevMode) {
        msg += ' (dev mode)';
    }
    console.log(msg);
});

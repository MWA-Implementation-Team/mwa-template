import { isDevMode } from '#src/state.js';
import { registerNodeModulesRoutes, writeErrorPage } from '#src/pages.js';
import { registerLoginRoutes } from '#src/routes/login.js';
import { registerAppRoutes } from '#src/routes/app.js';
import { registerHomeRoutes } from '#src/routes/home.js';
import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';

const app = new Hono();

registerHomeRoutes(app);
registerLoginRoutes(app);
registerAppRoutes(app);

registerNodeModulesRoutes(app);

if (isDevMode) {
    app.use('/*', serveStatic({ root: './' }));
} else {
    app.use('/client/*', async (c, next) => {
        if (c.req.path.endsWith('.js.map')) {
            // don't send sourcemaps in production
            return c.notFound();
        }
        await next();
    });
}

app.use('/*', serveStatic({ root: './static' }));
app.use('/client/*', serveStatic({ root: './dist' }));

app.notFound(async (ctx) => {
    return writeErrorPage(ctx, 404);
});

app.onError(async (error, ctx) => {
    console.error('Error during request', error);
    return writeErrorPage(ctx, 500);
});

const server = serve(
    {
        port: 3000,
        ...app,
    },
    (info) => {
        let msg = `Server running at http://localhost:${info.port}`;
        if (isDevMode) {
            msg += ' (dev mode)';
        }
        console.log(msg);
    },
);
process.on('SIGINT', () => server.close());

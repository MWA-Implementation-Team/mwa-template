import { readFile } from 'fs/promises';
import { Page, RegisteredPageId, RegisteredPageProps, registeredPages } from '#src/client/pages.js';
import { isDevMode } from '#src/state.js';
import { getContentTypeForFile, httpStatus } from '#src/http.js';
import { RequestHandler } from '#src/router.js';

export const publicNodeModules: RequestHandler = async ({ url, res }) => {
    const map: Record<string, string> = {
        '/preact.module.js': 'node_modules/preact/dist/preact.module.js',
        '/preact-hooks.module.js': 'node_modules/preact/hooks/dist/hooks.module.js',
        '/preact-jsx-runtime.module.js':
            'node_modules/preact/jsx-runtime/dist/jsxRuntime.module.js',
    };

    if (url.pathname in map) {
        const buf = await readFile(map[url.pathname]);
        res.writeHead(httpStatus.ok, {
            'Content-Type': getContentTypeForFile(url.pathname),
        });
        res.end(buf);
    }
};

type RootProps<P extends RegisteredPageId> = {
    pageId: P;
    props: RegisteredPageProps<P>;
};

export function Root<P extends RegisteredPageId>({ pageId, props }: RootProps<P>) {
    // Instead of using a bundler, use the browser's native js module support for simplicity
    const imports = {
        imports: {
            '#src/': '/',
            preact: '/preact.module.js',
            'preact/hooks': '/preact-hooks.module.js',
            'preact/jsx-runtime': '/preact-jsx-runtime.module.js',
        },
    };

    const ssrHydrateScript = `
    import { h, hydrate } from 'preact';
    import { registeredPages } from '#src/client/pages.js';

    const Component = registeredPages[${JSON.stringify(pageId)}].Component;
    hydrate(h(Component, ${JSON.stringify(props)}), document.getElementById('app'));
    `;

    const page = registeredPages[pageId] as Page<RegisteredPageProps<P>>;

    let title = '';
    if (typeof page.title === 'string') {
        title = page.title;
    } else {
        title = page.title(props);
    }

    return (
        <html>
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>{title}</title>
                <script
                    type="importmap"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(imports) }}
                />
                <script type="module" dangerouslySetInnerHTML={{ __html: ssrHydrateScript }} />
                <link rel="stylesheet" href="/oat.css" />
                <link rel="stylesheet" href="/style.css" />
                <script src="/oat.js" defer />
                {isDevMode && <script src="/reload.js" defer />}
            </head>
            <body>
                <div id="app">
                    <page.Component {...(props as any)} />
                </div>
            </body>
        </html>
    );
}

import { readFile } from 'fs/promises';
import { Page, RegisteredPageId, RegisteredPageProps, registeredPages } from '#src/client/pages.js';
import { isDevMode } from '#src/state.js';
import { getContentTypeForFile, httpStatus } from '#src/http.js';
import { RequestHandler } from '#src/router.js';
import { ClientContextWrapper, ClientContextWrapperInit } from '#src/client/context.js';

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
    pageId: RegisteredPageId;
    pageProps: RegisteredPageProps<P>;
    ctxInit: ClientContextWrapperInit;
    themeOverride: string | null;
};

export function Root<P extends RegisteredPageId>({
    pageId,
    pageProps,
    ctxInit,
    themeOverride,
}: RootProps<P>) {
    // Instead of using a bundler, use the browser's native js module support for simplicity
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script/type/importmap
    const importmap = {
        imports: {
            '#src/': '/',
            preact: '/preact.module.js',
            'preact/hooks': '/preact-hooks.module.js',
            'preact/jsx-runtime': '/preact-jsx-runtime.module.js',
        },
    };

    const ssrHydrateScript = `
    import { createElement, hydrate } from 'preact';
    import { registeredPages } from '#src/client/pages.js';
    import { ClientContextWrapper } from '#src/client/context.js';

    const Component = registeredPages[${JSON.stringify(pageId)}].Component;
    const content = createElement(Component, ${JSON.stringify(pageProps)});
    const wrapped = createElement(ClientContextWrapper, {
        pageId: ${JSON.stringify(pageId)},
        pageProps: ${JSON.stringify(pageProps)},
        init: ${JSON.stringify(ctxInit)},
        content
    });
    hydrate(wrapped, document.getElementById('app'));
    `;

    const page = registeredPages[pageId] as Page<RegisteredPageProps<P>>;

    const title = page.title(ctxInit.lang, pageProps);

    let bodyStyle = undefined;
    if (themeOverride) {
        bodyStyle = `color-scheme: ${themeOverride === 'dark' ? 'dark' : 'light'};`;
    }

    return (
        <html>
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>{title}</title>
                <script
                    type="importmap"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(importmap) }}
                />
                <script type="module" dangerouslySetInnerHTML={{ __html: ssrHydrateScript }} />
                <link rel="stylesheet" href="/oat.css" />
                <link rel="stylesheet" href="/style.css" />
                <script src="/oat.js" defer />
                {isDevMode && <script src="/reload.js" defer />}
            </head>
            <body style={bodyStyle}>
                <div id="app">
                    <ClientContextWrapper
                        pageId={pageId}
                        pageProps={pageProps}
                        init={ctxInit}
                        content={<page.Component {...(pageProps as any)} />}
                    />
                </div>
            </body>
        </html>
    );
}

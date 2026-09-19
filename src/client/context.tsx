import { createContext } from 'preact';
import { ReactNode } from 'preact/compat';
import { useState, useMemo, useEffect } from 'preact/hooks';
import { defaultLanguage, LanguageCode } from './language.js';
import { Page, RegisteredPageId, RegisteredPageProps, registeredPages } from './pages.js';

export type ClientContextType = {
    lang: LanguageCode;
    updateLang: (lang: LanguageCode) => void;

    username: string | null; // username if logged in, else null
};

export const ClientContext = createContext<ClientContextType>({
    lang: defaultLanguage,
    updateLang: () => {},
    username: null,
});

// ---

export type ClientContextWrapperInit = {
    lang: LanguageCode;
    username: string | null;
};

export type ClientContextWrapperProps<P extends RegisteredPageId> = {
    pageId: P;
    pageProps: RegisteredPageProps<P>;

    init: ClientContextWrapperInit;
    content: ReactNode;
};

export function ClientContextWrapper<P extends RegisteredPageId>({
    pageId,
    pageProps,
    init,
    content,
}: ClientContextWrapperProps<P>) {
    let [lang, setLang] = useState(init.lang);

    useEffect(() => {
        const page = registeredPages[pageId] as Page<RegisteredPageProps<P>>;
        const title = page.title(lang, pageProps);
        document.title = title;
    }, [init, lang]);

    const value: ClientContextType = useMemo(
        () => ({
            lang,
            updateLang: (newLang) => setLang(newLang),

            username: init.username,
        }),
        [lang],
    );

    return <ClientContext value={value}>{content}</ClientContext>;
}

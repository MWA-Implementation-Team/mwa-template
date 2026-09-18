import { createContext } from 'preact';
import { ReactNode } from 'preact/compat';
import { useState, useMemo } from 'preact/hooks';
import { defaultLanguage, LanguageCode } from './language.js';

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

export type ClientContextWrapperProps = {
    init: ClientContextWrapperInit;
    content: ReactNode;
};

export function ClientContextWrapper({ init, content }: ClientContextWrapperProps) {
    let [lang, setLang] = useState(init.lang);

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

import { useContext } from 'preact/hooks';
import { LanguageCode, languages } from '#src/client/language.js';
import { ClientContext } from '#src/client/context.js';
import { cookieLanguage } from '#src/client/constants.js';

export default function LanguageToggle() {
    const { lang, updateLang } = useContext(ClientContext);

    function handleChange(newLang: string) {
        document.cookie = `${cookieLanguage}=${newLang}`;
        updateLang(newLang as LanguageCode);
    }

    return (
        <select onChange={(e) => handleChange(e.currentTarget.value)}>
            {Object.entries(languages).map(([iterCode, iterLang]) => (
                <option key={iterCode} value={iterCode} selected={iterCode === lang}>
                    {iterLang.displayName}
                </option>
            ))}
        </select>
    );
}

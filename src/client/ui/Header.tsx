import { useContext } from 'preact/hooks';
import { ClientContext } from '../context.js';
import ThemeToggle from './ThemeToggle.js';
import { t } from '../language.js';
import LanguageToggle from './LanguageToggle.js';

export default function Header() {
    const { lang, username } = useContext(ClientContext);

    return (
        <nav>
            <img src="/Logotipas.png" style={'width:200px;'} />
            <ul>
                <li>
                    <a href="/">{t(lang, 'headerHome')}</a>
                </li>
                <li>
                    {!username ? (
                        <a href="/login">{t(lang, 'headerLogin')}</a>
                    ) : (
                        <a href="/app">
                            {t(lang, 'headerApp')} ({username})
                        </a>
                    )}
                </li>
            </ul>
            <ThemeToggle />
            <LanguageToggle />
        </nav>
    );
}

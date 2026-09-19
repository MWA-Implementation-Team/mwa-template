import Header from '#src/client/ui/Header.js';
import { Page } from '#src/client/pages.js';
import { useContext } from 'preact/hooks';
import { ClientContext } from '#src/client/context.js';
import { t } from '#src/client/language.js';

type AppHomePageProps = {};

export const appHomePage: Page<AppHomePageProps> = {
    Component: AppHomePage,
    title: (lang) => t(lang, 'titleApp'),
};

function AppHomePage({}: AppHomePageProps) {
    const { lang, username } = useContext(ClientContext);

    return (
        <>
            <Header />

            <h1>{t(lang, 'appWelcome', { name: username! })}</h1>
            <form method="POST">
                <button type="submit">Logout</button>
            </form>

            <a href="/app/casino">
                <button>GO GAMBLING</button>
            </a>
        </>
    );
}

import Header from '#src/client/ui/Header.js';
import { Page } from '#src/client/pages.js';
import { useContext } from 'preact/hooks';
import { ClientContext } from '#src/client/context.js';
import { t } from '#src/client/language.js';

type DashboardPageProps = {};

export const dashboardPage: Page<DashboardPageProps> = {
    Component: DashboardPage,
    title: (lang) => t(lang, 'titleDashboard'),
};

function DashboardPage({}: DashboardPageProps) {
    const { lang, username } = useContext(ClientContext);

    return (
        <>
            <Header />

            <h1>{t(lang, 'dashboardWelcome', { name: username! })}</h1>
            <form method="POST">
                <button type="submit">Logout</button>
            </form>

            <a href="/dashboard/casino">
                <button>GO GAMBLING</button>
            </a>
        </>
    );
}

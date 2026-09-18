import Header from '#src/client/ui/Header.js';
import { Page } from '#src/client/pages.js';
import { useContext } from 'preact/hooks';
import { ClientContext } from '#src/client/context.js';

type DashboardPageProps = {};

export const dashboardPage: Page<DashboardPageProps> = {
    Component: DashboardPage,
    title: 'MWA | Dashboard',
};

function DashboardPage({}: DashboardPageProps) {
    const { username } = useContext(ClientContext);

    return (
        <>
            <Header />

            <h1>Welcome back, {username}</h1>
            <form method="POST">
                <button type="submit">Logout</button>
            </form>

            <a href="/dashboard/casino">
                <button>GO GAMBLING</button>
            </a>
        </>
    );
}

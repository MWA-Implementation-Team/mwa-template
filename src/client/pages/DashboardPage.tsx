import Header from '../ui/Header.js';
import { Page } from '../pages.js';

type DashboardPageProps = {
    username: string;
};

export const dashboardPage: Page<DashboardPageProps> = {
    Component: DashboardPage,
    title: 'MWA | Dashboard',
};

function DashboardPage({ username }: DashboardPageProps) {
    return (
        <>
            <Header />

            <h1>Welcome back, {username}</h1>
            <form method="POST">
                <button type="submit">Logout</button>
            </form>
        </>
    );
}

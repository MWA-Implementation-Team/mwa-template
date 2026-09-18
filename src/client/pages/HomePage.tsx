import Header from '../ui/Header.js';
import { Page } from '../pages.js';

type HomePageProps = {};

export const homePage: Page<HomePageProps> = {
    Component: HomePage,
    title: 'MWA | Home',
};

function HomePage({}: HomePageProps) {
    return (
        <>
            <Header />

            <h1>MWA Event</h1>
        </>
    );
}

import Header from '../ui/Header.js';
import { Page } from '../pages.js';

type HomePageProps = {
    visitCount: number,
};

export const homePage: Page<HomePageProps> = {
    Component: HomePage,
    title: 'MWA | Home',
};

function HomePage({ visitCount }: HomePageProps) {
    return (
        <>
            <Header />

            <h1>MWA Event</h1>
            <p>Visit count: {visitCount}</p>
        </>
    );
}

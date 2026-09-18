import Header from '../ui/Header.js';
import { Page } from '../pages.js';
import RollComponent from '../ui/Roll.js';

type HomePageProps = {};

export const homePage: Page<HomePageProps> = {
    Component: HomePage,
    title: 'MWA | Home',
};

function HomePage({}: HomePageProps) {
    return (
        <>
            <Header />

            <RollComponent />
        </>
    );
}

import Header from '../ui/Header.js';
import { Page } from '../pages.js';
import RollComponent from '../ui/Roll.js';

type CasinoPageProps = {};

export const casinoPage: Page<CasinoPageProps> = {
    Component: CasinoPage,
    title: 'MWA | Casino',
};

function CasinoPage({}: CasinoPageProps) {
    return (
        <>
            <Header />

            <RollComponent />
        </>
    );
}

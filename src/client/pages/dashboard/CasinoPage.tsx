import { Page } from '#src/client/pages.js';
import RollComponent from '#src/client/ui/Roll.js';

type CasinoPageProps = {};

export const casinoPage: Page<CasinoPageProps> = {
    Component: CasinoPage,
    title: 'MWA | Casino',
};

function CasinoPage({}: CasinoPageProps) {
    return (
        <>
            <RollComponent />
        </>
    );
}

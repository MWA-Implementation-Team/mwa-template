import { t } from '#src/client/language.js';
import { Page } from '#src/client/pages.js';
import RollComponent from '#src/client/ui/Roll.js';

type CasinoPageProps = {};

export const casinoPage: Page<CasinoPageProps> = {
    Component: CasinoPage,
    title: (lang) => t(lang, 'titleCasino'),
};

function CasinoPage({}: CasinoPageProps) {
    return (
        <>
            <RollComponent />
        </>
    );
}

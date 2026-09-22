import { t } from '#src/client/language.js';
import { Page } from '#src/client/pages.js';

type CasinoPageProps = {};

export const casinoPage: Page<CasinoPageProps> = {
    Component: CasinoPage,
    title: (lang) => t(lang, 'titleCasino'),
};

function CasinoPage({}: CasinoPageProps) {
    return (
        <>
            <h1>TODO</h1>
        </>
    );
}

import { Page } from '#src/client/pages.js';
import { t } from '../language.js';

type ErrorPageProps = {
    status: number;
};

export const errorPage: Page<ErrorPageProps> = {
    Component: ErrorPage,
    title: (lang, { status }) => t(lang, 'titleError', { status: `${status}` }),
};

function ErrorPage({ status }: ErrorPageProps) {
    if (status === 404) {
        return <h1>404 Not Found</h1>;
    }

    return <h1>Error: {status}</h1>;
}

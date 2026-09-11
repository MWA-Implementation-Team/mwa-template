import { Page } from '../pages.js';

type ErrorPageProps = {
    status: number;
};

export const errorPage: Page<ErrorPageProps> = {
    Component: ErrorPage,
    title: ({ status }) => `MWA | ${status}`,
};

function ErrorPage({ status }: ErrorPageProps) {
    if (status === 404) {
        return <h1>404 Not Found</h1>;
    }

    return <h1>Error: {status}</h1>;
}

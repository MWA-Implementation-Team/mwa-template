import { ComponentProps, ComponentType } from 'preact/compat';
import { dashboardPage } from '#src/client/pages/DashboardPage.js';
import { errorPage } from '#src/client/pages/ErrorPage.js';
import { homePage } from '#src/client/pages/HomePage.js';
import { loginPage } from '#src/client/pages/LoginPage.js';
import { casinoPage } from '#src/client/pages/CasinoPage.js';

export const registeredPages = {
    // These keys are used in the writePage function
    home: homePage,
    login: loginPage,
    dashboard: dashboardPage,
    casino: casinoPage,
    error: errorPage,
} satisfies Record<string, Page<any>>;

export type Page<P> = {
    Component: ComponentType<P>;
    title: string | ((props: P) => string);
};

export type RegisteredPageId = keyof typeof registeredPages;

export type RegisteredPageProps<P extends RegisteredPageId> = ComponentProps<
    (typeof registeredPages)[P]['Component']
>;

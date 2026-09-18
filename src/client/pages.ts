import { ComponentProps, ComponentType } from 'preact/compat';
import { dashboardPage } from './pages/DashboardPage.js';
import { errorPage } from './pages/ErrorPage.js';
import { homePage } from './pages/HomePage.js';
import { loginPage } from './pages/LoginPage.js';

export type Page<P> = {
    Component: ComponentType<P>;
    title: string | ((props: P) => string);
};

export const registeredPages = {
    home: homePage,
    login: loginPage,
    dashboard: dashboardPage,
    error: errorPage,
} satisfies Record<string, Page<any>>;

export type RegisteredPageId = keyof typeof registeredPages;

export type RegisteredPageProps<P extends RegisteredPageId> = ComponentProps<
    (typeof registeredPages)[P]['Component']
>;

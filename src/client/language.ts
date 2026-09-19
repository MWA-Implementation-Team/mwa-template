export type LanguageCode = 'en' | 'lt';

export const defaultLanguage: LanguageCode = 'en';

export type Language = {
    displayName: string;

    titleHome: string;
    titleLogin: string;
    titleDashboard: string;
    titleCasino: string;
    titleError: string;

    headerHome: string;
    headerLogin: string;
    headerDashboard: string;

    dashboardWelcome: string;
};

export const languages: Record<LanguageCode, Language> = {
    en: {
        displayName: 'English',

        titleHome: 'MWA | Home',
        titleLogin: 'MWA | Login',
        titleDashboard: 'MWA | Dashboard',
        titleCasino: 'MWA | Casino',
        titleError: 'MWA | {status}',

        headerHome: 'Home',
        headerLogin: 'Login',
        headerDashboard: 'Dashboard',

        dashboardWelcome: 'Welcome back, {name}',
    },
    lt: {
        displayName: 'Lietuvių',

        titleHome: 'MWA | Pradžia',
        titleLogin: 'MWA | Prisijungimas',
        titleDashboard: 'MWA | Dešbordas',
        titleCasino: 'MWA | Kazino',
        titleError: 'MWA | {status}',

        headerHome: 'Pradžia',
        headerLogin: 'Prisijungimas',
        headerDashboard: 'Dešbordas',

        dashboardWelcome: 'Sveiki sugrįžę, {name}',
    },
};

export function t(lang: LanguageCode, key: keyof Language, params: Record<string, string> = {}) {
    let value = languages[lang]?.[key] || languages[defaultLanguage][key];
    for (const key in params) {
        value = value.replaceAll(`{${key}}`, params[key]);
    }
    return value;
}

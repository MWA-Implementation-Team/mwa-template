export type LanguageCode = 'en' | 'lt';

export const defaultLanguage: LanguageCode = 'en';

export type Language = {
    displayName: string;

    headerHome: string;
    headerLogin: string;
    headerDashboard: string;

    dashboardWelcome: string;
};

export const languages: Record<LanguageCode, Language> = {
    en: {
        displayName: 'English',

        headerHome: 'Home',
        headerLogin: 'Login',
        headerDashboard: 'Dashboard',

        dashboardWelcome: 'Welcome back, {name}',
    },
    lt: {
        displayName: 'Lietuvių',

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

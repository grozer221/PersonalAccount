const TOKEN_KEY = 'TOKEN_KEY';
const LOGIN_AS_USER_MODE_MAIN_TOKEN = 'LOGIN_AS_USER_MODE_MAIN_TOKEN';

export const localStorageUtils = {
    setToken: (token: string): void => {
        localStorage.setItem(TOKEN_KEY, token);
    },

    removeToken: (): void => {
        localStorage.removeItem(TOKEN_KEY);
    },

    getToken: (): string | null => {
        return localStorage.getItem(TOKEN_KEY) || localStorage.getItem(LOGIN_AS_USER_MODE_MAIN_TOKEN);
    },

    isEnabledLoginAsUserMode: (): boolean => {
        return !!localStorage.getItem(LOGIN_AS_USER_MODE_MAIN_TOKEN);
    },

    enableLoginAsUserMode: (newToken: string): void => {
        const mainToken = localStorage.getItem(TOKEN_KEY);
        if (!mainToken)
            throw new Error('You are not authorized');
        localStorage.setItem(LOGIN_AS_USER_MODE_MAIN_TOKEN, mainToken);
        localStorage.setItem(TOKEN_KEY, newToken);
    },

    disableLoginAsUserMode: (): void => {
        const mainToken = localStorage.getItem(LOGIN_AS_USER_MODE_MAIN_TOKEN);
        if (!mainToken)
            throw new Error('Login As User Mode already disabled');
        localStorage.setItem(TOKEN_KEY, mainToken);
        localStorage.removeItem(LOGIN_AS_USER_MODE_MAIN_TOKEN);
    },
};

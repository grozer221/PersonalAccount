const TOKEN_KEY = 'TOKEN_KEY';
const LOGIN_AS_USER_MODE_TOKEN = 'LOGIN_AS_USER_MODE_TOKEN';

export const localStorageUtils = {
    setToken: (token: string): void => {
        if (localStorage.getItem(LOGIN_AS_USER_MODE_TOKEN))
            localStorage.setItem(LOGIN_AS_USER_MODE_TOKEN, token);
        else
            localStorage.setItem(TOKEN_KEY, token);
    },

    removeToken: (): void => {
        if (localStorage.getItem(LOGIN_AS_USER_MODE_TOKEN))
            localStorage.removeItem(LOGIN_AS_USER_MODE_TOKEN);
        else
            localStorage.removeItem(TOKEN_KEY);
    },

    getToken: (): string | null => {
        return localStorage.getItem(LOGIN_AS_USER_MODE_TOKEN) || localStorage.getItem(TOKEN_KEY);
    },

    isEnabledLoginAsUserMode: (): boolean => {
        return !!localStorage.getItem(LOGIN_AS_USER_MODE_TOKEN);
    },

    enableLoginAsUserMode: (token: string): void => {
        localStorage.setItem(LOGIN_AS_USER_MODE_TOKEN, token);
    },

    disableLoginAsUserMode: (): void => {
        localStorage.removeItem(LOGIN_AS_USER_MODE_TOKEN);
    },
};

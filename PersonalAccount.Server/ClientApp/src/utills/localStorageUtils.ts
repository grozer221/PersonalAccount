export const localStorageUtils = {
    setToken: (token: string): void => {
        localStorage.setItem('token', token);
    },

    removeToken: (): void => {
        localStorage.removeItem('token');
    },

    getToken: (): string | null => {
        return localStorage.getItem('token');
    },

};

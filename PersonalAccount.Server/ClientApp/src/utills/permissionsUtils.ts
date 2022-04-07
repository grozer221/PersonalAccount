import {store} from '../store/store';
import {Role} from '../modules/users/users.types';

export const permissionsUtils = {
    isAdmin: (): boolean => {
        return store.getState().auth.me?.user.role === Role.Admin;
    },
};

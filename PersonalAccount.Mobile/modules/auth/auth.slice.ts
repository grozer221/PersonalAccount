import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Me} from './auth.types';
import {setToken} from '../../utils/asyncStorageUtils';
import {User} from '../users/users.types';
import {PersonalAccount} from '../personalAccounts/personalAccounts.types';

const initialState = {
    isAuth: false,
    me: null as Me | null | undefined,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth: (state, action: PayloadAction<{ isAuth: boolean, me: Me | null | undefined }>) => {
            const token = action.payload?.me?.token ? action.payload?.me?.token : '';
            setToken(token);
            state.isAuth = action.payload.isAuth;
            state.me = action.payload.me;
        },
        setUser: (state, action: PayloadAction<User>) => {
            if (state.me)
                state.me.user = action.payload;
        },
        setPersonalAccount: (state, action: PayloadAction<{ personalAccount: PersonalAccount | null }>) => {
            if (state.me)
                state.me.user.personalAccount = action.payload.personalAccount;
        },
        setGroup: (state, action: PayloadAction<{ group: string, subGroup: number }>) => {
            if (state.me) {
                state.me.user.group = action.payload.group;
                state.me.user.subGroup = action.payload.subGroup;
            }
        },
        setEnglishSubGroup: (state, action: PayloadAction<number>) => {
            if (state.me) {
                state.me.user.englishSubGroup = action.payload;
            }
        },
    },
});

export const authActions = authSlice.actions;
export const authReducer = authSlice.reducer;

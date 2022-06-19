import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Me} from './auth.types';
import {User, UserSettings} from '../users/users.types';
import {localStorageUtils} from '../../utills/localStorageUtils';
import {PersonalAccount} from '../personalAccounts/personalAccounts.types';
import {TelegramAccount} from '../telegramAccounts/telegramAccounts.type';

const initialState = {
    isAuth: false,
    me: null as Me | null | undefined,
    isOnLoginAsUserMode: true,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth: (state, action: PayloadAction<{ isAuth: boolean, me?: Me | null }>) => {
            const token = action.payload.me?.token;
            if (token)
                localStorageUtils.setToken(token);
            else
                localStorageUtils.removeToken();
            state.isAuth = action.payload.isAuth;
            state.me = action.payload.me;
        },
        setUser: (state, action: PayloadAction<User>) => {
            if (state.me)
                state.me.user = action.payload;
        },
        setUserSettings: (state, action: PayloadAction<UserSettings>) => {
            if (state.me)
                state.me.user.settings = action.payload;
        },
        setPersonalAccount: (state, action: PayloadAction<PersonalAccount | null | undefined>) => {
            if (state.me)
                state.me.user.settings.personalAccount = action.payload;
        },
        setTelegramAccount: (state, action: PayloadAction<TelegramAccount | null | undefined>) => {
            if (state.me)
                state.me.user.settings.telegramAccount = action.payload;
        },
        setIsEnabledLoginAsUserMode: (state, action: PayloadAction<boolean>) => {
            state.isOnLoginAsUserMode = action.payload;
        },
    },
});

export const authActions = authSlice.actions;
export const authReducer = authSlice.reducer;

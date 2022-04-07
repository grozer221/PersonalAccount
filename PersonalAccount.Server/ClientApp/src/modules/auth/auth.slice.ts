import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Me} from './auth.types';
import {User} from '../users/users.types';
import {PersonalAccount} from '../personalAccounts/personalAccounts.types';
import {localStorageUtils} from '../../utills/localStorageUtils';
import {TelegramAccount} from '../telegramAccounts/telegramAccounts.type';

const initialState = {
    isAuth: false,
    me: null as Me | null | undefined,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth: (state, action: PayloadAction<{ isAuth: boolean, me?: Me | null }>) => {
            const token = action.payload.me?.token;
            console.log(action.payload);
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
        setPersonalAccount: (state, action: PayloadAction<{ personalAccount: PersonalAccount | null }>) => {
            if (state.me)
                state.me.user.personalAccount = action.payload.personalAccount;
        },
        setTelegramAccount: (state, action: PayloadAction<{ telegramAccount: TelegramAccount | null }>) => {
            if (state.me)
                state.me.user.telegramAccount = action.payload.telegramAccount;
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
        setMinutesBeforeLessonNotification: (state, action: PayloadAction<{ minutesBeforeLessonNotification: number, minutesBeforeLessonsNotification: number }>) => {
            if (state.me) {
                state.me.user.minutesBeforeLessonNotification = action.payload.minutesBeforeLessonNotification;
                state.me.user.minutesBeforeLessonsNotification = action.payload.minutesBeforeLessonsNotification;
            }
        },
    },
});

export const authActions = authSlice.actions;
export const authReducer = authSlice.reducer;

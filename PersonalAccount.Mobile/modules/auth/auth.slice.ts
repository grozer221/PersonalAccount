import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Me} from './auth.types';
import {removeToken, setToken} from '../../utils/asyncStorageUtils';
import {User} from '../users/users.types';
import {PersonalAccount} from '../personalAccounts/personalAccounts.types';

const initialState = {
    isAuth: false,
    me: null as Me | null | undefined,
};

export const setAuth = createAsyncThunk(
    'auth/setAuth',
    async ({isAuth, me}: { isAuth: boolean, me?: Me | null }) => {
        const token = me?.token;
        if (token)
            await setToken(token);
        else
            await removeToken();
        return {isAuth, me};

    },
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
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
        setMinutesBeforeLessonNotification: (state, action: PayloadAction<{ minutesBeforeLessonNotification: number, minutesBeforeLessonsNotification: number }>) => {
            if (state.me) {
                state.me.user.minutesBeforeLessonNotification = action.payload.minutesBeforeLessonNotification;
                state.me.user.minutesBeforeLessonsNotification = action.payload.minutesBeforeLessonsNotification;
            }
        },
    },
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading state as needed
        builder.addCase(setAuth.fulfilled, (state, action) => {
            // Add user to the state array
            state.isAuth = action.payload.isAuth;
            state.me = action.payload.me;
        });
    },
});

export const authActions = authSlice.actions;
export const authReducer = authSlice.reducer;

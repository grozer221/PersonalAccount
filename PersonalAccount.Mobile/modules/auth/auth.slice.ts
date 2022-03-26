import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Me} from './auth.types';
import {setToken} from '../../utils/asyncStorageUtils';
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
        setPersonalAccount: (state, action: PayloadAction<{ personalAccount: PersonalAccount | null }>) => {
            if (state.me)
                state.me.user.personalAccount = action.payload.personalAccount;
        },
    },
});

export const authActions = authSlice.actions;
export const authReducer = authSlice.reducer;

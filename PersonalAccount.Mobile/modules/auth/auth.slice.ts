import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Auth} from './auth.types';
import {setToken} from '../../utils/asyncStorageUtils';
import {PersonalAccount} from '../personalAccounts/personalAccounts.types';

const initialState = {
    isAuth: false,
    authData: null as Auth | null | undefined,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth: (state, action: PayloadAction<{ isAuth: boolean, authData: Auth | null | undefined }>) => {
            const token = action.payload?.authData?.token ? action.payload?.authData?.token : '';
            setToken(token);
            state.isAuth = action.payload.isAuth;
            state.authData = action.payload.authData;
        },
        setPersonalAccount: (state, action: PayloadAction<{ personalAccount: PersonalAccount | null }>) => {
            if (state.authData)
                state.authData.user.personalAccount = action.payload.personalAccount;
        },
    },
});

export const authActions = authSlice.actions;
export const authReducer = authSlice.reducer;

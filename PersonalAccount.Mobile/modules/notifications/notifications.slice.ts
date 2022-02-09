import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState = {
    notificationsToken: null as null | string,
};

const notificationsSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        setNotificationsToken: (state, action: PayloadAction<{ notificationsToken: string | null}>) => {
            state.notificationsToken = action.payload.notificationsToken;
        },
    },
});

export const notificationsActions = notificationsSlice.actions;
export const notificationsReducer = notificationsSlice.reducer;

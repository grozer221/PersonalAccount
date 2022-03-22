import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {NotificationType} from './notifications.types';

const initialState = {
    notificationsToken: null as null | string,
    notifications: [] as NotificationType[],
};

const notificationsSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        setNotificationsToken: (state, action: PayloadAction<{ notificationsToken: string | null}>) => {
            state.notificationsToken = action.payload.notificationsToken;
        },
        setNotifications: (state, action: PayloadAction<{ notifications: NotificationType[]}>) => {
            state.notifications = action.payload.notifications;
        },
        addNotification: (state, action: PayloadAction<{ notification: NotificationType}>) => {
            state.notifications.push(action.payload.notification);
        },
    },
});

export const notificationsActions = notificationsSlice.actions;
export const notificationsReducer = notificationsSlice.reducer;

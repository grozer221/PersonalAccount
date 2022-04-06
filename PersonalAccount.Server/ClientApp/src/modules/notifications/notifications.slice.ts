import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {NotificationType} from './notifications.types';
import {GetEntitiesResponse} from '../../abstractions/GetEntitiesResponse';

const initialState = {
    expoPushToken: null as null | string,
    notifications: [] as NotificationType[],
    total: 0,
    pageSize: 0,
    error: '',
    loading: false,
};

const notificationsSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        setExpoPushToken: (state, action: PayloadAction<{ expoPushToken: string | null }>) => {
            state.expoPushToken = action.payload.expoPushToken;
        },
        setNotifications: (state, action: PayloadAction<{ notifications: NotificationType[] }>) => {
            state.notifications = action.payload.notifications;
        },
        fetchNotifications: (state, action: PayloadAction<{ page: number }>) => {
        },
        addNotification: (state, action: PayloadAction<{ notification: NotificationType }>) => {
            state.notifications.push(action.payload.notification);
        },
        addNotifications: (state, action: PayloadAction<GetEntitiesResponse<NotificationType>>) => {
            state.notifications = [...state.notifications, ...action.payload.entities];
            state.total = action.payload.total;
            state.pageSize = action.payload.pageSize;
        },
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
        },
        defaultState: (state, action: PayloadAction) => {
            state.notifications = [];
            state.total = 0;
            state.pageSize = 0;
            state.error = '';
            state.loading = false;
        },
    },
});

export const notificationsActions = notificationsSlice.actions;
export const notificationsReducer = notificationsSlice.reducer;

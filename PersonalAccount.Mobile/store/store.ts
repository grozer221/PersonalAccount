import {configureStore} from '@reduxjs/toolkit';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import {authReducer} from '../modules/auth/auth.slice';
import {notificationsReducer} from '../modules/notifications/notifications.slice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        notifications: notificationsReducer,
    },
});

type RootState = ReturnType<typeof store.getState>
type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

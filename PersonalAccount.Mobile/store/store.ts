import {configureStore} from '@reduxjs/toolkit';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import {authReducer} from '../modules/auth/auth.slice';
import {notificationsReducer} from '../modules/notifications/notifications.slice';
import {combineEpics, createEpicMiddleware} from 'redux-observable';
import notificationsEpics from '../modules/notifications/notifications.epics';

const epicMiddleware = createEpicMiddleware();
export const rootEpic = combineEpics(
    ...notificationsEpics,
);

export const store = configureStore({
    reducer: {
        auth: authReducer,
        notifications: notificationsReducer,
    },
    middleware: [epicMiddleware],
});

// @ts-ignore
epicMiddleware.run(rootEpic);

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

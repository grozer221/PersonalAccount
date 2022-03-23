import React, {useEffect, useRef, useState} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {ApolloProvider, useLazyQuery} from '@apollo/client';
import {client} from './gql/client';
import {IS_AUTH_QUERY, IsAuthData, IsAuthVars} from './modules/auth/auth.queries';
import {authActions} from './modules/auth/auth.slice';
import {store, useAppDispatch} from './store/store';
import {Provider} from 'react-redux';
import * as Font from 'expo-font';
import {Loading} from './components/Loading';
import * as Notifications from 'expo-notifications';
import {StyleSheet, View} from 'react-native';
import {notificationsActions} from './modules/notifications/notifications.slice';
import {NativeRouter} from 'react-router-native';
import {Subscription} from 'expo-modules-core';
import {Subject} from './modules/schedule/schedule.types';
import {registerForPushNotificationsAsync} from './utils/notificationsUtils';
import {Router} from './Router';

export default function App() {
    return (
        <ApolloProvider client={client}>
            <SafeAreaProvider>
                <Provider store={store}>
                    <NativeRouter>
                        <WrappedApp/>
                    </NativeRouter>
                </Provider>
            </SafeAreaProvider>
        </ApolloProvider>
    );
};

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

const WrappedApp = () => {
    const dispatch = useAppDispatch();

    const notificationListener = useRef<Subscription>();
    const responseListener = useRef<Subscription>();

    useEffect(() => {
        (async () => {
            await Font.loadAsync('antoutline', require('@ant-design/icons-react-native/fonts/antoutline.ttf'));
            await Font.loadAsync('antfill', require('@ant-design/icons-react-native/fonts/antfill.ttf'));
            const expoPushToken = await registerForPushNotificationsAsync();
            dispatch(notificationsActions.setExpoPushToken({expoPushToken: expoPushToken}));

            // This listener is fired whenever a notification is received while the app is foregrounded
            notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
                console.log('notification', notification);
                dispatch(notificationsActions.addNotification({
                    notification: {
                        title: notification.request.content.title || '',
                        body: notification.request.content.body || '',
                        date: notification.request.content.data?.date as string | null || '',
                        subject: notification.request.content.data?.subject as Subject || null,
                    },
                }));
            });

            // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
            responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
                console.log('response', response);
            });
        })();

        return () => {
            notificationListener.current && Notifications.removeNotificationSubscription(notificationListener.current);
            responseListener.current && Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    return (
        <View style={s.wrapperApp}>
            <Router/>
        </View>
    );
};

const s = StyleSheet.create({
    wrapperApp: {
        flex: 1,
        paddingTop: 30,
        paddingBottom: 10,
        backgroundColor: 'black',
    },
});

import React, {useEffect, useRef} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {ApolloProvider} from '@apollo/client';
import {client} from './gql/client';
import {store, useAppDispatch} from './store/store';
import {Provider} from 'react-redux';
import * as Font from 'expo-font';
import * as Notifications from 'expo-notifications';
import {StyleSheet, View} from 'react-native';
import {notificationsActions} from './modules/notifications/notifications.slice';
import {NativeRouter} from 'react-router-native';
import {Subscription} from 'expo-modules-core';
import {registerForPushNotificationsAsync} from './utils/notificationsUtils';
import {Router} from './Router';
import {Provider as AntProvider} from '@ant-design/react-native';
import enUS from '@ant-design/react-native/lib/locale-provider/en_US';

export default function App() {
    return (
        <ApolloProvider client={client}>
            <SafeAreaProvider>
                <Provider store={store}>
                    <NativeRouter>
                        <AntProvider locale={enUS}>
                            <WrappedApp/>
                        </AntProvider>
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
                // dispatch(notificationsActions.addNotification({
                //     notification: {
                //         title: notification.request.content.title || '',
                //         body: notification.request.content.body || '',
                //         cre: notification.request.content.data?.date as string | null || '',
                //         subject: notification.request.content.data?.subject as Subject || null,
                //     },
                // }));
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

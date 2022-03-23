import React, {useEffect, useRef, useState} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {ApolloProvider, useLazyQuery} from '@apollo/client';
import {client} from './gql/client';
import {IS_AUTH_QUERY, IsAuthData, IsAuthVars} from './modules/auth/auth.queries';
import {authActions} from './modules/auth/auth.slice';
import {store, useAppDispatch, useAppSelector} from './store/store';
import {Provider} from 'react-redux';
import {AuthScreen} from './screens/AuthScreen';
import * as Font from 'expo-font';
import {Loading} from './components/Loading';
import * as Notifications from 'expo-notifications';
import {StyleSheet, View} from 'react-native';
import {notificationsActions} from './modules/notifications/notifications.slice';
import {NativeRouter, Navigate, Route, Routes} from 'react-router-native';
import {HomeScreen} from './screens/HomeScreen';
import {ScheduleForTodayScreen} from './screens/ScheduleForTodayScreen';
import {ScheduleForTwoWeeksScreen} from './screens/ScheduleForTwoWeeksScreen';
import {NotFoundScreen} from './screens/NotFoundScreen';
import {SettingsScreen} from './screens/SettingsScreen';
import {Subscription} from 'expo-modules-core';
import {Subject} from './modules/schedule/schedule.types';
import {Layout} from './components/Layout';
import {registerForPushNotificationsAsync} from './utils/notificationsUtils';

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
    const [isAuthQuery, isAuthQueryOptions] = useLazyQuery<IsAuthData, IsAuthVars>(IS_AUTH_QUERY);
    const [initialized, setInitialized] = useState(false);
    const dispatch = useAppDispatch();
    const isAuth = useAppSelector(state => state.auth.isAuth);

    const notificationListener = useRef<Subscription>(null);
    const responseListener = useRef<Subscription>(null);

    useEffect(() => {
        (async () => {
            await Font.loadAsync('antoutline', require('@ant-design/icons-react-native/fonts/antoutline.ttf'));
            await Font.loadAsync('antfill', require('@ant-design/icons-react-native/fonts/antfill.ttf'));
            const expoPushToken = await registerForPushNotificationsAsync();
            dispatch(notificationsActions.setExpoPushToken({expoPushToken: expoPushToken}));
            isAuthQuery({variables: {expoPushToken: expoPushToken}})
                .then(response => {
                    console.log('isAuthQuery', response.data);
                    dispatch(authActions.setAuth({isAuth: true, authData: response.data?.isAuth}));
                    setInitialized(true);
                })
                .catch(error => {
                    setInitialized(true);
                });

            // This listener is fired whenever a notification is received while the app is foregrounded
            // @ts-ignore
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
            // @ts-ignore
            responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
                console.log('response', response);
            });
        })();

        return () => {
            notificationListener.current && Notifications.removeNotificationSubscription(notificationListener.current);
            responseListener.current && Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    if (isAuthQueryOptions.loading || !initialized)
        return <Loading/>;

    return (
        <View style={s.wrapperApp}>

            <Routes>
                <Route path={'/auth'} element={<AuthScreen/>}/>
                <Route path={'*'} element={
                    isAuth
                        ? <Layout>
                            <Routes>
                                <Route index element={<HomeScreen/>}/>
                                <Route path={'/scheduleForToday'} element={<ScheduleForTodayScreen/>}/>
                                <Route path={'/scheduleForTwoWeeks'} element={<ScheduleForTwoWeeksScreen/>}/>
                                <Route path={'/settings'} element={<SettingsScreen/>}/>
                                <Route path={'/auth'} element={<AuthScreen/>}/>
                                <Route path={'*'} element={<NotFoundScreen/>}/>
                            </Routes>
                        </Layout>
                        : <Navigate to={'/auth'}/>
                }/>
            </Routes>
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

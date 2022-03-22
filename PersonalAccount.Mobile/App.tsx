import React, {useEffect, useRef, useState} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {ApolloProvider, useQuery} from '@apollo/client';
import {client} from './gql/client';
import {IS_AUTH_QUERY, IsAuthData, IsAuthVars} from './modules/auth/auth.queries';
import {authActions} from './modules/auth/auth.slice';
import {store, useAppDispatch, useAppSelector} from './store/store';
import {Provider} from 'react-redux';
import {AuthScreen} from './screens/AuthScreen';
import * as Font from 'expo-font';
import {Loading} from './components/Loading';
import * as Notifications from 'expo-notifications';
import {DrawerLayoutAndroid, Platform, StyleSheet, View} from 'react-native';
import {notificationsActions} from './modules/notifications/notifications.slice';
import {NativeRouter, Route, Routes} from 'react-router-native';
import {HomeScreen} from './screens/HomeScreen';
import {ScheduleForTodayScreen} from './screens/ScheduleForTodayScreen';
import {ScheduleForTwoWeeksScreen} from './screens/ScheduleForTwoWeeksScreen';
import {NotFoundScreen} from './screens/NotFoundScreen';
import {SettingsScreen} from './screens/SettingsScreen';
import {AppMenu} from './components/AppMenu';
import {HamburgerMenu} from './components/HamburgerMenu';
import {Icon} from '@ant-design/react-native';
import {Subscription} from 'expo-modules-core';
import {Subject} from './modules/schedule/schedule.types';

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
    const isAuthQuery = useQuery<IsAuthData, IsAuthVars>(IS_AUTH_QUERY);
    const [initialized, setInitialized] = useState(false);
    const dispatch = useAppDispatch();
    const isAuth = useAppSelector(state => state.auth.isAuth);

    const notificationListener = useRef<Subscription>(null);
    const responseListener = useRef<Subscription>(null);
    const drawer = useRef<any>(null);


    const registerForPushNotificationsAsync = async (): Promise<string | null> => {
        let token: string | null = null;
        const {status: existingStatus} = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const {status} = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return null;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;

        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }
        return token;
    };

    useEffect(() => {
        (async () => {
            await Font.loadAsync('antoutline', require('@ant-design/icons-react-native/fonts/antoutline.ttf'));
            await Font.loadAsync('antfill', require('@ant-design/icons-react-native/fonts/antfill.ttf'));
        })();
        // @ts-ignore
        registerForPushNotificationsAsync().then(token => dispatch(notificationsActions.setNotificationsToken(token)));

        // This listener is fired whenever a notification is received while the app is foregrounded
        // @ts-ignore
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            console.log('notification', notification);
            dispatch(notificationsActions.addNotification({
                notification: {
                    title: notification.request.content.title || '',
                    body: notification.request.content.body || '',
                    date: notification.request.content.data?.date as string | null || '',
                    subject: notification.request.content.data?.subject as Subject || null
                },
            }));
        });

        // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
        // @ts-ignore
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log('response', response);
        });

        return () => {
            notificationListener.current && Notifications.removeNotificationSubscription(notificationListener.current);
            responseListener.current && Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    useEffect(() => {
        if (isAuthQuery.data) {
            dispatch(authActions.setAuth({isAuth: true, authData: isAuthQuery.data.isAuth}));
            setInitialized(true);
        }
        if (isAuthQuery.error) {
            setInitialized(true);
        }
    }, [isAuthQuery]);

    if (isAuthQuery.loading || !initialized)
        return <Loading/>;

    if (!isAuth)
        return <AuthScreen/>;


    return (
        <DrawerLayoutAndroid
            ref={drawer}
            drawerWidth={300}
            drawerPosition={'left'}
            renderNavigationView={HamburgerMenu}
        >
            <View style={s.wrapperApp}>
                {isAuth && (
                    <View style={s.hamburger}>
                        <Icon name={'menu'} onPress={() => drawer.current.openDrawer()}/>
                    </View>
                )}
                <View style={s.container}>
                    <Routes>
                        <Route index element={<HomeScreen/>}/>
                        <Route path={'/scheduleForToday'} element={<ScheduleForTodayScreen/>}/>
                        <Route path={'/scheduleForTwoWeeks'} element={<ScheduleForTwoWeeksScreen/>}/>
                        <Route path={'/settings'} element={<SettingsScreen/>}/>
                        <Route path={'/auth'} element={<AuthScreen/>}/>
                        <Route path={'*'} element={<NotFoundScreen/>}/>
                    </Routes>
                </View>
                {isAuth && <AppMenu/>}
            </View>
        </DrawerLayoutAndroid>
    );
};

const s = StyleSheet.create({
    wrapperApp: {
        flex: 1,
        paddingTop: 30,
        paddingBottom: 10,
        backgroundColor: 'black',
    },
    container: {
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    hamburger: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
        borderBottomColor: 'gray',
        borderWidth: 2,
        paddingHorizontal: 10,
    },
});



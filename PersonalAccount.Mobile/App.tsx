import React, {useEffect, useRef, useState} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import useColorScheme from './hooks/useColorScheme';
import {Navigation} from './navigation';
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
import {Platform} from 'react-native';
import {notificationsActions} from './modules/notifications/notifications.slice';

export default function App() {
    return (
        <ApolloProvider client={client}>
            <SafeAreaProvider>
                <Provider store={store}>
                    <WrappedApp/>
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
    const colorScheme = useColorScheme();
    // const isLoadingComplete = useCachedResources();
    const isAuthQuery = useQuery<IsAuthData, IsAuthVars>(IS_AUTH_QUERY);
    const [initialized, setInitialized] = useState(false);
    const dispatch = useAppDispatch();
    const isAuth = useAppSelector(state => state.auth.isAuth);

    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();

    const registerForPushNotificationsAsync = async (): Promise<string | null> => {
        let token: string | null = null;
        const {status: existingStatus} = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            console.log('requestPermissionsAsync');
            const {status} = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return null;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log('notification token', token);

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
            // @ts-ignore
            setNotification(notification);
        });

        // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
        // @ts-ignore
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log('response', response);
        });

        return () => {
            // @ts-ignore
            Notifications.removeNotificationSubscription(notificationListener.current);
            // @ts-ignore
            Notifications.removeNotificationSubscription(responseListener.current);
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

    console.log(isAuthQuery.loading, !initialized);

    if (isAuthQuery.loading || !initialized)
        return <Loading/>;

    if (!isAuth)
        return <AuthScreen/>;


    return (
        <Navigation colorScheme={colorScheme}/>
    );
};



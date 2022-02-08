import React, {useEffect, useState} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {useCachedResources} from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import {Navigation} from './navigation';
import {ApolloProvider, useQuery} from '@apollo/client';
import {client} from './gql/client';
import {Icon} from '@ant-design/react-native';
import {IS_AUTH_QUERY, IsAuthData, IsAuthVars} from './modules/auth/auth.queries';
import {authActions} from './modules/auth/auth.slice';
import {store, useAppDispatch, useAppSelector} from './store/store';
import {Provider} from 'react-redux';
import {AuthScreen} from './screens/AuthScreen';

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

const WrappedApp = () => {
    const colorScheme = useColorScheme();
    const isLoadingComplete = useCachedResources();
    const isAuthQuery = useQuery<IsAuthData, IsAuthVars>(IS_AUTH_QUERY);
    const [initialized, setInitialized] = useState(false);
    const dispatch = useAppDispatch();
    const isAuth = useAppSelector(state => state.auth.isAuth);

    useEffect(() => {
        if (isAuthQuery.data) {
            dispatch(authActions.setAuth({isAuth: true, authData: isAuthQuery.data.isAuth}));
            setInitialized(true);
        }
        if (isAuthQuery.error) {
            setInitialized(true);
        }
    }, [isAuthQuery]);


    if (isLoadingComplete || isAuthQuery.loading || !initialized)
        return <Icon name="loading" size="lg" color="grey"/>;

    console.log(isAuthQuery.data);

    if(!isAuth)
        return <AuthScreen/>

    return (
        <Navigation colorScheme={colorScheme}/>
    );
};

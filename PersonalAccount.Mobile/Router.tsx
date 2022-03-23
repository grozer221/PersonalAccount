import React, {useEffect} from 'react';
import {Navigate, Route, Routes} from 'react-router-native';
import {AuthScreen} from './screens/AuthScreen';
import {Layout} from './components/Layout';
import {HomeScreen} from './screens/HomeScreen';
import {ScheduleForTodayScreen} from './screens/ScheduleForTodayScreen';
import {ScheduleForTwoWeeksScreen} from './screens/ScheduleForTwoWeeksScreen';
import {SettingsScreen} from './screens/SettingsScreen';
import {NotFoundScreen} from './screens/NotFoundScreen';
import {useAppDispatch, useAppSelector} from './store/store';
import {useQuery} from '@apollo/client';
import {IS_AUTH_QUERY, IsAuthData, IsAuthVars} from './modules/auth/auth.queries';
import {Loading} from './components/Loading';
import {authActions} from './modules/auth/auth.slice';
import {Text} from 'react-native';

export const Router = () => {
    const isAuth = useAppSelector(state => state.auth.isAuth);
    const expoPushToken = useAppSelector(state => state.notifications.expoPushToken);
    const isAuthQuery = useQuery<IsAuthData, IsAuthVars>(IS_AUTH_QUERY, {variables: {expoPushToken: expoPushToken}});
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (isAuthQuery.data) {
            console.log('aa', isAuthQuery.data);
            dispatch(authActions.setAuth({isAuth: true, authData: isAuthQuery.data?.isAuth}));
        }
    }, [isAuthQuery.data]);


    if (!isAuthQuery.loading && !expoPushToken)
        return <Text>expoPushToken error</Text>;

    if (isAuthQuery.loading || !expoPushToken)
        return <Loading/>;

    return (
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
    );
};

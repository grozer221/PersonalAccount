import React, {useEffect, useState} from 'react';
import {Navigate, Route, Routes} from 'react-router-dom';
import {Error} from './components/Error/Error';
import {AppLayout} from './components/AppLayout/AppLayout';
import {useAppDispatch} from './store/store';
import {LoginPage} from './pages/LoginPage/LoginPage';
import {ME_QUERY, MeData, MeVars} from './modules/auth/auth.queries';
import {authActions} from './modules/auth/auth.slice';
import {Loading} from './components/Loading/Loading';
import {ScheduleForTwoWeeksPage} from './pages/ScheduleForTwoWeeksPage/ScheduleForTwoWeeksPage';
import {SettingsPage} from './pages/SettingsPage/SettingsPage';
import 'antd/dist/antd.css';
import './App.css';
import {WithRoleAdmin} from './HOCs/WithRoleAdmin';
import {BroadcastMessagePage} from './pages/BroadcastMessagePage/BroadcastMessagePage';
import {WithAuth} from './HOCs/WithAuth';
import {UsersPage} from './pages/UsersPage/UsersPage';
import {RegisterPage} from './pages/RegisterPage/RegisterPage';
import {WithUnAuth} from './HOCs/WithUnAuth';
import {useQuery} from '@apollo/client';
import {NotificationsPage} from './pages/NotificationsPage/NotificationsPage';
import {localStorageUtils} from './utills/localStorageUtils';
import {ScheduleForTodayPage} from './pages/ScheduleForTodayPage/ScheduleForTodayPage';

export const App = () => {
    const meQuery = useQuery<MeData, MeVars>(ME_QUERY);
    const [isMeDone, setMeDone] = useState(false);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (meQuery.data && !isMeDone) {
            dispatch(authActions.setAuth({me: meQuery.data?.me, isAuth: true}));
            dispatch(authActions.setIsEnabledLoginAsUserMode(localStorageUtils.isEnabledLoginAsUserMode()));
            setMeDone(true);

        }
        if (meQuery.error && !isMeDone) {
            dispatch(authActions.setIsEnabledLoginAsUserMode(localStorageUtils.isEnabledLoginAsUserMode()));
            setMeDone(true);
        }
    }, [meQuery.data, meQuery.error]);

    if (!isMeDone)
        return <Loading/>;

    return (
        <Routes>
            <Route path="Login" element={
                <WithUnAuth render={<Navigate to={'/'}/>}>
                    <LoginPage/>
                </WithUnAuth>
            }/>
            <Route path="Register" element={
                <WithUnAuth render={<Navigate to={'/'}/>}>
                    <RegisterPage/>
                </WithUnAuth>}
            />
            <Route path="*" element={
                <WithAuth render={<Navigate to={'/login'}/>}>
                    <AppLayout>
                        <Routes>
                            <Route index element={<ScheduleForTwoWeeksPage/>}/>
                            <Route path={'ScheduleForTwoWeeks'} element={<ScheduleForTwoWeeksPage/>}/>
                            <Route path={'ScheduleForToday'} element={<ScheduleForTodayPage/>}/>
                            <Route path={'Notifications'} element={<NotificationsPage/>}/>
                            <Route path={'Settings'} element={<SettingsPage/>}/>
                            <Route path={'BroadcastMessage'} element={
                                <WithRoleAdmin render={<Error statusCode={403}/>}>
                                    <BroadcastMessagePage/>
                                </WithRoleAdmin>
                            }/>
                            <Route path={'Users'} element={
                                <WithRoleAdmin render={<Error statusCode={403}/>}>
                                    <UsersPage/>
                                </WithRoleAdmin>
                            }/>
                            <Route path={'*'} element={<Error/>}/>
                        </Routes>
                    </AppLayout>
                </WithAuth>
            }/>
        </Routes>
    );
};

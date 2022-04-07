import React, {useEffect, useState} from 'react';
import {Navigate, Route, Routes} from 'react-router-dom';
import {Error} from './components/Error/Error';
import {ScheduleForTodayPage} from './pages/ScheduleForTodayPage/ScheduleForTodayPage';
import {AppLayout} from './components/AppLayout/AppLayout';
import {useAppDispatch, useAppSelector} from './store/store';
import {LoginPage} from './pages/LoginPage/LoginPage';
import {ME_QUERY, MeData, MeVars} from './modules/auth/auth.queries';
import {authActions} from './modules/auth/auth.slice';
import {Loading} from './components/Loading/Loading';
import {ScheduleForTwoWeeksPage} from './pages/ScheduleForTwoWeeksPage/ScheduleForTwoWeeksPage';
import {SettingsPage} from './pages/SettingsPage/SettingsPage';
import {client} from './gql/client';
import 'antd/dist/antd.css';
import './App.css';

export const App = () => {
    const isAuth = useAppSelector(s => s.auth.isAuth);
    const [isMeDone, setMeDone] = useState(false);
    const dispatch = useAppDispatch();

    useEffect(() => {
        client.query<MeData, MeVars>({query: ME_QUERY})
            .then(response => {
                console.log(response.data);
                dispatch(authActions.setAuth({me: response.data?.me, isAuth: true}));
            })
            .finally(() => {
                setMeDone(true);
            });
    }, []);

    if (!isMeDone)
        return <Loading/>;

    return (
        <Routes>
            <Route path="login" element={
                isAuth
                    ? <Navigate to={'/'}/>
                    : <LoginPage/>
            }/>
            <Route path="*" element={
                isAuth
                    ? <AppLayout>
                        <Routes>
                            <Route index element={<Navigate to={'ScheduleForToday'}/>}/>
                            <Route path={'ScheduleForToday'} element={<ScheduleForTodayPage/>}/>
                            <Route path={'ScheduleForTwoWeeks'} element={<ScheduleForTwoWeeksPage/>}/>
                            <Route path={'Settings'} element={<SettingsPage/>}/>
                            <Route path={'*'} element={<Error/>}/>
                        </Routes>
                    </AppLayout>
                    : <Navigate to={'login'}/>
            }/>
        </Routes>
    );
};

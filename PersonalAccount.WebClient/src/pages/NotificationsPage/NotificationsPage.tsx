import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from '../../store/store';
import {notificationsActions} from '../../modules/notifications/notifications.slice';
import {Loading} from '../../components/Loading/Loading';
import s from './NotificationsPage.module.css';
import parse from 'html-react-parser';
import Title from 'antd/es/typography/Title';
import {stringToUkraineDate, stringToUkraineTime} from '../../convertors/stringToDatetimeConvertors';
import {Row} from 'antd';

export const NotificationsPage = () => {
    const dispatch = useAppDispatch();
    const notifications = useAppSelector(s => s.notifications.notifications);
    const error = useAppSelector(s => s.notifications.error);
    const pageSize = useAppSelector(s => s.notifications.pageSize);
    const total = useAppSelector(s => s.notifications.total);
    const loading = useAppSelector(s => s.notifications.loading);

    useEffect(() => {
        if (notifications.length == 0)
            dispatch(notificationsActions.fetchNotifications({page: 1}));
    }, []);

    if (loading)
        return <Loading/>;

    return (
        <div>
            {!!error && <div>{error}</div>}
            <div className={s.notifications}>
                {notifications.map(notification => (
                    <div key={notification.id} className={s.notification}>
                        <Row justify={'space-between'}>
                            <Title className={s.title} level={5}>{notification.title}</Title>
                            <div className={s.dateTime}>
                                <div>{stringToUkraineTime(notification.createdAt)}</div>
                                <div className={s.date}>{stringToUkraineDate(notification.createdAt)}</div>
                            </div>
                        </Row>
                        {notification.subject
                            ? <div>
                                <div>
                                    <span>{notification.subject.time} {notification.subject.type} </span>
                                    <span className={'subjectCabinet'}>{notification.subject.cabinet}</span>
                                </div>
                                <div className={'subjectName'}>{notification.subject.name}</div>
                                <div className={'subjectTeacher'}>{notification.subject.teacher}</div>
                                <div>{notification.subject.link}</div>
                            </div>
                            : <div>{parse(notification.body)}</div>
                        }
                    </div>
                ))}
            </div>
        </div>
    );
};

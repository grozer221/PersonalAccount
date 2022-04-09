import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from '../../store/store';

export const NotificationsPage = () => {
    const dispatch = useAppDispatch();
    const notifications = useAppSelector(s => s.notifications.notifications);
    const error = useAppSelector(s => s.notifications.error);
    const pageSize = useAppSelector(s => s.notifications.pageSize);
    const total = useAppSelector(s => s.notifications.total);
    const loading = useAppSelector(s => s.notifications.loading);

    useEffect(() => {
        // dispatch(notificationsActions.fetchNotifications({page: 1}));
    }, []);

    return (
        <div>
            {notifications.map(notification => (
                <div key={notification.id}>{notification.body}</div>
            ))}
        </div>
    );
};

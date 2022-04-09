import React, {FC, useState} from 'react';
import {useMutation} from '@apollo/client';
import {useAppDispatch, useAppSelector} from '../../store/store';
import {
    UPDATE_MINUTES_BEFORE_LESSON_NOTIFICATION_MUTATION,
    UpdateMinuteBeforeLessonNotificationData,
    UpdateMinuteBeforeLessonNotificationVars,
} from '../../modules/users/users.mutations';
import {authActions} from '../../modules/auth/auth.slice';
import {messageUtils} from '../../utills/messageUtils';
import {Button, Select} from 'antd';

export const UpdateMinutesBeforeLessonNotification: FC = () => {
    const me = useAppSelector(s => s.auth.me);
    const dispatch = useAppDispatch();
    const [minutesBeforeLessonNotification, setMinutesBeforeLessonNotification] = useState(me?.user.minutesBeforeLessonNotification || 5);
    const [minutesBeforeLessonsNotification, setMinutesBeforeLessonsNotification] = useState(me?.user.minutesBeforeLessonsNotification || 20);
    const [updateMinuteBeforeLessonNotification, updateMinuteBeforeLessonNotificationOptions] = useMutation<UpdateMinuteBeforeLessonNotificationData, UpdateMinuteBeforeLessonNotificationVars>(UPDATE_MINUTES_BEFORE_LESSON_NOTIFICATION_MUTATION);

    const updateMinuteBeforeLessonNotificationHandler = (): void => {
        updateMinuteBeforeLessonNotification({
            variables: {
                minutesBeforeLessonNotification,
                minutesBeforeLessonsNotification,
            },
        })
            .then(response => {
                dispatch(authActions.setMinutesBeforeLessonNotification({
                    minutesBeforeLessonNotification,
                    minutesBeforeLessonsNotification,
                }));
                messageUtils.success();
            })
            .catch(error => {
                messageUtils.error(error.message);
            });
    };

    return (
        <>
            <div className={'label'}>Minutes before lesson notification</div>
            <Select value={minutesBeforeLessonNotification} onChange={setMinutesBeforeLessonNotification}>
                {Array.from(Array(30), (e, i) => {
                    const number = i + 1;
                    return (
                        <Select.Option key={number} value={number}>{number}</Select.Option>
                    );
                })}
            </Select>
            <div className={'label'}>Minutes before lessons notification</div>
            <Select value={minutesBeforeLessonsNotification} onChange={setMinutesBeforeLessonsNotification}>
                {Array.from(Array(60), (e, i) => {
                    const number = i + 1;
                    return (
                        <Select.Option key={number} value={number}>{number}</Select.Option>
                    );
                })}
            </Select>
            <Button
                size={'small'}
                onClick={updateMinuteBeforeLessonNotificationHandler}
                loading={updateMinuteBeforeLessonNotificationOptions.loading}
            >
                Save
            </Button>
        </>
    );
};

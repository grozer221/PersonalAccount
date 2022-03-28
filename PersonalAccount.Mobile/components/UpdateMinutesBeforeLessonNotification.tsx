import React, {FC, useState} from 'react';
import {Text, View} from 'react-native';
import {settingsStyle} from '../screens/SettingsScreen';
import {Picker} from '@react-native-picker/picker';
import {Button, Modal} from '@ant-design/react-native';
import {useAppDispatch, useAppSelector} from '../store/store';
import {authActions} from '../modules/auth/auth.slice';
import {useMutation} from '@apollo/client';
import {
    UPDATE_MINUTES_BEFORE_LESSON_NOTIFICATION_MUTATION,
    UpdateMinuteBeforeLessonNotificationData,
    UpdateMinuteBeforeLessonNotificationVars,
} from '../modules/users/users.mutations';

export const UpdateMinutesBeforeLessonNotification: FC = () => {
    const me = useAppSelector(state => state.auth.me);
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
            })
            .catch(error => {
                Modal.alert('Error', error.message, [{text: 'Ok'}]);
            });
    };

    return (
        <>
            <Text style={[settingsStyle.greyText, settingsStyle.mb]}>Minutes before lesson notification</Text>
            <View style={[settingsStyle.picker, settingsStyle.mb]}>
                <Picker
                    selectedValue={minutesBeforeLessonNotification}
                    style={{height: 50}}
                    onValueChange={(itemValue) => setMinutesBeforeLessonNotification(itemValue)}
                >
                    {Array.from(Array(30), (e, i) => {
                        const number = i + 1;
                        return (
                            <Picker.Item key={number} label={`${number} minutes`} value={number}/>
                        );
                    })}
                </Picker>
            </View>
            <Text style={[settingsStyle.greyText, settingsStyle.mb]}>Minutes before lessons notification</Text>
            <View style={[settingsStyle.picker, settingsStyle.mb]}>
                <Picker
                    selectedValue={minutesBeforeLessonsNotification}
                    style={{height: 50}}
                    onValueChange={(itemValue) => setMinutesBeforeLessonsNotification(itemValue)}
                >
                    {Array.from(Array(60), (e, i) => {
                        const number = i + 1;
                        return (
                            <Picker.Item key={number} label={`${number} minutes`} value={number}/>
                        );
                    })}
                </Picker>
            </View>
            <Button
                size={'small'}
                onPress={updateMinuteBeforeLessonNotificationHandler}
                loading={updateMinuteBeforeLessonNotificationOptions.loading}
            >
                Save
            </Button>
        </>
    );
};

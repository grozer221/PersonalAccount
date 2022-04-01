import React, {useEffect} from 'react';
import {Linking, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useAppDispatch, useAppSelector} from '../store/store';
import {stringToUkraineDate, stringToUkraineTime} from '../convertors/stringToDatetimeConvertors';
import Hyperlink from 'react-native-hyperlink';
import {Empty} from '../components/Empty';
import {notificationsActions} from '../modules/notifications/notifications.slice';
import {useSearchParams} from 'react-router-native';
import {Loading} from '../components/Loading';

export const HomeScreen = () => {
    const notifications = useAppSelector(state => state.notifications.notifications);
    const error = useAppSelector(state => state.notifications.error);
    const loading = useAppSelector(state => state.notifications.loading);
    const dispatch = useAppDispatch();
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        if (notifications.length === 0)
            dispatch(notificationsActions.fetchNotifications({page: parseInt(searchParams.get('page') || '1')}));
    }, []);

    if (loading)
        return <Loading/>;

    return (
        <ScrollView style={s.wrapperHome}>
            {!!error && <Text style={s.error}>{error}</Text>}
            {notifications.length === 0 && <Empty/>}
            {notifications.map((notification, i) => (
                <View key={i} style={s.notification}>
                    <View style={s.titleAndDate}>
                        <Text style={s.title}>{notification.title} </Text>
                        <View style={s.createAt}>
                            <Text>{stringToUkraineTime(notification.createdAt)}</Text>
                            <Text style={s.textGrey}>{stringToUkraineDate(notification.createdAt)}</Text>
                        </View>
                    </View>
                    {notification.subject
                        ? (
                            <View>
                                <Text>
                                    <Text>{notification.subject?.time} {notification.subject?.type} </Text>
                                    <Text style={s.subjectCabinet}>{notification.subject?.cabinet}</Text>
                                </Text>
                                <Text style={s.subjectName}>{notification.subject?.name}</Text>
                                <Text style={s.subjectTeacher}>{notification.subject?.teacher}</Text>
                                <Hyperlink onPress={async (url) => await Linking.openURL(url)}
                                           linkStyle={{color: 'blue'}}>
                                    <Text style={s.subjectLink}>{notification.subject?.link}</Text>
                                </Hyperlink>
                            </View>
                        )
                        : (
                            <View>
                                <Text>{notification.body}</Text>
                            </View>
                        )
                    }


                </View>
            ))}
        </ScrollView>
    );
};

const s = StyleSheet.create({
    wrapperHome: {
        flex: 1,
    },
    error: {
        color: 'red',
    },
    notification: {
        margin: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderColor: 'grey',
        borderWidth: 1,
        borderRadius: 5,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    titleAndDate: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },
    createAt: {
        alignItems: 'flex-end'
    },
    textGrey: {
      color: 'grey',
    },
    subjectName: {
        fontWeight: 'bold',
        fontSize: 15,
    },
    subjectTeacher: {
        fontWeight: 'bold',
        color: '#1e81b0',
    },
    subjectCabinet: {
        fontWeight: 'bold',
        color: '#d35400',
    },
    subjectLink: {
        color: 'grey',
    },
});

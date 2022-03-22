import React from 'react';
import {Linking, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useAppSelector} from '../store/store';
import {stringToUkraineDatetime} from '../convertors/stringToDatetimeConvertors';
import Hyperlink from 'react-native-hyperlink';

export const HomeScreen = () => {
    const notifications = useAppSelector(state => state.notifications.notifications);

    return (
        <ScrollView style={s.wrapperHome}>
            {notifications.map((notification, i) => (
                <View key={i} style={s.notification}>
                    <View style={s.titleAndDate}>
                        <Text style={s.title}>{notification.title} </Text>
                        <Text>{stringToUkraineDatetime(notification.date)}</Text>
                    </View>
                    <View>
                        <Text>
                            <Text>{notification.subject?.time} {notification.subject?.type} </Text>
                            <Text style={s.subjectCabinet}>{notification.subject?.cabinet}</Text>
                        </Text>
                        <Text style={s.subjectName}>{notification.subject?.name}</Text>
                        <Text style={s.subjectTeacher}>{notification.subject?.teacher}</Text>
                        <Hyperlink onPress={async (url) => await Linking.openURL(url)} linkStyle={{color: 'blue'}}>
                            <Text style={s.subjectLink}>{notification.subject?.link}</Text>
                        </Hyperlink>
                    </View>
                </View>
            ))}
        </ScrollView>
    );
};

const s = StyleSheet.create({
    wrapperHome: {
        flex: 1,
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
        alignItems: 'center',
        justifyContent: 'space-between'
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

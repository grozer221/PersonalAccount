import React from 'react';
import {Linking, ScrollView, StyleSheet} from 'react-native';

import {Text, View} from '../components/Themed';
import {useQuery} from '@apollo/client';
import {
    GET_SCHEDULE_FOR_TODAY_QUERY,
    GetScheduleForTodayData,
    GetScheduleForTodayVars,
} from '../modules/schedule/schedule.queries';
import {Loading} from '../components/Loading';
import Hyperlink from 'react-native-hyperlink';

export const ScheduleForTodayScreen = () => {
    const getScheduleForTodayQuery = useQuery<GetScheduleForTodayData, GetScheduleForTodayVars>(GET_SCHEDULE_FOR_TODAY_QUERY);

    if (getScheduleForTodayQuery.loading)
        return <Loading/>;

    return (
        <ScrollView style={s.container}>
            {getScheduleForTodayQuery.data?.getScheduleWithLinksForToday.map((subjectWithLinksForToday, subjectWithLinksForTodayId) => (
                <View key={subjectWithLinksForTodayId} style={s.subject}>
                    <Text>{subjectWithLinksForToday.time} {subjectWithLinksForToday.type} <Text
                        style={s.subjectCabinet}>{subjectWithLinksForToday.cabinet}</Text></Text>
                    <Text style={s.subjectName}>{subjectWithLinksForToday.name}</Text>
                    <Text style={s.subjectTeacher}>{subjectWithLinksForToday.teacher}</Text>
                    <Hyperlink onPress={async (url) => await Linking.openURL(url)} linkStyle={{color: 'blue'}}>
                        <Text>{subjectWithLinksForToday.link}</Text>
                    </Hyperlink>
                </View>
            ))}
        </ScrollView>
    );
};

const s = StyleSheet.create({
    container: {
        flex: 1,
    },
    subject: {
        marginVertical: 5,
        marginHorizontal: 5,
        backgroundColor: '#efefef',
        borderColor: 'grey',
        borderWidth: 1,
    },
    subjectName: {
        fontWeight: 'bold',
        fontSize: 15,
    },
    subjectTeacher: {
        fontWeight: 'bold',
        color: 'grey',
    },
    subjectCabinet: {
        fontWeight: 'bold',
        color: '#d35400',
    },
});

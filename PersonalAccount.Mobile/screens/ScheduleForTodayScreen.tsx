import React from 'react';
import {Linking, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useQuery} from '@apollo/client';
import {
    GET_SCHEDULE_FOR_TODAY_QUERY,
    GetScheduleForTodayData,
    GetScheduleForTodayVars,
} from '../modules/schedule/schedule.queries';
import {Loading} from '../components/Loading';
import Hyperlink from 'react-native-hyperlink';
import {Empty} from '../components/Empty';

export const ScheduleForTodayScreen = () => {
    const getScheduleForTodayQuery = useQuery<GetScheduleForTodayData, GetScheduleForTodayVars>(GET_SCHEDULE_FOR_TODAY_QUERY);

    if (getScheduleForTodayQuery.loading)
        return <Loading/>;

    return (
        <ScrollView style={s.container}>
            {getScheduleForTodayQuery.data?.getScheduleWithLinksForToday || <Empty/>}
            {getScheduleForTodayQuery.data?.getScheduleWithLinksForToday?.map((subjectWithLinksForToday, subjectWithLinksForTodayId) => (
                <View key={subjectWithLinksForTodayId} style={s.subject}>
                    <Text>
                        <Text>{subjectWithLinksForToday.time} {subjectWithLinksForToday.type} </Text>
                        <Text style={s.subjectCabinet}>{subjectWithLinksForToday.cabinet}</Text>
                    </Text>
                    <Text style={s.subjectName}>{subjectWithLinksForToday.name}</Text>
                    <Text style={s.subjectTeacher}>{subjectWithLinksForToday.teacher}</Text>
                    <Hyperlink onPress={async (url) => await Linking.openURL(url)} linkStyle={{color: 'blue'}}>
                        <Text style={s.subjectLink}>{subjectWithLinksForToday.link}</Text>
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
        margin: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderColor: 'grey',
        borderWidth: 1,
        borderRadius: 5,
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

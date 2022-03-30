import React, {useCallback, useEffect, useState} from 'react';
import {Linking, RefreshControl, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useQuery} from '@apollo/client';
import {
    GET_SCHEDULE_FOR_TODAY_QUERY,
    GetScheduleForTodayData,
    GetScheduleForTodayVars,
} from '../modules/schedule/schedule.queries';
import {Loading} from '../components/Loading';
import Hyperlink from 'react-native-hyperlink';
import {Empty} from '../components/Empty';
import {Modal} from '@ant-design/react-native';

export const ScheduleForTodayScreen = () => {
    const [refreshing, setRefreshing] = useState(false);
    const getScheduleForTodayQuery = useQuery<GetScheduleForTodayData, GetScheduleForTodayVars>(GET_SCHEDULE_FOR_TODAY_QUERY);

    useEffect(() => {
        if (getScheduleForTodayQuery.error)
            Modal.alert('Error', getScheduleForTodayQuery.error.message, [{text: 'Ok'}]);
    }, [getScheduleForTodayQuery.error]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getScheduleForTodayQuery.refetch()
            .finally(() => {
                setRefreshing(false);
            });
    }, []);


    if (getScheduleForTodayQuery.loading)
        return <Loading/>;

    return (
        <ScrollView
            style={s.container}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            }
        >
            {getScheduleForTodayQuery.data?.getScheduleForToday.length === 0 && <Empty/>}
            {getScheduleForTodayQuery.data?.getScheduleForToday?.map((subject, subjectId) => (
                <View key={subjectId} style={s.subject}>
                    <Text>
                        <Text>{subject.time} {subject.type} </Text>
                        <Text style={s.subjectCabinet}>{subject.cabinet}</Text>
                    </Text>
                    <Text style={s.subjectName}>{subject.name}</Text>
                    <Text style={s.subjectTeacher}>{subject.teacher}</Text>
                    <Hyperlink onPress={async (url) => await Linking.openURL(url)} linkStyle={{color: 'blue'}}>
                        <Text style={s.subjectLink}>{subject.link}</Text>
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

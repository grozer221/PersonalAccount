import React, {useCallback, useState} from 'react';
import {RefreshControl, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useQuery} from '@apollo/client';
import {useAppSelector} from '../store/store';
import {
    GET_SCHEDULE_FOR_TWO_WEEKS_QUERY,
    GetScheduleForTwoWeeksData,
    GetScheduleForTwoWeeksVars,
} from '../modules/schedule/schedule.queries';
import {Loading} from '../components/Loading';

const subjectTimes = ['8:30-9:50', '10:00-11:20', '11:40-13:00', '13:30-14:50', '15:00-16:20', '16:30-17:50', '18:00-19:20'];

export const ScheduleForTwoWeeksScreen = () => {
    const [refreshing, setRefreshing] = useState(false);
    const getScheduleForTwoWeeksQuery = useQuery<GetScheduleForTwoWeeksData, GetScheduleForTwoWeeksVars>(GET_SCHEDULE_FOR_TWO_WEEKS_QUERY);
    const authData = useAppSelector(state => state.auth.me);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getScheduleForTwoWeeksQuery.refetch()
            .finally(() => {
                setRefreshing(false);
            });
    }, []);

    if (getScheduleForTwoWeeksQuery.loading)
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
            <View style={s.center}>
                <Text style={s.title}>{authData?.user.group}</Text>
            </View>
            {getScheduleForTwoWeeksQuery.data?.getScheduleForTwoWeeks?.map((week, weekId) => (
                <View key={weekId}>
                    <Text style={s.title}>{week.name}</Text>
                    <ScrollView key={weekId} horizontal={true}>
                        <View style={s.table}>
                            {/* row day names */}
                            <View style={s.row}>
                                <View style={[s.cell, s.cellTime]}/>
                                {week.days.map((day, dayId) => (
                                    <View key={dayId} style={[s.cell, s.center]}>
                                        <Text>{day.name}</Text>
                                    </View>
                                ))}
                            </View>
                            {/* schedule */}
                            {subjectTimes.map((subjectTime, subjectTimeId) => {
                                return (
                                    <View key={subjectTimeId} style={s.row}>
                                        <View key={subjectTimeId} style={[s.cell, s.center, s.cellTime]}>
                                            <Text>{subjectTime}</Text>
                                        </View>
                                        {Array.from(Array(week.days.length), (e, i) => {
                                            const subject = week.days[i].subjects.find(s => s.time === subjectTime);
                                            if (!subject)
                                                return <View key={i} style={s.cell}/>;
                                            return (
                                                <View key={i} style={[s.cell, s.center]}>
                                                    <Text style={[s.cellText, s.subjectName]}>{subject?.name}</Text>
                                                    <Text style={s.cellText}>{subject?.type}</Text>
                                                    <Text
                                                        style={[s.cellText, s.subjectCabinet]}>{subject?.cabinet}</Text>
                                                    <Text
                                                        style={[s.cellText, s.subjectTeacher]}>{subject?.teacher}</Text>
                                                </View>
                                            );
                                        })}
                                    </View>
                                );
                            })}
                        </View>
                    </ScrollView>
                </View>
            ))}
        </ScrollView>
    );
};

const s = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 15,
        marginBottom: 2,
        marginHorizontal: 5,
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    table: {
        flex: 1,
    },
    row: {
        flexDirection: 'row',
    },
    cell: {
        width: 150,
        borderWidth: 1,
        borderColor: 'grey',
        padding: 4,
    },
    cellTime: {
        width: 85,
    },
    cellText: {
        textAlign: 'center',
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
});

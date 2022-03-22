import React from 'react';
import {ScrollView, StyleSheet, View, Text} from 'react-native';
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
    const getScheduleForTwoWeeksQuery = useQuery<GetScheduleForTwoWeeksData, GetScheduleForTwoWeeksVars>(GET_SCHEDULE_FOR_TWO_WEEKS_QUERY);
    const authData = useAppSelector(state => state.auth.authData);

    if (getScheduleForTwoWeeksQuery.loading)
        return <Loading/>;

    return (
        <ScrollView style={s.container}>
            <View style={s.center}>
                <Text style={s.title}>{authData?.user.group}</Text>
            </View>
            {getScheduleForTwoWeeksQuery.data?.getScheduleForTwoWeeks?.map((week, weekId) => (
                <View key={weekId}>
                    <Text style={s.title}>{week.name}</Text>
                    <ScrollView key={weekId} horizontal={true}>
                        <View style={s.table}>
                            <View style={s.column}>
                                <View style={[s.cell, s.cellFirstEmpty]}/>
                                {subjectTimes.map((subjectTime, subjectTimeId) => (
                                    <View key={subjectTimeId} style={[s.cell, s.cellTime, s.center]}>
                                        <Text style={s.cellText}>{subjectTime}</Text>
                                    </View>
                                ))}
                            </View>
                            {week.days.map((day, dayId) => (
                                <View key={dayId} style={s.column}>
                                    <View style={[s.cell, s.cellDay, s.center]}>
                                        <Text style={s.cellText}>{day.name}</Text>
                                    </View>
                                    {subjectTimes.map((subjectTime, subjectTimeId) => {
                                        if (day.subjects.some(subject => subject.time === subjectTime)) {
                                            const subject = day.subjects.find(subject => subject.time === subjectTime);
                                            return (
                                                <View key={subjectTimeId} style={[s.cell, s.center]}>
                                                    <Text style={[s.cellText, s.subjectName]}>{subject?.name}</Text>
                                                    <Text style={s.cellText}>{subject?.type}</Text>
                                                    <Text
                                                        style={[s.cellText, s.subjectCabinet]}>{subject?.cabinet}</Text>
                                                    <Text
                                                        style={[s.cellText, s.subjectTeacher]}>{subject?.teacher}</Text>
                                                </View>
                                            );
                                        } else
                                            return (<View key={subjectTimeId} style={s.cell}/>);
                                    })}
                                </View>
                            ))}
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    column: {
        flex: 1,
        alignSelf: 'stretch',
    },
    cell: {
        flex: 1,
        alignSelf: 'stretch',
        borderWidth: 1,
        borderColor: 'grey',
        height: 120,
        width: 150,
        padding: 4,
    },
    cellTime: {
        height: 120,
        width: 85,
    },
    cellDay: {
        height: 30,
        width: 150,
    },
    cellFirstEmpty: {
        height: 30,
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

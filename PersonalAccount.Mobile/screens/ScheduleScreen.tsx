import {StyleSheet} from 'react-native';

import {Text, View} from '../components/Themed';
import {useQuery} from '@apollo/client';
import {
    GET_SCHEDULE_FOR_TWO_WEEKS_QUERY,
    GetScheduleForTwoWeeksData,
    GetScheduleForTwoWeeksVars,
} from '../modules/schedule/schedule.queries';
import {useAppSelector} from '../store/store';

export const ScheduleScreen = () => {
    const getScheduleForTwoWeeksQuery = useQuery<GetScheduleForTwoWeeksData, GetScheduleForTwoWeeksVars>(GET_SCHEDULE_FOR_TWO_WEEKS_QUERY);
    const authData = useAppSelector(state => state.auth.authData);

    if (getScheduleForTwoWeeksQuery.loading)
        return <Text>Loading...</Text>;

    return (
        <View style={styles.container}>
            <Text>{authData?.user.group}</Text>
            {getScheduleForTwoWeeksQuery.data?.getScheduleForTwoWeeks.map(week => (
                <View>
                    <Text>{week.name}</Text>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});

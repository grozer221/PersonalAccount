import React from 'react';
import {StyleSheet} from 'react-native';

import {Text, View} from '../components/Themed';
import {RootTabScreenProps} from '../types';
import {useAppSelector} from '../store/store';

export const HomeScreen = ({navigation}: RootTabScreenProps<'Home'>) => {
    const notificationsToken = useAppSelector(state => state.notifications.notificationsToken);

    return (
        <View style={s.container}>
            <Text>Messages</Text>
        </View>
    );
};

const s = StyleSheet.create({
    container: {
        flex: 1,
    },
});

import {StyleSheet} from 'react-native';

import {Text, View} from '../components/Themed';
import {RootTabScreenProps} from '../types';
import {useAppSelector} from '../store/store';

export const SettingsScreen = ({navigation}: RootTabScreenProps<'Settings'>) => {
    const authData = useAppSelector(state => state.auth.authData)

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Account</Text>
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

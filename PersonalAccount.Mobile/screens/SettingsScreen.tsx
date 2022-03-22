import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import { Link } from 'react-router-native';
import {useAppSelector} from '../store/store';

export const SettingsScreen = () => {
    const authData = useAppSelector(state => state.auth.authData);
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Account</Text>
            <Link to={'/'}>
                <Text>home</Text>
            </Link>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});

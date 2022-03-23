import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {useAppSelector} from '../store/store';

export const HamburgerMenu = () => {
    // const authData = useAppSelector(state => state.auth.authData);

    return (
        <ScrollView style={s.wrapperHamburgerMenu}>
            <View>
                {/*<Text>{authData?.user.email}</Text>*/}
                {/*<Text style={s.group}>{authData?.user.group} ({authData?.user.subGroup})</Text>*/}
            </View>
        </ScrollView>
    );
};

const s = StyleSheet.create({
    wrapperHamburgerMenu: {
        paddingTop: 30,
        paddingBottom: 10,
        paddingHorizontal: 10,
    },
    group: {
        fontSize: 15,
        color: 'grey',
    }
});

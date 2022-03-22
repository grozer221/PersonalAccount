import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

export const HamburgerMenu = () => {
    return (
        <View style={s.wrapperHamburgerMenu}>
            <Text>I'm in the Drawer!</Text>
        </View>
    );
};

const s = StyleSheet.create({
    wrapperHamburgerMenu: {
        paddingTop: 30,
        paddingBottom: 10,
        paddingHorizontal: 10,
    },
});

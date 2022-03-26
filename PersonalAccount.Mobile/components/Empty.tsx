import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

export const Empty = () => {
    return (
        <View style={s.wrapperEmpty}>
            <Text style={s.emptyText}>Empty</Text>
        </View>
    );
};

const s = StyleSheet.create({
    wrapperEmpty: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 24,
    }
});

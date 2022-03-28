import React from 'react';
import {useLocation} from 'react-router-native';
import {StyleSheet, Text} from 'react-native';

export const Breadcrumbs = () => {
    const location = useLocation();
    const withoutFirstSlash = location.pathname.substr(1);
    const withSpaceBetweenWorlds = withoutFirstSlash.replace(/([A-Z])/g, ' $1')

    return (
        <Text style={s.breadcrumbs}>{withSpaceBetweenWorlds}</Text>
    );
};

const s = StyleSheet.create({
    breadcrumbs: {
        fontSize: 18,
    },
});

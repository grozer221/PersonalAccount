import React, {FC} from 'react';
import {ActivityIndicator} from '@ant-design/react-native';
import {StyleSheet} from 'react-native';
import {View} from './Themed';

export const Loading: FC = () => {
    return (
        <View style={s.container}>
            <ActivityIndicator
                animating={true}
                toast
                size="large"
                text="Loading..."
            />
        </View>
    );
};

const s = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

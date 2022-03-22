import React, {FC} from 'react';
import {Link as NativeLink} from 'react-router-native'
import {StyleSheet, Text} from 'react-native';

type Props = {
    to: string,
}

export const Link: FC<Props> = ({children, to}) => {
    return (
        <NativeLink to={to}>
            <Text style={s.link}>{children}</Text>
        </NativeLink>
    );
};

const s = StyleSheet.create({
    link: {
        color: '#00bfff',
    }
});

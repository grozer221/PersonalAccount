import React, {useState} from 'react';
import {SegmentedControl} from '@ant-design/react-native';
import {Login} from '../components/Login';
import {Register} from '../components/Register';
import {StyleSheet, View} from 'react-native';


export enum AuthTabs {
    Login = 'Login',
    Register = 'Register',
}

export const AuthScreen = () => {
    const [selectedTab, setSelectedTab] = useState<AuthTabs>(AuthTabs.Login);

    return (
        <View style={s.container}>
            {selectedTab === AuthTabs.Login && <Login/>}
            {selectedTab === AuthTabs.Register && <Register/>}
            <SegmentedControl
                style={s.switch}
                values={(Object.keys(AuthTabs) as Array<keyof typeof AuthTabs>)}
                onValueChange={(value) => setSelectedTab(value as AuthTabs)}
            />
        </View>
    );
};

const s = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    switch: {
        marginTop: 20
    }
});

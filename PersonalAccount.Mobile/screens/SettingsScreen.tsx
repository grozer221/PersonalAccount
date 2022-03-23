import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useAppSelector} from '../store/store';
import {SegmentedControl} from '@ant-design/react-native';
import {LoginPersonalAccount} from '../components/LoginPersonalAccount';

export enum SettingsTabs {
    ZtuAccount = 'Ztu Account',
    SelectiveSubjects = 'SelectiveSubjects',
}

export const SettingsScreen = () => {
    const authData = useAppSelector(state => state.auth.authData);
    const [selectedTab, setSelectedTab] = useState<SettingsTabs>(SettingsTabs.ZtuAccount);

    return (
        <View style={styles.container}>
            <SegmentedControl
                values={(Object.keys(SettingsTabs) as Array<keyof typeof SettingsTabs>)}
                onValueChange={(value) => setSelectedTab(value as SettingsTabs)}
            />
            {selectedTab === SettingsTabs.ZtuAccount &&
            authData?.user.personalAccount
                ? <Text>Logged in as {authData.user.personalAccount.username}</Text>
                : <LoginPersonalAccount/>
            }
            {selectedTab === SettingsTabs.SelectiveSubjects && <Text>SelectiveSubjects</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {},
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});

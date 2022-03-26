import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useAppDispatch, useAppSelector} from '../store/store';
import {Button, SegmentedControl} from '@ant-design/react-native';
import {LoginPersonalAccount} from '../components/LoginPersonalAccount';
import {useMutation} from '@apollo/client';
import {
    LOGOUT_PERSONAL_ACCOUNT_MUTATION,
    LogoutPersonalAccountData,
    LogoutPersonalAccountVars,
} from '../modules/personalAccounts/personalAccounts.mutations';
import {authActions} from '../modules/auth/auth.slice';

export enum SettingsTabs {
    PersonalAccount = 'PersonalAccount',
    SelectiveSubjects = 'SelectiveSubjects',
}

export const SettingsScreen = () => {
    const authData = useAppSelector(state => state.auth.me);
    const [logoutPersonalAccount, logoutPersonalAccountOptions] = useMutation<LogoutPersonalAccountData, LogoutPersonalAccountVars>(LOGOUT_PERSONAL_ACCOUNT_MUTATION);
    const [selectedTab, setSelectedTab] = useState<SettingsTabs>(SettingsTabs.PersonalAccount);
    const dispatch = useAppDispatch();

    const logoutPersonalAccountHandler = async () => {
        await logoutPersonalAccount();
        dispatch(authActions.setPersonalAccount({personalAccount: null}));
    };

    return (
        <View style={s.container}>
            <SegmentedControl
                values={(Object.keys(SettingsTabs) as Array<keyof typeof SettingsTabs>)}
                onValueChange={(value) => setSelectedTab(value as SettingsTabs)}
            />
            {selectedTab === SettingsTabs.PersonalAccount &&
            <View style={s.personalAccountTab}>
                {authData?.user.personalAccount
                    ? <View>
                        <Text style={[s.greyText, s.mb]}>
                            Logged in as <Text style={s.username}>{authData?.user.personalAccount.username}</Text> {authData.user.group}({authData.user.subGroup})
                        </Text>
                        <Button size={'small'} onPress={() => logoutPersonalAccountHandler()}
                                loading={logoutPersonalAccountOptions.loading}>Logout</Button>
                    </View>
                    : <LoginPersonalAccount/>
                }
            </View>
            }
            {selectedTab === SettingsTabs.SelectiveSubjects && <Text>SelectiveSubjects</Text>}
        </View>
    );
};

const s = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    personalAccountTab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    username: {
        fontSize: 15,
        fontWeight: 'bold',
        color: 'white',
    },
    greyText: {
        color: 'grey',
    },
    mb: {
        marginBottom: 10,
    },
});

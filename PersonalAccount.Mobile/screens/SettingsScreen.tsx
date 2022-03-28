import React, {useCallback, useState} from 'react';
import {RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useAppDispatch, useAppSelector} from '../store/store';
import {Button, Icon, Modal} from '@ant-design/react-native';
import {LoginPersonalAccount} from '../components/LoginPersonalAccount';
import {useMutation, useQuery} from '@apollo/client';
import {
    LOGOUT_PERSONAL_ACCOUNT_MUTATION,
    LogoutPersonalAccountData,
    LogoutPersonalAccountVars,
} from '../modules/personalAccounts/personalAccounts.mutations';
import {authActions} from '../modules/auth/auth.slice';
import {GET_ALL_GROUPS_QUERY, GetAllGroupsData, GetAllGroupsVars} from '../modules/schedule/schedule.queries';
import {Loading} from '../components/Loading';
import {UpdateGroup} from '../components/UpdateGroup';
import {UpdateEnglishSubGroup} from '../components/UpdateEnglishSubGroup';
import {UpdateMinutesBeforeLessonNotification} from '../components/UpdateMinutesBeforeLessonNotification';

export const SettingsScreen = () => {
    const [refreshing, setRefreshing] = useState(false);
    const me = useAppSelector(state => state.auth.me);
    const dispatch = useAppDispatch();
    const getAllGroups = useQuery<GetAllGroupsData, GetAllGroupsVars>(GET_ALL_GROUPS_QUERY);

    const [logoutPersonalAccount, logoutPersonalAccountOptions] = useMutation<LogoutPersonalAccountData, LogoutPersonalAccountVars>(LOGOUT_PERSONAL_ACCOUNT_MUTATION);
    const [loginFormVisible, setLoginFormVisible] = useState(false);

    const logoutPersonalAccountHandler = async () => {
        await logoutPersonalAccount();
        dispatch(authActions.setPersonalAccount({personalAccount: null}));
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 1);
    }, []);

    if (getAllGroups.loading || refreshing)
        return <Loading/>;

    return (
        <ScrollView
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            }
        >
            <View style={settingsStyle.divider}>
                <View style={settingsStyle.container}>
                    <Text style={settingsStyle.dividerTitle}>Personal Account</Text>
                    {me?.user.personalAccount
                        ? <View>
                            <Text style={[settingsStyle.greyText, settingsStyle.mb]}>
                                <Text>Logged in as </Text>
                                <Text style={settingsStyle.username}>{me?.user.personalAccount.username} </Text>
                                <Text>{me.user.group}({me.user.subGroup}) </Text>
                            </Text>
                            <Button size={'small'}
                                    onPress={() => logoutPersonalAccountHandler()}
                                    loading={logoutPersonalAccountOptions.loading}
                            >
                                Logout
                            </Button>
                        </View>
                        : <View>
                            <Text style={[settingsStyle.greyText, settingsStyle.mb]}>You are not logged in</Text>
                            <Button
                                size={'small'}
                                onPress={() => setLoginFormVisible(true)}
                            >
                                Login
                            </Button>
                        </View>
                    }
                </View>
            </View>
            <View style={settingsStyle.divider}>
                <View style={settingsStyle.container}>
                    <Text style={settingsStyle.dividerTitle}>My Group</Text>
                    <UpdateGroup getAllGroups={getAllGroups}/>
                </View>
            </View>
            <View style={settingsStyle.divider}>
                <View style={settingsStyle.container}>
                    <Text style={settingsStyle.dividerTitle}>Selective subjects</Text>
                    <UpdateEnglishSubGroup/>
                </View>
            </View>
            <View style={settingsStyle.divider}>
                <View style={settingsStyle.container}>
                    <Text style={settingsStyle.dividerTitle}>Minutes before lesson notification</Text>
                    <UpdateMinutesBeforeLessonNotification/>
                </View>
            </View>

            <Modal
                transparent={true}
                visible={loginFormVisible}
                animationType="slide-up"
                onClose={() => setLoginFormVisible(false)}
            >
                <View style={settingsStyle.buttonClose}>
                    <Text>Login In Personal Account</Text>
                    <TouchableOpacity onPress={() => setLoginFormVisible(false)}>
                        <Icon name={'close'}/>
                    </TouchableOpacity>
                </View>
                <LoginPersonalAccount onLoginSuccess={() => setLoginFormVisible(false)}/>
            </Modal>
        </ScrollView>
    );
};

export const settingsStyle = StyleSheet.create({
    container: {
        marginHorizontal: 10,
    },
    divider: {
        paddingVertical: 20,
        borderBottomColor: 'grey',
        borderBottomWidth: 1,
    },
    dividerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
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
    picker: {
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 4,
    },
    buttonClose: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {useAppDispatch, useAppSelector} from '../store/store';
import {Button, Modal} from '@ant-design/react-native';
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
import {
    UPDATE_ENGLISH_SUBGROUP_MUTATION,
    UPDATE_GROUP_MUTATION,
    UpdateEnglishSubGroupData,
    UpdateEnglishSubGroupVars,
    UpdateGroupData,
    UpdateGroupVars,
} from '../modules/users/users.mutations';

export const SettingsScreen = () => {
    const me = useAppSelector(state => state.auth.me);
    const dispatch = useAppDispatch();

    const [logoutPersonalAccount, logoutPersonalAccountOptions] = useMutation<LogoutPersonalAccountData, LogoutPersonalAccountVars>(LOGOUT_PERSONAL_ACCOUNT_MUTATION);
    const [loginFormVisible, setLoginFormVisible] = useState(false);

    const getAllGroups = useQuery<GetAllGroupsData, GetAllGroupsVars>(GET_ALL_GROUPS_QUERY);
    const [group, setGroup] = useState(me?.user.group || '');
    const [subGroup, setSubGroup] = useState<'1' | '2'>((me?.user.subGroup.toString() as '1' | '2') || '1');
    const [updateGroup, updateGroupOptions] = useMutation<UpdateGroupData, UpdateGroupVars>(UPDATE_GROUP_MUTATION);

    const [updateEnglishSubGroup, updateEnglishSubGroupOptions] = useMutation<UpdateEnglishSubGroupData, UpdateEnglishSubGroupVars>(UPDATE_ENGLISH_SUBGROUP_MUTATION);
    const [englishSubGroup, setEnglishSubGroup] = useState<'1' | '2'>((me?.user.englishSubGroup?.toString() as '1' | '2') || '1');

    const logoutPersonalAccountHandler = async () => {
        await logoutPersonalAccount();
        dispatch(authActions.setPersonalAccount({personalAccount: null}));
    };

    const updateGroupHandler = (): void => {
        updateGroup({variables: {group: group, subGroup: parseInt(subGroup)}})
            .then(response => {
                dispatch(authActions.setGroup({group: group, subGroup: parseInt(subGroup)}));
            })
            .catch(error => {
                Modal.alert('Error', error.message, [{text: 'Ok'}]);
            });
    };

    const updateEnglishSubGroupHandler = (): void => {
        const englishSubGroupNumber = parseInt(englishSubGroup);
        updateEnglishSubGroup({variables: {englishSubGroup: englishSubGroupNumber}})
            .then(response => {
                dispatch(authActions.setEnglishSubGroup(englishSubGroupNumber));
            })
            .catch(error => {
                Modal.alert('Error', error.message, [{text: 'Ok'}]);
            });
    };

    if (getAllGroups.loading)
        return <Loading/>;

    return (
        <ScrollView>
            <View style={s.divider}>
                <View style={s.container}>
                    <Text style={s.dividerTitle}>Personal Account</Text>
                    {me?.user.personalAccount
                        ? <View>
                            <Text style={[s.greyText, s.mb]}>
                                <Text>Logged in as </Text>
                                <Text style={s.username}>{me?.user.personalAccount.username} </Text>
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
                            <Text style={[s.greyText, s.mb]}>You are not logged in</Text>
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
            {!me?.user.personalAccount && (
                <View style={s.divider}>
                    <View style={s.container}>
                        <Text style={s.dividerTitle}>My Group</Text>
                        <Text style={[s.greyText, s.mb]}>Group</Text>
                        <View style={[s.picker, s.mb]}>
                            <Picker
                                selectedValue={group}
                                style={{height: 50}}
                                onValueChange={(itemValue) => setGroup(itemValue)}
                            >
                                {getAllGroups.data?.getAllGroups.map(group => (
                                    <Picker.Item label={group} value={group}/>
                                ))}
                            </Picker>
                        </View>
                        <Text style={[s.greyText, s.mb]}>Sub group</Text>
                        <View style={[s.picker, s.mb]}>
                            <Picker
                                selectedValue={subGroup}
                                style={{height: 50}}
                                onValueChange={(itemValue) => setSubGroup(itemValue)}
                            >
                                <Picker.Item label="1" value="1"/>
                                <Picker.Item label="2" value="2"/>
                            </Picker>
                        </View>
                        <Button size={'small'} onPress={updateGroupHandler} loading={updateGroupOptions.loading}>
                            Save
                        </Button>
                    </View>
                </View>
            )}
            <View style={s.divider}>
                <View style={s.container}>
                    <Text style={s.dividerTitle}>Selective subjects</Text>
                    <Text style={[s.greyText, s.mb]}>English sub group</Text>
                    <View style={[s.picker, s.mb]}>
                        <Picker
                            selectedValue={englishSubGroup}
                            style={{height: 50}}
                            onValueChange={(itemValue) => setEnglishSubGroup(itemValue)}
                        >
                            <Picker.Item label="1" value="1"/>
                            <Picker.Item label="2" value="2"/>
                        </Picker>
                    </View>
                    <Button size={'small'}
                            onPress={updateEnglishSubGroupHandler}
                            loading={updateEnglishSubGroupOptions.loading}
                    >
                        Save
                    </Button>
                </View>
            </View>
            <View style={s.divider}>
                <View style={s.container}>
                    <Text style={s.dividerTitle}>Else</Text>
                </View>
            </View>

            <Modal
                transparent={true}
                closable={true}
                visible={loginFormVisible}
                animationType="slide-up"
                onClose={() => setLoginFormVisible(false)}
            >
                <LoginPersonalAccount onLoginSuccess={() => setLoginFormVisible(false)}/>
            </Modal>
        </ScrollView>
    );
};

const s = StyleSheet.create({
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
});

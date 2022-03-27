import React, {FC, useState} from 'react';
import {Text, View} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {Button, Modal} from '@ant-design/react-native';
import {authActions} from '../modules/auth/auth.slice';
import {QueryResult, useMutation} from '@apollo/client';
import {UPDATE_GROUP_MUTATION, UpdateGroupData, UpdateGroupVars} from '../modules/users/users.mutations';
import {useAppDispatch, useAppSelector} from '../store/store';
import {GetAllGroupsData, GetAllGroupsVars} from '../modules/schedule/schedule.queries';
import {settingsStyle} from '../screens/SettingsScreen';

type Props = {
    getAllGroups: QueryResult<GetAllGroupsData, GetAllGroupsVars>,
}

export const UpdateGroup: FC<Props> = ({getAllGroups}) => {
    const me = useAppSelector(state => state.auth.me);
    const dispatch = useAppDispatch();
    const [group, setGroup] = useState(me?.user.group || '');
    const [subGroup, setSubGroup] = useState<'1' | '2'>((me?.user.subGroup.toString() as '1' | '2') || '1');
    const [updateGroup, updateGroupOptions] = useMutation<UpdateGroupData, UpdateGroupVars>(UPDATE_GROUP_MUTATION);

    const updateGroupHandler = (): void => {
        updateGroup({variables: {group: group, subGroup: parseInt(subGroup)}})
            .then(response => {
                dispatch(authActions.setGroup({group: group, subGroup: parseInt(subGroup)}));
            })
            .catch(error => {
                Modal.alert('Error', error.message, [{text: 'Ok'}]);
            });
    };

    return (
        <>
            <Text style={[settingsStyle.greyText, settingsStyle.mb]}>Group</Text>
            <View style={[settingsStyle.picker, settingsStyle.mb]}>
                <Picker
                    selectedValue={group}
                    style={{height: 50}}
                    onValueChange={(itemValue) => setGroup(itemValue)}
                >
                    {getAllGroups.data?.getAllGroups.map(group => (
                        <Picker.Item key={group} label={group} value={group}/>
                    ))}
                </Picker>
            </View>
            <Text style={[settingsStyle.greyText, settingsStyle.mb]}>Sub group</Text>
            <View style={[settingsStyle.picker, settingsStyle.mb]}>
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
        </>
    );
};

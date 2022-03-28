import React, {FC, useState} from 'react';
import {Text, View} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {Button, Modal} from '@ant-design/react-native';
import {settingsStyle} from '../screens/SettingsScreen';
import {authActions} from '../modules/auth/auth.slice';
import {useMutation} from '@apollo/client';
import {
    UPDATE_ENGLISH_SUBGROUP_MUTATION,
    UpdateEnglishSubGroupData,
    UpdateEnglishSubGroupVars,
} from '../modules/users/users.mutations';
import {useAppDispatch, useAppSelector} from '../store/store';

export const UpdateEnglishSubGroup: FC = () => {
    const me = useAppSelector(state => state.auth.me);
    const dispatch = useAppDispatch();

    const [updateEnglishSubGroup, updateEnglishSubGroupOptions] = useMutation<UpdateEnglishSubGroupData, UpdateEnglishSubGroupVars>(UPDATE_ENGLISH_SUBGROUP_MUTATION);
    const [englishSubGroup, setEnglishSubGroup] = useState<1 | 2>((me?.user.englishSubGroup as 1 | 2) || 1);

    const updateEnglishSubGroupHandler = (): void => {
        updateEnglishSubGroup({variables: {englishSubGroup}})
            .then(response => {
                dispatch(authActions.setEnglishSubGroup(englishSubGroup));
            })
            .catch(error => {
                Modal.alert('Error', error.message, [{text: 'Ok'}]);
            });
    };

    return (
        <>
            <Text style={[settingsStyle.greyText, settingsStyle.mb]}>English sub group</Text>
            <View style={[settingsStyle.picker, settingsStyle.mb]}>
                <Picker
                    selectedValue={englishSubGroup}
                    style={{height: 50}}
                    onValueChange={(itemValue) => setEnglishSubGroup(itemValue)}
                >
                    <Picker.Item label="1" value={1}/>
                    <Picker.Item label="2" value={2}/>
                </Picker>
            </View>
            <Button
                size={'small'}
                onPress={updateEnglishSubGroupHandler}
                loading={updateEnglishSubGroupOptions.loading}
            >
                Save
            </Button>
        </>
    );
};

import React, {FC, useState} from 'react';
import {useMutation} from '@apollo/client';
import {Button, Select} from 'antd';
import {authActions} from '../../modules/auth/auth.slice';
import {
    UPDATE_ENGLISH_SUBGROUP_MUTATION,
    UpdateEnglishSubGroupData,
    UpdateEnglishSubGroupVars,
} from '../../modules/users/users.mutations';
import {useAppDispatch, useAppSelector} from '../../store/store';
import {messageUtils} from '../../utills/messageUtils';

export const UpdateEnglishSubGroup: FC = () => {
    const me = useAppSelector(s => s.auth.me);
    const dispatch = useAppDispatch();

    const [updateEnglishSubGroup, updateEnglishSubGroupOptions] = useMutation<UpdateEnglishSubGroupData, UpdateEnglishSubGroupVars>(UPDATE_ENGLISH_SUBGROUP_MUTATION);
    const [englishSubGroup, setEnglishSubGroup] = useState<1 | 2>((me?.user.englishSubGroup as 1 | 2) || 1);

    const updateEnglishSubGroupHandler = (): void => {
        updateEnglishSubGroup({variables: {englishSubGroup}})
            .then(response => {
                dispatch(authActions.setEnglishSubGroup(englishSubGroup));
                messageUtils.success();
            })
            .catch(error => {
                messageUtils.success(error.message);
            });
    };

    return (
        <>
            <div className={'label'}>English subgroup</div>
            <Select value={englishSubGroup} onChange={setEnglishSubGroup}>
                <Select.Option value={1}>1</Select.Option>
                <Select.Option value={2}>2</Select.Option>
            </Select>
            <Button
                size={'small'}
                onClick={updateEnglishSubGroupHandler}
                loading={updateEnglishSubGroupOptions.loading}
            >
                Save
            </Button>
        </>
    );
};

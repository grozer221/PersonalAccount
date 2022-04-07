import React, {FC, useState} from 'react';
import {QueryResult, useMutation} from '@apollo/client';
import {GetAllGroupsData, GetAllGroupsVars} from '../../modules/schedule/schedule.queries';
import {useAppDispatch, useAppSelector} from '../../store/store';
import {UPDATE_GROUP_MUTATION, UpdateGroupData, UpdateGroupVars} from '../../modules/users/users.mutations';
import {authActions} from '../../modules/auth/auth.slice';
import {Button, Select} from 'antd';
import {messageUtils} from '../../utills/messageUtils';

const {Option} = Select;

type Props = {
    getAllGroups: QueryResult<GetAllGroupsData, GetAllGroupsVars>,
}

export const UpdateGroup: FC<Props> = ({getAllGroups}) => {
    const me = useAppSelector(state => state.auth.me);
    const dispatch = useAppDispatch();
    const [group, setGroup] = useState(me?.user.group || '');
    const [subGroup, setSubGroup] = useState<1 | 2>((me?.user.subGroup as 1 | 2) || 1);
    const [updateGroup, updateGroupOptions] = useMutation<UpdateGroupData, UpdateGroupVars>(UPDATE_GROUP_MUTATION);

    const updateGroupHandler = (): void => {
        updateGroup({variables: {group: group, subGroup: subGroup}})
            .then(response => {
                dispatch(authActions.setGroup({group: group, subGroup: subGroup}));
                messageUtils.success();
            })
            .catch(error => {
                messageUtils.error(error.message);
            });
    };

    return (
        <>
            {!me?.user.personalAccount && (
                <>
                    <div className={'label'}>Group</div>
                    <Select value={group} onChange={setGroup}>
                        {getAllGroups.data?.getAllGroups.map(group => (
                            <Option key={group} value={group}>{group}</Option>
                        ))}
                    </Select>
                </>
            )}

            <div className={'label'}>Subgroup</div>
            <Select value={subGroup} onChange={setSubGroup}>
                <Option value={1}>1</Option>
                <Option value={2}>2</Option>
            </Select>
            <Button size={'small'} onClick={updateGroupHandler} loading={updateGroupOptions.loading}>
                Save
            </Button>
        </>
    );
};

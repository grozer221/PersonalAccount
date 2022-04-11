import React, {FC, useState} from 'react';
import {useMutation, useQuery} from '@apollo/client';
import {useAppDispatch, useAppSelector} from '../../store/store';
import {UPDATE_SETTINGS_MUTATION, UpdateSettingsData, UpdateSettingsVars} from '../../modules/users/users.mutations';
import {authActions} from '../../modules/auth/auth.slice';
import {messageUtils} from '../../utills/messageUtils';
import {Button, Select} from 'antd';
import {GET_ALL_GROUPS_QUERY, GetAllGroupsData, GetAllGroupsVars} from '../../modules/schedule/schedule.queries';
import {Loading} from '../Loading/Loading';

export const UpdateSettings: FC = () => {
    const me = useAppSelector(s => s.auth.me);
    const dispatch = useAppDispatch();
    const getAllGroups = useQuery<GetAllGroupsData, GetAllGroupsVars>(GET_ALL_GROUPS_QUERY);
    const [searchGroupLike, setSearchGroupLike] = useState('');

    const [group, setGroup] = useState(me?.user.settings.group || '');
    const [subGroup, setSubGroup] = useState<1 | 2>((me?.user.settings.subGroup as 1 | 2) || 1);
    const [englishSubGroup, setEnglishSubGroup] = useState<1 | 2>((me?.user.settings.englishSubGroup as 1 | 2) || 1);
    const [minutesBeforeLessonNotification, setMinutesBeforeLessonNotification] = useState(me?.user.settings.minutesBeforeLessonNotification || 5);
    const [minutesBeforeLessonsNotification, setMinutesBeforeLessonsNotification] = useState(me?.user.settings.minutesBeforeLessonsNotification || 20);

    const [updateSettings, updateSettingsOptions] = useMutation<UpdateSettingsData, UpdateSettingsVars>(UPDATE_SETTINGS_MUTATION);

    const updateSettingsHandler = (): void => {
        updateSettings({
            variables: {
                updateSettingsInputType: {
                    group,
                    subGroup,
                    englishSubGroup,
                    minutesBeforeLessonNotification,
                    minutesBeforeLessonsNotification,
                },
            },
        })
            .then(response => {
                if (response.data) {
                    dispatch(authActions.setUserSettings(response.data.updateSettings));
                    messageUtils.success();
                }
            })
            .catch(error => {
                messageUtils.error(error.message);
            });
    };

    if (getAllGroups.loading)
        return <Loading/>;

    return (
        <>
            {!me?.user.settings.personalAccount && (
                <>
                    <div className={'label'}>Group</div>
                    <Select value={group} onChange={setGroup} showSearch onSearch={setSearchGroupLike}>
                        {getAllGroups.data?.getAllGroups.map(group => {
                            if (group.toUpperCase().indexOf(searchGroupLike) !== -1 && searchGroupLike)
                                return;
                            return (
                                <Select.Option key={group} value={group}>{group}</Select.Option>
                            );
                        })}
                    </Select>
                </>
            )}

            <div className={'label'}>Subgroup</div>
            <Select value={subGroup} onChange={setSubGroup}>
                <Select.Option value={1}>1</Select.Option>
                <Select.Option value={2}>2</Select.Option>
            </Select>

            <div className={'label'}>English subgroup</div>
            <Select value={englishSubGroup} onChange={setEnglishSubGroup}>
                <Select.Option value={1}>1</Select.Option>
                <Select.Option value={2}>2</Select.Option>
            </Select>

            <div className={'label'}>Minutes before lesson notification</div>
            <Select value={minutesBeforeLessonNotification} onChange={setMinutesBeforeLessonNotification}>
                {Array.from(Array(30), (e, i) => {
                    const number = i + 1;
                    return (
                        <Select.Option key={number} value={number}>{number}</Select.Option>
                    );
                })}
            </Select>
            <div className={'label'}>Minutes before lessons notification</div>
            <Select value={minutesBeforeLessonsNotification} onChange={setMinutesBeforeLessonsNotification}>
                {Array.from(Array(60), (e, i) => {
                    const number = i + 1;
                    return (
                        <Select.Option key={number} value={number}>{number}</Select.Option>
                    );
                })}
            </Select>
            <Button
                size={'small'}
                onClick={updateSettingsHandler}
                loading={updateSettingsOptions.loading}
            >
                Save
            </Button>
        </>
    );
};

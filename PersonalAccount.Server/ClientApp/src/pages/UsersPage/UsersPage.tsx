import React, {FC, useState} from 'react';
import {Avatar, Space, Table} from 'antd';
import {ColumnsType} from 'antd/es/table';
import {User} from '../../modules/users/users.types';
import {ButtonsVUR} from '../../components/ButtonsVUD/ButtonsVUR';
import {useMutation, useQuery} from '@apollo/client';
import {GET_USERS_QUERY, GetUsersData, GetUsersVars} from '../../modules/users/users.queries';
import Title from 'antd/es/typography/Title';
import {REMOVE_USER_MUTATION, RemoveUserData, RemoveUserVars} from '../../modules/users/users.mutations';
import {messageUtils} from '../../utills/messageUtils';
import {useAppSelector} from '../../store/store';
import {Loading} from '../../components/Loading/Loading';

export const UsersPage: FC = () => {
    const me = useAppSelector(s => s.auth.me);
    const [page] = useState(1);
    const getUsers = useQuery<GetUsersData, GetUsersVars>(GET_USERS_QUERY, {variables: {page}});
    const [removeUser, removeUserOptions] = useMutation<RemoveUserData, RemoveUserVars>(REMOVE_USER_MUTATION);

    const onRemove = (userId: string): void => {
        removeUser({variables: {userId}})
            .then(response => {
                messageUtils.success('Successfully deleted');
                getUsers.refetch({page});
            })
            .catch(error => {
                messageUtils.error(error.message);
            });
    };

    const columns: ColumnsType<User> = [
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Group',
            dataIndex: 'group',
            key: 'group',
            render: (text, user) => (<>{user.group}({user.subGroup})</>),
        },
        {
            title: 'Personal Account',
            dataIndex: 'personalAccount',
            key: 'personalAccount',
            render: (text, user) => (<>{user.personalAccount?.username}</>),
        },
        {
            title: 'Telegram Account',
            dataIndex: 'telegramAccount',
            key: 'telegramAccount',
            render: (text, user) => (
                user.telegramAccount && (
                    <Space>
                        <span>@{user.telegramAccount?.username}</span>
                        <span>{user.telegramAccount?.firstname} {user.telegramAccount?.lastname}</span>
                        <Avatar src={user.telegramAccount?.photoUrl}/>
                    </Space>
                )
            ),
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            key: 'actions',
            width: '130px',
            render: (text, user) => (
                me?.user.id !== user.id && (
                    <ButtonsVUR
                        viewUrl={`${user?.id}`}
                        updateUrl={`update/${user?.id}`}
                        onRemove={() => onRemove(user.id)}
                    />
                )
            ),
        },
    ];

    if (getUsers.loading)
        return <Loading/>;

    return (
        <>
            <Title level={2}>Users</Title>
            <Table
                columns={columns}
                dataSource={getUsers.data?.getUsers.entities}
                pagination={{
                    defaultPageSize: getUsers.data?.getUsers.pageSize,
                    total: getUsers.data?.getUsers.total,
                }}
            />
        </>
    );
};

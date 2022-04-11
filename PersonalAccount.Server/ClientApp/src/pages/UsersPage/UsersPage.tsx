import React, {FC, useState} from 'react';
import {Avatar, Space, Table, Tooltip} from 'antd';
import {ColumnsType} from 'antd/es/table';
import {User} from '../../modules/users/users.types';
import {ButtonsVUR} from '../../components/ButtonsVUD/ButtonsVUR';
import {useMutation, useQuery} from '@apollo/client';
import {GET_USERS_QUERY, GetUsersData, GetUsersVars} from '../../modules/users/users.queries';
import Title from 'antd/es/typography/Title';
import {REMOVE_USER_MUTATION, RemoveUserData, RemoveUserVars} from '../../modules/users/users.mutations';
import {messageUtils} from '../../utills/messageUtils';
import {useAppDispatch, useAppSelector} from '../../store/store';
import {Loading} from '../../components/Loading/Loading';
import {LoginOutlined} from '@ant-design/icons';
import s from './Users.module.css';
import {LOGIN_AS_USER_MUTATION, LoginAsUserData, LoginAsUserVars} from '../../modules/auth/auth.mutations';
import {authActions} from '../../modules/auth/auth.slice';
import {client} from '../../gql/client';
import {localStorageUtils} from '../../utills/localStorageUtils';

export const UsersPage: FC = () => {
    const me = useAppSelector(s => s.auth.me);
    const [page] = useState(1);
    const dispatch = useAppDispatch();
    const getUsers = useQuery<GetUsersData, GetUsersVars>(GET_USERS_QUERY, {variables: {page}});
    const [removeUser, removeUserOptions] = useMutation<RemoveUserData, RemoveUserVars>(REMOVE_USER_MUTATION);
    const [loginAsUser, loginAsUserOptions] = useMutation<LoginAsUserData, LoginAsUserVars>(LOGIN_AS_USER_MUTATION);

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

    const loginAsUserHandler = (userId: string) => {
        loginAsUser({variables: {userId}})
            .then(async response => {
                if (response.data) {
                    localStorageUtils.enableLoginAsUserMode(response.data.loginAsUser.token);
                    dispatch(authActions.setIsEnabledLoginAsUserMode(true));
                    dispatch(authActions.setAuth({me: response.data?.loginAsUser, isAuth: true}));
                    await client.cache.reset();
                    messageUtils.success('Login As User Mode is enabled');
                } else {
                    messageUtils.error('Data is empty');
                }
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
            render: (text, user) => (
                <a target={'_blank'}
                   href={`https://rozklad.ztu.edu.ua/schedule/group/${user.settings.group}`}
                >
                    {user.settings.group}({user.settings.subGroup})
                </a>
            ),
        },
        {
            title: 'Personal Account',
            dataIndex: 'personalAccount',
            key: 'personalAccount',
            render: (text, user) => (<>{user.settings.personalAccount?.username}</>),
        },
        {
            title: 'Telegram Account',
            dataIndex: 'telegramAccount',
            key: 'telegramAccount',
            render: (text, user) => (
                user.settings.telegramAccount && (
                    <a target={'_blank'}
                       href={`https://web.telegram.org/z/#${user.settings.telegramAccount.telegramId}`}
                    >
                        <Space>
                            <span>@{user.settings.telegramAccount?.username}</span>
                            <span>{user.settings.telegramAccount?.firstname} {user.settings.telegramAccount?.lastname}</span>
                            <Avatar src={user.settings.telegramAccount?.photoUrl}/>
                        </Space>
                    </a>
                )
            ),
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            key: 'actions',
            width: '162px',
            render: (text, user) => (
                me?.user.id !== user.id && (
                    <Space>
                        <ButtonsVUR
                            viewUrl={`${user?.id}`}
                            updateUrl={`update/${user?.id}`}
                            onRemove={() => onRemove(user.id)}
                        />
                        <Tooltip title={`Login as user`}>
                            <div className={s.buttonLoginAsUser} onClick={() => loginAsUserHandler(user.id)}>
                                <Avatar size={28} icon={<LoginOutlined/>}/>
                            </div>
                        </Tooltip>
                    </Space>
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
                rowKey={'id'}
            />
        </>
    );
};

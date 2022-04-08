import React, {useState} from 'react';
import {Avatar, Button, Divider, Modal, Popconfirm, Space} from 'antd';
import {useAppDispatch, useAppSelector} from '../../store/store';
import {Loading} from '../../components/Loading/Loading';
import {authActions} from '../../modules/auth/auth.slice';
import {useMutation, useQuery} from '@apollo/client';
import {GET_ALL_GROUPS_QUERY, GetAllGroupsData, GetAllGroupsVars} from '../../modules/schedule/schedule.queries';
import {
    LOGOUT_PERSONAL_ACCOUNT_MUTATION,
    LogoutPersonalAccountData,
    LogoutPersonalAccountVars,
} from '../../modules/personalAccounts/personalAccounts.mutations';
import s from './SettingsPage.module.css';
import {UpdateGroup} from '../../components/UpdateGroup/UpdateGroup';
import {UpdateEnglishSubGroup} from '../../components/UpdateEnglishSubGroup/UpdateEnglishSubGroup';
import {messageUtils} from '../../utills/messageUtils';
import {UpdateMinutesBeforeLessonNotification} from '../../components/UpdateMinutesBeforeLessonNotification/UpdateMinutesBeforeLessonNotification';
import {LoginPersonalAccount} from '../../components/LoginPersonalAccount/LoginPersonalAccount';
import {TLoginButton, TLoginButtonSize, TUser} from 'react-telegram-auth';
import {
    LOGIN_TELEGRAM_ACCOUNT_MUTATION,
    LoginTelegramAccountData,
    LoginTelegramAccountVars,
    LOGOUT_TELEGRAM_ACCOUNT_MUTATION,
    LogoutTelegramAccountData,
    LogoutTelegramAccountVars,
} from '../../modules/telegramAccounts/telegramAccounts.mutations';
import {REMOVE_ME_MUTATION, RemoveMeData, RemoveMeVars} from '../../modules/auth/auth.mutations';

export const SettingsPage = () => {
    const me = useAppSelector(state => state.auth.me);
    const dispatch = useAppDispatch();
    const getAllGroups = useQuery<GetAllGroupsData, GetAllGroupsVars>(GET_ALL_GROUPS_QUERY);

    const [logoutPersonalAccount, logoutPersonalAccountOptions] = useMutation<LogoutPersonalAccountData, LogoutPersonalAccountVars>(LOGOUT_PERSONAL_ACCOUNT_MUTATION);
    const [loginFormVisible, setLoginFormVisible] = useState(false);

    const [loginTelegramAccount, loginTelegramAccountOptions] = useMutation<LoginTelegramAccountData, LoginTelegramAccountVars>(LOGIN_TELEGRAM_ACCOUNT_MUTATION);
    const [logoutTelegramAccount, logoutTelegramAccountOptions] = useMutation<LogoutTelegramAccountData, LogoutTelegramAccountVars>(LOGOUT_TELEGRAM_ACCOUNT_MUTATION);

    const [removeMe, removeMeOptions] = useMutation<RemoveMeData, RemoveMeVars>(REMOVE_ME_MUTATION);

    const logoutPersonalAccountHandler = async () => {
        logoutPersonalAccount()
            .then(response => {
                dispatch(authActions.setPersonalAccount({personalAccount: null}));
                messageUtils.success('Successfully logout');
            })
            .catch(error => {
                messageUtils.error(error.message);
            });
    };

    const loginTelegramAccountHandler = async (user: TUser) => {
        loginTelegramAccount({
            variables: {
                telegramAccountLoginInputType: {
                    telegramId: user.id,
                    username: user.username,
                    firstname: user.first_name,
                    lastname: user.last_name,
                    photoUrl: user.photo_url,
                    hash: user.hash,
                    authDate: new Date(user.auth_date),
                },
            },
        })
            .then(response => {
                response.data && dispatch(authActions.setTelegramAccount({telegramAccount: response.data.loginTelegramAccount}));
                messageUtils.success('Successfully login');
            })
            .catch(error => {
                messageUtils.error(error.message);
            });
    };

    const logoutTelegramAccountHandler = async () => {
        logoutTelegramAccount()
            .then(response => {
                dispatch(authActions.setTelegramAccount({telegramAccount: null}));
                messageUtils.success('Successfully logout');
            })
            .catch(error => {
                messageUtils.error(error.message);
            });
    };

    const onRemoveMe = () => {
        removeMe()
            .then(response => {
                dispatch(authActions.setAuth({me: null, isAuth: false}));
                messageUtils.success('Successfully removed your account');
            })
            .catch(error => {
                messageUtils.error(error.message);
            });
    };

    if (getAllGroups.loading)
        return <Loading/>;

    return (
        <div>
            <Divider>Personal Account</Divider>
            <div className={s.container}>
                {me?.user.personalAccount
                    ? <>
                        <div>
                            <span>Logged in as </span>
                            <span className={s.username}>{me?.user.personalAccount.username} </span>
                            <span>{me.user.group}({me.user.subGroup})</span>
                        </div>
                        <Button size={'small'}
                                onClick={logoutPersonalAccountHandler}
                                loading={logoutPersonalAccountOptions.loading}
                        >
                            Logout
                        </Button>
                    </>
                    : <>
                        <div className={'label'}>You are not logged in</div>
                        <Button
                            size={'small'}
                            onClick={() => setLoginFormVisible(true)}
                        >
                            Login
                        </Button>
                    </>
                }
            </div>

            <Divider>Telegram Account</Divider>
            <div className={s.container}>
                {me?.user.telegramAccount
                    ? <>
                        <Space align={'end'}>
                            <span>Logged in as</span>
                            <span className={s.username}>
                                @{me?.user.telegramAccount.username} {me?.user.telegramAccount.firstname} {me?.user.telegramAccount.lastname}
                            </span>
                            <Avatar src={me?.user.telegramAccount.photoUrl}/>
                        </Space>
                        <Button size={'small'}
                                onClick={logoutTelegramAccountHandler}
                                loading={logoutTelegramAccountOptions.loading}
                        >
                            Logout
                        </Button>
                    </>
                    : <>
                        <div className={'label'}>You are not logged in</div>
                        <TLoginButton
                            botName="ZTUPersonalAccountBot"
                            buttonSize={TLoginButtonSize.Large}
                            lang="en"
                            cornerRadius={10}
                            onAuthCallback={loginTelegramAccountHandler}
                            requestAccess={'write'}
                        />
                    </>
                }

            </div>

            <Divider>My Group</Divider>
            <div className={s.container}>
                <UpdateGroup getAllGroups={getAllGroups}/>
            </div>

            <Divider>English Subgroup</Divider>
            <div className={s.container}>
                <UpdateEnglishSubGroup/>
            </div>

            <Divider>Minutes before lesson notification</Divider>
            <div className={s.container}>
                <UpdateMinutesBeforeLessonNotification/>
            </div>

            <Divider>Account</Divider>
            <div className={s.container}>
                <Popconfirm
                    title="Confirm that you want to delete your account?"
                    onConfirm={onRemoveMe}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button size={'small'} loading={removeMeOptions.loading} className={s.buttonRemoveMe}>
                        Remove Me
                    </Button>
                </Popconfirm>

            </div>

            <Modal
                visible={loginFormVisible}
                onCancel={() => setLoginFormVisible(false)}
                footer={null}
            >
                <LoginPersonalAccount onLoginSuccess={() => setLoginFormVisible(false)}/>
            </Modal>
        </div>
    );
};

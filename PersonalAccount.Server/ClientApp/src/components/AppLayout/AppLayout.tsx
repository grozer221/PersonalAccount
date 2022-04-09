import React, {FC} from 'react';
import {Layout, Menu} from 'antd';
import {LogoutOutlined, NotificationOutlined, ScheduleOutlined, SettingOutlined, UserOutlined} from '@ant-design/icons';
import s from './AppLayout.module.css';
import {Link} from 'react-router-dom';
import {useAppDispatch, useAppSelector} from '../../store/store';
import {authActions} from '../../modules/auth/auth.slice';
import Title from 'antd/es/typography/Title';
import {Role} from '../../modules/users/users.types';
import {client} from '../../gql/client';
import {useMutation} from '@apollo/client';
import {LOGOUT_MUTATION, LogoutData, LogoutVars} from '../../modules/auth/auth.mutations';
import {messageUtils} from '../../utills/messageUtils';
import {ME_QUERY, MeData, MeVars} from '../../modules/auth/auth.queries';
import {localStorageUtils} from '../../utills/localStorageUtils';

const {Content, Sider} = Layout;
const {SubMenu} = Menu;

export const AppLayout: FC = ({children}) => {
    const me = useAppSelector(s => s.auth.me);
    const isOnLoginAsUserMode = useAppSelector(s => s.auth.isOnLoginAsUserMode);
    const [logout, logoutOptions] = useMutation<LogoutData, LogoutVars>(LOGOUT_MUTATION);
    const dispatch = useAppDispatch();

    const logoutHandler = (): void => {
        logout({variables: {removeExpoPushToken: false}})
            .then(async response => {
                dispatch(authActions.setAuth({me: null, isAuth: false}));
                await client.cache.reset();
            })
            .catch(error => {
                messageUtils.error(error.message);
            });
    };

    const disableLoginAsUserModeHandler = async (): Promise<void> => {
        if (isOnLoginAsUserMode) {
            localStorageUtils.disableLoginAsUserMode();
            client.query<MeData, MeVars>({query: ME_QUERY})
                .then(response => {
                    dispatch(authActions.setIsEnabledLoginAsUserMode(false));
                    dispatch(authActions.setAuth({me: response.data.me, isAuth: true}));
                    messageUtils.success('Login As User Mode is disabled');
                })
                .catch(error => {
                    messageUtils.error(error.message);
                });
        } else
            messageUtils.error('Login As User Mode already disabled');
    };

    return (
        <Layout className={s.layout}>
            <Sider className={s.wrapperMenu}>
                <div className={s.innerMenu}>
                    <div>
                        <div className={s.header}>
                            <Title level={3} style={{color: '#3498db'}}>Personal Account</Title>
                            <div className={s.info}>
                                <div className={[s.infoText, s.bold].join(' ')}>{me?.user.email} </div>
                                <div
                                    className={[s.infoText, s.personalAccountUsername].join(' ')}>
                                    <span className={s.bold}>{me?.user.personalAccount?.username} </span>
                                    <span>{me?.user.group} ({me?.user.subGroup})</span>
                                </div>
                                {isOnLoginAsUserMode && (
                                    <div className={s.loginAsUser}>
                                        <div>Enabled Login As User Mode</div>
                                        <LogoutOutlined
                                            className={s.offLoginAsUserMode}
                                            onClick={disableLoginAsUserModeHandler}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                        <Menu theme="dark" defaultSelectedKeys={['ScheduleForToday']} mode="inline" className={s.black}>
                            <Menu.Item key="ScheduleForTwoWeeks" icon={<ScheduleOutlined/>}>
                                <Link to={'/ScheduleForTwoWeeks'}>
                                    For Two Weeks
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="Notifications" icon={<NotificationOutlined/>}>
                                <Link to={'/Notifications'}>
                                    Notifications
                                </Link>
                            </Menu.Item>
                            {me?.user.role === Role.Admin &&
                            <SubMenu key="Admin" icon={<UserOutlined/>} title="Admin" className={s.black}>
                                <Menu.Item key="BroadcastMessage">
                                    <Link to={'/BroadcastMessage'}>Broadcast Message</Link>
                                </Menu.Item>
                                <Menu.Item key="Users">
                                    <Link to={'/Users'}>Users</Link>
                                </Menu.Item>
                            </SubMenu>
                            }
                            <Menu.Item key="Settings" icon={<SettingOutlined/>}>
                                <Link to={'/Settings'}>Settings</Link>
                            </Menu.Item>
                            <Menu.Item key="Logout" icon={<LogoutOutlined/>} onClick={logoutHandler}>
                                Logout
                            </Menu.Item>
                        </Menu>
                    </div>
                    <div className={[s.madeBy, 'mainBackground'].join(' ')}>tg: @grozer</div>
                </div>
            </Sider>
            <Layout className="site-layout">
                <Content className={s.content}>
                    <div className={s.siteLayoutBackground}>
                        {children}
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

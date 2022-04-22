import React, {FC} from 'react';
import Title from 'antd/es/typography/Title';
import {Menu} from 'antd';
import {LogoutOutlined, NotificationOutlined, ScheduleOutlined, SettingOutlined, UserOutlined} from '@ant-design/icons';
import {Link} from 'react-router-dom';
import {Role} from '../../modules/users/users.types';
import {useAppDispatch, useAppSelector} from '../../store/store';
import SubMenu from 'antd/lib/menu/SubMenu';
import {authActions} from '../../modules/auth/auth.slice';
import {client} from '../../gql/client';
import {messageUtils} from '../../utills/messageUtils';
import {useMutation} from '@apollo/client';
import {LOGOUT_MUTATION, LogoutData, LogoutVars} from '../../modules/auth/auth.mutations';
import s from './AppMenu.module.css';

type Props = {
    onLinkClick?: () => void
}

export const AppMenu: FC<Props> = ({onLinkClick}) => {
    const me = useAppSelector(s => s.auth.me);
    const [logout, logoutOptions] = useMutation<LogoutData, LogoutVars>(LOGOUT_MUTATION);
    const dispatch = useAppDispatch();

    const logoutHandler = (): void => {
        logout({variables: {removeExpoPushToken: false}})
            .then(async response => {
                dispatch(authActions.setAuth({me: null, isAuth: false}));
                await client.cache.reset();
                onLinkClick && onLinkClick();
            })
            .catch(error => {
                messageUtils.error(error.message);
            });
    };

    return (
        <div className={s.wrapperMenu}>
            <div>
                <div className={s.header}>
                    <Title level={3} style={{color: '#3498db'}}>Personal Account</Title>
                    <div className={s.info}>
                        <div className={[s.infoText, s.bold].join(' ')}>{me?.user.email} </div>
                        <div
                            className={[s.infoText, s.personalAccountUsername].join(' ')}>
                            <span className={s.bold}>{me?.user.settings.personalAccount?.username} </span>
                            {me?.user.settings.group &&
                            <span>{me?.user.settings.group} ({me?.user.settings.subGroup})</span>}
                        </div>
                        {/*{isOnLoginAsUserMode && (*/}
                        {/*    <div className={s.loginAsUser}>*/}
                        {/*        <div>Enabled Login As User Mode</div>*/}
                        {/*        <LogoutOutlined*/}
                        {/*            className={s.offLoginAsUserMode}*/}
                        {/*            onClick={disableLoginAsUserModeHandler}*/}
                        {/*        />*/}
                        {/*    </div>*/}
                        {/*)}*/}
                    </div>
                </div>
                <Menu theme="dark" defaultSelectedKeys={['ScheduleForTwoWeeks']} mode="inline"
                      className={s.black}>
                    <Menu.Item key="ScheduleForTwoWeeks" icon={<ScheduleOutlined/>} onClick={onLinkClick}>
                        <Link to={'/ScheduleForTwoWeeks'}>
                            For Two Weeks
                        </Link>
                    </Menu.Item>
                    {/*<Menu.Item key="ScheduleForToday" icon={<ScheduleOutlined/>} onClick={onLinkClick}>*/}
                    {/*    <Link to={'/ScheduleForToday'}>*/}
                    {/*        For Today*/}
                    {/*    </Link>*/}
                    {/*</Menu.Item>*/}
                    {/*<Menu.Item key="Notifications" icon={<NotificationOutlined/>} onClick={onLinkClick}>*/}
                    {/*    <Link to={'/Notifications'}>*/}
                    {/*        Notifications*/}
                    {/*    </Link>*/}
                    {/*</Menu.Item>*/}
                    {me?.user.role === Role.Admin &&
                    <SubMenu key="Admin" icon={<UserOutlined/>} title="Admin" className={s.black}>
                        <Menu.Item key="BroadcastMessage" onClick={onLinkClick}>
                            <Link to={'/BroadcastMessage'}>Broadcast Message</Link>
                        </Menu.Item>
                        <Menu.Item key="Users" onClick={onLinkClick}>
                            <Link to={'/Users'}>Users</Link>
                        </Menu.Item>
                    </SubMenu>
                    }
                    <Menu.Item key="Settings" icon={<SettingOutlined/>} onClick={onLinkClick}>
                        <Link to={'/Settings'}>Settings</Link>
                    </Menu.Item>
                    <Menu.Item key="Logout" icon={<LogoutOutlined/>} onClick={logoutHandler}>
                        Logout
                    </Menu.Item>
                </Menu>

            </div>
            <div className={[s.madeBy].join(' ')}>tg: @grozer</div>
        </div>
    );
};

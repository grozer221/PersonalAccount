import React, {FC} from 'react';
import {Layout, Menu} from 'antd';
import {LogoutOutlined, ScheduleOutlined, SettingOutlined, UserOutlined} from '@ant-design/icons';
import s from './AppLayout.module.css';
import {Link} from 'react-router-dom';
import {useAppDispatch, useAppSelector} from '../../store/store';
import {authActions} from '../../modules/auth/auth.slice';
import Title from 'antd/es/typography/Title';
import {Role} from '../../modules/users/users.types';

const {Content, Sider} = Layout;
const {SubMenu} = Menu;

export const AppLayout: FC = ({children}) => {
    const me = useAppSelector(s => s.auth.me);

    const dispatch = useAppDispatch();

    const logoutHandler = (): void => {
        dispatch(authActions.setAuth({me: null, isAuth: false}));
    };

    return (
        <Layout className={s.layout}>
            <Sider className={s.wrapperMenu}>
                <div className={s.header}>
                    <Title level={3} style={{color: '#3498db'}}>Personal Account</Title>
                    <div className={s.info}>
                        <div className={[s.infoText, s.bold].join(' ')}>{me?.user.email} </div>
                        <div
                            className={[s.infoText, s.personalAccountUsername].join(' ')}>
                            <span className={s.bold}>{me?.user.personalAccount?.username} </span>
                            <span>{me?.user.group} ({me?.user.subGroup})</span>
                        </div>
                    </div>
                </div>
                <Menu theme="dark" defaultSelectedKeys={['ScheduleForToday']} mode="inline">
                    <Menu.Item key="ScheduleForToday" icon={<ScheduleOutlined/>}>
                        <Link to={'/ScheduleForToday'}>
                            For Today
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="ScheduleForTwoWeeks" icon={<ScheduleOutlined/>}>
                        <Link to={'/ScheduleForTwoWeeks'}>
                            For Two Weeks
                        </Link>
                    </Menu.Item>
                    {me?.user.role === Role.Admin &&
                    <SubMenu key="Admin" icon={<UserOutlined/>} title="Admin">
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

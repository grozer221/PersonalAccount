import React, {FC, useState} from 'react';
import {Layout, Menu} from 'antd';
import {LogoutOutlined, ScheduleOutlined, SettingOutlined, UserOutlined} from '@ant-design/icons';
import s from './AppLayout.module.css';
import {Link} from 'react-router-dom';
import {useAppDispatch} from '../../store/store';
import {authActions} from '../../modules/auth/auth.slice';

const {Content, Sider} = Layout;
const {SubMenu} = Menu;

export const AppLayout: FC = ({children}) => {
    const [collapsed, setCollapsed] = useState(false);

    const dispatch = useAppDispatch();

    const logoutHandler = (): void => {
        dispatch(authActions.setAuth({me: null, isAuth: false}));
    };

    return (
        <Layout className={s.layout}>
            <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} className={s.wrapperMenu}>
                <div className={s.logo}/>
                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
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
                    <SubMenu key="AdminActions" icon={<UserOutlined/>} title="Admin Actions">
                        <Menu.Item key="1">1</Menu.Item>
                        <Menu.Item key="2">2</Menu.Item>
                    </SubMenu>
                    <Menu.Item key="Settings" icon={<SettingOutlined/>}>
                        <Link to={'/Settings'}>
                            Settings
                        </Link>
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

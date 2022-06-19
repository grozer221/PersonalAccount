import React, {FC, ReactNode, useState} from 'react';
import {Avatar, Layout, Row} from 'antd';
import s from './AppLayout.module.css';
import {useIsPhone} from '../../hooks/mediaQueryHooks';
import {AppMenu} from '../AppMenu/AppMenu';
import {MenuOutlined} from '@ant-design/icons';
import {useAppSelector} from '../../store/store';
import {HamburgerMenu} from '../HamburgerMenu/HamburgerMenu';

const {Content} = Layout;

type Props = {
    children?: ReactNode,
}

export const AppLayout: FC<Props> = ({children}) => {
    const isPhone = useIsPhone();
    const me = useAppSelector(s => s.auth.me);
    const [visible, setVisible] = useState(false);

    return (
        <Layout className={s.layout}>
            {isPhone
                ? <HamburgerMenu visible={visible} setVisible={setVisible}/>
                : <AppMenu/>
            }

            <Layout className={s.contentLayout}>
                {isPhone &&
                <Row justify={'space-between'} align={'middle'} className={s.wrapperHamburger}>
                    <div onClick={() => setVisible(true)}>
                        <Avatar src={<MenuOutlined/>} size={'large'} className={s.hamburger}/>
                    </div>
                    <div>{me?.user.email}</div>
                </Row>
                }
                <Content className={s.content}>
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
};

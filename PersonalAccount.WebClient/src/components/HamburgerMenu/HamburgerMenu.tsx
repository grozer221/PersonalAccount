import React, {FC} from 'react';
import {Drawer} from 'antd';
import s from './HamburgerMenu.module.css';
import {AppMenu} from '../AppMenu/AppMenu';

type Props = {
    visible: boolean,
    setVisible: (flag: boolean) => void,
}

export const HamburgerMenu: FC<Props> = ({visible, setVisible}) => {
    return (
        <Drawer
            placement="left"
            width={250}
            onClose={() => setVisible(false)}
            visible={visible}
            closable={false}
        >
            <div className={[s.wrapperHamburgerMenu].join(' ')}>
                <AppMenu onLinkClick={() => setVisible(false)}/>
            </div>
        </Drawer>
    );
};

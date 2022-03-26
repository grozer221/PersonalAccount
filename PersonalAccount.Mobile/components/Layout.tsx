import React, {FC, useRef} from 'react';
import {DrawerLayoutAndroid, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Icon} from '@ant-design/react-native';
import {AppMenu} from './AppMenu';
import {useAppDispatch, useAppSelector} from '../store/store';
import {useNavigate} from 'react-router-native';
import {authActions} from '../modules/auth/auth.slice';

export const Layout: FC = ({children}) => {
    const authData = useAppSelector(state => state.auth.me);
    const drawer = useRef<any>(null);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const navItemPressHandler = (route: string): void => {
        navigate(route);
        drawer.current.closeDrawer();
    };

    const logoutHandler = () => {
        dispatch(authActions.setAuth({isAuth: false, me: null}));
        drawer.current.closeDrawer();
    };

    const HamburgerMenu = () => (
        <ScrollView>
            <View style={s.wrapperHamburgerMenu}>
                <View>
                    <Text style={s.email}>{authData?.user.email}</Text>
                    <Text style={s.group}>{authData?.user.group} ({authData?.user.subGroup})</Text>
                </View>
                <View style={s.nav}>
                    <TouchableOpacity onPress={() => navItemPressHandler('/settings')}>
                        <View style={s.navItem}>
                            <Icon name={'setting'}/>
                            <Text style={[s.navItemText]}>Settings</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => logoutHandler()} style={s.navItem}>
                        <Icon name={'logout'}/>
                        <Text style={[s.navItemText]}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );

    return (
        <DrawerLayoutAndroid
            ref={drawer}
            drawerWidth={300}
            drawerPosition={'left'}
            renderNavigationView={HamburgerMenu}
        >
            <View style={s.wrapperLayout}>
                <View style={s.hamburger}>
                    <Icon name={'menu'} onPress={() => drawer.current?.openDrawer()}/>
                </View>
                <View style={s.container}>
                    {children}
                </View>
                <AppMenu/>
            </View>
        </DrawerLayoutAndroid>
    );
};

const s = StyleSheet.create({
    wrapperLayout: {
        flex: 1,
    },
    container: {
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    hamburger: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
        borderBottomColor: 'gray',
        borderWidth: 2,
        paddingHorizontal: 10,
    },
    wrapperHamburgerMenu: {
        paddingTop: 30,
        paddingBottom: 10,
        paddingHorizontal: 30,
        alignItems: 'stretch',
    },
    email: {
        fontSize: 18,
    },
    group: {
        fontSize: 14,
        color: 'grey',
    },
    nav: {
        marginTop: 30,
    },
    navItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
        paddingVertical: 10,
    },
    navItemText: {
        marginLeft: 15,
        fontSize: 16,
    },
});

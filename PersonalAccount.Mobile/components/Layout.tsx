import React, {FC, useRef} from 'react';
import {DrawerLayoutAndroid, ScrollView, StyleSheet, Text, View} from 'react-native';
import {Button, Icon} from '@ant-design/react-native';
import {AppMenu} from './AppMenu';
import {useAppDispatch, useAppSelector} from '../store/store';
import {useNavigate} from 'react-router-native';
import {authActions} from '../modules/auth/auth.slice';

export const Layout: FC = ({children}) => {
    const isAuth = useAppSelector(state => state.auth.isAuth);
    const authData = useAppSelector(state => state.auth.authData);
    const drawer = useRef<any>(null);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const navItemPressHandler = (route: string): void => {
        navigate(route)
        drawer.current.closeDrawer();
    }

    const logoutHandler = () => {
        dispatch(authActions.setAuth({isAuth: false, authData: null}))
        drawer.current.closeDrawer();

    }

    console.log(isAuth, authData);

    const HamburgerMenu = () => (
        <ScrollView>
            <View style={s.wrapperHamburgerMenu}>
                <View>
                    <Text>{authData?.user.email}</Text>
                    <Text style={s.group}>{authData?.user.group} ({authData?.user.subGroup})</Text>
                </View>
                <View style={s.nav}>
                    <Button onPress={() => navItemPressHandler('/settings')} style={s.navWrapperItem}>
                        <View style={s.navItem}>
                            <Icon name={'setting'}/>
                            <Text style={s.ml}>Settings</Text>
                        </View>
                    </Button>
                    <Button onPress={() => logoutHandler()}>
                        <View style={s.navItem}>
                            <Icon name={'logout'}/>
                            <Text style={s.ml}>Logout</Text>
                        </View>
                    </Button>
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
        paddingHorizontal: 10,
        alignItems: 'stretch',
    },
    group: {
        fontSize: 13,
        color: 'grey',
    },
    nav: {
        marginTop: 30,
    },
    navWrapperItem: {
        marginVertical: 5,
    },
    navItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ml: {
        marginLeft: 10,
    },
});

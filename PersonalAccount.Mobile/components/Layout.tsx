import React, {FC, useRef} from 'react';
import {DrawerLayoutAndroid, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Icon, Modal} from '@ant-design/react-native';
import {AppMenu} from './AppMenu';
import {useAppDispatch, useAppSelector} from '../store/store';
import {useNavigate} from 'react-router-native';
import {setAuth} from '../modules/auth/auth.slice';
import {Breadcrumbs} from './Breadcrumbs';
import {useMutation} from '@apollo/client';
import {LOGOUT_MUTATION, LogoutData, LogoutVars} from '../modules/auth/auth.mutations';

export const Layout: FC = ({children}) => {
    const me = useAppSelector(state => state.auth.me);
    const drawer = useRef<any>(null);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [logout, logoutOptions] = useMutation<LogoutData, LogoutVars>(LOGOUT_MUTATION);

    const navItemPressHandler = (route: string): void => {
        navigate(route);
        drawer.current.closeDrawer();
    };

    const logoutHandler = async () => {
        logout({variables: {removeExpoPushToken: true}})
            .then(() => {
                dispatch(setAuth({isAuth: false, me: null}));
                drawer.current.closeDrawer();
            })
            .catch(error => {
                Modal.alert('Error', error.message, [{text: 'Ok'}]);
            });

    };

    const HamburgerMenu = () => (
        <ScrollView>
            <View style={s.myInfo}>
                <View style={s.hamburgerContainer}>
                    <Text style={s.email}>{me?.user.email}</Text>
                    <Text style={s.group}>{me?.user.group}({me?.user.subGroup})</Text>
                </View>
            </View>
            <View style={[s.nav, s.hamburgerContainer]}>
                <TouchableOpacity onPress={() => navItemPressHandler('/Settings')}>
                    <View style={s.navItem}>
                        <Icon name={'setting'}/>
                        <Text style={[s.navItemText]}>Settings</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => logoutHandler()} style={s.navItem} disabled={logoutOptions.loading}>
                    <Icon name={'logout'}/>
                    <Text style={[s.navItemText]}>Logout</Text>
                </TouchableOpacity>
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
                <View style={s.header}>
                    <Icon name={'menu'} onPress={() => drawer.current?.openDrawer()}/>
                    <Breadcrumbs/>
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
    },
    header: {
        backgroundColor: '#f5f5f5',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 50,
        paddingHorizontal: 10,
    },
    hamburgerContainer: {
        paddingHorizontal: 30,
    },
    myInfo: {
        backgroundColor: '#232323',
        paddingVertical: 30,
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

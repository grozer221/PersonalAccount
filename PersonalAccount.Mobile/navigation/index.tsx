/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import {FontAwesome} from '@expo/vector-icons';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer, DefaultTheme, DarkTheme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import * as React from 'react';
import {ColorSchemeName, Pressable} from 'react-native';

import {Colors} from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import {ModalScreen} from '../screens/ModalScreen';
import {NotFoundScreen} from '../screens/NotFoundScreen';
import {HomeScreen} from '../screens/HomeScreen';
import {ScheduleScreen} from '../screens/ScheduleScreen';
import {RootStackParamList, RootTabParamList, RootTabScreenProps} from '../types';
import {LinkingConfiguration} from './LinkingConfiguration';
import {SettingsScreen} from '../screens/SettingsScreen';
import {Icon} from '@ant-design/react-native';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const Navigation = ({colorScheme}: { colorScheme: ColorSchemeName }) => {
    return (
        <NavigationContainer
            linking={LinkingConfiguration}
            theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack.Navigator>
                <Stack.Screen name="Root" component={BottomTabNavigator} options={{headerShown: false}}/>
                <Stack.Screen name="NotFound" component={NotFoundScreen} options={{title: 'Oops!'}}/>
                <Stack.Group screenOptions={{presentation: 'modal'}}>
                    <Stack.Screen name="Modal" component={ModalScreen}/>
                </Stack.Group>
            </Stack.Navigator>
        </NavigationContainer>
    );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
    const colorScheme = useColorScheme();

    return (
        <BottomTab.Navigator
            initialRouteName="Home"
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme].tint,
            }}>
            <BottomTab.Screen
                name="Home"
                component={HomeScreen}
                options={({navigation}: RootTabScreenProps<'Home'>) => ({
                    title: 'Home',
                    tabBarIcon: ({color}) => <Icon name="home" size="lg" color={'grey'}/>,
                    // headerRight: () => (
                    //     <Pressable
                    //         onPress={() => navigation.navigate('Modal')}
                    //         style={({pressed}) => ({
                    //             opacity: pressed ? 0.5 : 1,
                    //         })}>
                    //         <FontAwesome
                    //             name="info-circle"
                    //             size={25}
                    //             color={Colors[colorScheme].text}
                    //             style={{marginRight: 15}}
                    //         />
                    //     </Pressable>
                    // ),
                })}
            />
            <BottomTab.Screen
                name="Schedule"
                component={ScheduleScreen}
                options={{
                    title: 'Schedule',
                    tabBarIcon: ({color}) => <Icon name="schedule" size="lg" color={'grey'}/>,
                }}
            />
            <BottomTab.Screen
                name="Settings"
                component={SettingsScreen}
                options={{
                    title: 'Settings',
                    tabBarIcon: ({color}) => <Icon name="setting" size="lg" color={'grey'}/>,
                }}
            />
        </BottomTab.Navigator>
    );
}

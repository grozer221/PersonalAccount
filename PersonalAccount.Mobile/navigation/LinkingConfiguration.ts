/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import {LinkingOptions} from '@react-navigation/native';
import * as Linking from 'expo-linking';

import {RootStackParamList} from '../types';

export const LinkingConfiguration: LinkingOptions<RootStackParamList> = {
    prefixes: [Linking.makeUrl('/')],
    config: {
        screens: {
            Root: {
                screens: {
                    Home: {
                        screens: {
                            HomeScreen: 'home',
                        },
                    },
                    ScheduleForToday: {
                        screens: {
                            ScheduleForToday: 'scheduleForToday',
                        },
                    },
                    ScheduleForTwoWeeks: {
                        screens: {
                            ScheduleForTwoWeeksScreen: 'scheduleForTwoWeeksScreen',
                        },
                    },
                    Settings: {
                        screens: {
                            SettingsScreen: 'settings',
                        },
                    },
                },
            },
            Modal: 'modal',
            NotFound: '*',
        },
    },
};

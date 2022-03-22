import React, {FC, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Icon, TabBar} from '@ant-design/react-native';
import {useNavigate} from 'react-router-native';

enum Tab {
    Home = 'Home',
    ScheduleForToday = 'ScheduleForToday',
    ScheduleForTwoWeeks = 'ScheduleForTwoWeeks',
}

export const AppMenu: FC = () => {
    const [selectedTab, setSelectedTab] = useState(Tab.Home);
    const navigate = useNavigate();

    const onChangeTab = (tab: Tab | '') => {
        navigate(`/${tab}`);
        setSelectedTab(tab === '' ? Tab.Home : tab);
    };

    return (
        <View style={s.wrapperAppMenu}>
            <TabBar
                unselectedTintColor="#949494"
                tintColor="#33A3F4"
                barTintColor="#f5f5f5"
            >
                <TabBar.Item
                    title="Home"
                    icon={<Icon name="home"/>}
                    selected={selectedTab === Tab.Home}
                    onPress={() => onChangeTab('')}
                />
                <TabBar.Item
                    title="Today"
                    icon={<Icon name="schedule"/>}
                    selected={selectedTab === Tab.ScheduleForToday}
                    onPress={() => onChangeTab(Tab.ScheduleForToday)}
                />
                <TabBar.Item
                    title="2 Weeks"
                    icon={<Icon name="schedule"/>}
                    selected={selectedTab === Tab.ScheduleForTwoWeeks}
                    onPress={() => onChangeTab(Tab.ScheduleForTwoWeeks)}
                />
            </TabBar>
        </View>
    );
};

const s = StyleSheet.create({
    wrapperAppMenu: {
        height: 50,
    },
});

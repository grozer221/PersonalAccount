import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import {useEffect, useState} from 'react';

export const useCachedResources = () => {
    const [isLoadingComplete, setLoadingComplete] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                SplashScreen.preventAutoHideAsync();
                await Font.loadAsync(
                    'antoutline',
                    // eslint-disable-next-line
                    require('@ant-design/icons-react-native/fonts/antoutline.ttf'),
                );
                await Font.loadAsync(
                    'antfill',
                    // eslint-disable-next-line
                    require('@ant-design/icons-react-native/fonts/antfill.ttf'),
                );
            } catch (e) {
                console.warn(e);
            } finally {
                setLoadingComplete(false);
                SplashScreen.hideAsync();
            }
        })();
    }, []);

    return isLoadingComplete;
};

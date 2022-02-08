import {AsyncStorage} from 'react-native';

export const setToken = async (token: string): Promise<void> => {
    await AsyncStorage.setItem('token', token);
};

export const getToken = async (): Promise<string | null> => {
    return await AsyncStorage.getItem('token');
};

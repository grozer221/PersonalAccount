import {message} from 'antd';

export const messageUtils = {
    success: (messageText?: string) => {
        message.success(messageText || 'Successfully saved');
    },
    error: (messageText?: string) => {
        message.error(messageText || 'Error');
    },
};

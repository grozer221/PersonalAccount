import React, {FC} from 'react';
import {Button, Form} from 'antd';
import {useMutation} from '@apollo/client';
import {useAppDispatch} from '../../store/store';
import {messageUtils} from '../../utills/messageUtils';
import {
    BROADCAST_MESSAGE_MUTATION,
    BroadcastMessageData,
    BroadcastMessageVars,
} from '../../modules/notifications/notifications.mutations';
import Title from 'antd/es/typography/Title';
import TextArea from 'antd/es/input/TextArea';
import s from './BroadcastMessagePage.module.css';

type FormValues = {
    message: string,
}

export const BroadcastMessagePage: FC = () => {
    const dispatch = useAppDispatch();
    const [broadcastMessage, broadcastMessageOptions] = useMutation<BroadcastMessageData, BroadcastMessageVars>(BROADCAST_MESSAGE_MUTATION);
    const [form] = Form.useForm();

    const onFinish = async ({message}: FormValues) => {
        broadcastMessage({variables: {message}})
            .then(response => {
                form.setFields([{name: 'message', value: ''}]);
                messageUtils.success('Message is sent');
            })
            .catch(error => {
                messageUtils.error(error.message);
            });
    };

    return (
        <Form
            name="broadcastMessageForm"
            onFinish={onFinish}
            form={form}
        >
            <Title level={3}>Broadcast Message</Title>
            <Form.Item
                name="message"
                label="Message"
                rules={[{required: true, message: 'Enter your message!'}]}
            >
                <TextArea placeholder="Message" className={s.textarea}/>
            </Form.Item>
            <Form.Item>
                <Button loading={broadcastMessageOptions.loading} type="primary" htmlType="submit">
                    Send
                </Button>
            </Form.Item>
        </Form>
    );
};

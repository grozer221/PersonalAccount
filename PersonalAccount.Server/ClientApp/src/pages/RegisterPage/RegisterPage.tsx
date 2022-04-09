import React, {FC} from 'react';
import {Button, Form, Input} from 'antd';
import {LockOutlined, UserOutlined} from '@ant-design/icons';
import {Link} from 'react-router-dom';
import {useMutation} from '@apollo/client';
import s from './RegisterPage.module.css';
import {useAppDispatch} from '../../store/store';
import {REGISTER_MUTATION, RegisterData, RegisterVars} from '../../modules/auth/auth.mutations';
import {authActions} from '../../modules/auth/auth.slice';
import {messageUtils} from '../../utills/messageUtils';
import Title from 'antd/es/typography/Title';

type FormValues = {
    email: string,
    password: string,
}

export const RegisterPage: FC = () => {
    const dispatch = useAppDispatch();
    const [register, registerOptions] = useMutation<RegisterData, RegisterVars>(REGISTER_MUTATION);
    const [form] = Form.useForm();

    const onFinish = async ({email, password}: FormValues) => {
        register({variables: {authLoginInputType: {email, password}}})
            .then(response => {
                if (response.data) {
                    dispatch(authActions.setAuth({me: response.data.register, isAuth: true}));
                }
            })
            .catch(error => {
                messageUtils.error(error.message);
            });
    };

    return (
        <div className={[s.registerForm, 'mainBackground'].join(' ')}>
            <Form
                name="registerForm"
                onFinish={onFinish}
                form={form}
            >
                <Title level={3} className={[s.white, s.center].join(' ')}>Register</Title>
                <Form.Item
                    name="email"
                    rules={[{required: true, message: 'Enter your email!'}]}
                >
                    <Input prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="Email"/>
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[{required: true, message: 'Enter your password!'}]}
                >
                    <Input
                        prefix={<LockOutlined className="site-form-item-icon"/>}
                        type="password"
                        placeholder="Password"
                    />
                </Form.Item>
                <Form.Item>
                    <Button loading={registerOptions.loading} type="primary" htmlType="submit"
                            className={['login-form-button', s.submit].join(' ')}>
                        Register
                    </Button>
                    <span className={s.white}>Have a account? </span>
                    <Link to="/Login">Login now!</Link>
                </Form.Item>
            </Form>
        </div>
    );
};

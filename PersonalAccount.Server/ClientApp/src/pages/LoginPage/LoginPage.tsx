import React, {FC} from 'react';
import {Button, Checkbox, Form, Input, message} from 'antd';
import {LockOutlined, UserOutlined} from '@ant-design/icons';
import {Link, Navigate} from 'react-router-dom';
import {useMutation} from '@apollo/client';
import s from './LoginPage.module.css';
import {useAppDispatch, useAppSelector} from '../../store/store';
import {LOGIN_MUTATION, LoginData, LoginVars} from '../../modules/auth/auth.mutations';
import {authActions} from '../../modules/auth/auth.slice';
import {messageUtils} from '../../utills/messageUtils';

type FormValues = {
    email: string,
    password: string,
}

export const LoginPage: FC = () => {
    const dispatch = useAppDispatch();
    const isAuth = useAppSelector(s => s.auth.isAuth);
    const [loginMutation, loginMutationOptions] = useMutation<LoginData, LoginVars>(LOGIN_MUTATION);
    const [form] = Form.useForm();

    const onFinish = async ({email, password}: FormValues) => {
        loginMutation({variables: {authLoginInputType: {email, password}}})
            .then(response => {
                if (response.data) {
                    dispatch(authActions.setAuth({me: response.data.login, isAuth: true}));
                }
            })
            .catch(error => {
                messageUtils.error(error.message);
            });
    };

    if (isAuth)
        return <Navigate to={'/'}/>;


    return (
        <div className={s.loginForm}>
            <Form
                name="loginForm"
                initialValues={{remember: true}}
                onFinish={onFinish}
                form={form}
            >
                <h2 className={s.title}>Personal Account</h2>
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
                    <Form.Item name="remember" valuePropName="checked" noStyle className={s.rememberMe}>
                        <Checkbox>
                            <span className={s.white}>Запам'ятати</span>
                        </Checkbox>
                    </Form.Item>

                    <Link className={s.forgotPass} to={''}>
                        Забули пароль?
                    </Link>
                </Form.Item>
                <Form.Item>
                    <Button loading={loginMutationOptions.loading} type="primary" htmlType="submit"
                            className={['login-form-button', s.submit].join(' ')}>
                        Login
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

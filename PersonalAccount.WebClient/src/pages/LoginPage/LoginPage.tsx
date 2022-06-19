import React, {FC} from 'react';
import {Button, Checkbox, Form, Input} from 'antd';
import {LockOutlined, UserOutlined} from '@ant-design/icons';
import {Link} from 'react-router-dom';
import {useMutation} from '@apollo/client';
import s from './LoginPage.module.css';
import {useAppDispatch} from '../../store/store';
import {LOGIN_MUTATION, LoginData, LoginVars} from '../../modules/auth/auth.mutations';
import {authActions} from '../../modules/auth/auth.slice';
import {messageUtils} from '../../utills/messageUtils';
import Title from 'antd/es/typography/Title';

type FormValues = {
    email: string,
    password: string,
}

export const LoginPage: FC = () => {
    const dispatch = useAppDispatch();
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

    return (
        <div className={[s.loginForm, 'mainBackground'].join(' ')}>
            <Form
                name="loginForm"
                initialValues={{remember: true}}
                onFinish={onFinish}
                form={form}
            >
                <Title level={3} className={[s.white, s.center].join(' ')}>Login</Title>
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
                            <span className={s.white}>Remember</span>
                        </Checkbox>
                    </Form.Item>

                    <Link className={s.forgotPass} to={'#'}>
                        Forget password?
                    </Link>
                </Form.Item>
                <Form.Item>
                    <Button loading={loginMutationOptions.loading} type="primary" htmlType="submit"
                            className={['login-form-button', s.submit].join(' ')}>
                        Login
                    </Button>
                    <span className={s.white}>Or </span>
                    <Link to="/Register">register now!</Link>
                </Form.Item>
            </Form>
        </div>
    );
};

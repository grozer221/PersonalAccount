import React, {FC} from 'react';
import {Formik, FormikHelpers} from 'formik';
import {useMutation} from '@apollo/client';
import * as yup from 'yup';
import {authActions} from '../../modules/auth/auth.slice';
import {useAppDispatch} from '../../store/store';
import {
    LOGIN_PERSONAL_ACCOUNT_MUTATION,
    LoginPersonalAccountData,
    LoginPersonalAccountVars,
} from '../../modules/personalAccounts/personalAccounts.mutations';
import {Button, Input} from 'antd';
import s from './LoginPersonalAccount.module.css';
import Title from 'antd/es/typography/Title';
import {client} from '../../gql/client';

const loginValidationSchema = yup.object().shape({
    username: yup
        .string()
        .required('Username is required'),
    password: yup
        .string()
        .min(1, ({min}) => `Password must be at least ${min} characters`)
        .required('Password is required'),
});

type Props = {
    onLoginSuccess?: () => void,
}

export const LoginPersonalAccount: FC<Props> = ({onLoginSuccess}) => {
    const [loginPersonalAccount, loginPersonalAccountOptions] = useMutation<LoginPersonalAccountData, LoginPersonalAccountVars>(LOGIN_PERSONAL_ACCOUNT_MUTATION);
    const dispatch = useAppDispatch();

    const submitForm = async (values: { username: string, password: string, form: string }, formikHelpers: FormikHelpers<{ username: string, password: string, form: string }>) => {
        loginPersonalAccount({
            variables: {
                personalAccountLoginInputType: {
                    username: values.username,
                    password: values.password,
                },
            },
        })
            .then(async response => {
                response.data && dispatch(authActions.setUser(response.data.loginPersonalAccount));
                onLoginSuccess && onLoginSuccess();
                await client.cache.reset();
            })
            .catch((error) => {
                formikHelpers.setSubmitting(false);
                formikHelpers.setFieldError('form', error.message);
            });
    };

    return (
        <>
            <Formik
                validationSchema={loginValidationSchema}
                initialValues={{username: '', password: '', form: ''}}
                onSubmit={submitForm}
            >
                {({
                      handleChange,
                      handleBlur,
                      handleSubmit,
                      values,
                      errors,
                      touched,
                      isValid,
                  }) => (
                    <div className={s.wrapperLoginPersonalAccount}>
                        <Title level={3}>Login Ztu Personal Account</Title>
                        <Input
                            name={'username'}
                            placeholder="Username (ipz205_ggg)"
                            onChange={handleChange('username')}
                            onBlur={handleBlur('username')}
                            value={values.username}
                            autoCapitalize={'none'}
                        />
                        {(errors.username && touched.username) &&
                        <div className={'error'}>{errors.username}</div>
                        }
                        <Input
                            name="password"
                            placeholder="Password"
                            onChange={handleChange('password')}
                            onBlur={handleBlur('password')}
                            value={values.password}
                            type={'password'}
                        />
                        {(errors.password && touched.password) &&
                        <div className={'error'}>{errors.password}</div>
                        }
                        {errors.form && <div className={'error'}>{errors.form}</div>}
                        <Button
                            size={'small'}
                            onClick={() => handleSubmit()}
                            disabled={!isValid}
                            loading={loginPersonalAccountOptions.loading}
                        >
                            Login
                        </Button>
                    </div>
                )}
            </Formik>
        </>
    );
};

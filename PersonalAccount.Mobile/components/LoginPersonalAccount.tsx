import React, {FC} from 'react';
import {Formik, FormikHelpers} from 'formik';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {Button} from '@ant-design/react-native';
import {authActions} from '../modules/auth/auth.slice';
import {useMutation} from '@apollo/client';
import {useAppDispatch} from '../store/store';
import * as yup from 'yup';
import {
    LOGIN_PERSONAL_ACCOUNT_MUTATION,
    LoginPersonalAccountData,
    LoginPersonalAccountVars,
} from '../modules/personalAccounts/personalAccounts.mutations';

const loginValidationSchema = yup.object().shape({
    username: yup
        .string()
        .required('Username is Required'),
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
            .then(response => {
                response.data && dispatch(authActions.setUser(response.data.loginPersonalAccount));
                onLoginSuccess && onLoginSuccess();
            })
            .catch((error) => {
                formikHelpers.setSubmitting(false);
                formikHelpers.setFieldError('form', error.message);
            });
    };

    return (
        <View style={s.wrapperLoginPersonalAccount}>
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
                    <>
                        <TextInput
                            // @ts-ignore
                            name={'username'}
                            placeholder="Username (ipz205_ggg)"
                            style={s.textInput}
                            onChangeText={handleChange('username')}
                            onBlur={handleBlur('username')}
                            value={values.username}
                            autoCapitalize={'none'}
                            keyboardType="email-address"
                        />
                        {(errors.username && touched.username) &&
                        <Text style={s.errorText}>{errors.username}</Text>
                        }
                        <TextInput
                            // @ts-ignore
                            name="password"
                            placeholder="Password"
                            style={s.textInput}
                            onChangeText={handleChange('password')}
                            onBlur={handleBlur('password')}
                            value={values.password}
                            secureTextEntry
                        />
                        {(errors.password && touched.password) &&
                        <Text style={s.errorText}>{errors.password}</Text>
                        }
                        {errors.form && <Text style={s.errorText}>{errors.form}</Text>}
                        <Button
                            style={s.buttonLogin}
                            size={'small'}
                            onPress={(e) => handleSubmit()}
                            disabled={!isValid}
                            loading={loginPersonalAccountOptions.loading}
                        >
                            Login
                        </Button>
                    </>
                )}
            </Formik>
        </View>
    );
};

const s = StyleSheet.create({
    wrapperLoginPersonalAccount: {
        alignItems: 'center',
    },
    textInput: {
        height: 30,
        width: '100%',
        margin: 10,
        backgroundColor: 'white',
        borderColor: 'gray',
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 10,
        paddingHorizontal: 10,
    },
    errorText: {
        fontSize: 10,
        color: 'red',
    },
    errorInput: {
        borderColor: 'red',
    },
    buttonLogin: {
        width: '100%',
    },
});

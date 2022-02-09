import  React from 'react';
import {Text} from './Themed';
import {Formik, FormikHelpers} from 'formik';
import {StyleSheet, TextInput} from 'react-native';
import {Button} from '@ant-design/react-native';
import {authActions} from '../modules/auth/auth.slice';
import {useMutation} from '@apollo/client';
import {LOGIN_MUTATION, LoginData, LoginVars} from '../modules/auth/auth.mutations';
import {useAppDispatch} from '../store/store';
import * as yup from 'yup';

const loginValidationSchema = yup.object().shape({
    email: yup
        .string()
        .email('Please enter valid email')
        .required('Email Address is Required'),
    password: yup
        .string()
        .min(3, ({min}) => `Password must be at least ${min} characters`)
        .required('Password is required'),
});

export const Login = () => {
    const [loginMutation, loginMutationOptions] = useMutation<LoginData, LoginVars>(LOGIN_MUTATION);
    const dispatch = useAppDispatch();

    const submitForm = async (values: { email: string, password: string, form: string }, formikHelpers: FormikHelpers<{ email: string, password: string, form: string }>) => {
        loginMutation({
            variables: {
                authLoginInputType: {
                    email: values.email,
                    password: values.password,
                },
            },
        })
            .then(response => {
                dispatch(authActions.setAuth({isAuth: true, authData: response.data?.login}));
            })
            .catch((e) => {
                formikHelpers.setSubmitting(false);
                formikHelpers.setFieldError('form', e.message);
            });
    };

    return (
        <>
            <Text style={s.title}>Login</Text>
            <Formik
                validationSchema={loginValidationSchema}
                initialValues={{email: '', password: '', form: ''}}
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
                            name={'email'}
                            placeholder="Email Address"
                            style={s.textInput}
                            onChangeText={handleChange('email')}
                            onBlur={handleBlur('email')}
                            value={values.email}
                            keyboardType="email-address"
                        />
                        {(errors.email && touched.email) &&
                        <Text style={s.errorText}>{errors.email}</Text>
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
                        <Button style={s.buttonSubmit} onPress={() => handleSubmit()} disabled={!isValid}>
                            <Text style={s.buttonSubmitText}>Login</Text>
                        </Button>
                    </>
                )}
            </Formik>
        </>
    );
};

const s = StyleSheet.create({
    title: {
        fontSize: 20,
    },
    textInput: {
        height: 40,
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
    buttonSubmit: {
        width: '100%',
        height: 40,
    },
    buttonSubmitText: {
        fontSize: 14,
    },
});

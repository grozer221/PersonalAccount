import React from 'react';
import {Formik, FormikHelpers} from 'formik';
import {StyleSheet, Text, TextInput} from 'react-native';
import {Button} from '@ant-design/react-native';
import * as yup from 'yup';
import {authActions} from '../modules/auth/auth.slice';
import {useMutation} from '@apollo/client';
import {REGISTER_MUTATION, RegisterData, RegisterVars} from '../modules/auth/auth.mutations';
import {useAppDispatch} from '../store/store';
import {setToken} from '../utils/asyncStorageUtils';

const registerValidationSchema = yup.object().shape({
    email: yup
        .string()
        .email('Please enter valid email')
        .required('Email is Required'),
    password: yup
        .string()
        .min(3, ({min}) => `Password must be at least ${min} characters`)
        .required('Password is required'),
});

export const Register = () => {
    const [registerMutation, registerMutationOptions] = useMutation<RegisterData, RegisterVars>(REGISTER_MUTATION);
    const dispatch = useAppDispatch();

    const submitForm = async (values: { email: string, password: string, form: string }, formikHelpers: FormikHelpers<{ email: string, password: string, form: string }>) => {
        registerMutation({
            variables: {
                authLoginInputType: {
                    email: values.email,
                    password: values.password,
                },
            },
        })
            .then(response => {
                dispatch(authActions.setAuth({isAuth: true, me: response.data?.register}));
                response.data && setToken(response.data.register.token);
            })
            .catch((e) => {
                formikHelpers.setSubmitting(false);
                formikHelpers.setFieldError('form', e.message);
            });
    };

    return (
        <>
            <Text style={s.title}>Register</Text>
            <Formik
                validationSchema={registerValidationSchema}
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
                            placeholder="Email"
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
                        <Button
                            style={s.buttonSubmit}
                            onPress={(e) => handleSubmit()}
                            disabled={!isValid}
                            loading={registerMutationOptions.loading}
                        >
                            <Text style={s.buttonSubmitText}>Register</Text>
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

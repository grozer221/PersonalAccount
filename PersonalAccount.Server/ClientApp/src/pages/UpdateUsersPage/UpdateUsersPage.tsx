import React from 'react';
import {useMutation, useQuery} from '@apollo/client';
import {GET_USER_QUERY, GetUserData, GetUserVars} from '../../modules/users/users.queries';
import {useNavigate, useParams} from 'react-router-dom';
import {Button, Form, Input, Select} from 'antd';
import {UPDATE_USER_MUTATION, UpdateUserData, UpdateUserVars} from '../../modules/users/users.mutations';
import {messageUtils} from '../../utills/messageUtils';
import {Role} from '../../modules/users/users.types';
import {Loading} from '../../components/Loading/Loading';

type FormValues = {
    id: string,
    email: string,
    role: Role,
}

export const UpdateUsersPage = () => {
    const params = useParams();
    const id = params.id || '';
    const getUser = useQuery<GetUserData, GetUserVars>(GET_USER_QUERY, {variables: {id}});
    const [updateUser, updateUserOptions] = useMutation<UpdateUserData, UpdateUserVars>(UPDATE_USER_MUTATION);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const onFinish = async ({email, role}: FormValues) => {
        updateUser({variables: {updateUserInputType: {id, email, role}}})
            .then(response => {
                messageUtils.success('User updated');
                navigate(-1);
            })
            .catch(error => {
                messageUtils.error(error.message);
            });
    };

    if (getUser.loading)
        return <Loading/>;

    return (
        <div>
            <Form
                name="UpdateUsers"
                initialValues={{
                    email: getUser.data?.getUser.email,
                    role: getUser.data?.getUser.role,
                }}
                onFinish={onFinish}
                form={form}
            >
                <Form.Item name="id" style={{display: 'none'}}>
                    <Input type={'hidden'}/>
                </Form.Item>
                <Form.Item
                    name="email"
                    rules={[{required: true, message: 'Enter your email!'}]}
                >
                    <Input placeholder="Email"/>
                </Form.Item>
                <Form.Item
                    name="role"
                    rules={[{required: true, message: 'Enter your password!'}]}
                >
                    <Select style={{width: '100%'}} defaultValue={getUser.data?.getUser.role}>
                        {(Object.values(Role) as Array<Role>).map((value) => (
                            <Select.Option key={value} value={value}>
                                {Object.keys(Role)[Object.values(Role).indexOf(value)]}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button loading={updateUserOptions.loading} type="primary" htmlType="submit">
                        Update
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

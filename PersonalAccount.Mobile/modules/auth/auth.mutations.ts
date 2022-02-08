import {gql} from '@apollo/client';
import {Auth} from './auth.types';
import {USER_FRAGMENT} from '../users/users.fragments';

export type LoginData = { login: Auth }

export type LoginVars = { authLoginInputType: authLoginInputType }
export type authLoginInputType = {
    email: string,
    password: string,
}

export const LOGIN_MUTATION = gql`
    ${USER_FRAGMENT}
    mutation login($authLoginInputType: AuthLoginInputType!) {
        login(authLoginInputType: $authLoginInputType) {
            user {
                ...UserFragment
            }
            token
        }
    }
`;


export type RegisterData = { register: Auth }

export type RegisterVars = { authLoginInputType: authLoginInputType }

export const REGISTER_MUTATION = gql`
    ${USER_FRAGMENT}
    mutation Register($authLoginInputType: AuthLoginInputType!) {
        register(authLoginInputType: $authLoginInputType) {
            user {
                ...UserFragment
            }
            token
        }
    }
`;

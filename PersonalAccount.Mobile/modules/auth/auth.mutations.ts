import {gql} from '@apollo/client';
import {Auth} from './auth.types';

export type LoginData = { login: Auth }

export type LoginVars = { authLoginInputType: authLoginInputType }
export type authLoginInputType = {
    email: string,
    password: string,
}

export const LOGIN_MUTATION = gql`
    mutation login($authLoginInputType: AuthLoginInputType!) {
        login(authLoginInputType: $authLoginInputType) {
            user {
                id
                email
                role
                createdAt
                updatedAt
            }
            token
        }
    }
`;


export type RegisterData = { register: Auth }

export type RegisterVars = { authLoginInputType: authLoginInputType }

export const REGISTER_MUTATION = gql`
    mutation Register($authLoginInputType: AuthLoginInputType!) {
        register(authLoginInputType: $authLoginInputType) {
            user {
                id
                email
                role
                createdAt
                updatedAt
            }
            token
        }
    }
`;

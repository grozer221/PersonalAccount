import {gql} from '@apollo/client';
import {PERSONAL_ACCOUNT_FRAGMENT} from './personalAccounts.fragments';
import {PersonalAccount} from './personalAccounts.types';
import {User} from '../users/users.types';
import {USER_FRAGMENT} from '../users/users.fragments';

export type LoginPersonalAccountData = { loginPersonalAccount: User }

export type LoginPersonalAccountVars = { personalAccountLoginInputType: personalAccountLoginInputType }
export type personalAccountLoginInputType = {
    username: string,
    password: string,
}

export const LOGIN_PERSONAL_ACCOUNT_MUTATION = gql`
    ${USER_FRAGMENT}
    mutation LoginPersonalAccount($personalAccountLoginInputType: PersonalAccountLoginInputType!) {
        loginPersonalAccount(personalAccountLoginInputType: $personalAccountLoginInputType) {
            ...UserFragment
        }
    }
`;

export type LogoutPersonalAccountData = { logoutPersonalAccount: boolean }
export type LogoutPersonalAccountVars = {}

export const LOGOUT_PERSONAL_ACCOUNT_MUTATION = gql`
    mutation LogoutPersonalAccount {
        logoutPersonalAccount
    }
`;


import {gql} from '@apollo/client';
import {PERSONAL_ACCOUNT_FRAGMENT} from './personalAccounts.fragments';
import {PersonalAccount} from './personalAccounts.types';

export type LoginPersonalAccountData = { loginPersonalAccount: PersonalAccount }

export type LoginPersonalAccountVars = { personalAccountLoginInputType: personalAccountLoginInputType }
export type personalAccountLoginInputType = {
    username: string,
    password: string,
}

export const LOGIN_PERSONAL_ACCOUNT_MUTATION = gql`
    ${PERSONAL_ACCOUNT_FRAGMENT}
    mutation LoginPersonalAccount($personalAccountLoginInputType: PersonalAccountLoginInputType!) {
        loginPersonalAccount(personalAccountLoginInputType: $personalAccountLoginInputType) {
            ...PersonalAccountFragment
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


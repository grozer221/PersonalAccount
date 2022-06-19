import {gql} from '@apollo/client';
import {TELEGRAM_ACCOUNT_FRAGMENT} from './telegramAccounts.fragments';
import {TelegramAccount} from './telegramAccounts.type';

export type LoginTelegramAccountData = { loginTelegramAccount: TelegramAccount }

export type LoginTelegramAccountVars = { telegramAccountLoginInputType: telegramAccountLoginInputType }
export type telegramAccountLoginInputType = {
    telegramId: number,
    username?: string,
    firstname: string,
    lastname?: string,
    photoUrl?: string,
    hash: string,
    authDate: Date,
}

export const LOGIN_TELEGRAM_ACCOUNT_MUTATION = gql`
    ${TELEGRAM_ACCOUNT_FRAGMENT}
    mutation LoginTelegramAccount($telegramAccountLoginInputType: TelegramAccountLoginInputType!) {
        loginTelegramAccount(telegramAccountLoginInputType: $telegramAccountLoginInputType) {
            ...TelegramAccountFragment
        }
    }
`;


export type LogoutTelegramAccountData = { logoutTelegramAccount: boolean }

export type LogoutTelegramAccountVars = {}

export const LOGOUT_TELEGRAM_ACCOUNT_MUTATION = gql`
    mutation LogoutTelegramAccount {
        logoutTelegramAccount
    }
`;

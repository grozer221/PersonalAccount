import {gql} from '@apollo/client';

export type LoginTelegramAccountData = { loginTelegramAccount: boolean }

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
    mutation LoginTelegramAccount($telegramAccountLoginInputType: TelegramAccountLoginInputType!) {
        loginTelegramAccount(telegramAccountLoginInputType: $telegramAccountLoginInputType)
    }
`;

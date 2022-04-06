import {gql} from '@apollo/client';

export const TELEGRAM_ACCOUNT_FRAGMENT = gql`
    fragment TelegramAccountFragment on TelegramAccountType {
        id
        telegramId
        username
        firstname
        lastname
        photoUrl
        hash
        authDate
        userId
        createdAt
        updatedAt
    }
`;

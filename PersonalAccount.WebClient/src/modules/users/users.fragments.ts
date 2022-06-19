import {gql} from '@apollo/client';
import {PERSONAL_ACCOUNT_FRAGMENT} from '../personalAccounts/personalAccounts.fragments';
import {TELEGRAM_ACCOUNT_FRAGMENT} from '../telegramAccounts/telegramAccounts.fragments';

export const USER_SETTINGS_FRAGMENT = gql`
    ${PERSONAL_ACCOUNT_FRAGMENT}
    ${TELEGRAM_ACCOUNT_FRAGMENT}
    fragment UserSettingsFragment on UserSettingsType {
        group
        subGroup
        englishSubGroup
        minutesBeforeLessonNotification
        minutesBeforeLessonsNotification
        personalAccount {
            ...PersonalAccountFragment
        }
        telegramAccount {
            ...TelegramAccountFragment
        }
    }
`;

export const USER_FRAGMENT = gql`
    ${USER_SETTINGS_FRAGMENT}
    fragment UserFragment on UserType {
        id
        email
        role
        settings {
            ...UserSettingsFragment
        }
        createdAt
        updatedAt
    }
`;

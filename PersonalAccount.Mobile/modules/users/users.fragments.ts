import {gql} from '@apollo/client';
import {PERSONAL_ACCOUNT_FRAGMENT} from '../personalAccounts/personalAccounts.fragments';

export const USER_FRAGMENT = gql`
    ${PERSONAL_ACCOUNT_FRAGMENT}
    fragment UserFragment on UserType {
        id
        email
        role
        group
        subGroup
        englishSubGroup
        personalAccount {
            ...PersonalAccountFragment
        }
        createdAt
        updatedAt
    }
`;

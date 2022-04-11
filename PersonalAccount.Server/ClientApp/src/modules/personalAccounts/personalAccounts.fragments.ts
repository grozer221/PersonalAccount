import {gql} from '@apollo/client';

export const PERSONAL_ACCOUNT_FRAGMENT = gql`
    fragment PersonalAccountFragment on PersonalAccountType {
        username
    }
`;

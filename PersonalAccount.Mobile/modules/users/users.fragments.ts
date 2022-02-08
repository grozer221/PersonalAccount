import {gql} from '@apollo/client';

export const USER_FRAGMENT = gql`
    fragment UserFragment on UserType {
        id
        email
        role
        group
        subGroup
        createdAt
        updatedAt
    }
`;

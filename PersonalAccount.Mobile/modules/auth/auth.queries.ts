import {gql} from '@apollo/client';
import {Auth} from './auth.types';
import {USER_FRAGMENT} from '../users/users.fragments';

export type IsAuthData = { isAuth: Auth }
export type IsAuthVars = {}

export const IS_AUTH_QUERY = gql`
    ${USER_FRAGMENT}
    query IsAuth {
        isAuth {
            user {
                ...UserFragment
            }
            token
        }
    }
`;

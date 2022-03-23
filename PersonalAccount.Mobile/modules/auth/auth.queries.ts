import {gql} from '@apollo/client';
import {Auth} from './auth.types';
import {USER_FRAGMENT} from '../users/users.fragments';

export type IsAuthData = { isAuth: Auth }
export type IsAuthVars = { expoPushToken: string | null }

export const IS_AUTH_QUERY = gql`
    ${USER_FRAGMENT}
    query IsAuth($expoPushToken: String) {
        isAuth(expoPushToken: $expoPushToken) {
            user {
                ...UserFragment
            }
            token
        }
    }
`;

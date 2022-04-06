import {gql} from '@apollo/client';
import {Me} from './auth.types';
import {USER_FRAGMENT} from '../users/users.fragments';

export type MeData = { me: Me }
export type MeVars = { expoPushToken: string | null }

export const ME_QUERY = gql`
    ${USER_FRAGMENT}
    query Me($expoPushToken: String) {
        me(expoPushToken: $expoPushToken) {
            user {
                ...UserFragment
            }
            token
        }
    }
`;

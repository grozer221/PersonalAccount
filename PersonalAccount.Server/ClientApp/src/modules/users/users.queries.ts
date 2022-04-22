import {gql} from '@apollo/client';
import {USER_FRAGMENT} from './users.fragments';
import {GetEntitiesResponse} from '../../abstractions/GetEntitiesResponse';
import {User} from './users.types';

export type GetUsersData = { getUsers: GetEntitiesResponse<User> }
export type GetUsersVars = { page: number }

export const GET_USERS_QUERY = gql`
    ${USER_FRAGMENT}
    query GetUsers($page: Int!){
        getUsers(page: $page) {
            entities {
                ...UserFragment
            }
            total
            pageSize
        }
    }
`;

export type GetUserData = { getUser: User }
export type GetUserVars = { id: string }

export const GET_USER_QUERY = gql`
    ${USER_FRAGMENT}
    query GetUser($id: ID!){
        getUser(id: $id) {
            ...UserFragment
        }
    }
`;

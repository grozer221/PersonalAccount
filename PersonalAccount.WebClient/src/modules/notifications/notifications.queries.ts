import {gql} from '@apollo/client';
import {NOTIFICATION_FRAGMENT} from './notifications.fragments';
import {GetEntitiesResponse} from '../../abstractions/GetEntitiesResponse';
import {NotificationType} from './notifications.types';

export type GetMyNotificationsData = { getMyNotifications: GetEntitiesResponse<NotificationType> }
export type GetMyNotificationsVars = { page: number }

export const GET_MY_NOTIFICATIONS_QUERY = gql`
    ${NOTIFICATION_FRAGMENT}
    query GetMyNotifications($page: Int!) {
        getMyNotifications(page: $page) {
            entities {
                ...NotificationFragment
            }
            total
            pageSize
        }
    }
`;

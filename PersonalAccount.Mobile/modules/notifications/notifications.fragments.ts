import {gql} from '@apollo/client';

export const NOTIFICATION_FRAGMENT = gql`
    fragment NotificationFragment on NotificationType {
        title
        body
    }
`

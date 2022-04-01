import {gql} from '@apollo/client';
import {SUBJECT_FRAGMENT} from '../schedule/shcedule.fragments';

export const NOTIFICATION_FRAGMENT = gql`
    ${SUBJECT_FRAGMENT}
    fragment NotificationFragment on NotificationType {
        id
        title
        body
        subject {
            ...SubjectFragment
        }
        createdAt
        updatedAt
    }
`

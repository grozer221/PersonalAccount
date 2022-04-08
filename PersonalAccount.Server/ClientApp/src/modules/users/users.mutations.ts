import {gql} from '@apollo/client';

export type UpdateGroupData = { updateGroup: boolean }
export type UpdateGroupVars = { group: string, subGroup?: number | null }

export const UPDATE_GROUP_MUTATION = gql`
    mutation UpdateGroup($group: String!, $subGroup: Int!){
        updateGroup(group: $group, subGroup: $subGroup)
    }
`;


export type UpdateEnglishSubGroupData = {}
export type UpdateEnglishSubGroupVars = { englishSubGroup: number }

export const UPDATE_ENGLISH_SUBGROUP_MUTATION = gql`
    mutation UpdateGroup($englishSubGroup: Int!){
        updateEnglishSubGroup(englishSubGroup: $englishSubGroup)
    }
`;

export type UpdateMinuteBeforeLessonNotificationData = { updateMinutesBeforeLessonNotification: boolean }
export type UpdateMinuteBeforeLessonNotificationVars = { minutesBeforeLessonNotification: number, minutesBeforeLessonsNotification: number }

export const UPDATE_MINUTES_BEFORE_LESSON_NOTIFICATION_MUTATION = gql`
    mutation UpdateMinutesBeforeLessonNotification($minutesBeforeLessonNotification: Int!, $minutesBeforeLessonsNotification: Int!){
        updateMinutesBeforeLessonNotification(minutesBeforeLessonNotification: $minutesBeforeLessonNotification, minutesBeforeLessonsNotification: $minutesBeforeLessonsNotification)
    }
`;

export type RemoveUserData = { removeUser: boolean }
export type RemoveUserVars = { userId: string }

export const REMOVE_USER_MUTATION = gql`
    mutation RemoveUser($userId: ID!) {
        removeUser(userId: $userId)
    }
`;

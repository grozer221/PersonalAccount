import {gql} from '@apollo/client';
import {UserSettings} from './users.types';
import {USER_SETTINGS_FRAGMENT} from './users.fragments';

export type UpdateSettingsData = { updateSettings: UserSettings }

export type UpdateSettingsVars = { updateSettingsInputType: UpdateSettingsInputType }
export type UpdateSettingsInputType = {
    group: string,
    subGroup: number,
    englishSubGroup: number,
    minutesBeforeLessonNotification: number,
    minutesBeforeLessonsNotification: number,
}

export const UPDATE_SETTINGS_MUTATION = gql`
    ${USER_SETTINGS_FRAGMENT}
    mutation UpdateSettings($updateSettingsInputType: UpdateSettingsInputType!) {
        updateSettings(updateSettingsInputType: $updateSettingsInputType) {
            ...UserSettingsFragment
        }
    }
`;

export type RemoveUserData = { removeUser: boolean }
export type RemoveUserVars = { userId: string }

export const REMOVE_USER_MUTATION = gql`
    mutation RemoveUser($userId: ID!) {
        removeUser(userId: $userId)
    }
`;

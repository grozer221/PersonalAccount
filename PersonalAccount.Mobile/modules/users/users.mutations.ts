import {gql} from '@apollo/client';

export type UpdateGroupData = { updateGroup: boolean }
export type UpdateGroupVars = { group: string, subGroup?: number | null }

export const UPDATE_GROUP_MUTATION = gql`
    mutation UpdateGroup($group: String!, $subGroup: Int){
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

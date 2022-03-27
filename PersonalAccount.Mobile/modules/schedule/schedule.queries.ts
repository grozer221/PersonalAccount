import {gql} from '@apollo/client';
import {Subject, Week} from './schedule.types';
import {DAY_FRAGMENT, SUBJECT_FRAGMENT, WEEK_FRAGMENT} from './shcedule.fragments';

export type GetScheduleForTwoWeeksData = { getScheduleForTwoWeeks: Week[] }
export type GetScheduleForTwoWeeksVars = {}

export const GET_SCHEDULE_FOR_TWO_WEEKS_QUERY = gql`
    ${SUBJECT_FRAGMENT}
    ${DAY_FRAGMENT}
    ${WEEK_FRAGMENT}
    query GetScheduleForTwoWeeks {
        getScheduleForTwoWeeks {
            ...WeekFragment
        }
    }
`;


export type GetScheduleForTodayData = { getScheduleWithLinksForToday: Subject[] }
export type GetScheduleForTodayVars = {}

export const GET_SCHEDULE_FOR_TODAY_QUERY = gql`
    ${SUBJECT_FRAGMENT}
    query GetScheduleWithLinksForToday {
        getScheduleWithLinksForToday {
            ...SubjectFragment
        }
    }
`;


export type GetAllGroupsData = { getAllGroups: string[] }
export type GetAllGroupsVars = {}

export const GET_ALL_GROUPS_QUERY = gql`
    query GetAllGroups {
        getAllGroups
    }
`;

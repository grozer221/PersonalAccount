import {gql} from '@apollo/client';
import {Week} from './schedule.types';
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

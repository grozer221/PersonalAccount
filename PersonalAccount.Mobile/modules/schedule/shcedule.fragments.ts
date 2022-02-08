import {gql} from '@apollo/client';

export const SUBJECT_FRAGMENT = gql`
    fragment SubjectFragment on SubjectType {
        time
        cabinet
        type
        name
        teacher
        link
    }
`;

export const DAY_FRAGMENT = gql`
    fragment DayFragment on DayType {
        name
        subjects {
            ...SubjectFragment
        }
    }
`;

export const WEEK_FRAGMENT = gql`
    fragment WeekFragment on WeekType {
        name
        days {
            ...DayFragment
        }
    }

`;

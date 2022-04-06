import {gql} from '@apollo/client';

export const schema = gql`
    schema {
        query: Queries
        mutation: Mutations
        subscription: Subscriptions
    }

    type Queries {
        isAuth(
            """
            Argument for set Expo Push Token
            """
            expoPushToken: String
        ): AuthResponseType!
        getScheduleForTwoWeeks: [WeekType]!
        getScheduleForToday: [SubjectType]!
        getUsers: [UserType]!
    }

    type AuthResponseType {
        user: UserType!
        token: String!
    }

    type UserType {
        id: ID!
        createdAt: DateTime!
        updatedAt: DateTime!
        email: String!
        role: RoleEnum!
        group: String!
        subGroup: Int!
        expoPushToken: String
        personalAccount: PersonalAccountType
    }

    """
    The \`DateTime\` scalar type represents a date and time. \`DateTime\` expects timestamps to be formatted in accordance with the [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) standard.
    """
    scalar DateTime

    enum RoleEnum {
        USER
        ADMIN
    }

    type PersonalAccountType {
        id: ID!
        createdAt: DateTime!
        updatedAt: DateTime!
        username: String!
    }

    type WeekType {
        name: String!
        days: [DayType]!
    }

    type DayType {
        name: String!
        subjects: [SubjectType]!
    }

    type SubjectType {
        time: String!
        cabinet: String!
        type: String!
        name: String!
        teacher: String!
        link: String
    }

    type Mutations {
        login(
            """
            Argument for login User
            """
            authLoginInputType: AuthLoginInputType!
        ): AuthResponseType!
        register(
            """
            Argument for register User
            """
            authLoginInputType: AuthLoginInputType!
        ): AuthResponseType!
        loginPersonalAccount(
            """
            Argument for login in Personal Account
            """
            personalAccountLoginInputType: PersonalAccountLoginInputType!
        ): PersonalAccountType!
    }

    input AuthLoginInputType {
        email: String!
        password: String!
    }

    input PersonalAccountLoginInputType {
        username: String!
        password: String!
    }

    type Subscriptions {
        userAdded: UserType
    }
`

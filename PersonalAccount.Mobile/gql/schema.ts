import {gql} from '@apollo/client';

export const schema = gql`
    schema {
        query: Queries
        mutation: Mutations
        subscription: Subscriptions
    }

    type Queries {
        getUsers: [UserType]
        isAuth: AuthResponseType
        getScheduleForTwoWeeks: [WeekType]
    }

    type UserType {
        id: ID
        email: String
        role: RoleEnum
        group: String
        subGroup: Int
        createdAt: DateTime
        updatedAt: DateTime
    }

    enum RoleEnum {
        USER
        ADMIN
    }

    """
    The \`DateTime\` scalar type represents a date and time. \`DateTime\` expects timestamps to be formatted in accordance with the [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) standard.
    """
    scalar DateTime

    type AuthResponseType {
        """
        User type
        """
        user: UserType

        """
        Token type
        """
        token: String
    }

    type WeekType {
        name: String
        days: [DayType]
    }

    type DayType {
        name: String
        subjects: [SubjectType]
    }

    type SubjectType {
        time: ID
        cabinet: String
        type: String
        name: String
        teacher: String
        link: String
    }

    type Mutations {
        createUser(
            """
            Argument for create new User
            """
            usersCreateInputType: UsersCreateInputType
        ): UserType
        login(
            """
            Argument for login User
            """
            authLoginInputType: AuthLoginInputType
        ): AuthResponseType
        register(
            """
            Argument for register User
            """
            authLoginInputType: AuthLoginInputType
        ): AuthResponseType
    }

    input UsersCreateInputType {
        email: String
    }

    input AuthLoginInputType {
        email: String
        password: String
    }

    type Subscriptions {
        userAdded: UserType
    }
`

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
    }

    type UserType {
        """
        User id.
        """
        id: ID

        """
        User Email.
        """
        email: String

        """
        User role.
        """
        role: RoleEnum

        """
        User creation date.
        """
        createdAt: DateTime

        """
        User update date.
        """
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

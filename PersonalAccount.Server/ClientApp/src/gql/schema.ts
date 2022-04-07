import {gql} from '@apollo/client';

export const schema = gql`
    schema {
        query: Queries
        mutation: Mutations
        subscription: Subscriptions
    }

    type Queries {
        me(
            """
            Argument for set Expo Push Token
            """
            expoPushToken: String
        ): AuthResponseType!
        getMyNotifications(
            """
            Argument for get My Notifications
            """
            page: Int
        ): GetNotificationResponseType!
        getScheduleForTwoWeeks: [WeekType]!
        getScheduleForToday: [SubjectType]!
        getAllGroups: [String]!
        getSelectiveSubjects: [SelectiveSubjectType]!
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
        englishSubGroup: Int!
        minutesBeforeLessonNotification: Int!
        minutesBeforeLessonsNotification: Int!
        personalAccount: PersonalAccountType
        telegramAccount: TelegramAccountType
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

    type TelegramAccountType {
        id: ID!
        createdAt: DateTime!
        updatedAt: DateTime!
        telegramId: Int!
        username: String!
        firstname: String!
        lastname: String!
        photoUrl: String!
        hash: String!
        authDate: DateTime!
        userId: ID!
    }

    type GetNotificationResponseType {
        entities: [NotificationType]!
        total: Int!
        pageSize: Int!
    }

    type NotificationType {
        id: ID!
        createdAt: DateTime!
        updatedAt: DateTime!
        title: String!
        body: String!
        subject: SubjectType
    }

    type SubjectType {
        time: String!
        cabinet: String!
        type: String!
        name: String!
        teacher: String!
        link: String
    }

    type WeekType {
        name: String!
        days: [DayType]!
    }

    type DayType {
        name: String!
        subjects: [SubjectType]!
    }

    type SelectiveSubjectType {
        name: String!
        isSelected: Boolean!
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
        logout(
            """
            Argument for logout User
            """
            removeExpoPushToken: Boolean = false
        ): Boolean!
        loginPersonalAccount(
            """
            Argument for login in Personal Account
            """
            personalAccountLoginInputType: PersonalAccountLoginInputType!
        ): UserType!
        logoutPersonalAccount: Boolean!
        loginTelegramAccount(
            """
            Argument for login in Telegram Account
            """
            telegramAccountLoginInputType: TelegramAccountLoginInputType!
        ): Boolean!
        updateGroup(
            """
            Argument for Update Group
            """
            group: String!

            """
            Argument for Update SubGroup
            """
            subGroup: Int
        ): Boolean!
        updateEnglishSubGroup(
            """
            Argument for Update EnlishSubGroup
            """
            englishSubGroup: Int! = 0
        ): Boolean!
        updateMinutesBeforeLessonNotification(
            """
            Argument for Update MinutesBeforeLessonNotification
            """
            minutesBeforeLessonNotification: Int! = 0

            """
            Argument for Update MinutesBeforeLessonNotification
            """
            minutesBeforeLessonsNotification: Int! = 0
        ): Boolean!
    }

    input AuthLoginInputType {
        email: String!
        password: String!
    }

    input PersonalAccountLoginInputType {
        username: String!
        password: String!
    }

    input TelegramAccountLoginInputType {
        telegramId: Int!
        username: String!
        firstname: String!
        lastname: String!
        photoUrl: String!
        hash: String!
        authDate: DateTime!
        userId: ID!
    }

    type Subscriptions {
        userAdded: UserType
    }
`

import {gql} from '@apollo/client';

export const schema = gql`
    schema {
        query: Queries
        mutation: Mutations
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
        getUsers(
            """
            Argument for Get Users
            """
            page: Int! = 0
        ): GetUserResponseType!
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
        settings: UserSettingsType!
    }

    """
    The \`DateTime\` scalar type represents a date and time. \`DateTime\` expects timestamps to be formatted in accordance with the [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) standard.
    """
    scalar DateTime

    enum RoleEnum {
        USER
        ADMIN
    }

    type UserSettingsType {
        group: String!
        subGroup: Int!
        englishSubGroup: Int!
        minutesBeforeLessonNotification: Int!
        minutesBeforeLessonsNotification: Int!
        personalAccount: PersonalAccountType
        telegramAccount: TelegramAccountType
    }

    type PersonalAccountType {
        username: String!
    }

    type TelegramAccountType {
        telegramId: Long!
        username: String
        firstname: String!
        lastname: String
        photoUrl: String
        hash: String!
        authDate: DateTime!
    }

    scalar Long

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

    type GetUserResponseType {
        entities: [UserType]!
        total: Int!
        pageSize: Int!
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
        removeMe: Boolean!
        loginAsUser(
            """
            Argument for Login as User
            """
            userId: ID! = "00000000-0000-0000-0000-000000000000"
        ): AuthResponseType!
        broadcastMessage(
            """
            Argument for Broadcast message
            """
            message: String!
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
        ): TelegramAccountType!
        logoutTelegramAccount: Boolean!
        updateSettings(
            """
            Argument for Update Settings
            """
            updateSettingsInputType: UpdateSettingsInputType!
        ): UserSettingsType!
        removeUser(
            """
            Argument for Remove User
            """
            userId: ID! = "00000000-0000-0000-0000-000000000000"
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
        telegramId: Long!
        username: String
        firstname: String!
        lastname: String
        photoUrl: String
        hash: String!
        authDate: DateTime!
    }

    input UpdateSettingsInputType {
        group: String!
        subGroup: Int!
        englishSubGroup: Int!
        minutesBeforeLessonNotification: Int!
        minutesBeforeLessonsNotification: Int!
    }
`

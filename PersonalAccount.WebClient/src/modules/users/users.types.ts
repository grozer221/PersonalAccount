import {PersonalAccount} from '../personalAccounts/personalAccounts.types';
import {TelegramAccount} from '../telegramAccounts/telegramAccounts.type';

export type UserSettings = {
    group: string,
    subGroup: number,
    englishSubGroup: number,
    minutesBeforeLessonNotification: number,
    minutesBeforeLessonsNotification: number,
    personalAccount: PersonalAccount | null | undefined,
    telegramAccount: TelegramAccount | null | undefined,
}

export type User = {
    id: string,
    email: string,
    role: Role,
    settings: UserSettings,
    createdAt: string,
    updatedAt: string,
}

export enum Role {
    User = 'USER',
    Admin = 'ADMIN',
}

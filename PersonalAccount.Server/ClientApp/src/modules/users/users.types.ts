import {PersonalAccount} from '../personalAccounts/personalAccounts.types';
import {TelegramAccount} from '../telegramAccounts/telegramAccounts.type';

export type User = {
    id: string,
    email: string,
    role: Role,
    group: string,
    subGroup: number,
    englishSubGroup: number,
    minutesBeforeLessonNotification: number,
    minutesBeforeLessonsNotification: number,
    personalAccount: PersonalAccount | null,
    telegramAccount: TelegramAccount | null,
    createdAt: string,
    updatedAt: string,
}

export enum Role {
    User = 'USER',
    Admin = 'ADMIN',
}

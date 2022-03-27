import {PersonalAccount} from '../personalAccounts/personalAccounts.types';

export type User = {
    id: number,
    email: string,
    role: Role,
    group: string,
    subGroup: number,
    englishSubGroup: number,
    personalAccount: PersonalAccount | null,
    createdAt: string,
    updatedAt: string,
}

export enum Role {
    User = 'User',
    Admin = 'Admin',
}

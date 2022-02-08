export type User = {
    id: number,
    email: string,
    role: Role,
    group: string,
    subGroup: number,
    createdAt: string,
    updatedAt: string,
}

export enum Role {
    User = 'User',
    Admin = 'Admin',
}

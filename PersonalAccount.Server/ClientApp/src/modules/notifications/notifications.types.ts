import {Subject} from '../schedule/schedule.types';

export type NotificationType = {
    id: string,
    title: string,
    body: string,
    subject: Subject | null,
    createdAt: string,
    updatedAt: string,
}

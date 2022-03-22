import {Subject} from '../schedule/schedule.types';

export type NotificationType = {
    title: string,
    body: string,
    date: string,
    subject: Subject | null,
}

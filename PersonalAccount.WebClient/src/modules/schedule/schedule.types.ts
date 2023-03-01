export type Week = {
    number: number
    name: string,
    days: Day[],
}

export type Day = {
    number: number
    extraText: string,
    name: string,
    subjects: Subject[],
}

export type Subject = {
    time: string,
    startTime: string,
    endTime: string,
    cabinet: string,
    type: string,
    name: string,
    teacher: string,
    link?: string | null,
}

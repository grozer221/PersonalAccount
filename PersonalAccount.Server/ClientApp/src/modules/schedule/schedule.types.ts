export type Week = {
    name: string,
    days: Day[],
}

export type Day = {
    name: string,
    subjects: Subject[],
}

export type Subject = {
    time: string,
    cabinet: string,
    type: string,
    name: string,
    teacher: string,
    link: string,
}

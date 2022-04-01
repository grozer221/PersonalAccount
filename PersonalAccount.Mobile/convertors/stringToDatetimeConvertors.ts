export const stringToUkraineDate = (dateString: string): string => {
    const date = new Date(Date.parse(dateString));
    return `${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}.${date.getMonth() < 10 ? `0${date.getMonth()}` : date.getMonth()}.${date.getFullYear()}`;
};

export const stringToUkraineTime = (dateString: string): string => {
    const date = new Date(Date.parse(dateString));
    return date.toLocaleTimeString('uk');
};

export const stringToUkraineDatetime = (dateString: string): string => {
    return `${stringToUkraineTime(dateString)} ${stringToUkraineDate(dateString)}`;
};

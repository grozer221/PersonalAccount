export const stringToUkraineDate = (dateString: string): string => {
    const date = new Date(Date.parse(dateString));
    return date.toLocaleDateString('uk');
}

export const stringToUkraineTime = (dateString: string): string => {
    const date = new Date(Date.parse(dateString));
    return date.toLocaleTimeString('uk')
}

export const stringToUkraineDatetime = (dateString: string): string => {
    return `${stringToUkraineTime(dateString)} ${stringToUkraineDate(dateString)}`;
}

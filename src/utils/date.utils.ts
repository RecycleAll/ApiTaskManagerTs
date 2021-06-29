export function parseDate(dateString: string) {

    if( dateString === undefined){
        return  null;
    }else {
        if (dateString.includes('/')) {
            const str = dateString.split('/');
            console.log(str);
            const year = Number(str[0]);
            const month = Number(str[1]) - 1;
            const date = Number(str[2]);
            console.log(year);
            console.log(month);
            console.log(date);
            return new Date(year, month, date);
        } else {
            return null;
        }
    }
}

export function verifyDate(start: Date, end: Date){
    return start <= end;
}

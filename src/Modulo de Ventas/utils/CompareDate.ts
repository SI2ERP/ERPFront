

export function compareDates(date1 : Date, date2 : Date) {
    if(date1.getTime() == date2.getTime()) {
        return 0
    } else if(date1.getTime() < date2.getTime()) {
        return -1
    } else {
        return 1
    }

}
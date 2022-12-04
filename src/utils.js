const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const formatDate = function (date) {
    const ISODate = getUTCFormat(date);
    let day = formatData(ISODate.getDate());
    return `${ISODate.getFullYear()}-${months[ISODate.getMonth()]}-${day}`;
}

const getUTCFormat = function (date) {
    return new Date(date.toISOString())
}

const formatData = (input) => {
    if (input > 9) {
        return input;
    } else return `0${input}`;
};

export const formatTime = function (date) {
    const ISODate = getUTCFormat(date);
    return `${formatData(ISODate.getHours())}:${formatData(ISODate.getMinutes())}`;
}

export const addHours = function (date, numOfHours) {
    let ISODate = getUTCFormat(date);
    ISODate.setTime(ISODate.getTime() + numOfHours * 60 * 60 * 1000);
    return ISODate;
}

export const hasDatesDiff = function (d1, d2) {
    let date1 = new Date(d1.getFullYear(), d1.getMonth() + 1, d1.getDate(), d1.getHours(), d1.getMinutes(), d1.getSeconds());
    let date2 = new Date(d2.getFullYear(), d2.getMonth() + 1, d2.getDate(), d2.getHours(), d2.getMinutes(), d2.getSeconds());
    if (date1.getTime() < date2.getTime()) return true;
    return false;
}
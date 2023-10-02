import moment from 'moment';

export const convertGMTOffsetToLocalString = (offset) => {
    const dateLocal = (moment().utc()).clone().add(offset, 'hours');
    const timeDateLocal = dateLocal.format('dddd, MMMM D, HH:mm');
    return timeDateLocal;
}
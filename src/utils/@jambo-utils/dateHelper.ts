import moment from 'moment';

export const getTodayDate = (format = 'DD.MM.YYYY') => {
  return moment().format(format);
};

export const getYesterdayDate = () => {
  return moment()
    .subtract(1, 'day')
    .format('DD.MM.YYYY');
};

export const timeFromNow = (date:string | Date) => {
  const timestamp:any = moment(date).format('X');
  const newDate = moment.unix(timestamp);

  
return moment(newDate).fromNow();
};

export const isToday = (date:string | Date) => {
  return moment().isSame(date, 'day');
};

export const getNewDate = (noOfDays:any, format = 'DD MMM, YYYY') => {
  return moment()
    .add(noOfDays, 'days')
    .format(format);
};

export const getDateElements = (date:string | Date) => {
  const dateString = moment(date).format('dddd, MMMM DD YYYY, hh:mm A');
  const dateStingNumeric = moment(date).format('DD/MM/YYYY hh:mm A');

  const dateSections = dateString.split(',');
  const day = dateSections[0];
  const time = dateSections[2];
  const datePart = dateSections[1].trim().split(' ');

  
return {
    day,
    time,
    date: {
      dateString: dateSections[1],
      month: datePart[0],
      date: datePart[1],
      year: datePart[2],
      numerical: dateStingNumeric,
    },
  };
};

export const getTime = (date:string | Date) => {
  const dateObj = moment(date, 'dddd, MMMM DD YYYY, hh:mm a');

  
return moment(dateObj).format('LT');
};

export const isDatesSame = (dateA:string | Date, dateB:string | Date) => {
  return moment(dateA).isSame(dateB, 'day');
};

export const isDateAfter = (date: any) => {
  const todayDate = getTodayDate('dddd, MMMM DD YYYY, hh:mm a');

  
return moment(todayDate).isAfter(date);
};

export const getDateinDesiredFormat = (date:string | Date, format:any) => {
  return moment(date).format(format);
};

export const makeJSDateObject = (date:any) => {
  if (date) {
    return new Date(date.getTime());
  }

  
return date;
};

/**
 * Get Formatted Date
 * @param date
 * @param format
 * @returns {string}
 */
export const getFormattedDate = (date:string | Date, format = 'YYYY-MM-DD') => {
  if (moment(date, 'YYYY-MM-DD').isValid()) {
    return moment(date).format(format);
  }

  return '';
};

/**
 * Check Is dateTime of Tomorrow
 * @param inputDateTime
 * @returns {boolean}
 */
export const isTomorrow = (inputDateTime:any) => {
  const tomorrow = moment()
    .add(1, 'days')
    .format('YYYY-MM-DD');

  return moment(inputDateTime).isSame(tomorrow, 'day');
};

/**
 * Check Is dateTime of Yesterday
 * @param inputDateTime
 * @returns {boolean}
 */
export const isYesterday = (inputDateTime:any) => {
  const yesterday = moment()
    .subtract(1, 'days')
    .format('YYYY-MM-DD');

  return moment(inputDateTime).isSame(yesterday, 'day');
};

/**
 * Get Custom Date Time
 * @param value
 * @param unit
 * @param format
 * @returns {string}
 */
export const getCustomDateTime = (value :any = 0, unit = 'days', format = 'YYYY-MM-DD') => {
  if (value === 0) {
    return moment().format(format);
  } else {
    return moment()
      .add(value, unit)
      .format(format);
  }
};

/**
 * Get Custom Date object
 * @param value
 * @param unit
 * @returns Date object
 */
export const getCustomDateObject = (value :any = 0, unit = 'days') => {
  if (value === 0) {
    return moment();
  } else {
    return moment().add(value, unit);
  }
};

export const getDateText = (date:string | Date) => {
  if (isToday(date)) {
    return 'Today';
  } else if (isYesterday(date)) {
    return 'Yesterday';
  } else if (isTomorrow(date)) {
    return 'Tomorrow';
  } else {
    return date;
  }
};

export const getTimeDiffString = (date:string | Date, format = 'DD MMM, YYYY', suffix = '') => {
  const postDate = moment(date, 'ddd MMM DD YYYY kk:mm:ss Z');
  const currentDate = moment();
  const duration = moment.duration(currentDate.diff(postDate));
  const minutes = duration.asMinutes() | 0;
  const hours = duration.asHours() | 0;

  switch (true) {
    case minutes === 0:
      return 'Just now';
    case minutes < 60:
      return `${minutes} min ${suffix}`;
    case hours < 24:
      return `${hours} hours ${suffix}`;
    default:
      return postDate.format(format);
  }
};

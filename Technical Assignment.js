"use strict";

/*
  Atlantic Coast Automotive Group - Technical Assignment
  Author: Richard Howlett
*/

const moment = require("moment-timezone");
const DATE_FORMAT = "MM/DD/YYYY";

/*QUESTION 1 - Parsing*/

const question1 = () => {
  const inputs = ["13/02/2022", "03/04/2022", "Q3 of 2021", "Tue, 22 Feb 2022"];
  for (let i = 0; i < inputs.length; i++) {
    console.log(`Before: ${inputs[i]} | After: ${formatAnyInputToStandardDate(inputs[i])}`);
  }
};

const formatAnyInputToStandardDate = input => {
  // Use this regex to parse string with quarter instead of date
  const quarterRegx = new RegExp("q[1-4]");
  const isQuarter = quarterRegx.test(input.toLowerCase()) && input.toLowerCase().includes("of");

  switch (true) {
    // This case converts dd/mm/yyyy formats to the target date format.
    case moment(input, "DD/MM/YYYY", true).isValid(): {
      return moment(input, "DD/MM/YYYY", true).format(DATE_FORMAT);
    }
    // This case assumes the format is consistent with all quarter dates
    case isQuarter: {
      const quarter = input?.toLowerCase().match(quarterRegx)?.[0]?.slice(1) ?? "0";
      return moment(input?.split("of")[1], "YYYY").quarter(quarter).format(DATE_FORMAT);
    }
    default: {
      return moment(input).format(DATE_FORMAT);
    }
  }
};

// question1();
/*---------------------------------------------------------------------------------------*/

/*QUESTION 2 - First Monday of Year*/

const getFirstMondayOfYear = year => {
  const result = moment(year, "YYYY", true).day("Monday");
  if (!result.isValid()) {
    console.log("The date you entered is invalid");
    return;
  }
  // Checks if monday of current week falls in the last month of previous year
  console.log(result.year() === year - 1 ? result.add(7, "days").format(DATE_FORMAT) : result.format(DATE_FORMAT));
};

// getFirstMondayOfYear(2022);
/*---------------------------------------------------------------------------------------*/

/*QUESTION 3 - Last Monday of Year*/

const getLastMondayOfYear = year => {
  const result = moment(year, "YYYY", true).endOf("year").day("Monday");
  // Checks if monday of current week falls in the first month of the following year
  console.log(result.year() === year + 1 ? result.subtract(7, "days").format(DATE_FORMAT) : result.format(DATE_FORMAT));
};

// getLastMondayOfYear(2022);
/*---------------------------------------------------------------------------------------*/

/*QUESTION 4 - Difference between two dates*/

const differenceBetweenTwoDates = (date1, time1, date2, time2, useSeconds = false) => {
  const moment1 = moment(`${date1} ${time1}`, `${DATE_FORMAT} HH:mm${useSeconds ? ":ssZ" : ""}`);
  const moment2 = moment(`${date2} ${time2}`, `${DATE_FORMAT} HH:mm${useSeconds ? ":ssZ" : ""}`);

  if (!moment1.isValid() || !moment2.isValid()) {
    console.log("One the dates you entered is invalid");
    return;
  }

  let seconds;

  // Calculate the difference in each category and add them to the moment to get remaining time.
  let years = moment1.diff(moment2, "years");
  if (!useSeconds) {
    moment2.add(years, "years");
  }
  years = Math.abs(years);

  let months = moment1.diff(moment2, "months");
  moment2.add(months, "months");
  months = Math.abs(months);

  let days = moment1.diff(moment2, "days");
  moment2.add(days, "days");
  days = Math.abs(days);

  let hours = moment1.diff(moment2, "hours");
  moment2.add(hours, "hours");
  hours = Math.abs(hours);

  let minutes = moment1.diff(moment2, "seconds", true) / 60.0;
  // Ensures the correct minute value is maintained regardless of parameter order
  minutes = minutes < 0 ? Math.ceil(minutes) : Math.floor(minutes);

  if (useSeconds) {
    moment2.add(minutes, "minutes");
    seconds = useSeconds ? Math.abs(moment1.diff(moment2, "seconds")) : 0;
  }

  minutes = Math.abs(minutes);

  console.log(
    useSeconds
      ? `${months} Months, ${days} Days, ${hours} Hours and ${minutes} Minute ${seconds} Seconds`
      : `${years} Years, ${months} Months, ${days} Days, ${hours} Hours and ${minutes} Minute
    }`
  );
};

// differenceBetweenTwoDates("03/01/2022 ", "13:03", "03/01/2022", "15:04");

/*---------------------------------------------------------------------------------------*/

/*QUESTION 5 - Closest to Now*/

const closestToNow = () => {
  const maxDays = 1000;
  const moment1 = moment().subtract(Math.floor(Math.random() * maxDays), "days");
  const moment2 = moment().subtract(Math.floor(Math.random() * maxDays), "days");

  const daysBetweenDate1 = moment().diff(moment1, "days");
  const daysBetweenDate2 = moment().diff(moment2, "days");

  console.log(`Current Date: ${moment().format(DATE_FORMAT)}`);
  console.log(`Date 1: ${moment1.format(DATE_FORMAT)} | Date 2: ${moment2.format(DATE_FORMAT)}`);
  console.log(
    daysBetweenDate1 < daysBetweenDate2
      ? `Date 1 is closer with ${daysBetweenDate1} days.`
      : `Date 2 is closer with ${daysBetweenDate2} days.`
  );
};

// closestToNow();

/*---------------------------------------------------------------------------------------*/

/*QUESTION 6 - Countdown to Miami 2026 */

const countdown = (timezone, targetName) => {
  if (moment.tz.zone(timezone) === null) {
    console.log("You have entered an invalid timezone");
    return;
  }

  const target = moment.tz("01/01/2026", DATE_FORMAT, timezone).startOf("year");
  const localTZ = moment.tz.guess();
  const now = moment.tz(localTZ);

  const currentInfo = now.format(`${DATE_FORMAT} HH:mm:ssZ`).split(" ");
  const targetInfo = target.format(`${DATE_FORMAT} HH:mm:ssZ`).split(" ");

  // console.log(currentInfo);
  // console.log(targetInfo);

  console.log(`Countdown to ${targetName}`);
  differenceBetweenTwoDates(currentInfo[0], currentInfo[1], targetInfo[0], targetInfo[1], true);
};

// countdown("America/New_York", "Miami");

/*---------------------------------------------------------------------------------------*/

/*QUESTION 7 - Countdown to Qatar 2026*/
// countdown("Asia/Kuwait", "Qatar");

/*---------------------------------------------------------------------------------------*/

/*QUESTION 8 - Timezone Difference*/

const timezoneHourDifference = (dateAndTime, timezone1, timezone2) => {
  const moment1 = moment.tz(dateAndTime, `${DATE_FORMAT} hh:mma`, timezone1);
  const moment2 = moment.tz(dateAndTime, `${DATE_FORMAT} hh:mma`, timezone2);

  if (moment.tz.zone(timezone1) === null || moment.tz.zone(timezone2) === null) {
    console.log("You have entered an invalid timezone");
    return;
  }
  if (!moment1.isValid() || !moment2.isValid()) {
    console.log("The date you entered is invalid");
    return;
  }

  console.log(Math.abs(moment2.utcOffset() - moment1.utcOffset()) / 60);
};

// timezoneHourDifference("03/02/2022 03:45pm", "America/Los_Angeles", "Asia/Shanghai");

/*---------------------------------------------------------------------------------------*/

/*QUESTION 9 - All Days Of The Week of the Month*/

const getAllSpecificDays = (year, month, dayOfWeek) => {
  const specificDays = [];
  const target = moment(`${year} ${month}`, "yyyy M").day(dayOfWeek);

  console.log(target);

  if (!target.isValid()) {
    console.log("The date you entered is invalid");
    return;
  }

  if (target.month() < 2) {
    target.add(7, "days");
  }

  while (target.month() === month - 1) {
    specificDays.push(target.format(DATE_FORMAT));
    target.add(7, "days");
  }
  console.log(specificDays);
};

// getAllSpecificDays(2022, 3, "Tuesday");

/*--------------------------------------------------------------------- ------------------*/

/*QUESTION 10 - Imaginary World*/

const getWeekOfYear = date => {
  const target = moment(date);
  if (!target.isValid()) {
    console.log("The date you entered is invalid");
    return;
  }

  const startOfYear = moment(`${target.year()}`).month(2).startOf("month");

  // Separate method to process days before March.
  if (target.month() < 2) {
    const januaryStart = moment(`${target.year()}`).startOf("year");
    const endOfYear = moment(`${target.year()}`).endOf("year");
    let currentWeek = endOfYear.diff(startOfYear, "weeks") + 1;

    const weeksBeforeMarch = target.diff(januaryStart, "weeks") + 1;
    console.log(`You are in week (${currentWeek + weeksBeforeMarch})`);
    return;
  }
  console.log(`You are in week (${target.diff(startOfYear, "weeks") + 1})`);
};
// getWeekOfYear("3/18/2021");

/*---------------------------------------------------------------------------------------*/

import {DateTimeFormatter} from "./formatter.mjs";
export const SECOND = 1e3;
export const MINUTE = SECOND * 60;
export const HOUR = MINUTE * 60;
export const DAY = HOUR * 24;
export const WEEK = DAY * 7;
const DAYS_PER_WEEK = 7;
var Day;
(function(Day2) {
  Day2[Day2["Sun"] = 0] = "Sun";
  Day2[Day2["Mon"] = 1] = "Mon";
  Day2[Day2["Tue"] = 2] = "Tue";
  Day2[Day2["Wed"] = 3] = "Wed";
  Day2[Day2["Thu"] = 4] = "Thu";
  Day2[Day2["Fri"] = 5] = "Fri";
  Day2[Day2["Sat"] = 6] = "Sat";
})(Day || (Day = {}));
export function parse(dateString, formatString) {
  const formatter2 = new DateTimeFormatter(formatString);
  const parts = formatter2.parseToParts(dateString);
  return formatter2.partsToDate(parts);
}
export function format(date, formatString) {
  const formatter2 = new DateTimeFormatter(formatString);
  return formatter2.format(date);
}
export function dayOfYear(date) {
  const yearStart = new Date(date);
  yearStart.setUTCFullYear(date.getUTCFullYear(), 0, 0);
  const diff = date.getTime() - yearStart.getTime() + (yearStart.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1e3;
  return Math.floor(diff / DAY);
}
export function weekOfYear(date) {
  const workingDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = workingDate.getUTCDay();
  const nearestThursday = workingDate.getUTCDate() + 4 - (day === 0 ? DAYS_PER_WEEK : day);
  workingDate.setUTCDate(nearestThursday);
  const yearStart = new Date(Date.UTC(workingDate.getUTCFullYear(), 0, 1));
  return Math.ceil((workingDate.getTime() - yearStart.getTime() + DAY) / WEEK);
}
export function toIMF(date) {
  function dtPad(v, lPad = 2) {
    return v.padStart(lPad, "0");
  }
  const d = dtPad(date.getUTCDate().toString());
  const h = dtPad(date.getUTCHours().toString());
  const min = dtPad(date.getUTCMinutes().toString());
  const s = dtPad(date.getUTCSeconds().toString());
  const y = date.getUTCFullYear();
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];
  return `${days[date.getUTCDay()]}, ${d} ${months[date.getUTCMonth()]} ${y} ${h}:${min}:${s} GMT`;
}
export function isLeap(year) {
  const yearNumber = year instanceof Date ? year.getFullYear() : year;
  return yearNumber % 4 === 0 && yearNumber % 100 !== 0 || yearNumber % 400 === 0;
}
export function difference(from, to, options) {
  const uniqueUnits = options?.units ? [...new Set(options?.units)] : [
    "milliseconds",
    "seconds",
    "minutes",
    "hours",
    "days",
    "weeks",
    "months",
    "quarters",
    "years"
  ];
  const bigger = Math.max(from.getTime(), to.getTime());
  const smaller = Math.min(from.getTime(), to.getTime());
  const differenceInMs = bigger - smaller;
  const differences = {};
  for (const uniqueUnit of uniqueUnits) {
    switch (uniqueUnit) {
      case "milliseconds":
        differences.milliseconds = differenceInMs;
        break;
      case "seconds":
        differences.seconds = Math.floor(differenceInMs / SECOND);
        break;
      case "minutes":
        differences.minutes = Math.floor(differenceInMs / MINUTE);
        break;
      case "hours":
        differences.hours = Math.floor(differenceInMs / HOUR);
        break;
      case "days":
        differences.days = Math.floor(differenceInMs / DAY);
        break;
      case "weeks":
        differences.weeks = Math.floor(differenceInMs / WEEK);
        break;
      case "months":
        differences.months = calculateMonthsDifference(bigger, smaller);
        break;
      case "quarters":
        differences.quarters = Math.floor(typeof differences.months !== "undefined" && differences.months / 4 || calculateMonthsDifference(bigger, smaller) / 4);
        break;
      case "years":
        differences.years = Math.floor(typeof differences.months !== "undefined" && differences.months / 12 || calculateMonthsDifference(bigger, smaller) / 12);
        break;
    }
  }
  return differences;
}
function calculateMonthsDifference(bigger, smaller) {
  const biggerDate = new Date(bigger);
  const smallerDate = new Date(smaller);
  const yearsDiff = biggerDate.getFullYear() - smallerDate.getFullYear();
  const monthsDiff = biggerDate.getMonth() - smallerDate.getMonth();
  const calendarDiffrences = Math.abs(yearsDiff * 12 + monthsDiff);
  const compareResult = biggerDate > smallerDate ? 1 : -1;
  biggerDate.setMonth(biggerDate.getMonth() - compareResult * calendarDiffrences);
  const isLastMonthNotFull = biggerDate > smallerDate ? 1 : -compareResult === -1 ? 1 : 0;
  const months = compareResult * (calendarDiffrences - isLastMonthNotFull);
  return months === 0 ? 0 : months;
}

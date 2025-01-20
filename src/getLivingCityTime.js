import {
  todayDate,
  todayTime,
  todayDayOfTheWeek,
  cityName,
} from "./dom-elements";
import moment from "moment-timezone";
import { format } from "date-fns";

export const createLivingCityObject = (data) => ({
  city: data,
  time: getCurrentTime(),
  date: getCurrentLocationDate(data),
  weekday: getWeekDay(data.days?.[0]?.datetime),
  cityName: getUserLivingLocation(),
});

export function getCurrentLocationDate(data, date = 0) {
  return data.days?.[date]?.datetime;
}

export function getWeekDay(data) {
  return format(new Date(data), "EEE");
}

export function getUserLivingLocation() {
  const location = moment.tz.guess(); //generates "country/city"
  return location.substring(location.indexOf("/") + 1); // Get substring after '/'
}

export function generateCurrentLocation(locationData) {
  const livingCity = createLivingCityObject(locationData);
  const formattedDate = formatDate(livingCity.date);

  todayDate.innerHTML = formattedDate; // e.g., Jan/10
  todayTime.innerHTML = livingCity.time; //current time
  todayDayOfTheWeek.innerHTML = livingCity.weekday;
  cityName.innerHTML = livingCity.cityName;
}

export function getCurrentTime() {
  return format(new Date(), "HH:mm:ss"); // Format as HH:mm:ss
}

export function formatDate(inputDate) {
  const date = new Date(inputDate);
  return format(date, "MMM/dd");
}

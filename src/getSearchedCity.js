import {
  getCurrentTime,
  getCurrentLocationDate,
  getWeekDay,
  formatDate,
} from "./getLivingCityTime";
import {
  todayDate,
  todayTime,
  todayDayOfTheWeek,
  cityName,
  searchInput,
} from "./dom-elements";

const createSearchedCityObject = (data) => ({
  city: data,
  time: getCurrentTime(),
  date: getCurrentLocationDate(data),
  weekday: getWeekDay(data.days?.[0]?.datetime),
  cityName: extractCityNameFromTimezone(data.timezone),
});

export function extractCityNameFromTimezone(timezone) {
  if (!timezone || !timezone.includes("/")) {
    return "Unknown City"; // Fallback in case of invalid timezone
  }

  const city = timezone.split("/")[1].replace(/_/g, " "); // Get the part after '/' and replace underscores
  return city;
}

export const getLocationName = () => {
  const name = searchInput?.value?.toLowerCase()?.trim();
  if (!name) {
    console.error("Location name is required.");
    return null; // Return null if location name is empty
  }
  return name;
};

export function generateSearchedLocation(locationData) {
  console.log("Location Data in generateSearchedLocation:", locationData);

  if (!locationData) {
    console.error("Invalid location data:", locationData);
    return;
  }
  const searchedCityObject = createSearchedCityObject(locationData);
  const formattedDate = formatDate(searchedCityObject.date); // Format the date

  todayDate.innerHTML = formattedDate; // e.g., Jan/10
  todayTime.innerHTML = searchedCityObject.time; // Current time
  todayDayOfTheWeek.innerHTML = searchedCityObject.weekday;
  cityName.innerHTML = searchedCityObject.cityName; // Display city name
}

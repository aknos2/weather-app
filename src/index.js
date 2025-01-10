import { searchButton, searchLocationForm,container, todayDate, todayTime } from "./dom-elements";
import "./styles.css";

searchButton.addEventListener('click', fetchWeatherAPI);

async function fetchWeatherAPI() {
    const locationName = getLocationName();
    if (!locationName) return;

    try {
        const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${locationName}/today?unitGroup=metric&key=T6AXBLSPSAQCWVWEGELLNB657`, { mode: 'cors' })
        const locationData = await response.json();
        getLocationDate(locationData);
        getLocationTime(locationData);
        console.log(locationData);
    }
    catch(error) {
        console.log('Error catching location:', error);
    }
}

const getLocationName = () => {
    const searchLocationForm = document.querySelector("#search-location-form");
    const locationName = searchLocationForm?.value?.toLowerCase()?.trim();
    if (!locationName) {
        console.error("Location name is required.");
        return null; // Return null if location name is empty
    }
    return locationName;
}

function getLocationDate(data) {
    const today = data.days?.[0]?.datetime;

    if (today) {
        todayDate.innerHTML = today;
    } else {
        console.error("Today's date not found in the response.");
        todayDate.innerHTML = "Date not available";
    }
}

function getLocationTime(data) {
    const currentTime = data.currentConditions.datetime;

    if (currentTime) {
        todayTime.innerHTML = currentTime;
    } else {
        console.error("Current time not found in the response.");
        todayTime.innerHTML = "Time not available";
    }
}
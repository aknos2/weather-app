import { searchButton, todayTime, upperContainer} from "./dom-elements";
import "./styles.css";
import  moment  from "moment-timezone";
import { format, parse } from "date-fns";
import sunnyIcon from "./Imgs/sunny-illustration.png";
import waterDropIcon from "./icons/water-drop.svg";
import windSpeedIcon from "./icons/wind.svg";
import snowIcon from "./icons/snow.svg";
import { getUserLivingLocation, generateCurrentLocation, getCurrentTime, formatDate, getCurrentLocationDate, getWeekDay } from "./getLivingCityTime.js"

let locationName = "";

searchButton.addEventListener('click', fetchWeatherAPI);

async function fetchWeatherAPI() {
    locationName = getUserLivingLocation();
    if (!locationName) return;

    try {
        const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${locationName}/today/next2days?unitGroup=metric&key=T6AXBLSPSAQCWVWEGELLNB657`, { mode: 'cors' })
        const locationData = await response.json();
        generateCurrentLocation(locationData);
        displayDaysForecast(locationData, 3)
        console.log(locationData);
    }
    catch(error) {
        console.log('Error catching location:', error);
    }
}


const getLocationName = () => {
    const searchLocationForm = document.querySelector("#search-location-form");
    const name = searchLocationForm?.value?.toLowerCase()?.trim();
    if (!name) {
        console.error("Location name is required.");
        return null; // Return null if location name is empty
    }
    return name;
}

function getRecentHour(data) {
    return data.currentConditions.datetime;
}


function startRealClock() {
    function updateClock() {
        const currentTime = getCurrentTime();
        todayTime.innerHTML = currentTime; // Update the DOM with real-time clock
    }

    setInterval(updateClock, 1000);
}

// function getWeatherIcon() {
//     const upperContainer = document.querySelector("#weather-forecast-upper-container");
//     upperContainer.innerHTML += `<div class="cards"><img class="weather-icon" src="${sunnyIcon}"></img></div>`
// }



function displayDaysForecast(locationData, daysQuantity) {
    const forecastDays = locationData.days.slice(0, daysQuantity);

    upperContainer.innerHTML = "";

    forecastDays.forEach((day, index) => {
        // Determine the label for the day (Today, Tomorrow, or a specific date)
        const dateDescription = index === 0 
            ? "Today" 
            : index === 1 
                ? "Tomorrow" 
                : formatDate(day.datetime); // Format date for other days

         // Add each day's title
        upperContainer.innerHTML += `
            <div class="cards title">${dateDescription}</div>
        `;
    });

    forecastDays.forEach((day) => {
        const weatherCondition = day.conditions || "Condition not available";
        const weatherTemperature = Math.floor(day.temp);
        const dayOfWeek = getWeekDay(day.datetime);

        upperContainer.innerHTML += `
            <div class="cards">
                <img class="weather-icon" src="${sunnyIcon}" alt="${weatherCondition}">
                <p>${weatherCondition}</p>
                <h1 id="weather-icon-temperature">${weatherTemperature}°</h1>
                <p id="day-of-week">${dayOfWeek}</p>
            </div>`;
    });

    forecastDays.forEach((day) => {
        const tempMax = Math.floor(day?.tempmax);
        const tempMin = Math.floor(day?.tempmin);
        const feelsLike = Math.floor(day?.feelslike);
        const sunrise = formatTimeToHoursAndMinutes(day?.sunrise);
        const sunset = formatTimeToHoursAndMinutes(day?.sunset);
        const precip = Math.floor(day?.precip);
        const windSpeed = Math.floor(day?.windspeed);
        const snow = Math.floor(day?.snow);
        const snowDepth = day?.snowdepth;
        const description = day?.description;

        upperContainer.innerHTML += `
            <div class="cards card-info">
                <div id="celsius">
                    <div id="temperature">
                        <p>${tempMax}<spam id="degree-symbol">°</spam></p>
                    <p>||</p>
                        <p>${tempMin}<spam id="degree-symbol">°</spam></p>
                    </div>
                    <p>Feels like: ${feelsLike}</p>
                </div>
                <hr>
                <div id="sunrise-sunset">
                    <div class="sunrise-sunset-content">
                        <p>Sunrise</p>
                        <p>${sunrise}</p>
                    </div>
                    <div class="sunrise-sunset-content">
                        <p>Sunset</p>
                        <p>${sunset}</p>
                    </div>
                </div>
                <hr>
                <div id="precip-wind">
                    <div class="precip-wind-content">
                        <img src="${waterDropIcon}" alt="water-drop">
                        <p>${precip}%</p>
                    </div>
                    <div class="precip-wind-content">
                        <img src="${windSpeedIcon}" alt="wind-speed">
                        <p>${windSpeed}km/h</p>
                    </div>
                </div>
                <hr>
                <div id="snow">
                    <div class="snow-content">
                    <p>${snow === 0 ? `<img src="${snowIcon}"> ${snow}`: `<img src="${snowIcon}"> ${snow}%`}</p>
                    </div>
                    <div class="snow-content">
                    <p>${snowDepth === 0 ? "" : `Depth: ${snowDepth}`}</p>
                    </div>
                </div>
                <hr>
                <div id="description">
                    <p>${description}</p>    
                </div>
            </div>`
    });
}

function formatTimeToHoursAndMinutes(timeString) {
    const date = parse(timeString, 'HH:mm:ss', new Date());

    return format(date, 'H:mm');
}


function getWeatherCondition(data, day) {
    return data.days?.[day - 1]?.conditions;
}

fetchWeatherAPI();
startRealClock();
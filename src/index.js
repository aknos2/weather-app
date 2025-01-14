import { bottomContainer, searchButton, todayTime, upperContainer, threeDaysBtn, oneWeekBtn} from "./dom-elements";
import "./styles.css";
import  moment  from "moment-timezone";
import { format, parse } from "date-fns";
import sunnyIllustration from "./Imgs/sunny-illustration.png";
import waterDropIcon from "./icons/water-drop.svg";
import windSpeedIcon from "./icons/wind.svg";
import gustIcon from "./icons/gust.png";
import snowIcon from "./icons/snow.svg";
import sunnyIcon from "./icons/sun-icon.png";
import rainyIcon from "./icons/rain-icon.png";
import snowyIcon from "./icons/snow-icon.png";
import sunriseIcon from "./icons/sunrise.png";
import sunsetIcon from "./icons/sunset.png";
import nightIcon from "./icons/night-icon.png";
import thunderIcon from "./icons/thunder-icon.png";
import { getUserLivingLocation, generateCurrentLocation, getCurrentTime, formatDate, getCurrentLocationDate, getWeekDay } from "./getLivingCityTime.js"

let locationName = "";


export async function fetchWeatherAPI(daysNumber) {
    locationName = getUserLivingLocation();
    if (!locationName) return;

    try {
        const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${locationName}/today/next${daysNumber - 1}days?unitGroup=metric&key=T6AXBLSPSAQCWVWEGELLNB657`, { mode: 'cors' })
        const locationData = await response.json();
        generateCurrentLocation(locationData);
        displayForecastCard(locationData, daysNumber)
        displayHourlyData(locationData, 0);
        chooseHourlyCardDate(locationData);
        displaySnowForecast(locationData);
    }
    catch(error) {
        console.log('Error catching location:', error);
    }
}

threeDaysBtn.addEventListener("click", () => {
    const upperCards = document.getElementById("weather-forecast-upper-container");
    fetchWeatherAPI(3);
    upperCards.style.gridTemplateColumns = "repeat(3, minmax(180px, 220px))";
    upperCards.style.gap = "50px";
});

oneWeekBtn.addEventListener("click", () => {
    const upperCards = document.getElementById("weather-forecast-upper-container");
    fetchWeatherAPI(7);
    upperCards.style.gridTemplateColumns = "repeat(7, minmax(180px, 220px))";
    upperCards.style.gap = "20px";
});


function getWeatherDetails(day) {
    return {
        temp: Math.floor(day.temp),
        tempMax: Math.floor(day?.tempmax || 0),
        tempMin: Math.floor(day?.tempmin || 0),
        feelsLike: Math.floor(day?.feelslike || 0),
        sunrise: day?.sunrise ? formatTimeToHoursAndMinutes(day.sunrise) : "N/A",
        sunset: day?.sunset ? formatTimeToHoursAndMinutes(day.sunset) : "N/A",
        precip: Math.floor(day?.precip || 0),
        windSpeed: Math.floor(day?.windspeed || 0),
        snow: Math.floor(day?.snow || 0),
        snowDepth: day?.snowdepth || "N/A",
        description: day?.description || "N/A",
        conditions: day?.conditions || "N/A",
        gust: Math.floor(day?.windgust || 0),
        precipProb: day?.precipprob || 0,
    };
}


searchButton.addEventListener('click', fetchWeatherAPI);



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


function makeCardDateTitle(day, index) {
    const dateDescription = index === 0 
            ? "Today" 
            : index === 1 
                ? "Tomorrow" 
                : formatDate(day.datetime); // Format date for other days

         // Add each day's title
        return `
            <div class="cards title">${dateDescription}</div>
        `;
}

function makeCardImage(day) {
    const weatherDetails = getWeatherDetails(day);
    
    const dayOfWeek = getWeekDay(day.datetime);
    return `
        <div class="cards">
            <img class="weather-icon" src="${sunnyIllustration}" alt="${weatherDetails.conditions}">
            <p>${weatherDetails.conditions}</p>
            <h1 id="weather-icon-temperature">${weatherDetails.temp}°</h1>
            <p id="day-of-week">${dayOfWeek}</p>
        </div>`;
}

function makeCardContent(day) {
    const weatherDetails = getWeatherDetails(day);

    return `
        <div class="cards" card-info">
            <div id="celsius">
                <div id="temperature">
                    <p>${weatherDetails.tempMax}<spam id="degree-symbol">°</spam></p>
                <p>||</p>
                    <p>${weatherDetails.tempMin}<spam id="degree-symbol">°</spam></p>
                </div>
                <p>Feels like: ${weatherDetails.feelsLike}</p>
            </div>
            <hr>
            <div id="sunrise-sunset">
                <div class="sunrise-sunset-content">
                   
                    <img src=${sunriseIcon} alt="sunrise"><p>${weatherDetails.sunrise}</p>
                </div>
                <div class="sunrise-sunset-content">
                    
                    <img src=${sunsetIcon} alt="sunrise"><p>${weatherDetails.sunset}</p>
                </div>
            </div>
            <hr>
            <div id="precip-wind">
                <div class="precip-wind-content">
                    <img src="${waterDropIcon}" alt="water-drop">
                    <p>${weatherDetails.precipProb}%</p>
                </div>
                ${weatherDetails.precipProb > 0 ? `<div class="precip-wind-content"><img src="${rainyIcon}" alt="rain"><p>${weatherDetails.precip}</p></div>` : ""}
            </div>
            <hr>
            <div id="precip-wind">
                <div class="precip-wind-content">
                    <img src="${windSpeedIcon}" alt="wind">
                    <p>${weatherDetails.windSpeed}km/h</p>
                </div>
                <div class="precip-wind-content">
                    <img src="${gustIcon}" alt="wind-speed">
                    <p>${weatherDetails.gust}</p>
                </div>
            </div>
            <hr>
            <div id="snow" class="hidden">
                <div class="snow-content">
                <p>${weatherDetails.snow === 0 ? `<img src="${snowIcon}"> ${weatherDetails.snow}`: `<img src="${snowIcon}"> ${weatherDetails.snow}%`}</p>
                </div>
                <div class="snow-content">
                <p>${weatherDetails.snowDepth === 0 ? "" : `Depth: ${weatherDetails.snowDepth}`}</p>
                </div>
            </div>
            <hr>
            <div id="description">
                <p>${weatherDetails.description}</p>    
            </div>
        </div>`
}

function displayForecastCard(locationData, daysQuantity) {
    const forecastDays = locationData.days.slice(0, daysQuantity);

    upperContainer.innerHTML = forecastDays
        .map((day, index) => `
            <div class="card">
                ${makeCardDateTitle(day, index)}
                ${makeCardImage(day)}
                ${makeCardContent(day)}
            </div>
        `).join("");
}

function makeHourlyCardTitle(date) {
    const hour = formatTimeToHoursAndMinutes(date.datetime);

    return `
        <div id="hourly-title">
          <p>${hour}</p>
        </div>
        <hr>`
}

function makeHourlyCardImage(date) {
    const altText = date.conditions || "Weather icon";
    const weatherDetails = getWeatherDetails(date);

    return `
        <div id="hourly-icon">
          <img src="${sunnyIcon}" alt="${altText}">
          <p>${weatherDetails.temp}</p>
        </div>
        <hr>`;
}

function makeHourlyCardContent(day) {
    const weatherDetails = getWeatherDetails(day);

    return (
        `<div id="hourly-content">
          <p>Feels like: ${weatherDetails.feelsLike}°</p>
          <p>${weatherDetails.conditions}</p><hr>
          <div>
            <img src="${waterDropIcon}" alt="precip"><p>${weatherDetails.precipProb}%</p>
            ${weatherDetails.precipProb > 0 ? `<img src="${rainyIcon}" alt="rain"><p>${weatherDetails.precip}</p>` : ""}
          </div><hr>
          <div class="hidden">
            <img src="${snowIcon}"><p>${weatherDetails.snow}%</p> 
            <img src="${snowyIcon}"><p>${weatherDetails.snowDepth}</p>
          </div><hr>
          <div>
            <img src="${windSpeedIcon}" alt="wind"><p>${weatherDetails.windSpeed}km/h</p> 
            <img src="${gustIcon}" alt="gust"><p>${weatherDetails.gust}</p>
          </div>
        </div>`
    );
}

function displayHourlyData(locationData, index) {
    const day = locationData.days[index];
    const allHourlyData = day.hours // Flatten hours from all days\
    const currentHour = new Date().getHours();
    const closestHourIndex = allHourlyData.findIndex(hour => {
        const hourTime = parseInt(hour.datetime.split(':')[0]);
        return hourTime >= currentHour;
    })

    // Generate hourly cards and set the innerHTML once
    const hourlyCardsHTML = allHourlyData.map(hour => `
        <div class="bottom-card">
            ${makeHourlyCardTitle(hour)}
            ${makeHourlyCardImage(hour)}
            ${makeHourlyCardContent(hour)}
        </div>
    `).join("");

    // Set all hourly cards at once
    bottomContainer.innerHTML = hourlyCardsHTML;

    if (closestHourIndex !== -1) {
        const cardWidth = 150;
        bottomContainer.scrollLeft = closestHourIndex * cardWidth;
    }
}

function chooseHourlyCardDate(data) {
    const cards = document.querySelectorAll(".card"); // All cards
    const elements = document.querySelectorAll(".cards"); // All targeted elements inside cards

    function highlightCard(card, index) {

        elements.forEach(el => el.style.backgroundColor = "");

        const targetElements = card.querySelectorAll(".cards");
        targetElements.forEach(el => {
            el.style.backgroundColor = "var(--card-chosen-background-color)"; // Apply the color to all targeted elements
        });

        displayHourlyData(data, index);
    }

    cards.forEach((card, index) => {
        card.addEventListener("click", () => highlightCard(card, index));
    });

    // Highlight the "Today" card by default on page load
    if (cards.length > 0) {
        highlightCard(cards[0], 0);
    }
}


function displaySnowForecast(day) {
    const weatherDetails = getWeatherDetails(day); // Ensure `day` is passed to the function
    const classElements = document.getElementsByClassName("hidden"); // No dot before class name

    // Loop through all elements with the "hidden" class
    Array.from(classElements).forEach(element => {
        if (weatherDetails.snow > 0) {
            element.style.display = "block"; // Show the element
        } else {
            element.style.display = "none"; // Hide the element
        }
    });
}

function formatTimeToHoursAndMinutes(timeString) {
    const date = parse(timeString, 'HH:mm:ss', new Date());

    return format(date, 'H:mm');
}

fetchWeatherAPI();
startRealClock();
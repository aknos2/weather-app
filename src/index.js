import { searchButton, todayTime, threeDaysBtn, oneWeekBtn, loadingSpinner, upperContainer, bottomContainer, alertMessageContainer, alertMessage, searchInput, container, timeContainer, cityName, fahrenheitBtn, celsiusBtn} from "./dom-elements";
import "./styles.css";
import { format } from "date-fns";
import { toZonedTime } from 'date-fns-tz';
import { getUserLivingLocation, generateCurrentLocation } from "./getLivingCityTime.js"
import { displayForecastCard, chooseHourlyCardDate, displayHourlyData, displaySnowForecast } from "./createCard.js";
import { getLocationName, generateSearchedLocation, extractCityNameFromTimezone } from "./getSearchedCity.js";

let locationName;
let clockInterval;
let locationData;
let currentUnit = "metric"

export async function fetchWeatherAPI(daysNumber, locationName, isSearch = false) {
    if (!locationName) return null;

    try {
        const unitGroup = currentUnit;
        showLoadingSpinner();

        const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${locationName}/today/next${daysNumber - 1}days?unitGroup=${unitGroup}&key=T6AXBLSPSAQCWVWEGELLNB657`, { mode: 'cors' });
        const locationData = await response.json();

        if (isSearch) {
            generateSearchedLocation({ ...locationData, locationName });
            upgradeBackgroundBasedOnTime(locationData);
            setActiveDayButton(threeDaysBtn);
            setActiveTemperatureButton(celsiusBtn);
            upperContainer.style.gridTemplateColumns = "repeat(3, minmax(180px, 220px))";
            upperContainer.style.gap = "50px";
        } else {
            generateCurrentLocation(locationData);
            upgradeBackgroundBasedOnTime(locationData);
        }

        const cityNameElement = document.getElementById("city-name");
        if (cityNameElement && locationData.timezone) {
            const extractedCityName = extractCityNameFromTimezone(locationData.timezone);
            cityNameElement.textContent = extractedCityName;
        }

        displayAlertMessage(locationData);
        displayForecastCard(locationData, daysNumber);
        displayHourlyData(locationData, 0);
        chooseHourlyCardDate(locationData);
        displaySnowForecast(locationData);
        startRealClock(locationData);
        
    } catch (error) {
        console.error('Error catching location:', error);
        throw error; // Propagate the error to the caller
    } finally {
        hideLoadingSpinner();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // Start with 3-day forecast
    const daysNumber = 3;
    const userLocationName = getUserLivingLocation();
    fetchWeatherAPI(daysNumber, userLocationName);
    setActiveDayButton(threeDaysBtn);
    setActiveTemperatureButton(celsiusBtn);
});


threeDaysBtn.addEventListener("click", () => {
    const daysNumber = 3;
    const cityName = getCurrentCityName();

    showLoadingSpinner();
    
    fetchWeatherAPI(daysNumber, cityName).finally(() => {
        hideLoadingSpinner();
    }); 
    setActiveDayButton(threeDaysBtn);
    setActiveTemperatureButton(celsiusBtn);
    upperContainer.style.gridTemplateColumns = "repeat(3, minmax(180px, 220px))";
    upperContainer.style.gap = "50px";
});

oneWeekBtn.addEventListener("click", () => {
    const cityName = getCurrentCityName();
    const daysNumber = 7;

    showLoadingSpinner();
    
    fetchWeatherAPI(daysNumber, cityName).finally(() => {
        hideLoadingSpinner();
    }); 
    setActiveDayButton(oneWeekBtn);
    setActiveTemperatureButton(celsiusBtn);
    upperContainer.style.gridTemplateColumns = "repeat(7, minmax(180px, 220px))";
    upperContainer.style.gap = "10px";
});

function celsiusToFahrenheit(celsius) {
    return Math.floor((parseInt(celsius) * 9/5) + 32); // Convert Celsius to Fahrenheit
}

function fahrenheitToCelsius(fahrenheit) {
    return Math.floor((parseInt(fahrenheit) - 32) * 5 / 9);
}

fahrenheitBtn.addEventListener("click", () => {
    if (fahrenheitBtn.classList.contains("active-btn")) return; // Prevent recalculation if already active

    const temperatureElements = document.querySelectorAll(".weather-temperature"); 
    temperatureElements.forEach((element) => {
        const celsiusValue = element.textContent.trim().replace("°", ""); // Remove the degree symbol and whitespace

        if (!isNaN(celsiusValue)) {
            const fahrenheitValue = celsiusToFahrenheit(celsiusValue);
            element.innerHTML = `${fahrenheitValue}°`;
        }
    });

    setActiveTemperatureButton(fahrenheitBtn);
});

celsiusBtn.addEventListener("click", () => {
    if (celsiusBtn.classList.contains("active-btn")) return; // Prevent recalculation if already active

    const temperatureElements = document.querySelectorAll(".weather-temperature"); 
    temperatureElements.forEach((element) => {
        const fahrenheitValue = element.textContent.trim().replace("°", ""); // Remove the degree symbol and whitespace

        if (!isNaN(fahrenheitValue)) {
            const celsiusValue = fahrenheitToCelsius(fahrenheitValue);
            element.innerHTML = `${celsiusValue}°`;
        }
    });

    setActiveTemperatureButton(celsiusBtn);
});



searchButton.addEventListener("click", async (e) => {
    e.preventDefault();

    const name = getLocationName(); // Get the user input from the search field
    if (!name) return; // Exit if no valid location name
    const daysNumber = 3;

    try {
        // Fetch weather data for the searched city
        const locationData = await fetchWeatherAPI(daysNumber, name, true);

        // Update the UI with searched location information
        generateSearchedLocation({ ...locationData, locationName });

        console.log("Searched City:", locationName);
    } catch (error) {
        console.error("Error fetching weather data for searched city:", error);
    }
});

searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        searchButton.click();
    }
});

function startRealClock(locationData) {
    const timezone = locationData?.timezone; // Get timezone from locationData

    if (!timezone) {
        console.error("Timezone not available in location data.");
        return;
    }

    if (clockInterval) {
        clearInterval(clockInterval);
    }

    function updateClock() {
        const now = new Date(); // Get the current UTC time

        // Convert UTC time to the location's timezone
        const zonedTime = toZonedTime(now, timezone);

        // Format the time in "HH:mm:ss" format
        const currentTime = format(zonedTime, 'HH:mm:ss');

        // Update the DOM with the real-time clock
        if (todayTime) {
            todayTime.innerHTML = currentTime;
        }
    }

    // Start the clock and update every second
    clockInterval = setInterval(updateClock, 1000);
    updateClock(); // Immediate update without waiting 1 second
}

function showLoadingSpinner() {
    loadingSpinner.style.display = "block";
    upperContainer.style.visibility = "hidden";
    bottomContainer.style.visibility = "hidden";
}

function hideLoadingSpinner() {
    loadingSpinner.style.display = "none";
    upperContainer.style.visibility = "visible";
    bottomContainer.style.visibility = "visible";
}

function setActiveDayButton(selectedButton) {
    threeDaysBtn.classList.remove("active-btn");
    oneWeekBtn.classList.remove("active-btn");

    selectedButton.classList.add("active-btn");
}

function setActiveTemperatureButton(selectedButton) {
    fahrenheitBtn.classList.remove("active-btn");
    celsiusBtn.classList.remove("active-btn");

    selectedButton.classList.add("active-btn");
}

function displayAlertMessage(data) {
    if (!data.alerts || data.alerts.length === 0) {
        alertMessageContainer.style.visibility = "hidden";
        return; // Exit early if no alerts
    }

    alertMessageContainer.style.visibility = "visible";
    alertMessage.innerHTML = data.alerts.map((alert =>
        `${alert.event} ${alert.headline} ${alert.description}`
    )).join("");
    
}

function upgradeBackgroundBasedOnTime(locationData) {
    const timezone = locationData.timezone;
    const now = new Date();

    // Convert UTC time to the location's timezone
    const zonedTime = toZonedTime(now, timezone);

    // Format the time in "HH:mm:ss" format
    const currentTime = format(zonedTime, 'HH:mm:ss');
    
    if (currentTime >= "06:00:00" && currentTime < "19:00:00") {
        addDayFontBackgroundColor();
    } else {
        addNightFontBackgroundColor();
    }
}

// This function will be called every minute to check and update the background
function updateBackgroundEveryMinute() {
    if (locationData) {
        upgradeBackgroundBasedOnTime(locationData);
    }
}

function getCurrentCityName() {
    const locationDisplay = document.getElementById("city-name");
    return locationDisplay.textContent.trim();
}

function addDayFontBackgroundColor() {
    container.classList.remove("nighttime-background");
    timeContainer.classList.remove("nighttime-font-color");
    cityName.classList.remove("nighttime-font-color");
    container.classList.add("daytime-background");
    timeContainer.classList.add("daytime-font-color");
    cityName.classList.add("daytime-font-color");
}

function addNightFontBackgroundColor() {
    container.classList.remove("daytime-background");
    timeContainer.classList.remove("daytime-font-color");
    cityName.classList.remove("daytime-font-color");
    container.classList.add("nighttime-background");
    timeContainer.classList.add("nighttime-font-color");
    cityName.classList.add("nighttime-font-color");
}

// Start the interval to call `updateBackgroundEveryMinute` every 60 seconds
setInterval(updateBackgroundEveryMinute, 60000);

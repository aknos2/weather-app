import { format, parse } from "date-fns";
import { bottomContainer, upperContainer } from "./dom-elements";
import { formatDate, getWeekDay } from "./getLivingCityTime.js";
import sunnyIllustration from "./Imgs/sunny-illustration.png";
import cloudyIllustration from "./Imgs/cloudy-illustration.jpg";
import rainyIllustration from "./Imgs/rainy-illustration.jpg";
import snowyIllustration from "./Imgs/snowy-illustration.jpg";
import clearIllustration from "./Imgs/clear-illustration.jpg";
import overcastIllustration from "./Imgs/overcast-illustration.jpg";
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
import lightRainIcon from "./icons/light-rain.png";
import cloudyIcon from "./icons/clouds.png";

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
    precipProb: Math.floor(day?.precipprob || 0),
  };
}

function makeCardDateTitle(day, index) {
  const dateDescription =
    index === 0 ? "Today" : index === 1 ? "Tomorrow" : formatDate(day.datetime); // Format date for other days

  // Add each day's title
  return `
            <div class="cards title">${dateDescription}</div>
        `;
}

function makeCardImage(day) {
  const weatherDetails = getWeatherDetails(day);
  const weatherIllustration = createWeatherIllustration(day);

  const dayOfWeek = getWeekDay(day.datetime);
  return `
        <div class="cards">
            <img class="weather-icon" src="${weatherIllustration}" alt="${weatherDetails.conditions}">
            <p>${weatherDetails.conditions}</p>
            <h1 id="weather-icon-temperature" class="weather-temperature">${weatherDetails.temp}°</h1>
            <p id="day-of-week">${dayOfWeek}</p>
        </div>`;
}

function makeCardContent(day) {
  const weatherDetails = getWeatherDetails(day);

  return `
        <div class="cards" card-info">
            <div id="celsius">
                <div id="temperature">
                    <p class="weather-temperature">${weatherDetails.tempMax}<spam id="degree-symbol">°</spam></p>
                <p>||</p>
                    <p class="weather-temperature">${weatherDetails.tempMin}<spam id="degree-symbol">°</spam></p>
                </div>
                <p>Feels like: <spam class="weather-temperature">${weatherDetails.feelsLike}</spam></p>
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
                ${weatherDetails.precipProb > 0 && weatherDetails.precip > 0 ? `<div class="precip-wind-content"><img src="${rainyIcon}" alt="rain"><p>${weatherDetails.precip}</p></div>` : ""}
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
                <p>${weatherDetails.snow === 0 ? `<img src="${snowIcon}"> ${weatherDetails.snow}` : `<img src="${snowIcon}"> ${weatherDetails.snow}%`}</p>
                </div>
                <div class="snow-content">
                <p>${weatherDetails.snowDepth === 0 ? "" : `Depth: ${weatherDetails.snowDepth}`}</p>
                </div>
                <hr>
            </div>
            <div id="description">
                <p>${weatherDetails.description}</p>    
            </div>
        </div>`;
}

export function displayForecastCard(locationData, daysQuantity) {
  const forecastDays = locationData.days.slice(0, daysQuantity);

  upperContainer.innerHTML = forecastDays
    .map(
      (day, index) => `
            <div class="card">
                ${makeCardDateTitle(day, index)}
                ${makeCardImage(day)}
                ${makeCardContent(day)}
            </div>
        `,
    )
    .join("");
}

function formatTimeToHoursAndMinutes(timeString) {
  const date = parse(timeString, "HH:mm:ss", new Date());

  return format(date, "H:mm");
}

export function displaySnowForecast(day) {
  const weatherDetails = getWeatherDetails(day); // Ensure `day` is passed to the function
  const classElements = document.getElementsByClassName("hidden"); // No dot before class name

  // Loop through all elements with the "hidden" class
  Array.from(classElements).forEach((element) => {
    if (weatherDetails.snow > 0) {
      element.style.display = "block"; // Show the element
    } else {
      element.style.display = "none"; // Hide the element
    }
  });
}

function makeHourlyCardTitle(date) {
  const hour = formatTimeToHoursAndMinutes(date.datetime);

  return `
        <div id="hourly-title">
          <p>${hour}</p>
        </div>
        <hr>`;
}

function makeHourlyCardImage(date) {
  const altText = date.conditions || "Weather icon";
  const weatherDetails = getWeatherDetails(date);
  const weatherIcon = createWeatherIcons(date);

  return `
        <div id="hourly-icon">
          <img src="${weatherIcon}" alt="${altText}">
          <p class="weather-temperature">${weatherDetails.temp}</p>
        </div>
        <hr>`;
}

function makeHourlyCardContent(day) {
  const weatherDetails = getWeatherDetails(day);

  return `<div id="hourly-content">
          <p>Feels like: <spam class="weather-temperature">${weatherDetails.feelsLike}°</spam></p>
          <p>${weatherDetails.conditions}</p><hr>
          <div class="bottom-card-content">
            <img src="${waterDropIcon}" alt="precip"><p>${weatherDetails.precipProb}%</p>
            ${weatherDetails.precipProb > 0 && weatherDetails.precip > 0 ? `<img src="${rainyIcon}" alt="rain"><p>${weatherDetails.precip}</p>` : ""}
          </div><hr>
          <div class="hidden bottom-card-content">
            <img src="${snowIcon}"><p>${weatherDetails.snow}%</p> 
            <img src="${snowyIcon}"><p>${weatherDetails.snowDepth}</p>
    
          </div>
          <div class="bottom-card-content">
            <img src="${windSpeedIcon}" alt="wind"><p>${weatherDetails.windSpeed}km/h</p> 
            <img src="${gustIcon}" alt="gust"><p>${weatherDetails.gust}</p>
          </div>
        </div>`;
}

export function displayHourlyData(locationData, index) {
  const day = locationData.days[index];
  const allHourlyData = day.hours; // Flatten hours from all days\
  const currentHour = new Date().getHours();
  const closestHourIndex = allHourlyData.findIndex((hour) => {
    const hourTime = parseInt(hour.datetime.split(":")[0]);
    return hourTime >= currentHour;
  });

  // Generate hourly cards and set the innerHTML once
  const hourlyCardsHTML = allHourlyData
    .map(
      (hour) => `
        <div class="bottom-card">
            ${makeHourlyCardTitle(hour)}
            ${makeHourlyCardImage(hour)}
            ${makeHourlyCardContent(hour)}
        </div>
    `,
    )
    .join("");

  // Set all hourly cards at once
  bottomContainer.innerHTML = hourlyCardsHTML;

  if (closestHourIndex !== -1) {
    const cardWidth = 150;
    bottomContainer.scrollLeft = closestHourIndex * cardWidth;
  }
}

export function chooseHourlyCardDate(data) {
  const cards = document.querySelectorAll(".card"); // All cards
  const elements = document.querySelectorAll(".cards"); // All targeted elements inside cards

  function highlightCard(card, index) {
    elements.forEach((el) => (el.style.backgroundColor = ""));

    const targetElements = card.querySelectorAll(".cards");
    targetElements.forEach((el) => {
      el.style.backgroundColor = "var(--card-chosen-background-color)"; // Apply the color to all targeted elements
    });

    displayHourlyData(data, index);

    displaySnowForecast(data);
  }

  cards.forEach((card, index) => {
    card.addEventListener("click", () => highlightCard(card, index));
  });

  // Highlight the "Today" card by default on page load
  if (cards.length > 0) {
    highlightCard(cards[0], 0);
  }
}

const weatherIconsMap = {
  sun: sunnyIcon,
  clear: sunnyIcon,
  night: nightIcon,
  thunder: thunderIcon,
  rain: lightRainIcon,
  cloud: cloudyIcon,
  snow: snowyIcon,
  overcast: cloudyIcon,
};

const createWeatherIcons = (weather) => {
  const defaultIcon = sunnyIcon;
  const weatherCondition = weather.conditions.toLowerCase();
  for (const [key, icon] of Object.entries(weatherIconsMap)) {
    if (weatherCondition.includes(key)) {
      return icon;
    }
  }
  return defaultIcon; // Fallback icon
};

const weatherIllustrationMap = {
  sun: sunnyIllustration,
  clear: clearIllustration,
  snow: snowyIllustration,
  rain: rainyIllustration,
  cloud: cloudyIllustration,
  overcast: overcastIllustration,
};

const createWeatherIllustration = (weather) => {
  const defaultIcon = snowyIllustration;
  const weatherCondition = weather.conditions.toLowerCase();
  for (const [key, illustration] of Object.entries(weatherIllustrationMap)) {
    if (weatherCondition.includes(key)) {
      return illustration;
    }
  }
  return defaultIcon;
};

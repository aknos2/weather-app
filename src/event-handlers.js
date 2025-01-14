import { displayThreeDays, fetchWeatherAPI } from ".";
import { threeDaysBtn } from "./dom-elements";

document.addEventListener('DOMContentLoaded', () => {
    // Your event listener code here
    const threeDaysBtn = document.getElementById("threeDaysBtn");
  
    if (threeDaysBtn) {
        threeDaysBtn.addEventListener("click", () => fetchWeatherAPI(3));
    }
  });
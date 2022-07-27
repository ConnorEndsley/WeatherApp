// get all of our HTML elements

const timeElement = document.getElementById("time");
const dateElement = document.getElementById("date");
const currentWeatherItemsElement = document.getElementById(
  "current-weather-items"
);
const timeZoneElement = document.getElementById("time-zone");
const countryElement = document.getElementById("country");
const weatherForecastElement = document.getElementById("weather-forecast");
const currentTempElement = document.getElementById("current-temp");

// arrays for days and months
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const API_KEY = "bb1516c57f4c69fd8d81f74251e9e3a1";

// set interval to call every 1 second to update date and time
setInterval(() => {
  const time = new Date();
  const month = time.getMonth();
  const date = time.getDate();
  const day = time.getDay();
  const hour = time.getHours();
  // variable to make the time in a 12hr format
  const hoursIn12HrFormat = hour >= 13 ? hour % 12 : hour;
  const minutes = time.getMinutes();
  const amPm = hour >= 12 ? "PM" : "AM";

  timeElement.innerHTML =
    hoursIn12HrFormat + ":" + minutes + " " + `<span id="am-pm">${amPm}</span>`;

  dateElement.innerHTML = days[day] + ", " + date + " " + months[month];
}, 1000);

const getWeatherData = () => {
  //gets current location
  navigator.geolocation.getCurrentPosition((success) => {
    console.log(success);

    // destructure lat and long
    let { latitude, longitude } = success.coords;
    console.log("lat", latitude);
    console.log("long", longitude);

    fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=imperial&appid=${API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        showWeatherData(data);
      });
  });
};
getWeatherData();

const showWeatherData = (data) => {
  // destructure the data from the current weather response
  let { humidity, pressure, sunrise, sunset, wind_speed } = data.current;

  timeZoneElement.innerHTML = data.timezone;
  countryElement.innerHTML = data.lat + "N " + data.lon+"E";

  currentWeatherItemsElement.innerHTML = `<div class="weather-item">
        <div>Humidity</div>
        <div>${humidity}%</div>
        </div>
    <div class="weather-item">
        <div>Pressure</div>
        <div>${pressure}</div>
    </div>
    <div class="weather-item">
        <div>Wind</div>
        <div>${wind_speed}</div>
    </div>
    <div class="weather-item">
    <div>Sunrise</div>
    <div>${window.moment(sunrise*1000).format('HH:mm a')}</div>
    </div>
    <div class="weather-item">
    <div>Sunset</div>
    <div>${window.moment(sunset*1000).format('HH:mm a')}</div>
    </div>`;

 
    let otherDayForecast = "";
       // looping through the data array
    data.daily.forEach((day, idx) => {
        if(idx === 0) {
            currentTempElement.innerHTML = `
            <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather-icon" id="w-icon">
            <div class="other">
                <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
                <div class="temp">Night - ${day.temp.night}&#176; F</div>
                <div class="temp">Day - ${day.temp.day}&#176; F</div>
            </div>`
        }else{
            otherDayForecast += `
            <div class="weather-forecast-item">
                <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather-icon" id="w-icon">
                <div class="temp">Night - ${day.temp.night}&#176; F</div>
                <div class="temp">Day - ${day.temp.day}&#176; F</div>
            </div>
            `
        }
    }) 

    weatherForecastElement.innerHTML = otherDayForecast;
};

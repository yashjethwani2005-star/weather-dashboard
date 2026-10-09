const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const message = document.getElementById("message");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");

const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");


async function getWeather() {

    const city = cityInput.value.trim();

    if (city === "") {
        message.textContent = "Please enter a city name.";
        return;
    }

    try {

        message.textContent = "Loading weather data...";
        searchBtn.disabled = true;

        // Step 1: Find city coordinates

        const geoURL =
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

        const geoResponse = await fetch(geoURL);

        if (!geoResponse.ok) {
            throw new Error("Unable to find city.");
        }

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("City not found. Please try another city.");
        }

        const location = geoData.results[0];

        const latitude = location.latitude;
        const longitude = location.longitude;


        // Step 2: Fetch current weather

        const weatherURL =
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&timezone=auto`;

        const weatherResponse = await fetch(weatherURL);

        if (!weatherResponse.ok) {
            throw new Error("Unable to fetch weather data.");
        }

        const weatherData = await weatherResponse.json();

        const current = weatherData.current;

        console.log("Current weather:", current);
        console.log("Wind speed:", current.wind_speed_10m);
        // Step 3: Display weather information

        cityName.textContent =
            `${location.name}, ${location.country}`;

        temperature.textContent =
            `${current.temperature_2m} °C`;

        humidity.textContent =
            `${current.relative_humidity_2m} %`;

        windSpeed.textContent =
            `${current.wind_speed_10m} km/h`;

        description.textContent =
            getWeatherDescription(current.weather_code);

        message.textContent = "";

    } catch (error) {

        message.textContent = error.message;

    } finally {

        searchBtn.disabled = false;

    }
}


// Convert weather code into a readable description

function getWeatherDescription(code) {

    if (code === 0) {
        return "Clear sky";
    }

    if ([1, 2, 3].includes(code)) {
        return "Partly cloudy";
    }

    if ([45, 48].includes(code)) {
        return "Foggy";
    }

    if ([51, 53, 55, 56, 57].includes(code)) {
        return "Drizzle";
    }

    if ([61, 63, 65, 66, 67].includes(code)) {
        return "Rain";
    }

    if ([71, 73, 75, 77].includes(code)) {
        return "Snow";
    }

    if ([80, 81, 82].includes(code)) {
        return "Rain showers";
    }

    if ([85, 86].includes(code)) {
        return "Snow showers";
    }

    if ([95, 96, 99].includes(code)) {
        return "Thunderstorm";
    }

    return "Weather information unavailable";
}


// Search button event

searchBtn.addEventListener("click", getWeather);


// Search when Enter is pressed

cityInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {
        getWeather();
    }

});
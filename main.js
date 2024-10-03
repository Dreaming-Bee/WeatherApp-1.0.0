const app = document.querySelector('.weather-app');
const temp = document.querySelector('.temp');
const dateOutput = document.querySelector('.date');
const timeOutput = document.querySelector('.time');
const conditionOutput = document.querySelector('.condition');
const nameOutput = document.querySelector('.name');
const icon = document.querySelector('.icon');
const cloudOutput = document.querySelector('.cloud');
const humidityOutput = document.querySelector('.humidity');
const windOutput = document.querySelector('.wind');
const form = document.getElementById('locationInput');
const search = document.querySelector('.search');
const btn = document.querySelector('.submit');
const cities = document.querySelectorAll('.city');
const uvOutput = document.querySelector(`.uv`)
const precipitationOutput = document.querySelector(`.precipitation`)

let cityInput = "Colombo";

cities.forEach((city) => {
    city.addEventListener('click', (e) => {
        cityInput = e.target.innerHTML;
        fetchWeatherData();
        app.style.opacity = "0";
    });
});

form.addEventListener('submit', (e) => {
    if (search.value.length == 0) {
        alert('Please give the city name');
    } else {
        cityInput = search.value;
        fetchWeatherData();
        search.value = "";
        app.style.opacity = "0";
    }
    e.preventDefault();
});

function dayOfTheWeek(day, month, year) {
    const weekday = [
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ];
    return weekday[new Date(`${day}/${month}/${year}`).getDay()];
}

function fetchWeatherData() {
    fetch(`https://api.weatherapi.com/v1/current.json?key=faebdece79094da7a1962201242708&q=${cityInput}`)
        .then(response => response.json())
        .then(data => {
            temp.innerHTML = data.current.temp_c + "&#176;";
            conditionOutput.innerHTML = data.current.condition.text;

            const localTime = data.location.localtime;
            const y = parseInt(localTime.substr(0, 4));
            const m = parseInt(localTime.substr(5, 2));
            const d = parseInt(localTime.substr(8, 2));
            const time = localTime.substr(11);

            dateOutput.innerHTML = `${dayOfTheWeek(d, m, y)} ${d}, ${m}, ${y}`;
            timeOutput.innerHTML = time;
            nameOutput.innerHTML = data.location.name;

            const iconCode = data.current.condition.code;
            let iconClass = 'fa-cloud'; // Default icon

            // Map weather codes to Font Awesome icons
            switch (iconCode) {
                case 1000:
                    iconClass = 'fa-sun'; // Clear weather
                    break;
                case 1003:
                case 1006:
                case 1009:
                case 1030:
                case 1069:
                case 1087:
                case 1035:
                case 1073:
                case 1076:
                case 1079:
                case 1082:
                    iconClass = 'fa-cloud'; // Cloudy weather
                    break;
                case 1007:
                case 1009:
                case 1035:
                case 1073:
                case 1087:
                case 1089:
                case 1114:
                case 1117:
                    iconClass = 'fa-cloud-showers-heavy'; // Rainy weather
                    break;
                case 1007:
                case 1009:
                case 1035:
                case 1073:
                case 1087:
                case 1089:
                case 1114:
                case 1117:
                    iconClass = 'fa-snowflake'; // Snowy weather
                    break;
                default:
                    iconClass = 'fa-question'; // Unknown weather
            }

            icon.className = `fa-solid ${iconClass}`;

            cloudOutput.innerHTML = data.current.cloud + "%";
            humidityOutput.innerHTML = data.current.humidity + "%";
            windOutput.innerHTML = data.current.wind_kph + "km/h";
            uvOutput.innerHTML = data.current.uv;
            precipitationOutput.innerHTML = data.current.precip_mm + " mm";


            let timeOfDay = "day";
            if (!data.current.is_day) {
                timeOfDay = "night";
            }

            if (iconCode == 1000) {
                // Clear weather
                app.style.backgroundImage = `url('./img/clear_day.jpg')`;
                btn.style.background = "#e5ba92";
                if (timeOfDay == "night") {
                    btn.style.background = "#181e27";
                    app.style.backgroundImage = `url('./img/clear_night.jpg')`;
                }
            } else if (
                iconCode == 1003 || iconCode == 1006 || iconCode == 1009 || iconCode == 1030 || 
                iconCode == 1069 || iconCode == 1087 || iconCode == 1035 || iconCode == 1073 || 
                iconCode == 1076 || iconCode == 1079 || iconCode == 1082
            ) {
                // Cloudy weather
                app.style.backgroundImage = `url('./img/cloudy_da.jpg')`;
                btn.style.background = "#fa6d1b";
                if (timeOfDay == "night") {
                    btn.style.background = "#181e27";
                    app.style.backgroundImage = `url('./img/cloudy_night.jpg')`;
                }
            } else if (
                iconCode == 1007 || iconCode == 1009 || iconCode == 1030 || iconCode == 1035 || 
                iconCode == 1069 || iconCode == 1087 || iconCode == 1076 || iconCode == 1079
            ) {
                // Rainy weather
                app.style.backgroundImage = `url('./img/rainy_day.webp')`;
                btn.style.background = "#5b9bd5";
                if (timeOfDay == "night") {
                    btn.style.background = "#2c3e50";
                    app.style.backgroundImage = `url('./img/rainy_night.jpg')`;
                }
            } else if (
                iconCode == 1007 || iconCode == 1009 || iconCode == 1035 || iconCode == 1073 || 
                iconCode == 1087 || iconCode == 1089 || iconCode == 1114 || iconCode == 1117
            ) {
                // Snowy weather
                app.style.backgroundImage = `url('./img/snowy_day.jpg')`;
                btn.style.background = "#dfe3e6";
                if (timeOfDay == "night") {
                    btn.style.background = "#2c3e50";
                    app.style.backgroundImage = `url('./img/snowy_night.jpg')`;
                }
            }

            app.style.opacity = "1";
        })
        .catch(() => {
            alert('City not found, please try another');
            app.style.opacity = "1";
        });
}

fetchWeatherData();
app.style.opacity = "1";

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
const uvOutput = document.querySelector('.uv');
const precipitationOutput = document.querySelector('.precipitation');
const hourlyForecast = document.getElementById('hourly-forecast');

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
        alert('Please provide a city name');
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
    return weekday[new Date(`${year}-${month}-${day}`).getDay()];
}

function fetchWeatherData() {
    fetch(`https://api.weatherapi.com/v1/forecast.json?key=faebdece79094da7a1962201242708&q=${cityInput}&days=1`)
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

            icon.src = data.current.condition.icon;

            cloudOutput.innerHTML = data.current.cloud + "%";
            humidityOutput.innerHTML = data.current.humidity + "%";
            windOutput.innerHTML = data.current.wind_kph + "km/h";
            uvOutput.innerHTML = data.current.uv;
            precipitationOutput.innerHTML = data.current.precip_mm + " mm";

            let timeOfDay = "day";
            if (!data.current.is_day) {
                timeOfDay = "night";
            }

            const iconCode = data.current.condition.code;
            if (iconCode == 1000) {
                app.style.backgroundImage = `url('./img/clear_day.jpg')`;
                btn.style.background = "#e5ba92";
                if (timeOfDay == "night") {
                    btn.style.background = "#181e27";
                    app.style.backgroundImage = `url('./img/clear_night.jpg')`;
                }
            } else if (
                iconCode == 1003 || iconCode == 1006 || iconCode == 1009 || iconCode == 1030 || 
                iconCode == 1069 || iconCode == 1087 || iconCode == 1035
            ) {
                app.style.backgroundImage = `url('./img/cloudy_day.jpg')`;
                btn.style.background = "#fa6d1b";
                if (timeOfDay == "night") {
                    btn.style.background = "#181e27";
                    app.style.backgroundImage = `url('./img/cloudy_night.jpg')`;
                }
            } else if (
                iconCode == 1007 || iconCode == 1009 || iconCode == 1035 || 
                iconCode == 1073 || iconCode == 1087
            ) {
                app.style.backgroundImage = `url('./img/rainy_day.webp')`;
                btn.style.background = "#5b9bd5";
                if (timeOfDay == "night") {
                    btn.style.background = "#2c3e50";
                    app.style.backgroundImage = `url('./img/rainy_night.jpg')`;
                }
            } else if (
                iconCode == 1063 || iconCode == 1069 || iconCode == 1073 || 
                iconCode == 1087 || iconCode == 1089 || iconCode == 1114 || iconCode == 1117
            ) {
                app.style.backgroundImage = `url('./img/snowy_day.jpg')`;
                btn.style.background = "#dfe3e6";
                if (timeOfDay == "night") {
                    btn.style.background = "#2c3e50";
                    app.style.backgroundImage = `url('./img/snowy_night.jpg')`;
                }
            }

            app.style.opacity = "1";

            hourlyForecast.innerHTML = '';

            const currentHour = new Date().getHours();
            const forecastHours = data.forecast.forecastday[0].hour;

            const startIndex = forecastHours.findIndex(hour => new Date(hour.time).getHours() === currentHour);

            forecastHours.slice(startIndex, startIndex + 10).forEach(hour => {
                hourlyForecast.innerHTML += `
                    <div class="cardi">
                        <p class="text-center mt-2">${hour.time.split(' ')[1]}</p>
                        <img src="${hour.condition.icon}" alt="${hour.condition.text}" class="card-img">
                        <p class="text-center mt-2">${hour.temp_c}°C</p>
                    </div>
                `;
            });
        })
        .catch(() => {
            alert('City not found, please try another');
            app.style.opacity = "1";
        });
}

fetchWeatherData();
app.style.opacity = "1";

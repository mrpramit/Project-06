const apiKey = "9e1ac06a6f72dc48dc80d70b4f040583";

// Helper to determine weather icon based on openweathermap condition code
function getWeatherIcon(conditionCode, isDay = true) {
    if (conditionCode >= 200 && conditionCode < 300) return "fa-cloud-bolt";
    if (conditionCode >= 300 && conditionCode < 400) return "fa-cloud-rain";
    if (conditionCode >= 500 && conditionCode < 600) return "fa-cloud-showers-heavy";
    if (conditionCode >= 600 && conditionCode < 700) return "fa-snowflake";
    if (conditionCode >= 700 && conditionCode < 800) return "fa-wind";
    if (conditionCode === 800) return isDay ? "fa-sun" : "fa-moon";
    if (conditionCode > 800) return isDay ? "fa-cloud-sun" : "fa-cloud-moon";
    return "fa-cloud";
}

async function getWeather() {
    const city = document.getElementById("city").value;
    const mainWeatherEl = document.getElementById("mainWeather");
    const detailsEl = document.getElementById("details");
    const hourlyEl = document.getElementById("hourly");

    if (!city) return;

    // Loading state
    mainWeatherEl.classList.remove("update-anim");
    void mainWeatherEl.offsetWidth; // trigger reflow to restart animation

    const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );

    const data = await res.json();

    if (data.cod !== 200) {
        mainWeatherEl.innerHTML = `
            <i class="fa-solid fa-triangle-exclamation weather-icon" style="background: -webkit-linear-gradient(45deg, #ef4444, #b91c1c); -webkit-background-clip: text;"></i>
            <h2>City not found</h2>
            <p>Please try a different search</p>
        `;
        mainWeatherEl.classList.add("update-anim");
        return;
    }

    // Is it day or night?
    const isDay = (data.dt > data.sys.sunrise && data.dt < data.sys.sunset);
    const iconClass = getWeatherIcon(data.weather[0].id, isDay);
    
    // Icon color logic based on generic weather
    let gradient = isDay ? '-webkit-linear-gradient(45deg, #fcd34d, #f59e0b)' : '-webkit-linear-gradient(45deg, #94a3b8, #cbd5e1)';
    if (data.weather[0].main === 'Rain' || data.weather[0].main === 'Drizzle' || data.weather[0].main === 'Thunderstorm') {
        gradient = '-webkit-linear-gradient(45deg, #60a5fa, #3b82f6)';
    } else if (data.weather[0].main === 'Snow') {
        gradient = '-webkit-linear-gradient(45deg, #bae6fd, #e0f2fe)';
    }

    // MAIN
    mainWeatherEl.innerHTML = `
        <i class="fa-solid ${iconClass} weather-icon" style="background: ${gradient}; -webkit-background-clip: text;"></i>
        <h2>${data.name}, ${data.sys.country}</h2>
        <h1>${Math.round(data.main.temp)}°</h1>
        <p>${data.weather[0].main}</p>
    `;
    mainWeatherEl.classList.add("update-anim");

    // DETAILS
    detailsEl.innerHTML = `
        <div class="detail-card">
            <i class="fa-solid fa-droplet"></i>
            <span>Humidity</span>
            <strong>${data.main.humidity}%</strong>
        </div>
        <div class="detail-card">
            <i class="fa-solid fa-wind"></i>
            <span>Wind</span>
            <strong>${data.wind.speed} km/h</strong>
        </div>
        <div class="detail-card">
            <i class="fa-solid fa-temperature-half"></i>
            <span>Feels Like</span>
            <strong>${Math.round(data.main.feels_like)}°C</strong>
        </div>
        <div class="detail-card">
            <i class="fa-solid fa-arrows-up-down"></i>
            <span>Pressure</span>
            <strong>${data.main.pressure} hPa</strong>
        </div>
    `;

    // HOURLY (Using base temp to generate UI for now since Free API usually lacks hourly)
    let hourlyHTML = "";
    const baseTemp = Math.round(data.main.temp);

    // Generate 5 fake hourly items
    for (let i = 0; i < 5; i++) {
        // Adjust temp slightly per hour
        const adjust = [0, 1, 2, 1, 0][i];
        
        let hrIcon = isDay ? "fa-sun" : "fa-moon";
        if (data.weather[0].main === 'Rain') hrIcon = "fa-cloud-rain";
        if (data.weather[0].main === 'Clouds') hrIcon = "fa-cloud";

        hourlyHTML += `
            <div class="hourly-item">
                <p>${baseTemp + adjust}°</p>
                <i class="fa-solid ${hrIcon}"></i>
                <p style="font-size:12px;opacity:0.7;">+${i}h</p>
            </div>
        `;
    }

    hourlyEl.innerHTML = hourlyHTML;
}

document.getElementById("city").addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        getWeather();
    }
});
async function getWeatherByCity() {
  const city = document.getElementById("cityInput").value;
  if (!city) return alert("Please enter a city name.");

  const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`;
  const geoRes = await fetch(geocodeUrl);
  const geoData = await geoRes.json();

  if (!geoData.results || geoData.results.length === 0) {
    document.getElementById("weather").innerHTML = "<p>City not found.</p>";
    return;
  }

  const { latitude, longitude, name, country } = geoData.results[0];
  fetchWeather(latitude, longitude, name, country);
}

function getWeatherByLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async position => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      fetchWeather(lat, lon, "Your Location", "");
    }, () => alert("Location access denied."));
  } else {
    alert("Geolocation not supported.");
  }
}

async function fetchWeather(lat, lon, city, country) {
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
  try {
    const res = await fetch(weatherUrl);
    const data = await res.json();

    const weather = data.current_weather;
    const html = `
      <h2>${city}, ${country}</h2>
      <p>🌡 Temperature: ${weather.temperature} °C</p>
      <p>🌬 Wind Speed: ${weather.windspeed} km/h</p>
      <p>⏱ Time: ${weather.time}</p>
    `;
    document.getElementById("weather").innerHTML = html;
  } catch (err) {
    document.getElementById("weather").innerHTML = "<p>Error retrieving weather data.</p>";
  }
}

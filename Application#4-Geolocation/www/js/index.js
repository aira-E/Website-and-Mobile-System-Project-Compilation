document.addEventListener("deviceready", function () {
    loadFavorites(); // This will now reference the function from favorites.js
    
    // Automatically detect the user's location when the app loads
    navigator.geolocation.getCurrentPosition(onSuccess, onError);

    document.getElementById("weatherBtn").addEventListener("click", function () {
        const location = document.getElementById("locInput").value;
        if (location) {
            getCoordinates(location);
        } else {
            navigator.geolocation.getCurrentPosition(onSuccess, onError);
        }
    });

    function onSuccess(position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        fetchWeather(lat, lon);
    }

    function onError(error) {
        alert("Error getting location: " + error.message);
    }

    function getCoordinates(location) {
        const apiKey = "27aa24a75510715e2e159c180a024ab5";
        const url = `https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${apiKey}`;
        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                if (data.length > 0) {
                    fetchWeather(data[0].lat, data[0].lon);
                } else {
                    alert("Location not found");
                }
            })
            .catch((error) => {
                alert("Error fetching coordinates: " + error.message);
            });
    }

    function fetchWeather(lat, lon) {
        const apiKey = "27aa24a75510715e2e159c180a024ab5";
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                displayWeather(data);
            })
            .catch((error) => {
                alert("Error fetching weather data: " + error.message);
            });
    }



    function displayWeather(data) {
        const weatherDetails = document.getElementById("weatherDetails");

        weatherDetails.innerHTML = `
            <p>Location: <span style="font-weight: bold;">${data.name}</span></p>
            <p>Temperature: <span>${data.main.temp}°C</span></p>
            <p>Weather: <span style="text-transform: capitalize;">${data.weather[0].description}</span></p>
            <button id="saveLocationBtn">Save Location</button>
        `;

        document.getElementById('saveLocationBtn').addEventListener('click', function () {
            saveLocation(data.name, data.coord.lat, data.coord.lon);
            loadFavorites(); // Reload favorites after saving the location
        });
    }

});

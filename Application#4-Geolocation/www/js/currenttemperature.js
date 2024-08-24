document.addEventListener("deviceready", function () {
    function requestPermissionsAndFetchWeather() {
        getLocationAndWeather(); // Always try to fetch the weather
        
        // Android-specific permission handling
        if (cordova.platformId === 'android') {
            const permissions = cordova.plugins.permissions;
            permissions.checkPermission(permissions.ACCESS_FINE_LOCATION, function (status) {
                if (!status.hasPermission) {
                    permissions.requestPermission(permissions.ACCESS_FINE_LOCATION, function (status) {
                        if (status.hasPermission) {
                            getLocationAndWeather(); // Retry fetching the weather if permission is granted
                        } else {
                            alert("Geolocation permission is required to fetch weather data.");
                        }
                    }, function () {
                        alert("Error requesting geolocation permission.");
                    });
                }
            }, function () {
                alert("Error checking geolocation permission.");
            });
        }
    }

    function getLocationAndWeather() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(onSuccess, onError, {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            });
        } else {
            document.getElementById('location').innerText = "Geolocation is not supported by this browser.";
        }
    }

    function onSuccess(position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        const apiKey = "27aa24a75510715e2e159c180a024ab5";
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

        fetch(weatherUrl)
            .then(response => response.json())
            .then(data => {
                const temp = data.main.temp;
                const city = data.name;
                document.getElementById('temperature').innerText = `${temp}°C`;
                document.getElementById('city').innerText = `${city}`;
            })
            .catch(error => {
                document.getElementById('temperature').innerText = "Unable to retrieve temperature data.";
                console.error("Error fetching weather data:", error);
            });
    }

    function onError(error) {
        let errorMsg;
        switch (error.code) {
            case error.PERMISSION_DENIED:
                errorMsg = "You have denied access to your location. Please enable it in your settings.";
                break;
            case error.POSITION_UNAVAILABLE:
                errorMsg = "Location information is currently unavailable. Please check your connection or try again later.";
                break;
            case error.TIMEOUT:
                errorMsg = "The request to get your location timed out. Please ensure you have a stable connection and try again.";
                break;
            case error.UNKNOWN_ERROR:
                errorMsg = "An unknown error occurred while trying to retrieve your location.";
                break;
        }
        document.getElementById('location').innerText = errorMsg;
    }

    // Initialize the permission check and weather fetch process
    requestPermissionsAndFetchWeather();
});

document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    document.getElementById('btn-json').addEventListener('click', saveFavoritesToFile);
}
function saveLocation(name, lat, lon) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    const exists = favorites.some(fav => fav.name === name && fav.lat === lat && fav.lon === lon);
    if (!exists) {
        favorites.push({ name, lat, lon });

        favorites.sort((a, b) => a.name.localeCompare(b.name));

        localStorage.setItem('favorites', JSON.stringify(favorites));
    } else {
        alert('Location already saved');
    }
}

function loadFavorites() {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    favorites.sort((a, b) => a.name.localeCompare(b.name));

    const favoritesList = document.getElementById('favoritesList');
    favoritesList.innerHTML = '';

    // Create a scrollable container for the entire list
    const scrollContainer = document.createElement('div');
    scrollContainer.style.overflowY = 'auto'; // Enable vertical scrolling
    scrollContainer.style.maxHeight = 'none'; // Allow height to grow as needed

    favorites.forEach((fav, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${fav.name} (${fav.lat}, ${fav.lon})`;

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-button');

        // Create the icon element
        const icon = document.createElement('i');
        icon.className = 'fa fa-trash-o'; // Set the Font Awesome class for the trash icon
        icon.setAttribute('aria-hidden', 'true'); // Add aria-hidden attribute for accessibility

        // Append the icon to the button
        deleteButton.appendChild(icon);

        // Set the delete functionality
        deleteButton.onclick = () => deleteFavorite(index);

        // Append the delete button to the list item
        listItem.appendChild(deleteButton);

        // Append the list item to the scrollable container
        scrollContainer.appendChild(listItem);
    });

    // Append the scrollable container to the favorites list
    favoritesList.appendChild(scrollContainer);

    // Only make the container scrollable after the third item
    if (favorites.length > 3) {
        scrollContainer.style.maxHeight = `${scrollContainer.scrollHeight}px`;
    }
}



function deleteFavorite(index) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    favorites.splice(index, 1); 

    localStorage.setItem('favorites', JSON.stringify(favorites));

    loadFavorites();
}

function saveToFile(favorites) {
    const data = JSON.stringify(favorites, null, 2);
    
    const fileName = "weatherData.json";
    const directory = cordova.file.externalDataDirectory;

    window.resolveLocalFileSystemURL(directory, 
        function (dirEntry) {
            dirEntry.getFile(fileName, { create: true, exclusive: false }, 
                function (fileEntry) {
                    fileEntry.createWriter(
                        function (fileWriter) {
                            fileWriter.onwriteend = function () {
                                alert("Data saved to " + fileEntry.nativeURL);
                            };

                            fileWriter.onerror = function (e) {
                                console.error("Failed to write file: " + e.toString());
                            };

                            const blob = new Blob([data], { type: "application/json" });
                            fileWriter.write(blob);
                        }, onError);
                }, onError);
        }, onError);
}

function onError(error) {
    console.error("Error: ", error);
    alert("Failed to save file: " + error.toString());
}

function saveFavoritesToFile() {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    saveToFile(favorites);
}







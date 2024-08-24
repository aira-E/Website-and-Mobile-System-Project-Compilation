document.addEventListener("deviceready", function() {
    // Now that Cordova is ready, you can safely call Cordova APIs
    document.getElementById("btn-save").addEventListener("click", saveBooksToJSON);
}, false);

function saveBooksToJSON() {
    // Create a new array that excludes the 'coverFile' property from each book
    const booksToSave = books.map(({ coverFile, ...rest }) => rest);

    // Convert the data to JSON format
    const booksJSON = JSON.stringify(booksToSave, null, 2);

    // Generate a unique file name using the current date and time in the desired format
    const now = new Date();
    const options = {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    };
    const formattedDate = now.toLocaleString('en-US', options).replace(/, /g, '_').replace(/\//g, '-').replace(/ /g, '_').replace(/:/g, '-');
    const fileName = `books-${formattedDate}.json`;

    // Define the directory
    const directory = cordova.file.externalDataDirectory;

    // Resolve the file system URL to get the directory entry
    window.resolveLocalFileSystemURL(directory, function(dirEntry) {
        // Get or create the file in the directory with the unique name
        dirEntry.getFile(fileName, { create: true, exclusive: false }, function(fileEntry) {
            // Create a file writer to write the JSON data to the file
            fileEntry.createWriter(function(fileWriter) {
                // Define the actions on write success and error
                fileWriter.onwriteend = function() {
                    alert("Books saved to " + fileEntry.nativeURL);
                };

                fileWriter.onerror = function(e) {
                    console.error("Failed to write file: " + e.toString());
                };

                // Create a Blob from the JSON string and write it to the file
                const blob = new Blob([booksJSON], { type: "application/json" });
                fileWriter.write(blob);
            }, onError);
        }, onError);
    }, onError);
}

function onError(error) {
    console.error("File operation error: " + error.code + " - " + error.message);
    alert("Error: " + error.message);
}

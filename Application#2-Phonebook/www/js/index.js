document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Cordova is now initialized. Have fun!
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
}

let contacts = [];

function addContact() {
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;

    if (name && phone) {
        contacts.push({ name, phone });
        updateContactList();
        document.getElementById('name').value = '';
        document.getElementById('phone').value = '';
    } else {
        alert('Please enter both name and phone number.');
    }
}

function updateContactList() {
    const contactList = document.getElementById('contactList');
    contactList.innerHTML = '';

    contacts.forEach((contact) => {
        const li = document.createElement('li');
        li.textContent = `${contact.name}: ${contact.phone}`;
        contactList.appendChild(li);
    });
}

function saveContacts() {
    const contactsJson = JSON.stringify(contacts, null, 2);
    
    // Use Cordova's File API to save the file
    window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (dirEntry) {
        dirEntry.getFile("contacts.json", { create: true, exclusive: false }, function (fileEntry) {
            fileEntry.createWriter(function (fileWriter) {
                fileWriter.onwriteend = function () {
                    console.log("Successful file write...");
                    alert("Contacts saved successfully!");
                };

                fileWriter.onerror = function (e) {
                    console.error("Failed file write: " + e.toString());
                    alert("Failed to save contacts.");
                };

                // Create a Blob with the JSON content and write it to the file
                const blob = new Blob([contactsJson], { type: 'application/json' });
                fileWriter.write(blob);
            }, onError);
        }, onError);
    }, onError);
}

function onError(error) {
    console.error("Error: " + error.code);
    alert("An error occurred: " + error.message);
}

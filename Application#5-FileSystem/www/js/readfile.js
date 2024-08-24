document.addEventListener("deviceready", function() {
    // Now that Cordova is ready, you can safely call Cordova APIs
    document.getElementById("btn-save").addEventListener("click", saveContentToJSON);
}, false);

function readFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (!file) {
        alert('Please select a file!');
        return;
    }

    const reader = new FileReader();
    
    reader.onload = function(event) {
        const content = event.target.result;
        let result;

        try {
            // Attempt to parse as JSON
            result = JSON.parse(content);
            document.getElementById('result').innerHTML = `<pre>${JSON.stringify(result, null, 2)}</pre>`;
        } catch (e) {
            // If parsing fails, treat it as plain text
            document.getElementById('result').textContent = content;
        }
    };

    reader.onerror = function() {
        alert('Error reading file!');
    };

    reader.readAsText(file);
}

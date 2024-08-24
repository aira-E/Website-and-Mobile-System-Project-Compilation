document.addEventListener("DOMContentLoaded", function() {
    // Get the current hour
    const currentHour = new Date().getHours();
    
    // Define the morning and night ranges
    const isMorning = currentHour >= 6 && currentHour < 18;

    // Function to apply styles based on time of day
    function applyStyles() {
        if (isMorning) {
            document.body.style.backgroundImage = "url(img/morning.gif)";

            document.querySelectorAll("#saveLocationBtn, #weatherBtn").forEach(button => {
                button.style.background = "linear-gradient(to top, #c89600, #f8e5c0)";
                button.style.color = "black";
            });

            document.querySelectorAll("#btn-json, .delete-button").forEach(button => {
                button.style.background = "linear-gradient(to top, #c89600, #f8e5c0)";
                button.style.webkitBackgroundClip = "text";
                button.style.webkitTextFillColor = "transparent";
                button.style.border = "none";
                button.style.fontWeight = "10rem";
            });

        } else {
            document.body.style.backgroundImage = "url(img/night.gif)";

            document.querySelectorAll("#saveLocationBtn, #weatherBtn").forEach(button => {
                button.style.background = "linear-gradient(to top, #012d3d, #04728b)";
                button.style.color = "aliceblue";
            });

            document.querySelectorAll("#btn-json, .delete-button").forEach(button => {
                button.style.background = "linear-gradient(to top, #012d3d, #04728b)";
                button.style.webkitBackgroundClip = "text";
                button.style.webkitTextFillColor = "transparent";
                button.style.border = "none";
                button.style.fontWeight = "10rem";
            });
        }
    }

    // Apply styles initially
    applyStyles();

    // MutationObserver to apply styles when new elements are added
    const observer = new MutationObserver(function(mutationsList) {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                // Apply styles to new elements
                applyStyles();
            }
        }
    });

    // Start observing the document body for added nodes
    observer.observe(document.body, { childList: true, subtree: true });
});

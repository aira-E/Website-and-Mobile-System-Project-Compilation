document.addEventListener('DOMContentLoaded', function () {
    function formatpubYear(input) {
        // Remove any non-numeric characters
        input.value = input.value.replace(/\D/g, '');
        
        // Limit the input to 4 digits
        if (input.value.length > 4) {
            input.value = input.value.slice(0, 4);
        }
    }

    // Attach the formatpubYear function to the input's oninput event
    document.getElementById('pubyear-input').oninput = function() {
        formatpubYear(this);
    };
});


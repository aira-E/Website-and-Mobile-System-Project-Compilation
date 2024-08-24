document.addEventListener('DOMContentLoaded', function () {
    function formatISBN(input) {
        // Remove all non-digit characters
        let value = input.value.replace(/\D/g, '');
        
        // Format according to ISBN-13: 978-3-16-148410-0
        if (value.length > 3) value = value.slice(0, 3) + '-' + value.slice(3);
        if (value.length > 5) value = value.slice(0, 5) + '-' + value.slice(5);
        if (value.length > 8) value = value.slice(0, 8) + '-' + value.slice(8);
        if (value.length > 15) value = value.slice(0, 15) + '-' + value.slice(15);
        
        input.value = value;
    }

    // Attach the formatISBN function to the input's oninput event
    document.getElementById('ISBN-input').oninput = function() {
        formatISBN(this);
    };
});

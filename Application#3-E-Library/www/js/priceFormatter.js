document.addEventListener('DOMContentLoaded', function () {
    function formatprice(input) {
        // Remove any non-numeric characters
        input.value = input.value.replace(/\D/g, '');
        
    }

    // Attach the formatpubYear function to the input's oninput event
    document.getElementById('price-input').oninput = function() {
        formatprice(this);
    };
});

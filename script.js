document.addEventListener('DOMContentLoaded', function () {
    var textEntries = JSON.parse(localStorage.getItem('textEntries')) || [];
    var textbox = document.getElementById('myTextbox');
    var exportLink = document.getElementById('exportLink');

    // Function to handle input event
    textbox.addEventListener('keypress', function (e) {
    // Check if the key pressed is the Enter key
    if (e.key === 'Enter') {
        textEntries.push(this.value);
        // Save the updated array to localStorage
        localStorage.setItem('textEntries', JSON.stringify(textEntries));
        // Optional: Clear the textbox or take other actions
        this.value = '';
    }
});

    // Function to convert array to CSV
    function arrayToCSV(objArray) {
        const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
        const lineArray = [];
        for (const index in array) {
            let line = array[index];
            if (typeof line === 'string') {
                lineArray.push('"' + line.replace(/"/g, '""') + '"');
            }
        }
        return lineArray.join('\r\n');
    }

    // Function to export to CSV
    exportLink.addEventListener('click', function (e) {
        e.preventDefault();
        let csvContent = arrayToCSV(textEntries);
        let encodedUri = encodeURIComponent('data:text/csv;charset=utf-8,' + csvContent);
        console.log("CSV Content:", csvContent);
        this.setAttribute('href', encodedUri);

        chrome.runtime.sendMessage({
            action: "downloadCSV",
            csvContent: csvContent
        }, function(response) {
            //console.log('download requested');
            if (chrome.runtime.lastError) {
                // Handle error or log it
                console.error("Error details:", chrome.runtime.lastError.message);
            } else {
                console.log(response.status); // Log the response from the background script
            }
        });


    });
});
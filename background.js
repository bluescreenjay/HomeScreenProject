chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.action === "downloadCSV") {
        // Perform the download logic here
        // You can access request.csvContent
        let csvContent = request.csvContent
        //sendResponse({ status: "started" });
        // ...

        let blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        let url = URL.createObjectURL(blob);

        //this.setAttribute('download', 'textEntries.csv');
        //this.click();
        chrome.downloads.download({
            url: url, // URL of the file to be downloaded
            filename: 'downloaded_file.txt',   // Suggested filename for the download
            conflictAction: 'uniquify',        // Action to take if filename conflicts
            saveAs: true                       // Whether to show a Save As dialog
          }, function(downloadId) {
            console.log('Download started with ID: ', downloadId);
            URL.revokeObjectURL(url); // Clean up the URL object
          })
  
        sendResponse({ status: "success" });

        return true; 
      }
    }
  );
SERVER_LOCAL = 'http://localhost:8080';

var socket;

// Initialize socket connection to server.
function initializeSocket() {
    socket = io.connect(SERVER_LOCAL);
}

// Initialize runtime connection to content script.
function initializeContentPort() {
    chrome.runtime.onConnect.addListener(function(chromePort) {
        // Assert that this is the 'Timestamp' channel.
        console.assert(chromePort.name == 'Timestamp');
        chromePort.onMessage.addListener(function(message) {
            if (message.data != null) {
                console.log("Received: " + message.data);
                chromePort.postMessage({ data: "Received" });
                socket.emit('timestamp', { timestamp: message.data });
            }
            else {
                console.log("Error.");
                chromePort.postMessage({ data: "Error" });
            }
        });
    });
}

initializeSocket();
initializeContentPort();

var chromePort;

// Poll the page for various data.
function pollPage(callback) {
    var prevTime = 0;
    setInterval(function() {
        prevTime = callback(prevTime);
    }, 500);
}

// Update information on the given data object.
function updatePageInfo(data, location) {
    data.id = getContentId(location);
    data.name = getContentName();
    data.timeRemaining = getContentTimeRemaining();
    data.timeTotal = getContentTimeTotal();
}

// Check if we are on a Netflix content page.
function isContentPage(location) {
    if (stringContains(location, "watch")) {
        return true;
    }
    return false;
}

// Check if the timeRemaining value in our data object has changed.
function timeHasChanged(data, prevTime) {
    if (data.timeRemaining != prevTime) {
        return true;
    }
    return false;
}


// Get the Netflix content id integer from the url.
function getContentId(location) {
    var id = location.split("watch/")[1].split("?")[0];
    return id;
}

// Get the name of the content from Netflix page.
function getContentName() {
    var name = $('#netflix-player .playback-longpause-container .content h2').text();
    return name;
}

// Get the time remaining (in seconds) from the Netflix page.
function getContentTimeRemaining() {
    var timeRemaining = $('#netflix-player .player-slider').find('label').text();
    var normalized = normalizeTimeRemaining(timeRemaining);
    return normalized;
}

// Get the total running time (in minutes) from the Netflix page.
function getContentTimeTotal() {
    var timeTotal = $('#netflix-player .playback-longpause-container .content h3 span')[2].innerText;
    var normalized = normalizeTimeTotal(timeTotal);
    return normalized;
}

// Normalize/parse time remaining to seconds.
function normalizeTimeRemaining(timestamp) {
    var time = timestamp.split(':');
    if (time.length == 3) {
        return (parseInt(time[0]) * (60 * 60)) + (parseInt(time[1]) * 60) + parseInt(time[2]);
    }
    else if (time.length == 2) {
        return (parseInt(time[0]) * 60) + parseInt(time[1]);
    }
    else {
        return parseInt(time[0]);
    }
}

// Normalize/parse time total in minutes.
function normalizeTimeTotal(timestamp) {
    var time = timestamp.split(' ');
    time[0] = time[0].replace('h', '');
    time[1] = time[1].replace('m', '');
    return (parseInt(time[0]) * 60) + parseInt(time[1]);
}

// Check if a source string contains a target string.
function stringContains(source, target) {
    if (source.indexOf(target) > -1) {
        return true;
    }
    return false;
}

// Initialize runtime connection to background script.
function initializeBackgroundPort() {
    chromePort = chrome.runtime.connect({ name: "Timestamp" });
    chromePort.onMessage.addListener(function(message) {
        if (message.data != null) {
            console.log(message.data);
        }
        else {
            console.log("Error in receiving data.");
        }
    });
    console.log("Initialized background port.");
}

// Send data to background script through runtime port.
function sendDataToBackground(data) {
    chromePort.postMessage(data)
}

$(document).ready(function() {
    initializeBackgroundPort();
    pollPage(function(prevTime) {
        var data = {
            id: null,
            name: null,
            timeRemaining: null,
            timeTotal: null
        };
        var location = document.location.href;
        if (isContentPage(location)) {
            updatePageInfo(data, location);
            if (timeHasChanged(data, prevTime)) {
                sendDataToBackground(JSON.stringify(data));
            }
        }
        return data.timeRemaining;
    });
});

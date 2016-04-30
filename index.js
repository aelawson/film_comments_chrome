var NetflixLocation;
var NetflixContent;

// Poll the page for various data.
function pollPage() {
    updatePageLocation();
    updatePageInfo();
    console.log(NetflixContent);
}

// Update current location.
function updatePageLocation() {
    var currLocation = document.location.href;
    if(currLocation != NetflixLocation) {
        NetflixLocation = currLocation;
    }
}

// Update information on the NetflixPage object.
function updatePageInfo() {
    if (isContentPage()) {
        NetflixContent.id = getContentId();
        NetflixContent.name = getContentName();
        NetflixContent.timeRemaining = getContentTimeRemaining();
        NetflixContent.timeTotal = getContentTimeTotal();
    }
}

// Check if we are on a content page.
function isContentPage() {
    if (stringContains(NetflixLocation, "watch")) {
        return true;
    }
    return false;
}

// Parse and return the current url.
function parseUrl() {
    var anchor = $('<a>', { href: NetflixLocation })[0];
    var urlParsed = {
        hostname: anchor.hostname,
        pathname: anchor.pathname,
        query: anchor.search,
        hash: anchor.hash
    };
    return urlParsed;
}

function getContentId() {
    var id = NetflixLocation.split("watch/")[1].split("?")[0];
    return id;
}

function getContentName() {
    var name = $('#netflix-player .playback-longpause-container .content h2').text();
    return name;
}

function getContentTimeRemaining() {
    var timeRemaining = $('#netflix-player .player-slider').find('label').text();
    var normalized = normalizeTimeRemaining(timeRemaining);
    return normalized;
}

function getContentTimeTotal() {
    var timeTotal = $('#netflix-player .playback-longpause-container .content h3 span')[2].innerText;
    var normalized = normalizeTimeTotal(timeTotal);
    return normalized;
}

// Returns time remaining in seconds.
function normalizeTimeRemaining(timestamp) {
    var time = timestamp.split(':');
    if (time.length == 3) {
        return (time[0] * (60 * 60)) + (time[1] * 60) + time[2];
    }
    else if (time.length == 2) {
        return (time[0] * 60) + time[1];
    }
    else {
        return time[0];
    }
}

// Returns time total in minutes.
function normalizeTimeTotal(timestamp) {
    var time = timestamp.split(' ');
    time[0] = time[0].replace('h', '');
    time[1] = time[1].replace('m', '');
    return (time[0] * 60) + time[1];
}

// Check if a source string contains a target string.
function stringContains(source, target) {
    if (source.indexOf(target) > -1) {
        return true;
    }
    return false;
}

$(document).ready(function() {
    // Object containg information about the Netflix page we are on.
    NetflixContent = {
        id: null,
        name: null,
        timeRemaining: null,
        timeTotal: null
    };
    NetflixLocation = document.location.href;
    setInterval(function() {
        pollPage();
    }, 1000);
});

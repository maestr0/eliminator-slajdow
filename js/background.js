/* Google Analytics */
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-44535901-1']);
_gaq.push(['_trackPageview']);

var ga = document.createElement('script');
ga.type = 'text/javascript';
ga.async = true;
ga.src = 'https://ssl.google-analytics.com/ga.js';
var s = document.getElementsByTagName('script')[0];
s.parentNode.insertBefore(ga, s);


// new properties
if (typeof localStorage.enableTracking === 'undefined') {
    localStorage.enableTracking = "true";
}

// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(checkForValidUrl);
// Listen for the content script to send a message to the background page.
chrome.extension.onRequest.addListener(onRequest);

// Called when the url of a tab changes.
function checkForValidUrl(tabId, changeInfo, tab) {
    if (canRunOnCurrentUrl(tab.url) === true) {
        chrome.pageAction.setIcon({
            path: '../images/icon_48.png',
            tabId: tabId
        });

        chrome.pageAction.show(tabId);

    } else if (canRunOnCurrentUrl(tab.url) === -1) {
        chrome.pageAction.setIcon({
            path: '../images/icon_48_off.png',
            tabId: tabId
        });
        chrome.pageAction.show(tabId);
    } else {
        chrome.pageAction.hide(tabId);
    }
}

function onRequest(request, sender, sendResponse) {
    if (location.hostname == sender.id && request.urlName !== undefined) {
        sendResponse({
            "canRunOnCurrentUrl": canRunOnCurrentUrl(request.urlName),
            "scrollableImageContainer": localStorage.scrollableImageContainer
        });
    } else if (location.hostname == sender.id && request.tracking !== undefined) {
        trackingBeacon(request.tracking, request.action);
        sendResponse({
            "status": "ok"
        });
    }
}
// Return nothing to let the connection be cleaned up.

function canRunOnCurrentUrl(hostname) {
    var canRunHere = false;
    var allowedDomains = JSON.parse(localStorage.allowedDomains);
    $.each(allowedDomains, function (allowedHost, enabled) {
        if (hostname.indexOf(allowedHost) != -1) {
            if (enabled) {
                console.log('Eliminator Slajdow aktywny na: ' + allowedHost);
                canRunHere = true;
            } else {
                console.log('Eliminator Slajdow wylaczony na: ' + allowedHost);
                canRunHere = -1; // flag indicating that the extension is disabled on the current url
            }
            return false;
        }
    });
    return canRunHere;
}

chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason === "install") {
        updateAllowedDomainList();
        trackingBeacon('ES_install', getVersion());
    } else if (details.reason === "update") {
        updateAllowedDomainList();
        trackingBeacon('ES_update', details.previousVersion + " -> " + getVersion());
    } else if (details.reason === "chrome_update") {
        updateAllowedDomainList();
    }
});

function getVersion() {
    var details = chrome.app.getDetails();
    return details.version;
}

localStorage.version = getVersion();

function updateAllowedDomainList() {
    var defaultSupportedDomains = new Array("autotrader.pl", "avanti24.pl", "groszki.pl", "ugotuj.to",
        "gazeta.pl", "tokfm.pl", "gazetapraca.pl", "moto.pl", "plotek.pl", "deser.pl",
        "sport.pl", "wyborcza.pl", "gazetadom.pl", "logo24.pl", "wyborcza.biz", "lula.pl",
        "tuba.pl", "edziecko.pl", "czterykaty.pl", "alert24.pl", "kotek.pl", "polygamia.pl",
        "popcorner.pl", "wysokieobcasy.pl", "e-ogrody.pl", "ladnydom.pl", "bryla.gazetadom.pl",
        "gazetapraca.pl", "metropraca.pl", "pracawbiurze.pl", "zczuba.pl", "ciacha.net", "wyborcza.pl",
        "namonciaku.pl", "sport.pl", "magazyn-kuchnia.pl", "swiatmotocykli.pl", "domosfera.pl",
        "bryla.pl", "domiwnetrze.pl","foch.pl");

    localStorage.standardAllowedDomains = JSON.stringify(defaultSupportedDomains);

    var allowedDomains = {};
    if (typeof localStorage.allowedDomains !== "undefined") {
        allowedDomains = JSON.parse(localStorage.allowedDomains);
    }

    $.each(defaultSupportedDomains, function (index, domain) {
        if (typeof allowedDomains[domain] === "undefined") {
            allowedDomains[domain] = true;
        }
    });
    localStorage.allowedDomains = JSON.stringify(allowedDomains);
}

function trackingBeacon(category, action) {
    var enableTracking = (typeof localStorage.enableTracking !== 'undefined') && localStorage.enableTracking === "true";
    if (enableTracking) {
        _gaq.push(['_trackEvent', category, action]);
    }
}
// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(checkForValidUrl);

// Called when the url of a tab changes.

function checkForValidUrl(tabId, changeInfo, tab) {
    if (canRunOnCurrentUrl(tab.url) === true) {
        var icon = 'icon_48.jpg';
        chrome.pageAction.setIcon({
            path: icon,
            tabId: tabId
        });

        chrome.pageAction.show(tabId);

    } else if (canRunOnCurrentUrl(tab.url) === -1) {
        var icon = 'icon_48_off.jpg';
        chrome.pageAction.setIcon({
            path: icon,
            tabId: tabId
        });

        chrome.pageAction.show(tabId);
    } else {
        chrome.pageAction.hide(tabId);
    }
}

// Listen for the content script to send a message to the background page.
chrome.extension.onRequest.addListener(onRequest);

function onRequest(request, sender, sendResponse) {
    if (location.hostname == sender.id && request.urlName !== undefined) {
        sendResponse({
            "canRunOnCurrentUrl": canRunOnCurrentUrl(request.urlName),
            "scrollableImageContainer": localStorage['scrollableImageContainer']
        });


    }
}
// Return nothing to let the connection be cleaned up.

function canRunOnCurrentUrl(hostname) {
    var canRunHere = false;
    var allowedDomains = JSON.parse(localStorage['allowedDomains']);
    $.each(allowedDomains, function (allowedHost, enabled) {
        if (hostname.indexOf(allowedHost) != -1) {
            if (enabled) {
                console.log('Eliminator Slajdow aktywny na: ' + allowedHost);
                canRunHere = true;
            } else {
                console.log('Eliminator Slajdow wyłączony na: ' + allowedHost);
                canRunHere = -1; // flag indicating that the extension is disabled on the current url
            }
            return false; // brak the loop
        }
    });
    return canRunHere;
}

function onInstall() {
    console.log("Zainstalowano rozszerzenie 'Wszystkie zdjecia na raz. GALERIA gazeta.pl'");
    updateAllowedDomainList();
}

function onUpdate(prevVersion) {
    console.log("Aktualizacja rozszerzenia 'Wszystkie zdjecia na raz. GALERIA gazeta.pl'");
    updateAllowedDomainList();
    localStorage['scrollableImageContainer'] = "off";
    console.log("Scroll wylaczony");
}

function getVersion() {
    var details = chrome.app.getDetails();
    return details.version;
}

// Check if the version has changed.
var currVersion = getVersion();
var prevVersion = localStorage['version'];
if (currVersion != prevVersion) {
    // Check if we just installed this extension.
    if (typeof prevVersion == 'undefined') {
        onInstall();
    } else {
        onUpdate(prevVersion);
    }
    localStorage['version'] = currVersion;
}

function updateAllowedDomainList() {
    var standardAllowedDomains = new Array("autotrader.pl","avanti24.pl", "groszki.pl", "ugotuj.to", "gazeta.pl", "tokfm.pl", "gazetapraca.pl", "moto.pl", "plotek.pl", "deser.pl", "sport.pl", "wyborcza.pl", "gazetadom.pl", "logo24.pl", "wyborcza.biz", "lula.pl", "tuba.pl", "edziecko.pl", "czterykaty.pl", "alert24.pl", "kotek.pl", "polygamia.pl", "popcorner.pl", "wysokieobcasy.pl", "e-ogrody.pl", "ladnydom.pl", "bryla.gazetadom.pl", "gazetapraca.pl", "metropraca.pl", "pracawbiurze.pl", "zczuba.pl", "ciacha.net", "wyborcza.pl", "namonciaku.pl", "sport.pl", "magazyn-kuchnia.pl", "swiatmotocykli.pl", "domosfera.pl", "bryla.pl", "domiwnetrze.pl");
    localStorage['standardAllowedDomains'] = JSON.stringify(standardAllowedDomains);

    var allowedDomains = {};
    if (typeof localStorage['allowedDomains'] !== "undefined") {
        allowedDomains = JSON.parse(localStorage['allowedDomains']);
    }

    $.each(standardAllowedDomains, function (index, host) {
        if (typeof allowedDomains[host] === "undefined") {
            allowedDomains[host] = true;
        }
    });
    localStorage['allowedDomains'] = JSON.stringify(allowedDomains);
}
//end

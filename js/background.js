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
            path: '../images/es_logo.svg',
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
            "version": getVersion()
        });
    } else if (location.hostname == sender.id && request.tracking !== undefined) {
        trackingBeacon(request.tracking, request.action, request.location);
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
    var supportedDomains = new Array("autotrader.pl", "avanti24.pl", "groszki.pl", "ugotuj.to",
        "gazeta.pl", "tokfm.pl", "gazetapraca.pl", "moto.pl", "plotek.pl", "deser.pl", "demotywatory.pl",
        "sport.pl", "wyborcza.pl", "gazetadom.pl", "logo24.pl", "wyborcza.biz", "lula.pl", "naszemiasto.pl",
        "tuba.pl", "edziecko.pl", "czterykaty.pl", "alert24.pl", "kotek.pl", "polygamia.pl",
        "popcorner.pl", "wysokieobcasy.pl", "e-ogrody.pl", "ladnydom.pl", "bryla.gazetadom.pl",
        "metropraca.pl", "pracawbiurze.pl", "zczuba.pl", "ciacha.net","biznes.pl",
        "namonciaku.pl", "magazyn-kuchnia.pl", "swiatmotocykli.pl", "domosfera.pl",
        "bryla.pl", "domiwnetrze.pl", "onet.pl", "gazetalubuska.pl", "dziennikwschodni.pl", "echodnia.eu",
        "pomorska.pl", "wspolczesna.pl", "gk24.pl", "gp24.pl", "gs24.pl", "poranny.pl", "nowiny24.pl", "nto.pl",
        "to.com.pl", "mmbydgoszcz.pl", "mmwroclaw.pl", "mmkrakow.pl", "mmlodz.pl", "mmlublin.pl", "mmpoznan.pl",
        "mmsilesia.pl", "mmszczecin.pl", "mmtrojmiasto.pl", "mmwarszawa.pl", "mmmojemiasto.pl", "mmopole.pl",
        "mmzielonagora.pl", "foch.pl", "edulandia.pl", "wp.pl", "kwejk.pl", "gazetawroclawska.pl", "polskatimes.pl",
        "dziennikbaltycki.pl", "dzienniklodzki.pl", "dziennikpolski24.pl", "dziennikzachodni.pl", "expressilustrowany.pl",
        "gazetakrakowska.pl", "gloswielkopolski.pl", "kurierlubelski.pl",
        "fakt.pl", "wawalove.pl", "www.se.pl", "sfora.pl", "biztok.pl",
        "komputerswiat.pl", "dziennik.pl", "jegostrona.pl", "forsal.pl", "wprzerwie.pl", "przegladsportowy.pl",
        "auto-swiat.pl", "sportowefakty.pl", "motokiller.pl",
        "bebzol.com", "lovekrakow.pl", "pudelekx.pl", "urzadzamy.pl", "snobka.pl", "pudelek.pl",
        "fly4free.pl", "gadzetomania.pl", "trojmiasto.pl", "regiomoto.pl", "sportfan.pl",
        "forbes.pl", "geekweek.pl", "eliminator-slajdow.herokuapp.com", "nocoty.pl", "domiporta.pl",
        "newsweek.pl");

    /* TODO:  , "interia.pl", "tuwroclaw.com", "topgear.com.pl",
     pomponik.pl - odpada z powodu lazy loaded zdjec

     błędy
     http://junior.przegladsportowy.pl/akademia-pilkarska-zaglebia-lubin-tak-trenuja-mlode-talenty,galeria,2,472568,12565.html

     */
    
    var allowedDomains = {};
    if (typeof localStorage.allowedDomains !== "undefined") {
        allowedDomains = JSON.parse(localStorage.allowedDomains);
    }

    $.each(supportedDomains, function (index, domain) {
        if (typeof allowedDomains[domain] === "undefined") {
            allowedDomains[domain] = true;
        }
    });

    // usun nieobslugiwane domeny z listy
    $.each(allowedDomains, function (domain, index) {
        if ($.inArray(domain, supportedDomains) < 0) {
            delete allowedDomains[domain];
        }
    });
        
    localStorage.allowedDomains = JSON.stringify(allowedDomains);
}

function trackingBeacon(category, action, location) {
    var enableTracking = (typeof localStorage.enableTracking !== 'undefined') && localStorage.enableTracking === "true";
    if (enableTracking) {
        _gaq.push(['_trackEvent', category, action, location]);
    }
}
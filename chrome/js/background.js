// Listen for the content script to send a message to the background page.
chrome.runtime.onMessage.addListener(onMessageListener);
chrome.tabs.onActivated.addListener(handleActivated);
chrome.tabs.onUpdated.addListener(handleUpdated);

function handleUpdated(tabId, changeInfo, tabInfo) {
    console.log("handleUpdated()");
    console.log("handleUpdated url" + tabInfo.url);
    if (tabInfo.url) {
        canRunOnCurrentUrl(tabInfo.url, (canRunHere) => {
            if (canRunHere) {
                console.log("start ES from tab url change");
                injectEsScripts(tabId);
            }
            updateBrowserActionIcon(canRunHere);
        });
    }
}

function updateBrowserActionIcon(canRunHere) {
    if (canRunHere) {
        chrome.browserAction.setIcon({path: "images/enableIcon.png"});
    } else {
        chrome.browserAction.setIcon({path: "images/disableIcon.png"});
    }
}
function handleActivated(activeInfo) {
    console.log("handleActivated()");
    getActiveTab((tab) => {
        if (tab && tab.length === 1 && tab[0].url) {
            canRunOnCurrentUrl(tab[0].url, (canRunHere) => {
                if (canRunHere) {
                    console.log("start ES from tab url change");
                    injectEsScripts(tab.id);
                }

                updateBrowserActionIcon(canRunHere);
            });
        }
    });
}

// listeners
function injectEsScripts(tabId) {
    chrome.tabs.executeScript(tabId, {
        file: "./js/jquery-3.1.1.js"
    }, (res) => {
        console.log(`ES jQuery injected`);
        chrome.tabs.executeScript(tabId, {
            file: "./js/eliminator-slajdow.js"
        }, () => {
            console.log("ES injected");
            chrome.tabs.insertCSS(tabId, {file: "css/es.css"});
            chrome.tabs.executeScript(tabId, {
                code: "ES.init({version : '" + chrome.runtime.getManifest().version +
                "', imageBaseUrl: '" + chrome.extension.getURL('images/') + "'});"
            }, () => {
                console.log("ES.init()");
            });
        });
    });
}
function onMessageListener(request, sender, sendResponse) {
    chrome.storage.sync.get(['status', 'version'], (res) => {
        if (location.hostname == sender.id && request.urlName !== undefined) {
            canRunOnCurrentUrl(request.urlName, (canRunHere) => {
                var activate = canRunHere && parseInt(res.status) > 0;

                // active and not from popup
                if (activate && sender.tab) {
                    console.log(sender.tab);
                    injectEsScripts(sender.tab.id);
                }

                var id = sender.tab ? sender.tab.id : sender.contextId;
                chrome.tabs.sendMessage(id,
                    {
                        "canRunOnCurrentUrl": activate,
                        "version": res.version
                    });
            });
        } else if (request.status) {
            chrome.storage.sync.set({status: parseInt(request.status)}, () => {
                updateStatusIcon();
            });
        }
    });
}

// helpers

function canRunOnCurrentUrl(url, callback) {
    return chrome.storage.sync.get(['allowedDomains'], (res) => {
        var canRunHere = false;
        var allowedDomains = JSON.parse(res.allowedDomains);
        $.each(allowedDomains, function (allowedHost, enabled) {
            if (url.indexOf(allowedHost) != -1) {
                if (enabled) {
                    console.log('Eliminator Slajdow aktywny na: ' + allowedHost);
                    canRunHere = true;
                } else {
                    console.log('Eliminator Slajdow wylaczony na: ' + allowedHost);
                    canRunHere = false; // flag indicating that the extension is disabled on the current url
                }
                return false;
            }
        });
        callback(canRunHere && url.toLowerCase().indexOf("es=off") === -1);
    });
}

function getActiveTab(callback) {
    return chrome.tabs.query({active: true, currentWindow: true}, callback);
}

function updateStatusIcon() {
    return chrome.storage.sync
        .get('status', (res) => {
            var enableIcon = "images/enableIcon.png";
            var disableIcon = "images/disableIcon.png";
            var currentStatus = parseInt(res.status);
            var icon = currentStatus > 0 ? enableIcon : disableIcon;
            chrome.browserAction.setIcon({path: icon});
            if (currentStatus < 0) {
                chrome.browserAction.setBadgeText({text: "OFF"});
                chrome.browserAction.setBadgeBackgroundColor({color: "red"});
            } else {
                chrome.browserAction.setBadgeText({text: ""});
            }
            return {currentStatus: currentStatus, icon: icon};
        });
}

// onInstall hack
var manifest = chrome.runtime.getManifest();

chrome.storage.sync.get('version', (res) => {
    if (res.version !== manifest.version) {
        versionUpdate(manifest.version).then(() => {
            // init
            updateStatusIcon();
        });
    } else {
        // init
        updateStatusIcon();
    }
});

function versionUpdate(newVersion) {
    setSupportedDomains();
    return chrome.storage.sync.set({
        'status': "1",
        'version': manifest.version
    }, () => {
        console.log("Updating Supported Domain config for ES v" + newVersion);
    });
}

function setSupportedDomains() {
    var supportedDomains = ["autotrader.pl",
        "avanti24.pl",
        "groszki.pl",
        "ugotuj.to",
        "gazeta.pl",
        "tokfm.pl",
        "gazetapraca.pl",
        "moto.pl",
        "plotek.pl",
        "deser.pl",
        "demotywatory.pl",
        "sport.pl",
        "wyborcza.pl",
        "gazetadom.pl",
        "logo24.pl",
        "wyborcza.biz",
        "lula.pl",
        "naszemiasto.pl",
        "tuba.pl",
        "edziecko.pl",
        "czterykaty.pl",
        "alert24.pl",
        "kotek.pl",
        "polygamia.pl",
        "popcorner.pl",
        "wysokieobcasy.pl",
        "e-ogrody.pl",
        "ladnydom.pl",
        "bryla.gazetadom.pl",
        "metropraca.pl",
        "pracawbiurze.pl",
        "zczuba.pl",
        "ciacha.net",
        "biznes.pl",
        "namonciaku.pl",
        "magazyn-kuchnia.pl",
        "swiatmotocykli.pl",
        "domosfera.pl",
        "bryla.pl",
        "domiwnetrze.pl",
        "onet.pl",
        "gazetalubuska.pl",
        "dziennikwschodni.pl",
        "echodnia.eu",
        "pomorska.pl",
        "wspolczesna.pl",
        "gk24.pl",
        "gp24.pl",
        "gs24.pl",
        "poranny.pl",
        "nowiny24.pl",
        "nto.pl",
        "to.com.pl",
        "mmbydgoszcz.pl",
        "mmwroclaw.pl",
        "mmkrakow.pl",
        "mmlodz.pl",
        "mmlublin.pl",
        "mmpoznan.pl",
        "mmsilesia.pl",
        "mmszczecin.pl",
        "mmtrojmiasto.pl",
        "mmwarszawa.pl",
        "mmmojemiasto.pl",
        "mmopole.pl",
        "mmzielonagora.pl",
        "myfitness.pl",
        "foch.pl",
        "edulandia.pl",
        "wp.pl",
        "kwejk.pl",
        "gazetawroclawska.pl",
        "polskatimes.pl",
        "dziennikbaltycki.pl",
        "dzienniklodzki.pl",
        "dziennikpolski24.pl",
        "dziennikzachodni.pl",
        "expressilustrowany.pl",
        "gazetakrakowska.pl",
        "gloswielkopolski.pl",
        "kurierlubelski.pl",
        "fakt.pl",
        "wawalove.pl",
        "www.se.pl",
        "sfora.pl",
        "biztok.pl",
        "komputerswiat.pl",
        "dziennik.pl",
        "jegostrona.pl",
        "forsal.pl",
        "wprzerwie.pl",
        "przegladsportowy.pl",
        "auto-swiat.pl",
        "sportowefakty.pl",
        "bebzol.com",
        "lovekrakow.pl",
        "pudelekx.pl",
        "urzadzamy.pl",
        "snobka.pl",
        "pudelek.pl",
        "fly4free.pl",
        "gadzetomania.pl",
        "trojmiasto.pl",
        "regiomoto.pl",
        "sportfan.pl",
        "forbes.pl",
        "geekweek.pl",
        "eliminator-slajdow.raszewski.info",
        "nocoty.pl",
        "domiporta.pl",
        "newsweek.pl",
        "topgarage.com.pl",
        "plejada.pl",
        "www.24opole.pl",
        "bezuzyteczna.pl"
    ];


    chrome.storage.sync.get('allowedDomains', (res) => {
        var allowedDomains = {};
        if (typeof res.allowedDomains !== "undefined") {
            allowedDomains = JSON.parse(res.allowedDomains);
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
        chrome.storage.sync.set({allowedDomains: JSON.stringify(allowedDomains)})
    });
}

function appendParamToUrl(url, param) {
    if (url.indexOf("?") > -1) {
        return url.replace("?", "?" + param + "&");
    } else if (url.indexOf("#") > -1) {
        return url.replace("#", "?" + param + "#");
    } else {
        return url + "?" + param;
    }
}

// match pattern for the URLs to redirect
var pattern1 = "http://video.gazeta.pl/player/**";
// match pattern for the URLs to redirect
function redirect(requestDetails) {

    var redirectUrl = requestDetails.url.replace("autoplay=1", "autoplay=0").replace("autoplay=true", "autoplay=false");
    if (redirectUrl.indexOf("autoplay") === -1) {
        redirectUrl = appendParamToUrl(redirectUrl, "autoplay=false");
    }

    return {
        redirectUrl: redirectUrl
    }
}

// add the listener,
// passing the filter argument and "blocking"
chrome.webRequest.onBeforeRequest.addListener(
    redirect,
    {urls: [pattern1]},
    ["blocking"]
);

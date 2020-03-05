// Listen for the content script to send a message to the background page.
browser.runtime.onMessage.addListener(onMessageListener);
browser.tabs.onActivated.addListener(handleActivated);
browser.tabs.onUpdated.addListener(handleUpdated);

function handleUpdated(tabId, changeInfo, tabInfo) {
    console.log("UPDATE");
    if (changeInfo.url) {
        canRunOnCurrentUrl(changeInfo.url).then((canRunHere) => {
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
        browser.browserAction.setIcon({path: "images/es_logo.svg"});
    } else {
        browser.browserAction.setIcon({path: "images/disableIcon.png"});
    }
}
function handleActivated(activeInfo) {
    console.log("ACTIVATED");

    getActiveTab().then((tab) => {
        if (tab && tab.length === 1 && tab[0].url) {
            canRunOnCurrentUrl(tab[0].url).then((canRunHere) => {
                if (canRunHere) {
                    console.log("start ES from tab url change");
                    injectEsScripts(tab[0].id);
                }

                updateBrowserActionIcon(canRunHere);
            });
        }
    });
}

// listeners
function injectEsScripts(tabId) {
    browser.tabs.executeScript(tabId, {
        file: "./js/jquery-3.1.1.js"
    }).then(() => {
        return browser.tabs.executeScript(tabId, {
            file: "./js/purify-0.8.4.js"
        })
    }).then(() => {
        return browser.tabs.executeScript(tabId, {
            file: "./js/eliminator-slajdow.js"
        })
    }).then(() => {
        return browser.tabs.insertCSS(tabId, {file: "css/es.css"});
    }).then(() => {
        return browser.tabs.executeScript(tabId, {
            code: "ES.init({version : '" + browser.runtime.getManifest().version +
            "', imageBaseUrl: '" + browser.extension.getURL('images/') + "'});"
        });
    });
}

function onMessageListener(request, sender, sendResponse) {
    console.log("MESSAGE");
    browser.storage.local.get(['status', 'version'])
        .then((res) => {
            if (location.hostname == sender.id && request.urlName !== undefined) {
                canRunOnCurrentUrl(request.urlName)
                    .then((canRunHere) => {
                        let activate = canRunHere && parseInt(res.status) > 0;

                        // active and not from popup
                        if (activate && sender.tab) {
                            injectEsScripts(sender.tab.id);
                        }

                        let id = sender.tab ? sender.tab.id : sender.contextId;
                        browser.tabs.sendMessage(id,
                            {
                                "canRunOnCurrentUrl": activate,
                                "version": res.version
                            });
                    });
            }
            if (request.status) {
                browser.storage.local.set({status: parseInt(request.status)}).then(() => {
                    updateStatusIcon();
                });
            }
        });
}

// helpers

function canRunOnCurrentUrl(url) {
    return browser.storage.local.get(['allowedDomains']).then((res) => {
        let canRunHere = false;
        let allowedDomains = JSON.parse(res.allowedDomains);
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
        return canRunHere && url.toLowerCase().indexOf("es=off") === -1;
    });
}

function getActiveTab() {
    return browser.tabs.query({active: true, currentWindow: true});
}

function updateStatusIcon() {
    return browser.storage.local
        .get('status')
        .then((res) => {
            let enableIcon = "images/enableIcon.png";
            let disableIcon = "images/disableIcon.png";
            let currentStatus = parseInt(res.status);
            let icon = currentStatus > 0 ? enableIcon : disableIcon;
            browser.browserAction.setIcon({path: icon});
            if (currentStatus < 0) {
                browser.browserAction.setBadgeText({text: "OFF"});
            } else {
                browser.browserAction.setBadgeText({text: ""});
            }
            return {currentStatus: currentStatus, icon: icon};
        });
}

// onInstall hack
let manifest = browser.runtime.getManifest();

browser.storage.local.get('version').then((res) => {
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
    return browser.storage.local.set({
        'status': "1",
        'version': manifest.version
    }).then(() => {
        console.log("Updating Supported Domain config for ES v" + newVersion);
    });
}

function setSupportedDomains() {
    let supportedDomains = [
        "autotrader.pl",
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
        "national-geographic.pl",
        "bezuzyteczna.pl"
    ];

    browser.storage.local.get('allowedDomains').then((res) => {
        let allowedDomains = {};
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
        browser.storage.local.set({allowedDomains: JSON.stringify(allowedDomains)})
    });
}

function appendParamToUrl(url, param) {
    if (url.indexOf("?") > -1) {
        return url.replace("?", "?" + param + "&");
    }

    if (url.indexOf("#") > -1) {
        return url.replace("#", "?" + param + "#");
    }

    return url + "?" + param;
}

// match pattern for the URLs to redirect
let pattern1 = "http://video.gazeta.pl/player/**";
// match pattern for the URLs to redirect
function redirect(requestDetails) {

    let redirectUrl = requestDetails.url.replace("autoplay=1", "autoplay=0").replace("autoplay=true", "autoplay=false");
    if (redirectUrl.indexOf("autoplay") === -1) {
        redirectUrl = appendParamToUrl(redirectUrl, "autoplay=false");
    }

    return {
        redirectUrl: redirectUrl
    }
}

// add the listener,
// passing the filter argument and "blocking"
browser.webRequest.onBeforeRequest.addListener(
    redirect,
    {urls: [pattern1]},
    ["blocking"]
);

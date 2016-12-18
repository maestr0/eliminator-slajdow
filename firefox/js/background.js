// Listen for the content script to send a message to the background page.
browser.runtime.onMessage.addListener(onMessageListener);

function onMessageListener(request, sender, sendResponse) {
    if (location.hostname == sender.id && request.urlName !== undefined) {
        var activate = canRunOnCurrentUrl(request.urlName);
        sendResponse({
            "canRunOnCurrentUrl": activate,
            "version": localStorage.version
        });
    }
}

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

var manifest = browser.runtime.getManifest();

if (localStorage.version !== manifest.version) {
    versionUpdate(manifest.version);
}

function versionUpdate(newVersion) {
    setSupportedDomains();
    console.log("Updating Supported Domain config for ES v" + newVersion);
    localStorage.version = manifest.version;
}

function setSupportedDomains() {
    localStorage.version = browser.runtime.getManifest().version;

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
        "eliminator-slajdow.herokuapp.com",
        "nocoty.pl",
        "domiporta.pl",
        "newsweek.pl"];

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
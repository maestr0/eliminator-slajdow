// Load the script
let script = document.createElement("SCRIPT");
script.src = 'http://code.jquery.com/jquery-3.1.1.min.js';
script.type = 'text/javascript';
document.getElementsByTagName("head")[0].appendChild(script);

script = document.createElement("SCRIPT");
script.src = 'http://code.jquery.com/ui/1.11.0-beta.2/jquery-ui.js';
script.type = 'text/javascript';
document.getElementsByTagName("head")[0].appendChild(script);

const cfg = { /* css selektor ktory uaktywnia eliminacje slajdow na danej stronie*/
    trigger: "",
    /* index */
    pageType: "31",
    /* nazwa galerii */
    name: "",
    /* ZA tym elementem bedzie dolaczony DIV ze slajdami */
    articleBodySelector: "",
    /* elementy ktora zostana dolaczone jako slajd*/
    sectionToBeAttached: "",
    /* selektor do jednego elementu z linkiem do nastepnego slajdu*/
    navigationNextULRSelector: ".gallery_photo_desc_right",
    /* false gdy nie ma skad wziac numeracji */
    hasSlideNumbers: true,
    navigationPageNumberSelector: "",
    /* elementy do usuniecia z calej strony */
    sectionToBeRemovedSelector: "",
    /* elementy do usuniecia TYLKO z dolaczanych slajdow*/
    sectionToBeRemovedFromAttachedSlidesSelector: "",
    /* dowolne style css w postaci mapy */
    customStyle: {},
    /* naglowek slajdu */
    headerSectionSelector: "",
    /* $.empty() na elemencie*/
    sectionToBeEmptySelector: "",
    /* callback uruchamiany przed dolaczeniem kazdgo slajdu do strony */
    preIncludeCallback: function () {
    },
    classesToBeRemoved: [],
    regressionUrls: []
}

const ES = {
    test: function () {
        console.log("Page type", cfg.pageType);
        console.log("Page name", cfg.name);
        this.validateSelector(cfg.trigger);
        this.validateSelector(cfg.articleBodySelector);
        this.validateSelector(cfg.sectionToBeAttached);
        this.validateSelector(cfg.navigationNextULRSelector);
        if (cfg.hasSlideNumbers) {
            this.validateSelector(cfg.navigationPageNumberSelector);
        }
        this.validateSelector(cfg.sectionToBeRemovedSelector);
        this.validateSelector(cfg.sectionToBeRemovedFromAttachedSlidesSelector);
        this.validateSelector(cfg.headerSectionSelector);
        this.validateSelector(cfg.sectionToBeEmptySelector);
        return "koniec testu"
    },
    validateSelector: function (selector) {
        if (selector === "") {
            console.log("Empty - OK");
        } else if ($(selector).length >= 1) {
            console.log("Selector OK", selector);
            $(selector).effect("highlight", {color: 'red'}, 2000);
        } else {
            console.error("Selector incorrect", selector);
        }
    }
}

ES.test();

let defaultSupportedDomains = new Array(
    "autotrader.pl", "avanti24.pl", "groszki.pl", "ugotuj.to",
    "gazeta.pl", "tokfm.pl", "gazetapraca.pl", "moto.pl", "plotek.pl", "deser.pl", "demotywatory.pl",
    "sport.pl", "wyborcza.pl", "gazetadom.pl", "logo24.pl", "wyborcza.biz", "lula.pl", "naszemiasto.pl",
    "tuba.pl", "edziecko.pl", "czterykaty.pl", "alert24.pl", "kotek.pl", "polygamia.pl",
    "popcorner.pl", "wysokieobcasy.pl", "e-ogrody.pl", "ladnydom.pl", "bryla.gazetadom.pl",
    "metropraca.pl", "pracawbiurze.pl", "zczuba.pl", "ciacha.net", "biznes.pl",
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
    "bebzol.com", "lovekrakow.pl", "pudelekx.pl", "urzadzamy.pl", "snobka.pl",
    "fly4free.pl", "gadzetomania.pl", "trojmiasto.pl", "regiomoto.pl", "sportfan.pl",
    "forbes.pl", "geekweek.pl", "eliminator-slajdow.raszewski.info", "nocoty.pl", "domiporta.pl",
    "newsweek.pl"
);

let ffCfg = new Array();

for (let url in defaultSupportedDomains) {
    ffCfg.push({
        "type": "bool",
        "name": defaultSupportedDomains[url],
        "value": true,
        "title": "www." + defaultSupportedDomains[url]
    });
}

ffCfg.sort(function (a, b) {
    console.log(a)
    return a.name.localeCompare(b.name);
});

for (let url in ffCfg) {
    console.log(ffCfg[url].name);
}

JSON.stringify(ffCfg);

let out = [];
for (let url in defaultSupportedDomains) {
    out.push("// @include       http://" + defaultSupportedDomains[url] + "/*" )
    out.push("// @include       http://*." + defaultSupportedDomains[url] + "/*" )
}
console.log(out.join('\n'));

for (let url in defaultSupportedDomains) {
    if (defaultSupportedDomains[url].indexOf("www.") > -1) {
        console.log("<string>" + defaultSupportedDomains[url] + "</string>" )
    } else {
        console.log("<string>*." + defaultSupportedDomains[url] + "</string>" )
    }
}

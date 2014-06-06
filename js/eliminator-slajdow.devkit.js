// Load the script
var script = document.createElement("SCRIPT");
script.src = 'http://code.jquery.com/jquery-2.1.1.min.js';
script.type = 'text/javascript';
document.getElementsByTagName("head")[0].appendChild(script);

script = document.createElement("SCRIPT");
script.src = 'http://code.jquery.com/ui/1.11.0-beta.2/jquery-ui.js';
script.type = 'text/javascript';
document.getElementsByTagName("head")[0].appendChild(script);


cfg = {   /* css selektor ktory uaktywnia eliminacje slajdow na danej stronie*/
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


ES = {
    test: function () {
        console.log("Page type", cfg.pageType);
        console.log("Page name", cfg.name);
        this.validateSelector(cfg.trigger);
        this.validateSelector(cfg.articleBodySelector);
        this.validateSelector(cfg.sectionToBeAttached);
        this.validateSelector(cfg.navigationNextULRSelector);
        if (cfg.hasSlideNumbers)
            this.validateSelector(cfg.navigationPageNumberSelector);
        this.validateSelector(cfg.sectionToBeRemovedSelector);
        this.validateSelector(cfg.sectionToBeRemovedFromAttachedSlidesSelector);
        this.validateSelector(cfg.headerSectionSelector);
        this.validateSelector(cfg.sectionToBeEmptySelector);
        return "koniec testu"
    },
    validateSelector: function (selector) {
        if (selector === "") {
            console.log("Empty - OK");
        }
        else if ($(selector).length >= 1) {
            console.log("Selector OK", selector);
            $(selector).effect("highlight", {color: 'red'}, 2000);
        } else {
            console.error("Selector incorrect", selector);
        }
    }
}

ES.test();
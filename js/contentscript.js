(function ($) {
    var es = {
        scrollableImageContainer: false,
        spinningIconUrl: "images/ajax-loader.gif",
        facebookIconUrl: "images/icon_facebook.gif",
        esLogoUrl: "images/icon_facebook.gif",
        cssPath: "",
        fbRef: "chrome.extension",
        sectionToBeRemovedSelector: ".navigation div, .navigation span.page, #gal_navi_wrp, #gazeta_article_image_overlay",
        navigationNextULRSelector: ".navigation .next:first",
        navigationPageNumberSelector: ".navigation .page:first",
        articleBodySelector: "#gazeta_article_body",
        sectionToBeAttached: "#gazeta_article_image img,#gazeta_article_body", // sekcja komentarza i obrazek
        headerSectionSelector: ".navigation:first h1 span",
        hasSlideNumbers: true,
        facebookUrl: "https://www.facebook.com/eliminator-slajdow?ref=" + this.fbRef,
        bugReportUrl: "https://eliminator-slajdow.sugester.pl/",
        slideURLs: [],
        classesToBeRemoved: [],
        imageContainer: null,
        spinner: null,
        start: function () {
            var that = this;
            $("head").append($("<link>", {href: this.cssPath, type: "text/css", rel: "stylesheet"}));
            if ($(this.sectionToBeAttached).width() > 620) {
                $("#content_wrap").find("#columns_wrap #col_right").css("cssText", "float:none; position: inherit !important;");
            }
            var nextPageURL = $(this.navigationNextULRSelector).attr("href");
            console.log("link do nastepnej storny", nextPageURL);
            if (nextPageURL) {
                var imageContainerClass = 'noScroll';
                if (this.scrollableImageContainer) {
                    imageContainerClass = 'scroll';
                }

                $(this.articleBodySelector).after($("<div>", {
                    "class": imageContainerClass + ' imageContainer'
                }));
                this.imageContainer = $(this.articleBodySelector).parent().find(".imageContainer");
                this.bind();
                this.showSpinnier();
                this.slideURLs.push(document.location.pathname);
                $.get(nextPageURL, function (nextPage) {
                    that.findNextSlideURL(nextPage, nextPageURL);
                });
            }
        },
        showSpinnier: function () {
            $("div.imageContainer").append(this.spinner);
        },
        hideSpinner: function () {
            $("div.imageContainer div.eliminatorSlajdowSpinner").remove();
        },
        bind: function () {
            var that = this;
            var imageContainer = $("div.imageContainer");
            imageContainer.on("click", "span.scrollSwitch", function () {
                imageContainer.toggleClass("noScroll").toggleClass("scroll");
                if (that.scrollableImageContainer) {
                    console.log("slider switch OFF");
                    imageContainer.find("span.scrollSwitch").text("Pokaż pasek przewijania");
                    $('html, body').animate({
                        scrollTop: $(this).offset().top - 30
                    }, 500);
                    that.scrollableImageContainer = false;
                } else {
                    console.log("slider switch ON");
                    imageContainer.find("span.scrollSwitch").text("Ukryj pasek przewijania");
                    $('html, body').animate({
                        scrollTop: $(".imageContainer").offset().top - 25
                    }, 500);
                    imageContainer.animate({
                        scrollTop: 0
                    }, 0);
                    imageContainer.animate({
                        scrollTop: $(this).offset().top - imageContainer.offset().top - 5
                    }, 500);
                    that.scrollableImageContainer = true;
                }
            });

            imageContainer.on("click", "span.bugreport", function () {
                window.open(that.bugReportUrl);
            });

            imageContainer.on("click", "p.headerLogo", function () {
                window.open(that.facebookUrl);
            });
        },
        disableES: function (url) {
            if (url.indexOf("?") > -1) {
                return url.replace("?", "?es=off&");
            } else {
                return url + "?es=off";
            }
        },
        findNextSlideURL: function (galleryPage, url) {
            var that = this;
            this.hideSpinner();
            var articleSection = $(galleryPage).find(this.sectionToBeAttached);
            if ($(articleSection).length > 0) {
                var pageNumber = $(galleryPage).find(this.navigationPageNumberSelector).text().split("/");
                console.log("numer strony", pageNumber);
                var nextPageURL = $(galleryPage).find(this.navigationNextULRSelector).attr("href");
                if (url === nextPageURL || $.inArray(url, this.slideURLs) > -1) {
                    console.log("Chyba cos jest zle. URL do nastepnego slajdu zostal juz dodany do listy :/", url, nextPageURL);
                    return;
                }
                this.slideURLs.push(url);
                var pageNumberLabel = "Ostatni slajd";
                if (pageNumber.length === 2) {
                    pageNumberLabel = "Slajd " + pageNumber[0] + " z " + pageNumber[1];
                } else if (!this.hasSlideNumbers) {
                    pageNumberLabel = "Slajd";
                }

                var slideHeader = $("<div>", {
                    "class": "slideHeader slideHeader_" + pageNumber
                }).append($("<p>", {
                        "class": "headerBar",
                        text: pageNumberLabel
                    }).append($("<span>", {
                            "class": "esLogo",
                            style: "background:url('" + this.esLogoUrl + "') no-repeat"
                        })).append($("<span>", {
                            "class": "scrollSwitch",
                            text: ((this.scrollableImageContainer ? "Ukryj pasek przewijania" : "Pokaż pasek przewijania"))
                        })).append($("<span>", {
                            "class": "headerSeparator",
                            text: "|"
                        })).append(
                            $("<span>", {
                                "class": "bugreport",
                                text: "Zgłoś problem"
                            })).append(
                            $("<span>", {
                                "class": "headerSeparator",
                                text: "|"
                            })).append(
                            $("<span>", {
                                "class": "directLink"
                            }).append($("<a>", {
                                    target: "_blank",
                                    href: this.disableES(url),
                                    text: "Bezpośredni link"
                                })))).append($("<p>", {
                        "class": "headerLogo",
                        text: 'Eliminator Slajdów',
                        style: "background:url('" + this.facebookIconUrl + "') no-repeat 0 2px"
                    }));

                $(this.imageContainer).append(slideHeader);

                $(articleSection).find(this.sectionToBeRemovedSelector).empty();
                var slideWrapper = $(this.imageContainer).append($("<div>", {
                    "class": "slide_" + pageNumber
                })).children().last();

                if ($(galleryPage).find(this.headerSectionSelector).length === 1) {
                    var desc = $(galleryPage).find(this.headerSectionSelector).html();
                    $(slideWrapper).append($("<p>", {
                        "class": "slideTitle",
                        text: desc
                    }));
                }

                $(slideWrapper).append($(articleSection));

                if ((pageNumber.length === 2 && pageNumber[0] !== pageNumber[1]) || (!this.hasSlideNumbers && document.location.href.indexOf(nextPageURL) === -1)) {
                    console.log("link do nastepnej storny", nextPageURL);
                    this.showSpinnier();
                    $.get(nextPageURL, function (nextPage) {
                        that.findNextSlideURL(nextPage, nextPageURL);
                    });
                } else {
                    // ostatnia strona
                    console.log("Ostatnia Strona");
                    this.hideSpinner();
                }
                $(this.sectionToBeRemovedSelector).empty();

                for (var i in this.classesToBeRemoved) {
                    $("." + this.classesToBeRemoved[i]).removeClass(this.classesToBeRemoved[i]);
                }

            }

            $(".imageContainer > div").css("float", "left").css("width", "100%");
            var imageContainer = $(".imageContainer");
            if (imageContainer.width() > 950) {
                imageContainer.width(950);
            }
        },
        eliminateSlides: function (customOptions) {
            $.extend(true, this, this, customOptions);
            this.spinner = $("<div>", {"class": "eliminatorSlajdowSpinner"}).append($("<img>", {src: this.spinningIconUrl}));
            this.facebookUrl = "https://www.facebook.com/eliminator-slajdow?ref=" + this.fbRef;

            if ($("body#pagetype_photo").length > 0) {
                console.log("jestesmy na stronie z galeria #pagetype_photo (1)");
                $("#gazeta_article_miniatures").empty();
                this.start();
            } else if ($("body#pagetype_art_blog").length > 0) {
                /*
                 http://www.plotek.pl/plotek/56,78649,13096942,Kaja_Paschalska,,1.html
                 http://www.plotek.pl/plotek/56,79592,12829011,Jako_dzieci_byli_gwiazdami_seriali__Co_dzis_robia.html
                 Szerokie zdjecia, zawija prawa kolumne pod komentarze
                 http://wiadomosci.gazeta.pl/wiadomosci/5,114944,14025881,Turcja__Tysiace_ludzi_na_ulicach__starcia_z_policja.html?i=17
                 */
                this.sectionToBeAttached = "#gazeta_article_image img,#gazeta_article_body, div[id*='gazeta_article_image_']:not('#gazeta_article_image_overlay')";
                console.log("jestesmy na stronie z galeria #pagetype_art_blog (2)");
                this.start();
            } else if ($("body#pagetype_art").length > 0) {
                /*
                 Regresja
                 http://lublin.gazeta.pl/lublin/56,35640,13282657,I_plug_nie_dawal_rady,,2.html
                 */
                console.log("jestesmy na stronie z galeria #pagetype_art (3)");
                this.sectionToBeAttached = "#gazeta_article_image,#gazeta_article_body, div[id*='gazeta_article_image_']:not('#gazeta_article_image_overlay')"; // sekcja komentarza i obrazek
                this.start();

            } else if ($("div#art div#container_gal").length > 0) {
                /*
                 Regresja
                 http://gazetapraca.pl/gazetapraca/56,90443,12057502,10_najdziwniejszych_powodow__dla_ktorych_rzucamy_prace.html
                 */

                console.log("jestesmy na stronie z gazetapraca.pl (4)");
                this.articleBodySelector = "#art";
                this.navigationPageNumberSelector = ".paging:first";
                this.sectionToBeRemovedSelector = "div#gal_navi_wrp, #gal_navi_wrp";
                this.navigationNextULRSelector = "#gal_btn_next a:first";
                this.sectionToBeAttached = "div#container_gal";
                this.start();

            } else if ($("div#article div#article_body").length > 0) {
                /*
                 Regresja
                 http://wyborcza.pl/duzy_kadr/56,97904,12530404,Najlepsze_zdjecia_tygodnia.html
                 */
                console.log("jestesmy na stronie z galeria div#article div#article_body (5)");
                this.articleBodySelector = "#article_body";
                this.navigationNextULRSelector = "#gal_btn_next a:first";
                this.sectionToBeRemovedSelector = "#gal_navi_wrp"; // div#article ul,
                this.sectionToBeAttached = "div#container_gal";
                this.navigationPageNumberSelector = "#gal_navi .paging";
                this.start();
            } else if ($("div#k1 div#k1p div#gal_outer").length > 0) {
                /*
                 Regresja
                 http://wyborcza.pl/51,75248,12537285.html?i=0
                 */
                console.log("jestesmy na stronie z galeria bez typu ('div#k1 div#k1p div#gal_outer') (6)");
                this.articleBodySelector = "div#gal_outer .description";
                this.navigationNextULRSelector = "li.btn_next a:first";
                this.sectionToBeRemovedSelector = "div#article ul, #gal_navi_wrp";
                this.sectionToBeAttached = "div#gal_picture, div.description, p.description";
                this.navigationPageNumberSelector = "#gal_navi .paging";
                $("div#gal_miniatures").empty();
                this.hasSlideNumbers = false;
                this.start();

            } else if ($("div.PopupWielkosc div.ZdjecieGaleriaMaxWielkosc").length > 0) {
                /*
                 Regresja
                 http://www.autotrader.pl/audi_q7_3_6_2006_r/126001921/pg
                 */
                console.log("autotrader.pl - galeria zdjec samochodu");
                this.articleBodySelector = "div#Zawartosc div.Detale";
                this.navigationNextULRSelector = "div:not(.ZjecieZaznaczone).ZdjecieGaleriaMini a";
                this.sectionToBeRemovedSelector = "div.DetaleZdjeciaMiniOdstep, div.GaleriaPopupNastepne, div.FloatRight.PopupReklamaPoPrawej, div.TextAlignCenter.PopupReklamaNaDole";
                this.sectionToBeAttached = "div.ZdjecieGaleriaMaxWielkosc";
                this.navigationPageNumberSelector = "div.PasekZjecieOdstep";
                this.hasSlideNumbers = false;
                this.classesToBeRemoved.push("ZdjecieGaleriaMaxWielkosc");
                this.start();
            } else {
                console.log("Eliminator Slajdow: Tutaj nic nie mam do roboty ;(", document.location.hostname);
            }
        }
    };

    /* CHROME SPECIFIC CODE */
    chrome.extension.sendRequest({"urlName": window.location.href},
        function (response) {
            if (response.canRunOnCurrentUrl === true && document.location.href.toLowerCase().indexOf("es=off") === -1) {
                es.eliminateSlides({
                    scrollableImageContainer: (response.scrollableImageContainer === "on"),
                    spinningIconUrl: chrome.extension.getURL("images/ajax-loader.gif"),
                    facebookIconUrl: chrome.extension.getURL("images/icon_facebook.gif"),
                    esLogoUrl: chrome.extension.getURL("images/icon_16.png")
                });
            }
        });
})(jQuery.noConflict(true));
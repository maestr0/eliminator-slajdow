(function ($) {
    $.widget("info_raszewski.eliminatorSlajdow", {
        options: {
            scrollableImageContainer: false,
            spinningIconUrl: "images/ajax-loader.gif",
            facebookIconUrl: "images/icon_facebook.gif",
            esLogoUrl: "images/icon_facebook.gif",
            cssPath: "",
            facebookUrl: "https://www.facebook.com/eliminator-slajdow?ref=chrome.extension",
            bugReportUrl: "https://eliminator-slajdow.sugester.pl/",
            trackingCallback: function (category, action) {
            }
        },
        sectionToBeEmptySelector: ".navigation div, .navigation span.page, #gal_navi_wrp, #gazeta_article_image_overlay",
        sectionToBeRemovedSelector: "#gazeta_article_image div.overlayBright",
        navigationNextULRSelector: ".navigation .next:first",
        navigationPageNumberSelector: ".navigation .page:first",
        articleBodySelector: "#gazeta_article_body",
        sectionToBeAttached: "#gazeta_article_image img,#gazeta_article_body", // sekcja komentarza i obrazek
        headerSectionSelector: ".navigation:first h1 span",
        sectionToBeRemovedFromAttachedSlidesSelector: "",
        hasSlideNumbers: true,
        slideURLs: [],
        classesToBeRemoved: [],
        imageContainer: null,
        spinner: null,
        pageType: "standard",
        _start: function () {
            var that = this;
            $("head").append($("<link>", {href: this.options.cssPath, type: "text/css", rel: "stylesheet"}));
            $("body").addClass("eliminatorSlajdow");
            if ($(this.sectionToBeAttached).width() > 620) {
                $("#content_wrap").find("#columns_wrap #col_right").css("cssText", "float:none; position: inherit !important;");
            }
            var nextPageURL = $(this.navigationNextULRSelector).attr("href");
            this._logger("link do nastepnej storny", nextPageURL, this.navigationNextULRSelector);
            if (nextPageURL) {
                this._tracking("ES_start", this.pageType);

                $(this.sectionToBeEmptySelector).empty();
                $(this.sectionToBeRemovedSelector).remove();

                var imageContainerClass = 'noScroll';
                if (this.options.scrollableImageContainer) {
                    imageContainerClass = 'scroll';
                }

                $(this.articleBodySelector).after($("<div>", {
                    "class": imageContainerClass + ' imageContainerEliminatorSlajdow'
                }));
                this.imageContainer = $(this.articleBodySelector).parent().find(".imageContainerEliminatorSlajdow");
                this._bind();
                this._showSpinnier();
                this.slideURLs.push(document.location.pathname + document.location.search);
                $.get(nextPageURL,function (nextPage) {
                    that._findNextSlideURL(nextPage, nextPageURL);
                }).fail(function () {
                        that._hideSpinner();
                    });
                if (this.pageType === 3) {
                    this._removeOverlay();
                }
            } else {
                this._logger("Brak slajdow. Galeria typu " + this.pageType);
            }
        },
        _showSpinnier: function () {
            $("div.imageContainerEliminatorSlajdow").append(this.spinner);
        },
        _hideSpinner: function () {
            $("div.imageContainerEliminatorSlajdow div.eliminatorSlajdowSpinner").remove();
        },
        _bind: function () {
            var that = this;
            var imageContainer = $("div.imageContainerEliminatorSlajdow");
            imageContainer.on("click", "span.scrollSwitch", function () {
                imageContainer.toggleClass("noScroll").toggleClass("scroll");
                if (that.options.scrollableImageContainer) {
                    that._logger("scroll switch OFF");
                    imageContainer.find("span.scrollSwitch").text("Pokaż pasek przewijania");
                    $('html, body').animate({
                        scrollTop: $(this).offset().top - 30
                    }, 500);
                    that.options.scrollableImageContainer = false;
                } else {
                    that._logger("scroll switch ON");
                    imageContainer.find("span.scrollSwitch").text("Ukryj pasek przewijania");
                    $('html, body').animate({
                        scrollTop: $(".imageContainerEliminatorSlajdow").offset().top - 25
                    }, 500);
                    imageContainer.animate({
                        scrollTop: 0
                    }, 0);
                    imageContainer.animate({
                        scrollTop: $(this).offset().top - imageContainer.offset().top - 5
                    }, 500);
                    that.options.scrollableImageContainer = true;
                }

                that._tracking("scroll_ui", that.options.scrollableImageContainer ? "ON" : "OFF");
            });

            imageContainer.on("click", "span.bugreport", function () {
                window.open(that.options.bugReportUrl);
                that._tracking("bug_report_ui", "click");
            });

            imageContainer.on("click", "p.headerLogo", function () {
                window.open(that.options.facebookUrl);
                that._tracking("facebook_ui", "click");
            });

            imageContainer.on("click", "span.directLink a", function () {
                that._tracking("direct_link_ui", "click");
            });
        },
        _disableES: function (url) {
            if (url.indexOf("?") > -1) {
                return url.replace("?", "?es=off&");
            } else {
                return url + "?es=off";
            }
        },
        _findNextSlideURL: function (galleryPage, url) {
            var that = this;
            this._hideSpinner();
            var articleSection = $(galleryPage).find(this.sectionToBeAttached);
            if ($(articleSection).length > 0) {
                var pageNumber = $(galleryPage).find(this.navigationPageNumberSelector).text().match(/(\d+)/g);
                if (this.hasSlideNumbers) {
                    this._logger("numer strony", pageNumber);
                }
                var nextPageURL = $(galleryPage).find(this.navigationNextULRSelector).attr("href");
                if (typeof url === "undefined" || url === nextPageURL || $.inArray(url, this.slideURLs) > -1) {
                    this._logger("Chyba cos jest zle. URL do nastepnego slajdu zostal juz dodany do listy lub jest UNDEFINED:/", url, nextPageURL);
                    return;
                }
                this.slideURLs.push(url);
                var pageNumberLabel = "Ostatni slajd";
                if (pageNumber && pageNumber.length === 2) {
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
                            style: "background:url('" + this.options.esLogoUrl + "') no-repeat 0 0 /16px"
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
                                    href: this._disableES(url),
                                    text: "Bezpośredni link"
                                })))).append($("<p>", {
                        "class": "headerLogo",
                        text: 'Eliminator Slajdów',
                        style: "background:url('" + this.options.facebookIconUrl + "') no-repeat 0 1px /10px"
                    }));

                $(this.imageContainer).append(slideHeader);

                $(articleSection).find(this.sectionToBeEmptySelector).empty();
                $(articleSection).find(this.sectionToBeRemovedSelector).remove();
                $(articleSection).find(this.sectionToBeRemovedFromAttachedSlidesSelector).remove();

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

                $(slideWrapper).append(articleSection);

                if ((pageNumber && pageNumber.length === 2 && pageNumber[0] !== pageNumber[1]) || (!this.hasSlideNumbers && document.location.href.indexOf(nextPageURL) === -1)) {
                    this._logger("link do nastepnej storny", nextPageURL);
                    this._showSpinnier();
                    $.get(nextPageURL,function (nextPage) {
                        that._findNextSlideURL(nextPage, nextPageURL);
                    }).fail(function () {
                            that._hideSpinner();
                        });
                } else {
                    this._logger("Ostatnia Strona");
                    this._hideSpinner();
                }

                for (var i in this.classesToBeRemoved) {
                    $("." + this.classesToBeRemoved[i]).removeClass(this.classesToBeRemoved[i]);
                }

            }

            $(".imageContainerEliminatorSlajdow > div").css("float", "left").css("width", "100%");
            var imageContainer = $(".imageContainerEliminatorSlajdow");
            if (imageContainer.width() > 950 && this.pageType !== "8" && this.pageType !== "12") {
                imageContainer.width(950);
            }
        },
        _updateGalleryLink: function () {
            var galleryLink = $("#gazeta_article_miniatures .moreImg a");
            if (galleryLink.length === 1) {
                var href = galleryLink.attr("href");
                var suffix = "?i=1";
                if (href && (href.indexOf(suffix, href.length - suffix.length) !== -1)) {
                    galleryLink.attr("href", href.substring(0, href.length - suffix.length));
                }
            }
        },
        _removeOverlay: function () {
            $("#gazeta_article_image div.overlayBright").remove();
        },
        _create: function (customOptions) {
            $.extend(true, this, this, customOptions);
            this.spinner = $("<div>", {"class": "eliminatorSlajdowSpinner"}).append($("<img>", {src: this.options.spinningIconUrl}));

            if ($("body#pagetype_photo").length > 0) {
                this._logger("jestesmy na stronie z galeria #pagetype_photo (1)");
                $("#gazeta_article_miniatures").empty();
                this.pageType = "1";
                this._start();
            } else if ($("body#pagetype_art_blog").length > 0) {
                /*
                 http://www.plotek.pl/plotek/56,78649,13096942,Kaja_Paschalska,,1.html
                 http://www.plotek.pl/plotek/56,79592,12829011,Jako_dzieci_byli_gwiazdami_seriali__Co_dzis_robia.html
                 Szerokie zdjecia, zawija prawa kolumne pod komentarze
                 http://wiadomosci.gazeta.pl/wiadomosci/5,114944,14025881,Turcja__Tysiace_ludzi_na_ulicach__starcia_z_policja.html?i=17
                 http://lublin.gazeta.pl/lublin/56,35640,13282657,I_plug_nie_dawal_rady,,2.html
                 */
                this.sectionToBeAttached = "#gazeta_article_image img,#gazeta_article_body, div[id*='gazeta_article_image_']:not('#gazeta_article_image_overlay')";
                this._logger("jestesmy na stronie z galeria #pagetype_art_blog (2)");
                this.pageType = "2";
                this._updateGalleryLink();
                this.classesToBeRemoved.push("gazetaVideoPlayer");
                this._start();
            } else if ($("body#pagetype_art #gazeta_article_tools").length > 0) {
                /*
                 Regresja
                 http://gazetapraca.pl/gazetapraca/56,90443,12057502,10_najdziwniejszych_powodow__dla_ktorych_rzucamy_prace.html
                 */
                this._logger("jestesmy na stronie z galeria body#pagetype_art #gazeta_article_image (3)");
                this.sectionToBeAttached = "#gazeta_article_image,#gazeta_article_body, div[id*='gazeta_article_image_']:not('#gazeta_article_image_overlay')"; // sekcja komentarza i obrazek
                this.pageType = "3";
                this._updateGalleryLink();
                this._removeOverlay();
                this._start();

            } else if ($("div#art div#container_gal").length > 0) {
                /*
                 Regresja
                 http://gazetapraca.pl/gazetapraca/56,90443,12057502,10_najdziwniejszych_powodow__dla_ktorych_rzucamy_prace.html
                 */

                this._logger("jestesmy na stronie z gazetapraca.pl (4)");
                this.articleBodySelector = "#art";
                this.navigationPageNumberSelector = ".paging:first";
                this.sectionToBeEmptySelector = "div#gal_navi_wrp, #gal_navi_wrp";
                this.navigationNextULRSelector = "#gal_btn_next a:first";
                this.sectionToBeAttached = "div#container_gal";
                this.pageType = "4";
                this._start();

            } else if ($("div#article div#article_body").length > 0) {
                /*
                 Regresja
                 http://wyborcza.pl/duzy_kadr/56,97904,12530404,Najlepsze_zdjecia_tygodnia.html
                 */
                this._logger("jestesmy na stronie z galeria div#article div#article_body (5)");
                this.articleBodySelector = "#article_body";
                this.navigationNextULRSelector = "#gal_btn_next a:first";
                this.sectionToBeEmptySelector = "#gal_navi_wrp"; // div#article ul,
                this.sectionToBeAttached = "div#container_gal";
                this.navigationPageNumberSelector = "#gal_navi .paging";
                this.pageType = "5";
                this._start();
            } else if ($("div#k1 div#k1p div#gal_outer").length > 0) {
                /*
                 Regresja
                 http://wyborcza.pl/51,75248,12537285.html?i=0
                 */
                this._logger("jestesmy na stronie z galeria bez typu ('div#k1 div#k1p div#gal_outer') (6)");
                this.articleBodySelector = "div#gal_outer .description";
                this.navigationNextULRSelector = "li.btn_next a:first";
                this.sectionToBeEmptySelector = "div#article ul, #gal_navi_wrp";
                this.sectionToBeAttached = "div#gal_picture, div.description, p.description";
                this.navigationPageNumberSelector = "#gal_navi .paging";
                $("div#gal_miniatures").empty();
                this.hasSlideNumbers = false;
                this.pageType = "6";
                this._start();

            } else if ($("div.PopupWielkosc div.ZdjecieGaleriaMaxWielkosc").length > 0) {
                /*
                 Regresja
                 http://www.autotrader.pl/audi_q7_3_6_2006_r/126001921/pg
                 */
                this._logger("autotrader.pl - galeria zdjec samochodu - 2013");
                this.articleBodySelector = "div#Zawartosc div.Detale";
                this.navigationNextULRSelector = "div:not(.ZjecieZaznaczone).ZdjecieGaleriaMini a";
                this.sectionToBeEmptySelector = "div.DetaleZdjeciaMiniOdstep, div.GaleriaPopupNastepne, div.FloatRight.PopupReklamaPoPrawej, div.TextAlignCenter.PopupReklamaNaDole";
                this.sectionToBeAttached = "div.ZdjecieGaleriaMaxWielkosc";
                this.navigationPageNumberSelector = "div.PasekZjecieOdstep";
                this.hasSlideNumbers = false;
                this.classesToBeRemoved.push("ZdjecieGaleriaMaxWielkosc");
                this.pageType = "7";
                this._start();
            } else if ($("#multiGallery #multiGalleryContent #gallery").length > 0) {
                this._logger("Galeria MultiGallery na ONET.PL");
                this.articleBodySelector = "#multiGallery #multiGalleryContent #galleryText";
                this.sectionToBeEmptySelector = "*[id='mediaList'], script, .onet-ad, .navBox .navBoxContainer, .imageContainerEliminatorSlajdow .navBoxClose, .ad_adInfo, .ad_adInfoEnd";
                this.sectionToBeRemovedSelector = ".imageContainerEliminatorSlajdow .navBoxClose, .ad_adInfo, .ad_adInfoEnd, #multiGalleryContent .navBox";
                this.navigationNextULRSelector = ".navBox .navBoxContainer a.nextFixed";
                this.navigationPageNumberSelector = "";
                this.sectionToBeAttached = "#multiGalleryContent #galleryText"; // sekcja komentarza i obrazek
                this.headerSectionSelector = "";
                this.hasSlideNumbers = false;
                this.pageType = "8";
                this._start();
            } else if ($("div#page div#pageWrapper div#photo div#photoContainer div.nav a").length > 0) {
                /*
                 * http://www.wspolczesna.pl/apps/pbcs.dll/gallery?Site=GW&Date=20131029&Category=GALERIA01&ArtNo=102909998&Ref=PH&Params=Itemnr=1
                 * */
                this._logger("Galeria MediaRegionalne ");
                this.pageType = "9";
                // wrapper na caly art
                this.articleBodySelector = "div#photo";

                this.sectionToBeEmptySelector = "script";
                this.sectionToBeRemovedSelector = "div#tngallery, p#photoNavigation, .imageContainerEliminatorSlajdow div#photoRelatedArticles, .imageContainerEliminatorSlajdow div#photo p.photoMeta";
                this.navigationNextULRSelector = "p#photoNavigation a#photoNavigationNext";
                this.navigationPageNumberSelector = "span#photoNavigationPages";
                this.sectionToBeAttached = "div#photo"; // sekcja komentarza i obrazek
                this.headerSectionSelector = "";
                this.hasSlideNumbers = true;
                this._start();
            } else if ($("div#page div#pageWrapper div#article.photostory p.photoNavigation a.photoNavigationNext").length > 0) {
                /*
                 * http://www.wspolczesna.pl/apps/pbcs.dll/article?AID=/20131029/REG00/131029705
                 * */
                this._logger("Galeria MediaRegionalne - artykul");
                this.pageType = "10";
                // wrapper na caly art
                this.articleBodySelector = "div#article";
                this.sectionToBeEmptySelector = "script";
                // do usuniecia TYLKO z zalaczanej czesci okreslonej selektorem sectionToBeAttached
                this.sectionToBeRemovedSelector = "p.photoNavigation, div#photoContainer div.nav, div#photoElement div.nav, h2";
                this.navigationNextULRSelector = "p.photoNavigation a.photoNavigationNext";
                this.navigationPageNumberSelector = "span.photoNavigationPages:first";
                this.sectionToBeAttached = "div#article div.intextAd"; // sekcja komentarza i obrazek
                this.headerSectionSelector = "";
                this.hasSlideNumbers = true;
                this._start();
            } else if ($("div#main-column div#photo.common-box div.inner div.photo-item div.photoElem a.next").length > 0) {
                /*
                 * http://www.mmbydgoszcz.pl/photo/1886182/Photo+Walk+Koronowo+2013
                 * */
                this._logger("Galeria MojeMiasto");
                this.pageType = "11";
                // wrapper na caly art
                this.articleBodySelector = "div#photo div.photo-item";
                this.sectionToBeEmptySelector = "script";
                this.sectionToBeRemovedSelector = "div.photoElem a";
                this.navigationNextULRSelector = "div#main-column div#photo.common-box div.inner div.photo-item div.photoElem a.next";
                this.navigationPageNumberSelector = "div#photo.common-box div.top-slider div.slider";
                this.sectionToBeAttached = "div.photo-item"; // sekcja komentarza i obrazek
                this.headerSectionSelector = "";
                this.hasSlideNumbers = true;
                this._start();
            } else if ($("body#pagetype_art #content_wrap .photostoryNextPage").length > 0) {
                /*
                 Regresja
                 http://technologie.gazeta.pl/internet/56,104530,14940595,Panel_sterowania__gdzie_ja_do_diaska_jestem,,1.html
                 */
                this._logger("jestesmy na stronie z galeria #pagetype_art .photostoryNextPage NOWA GALERIA GAZETY (12)");
                this.sectionToBeAttached = "#content_wrap"; // sekcja komentarza i obrazek
                this.articleBodySelector = "#columns_wrap"; // gdzie doczepic imageContainer
                this.sectionToBeEmptySelector = "script:not([src])";
                this.sectionToBeRemovedSelector = "#banP1, #banP2, #banP3, #banP4,#banP62,  .photostoryNextPage, .photostoryPrevPage";                        // do usuniecia wszedzie
                this.sectionToBeRemovedFromAttachedSlidesSelector = "#photo_comments, #article_comments";  // do usuniecia TYLKO z dolaczonych slajdow
                this.navigationNextULRSelector = "div#content .photostoryNextPage";
                this.navigationPageNumberSelector = "";
                this.headerSectionSelector = "";
                this.hasSlideNumbers = false;
                this.pageType = "12";
                this._updateGalleryLink();
                this._removeOverlay();
                this._start();

            } else if ($("div#page div#pageWrapper div#photo p#photoNavigation a#photoNavigationNext").length > 0) {
                /*
                 * http://www.gazetalubuska.pl/apps/pbcs.dll/gallery?Site=GL&Date=20140201&Category=galeria&ArtNo=201009994&Ref=PH&Params=Itemnr=1
                 * http://www.wspolczesna.pl/apps/pbcs.dll/gallery?Site=GW&Date=20140131&Category=GALERIA01&ArtNo=131009996&Ref=PH
                 * */
                this._logger("Galeria MediaRegionalne - Galeria 13");
                this.pageType = "13";
                // wrapper na caly art
                this.articleBodySelector = "div#photo";
                this.sectionToBeEmptySelector = "script";
                this.sectionToBeRemovedSelector = "#tngallery, #photoRelatedArticles, #photoNavigation, #photoElement div.nav";
                this.navigationNextULRSelector = "p#photoNavigation a#photoNavigationNext";
                this.navigationPageNumberSelector = "span#photoNavigationPages";
                this.sectionToBeAttached = "div#photo img, div#photo p:nth-child(7)"; // sekcja komentarza i obrazek
                this.headerSectionSelector = "";
                this.hasSlideNumbers = true;
                this._start();
            } else if ($("div#wrapper > div > div#photo p#galleryNav a#galleryNavNext").length > 0) {
                /*
                 * http://www.nowiny24.pl/apps/pbcs.dll/gallery?Site=NW&Date=20140126&Category=IMPREZY07&ArtNo=126009999&Ref=PH&Params=Itemnr=1
                 * */
                this._logger("Galeria MediaRegionalne - Galeria 14");
                this.pageType = "14";
                // wrapper na caly art
                this.articleBodySelector = "div#photo";
                this.sectionToBeEmptySelector = "script";
                this.sectionToBeRemovedSelector = "#galleryNav, #tngalleryScroll";
                this.navigationNextULRSelector = "p#galleryNav a#galleryNavNext";
                this.navigationPageNumberSelector = "p#galleryNav";
                this.sectionToBeAttached = "div#photo img, #photo p:first"; // sekcja komentarza i obrazek
                this.headerSectionSelector = "";
                this.hasSlideNumbers = true;
                this._start();
            } else if ($("div#LeftContent div#MainGallery img#PhotoInMainGallery").length > 0) {
                /*
                 Regresja
                 http://www.autotrader.pl/audi_q7_3_6_2006_r/126001921/pg
                 */
                this._logger("autotrader.pl - galeria zdjec samochodu - 2014");
                this.articleBodySelector = "div#MainGallery";
                this.navigationNextULRSelector = "div:not(.ZjecieZaznaczone).ZdjecieGaleriaMini a";
                this.sectionToBeEmptySelector = "div.DetaleZdjeciaMiniOdstep, div.GaleriaPopupNastepne, div.FloatRight.PopupReklamaPoPrawej, div.TextAlignCenter.PopupReklamaNaDole";
                this.sectionToBeAttached = "div.ZdjecieGaleriaMaxWielkosc";
                this.navigationPageNumberSelector = "div.PasekZjecieOdstep";
                this.hasSlideNumbers = false;
                this.classesToBeRemoved.push("ZdjecieGaleriaMaxWielkosc");
                this.pageType = "15";
                this._start();
            } else {
                this._logger("Eliminator Slajdow: Tutaj nic nie mam do roboty ;(", document.location.hostname);
            }
        },
        _tracking: function (category, action) {
            if ($.isFunction(this.options.trackingCallback)) {
                this.options.trackingCallback.call(this, category, action, window.location.host)
            }
        },
        _logger: function () {
            console.log.apply(console, arguments);
        }
    });
})(jQuery);

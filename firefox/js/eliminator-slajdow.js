/*
 *   Eliminator Slajdów
 *
 *   Autor: Paweł Raszewski
 *
 *   https://github.com/maestr0/eliminator-slajdow-chrome
 *   Licencja: GPLv3
 *   Strona Domowa: http://eliminator-slajdow.raszewski.info
 *
 *   latest version on CDN: https://cdn.eliminator-slajdow.raszewski.info/eliminator-slajdow.js
 *
 * */

(function ($) {
    ES = {
        options: {
            imageBaseUrl: "",
            scrollableImageContainer: false,
            esLogoUrl: "es_logo.svg",
            cssPath: "",
            facebookUrl: "https://www.facebook.com/eliminator-slajdow?ref=es.extension",
            bugReportUrl: "http://eliminator-slajdow.raszewski.info/problem/nowy?ref=es.extension",
            debug: (document.location.href.indexOf("es=debug") > -1) || (document.location.href.indexOf("es=dev") > -1),
            version: "dev",
            preIncludeCallback: function () {
            },
            trackingCallback: function (category, action) {
            }
        },
        defaultPageConfig: {
            sectionToBeEmptySelector: ".navigation div, .navigation span.page, #gal_navi_wrp, #gazeta_article_image_overlay",
            sectionToBeRemovedSelector: "#gazeta_article_image div.overlayBright",
            navigationNextULRSelector: ".navigation .next:first",
            navigationPageNumberSelector: ".navigation .page:first",
            articleBodySelector: "#gazeta_article_body",
            sectionToBeAttached: "#gazeta_article_image img,#gazeta_article_body",
            headerSectionSelector: ".navigation:first h1 span",
            sectionToBeRemovedFromAttachedSlidesSelector: "",
            hasSlideNumbers: true,
            imageContainerPositionInRelationToArticleBody: "after",
            visitedSlideURLs: [],
            classesToBeRemoved: [],
            pageType: "Default",
            customStyle: {},
            trigger: "",
            triggerStopper: "",
            esTheme: "default",
            preIncludeCallback: function () {
            },
            beforeAllCallback: function () {
            },
            loadMoreSlides: function () {
                return true;
            },
            afterAllCallback: function () {
            },
            isNextPageUrlCorrect: function (url) {
                return (typeof url !== 'undefined') && document.location.href.indexOf(url) === -1;
            }
        },
        spinner: $("<div>", {"class": "eliminatorSlajdowSpinner"}).append($("<i>", {class: 'icon-spin3 animate-spin'})),
        imageContainer: null,
        init: function (customOptions) {

            if ($("div.imageContainerEliminatorSlajdow").length > 0) {
                return; // ES already initialized
            }

            $.extend(true, this.options, this.options, customOptions);

            if (this.options.debug) {
                this.createDebugConsole();
            }

            for (var i in pageConfigs) {
                var trigger = pageConfigs[i].trigger;
                var noOfSelectors = trigger && trigger.match(/,/g) ? trigger.match(/,/g).length : 1;
                if ($(trigger).length >= noOfSelectors && $(pageConfigs[i].triggerStopper).length === 0) {
                    $.extend(true, this.defaultPageConfig, this.defaultPageConfig, pageConfigs[i]);
                    this.logger("ES START konfiguracja " + this.defaultPageConfig.pageType + " dla " + this.defaultPageConfig.name);
                    this.start();
                    break;
                }
            }
        },
        start: function () {
            if (this.options.debug) {
                var content = "";
                for (var property in this.defaultPageConfig) {
                    content += property + "=" + JSON.stringify(this.defaultPageConfig[property]) + "\n";
                }
                $("#es_debug").val($("#es_debug").val() + "\n" + content);
            }

            pageNumber = 1;
            this.defaultPageConfig.beforeAllCallback.call(this);

            $("body").addClass("eliminatorSlajdow");
            this.theme(this.defaultPageConfig.esTheme);
            this.nextPageURL = $(this.defaultPageConfig.navigationNextULRSelector).attr("href");
            this.defaultPageConfig.preIncludeCallback.call(this);
            if (this.nextPageURL) {
                this.logger("link do nastepnej storny", this.nextPageURL, this.defaultPageConfig.navigationNextULRSelector);
                $(this.defaultPageConfig.sectionToBeEmptySelector).children().hide();
                $(this.defaultPageConfig.sectionToBeRemovedSelector).hide();
                this.createImageContainer();
                this.bind();
                this.showSpinnier();
                this.defaultPageConfig.visitedSlideURLs.push(document.location.pathname + document.location.search);
                this.requestNextSlide(this.nextPageURL);
            } else {
                this.logger("Nie znaleziono linka do nastepnego slajdu. Galeria typu " + this.defaultPageConfig.pageType);
            }
        },
        appendNextSlide: function (dirtyPage, thisSlideURL) {
            /**
             * remove <script> tags only
             *
             * SANITIZE_DOM=false is intentional as duplicated IDs must stay even if that is not correct according to HTML spec
             */
            var entireSlidePage = dirtyPage;
            var that = this;

            this.hideSpinner();
            this.currentUrl = thisSlideURL;
            this.articleSection = $(entireSlidePage).find(this.defaultPageConfig.sectionToBeAttached);
            // ARTICLE BODY CHECK
            if ($(this.articleSection).length > 0) {

                this.nextPageURL = $(dirtyPage).find(this.defaultPageConfig.navigationNextULRSelector).attr("href");

                if (typeof this.nextPageURL === "undefined") {
                    $.each($(entireSlidePage), function () {
                        if ($(this).is(that.defaultPageConfig.navigationNextULRSelector)) {
                            that.nextPageURL = $(this).attr("href");
                        }
                    });
                }

                $(this.articleSection).find(this.defaultPageConfig.sectionToBeEmptySelector).empty();
                $(this.articleSection).find(this.defaultPageConfig.sectionToBeRemovedSelector).remove();
                $(this.articleSection).find(this.defaultPageConfig.sectionToBeRemovedFromAttachedSlidesSelector).remove();

                if (typeof thisSlideURL === "undefined") {
                    this.logger("ERROR: URL tego slajdu jest nieznany");
                    this.undo();
                    this.defaultPageConfig.afterAllCallback.call(this);
                    return;
                }
                if (thisSlideURL === this.nextPageURL) {
                    this.logger("WARNING: URL do następnego slajdu jest taki sam jak url tego slajdu");
                    this.logger("URL do tego slajdu", thisSlideURL);
                    this.logger("URL do nastepnego zalaczanego slajdu", this.nextPageURL);
                    this.undo();
                    this.defaultPageConfig.afterAllCallback.call(this);
                    return;
                }
                if ($.inArray(thisSlideURL, this.defaultPageConfig.visitedSlideURLs) > -1) {
                    this.logger("WARNING: URL następnego slajdu jest już załączony do galerii");
                    this.logger("Załączone strony", this.defaultPageConfig.visitedSlideURLs);
                    this.logger("URL do tego slajdu", thisSlideURL);
                    this.logger("URL do nastepnego zalaczanego slajdu", this.nextPageURL);
                    this.undo();
                    this.defaultPageConfig.afterAllCallback.call(this);
                    return;
                }

                pageNumber = pageNumber + 1;

                var slideHeader = this.buildHeader(pageNumber, thisSlideURL);

                $(this.imageContainer).append(slideHeader);

                $(this.articleSection).find(this.defaultPageConfig.sectionToBeEmptySelector).empty();
                $(this.articleSection).find(this.defaultPageConfig.sectionToBeRemovedSelector).remove();
                $(this.articleSection).find(this.defaultPageConfig.sectionToBeRemovedFromAttachedSlidesSelector).remove();

                var slideWrapper = $(this.imageContainer).append($("<div>", {
                    "class": "slide_" + pageNumber + " es_slide"
                })).children().last();

                if ($(entireSlidePage).find(this.defaultPageConfig.headerSectionSelector).length === 1) {
                    var desc = $(entireSlidePage).find(this.defaultPageConfig.headerSectionSelector).html();
                    $(slideWrapper).append($("<p>", {
                        "class": "slideTitle",
                        text: desc
                    }));
                }

                $(slideWrapper).append(this.articleSection);

                this.setCssOverwrite(this.articleSection);

                for (var i in this.defaultPageConfig.classesToBeRemoved) {
                    $("." + this.defaultPageConfig.classesToBeRemoved[i]).removeClass(this.defaultPageConfig.classesToBeRemoved[i]);
                }

                this.defaultPageConfig.visitedSlideURLs.push(thisSlideURL);

                this.defaultPageConfig.preIncludeCallback.call(this);

                if (this.defaultPageConfig.isNextPageUrlCorrect.call(this, this.nextPageURL)) {
                    this.logger("link do nastepnej storny", this.nextPageURL);
                    this.showSpinnier();

                    if (this.defaultPageConfig.loadMoreSlides.call(this)) {
                        this.requestNextSlide(this.nextPageURL);
                    } else {
                        this.logger("loadMoreSlides=false  ostatni slajd");
                        this.hideSpinner();
                        this.defaultPageConfig.afterAllCallback.call(this);
                        return;
                    }
                } else {
                    this.logger("Ostatni Slajd. NextPageUrl=" + this.nextPageURL);
                    this.hideSpinner();
                    this.defaultPageConfig.afterAllCallback.call(this);
                }

            } else {
                this.logger("Niepoprawny selektor CSS dla ARTYKULU", this.defaultPageConfig.articleBodySelector);
                this.undo();
            }
        },
        undo: function () {
            $(this.defaultPageConfig.sectionToBeEmptySelector).children().show();
            $(this.defaultPageConfig.sectionToBeRemovedSelector).show();
        },
        buildHeader: function (pageNumber, url) {
            return $("<div>", {
                "class": "slideHeader slideHeader_" + pageNumber
            }).append($("<p>", {
                "class": "headerBar shadow_es"
            }).append($("<span>", {
                "class": "esLogo",
                style: "background:url('" + this.options.imageBaseUrl + this.options.esLogoUrl + "') white no-repeat 2px 0 /16px"
            })).append($("<a>", {
                "href": "https://www.facebook.com/eliminator.slajdow/?ref=option_popup",
                "target": "_blank",
                "class": "pageNumber",
                text: "Eliminator Slajdów - Slajd " + pageNumber
            })).append($("<i>", {
                "class": "scrollSwitch icon-resize-vertical icon-lock " + (this.options.scrollableImageContainer ? "esIconEnabled" : "esIconDisabled"),
                title: "Zablokuj przewijanie"
            })).append(
                $("<span>", {
                    "class": "bugreport"
                })).append(
                $("<i>", {
                    "class": "icon-right-circle large",
                    title: "Następny Slajd"
                })).append(
                $("<i>", {
                    "class": "icon-left-circle",
                    title: "Poprzedni Slajd"
                })).append(
                $("<i>", {
                    "class": "icon-up-circle",
                    title: "Pierwszy Slajd"
                })).append(
                $("<i>", {
                    "class": "icon-down-circle",
                    title: "Ostatni Slajd"
                })).append(
                $("<i>", {
                    "class": "icon-link-ext-alt",
                    "data-url": url,
                    title: "Bezpośredni link"
                })));
        },
        setCssOverwrite: function (content) {
            var appendNewStyle = function (elements, newStyle) {
                elements.each(function () {
                    var current = $(this).attr("style") ? $(this).attr("style") + ";" : "";
                    if (current.indexOf(newStyle) === -1) {
                        $(this).attr("style", current + newStyle);
                    }
                });
            };

            for (var selector in this.defaultPageConfig.customStyle) {
                var elements = $(content).find(selector);
                if (elements.length === 0) { // try to find the elements in the whole page
                    elements = $(selector);
                }
                appendNewStyle(elements, this.defaultPageConfig.customStyle[selector]);
            }
        },
        theme: function (theme) {
            $("html").addClass("es-theme-" + theme);
        },
        getPaywallRedirectUrl: function (nextPage) {
            if (nextPage.length > 1000 && nextPage.length < 1500 && $(nextPage).length == 11 &&
                $($(nextPage)[3]).is("meta") && $($(nextPage)[3]).attr("http-equiv") == "refresh" &&
                $($(nextPage)[3]).attr("content") &&
                $($(nextPage)[3]).attr("content").indexOf("5;URL=") === 0) {
                var c = $($(nextPage)[3]).attr("content");
                return c.substring(7, c.length - 1);
            }
            return "";
        },
        requestNextSlide: function (nextPageURL) {
            var that = this;
            if (typeof nextPageURL === 'undefined' || nextPageURL.trim() === "") {
                that.hideSpinner();
                return;
            }

            if (nextPageURL.indexOf("http") !== 0) {
                if (nextPageURL.indexOf("/") === 0) {
                    nextPageURL = nextPageURL.substring(1);
                }
                nextPageURL = document.location.origin + "/" + nextPageURL;
            }

            $.get(this.appendParamToUrl(nextPageURL, "es=nextPage"), "html", function (nextPage) {
                var redirectUrl = that.getPaywallRedirectUrl(nextPage);
                if (redirectUrl) {
                    that.requestNextSlide(redirectUrl);
                } else {
                    that.appendNextSlide(nextPage, nextPageURL);
                }
            }).fail(function (a, b, c) {
                that.logger("ES - AJAX request error. Code " + a.status, a, b, c, nextPageURL);
                that.hideSpinner();
                that.showErrorPanel("Coś zablokowało żądanie AJAX ", nextPageURL);
                that.undo();
            });
        },
        showErrorPanel: function (msg, ajaxUrl) {
            var imageContainer = $("div.imageContainerEliminatorSlajdow");
            imageContainer.append($("<div>", {"class": "esErrorPanel"})
                .append($("<p>", {text: "Błąd Eliminatora Slajdów. " + msg, "class": "esErrorHeader"}))
                .append($("<p>", {
                    text: "Możliwe, że problem wynika z konfliktu ES z innym dodatkiem do przeglądarki," +
                    " który blokuje reklamy. np. uBloc albo Ablocker. Wyłącz tymczasowo ten dodatek i zobacz czy ES działa. " +
                    "Zablokowane żądanie AJAX GET: " + ajaxUrl +
                    " Jeśli problem pozostał zgłoś go na", "class": "esErrorContent"
                }))
                .append($("<a>", {
                    href: "http://eliminator-slajdow.raszewski.info/problem/nowy?ref=error-panel-ds",
                    text: "http://eliminator-slajdow.raszewski.info", "class": "esLink"
                }))
                .append($("<p>", {
                    text: "Jako tymczasowe rozwiązanie problemu możesz zrobić którąś z poniższych rzeczy:",
                    "class": "esErrorContentMore"
                }))
                .append($("<p>", {
                    text: "- Wyłączyć ES dla wszytkich galerii na tym portalu. W tym celu otwórz opcje Eliminatora Slajdów. Znajdź na liście ten portal i odznacz go.",
                    "class": "esErrorContentMore"
                }))
                .append($("<p>", {
                    text: "- możesz zawsze jednorazowo wyłączyć działanie ES na tej stronie klikajac " +
                    "PAUSE w menu ES obok paska adresu.", "class": "esErrorContentMore"
                }))
            );
        },
        bind: function () {
            var that = this;
            var imageContainer = $("div.imageContainerEliminatorSlajdow");
            imageContainer.on("click", "i.icon-resize-vertical", function () {
                var currentOffset = $(this)[0].getBoundingClientRect().bottom - $(this)[0].getBoundingClientRect().height;
                imageContainer.toggleClass("noScroll").toggleClass("scroll");
                if (that.options.scrollableImageContainer) {
                    that.logger("scroll switch OFF");
                    $('html, body').animate({
                        scrollTop: $(this).offset().top - currentOffset
                    }, 500);
                    that.options.scrollableImageContainer = false;
                } else {
                    that.logger("scroll switch ON");
                    $('html, body').animate({
                        scrollTop: $(".imageContainerEliminatorSlajdow").offset().top - 25
                    }, 500);
                    imageContainer.animate({
                        scrollTop: 0
                    }, 0);
                    imageContainer.animate({
                        scrollTop: $(this).offset().top - imageContainer.offset().top - currentOffset + 25
                    }, 500);
                    that.options.scrollableImageContainer = true;
                }
                imageContainer.find("i.icon-resize-vertical").toggleClass("esIconEnabled").toggleClass("esIconDisabled");
            });

            imageContainer.on("click", ".bugreport a", function () {
                window.open(that.options.bugReportUrl);
            });

            imageContainer.on("click", "p.headerLogo", function () {
                window.open(that.options.facebookUrl);
            });

            imageContainer.on("click", ".icon-link-ext-alt", function () {
                window.open(that.appendParamToUrl($(this).data('url'), "es=off"), '_blank');
            });

            imageContainer.on("click", "i.icon-up-circle", function () {
                $("body,html").animate({
                    scrollTop: 0
                }, 500);
            });

            imageContainer.on("click", "i.icon-down-circle", function () {
                $("body,html").animate({
                    scrollTop: imageContainer.offset().top + imageContainer.height() - 50
                }, 500);
            });

            imageContainer.on("click", "i.icon-right-circle", function () {
                if (that.options.scrollableImageContainer) {
                    // maybe will implement it one day
                } else {
                    var offset = imageContainer.offset().top + imageContainer.height() - 50;
                    var thisSlide = $(this).parent().parent();
                    if (thisSlide.next().length > 0 && thisSlide.next().next().length > 0) {
                        offset = thisSlide.next().next().offset().top - thisSlide[0].getBoundingClientRect().bottom - thisSlide[0].getBoundingClientRect().height + 48;
                    }
                    $("body,html").animate({
                        scrollTop: offset
                    }, 0);
                }
            });

            imageContainer.on("click", "i.icon-left-circle", function () {
                if (that.options.scrollableImageContainer) {
                    // maybe will implement it one day
                } else {
                    var offset = 0;
                    var thisSlide = $(this).parent().parent();
                    if (thisSlide.prev().length > 0) {
                        offset = thisSlide.prev().prev().offset().top - thisSlide[0].getBoundingClientRect().bottom - thisSlide[0].getBoundingClientRect().height + 48;
                    }
                    $("body,html").animate({
                        scrollTop: offset
                    }, 0);

                }
            });
            // TODO: dodac obsluge spacji
        },
        createImageContainer: function () {
            var icClass = this.options.scrollableImageContainer ? 'scroll' : 'noScroll';
            this.imageContainer = $("<div>", {"class": icClass + ' imageContainerEliminatorSlajdow'});
            if (this.defaultPageConfig.imageContainerPositionInRelationToArticleBody === "before") {
                $(this.defaultPageConfig.articleBodySelector).before(this.imageContainer);
            } else {
                $(this.defaultPageConfig.articleBodySelector).after(this.imageContainer);
            }
        },
        showSpinnier: function () {
            $("div.imageContainerEliminatorSlajdow").append(this.spinner);
        },
        hideSpinner: function () {
            $("div.imageContainerEliminatorSlajdow div.eliminatorSlajdowSpinner").remove();
        },
        appendDisableEsFlag: function (url) {
            return this.appendParamToUrl(url, "es=off");
        },
        appendParamToUrl: function (url, param) {
            if (url.indexOf("?") > -1) {
                return url.replace("?", "?" + param + "&");
            } else if (url.indexOf("#") > -1) {
                return url.replace("#", "?" + param + "#");
            } else {
                return url + "?" + param;
            }
        },
        updateGalleryLink: function () {
            var galleryLink = $("#gazeta_article_miniatures .moreImg a, #gazeta_article_image a.next ");
            if (galleryLink.length > 0) {
                var href = galleryLink.attr("href");
                var suffix = "?i=1";
                if (href && (href.indexOf(suffix, href.length - suffix.length) !== -1)) {
                    galleryLink.attr("href", href.substring(0, href.length - suffix.length));
                }
            }
        },
        regression: function () {
            this.createDebugConsole();
            var setTimeoutFunction = function (urlToOpen, pi) {
                var delay = 5 * 1000 * pi;
                setTimeout(function () {
                    window.open(urlToOpen, '_blank');
                }, delay);
            };

            var self = this;
            var allRegressionUrls = [];
            for (var pi in  self.pageConfigs) {
                var pageConfig = this.pageConfigs[self.pageConfigs.length - pi - 1];
                for (var i in pageConfig.regressionUrls) {
                    var regressionUrl = pageConfig.regressionUrls[i];
                    if (regressionUrl.length > 0)
                        allRegressionUrls.push(regressionUrl + "###es=debug###-PAGETYPE=" + pageConfig.pageType);
                }
            }

            var step = 5;
            var lowerBound = 0;
            var topBound = lowerBound + step;

            $("#start").click(function () {
                do {
                    $("body").append($("<a>", {
                        "href": allRegressionUrls[lowerBound],
                        "text": allRegressionUrls[lowerBound]
                    })).append($("<br>"));
                    var urlToOpen = allRegressionUrls[lowerBound];
                    setTimeoutFunction(urlToOpen, 0);
                    lowerBound++;
                    self.logger("Remaining URLs ", allRegressionUrls.length - lowerBound);
                } while (lowerBound < topBound && lowerBound < allRegressionUrls.length);
                topBound = topBound + step;
            });

            this.defaultPageConfig.sectionToBeAttached = "#toBeAttached";
            this.defaultPageConfig.articleBodySelector = "#articleBodySelector";
            this.createImageContainer();
            this.appendNextSlide("body", "regression");
            this.init();
            this.options.imageBaseUrl = "../chrome/images/";
            $(".imageContainerEliminatorSlajdow").append(this.buildHeader(666, "https://test.com"));
            this.showSpinnier();
        },
        createDebugConsole: function () {
            var content = "Eliminator Slajdów - Debug Console v" + this.options.version + "\n\n";
            var style = "width: 700px;height: 400px;z-index: 9999999;font-family: monospace;font-size: 13px;border: 1px solid;" +
                "background: black;color: #3BFF00;padding: 10px;position: fixed;bottom: 0;right: 0";
            $("<textarea>", {id: "es_debug", style: style, val: content}).appendTo($("body"));
        },
        logger: function () {
            if (this.options.debug) {
                var msg = "";
                for (let obj of arguments) {
                    msg = msg + obj + ", ";
                }

                $("#es_debug").val($("#es_debug").val() + "\n" + msg + "\n\n").animate({
                    scrollTop: 10000000
                });
            }
        }
    };
})(jQuery);
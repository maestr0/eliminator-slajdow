/*
 *   Eliminator Slajdów
 *
 *   Autor: Paweł Raszewski
 *
 *   https://github.com/maestr0/eliminator-slajdow
 *   Licencja: GPLv3
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
            customPages: {},
            preIncludeCallback: function () {
            },
            trackingCallback: function (category, action) {
            }
        },
        pageOptions: {
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
        pages: [
            {
                trigger: "body#oficjalna_strona_eliminatora_slajdow",
                name: "OFICJALNA STRONA ELIMINATORA SLAJDÓW",
                regressionUrls: ["http://eliminator-slajdow.raszewski.info/"],
                pageType: "0",
                navigationNextULRSelector: "",
                hasSlideNumbers: false,
                beforeAllCallback: function () {
                    $("#issue_es_version").val(this.options.version);

                }
            },
            {
                trigger: "body#pagetype_photo",
                triggerStopper: "body#pagetype_photo.simpleGallery #gazeta_gallery_popup .gs_navigation .gs_next, .photostoryNavigation .photostoryNextPage",
                name: "galeria #pagetype_photo (1)",
                regressionUrls: ["http://deser.pl/deser/51,111858,15435006.html?i=1",
                    "http://wyborcza.pl/51,75248,12537285.html?i%3a0&piano_t=1",
                    "http://www.sport.pl/pilka/56,136438,16075836,MS_2014__Thomas_Donohoe_dostal_pomnik__Czy_to_on_przywiozl.html",
                    "http://wiadomosci.gazeta.pl/wiadomosci/51,114871,16254019.html"],
                sectionToBeEmptySelector: "#gazeta_article_miniatures",
                sectionToBeRemovedSelector: "#gazeta_article_top .navigation, #gazeta_article .navigation, #gazeta_article_image .overlayBright",
                pageType: "1",
                customStyle: {
                    "#col_left": "width:auto", "#columns_wrap": "background:none",
                    ".path_duzy_kadr .imageContainerEliminatorSlajdow p.headerLogo, .path_duzy_kadr .slideTitle": "color: white"
                },
                preIncludeCallback: function () {
                    $("#col_left").width($("#gazeta_article_image").find("div a img").width());
                }
            },
            {
                trigger: "body#pagetype_art_blog",
                name: "galeria #pagetype_art_blog (2)",
                regressionUrls: ["http://www.plotek.pl/plotek/56,78649,13096942,Kaja_Paschalska,,1.html",
                    "http://www.plotek.pl/plotek/56,79592,12829011,Jako_dzieci_byli_gwiazdami_seriali__Co_dzis_robia.html",
                    "http://wiadomosci.gazeta.pl/wiadomosci/5,114944,14025881,Turcja__Tysiace_ludzi_na_ulicach__starcia_z_policja.html?i=17",
                    "http://lublin.gazeta.pl/lublin/56,35640,13282657,I_plug_nie_dawal_rady,,2.html",
                    "http://wyborcza.pl/duzy_kadr/5,97904,17068921,Ukraina__Syria__Chiny____Fotoreporterzy_Reutera_dokumentuja.html"],
                sectionToBeAttached: "#gazeta_article_image img,#gazeta_article_body, div[id*='gazeta_article_image_']:not('#gazeta_article_image_overlay')",
                pageType: "2",
                customStyle: {
                    ".path_duzy_kadr #col_left": "width:auto",
                    ".path_duzy_kadr .imageContainerEliminatorSlajdow p.headerLogo, .path_duzy_kadr .slideTitle": "color: white"
                },
                classesToBeRemoved: ["gazetaVideoPlayer"],
                preIncludeCallback: function () {
                    this._updateGalleryLink();
                }
            },
            {
                trigger: "body#pagetype_art #gazeta_article_tools",
                name: "galeria body#pagetype_art #gazeta_article_image (3)",
                regressionUrls: ["http://gazetapraca.pl/gazetapraca/56,90443,12057502,10_najdziwniejszych_powodow__dla_ktorych_rzucamy_prace.html"],
                sectionToBeAttached: "#gazeta_article_image,#gazeta_article_body, div[id*='gazeta_article_image_']:not('#gazeta_article_image_overlay')",
                sectionToBeRemovedSelector: "#gazeta_article_image div.overlayBright",
                pageType: "3",
                preIncludeCallback: function () {
                    this._updateGalleryLink();
                }
            },
            {
                trigger: "div#art div#container_gal",
                name: "gazetapraca.pl ",
                regressionUrls: [],
                articleBodySelector: "#art",
                navigationPageNumberSelector: ".paging:first",
                sectionToBeEmptySelector: "div#gal_navi_wrp, #gal_navi_wrp",
                navigationNextULRSelector: "#gal_btn_next a:first",
                sectionToBeAttached: "div#container_gal",
                pageType: "4"
            },
            {
                trigger: "div#article div#article_body",
                name: "galeria div#article div#article_body (5)",
                regressionUrls: [""],
                articleBodySelector: "#article_body",
                navigationNextULRSelector: "#gal_btn_next a:first",
                sectionToBeEmptySelector: "#gal_navi_wrp", // div#article ul,
                sectionToBeAttached: "div#container_gal",
                navigationPageNumberSelector: "#gal_navi .paging",
                pageType: "5",
                esTheme: "white"
            },
            {
                trigger: "div#k1 div#k1p div#gal_outer",
                name: "galeria bez typu ('div#k1 div#k1p div#gal_outer') (6)",
                regressionUrls: ["http://wyborcza.pl/51,75248,12537285.html?i:0"],
                articleBodySelector: "div#gal_outer .description",
                navigationNextULRSelector: "li.btn_next a:first",
                sectionToBeEmptySelector: "div#article ul, #gal_navi_wrp, div#gal_miniatures",
                sectionToBeAttached: "div#gal_picture, div.description, p.description",
                navigationPageNumberSelector: "#gal_navi .paging",
                hasSlideNumbers: false,
                pageType: "6"

            },
            {
                trigger: "div.PopupWielkosc div.ZdjecieGaleriaMaxWielkosc",
                name: "autotrader.pl - galeria zdjec samochodu - 2013",
                regressionUrls: [],
                articleBodySelector: "div#Zawartosc div.Detale",
                navigationNextULRSelector: "div:not(.ZjecieZaznaczone).ZdjecieGaleriaMini a",
                sectionToBeEmptySelector: "div.DetaleZdjeciaMiniOdstep, div.GaleriaPopupNastepne, div.FloatRight.PopupReklamaPoPrawej, div.TextAlignCenter.PopupReklamaNaDole",
                sectionToBeAttached: "div.ZdjecieGaleriaMaxWielkosc",
                navigationPageNumberSelector: "div.PasekZjecieOdstep",
                hasSlideNumbers: false,
                classesToBeRemoved: ["ZdjecieGaleriaMaxWielkosc"],
                pageType: "7"
            },
            {
                trigger: " #multiGallery #multiGalleryContent #gallery",
                name: "MultiGallery na ONET.PL",
                regressionUrls: ["http://wiadomosci.onet.pl/swiat/nieznane-zdjecia-z-okresu-i-wojny-swiatowej-ujrzaly-swiatlo-dzienne/5kmg0",
                    "http://wiadomosci.onet.pl/swiat/berlin-podzielony-murem-tak-wygladal-w-okresie-zimnej-wojny/64dph"],
                articleBodySelector: "#multiGallery #multiGalleryContent #galleryText",
                sectionToBeEmptySelector: "*[id='mediaList'], script, .onet-ad, .navBox .navBoxContainer, .imageContainerEliminatorSlajdow .navBoxClose, .ad_adInfo, .ad_adInfoEnd",
                sectionToBeRemovedSelector: ".imageContainerEliminatorSlajdow .navBoxClose, .ad_adInfo, .ad_adInfoEnd, #multiGalleryContent .navBox, .formTools",
                navigationNextULRSelector: ".navBox .navBoxContainer a.nextFixed",
                navigationPageNumberSelector: "",
                sectionToBeAttached: "#multiGalleryContent #galleryText", // sekcja komentarza i obrazek
                headerSectionSelector: "",
                hasSlideNumbers: false,
                customStyle: {"body": "height:auto"},
                pageType: "8",
                triggerStopper: "#multiGallery #multiGalleryContent #gallery .mainMediaImg img.after"
            },
            {
                trigger: "div#page div#pageWrapper div#photo div#photoContainer div.nav a",
                name: "Galeria MediaRegionalne ",
                regressionUrls: ["http://www.wspolczesna.pl/apps/pbcs.dll/gallery?Site=GW&Date=20140209&Category=GALERIA01&ArtNo=209009997&Ref=PH&Params=Itemnr=1"],
                pageType: "9",
                articleBodySelector: "div#photo",
                sectionToBeEmptySelector: "script",
                sectionToBeRemovedSelector: "div#tngallery, p#photoNavigation, .imageContainerEliminatorSlajdow div#photoRelatedArticles, .imageContainerEliminatorSlajdow div#photo p.photoMeta",
                navigationNextULRSelector: "p#photoNavigation a#photoNavigationNext",
                navigationPageNumberSelector: "span#photoNavigationPages",
                sectionToBeAttached: "div#photo",
                headerSectionSelector: "",
                hasSlideNumbers: true
            },
            {
                trigger: "div#page div#pageWrapper div#article.photostory p.photoNavigation a.photoNavigationNext",
                name: "Galeria MediaRegionalne - artykul",
                regressionUrls: [],
                pageType: "10",
                articleBodySelector: "div#article",
                sectionToBeEmptySelector: "script",
                sectionToBeRemovedSelector: "p.photoNavigation, div#photoContainer div.nav, div#photoElement div.nav, h2",
                navigationNextULRSelector: "p.photoNavigation a.photoNavigationNext",
                navigationPageNumberSelector: "span.photoNavigationPages:first",
                sectionToBeAttached: "div#article div.intextAd",
                headerSectionSelector: "",
                hasSlideNumbers: true
            },
            {
                trigger: "div#main-column div#photo.common-box div.inner div.photo-item div.photoElem a.next",
                name: "Galeria MojeMiasto",
                regressionUrls: ["http://www.mmbydgoszcz.pl/photo/1886182/Photo+Walk+Koronowo+2013"],
                pageType: "11",
                articleBodySelector: "div#photo div.photo-item",
                sectionToBeEmptySelector: "script",
                sectionToBeRemovedSelector: "div.photoElem a, .top-slider",
                navigationNextULRSelector: "div#main-column div#photo.common-box div.inner div.photo-item div.photoElem a.next",
                navigationPageNumberSelector: "div#photo.common-box div.top-slider div.slider",
                sectionToBeAttached: "div.photo-item",
                headerSectionSelector: "",
                hasSlideNumbers: true

            },
            {
                trigger: "#content_wrap .photostoryNavigation .photostoryNextPage",
                triggerStopper: "body#pagetype_index .mod_suwakiRwd",
                name: "galeria #pagetype_art .photostoryNextPage NOWA GALERIA GAZETY (12)",
                regressionUrls: ["http://technologie.gazeta.pl/internet/56,104530,14940595,Panel_sterowania__gdzie_ja_do_diaska_jestem,,1.html",
                    "http://wiadomosci.gazeta.pl/wiadomosci/51,114881,16712264.html",
                    "http://www.swiatmotocykli.pl/Motocykle/0,144835,18586700.html"],
                sectionToBeAttached: "#content_wrap",
                articleBodySelector: "#columns_wrap",
                sectionToBeEmptySelector: "script:not([src])",
                sectionToBeRemovedSelector: "#holder_404.holder_bottom, .relatedHolder, .photostoryNavigation, #gazeta_article_miniatures, #banP1, #banP2, #banP3, #banP4,#banP62,  .photostoryNextPage, .photostoryPrevPage, #gazeta_article_image div.overlayBright, #gazeta_article .nextSlideWrapper, .galleryNavigation",
                sectionToBeRemovedFromAttachedSlidesSelector: "#photo_comments, #article_comments, #col_right",
                navigationNextULRSelector: "div#content .photostoryNavigation .photostoryNextPage",
                navigationPageNumberSelector: "#gazeta_article_top .countPage",
                headerSectionSelector: "",
                hasSlideNumbers: true,
                pageType: "12",
                customStyle: {"#article_comments": "float:left"},
                preIncludeCallback: function () {
                    this._updateGalleryLink();
                },
                beforeAllCallback: function () {
                    $("#columns_wrap").after($("#article_comments"));
                    let that = this;
                    setInterval(function () {
                        $(that.pageOptions.sectionToBeRemovedSelector).hide();
                    }, 500);
                },
                afterAllCallback: function () {
                }
            },
            {
                trigger: "div#page div#pageWrapper div#photo p#photoNavigation a#photoNavigationNext",
                name: "MediaRegionalne 1",
                regressionUrls: ["http://www.wspolczesna.pl/apps/pbcs.dll/gallery?Site=GW&Date=20140131&Category=GALERIA01&ArtNo=131009996&Ref=PH",
                    "http://www.gazetalubuska.pl/apps/pbcs.dll/gallery?Site=GL&Date=20140201&Category=galeria&ArtNo=201009994&Ref=PH&Params=Itemnr=1"],
                pageType: "13",
                articleBodySelector: "div#photo",
                sectionToBeEmptySelector: "script",
                sectionToBeRemovedSelector: "#tngallery, #photoRelatedArticles, #photoNavigation, #photoElement div.nav",
                navigationNextULRSelector: "p#photoNavigation a#photoNavigationNext",
                navigationPageNumberSelector: "span#photoNavigationPages",
                sectionToBeAttached: "div#photo img, div#photo p:nth-child(7)", // sekcja komentarza i obrazek
                headerSectionSelector: "",
                hasSlideNumbers: true

            },
            {
                trigger: "div#wrapper > div > div#photo p#galleryNav a#galleryNavNext",
                name: "MediaRegionalne 2",
                regressionUrls: ["http://www.nowiny24.pl/apps/pbcs.dll/gallery?Site=NW&Date=20140126&Category=IMPREZY07&ArtNo=126009999&Ref=PH&Params=Itemnr=1"],
                pageType: "14",
                articleBodySelector: "div#photo",
                sectionToBeEmptySelector: "script",
                sectionToBeRemovedSelector: "#galleryNav, #tngalleryScroll",
                navigationNextULRSelector: "p#galleryNav a#galleryNavNext",
                navigationPageNumberSelector: "p#galleryNav",
                sectionToBeAttached: "div#photo img, #photo p:first", // sekcja komentarza i obrazek
                headerSectionSelector: "",
                hasSlideNumbers: true

            },
            {
                trigger: "div#LeftContent div#MainGallery img#PhotoInMainGallery",
                name: "Autotrader Legacy",
                regressionUrls: [],
                articleBodySelector: "div#MainGallery",
                navigationNextULRSelector: "div:not(.ZjecieZaznaczone).ZdjecieGaleriaMini a",
                sectionToBeEmptySelector: "div.DetaleZdjeciaMiniOdstep, div.GaleriaPopupNastepne, div.FloatRight.PopupReklamaPoPrawej, div.TextAlignCenter.PopupReklamaNaDole",
                sectionToBeAttached: "div.ZdjecieGaleriaMaxWielkosc",
                navigationPageNumberSelector: "div.PasekZjecieOdstep",
                hasSlideNumbers: false,
                classesToBeRemoved: ["ZdjecieGaleriaMaxWielkosc"],
                pageType: "15"
            },
            {
                trigger: "div#bxGaleria div.podpisDuzaFotka div.przewijakZdjec div.slider",
                name: "Wiadomosci Wp.pl",
                regressionUrls: ["http://wiadomosci.wp.pl/gid,16390562,gpage,4,img,16391154,kat,1356,title,Igrzyska-w-Soczi-i-nie-tylko,galeria.html"],
                articleBodySelector: "div#bxGaleria",
                navigationNextULRSelector: "div#bxGaleriaOpis a.stgGaleriaNext",
                sectionToBeEmptySelector: "div.podpisDuzaFotka",
                sectionToBeAttached: "div.bxGaleria div.kol2",
                sectionToBeRemovedSelector: "#bxGaleriaOpis .stro, .przewijakGalerii, div.duzaFotka > a",
                navigationPageNumberSelector: "div#bxGaleriaOpis span.status",
                sectionToBeRemovedFromAttachedSlidesSelector: "script",
                hasSlideNumbers: true,
                customStyle: {"*[id='bxGaleriaOpis']": "margin-top:0 !important"},
                pageType: "16"

            },
            {
                trigger: "div#stgGaleria div.stgGaleriaCnt .stgGaleriaNext",
                name: "Facet wp.pl",
                articleBodySelector: "div.bxArt",
                navigationNextULRSelector: "div#stgGaleria a.stgGaleriaNext",
                sectionToBeEmptySelector: "",
                sectionToBeAttached: "#stgGaleria",
                sectionToBeRemovedSelector: ".stgGaleriaCnt > a",
                navigationPageNumberSelector: ".bxArt .strGallery.pageInfo > span",
                sectionToBeRemovedFromAttachedSlidesSelector: "script",
                hasSlideNumbers: true,
                regressionUrls: ["http://facet.wp.pl/gid,16327903,kat,1007873,page,7,galeriazdjecie.html"],
                pageType: "17"

            },
            {
                trigger: "div#stgMain article.stampGaleria div.stampBxNaglowek div.stampStronicowanie div.pIndex a.pNext",
                name: "Finanse wp.pl",
                articleBodySelector: "#stgMain article.stampGaleria",
                navigationNextULRSelector: "div.stampStronicowanie div.pIndex a.pNext",
                sectionToBeEmptySelector: "",
                sectionToBeAttached: "article.stampGaleria div.articleRow",
                sectionToBeRemovedSelector: ".stampGlowneFoto .stampGlowneFotoMain > a, div.stampStronicowanie div.pIndex",
                navigationPageNumberSelector: ".stampStronicowanie:first .pIndex span",
                sectionToBeRemovedFromAttachedSlidesSelector: "script, .stampBxStopka",
                customStyle: {".stampGlowneFoto": "overflow: visible"},
                hasSlideNumbers: true,
                pageType: "18",
                regressionUrls: ["http://finanse.wp.pl/gid,16374104,title,Oto-najwieksze-stolice-hazardu,galeria.html",
                    "http://finanse.wp.pl/gid,16350579,kat,1033695,title,Polska-wsrod-najatrakcyjniejszych-rynkow-Europy,galeria.html",
                    "http://kobieta.wp.pl/gid,16425464,img,16425465,kat,26405,title,Obledna-kreacja-Jennifer-Lopez,galeriazdjecie.html?ticaid=1124c8"],
                preIncludeCallback: function () {
                },
                afterAllCallback: function () {
                    $("#stgCol660").removeAttr('style');
                }
            },
            {
                trigger: "div#content div#largepic_wrapper div#largepic",
                name: "kwejk.pl",
                articleBodySelector: "div#content div.content",
                navigationNextULRSelector: "div#largepic_wrapper a.next_image",
                sectionToBeEmptySelector: "",
                sectionToBeAttached: "div#content div.content",
                sectionToBeRemovedSelector: ".image_carousel, div#largepic_wrapper > a, div.media",
                navigationPageNumberSelector: "",
                sectionToBeRemovedFromAttachedSlidesSelector: ".image_carousel, script, style, div.share",
                customStyle: {},
                hasSlideNumbers: false,
                pageType: "19",
                regressionUrls: ["http://kwejk.pl/article/2054448/20/caa",
                    "http://kwejk.pl/article/2054452/0/co-mozna-zmiescic-w-c-5-galaxy.html#gallerypic",
                    "http://kwejk.pl/article/2077996/0/najbardziej-denerwujace-teksty-rodzicow.html#gallerypic"],
                preIncludeCallback: function () {
                }
            },
            {
                trigger: "body#strona-artykulu div#glowna-kolumna div#galeria-material-zdjecie",
                name: "gazetawroclawska.pl",
                articleBodySelector: "#galeria-material",
                navigationNextULRSelector: "#galeria-nastepne-2",
                sectionToBeEmptySelector: "#miniatury-kontener, #galeria-poprzednie-2, #galeria-nastepne-2, .iloscZdjec",
                sectionToBeAttached: "#galeria-material",
                sectionToBeRemovedSelector: "#miniatury-kontener",
                navigationPageNumberSelector: ".iloscZdjec",
                sectionToBeRemovedFromAttachedSlidesSelector: "script, #miniatury-kontener, #galeria-poprzednie-2, #galeria-nastepne-2, .iloscZdjec",
                customStyle: {},
                hasSlideNumbers: true,
                pageType: "20",
                regressionUrls: ["http://www.gazetawroclawska.pl/artykul/3424383,ruszyl-remont-minskiej-od-rana-utrudnienia-i-gigantyczne-korki-na-muchoborze-zdjecia,1,4,id,t,sm,sg.html#galeria-material",
                    "http://www.gloswielkopolski.pl/artykul/3431295,oceniamy-pilkarzy-po-meczu-lech-poznan-gornik-zabrze-sprawdz,id,t.html"],
                preIncludeCallback: function () {
                    $(".lazy.powiekszenie").attr("src", $(".lazy.powiekszenie").attr("data-original")).removeClass("lazy");
                }
            },
            {
                trigger: "div#main_container div.demotivator.pic #royalSliderExtraNavigation a.navigate_right",
                name: "demotywatory.pl",
                articleBodySelector: "#main_container .demotivator .demot_pic",
                navigationNextULRSelector: "#royalSliderExtraNavigation a.navigate_right",
                sectionToBeEmptySelector: "",
                sectionToBeAttached: ".demotivator .demot_pic .rsSlideContent",
                sectionToBeRemovedSelector: "#royalSliderExtraNavigation, .share-widgets, .demot_info_stats, .fakeRsArrow, #pics_gallery_slider, .demot_pic",
                navigationPageNumberSelector: "",
                sectionToBeRemovedFromAttachedSlidesSelector: "script, .share-widgets",
                headerSectionSelector: "",
                customStyle: {
                    'rsSlideContent h3': 'display:none',
                    '#main_container article, #main_container .demotivator': 'float:left',
                    '.rsSlideContent .relative': 'text-align: center;margin: 40px;',
                    '.rsSlideContent': 'margin-bottom: 20px;color:white;font-size:16px'
                },
                hasSlideNumbers: false,
                pageType: "21",
                regressionUrls: ["http://fdemotywatory.pl/4339879/Najciekawsze-fakty-o-ktorych-prawdopodobnie-nie-miales-pojecia#obrazek-1",
                    "http://demotywatory.pl/4344639/14-najglupszych-sposobow-na-zerwanie-z-kims"],
                preIncludeCallback: function () {
                    this._createImageContainer();
                    let self = this;
                    $.get(document.location.href, function (dirtyPage) {
                        if (dirtyPage.length > 100) {
                            let sanitizedDOM = $(DOMPurify.sanitize(dirtyPage), {
                                SAFE_FOR_JQUERY: true,
                                WHOLE_DOCUMENT: true,
                                RETURN_DOM: true,
                                FORBID_TAGS: ['script'],
                                SANITIZE_DOM: false
                            });

                            $(sanitizedDOM).find(".rsSlideContent").each(function (index) {
                                /**
                                 * remove <script> tags only
                                 */
                                let slide = $(this);

                                slide.find(".rsTmb").remove();
                                slide.find(".fakeRsArrow").remove();
                                slide = slide.wrap("<div class='slide_" + index + " es_slide'></div>");
                                $(".imageContainerEliminatorSlajdow").append(
                                    self._buildHeader((index + 1), index + 2, document.location.href));
                                $(".imageContainerEliminatorSlajdow").append(slide);
                            });

                            $(self.pageOptions.sectionToBeEmptySelector).empty();
                            $(self.pageOptions.sectionToBeRemovedSelector).remove();
                            self._setCssOverwrite();
                            self._bind();
                        }
                    });
                }
            },
            {
                trigger: "body#Fakt .pageContent .leftColumn .paginaHolder .paginator.panigaGalery",
                name: "fakt.pl",
                articleBodySelector: "body#Fakt .pageContent .leftColumn .Scroll-View-Gallery",
                navigationNextULRSelector: ".pageContent .leftColumn .paginaHolder .paginator.panigaGalery a.next",
                sectionToBeEmptySelector: "",
                sectionToBeAttached: "#bigPicture",
                sectionToBeRemovedSelector: ".pageBigGallery .zoomer, .paginaHolder",
                navigationPageNumberSelector: ".pageBigGallery .zoomer, .paginaHolder:first span",
                sectionToBeRemovedFromAttachedSlidesSelector: "script",
                customStyle: {},
                hasSlideNumbers: true,
                pageType: "22",
                regressionUrls: ["http://www.fakt.pl/aktorki-usmiercone-przez-scenarzystow,galeria,464577,1.html"],
                preIncludeCallback: function () {

                }
            },
            {
                trigger: "body#loneGallery #bigPicture",
                name: "fakt.pl nowa",
                articleBodySelector: "#bigPicture",
                navigationNextULRSelector: "#imgHolder .paginator .next",
                sectionToBeEmptySelector: "",
                sectionToBeAttached: "#bigPicture, .rightColumn",
                sectionToBeRemovedSelector: "#galleryslider, .paginator, .zoomer",
                navigationPageNumberSelector: ".rightColumn .nrFoto",
                sectionToBeRemovedFromAttachedSlidesSelector: "script, .nrFoto, .socialButtons, .Region",
                customStyle: {'.imageContainerEliminatorSlajdow .rightColumn': 'float:left;width:100%'},
                hasSlideNumbers: true,
                pageType: "23",
                regressionUrls: ["http://www.fakt.pl/dlaczego-maz-zostawil-glinke-,artykuly,464472,1,1,1.html"],
                preIncludeCallback: function () {

                }
            },
            {
                trigger: ".glownyKontener #material-artykul .galeriaArtykulowa #material-galeria-nastepne",
                name: "naszemiasto.pl",
                articleBodySelector: ".galeriaArtykulowa",
                navigationNextULRSelector: "#material-galeria-nastepne",
                sectionToBeEmptySelector: "",
                sectionToBeAttached: ".galeriaArtykul",
                sectionToBeRemovedSelector: "#galeria, .paginacja, .lupa, .strzalka, #powrot-miniaturki",
                navigationPageNumberSelector: ".iloscZdjec",
                sectionToBeRemovedFromAttachedSlidesSelector: "script",
                customStyle: {'*[id="galeria-z-opisem"]': 'float:left'},
                hasSlideNumbers: true,
                pageType: "24",
                regressionUrls: [""],
                preIncludeCallback: function () {

                }
            },
            {
                trigger: ".glownyKontener .trescOpisu .paginacja #material-galeria-nastepne",
                name: "naszemiasto.pl szeroka",
                articleBodySelector: "#galeria-z-opisem",
                navigationNextULRSelector: "#material-galeria-nastepne",
                sectionToBeEmptySelector: "",
                sectionToBeAttached: "#galeria-z-opisem",
                sectionToBeRemovedSelector: "#galeria, .paginacja, .lupa, .strzalka, #powrot-miniaturki, #material-galeria-nastepne-czytaj",
                navigationPageNumberSelector: ".iloscZdjec",
                sectionToBeRemovedFromAttachedSlidesSelector: "script",
                customStyle: {},
                hasSlideNumbers: true,
                pageType: "25",
                regressionUrls: [""],
                preIncludeCallback: function () {

                }
            },
            {
                trigger: "div#page article.single-article .gallery .paging .next",
                name: "wawalove.pl",
                articleBodySelector: ".see-big",
                navigationNextULRSelector: "article.single-article .gallery .paging .next",
                sectionToBeEmptySelector: "",
                sectionToBeAttached: ".see-big",
                sectionToBeRemovedSelector: ".paging, .thumbs",
                navigationPageNumberSelector: ".paging-info:first",
                sectionToBeRemovedFromAttachedSlidesSelector: "script",
                customStyle: {},
                hasSlideNumbers: true,
                pageType: "26",
                regressionUrls: ["http://wawalove.pl/Ogolnopolskie-Zawody-Jezdzieckie-w-skokach-przez-przeszkody-g14407/foto_70848#foto",
                    "http://wawalove.pl/Policja-rozbila-tzw-Grupe-Mokotowska-MOCNE-WIDEO-g14398/foto_70824"],
                preIncludeCallback: function () {

                }
            },
            {
                trigger: "div#page div#main div.article-slideshow .article-matter .slideshow-wrapper",
                name: "sfora.pl",
                articleBodySelector: ".slideshow-wrapper",
                navigationNextULRSelector: ".article-matter .slideshow-next:first",
                sectionToBeEmptySelector: "",
                sectionToBeAttached: ".slideshow-controls .slideshow-title, .slideshow-wrapper",
                sectionToBeRemovedSelector: ".slideshow-paging",
                navigationPageNumberSelector: ".slideshow-current:first",
                sectionToBeRemovedFromAttachedSlidesSelector: "script",
                customStyle: {'.imageContainerEliminatorSlajdow': 'margin-top:20px'},
                hasSlideNumbers: true,
                pageType: "28",
                regressionUrls: ["http://www.sfora.pl/swiat/Zamordowal-rodzicow-lomem-Bo-zabrali-mu-iPoda-s68307"],
                preIncludeCallback: function () {

                }
            },
            {
                trigger: "div#page div#main div.article-gallery .article-matter .gallery-content .gallery-img-big",
                name: "sfora.pl nowa",
                articleBodySelector: ".article-matter",
                navigationNextULRSelector: ".gallery-img-big .next:first",
                sectionToBeEmptySelector: "",
                sectionToBeAttached: ".article-matter",
                sectionToBeRemovedSelector: ".prev, .next, .gallery-top",
                navigationPageNumberSelector: "",
                sectionToBeRemovedFromAttachedSlidesSelector: "script",
                customStyle: {'.imageContainerEliminatorSlajdow': 'margin-top:20px'},
                hasSlideNumbers: false,
                pageType: "29",
                regressionUrls: ["http://www.sfora.pl/polska/KorwinMikke-triumfuje-internet-oszalal-Wysyp-memow-g68152-185752",
                    "http://www.sfora.pl/swiat/Historia-bomby-atomowej-Wyciekly-tajne-fotografie-g67943"],
                preIncludeCallback: function () {

                }
            },
            {
                trigger: ".page .main-content .article--gallery .gallery .gallery__content .gallery__image-wrapper .next-btn",
                name: "biztok.pl",
                articleBodySelector: ".gallery__content",
                navigationNextULRSelector: ".gallery__image-wrapper .next-btn",
                sectionToBeEmptySelector: "",
                sectionToBeAttached: ".gallery__content",
                sectionToBeRemovedSelector: ".next-btn, .prev-btn, .gallery__header",
                navigationPageNumberSelector: ".gallery__header .gallery-nr",
                sectionToBeRemovedFromAttachedSlidesSelector: "script, .social-box",
                customStyle: {'.imageContainerEliminatorSlajdow': 'margin-top:20px'},
                hasSlideNumbers: true,
                pageType: "30",
                regressionUrls: ["http://www.biztok.pl/tech/cocacola-zainwestowala-pod-warszawa-zobacz_g16382"],
                preIncludeCallback: function () {

                }
            },
            {
                trigger: "#ks_doc #ks_bd_left_col #ks_simple_pagging",
                name: "komputerswiat.pl",
                articleBodySelector: "#ks_bd_cols",
                navigationNextULRSelector: "#gallery_image a.next",
                sectionToBeAttached: "#ks_bd_cols",
                sectionToBeRemovedSelector: "#ks_simple_pagging, #ks_bd_right_col div.next, #gallery_image .next",
                navigationPageNumberSelector: "#ks_simple_pagging .numbers",
                sectionToBeRemovedFromAttachedSlidesSelector: "#comments, script, .Nextclick_Widget_Container, #comment_form, #ks_bd_right_col div.next, #gallery_image .next, #gallery_image .prev",
                customStyle: {
                    '#gallery #ks_bd': 'float:left',
                    '.imageContainerEliminatorSlajdow': 'margin-top:20px',
                    ".comments": "width:720px"
                },
                hasSlideNumbers: true,
                pageType: "31",
                regressionUrls: ["http://www.komputerswiat.pl/artykuly/redakcyjne/2014/05/komputery-apple-jakich-nie-widzieliscie-niezwykle-prototypy-z-lat-80.aspx"],
                preIncludeCallback: function () {
                    $("#ks_bd_left_col .Nextclick_Widget_Container, #ks_bd_left_col #comment_form, #ks_bd_left_col #comments").insertAfter(".imageContainerEliminatorSlajdow");
                }
            },
            {
                trigger: "body#screening #mainContainer #gallery .gallery_body .gallery_photo_desc_right",
                name: "dziennik.pl",
                articleBodySelector: ".gallery_body",
                navigationNextULRSelector: ".gallery_photo_desc_right .nastepne:first",
                sectionToBeEmptySelector: "",
                sectionToBeAttached: ".gallery_body",
                sectionToBeRemovedSelector: ".belka-spol, .cl_right, .gallery_list_photos_header, .gallery_photo_desc_right, .gallery_list_photos, .art_data_tags, .belka-spol-bottom",
                navigationPageNumberSelector: ".gallery_photo_desc_right p:first",
                sectionToBeRemovedFromAttachedSlidesSelector: "script",
                customStyle: {},
                hasSlideNumbers: true,
                pageType: "32",
                regressionUrls: ["http://auto.dziennik.pl/aktualnosci/galeria/460807,1,samochod-obamy-limuzyna-prezydenta-usa-zdjecia-galeria-zdjec.html"],
                preIncludeCallback: function () {

                }
            },
            {
                trigger: "#miejsce2 .galeriaBig.forsalOnly .photoBg .next",
                name: "forsal.pl",
                articleBodySelector: ".tpl_sgp_galeria_artykulowa",
                navigationNextULRSelector: ".galeriaBig.forsalOnly .photoBg .next",
                sectionToBeAttached: ".tpl_sgp_galeria_artykulowa",
                sectionToBeRemovedSelector: ".photoBg .hoverPhoto, .photoBg .next, .photoBg .prev, .nextPrev ul",
                navigationPageNumberSelector: ".nextPrev",
                sectionToBeRemovedFromAttachedSlidesSelector: "script, .dateArt, .leadArt, .lead, .galeriaBig.forsalOnly > h2",
                customStyle: {'.imageContainerEliminatorSlajdow': 'margin-top:20px'},
                hasSlideNumbers: true,
                pageType: "33",
                regressionUrls: [],
                preIncludeCallback: function () {

                }
            },
            {
                /* css selektor ktory uaktywnia eliminacje slajdow na danej stronie*/
                trigger: "#pagewrap article.imgGalleryArt #ARTICLE_GALLERY_BOTTOM_1",
                /* index */
                pageType: "34",
                /* nazwa galerii */
                name: "przegladsportowy.pl",
                /* ZA tym elementem bedzie dolaczony DIV ze slajdami */
                articleBodySelector: "#pagewrap .rightColumn",
                /* elementy ktora zostana dolaczone jako slajd*/
                sectionToBeAttached: ".leftColumn, .rightColumn",
                /* selektor do jednego elementu z linkiem do nastepnego slajdu*/
                navigationNextULRSelector: ".paginator a.next:first",
                /* false gdy nie ma skad wziac numeracji */
                hasSlideNumbers: false,
                navigationPageNumberSelector: "",
                /* elementy do usuniecia z calej strony */
                sectionToBeRemovedSelector: ".paginator",
                /* elementy do usuniecia TYLKO z dolaczanych slajdow*/
                sectionToBeRemovedFromAttachedSlidesSelector: "script, #ARTICLE_GALLERY_RIGHT_COLUMN_1, #ARTICLE_GALLERY_BOTTOM_1, .socialButtons",
                /* dowolne style css w postaci mapy */
                customStyle: {".sharebx, .Comments": "float:left"},
                /* naglowek slajdu */
                headerSectionSelector: "",
                /* $.empty() na elemencie*/
                sectionToBeEmptySelector: "",
                /* callback uruchamiany przed dolaczeniem kazdgo slajdu do strony */
                preIncludeCallback: function () {
                    $(".leftColumn #ARTICLE_GALLERY_BOTTOM_1").insertAfter(".imageContainerEliminatorSlajdow");
                },
                classesToBeRemoved: [],
                regressionUrls: ["http://junior.przegladsportowy.pl/akademia-pilkarska-zaglebia-lubin-tak-trenuja-mlode-talenty,galeria,1,472568,12565.html"]
            },
            {
                /* css selektor ktory uaktywnia eliminacje slajdow na danej stronie*/
                trigger: ".site .columns.columns-outer-double .box-gallery .gallery-image .gallery-controlls .gallery-image-zoom",
                /* index */
                pageType: "35",
                /* nazwa galerii */
                name: "sportowefakty.pl",
                /* ZA tym elementem bedzie dolaczony DIV ze slajdami */
                articleBodySelector: "#photo-start",
                /* elementy ktora zostana dolaczone jako slajd*/
                sectionToBeAttached: "#photo-start",
                /* selektor do jednego elementu z linkiem do nastepnego slajdu*/
                navigationNextULRSelector: ".gallery-image-next:first",
                /* false gdy nie ma skad wziac numeracji */
                hasSlideNumbers: true,
                navigationPageNumberSelector: ".gallery-navigation:first",
                /* elementy do usuniecia z calej strony */
                sectionToBeRemovedSelector: ".gallery-navigation, .gallery-controlls",
                /* elementy do usuniecia TYLKO z dolaczanych slajdow*/
                sectionToBeRemovedFromAttachedSlidesSelector: "script",
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
                regressionUrls: ["http://www.sportowefakty.pl/pilka-reczna/zdjecia/galeria/5411/polska-niemcy-2524/3-232928#photo-start"]
            },
            {
                /* css selektor ktory uaktywnia eliminacje slajdow na danej stronie*/
                trigger: "#page_wrap #page #content #content-inner .box-inner .img-cnt-wrap .news-content",
                /* index */
                pageType: "36",
                /* nazwa galerii */
                name: "bebzol.com",
                /* ZA tym elementem bedzie dolaczony DIV ze slajdami */
                articleBodySelector: ".img-cnt-wrap",
                /* elementy ktora zostana dolaczone jako slajd*/
                sectionToBeAttached: ".img-cnt-wrap",
                /* selektor do jednego elementu z linkiem do nastepnego slajdu*/
                navigationNextULRSelector: "#handle-next:not(.next-gal):first",
                /* false gdy nie ma skad wziac numeracji */
                hasSlideNumbers: false,
                navigationPageNumberSelector: "",
                /* elementy do usuniecia z calej strony */
                sectionToBeRemovedSelector: ".handle:not(.next-gal), .categ-list-cnt, .pluginConnectButton",
                /* elementy do usuniecia TYLKO z dolaczanych slajdow*/
                sectionToBeRemovedFromAttachedSlidesSelector: "script, .like-bar, .bbz-cm-box",
                /* dowolne style css w postaci mapy */
                customStyle: {
                    '.imageContainerEliminatorSlajdow': 'margin-top:20px',
                    '.like-bar': 'float:left;width:100%'
                },
                /* naglowek slajdu */
                headerSectionSelector: "",
                /* $.empty() na elemencie*/
                sectionToBeEmptySelector: "",
                /* callback uruchamiany przed dolaczeniem kazdgo slajdu do strony */
                preIncludeCallback: function () {
                    $("html").addClass("eliminatorSlajdow");
                },
                classesToBeRemoved: [],
                regressionUrls: ["http://bebzol.com/pl/koty-szykuja-sie-na-wojne.150870.html",
                    "http://bebzol.com/pl/20-trudnosci-z-ktorymi-musza-zmagac-sie-wlasciciele-kotow.151053.html"]
            },
            {
                /* css selektor ktory uaktywnia eliminacje slajdow na danej stronie*/
                trigger: "#main .container #left_column #article .article-photo .photo-next-link",
                /* index */
                pageType: "37",
                /* nazwa galerii */
                name: "lovekrakow.pl",
                /* ZA tym elementem bedzie dolaczony DIV ze slajdami */
                articleBodySelector: "#main .container .row:first",
                /* elementy ktora zostana dolaczone jako slajd*/
                sectionToBeAttached: "#left_column, #right_column",
                /* selektor do jednego elementu z linkiem do nastepnego slajdu*/
                navigationNextULRSelector: ".article-photo .photo-next-link:first",
                /* false gdy nie ma skad wziac numeracji */
                hasSlideNumbers: true,
                navigationPageNumberSelector: ".article-photo-pagination",
                /* elementy do usuniecia z calej strony */
                sectionToBeRemovedSelector: ".thumbnails, .photo-pagination, .col-md-12, .photo-next-link, .photo-prev-link, .article-photo-pagination",
                /* elementy do usuniecia TYLKO z dolaczanych slajdow*/
                sectionToBeRemovedFromAttachedSlidesSelector: "script, .comments, h1.title",
                /* dowolne style css w postaci mapy */
                customStyle: {},
                /* naglowek slajdu */
                headerSectionSelector: "",
                /* $.empty() na elemencie*/
                sectionToBeEmptySelector: "",
                /* callback uruchamiany przed dolaczeniem kazdgo slajdu do strony */
                preIncludeCallback: function () {
                    $("#left_column .comments").insertAfter(".imageContainerEliminatorSlajdow");
                },
                classesToBeRemoved: [],
                regressionUrls: ["http://lovekrakow.pl/galerie/zdjecie/id/27808"]
            },
            {
                /* css selektor ktory uaktywnia eliminacje slajdow na danej stronie*/
                trigger: "div#doc #body #trunk #main .k_galleryLarge .k_pagination",
                /* index */
                pageType: "38",
                /* nazwa galerii */
                name: "biznes.pl",
                /* ZA tym elementem bedzie dolaczony DIV ze slajdami */
                articleBodySelector: "#main .k_gallery",
                /* elementy ktora zostana dolaczone jako slajd*/
                sectionToBeAttached: ".k_gallery",
                /* selektor do jednego elementu z linkiem do nastepnego slajdu*/
                navigationNextULRSelector: ".k_pagination .k_next a:first",
                /* false gdy nie ma skad wziac numeracji */
                hasSlideNumbers: true,
                navigationPageNumberSelector: ".k_pagination .thisFoto:first",
                /* elementy do usuniecia z calej strony */
                sectionToBeRemovedSelector: ".k_pagination",
                /* elementy do usuniecia TYLKO z dolaczanych slajdow*/
                sectionToBeRemovedFromAttachedSlidesSelector: "script",
                /* dowolne style css w postaci mapy */
                customStyle: {},
                /* naglowek slajdu */
                headerSectionSelector: "",
                /* $.empty() na elemencie*/
                sectionToBeEmptySelector: "",
                /* callback uruchamiany przed dolaczeniem kazdgo slajdu do strony */
                preIncludeCallback: function () {
                    $("body").append($("<img>", {"src": this.nextPageURL, "style": "display:none"}));
                },
                classesToBeRemoved: [],
                regressionUrls: ["http://biznes.pl/wiadomosci/raporty/wzrost-pkb-w-latach-2008-2013,5610529,1,5610147,535,foto-detal.html",
                    "http://biznes.pl/wiadomosci/kraj/jan-vincent-rostowski-gosciem-specjalnym-biznespl,5610578,0,foto-detal.html#photo16264113"]
            },
            {
                /* css selektor ktory uaktywnia eliminacje slajdow na danej stronie*/
                trigger: "#gallery > div.content > div.flesh > div.main_img > div.big_img > div.fullscreen > div > img", //"div.wrapper div.site div.left_column div.article div.gallery_buttons div.next_btt a.next",
                /* index */
                pageType: "39",
                /* nazwa galerii */
                name: "urzadzamy.pl i se.pl",
                /* ZA tym elementem bedzie dolaczony DIV ze slajdami */
                articleBodySelector: ".flesh",
                /* elementy ktora zostana dolaczone jako slajd*/
                sectionToBeAttached: ".flesh",
                /* selektor do jednego elementu z linkiem do nastepnego slajdu*/
                navigationNextULRSelector: "div.content > div.main_nav > div.go.next > a",
                /* false gdy nie ma skad wziac numeracji */
                hasSlideNumbers: true,
                navigationPageNumberSelector: ".info .nr span",
                /* elementy do usuniecia z calej strony */
                sectionToBeRemovedSelector: ".mini_img, .main_nav",
                /* elementy do usuniecia TYLKO z dolaczanych slajdow*/
                sectionToBeRemovedFromAttachedSlidesSelector: "script",
                /* $.empty() na elemencie*/
                sectionToBeEmptySelector: "",
                /* dowolne style css w postaci mapy */
                customStyle: {},
                preIncludeCallback: function () {
                    $(".gallery_buttons a.prev").attr("href", $(".gallery_buttons a.next").attr("href"));

                    $(this.articleSection).find(".fullscreen").attr("onclick", "window.location.href='" + this.currentUrl + "?full=1'");
                },
                regressionUrls: ["http://www.se.pl/multimedia/galeria/156418/378369/kurski/",
                    "http://www.urzadzamy.pl/galeria/uzytkownik/2378/azienka-modern/"]
            },
            {
                /* css selektor ktory uaktywnia eliminacje slajdow na danej stronie*/
                trigger: "div.all div#page #item > div.item-content > a.arrow-next-big",
                /* index */
                pageType: "40",
                /* nazwa galerii */
                name: "pudelekx.pl",
                /* ZA tym elementem bedzie dolaczony DIV ze slajdami */
                articleBodySelector: "#item .item-content",
                /* elementy ktora zostana dolaczone jako slajd*/
                sectionToBeAttached: "#item",
                /* selektor do jednego elementu z linkiem do nastepnego slajdu*/
                navigationNextULRSelector: "div.item-content > a.arrow-next-big",
                /* false gdy nie ma skad wziac numeracji */
                hasSlideNumbers: false,
                navigationPageNumberSelector: "",
                /* elementy do usuniecia z calej strony */
                sectionToBeRemovedSelector: ".thumbs, .item-header .btn2, .arrow-next-big, .arrow-prev-big, .item-header, div.sidebar",
                /* elementy do usuniecia TYLKO z dolaczanych slajdow*/
                sectionToBeRemovedFromAttachedSlidesSelector: "script, .tags, .item-options, .left",
                /* $.empty() na elemencie*/
                sectionToBeEmptySelector: "",
                /* dowolne style css w postaci mapy */
                customStyle: {},
                preIncludeCallback: function () {
                },
                regressionUrls: ["http://pudelekx.pl/ten-pies-wygladal-jak-wor-na-smieci-27389-g2"]
            },
            {
                /* css selektor ktory uaktywnia eliminacje slajdow na danej stronie*/
                trigger: "#wrap #article article.single-entry #photo-gallery .inner a.next",
                /* index */
                pageType: "41",
                /* nazwa galerii */
                name: "snobka.pl",
                /* ZA tym elementem bedzie dolaczony DIV ze slajdami */
                articleBodySelector: "#photo-gallery",
                /* elementy ktora zostana dolaczone jako slajd*/
                sectionToBeAttached: "#photo-gallery",
                /* selektor do jednego elementu z linkiem do nastepnego slajdu*/
                navigationNextULRSelector: ".inner a:first.next",
                /* false gdy nie ma skad wziac numeracji */
                hasSlideNumbers: false,
                navigationPageNumberSelector: "",
                /* elementy do usuniecia z calej strony */
                sectionToBeRemovedSelector: "div.thumbs, .inner .next, .inner .prev",
                /* elementy do usuniecia TYLKO z dolaczanych slajdow*/
                sectionToBeRemovedFromAttachedSlidesSelector: "script",
                /* $.empty() na elemencie*/
                sectionToBeEmptySelector: "",
                /* dowolne style css w postaci mapy */
                customStyle: {"section.comments": "float:left"},
                preIncludeCallback: function () {
                },
                regressionUrls: ["http://www.snobka.pl/artykul/krok-po-kroku-polyskujacy-makijaz-w-stylu-magdaleny-mielcarz-19554",
                    "http://www.snobka.pl/artykul/emily-ratajkowski-znowu-sie-rozbiera-19646/1/4#photo-gallery"]
            },
            {
                /* css selektor ktory uaktywnia eliminacje slajdow na danej stronie*/
                trigger: "body#pagetype_photo.simpleGallery #gazeta_gallery_popup .gs_navigation .gs_next",
                /* index */
                pageType: "42",
                /* nazwa galerii */
                name: "gazeta pl nowa galeria czarna",
                /* ZA tym elementem bedzie dolaczony DIV ze slajdami */
                articleBodySelector: "#gazeta_gallery_popup .gs_image_cointainer",
                /* elementy ktora zostana dolaczone jako slajd*/
                sectionToBeAttached: ".gs_image_cointainer",
                /* selektor do jednego elementu z linkiem do nastepnego slajdu*/
                navigationNextULRSelector: ".gs_navigation .gs_next:first",
                /* false gdy nie ma skad wziac numeracji */
                hasSlideNumbers: true,
                navigationPageNumberSelector: ".gs_stats .gs_count",
                /* elementy do usuniecia z calej strony */
                sectionToBeRemovedSelector: ".gs_navigation",
                /* elementy do usuniecia TYLKO z dolaczanych slajdow*/
                sectionToBeRemovedFromAttachedSlidesSelector: "script",
                /* $.empty() na elemencie*/
                sectionToBeEmptySelector: "",
                /* dowolne style css w postaci mapy */
                customStyle: {
                    "body": "overflow: auto",
                    ".gs_image_cointainer img": "position:relative;max-height:inherit;min-height:inherit",
                    "#gazeta_gallery_popup": "position:absolute",
                    "#page22": "height:0",
                    ".headerLogo, .icon-facebook-squared": "color:white",
                    "#gazeta_gallery_popup .gs_image_cointainer": "height:auto"
                },
                preIncludeCallback: function () {
                },
                beforeAllCallback: function () {
                    $('<style type="text/css">.simpleGallery #gazeta_gallery_popup.first_slide {display: none;} \n' +
                        '.simpleGallery #gazeta_gallery_popup.show_slider_image {display: block;}\n' +
                        'body {overflow: visible !important}</style>').appendTo($('head'));
                },
                regressionUrls: ["http://wiadomosci.gazeta.pl/wiadomosci/5,139575,16388712.html?i=0"]
            },
            {
                /* css selektor ktory uaktywnia eliminacje slajdow na danej stronie*/
                trigger: "div.wrap div.main div.article__content div.gallery div.gallery__image-big a.next",
                /* index */
                pageType: "43",
                /* nazwa galerii */
                name: "http://www.fly4free.pl/",
                /* ZA tym elementem bedzie dolaczony DIV ze slajdami */
                articleBodySelector: "div.gallery",
                /* elementy ktora zostana dolaczone jako slajd*/
                sectionToBeAttached: "div.gallery",
                /* selektor do jednego elementu z linkiem do nastepnego slajdu*/
                navigationNextULRSelector: "div.gallery__image-big a.next",
                /* false gdy nie ma skad wziac numeracji */
                hasSlideNumbers: true,
                navigationPageNumberSelector: ".gallery__nav:first",
                /* elementy do usuniecia z calej strony */
                sectionToBeRemovedSelector: ".gallery__nav, .gallery__image-big .next, .gallery__image-big .prev",
                /* elementy do usuniecia TYLKO z dolaczanych slajdow*/
                sectionToBeRemovedFromAttachedSlidesSelector: "script",
                /* $.empty() na elemencie*/
                sectionToBeEmptySelector: "",
                /* dowolne style css w postaci mapy */
                customStyle: {},
                preIncludeCallback: function () {
                },
                regressionUrls: ["http://www.fly4free.pl/top10-co-warto-zobaczyc-w-chinach/?pid=3404#galeria",
                    "http://www.fly4free.pl/w-kraju-inkow-czyli-co-warto-zobaczyc-w-peru/"]
            },
            {
                /* css selektor ktory uaktywnia eliminacje slajdow na danej stronie*/
                trigger: "#stgMain .stampFototematRow .stampStronicowanieFototematu .stampStronicowanieFototematuContent .stampStronicowanieFototematuIndex",
                /* index */
                pageType: "44",
                /* nazwa galerii */
                name: "wp.pl galeria pozioma 1",
                /* ZA tym elementem bedzie dolaczony DIV ze slajdami */
                articleBodySelector: "#stgMain .stampFototemat",
                /* elementy ktora zostana dolaczone jako slajd*/
                sectionToBeAttached: ".stampFototemat",
                /* selektor do jednego elementu z linkiem do nastepnego slajdu*/
                navigationNextULRSelector: ".stampStronicowanieFototematuContent a.stampStronicowanieFototematuNxt:first",
                /* false gdy nie ma skad wziac numeracji */
                hasSlideNumbers: true,
                navigationPageNumberSelector: ".stampStronicowanieFototematuIndex:first",
                /* elementy do usuniecia z calej strony */
                sectionToBeRemovedSelector: ".pPaginSmall, .stampStronicowanieFototematu, .stampFototematBigFotoNxt, .stampFototematBigFotoPrv",
                /* elementy do usuniecia TYLKO z dolaczanych slajdow*/
                sectionToBeRemovedFromAttachedSlidesSelector: "script, .pPaginSmall",
                /* $.empty() na elemencie*/
                sectionToBeEmptySelector: "",
                /* dowolne style css w postaci mapy */
                customStyle: {},
                preIncludeCallback: function () {
                },
                afterAllCallback: function () {
                    setInterval(function () {
                        $(".pPaginSmall").remove();
                    }, 500);
                },
                regressionUrls: ["http://pogoda.wp.pl/gid,16782131,kat,1035571,title,Prognoza-dlugoterminowa-kulminacja-upalnego-lata,galeria.html"]
            },
            {
                /* css selektor ktory uaktywnia eliminacje slajdow na danej stronie*/
                trigger: "#page_wrapper #container #main .article-wraper .article-body .post-pages a.next-page.button",
                /* index */
                pageType: "45",
                /* nazwa galerii */
                name: "gadzetomania",
                /* ZA tym elementem bedzie dolaczony DIV ze slajdami */
                articleBodySelector: ".article-body",
                /* elementy ktora zostana dolaczone jako slajd*/
                sectionToBeAttached: ".article-body",
                /* selektor do jednego elementu z linkiem do nastepnego slajdu*/
                navigationNextULRSelector: ".article-body .post-pages a.next-page.button:first",
                /* false gdy nie ma skad wziac numeracji */
                hasSlideNumbers: true,
                navigationPageNumberSelector: ".pages-text:first",
                /* elementy do usuniecia z calej strony */
                sectionToBeRemovedSelector: ".post-pages",
                /* elementy do usuniecia TYLKO z dolaczanych slajdow*/
                sectionToBeRemovedFromAttachedSlidesSelector: "script",
                /* $.empty() na elemencie*/
                sectionToBeEmptySelector: "",
                /* dowolne style css w postaci mapy */
                customStyle: {},
                preIncludeCallback: function () {
                },
                regressionUrls: ["http://gadzetomania.pl/1547,tragedie-w-przestworzach-ataki-na-samoloty-cywilne-znacznie-wiecej-wiecej-niz-podaja-media"]
            },
            {
                /* css selektor ktory uaktywnia eliminacje slajdow na danej stronie*/
                trigger: "#main-wrap div#body .section-subcontent .photo-wrap a#next_link",
                /* index */
                pageType: "46",
                /* nazwa galerii */
                name: "trojmiasto.pl",
                /* ZA tym elementem bedzie dolaczony DIV ze slajdami */
                articleBodySelector: "#foto",
                /* elementy ktora zostana dolaczone jako slajd*/
                sectionToBeAttached: "#foto",
                /* selektor do jednego elementu z linkiem do nastepnego slajdu*/
                navigationNextULRSelector: ".photo-wrap a#next_link",
                /* false gdy nie ma skad wziac numeracji */
                hasSlideNumbers: true,
                navigationPageNumberSelector: ".page_count:first",
                /* elementy do usuniecia z calej strony */
                sectionToBeRemovedSelector: "#fotoshift, .simple-nav, #hover_nav",
                /* elementy do usuniecia TYLKO z dolaczanych slajdow*/
                sectionToBeRemovedFromAttachedSlidesSelector: "script",
                /* $.empty() na elemencie*/
                sectionToBeEmptySelector: "",
                /* dowolne style css w postaci mapy */
                customStyle: {},
                preIncludeCallback: function () {
                },
                regressionUrls: ["http://galeria.trojmiasto.pl/-452980.html?id_container=82203&pozycja=4#foto"]
            },
            {
                /* css selektor ktory uaktywnia eliminacje slajdow na danej stronie*/
                trigger: "body ul.k_controls .k_next, #photoZoom #imgNav",
                /* index */
                pageType: "47",
                /* nazwa galerii */
                name: "onet pozioma galeria",
                /* ZA tym elementem bedzie dolaczony DIV ze slajdami */
                articleBodySelector: "#main .kopyto:first, #sTop .kopyto:first, #cLeft .kopyto:first",
                /* elementy ktora zostana dolaczone jako slajd*/
                sectionToBeAttached: "#main .kopyto:first, #sTop .kopyto:first, #cLeft .kopyto:first",
                /* selektor do jednego elementu z linkiem do nastepnego slajdu*/
                navigationNextULRSelector: "li.k_next a:first",
                /* false gdy nie ma skad wziac numeracji */
                hasSlideNumbers: true,
                navigationPageNumberSelector: ".k_index:first",
                /* elementy do usuniecia z calej strony */
                sectionToBeRemovedSelector: ".k_preview, .k_index, .k_controls, .k_insets",
                /* elementy do usuniecia TYLKO z dolaczanych slajdow*/
                sectionToBeRemovedFromAttachedSlidesSelector: "script",
                /* $.empty() na elemencie*/
                sectionToBeEmptySelector: "",
                /* dowolne style css w postaci mapy */
                customStyle: {},
                preIncludeCallback: function () {
                },
                regressionUrls: ["http://ciekawe.onet.pl/fototematy/venus-kot-dwie-twarze,5649860,17024821,galeria-duzy.html"]
            },
            {
                /* css selektor ktory uaktywnia eliminacje slajdow na danej stronie*/
                trigger: "div#page div#main-content #content-region .node-article-image .navigation-links a.next",
                /* zatrzymuje trigger*/
                triggerStopper: "",
                /* index */
                pageType: "48",
                /* nazwa galerii */
                name: "regiomoto",
                /* ZA tym elementem bedzie dolaczony DIV ze slajdami */
                articleBodySelector: "#content-region .node-article-image",
                /* elementy ktora zostana dolaczone jako slajd*/
                sectionToBeAttached: "#content-region .node-article-image",
                /* selektor do jednego elementu z linkiem do nastepnego slajdu*/
                navigationNextULRSelector: ".navigation-links a.next",
                /* false gdy nie ma skad wziac numeracji */
                hasSlideNumbers: true,
                navigationPageNumberSelector: ".image-counter",
                /* elementy do usuniecia z calej strony */
                sectionToBeRemovedSelector: "",
                /* elementy do usuniecia TYLKO z dolaczanych slajdow*/
                sectionToBeRemovedFromAttachedSlidesSelector: "script",
                /* $.empty() na elemencie*/
                sectionToBeEmptySelector: "",
                /* dowolne style css w postaci mapy */
                customStyle: {"#comments": "float:left"},
                preIncludeCallback: function () {
                    $("img.imagecache").each(function () {
                        $(this).attr("src", $(this).attr("data-original"));
                    });

                    if ($(this.articleSection).find(".navigation-links a.next").length === 0 && $(this.articleSection).find(".navigation-links a.last").length === 1) {
                        this.nextPageURL = $(this.articleSection).find(".navigation-links a.last").attr("href");
                    }

                    $("div.images, .navigation-links").remove();
                },
                regressionUrls: ["http://regiomoto.pl/portal/porady/tuning/zdjecie-dopieszczone-wartburgi-chlopakow-z-wartburgradikalzcom"]
            },
            {
                trigger: "div#page div#main div.slideshow-header .slideshow-paging .slideshow-next",
                name: "sportfan.pl",
                articleBodySelector: ".slideshow, .slideshow-old",
                navigationNextULRSelector: ".slideshow-paging .slideshow-next:first",
                sectionToBeEmptySelector: "",
                sectionToBeAttached: ".slideshow:first, .slideshow-old:first",
                sectionToBeRemovedSelector: ".slideshow-paging",
                navigationPageNumberSelector: ".slideshow-current:first",
                sectionToBeRemovedFromAttachedSlidesSelector: "script",
                customStyle: {'.imageContainerEliminatorSlajdow': 'margin-top:20px'},
                hasSlideNumbers: true,
                pageType: "49",
                regressionUrls: ["http://www.sportfan.pl/galeria/neymar-juz-nie-pamieta-o-bolu-zajela-sie-nim-sexy-kobieta-53539"],
                preIncludeCallback: function () {

                }
            },
            {
                /* css selektor ktory uaktywnia eliminacje slajdow na danej stronie*/
                trigger: "#main > div.article > div.gallery-booth > div.gallery-big > a.gallery-next",
                /* zatrzymuje trigger*/
                triggerStopper: "",
                /* index */
                pageType: "50",
                /* nazwa galerii */
                name: "sportfan plaska",
                /* ZA tym elementem bedzie dolaczony DIV ze slajdami */
                articleBodySelector: "#main > div.article > div.gallery-booth",
                /* elementy ktora zostana dolaczone jako slajd*/
                sectionToBeAttached: "div.gallery-booth",
                /* selektor do jednego elementu z linkiem do nastepnego slajdu*/
                navigationNextULRSelector: "div.gallery-big > a.ir.gallery-next",
                /* false gdy nie ma skad wziac numeracji */
                hasSlideNumbers: false,
                navigationPageNumberSelector: "",
                /* elementy do usuniecia z calej strony */
                sectionToBeRemovedSelector: "div.gallery-preview, .gallery-big .ir",
                /* elementy do usuniecia TYLKO z dolaczanych slajdow*/
                sectionToBeRemovedFromAttachedSlidesSelector: "script",
                /* $.empty() na elemencie*/
                sectionToBeEmptySelector: "",
                /* dowolne style css w postaci mapy */
                customStyle: {".article .gallery-big": "width:auto"},
                preIncludeCallback: function () {
                },
                regressionUrls: ["http://www.sportfan.pl/artykul/erotyczne-euro-nagie-pilkarki-na-boisku-zdjecia-43386"]
            },
            {
                /* css selektor ktory uaktywnia eliminacje slajdow na danej stronie*/
                trigger: "body#Forbes #Page-Wrap .Block-Node a.Next",
                /* zatrzymuje trigger*/
                triggerStopper: "",
                /* index */
                pageType: "51",
                /* nazwa galerii */
                name: "forbes.pl",
                /* ZA tym elementem bedzie dolaczony DIV ze slajdami */
                articleBodySelector: "#Column-Wrap",
                /* elementy ktora zostana dolaczone jako slajd*/
                sectionToBeAttached: "#Column-Wrap",
                /* selektor do jednego elementu z linkiem do nastepnego slajdu */
                navigationNextULRSelector: "#Column-Wrap .Block-Node a.Next",
                /* false gdy nie ma skad wziac numeracji */
                hasSlideNumbers: false,
                navigationPageNumberSelector: "",
                /* elementy do usuniecia z calej strony */
                sectionToBeRemovedSelector: ".navigation, .Next, .Previous, .showMini",
                /* elementy do usuniecia TYLKO z dolaczanych slajdow*/
                sectionToBeRemovedFromAttachedSlidesSelector: "script, .backlink, #ARTICLE_RELATED_GALLERY_BOTTOM, .socialLine",
                /* $.empty() na elemencie*/
                sectionToBeEmptySelector: "",
                /* dowolne style css w postaci mapy */
                customStyle: {
                    ".headerLogo, .icon-facebook-squared": "color:white",
                    ".imageContainerEliminatorSlajdow": "margin-top:15px"
                },
                preIncludeCallback: function () {
                },
                regressionUrls: ["http://kariera.forbes.pl/8-prostych-sposobow-na-poprawe-jakosci-pracy,artykuly,179168,1,1,4.html",
                    "http://kariera.forbes.pl/najbardziej-absurdalne-pytania-na-rozmowie-o-prace,artykuly,174074,1,1,2.html"]
            },
            {
                /* css selektor ktory uaktywnia eliminacje slajdow na danej stronie*/
                trigger: "div#root div#content section#articles #zdjecie.right .navigation a.next",
                /* zatrzymuje trigger*/
                triggerStopper: "",
                /* index */
                pageType: "52",
                /* nazwa galerii */
                name: "geekweek.pl",
                /* ZA tym elementem bedzie dolaczony DIV ze slajdami */
                articleBodySelector: "#zdjecie div:last",
                /* elementy ktora zostana dolaczone jako slajd*/
                sectionToBeAttached: "#zdjecie",
                /* selektor do jednego elementu z linkiem do nastepnego slajdu*/
                navigationNextULRSelector: ".navigation a.next:first",
                /* false gdy nie ma skad wziac numeracji */
                hasSlideNumbers: true,
                navigationPageNumberSelector: ".navigation .num",
                /* elementy do usuniecia z calej strony */
                sectionToBeRemovedSelector: ".navigation",
                /* elementy do usuniecia TYLKO z dolaczanych slajdow*/
                sectionToBeRemovedFromAttachedSlidesSelector: "script",
                /* $.empty() na elemencie*/
                sectionToBeEmptySelector: "",
                /* dowolne style css w postaci mapy */
                customStyle: {},
                preIncludeCallback: function () {
                },
                regressionUrls: ["http://www.geekweek.pl/galerie/4031/zwierzeta-w-promieniach-zachodzacego-slonca?zdjecie=1#zdjecie",
                    "http://www.geekweek.pl/galerie/4082/jak-sobie-radzic-w-upaly",
                    "http://www.geekweek.pl/galerie/4080/tego-nie-wiedzieliscie-o-mcdonalds"]
            },
            {
                /* css selektor ktory uaktywnia eliminacje slajdow na danej stronie*/
                trigger: "#galeria-warstwa > div.boxPozycja.galeriaNaw > div #material-galeria-nastepne.btnNastepny",
                /* zatrzymuje trigger*/
                triggerStopper: "",
                /* index */
                pageType: "53",
                /* nazwa galerii */
                name: "naszemiasto.pl w overlay",
                /* ZA tym elementem bedzie dolaczony DIV ze slajdami */
                articleBodySelector: "#galeria-warstwa",
                /* elementy ktora zostana dolaczone jako slajd*/
                sectionToBeAttached: "#galeria-warstwa",
                /* selektor do jednego elementu z linkiem do nastepnego slajdu*/
                navigationNextULRSelector: "link[rel=next]",
                /* false gdy nie ma skad wziac numeracji */
                navigationPageNumberSelector: "",
                /* elementy do usuniecia z calej strony*/
                sectionToBeRemovedSelector: ".galeriaNaw",
                /* elementy do usuniecia TYLKO z dolaczanych slajdow */
                sectionToBeRemovedFromAttachedSlidesSelector: "script",
                /* $.empty() na elemencie*/
                sectionToBeEmptySelector: "",
                /* Theme */
                esTheme: "white",
                /* dowolne style css w postaci mapy */
                customStyle: {},
                beforeAllCallback: function () {
                    document.cookie = "galeria_opis_reklama=2445847%7C35;path=/artykul/zdjecia";
                    let link = $("link[rel=next]");
                    if (link.length === 1) {
                        let canonicalUrl = link.attr("href");
                        if (canonicalUrl.indexOf(document.location.hostname) === -1) {
                            document.location.href = canonicalUrl;
                        }
                    }
                },
                preIncludeCallback: function () {
                },
                regressionUrls: ["http://warszawa.naszemiasto.pl/artykul/zdjecia/muzeum-techniki-warszawa-wystawa-zabytkowych-kamer-i,2380679,artgal,10156975,t,id,tm,zid.html",
                    "http://warszawa.naszemiasto.pl/artykul/zdjecia/pogrzeb-jaruzelskiego-na-powazkach-wideo-zdjecia,2290964,artgal,9379796,t,id,tm,zid.html"]
            },
            {
                /* css selektor ktory uaktywnia eliminacje slajdow na danej stronie*/
                trigger: "#content #contents .content .media.full .jcarousel-wrapper",
                /* zatrzymuje trigger*/
                triggerStopper: "",
                /* index */
                pageType: "54",
                /* nazwa galerii */
                name: "nowy kwejk styczen 2015",
                /* ZA tym elementem bedzie dolaczony DIV ze slajdami */
                articleBodySelector: "div.media.full > div.object div.self, div.media.full > div.object section.large",
                /* elementy ktora zostana dolaczone jako slajd*/
                sectionToBeAttached: "div.media.full > div.object div.self, div.media.full > div.object section.large",
                /* selektor do jednego elementu z linkiem do nastepnego slajdu*/
                navigationNextULRSelector: "#contents div.media.full div.object a.next",
                /* false gdy nie ma skad wziac numeracji */
                hasSlideNumbers: false,
                navigationPageNumberSelector: "",
                /* elementy do usuniecia z calej strony */
                sectionToBeRemovedSelector: ".jcarousel-wrapper, a.next, a.prev, .content .media.ad",
                /* elementy do usuniecia TYLKO z dolaczanych slajdow*/
                sectionToBeRemovedFromAttachedSlidesSelector: "script, .media.ad",
                /* $.empty() na elemencie*/
                sectionToBeEmptySelector: "",
                /* Theme */
                esTheme: "default",
                /* dowolne style css w postaci mapy */
                customStyle: {
                    ".btn-goback": "float:left; width:100%",
                    "article.content .media.ad": "display:none !important",
                    ".actions": "position:static !important",
                    ".es_slide img": "margin-bottom: 0 !important",
                    ".media.full > div.object": "margin-top: 50px !important",
                    ".media.full > div.object .self img": "margin-bottom: 0 !important",
                    ".media-gallery-title": "margin: 30px 0",
                    ".imageContainerEliminatorSlajdow": "margin-top: 15px;"
                },
                preIncludeCallback: function () {
                },
                regressionUrls: ["http://kwejk.pl/obrazek/2106118/0/9-typow-inteligencji-wedlug-howarda-gardnera.html",
                    "http://kwejk.pl/obrazek/2106116/0/inne-zastosowania-przedmiotow-gospodarstwa-domowego.html"]
            },
            {
                /* css selektor ktory uaktywnia eliminacje slajdow na danej stronie*/
                trigger: "#stgMain #bxGaleria > div.content > div.picCol > div.bigPic > a",
                /* zatrzymuje trigger*/
                triggerStopper: "",
                /* index */
                pageType: "55",
                /* nazwa galerii */
                name: "WP tech sierpien 2014",
                /* ZA tym elementem bedzie dolaczony DIV ze slajdami */
                articleBodySelector: "#bxGaleria .content",
                /* elementy ktora zostana dolaczone jako slajd*/
                sectionToBeAttached: "#bxGaleria .content",
                /* selektor do jednego elementu z linkiem do nastepnego slajdu*/
                navigationNextULRSelector: ".navPic .stgGaleriaNext:first",
                /* false gdy nie ma skad wziac numeracji */
                hasSlideNumbers: true,
                navigationPageNumberSelector: ".navPic span",
                /* elementy do usuniecia z calej strony */
                sectionToBeRemovedSelector: ".navPic, .bigPic a",
                /* elementy do usuniecia TYLKO z dolaczanych slajdow*/
                sectionToBeRemovedFromAttachedSlidesSelector: "script",
                /* $.empty() na elemencie*/
                sectionToBeEmptySelector: "",
                /* Theme */
                esTheme: "default",
                /* dowolne style css w postaci mapy */
                customStyle: {},
                preIncludeCallback: function () {
                },
                regressionUrls: ["http://tech.wp.pl/gid,16799172,title,Czy-to-jeszcze-ludzie-Tak-czlowiek-zmienia-sie-w-cyborga,galeria.html?ticaid=113454&_ticrsn=3"]
            },
            {
                /* css selektor ktory uaktywnia eliminacje slajdow na danej stronie*/
                trigger: "#wpMain div.bxCenterMain div.bxCont div.fotkaBx h1.galeria",
                /* zatrzymuje trigger*/
                triggerStopper: "",
                /* index */
                pageType: "56",
                /* nazwa galerii */
                name: "nocoty.pl",
                /* ZA tym elementem bedzie dolaczony DIV ze slajdami */
                articleBodySelector: ".bxCenterMain .bxCont",
                /* elementy ktora zostana dolaczone jako slajd*/
                sectionToBeAttached: ".bxCenterMain",
                /* selektor do jednego elementu z linkiem do nastepnego slajdu*/
                navigationNextULRSelector: "a.stgGaleriaNext:first",
                /* false gdy nie ma skad wziac numeracji */
                hasSlideNumbers: true,
                navigationPageNumberSelector: ".galeriaPrawyBx .body strong",
                /* elementy do usuniecia z calej strony */
                sectionToBeRemovedSelector: ".fotoPrev_v2, .fotoNext_v2, .body .rt",
                /* elementy do usuniecia TYLKO z dolaczanych slajdow*/
                sectionToBeRemovedFromAttachedSlidesSelector: "script, #stgOpinie, div.bxCenterMain div.galeriaZdjecieBx:eq(1)",
                /* $.empty() na elemencie*/
                sectionToBeEmptySelector: "",
                /* Theme */
                esTheme: "default",
                /* dowolne style css w postaci mapy */
                customStyle: {},
                preIncludeCallback: function () {
                    let body = $(this.articleSection).find(".galeriaZdjecieBx");
                    if (body.length == 2) {
                        body[1].remove();
                    }
                },
                regressionUrls: ["http://nocoty.pl/gid,16823077,kat,1013703,title,Maria-Elena-Boschi-na-plazy-Seksowna-pani-minister,galeria.html?ticaid=6134e6"]
            },
            {
                /* css selektor ktory uaktywnia eliminacje slajdow na danej stronie*/
                trigger: "body.galleryblack #galleryImg > div.paginfixed > div > span.nextbox > a",
                /* zatrzymuje trigger*/
                triggerStopper: "",
                /* index */
                pageType: "57",
                /* nazwa galerii */
                name: "newsweek.pl",
                /* ZA tym elementem bedzie dolaczony DIV ze slajdami */
                articleBodySelector: ".imgGalleryArt #galleryImg",
                /* elementy ktora zostana dolaczone jako slajd*/
                sectionToBeAttached: ".imgGalleryArt",
                /* selektor do jednego elementu z linkiem do nastepnego slajdu*/
                navigationNextULRSelector: "div.paginfixed > div > span.nextbox > a:first",
                /* false gdy nie ma skad wziac numeracji */
                hasSlideNumbers: false,
                navigationPageNumberSelector: "",
                /* elementy do usuniecia z calej strony */
                sectionToBeRemovedSelector: ".paginfixed, .stripeList, .gallery-mini-holder",
                /* elementy do usuniecia TYLKO z dolaczanych slajdow*/
                sectionToBeRemovedFromAttachedSlidesSelector: "script, .moregallery",
                /* $.empty() na elemencie*/
                sectionToBeEmptySelector: "",
                /* Theme */
                esTheme: "white",
                /* dowolne style css w postaci mapy */
                customStyle: {},
                preIncludeCallback: function () {
                },
                regressionUrls: ["http://www.newsweek.pl/22-lipca-w-czasach-polski-ludowej-na-fotografiach-na-newsweek-p,galeria,106661,1,1,1.html"]
            },
            {
                /* css selektor ktory uaktywnia eliminacje slajdow na danej stronie*/
                trigger: "#wpMain  #wpCenter #galleryB div.pages span a",
                /* zatrzymuje trigger*/
                triggerStopper: ".photo .vdoPly",
                /* index */
                pageType: "58",
                /* nazwa galerii */
                name: "film.wp.pl",
                /* ZA tym elementem bedzie dolaczony DIV ze slajdami */
                articleBodySelector: "#galleryB",
                /* elementy ktora zostana dolaczone jako slajd*/
                sectionToBeAttached: "#galleryB",
                /* selektor do jednego elementu z linkiem do nastepnego slajdu*/
                navigationNextULRSelector: "#galleryB div.pages span:last a",
                /* false gdy nie ma skad wziac numeracji */
                hasSlideNumbers: false,
                navigationPageNumberSelector: ".stro .pages",
                /* elementy do usuniecia z calej strony */
                sectionToBeRemovedSelector: ".ST-BX-Zobacz-takze-gal, .pages",
                /* elementy do usuniecia TYLKO z dolaczanych slajdow*/
                sectionToBeRemovedFromAttachedSlidesSelector: "script",
                /* $.empty() na elemencie*/
                sectionToBeEmptySelector: "",
                /* Theme */
                esTheme: "default",
                /* dowolne style css w postaci mapy */
                customStyle: {},
                preIncludeCallback: function () {
                    $(".galPN").parent().remove();
                },
                regressionUrls: ["http://film.wp.pl/idGallery,14811,idPhoto,398806,galeria.html?ticaid=113528&_ticrsn=3"]
            },
            {
                /* css selektor ktory uaktywnia eliminacje slajdow na danej stronie*/
                trigger: "body div.columns.columns-outer-double article.paggedArticle figure.article-image div.gallery-controlls a.gallery-image-next",
                /* index */
                pageType: "59",
                /* nazwa galerii */
                name: "sportowefakty.pl artykul",
                /* ZA tym elementem bedzie dolaczony DIV ze slajdami */
                articleBodySelector: "article.paggedArticle",
                /* elementy ktora zostana dolaczone jako slajd*/
                sectionToBeAttached: "article.paggedArticle",
                /* selektor do jednego elementu z linkiem do nastepnego slajdu*/
                navigationNextULRSelector: "article > figure > div > a.gallery-image-next",
                /* false gdy nie ma skad wziac numeracji */
                hasSlideNumbers: true,
                navigationPageNumberSelector: ".fullsizedPaggedNavigation:first span",
                /* elementy do usuniecia z calej strony */
                sectionToBeRemovedSelector: ".fullsizedPaggedNavigation, .gallery-image-previous, .gallery-image-next",
                /* elementy do usuniecia TYLKO z dolaczanych slajdow*/
                sectionToBeRemovedFromAttachedSlidesSelector: "script, .article-header, .article-footer, .contentpoll",
                /* dowolne style css w postaci mapy */
                customStyle: {},
                /* naglowek slajdu */
                headerSectionSelector: "",
                /* $.empty() na elemencie*/
                sectionToBeEmptySelector: "",
                /* callback uruchamiany przed dolaczeniem kazdgo slajdu do strony */
                preIncludeCallback: function () {
                },
                regressionUrls: ["http://www.sportowefakty.pl/pilka-nozna/462036/az-dwunastu-polakow-na-starcie-bundesligi-kto-bedzie-gral-a-kto-siedzial-na-lawc/3"]
            },
            {
                /* css selektor ktory uaktywnia eliminacje slajdow na danej stronie*/
                trigger: "#wrapper #article.photostory a.photoNavigationNext, #photoContainer div.nav a.next",
                /* zatrzymuje trigger*/
                triggerStopper: "",
                /* index */
                pageType: "60",
                /* nazwa galerii */
                name: "nowiny24 nowa galeria",
                /* ZA tym elementem bedzie dolaczony DIV ze slajdami */
                articleBodySelector: "#article.photostory",
                /* elementy ktora zostana dolaczone jako slajd*/
                sectionToBeAttached: "#article.photostory",
                /* selektor do jednego elementu z linkiem do nastepnego slajdu*/
                navigationNextULRSelector: ".photoNavigation a.photoNavigationNext:first",
                /* false gdy nie ma skad wziac numeracji */
                hasSlideNumbers: true,
                navigationPageNumberSelector: ".photoNavigationPages:first",
                /* elementy do usuniecia z calej strony */
                sectionToBeRemovedSelector: "#photoContainer div.nav, #photostoryConnections, .photoNavigation",
                /* elementy do usuniecia TYLKO z dolaczanych slajdow*/
                sectionToBeRemovedFromAttachedSlidesSelector: "script",
                /* $.empty() na elemencie*/
                sectionToBeEmptySelector: "",
                /* Theme */
                esTheme: "default",
                /* dowolne style css w postaci mapy */
                customStyle: {},
                preIncludeCallback: function () {
                },
                regressionUrls: ["http://www.nowiny24.pl/apps/pbcs.dll/article?AID=/20140611/BIESZCZADY00/140619917&sectioncat=photostory2",
                    "http://www.nowiny24.pl/apps/pbcs.dll/article?AID=/20140611/BIESZCZADY00/140619917"]
            },
            {
                /* css selektor ktory uaktywnia eliminacje slajdow na danej stronie*/
                trigger: "div.main-content div.article--slideshow div.slideshow div.slideshow__header div.slidshow__nav a.button-next",
                /* zatrzymuje trigger*/
                triggerStopper: "",
                /* index */
                pageType: "61",
                /* nazwa galerii */
                name: "biztok",
                /* ZA tym elementem bedzie dolaczony DIV ze slajdami */
                articleBodySelector: "div.slideshow",
                /* elementy ktora zostana dolaczone jako slajd*/
                sectionToBeAttached: "div.slideshow",
                /* selektor do jednego elementu z linkiem do nastepnego slajdu*/
                navigationNextULRSelector: "div.slideshow__header div.slidshow__nav a.button-next:first",
                /* false gdy nie ma skad wziac numeracji */
                hasSlideNumbers: true,
                navigationPageNumberSelector: ".slide-nr:first",
                /* elementy do usuniecia z calej strony */
                sectionToBeRemovedSelector: ".slidshow__nav",
                /* elementy do usuniecia TYLKO z dolaczanych slajdow*/
                sectionToBeRemovedFromAttachedSlidesSelector: "script",
                /* $.empty() na elemencie*/
                sectionToBeEmptySelector: "",
                /* Theme */
                esTheme: "default",
                /* dowolne style css w postaci mapy */
                customStyle: {},
                preIncludeCallback: function () {
                },
                loadMoreSlides: function () {
                    return this.nextPageURL.indexOf("slide_") > 0;
                },
                regressionUrls: ["http://www.biztok.pl/biznes/reklamy-ktore-zmienily-swiat_s17408/slide_3",
                    "http://www.biztok.pl/biznes/reklamy-ktore-zmienily-swiat_s17408/slide_3"]
            },
            {
                /* css selektor ktory uaktywnia eliminacje slajdow na danej stronie*/
                trigger: "#stgMain .bxGaleriaPoj .stronicowanie .stgGaleriaNext.next:first",
                /* zatrzymuje trigger*/
                triggerStopper: "",
                /* index */
                pageType: "62",
                /* nazwa galerii */
                name: "sport wp pl galeria pozioma 2",
                /* ZA tym elementem bedzie dolaczony DIV ze slajdami */
                articleBodySelector: ".bxGaleriaPoj:first",
                /* elementy ktora zostana dolaczone jako slajd*/
                sectionToBeAttached: ".bxGaleriaPoj",
                /* selektor do jednego elementu z linkiem do nastepnego slajdu*/
                navigationNextULRSelector: ".stronicowanie .stgGaleriaNext:first",
                /* false gdy nie ma skad wziac numeracji */
                hasSlideNumbers: true,
                navigationPageNumberSelector: ".stronicowanie:first",
                /* elementy do usuniecia z calej strony */
                sectionToBeRemovedSelector: ".stronicowanie",
                /* elementy do usuniecia TYLKO z dolaczanych slajdow*/
                sectionToBeRemovedFromAttachedSlidesSelector: "script",
                /* $.empty() na elemencie*/
                sectionToBeEmptySelector: "",
                /* Theme */
                esTheme: "default",
                /* dowolne style css w postaci mapy */
                customStyle: {},
                preIncludeCallback: function () {
                },
                regressionUrls: ["http://sport.wp.pl/gid,16900393,kat,39,title,Polacy-odebrali-zlote-medale-MS,galeria.html",
                    "http://sport.wp.pl/gid,16900642,kat,1912,page,2,title,Polscy-siatkarze-mistrzami-swiata,galeria.html?ticaid=113800&_ticrsn=3"]
            },
            {
                /* css selektor ktory uaktywnia eliminacje slajdow na danej stronie*/
                trigger: "#all #page #slideshow-header .slideshow-paging a.slideshow-next",
                /* zatrzymuje trigger*/
                triggerStopper: "",
                /* index */
                pageType: "63",
                /* nazwa galerii */
                name: "wawalove.pl - pozioma",
                /* ZA tym elementem bedzie dolaczony DIV ze slajdami */
                articleBodySelector: "div.content",
                /* elementy ktora zostana dolaczone jako slajd*/
                sectionToBeAttached: "div.content",
                /* selektor do jednego elementu z linkiem do nastepnego slajdu*/
                navigationNextULRSelector: ".slideshow-paging a.slideshow-next:first",
                /* false gdy nie ma skad wziac numeracji */
                hasSlideNumbers: true,
                navigationPageNumberSelector: ".slideshow .slideshow-current:first",
                /* elementy do usuniecia z calej strony */
                sectionToBeRemovedSelector: ".slideshow header, .slideshow footer",
                /* elementy do usuniecia TYLKO z dolaczanych slajdow*/
                sectionToBeRemovedFromAttachedSlidesSelector: "script",
                /* $.empty() na elemencie*/
                sectionToBeEmptySelector: "",
                /* Theme */
                esTheme: "default",
                /* dowolne style css w postaci mapy */
                customStyle: {},
                preIncludeCallback: function () {
                },
                regressionUrls: ["http://wawalove.pl/Za-czym-ta-kolejka-STARE-ZDJECIA-sl16189"]
            },
            {
                /* css selektor ktory uaktywnia eliminacje slajdow na danej stronie*/
                trigger: ".bx-galeria .bx-content #galleryNaviSide a.next",
                /* zatrzymuje trigger*/
                triggerStopper: "",
                /* index */
                pageType: "64",
                /* nazwa galerii */
                name: "wp.pl - pozioma",
                /* ZA tym elementem bedzie dolaczony DIV ze slajdami */
                articleBodySelector: "div.bx-content",
                /* elementy ktora zostana dolaczone jako slajd*/
                sectionToBeAttached: "div.bx-content",
                /* selektor do jednego elementu z linkiem do nastepnego slajdu*/
                navigationNextULRSelector: "#galleryNaviSide a.next",
                /* false gdy nie ma skad wziac numeracji */
                navigationPageNumberSelector: "#galleryNaviTop",
                /* elementy do usuniecia z calej strony */
                sectionToBeRemovedSelector: "#galleryNaviSide a.next, #galleryNaviSide a.prev, *[id='galleryNaviTop']",
                /* elementy do usuniecia TYLKO z dolaczanych slajdow*/
                sectionToBeRemovedFromAttachedSlidesSelector: "script",
                /* $.empty() na elemencie*/
                sectionToBeEmptySelector: "",
                /* Theme */
                esTheme: "default",
                /* dowolne style css w postaci mapy */
                customStyle: {},
                preIncludeCallback: function () {
                    $(".cboh").insertAfter(".imageContainerEliminatorSlajdow");
                },
                regressionUrls: ["http://ksiazki.wp.pl/gid,16963674,page,2,tytul,Rzadzac-swiatem-na-emeryturze,galeria.html?ticaid=113b14"]
            },
            {
                /* css selektor ktory uaktywnia eliminacje slajdow na danej stronie*/
                trigger: "#allContentArea #webMainContent .wideColumn #galeriaFoto a.fotkiNavigationBig-next",
                /* zatrzymuje trigger*/
                triggerStopper: "",
                /* index */
                pageType: "65",
                /* nazwa galerii */
                name: "zdrowie.wp.pl stary layout",
                /* ZA tym elementem bedzie dolaczony DIV ze slajdami */
                articleBodySelector: "#galeriaFoto",
                /* elementy ktora zostana dolaczone jako slajd*/
                sectionToBeAttached: "#galeriaFoto",
                /* selektor do jednego elementu z linkiem do nastepnego slajdu*/
                navigationNextULRSelector: ".fotkiNavigation a.next:first",
                /* selktor ktorego text() zwroci numer strony w formacie 1/12 */
                navigationPageNumberSelector: ".fotkiNavigation .numer:first",
                /* elementy do usuniecia z calej strony */
                sectionToBeRemovedSelector: ".fotkiNavigation, .fotkiNavigationBig-next, .fotkiNavigationBig-prev",
                /* elementy do usuniecia TYLKO z dolaczanych slajdow*/
                sectionToBeRemovedFromAttachedSlidesSelector: "script",
                /* $.empty() na elemencie*/
                sectionToBeEmptySelector: "",
                /* Theme */
                esTheme: "default",
                /* dowolne style css w postaci mapy */
                customStyle: {},
                preIncludeCallback: function () {
                },
                regressionUrls: ["http://zdrowie.wp.pl/multimedia/galerie/go:2/art1463.html"]
            },
            {
                /* css selektor ktory uaktywnia eliminacje slajdow na danej stronie*/
                trigger: "#doc #contentSection section#sectionmain article.gallery_detal div.gallery_detal div.next a.btn",
                /* zatrzymuje trigger*/
                triggerStopper: "",
                /* index */
                pageType: "66",
                /* nazwa galerii */
                name: "gotowanie.onet.pl nowy layout 2014 listopad",
                /* ZA tym elementem bedzie dolaczony DIV ze slajdami */
                articleBodySelector: "article.gallery_detal",
                /* elementy ktora zostana dolaczone jako slajd*/
                sectionToBeAttached: "article.gallery_detal",
                /* selektor do jednego elementu z linkiem do nastepnego slajdu*/
                navigationNextULRSelector: "div.gallery_detal div.next a.btn",
                /* selktor ktorego text() zwroci numer strony w formacie 1/12 */
                navigationPageNumberSelector: "article.gallery_detal aside.count",
                /* elementy do usuniecia z calej strony */
                sectionToBeRemovedSelector: ".gallery_detal .next, .gallery_detal .prev, aside.count",
                /* elementy do usuniecia TYLKO z dolaczanych slajdow*/
                sectionToBeRemovedFromAttachedSlidesSelector: "script",
                /* $.empty() na elemencie*/
                sectionToBeEmptySelector: "",
                /* Theme */
                esTheme: "default",
                /* dowolne style css w postaci mapy */
                customStyle: {},
                preIncludeCallback: function () {
                },
                regressionUrls: [""]
            },
            {
                /* css selektor ktory uaktywnia eliminacje slajdow na danej stronie*/
                trigger: "body#gallery #gallery_container #gallery_pagging .numbers a.next_small",
                /* zatrzymuje trigger*/
                triggerStopper: "",
                /* index */
                pageType: "67",
                /* nazwa galerii */
                name: "komputerswiat.pl listopad 2014",
                /* ZA tym elementem bedzie dolaczony DIV ze slajdami */
                articleBodySelector: "#gallery_container",
                /* elementy ktora zostana dolaczone jako slajd*/
                sectionToBeAttached: "#gallery_container",
                /* selektor do jednego elementu z linkiem do nastepnego slajdu*/
                navigationNextULRSelector: ".next_small:first",
                /* selktor ktorego text() zwroci numer strony w formacie 1/12 */
                navigationPageNumberSelector: "#gallery_pagging .numbers",
                /* elementy do usuniecia z calej strony */
                sectionToBeRemovedSelector: ".numbers",
                /* elementy do usuniecia TYLKO z dolaczanych slajdow*/
                sectionToBeRemovedFromAttachedSlidesSelector: "script, #comments, #comment_form, .ft, #social_buttons_box",
                /* $.empty() na elemencie*/
                sectionToBeEmptySelector: "",
                /* Theme */
                esTheme: "white",
                /* dowolne style css w postaci mapy */
                customStyle: {".imageContainerEliminatorSlajdow": "margin-top: 20px"},
                preIncludeCallback: function () {
                },
                regressionUrls: ["http://gamezilla.komputerswiat.pl/publicystyka/2014/11/10-lat-temu-w-branzy-listopad-2004-miesiac-legendarnych-premier-i-branzowych-przemian,2"]
            },
            {
                /* css selektor ktory uaktywnia eliminacje slajdow na danej stronie*/
                trigger: "body#boks-galeria .kontener #glowna-kolumna section a.nastepne",
                /* zatrzymuje trigger*/
                triggerStopper: "",
                /* index */
                pageType: "68",
                /* nazwa galerii */
                name: "gazetawroclawska.pl grudzien 2014",
                /* ZA tym elementem bedzie dolaczony DIV ze slajdami */
                articleBodySelector: "#glowna-kolumna",
                /* elementy ktora zostana dolaczone jako slajd*/
                sectionToBeAttached: "#glowna-kolumna",
                /* selektor do jednego elementu z linkiem do nastepnego slajdu*/
                navigationNextULRSelector: "#glowna-kolumna section a.nastepne",
                /* selktor ktorego text() zwroci numer strony w formacie 1/12 */
                navigationPageNumberSelector: "header p.info span:first",
                /* elementy do usuniecia z calej strony */
                sectionToBeRemovedSelector: "a.nastepne, a.poprzednie, header p.info span:first",
                /* elementy do usuniecia TYLKO z dolaczanych slajdow*/
                sectionToBeRemovedFromAttachedSlidesSelector: "script",
                /* $.empty() na elemencie*/
                sectionToBeEmptySelector: "",
                /* Theme */
                esTheme: "default",
                /* dowolne style css w postaci mapy */
                customStyle: {"header p.info": "position:fixed; right:0", "header p.info a.zamknij": "padding:20px;"},
                preIncludeCallback: function () {
                },
                regressionUrls: ["http://www.gazetawroclawska.pl/artykul/zdjecia/3662884,wroclaw-spielberg-skonczyl-krecic-zburzyli-stacje-metra-i-robia-parking-zdjecia,4542008,id,t,zid.html"]
            },
            {
                /* css selektor ktory uaktywnia eliminacje slajdow na danej stronie*/
                trigger: "#page #main  #content-region div.content-wrapper div.photo a.nav-photo.nav-right",
                /* zatrzymuje trigger*/
                triggerStopper: "",
                /* index */
                pageType: "69",
                /* nazwa galerii */
                name: "MojeMiasto grudzien 2014",
                /* ZA tym elementem bedzie dolaczony DIV ze slajdami */
                articleBodySelector: ".node-photogallery-photo div.photo:first",
                /* elementy ktora zostana dolaczone jako slajd*/
                sectionToBeAttached: ".node-photogallery-photo div.photo:first",
                /* selektor do jednego elementu z linkiem do nastepnego slajdu*/
                navigationNextULRSelector: "#photo a.right",
                /* selktor ktorego text() zwroci numer strony w formacie 1/12 */
                navigationPageNumberSelector: "#photo",
                /* elementy do usuniecia z calej strony */
                sectionToBeRemovedSelector: ".nav-left, .nav-right, .images, .photo-index",
                /* elementy do usuniecia TYLKO z dolaczanych slajdow*/
                sectionToBeRemovedFromAttachedSlidesSelector: "script",
                /* $.empty() na elemencie*/
                sectionToBeEmptySelector: "",
                /* Theme */
                esTheme: "default",
                /* dowolne style css w postaci mapy */
                customStyle: {},
                preIncludeCallback: function () {
                    $(".photo img").each(function () {
                        $(this).attr("src", $(this).attr("data-original"));
                    });
                },
                regressionUrls: ["http://www.mmzielonagora.pl/fotogaleria/zdjecie-dr-misio-z-nowa-plyta-pogo-w-4-rozach-dla-lucienne"]
            },
            {
                /* css selektor ktory uaktywnia eliminacje slajdow na danej stronie*/
                trigger: ".content.content-slideshow .single-entry #slideshow-contener .slideshow-paging a.slideshow-next",
                /* zatrzymuje trigger*/
                triggerStopper: "",
                /* index */
                pageType: "70",
                /* nazwa galerii */
                name: "pudelek.pl",
                /* ZA tym elementem bedzie dolaczony DIV ze slajdami */
                articleBodySelector: "#slideshow-contener",
                /* elementy ktora zostana dolaczone jako slajd*/
                sectionToBeAttached: "#slideshow-contener",
                /* selektor do jednego elementu z linkiem do nastepnego slajdu*/
                navigationNextULRSelector: "#slideshow-contener .slideshow-paging a.slideshow-next:first",
                /* selktor ktorego text() zwroci numer strony w formacie 1/12 */
                navigationPageNumberSelector: ".slideshow-current:first",
                /* elementy do usuniecia z calej strony */
                sectionToBeRemovedSelector: ".slideshow-paging",
                /* elementy do usuniecia TYLKO z dolaczanych slajdow*/
                sectionToBeRemovedFromAttachedSlidesSelector: "script",
                /* $.empty() na elemencie*/
                sectionToBeEmptySelector: "",
                /* Theme */
                esTheme: "default",
                /* dowolne style css w postaci mapy */
                customStyle: {
                    ".slideshow-paging": "display:none"
                },
                preIncludeCallback: function () {
                },
                regressionUrls: ["http://www.pudelek.pl/artykul/75223/ile_zarabiaja_dziennie_kozuchowska_socha_i_musial_s/foto_1#s1",
                    "http://www.pudelek.pl/artykul/74003/jane_fonda_konczy_w_tym_miesiacu_77_lat_zdjecia_s/foto_1?utm_source=o2_SG&utm_medium=Pudelek&utm_campaign=o2#s1"]
            },
            {
                /* css selektor ktory uaktywnia eliminacje slajdow na danej stronie*/
                trigger: " .glassInternal .glassContent.galleryContent",
                /* zatrzymuje trigger*/
                triggerStopper: ".galleryContent .gallerySlide[data-type=video]",
                /* index */
                pageType: "71",
                /* nazwa galerii */
                name: "onet slideshow 2015",
                /* ZA tym elementem bedzie dolaczony DIV ze slajdami */
                articleBodySelector: "",
                /* elementy ktora zostana dolaczone jako slajd*/
                sectionToBeAttached: "",
                /* selektor do jednego elementu z linkiem do nastepnego slajdu*/
                navigationNextULRSelector: "",
                /* selktor ktorego text() zwroci numer strony w formacie 1/12 */
                navigationPageNumberSelector: "",
                /* elementy do usuniecia z calej strony */
                sectionToBeRemovedSelector: "",
                /* elementy do usuniecia TYLKO z dolaczanych slajdow*/
                sectionToBeRemovedFromAttachedSlidesSelector: "script",
                /* $.empty() na elemencie*/
                sectionToBeEmptySelector: "",
                /* Theme */
                esTheme: "default",
                /* dowolne style css w postaci mapy */
                customStyle: {
                    ".glassFrame": "overflow: auto",
                    ".glassFrame .galleryContent .gallerySlide .containerRight": "padding: inherit",
                    ".glassFrame .galleryContent .gallerySlide .containerRight h1.title": "position: initial"
                },
                preIncludeCallback: function () {
                },
                beforeAllCallback: function () {
                    try {
                        $.each($(".containerLeft .media > div"), function () {
                            $(this).append($(this).data("params").parameters.html);
                        });
                    } catch (e) {

                    }

                    let es = this;
                    $("body").addClass("eliminatorSlajdow");
                    $("*[data-content]").each(function () {
                        $(this).text($(this).attr("data-content"));
                    });
                    $("img[data-src]").each(function () {
                        $(this).attr("src", $(this).attr("data-src"));
                    });
                    $(".galleryContainer").css("width", "auto").css("left", "auto").addClass("imageContainerEliminatorSlajdow");
                    $(".navigationGallery").remove();
                    $(".galleryContainer .gallerySlide").each(function (index) {
                        $(this).before(es._buildHeader(index, $(this).attr("data-url")));
                    });
                    es._bind();
                    setInterval(function () {
                        $(".glassFrame").css("cssText", "overflow: auto !important");

                    }, 500);
                    es._setCssOverwrite($("body"));
                },
                afterAllCallback: function () {
                },
                regressionUrls: ["http://wiadomosci.onet.pl/kraj/najlepsze-memy-z-wynikow-wyborow-prezydenckich/kn9qjs",
                    "http://film.onet.pl/plebiscyt-onetu-wybierz-najlepszy-cytat-na-40-lecie-festiwalu-filmowego-w-gdyni/zctlry"]
            },
            {
                /* css selektor ktory uaktywnia eliminacje slajdow na danej stronie*/
                trigger: "div#wrap .article-slideshow article.slideshow div.slideshow-controls .slideshow-paging .slideshow-next",
                /* zatrzymuje trigger*/
                triggerStopper: "",
                /* index */
                pageType: "72",
                /* nazwa galerii */
                name: "Snobka 2015",
                /* ZA tym elementem bedzie dolaczony DIV ze slajdami */
                articleBodySelector: ".slideshow",
                /* elementy ktora zostana dolaczone jako slajd*/
                sectionToBeAttached: ".slideshow",
                /* selektor do jednego elementu z linkiem do nastepnego slajdu*/
                navigationNextULRSelector: "div.slideshow-controls .slideshow-paging .slideshow-next",
                /* selktor ktorego text() zwroci numer strony w formacie 1/12 */
                navigationPageNumberSelector: "span.slideshow-current:first",
                /* elementy do usuniecia z calej strony */
                sectionToBeRemovedSelector: ".slideshow-controls, .slideshow-paging",
                /* elementy do usuniecia TYLKO z dolaczanych slajdow*/
                sectionToBeRemovedFromAttachedSlidesSelector: "script, .slideshow-controls, .slideshow-paging",
                /* $.empty() na elemencie*/
                sectionToBeEmptySelector: "",
                /* Theme */
                esTheme: "default",
                /* dowolne style css w postaci mapy */
                customStyle: {},
                preIncludeCallback: function () {
                },
                regressionUrls: ["http://www.snobka.pl/artykul/gwiazdy-bez-makijazu-czesc-szosta-s_21743/2"]
            },
            {
                /* css selektor ktory uaktywnia eliminacje slajdow na danej stronie*/
                trigger: "#galeria-warstwa > div.boxPozycja.galeriaNaw > #material-galeria-nastepne.btnNastepny",
                /* zatrzymuje trigger*/
                triggerStopper: "",
                /* index */
                pageType: "73",
                /* nazwa galerii */
                name: "naszemiasto.pl w overlay 2015",
                /* ZA tym elementem bedzie dolaczony DIV ze slajdami */
                articleBodySelector: "#galeria-warstwa",
                /* elementy ktora zostana dolaczone jako slajd*/
                sectionToBeAttached: "#galeria-warstwa",
                /* selektor do jednego elementu z linkiem do nastepnego slajdu*/
                navigationNextULRSelector: " #material-galeria-nastepne.btnNastepny",
                /* false gdy nie ma skad wziac numeracji */
                navigationPageNumberSelector: "",
                /* elementy do usuniecia z calej strony*/
                sectionToBeRemovedSelector: ".galeriaNaw",
                /* elementy do usuniecia TYLKO z dolaczanych slajdow */
                sectionToBeRemovedFromAttachedSlidesSelector: "script",
                /* $.empty() na elemencie*/
                sectionToBeEmptySelector: "",
                /* Theme */
                esTheme: "white",
                /* dowolne style css w postaci mapy */
                customStyle: {},
                beforeAllCallback: function () {
                    document.cookie = "galeria_opis_reklama=2445847%7C35;path=/artykul/zdjecia";
                    let link = $("link[rel=next]");
                    if (link.length === 1) {
                        let canonicalUrl = link.attr("href");
                        if (canonicalUrl.indexOf(document.location.hostname) === -1) {
                            document.location.href = canonicalUrl;
                        }
                    }
                },
                preIncludeCallback: function () {
                },
                regressionUrls: ["http://www.mmbydgoszcz.pl/artykul/zdjecia/powstajacy-dworzec-pkp-w-bydgoszczy-coraz-piekniejszy,3459749,artgal,16513765,t,id,tm,zid.html"]
            },
            {
                /* css selektor ktory uaktywnia eliminacje slajdow na danej stronie*/
                trigger: "body > div > div.galleryWrapper > div > button.slick-next",
                /* zatrzymuje trigger*/
                triggerStopper: "",
                /* index */
                pageType: "74",
                /* nazwa galerii */
                name: "Fakt 2015 slick",
                /* ZA tym elementem bedzie dolaczony DIV ze slajdami */
                articleBodySelector: ".slick-slide ",
                /* elementy ktora zostana dolaczone jako slajd*/
                sectionToBeAttached: "",
                /* selektor do jednego elementu z linkiem do nastepnego slajdu*/
                navigationNextULRSelector: "",
                /* selktor ktorego text() zwroci numer strony w formacie 1/12 */
                navigationPageNumberSelector: "",
                /* elementy do usuniecia z calej strony */
                sectionToBeRemovedSelector: "",
                /* elementy do usuniecia TYLKO z dolaczanych slajdow*/
                sectionToBeRemovedFromAttachedSlidesSelector: "script",
                /* $.empty() na elemencie*/
                sectionToBeEmptySelector: "",
                /* gdzie umiescic imageContainer w stosunku do articleBody*/
                imageContainerPositionInRelationToArticleBody: "before",
                /* Theme */
                esTheme: "white",
                /* dowolne style css w postaci mapy */
                customStyle: {},
                preIncludeCallback: function () {
                    $(".slick-slider .slick-list").height("auto").css("margin-top", "50px");
                    $(".slick-slider").css("top", "0");
                    $(".slick-slider .slick-track").height("auto").attr("style", "");
                    $(".slick-slider .slick-slide").addClass("slick-center").css("padding-bottom", "100px").css("width", "100%");
                    setInterval(function () {
                        $(".slick-slider .slick-track").height("auto").attr("style", "");
                        $(".slick-slider .slick-slide").addClass("slick-center").css("padding-bottom", "100px").css("width", "100%");
                    }, 1000);

                    $.each($(".slick-gallery .imageWrapper .slick-loading"), function () {
                        $(this).attr("src", $(this).data("lazy"));
                    });

                    $(".slick-ad").remove();
                    $(".slick-ad").prev().remove();

                    $(".slick-gallery button").remove();
                    this._createImageContainer();
                    $(".imageContainerEliminatorSlajdow").append(this._buildHeader("", ""));
                    this._bind();
                },
                regressionUrls: ["http://www.fakt.pl/wroclaw/30-latek-jechal-do-rodzacej-zony-zginal-w-wypadku,artykuly,564650,1,1,1.html"]
            },
            {
                /* css selektor ktory uaktywnia eliminacje slajdow na danej stronie*/
                trigger: ".articlepage .page-wrap .ggallery-slider-box #ggallery-slider",
                /* zatrzymuje trigger*/
                triggerStopper: "",
                /* index */
                pageType: "75",
                /* nazwa galerii */
                name: "Dziennik PL 2015",
                /* ZA tym elementem bedzie dolaczony DIV ze slajdami */
                articleBodySelector: ".page-wrap .row .widget-ggallery-box",
                /* elementy ktora zostana dolaczone jako slajd*/
                sectionToBeAttached: ".widget-box",
                /* selektor do jednego elementu z linkiem do nastepnego slajdu*/
                navigationNextULRSelector: "link[rel='next prefetch']",
                /* selktor ktorego text() zwroci numer strony w formacie 1/12 */
                navigationPageNumberSelector: "",
                /* elementy do usuniecia z calej strony */
                sectionToBeRemovedSelector: ".ggallery-pager-box, .bx-controls",
                /* elementy do usuniecia TYLKO z dolaczanych slajdow*/
                sectionToBeRemovedFromAttachedSlidesSelector: "script",
                /* $.empty() na elemencie*/
                sectionToBeEmptySelector: "",
                /* gdzie umiescic imageContainer w stosunku do articleBody*/
                imageContainerPositionInRelationToArticleBody: "after",
                /* Theme */
                esTheme: "white",
                /* dowolne style css w postaci mapy */
                customStyle: {".imageContainerEliminatorSlajdow": "position: relative; z-index:1"},
                preIncludeCallback: function () {
                    let self = this;
                    setInterval(function () {
                        $(self.pageOptions.sectionToBeRemovedSelector).remove();
                    }, 500);
                },
                regressionUrls: ["http://auto.dziennik.pl/aktualnosci/zdjecia/galeria/428180,5,byd-czyli-nowa-marka-samochodow-z-chin-wjezdza-do-polski-zdjecia.html"]
            },
            {
                /* css selektor ktory uaktywnia eliminacje slajdow na danej stronie*/
                trigger: "#stgMain .stgInner .picNav .stampGlowneFoto span.stampGlowneFotoMain a.next",
                /* zatrzymuje trigger*/
                triggerStopper: "",
                /* index */
                pageType: "76",
                /* nazwa galerii */
                name: "Wp.pl 2015",
                /* ZA tym elementem bedzie dolaczony DIV ze slajdami */
                articleBodySelector: "#stgCol300",
                /* elementy ktora zostana dolaczone jako slajd*/
                sectionToBeAttached: ".stampGlowneFoto ,#stgCol300",
                /* selektor do jednego elementu z linkiem do nastepnego slajdu*/
                navigationNextULRSelector: "span.stampGlowneFotoMain a.next",
                /* selktor ktorego text() zwroci numer strony w formacie 1/12 */
                navigationPageNumberSelector: "#stgCol300 span.num",
                /* elementy do usuniecia z calej strony */
                sectionToBeRemovedSelector: ".stampGlowneFotoMain a.arr, .minGal",
                /* elementy do usuniecia TYLKO z dolaczanych slajdow*/
                sectionToBeRemovedFromAttachedSlidesSelector: "script, .stampGlowneFotoMain a.arr, .minGal",
                /* $.empty() na elemencie*/
                sectionToBeEmptySelector: "",
                /* gdzie umiescic imageContainer w stosunku do articleBody*/
                imageContainerPositionInRelationToArticleBody: "after",
                /* Theme */
                esTheme: "white",
                /* dowolne style css w postaci mapy */
                customStyle: {".stampGlowneFoto": "float:left;"},
                preIncludeCallback: function () {
                },
                regressionUrls: ["http://teleshow.wp.pl/gid,17632341,img,17632374,title,Beata-Tadla-obchodzi-40-urodziny-Jak-prezenterka-zmieniala-sie-przez-lata,tpl,7,galeria.html?es=debug"]
            },
            {
                trigger: "nav.slideTop .photostoryNavigation .photostoryNextPage",
                name: "galeria #pagetype_art .photostoryNextPage NOWA GALERIA GAZETY (Wrzesien 2015)",
                regressionUrls: ["http://deser.gazeta.pl/deser/51,111858,12143042.html?i=2&es=debug",
                    "http://wiadomosci.gazeta.pl/wiadomosci/51,114871,18818238.html",
                    "http://www.plotek.pl/plotek/51,78649,18746955.html?i=4&es=debug"],
                sectionToBeAttached: "#content_wrap",
                articleBodySelector: "#columns_wrap",
                sectionToBeEmptySelector: "script:not([src])",
                sectionToBeRemovedSelector: "#bottom_wrap, .photostoryNavigation, #gazeta_article_miniatures, #banP1, #banP2, #banP3, #banP4,#banP62,  .photostoryNextPage, .photostoryPrevPage, #gazeta_article_image div.overlayBright, #gazeta_article .nextSlideWrapper, .galleryNavigation",
                sectionToBeRemovedFromAttachedSlidesSelector: "#photo_comments, #article_comments, #col_right",
                navigationNextULRSelector: "nav.slideTop .photostoryNavigation .photostoryNextPage",
                navigationPageNumberSelector: "#gazeta_article_top .countPage",
                headerSectionSelector: "",
                hasSlideNumbers: true,
                pageType: "77",
                customStyle: {"#article_comments": "float:left"},
                preIncludeCallback: function () {
                    this._updateGalleryLink();
                },
                beforeAllCallback: function () {
                    $("#columns_wrap").after($("#article_comments"));
                    let that = this;
                    setInterval(function () {
                        $(that.pageOptions.sectionToBeRemovedSelector).hide();
                    }, 500);
                },
                afterAllCallback: function () {
                }
            },
            {
                /* css selektor ktory uaktywnia eliminacje slajdow na danej stronie*/
                trigger: "main.main--wide-col .main_article_container article.galery .galery--controls .galery--controls-next",
                /* zatrzymuje trigger*/
                triggerStopper: "",
                /* index */
                pageType: "78",
                /* nazwa galerii */
                name: "gwiazdy wp.pl wrzesien 2015",
                /* ZA tym elementem bedzie dolaczony DIV ze slajdami */
                articleBodySelector: "article",
                /* elementy ktora zostana dolaczone jako slajd*/
                sectionToBeAttached: "article",
                /* selektor do jednego elementu z linkiem do nastepnego slajdu*/
                navigationNextULRSelector: "article.galery .galery--controls .galery--controls-next",
                /* selktor ktorego text() zwroci numer strony w formacie 1/12 */
                navigationPageNumberSelector: ".galery--counter:first",
                /* elementy do usuniecia z calej strony */
                sectionToBeRemovedSelector: ".galery--controls, .article--next-wrapper",
                /* elementy do usuniecia TYLKO z dolaczanych slajdow*/
                sectionToBeRemovedFromAttachedSlidesSelector: "script",
                /* $.empty() na elemencie*/
                sectionToBeEmptySelector: "",
                /* gdzie umiescic imageContainer w stosunku do articleBody*/
                imageContainerPositionInRelationToArticleBody: "after",
                /* Theme */
                esTheme: "default",
                /* dowolne style css w postaci mapy */
                customStyle: {},
                preIncludeCallback: function () {
                },
                regressionUrls: ["http://gwiazdy.wp.pl/galeria/5906783836624001,5/joanna-horodynska-o-agnieszce-kaczorowskiej-wiecznie-tanczaca-wiecznie-udajaca-diwe.html?es=debug"]
            },
            {
                /* css selektor ktory uaktywnia eliminacje slajdow na danej stronie*/
                trigger: "#galeria.single_gallery_photo .gallery_main_photo .photo_story_navigation .next_photo",
                /* zatrzymuje trigger*/
                triggerStopper: "",
                /* index */
                pageType: "79",
                /* nazwa galerii */
                name: "Dziennik Wschodni",
                /* ZA tym elementem bedzie dolaczony DIV ze slajdami */
                articleBodySelector: ".thumbnail_section:last",
                /* elementy ktora zostana dolaczone jako slajd*/
                sectionToBeAttached: "#galeria",
                /* selektor do jednego elementu z linkiem do nastepnego slajdu*/
                navigationNextULRSelector: "#galeria.single_gallery_photo .gallery_main_photo .photo_story_navigation .next_photo",
                /* selktor ktorego text() zwroci numer strony w formacie 1/12 */
                navigationPageNumberSelector: "",
                /* elementy do usuniecia z calej strony */
                sectionToBeRemovedSelector: ".thumbnail_section, .photo_story_navigation, .box-separator",
                /* elementy do usuniecia TYLKO z dolaczanych slajdow*/
                sectionToBeRemovedFromAttachedSlidesSelector: "script, .photo_story_navigation",
                /* $.empty() na elemencie*/
                sectionToBeEmptySelector: "",
                /* gdzie umiescic imageContainer w stosunku do articleBody*/
                imageContainerPositionInRelationToArticleBody: "after",
                /* Theme */
                esTheme: "default",
                /* dowolne style css w postaci mapy */
                customStyle: {},
                preIncludeCallback: function () {
                },
                afterAllCallback: function () {
                    $(this.pageOptions.sectionToBeRemovedSelector).remove();
                },
                regressionUrls: ["http://www.dziennikwschodni.pl/galeria.html?gal=999675772&art=1000191633"]
            },
            {
                /* css selektor ktory uaktywnia eliminacje slajdow na danej stronie*/
                trigger: "html.bezuzyteczna_pl #content-nav a.next_image",
                /* zatrzymuje trigger*/
                triggerStopper: "",
                /* index */
                pageType: "80",
                /* nazwa galerii */
                name: "bezuzyteczna.pl",
                /* ZA tym elementem bedzie dolaczony DIV ze slajdami */
                articleBodySelector: "section.entry_gallery",
                /* elementy ktora zostana dolaczone jako slajd*/
                sectionToBeAttached: "section.entry_gallery",
                /* selektor do jednego elementu z linkiem do nastepnego slajdu*/
                navigationNextULRSelector: "#content-nav a.next_image",
                /* selktor ktorego text() zwroci numer strony w formacie 1/12 */
                navigationPageNumberSelector: "",
                /* elementy do usuniecia z calej strony */
                sectionToBeRemovedSelector: "#content-nav, section.thumbs",
                /* elementy do usuniecia TYLKO z dolaczanych slajdow*/
                sectionToBeRemovedFromAttachedSlidesSelector: "script",
                /* $.empty() na elemencie*/
                sectionToBeEmptySelector: "",
                /* gdzie umiescic imageContainer w stosunku do articleBody*/
                imageContainerPositionInRelationToArticleBody: "after",
                /* Theme */
                esTheme: "default",
                /* dowolne style css w postaci mapy */
                customStyle: {},
                preIncludeCallback: function () {
                },
                regressionUrls: ["http://bezuzyteczna.pl/galeria/na-facebooku-zaprosila-mnie-249472/10"]
            },
            {
                /* css selektor ktory uaktywnia eliminacje slajdow na danej stronie*/
                trigger: "#p_box .p_box_nav_b3 .pop_nav_font",
                /* zatrzymuje trigger*/
                triggerStopper: "",
                /* index */
                pageType: "81",
                /* nazwa galerii */
                name: "",
                /* ZA tym elementem bedzie dolaczony DIV ze slajdami */
                articleBodySelector: "#p_box",
                /* elementy ktora zostana dolaczone jako slajd*/
                sectionToBeAttached: "#p_box",
                /* selektor do jednego elementu z linkiem do nastepnego slajdu*/
                navigationNextULRSelector: "#p_box .p_box_nav_b3 .pop_nav_font",
                /* selktor ktorego text() zwroci numer strony w formacie 1/12 */
                navigationPageNumberSelector: "",
                /* elementy do usuniecia z calej strony */
                sectionToBeRemovedSelector: "#p_box_nav .p_box_nav_b3, #p_box_nav .p_box_nav_b1",
                /* elementy do usuniecia TYLKO z dolaczanych slajdow*/
                sectionToBeRemovedFromAttachedSlidesSelector: "script",
                /* $.empty() na elemencie*/
                sectionToBeEmptySelector: "",
                /* gdzie umiescic imageContainer w stosunku do articleBody*/
                imageContainerPositionInRelationToArticleBody: "after",
                /* Theme */
                esTheme: "white",
                /* dowolne style css w postaci mapy */
                customStyle: {},
                preIncludeCallback: function () {
                },
                regressionUrls: ["http://www.24opole.pl/galeria,7558,465993,l,Bora_Bora_BEFORE_SYLWESTER,fotka.html"]
            },
            {
                /* css selektor ktory uaktywnia eliminacje slajdow na danej stronie*/
                trigger: "WORK IN PROGRESS article .article__navbutton--next",
                /* zatrzymuje trigger*/
                triggerStopper: "",
                /* index */
                pageType: "81",
                /* nazwa galerii */
                name: "http://sportowefakty.wp.pl/",
                /* ZA tym elementem bedzie dolaczony DIV ze slajdami */
                articleBodySelector: "article",
                /* elementy ktora zostana dolaczone jako slajd*/
                sectionToBeAttached: "article",
                /* selektor do jednego elementu z linkiem do nastepnego slajdu*/
                navigationNextULRSelector: "article nav.article__innernav a.article__navbutton.article__navbutton--next:first",
                /* selktor ktorego text() zwroci numer strony w formacie 1/12 */
                navigationPageNumberSelector: "",
                /* elementy do usuniecia z calej strony */
                sectionToBeRemovedSelector: ".article__innernav",
                /* elementy do usuniecia TYLKO z dolaczanych slajdow*/
                sectionToBeRemovedFromAttachedSlidesSelector: "script, #Skomentuj, address.articletags, address.indicator, h1.title, .liketag, .articleteasers, div.brick.tabs.tabs--social",
                /* $.empty() na elemencie*/
                sectionToBeEmptySelector: "",
                /* gdzie umiescic imageContainer w stosunku do articleBody*/
                imageContainerPositionInRelationToArticleBody: "after",
                /* Theme */
                esTheme: "default",
                /* dowolne style css w postaci mapy */
                customStyle: {},
                preIncludeCallback: function () {
                },
                regressionUrls: ["http://sportowefakty.wp.pl/sportowybar/584230/sensible-soccer-deluxe-ski-jump-20-lat-temu-kazdy-mial-te-gry-mial-na-swoim-komp?es=dev"]
            },
            {
                /* css selektor ktory uaktywnia eliminacje slajdow na danej stronie*/
                trigger: "body#photostory header#art-header #gazeta_article_image_new img",
                /* zatrzymuje trigger*/
                triggerStopper: "",
                /* index */
                pageType: "82",
                /* nazwa galerii */
                name: "wyborcza.pl 2017 duza galeria",
                /* ZA tym elementem bedzie dolaczony DIV ze slajdami */
                articleBodySelector: "header#art-header",
                /* elementy ktora zostana dolaczone jako slajd*/
                sectionToBeAttached: "header#art-header",
                /* selektor do jednego elementu z linkiem do nastepnego slajdu*/
                navigationNextULRSelector: "header#art-header a.photostoryNextPage",
                /* selktor ktorego text() zwroci numer strony w formacie 1/12 */
                navigationPageNumberSelector: "",
                /* elementy do usuniecia z calej strony */
                sectionToBeRemovedSelector: ".photostoryNavigation, #gazeta_article_miniatures, section.ads",
                /* elementy do usuniecia TYLKO z dolaczanych slajdow*/
                sectionToBeRemovedFromAttachedSlidesSelector: "script",
                /* $.empty() na elemencie*/
                sectionToBeEmptySelector: "",
                /* gdzie umiescic imageContainer w stosunku do articleBody*/
                imageContainerPositionInRelationToArticleBody: "after",
                /* Theme */
                esTheme: "default",
                /* dowolne style css w postaci mapy */
                customStyle: {},
                preIncludeCallback: function () {
                },
                regressionUrls: ["http://wyborcza.pl/56,140981,21172188,swiat-widok-z-lotu-drona-zdjecia-roku-serwisu-dronestagr-am,,1.html"]
            },
            {
                /* css selektor ktory uaktywnia eliminacje slajdow na danej stronie*/
                trigger: "body#pagetype_photo section.article-and-social .galleryNavigation a.galleryNextPage",
                /* zatrzymuje trigger*/
                triggerStopper: "",
                /* index */
                pageType: "83",
                /* nazwa galerii */
                name: "wyborcza.pl nowa slick kwadratowa",
                /* ZA tym elementem bedzie dolaczony DIV ze slajdami */
                articleBodySelector: "#article_body",
                /* elementy ktora zostana dolaczone jako slajd*/
                sectionToBeAttached: "section.article-and-social",
                /* selektor do jednego elementu z linkiem do nastepnego slajdu*/
                navigationNextULRSelector: "section.article-and-social .galleryNavigation a.galleryNextPage",
                /* selktor ktorego text() zwroci numer strony w formacie 1/12 */
                navigationPageNumberSelector: "",
                /* elementy do usuniecia z calej strony */
                sectionToBeRemovedSelector: ".galleryNavigation, #gazeta_article_miniatures",
                /* elementy do usuniecia TYLKO z dolaczanych slajdow*/
                sectionToBeRemovedFromAttachedSlidesSelector: "script, div.social",
                /* $.empty() na elemencie*/
                sectionToBeEmptySelector: "",
                /* gdzie umiescic imageContainer w stosunku do articleBody*/
                imageContainerPositionInRelationToArticleBody: "after",
                /* Theme */
                esTheme: "default",
                /* dowolne style css w postaci mapy */
                customStyle: {"article.mod_comments": "float:left"},
                preIncludeCallback: function () {
                },
                regressionUrls: ["http://wyborcza.pl/5,140981,20821506.html?i=0&es=debug"]
            },
            {
                /* css selektor ktory uaktywnia eliminacje slajdow na danej stronie*/
                trigger: "html.fonts-loaded-plain article.gallery a[data-st-area=gallery-next]",
                /* zatrzymuje trigger*/
                triggerStopper: "",
                /* index */
                pageType: "84",
                /* nazwa galerii */
                name: "tech.wp.pl",
                /* ZA tym elementem bedzie dolaczony DIV ze slajdami */
                articleBodySelector: "article",
                /* elementy ktora zostana dolaczone jako slajd*/
                sectionToBeAttached: "article",
                /* selektor do jednego elementu z linkiem do nastepnego slajdu*/
                navigationNextULRSelector: "a[data-st-area=gallery-next]",
                /* selktor ktorego text() zwroci numer strony w formacie 1/12 */
                navigationPageNumberSelector: "",
                /* elementy do usuniecia z calej strony */
                sectionToBeRemovedSelector: "*[data-st-area=gbot-next], a[data-st-area*='gallery']",
                /* elementy do usuniecia TYLKO z dolaczanych slajdow*/
                sectionToBeRemovedFromAttachedSlidesSelector: "script",
                /* $.empty() na elemencie*/
                sectionToBeEmptySelector: "",
                /* gdzie umiescic imageContainer w stosunku do articleBody*/
                imageContainerPositionInRelationToArticleBody: "after",
                /* Theme */
                esTheme: "default",
                /* dowolne style css w postaci mapy */
                customStyle: {},
                preIncludeCallback: function () {
                },
                regressionUrls: ["http://tech.wp.pl/dlaczego-baterie-w-smartfonach-szybciej-wyladowuja-sie-gdy-jest-zimno-6069153028850305g"]
            },
            {
                /* css selektor ktory uaktywnia eliminacje slajdow na danej stronie*/
                trigger: "body > div.container .content .row div.gallery-media #gallery-thumbnails",
                /* zatrzymuje trigger*/
                triggerStopper: "",
                /* index */
                pageType: "85",
                /* nazwa galerii */
                name: "national geographic",
                /* ZA tym elementem bedzie dolaczony DIV ze slajdami */
                articleBodySelector: ".gallery-media",
                /* elementy ktora zostana dolaczone jako slajd*/
                sectionToBeAttached: ".gallery-media",
                /* selektor do jednego elementu z linkiem do nastepnego slajdu*/
                navigationNextULRSelector: "#next-item",
                /* selktor ktorego text() zwroci numer strony w formacie 1/12 */
                navigationPageNumberSelector: "",
                /* elementy do usuniecia z calej strony */
                sectionToBeRemovedSelector: "#gallery-thumbnails, a.next.btn.btn-fix.next-fix, #next-item",
                /* elementy do usuniecia TYLKO z dolaczanych slajdow*/
                sectionToBeRemovedFromAttachedSlidesSelector: "script",
                /* $.empty() na elemencie*/
                sectionToBeEmptySelector: "",
                /* gdzie umiescic imageContainer w stosunku do articleBody*/
                imageContainerPositionInRelationToArticleBody: "after",
                /* Theme */
                esTheme: "default",
                /* dowolne style css w postaci mapy */
                customStyle: {},
                preIncludeCallback: function () {
                },
                isNextPageUrlCorrect: function (url) {
                    return typeof url !== 'undefined';
                },
                regressionUrls: ["http://www.national-geographic.pl/galeria/te-10-miast-uznano-za-najbardziej-niebezpieczne-w-polsce-ranking/niebezpieczne-miasta-ranking-788036"]
            },
            {
                /* css selektor ktory uaktywnia eliminacje slajdow na danej stronie*/
                trigger: "body#photostory.classicPhotostory section.article-and-social > #gazeta_article_image_new img",
                /* zatrzymuje trigger*/
                triggerStopper: "",
                /* index */
                pageType: "86",
                /* nazwa galerii */
                name: "wyborcza.pl 2017 duza galeria 2",
                /* ZA tym elementem bedzie dolaczony DIV ze slajdami */
                articleBodySelector: "main.content.container-inner",
                /* elementy ktora zostana dolaczone jako slajd*/
                sectionToBeAttached: "main.content.container-inner",
                /* selektor do jednego elementu z linkiem do nastepnego slajdu*/
                navigationNextULRSelector: "header#art-header a.photostoryNextPage",
                /* selktor ktorego text() zwroci numer strony w formacie 1/12 */
                navigationPageNumberSelector: "",
                /* elementy do usuniecia z calej strony */
                sectionToBeRemovedSelector: ".photostoryNavigation, #gazeta_article_miniatures, div.social, .nextSlideWrapper, section.ads",
                /* elementy do usuniecia TYLKO z dolaczanych slajdow*/
                sectionToBeRemovedFromAttachedSlidesSelector: "script",
                /* $.empty() na elemencie*/
                sectionToBeEmptySelector: "",
                /* gdzie umiescic imageContainer w stosunku do articleBody*/
                imageContainerPositionInRelationToArticleBody: "after",
                /* Theme */
                esTheme: "default",
                /* dowolne style css w postaci mapy */
                customStyle: {},
                preIncludeCallback: function () {
                },
                regressionUrls: ["http://lublin.wyborcza.pl/lublin/56,48724,21304819,wstydliwa-strona-starego-miasta,,2.html?es=debug"]
            },
            {
                /* css selektor ktory uaktywnia eliminacje slajdow na danej stronie*/
                trigger: "",
                /* zatrzymuje trigger*/
                triggerStopper: "",
                /* index */
                pageType: "83",
                /* nazwa galerii */
                name: "",
                /* ZA tym elementem bedzie dolaczony DIV ze slajdami */
                articleBodySelector: "",
                /* elementy ktora zostana dolaczone jako slajd*/
                sectionToBeAttached: "",
                /* selektor do jednego elementu z linkiem do nastepnego slajdu*/
                navigationNextULRSelector: "",
                /* selktor ktorego text() zwroci numer strony w formacie 1/12 */
                navigationPageNumberSelector: "",
                /* elementy do usuniecia z calej strony */
                sectionToBeRemovedSelector: "",
                /* elementy do usuniecia TYLKO z dolaczanych slajdow*/
                sectionToBeRemovedFromAttachedSlidesSelector: "script",
                /* $.empty() na elemencie*/
                sectionToBeEmptySelector: "",
                /* gdzie umiescic imageContainer w stosunku do articleBody*/
                imageContainerPositionInRelationToArticleBody: "after",
                /* Theme */
                esTheme: "default",
                /* dowolne style css w postaci mapy */
                customStyle: {},
                preIncludeCallback: function () {
                },
                regressionUrls: [""]
            }
        ],
        spinner: $("<div>", {"class": "eliminatorSlajdowSpinner"}).append($("<i>", {class: 'icon-spin3 animate-spin'})),
        imageContainer: null,
        _theme: function (theme) {
            $("html").addClass("es-theme-" + theme);
        },
        _start: function () {
            pageNumber = 1;
            let content = "";
            for (let property in this.pageOptions) {
                content += property + "=" + JSON.stringify(this.pageOptions[property]) + "\n";
            }
            $("#es_debug").val($("#es_debug").val() + "\n" + content);

            this.pageOptions.beforeAllCallback.call(this);

            $("body").addClass("eliminatorSlajdow");
            this._theme(this.pageOptions.esTheme);
            this.nextPageURL = $(this.pageOptions.navigationNextULRSelector).attr("href");
            this.pageOptions.preIncludeCallback.call(this);
            if (this.nextPageURL) {
                this._logger("link do nastepnej storny", this.nextPageURL, this.pageOptions.navigationNextULRSelector);
                this._tracking("ES_start", this.pageOptions.pageType);
                $(this.pageOptions.sectionToBeEmptySelector).children().hide();
                $(this.pageOptions.sectionToBeRemovedSelector).hide();
                this._createImageContainer();
                this._bind();
                this._showSpinnier();
                this.pageOptions.visitedSlideURLs.push(document.location.pathname + document.location.search);
                this._requestNextSlide(this.nextPageURL);
            } else {
                this._logger("Nie znaleziono linka do nastepnego slajdu. Galeria typu " + this.pageOptions.pageType);
            }
        },
        _undo: function () {
            $(this.pageOptions.sectionToBeEmptySelector).children().show();
            $(this.pageOptions.sectionToBeRemovedSelector).show();
        },
        _buildHeader: function (pageNumber, url) {
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
        _appendNextSlide: function (dirtyPage, thisSlideURL) {
            /**
             * remove <script> tags only
             *
             * SANITIZE_DOM=false is intentional as duplicated IDs must stay even if that is not correct according to HTML spec
             */
            let entireSlidePage = DOMPurify.sanitize(dirtyPage, {
                SAFE_FOR_JQUERY: true,
                WHOLE_DOCUMENT: true,
                RETURN_DOM: true,
                FORBID_TAGS: ['script'],
                SANITIZE_DOM: false
            });
            let that = this;

            this._hideSpinner();
            this.currentUrl = thisSlideURL;
            this.articleSection = $(entireSlidePage).find(this.pageOptions.sectionToBeAttached);
            // ARTICLE BODY CHECK
            if ($(this.articleSection).length > 0) {

                this.nextPageURL = $(entireSlidePage).find(this.pageOptions.navigationNextULRSelector).attr("href");

                if (typeof this.nextPageURL === "undefined") {
                    $.each($(entireSlidePage), function () {
                        if ($(this).is(that.pageOptions.navigationNextULRSelector)) {
                            that.nextPageURL = $(this).attr("href");
                        }
                    });
                }

                $(this.articleSection).find(this.pageOptions.sectionToBeEmptySelector).empty();
                $(this.articleSection).find(this.pageOptions.sectionToBeRemovedSelector).remove();
                $(this.articleSection).find(this.pageOptions.sectionToBeRemovedFromAttachedSlidesSelector).remove();

                if (typeof thisSlideURL === "undefined") {
                    this._logger("ERROR: URL tego slajdu jest nieznany");
                    this._undo();
                    this.pageOptions.afterAllCallback.call(this);
                    return;
                }
                if (thisSlideURL === this.nextPageURL) {
                    this._logger("WARNING: URL do następnego slajdu jest taki sam jak url tego slajdu");
                    this._logger("URL do tego slajdu", thisSlideURL);
                    this._logger("URL do nastepnego zalaczanego slajdu", this.nextPageURL);
                    this._undo();
                    this.pageOptions.afterAllCallback.call(this);
                    return;
                }
                if ($.inArray(thisSlideURL, this.pageOptions.visitedSlideURLs) > -1) {
                    this._logger("WARNING: URL następnego slajdu jest już załączony do galerii");
                    this._logger("Załączone strony", this.pageOptions.visitedSlideURLs);
                    this._logger("URL do tego slajdu", thisSlideURL);
                    this._logger("URL do nastepnego zalaczanego slajdu", this.nextPageURL);
                    this._undo();
                    this.pageOptions.afterAllCallback.call(this);
                    return;
                }

                pageNumber = pageNumber + 1;

                let slideHeader = this._buildHeader(pageNumber, thisSlideURL);

                $(this.imageContainer).append(slideHeader);

                $(this.articleSection).find(this.pageOptions.sectionToBeEmptySelector).empty();
                $(this.articleSection).find(this.pageOptions.sectionToBeRemovedSelector).remove();
                $(this.articleSection).find(this.pageOptions.sectionToBeRemovedFromAttachedSlidesSelector).remove();

                let slideWrapper = $(this.imageContainer).append($("<div>", {
                    "class": "slide_" + pageNumber + " es_slide"
                })).children().last();

                if ($(entireSlidePage).find(this.pageOptions.headerSectionSelector).length === 1) {
                    let desc = $(entireSlidePage).find(this.pageOptions.headerSectionSelector).html();
                    $(slideWrapper).append($("<p>", {
                        "class": "slideTitle",
                        text: desc
                    }));
                }

                $(slideWrapper).append(this.articleSection);

                this._setCssOverwrite(this.articleSection);

                for (let i in this.pageOptions.classesToBeRemoved) {
                    $("." + this.pageOptions.classesToBeRemoved[i]).removeClass(this.pageOptions.classesToBeRemoved[i]);
                }

                this.pageOptions.visitedSlideURLs.push(thisSlideURL);

                this.pageOptions.preIncludeCallback.call(this);

                if (this.pageOptions.isNextPageUrlCorrect.call(this, this.nextPageURL)) {
                    this._logger("link do nastepnej storny", this.nextPageURL);
                    this._showSpinnier();

                    if (this.pageOptions.loadMoreSlides.call(this)) {
                        this._requestNextSlide(this.nextPageURL);
                    } else {
                        this._logger("loadMoreSlides=false  ostatni slajd");
                        this._hideSpinner();
                        this.pageOptions.afterAllCallback.call(this);
                        return;
                    }
                } else {
                    this._logger("Ostatni Slajd. NextPageUrl=" + this.nextPageURL);
                    this._hideSpinner();
                    this.pageOptions.afterAllCallback.call(this);
                }

            } else {
                this._logger("Niepoprawny selektor CSS dla ARTYKULU", this.pageOptions.articleBodySelector);
                this._undo();
            }
        },
        _setCssOverwrite: function (content) {
            let appendNewStyle = function (elements, newStyle) {
                elements.each(function () {
                    let current = $(this).attr("style") ? $(this).attr("style") + ";" : "";
                    if (current.indexOf(newStyle) === -1) {
                        $(this).attr("style", current + newStyle);
                    }
                });
            };

            for (let selector in this.pageOptions.customStyle) {
                let elements = $(content).find(selector);
                if (elements.length === 0) { // try to find the elements in the whole page
                    elements = $(selector);
                }
                appendNewStyle(elements, this.pageOptions.customStyle[selector]);
            }
        },
        _getPaywallRedirectUrl: function (nextPage) {
            if (nextPage.length > 1000 && nextPage.length < 1500 && $(nextPage).length == 11 &&
                $($(nextPage)[3]).is("meta") && $($(nextPage)[3]).attr("http-equiv") == "refresh" &&
                $($(nextPage)[3]).attr("content") &&
                $($(nextPage)[3]).attr("content").indexOf("5;URL=") === 0) {
                let c = $($(nextPage)[3]).attr("content");
                return c.substring(7, c.length - 1);
            }
            return "";
        },
        _requestNextSlide: function (nextPageURL) {
            let that = this;
            if (typeof nextPageURL === 'undefined' || nextPageURL.trim() === "") {
                that._hideSpinner();
                return;
            }

            if (nextPageURL.indexOf("http") !== 0) {
                if (nextPageURL.indexOf("/") === 0) {
                    nextPageURL = nextPageURL.substring(1);
                }
                nextPageURL = document.location.origin + "/" + nextPageURL;
            }

            $.get(this._appendParamToUrl(nextPageURL, "es=nextPage"), "html", function (nextPage) {
                let redirectUrl = that._getPaywallRedirectUrl(nextPage);
                if (redirectUrl) {
                    that._requestNextSlide(redirectUrl);
                    that._tracking("paywall_redirect", redirectUrl);
                } else {
                    that._appendNextSlide(nextPage, nextPageURL);
                }
            }).fail(function (a, b, c) {
                that._tracking("ES_AJAX_error", that.pageOptions.pageType, nextPageURL);
                that._logger("ES - AJAX request error. Code " + a.status, a, b, c, nextPageURL);
                that._hideSpinner();
                that._showErrorPanel("Coś zablokowało żądanie AJAX ", nextPageURL);
                that._undo();
            });
        },
        _showErrorPanel: function (msg, ajaxUrl) {
            let imageContainer = $("div.imageContainerEliminatorSlajdow");
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
        _bind: function () {
            let that = this;
            let imageContainer = $("div.imageContainerEliminatorSlajdow");
            imageContainer.on("click", "i.icon-resize-vertical", function () {
                let currentOffset = $(this)[0].getBoundingClientRect().bottom - $(this)[0].getBoundingClientRect().height;
                imageContainer.toggleClass("noScroll").toggleClass("scroll");
                if (that.options.scrollableImageContainer) {
                    that._logger("scroll switch OFF");
                    $('html, body').animate({
                        scrollTop: $(this).offset().top - currentOffset
                    }, 500);
                    that.options.scrollableImageContainer = false;
                } else {
                    that._logger("scroll switch ON");
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
                that._tracking("scroll_ui", that.options.scrollableImageContainer ? "ON" : "OFF");
            });

            imageContainer.on("click", ".bugreport a", function () {
                window.open(that.options.bugReportUrl);
                that._tracking("bug_report_ui", "click");
            });

            imageContainer.on("click", "p.headerLogo", function () {
                window.open(that.options.facebookUrl);
                that._tracking("facebook_ui", "click");
            });

            imageContainer.on("click", ".icon-link-ext-alt", function () {
                window.open(that._appendParamToUrl($(this).data('url'), "es=off"), '_blank');
            });

            imageContainer.on("click", "i.icon-up-circle", function () {
                $("body,html").animate({
                    scrollTop: 0
                }, 500);
                that._tracking("go_top_link", "click");
            });

            imageContainer.on("click", "i.icon-down-circle", function () {
                $("body,html").animate({
                    scrollTop: imageContainer.offset().top + imageContainer.height() - 50
                }, 500);
                that._tracking("go_end_link", "click");
            });

            imageContainer.on("click", "i.icon-right-circle", function () {
                if (that.options.scrollableImageContainer) {
                    // maybe will implement it one day
                } else {
                    let offset = imageContainer.offset().top + imageContainer.height() - 50;
                    let thisSlide = $(this).parent().parent();
                    if (thisSlide.next().length > 0 && thisSlide.next().next().length > 0) {
                        offset = thisSlide.next().next().offset().top - thisSlide[0].getBoundingClientRect().bottom - thisSlide[0].getBoundingClientRect().height + 48;
                    }
                    $("body,html").animate({
                        scrollTop: offset
                    }, 0);
                }
                that._tracking("go_next_link", "click");
            });

            imageContainer.on("click", "i.icon-left-circle", function () {
                if (that.options.scrollableImageContainer) {
                    // maybe will implement it one day
                } else {
                    let offset = 0;
                    let thisSlide = $(this).parent().parent();
                    if (thisSlide.prev().length > 0) {
                        offset = thisSlide.prev().prev().offset().top - thisSlide[0].getBoundingClientRect().bottom - thisSlide[0].getBoundingClientRect().height + 48;
                    }
                    $("body,html").animate({
                        scrollTop: offset
                    }, 0);

                }
                that._tracking("go_prev_link", "click");
            });
            // TODO: dodac obsluge spacji
        },
        init: function (customOptions) {

            if ($("div.imageContainerEliminatorSlajdow").length > 0) {
                return;
            }

            let self = this;
            window.onerror = function (err) {
                self._tracking("ES_JS_ERROR", err, window.location.href);
            };
            $.extend(true, this.options, this.options, customOptions);

            this.pages.push(this.options.customPages);

            if (this.options.debug) {
                this._createDebugConsole();
            }

            for (let i in this.pages) {
                let trigger = this.pages[i].trigger;
                let noOfSelectors = trigger && trigger.match(/,/g) ? trigger.match(/,/g).length : 1;
                if ($(trigger).length >= noOfSelectors && $(this.pages[i].triggerStopper).length === 0) {
                    $.extend(true, this.pageOptions, this.pageOptions, this.pages[i]);
                    this._logger("ES START konfiguracja " + this.pageOptions.pageType + " dla " + this.pageOptions.name);
                    this._start();
                    break;
                }
            }
        },
        _createImageContainer: function () {
            let icClass = this.options.scrollableImageContainer ? 'scroll' : 'noScroll';
            this.imageContainer = $("<div>", {"class": icClass + ' imageContainerEliminatorSlajdow'});
            if (this.pageOptions.imageContainerPositionInRelationToArticleBody === "before") {
                $(this.pageOptions.articleBodySelector).before(this.imageContainer);
            } else {
                $(this.pageOptions.articleBodySelector).after(this.imageContainer);
            }
        },
        _showSpinnier: function () {
            $("div.imageContainerEliminatorSlajdow").append(this.spinner);
        },
        _hideSpinner: function () {
            $("div.imageContainerEliminatorSlajdow div.eliminatorSlajdowSpinner").remove();
        },
        _appendDisableEsFlag: function (url) {
            return this._appendParamToUrl(url, "es=off");
        },
        _appendParamToUrl: function (url, param) {
            if (url.indexOf("?") > -1) {
                return url.replace("?", "?" + param + "&");
            }

            if (url.indexOf("#") > -1) {
                return url.replace("#", "?" + param + "#");
            }

            return url + "?" + param;
        },
        _updateGalleryLink: function () {
            let galleryLink = $("#gazeta_article_miniatures .moreImg a, #gazeta_article_image a.next ");
            if (galleryLink.length > 0) {
                let href = galleryLink.attr("href");
                let suffix = "?i=1";
                if (href && (href.indexOf(suffix, href.length - suffix.length) !== -1)) {
                    galleryLink.attr("href", href.substring(0, href.length - suffix.length));
                }
            }
        },
        regression: function () {
            this._createDebugConsole();
            let setTimeoutFunction = function (urlToOpen, pi) {
                let delay = 5 * 1000 * pi;
                setTimeout(function () {
                    window.open(urlToOpen, '_blank');
                }, delay);
            };

            let self = this;
            let allRegressionUrls = [];

            for (let pi in self.pages) {
                let pageConfig = this.pages[self.pages.length - pi - 1];
                for (let i in pageConfig.regressionUrls) {
                    let regressionUrl = pageConfig.regressionUrls[i];
                    if (regressionUrl.length > 0) {
                        allRegressionUrls.push(regressionUrl + "###es=debug###-PAGETYPE=" + pageConfig.pageType);
                    }
                }
            }

            let step = 5;
            let lowerBound = 0;
            let topBound = lowerBound + step;

            $("#start").click(function () {
                do {
                    $("body").append($("<a>", {
                        "href": allRegressionUrls[lowerBound],
                        "text": allRegressionUrls[lowerBound]
                    })).append($("<br>"));
                    let urlToOpen = allRegressionUrls[lowerBound];
                    setTimeoutFunction(urlToOpen, 0);
                    lowerBound++;
                    self._logger("Remaining URLs ", allRegressionUrls.length - lowerBound);
                } while (lowerBound < topBound && lowerBound < allRegressionUrls.length);
                topBound = topBound + step;
            });

            this.pageOptions.sectionToBeAttached = "#toBeAttached";
            this.pageOptions.articleBodySelector = "#articleBodySelector";
            this._createImageContainer();
            this._appendNextSlide("body", "regression");
            this.init();
            this.options.imageBaseUrl = "../chrome/images/";
            $(".imageContainerEliminatorSlajdow").append(this._buildHeader(666, "https://test.com"));
            this._showSpinnier();
        },
        _createDebugConsole: function () {
            let content = "Eliminator Slajdów - Debug Console v" + this.options.version + "\n\n";
            let style = "width: 700px;height: 400px;z-index: 9999999;font-family: monospace;font-size: 13px;border: 1px solid;" +
                "background: black;color: #3BFF00;padding: 10px;position: fixed;bottom: 0;right: 0";
            $("<textarea>", {id: "es_debug", style: style, val: content}).appendTo($("body"));
        },
        _tracking: function (category, action, comment) {
            if ($.isFunction(this.options.trackingCallback)) {
                comment = comment || window.location.host;
                this.options.trackingCallback.call(this, category, action, comment);
            }
        },
        _logger: function () {
            if (this.options.debug) {
                let msg = "";
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

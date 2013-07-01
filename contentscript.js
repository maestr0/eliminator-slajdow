(function($) {
    chrome.extension.sendRequest({
		"urlName": window.location.href
	}, function(response) {
		if(response.canRunOnCurrentUrl === true && document.location.href.toLowerCase().indexOf("es=off") === -1) {
			self.scrollableImageContainer = (response.scrollableImageContainer === "on");
			eliminateSlides();
		}
	});
	this.scrollableImageContainer = false;
	this.spinningIconUrl = chrome.extension.getURL("ajax-loader.gif");
    var facebookIconUrl = chrome.extension.getURL("icon_facebook.gif");
	this.cssPath = "";
    var fbRef = "chrome.extension";

    /* SHARED CODE BEGIN */
    var self = this;
    this.imageContainer = null;
    this.sectionToBeRemovedSelector = ".navigation div, .navigation span.page, #gal_navi_wrp, #gazeta_article_image_overlay";
    this.navigationNextULRSelector = ".navigation .next:first";
    this.navigationPageNumberSelector = ".navigation .page:first";
    this.articleBodySelector = "#gazeta_article_body";
    this.sectionToBeAttached = "#gazeta_article_image img,#gazeta_article_body"; // sekcja komentarza i obrazek
	this.headerSectionSelector = ".navigation:first h1 span";
    this.hasSlideNumbers = true;
    this.spinner = $("<div>", {
		"class": "eliminatorSlajdowSpinner"
	}).append($("<img>", {
		src: self.spinningIconUrl
	}));
    var facebookUrl="https://www.facebook.com/pages/Eliminator-Slajdów/235272129951576?ref=" + fbRef;
    var bugReportUrl="https://code.google.com/p/lepsza-gazeta-pl/issues/list?hl=pl";

    function eliminateSlides() {

		if($("body#pagetype_photo").length > 0) {
			console.log("jestesmy na stronie z galeria #pagetype_photo (1)");
			$("#gazeta_article_miniatures").empty();
			start();
		} else if($("body#pagetype_art_blog").length > 0) {
			/*
				http://www.plotek.pl/plotek/56,78649,13096942,Kaja_Paschalska,,1.html
				http://www.plotek.pl/plotek/56,79592,12829011,Jako_dzieci_byli_gwiazdami_seriali__Co_dzis_robia.html
				Szerokie zdjecia, zawija prawa kolumne pod komentarze
				http://wiadomosci.gazeta.pl/wiadomosci/5,114944,14025881,Turcja__Tysiace_ludzi_na_ulicach__starcia_z_policja.html?i=17
			*/
			self.sectionToBeAttached = "#gazeta_article_image img,#gazeta_article_body, div[id*='gazeta_article_image_']:not('#gazeta_article_image_overlay')";
			console.log("jestesmy na stronie z galeria #pagetype_art_blog (2)");
			start();
		} else if($("body#pagetype_art").length > 0) {
			/*
			Regresja
			http://lublin.gazeta.pl/lublin/56,35640,13282657,I_plug_nie_dawal_rady,,2.html
			*/
			console.log("jestesmy na stronie z galeria #pagetype_art (3)");
			self.sectionToBeAttached = "#gazeta_article_image,#gazeta_article_body, div[id*='gazeta_article_image_']:not('#gazeta_article_image_overlay')"; // sekcja komentarza i obrazek
			start();

		} else if($("div#art div#container_gal").length > 0) {
			/*
			Regresja
			http://gazetapraca.pl/gazetapraca/56,90443,12057502,10_najdziwniejszych_powodow__dla_ktorych_rzucamy_prace.html
			*/

			console.log("jestesmy na stronie z gazetapraca.pl (4)");
			self.articleBodySelector = "#art";
			self.navigationPageNumberSelector = ".paging:first";
			self.sectionToBeRemovedSelector = "div#gal_navi_wrp, #gal_navi_wrp";
			self.navigationNextULRSelector = "#gal_btn_next a:first";
			self.sectionToBeAttached = "div#container_gal";
			start();

		} else if($("div#article div#article_body").length > 0) {
			/*
			Regresja
			http://wyborcza.pl/duzy_kadr/56,97904,12530404,Najlepsze_zdjecia_tygodnia.html
			*/
			console.log("jestesmy na stronie z galeria div#article div#article_body (5)");
			self.articleBodySelector = "#article_body";
			self.navigationNextULRSelector = "#gal_btn_next a:first";
			self.sectionToBeRemovedSelector = "#gal_navi_wrp"; // div#article ul,
			self.sectionToBeAttached = "div#container_gal";
			self.navigationPageNumberSelector = "#gal_navi .paging";
			start();
		} else if($("div#k1 div#k1p div#gal_outer").length > 0) {
			/*
			Regresja
			http://wyborcza.pl/51,75248,12537285.html?i=0
			*/
			console.log("jestesmy na stronie z galeria bez typu ('div#k1 div#k1p div#gal_outer') (6)");
			self.articleBodySelector = "div#gal_outer .description";
			self.navigationNextULRSelector = "li.btn_next a:first";
			self.sectionToBeRemovedSelector = "div#article ul, #gal_navi_wrp";
			self.sectionToBeAttached = "div#gal_picture, div.description, p.description";
			self.navigationPageNumberSelector = "#gal_navi .paging";
			$("div#gal_miniatures").empty();
			self.hasSlideNumbers = false;
			start();
		} else {
			console.log("Eliminator Slajdow: Tutaj nic nie mam do roboty ;(", document.location.hostname);
		}

		function start() {
            $("head").append($("<link>",{href: self.cssPath, type: "text/css", rel:"stylesheet"}));
            if($(self.sectionToBeAttached).width()>620){
				$("#content_wrap #columns_wrap #col_right").css("cssText", "float:none; position: inherit !important;");
			}
			var nextPageURL = $(self.navigationNextULRSelector).attr("href");
			console.log("link do nastepnej storny", nextPageURL);
			if(nextPageURL) {
				var imageContainerClass = 'noScroll';
				if(self.scrollableImageContainer) {
					imageContainerClass = 'scroll';
				}

				$(self.articleBodySelector).after($("<div>", {
					"class": imageContainerClass + ' imageContainer'
				}));
				self.imageContainer = $(self.articleBodySelector).parent().find(".imageContainer");
				bind();
				showSpinnier();
				$.get(nextPageURL, function(nextPage) {
					findNextSlideURL(nextPage, nextPageURL);
				});
			}
		}

		function showSpinnier() {
			$("div.imageContainer").append(self.spinner);
		}

		function hideSpinner() {
			$("div.imageContainer div.eliminatorSlajdowSpinner").remove();
		}

		function bind() {
            var imageContainer = $("div.imageContainer");
            imageContainer.on("click", "span.scrollSwitch", function() {
                imageContainer.toggleClass("noScroll").toggleClass("scroll");
				if(self.scrollableImageContainer) {
					console.log("slider switch OFF");
                    imageContainer.find("span.scrollSwitch").text("Pokaż pasek przewijania");
					$('html, body').animate({
						scrollTop: $(this).offset().top - 30
					}, 500);
					self.scrollableImageContainer = false;
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
					self.scrollableImageContainer = true;
				}
			});

			imageContainer.on("click", "span.bugreport", function() {
				window.open(bugReportUrl);
			});

            imageContainer.on("click", "p.headerLogo", function() {
                window.open(facebookUrl);
            });
		}

		function disableES(url) {
			if(url.indexOf("?") > -1) {
				return url.replace("?", "?es=off&");
			} else {
				return url + "?es=off";
			}
		}

		function findNextSlideURL(galleryPage, url) {
			hideSpinner();
			var articleSection = $(galleryPage).find(self.sectionToBeAttached);
			if($(articleSection).length > 0) {
				var pageNumber = $(galleryPage).find(self.navigationPageNumberSelector).text().split("/");
				console.log("numer strony", pageNumber);
				var nextPageURL = $(galleryPage).find(self.navigationNextULRSelector).attr("href");
				if(url===nextPageURL){
					console.log("Chyba cos jest zle. URL do nastepnego slajdu jest taki sam jak do obecnego :/");
					return;
				}
				var pageNumberLabel = "Ostatni slajd";
				if(pageNumber.length === 2) {
					pageNumberLabel = "Slajd " + pageNumber[0] + " z " + pageNumber[1];
				} else if(!self.hasSlideNumbers) {
					pageNumberLabel = "Slajd";
				}

				var slideHeader = $("<div>", {
					"class": "slideHeader slideHeader_" + pageNumber
				}).append($("<p>", {
					"class": "headerBar",
					text: pageNumberLabel
				}).append($("<span>", {
					"class": "scrollSwitch",
					text: ((self.scrollableImageContainer ? "Ukryj pasek przewijania" : "Pokaż pasek przewijania"))
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
					href: disableES(url),
					text: "Bezpośredni link"
				})))).append($("<p>", {
					"class": "headerLogo",
					text: 'Eliminator Slajdów',
                    style:"background-image:url('" + facebookIconUrl + "')"
				}));

				$(self.imageContainer).append(slideHeader);
				
				$(articleSection).find(self.sectionToBeRemovedSelector).empty();
				var slideWrapper = $(self.imageContainer).append($("<div>", {
					"class": "slide_" + pageNumber
				})).children().last();

				if($(galleryPage).find(self.headerSectionSelector).length === 1) {
					var desc = $(galleryPage).find(self.headerSectionSelector).html();
					$(slideWrapper).append($("<p>", {
						"class": "slideTitle",
						text: desc
					}));
				}

				$(slideWrapper).append($(articleSection));

				if((pageNumber.length === 2 && pageNumber[0] !== pageNumber[1]) || (!self.hasSlideNumbers && document.location.href.indexOf(nextPageURL) === -1)) {
					console.log("link do nastepnej storny", nextPageURL);
					showSpinnier();
					$.get(nextPageURL, function(nextPage) {
						findNextSlideURL(nextPage, nextPageURL);
					});
				} else {
					// ostatnia strona
					console.log("Ostatnia Strona");
					hideSpinner();
				}
				$(self.sectionToBeRemovedSelector).empty();
			}

			$(".imageContainer > div").css("float", "left").css("width", "100%");
            var imageContainer = $(".imageContainer");
            if(imageContainer.width() > 950){
				imageContainer.width(950);
            }
		}

		/* SHARED CODE END */
	}
})(jQuery);
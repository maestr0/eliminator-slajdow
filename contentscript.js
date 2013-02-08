(function($) {
	chrome.extension.sendRequest({
		"urlName": window.location.href
	}, function(response) {
		if(response.canRunOnCurrentUrl === true && document.location.href.toLowerCase().indexOf("es=off") === -1) {
			self.scrollableImageContainer = (response.scrollableImageContainer !== "off");
			eliminateSlides();
		}
	});
	this.scrollableImageContainer = false;
	this.spinningIconUrl = chrome.extension.getURL("ajax-loader.gif");


	/* SHARED CODE BEGIN */
	var self = this;
	this.imageContainer = null;
	this.sectionToBeRemovedSelector = ".navigation div, .navigation span.page, #gal_navi_wrp";
	this.navigationNextULRSelector = ".navigation .next:first";
	this.navigationPageNumberSelector = ".navigation .page:first";
	this.articleBodySelector = "#gazeta_article_body";
	this.sectionToBeAttached = "#gazeta_article_image img,#gazeta_article_body"; // sekcja komentarza i obrazek
	this.headerSectionSelector = ".navigation:first h1 span";
	this.hasSlideNumbers = true;

	this.spinner = $("<a>",{className: "eliminatorSlajdowSpinner"}).append("<img>",{src: self.spinningIconUrl});

	/* START HERE */

	function eliminateSlides() {

		if($("body#pagetype_photo").length > 0) {
			console.log("jestesmy na stronie z galeria #pagetype_photo (1)");
			$("#gazeta_article_miniatures").empty();
			loadImagesOnPage();
		} else if($("body#pagetype_art_blog").length > 0) {
			/*
				http://www.plotek.pl/plotek/56,78649,13096942,Kaja_Paschalska,,1.html
				http://www.plotek.pl/plotek/56,79592,12829011,Jako_dzieci_byli_gwiazdami_seriali__Co_dzis_robia.html
			*/
			self.sectionToBeAttached = "#gazeta_article_image img,#gazeta_article_body, div[id*='gazeta_article_image_']:not('#gazeta_article_image_overlay')";
			console.log("jestesmy na stronie z galeria #pagetype_art_blog (2)");
			loadImagesOnPage();
		} else if($("body#pagetype_art").length > 0) {
			/*
			Regresja
			http://lublin.gazeta.pl/lublin/56,35640,13282657,I_plug_nie_dawal_rady,,2.html
			*/
			console.log("jestesmy na stronie z galeria #pagetype_art (3)");
			this.sectionToBeAttached = "#gazeta_article_image img,#gazeta_article_body, #gazeta_article_image_new"; // sekcja komentarza i obrazek
			loadImagesOnPage();

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
			loadImagesOnPage();

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
			loadImagesOnPage();
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
			loadImagesOnPage();
		} else {
			console.log("Eliminator Slajdow: Tutaj nic nie mam do roboty ;(", document.location.hostname);
		}

		function loadImagesOnPage() {
			var nextPageURL = $(self.navigationNextULRSelector).attr("href");
			console.log("link do nastepnej storny", nextPageURL);
			if(nextPageURL) {
				var imageContainerStyle = 'float:left';
				if(self.scrollableImageContainer) {
					imageContainerStyle = 'display: inline-block;margin: 0 -25px 0 0;padding: 0 8px 0 0;height:1000px;overflow-y:scroll;';
				}

				$(self.articleBodySelector).after("<div style='" + imageContainerStyle + "' class='imageContainer'></div>");
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
			$("div.imageContainer p.eliminatorSlajdowSpinner").remove();
		}

		function bind() {
			$("div.imageContainer").on("click", "span.scrollSwitch", function() {
				if(self.scrollableImageContainer) {
					$("div.imageContainer").css("overflow-y", "").css("height", "");
					console.log("slider switch OFF");
					$("div.imageContainer span.scrollSwitch").text("Pokaż pasek przewijania");
					$('html, body').animate({
						scrollTop: $(this).offset().top - 30
					}, 500);
					self.scrollableImageContainer = false;
				} else {
					$("div.imageContainer").css("overflow-y", "scroll").css("height", "2000");
					console.log("slider switch ON");
					$("div.imageContainer span.scrollSwitch").text("Ukryj pasek przewijania");
					$('html, body').animate({
						scrollTop: $(".imageContainer").offset().top - 30
					}, 500);
					$('div.imageContainer').animate({
						scrollTop: 0
					}, 0);
					$('div.imageContainer').animate({
						scrollTop: $(this).offset().top - $('div.imageContainer').offset().top
					}, 500);
					self.scrollableImageContainer = true;
				}

				adjustImageContainerSize();
			});

			$("div.imageContainer").on("click", "span.bugreport", function() {
				window.open("https://code.google.com/p/lepsza-gazeta-pl/issues/list?hl=pl");
			});



		}

		function disableES(url) {
			if(url.indexOf("?") > -1) {
				return url.replace("?", "?es=off&");
			} else {
				return url + "?es=off";
			}
		}

		function adjustImageContainerSize() {
			var contentHeight = 0;
			$("div.imageContainer").children().each(function() {
				contentHeight += $(this).height();
			});
			if(contentHeight < $("div.imageContainer").height()) {
				$("div.imageContainer").height('auto');
			}
		}

		function findNextSlideURL(galleryPage, url) {
			hideSpinner();
			var articleSection = $(galleryPage).find(self.sectionToBeAttached);
			if($(articleSection).length > 0) {
				pageNumber = $(galleryPage).find(self.navigationPageNumberSelector).text().split("/");
				console.log("numer strony", pageNumber);
				nextPageURL = $(galleryPage).find(self.navigationNextULRSelector).attr("href");
				var pageNumberLabel = "Ostatni slajd";
				if(pageNumber.length === 2) {
					pageNumberLabel = "Slajd " + pageNumber[0] + " z " + pageNumber[1];
				} else if(!self.hasSlideNumbers) {
					pageNumberLabel = "Slajd";
				}

				$(self.imageContainer).append("<div style='float:left;width:100%;margin-bottom:10px' class='slideNumber_" + pageNumber + //
				"'><p style='font-size: 12px;background: grey;padding: 3px;padding-left: 10px;border-radius: 42px;height: 14px;color: white;'>" + //
				pageNumberLabel + "<span class='scrollSwitch' style='cursor: pointer;float:right;margin-right:10px;color:white'>" + //
				(self.scrollableImageContainer ? "Ukryj pasek przewijania" : "Pokaż pasek przewijania") + //
				"</span><span style='color:white;float:right;margin-right: 5px;'>|</span>" + //
				"<span class='bugreport' style='color:white;cursor: pointer;float:right;margin-right:5px'>" + //
				"Zgłoś problem</span>" + //
				"<span style='color:white;float:right;margin-right: 5px;'>|</span>" + //
				"<span class='directLink' style='cursor: pointer;float:right;margin-right:5px;color:white'>" + //
				"<a style='color:white;text-decoration:none' target='_blank' href='" + disableES(url) + "'>Bezpośredni link<a></span>" + //
				"</p>" + //
				// FIXME: slaby pomysl na pozbycie sie a:hover :/
				"<p style='margin-top:1px;float: right;font-size: 9px;'>Eliminator Slajdów</p></div>").find("span.directLink a").hover(function() {
					$(this).css('background', 'grey');
				});

				var desc = $(galleryPage).find(self.headerSectionSelector).html();
				if(desc) {
					$(self.imageContainer).append("<p style='padding:20px;font-size:20px;'>" + desc + "</p>");
				}
				$(articleSection).find(self.sectionToBeRemovedSelector).empty();
				$(self.imageContainer).append($(articleSection));

				if((pageNumber.length === 2 && pageNumber[0] !== pageNumber[1]) || (!self.hasSlideNumbers && document.location.href.indexOf(nextPageURL) === -1)) {
					console.log("link do nastepnej storny", nextPageURL);
					showSpinnier();
					$.get(nextPageURL, function(nextPage) {
						findNextSlideURL(nextPage, nextPageURL);
					});
				} else {
					// ostatnia strona
					console.log("Ostatnia Strona");
					adjustImageContainerSize();
				}
				$(self.sectionToBeRemovedSelector).empty();
			}

			$(".imageContainer > div").css("float", "left").css("width", "100%");
			if($(".imageContainer").width() > 950) {
				$(".imageContainer").width(950);
			}
		}

		function escapeHTML(str) str.replace(/[&"<>]/g, function (m) ({ "&": "&amp;", '"': "&quot", "<": "&lt;", ">": "&gt;" })[m]);

		/* SHARED CODE END */
	}
})(jQuery);
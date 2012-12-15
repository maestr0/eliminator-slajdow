(function($) {
	var self = this;
	this.imageContainer;
	this.sectionToBeRemovedSelector = ".navigation div";
	this.navigationNextULRSelector = ".navigation .next:first";
	this.navigationPageNumberSelector = ".navigation .page:first";
	this.articleBodySelector = "#gazeta_article_body";
	this.sectionToBeAttached = "#gazeta_article_image img,#gazeta_article_body"; // sekcja komentarza i obrazek
	this.headerSectionSelector = ".navigation:first h1 span";
	this.hasSlideNumbers = true;

	chrome.extension.sendRequest({
		"urlName": window.location.hostname
	}, function(response) {
		if(response.canRunOnCurrentUrl === true){
			eliminateSlides();
		}
	});

	/*
	RUN EXTENSION ON CURRENT URL
*/
	function eliminateSlides() {

		if ($("body#pagetype_photo").length > 0) {
			console.log("jestesmy na stronie z galeria #pagetype_photo");
			$("#gazeta_article_miniatures").empty();
			loadImagesOnPage();
		} else if ($("body#pagetype_art_blog").length > 0) {
			console.log("jestesmy na stronie z galeria #pagetype_art_blog");
			loadImagesOnPage();
		} else if ($("body#pagetype_art").length > 0) {
			console.log("jestesmy na stronie z galeria #pagetype_art");
			loadImagesOnPage();

		} else if ($("div#art div#container_gal").length > 0) {
			/*
			Regresja
			http://gazetapraca.pl/gazetapraca/56,90443,12057502,10_najdziwniejszych_powodow__dla_ktorych_rzucamy_prace.html
			*/	

			console.log("jestesmy na stronie z gazetapraca.pl");
			self.articleBodySelector = "#art";
			self.navigationPageNumberSelector = ".paging:first";
			self.sectionToBeRemovedSelector = "div#gal_navi_wrp";
			self.navigationNextULRSelector = "#gal_btn_next a:first";
			self.sectionToBeAttached = "div#container_gal";
			loadImagesOnPage();

		} else if ($("div#article div#article_body").length > 0) {
			/*
			Regresja
			http://wyborcza.pl/duzy_kadr/56,97904,12530404,Najlepsze_zdjecia_tygodnia.html
			*/			
			console.log("jestesmy na stronie z galeria div#article div#article_body");
			self.articleBodySelector = "#article_body";
			self.navigationNextULRSelector = "#gal_btn_next a:first";
			self.sectionToBeRemovedSelector = "div#article ul";
			self.sectionToBeAttached = "div#container_gal";
			self.navigationPageNumberSelector = "#gal_navi .paging";
			loadImagesOnPage();
		} else if ($("div#k1 div#k1p div#gal_outer").length > 0) {
			/*
			Regresja
			http://wyborcza.pl/51,75248,12537285.html?i=0
			*/
			console.log("jestesmy na stronie z galeria bez typu ('div#k1 div#k1p div#gal_outer')");
			self.articleBodySelector = "div#gal_outer .description";
			self.navigationNextULRSelector = "li.btn_next a:first";
			self.sectionToBeRemovedSelector = "div#article ul";
			self.sectionToBeAttached = "div#gal_picture, div.description, p.description";
			self.navigationPageNumberSelector = "#gal_navi .paging";
			$("div#gal_miniatures").empty();
			self.hasSlideNumbers = false;
			loadImagesOnPage();
		} else {
			console.log("Nic mi nie pasuje ;(", document.location.hostname);
		}

		function loadImagesOnPage() {
			$(articleBodySelector).after("<div class='imageContainer'></div>");
			self.imageContainer = $(articleBodySelector).parent().find(".imageContainer");
			var nextPageURL = $(self.navigationNextULRSelector).attr("href");
			console.log("link do nastepnej storny", nextPageURL);
			if (nextPageURL) {
				$.get(nextPageURL, function(nextPage) {
					findNextSlideURL(nextPage);
				});
			}
		}

		function findNextSlideURL(galleryPage) {
			articleSection = $(galleryPage).find(self.sectionToBeAttached);
			if ($(articleSection).length > 0) {
				$(self.imageContainer).append("<p style='padding:20px;font-size:20px;'>" + $(galleryPage).find(self.headerSectionSelector).text() + "</p>");
				$(articleSection).find(self.sectionToBeRemovedSelector).empty();
				$(self.imageContainer).append($(articleSection));
				pageNumber = $(galleryPage).find(self.navigationPageNumberSelector).text().split("/");
				console.log("numer strony", pageNumber);
				nextPageURL = $(galleryPage).find(self.navigationNextULRSelector).attr("href");

				if ((pageNumber.length === 2 && pageNumber[0] !== pageNumber[1]) || 
					( !hasSlideNumbers && document.location.href.indexOf(nextPageURL)===-1)) {					
					console.log("link do nastepnej storny", nextPageURL);
					$.get(nextPageURL, function(nextPage) {
						findNextSlideURL(nextPage);
					});
				}
				$(self.sectionToBeRemovedSelector).empty();
			}
		}

	}
})(jQuery);
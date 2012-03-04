var self = this;
var imageContainer;

if($("body#pagetype_photo").length > 0){
	console.log("jestesmy na stronie z galeria #pagetype_photo");
	$("#gazeta_article_miniatures").empty();
	imageContainer = $("#gazeta_article_miniatures");
	$.get($(".navigation .first").attr("first"), function(nextPage){
		findImageURL(nextPage);
	});
	$(".navigation").empty();
}else if($("body#pagetype_art_blog").length>0){
	console.log("jestesmy na stronie z galeria #pagetype_art_blog");
	$("#gazeta_article_body").after("<div class='imageContainer'></div>");
	imageContainer = $("#gazeta_article").find(".imageContainer");
	$.get($(".navigation .next:first").attr("href"), function(nextPage){
		findImageURL(nextPage);
	});
	$(".navigation").empty();
}


function findImageURL(galleryPage){
	image  = $(galleryPage).find("#gazeta_article_image img,#gazeta_article_body");
	if($(image).length>0){
		imgSrc = $(image).attr("src");
		console.log("Znaleziono Obrazek SRC=",imgSrc);		
		$(self.imageContainer).append("<p style='padding:20px;font-size:20px;'>"+ $(galleryPage).find(".navigation:first h1 span").text() +"</p>");
		$(self.imageContainer).append($(image));		
		pageNumber = $(galleryPage).find(".navigation .page:first").text().split("/");
		if(pageNumber.length==2 && pageNumber[0]!=pageNumber[1]){
			nextPageURL = $(galleryPage).find(".navigation .next:first").attr("href");
			$.get(nextPageURL, function(nextPage){
				findImageURL(nextPage);
			});
		}
	}	
}
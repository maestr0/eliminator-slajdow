(function ($) {
    $("body").eliminatorSlajdow({
        imageBaseUrl: 'https://dl.dropboxusercontent.com/u/24730581/eliminator_slajdow_assets/',
        cssPath: 'https://db.tt/Uz2u90pB',
        debug: false,
        version: "3.1.39-userscript",
        debug: (document.location.href.indexOf("es_debug=1") > -1),
        facebookUrl: "https://www.facebook.com/eliminator-slajdow?ref=safari.extension",
        bugReportUrl: "http://eliminator-slajdow.herokuapp.com/?ref=safari.extension"
    });
})(jQuery.noConflict(true));
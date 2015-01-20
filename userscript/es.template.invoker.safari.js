(function ($) {
    $("body").eliminatorSlajdow({
        imageBaseUrl: 'https://dl.dropboxusercontent.com/u/24730581/eliminator_slajdow_assets/',
        debug: false,
        version: "3.1.39-safari",
        debug: (document.location.href.indexOf("es_debug=1") > -1),
        facebookUrl: "https://www.facebook.com/eliminator-slajdow?ref=safari.extension",
        bugReportUrl: "http://eliminator-slajdow.herokuapp.com/?ref=safari.extension"
    });
})(jQuery.noConflict(true));
(function ($) {
    $("body").eliminatorSlajdow({
        imageBaseUrl: 'https://db.tt/qXVKxJQa',
        debug: false,
        debug: (document.location.href.indexOf("es_debug=1") > -1),
        facebookUrl: "https://www.facebook.com/eliminator-slajdow?ref=safari.extension",
        bugReportUrl: "http://eliminator-slajdow.herokuapp.com/?ref=safari.extension"
    });
})(jQuery.noConflict(true));
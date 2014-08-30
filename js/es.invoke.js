(function ($) {
    $("body").eliminatorSlajdow({
        imageBaseUrl: 'http://localhost:9000/assets/javascripts/',
        debug: false,
        debug: (document.location.href.indexOf("es_debug=1") > -1)
    });
})(jQuery.noConflict(true));
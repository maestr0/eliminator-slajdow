self.port.on("es-start", function (config) {
    console.log("ES-START event received in Content Script");
    (function ($) {
        if (window.frameElement === null) {
            $("body").eliminatorSlajdow({
                imageBaseUrl: config.imageBaseUrl,
                cssPath: config.cssUrl,
                facebookUrl: "https://www.facebook.com/eliminator-slajdow?ref=ff.extension",
                bugReportUrl: "http://eliminator-slajdow.herokuapp.com/?ref=ff.extension",
                trackingCallback: function (category, action) {
                    console.log("Tracking not implemented in FF");
                },
                debug: (document.location.href.indexOf("es_debug=1") > -1),
                version: config.version
            });
        }
        return false;
    })(jQuery.noConflict(true));
});

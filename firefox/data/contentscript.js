self.port.on("es-start", function (config) {
    (function ($) {
        if (window.frameElement === null) {
            $("body").eliminatorSlajdow({
                imageBaseUrl: config.imageBaseUrl,
                cssPath: config.cssUrl,
                facebookUrl: "https://www.facebook.com/eliminator-slajdow?ref=ff.extension",
                bugReportUrl: "http://eliminator-slajdow.herokuapp.com/?ref=ff.extension",
                trackingCallback: function (category, action) {},
                debug: (document.location.href.indexOf("es=debug") > -1),
                version: config.version
            });
        }
        return false;
    })(jQuery.noConflict(true));
});

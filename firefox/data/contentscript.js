(function ($) {
    self.on('message', function (config) {
        $.each(config.storage, function (allowedHost, enabled) {
            if (window.frameElement === null && enabled && window.location.hostname.indexOf(allowedHost) != -1 && document.location.href.toLowerCase().indexOf("es=off") === -1) {
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
                return false;
            }
        });
    });
})(jQuery.noConflict(true));
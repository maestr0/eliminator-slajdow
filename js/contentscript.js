(function ($) {
    chrome.extension.sendRequest({"urlName": window.location.href},
        function (response) {
            if (response.canRunOnCurrentUrl === true && document.location.href.toLowerCase().indexOf("es=off") === -1) {
                $("body").eliminatorSlajdow({
                    imageBaseUrl: chrome.extension.getURL("images/"),
                    trackingCallback: function (category, action, location) {
                        chrome.extension.sendRequest({"tracking": category, "action": action, "location": location});
                    },
                    debug: (document.location.href.indexOf("es_debug=1") > -1),
                    version: response.version
                });
            }
        });
})(jQuery.noConflict(true));

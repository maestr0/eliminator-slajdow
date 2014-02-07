(function ($) {
    chrome.extension.sendRequest({"urlName": window.location.href},
        function (response) {
            if (response.canRunOnCurrentUrl === true && document.location.href.toLowerCase().indexOf("es=off") === -1) {
                $("body").eliminatorSlajdow({
                    scrollableImageContainer: (response.scrollableImageContainer === "on"),
                    spinningIconUrl: chrome.extension.getURL("images/ajax-loader.gif"),
                    facebookIconUrl: chrome.extension.getURL("images/facebook_icon.svg"), 
                    esLogoUrl: chrome.extension.getURL("images/es_logo.svg"),
                    trackingCallback: function (category, action, location) {
                        chrome.extension.sendRequest({"tracking": category, "action": action, "location": location});
                    }
                });
            }
        });
})(jQuery.noConflict(true));

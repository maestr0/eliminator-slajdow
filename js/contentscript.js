(function ($) {
    /* CHROME SPECIFIC CODE */
    chrome.extension.sendRequest({"urlName": window.location.href},
        function (response) {
            if (response.canRunOnCurrentUrl === true && document.location.href.toLowerCase().indexOf("es=off") === -1) {
                $("body").eliminatorSlajdow({
                    scrollableImageContainer: (response.scrollableImageContainer === "on"),
                    spinningIconUrl: chrome.extension.getURL("images/ajax-loader.gif"),
                    facebookIconUrl: chrome.extension.getURL("images/icon_facebook.gif"),
                    esLogoUrl: chrome.extension.getURL("images/icon_16.png"),
                    trackingCallback: function (category, action) {
                        chrome.extension.sendRequest({"tracking": category, "action": action});
                    }
                });
            }
        });
})(jQuery.noConflict(true));

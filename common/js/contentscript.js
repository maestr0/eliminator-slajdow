(function ($) {
    console.log("Eliminator Slajdow Content Script");
    browser.runtime.sendMessage({"urlName": window.location.href})
        .then(function (response) {
            if (response.canRunOnCurrentUrl === true && document.location.href.toLowerCase().indexOf("es=off") === -1) {
                $("body").eliminatorSlajdow({
                    imageBaseUrl: browser.runtime.getURL("images/"),
                    trackingCallback: function (category, action, location) {
                        browser.runtime.sendRequest({"tracking": category, "action": action, "location": location});
                    },
                    debug: (document.location.href.indexOf("es=debug") > -1),
                    version: response.version + "-firefox"
                });
            }
        });
})(jQuery.noConflict(true));

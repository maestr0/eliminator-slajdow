(function () {
    log("Eliminator Slajdow Content Script Firefox edition");

    // chrome.runtime.sendMessage({"urlName": window.location.href});

    chrome.runtime.onMessage.addListener(function (response) {
        if (response.canRunOnCurrentUrl) {
            log("Loading Eliminator Slajdow Content Script...");
        } else {
            log("Eliminator Slajdow is disabled on this URL");
        }
    });

    function isDevMode() {
        return document.location.href.toLowerCase().indexOf("es=dev") > 0;
    }

    function log(msg) {
        if (document.location.href.toLowerCase().indexOf("es=debug") > 0 || isDevMode()) {
            console.log(msg);
        }
    }
})();

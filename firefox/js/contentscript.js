(function () {
    log("Eliminator Slajdow Content Script Firefox edition");
    browser.runtime.sendMessage({"urlName": window.location.href})
        .then(function (response) {
            if (response.canRunOnCurrentUrl === true && document.location.href.toLowerCase().indexOf("es=off") === -1) {
                log("Loading Eliminator Slajdow Content Script...");
            } else {
                log("Eliminator Slajdow is disabled on this URL");
            }
        });

    function log(msg) {
        if (document.location.href.toLowerCase().indexOf("es=debug")) {
            console.log(msg);
        }
    }
})();

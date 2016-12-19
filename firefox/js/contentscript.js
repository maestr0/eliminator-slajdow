(function () {
    log("Eliminator Slajdow Content Script Firefox edition");
    function loadESScriptFromCDN() {
        function loadScript(url, callback) {

            var script = document.createElement("script")
            script.type = "text/javascript";
            script.onreadystatechange = callback;
            script.onload = callback;

            script.src = url;
            document.getElementsByTagName("head")[0].appendChild(script);
        }

        var esScript = isDevMode() ? "http://localhost:8000/eliminator-slajdow.js" : "http://cdn.eliminator-slajdow.raszewski.info.s3-website-eu-west-1.amazonaws.com/eliminator-slajdow.js";

        loadScript(esScript, function () {
            ES.start();
            console.log("Eliminator Slajdow script loaded!");
        });
    }

    browser.runtime.sendMessage({"urlName": window.location.href})
        .then(function (response) {
            if (response.canRunOnCurrentUrl) {
                log("Loading Eliminator Slajdow Content Script...");
                loadESScriptFromCDN();
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

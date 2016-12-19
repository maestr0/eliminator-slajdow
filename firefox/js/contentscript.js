(function () {
    log("Eliminator Slajdow Content Script Firefox edition");
    function loadESScriptFromCDN() {
        function loadScript(url, callback) {

            var script = document.createElement("script")
            script.type = "text/javascript";

            if (script.readyState) {  //IE
                script.onreadystatechange = function () {
                    if (script.readyState == "loaded" ||
                        script.readyState == "complete") {
                        script.onreadystatechange = null;
                        callback();
                    }
                };
            } else {  //Others
                script.onload = function () {
                    callback();
                };
            }

            script.src = url;
            document.getElementsByTagName("head")[0].appendChild(script);
        }

        var esScript = "http://cdn.eliminator-slajdow.raszewski.info.s3-website-eu-west-1.amazonaws.com/eliminator-slajdow.js";

        loadScript(esScript, function () {
            console.log("Eliminator Slajdow script loaded!");
            $("body").eliminatorSlajdow({
                imageBaseUrl: browser.runtime.getURL("images/"),
                debug: (document.location.href.indexOf("es=debug") > -1),
                version: "FIXME-firefox"
            });
        });

    }

    browser.runtime.sendMessage({"urlName": window.location.href})
        .then(function (response) {
            if (response.canRunOnCurrentUrl === true && document.location.href.toLowerCase().indexOf("es=off") === -1) {
                log("Loading Eliminator Slajdow Content Script...");
                loadESScriptFromCDN();
            } else {
                log("Eliminator Slajdow is disabled on this URL");
            }
        });

    function log(msg) {
        if (document.location.href.toLowerCase().indexOf("es=debug") > 0) {
            console.log(msg);
        }
    }
})();

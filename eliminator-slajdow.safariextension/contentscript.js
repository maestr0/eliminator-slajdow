if (window.top === window) {
    console.log("ELIMINATOR SLAJDOW DLA SAFARI");

    function loadScript(url, callback) {
        // Adding the script tag to the head as suggested before
        var head = document.getElementsByTagName('body')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;

        // Then bind the event to the callback function.
        // There are several events for cross browser compatibility.
//        script.onreadystatechange = callback;
        script.onload = callback;

        // Fire the loading
        head.appendChild(script);
    }

    function loadCss(filename) {
        var fileref = document.createElement("link")
        fileref.setAttribute("rel", "stylesheet")
        fileref.setAttribute("type", "text/css")
        fileref.setAttribute("href", filename)
        document.getElementsByTagName("head")[0].appendChild(fileref)
    }

    loadCss("http://localhost:9000/assets/javascripts/es.css");
    loadScript("http://localhost:9000/assets/javascripts/es.standalone.js", function () {
        console.log("ES loaded");
    })
}
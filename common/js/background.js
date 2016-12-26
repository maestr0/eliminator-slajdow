// Listen for the content script to send a message to the background page.
browser.runtime.onMessage.addListener(onMessageListener);

function onMessageListener(request, sender, sendResponse) {
    if (location.hostname == sender.id && request.urlName !== undefined) {
        sendResponse({
            "canRunOnCurrentUrl": canRunOnCurrentUrl(request.urlName),
            "version": getVersion()
        });
    } else if (location.hostname == sender.id && request.tracking !== undefined) {
        trackingBeacon(request.tracking, request.action, request.location);
        sendResponse({
            "status": "ok"
        });
    }
}
// Return nothing to let the connection be cleaned up.

function canRunOnCurrentUrl(url) {
    var canRunHere = false;
    var allowedDomains = JSON.parse(localStorage.allowedDomains);
    $.each(allowedDomains, function (allowedHost, enabled) {
        if (url.indexOf(allowedHost) != -1) {
            if (enabled) {
                console.log('Eliminator Slajdow aktywny na: ' + allowedHost);
                canRunHere = true;
            } else {
                console.log('Eliminator Slajdow wylaczony na: ' + allowedHost);
                canRunHere = -1; // flag indicating that the extension is disabled on the current url
            }
            return false;
        }
    });
    return canRunHere && url.indexOf("es=off") === -1;
}
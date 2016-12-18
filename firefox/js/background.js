// Listen for the content script to send a message to the background page.
browser.runtime.onMessage.addListener(onMessageListener);

function onMessageListener(request, sender, sendResponse) {
    if (location.hostname == sender.id && request.urlName !== undefined) {
        var activate = canRunOnCurrentUrl(request.urlName);
        sendResponse({
            "canRunOnCurrentUrl": activate,
            "version": "123"
        });
    }
}
// Return nothing to let the connection be cleaned up.

function canRunOnCurrentUrl(hostname) {
    var canRunHere = false;
    var allowedDomains = JSON.parse(localStorage.allowedDomains);
    $.each(allowedDomains, function (allowedHost, enabled) {
        if (hostname.indexOf(allowedHost) != -1) {
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
    return canRunHere;
}
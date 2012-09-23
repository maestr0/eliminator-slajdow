var lastTabId = 0;


//chrome.tabs.onSelectionChanged.addListener(checkForValidUrl);

/*
	function(tabId) {
	lastTabId = tabId;
	var icon = 'icon_48.jpg';
	chrome.pageAction.setIcon({
		path: icon,
		tabId: tabId
	});
});



chrome.tabs.getSelected(null, function(tab) {
	lastTabId = tab.id;
	chrome.pageAction.show(lastTabId);
});

*/

// Called when the url of a tab changes.

function checkForValidUrl(tabId, changeInfo, tab) {
	if (canRunOnCurrentUrl(tab.url) && localStorage['showIcon']!=="off") {

		var icon = 'icon_48.jpg';
		chrome.pageAction.setIcon({
			path: icon,
			tabId: tabId
		});

		chrome.pageAction.show(tabId);

	} else {
		chrome.pageAction.hide(tabId);
	}
};

// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(checkForValidUrl);

function onRequest(request, sender, sendResponse) {

	if (location.hostname == sender.id && request.urlName != undefined) {
		sendResponse({
			"canRunOnCurrentUrl": canRunOnCurrentUrl(request.urlName)
		});
	}
};
// Return nothing to let the connection be cleaned up.

function canRunOnCurrentUrl(hostname) {
	if(localStorage['extensionStatus']==="off"){
		return false;
	}

	var canRunHere = false;
	var allowedDomains = JSON.parse(localStorage['allowedDomains']);
	$.each(allowedDomains, function(allowedHost,enabled) {
		if (enabled && hostname.indexOf(allowedHost) != -1) {
			console.log('Rozszerzenie "Wszystkie zdjęcia na raz. GALERIA gazeta.pl" aktywne na: ' + allowedHost);
			canRunHere = true;
			return false;
		};
	});
	return canRunHere;
}

// Listen for the content script to send a message to the background page.
chrome.extension.onRequest.addListener(onRequest);


function onInstall() {
	console.log("Zainstalowano rozszerzenie 'Wszystkie zdjęcia na raz. GALERIA gazeta.pl'");
	updateAllowedDomainList();
}

function onUpdate(prevVersion) {
	console.log("Aktualizacja rozszerzenia 'Wszystkie zdjęcia na raz. GALERIA gazeta.pl'");
	updateAllowedDomainList();
}

function getVersion() {
	var details = chrome.app.getDetails();
	return details.version;
}

// Check if the version has changed.
var currVersion = getVersion();
var prevVersion = localStorage['version']
if (currVersion != prevVersion) {
	// Check if we just installed this extension.
	if (typeof prevVersion == 'undefined') {
		onInstall();
	} else {
		onUpdate(prevVersion);
	}
	localStorage['version'] = currVersion;
}

function updateAllowedDomainList() {
	var standardAllowedDomains = new Array("gazeta.pl", "tokfm.pl", "gazetapraca.pl", "moto.pl", "plotek.pl", "deser.pl", "www.sport.pl", "wyborcza.pl", "gazetadom.pl", "www.logo24.pl", "wyborcza.biz", "lula.pl", "tuba.pl", "www.edziecko.pl", "czterykaty.pl", "www.alert24.pl", "www.kotek.pl", "polygamia.pl", "www.popcorner.pl", "www.wysokieobcasy.pl", "www.e-ogrody.pl", "ladnydom.pl", "bryla.gazetadom.pl", "gazetapraca.pl", "www.metropraca.pl", "pracawbiurze.pl", "www.zczuba.pl", "www.ciacha.net", "wyborcza.pl", "namonciaku.pl", "sport.pl", "magazyn-kuchnia.pl")
	localStorage['standardAllowedDomains'] = JSON.stringify(standardAllowedDomains);
	var allowedDomains = JSON.parse(localStorage['allowedDomains']);

	$.each(standardAllowedDomains, function(index, host) {

		if (typeof allowedDomains[host] == "undefined") {
			allowedDomains[host] = true;
		}
	});
	localStorage['allowedDomains'] = JSON.stringify(allowedDomains);
}
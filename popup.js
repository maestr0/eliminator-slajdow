var self = this;

var fnSortAllowedDomainsList = function() {
		var mylist = $('#domainList');
		var listitems = mylist.children('li').get();
		listitems.sort(function(a, b) {
			return $(a).text().toUpperCase().localeCompare($(b).text().toUpperCase());
		});
		$.each(listitems, function(idx, itm) {
			mylist.append(itm);
		});
	};

var allowedDomains = JSON.parse(localStorage['allowedDomains']);

var fnBindEvents = function() {
		$('#domainList').on("click", "button", function(button) {
			event.preventDefault();
			$(this).parent().parent().hide(500);
			var text = $(this).parent().parent().attr("data-value");
			delete allowedDomains[text];
			localStorage['allowedDomains'] = JSON.stringify(allowedDomains);
		});

		$('#domainList').on("click", "input", function(button) {
			var selected = $(this).is(':checked');
			$(this).parent().parent().toggleClass("disabled");
			var text = $(this).parent().parent().attr("data-value");
			allowedDomains[text] = selected;
			localStorage['allowedDomains'] = JSON.stringify(allowedDomains);
		});

		$('#addNewDomain').click(function(button) {
			var newDomain = $("#newDomain").val();
			if (newDomain !== "") {
				allowedDomains[newDomain] = true;
				$("#newDomain").val("");
			}
			localStorage['allowedDomains'] = JSON.stringify(allowedDomains);
			$("#domainList").empty();
			fnGenerateDomainList();
		});

		$('#defaultSettings').click(function(button) {
			var standardAllowedDomains = JSON.parse(localStorage['standardAllowedDomains']);
			var allowedDomains = JSON.parse(localStorage['allowedDomains']);
			$.each(standardAllowedDomains, function(index, host) {
				if (typeof allowedDomains[host] == "undefined") {
					allowedDomains[host] = true;
				}
			});
			localStorage['allowedDomains'] = JSON.stringify(allowedDomains);
			$("#domainList").empty();
			fnGenerateDomainList();
		});



	};

var fnGenerateDomainList = function() {
		var allowedDomains = JSON.parse(localStorage['allowedDomains']);
		$.each(allowedDomains, function(allowedHost, enabled) {
			//$("#domainList").append('</li>', {text: allowedHost, class: 'status_' + enabled});
			$("#domainList").append('<li class="ui-widget-content ' + (enabled ? "" : "disabled") + '" data-value="' + allowedHost + '">' + allowedHost + '<span><input type="checkbox" ' + (enabled ? ' checked ' : '') + '>Aktywna</input><button>Kasuj</button></span></li>');
		});
		fnSortAllowedDomainsList();

		fnBindEvents();
	};



$("#options").accordion({
	autoHeight: false,
	navigation: false
});

fnGenerateDomainList();

function changeStatus() {
	chrome.tabs.getSelected(null, function(tab) {
		var icon = 'fr.ico';
		if (self.getStatus('extensionStatus') === 'on') {
			icon = 'fr_off.ico';
		}
		chrome.pageAction.setIcon({
			path: icon,
			tabId: tab.id
		});
		console.debug('icon=' + icon);
	});
}

$('a.switch').each(function(index, item) {
	var id = $(item).attr("id");

	$(item).iphoneSwitch(self.getStatus(id), function() {
		localStorage.setItem(id, "on");
		console.log(id + " = on");
	}, function() {
		localStorage.setItem(id, "off");
		console.log(id + " = off");
	}, {
		switch_on_container_path: 'iphone_switch_container_off.png'
	});

});

function getStatus(key) {
	var extensionStatus = localStorage[key];
	if (typeof extensionStatus === 'undefined') {
		extensionStatus = "off";
	}
	return extensionStatus;
}
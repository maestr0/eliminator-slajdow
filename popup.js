var self = this;

var fnSortAllowedDomainsList = function() {
		var mylist = $('#domainList');
		var listitems = mylist.children('li').get();
		listitems.sort(function(a, b) {
			return $(a).text().toUpperCase().localeCompare($(b).text().toUpperCase());
		})
		$.each(listitems, function(idx, itm) {
			mylist.append(itm);
		});
	}
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
			$(this).parent().parent().toggleClass("enabled_false");
			var text = $(this).parent().parent().attr("data-value");
			allowedDomains[text] = selected;
			localStorage['allowedDomains'] = JSON.stringify(allowedDomains);
		});
	}


$.each(allowedDomains, function(allowedHost, enabled) {
	//$("#domainList").append('</li>', {text: allowedHost, class: 'status_' + enabled});
	$("#domainList").append('<li class="ui-widget-content enabled_' + enabled + 
		'" data-value="' + allowedHost + '">' + allowedHost + 
		'<span><input type="checkbox" ' + (enabled ? ' checked ' : '' ) + '>Aktywna</input><button>Kasuj</button></span></li>');
});

fnSortAllowedDomainsList();

$("#domainList").selectable({
	disabled: true
});

fnBindEvents();

$("#options").accordion({
	autoHeight: false,
	navigation: true
});

/*
$('input, select').each(function(index, field) {
	var fieldId = $(field).attr("id");
	if (fieldId == null) {
		fieldId = $(this).attr("name");
	}
	var value = localStorage[fieldId];

	if (value != undefined && value != '') {
		$(field).val(value);
	}

});

$('input, select').change(function() {
	var fieldId = $(this).attr("id");
	if (fieldId == null) {
		fieldId = $(this).attr("name");
	}
	var value = $(this).val();
	localStorage[fieldId] = value;
	// Update status to let user know options were saved.
	$(this).animate({
		backgroundColor: "green"
	}, 600);
	var field = this;
	setTimeout(function() {
		$(field).animate({
			backgroundColor: "white"
		}, 600);
	}, 600);
	console.log('field changed ' + fieldId + '. New value=' + value);
});
*/

function changeStatus() {
	chrome.tabs.getSelected(null, function(tab) {
		var icon = 'fr.ico';
		if (self.getStatus('extensionStatus') == 'on') {
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
		console.log(id + " = on")
	}, function() {
		localStorage.setItem(id, "off");
		console.log(id + " = off")
	}, {
		switch_on_container_path: 'iphone_switch_container_off.png'
	});

});

function getStatus(key) {
	var extensionStatus = localStorage[key];
	if (extensionStatus == undefined) {
		extensionStatus = "on";
	}
	return extensionStatus;
}
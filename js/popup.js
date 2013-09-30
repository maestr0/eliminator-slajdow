(function () {
    var POPUP = {
        self: this,
        allowedDomains: JSON.parse(localStorage.allowedDomains),
        fnSortAllowedDomainsList: function () {
            var mylist = $('#domainList');
            var listitems = mylist.children('li').get();
            listitems.sort(function (a, b) {
                return $(a).text().toUpperCase().localeCompare($(b).text().toUpperCase());
            });
            $.each(listitems, function (idx, itm) {
                mylist.append(itm);
            });
        },
        fnBindEvents: function () {
            var that = this;

            $('#domainList').on("click", "button", function () {
                event.preventDefault();
                $(this).parent().parent().hide(500);
                var text = $(this).parent().parent().attr("data-value");
                delete this.allowedDomains[text];
                localStorage.allowedDomains = JSON.stringify(this.allowedDomains);
            });

            $('#domainList').on("click", "input", function () {
                var selected = $(this).is(':checked');
                $(this).parent().parent().toggleClass("disabled");
                var text = $(this).parent().parent().attr("data-value");
                this.allowedDomains[text] = selected;
                localStorage.allowedDomains = JSON.stringify(this.allowedDomains);
            });

            $('#addNewDomain').click(function () {
                var newDomain = $("#newDomain").val();
                if (newDomain !== "") {
                    this.allowedDomains[newDomain] = true;
                    $("#newDomain").val("");
                }
                localStorage.allowedDomains = JSON.stringify(this.allowedDomains);
                $("#domainList").empty();
                this.fnGenerateDomainList();
            });

            $('#defaultSettings').click(function () {
                    var standardAllowedDomains = JSON.parse(localStorage.standardAllowedDomains);
                    var allowedDomains = JSON.parse(localStorage.allowedDomains);
                    $.each(standardAllowedDomains, function (index, host) {
                        if (typeof this.allowedDomains[host] == "undefined") {
                            this.allowedDomains[host] = true;
                        }
                    });
                    localStorage.allowedDomains = JSON.stringify(this.allowedDomains);
                    $("#domainList").empty();
                    this.fnGenerateDomainList();
                }
            );

            $('a.switch').each(function (index, item) {
                var id = $(item).attr("id");
                $(item).iphoneSwitch(that.getStatus(id), function () {
                    localStorage.setItem(id, "on");
                    console.log(id + " = on");
                }, function () {
                    localStorage.setItem(id, "off");
                    console.log(id + " = off");
                });
            });

            $("#scrollableImageContainer").change(function () {
                that.changeStatus();
            });
        },

        fnGenerateDomainList: function () {
            var allowedDomains = JSON.parse(localStorage.allowedDomains);
            $.each(allowedDomains, function (allowedHost, enabled) {
                //$("#domainList").append('</li>', {text: allowedHost, class: 'status_' + enabled});
                $("#domainList").append('<li class="ui-widget-content ' + (enabled ? "" : "disabled") + '" data-value="' + allowedHost + '">' + allowedHost + '<span><input type="checkbox" ' + (enabled ? ' checked ' : '') + '>Aktywna</input><button>Kasuj</button></span></li>');
            });
            this.fnSortAllowedDomainsList();

            this.fnBindEvents();
        },
        changeStatus: function () {
            //noinspection JSUnresolvedFunction,JSUnresolvedVariable
            chrome.tabs.getSelected(null, function (tab) {
                var icon = 'fr.ico';
                if (self.getStatus('extensionStatus') === 'on') {
                    icon = 'fr_off.ico';
                }
                //noinspection JSUnresolvedFunction,JSUnresolvedVariable
                chrome.pageAction.setIcon({
                    path: icon,
                    tabId: tab.id
                });
                console.debug('icon=' + icon);
            });
        },
        getStatus: function (key) {
            var extensionStatus = localStorage[key];
            if (typeof extensionStatus === 'undefined') {
                extensionStatus = "off";
            }
            return extensionStatus;
        },
        init: function () {
            this.fnGenerateDomainList();
        }
    };

    POPUP.init();
})();

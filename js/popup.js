(function () {
    var POPUP = {
        self: this,
        allowedDomains: JSON.parse(localStorage.allowedDomains),
        $domainList: $('#domainList'),
        fnSortAllowedDomainsList: function () {
            var that = this;
            var listitems = this.$domainList.children('li').get();
            listitems.sort(function (a, b) {
                return $(a).text().toUpperCase().localeCompare($(b).text().toUpperCase());
            });
            $.each(listitems, function (idx, itm) {
                that.$domainList.append(itm);
            });
        },
        fnBindEvents: function () {
            var that = this;

            this.$domainList.on("click", "button", function () {
                event.preventDefault();
                $(this).parent().parent().hide(500);
                var text = $(this).parent().parent().attr("data-value");
                delete that.allowedDomains[text];
                localStorage.allowedDomains = JSON.stringify(that.allowedDomains);
            });

            this.$domainList.on("click", "input", function () {
                var selected = $(this).is(':checked');
                $(this).parent().parent().toggleClass("disabled");
                var text = $(this).parent().parent().attr("data-value");
                that.allowedDomains[text] = selected;
                localStorage.allowedDomains = JSON.stringify(that.allowedDomains);
            });

            $('#addNewDomain').click(function () {
                var newDomain = $("#newDomain").val();
                if (newDomain !== "") {
                    that.allowedDomains[newDomain] = true;
                    $("#newDomain").val("");
                }
                localStorage.allowedDomains = JSON.stringify(that.allowedDomains);
                that.$domainList.empty();
                that.fnGenerateDomainList();
            });

            $('#defaultSettings').click(function () {
                    var standardAllowedDomains = JSON.parse(localStorage.standardAllowedDomains);
                    var domains = JSON.parse(localStorage.allowedDomains);
                    $.each(standardAllowedDomains, function (index, host) {
                        if (typeof domains[host] == "undefined") {
                            domains[host] = true;
                        }
                    });
                    localStorage.allowedDomains = JSON.stringify(domains);
                    that.$domainList.empty();
                    that.fnGenerateDomainList();
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
            var that = this;
            var allowedDomains = JSON.parse(localStorage.allowedDomains);
            $.each(allowedDomains, function (allowedHost, enabled) {
                that.$domainList.append('<li class="ui-widget-content ' + (enabled ? "" : "disabled") +
                    '" data-value="' + allowedHost + '">' + allowedHost + '<span><input type="checkbox" ' +
                    (enabled ? ' checked ' : '') + '>Aktywna</input><button>Kasuj</button></span></li>');
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

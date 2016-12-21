(function () {
    var POPUP = {
        self: this,
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
            this.$domainList.on("click", "input", function () {
                var selected = $(this).is(':checked');
                $(this).parent().parent().toggleClass("disabled");
                var text = $(this).parent().parent().attr("data-value");

                browser.storage.local.get('allowedDomains').then((res)=> {
                    var ad = JSON.parse(res.allowedDomains)
                    ad[text] = selected;
                    browser.storage.local.set({
                        allowedDomains: JSON.stringify(ad)
                    });
                });
            });

            $('input[type=radio][name=status]').change(function () {
                browser.runtime.sendMessage({"status": this.value});
            });

            function logStorageChange(changes, area) {
                var changedItems = Object.keys(changes);
                for (item of changedItems) {
                    if (item === "status") {
                        var newValue = changes[item].newValue;
                        $("input:radio[value=" + newValue + "]").click();
                    }
                }
            }

            browser.storage.onChanged.addListener(logStorageChange);
        },
        fnGenerateDomainList: function () {
            var that = this;
            browser.storage.local.get('allowedDomains').then((res)=> {
                var allowedDomains = JSON.parse(res.allowedDomains);
                $.each(allowedDomains, function (allowedHost, enabled) {
                    that.$domainList.append('<li class="ui-widget-content ' + (enabled ? "" : "disabled") +
                        '" data-value="' + allowedHost + '">' + allowedHost + '<span><input type="checkbox" ' +
                        (enabled ? ' checked ' : '') + '>Aktywna</input></span></li>');
                });
                that.fnSortAllowedDomainsList();
            });
        },
        getStatus: function (key) {
            var extensionStatus = localStorage[key];
            if (typeof extensionStatus === 'undefined') {
                extensionStatus = "off";
            }
            return extensionStatus;
        },
        updateUI: function () {
            browser.storage.local.get(['version', 'status']).then((res)=> {
                $("#version").text(res.version);
                $("input:radio[value=" + res.status + "]").attr("checked", true);
            });
        },
        init: function () {
            this.fnGenerateDomainList();
            this.fnBindEvents();
            this.updateUI();
        }
    };
    POPUP.init();
})();
(function () {
    let POPUP = {
        self: this,
        $domainList: $('#domainList'),
        fnSortAllowedDomainsList: function () {
            let that = this;
            let listitems = this.$domainList.children('li').get();
            listitems.sort(function (a, b) {
                return $(a).text().toUpperCase().localeCompare($(b).text().toUpperCase());
            });
            $.each(listitems, function (idx, itm) {
                that.$domainList.append(itm);
            });
        },
        fnBindEvents: function () {
            this.$domainList.on("click", "input", function () {
                let selected = $(this).is(':checked');
                $(this).parent().parent().toggleClass("disabled");
                let text = $(this).parent().parent().attr("data-value");

                chrome.storage.sync.get('allowedDomains', (res) => {
                    let ad = JSON.parse(res.allowedDomains)
                    ad[text] = selected;
                    chrome.storage.sync.set({
                        allowedDomains: JSON.stringify(ad)
                    });
                });
            });

            $('input[type=radio][name=status]').change(function () {
                chrome.runtime.sendMessage({"status": this.value});
            });

            function logStorageChange(changes, area) {
                let changedItems = Object.keys(changes);
                for (let item of changedItems) {
                    if (item === "status") {
                        let newValue = changes[item].newValue;
                        $("input:radio[value=" + newValue + "]").click();
                    }
                }
            }

            chrome.storage.onChanged.addListener(logStorageChange);
        },
        fnGenerateDomainList: function () {
            let that = this;
            chrome.storage.sync.get('allowedDomains', (res) => {
                let allowedDomains = JSON.parse(res.allowedDomains);
                $.each(allowedDomains, function (allowedHost, enabled) {
                    that.$domainList.append('<li class="ui-widget-content ' + (enabled ? "" : "disabled") +
                        '" data-value="' + allowedHost + '">' + allowedHost + '<span><input type="checkbox" ' +
                        (enabled ? ' checked ' : '') + '>Aktywna</input></span></li>');
                });
                that.fnSortAllowedDomainsList();
            });
        },
        updateUI: function () {
            chrome.storage.sync.get(['version', 'status'], (res) => {
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

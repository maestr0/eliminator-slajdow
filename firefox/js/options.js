(function () {
    var POPUP = {
        self: this,
        $domainList: $('#domainList'),
        sortProperties: function (obj) {
            // convert object into array
            var sortable = [];
            for (var key in obj)
                if (obj.hasOwnProperty(key))
                    sortable.push([key, obj[key]]); // each item is an array in format [key, value]

            // sort items by key
            sortable.sort(function (a, b) {
                return a[0] > b[0]; // compare strings
            });
            return sortable; // array in format [ [ key1, val1 ], [ key2, val2 ], ... ]
        },
        fnBindEvents: function () {
            this.$domainList.on("click", "input", (e) => {
                var selected = $(e.currentTarget).is(':checked');
                $(e.currentTarget).parent().parent().toggleClass("disabled");
                var text = $(e.currentTarget).parent().parent().attr("data-value");

                browser.storage.local.get('allowedDomains').then((res) => {
                    var ad = JSON.parse(res.allowedDomains);
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
            browser.storage.local.get('allowedDomains').then((res) => {
                var allowedDomains = JSON.parse(res.allowedDomains);
                allowedDomains = this.sortProperties(allowedDomains);

                $.each(allowedDomains, (index, values) => {
                    let checkboxConfig = {
                        "type": "checkbox",
                        "text": "Aktywna"
                    };

                    if (values[1]) {
                        checkboxConfig["checked"] = "checked";
                    }

                    that.$domainList.append($("<li>", {
                        "class": "ui-widget-content " + (values[1] ? "" : "disabled"),
                        "data-value": values[0],
                        "text": values[0]
                    }).append($("<span>")
                        .append($("<input>", checkboxConfig))));
                });
            });
        },
        updateUI: function () {
            browser.storage.local.get(['version', 'status']).then((res) => {
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
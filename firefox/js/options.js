(function () {
    let POPUP = {
        self: this,
        $domainList: $('#domainList'),
        sortProperties: function (obj) {
            // convert object into array
            let sortable = [];
            for (let key in obj) {
                if (obj.hasOwnProperty(key)) {
                    sortable.push([key, obj[key]]);
                }
            } // each item is an array in format [key, value]

            // sort items by key
            sortable.sort(function (a, b) {
                return a[0] > b[0]; // compare strings
            });

            return sortable; // array in format [ [ key1, val1 ], [ key2, val2 ], ... ]
        },
        fnBindEvents: function () {
            this.$domainList.on("click", "input", (e) => {
                let selected = $(e.currentTarget).is(':checked');
                $(e.currentTarget).parent().parent().toggleClass("disabled");
                let text = $(e.currentTarget).parent().parent().attr("data-value");

                browser.storage.local.get('allowedDomains').then((res) => {
                    let ad = JSON.parse(res.allowedDomains);
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
                let changedItems = Object.keys(changes);
                for (let item of changedItems) {
                    if (item === "status") {
                        let newValue = changes[item].newValue;
                        $("input:radio[value=" + newValue + "]").click();
                    }
                }
            }

            browser.storage.onChanged.addListener(logStorageChange);
        },
        fnGenerateDomainList: function () {
            let that = this;
            browser.storage.local.get('allowedDomains').then((res) => {
                let allowedDomains = JSON.parse(res.allowedDomains);
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

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

            this.$domainList.on("click", "input", function () {
                var selected = $(this).is(':checked');
                $(this).parent().parent().toggleClass("disabled");
                var text = $(this).parent().parent().attr("data-value");
                that.allowedDomains[text] = selected;
                localStorage.allowedDomains = JSON.stringify(that.allowedDomains);
            });

            $('input[type=radio][name=status]').change(function () {
                browser.runtime.sendMessage({"status": this.value});
            });
        },
        fnGenerateDomainList: function () {
            var that = this;
            var allowedDomains = JSON.parse(localStorage.allowedDomains);
            $.each(allowedDomains, function (allowedHost, enabled) {
                that.$domainList.append('<li class="ui-widget-content ' + (enabled ? "" : "disabled") +
                    '" data-value="' + allowedHost + '">' + allowedHost + '<span><input type="checkbox" ' +
                    (enabled ? ' checked ' : '') + '>Aktywna</input></span></li>');
            });
            this.fnSortAllowedDomainsList();
        },
        getStatus: function (key) {
            var extensionStatus = localStorage[key];
            if (typeof extensionStatus === 'undefined') {
                extensionStatus = "off";
            }
            return extensionStatus;
        },
        updateUI: function () {
            $("#version").text(localStorage.version);
            $('input[type=radio][name=status]')
            $("input:radio[value=" + localStorage.status + "]").attr("checked", true);
        },
        init: function () {
            this.fnGenerateDomainList();
            this.fnBindEvents();
            this.updateUI();
        }
    };
    POPUP.init();
})();
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-44535901-1']);
_gaq.push(['_trackPageview']);

(function () {
    var ga = document.createElement('script');
    ga.type = 'text/javascript';
    ga.async = true;
    ga.src = 'https://ssl.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ga, s);
})();

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
                that.trackingBeacon(text + ' DOMAIN', 'deleted');
            });

            this.$domainList.on("click", "input", function () {
                var selected = $(this).is(':checked');
                $(this).parent().parent().toggleClass("disabled");
                var text = $(this).parent().parent().attr("data-value");
                that.allowedDomains[text] = selected;
                localStorage.allowedDomains = JSON.stringify(that.allowedDomains);
                that.trackingBeacon(text + ' DOMAIN', 'disabled');
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
                that.trackingBeacon(newDomain + ' DOMAIN', 'added_new');
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
                    that.trackingBeacon('reset_to_default', 'click');
                }
            );

            $('a.switch').each(function (index, item) {
                var id = $(item).attr("id");
                $(item).iphoneSwitch(that.getStatus(id), function () {
                    localStorage.setItem(id, "on");
                    console.log(id + " = on");
                    that.trackingBeacon('scroll_switch_popup', 'enabled');
                }, function () {
                    localStorage.setItem(id, "off");
                    console.log(id + " = off");
                    that.trackingBeacon('scroll_switch_popup', 'disabled');
                });
            });

            $('#enableTracking').each(function (index, item) {
                var id = $(item).attr("id");
                $(item).iphoneSwitch(localStorage[id] === "true" ? "on" : "off", function () {
                    localStorage.setItem(id, true);
                    console.log(id + " = on");
                    that.trackingBeacon('tracking', 'enabled');
                }, function () {
                    localStorage.setItem(id, false);
                    console.log(id + " = off");
                    that.trackingBeacon('tracking', 'disabled');
                });
            });
        },
        trackingBeacon: function (category, action) {
            var enableTracking = (typeof localStorage.enableTracking !== 'undefined') && localStorage.enableTracking === "true";
            if (enableTracking) {
                _gaq.push(['_trackEvent', category, action]);
            }
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
            this.fnBindEvents();
            this.trackingBeacon("option_popup","show");
        }
    };
    POPUP.init();
})();

(function () {
    var setSupportedDomains= function () {
        localStorage.version = browser.runtime.getManifest().version;

        var supportedDomains = new Array("autotrader.pl", "avanti24.pl", "groszki.pl", "ugotuj.to",
            "gazeta.pl", "tokfm.pl", "gazetapraca.pl", "moto.pl", "plotek.pl", "deser.pl", "demotywatory.pl",
            "sport.pl", "wyborcza.pl", "gazetadom.pl", "logo24.pl", "wyborcza.biz", "lula.pl", "naszemiasto.pl",
            "tuba.pl", "edziecko.pl", "czterykaty.pl", "alert24.pl", "kotek.pl", "polygamia.pl",
            "popcorner.pl", "wysokieobcasy.pl", "e-ogrody.pl", "ladnydom.pl", "bryla.gazetadom.pl",
            "metropraca.pl", "pracawbiurze.pl", "zczuba.pl", "ciacha.net", "biznes.pl",
            "namonciaku.pl", "magazyn-kuchnia.pl", "swiatmotocykli.pl", "domosfera.pl",
            "bryla.pl", "domiwnetrze.pl", "onet.pl", "gazetalubuska.pl", "dziennikwschodni.pl", "echodnia.eu",
            "pomorska.pl", "wspolczesna.pl", "gk24.pl", "gp24.pl", "gs24.pl", "poranny.pl", "nowiny24.pl", "nto.pl",
            "to.com.pl", "mmbydgoszcz.pl", "mmwroclaw.pl", "mmkrakow.pl", "mmlodz.pl", "mmlublin.pl", "mmpoznan.pl",
            "mmsilesia.pl", "mmszczecin.pl", "mmtrojmiasto.pl", "mmwarszawa.pl", "mmmojemiasto.pl", "mmopole.pl",
            "mmzielonagora.pl", "foch.pl", "edulandia.pl", "wp.pl", "kwejk.pl", "gazetawroclawska.pl", "polskatimes.pl",
            "dziennikbaltycki.pl", "dzienniklodzki.pl", "dziennikpolski24.pl", "dziennikzachodni.pl", "expressilustrowany.pl",
            "gazetakrakowska.pl", "gloswielkopolski.pl", "kurierlubelski.pl",
            "fakt.pl", "wawalove.pl", "www.se.pl", "sfora.pl", "biztok.pl",
            "komputerswiat.pl", "dziennik.pl", "jegostrona.pl", "forsal.pl", "wprzerwie.pl", "przegladsportowy.pl",
            "auto-swiat.pl", "sportowefakty.pl",
            "bebzol.com", "lovekrakow.pl", "pudelekx.pl", "urzadzamy.pl", "snobka.pl", "pudelek.pl",
            "fly4free.pl", "gadzetomania.pl", "trojmiasto.pl", "regiomoto.pl", "sportfan.pl",
            "forbes.pl", "geekweek.pl", "eliminator-slajdow.herokuapp.com", "nocoty.pl", "domiporta.pl",
            "newsweek.pl");

        var allowedDomains = {};
        if (typeof localStorage.allowedDomains !== "undefined") {
            allowedDomains = JSON.parse(localStorage.allowedDomains);
        }

        $.each(supportedDomains, function (index, domain) {
            if (typeof allowedDomains[domain] === "undefined") {
                allowedDomains[domain] = true;
            }
        });

        // usun nieobslugiwane domeny z listy
        $.each(allowedDomains, function (domain, index) {
            if ($.inArray(domain, supportedDomains) < 0) {
                delete allowedDomains[domain];
            }
        });

        localStorage.allowedDomains = JSON.stringify(allowedDomains);
    };

    setSupportedDomains();

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
        init: function () {
            this.fnGenerateDomainList();
            this.fnBindEvents();
        }
    };
    POPUP.init();
})();
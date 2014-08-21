self.port.on("config-sent", function (prefs) {
    for (var url in prefs) {
        $("#domainList").append($("<a>", {"class": "url", text: url, href: url, rel: "nofollow" }));
    }

    var that = this;
    var listitems = $('#domainList a.url').get();
    listitems.sort(function (a, b) {
        return $(a).text().toUpperCase().localeCompare($(b).text().toUpperCase());
    });

    $.each(listitems, function (idx, itm) {
        $('#domainList').append(itm);
    });
});
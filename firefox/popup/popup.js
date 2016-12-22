function appendParamToUrl(url, param) {
    if (url.indexOf("?") > -1) {
        return url.replace("?", "?" + param + "&");
    } else if (url.indexOf("#") > -1) {
        return url.replace("#", "?" + param + "#");
    } else {
        return url + "?" + param;
    }
}

$("#options").click(()=> {
    browser.runtime.openOptionsPage();
    this.close();
});

$("#tempDisable").click(()=> {
    browser.extension.getBackgroundPage().getActiveTab().then((res)=> {
        console.log(res)
        browser.tabs.update(res[0].id, {url: appendParamToUrl(res[0].url, "es=off")}).then(()=> {
            this.close();
        });
    });
});

$("#disable").click(()=> {
    browser.storage.local.get('status').then((res)=> {
        var newStatus = parseInt(res.status) * -1;
        $("#disable").addClass("button-status" + newStatus);
        $("#disable").removeClass("button-status" + (newStatus * -1));
        browser.runtime.sendMessage({"status": newStatus});
        this.close()
    });
});

function init() {
    browser.storage.local.get('status').then((res)=> {
        $("#disable").addClass("button-status" + res.status)
        $("#disable").removeClass("button-status" + (res.status * -1));
    });
    browser.extension.getBackgroundPage().getActiveTab().then((res)=> {
        browser.extension.getBackgroundPage().canRunOnCurrentUrl(res[0].url).then((canRunHere)=> {
            if (canRunHere) {
                // ok
            } else {
                $("#tempDisable").css("cursor", "not-allowed")
                    .css("opacity", "0.1")
                    .attr("disabled", "disabled");
            }
        });
    });
}

init();
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
    chrome.runtime.openOptionsPage();
    this.close();
});

$("#tempDisable").click(()=> {
    chrome.extension.getBackgroundPage().getActiveTab((res)=> {
        chrome.tabs.update(res[0].id, {url: appendParamToUrl(res[0].url, "es=off")},
            ()=> {
                this.close();
            });
    });
});

$("#disable").click(()=> {
    chrome.storage.sync.get('status', (res)=> {
        var newStatus = parseInt(res.status) * -1;
        $("#disable").addClass("button-status" + newStatus);
        $("#disable").removeClass("button-status" + (newStatus * -1));
        chrome.runtime.sendMessage({"status": newStatus});
        this.close()
    });
});

function init() {
    chrome.storage.sync.get('status', (res)=> {
        $("#disable").addClass("button-status" + res.status)
        $("#disable").removeClass("button-status" + (res.status * -1));
    });
    chrome.extension.getBackgroundPage().getActiveTab((res)=> {
        chrome.extension.getBackgroundPage().canRunOnCurrentUrl(res[0].url, (canRunHere)=> {
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
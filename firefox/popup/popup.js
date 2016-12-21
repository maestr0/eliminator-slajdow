function getActiveTab() {
    return browser.tabs.query({active: true, currentWindow: true});
}

$("#options").click(()=> {
    browser.runtime.openOptionsPage();
    this.close();
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
}

init();
function getActiveTab() {
    return browser.tabs.query({active: true, currentWindow: true});
}

$("#options").click(()=> {
    browser.runtime.openOptionsPage();
});

$("#disable").click(()=> {
    browser.storage.local.get('status').then((res)=> {
        var newStatus = parseInt(res.status) * -1;
        browser.runtime.sendMessage({"status": newStatus});
    });
});

function init() {
    browser.storage.local.get('status').then((res)=> {
        $("#disable").text("ES " + res.status)
    });
}

init();
const {Cc,Ci} = require("chrome");
var self = require("sdk/self");
const data = self.data;
var tabs = require('sdk/tabs');
var prefs = require("sdk/simple-prefs").prefs;
var action_button = null;

const activeState = {
    "icon": {
        "18": "./icon18.png", // toolbar icon non HiDPI
        "32": "./icon32.png", // menu panel icon non HiDPI
        "36": "./icon36.png", // toolbar icon HiDPI
        "64": "./icon64.png"  // menu panel icon HiDPI
    }
};

const disabledState = {
    "icon": {
        "18": "./icon18_disabled.png", // toolbar icon non HiDPI
        "32": "./icon32_disabled.png", // menu panel icon non HiDPI
        "36": "./icon36_disabled.png", // toolbar icon HiDPI
        "64": "./icon64_disabled.png"  // menu panel icon HiDPI
    }
};

tabs.on('ready', function (tab) {
    for (var hostname in prefs) {
        if (tab.url.indexOf(hostname) !== -1 && prefs[hostname] && tab.url.toLowerCase().indexOf("es=off") === -1) {
            var worker = tab.attach({
                contentScriptFile: [data.url("jquery-2.0.3.js"), data.url("jquery-ui-1.10.3.widget-factory.js"), data.url("eliminator-slajdow.jquery.widget.js"), data.url("contentscript.js")]
            });

            worker.port.emit("es-start", {
                cssUrl: data.url("es.css"),
                imageBaseUrl: data.url("."),
                version: self.version + "-firefox"
            });
            // break
            return false;
        }
    }
});

function updateActionButtonState(tab) {
    for (var url in prefs) {
        if (tab.url.indexOf(url) != -1) {
            if (prefs[url]) {
                action_button.state(action_button, activeState);
                return;
            }
        }
    }
    action_button.state(action_button, disabledState);
}

function buildPanel() {
    var settingsPanel = require("sdk/panel").Panel({
        width: 800,
        height: 600,
        contentURL: data.url("panel.html"),
        contentScriptFile: [data.url("panel.js"), data.url("jquery-2.0.3.js")]
    });

    settingsPanel.port.emit("config-sent", prefs);

    var ui = require("sdk/ui");

    action_button = ui.ActionButton({
        id: "ES-button",
        label: "Eliminator Slajdów",
        icon: {
            "18": "./icon18_disabled.png", // toolbar icon non HiDPI
            "32": "./icon32_disabled.png", // menu panel icon non HiDPI
            "36": "./icon36_disabled.png", // toolbar icon HiDPI
            "64": "./icon64_disabled.png"  // menu panel icon HiDPI
        },
        onClick: function (state) {
            settingsPanel.show();
        }
    });
}

function isXULAvailable() {
    return Cc["@mozilla.org/xre/app-info;1"].getService(Ci.nsIXULRuntime)
        .widgetToolkit.toLowerCase() != "android";
}

if (isXULAvailable()) {
    buildPanel();
    tabs.on('ready', updateActionButtonState);
    tabs.on('activate', updateActionButtonState);
}

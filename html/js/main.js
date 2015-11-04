(function () {
    "use strict";
    // Get global canvas and store it in GTE
    // GTE is initialized by the library
    GTE.canvas = SVG('canvas').size("100%", "100%").attr({'style': 'background: #fff'});
    GTE.tools = new GTE.UI.Tools();
    // Initialize settings
    var setSettingsToDefaults = function() {
        GTE.STORAGE.settingsCircleSize = GTE.CONSTANTS.CIRCLE_SIZE;
        GTE.STORAGE.settingsLineThickness = GTE.CONSTANTS.LINE_THICKNESS;
        GTE.STORAGE.settingsDistLevels = GTE.CONSTANTS.DIST_BETWEEN_LEVELS;
    };

    var setSettingsForm = function() {
        document.getElementsByName("circle-size")[0].value = GTE.STORAGE.settingsCircleSize;
        document.getElementsByName("stroke-width")[0].value = GTE.STORAGE.settingsLineThickness;
        document.getElementsByName("dist-levels")[0].value = GTE.STORAGE.settingsDistLevels;
        for (var i = 1; i <= GTE.CONSTANTS.MAX_PLAYERS; i++) {
            var picker = document.createElement("input");
            picker.type = "color";
            picker.value = GTE.tools.getColour(i);
            document.getElementById("player-colours").appendChild(picker);
        }
    };

    GTE.STORAGE = window.localStorage;

    if (GTE.STORAGE.length === 0) {
        setSettingsToDefaults();
    }

    setSettingsForm();

    // Always start with root and two children
    GTE.tools.newTree();

    document.getElementById("button-new").addEventListener("click", function(){
        GTE.tools.newTree();
        return false;
    });

    document.getElementById("button-add").addEventListener("click", function(){
        GTE.tools.switchMode(GTE.MODES.ADD);
        return false;
    });

    document.getElementById("button-remove").addEventListener("click", function(){
        GTE.tools.switchMode(GTE.MODES.DELETE);
        return false;
    });

    document.getElementById("button-merge").addEventListener("click", function(){
        GTE.tools.switchMode(GTE.MODES.MERGE);
        return false;
    });

    document.getElementById("button-dissolve").addEventListener("click", function(){
        GTE.tools.switchMode(GTE.MODES.DISSOLVE);
        return false;
    });

    var playerButtons = document.getElementsByClassName("button-player");
    for (var i = 0; i < playerButtons.length; i++) {
        playerButtons[i].addEventListener("click",
            GTE.tools.buttonPlayerHandler(playerButtons[i].getAttribute("player")));
    }

    document.getElementById("button-player-more").addEventListener("click", function(){
        GTE.tools.addPlayer();
        return false;
    });

    document.getElementById("button-player-less").addEventListener("click", function(){
        GTE.tools.removeLastPlayer();
        return false;
    });

    document.getElementById("button-settings").addEventListener("click", function(){
        var el = document.getElementById("settings");
        el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
        return false;
    });

    document.getElementById("button-settings-close").addEventListener("click", function(){
        var el = document.getElementById("settings");
        el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
        return false;
    });

    document.getElementById("form-settings").addEventListener("submit", function(e){
        e.preventDefault();
        // Save settings
        GTE.STORAGE.settingsCircleSize =
                    parseInt(document.getElementsByName("circle-size")[0].value);
        GTE.STORAGE.settingsLineThickness =
                    parseInt(document.getElementsByName("stroke-width")[0].value);
        GTE.STORAGE.settingsDistLevels =
                    parseInt(document.getElementsByName("dist-levels")[0].value);
        // Redraw tree
        GTE.tree.draw(true);
        // Hide the modal
        var el = document.getElementById("settings");
        el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
        return false;
    });

    document.getElementById("button-settings-reset").addEventListener("click", function() {
        // Clear localStorage and reset settings
        localStorage.clear();
        setSettingsToDefaults();
        // Reset form
        setSettingsForm();
        // Redraw tree
        GTE.tree.draw(true);
        return false;
    });

}());

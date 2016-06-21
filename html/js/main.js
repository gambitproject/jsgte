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
        var colorNames = Object.keys(GTE.COLOURS);
        var colours = [];
        colours.push(GTE.COLOURS[colorNames[0]]);
        for (var i = 1; i <= GTE.CONSTANTS.MAX_PLAYERS; i++) {
            colours.push(GTE.COLOURS[colorNames[i]]);
        }
        GTE.STORAGE.settingsPlayersColours = JSON.stringify(colours);
        GTE.STORAGE.settingsOrientation = GTE.CONSTANTS.DEFAULT_ORIENTATION;
    };

    // var playerListener = function(picker) {
    //     var closeControl = true;
    //     picker.addEventListener("focus", function() {
    //         // Focus is fired both when the picker opens and closes
    //         // closeControl variable is used to control whether the
    //         // picker is opening or closing
    //         closeControl = !closeControl;
    //         if (closeControl) {
    //             GTE.tree.changePlayerColour(picker.getAttribute("player"), picker.value);
    //         }
    //     });
    // };

    var setSettingsForm = function() {
        var storedColours = JSON.parse(GTE.STORAGE.settingsPlayersColours);
        document.getElementsByName("circle-size")[0].value = GTE.STORAGE.settingsCircleSize;
        document.getElementsByName("stroke-width")[0].value = GTE.STORAGE.settingsLineThickness;
        document.getElementsByName("dist-levels")[0].value = GTE.STORAGE.settingsDistLevels;
        document.getElementsByName("chance-colour")[0].value = storedColours[0];
        document.getElementById("orientation").getElementsByTagName("input")[GTE.STORAGE.settingsOrientation].checked = true;

        var playerColourInputs = document.getElementsByName("player-color");

        // This function is both called on the form reset and when setting up the form
        if (playerColourInputs.length > 0) { // If form is already set up
            GTE.tree.changePlayerColour(0, storedColours[0]);
            for (var i = 1; i <= GTE.CONSTANTS.MAX_PLAYERS; i++) {
                playerColourInputs[i-1].value = storedColours[i];
                GTE.tree.changePlayerColour(i, storedColours[i]);
            }
        } else {
            for (var j = 1; j <= GTE.CONSTANTS.MAX_PLAYERS; j++) {
                var picker = document.createElement("input");
                picker.id = "settings-player-color-" + j;
                picker.type = "color";
                picker.value = storedColours[j];
                picker.name = "player-color";
                picker.setAttribute("player", j);

                document.getElementById("player-colours").appendChild(picker);
            }
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
    document.getElementById("button-load").addEventListener("click", function(){
        var xmlFiles = document.getElementById("xmlFile");
        xmlFiles.onchange = function(e) {
            var file = xmlFiles.files[0];
            var reader = new FileReader();
            reader.onloadend = function(evt) {
                if (evt.target.readyState == FileReader.DONE) {
                        GTE.tools.loadTree(evt.target.result);
                };
            };

            var blob = file.slice(0, file.size - 1);
            reader.readAsBinaryString(blob);
        };
        if (xmlFiles) {
            xmlFiles.click();
        }
        return false;
    });

    document.getElementById("button-save").addEventListener("click", function(){
        var exporter = new GTE.TREE.XmlExporter();
        exporter.exportTree();
        console.log(exporter.toString());
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
        el.style.display = (el.style.display == "block") ? "none" : "block";
        el.style.position = "absolute";
        el.style.top = 0;
        el.style.left = 0;
        return false;
    });

    document.getElementById("button-settings-close").addEventListener("click", function(){
        var el = document.getElementById("settings");
        el.style.display = (el.style.display == "block") ? "none" : "block";
        // Reset form to saved settings
        setSettingsForm();
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
        GTE.STORAGE.settingsOrientation =
                    parseInt(document.querySelector('input[name=orientation]:checked').value);
        var chanceColour = document.getElementsByName("chance-colour")[0].value;
        var playerColours = [];
        playerColours.push(chanceColour);
        GTE.tree.changePlayerColour(0, chanceColour);
        var oldPlayerColours = JSON.parse(GTE.STORAGE.settingsPlayersColours);
        for (var i = 1; i <= GTE.CONSTANTS.MAX_PLAYERS; i++) {
            var colour = document.getElementById("settings-player-color-" + i).value;
            playerColours.push(colour);
            if (oldPlayerColours[i] !== playerColours[i]) {
                GTE.tree.changePlayerColour(i, colour);
            }
        }
        GTE.STORAGE.settingsPlayersColours = JSON.stringify(playerColours);
        // Redraw tree
        GTE.tree.draw(true);
        // Hide the modal
        var el = document.getElementById("settings");
        el.style.display = (popup.style.display == "block") ? "none" : "block";
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
    
    var settings = document.getElementById("settings");
    var settings_bar = document.getElementById("settings_bar");
    var offset = { x: 0, y: 0 };

    settings_bar.addEventListener('mousedown', mouseDown, false);
    window.addEventListener('mouseup', mouseUp, false);

    function mouseUp() {
        window.removeEventListener('mousemove', settingsMove, true);
    }

    function mouseDown(e) {
        offset.x = e.clientX - settings.offsetLeft;
        offset.y = e.clientY - settings.offsetTop + 100 ;
        window.addEventListener('mousemove', settingsMove, true);
    }

    function settingsMove(e) {
        settings.style.position = 'absolute';
        var top = e.clientY - offset.y ;
        var left = e.clientX - offset.x;
        settings.style.top = top + 'px';
        settings.style.left = left + 'px';
    }

}());

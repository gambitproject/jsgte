GTE.UI = (function (parentModule) {
    "use strict";

    /**
    * Creates a new Tools object.
    * @class
    */
    function Tools() {
        this.activePlayer = -1;
        this.isetToolsRan = false;
    }

    /**
    * Function called when New button is pressed.
    * It creates a new Tree and draws it
    */
    Tools.prototype.newTree = function() {
        var root = new GTE.TREE.Node();
        GTE.tree = new GTE.TREE.Tree(root);
        new GTE.TREE.Node(root);
        new GTE.TREE.Node(root);
        // Draw the tree
        GTE.tree.draw();
    };

    /**
    * Function that switches mode to the one specified by the button pressed
    * @param {Button} button Button pressed that will activate mode
    */
    Tools.prototype.switchMode = function(modeToSwitch){
        // Change the class of the button to active if possible
        var buttonToSwitch = "";
        switch (modeToSwitch) {
            case GTE.MODES.ADD:
                buttonToSwitch = "button-add";
                break;
            case GTE.MODES.DELETE:
                buttonToSwitch = "button-remove";
                break;
            case GTE.MODES.PLAYERS:
                buttonToSwitch = "button-player-" + this.activePlayer;
                break;
            case GTE.MODES.MERGE:
                if (this.ableToSwitchToISetMode()) {
                    buttonToSwitch = "button-merge";
                    // If iset tools have never been chosen
                    if (!this.isetToolsRan) {
                        // Assign singleton isets to each node with no iset
                        GTE.tree.initializeISets();
                        this.isetToolsRan = true;
                    }
                } else {
                    window.alert("Assign a player to every node first.");
                    return;
                }
                break;
            case GTE.MODES.DISSOLVE:
                if (this.ableToSwitchToISetMode()) {
                    buttonToSwitch = "button-dissolve";
                } else {
                    window.alert("Assign a player to every node first.");
                    return;
                }
                break;
            default:
                break;
        }
        // Remove active class from current active button
        var activeButton = document.getElementsByClassName("active button")[0];
        activeButton.className = activeButton.className.replace(/\bactive\b/,'');

        document.getElementById(buttonToSwitch).className += " " + "active";

        GTE.MODE = modeToSwitch;
        if (GTE.MODE === GTE.MODES.PLAYERS ||
            GTE.MODE === GTE.MODES.MERGE ||
            GTE.MODE === GTE.MODES.DISSOLVE) {
            GTE.tree.hideLeaves();
        } else {
            GTE.tree.showLeaves();
        }
    };

    /**
    * Function that selects a player
    * @param {Player} player Player to be set as active
    */
    Tools.prototype.selectPlayer = function (player) {
        // Set player as active player and mode to PLAYERS mode
        this.activePlayer = player;
        this.switchMode(GTE.MODES.PLAYERS);
    };

    /**
    * Function that adds a player button to the toolbar
    */
    Tools.prototype.addPlayer = function () {
        // Create a new player
        var player = GTE.tree.newPlayer();
        // Get the last player button
        var playerButtons = document.getElementById("player-buttons");
        var lastPlayer = playerButtons.lastElementChild;
        // Insert a new button after the last button
        lastPlayer.insertAdjacentHTML("afterend",
            "<li><button style='color:"+ player.colour +
            "' id='button-player-" + player.id +
            "' class='button button--sacnite button--inverted button-player'" +
            " alt='Player " + player.id +
            "' player='" + player.id +
            "'><i class='icon-user'></i><span>" + player.id + "</span></button></li>");
        // Get the newly added button
        lastPlayer = playerButtons.lastElementChild;
        // And add a click event that will call the selectPlayer function
        lastPlayer.firstElementChild.addEventListener("click", function () {
            var player = this.getAttribute("player");
            GTE.tools.selectPlayer(player);
            return false;
        });
    };

    Tools.prototype.getColour = function (colourIndex) {
        return GTE.COLOURS[Object.keys(GTE.COLOURS)[colourIndex]];
    };

    /**
    * Function that gets the active player (the player button that is selected)
    * @return {Player} activePlayer Currently selected player
    */
    Tools.prototype.getActivePlayer = function () {
        return this.activePlayer;
    };

    Tools.prototype.ableToSwitchToISetMode = function () {
        return GTE.tree.recursiveCheckAllNodesHavePlayer();
    };


    // Add class to parent module
    parentModule.Tools = Tools;

    return parentModule;
}(GTE.UI)); // Add to GTE.UI sub-module

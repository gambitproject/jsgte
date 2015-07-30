GTE.UI = (function (parentModule) {
    "use strict";

    /**
    * Creates a new Tools object.
    * @class
    */
    function Tools() {
        this.activePlayer = -1;
    }

    /**
    * Function called when New button is pressed.
    * It creates a new Tree and draws it
    */
    Tools.prototype.newTree = function() {
        var root = new GTE.TREE.Node(null);
        var child1 = new GTE.TREE.Node(root);
        var child2 = new GTE.TREE.Node(root);
        GTE.tree = new GTE.TREE.Tree(root);
        GTE.tree.updatePositions();
        // Create a node and draw it
        GTE.tree.draw();
    };

    /**
    * Function that switches mode to the one specified by the button pressed
    * @param {Button} button Button pressed that will activate mode
    */
    Tools.prototype.switchMode = function(modeToSwitch){
        // Remove active class from current active button
        var activeButton = document.getElementsByClassName("active button")[0];
        activeButton.className =
            activeButton.className.replace(/\bactive\b/,'');

        // Change the class of the button to active
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
            default:

        }
        document.getElementById(buttonToSwitch).className += " " + "active";

        GTE.MODE = modeToSwitch;
    };

    Tools.prototype.selectPlayer = function (player) {
        this.activePlayer = player;
        this.switchMode(GTE.MODES.PLAYERS);
        return false;
    };

    Tools.prototype.addPlayer = function () {
        var player = GTE.tree.newPlayer();
        var playerButtons = document.getElementById("player-buttons");
        var lastPlayer = playerButtons.lastElementChild;
        lastPlayer.insertAdjacentHTML(
            "afterend", "<li><button style='color:"+ player.colour +
            "' id='button-player-" + player.id +
            "' class='button button--sacnite button--inverted button-player'" +
            "alt='Player " + player.id + "' player='" + player.id +
            "'><i class='icon-user'></i><span>" + player.id + "</span></button></li>");
        lastPlayer = playerButtons.lastElementChild;
        lastPlayer.firstElementChild.addEventListener("click", function () {
            var player = this.getAttribute("player");
            GTE.tools.selectPlayer(player);
            return false;
        });
    };

    Tools.prototype.getRandomColour = function () {
        var random = Math.floor((Math.random() * Object.keys(GTE.COLOURS).length) + 1);
        return GTE.COLOURS[Object.keys(GTE.COLOURS)[random]];
    };

    Tools.prototype.getActivePlayer = function () {
        return this.activePlayer;
    };


    // Add class to parent module
    parentModule.Tools = Tools;

    return parentModule;
}(GTE.UI)); // Add to GTE.UI sub-module

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
        this.resetPlayers(1);
        this.activePlayer = -1;
        this.isetToolsRan = false;
        var root = new GTE.TREE.Node(null);
        var child1 = new GTE.TREE.Node(root);
        var child2 = new GTE.TREE.Node(root);
        GTE.tree = new GTE.TREE.Tree(root);

        this.addChancePlayer();
        this.addPlayer();
        // Add a second Player
        this.addPlayer();

        // GTE.tree.updatePositions();
        // Create a node and draw it
        GTE.tree.draw();
        this.switchMode(GTE.MODES.ADD);
    };

    /**
    * Function used to create new tree according
    * to the xml data received.
    */
    Tools.prototype.loadTree = function(xml) {
        var importer = new GTE.TREE.XmlImporter(xml);
        importer.parseXmlToJson();
        importer.loadTree();
    };

    /**
    * Builds the sub-tree for the variable @node
    */
    Tools.prototype.createRecursiveTree = function(node, father) {
        var currentNode = GTE.tree.addChildNodeTo( father, GTE.tree.players[node.jAttr.player] );
        for( var i = 0 ; i < node.jIndex.length ; i++) {
            if(node.jIndex[i][0] == "node") {
                this.createRecursiveTree(node.node[node.jIndex[i][1]], currentNode);
            }
            if(node.jIndex[i][0] == "outcome") {
                GTE.tree.addChildNodeTo(currentNode, GTE.tree.players[node.outcome[node.jIndex[i][1]].jAttr.player]);
            }
        }
    };

    /**
    * Function to create nodes of the laoded tree
    */
    Tools.prototype.createTree = function(node, root) {
        //  var root = new GTE.TREE.Node(null, node.jAttr.player);
        for( var i = 0 ; i < node.jIndex.length ; i++) {
            if(node.jIndex[i][0] == "node") {
                this.createRecursiveTree(node.node[node.jIndex[i][1]], root);
            }
            if(node.jIndex[i][0] == "outcome") {
                GTE.tree.addChildNodeTo(root, GTE.tree.players[node.outcome[node.jIndex[i][1]].jAttr.player]);
            }
        }
        return root;
    };

    /**
    * Function that switches mode to the one specified by the button pressed
    * @param {Button} button Button pressed that will activate mode
    */
    Tools.prototype.switchMode = function(modeToSwitch){
        // Remove active class from current active button
        var activeButton = document.getElementsByClassName("active button")[0];
        if (activeButton !== undefined) {
            activeButton.className =
                activeButton.className.replace(/\bactive\b/,'');
        }

        // Change the class of the button to active
        var buttonToSwitch = "";
        switch (modeToSwitch) {
            case GTE.MODES.ADD:
                buttonToSwitch = "button-add";
                break;
            case GTE.MODES.DELETE:
                buttonToSwitch = "button-remove";
                break;
            case GTE.MODES.PLAYER_ASSIGNMENT:
                buttonToSwitch = "button-player-" + this.activePlayer;
                break;
            case GTE.MODES.MERGE:
                if (this.ableToSwitchToISetEditingMode()) {
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
                if (this.ableToSwitchToISetEditingMode()) {
                    buttonToSwitch = "button-dissolve";
                } else {
                    window.alert("Assign a player to every node first.");
                    return;
                }
                break;
            default:
        }
        document.getElementById(buttonToSwitch).className += " " + "active";

        GTE.MODE = modeToSwitch;
        if (GTE.MODE === GTE.MODES.PLAYER_ASSIGNMENT ||
            GTE.MODE === GTE.MODES.MERGE ||
            GTE.MODE === GTE.MODES.DISSOLVE) {
            GTE.tree.hideLeaves();
        } else {
            GTE.tree.showLeaves();
        }

        if (GTE.MODE !== GTE.MODES.PLAYER_ASSIGNMENT) {
            this.activePlayer = -1;
        }
    };

    /**
    * Function that selects a player
    * @param {Player} player Player to be set as active
    */
    Tools.prototype.selectPlayer = function (player) {
        // Set player as active player and mode to PLAYERS mode
        this.activePlayer = player;
        this.switchMode(GTE.MODES.PLAYER_ASSIGNMENT);
    };

    /**
    * Handles player buttons onclicks
    * @param {Number|String} playerId Player to be selected
    */
    Tools.prototype.buttonPlayerHandler = function(playerId) {
        return function () {
            GTE.tools.selectPlayer(parseInt(playerId));
        };
    };

    /**
    * Function that adds a player button to the toolbar
    */
    Tools.prototype.addPlayer = function (colour, id, name) {
        if (GTE.tree.numberOfPlayers() < GTE.CONSTANTS.MAX_PLAYERS) {
            // Create a new player
            var player = GTE.tree.newPlayer(colour, id, name);
            if (player !== null) {
                if (player.id == GTE.CONSTANTS.MIN_PLAYERS + 1) {
                    document.getElementById("button-player-less").className =
                        document.getElementById("button-player-less").className
                                                    .replace(/\bdisabled\b/,'');
                }
                if (player.id == GTE.CONSTANTS.MAX_PLAYERS) {
                    document.getElementById("button-player-more")
                                                .className += " " + "disabled";
                }
                // Get the last player button
                var playerButtons = document.getElementById("player-buttons");
                var lastPlayer = playerButtons.lastElementChild;
                // Insert a new button after the last button
                lastPlayer.insertAdjacentHTML("afterend",
                    "<li><button style='color:"+ player.colour +
                    "' id='button-player-" + player.id +
                    "' class='button button--sacnite button--inverted button-player'" +
                    " alt='Player " + player.id +
                    "' title='Player " + player.id +
                    "' player='" + player.id +
                    "'><i class='icon-user'></i></button></li>");
                // Get the newly added button
                lastPlayer = playerButtons.lastElementChild;
                // And add a click event that will call the selectPlayer function
                lastPlayer.firstElementChild.addEventListener("click",
                                        this.buttonPlayerHandler(player.id));
            }
        }
    };

    Tools.prototype.addChancePlayer = function () {
        var player = GTE.tree.newPlayer(GTE.tools.getColour(0));
        if (player !== null) {
            var playerButtons = document.getElementById("player-buttons");
            playerButtons.innerHTML =
                "<li><button style='color:"+ player.colour +
                "' id='button-player-" + player.id +
                "' class='button button--sacnite button--inverted button-player'" +
                " alt='Chance player' title='Chance'" +
                "' player='" + player.id +
                "'><i class='icon-dice'></i></button></li>";
        }
    };


    /**
    * Function that removes last player from the Toolbar
    */
    Tools.prototype.removeLastPlayer = function () {
        if (GTE.tree.numberOfPlayers() > GTE.CONSTANTS.MIN_PLAYERS) {
            // Remove last player from the list of players
            var playerId = GTE.tree.removeLastPlayer();
            // Activate more players button again
            if (playerId == GTE.CONSTANTS.MAX_PLAYERS) {
                document.getElementById("button-player-more").className =
                    document.getElementById("button-player-more").className
                                                    .replace(/\bdisabled\b/,'');
            }
            // Remove button
            var playerButtons = document.getElementById("player-buttons");
            var lastPlayer = playerButtons.lastElementChild.lastElementChild;
            this.removePlayerButton(lastPlayer);
        }
    };

    /**
    * Returns the colour correspondent to a given index. It is used to get the
    * player colour. Player id would be the same as colourIndex
    * @param  {Number} colourIndex  Colour index in the list of colours
    * @return {Colour} colour       Colour hex code
    */
    Tools.prototype.getColour = function (colourIndex) {
        var colours = JSON.parse(GTE.STORAGE.settingsPlayersColours);
        return colours[colourIndex];
    };

    /**
    * Function that gets the active player (the player button that is selected)
    * @return {Player} activePlayer Currently selected player
    */
    Tools.prototype.getActivePlayer = function () {
        return this.activePlayer;
    };

    /**
    * Checks if it is possible to switch to information sets modes. This function is basically
    * a wrapper that checks that all nodes have a player assigned.
    * @return {Boolean} True if it is possible to switch to information set mode
    */
    Tools.prototype.ableToSwitchToISetEditingMode = function () {
        return GTE.tree.recursiveCheckAllNodesHavePlayer();
    };

    /**
    * Removes the player button from the toolbar
    * @param {Button} button Button HTML object to remove
    */
    Tools.prototype.removePlayerButton = function (button) {
        var playerId = parseInt(button.getAttribute("player"));
        // get the <li>
        var parent = button.parentNode;
        // remove the <li> from the <ul>
        parent.parentNode.removeChild(parent);
        // If there are only two players (Chance, Player 1),
        // disable the remove button
        if (playerId === GTE.CONSTANTS.MIN_PLAYERS + 1) {
            document.getElementById("button-player-less").className += " disabled";
        }
        // If the removed player was the active one, select the previous one
        if (playerId === this.activePlayer) {
            this.selectPlayer(this.activePlayer-1);
        }
    };

    /**
    * Resets the length of the players to @length in the toolbar.
    */
    Tools.prototype.resetPlayers = function (length) {
        var buttons = document.getElementsByClassName("button-player");
        while(buttons.length > length + 1) {
            this.removePlayerButton(buttons[buttons.length-1]);
        }
    };

    /**
    * Adds new players to the according to color and name arrays
    */
    Tools.prototype.setPlayers = function (colour,name) {
        for(var i=1; i<=name.length; i++)
        {
            this.addPlayer(colour[i-1].jValue, i, name[i-1].jValue);
        }
    };

    /**
    * Sets display properties of the tree
    */
    Tools.prototype.setDisplayProperties = function (display) {
        GTE.STORAGE.settingsLineThickness = display.strokeWidth[0].jValue;
        GTE.STORAGE.settingsCircleSize = display.nodeDiameter[0].jValue;
        GTE.STORAGE.settingsDistLevels = display.levelDistance[0].jValue;
    };

    /**
    * Sets isets for the loaded tree
    */
    Tools.prototype.setIsets = function (nodejs, node) {

    //        var nodes = GTE.tree.getAllNodes(true);
    //        for (var i = 0; i < nodes.length; i++) {
    //            GTE.tree.createSingletonISet(nodes[i]);
    //       }
        GTE.tree.createSingletonISet(node);

        if(nodejs.jIndex != undefined) {
            for( var i = 0 ; i < nodejs.jIndex.length ; i++) {
                if(nodejs.jIndex[i][0] == "node") {
                    this.setIsets(nodejs.node[nodejs.jIndex[i][1]], node.children[i]);
                }
                if(nodejs.jIndex[i][0] == "outcome") {
                    this.setIsets(nodejs.outcome[nodejs.jIndex[i][1]], node.children[i]);
                }
            }
        }
    };

    Tools.prototype.mergeIsets = function (nodejs, node, listOfIsets) {
        if(node.iset != listOfIsets[nodejs.jAttr.iset] && nodejs.jAttr.iset != undefined){
//            GTE.MODE = GTE.MODES.MERGE;
            node.changeISet(listOfisets[nodejs.jAttr.iset]);
            GTE.tree.draw();
//            GTE.tree.merge(node.iset, GTE.tree.isets[nodejs.jAttr.iset]);
        }
        if(nodejs.jIndex != undefined) {
            for( var i = 0 ; i < nodejs.jIndex.length ; i++) {
                if(nodejs.jIndex[i][0] == "node") {
                    this.mergeIsets(nodejs.node[nodejs.jIndex[i][1]], node.children[i], listOfIsets);
                }
                if(nodejs.jIndex[i][0] == "outcome") {
                //    this.mergeIsets(nodejs.outcome[nodejs.jIndex[i][1]], node.children[i]);
                }
            }
        }
    };

    // Add class to parent module
    parentModule.Tools = Tools;

    return parentModule;
}(GTE.UI)); // Add to GTE.UI sub-module

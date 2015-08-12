(function () {
    "use strict";
    // Get global canvas and store it in GTE
    // GTE is initialized by the library
    GTE.canvas = SVG('canvas').size("100%", "100%").attr({'style': 'background: #fff'});
    GTE.tools = new GTE.UI.Tools();
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

    var playerButtons = document.getElementsByClassName("button-player");
    for (var i = 0; i < playerButtons.length; i++) {
        playerButtons[i].onclick = GTE.tools.buttonPlayerHandler(playerButtons[i].getAttribute("player"));
    }

    document.getElementById("button-player-more").addEventListener("click", function(){
        GTE.tools.addPlayer();
        return false;
    });

    document.getElementById("button-player-less").addEventListener("click", function(){
        GTE.tools.removeLastPlayer();
        return false;
    });

}());

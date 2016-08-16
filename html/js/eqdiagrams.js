(function () {
    "use strict";
    //adding some lines that are to be inserted in structure.js
    GTE.PAGE_NAME=window.location.pathname.split('/')[window.location.pathname.split('/').length-1];
    if (GTE.PAGE_NAME=="mbyn.html")
    GTE.PAGE_NAME="eqdiagrams.html";
    
    GTE.PUREQ_RADIUS=10;
    
    GTE.POINT_RADIUS=5;
    
    
    // Get global canvas and store it in GTE
    // GTE is initialized by the library
    
    GTE.canvas = SVG('canvas').size("100%", "100%").attr({'style': 'background: #fff'});
    GTE.tools = new GTE.UI.Tools();
    
    
    GTE.STORAGE = window.localStorage;
    
    
    var setSettingsToDefaults = function() {
        GTE.STORAGE.settingsBlockSize = GTE.CONSTANTS.BLOCK_SIZE;
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
    
    if (GTE.STORAGE.length === 0) {
        setSettingsToDefaults();
    }
    
    
    // Always start with root and two children
    GTE.tools.newTree();
    GTE.tree.clear();
    
    
    document.getElementById("button-independent-strategic-general").addEventListener("click", function(){
        var x=2;
        var y=2;
        x = prompt("Enter the number of moves for the first player", "2");
        if ( GTE.PAGE_NAME=="eqdiagrams.html"){
            y = prompt("Enter the number of moves for the second player (2 or 3)", "2");
            while (y!=2 && y!=3){
               y = prompt("The number of moves for the second player has to be 2 or 3", "2");
            }
        }else{
            y = prompt("Enter the number of moves for the second player", "2");}
        GTE.STRATEGICFORMMODE = GTE.STRATEGICFORMMODES.GENERAL;
        GTE.tools.createIndependentStrategicForm(x, y);
        GTE.diag.clear();
        GTE.diag.ini();
        GTE.diag.redraw();
        return false;
    });
    
    document.getElementById("button-independent-strategic-zerosum").addEventListener("click", function(){
        var x=2;
        var y=2;
        x = prompt("Enter the number of moves for the first player", "2");
        if ( GTE.PAGE_NAME=="eqdiagrams.html"){
           y = prompt("Enter the number of moves for the second player (2 or 3)", "2");
           while (y!=2 && y!=3){
              y = prompt("The number of moves for the second player has to be 2 or 3", "2");
           }
        }else{
            y = prompt("Enter the number of moves for the second player", "2");}
        GTE.STRATEGICFORMMODE = GTE.STRATEGICFORMMODES.ZEROSUM;
        GTE.tools.createIndependentStrategicForm(x, y);
        GTE.diag.clear();
        GTE.diag.ini();
        GTE.diag.redraw();
        return false;
    });
    
    document.getElementById("button-independent-strategic-symmetric").addEventListener("click", function(){
        var x=2;
        if ( GTE.PAGE_NAME=="eqdiagrams.html"){
            x = prompt("Enter the number of moves for the first player", "2");
        }
        GTE.STRATEGICFORMMODE = GTE.STRATEGICFORMMODES.SYMMETRIC;
        GTE.tools.createIndependentStrategicForm(x, x);
        GTE.diag.clear();
        GTE.diag.ini();
        GTE.diag.redraw();
        return false;
    });
    
    
    var playerButtons = document.getElementsByClassName("button-player");
    for (var i = 0; i < playerButtons.length; i++) {
        playerButtons[i].addEventListener("click",
                                          GTE.tools.buttonPlayerHandler(playerButtons[i].getAttribute("player")));
    }
    
    document.getElementById("button-matrix").addEventListener("click", function(){
        var el = document.getElementById("matrixPopup");
        el.style.display = (el.style.display == "block") ? "none" : "block";
        document.getElementById('matrix-player-1').value = GTE.tree.matrix.getMatrixInStringFormat(0);
        document.getElementById('matrix-player-2').value = GTE.tree.matrix.getMatrixInStringFormat(1);
        return false;
    });
    
    document.getElementById("button-matrix-close").addEventListener("click", function(){
        var el = document.getElementById("matrixPopup");
        el.style.display = (el.style.display == "block") ? "none" : "block";
        return false;
    });
    
    document.getElementById("matrix-settings").addEventListener("submit", function(e){
        var el = document.getElementById("matrixPopup");
        el.style.display = (el.style.display == "block") ? "none" : "block";
        return false;
    });
    
    document.getElementById("button-matrix-reset").addEventListener("click", function(e){
        document.getElementById('matrix-player-1').value = GTE.tree.matrix.getMatrixInStringFormat(0);
        document.getElementById('matrix-player-2').value = GTE.tree.matrix.getMatrixInStringFormat(1);
        return false;
    });
    
    
    document.getElementById("button-matrix-save").addEventListener("click", function(e){
        var dimensions = GTE.tools.parseMatrix(document.getElementById('matrix-player-1').value,document.getElementById('matrix-player-2').value )
        if(dimensions) {
            GTE.STRATEGICFORMMODE = GTE.STRATEGICFORMMODES.GENERAL;
            GTE.tools.createIndependentStrategicForm(dimensions[0], dimensions[1]);
            GTE.tree.clear();
            GTE.tree.matrix.setMatrixFromStringFormat(0, document.getElementById('matrix-player-1').value);
            GTE.tree.matrix.setMatrixFromStringFormat(1, document.getElementById('matrix-player-2').value);
            GTE.tree.matrix.drawMatrix();
            var el = document.getElementById("matrixPopup");
            el.style.display = (el.style.display == "block") ? "none" : "block";
        }
        GTE.diag.redraw();
        return false;
    });
    
    document.getElementById("SvgjsSvg1000").addEventListener("click", function(){
        document.getElementById("SvgjsSvg1000").addEventListener("keypress", validatefunction);
    });
    function validatefunction (event){
        if (event.keycode ==13 || event.which==13){
            GTE.diag.redraw();
            document.getElementById("SvgjsSvg1000").removeEventListener("mousemove",validatefunction);
        }
    };
    
    
    /*
     Hide irrelevant buttons for strategic.html
     */
    var hideButtons = function() {
        document.getElementById('button-tree').style.display = 'none' ;
        document.getElementById('button-strategic').style.display = 'none' ;
        document.getElementById('button-add').style.display = 'none' ;
        document.getElementById('button-remove').style.display = 'none' ;
        document.getElementById('button-player-more').style.display = 'none' ;
        document.getElementById('button-player-less').style.display = 'none' ;
        document.getElementById('button-merge').style.display = 'none' ;
        document.getElementById('button-dissolve').style.display = 'none' ;
        document.getElementById('button-solve-lrs').style.display = 'none' ;
        document.getElementById('button-new').style.display = 'none' ;
        document.getElementById('player-buttons').style.display = 'none' ;
        
    };
    hideButtons();
    
    GTE.getMousePosition = function(e) {
        return {
        x: e.clientX ,
        y: e.clientY
        };
    }
    
    var matrixPopup = document.getElementById("matrixPopup");
    var matrix_bar = document.getElementById("matrix_bar");
    var offset = { x: 0, y: 0 };
    //initialise the matrix
    GTE.STRATEGICFORMMODE = GTE.STRATEGICFORMMODES.GENERAL;
    GTE.tools.createIndependentStrategicForm(2, 2);
    
    GTE.svg = document.getElementById("drawing");
    GTE.diag = new GTE.Diagram(); //new
    GTE.diag.ini();
    GTE.diag.redraw();
}());

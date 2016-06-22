(function () {
    "use strict";
   //adding some lines that are to be inserted in structure.js
    GTE.PAGE_NAME=window.location.pathname.split('/')[window.location.pathname.split('/').length-1];
    if (GTE.PAGE_NAME=="2by2_svg.html")
       GTE.PAGE_NAME="eqdiagrams.html";
 
    GTE.PUREQ_RADIUS=10;
 
 
 
 
    // Get global canvas and store it in GTE
    // GTE is initialized by the library
    GTE.canvas = SVG('canvas').size("100%", "100%").attr({'style': 'background: #fff'});
    GTE.tools = new GTE.UI.Tools();
    GTE.diagram = new GTE.Diagram();
    GTE.svg = document.getElementById("drawing");
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
    GTE.STORAGE = window.localStorage;

    // Always start with root and two children
    GTE.tools.newTree();
    GTE.tree.clear();



    document.getElementById("button-independent-strategic-general").addEventListener("click", function(){
        var x=2;
        var y=2;
        if ( GTE.PAGE_NAME!="eqdiagrams.html"){
            x = prompt("Enter the number of moves for the first player", "2");
            y = prompt("Enter the number of moves for the second player", "2");
        }
        GTE.STRATEGICFORMMODE = GTE.STRATEGICFORMMODES.GENERAL;
        GTE.tools.createIndependentStrategicForm(x, y);
        return false;
    });

    document.getElementById("button-independent-strategic-zerosum").addEventListener("click", function(){
        var x=2;
        var y=2;
        if ( GTE.PAGE_NAME!="eqdiagrams.html"){
            x = prompt("Enter the number of moves for the first player", "2");
            y = prompt("Enter the number of moves for the second player", "2");
        }
        GTE.STRATEGICFORMMODE = GTE.STRATEGICFORMMODES.ZEROSUM;
        GTE.tools.createIndependentStrategicForm(x, y);
        return false;
    });

    document.getElementById("button-independent-strategic-symmetric").addEventListener("click", function(){
        var x=2;
        if ( GTE.PAGE_NAME!="eqdiagrams.html"){
            var x = prompt("Enter the number of moves for the game", "2");
        }
        GTE.STRATEGICFORMMODE = GTE.STRATEGICFORMMODES.SYMMETRIC;
        GTE.tools.createIndependentStrategicForm(x, x);
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
        redraw();
        return false;
    });

    document.getElementById("SvgjsSvg1000").addEventListener("click", function(){
        document.addEventListener("keyup", function(){
                                  GTE.diagrams.update();
            });
         });


    var payoff=document.getElementsByClassName("pay");
    var lines=document.getElementsByClassName("line_trans");
    for(i=0;i<8;i++){
 payoff[i].addEventListener("mousedown", GTE.diagram.doMouseDownEndpoint());
    }
    for(i=0;i<4;i++){
 lines[i].addEventListener("mousedown", GTE.diagram.doMouseDownLine());
    }
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
}());

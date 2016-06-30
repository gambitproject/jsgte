GTE.DIAGRAM = (function (parentModule) {
    "use strict";

    /**
    * Creates a new envelopp.
    * @class
    */
    function Envelopp(p) {
        this.player = p;
        this.points = [[0,0],[0,0],[0,0]]; // left, middle and right points.
    }
    
    /*
    Return player
    */
    Envelopp.prototype.setPoint = function(i,x,y){
       this.points[i] = [x , y];
    }


    // Add class to parent module
    parentModule.Envelopp = Envelopp;

    return parentModule;
}(GTE.DIAGRAM)); // Add to GTE.DIAGRAM sub-module

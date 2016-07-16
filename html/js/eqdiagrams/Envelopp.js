GTE = (function (P) {
    "use strict";

    /**
    * Creates a new envelopp.
    * @class
    */
    function Envelopp(p) {
       this.player = p;
       this.points = []; // left, middle and right points.
       this.points.push([0,0]);
       this.points.push([0,0]);
       this.points.push([0,0]);
               };
    
    /*
    Return player
    */
    Envelopp.prototype.setPoint = function(i,x,y){
       this.points[i] = [x,y];
               };


    // Add class to parent module
    P.Envelopp = Envelopp;

    return P;
}(GTE)); // Add to GTE.DIAGRAM sub-module

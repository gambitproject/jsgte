GTE = (function (P) {
    "use strict";

    /**
    * Creates a new envelopp.
    * @class
    */
    function Envelopp(p) {
       this.player = p;
       /* this.points = [[0,0],[0,0],[0,0]]; // left, middle and right points.*/
               };
    
    /*
    Return player
    */
    /*Envelopp.prototype.setPoint = function(i,x,y){
       this.points[i] = [x,y];
               };*/


    // Add class to parent module
    P.Envelopp = Envelopp;

    return P;
}(GTE)); // Add to GTE.DIAGRAM sub-module

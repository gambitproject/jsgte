GTE = (function (P) {
    "use strict";
    
    /**
     * Creates a new envelope.
     * @class
     */
    function Envelope(p) {
        this.player = p;
        this.points = []; // left, middle and right points.
        this.points.push([0,0]);
        this.points.push([0,0]);
        this.points.push([0,0]);
    };
    
    /*
     Return player
     */
    Envelope.prototype.setPoint = function(i,x,y){
        this.points[i] = [x,y];
    };
    
    
    // Add class to parent module
    P.Envelope = Envelope;
    
    return P;
}(GTE)); // Add to GTE.DIAGRAM sub-module

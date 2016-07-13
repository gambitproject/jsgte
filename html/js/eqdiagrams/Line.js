GTE.DIAGRAM = (function (parentModule) {
    "use strict";

    /**
    * Creates a new end point.
    * @class
    */
    function Line(p,strat) {
        this.player=p;
        if (p==0){
           this.strat1=strat*2;
           this.strat2=strat*2+1;
        }
        else{
           this.strat1=strat;
           this.strat2=strat+2;
       }

               };
    /*Strategy does not have the same meaning for end point and line.
    For line strategy one correspond to the left endpoint and strategy two to the right end point.
    */
    
    /*
    Return player
    */
    Line.prototype.getPlayer = function(){
       return this.player;
               };
               
    /*
    Return strategy
    */
    Line.prototype.getStrat1 = function(){
        return this.strat1;
               };
               
    Line.prototype.getStrat2 = function(){
        return this.strat2;
               };

    // Add class to parent module
    parentModule.Line = Line;

    return parentModule;
}(GTE.DIAGRAM)); // Add to GTE.DIAGRAM sub-module

GTE = (function (parentModule) {
    "use strict";

    /**
    * Creates a new end point.
    * @class
    */
    function Endpoint(x,y,p,strat) {
        this.x=x;
        this.y=y;
        this.player=p; //player that recieves the payoff.
        this.strat=strat;
        this.html_element=null;
        this.assign_html();
    /*
     Strategy 0 means first strategy for both players.
     1 means first strategy for player one and second strategy for player two.
     2 means second strategy for player one and first strategy for player two.
     3 means second strategy for both players.
     -1 means that this point correspond to a mixed equilibria.
     */

               };
    /*
     Link to html
     */
    Endpoint.prototype.assign_html = function () {
        this.html_element=document.getElementsByClassName("pay")[this.player*4+this.strat];
               };
               
    /*
     Return player
    */
    Endpoint.prototype.getPlayer = function(){
       return this.player;
               };
    
    /*
    Return strategy
    */
    Endpoint.prototype.getStrat = function(){
        return this.strat;
               };
               
    /*
    Return y position
    */
    Endpoint.prototype.getPosy = function(){
        return this.y;
               };
               
    /*
    Return x position
    */
    Endpoint.prototype.getPosx = function(){
    return this.x;
               };


    /*
    ToString function
    */
    Endpoint.prototype.toString = function () {
        return "Player "+this.player+" payoff of strategy "+this.strat+" at position "+this.x+ " "+thi.y+".";
    };

                
    
    /**
    * Change position
    */
    Endpoint.prototype.move = function (new_x) {
        this.x = new_x;
        this.html_element.setAttributeNS(null, "cy", new_x);
               };
    
    
    // Add class to parent module
    parentModule.Endpoint = Endpoint;

    return parentModule;
}(GTE)); // Add to GTE.DIAGRAM sub-module

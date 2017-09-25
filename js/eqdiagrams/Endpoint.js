GTE = (function (parentModule) {
    "use strict";
    
    /**
     * Creates a new end point.
     * @class
     */
    function Endpoint(x,y,p,strat, strat_matrix,max) {
        this.x=x;
        this.y=y;
        this.player=p; //player that recieves the payoff.
        this.strat=strat;
        this.strat_matrix=strat_matrix;
        this.html_element=null;
        if (strat>-1 && (p==0 || max>1)){
            this.draw();}
        
        /*
         Strategy 0 means first strategy for both players.
         1 means first strategy for player one and second strategy for player two.
         2 means second strategy for player one and first strategy for player two.
         3 means second strategy for both players.
         -1 means that this point correspond to a mixed equilibria.
         */
        
    };
    
    Endpoint.prototype.draw = function (){
        if (this.player==0){
            var e=document.createElementNS("http://www.w3.org/2000/svg", "circle");
            e.setAttribute("cx",this.x);
            e.setAttribute("cy",this.y);
            e.setAttribute("r",GTE.POINT_RADIUS);
            e.setAttribute("asso_player",this.player);
            e.setAttribute("asso_strat",this.strat);
            e.setAttribute("class","pay line1");
            var env=document.getElementsByClassName("sticklabel");
            GTE.svg.appendChild(e);
            GTE.svg.insertBefore(e,env[17]);
            GTE.svg.insertBefore(env[17],e);
        }
        else{
            var e=document.createElementNS("http://www.w3.org/2000/svg", "circle");
            e.setAttribute("cx",this.x);
            e.setAttribute("cy",this.y);
            e.setAttribute("r",GTE.POINT_RADIUS);
            e.setAttribute("asso_player",this.player);
            e.setAttribute("asso_strat",this.strat);
            e.setAttribute("class","pay line2");
            var env=document.getElementsByClassName("sticklabel");
            GTE.svg.appendChild(e);
            GTE.svg.insertBefore(e,env[35]);
            GTE.svg.insertBefore(env[35],e);
        }
        e.addEventListener("mousedown", GTE.diag.doMouseDownEndpoint);
        this.html_element=e;
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
     Return strategy
     */
    Endpoint.prototype.getStrat_mat = function(){
       return this.strat_matrix;
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
        return "Player "+this.player+" payoff of strategy "+this.strat+" strategy matrix "+this.strat_matrix+" at position "+this.x+ " "+this.y+".";
    };
    
    
    
    /**
     * Change position
     */
    Endpoint.prototype.move = function (new_y) {
        this.y = new_y;
        this.html_element.setAttributeNS(null, "cy", new_y);
    };
    
    
    // Add class to parent module
    parentModule.Endpoint = Endpoint;
    
    return parentModule;
}(GTE)); // Add to GTE.DIAGRAM sub-module

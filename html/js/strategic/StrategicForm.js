GTE.TREE = (function(parentModule) {
    "use strict";

    /**
     * Creates a new Strategy.
     * @class
     */
    function StrategicForm() {
        this.players = [];
        this.players.push(new GTE.TREE.Player());
        this.players.push(new GTE.TREE.Player());
        this.strategies = []; // a multidimensional array containing strategicUnit objects
        this.matrix = [];
    }

    StrategicForm.prototype.assignPlayers = function(players) {
        this.players = [];
        for(var i=0;i<players.length;i++)
            this.addPlayer(players[i]);
    };

    st.push(this.strategies[i]);
    // Add class to parent module
    parentModule.StrategicForm = StrategicForm;

    return parentModule;
}(GTE.TREE)); // Add to GTE.TREE sub-module

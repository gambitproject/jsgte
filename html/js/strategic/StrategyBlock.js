GTE.TREE = (function(parentModule) {
    "use strict";

    /**
     * Creates a new Strategy.
     * @class
     */
    function StrategyBlock(strategyUnits, height) {
        this.strategy = new GTE.TREE.Strategy(strategyUnits);
        this.height = height;
        this.shape = null;
    }

    StrategyBlock.prototype.assignPayoffs = function() {
        this.strategy.findPayoff(GTE.tree.root);
    };

    StrategyBlock.prototype.draw = function() {

        if(this.strategy.strategicUnits.length == 2) {
            //render a 2 player game




            return;
        }
        var x = (100);
        var y = 100;
//        this.shape = GTE.canvas.rect(100, 100).attr({fill: '#fff', 'fill-opacity': 1, stroke: '#000', 'stroke-width': 2});
//        this.shape.translate(x,y);
//        this.shape = GTE.canvas.polygon('0,0 100,50 50,100').fill('none').stroke({ width: 1 });
        for(var i = 0; i<this.strategy.strategicUnits.length;i++) {
            for(var j = 0;j<this.strategy.strategicUnits[i].moves.length;j++) {
                this.editable = new GTE.UI.Widgets.ContentEditable(
                    x+j*20+ i*100, 40*this.height,
                    GTE.CONSTANTS.CONTENT_EDITABLE_GROW_TO_RIGHT,
                    this.strategy.strategicUnits[i].moves[j].name   , "strategy")
                .colour(this.strategy.strategicUnits[i].player.colour);
            }
        }

        for(var i = 0; i<this.strategy.payoffs.length;i++) {
            this.strategy.payoffs[i].draw(500 + x + i*40, 40 * this.height);
        }
    };

    // Add class to parent module
    parentModule.StrategyBlock = StrategyBlock;

    return parentModule;
}(GTE.TREE)); // Add to GTE.TREE sub-module

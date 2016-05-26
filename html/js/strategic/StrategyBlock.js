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
        var x = (100);
//        this.shape = GTE.canvas.rect(100, 100)
  //          .fill({
    //            color: '#9d9d9d'
      //      });
        //this.shape.translate(x, y);

        for(var i = 0; i<this.strategy.strategicUnits.length;i++) {
            for(var j = 0;j<this.strategy.strategicUnits[i].moves.length;j++) {
                this.editable = new GTE.UI.Widgets.ContentEditable(
                    x+i*20, 40*this.height,
                    GTE.CONSTANTS.CONTENT_EDITABLE_GROW_TO_RIGHT,
                    this.strategy.strategicUnits[i].moves[j].name, "strategy")
                .colour(this.strategy.strategicUnits[i].player.colour);
            }
        }

        for(var i = 0; i<this.strategy.payoffs.length;i++) {
            this.strategy.payoffs[i].draw(100 + x + i*40, 40 * this.height);
        }
    };

    // Add class to parent module
    parentModule.StrategyBlock = StrategyBlock;

    return parentModule;
}(GTE.TREE)); // Add to GTE.TREE sub-module

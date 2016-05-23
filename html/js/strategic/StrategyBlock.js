GTE.TREE = (function(parentModule) {
    "use strict";

    /**
     * Creates a new Strategy.
     * @class
     */
    function StrategyBlock(x, y, players, moves) {
        this.strategy = new GTE.TREE.Strategy(players, moves);
        this.x = x;
        this.y = y;
        this.shape = null;
    }

    StrategyBlock.prototype.assignPayoffs = function() {
        this.strategy.findPayoff(GTE.tree.root);
    };

    StrategyBlock.prototype.draw = function() {
        var x = (100) * (this.x + 1);
        var y = (100) * (this.y + 1);
        this.shape = GTE.canvas.rect(100, 100)
            .fill({
                color: '#9d9d9d'
            });
        this.shape.translate(x, y);
        this.strategy.payoffs[0].draw(x, y+40);
        this.strategy.payoffs[1].draw(x+40, y);
    };

    // Add class to parent module
    parentModule.StrategyBlock = StrategyBlock;

    return parentModule;
}(GTE.TREE)); // Add to GTE.TREE sub-module


GTE.TREE = (function(parentModule) {
    "use strict";

    /**
     * Creates a new Strategy.
     * @class
     */
    function StrategyBlock(strategyUnits, height, width) {
        this.strategy = new GTE.TREE.Strategy(strategyUnits);
        this.height = height || null;
        this.width = width || null;
        this.shape = null;
    }

    StrategyBlock.prototype.assignPayoffs = function() {
        this.strategy.findPayoff(GTE.tree.root);
    };

    StrategyBlock.prototype.assignPartners = function() {
        this.strategy.assignPartner(this.width, this.height);
    };

    StrategyBlock.prototype.draw = function() {
        var x = GTE.CONSTANTS.MATRIX_X;
        var y = GTE.CONSTANTS.MATRIX_Y;
        var size = GTE.CONSTANTS.MATRIX_SIZE;
        if(this.strategy.strategicUnits.length == 2) {
            //render a 2 player game
            this.shape = GTE.canvas.rect(size, size).attr({fill: '#fff', 'fill-opacity': 1, stroke: '#000', 'stroke-width': 2});
            this.shape.translate(x + this.width*size, y + size * this.height);
            this.strategy.payoffs[0].draw(x + this.width*size, y + size * this.height + size * .7);
            this.strategy.payoffs[1].draw(x + this.width*size + size*1.06, y + size * this.height ,GTE.CONSTANTS.CONTENT_EDITABLE_GROW_TO_LEFT);
            return;
        }
        // render a n player game
        for(var i = 0; i<this.strategy.strategicUnits.length;i++) {
            for(var j = 0;j<this.strategy.strategicUnits[i].moves.length;j++) {
                this.editable = new GTE.UI.Widgets.ContentEditable(
                    x+j*20+ i*100, 100*this.height,
                    GTE.CONSTANTS.CONTENT_EDITABLE_GROW_TO_RIGHT,
                    this.strategy.strategicUnits[i].moves[j].name , "strategy")
                .colour(this.strategy.strategicUnits[i].player.colour);
            }
        }

        for(var i = 0; i<this.strategy.payoffs.length;i++) {
            this.strategy.payoffs[i].draw(500 + x + i*100, 100 * this.height);
        }
    };

    // Add class to parent module
    parentModule.StrategyBlock = StrategyBlock;

    return parentModule;
}(GTE.TREE)); // Add to GTE.TREE sub-module

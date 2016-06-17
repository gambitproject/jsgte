GTE.TREE = (function(parentModule) {
    "use strict";

    /**
     * Creates a new Block widget.
     * @class
     */
    function Block(strategy, x, y) {
        this.strategy = strategy;
        this.x1 = x;    // xth index in the matrix
        this.y1 = y;    // yth index in the matrix
    }

    Block.prototype.draw = function() {

    };

    Block.prototype.hide = function() {
        this.shape.hide();
    };

    Block.prototype.show = function() {
        this.shape.show();
    };

    // Add class to parent module
    parentModule.Block = Block;

    return parentModule;
}(GTE.TREE)); // Add to GTE.TREE sub-module

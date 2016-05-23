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
        var width = (this.x2 + parseInt(GTE.STORAGE.settingsCircleSize)) - this.x1;

        this.shape = GTE.canvas.rect(width, GTE.STORAGE.settingsCircleSize)
            .radius(GTE.STORAGE.settingsCircleSize / 2)
            .fill({
                color: '#9d9d9d'
            })
            .addClass('Block-rect');
        this.shape.translate(this.x1,
            this.y - GTE.STORAGE.settingsCircleSize / 2);
        var thisBlock = this;
        this.shape.mouseover(function() {
            thisBlock.interaction();
        });
        this.shape.mouseout(function() {
            thisBlock.interaction();
        });
        this.shape.click(function() {
            thisBlock.onClick();
        });
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

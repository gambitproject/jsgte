GTE.TREE = (function(parentModule) {
    "use strict";

    /**
     * Creates a new Block .
     * @class
     */
    function Block(moves, x, y) {
        this.shape = null;
        this.moves = moves;
        this.x1 = x;
        this.y1 = y;
    }

    MultiAction.prototype.draw = function() {
        var width = parseInt(GTE.STORAGE.settingsRectSize);
        this.shape = GTE.canvas.rect(width, GTE.STORAGE.settingsCircleSize)
            .fill({
                color: '#9d9d9d'
            })
            .addClass('circle');
        this.shape.translate(this.x1*width,
            this.y1 * width);
    };

    // Add class to parent module
    parentModule.Block = Block;

    return parentModule;
}(GTE.TREE)); // Add to GTE.TREE sub-module

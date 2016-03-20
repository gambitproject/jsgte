GTE.UI = (function (parentModule) {
    
    /**
    * Creates a new KeyTraversal object. Currently implements
    * "postorder" tree traversal.
    * @class
    */
    function KeyTraversal() {
        this.keyMode = GTE.KEYMODES.NODE_TRAVERSAL;
        this.activeNode = null;
        this.activeMulti = null;
        this.enabled = null;
    }
    
    /**
    * Function that switches the current mode key traversal mode
    * Valid modes are declared in GTE.KEYMODES 
    * @param {Number} newMode Key mode to be switched to.
    */
    KeyTraversal.prototype.switchMode = function(newMode) {
        switch(newMode) {
            case GTE.KEYMODES.NODE_TRAVERSAL:
            case GTE.KEYMODES.MULTI_TRAVERSAL:
                var buttonsToBlur = document.getElementsByTagName('button');
                for (var i = 0; i < buttonsToBlur.length; i++)
                    buttonsToBlur[i].blur();
                break;
            case GTE.KEYMODES.NO_TRAVERSAL:
                this.resetCanvasFocuses();
                break;
        }
        this.keyMode = newMode;
    };
    
    /**
    * Function that adds listeners for KeyTraversal functionality
    */
    KeyTraversal.prototype.addListeners = function() {
        this.enabled = true;
        document.addEventListener("keydown", this.keyHandler.bind(this));
        document.addEventListener("click", this.resetCanvasFocuses.bind(this));
    };
    
    /**
    * Function that removes listeners for KeyTraversal functionality
    */
    KeyTraversal.prototype.removeListeners = function() {
        this.enabled = false;
        document.removeEventListener("keydown", this.keyHandler);
        document.removeEventListener("click", this.resetCanvasFocuses);
    }
    
    /**
    * Function that resets the currently any currently focused canvas objects
    */
    KeyTraversal.prototype.resetCanvasFocuses = function() {
        if (this.activeNode != null){
            this.activeNode.classList.remove("hover");
        }
        if (this.activeMulti != null) {
            this.activeMulti.onmouseout();
        }
        this.activeNode = null;
        this.activeMulti = null;
    }

    /**
    * Function that traverses canvas objects via keypresses
    * @param {Number} e KeyCode for key pressed
    */
    KeyTraversal.prototype.keyHandler = function(e) {
        //console.log(e.which);
        
        /**
        * Function that traverses canvas tree until it finds an object of a 
        * specified type, else returns a default canvas object.
        *
        * @param {String} name The tag name of the target canvas object.
        * @param {SVGAnimatedString} startNode Start object to traverse from
        * @param {SVGAnimatedString} resetValue Default start object
        * @param {Boolean} isReverse Determines if traversing backwards
        * @return {SVGAnimatedString} Returns the next object after traversal.
        */
        function findElement(name, startNode, loopValue, isReverse) {
            var nextElement = startNode;
            var check;
            
            while (true) {
                
                if (isReverse)
                    check = nextElement.previousElementSibling;
                else
                    check = nextElement.nextElementSibling;
                
                if (check == null) {
                    nextElement = loopValue;
                    break;
                } else {
                    nextElement = check;
                    if (nextElement.tagName == name) 
                        break;
                }
            }
            
            return nextElement;
        };
        
        /**
        * Function that changes the current mode, and delegates what the 
        * current hovered svg object should change to.
        *
        * @param {String} newMode The mode corresponding to the hovered object.
        * @param {String} name The tag name of the SVG object.
        * @param {SVGAnimatedString} currentValue The current hovered object.
        * @param {SVGAnimatedString} rootValue The default object to hover on.
        * @param {Boolean} isReverse Whether to traverse backwards if needed.
        * @param {KeyTraversal} self Access to outer scope of this function.
        * @return {SVGAnimatedString} Returns the new object to hover on.
        */
        function assignActive(newMode, name, currentValue, rootValue, loopValue, isReverse, self) {
            // If coming from a different mode, reset and change mode
            if (self.keyMode != newMode) {
                self.resetCanvasFocuses();
                self.switchMode(newMode);
            }

            // If currently null, then hover on root
            if (currentValue == null)
                currentValue = rootValue;
            else
                currentValue = findElement(name, currentValue, loopValue, isReverse);
            
            return currentValue;
        };
        
        // Will hold the default loop-around value
        var loopValue;
        // Will hold the root value
        var rootValue;
        
        switch(e.which) {
            case KeyEvent.DOM_VK_UP:
                
                // Remove hover on current node
                if (this.activeNode != null)
                    this.activeNode.classList.remove("hover");
                
                rootValue = document.querySelector(".node.root");
                loopValue = document.querySelector(".node");
                
                this.activeNode = assignActive(GTE.KEYMODES.NODE_TRAVERSAL, "ellipse", 
                                               this.activeNode, rootValue, loopValue, false, this);
                
                // Add hover to new current node
                this.activeNode.classList.add("hover");
                break;
                
            case KeyEvent.DOM_VK_DOWN:
                
                // Remove hover on current node
                if (this.activeNode != null)
                    this.activeNode.classList.remove("hover");
                
                rootValue = document.querySelector(".node.root");
                loopValue = document.querySelector(".node.root");
                
                this.activeNode = assignActive(GTE.KEYMODES.NODE_TRAVERSAL, "ellipse", 
                                               this.activeNode, rootValue, loopValue, true, this);
                
                // Add hover to new current node
                this.activeNode.classList.add("hover");
                break;
                
            case KeyEvent.DOM_VK_X:
                
                // Remove hover on current multi
                if (this.activeMulti != null)
                    this.activeMulti.onmouseout();
                
                rootValue = document.querySelector(".multiaction-rect");
                loopValue = document.querySelector(".multiaction-rect");

                this.activeMulti = assignActive(GTE.KEYMODES.MULTI_TRAVERSAL, "rect", 
                                                this.activeMulti, rootValue, loopValue, false, this);
                
                // Add hover to current multi
                this.activeMulti.onmouseover();
                break;
                
            case KeyEvent.DOM_VK_SPACE:
                
                // Simulate click on object depending on mode
                if (this.keyMode == GTE.KEYMODES.NODE_TRAVERSAL) {
                    if (this.activeNode != null)
                        this.activeNode.onclick();
                } else if (this.keyMode == GTE.KEYMODES.MULTI_TRAVERSAL) {
                    if (this.activeMulti != null)
                        this.activeMulti.onclick();
                }
                break;
                
            case KeyEvent.DOM_VK_TAB:
            
                // Disable key traversal when tabbing; tabbing is for natural DOM ordering
                this.switchMode(GTE.KEYMODES.NO_TRAVERSAL);
                break;
        }
    };
    
    parentModule.KeyTraversal = KeyTraversal;
    return parentModule;
    
}(GTE.UI));

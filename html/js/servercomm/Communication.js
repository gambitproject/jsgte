GTE.TREE = (function(parentModule) {
    "use strict";

    /**
     * Creates a new Communication Class.
     * @class
     */
    function Communication() {

    }

    Communication.prototype.sendPostRequest = function(url, parameters) {
        $.ajax({
          type: "POST",
          url: url,
          success: function (msg) {
            alert(msg);
          },
          data: parameters
        });
    };
    
    Communication.prototype.sendGetRequest = function(url, parameters) {
        $.ajax({
          type: "GET",
          url: url,
          success: function (msg) {
            alert(msg);
          },
           data: parameters
       });
    };

    // Add class to parent module
    parentModule.Communication = Communication;

    return parentModule;
}(GTE.TREE)); // Add to GTE.TREE sub-module

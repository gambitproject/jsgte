// This file loads all the modules in order to mantain a consistent structure
// and avoid undefined errors

var GTE = (function () {
    "use strict";
    var GTE = {};
    GTE.UI = {};
    GTE.TREE = {};

    GTE.CONSTANTS = {
      CIRCLE_SIZE: 20,
      DIST_BETWEEN_LEVELS: 150,
      LINE_THICKNESS: 3,
      MAX_HORIZONTAL_DISTANCE_BW_NODES: 250,
      VERTICAL_SHIFTING_ON_COLLISIONS: 50,
	  CONTENT_EDITABLE_OFFSET_LEFT: 350,
	  CONTENT_EDITABLE_OFFSET_RIGHT: 50
    };

    GTE.MODE = 0;
    GTE.MODES = {
      ADD: 0,
      DELETE: 1,
      MERGE: 2,
      DISSOLVE: 3,
    };
    if (Object.freeze) {
      Object.freeze(GTE.MODES);
    }

    return GTE;
}());

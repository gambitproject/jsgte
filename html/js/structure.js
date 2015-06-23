// This file loads all the modules in order to mantain a consistent structure
// and avoid undefined errors

var GTE = (function () {
	"use strict";
	var GTE = {};
    GTE.UI = {};
    GTE.TREE = {};

    GTE.CONSTANTS = {
      CIRCLE_SIZE: 25,
      DIST_BETWEEN_LEVELS: 150,
      LINE_THICKNESS: 3,
      MAX_HORIZONTAL_DISTANCE_BW_NODES: 250
    };

    GTE.MODE = 0;
    GTE.MODES = {
      ADD: 0,
      DELETE: 1,
    };
    if (Object.freeze) {
      Object.freeze(GTE.MODES);
    }

    return GTE;
}());
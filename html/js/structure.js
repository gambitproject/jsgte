// This file loads all the modules in order to mantain a consistent structure
// and avoid undefined errors

var GAMBIT = (function () {
	"use strict";
	var GAMBIT = {};
    GAMBIT.UI = {};
    GAMBIT.TREE = {};

    GAMBIT.CONSTANTS = {
      CIRCLE_SIZE: 25,
      DIST_BETWEEN_LEVELS: 50
    };

    GAMBIT.MODE = 0;
    GAMBIT.MODES = {
      ADD: 0,
      DELETE: 1,
    };
    if (Object.freeze) {
      Object.freeze(GAMBIT.MODES);
    }

    return GAMBIT;
}());
// This file loads all the modules in order to mantain a consistent structure
// and avoid undefined errors

var GAMBIT = (function () {
	"use strict";
	var GAMBIT = {};
    GAMBIT.UI = {};
    GAMBIT.TREE = {};

    GAMBIT.CONSTANTS = {
      CIRCLE_SIZE: 25
    };

    GAMBIT.MODE_ADD = true;

    return GAMBIT;
}());
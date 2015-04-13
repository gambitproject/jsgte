(function () {
	"use strict";
	// Get global canvas and store it in GAMBIT
	// GAMBIT is initialized by the library
	GAMBIT.canvas = SVG('canvas').size(300, 300);

	// Create a node and draw it
	var node = new GAMBIT.Node(false, null);
	node.draw();
}());
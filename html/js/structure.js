// This file loads all the modules in order to mantain a consistent structure
// and avoid undefined errors

var GTE = (function () {
    "use strict";
    var GTE = {};
    GTE.UI = {};
    GTE.TREE = {};
    GTE.TREE.UTILS = {};

    GTE.ORIENTATIONS = {
      VERTICAL: 0,
      HORIZONTAL: 1
    };
    if (Object.freeze) {
      Object.freeze(GTE.ORIENTATIONS);
    }

    GTE.CONSTANTS = {
      CIRCLE_SIZE: 20,
      DIST_BETWEEN_LEVELS: 150,
      LINE_THICKNESS: 3,
      BLOCK_SIZE : 5,
      MAX_HORIZONTAL_DISTANCE_BW_NODES: 250,
      VERTICAL_SHIFTING_ON_COLLISIONS: 50,
      CONTENT_EDITABLE_OFFSET_LEFT: 31,
      CONTENT_EDITABLE_OFFSET_RIGHT: 10,
      CONTENT_EDITABLE_MARGIN_TO_LINE: 22,
      CONTENT_EDITABLE_FOREIGN_EXTRA_WIDTH: 10,
      CONTENT_EDITABLE_GROW_TO_RIGHT: 1,
      CONTENT_EDITABLE_GROW_TO_LEFT: -1,
      CONTENT_EDITABLE_INSIDE_FOREIGN_MIN_WIDTH: 30,
      ISET_HEIGHT: 50,
      TEXT_NODE_MARGIN: 30,
      MAX_PLAYERS: 10,
      MIN_PLAYERS: 1,
      MATRIX_X: 100,
      MATRIX_Y: 100,
      MATRIX_SIZE: 100,
      DEFAULT_ORIENTATION: GTE.ORIENTATIONS.VERTICAL
    };

    GTE.MODE = 0;
    GTE.MODES = {
      ADD: 0,
      DELETE: 1,
      PLAYER_ASSIGNMENT: 2,
      MERGE: 3,
      DISSOLVE: 4
    };

    GTE.STRATEGICFORMMODE = 0;
    GTE.STRATEGICFORMMODES = {
      TREE: 0,
      GENERAL : 1,
      ZEROSUM: 2,
      SYMMETRIC: 3
    };

    if (Object.freeze) {
      Object.freeze(GTE.MODES);
    }

    GTE.COLOURS = {
        BLACK: "#000000",
        RED: "#FF0000",
        BLUE: "#0000FF",
        GREEN: "#008000",
        ORANGE: "#FFA500",
        BROWN: "#A52A2A",
        LIME: "#00FF00",
        DARKGREY: "#A9A9A9",
        DARKKHAKI: "#BDB76B",
        DARKORCHID: "#9932CC",
        DARKSALMON: "#E9967A",
        DARKCYAN: "#008B8B",
        DARKOLIVEGREEN: "#556B2F",
        DARKBLUE: "#00008B",
        DARKGREEN: "#006400",
        PURPLE: "#800080",
        DARKVIOLET: "#9400D3",
        YELLOW: "#FFFF00",
        FUCHSIA: "#FF00FF",
        AQUA: "#00FFFF",
        GOLD: "#FFD700",
        INDIGO: "#4B0082",
        KHAKI: "#F0E68C",
        LIGHTBLUE: "#ADD8E6",
        LIGHTCYAN: "#E0FFFF",
        LIGHTGREEN: "#90EE90",
        LIGHTGREY: "#D3D3D3",
        LIGHTPINK: "#FFB6C1",
        MAGENTA: "#FF00FF",
        MAROON: "#800000",
        NAVY: "#000080",
        OLIVE: "#808000",
        PINK: "#FFC0CB",
        VIOLET: "#800080",
        SILVER: "#C0C0C0"
    };
    if (Object.freeze) {
      Object.freeze(GTE.COLOURS);
    }

    GTE.PLAYERS = {
        DEFAULT_CHANCE_NAME: "chance"
    };

    return GTE;
}());

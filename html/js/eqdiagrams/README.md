This directory has .js routines for the equilibrium diagram.

* read payoff from the matrix

* draw equilibrium diagram ( n by 2 and m by 3 games)

* draw best response subdivided region (2 and 3 strategies)

* draw the equilibria path (2 by 2 games only)

* allow modification of the matrix by moving lines (n by 2 games only) or end points in diagrams.

##Files subdivision

###Diagrams.js
Main file it has multiple routines.
Mainly, it read the matrix into local arrays.

Draw diagrams for a 2 strategies opponent.

Draw and compte the best response diagram, equlibria path for 2 strategies opponent. 

It also contains event listener function to allow endpoints end lines to be moved.

###Line.js
Corresponds to the lines in the best response diagram for a 2 strategies opponent.
Important to make line movable.

###Endpoint.js
Corresponds to the endpoints in the best response diagram for a 2 strategies opponent.
Important to make endpoint movable.

###Intersection.js
Corresponds to intersection in the best response diagram for a 2 strategies opponent.
It contains the point, as well as stick and label in the subdivided line.

###MArker.js
Equlibrium marker for the equilibrium list.

###3D.js
Contains everything for the 3 strategies opponent drawing.


##TODO
Work on equilibrium representation for m by 3 games.
Allow the player 2 to have more strategies than player 1.



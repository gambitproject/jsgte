# Work by Amélie Heliou for GSoC 2016

I was a Google Summer of Code 2016 for the project
Gambit - Software Tools for Game Theory.

My work is on the branch "eqdiagrams" in the project
repository JSGTE (JavaScript Game Theory Explorer), on 

https://github.com/gambitproject/jsgte/tree/eqdiagrams

where this file resides as 
![](./amelie.md)

## Goal of the project

I implemented a display of best-response diagrams for small
two player games, which are intended for an understanding of
Nash equilibrium computation in education.
The goal is to create games interactively and display them
and their best-response structure on the screen.

The most detailed display is possible for 2x2 games where
both players have 2 strategies each. All mixed strategy
profiles and their best responses can then be represented on
a square. The best responses themselves are derived from
payoff diagrams above and point with arrows to the square.

This follows the specification at
![](./INFOS/eqdiagrams.md)

## How to start the program
The webpage can be load at [2byn](http://gambitproject.github.io/jsgte/2byn.html).
Payoff can be change by clicking on the "Edit matrix" button (not my implementation), by editing the matrix directly clicking on payoffs (not my implementation) or by clicking on endpoints and moving them (my implementation).

## Extension to mx2 games

## Extension to game with 3 strategies



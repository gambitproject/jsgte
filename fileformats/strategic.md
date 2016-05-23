# Strategic form display and file format

Date: 23 May 2016

Part of this extends and re-uses material from
[INFOS/start_GSOC_2016.md](../INFOS/start_GSOC_2016.md)



The strategic form is a table that lists STRATEGIES for each
player (rows for player 1, columns for player 2) and the
payoff to each player in the resulting cell.

For 3 players, there will be an additional choice of PANELS
for player 3, and each cell has 3 payoffs.

For 4 players, there will be rows of PANELS for player 3 and
columns of PANELS for player 4, and each cell has 4 payoffs.
While we will probably not use them, the potential
generality should be kept in mind.
E.g. we should not hardwire "2 players" into the payoff
vectors.

**IMPORTANT**:
The strategic form is DERIVED from the game tree, and
alternatively can be CREATED separately.

At the moment, there is no strategic form at all.

A basic solver for strategic-form games (which for two
players are called *bimatrix games*) is at 
http://banach.lse.ac.uk

The strategic form is also the basis for the display of
equilibrium diagrams (for Amelie).

We have to get basic input of strategic form games going
quickly. 
The display should be done as in GTE (which looks nice)
and is not too hard.
Game matrices can be input with input boxes.

Issue 3:

WYSIWIG input by with TAB and RETURN keys as in
spreadsheets.

Issue 4:

Creation of the set of STRATEGIES from the extensive form.
A strategies specifies a move for EVERY information set of
the player. When the info set cannot be reached due to an
OWN earlier move, then the move is left blank (or
represented with a "*"; display should be configurable).
The natural order of strategies requires an order, typically
breadth-first of the info sets of the player, because that
is the order in which the moves appear in the strategy.
Move names (such as "L" and "R") are allowed to appear for
different nodes, but are identified by their respective
info set; that correspondence must be clear.

The strategic form should appear on a separate canvas.
It would be nice if this appears (in small) next to the game
tree, or in a separate popup window (configurable? later)
while the game tree is created.
Changing a payoff will the immediately result in changes in
the strategic form (typically in more than one place as the
strategic form is rather redundant in that respect, much
more cells than game tree leaves).

Design requirement:

make top left corner of strategic form diagram (= endpoint
of diagonal separator) reference coordinate (0,0) like in
bimatrixgame.sty





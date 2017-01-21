# JSGTE development plan GSOC 2016

Date: 28 April 2016

GSoC students (and their mentors)

- Amelie Heliou (Bernhard, Rahul, Christian Pelissier)
- Harkirat Singh (Bernhard, Rahul, Alfonso Gomez-Jordana)
- Jaume Vives (Bernhard, Rahul, Davi Colli Tozoni)

This document gives an overview of our tasks for GSOC 2016.

All of us should know about the goals and issues, and
certain parts need to be decided as to who does what.

Harkirat is strongest on JavaScript, and best positioned to
get basic functionality working;

Jaume on game theory, translating game-theoretic concepts
(e.g. perfect recall) to algorithmic issues, and looking at
advanced problems such as game tree layout, drawing
information sets in games without time structure, with
overlap with Harkirat to be decided; 

Amelie will focus on visualisations of game theoretic
solutions for small games for educational purposes (as a
project we decided).

##  Client GUI

GTE is meant to be a portal for creating and automatically
analyzing games, and for learning about game-theoretic
concepts such as Nash equilibrium.

The blueprint is the current Flash implementation (see
www.gametheoryexplorer.org), which will be streamlined in
JSGTE.

The browser client (all in JS) will allow the drawing and
creation of games, and export to drawings that can be used
in papers. Games that fulfill certain conditions (e.g., two
players, perfect recall) can also be SOLVED by computing
their Nash equilibria. This will be done by sending the game
description to the server (which also hosts the client page)
which then computes equilibria and sends them back to the
client for display.

Currently, only a certain part of the client, namely the
drawing of game trees, is partially implemented.

### Game tree (extensive form)

The game tree is a certain logical data structure with the
following components:

- nodes, belonging to a player or to chance 
- moves, which label the edges from a node to its children
- for a chance nodes, moves are replaced by chance
  probabilities
- information sets (or info sets) which are sets of nodes, all
  of the same player and with the same moves, where a player
  does NOT know where they are in the info set
- payoffs to each player at each terminal node (leaf) of the
  game tree.

GTE allows to quickly draw game trees by clicking on nodes,
or sets of nodes (multiaction) which change the node
depending on a chosen MODE. Current modes are:

- add child (immediately two if the node has no children)
- delete the subtree starting at the node, or the node
  itself if it is a leaf
- set player
- merge info sets

In addition, the following data can be directly changed by
clicking on the respective text:

- player name ("1" to "Alice", "2" to "Bob" etc.)
- move name
- chance probability
- payoff

#### some open issues (details to follow)

The logical sequence of creating a game tree is:

1. add nodes to create tree
2. set player for each node
3. create info sets
4. create move names (default creation with consecutive
   letters)
5. set payoffs

Some stages can be skipped. 
E.g. the default for 3. is perfect INFORMATION where all info
sets are singletons.

If the user goes directly to 5. then the default move names
appear.

Issue 1:
(enhancement)

At the moment, 3. cannot be done before each node has a
player. However, it should be possible to create info sets
by merging nodes as long as the nodes have the same number
of children. The player name could be set later to the info
set.
This would allow to play with and test the creation of info
sets without having to tediously set players first.

Issue 2:
(essential)

At the moment, MOVE NAMES appear as soon as the "create
info set" mode (with the "link" icon) is chosen, with
automatic move names.
However, this is not good as the move names should come
AFTER info sets have been created because otherwise the
automatically created names have gaps.

Solution: there should be a separate "move names" stage,
which can be fully automatic. This stage (4. above) can only
be reached once all info sets have players.

### Strategic (matrix) form

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

#### Perfect recall

To be assumed for strategy generation.
Needs discussion.

#### Payoff display style

There are two possible ways to display the payoffs in a
cell (always with matching colours):

- in diagonal corners (lower left row player, upper right
  column player)
- comma-separated on a single line 
- for 3 and more players, while comma-separated seems
  easiest, this will make the cell much wider than high
  so staggering the payoffs from lower left to upper right
  in order row (player 1) / column (player 2) / panel
  (player 3) will save horizontal space and use the square
  cell better.  

#### Feature (later but not too hard?)

Permute (swap) players with a single click.

Trickier for 3 or more players, where it would be nice to
drag and drop a player into a new position.

Another question is the EFFECT of the player swap.
The clearest effect would be to keep the colours and player
names: that is, from the standard description of red for the
row player 1 and blue for the column player 2, the swap
would result in blue (and player name 2) for the row player
and red (and player name 1) for the column player, and of
course exchanged strategy names and payoffs.
There could be then a second button that says "reset to
standard colors and player names". The names then become 1
and 2 even if they have been Alice and Bob before.

In the extensive game, this player swap would have NO
perceptible effect except at the leaves where the payoffs
are transposed. Here it may be more natural to change the
player names. To be discussed. Preferably configurable.

### Displaying equilibria

Currently text.

Need format to display strategies, and strategy profiles,
perhaps with associated pure-strategy payoffs.

Nice would be: Graphical display of equilibrium (optical
display of probability), highlighting equilibrium support,
and payoff next to strategy - probably at other side of
table, i.e. on the right for row player, and at the bottom
for column player, to verify equilibrium property.

### Finding equilibria

Small games allow to find all equilibria quickly.

For larger games, algorithms to find ONE equilibrium should
be run first because they are quicker.

The decision on which algorithm to trigger could be made by
the CLIENT.

## Server programming (Harkirat)

Currently JETTY but unstable.
Should be APACHE.

- How to react to choice of algorithm?
- needs formatting as needed for "Displaying Equilibria"
  above

### Undo and Redo

I suggest the following:
The game tree, or in fact any game, is a data structure that
encodes the tree and its graphics information along with a 
central `mode status` object that encodes:

- the current MODE (add/delete node etc.)
- graphics parameters (such as line thickness)

Each event (typically mouseclick on the canvas) induces
either a change of the mode or the tree.
For simplicity, I suggest to keep everything together, and
perform the following after an event:

- deep-copy the entire tree, including the `mode status`
  object, and put it on an undo stack.
- Then perform on the CURRENT tree the change, either in the
  `mode status` or (more complex) the tree
- the new tree is then redrawn.
- actions such as exporting to a picture or saving a file
  are not put on the undo stack, but before creating an
  entirely new game or loading a game the current game is
  put on the undo stack.

When clicking UNDO, the tree is simply taken to be the
previous one on the stack, while KEEPING the forward part of
the stack (as a list) for possible REDO. 
The forward part is either overwritten (i.e. lost
completely) by new events, or (probably better) some
INSERTIONS take place before abandoning the old REDO
possiblities.

Although this wastes space, it looks simplest.
Perhaps a log file that records each event could be written
alongside.

## Refactoring code (early!)

In general, Harkirat and Jaume should familiarize themselves
with the code, and refactoring will be a good way to do so.
Here are some suggestions with possible improvement
possibilities to learn about the code.

### coordinates of graphics elements

- current graphics coordinates add funny parameters related
  ato node size to all graphics elements, preventing
  orthogonality - see also issue #74 (bug)
  https://github.com/gambitproject/jsgte/issues/74

Remedy: 

- all nodes are located at their CENTER, not lower
  left corner 

- reference is root at 0,0

- new general drawing method based on these

### make settings panel independent

At the moment, the settings panel (cogwheel icon) is drawn
in the middle of the canvas.
It should be a separate canvas, which can also go into a
popup window and be moved.

Also, it should have three buttons similar to the XFIG
drawing program:

- `Cancel` (abandons changes)
- `Apply`  (tries changes)
- `Done`   (applies changes and quits)

All these will be put into the settings / mode object and
stored (except when `Cancel`)

### separate tree layout module

At the moment, tree.js has 72 methods and 1330 lines of
code.
I suspect the tree layout is computed in an interspersed
manner throughout the tree.js code.
It should be separate.  

## Displaying equilibrium diagrams (Amelie)

see separate file `eqdiagrams.md`.




# JSGTE development plan GSOC 2016

Date: 26 April 2016

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

The blueprint is the current Flash implemenation (see
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
http://www.banach.lse.ac.uk

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

#### Feature (later but not too hard)

Permute (swap) players with a single click.

### Finding equilibria

Small games allow to find all equilibria quickly.

For larger games, algorithms to find ONE equilibrium should
be run fast because they are quicker.

The decision on which algorithm to trigger could be made by
the CLIENT.

### Displaying equilibria

Currently text.

Need format to display strategies, and strategy profiles,
perhaps with associated pure-strategy payoffs.

Nice would be: Graphical display of equilibrium (optical
display of probability), highlighting equilibrium support,
and payoff next to strategy - probably at other side of
table, i.e. on the right for row player, and at the bottom
for column player, to verify equilibrium property.

### Server programming (Harkirat)

Currently JETTY but unstable.
Should be APACHE.

How to react to choice of algorithm?

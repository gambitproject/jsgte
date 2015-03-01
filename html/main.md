/index.html - Specification of the (js) GTE main page

We want to replicate the buttons and actions of the main
page. These have the following parts:

Top row:

- left group, file IO: new game / load / save / export to
  PNG / export to FIG

- central arrows: Tree -> Players -> Infosets -> Moves ->
  Payoffs

- algorithm selection buttons (need improvement)

- rightmost group: zoom and pan button (obsolete, will be
  handled by the browser), switch between fraction and
  decimal (currently buggy, no SPOT = single point of
  truth), settings

Bottom row

- main panels: Extensive Form, Strategic Form (to be merged
  with Matrix Layout and shown in the latter, graphical
  format only)

- mode buttons for Tree: add, delete (change functionality
  for subtree deletion: if the node is not a leaf, delete
  all its descendants first and thus turn it into leaf; only
  delete node when it is a leaf; this reverts more naturally
  an "add" operation and is also easier to follow visually;
  stated as issue https://github.com/gambitproject/gte/issues/11 )

- mode buttons for Players: player name change by clicking
  on the player text on the canvas, not the ad hoc `Player 1
  name` box; adapt to 2-4 players; check what Christian did
  at 
  https://github.com/cpelissier/GTE-Extension

- mode buttons for Infosets:

# /index.html - Specification of the (js) GTE main page

We want to replicate the buttons and actions of the main
page. These have the following parts:

Top row:

- left group, file input/output: new game / load / save / export to
  PNG / export to FIG
  (_want:_ further picture formats)

- central arrows: Tree -> Players -> Infosets -> Moves -> Payoffs

- algorithm selection buttons:

  * Lemke is currently used for Extensive Form, default should be LrsEnum
    based on the strategic form; *later*: incorporate Wan's enumeration
    based for sequence form, excellent test case: commitment game so that
    mixed NE are displayed as behaviour strategies.

  * choices of algorithms for Strategic Form. Normally only *one* default choice.

- rightmost group: zoom and pan button (obsolete, will be
  handled by the browser), switch between fraction and
  decimal (currently buggy because is not kept when
  switching from Extensive to Strategic form,
  no SPOT = single point of truth), settings (= user
  preferences)

Bottom row

- main panels: Extensive Form, Strategic Form (to be merged
  with Matrix Layout and shown in the latter, graphical
  format only)

- mode buttons:
    - under `Tree`: add, delete (change functionality
      for _subtree deletion:_ if the node is not a leaf, delete
      all its descendants first and thus turn it into leaf; only
      delete node when it is a leaf; this reverts more naturally
      an "add" operation and is also easier to follow visually;
      stated as issue https://github.com/gambitproject/gte/issues/11 )
    
    - under `Players`: player name change by clicking
      on the player text on the canvas, not the ad hoc created box
      `Player 1 name`; adapt to 2-4 players; check what Christian did
      at https://github.com/cpelissier/GTE-Extension
    
    - under `Infosets`:


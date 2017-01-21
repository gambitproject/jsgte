# index.html - the (js) GTE main page

We want to replicate the buttons and actions of the main
page. These have the following parts:

## Extensive Form panel

### Top row:

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

### Bottom row

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
      `Player 1 name`; see https://github.com/gambitproject/gte/issues/30;
      adapt to 2-4 players; check what Christian did
      at https://github.com/cpelissier/GTE-Extension
    
    - under `Infosets`:
      create (=join), dissolve, cut apart infosets.
      Icons OK. Q: add _perfect recall_ button?  
      If too many buttons, omit `cut` (scissors) button?  

    - under `Moves`:
      currently two buttons labeled A1 A2 for entering all
      moves of player 1 / player 2 in one go. Can be left as
      a prototype with `window.prompt()` and subsequent
      parsing (very easy). Should later be replaced by
      tabbing through moves (first of current player, then
      of next player, in circular fashion, traversing tree
      breadth-first).
      The lightbulb button creates an autonaming of moves;
      leave by replace icon.

    - under `Payoffs`:
      two Lego-brick icons (need to change if we keep them)
      prompt for entire list of payoffs of respective
      player. As for moves, can be left as prototype but
      replace by tabbing (and cursor down for next player).
      The "magic wand" icon creates random payoffs. Replace
      by die (confusion with chance player?).
      The vertical bars rename with ordered payoffs. These
      were used for identification purposes. The 
      last button, to be kept, toggles **zero-sum** payoffs.
      (Currently buggy, not kept for strategic form.)

## Strategic form panel 

To be merged with Matrix layout panel.

`Click to edit` button: we should avoid this button, and
recover from any massive edits (e.g., clicking on the
zero-sum button which destroys half the payoffs) via undo.

After `click to edit` currently radio buttons for choice
between general payoffs, zero-sum, symmetric game.

zero-sum button should persist across switch between the
panels.

### Simultaneous display of both panels

Simultaneous display of extensive and strategic form
would be interesting as a _view_ option, perhaps also
in "detachable" windows that can be minimized.

Not in first version, but code should be such that
_where_ the display (of the strategic form, say)
happens can be easily changed at a high level.

## Further desirable extensions:

- switching / rotating players (keeping names and colours,
  to be studied how)

- flip (mirror) game tree in addition to rotation.


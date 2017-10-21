## 1) Naming of strategies.
**They should be A,B,C etc. for
player 1 but then not a GAP in the letters for player 2,
i.e. continue with d,e,f,g. They are editable so no big deal
and of course don't matter much but I find this not pretty
as it is at the moment.**

*Not sure where that is (not in my code). Somewhere in the initialization
of the matrix.*

## 2) Size of the strategic form table should not shrink.
**See attached screenshot 2x5.png
As soon as we have 4 or more strategies of one player and
the other player as 2 or 3 strategies, only one diagram can
be displayed, so there is enough space to display the matrix
even even when it is horizontal (2xn) because then only
player 2's diagram is shown which is further to the right.
And an mx2 or mx3 game has only 2 or 3 columns and also
fits. But I am even happy to have only 2 or 3 rows since one
can always transpose the game (exchange the two players).**

*That sounds a bit difficult.
For now, the matrix and diagrams leave in different part of the page. 
For the matrix to cover the left diagram when it is missing, I have to change the whole layout.
It worths trying.*

## 3) Rename
**"General" to two direct entry fields with "rows"
and "columns" (which we should limit to, say, 6 and minimum
2) rather than the pop-up dialogue, and DISABLE "Zero Sum"
and "Symmetric". While these last two buttons simplify the
input, they are not observed when the payoffs are
manipulated by moving the endpoints up and down. Morever,
the zero-sum payoffs are negative and don't look so nice in
the diagram.**

*That is all in "index.html" shouldn't be difficult to do.*

## 4) big change, a new but useful feature.
**At the moment it is
rather confusing, and creates a lot of difficulties for you,
to start with the all-zero payoffs which is the most
degenerate game possible. So I suggest to start with a
generic game which directly give examples. I attach two
examples in screenshots
generic2x5.png
123.png
2x3.png**

*I don't know either where that initialization is done, surely 
in the matrix code, I'll look into it.*

## 4a) I notice no correct equilibrium computation for 3x3
games yet.
**We do have a program that does compute them in
full - would you like to make use of it? Otherwise we could
limit ourselves to 2xn games only where you can compute them
directly (and I can explain how).**

*Yes I'd like to know which algorithm you use.*

## 5) small change:
**as e.g. in generic2x5.png and elsewhere,
could you draw the yellow endpoint-disks ABOVE (foreground)
the lines?**

*Sure, in the 2D.js.
I just need to move all endpoints above the lines once I've drawn the lines.*

## 6)
**small change: the separating vertical lines are new and I
like them. Can you draw them THINNER?**

*in the css, file. Just add a class to those line and specify them thinner.*

## 7) probably not easy to fix but currently difficult for
usage. Please see attached
**line.png
trycorner.png
triangle.png
(I had to take first a video screenshot so one can see the
cursor to get these). I have sometimes difficulty in
"grabbing" a yellow dot. This relates to:

Moving a line manually in a 2D diagrams is not possible.
I could do it in a few hours, but I'm not sure it is
really an improvement. I like moving only the circles, and
directly updating the matrix if we want to do big changes.

I can accidentally grab either a line or an entire part of
the upper envelope polygon or a triangle in the 3D part, but
this "moving" has no effect. In particular I cannot move the
line. Perhaps this can be disabled?**
*That is the event listeners of 2D.js and 3D.js.
I'm not sure how to do that, I need to learn more on event.
But I agree that is important*

## 8) small change:
**please use 2 decimal digits for an
equilibrium (0.333333333333333333315 is not informative),
and also for the probabilities marked at the subdivision.
See generic2x5.png where you round 1/3 to 0.3 and 3/4 to
0.8. Since all probabilities are between 0 and 1, it is
worth to sacrifice the leading zero and write .2 .33 .5 .75
to save space.**

*That is in the diagram.js, the "round" function
in my add_eq_text function will do :)*

## 9) Equilibrium points should go back. 
**Equilibria are not explicitly drawn on the square, nor
the line. I not sure it is a good idea to do it. Generic
games it is great, but if the game is not generic, then
equilibria can be degenerated and it is a mess to draw
them.

This is one of the main points of the program, to visualize
an equilibrium. I agree that for the all-zero game they are
a mess and should then be omitted. This relates to point 4)
above. But even an equilibrium which is a line segment is
useful to draw.**

*Alright, it shouldn't be difficult in the function 
"draw_square_down" of Diagram.js I have everything to color
the bottom square. It is just technical to place the line segment.*

## 10) To remove one problem with degeneracies,
**perhaps simpler
than 4), one could omit in the drawing (by showing them much
paler) duplicate columns in the payoffs for player 2 in the
upper envelope diagram. Consequently, one should also do
this for duplicate rows of player 1. The reason is that
these would appear as identical in the diagram.
I have not fully thought this through.
In a starting all-zero-payoff game, this would suppress all
strategies except the first of either player.**

*I need to think more about it. It might become tricky,
for example, how to I represent a 2*3 game when palyer 2 has 2
identical strategy? Should it be has a 2 or a 3 strategies diagram.
But yes, it is feasible because every drawing start by reading the matrix
therefore if two strategies are identical I can merge their name and use only one.*

## 11) small change:
**rename "Precision" to "grid precision" and
allow only multiples of 0.1. This restricts the movement of
the disks (very useful). In fact, it is probably best to
offer only divisors of 1, so the 4 choices 0.1 0.2 0.5 1
(if you now choose 0.3 you cannot go to the next integer,
even now).**

*In Diagrams.js *

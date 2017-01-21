This directory has .js routines for 
the strategic form:

- display of strategic form

- GUI input

- setting player names (not existing yet)

- setting number and names of strategies

Elements of a game in strategic form are:

- players
- strategies (list for each player)
- payoffs

- Q: how to index payoffs? Via multidimensional array or
  single-dim array indexed with strings that are strategy
  profiles (JS uses string-indexed arrays anyway).
  Suggestion: single-dim
  (will be independent data structure anyhow)

Functionality:

- editing payoffs (tabbing through entries in spreadsheet
  style)
- starting equilibrium computation

New functionality (in order of importance) 

- showing best response payoffs in boxes 

- writing long strategy names (as they may arise from the
  extensive form) in readable format, especially for the
  columns so that they fit the column, either vertically or
  at an angle, or broken across multiple lines

- swapping players (permuting for more than two players)

- swapping / permuting rows or columns

- showing strictly dominated strategies 



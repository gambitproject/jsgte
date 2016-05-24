## Strategic Form

The role of the Strategic form would be to convert the complete game tree (in which all nodes are assigned with players and all leaf nodes have payoffs assigned to them) into strategic form.
The strategic form for an n-player game would be an n-dimensional matrix.
As suggested by Bernhard, the matrix should be integer addressable rather than string addressable. To implement this functionality, the following classes have been added to jsgte.

Right now it is being implemented only for 2 player games as they are easy to represent. Can be extended to n-player games after further discussion.

## Matrix.js
The role of matrix.js is to create an instance of the matrix that will be rendered to the Canvas when the user wants to see the strategic form of the game tree.
It will contain a multidimensional array of the type strategyBlock which will be indexed by integers itself. There will be prototype functions that will return (n-1) dimensional arrays of a given strategy passed as a parameter.

## StrategyBlock.js
The role of StrategyBlock.js is to create an instance of strategyBlock class. The strategy class represents one unit of the matrix represented by Matrix.js. It will have parameters :
coordinate -> array of coordinates used to reference this particular strategy ( the number will be equal to the number of players)
strategies -> an array of strategies that are used in this StrategyBlock instance. 
node -> the leaf node to which these set of strategies point to

##Strategy.js
The role of Strategy.js is to create an instance of a strategy. A strategy represents for a particular player, a set of moves that he may take forward
player -> The player whose strategy is represented in this strategy.js instance.
moves -> a set of moves assigned to this player
This class will also contain a toString method which will output the set of moves in string format.

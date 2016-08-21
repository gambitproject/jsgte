Welcome to StackEdit!
===================

#  Documentation of the work done by Jaume Vives 

During the Google Summer of Code  2016 I participated in the project *Gambit - Software Tools for Game Theory* focusing on the theory and implementation of algorithms to display the strategic form of Game Theory games and the computation of best responses. The work can be divided in 3 parts: 

> 1. Implementation of an improved strategic form information structure to the current GTE display software
> 2. Creation of a javascript program to compute best responses and display the strategic form of n-player games with finite strategies
> 3. Implement a function to identify whether an extensive form game has *perfect recall*


## Strategic Form and GTE

In **Game Theory** the strategic form or normal form of a game is a way of representing such game. It can be described by the number of players, a number of strategies for each player and a payoff matrix for each player. In the demo a game is generated with 2 players and 2 strategies, but the number of strategies can be extended under *Set Dimensions* and the payoff matrices can be entered under *Edit Matrix*. The characterisation of the game implies simultaneity, that is we assume that each player chooses his or her strategy at the same time. It is important to not confuse the *strategies* described here with the *actions* in the extensive form. A strategy is a collection of actions that a player chooses to play, whereas an action is simply a decision that a player makes on a non-terminal node. For example, consider the following Entry Game in strategic form:

<img src="https://raw.githubusercontent.com/gambitproject/jsgte/master/INFOS/images/Screen%20Shot%202016-08-20%20at%2021.28.10.png" width="200" height="200" />

And in extensive form:

<img src="https://raw.githubusercontent.com/gambitproject/jsgte/master/INFOS/images/Screen%20Shot%202016-08-20%20at%2021.27.02.png" width="300" height="200" />

In this classic game a company must decide wether to enter a market inhabited only by the Incumbent. If it decides to enter, then the incumbent can decide to cooperate with the entrant and produce low output or to be aggressive and produce high output. The strategies for the strategic game are however Out and In for the Entrant and High and Low for the Incumbent. Even though when the entrant chooses Out the Incumbent has no action in the extensive form, there exist strategy profiles in the normal form in which Out High and Out Low have an associated payoff vector. 

As we have seen in the previous example it is important to differentiate between the extensive and strategic forms of a game. That is why, according to the guidelines in the Gambit Program (!!) we decided that the strategic form characterisation should be independent of the extensive form (the decision tree). In the current code this was not the case as the information structure that generated the strategic form had many references to tree objects and each time a change was made in the strategic form the whole tree data structure had to be accessed. With this in mind, I was tasked with creating a fully independent strategic form.

The data structure designed to be implemented was centred around the *strategy profiles*. A strategy profile in a normal form is an n-tuple of strategies, one for each player, that describes one of the *boxes* of the panel. In this way each game has as many strategy profiles as combinations of strategies of all players. For instance in a 3 player game in which player 1 has 3 strategies, player 2 has 4 strategies and player 3 has 2 strategies the total number of strategy profiles would be of 3 x 4 x 2 = 24. Furthermore, each strategy profile has an associated payoff vector that describes the payoff for each player were the combination of strategies that defines the profile played. In this way if we know the number of players, the strategy profiles and the associated payoff vectors we can successfully describe the game in strategic form. 

In order to maximise the efficiency of the structure I created a profiles object in javascript that would have the strategy profiles ids (a collection of coma separated strategy ids) as indexes. So that no search function was required to retrieve the information stored in a profile. In this way each profile could be accessed, created and modified easily. For a 2 player game with strategies numbered 0,1,2 for player 1 and 0,1,2,3 for player 2, *profiles[1,2]* is enough to get all the information stored in the profile defined when player 1 plays strategy 1 and player 2 plays strategy 2. Each profile indexed in this way in the profiles object was itself an object containing the following properties:

code: 	


		profiles[ID] = {id: ID, payoff: payoffs, bestResponse: []}


Where ID is the l	ist of coma separated strategy ids for each player, payoffs is an array containing the payoff (an integer) for each player and bestResponse is an boolean array with true or false values for each player. Specifically, if the strategy of a given player is a best response (i.e. maximises the players’ payoff given the other players strategies in that profile) then the bestResponse array will have a true value in the position corresponding to that player. If all positions in the array have value true then that collection of strategies defines a pure strategy Nash Equilibrium. More on how the best responses are found will be detailed later on.

The remaining information is organised in one main constructor * Normal Form * that contains properties: number of players (an integer), players (an array containing the player objects) and the profiles object. From there, each player constructor has a player id (an integer), a player name (a string), the number of strategies for that player and an array containing all the strategy objects for that player. Finally, the strategy constructor has a strategy id (a number 0,…,n where n is the number of strategies for a player), a player id and a strategy name. The actual code follows for completeness:

CODE

	  function NormalForm() {
        this.players = [];
        this.numberOfPlayers;
        this.profiles = {}; 
    }

    function Player(id, numberOfStrategies) {
        this.id = id;
        this.name = "" + this.id;
        this.numberOfStrategies = numberOfStrategies;
        this.strategies = [];
    }

    function Strategy(id, name, player) {
        this.id = id; 
        this.name = name; 
        this.player = player;
    }

This description of the strategic form is independent of the extensive form and with it we can easily find the best responses for n-player games.


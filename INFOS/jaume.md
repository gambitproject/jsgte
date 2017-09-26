
#  Documentation of the work done by Jaume Vives 

During the Google Summer of Code  2016 I participated in the project *Gambit - Software Tools for Game Theory* focusing on the theory and implementation of algorithms to display the strategic form of Game Theory games and the computation of best responses. The work can be divided in 3 parts: 

> 1. Implementation of an improved strategic form information structure to the current GTE display software
> 2. Creation of a javascript program to compute best responses and display the strategic form of n-player games with finite strategies


The work that I have done can be found [here](https://github.com/gambitproject/jsgte/tree/jaume-strategic).
As I worked by updating and modifying the previous code using the SVG display please refer to the *jaumestrategic* and *strategic* folders to analyse my contribution. As well as strategic.html and first.html for the output, a Demo will be provided later on.

A list to the commits is [here](https://github.com/jvivesb?tab=activity). As I worked independently, I pushed the commits towards the end of the program.

## Strategic Form and GTE

In **Game Theory** the strategic form or normal form of a game is a way of representing such game. It can be described by the number of players, a number of strategies for each player and a payoff matrix for each player. In the demo a game is generated with 2 players and 2 strategies, but the number of strategies can be extended under *Set Dimensions* and the payoff matrices can be entered under *Edit Matrix*. The characterisation of the game implies simultaneity, that is we assume that each player chooses his or her strategy at the same time. It is important to not confuse the *strategies* described here with the *actions* in the extensive form. A strategy is a collection of actions that a player chooses to play, whereas an action is simply a decision that a player makes on a non-terminal node. For example, consider the following Entry Game in strategic form:

<img src="https://raw.githubusercontent.com/gambitproject/jsgte/master/INFOS/images/Screen%20Shot%202016-08-20%20at%2021.28.10.png" width="250" height="250" />

And in extensive form:

<img src="https://raw.githubusercontent.com/gambitproject/jsgte/master/INFOS/images/Screen%20Shot%202016-08-20%20at%2021.27.02.png" width="350" height="250" />

In this classic game a company must decide wether to enter a market inhabited only by the Incumbent. If it decides to enter, then the incumbent can decide to cooperate with the entrant and produce low output or to be aggressive and produce high output. The strategies for the strategic game are however Out and In for the Entrant and High and Low for the Incumbent. Even though when the entrant chooses Out the Incumbent has no action in the extensive form, there exist strategy profiles in the normal form in which Out High and Out Low have an associated payoff vector. 

As we have seen in the previous example it is important to differentiate between the extensive and strategic forms of a game. That is why, according to the guidelines in the project guidelines we decided that the strategic form characterisation should be independent of the extensive form (the decision tree). In the current code this was not the case as the information structure that generated the strategic form had many references to tree objects and each time a change was made in the strategic form the whole tree data structure had to be accessed. With this in mind, I was tasked with creating a fully independent strategic form.

The data structure designed to be implemented was centred around the *strategy profiles*. A strategy profile in a normal form is an n-tuple of strategies, one for each player, that describes one of the *boxes* of the panel. In this way each game has as many strategy profiles as combinations of strategies of all players. For instance in a 3 player game in which player 1 has 3 strategies, player 2 has 4 strategies and player 3 has 2 strategies the total number of strategy profiles would be of 3 x 4 x 2 = 24. Furthermore, each strategy profile has an associated payoff vector that describes the payoff for each player were the combination of strategies that defines the profile played. In this way if we know the number of players, the strategy profiles and the associated payoff vectors we can successfully describe the game in strategic form. 

In order to maximise the efficiency of the structure I created a profiles object in javascript that would have the strategy profiles ids (a collection of coma separated strategy ids) as indexes. So that no search function was required to retrieve the information stored in a profile. In this way each profile could be accessed, created and modified easily. For a 2 player game with strategies numbered 0,1,2 for player 1 and 0,1,2,3 for player 2, *profiles[1,2]* is enough to get all the information stored in the profile defined when player 1 plays strategy 1 and player 2 plays strategy 2. Each profile indexed in this way in the profiles object was itself an object containing the following properties:


		profiles[ID] = {id: ID, payoff: payoffs, bestResponse: []}


Where ID is the list of coma separated strategy ids for each player, payoffs is an array containing the payoff (an integer) for each player and bestResponse is an boolean array with true or false values for each player. Specifically, if the strategy of a given player is a best response (i.e. maximises the players’ payoff given the other players strategies in that profile) then the bestResponse array will have a true value in the position corresponding to that player. If all positions in the array have value true then that collection of strategies defines a pure strategy Nash Equilibrium. The following figures show how the BR are displayed:

<img src="https://raw.githubusercontent.com/gambitproject/jsgte/master/INFOS/images/BR_Example.png" width="300" height="300" />

Currently the BR box generator only works for integers 0-9, as the content-editable features of the payoff text doesn't allow the square to change size dynamically in a visually appealing way. 

The remaining information is organised in one main constructor *Normal Form* that contains properties: number of players (an integer), players (an array containing the player objects) and the profiles object. From there, each player constructor has a player id (an integer), a player name (a string), the number of strategies for that player and an array containing all the strategy objects for that player. Finally, the strategy constructor has a strategy id (a number 0,…,n where n is the number of strategies for a player), a player id and a strategy name. The actual code follows for completeness:

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

## Demo 

Using the above description I adapted the current strategic form code to use the desired information structure and compute the best responses efficiently. 

Here you can find a link to the [demo](https://jvivesb.github.io/jsgte/strategic.html). Please open it with Mozilla Firefox.

Instructions are simple:

1. Feel free to change the value of the payoffs as they are editable
2.  Change the dimension of the matrix by using the *Set Dimensions* button 
3.  Input the players payoff matrix by using the *Edit Matrix* button
4.  Press *Generate Best Responses* to find the NE and display boxes around the payoffs that are a best response for a given profile



# Finding the Best Responses and Displaying the Strategic Form

I also worked on an algorithm to find the BR for N-player games with finite strategies. The idea is to produce the right combinations of payoffs in the strategy profiles to compare them efficiently and find the best responses and hence the Nash Equilibria. This independent code has 2 functions:

1. Generates the Best Responses for N-player games with finite strategies
2. Displays correctly the strategic form of N-player games with finite strategies

By a correct display we mean a display according to the specifications of the [program](https://github.com/gambitproject/jsgte/blob/master/INFOS/start_GSOC_2016.md) that only table for player I and II are shown and additional panels for each strategy combinations of the other players. For instance, if we have 3 players and player 3 has 2 strategies A and B then we would display 2 panels, one for strategy A of player 3 and the other for strategy B of player 3. For players Max and Claudia and Ben's strategies A and B we generate the following display:

<img src="https://raw.githubusercontent.com/gambitproject/jsgte/master/INFOS/images/3playerEg.png" width="400" height="250" />

A demo can be found [here](https://jvivesb.github.io/jsgte/first.html).

The UI is very basic as the focus of this part of the project was to have functioning algorithms, not a complete SVG display. Part of these algorithms are then implemented in the previous section in the Strategic Form SVG display (the previous demo) for 2 players. 
A brief overview of how to work with the demo is given here:

1. Introduce the information relating to the game: number of players, player names, number of strategies per player and names of each strategy.
2. The program generates the strategic form and allows you to input the payoff vectors for each strategy profile in a comma separated format (i.e. 1,2,3)
3. The BR and Nash Eq. are computed and identified.

The Demo offers little interactivity as it is aimed at simply showing how the algorithms work and not how they integrate with an SVG display. 

# Finding and Displaying the Best Responses Cycles

As proposed in [Ahn 2006](https://eml.berkeley.edu/~dahn/AHN_cycle.pdf) there is bound on the number of cycles that can exists for generic two player games. A game is generic when each BR for all players is singleton valued. The most trivial example is the Matching Pennies game in which no pure strategy Nash Equilibrium exists. 

It is quite straightforward to desing an algorithm that finds the BR cycles of a generic 2 player game. Since each strategy profile only has 1 BR for each player, we can easily follow the BR path accross the strategy profiles by keeping a Set() of the profiles we have visited and queu for each cycle present in the game. For each profile that we add to the cycle queu we remove it from the set. Once all profiles in a cylce have been visited the algorithm simply picks another profile from the set and repeats the same procedure for that cycle. Since all profiles in a generic game are part of the cycle, the algorithm explores all profiles in linear time. 

An straightforward example is displayed below:

<img src="https://github.com/gambitproject/jsgte/blob/master/INFOS/images/Screen%20Shot%202017-09-25%20at%2015.40.13.png" width="500" height="500" />

As you can see this 5x5 generic game has 3 cycles with the largest cycle having 12 profiles (the max possible according to Ahn's upperbound).

If you want to create your own generic game and find the BR cycles you can find the [here](https://github.com/jvivesb/jsgte/blob/jaume-strategic/html/strategic.html) and full [DEMO](http://htmlpreview.github.io/?https://github.com/gambitproject/jsgte/blob/jaume-strategic/html/strategic.html). Please open the Demo with Mozilla Firefox as other browsers might not be supported.

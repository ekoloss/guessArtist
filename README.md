<b>Technical Interview - Backend oriented (short)</b></br>
You are required to create a Web application that implements the following game: Guess the artist
The game has 5 rounds.</br></br>
Part 1:</br>
At the start of the game, a famous artist/band is chosen from a list of 10 predefined artists. (Choose your preferred bands/singers. For example: “Beatles”, “Jack Johnson”, etc...)
Your code will retrieve 5 random albums recorded by that artist from the iTunes API. iTunesAPI
On each round an album name is shown to the user.</br>
The user has 1 attempts to guess the exact full name of the artist.</br>
After each failed round, the user is shown another album name by that artist.</br>
When the user guesses the correct answer, he gets 5 points and the game is over.</br>
When the user fails on all 5 rounds, the game is over.</br>
When the game is over, the score is shown to the user, and a username is requested so that the score will be stored.</br>
the user name should be unique in the DB so users can play again and improve their score.</br></br>
Part 2: Enrichments -</br>
We would like to save albums of the 10 predefined artists in the DB so we don't have to query the iTunes API every time a new game starts.</br>
After a user finishes a game, calculate a list of top 3 players (you can assume there is only one process running)</br>
We would like to track the enrichments above and write them to a file.

“New albums available” after finishing the album enrichment The list of the top 3 players
Technical specs:
1. Please implement using the following technologies: Node.js, React, Typescript, and
   DB of your choice (should make sense with the data stored).
2. You are allowed to use any additional libraries if you wish.
3. The website must have a basic design.
4. Please note code structure best practices
   For any additional specification’s questions, please use common sense and continue.
   

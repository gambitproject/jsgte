# jsgte - JavaScript implementation of Game Theory Explorer

html/ contains the files for the JS implementation of GTE

Note: .html files are on their github URL displayed with
their source code, as all code files on github, and NOT as
html pages.

To test them as html pages you can navigate to

http://gambitproject.github.io/jsgte/

To update this when changes happen to master type

  `ghp-import -p html`

This moves the directory `html`, which contains `index.html`, to the root of a
new branch gh-pages. For more details see

https://help.github.com/categories/github-pages-basics/

On Linux you can install ghp-import via 

  `pip install ghp-import`

##SERVER INSTALLATION
1. cd server
2. Install node
3. Install npm
4. run "npm install"
5. Download lrslib-061.tar.gz (You can use the command : "wget http://cgm.cs.mcgill.ca/~avis/C/lrslib/archive/lrslib-061.tar.gz")
6. Extract file (" tar -xvzf lrslib-061.tar.gz")
7. cd lrslib-061
8. Compile all the algorithms (make all)
9. cd .. (server)
10. Run "node server.js" (Make sure you are in the server directory)
11. localhost:3000/tree for tree games
12. localhost:3000/strategic for independent games
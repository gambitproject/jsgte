# html/ - HTML directory for the GTE webpage

This directory will contain the webpage for GTE as 

./index.html

with JavaScript (JS) scripts in ./js/ and subdirectories.

Documentation in .md files.  

The deployment version will have a minified version, with
comments and indentations removed and all .js files in a
single file, which then posted on a suitable directory at
http://www.gametheoryexplorer.org/

The webpage in the current directory (or any corresponding
fork/copy) with non-minified .js files should work as well.

## JS issues

We list here a few main decisions about JS
that we need to make
for the whole project.

## JS modules

Alfonso suggested to use a standard package
[require.js](http://requirejs.org)
which provides Asynchronous Module Definition that allows to
load .js files only where needed.
Given that the whole JS code will fit into a single minified
file of a few hundred kilobytes, it is unlikely that we will
need splitting it in that way.

In addition, require.js provides ways to express
dependencies between .js files which will be respected when
the whole code is minified.
The dependency is not automatic.
Without require.js, the .js modules will be listed in
the .html files (in the right order),
and functions from these modules called only when the whole
webpage is loaded, following the `onload` event, as in 
`<body onload="setupCanvas();">`.



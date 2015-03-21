# html/ - HTML directory for the GTE webpage

This directory will contain the webpage for GTE as 

./index.html

with JavaScript (JS) scripts in ./js/ and subdirectories.

Documentation in .md files, which we store _here_ at the
proper level of the code.  

The deployment version will have a minified version, with
comments and indentations removed and all .js files in a
single file, which is then posted in a suitable directory at
http://www.gametheoryexplorer.org/

The webpage in the current directory (or any corresponding
fork/copy) with non-minified .js files should work as well.

## JS issues

We list here a few main decisions about JS
that we need to make
for the whole project.

### JS modules

Alfonso suggested to use a standard package
[require.js](http://requirejs.org)
which provides Asynchronous Module Definition that allows to
load .js files only where needed.

Alfonso wrote Mon, 26 Jan 2015 16:13:57 :
    For example, I found this one to be quite clear:
    http://www.sitepoint.com/understanding-requirejs-for-effective-javascript-module-loading/
    (ignore the "Managing the order of dependent files"
    section -> it can lead to confusion; that only applies
    to when using external js libraries with dependencies
    among them).

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

So, for the moment, no require.js.

However, we need a uniform pattern for JS modules to provide
encapsulation.
Possible reads:
- http://www.adequatelygood.com/JavaScript-Module-Pattern-In-Depth.html

### HTML5/canvas versus SVG

(copy from emails)

### JS file hierarchy

Q: how many subdirectory levels in the ./js/ directory?

A: as few as possible, but we probably need to group our
code into some directories here. They contain documentation
in respective README.md files as well. They are:

- game tree `tree/`
- strategic (matrix) form `strategic/`
- GUI manipulation such as WYSIWIG input, maybe also
  Undo/Redo that is common to both tree and matrix
  `guiUtils/`
- file load / store / export `fileIO/`
- server communication `serverComm/` 
- user perferences configuration (fonts, linewidth, treedirection
  etc.) `userPref/`

Q: should `guiUtils/` also contain OUTPUT DISPLAY such as computed
equilibria? Or should that be part of 
`serverComm/` or `strategic/` ?

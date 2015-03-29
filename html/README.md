# html/ - HTML directory for the GTE webpage

This directory will contain the webpage for GTE as 

./index.html

with JavaScript (JS) scripts in ./js/ and subdirectories.

Documentation in .md files, which we store at the
proper level of the code.  

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

(still to copy from emails)


# html/js/ - JS code directory for the GTE webpage

This directory contains the JavaScript (JS) scripts in
subdirectories.

Documentation in .md files, which we store in each
subdirectory at the proper level of the code.  

The deployment version will have a minified version, with
comments and indentations removed and all .js files in a
single file, which is then posted in a suitable directory 
(probably the also called js ) at
http://www.gametheoryexplorer.org/

The webpage in the current directory .. (or any corresponding
fork/copy) with non-minified .js files should work as well.

### JS file hierarchy

Q: how many subdirectory levels in this ./js/ directory?

A: as few as possible, but we probably need to group our
code into some directories here. They contain documentation
in respective README.md files as well. They are:

- game tree `tree/`
- strategic (matrix) form `strategic/`
- GUI manipulation such as WYSIWIG input, maybe also
  Undo/Redo that is common to both tree and matrix
  `guiutils/`
- file input/output, i.e. load / store / export `fileio/`
- server communication `servercomm/` 
- user perferences configuration (fonts, linewidth, treedirection
  etc.) `userpref/`

Q: should `guiutils/` also contain OUTPUT DISPLAY such as computed
equilibria? Or should that be part of 
`servercomm/` or `strategic/` ? Probably the latter.

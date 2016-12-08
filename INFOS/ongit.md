## Commits and Pull Requests

Follow the guidelines at
http://contribute.jquery.org/commits-and-pull-requests/

git commit with message

git commit -m "my commit message" file

## undoing modifications of a single file:

    git checkout -- filename

(the "--" will avoid confusion if the filename looks like a branch)

## getting started

our repository on github:

https://github.com/gambitproject/jsgte

clone the repository 

git@github.com:gambitproject/jsgte.git

## Our program in jsgte/

./html/index.html

will be shown as code on github, "in action" it is seen at

http://gambitproject.github.io/jsgte/

or on your local computer in the cloned repository.

Cloning the repository
----------------------

open terminal 
change to your desktop, which should be a directory
named (here with my name stengel)

    /home/stengel/Desktop

with 

    cd /home/stengel
    ls
    cd Desktop

then: clone the github repository
(when you are in the Desktop directory, which you can verify
with `pwd`) with 

    git clone git@github.com:gambitproject/jsgte.git

    cd jsgte

create your own branch with

    git branch newproject

and you can list the local branches with

    git branch

or ALL branches (including those on github) with 

    git branch -a

To WORK on your branch, check it out with 

    git checkout newproject

## Merging and when it fails

if merge has failed, revert it via

    git merge --abort

## compare file with previous version
git diff HEAD@{1} filename

# Using git with jsgte

This is on introductory stuff everyone must know.

Our repository on github:
https://github.com/gambitproject/jsgte

## Basics: Unix command line, recording in markdown

### Unix command line basics

We assume you can use the command line in Unix (Linux or
MacOS).

Basic operations to get started:
Open terminal, get familiar with the most basic Unix commands 
    
    cd
    ls
    mv
    cp

start an editor you are familiar with (e.g. gedit on Linux),
use TAB-completion, and have the prompt display your current
working directory which can also be displayed with `pwd`.

### Markdown files

The minimal markup syntax ("markdown") is used in these
documentation files with the ending .md such as this one.

Please record any useful experiences you have into such a
markdown file and add it to the INFOS/ directory.

## Behaviour of the main webpage and creating the branch `gh-pages`

The main file is in

    ./html/index.html

which loads as a webpage and its JS functionality as a file
on your local computer, for example.

However, on github this page will be displayed as code.

In order to display its behaviour on github, a special
branch called

    gh-pages

has to be created, which has the URL
http://gambitproject.github.io/jsgte/

To update this when changes happen to master use 

  `ghp-import -p html`

This moves the directory `html`, which contains
`index.html`, to the root of the branch `gh-pages`.
For more details see

https://help.github.com/categories/github-pages-basics/

On Linux you can install ghp-import via 

  `pip install ghp-import`

## Git

### Documentation about git

Short intro to git (very useful and essential): http://gitref.org/


Long intro to git: https://git-scm.com/book/en/v2

### Cloning the repository 

I prefer to use the ssh (secure shell) based interaction
with the remote which makes most authentication automatic.

Clone the repository from github

    git clone git@github.com:gambitproject/jsgte.git

which will create the directory `jsgte` in your current
directory.

### Branches

create your own branch with 

    git branch my-test-branch

and work on it with 

    git checkout my-test-branch

The list of all branches is visible with

    git branch -a

### Basic git operation

Make sure you know which branch you work on, listed with

    git branch

Modify your program and files. Information about them is
listed with

    git status

The basic cycle is then

    git add file
    git commit

and to include a message directly with the commit with
    
    git commit -m "my commit message" 

Note that all your work is local on your computer.

### Synchronization with the remote repository on github

(More details on how to push a newly created branch.
Creating it on github first seems the simplest.)

Be careful not to commit on the master branch!
See the guidelines of the JQUERY foundation at
http://contribute.jquery.org/commits-and-pull-requests/

### Testing other remote work

Example: Harkirat has created a branch named
`load-functionality` and wants me to test it.

I first create such a branch locally, and switch to it, with

    git checkout -b load-functionality

I then try to get the corresponding information from
Harkirat's repository with

    git pull git@github.com:hkirat/jsgte.git load-functionality

and in response it asks me "please tell me who you are",
presumably so Harkirat knows who copied from his directory.
I do this with some configuration that was lost (including
on my editor `vim`) when I started over by cloning the
repository after some mess-up. So do this first (with your
own configuration data of course :-) :

    git config --global user.email "bvonstengel@gmail.com"
    git config --global user.name "Bernhard von Stengel"
    git config --global core.editor vim

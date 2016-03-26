http://stackoverflow.com/questions/5807459/github-mirroring-gh-pages-to-master

Thanks to [GitHub pages](https://pages.github.com/) every user and organization can get a live version of the code that can be shared publicly with the rest of the team. The content of the live GitHub page is defined by the [gh-pages](https://github.com/gambitproject/jsgte/tree/gh-pages) branch in the repository. Therefore, there is no possibility to have multiple versions of the live page and it will only track the content of the gh-pages branch.

Current JSGTE public address is [http://gambitproject.github.io/jsgte/html/](http://gambitproject.github.io/jsgte/html/). This link should be shared in order to show the work done with the rest of the team. The steps taken to integrate the work made on your_branch with the public branch are as follows:
1. ```git checkout gh-pages```
2. ```git merge your_branch -X theirs ```
3. ```git push origin gh-pages```

see also ../README.md :

To test them as html pages you can navigate to

http://gambitproject.github.io/jsgte/

To update this when changes happen to master do the following

## pip install ghp-import
ghp-import -p html

This moves html, which contains index.html to the root of a
new branch gh-pages. For more details see

https://help.github.com/categories/github-pages-basics/

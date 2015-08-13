Icomoon
=======
[Icomoon](https://icomoon.io/) is a service that lets developers create custom icon fonts by choosing icons from their 4000+ free vector icons database.

It is really handy since we don't need to include the whole font (for example, we don't need to include the whole [font-awesome](http://fortawesome.github.io/Font-Awesome/) font which has many icons we don't use) and we can create a smaller font with only the icons we need.

It is also handy because it lets us combine icons from different fonts in one single font. There are some icons that might not be included in one font, and including another complete font can be expensive in loading time terms.

A selection.json file has been included in this folder. This file is a saving file that includes the selection of icons done in Icomoon. In order to add icons to the current font, do the following:
1. Head over to [Icomoon App](https://icomoon.io/app/)
2. Load the saved selection by clicking on the "Import icons" button and selecting the selection.json file
3. The App will show the currently selected icons. Choose the icon you want to add to the selection
4. Once you have finished selecting the icons that the font will include, click on "Generate Font" and then on "Download"
5. A icomoon.zip will be downloaded.
5.1. Replace the files inside the fonts folder with the ones inside this folder
5.2. Copy the content of style.css on css/font.css
5.3. Replace the url of the fonts across the font.css file to point to our fonts folder. For example, replace ```src:url('fonts/icomoon.eot?6ovyk5');``` with  ```src:url('../fonts/icomoon.eot?6ovyk5');```
5.4. Substitute the selection.json file with the new one you have downloaded so that if someone wants to modify the font in the future can easily do it

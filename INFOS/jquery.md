I'm reading *jQuery 1.7 & jQuery UI* by Eric Sarrion. I note here what I find useful.

#jQuery bases#


##Beginning##

###Installation###
*http://jquery.com.com*, two versions are available : compressed and uncompressed.
The uncompressed version is better for debugging but it's bigger.

The command
`<script src=jquery.js></script>`
allows to include the library into the HTML page.

###The jQuery object###
The jQuery object is automatically created at the inclusion of the library.
It's defined as a JavaScript Function, it's named **jQuery** but the shortcut **$** works too.

It can be used at two level:

1. As an object with properties `jQuery.property`or `$.property` and methods `jQuery.method()`or `$.method()`.

2. As a function `jQuery(selector, context)` it always has an new object from the jQuery class as output.

:warning: jQuery is not an instance of the jQuery class, it's a Javascript Function.


##Methods of the jQuery object##
`jQuery.method()`or `$.method()`

* `$.each()` go through all the object properties. `$.each(obj, callback)` applies the function `callback(property, value)` on all the properties of the object obj.

* `$.extend()` add properties to an object. For example `$.extend(obj1, obj2)` add the `obj2` properties to `obj1`.

* and many others.

###Array manipulation###
####Javascript####
```javascript
<script>
var t=new Array(); // t=[] 
t[10] = "toto";
alert(t[0]); //undefined
alert(t[10]); // "toto"
alert(t.length); // 11
t.push("titi");
alert(t.length); // 12
</script>
```

####jQuery methods####
* `$.each()`goes through all the elements. `$.each(arr, callback)` applies the function `callback(index, value)` on all the elements of the array arr.

* `$.grep()` selects only some elements. `$.grep(arr, callback)` select the elements of arr for which the function callback(value, index) returns true. It doesn't modify the array.

* `$.map()`creates a new array. `$.map(arr, callback)` creates a new array based on arr. Each elements of the new array is the result of callback(value, index). If callback return nothing for one element, it will not be in the new array.

* `$.merge()* concatenates two array.

###String manipulation###
####Javascript###
```javascript
<script>
var s1= "toto";
var s2 = "titi";
var s = s1+ " "+ s2;
alert(s); // titi toto
</script>
```
####jQuery methods####
* `$.each()` goes through all the characters. `$.each(str, callback)` applies the function `callback(index, value)` on all the characters of the sring str.

* `$.trim()` supresses blank at the end and the beginning of a string. Retuns a new string.

* `$.param()` creates a string from a object, enumerating its properties.

###Others intersting properties and methods###
* `$.browser` shows navigator informations ($.browser.mozilla=true when the navigator is Firefox, $.browser.msie=true for Internet Explorer, $.browser.opera=true for Opera and $.browser.webkit=true for Safari or Chrome).


##Selectors##
A selector is a string that represents HTML objects on which methods will apply.
```html
<script src=jquery.js></script>

<p> Paragraph 1 </p>
<p> Paragraph 2 </p>
<p> Paragraph 3 </p>
<script>
$("p").css({"background-color" : "black", color : "white"});
</script>
```
This changes the css of the 3 paragraphs.

###Different kinds of selectors###
####Simple###
* `"p"` all paragraphs

*`"img"` all images

* `"*"` all HTML elements

####Attribute selectors####

* `"p[name]"` all paragraphs having a name attribute.

* `"p[name= "toto" ]"` all paragraphs having a name attribute exactly equals to "toto".

* `"p[name^= "toto" ]"` all paragraphs having a name attribute beginning by "toto".

* `"p[name$= "toto" ]"` all paragraphs having a name attribute ending by "toto".

* `"p[name*= "toto" ]"` all paragraphs having a name attribute containing by "toto".

####Class selectors####

* `"p.rotation"` all paragraphs with a rotation class.

* `"*.rotation"` all elements with a rotation class.

####Id selectors####
* `"p[id="idpara1"]"` all paragraphs with id exactly equals to "idpara1".

* `"p#idpara1"` exactly equavalent to `"p[id="idpara1"]"` .

* `"*#idpara1"` all elements having an attribute id equals to `"idpara1"`.

* `"#idpara1"` only the first one.

###Pseudo-classes###
String added to the end of the selector to specify it more.

* `":first-child"`

* `":odd"`

* `":not"` for negation

* `":empty"` for elements having no children

* `":gt(n)"` among selected element return the element of index n. (gt for greater than n and lt for lower than n).

###Combinations###

* `"div h1"` elements h1 having one div as a father, granfather ...

* `"div>h1"` elements h1 having a div as a father.

* `"h1 + h2"` h1 and h2 have the same father, h2 is selected.

###Multiple selectors###

* `"p,img"` a paragraph or an image.

##DOM access##

###Document Object Model : JavaScript###
Elements can have 0 or multiple children, but only one father.
```html
<div>
   <p> This is a paragraph </p>
</div>
```
The div element has three children : one element <p> and two text element containing an endline.

####Dynimac creation of HTML element and text####
`var e = document.createElement("tag")``
The element e is created but for now it's nowhere.
`parent.appendChild(e)`
Now e is the last child of parent.
`parent.insertBefore(beforeEnfant)`
To insert e just before the element beforeEnfant.

####Direct access to page elements####
`var e = document.getElementById("id")`
Problem if two elements have the same id only the first one is returned.

Example
```javascript
<p onclick = "add()">
  Click to add a paragraph
</p>
<script>
var num_para=1;
function add ()
{ var p=document.createElement("p");
  var texte = document.createTextNode( "Paragraph "+ num_para + " added. Click to remove !");
  document.body.appendChild(p);
  p.appendChild(texte);
  num_para++;
  p.onclick = function()
  { p.parentNode.removeChild(p);
  }
}
</script>
```
This example dynamically creates and supresses paragraphs.

### Different ways of using jQuery function###
* The principal way is `$(selector, context)` where selector is a string and context is a DOM element. The output is a jQuery class element containing all HTML elements above context and verifying the selector.

* An other way is `$(element)` which directly applies to an HTML element.

* `$(jQueryObject)` this allows duplicating an object of the jQuery class.

* `$(html)` the created object refers to the HTML object corresponding to the string html.

### Methods for DOM access ###

All methods that follow return a jQuery class object that refers to DOM elements

To remove elements from a list :
* `filter(selector)`

* `filter(callback)`

* `not(selector)`
...
To add elements to a list :
* `add(selector, context)`

* add(element)

* add(html)
...

To change some elements by others (losing original elements) :
* `find(selector)` return elements that verify the selector among child of the list.

* `prev(selector)` gets the previous brother of all the list elements.

##Using DOM##
###Attributes and properties###
####Attributes####
`attr(name)` returns the value of attribute name of the first element of the list ( use each for all elements)

`attr(name, value)` gives the value value to the attribute name.

...

####Properties####










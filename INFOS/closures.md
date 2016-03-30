Closures, functions
-------------------

http://www.crockford.com/javascript/javascript.html

http://www.crockford.com/javascript/private.html
Private
By convention, we make a private `that` variable. This is
used to make the object available to the private methods.
This is a workaround for an error in the ECMAScript Language
Specification which causes `this` to be set incorrectly for
inner functions.

**Comment:**
Crockford calls this an error. John Resig (see "JS Ninja"
book below) explains why this is consistent with the global 
`window` object just being a special case.

"closure"
http://www.adequatelygood.com/JavaScript-Module-Pattern-In-Depth.html
... very concise!
also:
http://benalman.com/news/2010/11/immediately-invoked-function-expression/

http://skilldrick.co.uk/2011/04/closures-explained-with-javascript/

which comes very quickly coming to the point:

    function f(x) {
        function g() {
            return x;
        }
        return g;
    }

    //Tell f to create a new g
    var g5 = f(5);

    //g5 is a function that always returns 5
    alert(g5());

Here’s a version of the above with g converted to an
anonymous function:

    function f(x) {
        return function () {
            return x;
        }
    }

    //Tell f to create a new g
    var g5 = f(5);

    //g5 is a function that always returns 5
    alert(g5());

    //Tell f to create another new g
    var g1 = f(1);

    //g1 is a function that always returns 1
    alert(g1());


IIFE = Immediately Invoked Function Expression
If you have not come across the acronym "IIFE" before, you
may be interested in Ben Alman's article on the subject, in
which he coins the term to stand for "Immediately Invoked
Function Expression".

https://google.github.io/styleguide/javascriptguide.xml
https://google.github.io/styleguide/javascriptguide.xml?showone=Closures#Closures
http://jibbering.com/faq/notes/closures/

Kyle Simpson: You Don't Know JS: Scope & Closures
https://github.com/getify/You-Dont-Know-JS/blob/master/scope%20%26%20closures/README.md
... too chatty for my taste

"Java is not my favourite programming language":
http://stackoverflow.com/questions/1595611/how-to-properly-create-a-custom-object-in-javascript/1598077#1598077
More constructive:
http://stackoverflow.com/questions/1595611/how-to-properly-create-a-custom-object-in-javascript/#1597560

John Resig, www.ejohn.org
JQuery
https://en.wikipedia.org/wiki/JQuery
Testing framework
    QUnit is a test automation framework used to test the jQuery
    project. The jQuery team developed it as an in-house unit
    testing library.[31] The jQuery team uses it to test its
    code and plugins, but it can test any generic JavaScript
    code, including server-side JavaScript code.[31]

----------------------------------------------
# From John Resig and Bear Bibeault: "Secrets of the JavaScript Ninja"

chapter 2 describes a short self-made testing framework used
in the book to verify claims

chapter 3 is on FUNCTIONS which are central (I suspect with their
constructors that can only be called for functions)

### 3.3.3 Invocation as a method

very illustrative. e.g. "window" is just one of the possible
invocation contexts and so there is no basic difference
between invoking a function _as a function_ (when the
context is `window` = the global object) and _as a method_.
    
Next, we get a bit trickier and define an object in
    variable ninja1 with a property named skulk that
    receives a reference to the creep() function . By doing
    so, we say that we’ve created a method named skulk on
    the object. We don’t say that creep() has become a
    method of ninja1; it hasn’t. 
   
_ but `skulk`, which has been returned by creep(), has
    become a method of `ninja1`. _

We’ve already seen that
    creep() is its own independent function that can be
    invoked in numerous ways.

According to what we stated earlier, when we invoke the
    function via a method reference, we expect the function
    context to be the method’s object (in this case, ninja1)
    and we assert as much . Again figure 3.7 shows us that
    this is borne out. We’re on a roll!

**This particular ability is crucial to writing JavaScript
    in an object-oriented manner. It means that we can,
    within any method, use `this` to reference the method’s
    owning object-a fundamental concept in object-oriented
    programming.**

Note that even though the same function is used throughout
all these examples, the function context for each invocation
of the function changes depending upon how the function is
invoked, rather than on how it was declared.

For example, the exact same function instance is shared by
both ninja1 and ninja2, yet when it’s executed, the function
has access to, and can perform operations upon, the object
through which the method was invoked.
**This means that we don’t need to create separate copies of
a function to perform the exact same processing on different
objects. This is a tenet of object-oriented programming.**

good summary of chapter 3 in final section 3.4 



----------------------------------------------

https://en.wikipedia.org/wiki/Backbone.js
backbone - based on model view presenter

overriding existing functions such as window.alert()
http://stackoverflow.com/questions/1729501/javascript-overriding-alert
http://api.jquery.com/Types/#Proxy_Pattern

----------------------------------------------
# From Douglas Crockford, "JS the good parts"

### Function Objects

Functions in JavaScript are objects. Objects are collections
of name/value pairs having a hidden link to a prototype
object. Objects produced from object literals are linked to
Object.prototype. Function objects are linked to
Function.prototype (which is itself linked to
Object.prototype). Every function is also created with two
additional hidden properties: the function’s context and the
code that implements the function’s behavior.

Every function object is also created with a prototype
property. Its value is an object with a constructor property
whose value is the function. This is distinct from the
hidden link to Function.prototype. The meaning of this
convoluted construction will be revealed in the next
chapter.

Since functions are objects, they can be used like any other
value. Functions can be stored in variables, objects, and
arrays. Functions can be passed as arguments to functions,
and functions can be returned from functions. Also, since
functions are objects, functions can have methods.
The thing that is special about functions is that they can
be invoked.


----------------------------------------------



http://addyosmani.com/writing-modular-js/
http://addyosmani.com/blog/
http://addyosmani.com/first/

~199 slides on Front-end Tooling Workflows
with the following hints:

tools for formatting / lint:
   jsfmt
   fixmyjs
   jsinspect
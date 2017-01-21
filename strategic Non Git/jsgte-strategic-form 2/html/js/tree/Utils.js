GTE.TREE.UTILS = (function (parentModule) {
    "use strict";

    /**
    * Creates a new fraction Slightly modified version of
    * http://stackoverflow.com/a/15193615/1148405
    * @class
    * @param {Number}  x        Number to convert to fraction
    * @param {Boolean} improper Whether the fraction should be improper or not
    */
    function Fraction (x, improper) {
        improper = improper || false;
        var abs = Math.abs(x);
        this.sign = x/abs;
        x = abs;
        this.stack = 0;
        this.whole = !improper ? Math.floor(x) : 0;
        var fractional = !improper ? x-this.whole : abs;
        var t = this.transform(fractional);
        this.numerator = t[0];
        this.denominator = t[1];
    }

    /**
    * ToString function
    */
    Fraction.prototype.toString = function () {
        var l  = this.sign.toString().length;
        var sign = l === 2 ? '-' : '';
        var whole = this.whole !== 0 ? this.sign*this.whole+' ': sign;
        return whole+this.numerator+'/'+this.denominator;
    };

    /**
    * Recursive function that transforms the fraction
    * @param {Number} x Number to transform
    */
    Fraction.prototype.transform = function (x) {
        this.stack++;
        var intgr = Math.floor(x); //get the integer part of the number
        var dec = (x - intgr); //get the decimal part of the number
        if(dec < 0.0019 || this.stack > 20) return [intgr,1]; //return the last integer you divided by
        var num = this.transform(1/dec); //call the function again with the inverted decimal part
        return[intgr*num[0]+num[1],num[0]];
    };

    // Add class to parent module
    parentModule.Fraction = Fraction;

    return parentModule;
}(GTE.TREE.UTILS)); // Add to GTE.TREE sub-module

/*
 * Clearest Framework
 * Provided under MIT License.
 * Copyright (c) 2012-2015  Illya Kokshenev <sou@illya.com.br>
 */
"use strict";

/**
 * Promises implementation
 */
var promise = require("q");

var constant = {
    CLEAREST: '__clearest__',
    ATTR: '@',
    TEXT: '$'
};

var is_ = function (o) {
        return o ? o.__clearest__ !== undefined : false;
    },
    is = {
        _: is_,
        array: Array.isArray || function (a) {
            return a instanceof Array;
        },
        fun: function (o) {
            //FIXME: ensure compatibility with old browsers
            return typeof(o) == 'function'
        },
        value: function (o) {
            var t = typeof o;
            return t === 'string' || t === 'number' || t === 'boolean';
        },
        promise: function (o) {
            return o !== undefined && o !== null && is.fun(o.then) && is.fun(o.done);
        },
        composit: function (o) {
            return is_(o) && o.__clearest__.seq !== undefined;
        },
        incomplete: function (o) {
            return is_(o) && o.__clearest__.complete !== undefined;
        },
        error: function (o) {
            return is_(o) && o.__clearest__.error !== undefined;
        }
    },
    CLEAREST = '__clearest__';


/**
 * each(a, f, [ j ])
 *
 * Recursive array iterator
 *
 * @param a array
 * @param f iterator function(element, [ position ])
 * @param j starting index
 */
function each(a, f, j) {
    if (f === undefined || a === undefined) return;
    if (j === undefined) j = 0;
    if (is.array(a))
        for (var i = 0, l = a.length; i < l; i++, j++)
            each(a[i], f, j);
    else f(a, j);
}

/**
 * Ensures that there is an object field f in o
 *
 * @param f field
 * @param o object
 * @returns field content or new object
 */
function fin(f, o) {
    return (o[f] !== undefined) ? o[f] : (o[f] = {});
}

/**
 * Same thing as fin(constant.CLEAREST,o),
 * but about twice as faster
 *
 * @param o
 * @returns {*}
 * @private
 */

function _in(o) {
    return (o.__clearest__ !== undefined) ? o.__clearest__ : (o.__clearest__ = {});
}


/**
 * Wraps error into clearest object
 */
function error(e) {
    return is.error(e)?e: {__clearest__:{error: e}};
}

function slice(args, n) {
    var arr = [];
    for (var i = n, l = args.length; i < l; i++)
        arr.push(args[i]);
    return arr;
}

/**
 * Ridiculously simple inheritance pattern (similar to the one used by closure library)
 *
 * Usage:
 *
 * function Foo(){
 *  // constructor of Foo
 * }
 *
 * Foo.prototype.a=function(){...} // method A of Foo
 * Foo.prototype.b=function(){...} // method B of Foo
 *
 * inherit(Bar,Foo) // inherits prototype of Foo
 * // providing a sugar Bar.super, such that:
 * // Bar.super()                  - returns a Foo.prototype
 * // Bar.super(this,[arguments])  - equivalent to Foo.apply(this,[arguments])
 *
 * function Bar(){ // constructor of Bar
 *  ...
 *  Bar.super(this,[arguments]); // calls base class constructor with some arguments
 *  ...
 * }
 *
 * Bar.prototype.a = function(){ // overrides method A
 *   var superA = Bar.super().a.bind(this);
 *     superA(...) // calls original method a
 * }
 *
 * @type {exports|module.exports}
 */
function inherit(childClass, baseClass) {
    childClass.prototype = Object.create(baseClass.prototype);
    childClass.prototype.constructor = childClass;
    childClass.super = function (instance) {
        return (instance === undefined) ?
            baseClass.prototype :
            baseClass.apply(instance, slice(arguments, 1));
    };
};

module.exports = {
    is: is,
    fin: fin,
    _in: _in,
    each: each,
    constant: constant,
    promise: promise,
    error: error,
    inherit : inherit
};


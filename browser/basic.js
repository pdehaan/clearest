/*
 * Clearest Framework
 * Provided under MIT License.
 * Copyright (c) 2012-2015  Illya Kokshenev <sou@illya.com.br>
 */
"use strict";

/**
 *  Implements Wrapper inteface and some additional helpers
 *
 **/
module.exports = function (el) {
    return {
        get: function(){return el;},
        on: function(event, handler, options) { el.addEventListener(event, handler, (options || {}).capture ); },
        off: function(event, handler, options) { el.removeEventListener(event, handler, (options || {}).capture ); },
        trigger: function(event, options){
            //TODO: deal with custom events
            if (typeof document !== 'undefined'){
                //var e = new Event(event, options) - fails in PhantomJS
                //var e = document.createEvent(event, options);
                var e = document.createEvent("HTMLEvents");
                    e.initEvent(event, true, true);
                el.dispatchEvent(e);
            }
        }
        //TODO: add css and other helpers
    }
}
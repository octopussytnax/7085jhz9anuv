/* Modernizr 2.5.3 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-shiv-cssclasses-load
 */
;window.Modernizr=function(a,b,c){function u(a){j.cssText=a}function v(a,b){return u(prefixes.join(a+";")+(b||""))}function w(a,b){return typeof a===b}function x(a,b){return!!~(""+a).indexOf(b)}function y(a,b,d){for(var e in a){var f=b[a[e]];if(f!==c)return d===!1?a[e]:w(f,"function")?f.bind(d||b):f}return!1}var d="2.5.3",e={},f=!0,g=b.documentElement,h="modernizr",i=b.createElement(h),j=i.style,k,l={}.toString,m={},n={},o={},p=[],q=p.slice,r,s={}.hasOwnProperty,t;!w(s,"undefined")&&!w(s.call,"undefined")?t=function(a,b){return s.call(a,b)}:t=function(a,b){return b in a&&w(a.constructor.prototype[b],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(b){var c=this;if(typeof c!="function")throw new TypeError;var d=q.call(arguments,1),e=function(){if(this instanceof e){var a=function(){};a.prototype=c.prototype;var f=new a,g=c.apply(f,d.concat(q.call(arguments)));return Object(g)===g?g:f}return c.apply(b,d.concat(q.call(arguments)))};return e});for(var z in m)t(m,z)&&(r=z.toLowerCase(),e[r]=m[z](),p.push((e[r]?"":"no-")+r));return u(""),i=k=null,function(a,b){function g(a,b){var c=a.createElement("p"),d=a.getElementsByTagName("head")[0]||a.documentElement;return c.innerHTML="x<style>"+b+"</style>",d.insertBefore(c.lastChild,d.firstChild)}function h(){var a=k.elements;return typeof a=="string"?a.split(" "):a}function i(a){var b={},c=a.createElement,e=a.createDocumentFragment,f=e();a.createElement=function(a){var e=(b[a]||(b[a]=c(a))).cloneNode();return k.shivMethods&&e.canHaveChildren&&!d.test(a)?f.appendChild(e):e},a.createDocumentFragment=Function("h,f","return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&("+h().join().replace(/\w+/g,function(a){return b[a]=c(a),f.createElement(a),'c("'+a+'")'})+");return n}")(k,f)}function j(a){var b;return a.documentShived?a:(k.shivCSS&&!e&&(b=!!g(a,"article,aside,details,figcaption,figure,footer,header,hgroup,nav,section{display:block}audio{display:none}canvas,video{display:inline-block;*display:inline;*zoom:1}[hidden]{display:none}audio[controls]{display:inline-block;*display:inline;*zoom:1}mark{background:#FF0;color:#000}")),f||(b=!i(a)),b&&(a.documentShived=b),a)}var c=a.html5||{},d=/^<|^(?:button|form|map|select|textarea)$/i,e,f;(function(){var a=b.createElement("a");a.innerHTML="<xyz></xyz>",e="hidden"in a,f=a.childNodes.length==1||function(){try{b.createElement("a")}catch(a){return!0}var c=b.createDocumentFragment();return typeof c.cloneNode=="undefined"||typeof c.createDocumentFragment=="undefined"||typeof c.createElement=="undefined"}()})();var k={elements:c.elements||"abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video",shivCSS:c.shivCSS!==!1,shivMethods:c.shivMethods!==!1,type:"default",shivDocument:j};a.html5=k,j(b)}(this,b),e._version=d,g.className=g.className.replace(/(^|\s)no-js(\s|$)/,"$1$2")+(f?" js "+p.join(" "):""),e}(this,this.document),function(a,b,c){function d(a){return o.call(a)=="[object Function]"}function e(a){return typeof a=="string"}function f(){}function g(a){return!a||a=="loaded"||a=="complete"||a=="uninitialized"}function h(){var a=p.shift();q=1,a?a.t?m(function(){(a.t=="c"?B.injectCss:B.injectJs)(a.s,0,a.a,a.x,a.e,1)},0):(a(),h()):q=0}function i(a,c,d,e,f,i,j){function k(b){if(!o&&g(l.readyState)&&(u.r=o=1,!q&&h(),l.onload=l.onreadystatechange=null,b)){a!="img"&&m(function(){t.removeChild(l)},50);for(var d in y[c])y[c].hasOwnProperty(d)&&y[c][d].onload()}}var j=j||B.errorTimeout,l={},o=0,r=0,u={t:d,s:c,e:f,a:i,x:j};y[c]===1&&(r=1,y[c]=[],l=b.createElement(a)),a=="object"?l.data=c:(l.src=c,l.type=a),l.width=l.height="0",l.onerror=l.onload=l.onreadystatechange=function(){k.call(this,r)},p.splice(e,0,u),a!="img"&&(r||y[c]===2?(t.insertBefore(l,s?null:n),m(k,j)):y[c].push(l))}function j(a,b,c,d,f){return q=0,b=b||"j",e(a)?i(b=="c"?v:u,a,b,this.i++,c,d,f):(p.splice(this.i++,0,a),p.length==1&&h()),this}function k(){var a=B;return a.loader={load:j,i:0},a}var l=b.documentElement,m=a.setTimeout,n=b.getElementsByTagName("script")[0],o={}.toString,p=[],q=0,r="MozAppearance"in l.style,s=r&&!!b.createRange().compareNode,t=s?l:n.parentNode,l=a.opera&&o.call(a.opera)=="[object Opera]",l=!!b.attachEvent&&!l,u=r?"object":l?"script":"img",v=l?"script":u,w=Array.isArray||function(a){return o.call(a)=="[object Array]"},x=[],y={},z={timeout:function(a,b){return b.length&&(a.timeout=b[0]),a}},A,B;B=function(a){function b(a){var a=a.split("!"),b=x.length,c=a.pop(),d=a.length,c={url:c,origUrl:c,prefixes:a},e,f,g;for(f=0;f<d;f++)g=a[f].split("="),(e=z[g.shift()])&&(c=e(c,g));for(f=0;f<b;f++)c=x[f](c);return c}function g(a,e,f,g,i){var j=b(a),l=j.autoCallback;j.url.split(".").pop().split("?").shift(),j.bypass||(e&&(e=d(e)?e:e[a]||e[g]||e[a.split("/").pop().split("?")[0]]||h),j.instead?j.instead(a,e,f,g,i):(y[j.url]?j.noexec=!0:y[j.url]=1,f.load(j.url,j.forceCSS||!j.forceJS&&"css"==j.url.split(".").pop().split("?").shift()?"c":c,j.noexec,j.attrs,j.timeout),(d(e)||d(l))&&f.load(function(){k(),e&&e(j.origUrl,i,g),l&&l(j.origUrl,i,g),y[j.url]=2})))}function i(a,b){function c(a,c){if(a){if(e(a))c||(j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}),g(a,j,b,0,h);else if(Object(a)===a)for(n in m=function(){var b=0,c;for(c in a)a.hasOwnProperty(c)&&b++;return b}(),a)a.hasOwnProperty(n)&&(!c&&!--m&&(d(j)?j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}:j[n]=function(a){return function(){var b=[].slice.call(arguments);a&&a.apply(this,b),l()}}(k[n])),g(a[n],j,b,n,h))}else!c&&l()}var h=!!a.test,i=a.load||a.both,j=a.callback||f,k=j,l=a.complete||f,m,n;c(h?a.yep:a.nope,!!i),i&&c(i)}var j,l,m=this.yepnope.loader;if(e(a))g(a,0,m,0);else if(w(a))for(j=0;j<a.length;j++)l=a[j],e(l)?g(l,0,m,0):w(l)?B(l):Object(l)===l&&i(l,m);else Object(a)===a&&i(a,m)},B.addPrefix=function(a,b){z[a]=b},B.addFilter=function(a){x.push(a)},B.errorTimeout=1e4,b.readyState==null&&b.addEventListener&&(b.readyState="loading",b.addEventListener("DOMContentLoaded",A=function(){b.removeEventListener("DOMContentLoaded",A,0),b.readyState="complete"},0)),a.yepnope=k(),a.yepnope.executeStack=h,a.yepnope.injectJs=function(a,c,d,e,i,j){var k=b.createElement("script"),l,o,e=e||B.errorTimeout;k.src=a;for(o in d)k.setAttribute(o,d[o]);c=j?h:c||f,k.onreadystatechange=k.onload=function(){!l&&g(k.readyState)&&(l=1,c(),k.onload=k.onreadystatechange=null)},m(function(){l||(l=1,c(1))},e),i?k.onload():n.parentNode.insertBefore(k,n)},a.yepnope.injectCss=function(a,c,d,e,g,i){var e=b.createElement("link"),j,c=i?h:c||f;e.href=a,e.rel="stylesheet",e.type="text/css";for(j in d)e.setAttribute(j,d[j]);g||(n.parentNode.insertBefore(e,n),m(c,0))}}(this,document),Modernizr.load=function(){yepnope.apply(window,[].slice.call(arguments,0))};
// tipsy, facebook style tooltips for jquery with fancy fading
// version 1.0.0a
// (c) 2008-2010 jason frame [jason@onehackoranother.com] and modificated by Sergio Alvarez @saleiva
// released under the MIT license
//
//  Changes:
//  April 27 2016: fixed problem with element size.
//  June 3 2013: Added the custom class before the calc of the position.

(function($) {

  var MOVE_OFFSET = 6;

  function maybeCall(thing, ctx) {
    return (typeof thing == 'function') ? (thing.call(ctx)) : thing;
  };

  function isElementInDOM(ele) {
    while (ele = ele.parentNode) {
      if (ele == document) return true;
    }
    return false;
  };

  function Tipsy(element, options) {
    this.$element = $(element);
    this.options = options;
    this.enabled = true;
    this.fixTitle();
  };

  Tipsy.prototype = {
    show: function() {
      var title = this.getTitle();
      if (title && this.enabled) {
        var $tip = this.tip();

        $tip.find('.tipsy-inner')[this.options.html ? 'html' : 'text'](title);
            $tip[0].className = 'tipsy'; // reset classname in case of dynamic gravity
            $tip.remove().css({top: 0, left: 0, visibility: 'hidden', display: 'block'}).prependTo(document.body);

            // Modified so we can use custom class names
            if (this.options.className) {
              $tip.addClass(maybeCall(this.options.className, this.$element[0]));
            }

            // Modified
            var pos = $.extend({}, this.$element.offset(), {
              width: this.$element[0].getBoundingClientRect().width,
              height: this.$element[0].getBoundingClientRect().height
            });

            var actualWidth = $tip[0].offsetWidth,
            actualHeight = $tip[0].offsetHeight,
            gravity = maybeCall(this.options.gravity, this.$element[0]);

            var tp;
            switch (gravity.charAt(0)) {
              case 'n':
              tp = {top: pos.top + pos.height + this.options.offset, left: pos.left + pos.width / 2 - actualWidth / 2};
              mo = {top: parseInt(pos.top + pos.height + this.options.offset + MOVE_OFFSET), opacity: this.options.opacity};
              break;
              case 's':
              tp = {top: pos.top - actualHeight - this.options.offset, left: pos.left + pos.width / 2 - actualWidth / 2};
              mo = {top: parseInt(pos.top - actualHeight - this.options.offset - MOVE_OFFSET), opacity: this.options.opacity};
              break;
              case 'e':
              tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth - this.options.offset};
              mo = {left: parseInt(pos.left - actualWidth - this.options.offset - MOVE_OFFSET), opacity: this.options.opacity};
              break;
              case 'w':
              tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width + this.options.offset};
              mo = {left: parseInt(pos.left + pos.width + this.options.offset + MOVE_OFFSET), opacity: this.options.opacity};
              break;
            }

            if (gravity.length == 2) {
              if (gravity.charAt(1) == 'w') {
                tp.left = pos.left + pos.width / 2 - 15;
              } else {
                tp.left = pos.left + pos.width / 2 - actualWidth + 15;
              }
            }

            $tip.css(tp).addClass('tipsy-' + gravity);
            $tip.find('.tipsy-arrow')[0].className = 'tipsy-arrow tipsy-arrow-' + gravity.charAt(0);

            if (this.options.fade) {
              $tip.stop().css({opacity: 0, display: 'block', visibility: 'visible'}).animate(mo, 200);
            } else {
              $tip.css({visibility: 'visible', opacity: this.options.opacity});
            }
          }
        },

        hide: function() {

          gravity = maybeCall(this.options.gravity, this.$element[0]);

          switch (gravity.charAt(0)) {
            case 'n':
            mo = {top: parseInt(this.tip().css("top")) + MOVE_OFFSET, opacity: 0};
            break;
            case 's':
            mo = {top: parseInt(this.tip().css("top")) - MOVE_OFFSET, opacity: 0};
            break;
            case 'e':
            mo = {left: parseInt(this.tip().css("left")) - MOVE_OFFSET, opacity: 0};
            break;
            case 'w':
            mo = {left: parseInt(this.tip().css("left")) + MOVE_OFFSET, opacity: 0};
            break;
          }

          if (this.options.fade) {
            this.tip().stop().animate(mo, 200, function(){$(this).remove();});
          } else {
            this.tip().remove();
          }
        },

        fixTitle: function() {
          var $e = this.$element;
          if ($e.attr('title') || typeof($e.attr('original-title')) != 'string') {
            $e.attr('original-title', $e.attr('title') || '').removeAttr('title');
          }
        },

        getTitle: function() {
          var title, $e = this.$element, o = this.options;
          this.fixTitle();
          var title, o = this.options;
          if (typeof o.title == 'string') {
            title = $e.attr(o.title == 'title' ? 'original-title' : o.title);
          } else if (typeof o.title == 'function') {
            title = o.title.call($e[0]);
          }
          title = ('' + title).replace(/(^\s*|\s*$)/, "");
          return title || o.fallback;
        },

        tip: function() {
          if (!this.$tip) {
            this.$tip = $('<div class="tipsy"></div>').html('<div class="tipsy-arrow"></div><div class="tipsy-inner"></div>');
            this.$tip.data('tipsy-pointee', this.$element[0]);
          }
          return this.$tip;
        },

        validate: function() {
          if (!this.$element[0].parentNode) {
            this.hide();
            this.$element = null;
            this.options = null;
          }
        },

        remove: function() { this.enabled = false; this.$tip && this.$tip.remove(); },
        enable: function() { this.enabled = true; },
        disable: function() { this.enabled = false; },
        toggleEnabled: function() { this.enabled = !this.enabled; }
      };

      $.fn.tipsy = function(options) {

        if (options === true) {
          return this.data('tipsy');
        } else if (typeof options == 'string') {
          var tipsy = this.data('tipsy');
          if (tipsy) tipsy[options]();
          return this;
        }

        options = $.extend({}, $.fn.tipsy.defaults, options);

        function get(ele) {
          var tipsy = $.data(ele, 'tipsy');
          if (!tipsy) {
            tipsy = new Tipsy(ele, $.fn.tipsy.elementOptions(ele, options));
            $.data(ele, 'tipsy', tipsy);
          }
          return tipsy;
        }

        function enter() {
          var tipsy = get(this);
          tipsy.hoverState = 'in';
          if (options.delayIn == 0) {
            tipsy.show();
          } else {
            tipsy.fixTitle();
            setTimeout(function() { if (tipsy.hoverState == 'in') tipsy.show(); }, options.delayIn);
          }
        };

        function leave() {
          var tipsy = get(this);
          tipsy.hoverState = 'out';
          if (options.delayOut == 0) {
            tipsy.hide();
          } else {
            setTimeout(function() { if (tipsy.hoverState == 'out') tipsy.hide(); }, options.delayOut);
          }
        };

        if (!options.live) this.each(function() { get(this); });

        if (options.trigger != 'manual') {
          var binder   = options.live ? 'live' : 'bind',
          eventIn  = options.trigger == 'hover' ? 'mouseenter' : 'focus',
          eventOut = options.trigger == 'hover' ? 'mouseleave' : 'blur';
          this[binder](eventIn, enter)[binder](eventOut, leave);
        }

        return this;

      };

      $.fn.tipsy.defaults = {
        className: null,
        delayIn: 0,
        delayOut: 0,
        fade: false,
        fallback: '',
        gravity: 'n',
        html: false,
        live: false,
        offset: 0,
        opacity: 0.8,
        title: 'title',
        trigger: 'hover'
      };

      $.fn.tipsy.revalidate = function() {
        $('.tipsy').each(function() {
          var pointee = $.data(this, 'tipsy-pointee');
          if (!pointee || !isElementInDOM(pointee)) {
            $(this).remove();
          }
        });
      };

    // Overwrite this method to provide options on a per-element basis.
    // For example, you could store the gravity in a 'tipsy-gravity' attribute:
    // return $.extend({}, options, {gravity: $(ele).attr('tipsy-gravity') || 'n' });
    // (remember - do not modify 'options' in place!)
    $.fn.tipsy.elementOptions = function(ele, options) {
      return $.metadata ? $.extend({}, options, $(ele).metadata()) : options;
    };

    $.fn.tipsy.autoNS = function() {
      return $(this).offset().top > ($(document).scrollTop() + $(window).height() / 2) ? 's' : 'n';
    };

    $.fn.tipsy.autoWE = function() {
      return $(this).offset().left > ($(document).scrollLeft() + $(window).width() / 2) ? 'e' : 'w';
    };

    /**
     * yields a closure of the supplied parameters, producing a function that takes
     * no arguments and is suitable for use as an autogravity function like so:
     *
     * @param margin (int) - distance from the viewable region edge that an
     *        element should be before setting its tooltip's gravity to be away
     *        from that edge.
     * @param prefer (string, e.g. 'n', 'sw', 'w') - the direction to prefer
     *        if there are no viewable region edges effecting the tooltip's
     *        gravity. It will try to vary from this minimally, for example,
     *        if 'sw' is preferred and an element is near the right viewable
     *        region edge, but not the top edge, it will set the gravity for
     *        that element's tooltip to be 'se', preserving the southern
     *        component.
     */
     $.fn.tipsy.autoBounds = function(margin, prefer) {
      return function() {
       var dir = {ns: prefer[0], ew: (prefer.length > 1 ? prefer[1] : false)},
       boundTop = $(document).scrollTop() + margin,
       boundLeft = $(document).scrollLeft() + margin,
       $this = $(this);

       if ($this.offset().top < boundTop) dir.ns = 'n';
       if ($this.offset().left < boundLeft) dir.ew = 'w';
       if ($(window).width() + $(document).scrollLeft() - $this.offset().left < margin) dir.ew = 'e';
       if ($(window).height() + $(document).scrollTop() - $this.offset().top < margin) dir.ns = 's';

       return dir.ns + (dir.ew ? dir.ew : '');
     }
   };

 })(jQuery);

/*

------------------------------------------------------------------------------
Version touched for CartoDB2.0, fork here -> http://github.com/CartoDB/select2
Branch: cartodb
------------------------------------------------------------------------------


DON'T REPLACE THIS LIBRARY FOR A NEW ONE UNTIL CHECK IT WORKS IN CARTODB

Copyright 2012 Igor Vaynberg

Version: @@ver@@ Timestamp: @@timestamp@@

This software is licensed under the Apache License, Version 2.0 (the "Apache License") or the GNU
General Public License version 2 (the "GPL License"). You may choose either license to govern your
use of this software only upon the condition that you accept all of the terms of either the Apache
License or the GPL License.

You may obtain a copy of the Apache License and the GPL License at:

    http://www.apache.org/licenses/LICENSE-2.0
    http://www.gnu.org/licenses/gpl-2.0.html

Unless required by applicable law or agreed to in writing, software distributed under the
Apache License or the GPL Licesnse is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
CONDITIONS OF ANY KIND, either express or implied. See the Apache License and the GPL License for
the specific language governing permissions and limitations under the Apache License and the GPL License.
*/
 (function ($) {
  if(typeof $.fn.each2 == "undefined"){
    $.fn.extend({
      /*
      * 4-10 times faster .each replacement
      * use it carefully, as it overrides jQuery context of element on each iteration
      */
      each2 : function (c) {
        var j = $([0]), i = -1, l = this.length;
        while (
          ++i < l
          && (j.context = j[0] = this[i])
          && c.call(j[0], i, j) !== false //"this"=DOM, i=index, j=jQuery object
        );
        return this;
      }
    });
  }
})(jQuery);

(function ($, undefined) {
    "use strict";
    /*global document, window, jQuery, console */

    if (window.Select2 !== undefined) {
        return;
    }

    var KEY, AbstractSelect2, SingleSelect2, MultiSelect2, nextUid, sizer,
        lastMousePosition, $document;

    KEY = {
        TAB: 9,
        ENTER: 13,
        ESC: 27,
        SPACE: 32,
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,
        SHIFT: 16,
        CTRL: 17,
        ALT: 18,
        PAGE_UP: 33,
        PAGE_DOWN: 34,
        HOME: 36,
        END: 35,
        BACKSPACE: 8,
        DELETE: 46,
        isArrow: function (k) {
            k = k.which ? k.which : k;
            switch (k) {
            case KEY.LEFT:
            case KEY.RIGHT:
            case KEY.UP:
            case KEY.DOWN:
                return true;
            }
            return false;
        },
        isControl: function (e) {
            var k = e.which;
            switch (k) {
            case KEY.SHIFT:
            case KEY.CTRL:
            case KEY.ALT:
                return true;
            }

            if (e.metaKey) return true;

            return false;
        },
        isFunctionKey: function (k) {
            k = k.which ? k.which : k;
            return k >= 112 && k <= 123;
        }
    };

    $document = $(document);

    nextUid=(function() { var counter=1; return function() { return counter++; }; }());

    function indexOf(value, array) {
        var i = 0, l = array.length, v;

        if (typeof value === "undefined") {
          return -1;
        }

        if (value.constructor === String) {
            for (; i < l; i = i + 1) if (value.localeCompare(array[i]) === 0) return i;
        } else {
            for (; i < l; i = i + 1) {
                v = array[i];
                if (v.constructor === String) {
                    if (v.localeCompare(value) === 0) return i;
                } else {
                    if (v === value) return i;
                }
            }
        }
        return -1;
    }

    /**
     * Compares equality of a and b taking into account that a and b may be strings, in which case localeCompare is used
     * @param a
     * @param b
     */
    function equal(a, b) {
        if (a === b) return true;
        if (a === undefined || b === undefined) return false;
        if (a === null || b === null) return false;
        if (a.constructor === String) return a.localeCompare(b) === 0;
        if (b.constructor === String) return b.localeCompare(a) === 0;
        return false;
    }

    /**
     * Splits the string into an array of values, trimming each value. An empty array is returned for nulls or empty
     * strings
     * @param string
     * @param separator
     */
    function splitVal(string, separator) {
        var val, i, l;
        if (string === null || string.length < 1) return [];
        val = string.split(separator);
        for (i = 0, l = val.length; i < l; i = i + 1) val[i] = $.trim(val[i]);
        return val;
    }

    function getSideBorderPadding(element) {
        return element.outerWidth(false) - element.width();
    }

    function installKeyUpChangeEvent(element) {
        var key="keyup-change-value";
        element.bind("keydown", function () {
            if ($.data(element, key) === undefined) {
                $.data(element, key, element.val());
            }
        });
        element.bind("keyup", function () {
            var val= $.data(element, key);
            if (val !== undefined && element.val() !== val) {
                $.removeData(element, key);
                element.trigger("keyup-change");
            }
        });
    }

    $document.bind("mousemove", function (e) {
        lastMousePosition = {x: e.pageX, y: e.pageY};
    });

    /**
     * filters mouse events so an event is fired only if the mouse moved.
     *
     * filters out mouse events that occur when mouse is stationary but
     * the elements under the pointer are scrolled.
     */
    function installFilteredMouseMove(element) {
      element.bind("mousemove", function (e) {
            var lastpos = lastMousePosition;
            if (lastpos === undefined || lastpos.x !== e.pageX || lastpos.y !== e.pageY) {
                $(e.target).trigger("mousemove-filtered", e);
            }
        });
    }

    /**
     * Debounces a function. Returns a function that calls the original fn function only if no invocations have been made
     * within the last quietMillis milliseconds.
     *
     * @param quietMillis number of milliseconds to wait before invoking fn
     * @param fn function to be debounced
     * @param ctx object to be used as this reference within fn
     * @return debounced version of fn
     */
    function debounce(quietMillis, fn, ctx) {
        ctx = ctx || undefined;
        var timeout;
        return function () {
            var args = arguments;
            window.clearTimeout(timeout);
            timeout = window.setTimeout(function() {
                fn.apply(ctx, args);
            }, quietMillis);
        };
    }

    /**
     * A simple implementation of a thunk
     * @param formula function used to lazily initialize the thunk
     * @return {Function}
     */
    function thunk(formula) {
        var evaluated = false,
            value;
        return function() {
            if (evaluated === false) { value = formula(); evaluated = true; }
            return value;
        };
    };

    function installDebouncedScroll(threshold, element) {
        var notify = debounce(threshold, function (e) { element.trigger("scroll-debounced", e);});
        element.bind("scroll", function (e) {
            if (indexOf(e.target, element.get()) >= 0) notify(e);
        });
    }

    function killEvent(event) {
        event.preventDefault();
        event.stopPropagation();
    }
    function killEventImmediately(event) {
        event.preventDefault();
        event.stopImmediatePropagation();
    }

    function measureTextWidth(e) {
        if (!sizer){
          var style = e[0].currentStyle || window.getComputedStyle(e[0], null);
          sizer = $("<div></div>").css({
              position: "absolute",
              left: "-10000px",
              top: "-10000px",
              display: "none",
              fontSize: style.fontSize,
              fontFamily: style.fontFamily,
              fontStyle: style.fontStyle,
              fontWeight: style.fontWeight,
              letterSpacing: style.letterSpacing,
              textTransform: style.textTransform,
              whiteSpace: "nowrap"
          });
          $("body").append(sizer);
        }
        sizer.text(e.val());
        return sizer.width();
    }

    function markMatch(text, term, markup) {
        var match=text.toUpperCase().indexOf(term.toUpperCase()),
            tl=term.length;

        if (match<0) {
            markup.push(text);
            return;
        }

        markup.push(text.substring(0, match));
        markup.push("<span class='select2-match'>");
        markup.push(text.substring(match, match + tl));
        markup.push("</span>");
        markup.push(text.substring(match + tl, text.length));
    }

    /**
     * Produces an ajax-based query function
     *
     * @param options object containing configuration paramters
     * @param options.transport function that will be used to execute the ajax request. must be compatible with parameters supported by $.ajax
     * @param options.url url for the data
     * @param options.data a function(searchTerm, pageNumber, context) that should return an object containing query string parameters for the above url.
     * @param options.dataType request data type: ajax, jsonp, other datatatypes supported by jQuery's $.ajax function or the transport function if specified
     * @param options.traditional a boolean flag that should be true if you wish to use the traditional style of param serialization for the ajax request
     * @param options.quietMillis (optional) milliseconds to wait before making the ajaxRequest, helps debounce the ajax function if invoked too often
     * @param options.results a function(remoteData, pageNumber) that converts data returned form the remote request to the format expected by Select2.
     *      The expected format is an object containing the following keys:
     *      results array of objects that will be used as choices
     *      more (optional) boolean indicating whether there are more results available
     *      Example: {results:[{id:1, text:'Red'},{id:2, text:'Blue'}], more:true}
     */
    function ajax(options) {
        var timeout, // current scheduled but not yet executed request
            requestSequence = 0, // sequence used to drop out-of-order responses
            handler = null,
            quietMillis = options.quietMillis || 100;

        return function (query) {
            window.clearTimeout(timeout);
            timeout = window.setTimeout(function () {
                requestSequence += 1; // increment the sequence
                var requestNumber = requestSequence, // this request's sequence number
                    data = options.data, // ajax data function
                    transport = options.transport || $.ajax,
                    traditional = options.traditional || false,
                    type = options.type || 'GET'; // set type of request (GET or POST)

                data = data.call(this, query.term, query.page, query.context);

                if( null !== handler) { handler.abort(); }

                handler = transport.call(null, {
                    url: options.url,
                    dataType: options.dataType,
                    data: data,
                    type: type,
                    traditional: traditional,
                    success: function (data) {
                        if (requestNumber < requestSequence) {
                            return;
                        }
                        // TODO 3.0 - replace query.page with query so users have access to term, page, etc.
                        var results = options.results(data, query.page);
                        query.callback(results);
                    }
                });
            }, quietMillis);
        };
    }

    /**
     * Produces a query function that works with a local array
     *
     * @param options object containing configuration parameters. The options parameter can either be an array or an
     * object.
     *
     * If the array form is used it is assumed that it contains objects with 'id' and 'text' keys.
     *
     * If the object form is used ti is assumed that it contains 'data' and 'text' keys. The 'data' key should contain
     * an array of objects that will be used as choices. These objects must contain at least an 'id' key. The 'text'
     * key can either be a String in which case it is expected that each element in the 'data' array has a key with the
     * value of 'text' which will be used to match choices. Alternatively, text can be a function(item) that can extract
     * the text.
     */
    function local(options) {
        var data = options, // data elements
            dataText,
            text = function (item) { return ""+item.text; }; // function used to retrieve the text portion of a data item that is matched against the search

        if (!$.isArray(data)) {
            text = data.text;
            // if text is not a function we assume it to be a key name
            if (!$.isFunction(text)) {
              dataText = data.text; // we need to store this in a separate variable because in the next step data gets reset and data.text is no longer available
              text = function (item) { return item[dataText]; };
            }
            data = data.results;
        }

        return function (query) {
            var t = query.term, filtered = { results: [] }, process;
            if (t === "") {
                query.callback({results: data});
                return;
            }

            process = function(datum, collection) {
                var group, attr;
                datum = datum[0];
                if (datum.children) {
                    group = {};
                    for (attr in datum) {
                        if (datum.hasOwnProperty(attr)) group[attr]=datum[attr];
                    }
                    group.children=[];
                    $(datum.children).each2(function(i, childDatum) { process(childDatum, group.children); });
                    if (group.children.length || query.matcher(t, text(group))) {
                        collection.push(group);
                    }
                } else {
                    if (query.matcher(t, text(datum))) {
                        collection.push(datum);
                    }
                }
            };

            $(data).each2(function(i, datum) { process(datum, filtered.results); });
            query.callback(filtered);
        };
    }

    // TODO javadoc
    function tags(data) {
        // TODO even for a function we should probably return a wrapper that does the same object/string check as
        // the function for arrays. otherwise only functions that return objects are supported.
        if ($.isFunction(data)) {
            return data;
        }

        // if not a function we assume it to be an array

        return function (query) {
            var t = query.term, filtered = {results: []};
            $(data).each(function () {
                var isObject = this.text !== undefined,
                    text = isObject ? this.text : this;
                if (t === "" || query.matcher(t, text)) {
                    filtered.results.push(isObject ? this : {id: this, text: this});
                }
            });
            query.callback(filtered);
        };
    }

    /**
     * Checks if the formatter function should be used.
     *
     * Throws an error if it is not a function. Returns true if it should be used,
     * false if no formatting should be performed.
     *
     * @param formatter
     */
    function checkFormatter(formatter, formatterName) {
        if ($.isFunction(formatter)) return true;
        if (!formatter) return false;
        throw new Error("formatterName must be a function or a falsy value");
    }

    function evaluate(val) {
        return $.isFunction(val) ? val() : val;
    }

    function countResults(results) {
        var count = 0;
        $.each(results, function(i, item) {
            if (item.children) {
                count += countResults(item.children);
            } else {
                count++;
            }
        });
        return count;
    }

    /**
     * Default tokenizer. This function uses breaks the input on substring match of any string from the
     * opts.tokenSeparators array and uses opts.createSearchChoice to create the choice object. Both of those
     * two options have to be defined in order for the tokenizer to work.
     *
     * @param input text user has typed so far or pasted into the search field
     * @param selection currently selected choices
     * @param selectCallback function(choice) callback tho add the choice to selection
     * @param opts select2's opts
     * @return undefined/null to leave the current input unchanged, or a string to change the input to the returned value
     */
    function defaultTokenizer(input, selection, selectCallback, opts) {
        var original = input, // store the original so we can compare and know if we need to tell the search to update its text
            dupe = false, // check for whether a token we extracted represents a duplicate selected choice
            token, // token
            index, // position at which the separator was found
            i, l, // looping variables
            separator; // the matched separator

        if (!opts.createSearchChoice || !opts.tokenSeparators || opts.tokenSeparators.length < 1) return undefined;

        while (true) {
            index = -1;

            for (i = 0, l = opts.tokenSeparators.length; i < l; i++) {
                separator = opts.tokenSeparators[i];
                index = input.indexOf(separator);
                if (index >= 0) break;
            }

            if (index < 0) break; // did not find any token separator in the input string, bail

            token = input.substring(0, index);
            input = input.substring(index + separator.length);

            if (token.length > 0) {
                token = opts.createSearchChoice(token, selection);
                if (token !== undefined && token !== null && opts.id(token) !== undefined && opts.id(token) !== null) {
                    dupe = false;
                    for (i = 0, l = selection.length; i < l; i++) {
                        if (equal(opts.id(token), opts.id(selection[i]))) {
                            dupe = true; break;
                        }
                    }

                    if (!dupe) selectCallback(token);
                }
            }
        }

        if (original.localeCompare(input) != 0) return input;
    }

    /**
     * blurs any Select2 container that has focus when an element outside them was clicked or received focus
     *
     * also takes care of clicks on label tags that point to the source element
     */
    $document.ready(function () {
        $document.bind("mousedown touchend", function (e) {
            var target = $(e.target).closest("div.select2-container").get(0), attr;
            if (target) {
                $document.find("div.select2-container-active").each(function () {
                    if (this !== target) $(this).data("select2").blur();
                });
            } else {
                target = $(e.target).closest("div.select2-drop").get(0);
                $document.find("div.select2-drop-active").each(function () {
                    if (this !== target) $(this).data("select2").blur();
                });
            }

            target=$(e.target);
            attr = target.attr("for");
            if ("LABEL" === e.target.tagName && attr && attr.length > 0) {
                attr = attr.replace(/([\[\].])/g,'\\$1'); /* escapes [, ], and . so properly selects the id */
                target = $("#"+attr);
                target = target.data("select2");
                if (target !== undefined) { target.focus(); e.preventDefault();}
            }
        });
    });

    /**
     * Creates a new class
     *
     * @param superClass
     * @param methods
     */
    function clazz(SuperClass, methods) {
        var constructor = function () {};
        constructor.prototype = new SuperClass;
        constructor.prototype.constructor = constructor;
        constructor.prototype.parent = SuperClass.prototype;
        constructor.prototype = $.extend(constructor.prototype, methods);
        return constructor;
    }

    AbstractSelect2 = clazz(Object, {

        // abstract
        bind: function (func) {
            var self = this;
            return function () {
                func.apply(self, arguments);
            };
        },

        // abstract
        init: function (opts) {
            var results, search, free_text, resultsSelector = ".select2-results";

            // prepare options
            this.opts = opts = this.prepareOpts(opts);

            this.id=opts.id;

            // destroy if called on an existing component
            if (opts.element.data("select2") !== undefined &&
                opts.element.data("select2") !== null) {
                this.destroy();
            }

            this.enabled=true;
            this.container = this.createContainer();

            this.containerId="s2id_"+(opts.element.attr("id") || "autogen"+nextUid());
            this.containerSelector="#"+this.containerId.replace(/([;&,\.\+\*\~':"\!\^#$%@\[\]\(\)=>\|])/g, '\\$1');
            this.container.attr("id", this.containerId);

            // cache the body so future lookups are cheap
            this.body = thunk(function() { return opts.element.closest("body"); });

            if (opts.element.attr("class") !== undefined) {
                this.container.addClass(opts.element.attr("class").replace(/validate\[[\S ]+] ?/, ''));
            }

            this.container.css(evaluate(opts.containerCss));
            this.container.addClass(evaluate(opts.containerCssClass));

            // swap container for the element
            this.opts.element
                .data("select2", this)
                .hide()
                .before(this.container);
            this.container.data("select2", this);

            this.dropdown = this.container.find(".select2-drop");
            this.dropdown.addClass(evaluate(opts.dropdownCssClass));
            this.dropdown.data("select2", this);

            this.results = results = this.container.find(resultsSelector);
            this.search = search = this.container.find("input.select2-input");
            this.free_text = free_text = this.container.find("input.select2-input-free");

            search.attr("tabIndex", this.opts.element.attr("tabIndex"));

            this.resultsPage = 0;
            this.context = null;

            // initialize the container
            this.initContainer();
            this.initContainerWidth();

            installFilteredMouseMove(this.results);
            this.dropdown.delegate(resultsSelector, "mousemove-filtered", this.bind(this.highlightUnderEvent));

            installDebouncedScroll(80, this.results);
            this.dropdown.delegate(resultsSelector, "scroll-debounced", this.bind(this.loadMoreIfNeeded));

            // if jquery.mousewheel plugin is installed we can prevent out-of-bounds scrolling of results via mousewheel
            if ($.fn.mousewheel) {
                results.mousewheel(function (e, delta, deltaX, deltaY) {
                    var top = results.scrollTop(), height;
                    if (deltaY > 0 && top - deltaY <= 0) {
                        results.scrollTop(0);
                        killEvent(e);
                    } else if (deltaY < 0 && results.get(0).scrollHeight - results.scrollTop() + deltaY <= results.height()) {
                        results.scrollTop(results.get(0).scrollHeight - results.height());
                        killEvent(e);
                    }
                });
            }

            installKeyUpChangeEvent(search);
            search.bind("keyup-change", this.bind(this.updateResults));
            search.bind("focus", function () { search.addClass("select2-focused"); if (search.val() === " ") search.val(""); });
            search.bind("blur", function () { search.removeClass("select2-focused");});

            this.dropdown.delegate(resultsSelector, "mouseup", this.bind(function (e) {
                if ($(e.target).closest(".select2-result-selectable:not(.select2-disabled)").length > 0) {
                    this.highlightUnderEvent(e);
                    this.selectHighlighted(e);
                } else {
                    this.focusSearch();
                }
                killEvent(e);
            }));

            // trap all mouse events from leaving the dropdown. sometimes there may be a modal that is listening
            // for mouse events outside of itself so it can close itself. since the dropdown is now outside the select2's
            // dom it will trigger the popup close, which is not what we want
            this.dropdown.bind("click mouseup mousedown", function (e) { e.stopPropagation(); });

            if ($.isFunction(this.opts.initSelection)) {
                // initialize selection based on the current value of the source element
                this.initSelection();

                // if the user has provided a function that can set selection based on the value of the source element
                // we monitor the change event on the element and trigger it, allowing for two way synchronization
                this.monitorSource();
            }

            if (opts.element.is(":disabled") || opts.element.is("[readonly='readonly']")) this.disable();

            // CartoDB 2.0 custom element ////////////////////////////////////////////////////////////////////////////////
            if ($(this.container).hasClass("color_ramp")) {
              try {
                var color = $(this.container).find(".select2-choice").text().replace(/ /g,"")
                  , bucket = $(this.container).attr("class").match(/(\d)_buckets/)[1]
                  , html = "<ul>"
                  , colors = cdb.admin.color_ramps[color][bucket];

                for (var j=0, c_l = colors.length; j<c_l; j++) {
                  var color = colors[j];
                  html += "<li style='background:" + color + ";'></li>";
                }

                html += "</ul>";

                $(this.container).find('.select2-choice').append(html);
              } catch(e) {
                cdb.log.info("Failing Select plugin when tries to generate a color ramp dropdown");
              }
            }
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////
        },

        // abstract
        destroy: function () {
            var select2 = this.opts.element.data("select2");
            if (select2 !== undefined) {
                select2.container.remove();
                select2.dropdown.remove();
                select2.opts.element
                    .removeData("select2")
                    .unbind(".select2")
                    .show();
            }
        },

        // abstract
        prepareOpts: function (opts) {
            var element, select, idKey, ajaxUrl;

            element = opts.element;

            if (element.get(0).tagName.toLowerCase() === "select") {
                this.select = select = opts.element;
            }

            if (select) {
                // these options are not allowed when attached to a select because they are picked up off the element itself
                $.each(["id", "multiple", "ajax", "query", "createSearchChoice", "initSelection", "data", "tags"], function () {
                    if (this in opts) {
                        throw new Error("Option '" + this + "' is not allowed for Select2 when attached to a <select> element.");
                    }
                });
            }

            opts = $.extend({}, {
                populateResults: function(container, results, query) {
                    var populate,  data, result, children, id=this.opts.id, self=this;

                    populate=function(results, container, depth) {

                        var i, l, result, disabled, selectable, compound, node, label, innerContainer, formatted;
                        for (i = 0, l = results.length; i < l; i = i + 1) {

                            result=results[i];
                            // CartoDB 2.0 custom element ////////////////////////////////////////////////////////////
                            disabled = $(result.element).is(":disabled");
                            selectable = (!disabled) && (id(result) !== undefined);
                            //////////////////////////////////////////////////////////////////////////////////////////
                            compound=result.children && result.children.length > 0;

                            node=$("<li></li>");
                            node.addClass("select2-results-dept-"+depth);
                            node.addClass("select2-result");
                            node.addClass(selectable ? "select2-result-selectable" : "select2-result-unselectable");
                            if (compound) { node.addClass("select2-result-with-children"); }
                            node.addClass(self.opts.formatResultCssClass(result));

                            label=$("<div></div>");
                            //label.addClass("select2-result-label");

                            // CartoDB 2.0 custom element ////////////////////////////////////////////////////////////
                            if (!selectable && $(result.element).data("message")) {
                              var msg = $(result.element).data("message");
                              node.tipsy({
                                fade: true,
                                gravity: 's',
                                offset: -10,
                                title: function() {
                                  return msg
                                }
                              })
                            }

                            label.addClass("select2-result-label " + ( color_ramp ? result.text : '' ));
                            //////////////////////////////////////////////////////////////////////////////////////////

                            formatted=opts.formatResult(result, label, query);
                            if (formatted!==undefined) {
                                label.html(self.opts.escapeMarkup(formatted));
                            }

                            node.append(label);

                            if (compound) {

                                innerContainer=$("<ul></ul>");
                                innerContainer.addClass("select2-result-sub");
                                populate(result.children, innerContainer, depth+1);
                                node.append(innerContainer);
                            }

                            // CartoDB 2.0 custom element ////////////////////////////////////////////////////////////
                            var color_ramp = $(container.prevObject).hasClass("color_ramp");

                            if (color_ramp) {

                              try {
                                label.html('');
                                var color = result.text
                                  , bucket = $(container.prevObject).attr("class").match(/(\d)_buckets/)[1]
                                  , html = "<table><tr>"
                                  , colors = cdb.admin.color_ramps[color][bucket];

                                for (var j=0, c_l = colors.length; j<c_l; j++) {
                                  var color = colors[j];
                                  html += "<td class='color' style='background:" + color + ";'></td>";
                                }

                                html += "</tr></table>";

                                label.append(html);
                              } catch(e) {
                                cdb.log.info("Failing Select plugin when tries to generate a color ramp dropdown");
                              }
                            }
                            //////////////////////////////////////////////////////////////////////////////////////////

                            node.data("select2-data", result);
                            container.append(node);
                        }
                    };

                    populate(results, container, 0);
                }
            }, $.fn.select2.defaults, opts);

            if (typeof(opts.id) !== "function") {
                idKey = opts.id;
                opts.id = function (e) { return e[idKey]; };
            }

            if (select) {
                opts.query = this.bind(function (query) {
                    var data = { results: [], more: false },
                        term = query.term,
                        children, firstChild, process;

                    process=function(element, collection) {
                        var group;
                        if (element.is("option")) {
                            if (query.matcher(term, element.text(), element)) {
                                collection.push({id:element.attr("value"), text:element.text(), element: element.get(), css: element.attr("class")});
                            }
                        } else if (element.is("optgroup")) {
                            group={text:element.attr("label"), children:[], element: element.get(), css: element.attr("class")};
                            element.children().each2(function(i, elm) { process(elm, group.children); });
                            if (group.children.length>0) {
                                collection.push(group);
                            }
                        }
                    };

                    children=element.children();

                    // ignore the placeholder option if there is one
                    if (this.getPlaceholder() !== undefined && children.length > 0) {
                        firstChild = children[0];
                        if ($(firstChild).text() === "") {
                            children=children.not(firstChild);
                        }
                    }

                    children.each2(function(i, elm) { process(elm, data.results); });

                    query.callback(data);
                });
                // this is needed because inside val() we construct choices from options and there id is hardcoded
                opts.id=function(e) { return e.id; };
                opts.formatResultCssClass = function(data) { return data.css; }
            } else {
                if (!("query" in opts)) {
                    if ("ajax" in opts) {
                        ajaxUrl = opts.element.data("ajax-url");
                        if (ajaxUrl && ajaxUrl.length > 0) {
                            opts.ajax.url = ajaxUrl;
                        }
                        opts.query = ajax(opts.ajax);
                    } else if ("data" in opts) {
                        opts.query = local(opts.data);
                    } else if ("tags" in opts) {
                        opts.query = tags(opts.tags);
                        if (opts.createSearchChoice === undefined) {
                            opts.createSearchChoice = function (term) { return {id: term, text: term}; };
                        }
                        opts.initSelection = function (element, callback) {
                            var data = [];
                            $(splitVal(element.val(), opts.separator)).each(function () {
                                var id = this, text = this, tags=opts.tags;
                                if ($.isFunction(tags)) tags=tags();
                                $(tags).each(function() { if (equal(this.id, id)) { text = this.text; return false; } });
                                data.push({id: id, text: text});
                            });

                            callback(data);
                        };
                    }
                }
            }
            if (typeof(opts.query) !== "function") {
                throw "query function not defined for Select2 " + opts.element.attr("id");
            }

            return opts;
        },

        /**
         * Monitor the original element for changes and update select2 accordingly
         */
        // abstract
        monitorSource: function () {
            this.opts.element.bind("change.select2", this.bind(function (e) {
                if (this.opts.element.data("select2-change-triggered") !== true) {
                    this.initSelection();
                }
            }));
        },

        /**
         * Triggers the change event on the source element
         */
        // abstract
        triggerChange: function (details) {

            details = details || {};
            details= $.extend({}, details, { type: "change", val: this.val() });
            // prevents recursive triggering
            this.opts.element.data("select2-change-triggered", true);
            this.opts.element.trigger(details);
            this.opts.element.data("select2-change-triggered", false);

            // some validation frameworks ignore the change event and listen instead to keyup, click for selects
            // so here we trigger the click event manually
            this.opts.element.click();

            // ValidationEngine ignorea the change event and listens instead to blur
            // so here we trigger the blur event manually if so desired
            if (this.opts.blurOnChange)
                this.opts.element.blur();
        },


        // abstract
        enable: function() {
            if (this.enabled) return;

            this.enabled=true;
            this.container.removeClass("select2-container-disabled");
            this.opts.element.removeAttr("disabled");
        },

        // abstract
        disable: function() {
            if (!this.enabled) return;

            this.close();

            this.enabled=false;
            this.container.addClass("select2-container-disabled");
            this.opts.element.attr("disabled", "disabled");
        },

        // abstract
        opened: function () {
            return this.container.hasClass("select2-dropdown-open");
        },

        // abstract
        positionDropdown: function() {
            var offset = this.container.offset(),
                height = this.container.outerHeight(false),
                width = this.container.outerWidth(false),
                dropHeight = this.dropdown.outerHeight(false),
          viewPortRight = $(window).scrollLeft() + document.documentElement.clientWidth,
                viewportBottom = $(window).scrollTop() + document.documentElement.clientHeight,
                dropTop = offset.top + height,
                dropLeft = offset.left,
                enoughRoomBelow = dropTop + dropHeight <= viewportBottom,
                enoughRoomAbove = (offset.top - dropHeight) >= this.body().scrollTop(),
          dropWidth = this.dropdown.outerWidth(false),
          enoughRoomOnRight = dropLeft + dropWidth <= viewPortRight,
                aboveNow = this.dropdown.hasClass("select2-drop-above"),
                bodyOffset,
                above,
                css;

            // console.log("below/ droptop:", dropTop, "dropHeight", dropHeight, "sum", (dropTop+dropHeight)+" viewport bottom", viewportBottom, "enough?", enoughRoomBelow);
            // console.log("above/ offset.top", offset.top, "dropHeight", dropHeight, "top", (offset.top-dropHeight), "scrollTop", this.body().scrollTop(), "enough?", enoughRoomAbove);

            // fix positioning when body has an offset and is not position: static

            if (this.body().css('position') !== 'static') {
                bodyOffset = this.body().offset();
                dropTop -= bodyOffset.top;
                dropLeft -= bodyOffset.left;
            }

            // always prefer the current above/below alignment, unless there is not enough room

            if (aboveNow) {
                above = true;
                if (!enoughRoomAbove && enoughRoomBelow) above = false;
            } else {
                above = false;
                if (!enoughRoomBelow && enoughRoomAbove) above = true;
            }

      if (!enoughRoomOnRight) {
       dropLeft = offset.left + width - dropWidth;
      }

            if (above) {
                dropTop = offset.top - dropHeight;
                this.container.addClass("select2-drop-above");
                this.dropdown.addClass("select2-drop-above");
            }
            else {
                this.container.removeClass("select2-drop-above");
                this.dropdown.removeClass("select2-drop-above");
            }

            css = $.extend({
                top: dropTop,
                left: dropLeft,
                width: width
            }, evaluate(this.opts.dropdownCss));

            this.dropdown.css(css);
        },

        // abstract
        shouldOpen: function() {
            var event;

            if (this.opened()) return false;

            event = $.Event("open");
            this.opts.element.trigger(event);
            return !event.isDefaultPrevented();
        },

        // abstract
        clearDropdownAlignmentPreference: function() {
            // clear the classes used to figure out the preference of where the dropdown should be opened
            this.container.removeClass("select2-drop-above");
            this.dropdown.removeClass("select2-drop-above");
        },

        /**
         * Opens the dropdown
         *
         * @return {Boolean} whether or not dropdown was opened. This method will return false if, for example,
         * the dropdown is already open, or if the 'open' event listener on the element called preventDefault().
         */
        // abstract
        open: function () {

            if (!this.shouldOpen()) return false;

            window.setTimeout(this.bind(this.opening), 1);

            return true;
        },

        /**
         * Performs the opening of the dropdown
         */
        // abstract
        opening: function() {
            var cid = this.containerId, selector = this.containerSelector,
                scroll = "scroll." + cid, resize = "resize." + cid;

            this.container.parents().each(function() {
                $(this).bind(scroll, function() {
                    var s2 = $(selector);
                    if (s2.length == 0) {
                        $(this).unbind(scroll);
                    }
                    s2.select2("close");
                });
            });

            window.setTimeout(function() {
                // this is done inside a timeout because IE will sometimes fire a resize event while opening
                // the dropdown and that causes this handler to immediately close it. this way the dropdown
                // has a chance to fully open before we start listening to resize events
                $(window).bind(resize, function() {
                    var s2 = $(selector);
                    if (s2.length == 0) {
                        $(window).unbind(resize);
                    }
                    s2.select2("close");
                });

                $(window).bind(scroll, function() {
                    var s2 = $(selector);
                    if (s2.length == 0) {
                        $(window).unbind(scroll);
                    }
                    s2.select2("close");
                });
            }, 10);

            this.clearDropdownAlignmentPreference();

            if (this.search.val() === " ") { this.search.val(""); }

            this.container.addClass("select2-dropdown-open").addClass("select2-container-active");

            this.updateResults(true);

            if(this.dropdown[0] !== this.body().children().last()[0]) {
                this.dropdown.detach().appendTo(this.body());
            }

            this.dropdown.show();

            this.positionDropdown();
            this.dropdown.addClass("select2-drop-active");

            this.ensureHighlightVisible();

            this.focusSearch();
        },

        // abstract
        close: function () {
            if (!this.opened()) return;

            var self = this;

            this.container.parents().each(function() {
                $(this).unbind("scroll." + self.containerId);
            });
            $(window).unbind("resize." + this.containerId);
            $(window).unbind("scroll." + this.containerId);

            this.clearDropdownAlignmentPreference();

            this.dropdown.hide();
            this.container.removeClass("select2-dropdown-open").removeClass("select2-container-active");
            this.results.empty();
            this.clearSearch();

            this.opts.element.trigger($.Event("close"));
        },

        // abstract
        clearSearch: function () {

        },

        // abstract
        ensureHighlightVisible: function () {
            var results = this.results, children, index, child, hb, rb, y, more;

            index = this.highlight();

            if (index < 0) return;

            if (index == 0) {

                // if the first element is highlighted scroll all the way to the top,
                // that way any unselectable headers above it will also be scrolled
                // into view

                results.scrollTop(0);
                return;
            }

            children = results.find(".select2-result-selectable");

            child = $(children[index]);

            hb = child.offset().top + child.outerHeight(true);

            // if this is the last child lets also make sure select2-more-results is visible
            if (index === children.length - 1) {
                more = results.find("li.select2-more-results");
                if (more.length > 0) {
                    hb = more.offset().top + more.outerHeight(true);
                }
            }

            rb = results.offset().top + results.outerHeight(true);
            if (hb > rb) {
                results.scrollTop(results.scrollTop() + (hb - rb));
            }
            y = child.offset().top - results.offset().top;

            // make sure the top of the element is visible
            if (y < 0 && child.css('display') != 'none' ) {
                results.scrollTop(results.scrollTop() + y); // y is negative
            }
        },

        // abstract
        moveHighlight: function (delta) {
            var choices = this.results.find(".select2-result-selectable"),
                index = this.highlight();

            while (index > -1 && index < choices.length) {
                index += delta;
                var choice = $(choices[index]);
                if (choice.hasClass("select2-result-selectable") && !choice.hasClass("select2-disabled")) {
                    this.highlight(index);
                    break;
                }
            }
        },

        // abstract
        highlight: function (index) {
            var choices = this.results.find(".select2-result-selectable").not(".select2-disabled");

            if (arguments.length === 0) {
                return indexOf(choices.filter(".select2-highlighted")[0], choices.get());
            }

            if (index >= choices.length) index = choices.length - 1;
            if (index < 0) index = 0;

            choices.removeClass("select2-highlighted");

            $(choices[index]).addClass("select2-highlighted");
            this.ensureHighlightVisible();

        },

        // abstract
        countSelectableResults: function() {
            return this.results.find(".select2-result-selectable").not(".select2-disabled").length;
        },

        // abstract
        highlightUnderEvent: function (event) {
            var el = $(event.target).closest(".select2-result-selectable");
            if (el.length > 0 && !el.is(".select2-highlighted")) {
            var choices = this.results.find('.select2-result-selectable');
                this.highlight(choices.index(el));
            } else if (el.length == 0) {
                // if we are over an unselectable item remove al highlights
                this.results.find(".select2-highlighted").removeClass("select2-highlighted");
            }
        },

        // abstract
        loadMoreIfNeeded: function () {
            var results = this.results,
                more = results.find("li.select2-more-results"),
                below, // pixels the element is below the scroll fold, below==0 is when the element is starting to be visible
                offset = -1, // index of first element without data
                page = this.resultsPage + 1,
                self=this,
                term=this.search.val(),
                context=this.context;

            if (more.length === 0) return;
            below = more.offset().top - results.offset().top - results.height();

            if (below <= 0) {
                more.addClass("select2-active");
                this.opts.query({
                        term: term,
                        page: page,
                        context: context,
                        matcher: this.opts.matcher,
                        callback: this.bind(function (data) {

                    // ignore a response if the select2 has been closed before it was received
                    if (!self.opened()) return;


                    self.opts.populateResults.call(this, results, data.results, {term: term, page: page, context:context});

                    if (data.more===true) {
                        more.detach().appendTo(results).text(self.opts.formatLoadMore(page+1));
                        window.setTimeout(function() { self.loadMoreIfNeeded(); }, 10);
                    } else {
                        more.remove();
                    }
                    self.positionDropdown();
                    self.resultsPage = page;
                })});
            }
        },

        /**
         * Default tokenizer function which does nothing
         */
        tokenize: function() {

        },

        /**
         * @param initial whether or not this is the call to this method right after the dropdown has been opened
         */
        // abstract
        updateResults: function (initial) {
            var search = this.search, results = this.results, opts = this.opts, data, self=this, input;

            // if the search is currently hidden we do not alter the results
            if (initial !== true && (this.showSearchInput === false || !this.opened())) {
                return;
            }

            search.addClass("select2-active");

            ///// CartoDB 2.0 ///////////////////////////////////
            function removeTipsys() {
              results.find('.select2-result').each(function(i,el){
                var $el = $(el);
                var tipsy = $el.data('tipsy');
                if (tipsy) {
                  $el
                    .tipsy('hide')
                    .unbind('mouseleave mouseenter');
                }
              })
            }
            ///// CartoDB 2.0 ///////////////////////////////////

            function postRender() {
                results.scrollTop(0);
                search.removeClass("select2-active");
                self.positionDropdown();
            }

            function render(html) {
                results.html(self.opts.escapeMarkup(html));
                postRender();
            }

            ///// CartoDB 2.0 ///////////////////////////////////
            removeTipsys();
            ///// CartoDB 2.0 ///////////////////////////////////

            if (opts.maximumSelectionSize >=1) {
                data = this.data();
                if ($.isArray(data) && data.length >= opts.maximumSelectionSize && checkFormatter(opts.formatSelectionTooBig, "formatSelectionTooBig")) {
                  render("<li class='select2-selection-limit'>" + opts.formatSelectionTooBig(opts.maximumSelectionSize) + "</li>");
                  return;
                }
            }

            if (search.val().length < opts.minimumInputLength) {
                if (checkFormatter(opts.formatInputTooShort, "formatInputTooShort")) {
                    render("<li class='select2-no-results'>" + opts.formatInputTooShort(search.val(), opts.minimumInputLength) + "</li>");
                } else {
                    render("");
                }
                return;
            }
            else if (opts.formatSearching()) {
                render("<li class='select2-searching'>" + opts.formatSearching() + "</li>");
            }

            // give the tokenizer a chance to pre-process the input
            input = this.tokenize();
            if (input != undefined && input != null) {
                search.val(input);
            }

            this.resultsPage = 1;
            opts.query({
                    term: search.val(),
                    page: this.resultsPage,
                    context: null,
                    matcher: opts.matcher,
                    callback: this.bind(function (data) {
                var def; // default choice

                // ignore a response if the select2 has been closed before it was received
                if (!this.opened()) return;

                // save context, if any
                this.context = (data.context===undefined) ? null : data.context;

                // create a default choice and prepend it to the list
                if (this.opts.createSearchChoice && search.val() !== "") {
                    def = this.opts.createSearchChoice.call(null, search.val(), data.results);
                    if (def !== undefined && def !== null && self.id(def) !== undefined && self.id(def) !== null) {
                        if ($(data.results).filter(
                            function () {
                                return equal(self.id(this), self.id(def));
                            }).length === 0) {
                            data.results.unshift(def);
                        }
                    }
                }

                if (data.results.length === 0 && checkFormatter(opts.formatNoMatches, "formatNoMatches")) {
                    render("<li class='select2-no-results'>" + opts.formatNoMatches(search.val()) + "</li>");
                    return;
                }

                results.empty();
                self.opts.populateResults.call(this, results, data.results, {term: search.val(), page: this.resultsPage, context:null});

                if (data.more === true && checkFormatter(opts.formatLoadMore, "formatLoadMore")) {
                    results.append("<li class='select2-more-results'>" + self.opts.escapeMarkup(opts.formatLoadMore(this.resultsPage)) + "</li>");
                    window.setTimeout(function() { self.loadMoreIfNeeded(); }, 10);
                }

                this.postprocessResults(data, initial);

                postRender();
            })});
        },

        // abstract
        cancel: function () {
            this.close();
        },

        // abstract
        blur: function () {
            this.close();
            this.container.removeClass("select2-container-active");
            this.dropdown.removeClass("select2-drop-active");
            // synonymous to .is(':focus'), which is available in jquery >= 1.6
            if (this.search[0] === document.activeElement) { this.search.blur(); }
            this.clearSearch();
            this.selection.find(".select2-search-choice-focus").removeClass("select2-search-choice-focus");
            this.opts.element.triggerHandler("blur");
        },

        // abstract
        focusSearch: function () {
            if (this.showSearchInput) {
                // need to do it here as well as in timeout so it works in IE
                this.search.show();
                this.search.focus();
  
                /* we do this in a timeout so that current event processing can complete before this code is executed.
                 this makes sure the search field is focussed even if the current event would blur it */
                window.setTimeout(this.bind(function () {
                    // reset the value so IE places the cursor at the end of the input box
                    this.search.show();
                    this.search.focus();
                    this.search.val(this.search.val());
                }), 10);
            }
        },

        // abstract
        selectHighlighted: function () {
            var index=this.highlight(),
                highlighted=this.results.find(".select2-highlighted").not(".select2-disabled"),
                data = highlighted.closest('.select2-result-selectable').data("select2-data");
            if (data) {
                highlighted.addClass("select2-disabled");
                this.highlight(index);
                this.onSelect(data);
            }
        },

        // abstract
        getPlaceholder: function () {
            return this.opts.element.attr("placeholder") ||
                this.opts.element.attr("data-placeholder") || // jquery 1.4 compat
                this.opts.element.data("placeholder") ||
                this.opts.placeholder;
        },

        /**
         * Get the desired width for the container element.  This is
         * derived first from option `width` passed to select2, then
         * the inline 'style' on the original element, and finally
         * falls back to the jQuery calculated element width.
         */
        // abstract
        initContainerWidth: function () {
            function resolveContainerWidth() {
                var style, attrs, matches, i, l;

                if (this.opts.width === "off") {
                    return null;
                } else if (this.opts.width === "element"){
                    return this.opts.element.outerWidth(false) === 0 ? 'auto' : this.opts.element.outerWidth(false) + 'px';
                } else if (this.opts.width === "copy" || this.opts.width === "resolve") {
                    // check if there is inline style on the element that contains width
                    style = this.opts.element.attr('style');
                    if (style !== undefined) {
                        attrs = style.split(';');
                        for (i = 0, l = attrs.length; i < l; i = i + 1) {
                            matches = attrs[i].replace(/\s/g, '')
                                .match(/width:(([-+]?([0-9]*\.)?[0-9]+)(px|em|ex|%|in|cm|mm|pt|pc))/);
                            if (matches !== null && matches.length >= 1)
                                return matches[1];
                        }
                    }

                    if (this.opts.width === "resolve") {
                        // next check if css('width') can resolve a width that is percent based, this is sometimes possible
                        // when attached to input type=hidden or elements hidden via css
                        style = this.opts.element.css('width');
                        if (style.indexOf("%") > 0) return style;

                        // finally, fallback on the calculated width of the element
                        return (this.opts.element.outerWidth(false) === 0 ? 'auto' : this.opts.element.outerWidth(false) + 'px');
                    }

                    return null;
                } else if ($.isFunction(this.opts.width)) {
                    return this.opts.width();
                } else {
                    return this.opts.width;
               }
            };

            var width = resolveContainerWidth.call(this);
            if (width !== null) {
                this.container.attr("style", "width: "+width);
            }
        }
    });

    SingleSelect2 = clazz(AbstractSelect2, {

        // single

    createContainer: function () {
            var container = $("<div></div>", {
                "class": "select2-container"
            }).html([
                "    <a href='javascript:void(0)' onclick='return false;' class='select2-choice'>",
                "   <span></span><abbr class='select2-search-choice-close' style='display:none;'></abbr>",
                "   <div><b></b></div>" ,
                "</a>",
                "    <div class='select2-drop select2-offscreen'>" ,
                "   <div class='select2-search'>" ,
                "       <input type='text' autocomplete='off' class='select2-input'/>" ,
                "   </div>" ,
                "   <ul class='select2-results'>" ,
                "   </ul>" ,
                "   <div class='select2-text'>" ,
                "       <input type='text' placeholder='Free text input' class='select2-input-free'/>" ,
                "       <i class='select2-icon select2-text-icon'></i>" ,
                "   </div>" ,
                "</div>"].join(""));
            return container;
        },

        // single
        opening: function () {
            this.search.show();
            this.parent.opening.apply(this, arguments);
            this.dropdown.removeClass("select2-offscreen");
        },

        // single
        close: function () {
            if (!this.opened()) return;
            this.parent.close.apply(this, arguments);
            this.dropdown.removeAttr("style").addClass("select2-offscreen").insertAfter(this.selection).show();
        },

        // single
        focus: function () {
            this.close();
            this.selection.focus();
        },

        // single
        isFocused: function () {
            return this.selection[0] === document.activeElement;
        },

        // single
        cancel: function () {
            this.parent.cancel.apply(this, arguments);
            this.selection.focus();
        },

        // single
        initContainer: function () {

            var selection,
                container = this.container,
                dropdown = this.dropdown,
                clickingInside = false;

            this.selection = selection = container.find(".select2-choice");

            this.search.bind("keydown", this.bind(function (e) {
                if (!this.enabled) return;

                if (e.which === KEY.PAGE_UP || e.which === KEY.PAGE_DOWN) {
                    // prevent the page from scrolling
                    killEvent(e);
                    return;
                }

                if (this.opened()) {
                    switch (e.which) {
                        case KEY.UP:
                        case KEY.DOWN:
                            this.moveHighlight((e.which === KEY.UP) ? -1 : 1);
                            killEvent(e);
                            return;
                        case KEY.TAB:
                        case KEY.ENTER:
                            this.selectHighlighted();
                            killEvent(e);
                            return;
                        case KEY.ESC:
                            this.cancel(e);
                            killEvent(e);
                            return;
                    }
                } else {

                    if (e.which === KEY.TAB || KEY.isControl(e) || KEY.isFunctionKey(e) || e.which === KEY.ESC) {
                        return;
                    }

                    if (this.opts.openOnEnter === false && e.which === KEY.ENTER) {
                        return;
                    }

                    this.open();

                    if (e.which === KEY.ENTER) {
                        // do not propagate the event otherwise we open, and propagate enter which closes
                        return;
                    }
                }
            }));

            this.search.bind("focus", this.bind(function() {
                this.selection.attr("tabIndex", "-1");
            }));
            this.search.bind("blur", this.bind(function() {
                if (!this.opened()) this.container.removeClass("select2-container-active");
                window.setTimeout(this.bind(function() {
                    // restore original tab index
                    var ti=this.opts.element.attr("tabIndex");
                    if (ti) {
                        this.selection.attr("tabIndex", ti);
                    } else {
                        this.selection.removeAttr("tabIndex");
                    }
                }), 10);
            }));

            this.free_text.bind("keydown", this.bind(function (e) {
                var value = $(e.target).val();

                if (!this.enabled) return;

                if (e.which === KEY.PAGE_UP || e.which === KEY.PAGE_DOWN) {
                    // prevent the page from scrolling
                    killEvent(e);
                    return;
                }

                if (this.opened()) {
                    switch (e.which) {
                        case KEY.UP:
                        case KEY.DOWN:
                            killEvent(e);
                            return;
                        case KEY.TAB:
                            return;
                        case KEY.ENTER:
                            this.onSelect({ id: value, text: value });
                            killEvent(e);
                            return;
                        case KEY.ESC:
                            this.cancel(e);
                            killEvent(e);
                            return;
                    }
                }
            }));

            selection.delegate("abbr", "mousedown", this.bind(function (e) {
                if (!this.enabled) return;
                this.clear();
                killEventImmediately(e);
                this.close();
                this.triggerChange();
                this.selection.focus();
            }));

            selection.bind("mousedown", this.bind(function (e) {
                clickingInside = true;

                if (this.opened()) {
                    this.close();
                    this.selection.focus();
                } else if (this.enabled) {
                    this.open();
                }

                clickingInside = false;
            }));

            dropdown.bind("mousedown", this.bind(function() { /*this.search.focus();*/ }));

            selection.bind("focus", this.bind(function() {
                this.container.addClass("select2-container-active");
                // hide the search so the tab key does not focus on it
                this.search.attr("tabIndex", "-1");
            }));

            selection.bind("blur", this.bind(function() {
                if (!this.opened()) {
                    this.container.removeClass("select2-container-active");
                }
                window.setTimeout(this.bind(function() { this.search.attr("tabIndex", this.opts.element.attr("tabIndex")); }), 10);
            }));

            selection.bind("keydown", this.bind(function(e) {
                if (!this.enabled) return;

                if (e.which == KEY.DOWN || e.which == KEY.UP
                    || (e.which == KEY.ENTER && this.opts.openOnEnter)) {
                    this.open();
                    killEvent(e);
                    return;
                }

                if (e.which == KEY.DELETE || e.which == KEY.BACKSPACE) {
                    if (this.opts.allowClear) {
                        this.clear();
                    }
                    killEvent(e);
                    return;
                }
            }));
            selection.bind("keypress", this.bind(function(e) {
                var key = String.fromCharCode(e.which);
                this.search.val(key);
                this.open();
            }));

            this.setPlaceholder();

            this.search.bind("focus", this.bind(function() {
                this.container.addClass("select2-container-active");
            }));
        },

        // single
        clear: function() {
            this.opts.element.val("");
            this.selection.find("span").empty();
            this.selection.removeData("select2-data");
            this.setPlaceholder();
        },

        /**
         * Sets selection based on source element's value
         */
        // single
        initSelection: function () {
            var selected;
            if (this.opts.element.val() === "" && this.opts.element.text() === "") {
                this.close();
                this.setPlaceholder();
            } else {
                var self = this;
                this.opts.initSelection.call(null, this.opts.element, function(selected){
                    if (selected !== undefined && selected !== null) {
                        self.updateSelection(selected);
                        self.close();
                        self.setPlaceholder();
                    }
                });
            }
        },

        // single
        prepareOpts: function () {
            var opts = this.parent.prepareOpts.apply(this, arguments);

            if (opts.element.get(0).tagName.toLowerCase() === "select") {
                // install the selection initializer
                opts.initSelection = function (element, callback) {
                    var selected = element.find(":selected");
                    // a single select box always has a value, no need to null check 'selected'
                    if ($.isFunction(callback))
                        callback({id: selected.attr("value"), text: selected.text(), element:selected});
                };
            }

            return opts;
        },

        // single
        setPlaceholder: function () {
            var placeholder = this.getPlaceholder();
            var data = this.selection.data("select2-data");

            if (this.opts.element.val() === "" && placeholder !== undefined && ( data && !data.id && !data.text )) {

                // check for a first blank option if attached to a select
                if (this.select && this.select.find("option:first").text() !== "") return;

                this.selection.find("span").html(this.opts.escapeMarkup(placeholder));

                this.selection.addClass("select2-default");

                this.selection.find("abbr").hide();
            }
        },

        // single
        postprocessResults: function (data, initial) {
            var selected = 0, self = this, showSearchInput = true, showFreeTextInput = false;

            // find the selected element in the result list

            this.results.find(".select2-result-selectable").each2(function (i, elm) {
                if (equal(self.id(elm.data("select2-data")), self.opts.element.val())) {
                    selected = i;
                    return false;
                }
            });

            // and highlight it

            this.highlight(selected);

            // hide the search box if this is the first we got the results and there are a few of them

            if (initial === true) {
                showSearchInput = this.showSearchInput = countResults(data.results) >= this.opts.minimumResultsForSearch;
                this.dropdown.find(".select2-search")[showSearchInput ? "removeClass" : "addClass"]("select2-search-hidden");

                showFreeTextInput = this.showFreeTextInput = this.opts.freeText;
                this.dropdown.find(".select2-text")[showFreeTextInput ? "removeClass" : "addClass"]("select2-search-hidden");

                //add "select2-with-searchbox" to the container if search box is shown
                $(this.dropdown, this.container)[showSearchInput ? "addClass" : "removeClass"]("select2-with-searchbox");
            }

        },

        // single
        onSelect: function (data) {
            var old = this.opts.element.val();

            this.opts.element.val(this.id(data));
            this.updateSelection(data);
            this.close();
            this.selection.focus();

            if (!equal(old, this.id(data))) { this.triggerChange(); }
        },

        // single
        updateSelection: function (data) {

            var container=this.selection.find("span"), formatted;

            this.selection.data("select2-data", data);

            container.empty();
            formatted=this.opts.formatSelection(data, container);
            if (formatted !== undefined) {
                container.append(this.opts.escapeMarkup(formatted));
            }

            this.selection.removeClass("select2-default");

            if (this.opts.allowClear && this.getPlaceholder() !== undefined) {
                this.selection.find("abbr").show();
            }
        },

        // single
        val: function () {
            var val, data = null, self = this;

            if (arguments.length === 0) {
                return this.opts.element.val();
            }

            val = arguments[0];

            if (this.select) {
                this.select
                    .val(val)
                    .find(":selected").each2(function (i, elm) {
                        data = {id: elm.attr("value"), text: elm.text()};
                        return false;
                    });

                if (!data.id && !data.text) {
                  data = {id: val, text: val };
                }

                this.updateSelection(data);
                this.setPlaceholder();
            } else {
                if (this.opts.initSelection === undefined) {
                    throw new Error("cannot call val() if initSelection() is not defined");
                }
                // val is an id. !val is true for [undefined,null,'']
                if (!val) {
                    this.clear();
                    return;
                }
                this.opts.element.val(val);
                this.opts.initSelection(this.opts.element, function(data){
                    self.opts.element.val(!data ? "" : self.id(data));
                    self.updateSelection(data);
                    self.setPlaceholder();
                });
            }
        },

        // single
        clearSearch: function () {
            this.search.val("");
        },

        // single
        data: function(value) {
            var data;

            if (arguments.length === 0) {
                data = this.selection.data("select2-data");
                if (data == undefined) data = null;
                return data;
            } else {
                if (!value || value === "") {
                    this.clear();
                } else {
                    this.opts.element.val(!value ? "" : this.id(value));
                    this.updateSelection(value);
                }
            }
        }
    });

    MultiSelect2 = clazz(AbstractSelect2, {

        // multi
        createContainer: function () {
            var container = $("<div></div>", {
                "class": "select2-container select2-container-multi"
            }).html([
                "    <ul class='select2-choices'>",
                //"<li class='select2-search-choice'><span>California</span><a href="javascript:void(0)" class="select2-search-choice-close"></a></li>" ,
                "  <li class='select2-search-field'>" ,
                "    <input type='text' autocomplete='off' class='select2-input'>" ,
                "  </li>" ,
                "</ul>" ,
                "<div class='select2-drop select2-drop-multi' style='display:none;'>" ,
                "   <ul class='select2-results'>" ,
                "   </ul>" ,
                "</div>"].join(""));
      return container;
        },

        // multi
        prepareOpts: function () {
            var opts = this.parent.prepareOpts.apply(this, arguments);

            // TODO validate placeholder is a string if specified

            if (opts.element.get(0).tagName.toLowerCase() === "select") {
                // install sthe selection initializer
                opts.initSelection = function (element,callback) {

                    var data = [];
                    element.find(":selected").each2(function (i, elm) {
                        data.push({id: elm.attr("value"), text: elm.text(), element: elm});
                    });

                    if ($.isFunction(callback))
                        callback(data);
                };
            }

            return opts;
        },

        // multi
        initContainer: function () {

            var selector = ".select2-choices", selection;

            this.searchContainer = this.container.find(".select2-search-field");
            this.selection = selection = this.container.find(selector);

            this.search.bind("keydown", this.bind(function (e) {
                if (!this.enabled) return;

                if (e.which === KEY.BACKSPACE && this.search.val() === "") {
                    this.close();

                    var choices,
                        selected = selection.find(".select2-search-choice-focus");
                    if (selected.length > 0) {
                        this.unselect(selected.first());
                        this.search.width(10);
                        killEvent(e);
                        return;
                    }

                    choices = selection.find(".select2-search-choice:not(.select2-locked)");
                    if (choices.length > 0) {
                        choices.last().addClass("select2-search-choice-focus");
                    }
                } else {
                    selection.find(".select2-search-choice-focus").removeClass("select2-search-choice-focus");
                }

                if (this.opened()) {
                    switch (e.which) {
                    case KEY.UP:
                    case KEY.DOWN:
                        this.moveHighlight((e.which === KEY.UP) ? -1 : 1);
                        killEvent(e);
                        return;
                    case KEY.ENTER:
                    case KEY.TAB:
                        this.selectHighlighted();
                        killEvent(e);
                        return;
                    case KEY.ESC:
                        this.cancel(e);
                        killEvent(e);
                        return;
                    }
                }

                if (e.which === KEY.TAB || KEY.isControl(e) || KEY.isFunctionKey(e)
                 || e.which === KEY.BACKSPACE || e.which === KEY.ESC) {
                    return;
                }

                if (this.opts.openOnEnter === false && e.which === KEY.ENTER) {
                    return;
                }

                this.open();

                if (e.which === KEY.PAGE_UP || e.which === KEY.PAGE_DOWN) {
                    // prevent the page from scrolling
                    killEvent(e);
                }
            }));

            this.search.bind("keyup", this.bind(this.resizeSearch));

            this.search.bind("blur", this.bind(function(e) {
                this.container.removeClass("select2-container-active");
                this.search.removeClass("select2-focused");
                this.clearSearch();
                e.stopImmediatePropagation();
            }));

            this.container.delegate(selector, "mousedown", this.bind(function (e) {
                if (!this.enabled) return;
                if ($(e.target).closest(".select2-search-choice").length > 0) {
                    // clicked inside a select2 search choice, do not open
                    return;
                }
                this.clearPlaceholder();
                this.open();
                this.focusSearch();
                e.preventDefault();
            }));

            this.container.delegate(selector, "focus", this.bind(function () {
                if (!this.enabled) return;
                this.container.addClass("select2-container-active");
                this.dropdown.addClass("select2-drop-active");
                this.clearPlaceholder();
            }));

            // set the placeholder if necessary
            this.clearSearch();
        },

        // multi
        enable: function() {
            if (this.enabled) return;

            this.parent.enable.apply(this, arguments);

            this.search.removeAttr("disabled");
        },

        // multi
        disable: function() {
            if (!this.enabled) return;

            this.parent.disable.apply(this, arguments);

            this.search.attr("disabled", true);
        },

        // multi
        initSelection: function () {
            var data;
            if (this.opts.element.val() === "" && this.opts.element.text() === "") {
                this.updateSelection([]);
                this.close();
                // set the placeholder if necessary
                this.clearSearch();
            }
            if (this.select || this.opts.element.val() !== "") {
                var self = this;
                this.opts.initSelection.call(null, this.opts.element, function(data){
                    if (data !== undefined && data !== null) {
                        self.updateSelection(data);
                        self.close();
                        // set the placeholder if necessary
                        self.clearSearch();
                    }
                });
            }
        },

        // multi
        clearSearch: function () {
            var placeholder = this.getPlaceholder();

            if (placeholder !== undefined  && this.getVal().length === 0 && this.search.hasClass("select2-focused") === false) {
                this.search.val(placeholder).addClass("select2-default");
                // stretch the search box to full width of the container so as much of the placeholder is visible as possible
                this.resizeSearch();
            } else {
                // we set this to " " instead of "" and later clear it on focus() because there is a firefox bug
                // that does not properly render the caret when the field starts out blank
                this.search.val(" ").width(10);
            }
        },

        // multi
        clearPlaceholder: function () {
            if (this.search.hasClass("select2-default")) {
                this.search.val("").removeClass("select2-default");
            } else {
                // work around for the space character we set to avoid firefox caret bug
                if (this.search.val() === " ") this.search.val("");
            }
        },

        // multi
        opening: function () {
            this.parent.opening.apply(this, arguments);

            this.clearPlaceholder();
      this.resizeSearch();
            this.focusSearch();
        },

        // multi
        close: function () {
            if (!this.opened()) return;
            this.parent.close.apply(this, arguments);
        },

        // multi
        focus: function () {
            this.close();
            this.search.focus();
        },

        // multi
        isFocused: function () {
            return this.search.hasClass("select2-focused");
        },

        // multi
        updateSelection: function (data) {
            var ids = [], filtered = [], self = this;

            // filter out duplicates
            $(data).each(function () {
                if (indexOf(self.id(this), ids) < 0) {
                    ids.push(self.id(this));
                    filtered.push(this);
                }
            });
            data = filtered;

            this.selection.find(".select2-search-choice").remove();
            $(data).each(function () {
                self.addSelectedChoice(this);
            });
            self.postprocessResults();
        },

        tokenize: function() {
            var input = this.search.val();
            input = this.opts.tokenizer(input, this.data(), this.bind(this.onSelect), this.opts);
            if (input != null && input != undefined) {
                this.search.val(input);
                if (input.length > 0) {
                    this.open();
                }
            }

        },

        // multi
        onSelect: function (data) {
            this.addSelectedChoice(data);
            if (this.select || !this.opts.closeOnSelect) this.postprocessResults();

            if (this.opts.closeOnSelect) {
                this.close();
                this.search.width(10);
            } else {
                if (this.countSelectableResults()>0) {
                    this.search.width(10);
                    this.resizeSearch();
                    this.positionDropdown();
                } else {
                    // if nothing left to select close
                    this.close();
                }
            }

            // since its not possible to select an element that has already been
            // added we do not need to check if this is a new element before firing change
            this.triggerChange({ added: data });

            this.focusSearch();
        },

        // multi
        cancel: function () {
            this.close();
            this.focusSearch();
        },

        addSelectedChoice: function (data) {
            var enableChoice = !data.locked,
                enabledItem = $(
                    "<li class='select2-search-choice'>" +
                    "    <div></div>" +
                    "    <a href='#' onclick='return false;' class='select2-search-choice-close' tabindex='-1'></a>" +
                    "</li>"),
                disabledItem = $(
                    "<li class='select2-search-choice select2-locked'>" +
                    "<div></div>" +
                    "</li>");
            var choice = enableChoice ? enabledItem : disabledItem,
                id = this.id(data),
                val = this.getVal(),
                formatted;

            formatted=this.opts.formatSelection(data, choice.find("div"));
            if (formatted != undefined) {
                choice.find("div").replaceWith("<div>"+this.opts.escapeMarkup(formatted)+"</div>");
            }

            if(enableChoice){
              choice.find(".select2-search-choice-close")
                  .bind("mousedown", killEvent)
                  .bind("click dblclick", this.bind(function (e) {
                  if (!this.enabled) return;

                  $(e.target).closest(".select2-search-choice").fadeOut('fast', this.bind(function(){
                      this.unselect($(e.target));
                      this.selection.find(".select2-search-choice-focus").removeClass("select2-search-choice-focus");
                      this.close();
                      this.focusSearch();
                  })).dequeue();
                  killEvent(e);
              })).bind("focus", this.bind(function () {
                  if (!this.enabled) return;
                  this.container.addClass("select2-container-active");
                  this.dropdown.addClass("select2-drop-active");
              }));
            }

            choice.data("select2-data", data);
            choice.insertBefore(this.searchContainer);

            val.push(id);
            this.setVal(val);
        },

        // multi
        unselect: function (selected) {
            var val = this.getVal(),
                data,
                index;

            selected = selected.closest(".select2-search-choice");

            if (selected.length === 0) {
                throw "Invalid argument: " + selected + ". Must be .select2-search-choice";
            }

            data = selected.data("select2-data");

            index = indexOf(this.id(data), val);

            if (index >= 0) {
                val.splice(index, 1);
                this.setVal(val);
                if (this.select) this.postprocessResults();
            }
            selected.remove();
            this.triggerChange({ removed: data });
        },

        // multi
        postprocessResults: function () {
            var val = this.getVal(),
                choices = this.results.find(".select2-result-selectable"),
                compound = this.results.find(".select2-result-with-children"),
                self = this;

            choices.each2(function (i, choice) {
                var id = self.id(choice.data("select2-data"));
                if (indexOf(id, val) >= 0) {
                    choice.addClass("select2-disabled").removeClass("select2-result-selectable");
                } else {
                    choice.removeClass("select2-disabled").addClass("select2-result-selectable");
                }
            });

            compound.each2(function(i, e) {
                if (!e.is('.select2-result-selectable') && e.find(".select2-result-selectable").length==0) {  // FIX FOR HIRECHAL DATA
                    e.addClass("select2-disabled");
                } else {
                    e.removeClass("select2-disabled");
                }
            });

            if (this.highlight() == -1){
                choices.each2(function (i, choice) {
                    if (!choice.hasClass("select2-disabled") && choice.hasClass("select2-result-selectable")) {
                        self.highlight(0);
                        return false;
                    }
                });
            }

        },

        // multi
        resizeSearch: function () {

            var minimumWidth, left, maxWidth, containerLeft, searchWidth,
              sideBorderPadding = getSideBorderPadding(this.search);

            minimumWidth = measureTextWidth(this.search) + 10;

            left = this.search.offset().left;

            maxWidth = this.selection.width();
            containerLeft = this.selection.offset().left;

            searchWidth = maxWidth - (left - containerLeft) - sideBorderPadding;
            if (searchWidth < minimumWidth) {
                searchWidth = maxWidth - sideBorderPadding;
            }

            if (searchWidth < 40) {
                searchWidth = maxWidth - sideBorderPadding;
            }
            this.search.width(searchWidth);
        },

        // multi
        getVal: function () {
            var val;
            if (this.select) {
                val = this.select.val();
                return val === null ? [] : val;
            } else {
                val = this.opts.element.val();
                return splitVal(val, this.opts.separator);
            }
        },

        // multi
        setVal: function (val) {
            var unique;
            if (this.select) {
                this.select.val(val);
            } else {
                unique = [];
                // filter out duplicates
                $(val).each(function () {
                    if (indexOf(this, unique) < 0) unique.push(this);
                });
                this.opts.element.val(unique.length === 0 ? "" : unique.join(this.opts.separator));
            }
        },

        // multi
        val: function () {
            var val, data = [], self=this;

            if (arguments.length === 0) {
                return this.getVal();
            }

            val = arguments[0];

            if (!val) {
                this.opts.element.val("");
                this.updateSelection([]);
                this.clearSearch();
                return;
            }

            // val is a list of ids
            this.setVal(val);

            if (this.select) {
                this.select.find(":selected").each(function () {
                    data.push({id: $(this).attr("value"), text: $(this).text()});
                });
                this.updateSelection(data);
            } else {
                if (this.opts.initSelection === undefined) {
                    throw new Error("val() cannot be called if initSelection() is not defined")
                }

                this.opts.initSelection(this.opts.element, function(data){
                    var ids=$(data).map(self.id);
                    self.setVal(ids);
                    self.updateSelection(data);
                    self.clearSearch();
                });
            }
            this.clearSearch();
        },

        // multi
        onSortStart: function() {
            if (this.select) {
                throw new Error("Sorting of elements is not supported when attached to <select>. Attach to <input type='hidden'/> instead.");
            }

            // collapse search field into 0 width so its container can be collapsed as well
            this.search.width(0);
            // hide the container
            this.searchContainer.hide();
        },

        // multi
        onSortEnd:function() {

            var val=[], self=this;

            // show search and move it to the end of the list
            this.searchContainer.show();
            // make sure the search container is the last item in the list
            this.searchContainer.appendTo(this.searchContainer.parent());
            // since we collapsed the width in dragStarted, we resize it here
            this.resizeSearch();

            // update selection

            this.selection.find(".select2-search-choice").each(function() {
                val.push(self.opts.id($(this).data("select2-data")));
            });
            this.setVal(val);
            this.triggerChange();
        },

        // multi
        data: function(values) {
            var self=this, ids;
            if (arguments.length === 0) {
                 return this.selection
                     .find(".select2-search-choice")
                     .map(function() { return $(this).data("select2-data"); })
                     .get();
            } else {
                if (!values) { values = []; }
                ids = $.map(values, function(e) { return self.opts.id(e)});
                this.setVal(ids);
                this.updateSelection(values);
                this.clearSearch();
            }
        }
    });

    $.fn.select2 = function () {

        var args = Array.prototype.slice.call(arguments, 0),
            opts,
            select2,
            value, multiple, allowedMethods = ["val", "destroy", "opened", "open", "close", "focus", "isFocused", "container", "onSortStart", "onSortEnd", "enable", "disable", "positionDropdown", "data"];

        this.each(function () {
            if (args.length === 0 || typeof(args[0]) === "object") {
                opts = args.length === 0 ? {} : $.extend({}, args[0]);
                opts.element = $(this);

                if (opts.element.get(0).tagName.toLowerCase() === "select") {
                    multiple = opts.element.attr("multiple");
                } else {
                    multiple = opts.multiple || false;
                    if ("tags" in opts) {opts.multiple = multiple = true;}
                }

                select2 = multiple ? new MultiSelect2() : new SingleSelect2();
                select2.init(opts);
            } else if (typeof(args[0]) === "string") {

                if (indexOf(args[0], allowedMethods) < 0) {
                    throw "Unknown method: " + args[0];
                }

                value = undefined;
                select2 = $(this).data("select2");
                if (select2 === undefined) return;
                if (args[0] === "container") {
                    value=select2.container;
                } else {
                    value = select2[args[0]].apply(select2, args.slice(1));
                }
                if (value !== undefined) {return false;}
            } else {
                throw "Invalid arguments to select2 plugin: " + args;
            }
        });
        return (value === undefined) ? this : value;
    };

    // plugin defaults, accessible to users
    $.fn.select2.defaults = {
        width: "copy",
        closeOnSelect: true,
        openOnEnter: true,
        containerCss: {},
        dropdownCss: {},
        containerCssClass: "",
        dropdownCssClass: "",
        formatResult: function(result, container, query) {
            var markup=[];
            markMatch(result.text, query.term, markup);
            return markup.join("");
        },
        formatSelection: function (data, container) {
            return data ? data.text : undefined;
        },
        formatResultCssClass: function(data) {return undefined;},
        formatNoMatches: function () { return "No matches found"; },
        formatInputTooShort: function (input, min) { var n = min - input.length; return "Please enter " + n + " more character" + (n == 1? "" : "s"); },
        formatSelectionTooBig: function (limit) { return "You can only select " + limit + " item" + (limit == 1 ? "" : "s"); },
        formatLoadMore: function (pageNumber) { return "Loading more results..."; },
        formatSearching: function () { return "Searching..."; },
        minimumResultsForSearch: 0,
        minimumInputLength: 0,
        maximumSelectionSize: 0,
        id: function (e) { return e.id; },
        matcher: function(term, text) {
            return text.toUpperCase().indexOf(term.toUpperCase()) >= 0;
        },
        separator: ",",
        tokenSeparators: [],
        tokenizer: defaultTokenizer,
        escapeMarkup: function (markup) {
            if (markup && typeof(markup) === "string") {
                return markup.replace(/&/g, "&amp;");
            }
            return markup;
        },
        blurOnChange: false
    };

    // exports
    window.Select2 = {
        query: {
            ajax: ajax,
            local: local,
            tags: tags
        }, util: {
            debounce: debounce,
            markMatch: markMatch
        }, "class": {
            "abstract": AbstractSelect2,
            "single": SingleSelect2,
            "multi": MultiSelect2
        }
    };

}(jQuery));

/**
 * models for cartodb admin
 */

(function() {

  cdb.admin.SQL = function() {
      var username = (this.options && this.options.user_data)? this.options.user_data.username :
        (window.user_data? window.user_data.username : window.user_name);
      var api_key = (this.options && this.options.user_data)? this.options.user_data.api_key :
        (window.user_data? window.user_data.api_key : window.api_key);


      return new cartodb.SQL({
        user: username,
        api_key: api_key,
        sql_api_template: cdb.config.getSqlApiBaseUrl()
      });
  }

  cdb.admin.Column = cdb.core.Model.extend({

    idAttribute: 'name',

    url: function(method) {
      var version = cdb.config.urlVersion('column', method);
      var table = this.table || this.collection.table;
      if(!table) {
        cdb.log.error("column has no table assigned");
      }

      var base = '/api/' + version + '/tables/' + table.get('name') + '/columns/';
      if (this.isNew()) {
        return base;
      }
      return base + this.id;
    },


    initialize: function() {
      this.table = this.get('table');
      if(!this.table) {
        throw "you should specify a table model";
      }
      this.unset('table', { silent: true });
    },

    toJSON: function() {
      var c = _.clone(this.attributes);
      // this hack is created to create new column
      // if you set _name instead name backbone does not get
      // it as idAttribute so launch a POST instead of a PUT
      if(c._name) {
        c.name = c._name;
        delete c._name;
      }
      return c;
    },

  });


  /**
   * contains information about the table, not the data itself
   */
  cdb.admin.CartoDBTableMetadata = cdb.ui.common.TableProperties.extend({

    currentLoading: 0, // class variable (shared). I'm still not sure if this is messy as hell or powerfull as a transformer
    sqlApiClass: cartodb.SQL,

    _TEXTS: {
      columnDeleted: 'Your column has been deleted',
      columnDeleting: 'Deleting your column',
      columnAdded: 'Your column has been added',
      columnAdding: 'Adding new column'
    },

    hiddenColumns: [
      'the_geom',
      'the_geom_webmercator',
      'cartodb_georef_status',
      'created_at',
      'updated_at',
      'cartodb_id'
    ],

    initialize: function() {
      _.bindAll(this, 'notice');
      this.readOnly = false;
      this.bind('change:schema', this._prepareSchema, this);
      this._prepareSchema();
      this.sqlView = null;
      this.synchronization = new cdb.admin.TableSynchronization();
      this.synchronization.linkToTable(this);
      this.synchronization.bind('change:id', function isSyncChanged() {
        this.trigger('change:isSync', this, this.synchronization.isSync());
      }, this);
      if (this.get('no_data_fetch')) {
        this.no_data_fetch = true;
        delete this.attributes.no_data_fetch;
      }
      this.data();
      this.bind('error', function(e, resp) {
        this.error('', resp);
      }, this);
      this._data.bind('error', function(e, resp) {
        this.notice('error loading rows, check your SQL query', 'error', 5000);
      }, this);

      this._data.bind('reset', function() {
        var view = this._data;
        this.set({
          schema: view.schemaFromData(this.get('schema')),
          geometry_types: view.getGeometryTypes()
        });
      }, this);

      this.retrigger('change', this._data, 'data:changed');
      this.retrigger('saved', this._data, 'data:saved');

      this.bind('change:table_visualization', function() {
        this.permission = new cdb.admin.Permission(this.get('table_visualization').permission);
        this.trigger('change:permission', this, this.permission);
      }, this);

      // create permission if permission is set
      this.permission = new cdb.admin.Permission(this.get('permission'));
    },

    url: function(method) {
      var version = cdb.config.urlVersion('table', method);
      var base = '/api/' + version + '/tables';
      if (this.isNew()) {
        return base;
      }
      return base + '/' + this.id;
    },

    // use the name as the id since the api works
    // in the same way to table name and id
    parse: function(resp, xhr) {
      if(resp.name) {
        resp.id = resp.name;
      }
      // move geometry_types to stats one
      // geometry_types from backend are not reliable anymore and it can only be used
      // for non editing stuff (showing icons, general checks on table list)
      resp.stats_geometry_types = resp.geometry_types;
      delete resp.geometry_types;
      delete resp.schema;
      return resp;
    },

    notice: function(msg, type, timeout) {
      this.trigger('notice', msg, type, timeout);
    },

    setReadOnly: function(_) {
      var trigger = false;
      if (this.readOnly !== _) {
        trigger = true;
      }
      this.readOnly = _;
      if (trigger) {
        this.trigger('change:readOnly', this, _);
      }
    },

    isReadOnly: function() {
      return this.readOnly || this.data().isReadOnly() || this.synchronization.isSync();
    },

    isSync: function() {
      return this.synchronization.isSync();
    },

    getUnqualifiedName: function() {
      var name = this.get('name');
      if (!name) return null;
      var tk = name.split('.');
      if (tk.length == 2) {
        return tk[1];
      }
      return name;
    },

    // "user".table -> user.table
    getUnquotedName: function() {
      var name = this.get('name');
      return name && name.replace(/"/g, '');
    },

    sortSchema: function() {
      this.set('schema', cdb.admin.CartoDBTableMetadata.sortSchema(this.get('schema')));
    },

    error: function(msg, resp) {
      var err =  resp && resp.responseText && JSON.parse(resp.responseText).errors[0];
      this.trigger('notice', msg + ": " + err, 'error');
    },

    _prepareSchema: function() {
      var self = this;
      this._columnType = {};

      _(this.get('schema')).each(function(s) {
        self._columnType[s[0]] = s[1];
      });

      if (!this.isInSQLView()) {
        self.set('original_schema', self.get('schema'));
      }
    },

    columnNames: function(sc) {
      sc = sc || 'schema'
      return _(this.get(sc)).pluck(0);
    },

    containsColumn: function(name) {
      return _.contains(this.columnNames(), name);
    },

    columnNamesByType: function(type, sc) {
      sc = sc || 'schema';
      var t = _(this.get(sc)).filter(function(c) {
        return c[1] == type;
      });
      return _(t).pluck(0);
    },

    // return geometry columns calculated backend stats
    // use geomColumnTypes if you need something reliable (but slower and async)
    statsGeomColumnTypes: function(geometryTypes) {
      return this.geomColumnTypes(this.get('stats_geometry_types'))
    },

    // return the current column types in an array
    // the values inside the array can be:
    //  'point', 'line', 'polygon'
    geomColumnTypes: function(geometryTypes) {
      var types = geometryTypes || this.get('geometry_types');
      var geomTypes = [];
      if (!_.isArray(types)) {
        return [];
      }
      var _map = {
        'st_multipolygon': 'polygon',
        'st_polygon': 'polygon',
        'st_multilinestring': 'line',
        'st_linestring': 'line',
        'st_multipoint': 'point',
        'st_point': 'point'
      };
      for(var t in types) {
        var type = types[t];
        // when there are rows with no geo type null is returned as geotype
        if(type) {
          var a = _map[type.toLowerCase()]
          if(a) {
            geomTypes.push(a)
          }
        }
      }
      return _.uniq(geomTypes);
    },

    /**
     *  Adding a new geometry type to the table
     *  @param geom type {st_polygon, st_point,...}
     *  @param set options
     */
    addGeomColumnType: function(t, opts) {
      if(!t) return;
      var types = _.clone(this.get('geometry_types')) || [];
      if(!_.contains(types, t)) {
        types.push(t);

        this.set({
          'geometry_types': types
        }, opts);
      }
    },

    nonReservedColumnNames: function() {

      var self = this;
      return _.filter(this.columnNames(), function(c) {
        return !self.isReservedColumn(c);
      });
    },

    columnTypes: function() {
      return _.clone(this._columnType);
    },

    _getColumn: function(columnName) {
      if(this._columnType[columnName] === undefined) {
        return
        // throw "the column does not exists";
      }
      var c = new cdb.admin.Column({
        table: this,
        name: columnName,
        type: this._columnType[columnName]
      });
      return c;
    },

    getColumnType: function(columnName, sc) {
      sc = sc || 'schema';
      var t = _(this.get(sc)).filter(function(c) {
        return c[0] == columnName;
      });
      if(t.length > 0)
        return t[0][1];
      return;
    },

    addColumn: function(columnName, columnType, opts) {
      var self = this;
      var c = new cdb.admin.Column({
        table: this,
        _name: columnName,
        type: columnType || 'string'
      });
      this.notice(self._TEXTS.columnAdding, 'load', 0);
      c.save(null, {
          success: function(mdl, obj) {
            self.notice(self._TEXTS.columnAdded, 'info');
            self.trigger('columnAdd', columnName);
            self.data().fetch();
            opts && opts.success && opts.success(mdl,obj);
          },
          error: function(e, resp) {
            self.error('error adding column', resp);
            opts && opts.error && opts.error(e);
          },
          wait: true
      });
    },

    deleteColumn: function(columnName, opts) {
      var self = this;
      var c = this._getColumn(columnName);
      if (c !== undefined) {
        this.notice(self._TEXTS.columnDeleting, 'load', 0);
        c.destroy({
            success: function() {
              self.trigger('columnDelete', columnName);
              self.notice(self._TEXTS.columnDeleted, 'info');
              self.data().fetch();
              opts && opts.success && opts.success();
            },
            error: function(e, resp) {
              self.error('error deleting column', resp);
              opts && opts.error && opts.error();
            },
            wait: true
        });
      }
    },

    renameColumn: function(columnName, newName, opts) {
      if(columnName == newName) return;
      var self = this;
      var c = this._getColumn(columnName);
      var oldName = c.get('name');
      c.set({
        new_name: newName,
        old_name: c.get('name')
      });
      this.notice('renaming column', 'load', 0);
      c.save(null,  {
          success: function(mdl, data) {
            self.notice('Column has been renamed', 'info');
            self.trigger('columnRename', newName, oldName);
            self.data().fetch();
            opts && opts.success && opts.success(mdl, data);
          },
          error: function(e, resp) {
            cdb.log.error("can't rename column");
            self.error('error renaming column', resp);
            opts && opts.error && opts.error(e, resp);
          },
          wait: true
      });
    },

    isTypeChangeAllowed: function(columnName, newType) {
      var deactivateMatrix = {
        'number': ['date'],
        'boolean': ['date'],
        'date': ['boolean']
      };
      var c = this._getColumn(columnName);
      if (!c) {
        return true;
      }
      var type = c.get('type');
      var deactivated = deactivateMatrix[type] || [];
      deactivated = deactivated.concat([type])
      return !_.contains(deactivated, newType);
    },

    isTypeChangeDestructive: function(columnName, newType) {
      var columnType = this.getColumnType(columnName);

      var destructiveMatrix = {
        "string": {
          "string": false,
          "number": true,
          "date": true,
          "boolean": true,
        },
        "number": {
          "string": false,
          "number": false,
          "date": true,
          "boolean": true,
        },
        "date": {
          "string": false,
          "number": true,
          "date": false,
          "boolean": true,
        },
        "boolean": {
          "string": false,
          "number": false,
          "date": true,
          "boolean": false,
        },
      }
      return destructiveMatrix[columnType][newType]
    },

    changeColumnType: function(columnName, newType, opts) {
      var self = this;
      var c = this._getColumn(columnName);

      if(this.getColumnType(columnName) == newType) {
        opts && opts.success && opts.success();
        return;
      }
      this.saveNewColumnType(c, newType, opts);
    },

    saveNewColumnType: function(column, newType, opts) {
      var self = this;
      column.set({ type: newType});
      this.notice('Changing column type', 'load', 0);
      column.save(null, {
          success: function() {
            self.notice('Column type has been changed', 'info');
            self.trigger('typeChanged', newType); // to make it testable
            self.data().fetch();
            opts && opts.success && opts.success();
          },
          error: function(e, resp) {
            self.trigger('typeChangeFailed', newType, e); // to make it testable
            self.error('error changing column type', resp);
            opts && opts.error && opts.error(e, resp);
          },
          wait: true
      });
    },

    /**
     * returns the original data for the table not the current applied view
     */
    originalData: function() {
      return this._data;
    },

    data: function() {
      var self = this;
      if(this._data === undefined) {
        this._data = new cdb.admin.CartoDBTableData(null, {
          table: this
        });
        this.bindData();
      }
      if(this.sqlView) {
        return this.sqlView;
      }
      return this._data;
    },

    bindData: function(data) {
      var self = this;
      if(this._data && !this._data.bindedReset) {

        this.retrigger('reset', this._data, 'dataLoaded');
        this.retrigger('add', this._data, 'dataAdded');
        this._data.bindedReset = true;

      }
      if(this.sqlView && !this.sqlView.bindedReset) {
        this.retrigger('reset', this.sqlView, 'dataLoaded');
        this.retrigger('add', this.sqlView, 'dataAdded');
        this.sqlView.bindedReset = true;
      }

    },

    useSQLView: function(view, options) {
      if (!view && !this.sqlView) return;
      options = options || {};
      var self = this;
      var data = this.data();

      if(this.sqlView) {
        this.sqlView.unbind(null, null, this);
        this.sqlView.unbind(null, null, this._data);
      }

      // reset previous
      if(!view && this.sqlView) {
        this.sqlView.table = null;
      }

      this.sqlView = view;
      this.bindData();

      if(view) {
        view.bind('reset', function() {
          if(!view.modify_rows) {
            this.set({
              schema: view.schemaFromData(this.get('schema')),
              geometry_types: view.getGeometryTypes()
            });
          }
        }, this);
        // listen for errors
        view.bind('error', function(e, resp) {
          this.notice('error loading rows, check your SQL query', 'error', 5000);
        }, this);

        view.bind('loading', function() {
          //this.notice(_t('loading query'), 'load', 0);
        }, this);

        view.bind('reset loaded', function() {
          if(view.modify_rows) {
            this.notice(view.affected_rows + ' rows affected');
            this.useSQLView(null);
          } else {
            this.notice(_t('loaded'));
          }
        }, this);

        // swicth source data
        this.dataModel = this.sqlView;
        view.table = this;
      } else {
        this.dataModel = this._data;
        // get the original schema
        self.set({
          'schema': self.get('original_schema')
        });///*, { silent: true });
        self.data().fetch();
      }
      this.trigger('change:dataSource', this.dataModel, this);
    },

    isInSQLView: function() {
      return this.sqlView ? true: false;
    },

    /**
     * replace fetch functionally to add some extra call for logging
     * it can be used in the same way fetch is
     */
    fetch: function(opts) {
      var self = this;
      silent = opts? opts.silent : false;
      if(!silent) {
        this.notice('loading table', 'load', this, 0, 0);
      }
      var xhr = this.elder('fetch', opts)
      $.when(xhr).done(function() {
        opts && opts.success && opts.success.old_success && opts.success.old_success();
        if(!silent) {
          self.notice('loaded');
        }
      }).fail(function(){
        if(!silent) {
          self.notice('error loading the table');
        }
      });
      return xhr;

    },

    isReservedColumn: function(c) {
      return cdb.admin.Row.isReservedColumn(c);
    },

    /**
     * when a table is linked to a infowindow each time a column
     * is renamed or removed the table pings to infowindow to remove
     * or rename the fields
     */
    linkToInfowindow: function(infowindow) {
      var self = this;
      this.bind('columnRename', function(newName, oldName) {
        if(infowindow.containsField(oldName)) {
          infowindow.removeField(oldName);
          infowindow.addField(newName);
        }
      }, infowindow);
      this.bind('columnDelete', function(oldName, newName) {
        infowindow.removeField(oldName);
      }, infowindow);

      this.bind('change:schema', function() {
        var self = this;
        var columns = _(this.columnNames()).filter(function(c) {
          return !_.contains(infowindow.SYSTEM_COLUMNS, c);
        });

        function _hash(str){
            var hash = 0, c;
            for (i = 0; i < str.length; i++) {
                c = str.charCodeAt(i);
                hash = c + (hash << 6) + (hash << 16) - hash;
            }
            return hash;
        }

        if (this.isInSQLView()) {
          if (!infowindow.has('defaul_schema_fields')) {
            infowindow.saveFields('defaul_schema_fields');
          }
          var current_schema_key = 'schema_' + _hash(self.columnNames().sort().join(''));
          var previous_schema_key = 'schema_' + _hash(
            _(self.previous('schema')).pluck(0).sort().join('')
          );

          if(!infowindow.has(previous_schema_key)) {
            infowindow.saveFields(previous_schema_key);
          }
          if(infowindow.has(current_schema_key)) {
            infowindow.restoreFields(null, current_schema_key);
          }
        } else {
          infowindow.restoreFields(null, 'defaul_schema_fields');
        }

        if (infowindow.get('template')) {
          // merge fields checking actual schema
          infowindow.mergeFields(columns);
        } else {
          // remove fields that no longer exist
          infowindow.removeMissingFields(columns);
        }
      }, this);

    },

    embedURL: function() {
      return "/tables/" + this.get('name') + "/embed_map"
    },

    /**
     * @deprecated use vis.viewUrl() or vis.viewUrl(currentUser) instead.
     */
    viewUrl: function() {
      return cdb.config.prefixUrl() + "/tables/" + this.getUnqualifiedName()
    },

    hasTheGeom: function() {
      var currentSchema = this.get('schema');
      // if we have "the_geom" in our current schema, returnstrue
      for(var n in currentSchema) {
        if(currentSchema[n][0] === 'the_geom') {
          return true;
        }
      }
      return false;
    },

    /**
     * Checks the server to see if the table has any georeferenced row, independently of the applyed query
     * @return {promise}
     */
    fetchGeoreferenceStatus: function() {
      var dfd = $.Deferred();
      var username = (this.options && this.options.user_data)? this.options.user_data.username :
        (window.user_data? window.user_data.username : window.user_name);
      var api_key = (this.options && this.options.user_data)? this.options.user_data.api_key :
        (window.user_data? window.user_data.api_key : window.api_key);


      this.sqlApi = new this.sqlApiClass({
        user: username,
        version: 'v1',
        api_key: api_key,
        sql_api_template: cdb.config.getSqlApiBaseUrl()
      });

      var sql = 'SELECT the_geom FROM ' + this.get('name') + ' WHERE the_geom is not null';
      this.sqlApi.execute(sql).done(function(data){
        if(data.rows.length > 0) {
          dfd.resolve(true);
        } else {
          dfd.resolve(false);
        }
      });

      return dfd.promise();

    },

    /**
     * Checks the current loaded records to see if they are georeferenced
     * @return {boolean}
     */
    isGeoreferenced: function() {
      var geoColumns = this.geomColumnTypes();
      if(geoColumns && geoColumns.length > 0) {
        return true;
      } else {
        if (!this.isInSQLView()) {
          // sometimes the columns are changed in the frontend site
          // and the geocolumns are not updated.
          // check the columns in local
          return this._data.any(function(row) {
            return row.hasGeometry();
          });
        }
      }
      return false;
    },

    /**
     * this function can only be called during change event
     * returns true if the geometry type has changed
     * for this method multipolygon and polygon are the same geometry type
     */
    geometryTypeChanged: function() {
      if (!('geometry_types' in this.changed)) return false;
      var geoTypes = this.get('geometry_types')
      var prevGeoTypes = this.previousAttributes().geometry_types;
      function normalize(e) {
        e = e.toLowerCase();
        if (e === 'st_multipolygon') {
          return 'st_polygon'
        }
        if (e === 'st_multilinestring') {
          return 'st_linestring'
        }
        if (e === 'st_multipoint') {
          return 'st_point'
        }
        return e;
      }

      if(!geoTypes ||
        geoTypes.length === 0 ||
        !prevGeoTypes ||
        prevGeoTypes.length === 0) {
        return true;
      }

      var n = normalize(geoTypes[0]);
      var o = normalize(prevGeoTypes[0]);
      return n !== o;
    },

    /**
     * Get necessary data create a duplicated dataset from this table.
     *
     * @param {Object} newName name of new dataset.
     * @param {Object} callbacks
     * @returns {Object}
     */
    duplicate: function(newName, callbacks) {
      callbacks = callbacks || {};

      // Extracted from duplicate_table_dialog
      var data = {
        table_name: newName
      };

      // Set correct data object, depending on if the app has a query applied or not
      if (this.isInSQLView()) {
        var query = this.data().getSQL();
        data.sql = ( !query || query == "" ) ? 'SELECT * FROM ' + cdb.Utils.safeTableNameQuoting(this.get('name')) : query;
      } else {
        data.table_copy = this.get('name');
      }

      var importModel = new cdb.admin.Import();
      importModel.save(data, {
        error: callbacks.error,
        success: function(model, changes) {
          var checkImportModel = new cdb.admin.Import({
            item_queue_id: changes.item_queue_id
          });

          checkImportModel.bind('importComplete', function() {
            checkImportModel.unbind();

            // So import is done, create new table object from the new table and fetch, callback once finished.
            var newTable = new cdb.admin.CartoDBTableMetadata({
              id: checkImportModel.get('table_id')
            });

            newTable.fetch({
              success: function() {
                callbacks.success(newTable);
              },
              error: callbacks.error
            });
          });

          checkImportModel.bind('importError', function() {
            checkImportModel.unbind();
            callbacks.error.apply(this, arguments);
          });

          checkImportModel.pollCheck();
        }
      });
    },

    /**
     * Get the visualizations that are using this table dataset.
     * Note! a .fetch() is required to be sure the data to be available.
     * @return {Array}
     */
    dependentVisualizations: function() {
      // dependent = visualizations with a single layer
      // non-dependant = have more than this dataset as a layer
      return _.chain(this.get('dependent_visualizations'))
        .union(this.get('non_dependent_visualizations'))
        .compact()
        .value() || [];
    }

  }, {
    /**
     * creates a new table from query
     * the called is responsable of calling save to create
     * the table in the server
     */
    createFromQuery: function(name, query) {
      return new cdb.admin.CartoDBTableMetadata({
        sql: query,
        name: name
      });
    },

    sortSchema: function(schema) {
      var priorities = {
        'cartodb_id': 1,
        'the_geom': 2,
        '__default__': 3,
        'created_at': 4,
        'updated_at': 5
      };

      function priority(v) {
        return priorities[v] || priorities['__default__'];
      }

      return _.chain(schema)
        .clone()
        .sort(function(a, b) { // ..and then re-sort by priorities defined above
          var prioA = priority(a[0]);
          var prioB = priority(b[0]);
          if (prioA < prioB) {
            return -1;
          } else if (prioA > prioB) {
            return 1;
          } else { //priority is the same (i.e. __default__), so compare alphabetically
            return a[0] < b[0] ? -1 : 1;
          }
        })
        .value();
    },

    /**
     * return true if the sql query alters table schema in some way
     */
    alterTable: function(sql) {
      sql = sql.trim();
      return sql.search(/alter\s+[\w\."]+\s+/i) !== -1   ||
             sql.search(/drop\s+[\w\.\"]+/i)  !== -1  ||
             sql.search(/^vacuum\s+[\w\.\"]+/i)  !== -1 ||
             sql.search(/^create\s+[\w\.\"]+/i)  !== -1 ||
             sql.search(/^reindex\s+[\w\.\"]+/i)  !== -1 ||
             sql.search(/^grant\s+[\w\.\"]+/i)  !== -1 ||
             sql.search(/^revoke\s+[\w\.\"]+/i)  !== -1 ||
             sql.search(/^cluster\s+[\w\.\"]+/i)  !== -1 ||
             sql.search(/^comment\s+on\s+[\w\.\"]+/i)  !== -1 ||
             sql.search(/^explain\s+[\w\.\"]+/i)  !== -1;
    },

    /**
     * return true if the sql query alters table data
     */
    alterTableData: function(sql) {
      return this.alterTable(sql)       ||
             sql.search(/^refresh\s+materialized\s+view\s+[\w\.\"]+/i)  !== -1 ||
             sql.search(/^truncate\s+[\w\.\"]+/i)  !== -1 ||
             sql.search(/insert\s+into/i) !== -1  ||
             sql.search(/update\s+[\w\.\-"]+\s+.*set/i) !== -1  ||
             sql.search(/delete\s+from/i) !== -1;
    }

  });

  cdb.admin.Row = cdb.core.Model.extend({

    _CREATED_EVENT: 'created',
    _CREATED_EVENT: 'creating',
    sqlApiClass: cartodb.SQL,

    _GEOMETRY_TYPES: {
      'point': 'st_point',
      'multipoint': 'st_multipoint',
      'linestring': 'st_linestring',
      'multilinestring': 'st_multilinestring',
      'polygon': 'st_polygon',
      'multipolygon': 'st_multipolygon'
    },

    url: function(method) {
      var version = cdb.config.urlVersion('record', method);
      var table = this.table || this.collection.table;
      if(!table) {
        cdb.log.error("row has no table assigned");
      }

      var base = '/api/' + version + '/tables/' + table.get('name') + '/records/';
      if (this.isNew()) {
        return base;
      }
      return base + this.id;
    },

    fetch: function(opts) {
      opts = opts || {}
      var self = this;
      var silent = opts && opts.silent;
      var username = (this.options && this.options.user_data)? this.options.user_data.username :
        (window.user_data? window.user_data.username : window.user_name);
      var api_key = (this.options && this.options.user_data)? this.options.user_data.api_key :
        (window.user_data? window.user_data.api_key : window.api_key);

      var table = this.table || this.collection.table;

      var sqlApi = new this.sqlApiClass({
        user: username,
        version: 'v2',
        api_key: api_key,
        sql_api_template: cdb.config.getSqlApiBaseUrl(),
        extra_params: ['skipfields']
      });
      // this.trigger('loading')
      var sql = null;
      var columns = table.columnNames()
      if (opts.no_geom) {
        columns = _.without(columns, 'the_geom', 'the_geom_webmercator');
      } else {
        columns = _.without(columns, 'the_geom');
      }
      sql = 'SELECT ' + columns.join(',') + " "
      if(table.containsColumn('the_geom') && !opts.no_geom) {
        sql += ',ST_AsGeoJSON(the_geom, 8) as the_geom '
      }
      sql += ' from (' + table.data().getSQL() + ') _table_sql WHERE cartodb_id = ' + this.get('cartodb_id');
      // Added opts to sql execute function to apply
      // parameters ( like cache ) to the ajax request
      if (opts.no_geom) {
        opts.skipfields = 'the_geom,the_geom_webmercator';
      } else {
        opts.skipfields = 'the_geom_webmercator';
      }
      sqlApi.execute(sql, {}, opts).done(function(data){
        if(self.parse(data.rows[0])) {
          self.set(data.rows[0]);//, {silent: silent});
          self.trigger('sync');
        }
      });

    },

    toJSON: function() {
      var attr = _.clone(this.attributes);
      // remove read-only attributes
      delete attr['updated_at'];
      delete attr['created_at'];
      delete attr['the_geom_webmercator'];
      if(!this.isGeometryGeoJSON()) {
        delete attr['the_geom'];
      }
      return attr;
    },

    isGeomLoaded: function() {
      var geojson = this.get('the_geom');
      var column_types_WKT = cdb.admin.WKT.types
      return  (geojson !== 'GeoJSON' && geojson !== -1 && !_.contains(column_types_WKT, geojson));
    },

    hasGeometry: function() {
      var the_geom = this.get('the_geom');
      return !!(the_geom != null && the_geom != undefined && the_geom != '')
      // in fact, if the_geom has anything but null or '', the row is georeferenced

      // if(typeof the_geom === 'string') {
      //   // if the geom contains GeoJSON, the row has a valid geometry, but is not loaded yet
      //   if(the_geom === 'GeoJSON')  {
      //     return true
      //   }

      //   try {
      //     var g = JSON.parse(the_geom);
      //     return !!g.coordinates;
      //   } catch(e) {
      //     return false;
      //   }
      // } else {
      //   if(the_geom) {
      //     return !!the_geom.coordinates;
      //   }
      //   return false;
      // }
    },
    /**
     * Checks if the_geom contains a valid geoJson
     */
    isGeometryGeoJSON: function() {
      var the_geom = this.get('the_geom');
      if(the_geom && typeof the_geom === 'object') {
        return !!the_geom.coordinates;
      } else if(typeof the_geom !== 'string') {
        return false;
      }
      // if the geom contains GeoJSON, the row has a valid geometry, but is not loaded yet
      if(the_geom === 'GeoJSON')  {
        return true
      }

      try {
        var g = JSON.parse(the_geom);
        return !!g.coordinates;
      } catch(e) {
        return false;
      }

      return false;

    },

    getFeatureType: function() {
      if (this.isGeomLoaded()) {
        // Problem geometry type from a WKB format
        // Not possible for the moment
        try {
          var geojson = JSON.parse(this.get('the_geom'));
          return geojson.type.toLowerCase();
        } catch(e) {
          cdb.log.info("Not possible to parse geometry type");
        }
      }
      return null;
    },

    getGeomType: function() {
      try {
        return this._GEOMETRY_TYPES[this.getFeatureType()];
      } catch(e) {
        cdb.log.info("Not possible to parse geometry type");
      }
    }

  }, {
    RESERVED_COLUMNS: 'the_geom the_geom_webmercator cartodb_id created_at updated_at'.split(' '),
    isReservedColumn: function(c) {
      return _(cdb.admin.Row.RESERVED_COLUMNS).indexOf(c) !== -1;
    }
  });

})();

cdb.admin.CartoDBTableData = cdb.ui.common.TableData.extend({
  _ADDED_ROW_TEXT: 'Row added correctly',
  _ADDING_ROW_TEXT: 'Adding a new row',
  _GEOMETRY_UPDATED: 'Table geometry updated',

  model: cdb.admin.Row,

  initialize: function(models, options) {
    var self = this;
    this.table = options ? options.table: null;
    this.model.prototype.idAttribute = 'cartodb_id';
    this.initOptions();
    this.filter = null;
    this._fetching = false;
    this.pages = [];
    this.lastPage = false;
    this.bind('newPage', this.newPage, this);
    this.bind('reset', function() {
      var pages = Math.floor(this.size()/this.options.get('rows_per_page'))
      this.pages = [];

      for(var i = 0; i < pages; ++i) {
        this.pages.push(i);
      }
    }, this);

    if(this.table) {
      this.bind('add change:the_geom', function(row) {
        var gt = this.table.get('geometry_types')
        if(gt && gt.length > 0) return;
        if(row.get('the_geom')) {
          // we set it to silent because a change in geometry_types
          // raises rendering and column feching
          this.table.addGeomColumnType(row.getGeomType());
        }
      }, this);
    }
    this.elder('initialize');
  },

  initOptions: function() {
    var self = this;
    this.options = new cdb.core.Model({
      rows_per_page:40,
      page: 0,
      sort_order: 'asc',
      order_by: 'cartodb_id',
      filter_column: '',
      filter_value: ''
    });
    this.options.bind('change', function() {
      if(self._fetching) {
        return;
      }
      self._fetching = true;
      opt = {};
      var previous = this.options.previous('page');

      if(this.options.hasChanged('page')) {
        opt.add = true;
        opt.changingPage = true;
        // if user is going backwards insert new rows at the top
        if(previous > this.options.get('page')) {
          opt.at = 0;
        }
      } else {
        if(this.options.hasChanged('mode')) {
          this.options.set({
            'page': 0
          }, { silent: true });
        }
      }

      opt.success = function(_coll, resp) {
        self.trigger('loaded');
        if(resp.rows && resp.rows.length !== 0) {
          if(opt.changingPage) {
            self.trigger('newPage', self.options.get('page'), opt.at === 0? 'up': 'down');
          }
        } else {
          // no data so do not change the page
          self.options.set({page: previous});//, { silent: true });
        }
        self.trigger('endLoadingRows', self.options.get('page'), opt.at === 0? 'up': 'down');
        self._fetching = false;
      };

      opt.error = function() {
        cdb.log.error("there was some problem fetching rows");
        self.trigger('endLoadingRows');
        self._fetching = false;
      };

      self.trigger('loadingRows', opt.at === 0 ? 'up': 'down');
      this.fetch(opt);

    }, this);
  },

  parse: function(d) {
    // when the query modifies the data modified flag is true
    // TODO: change this when SQL API was able to say if a
    // query modify some data
    // HACK, it will fail if using returning sql statement
    this.modify_rows = d.rows.length === 0 && _.size(d.fields) === 0;
    this.affected_rows = d.affected_rows;
    this.lastPage = false;
    if(d.rows.length < this.options.get('rows_per_page')) {
      this.lastPage = true;
    }
    return d.rows;
  },

  // given fields array as they come from SQL create a map name -> type
  _schemaFromQueryFields: function(fields) {
    var sc = {};
    for(k in fields) {
      sc[k] = fields[k].type;
    }
    return sc;
  },

  _createUrlOptions: function(filter) {
    var attr;
    if (filter) {
      var a = {}
      for (var k in this.options.attributes) {
        if (filter(k)) {
          a[k] = this.options.attributes[k];
        }
      }
      attr = _(a);
    } else {
      attr = _(this.options.attributes);
    }
    var params = attr.map(function(v, k) {
      return k + "=" + encodeURIComponent(v);
    }).join('&');
    params += "&api_key=" + cdb.config.get('api_key');
    return params;
  },

  _geometryColumnSQL: function(c) {
      return [
        "CASE",
        "WHEN GeometryType(" + c + ") = 'POINT' THEN",
          "ST_AsGeoJSON(" + c + ",8)",
        "WHEN (" + c + " IS NULL) THEN",
          "NULL",
        "ELSE",
          "GeometryType(" + c + ")",
        "END " + c
      ].join(' ');
  },

  // return wrapped SQL removing the_geom and the_geom_webmercator
  // to avoid fetching those columns.
  // So for a sql like
  // select * from table the returned value is
  // select column1, column2, column3... from table
  wrappedSQL: function(schema, exclude, fetchGeometry) {
    var self = this;
    exclude = exclude || ['the_geom_webmercator'];
    schema = _.clone(schema);

    var select_columns = _.chain(schema).omit(exclude).map(function(v, k) {
      if (v === 'geometry') {
        if(fetchGeometry) {
          return "st_astext(\"" + k + "\") " + "as " + k
        }
        return self._geometryColumnSQL(k);
      }
      return '"' + k + '"';
    }).value();

    select_columns = select_columns.join(',');

    var mode = this.options.get('sort_order') === 'desc' ? 'desc': 'asc';

    var q = "select " + select_columns + " from (" + this.getSQL() + ") __wrapped";
    var order_by = this.options.get('order_by');
    if (order_by && order_by.length > 0) {
      q += " order by " + order_by + " " + mode;
    }
    return q;

  },

  url: function() {
    return this.sqlApiUrl();
  },

  /**
  * we need to override sync to avoid the sql request to be sent by GET.
  * For security reasons, we need them to be send as a PUT request.
  * @method sync
  * @param method {'save' || 'read' || 'delete' || 'create'}
  * @param model {Object}
  * @param options {Object}
  */
  sync: function(method, model, options) {
    if(!options) { options = {}; }
    options.data = this._createUrlOptions(function(d) {
      return d !== 'sql';
    });

    if (cdb.admin.CartoDBTableMetadata.alterTableData(this.options.get('sql') || '')) {
      options.data += "&q=" + encodeURIComponent(this.options.get('sql'));
      options.type = 'POST';
    } else {
      // when a geometry can be lazy fetched, don't fetch it
      var fetchGeometry = 'cartodb_id' in this.query_schema;
      options.data += "&q=" + encodeURIComponent(this.wrappedSQL(this.query_schema, [], !fetchGeometry));

      if (options.data.length > 2048) {
        options.type = 'POST';
      }
    }

    return Backbone.sync.call(this, method, this, options);
  },

  sqlApiUrl: function() {
    return cdb.config.getSqlApiUrl();
  },

  setOptions: function(opt) {
    this.options.set(opt);
  },

  // Refresh all table data
  refresh: function() {
    this.fetch();
  },

  isFetchingPage: function() {
    return this._fetching;
  },

  loadPageAtTop: function() {

    if(!this._fetching) {
      var first = this.pages[0];

      if(first > 0) {
        this.options.set('page', first - 1);
      }
    }
  },

  loadPageAtBottom: function() {
    if(!this._fetching) {
      var last = this.pages[this.pages.length - 1];

      if(!this.lastPage) {
        this.options.set('page', last + 1);
      }
    }
  },

  /**
   * called when a new page is loaded
   * removes the models to max
   */
  newPage: function(currentPage, direction) {
    if(this.pages.indexOf(currentPage) < 0) {
      this.pages.push(currentPage);
    };
     this.pages.sort(function(a, b) {
      return Number(a) > Number(b);
     });
     // remove blocks if there are more rows than allowed
     var rowspp = this.options.get('rows_per_page');
     var max_items = rowspp*4;
     if(this.size() > max_items) {
       if(direction == 'up') {
         // remove page from the bottom (the user is going up)
         this.pages.pop();
         this.remove(this.models.slice(max_items, this.size()));
       } else {
         // remove page from the top (the user is going down)
         this.pages.shift();
         this.remove(this.models.slice(0, rowspp));
       }
     }
  },

  /*setPage: function(p) {
    if(!this._fetching && p >= 0) {
      this.setOptions({page: p});
    }
  },

  getPage: function(p) {
    return this.options.get('page');
  },*/
  addRow: function(opts) {
    var self = this;
    this.table.notice(self._ADDING_ROW_TEXT, 'load', 0)
    var self = this;
    opts = opts || {};
    _.extend(opts, {
      wait: true,
      success: function() {
        self.table.notice(self._ADDED_ROW_TEXT)
      },
      error: function(e, resp) {
        //TODO: notice user
        self.table.error(self._ADDING_ROW_TEXT, resp);
      }
    });
    return this.create(null, opts);
  },

  /**
   * creates a new row model in local, it is NOT serialized to the server
   */
  newRow: function(attrs) {
    r = new cdb.admin.Row(attrs);
    r.table = this.table;
    r.bind('saved', function _saved() {
      if(r.table.data().length == 0) {
        r.table.data().fetch();
        r.unbind('saved', _saved, r.table);
      }
    }, r.table);
    return r;
  },

  /**
   * return a model row
   */
  getRow: function(id, options) {
    options = options || {};
    var r = this.get(id);
    if(!r) {
      r = new cdb.admin.Row({cartodb_id: id});
    }
    if(!options.no_add) {
      this.table._data.add(r);
    }
    r.table = this.table;
    return r;
  },

  getRowAt: function(index) {
    var r = this.at(index);
    r.table = this.table;
    return r;
  },

  deleteRow: function(row_id) {
  },

  isReadOnly: function() {
    return false;
  },

  quartiles: function(nslots, column, callback, error) {
    var tmpl = _.template('select quartile, max(<%= column %>) as maxamount from (select <%= column %>, ntile(<%= slots %>) over (order by <%= column %>) as quartile from (<%= sql %>) _table_sql where <%= column %> is not null) x group by quartile order by quartile');
    this._sqlQuery(tmpl({
      slots: nslots,
      sql: this.getSQL(),
      column: column
    }),
    function(data) {
      callback(_(data.rows).pluck('maxamount'));
    },
    error);
  },

  equalInterval: function(nslots, column, callback, error) {
    var tmpl = _.template(' \
      with params as (select min(a), max(a) from ( select <%= column %> as a from (<%= sql %>) _table_sql where <%= column %> is not null ) as foo ) \
      select (max-min)/<%= slots %> as s, min, max from params'
    );
    this._sqlQuery(tmpl({
      slots: nslots,
      sql: this.getSQL(),
      column: column
    }),
    function(data) {
      var min = data.rows[0].min;
      var max = data.rows[0].max;
      var range = data.rows[0].s;
      var values = [];

      for (var i = 1, l = nslots; i < l; i++) {
        values.push((range*i) + min);
      }

      // Add last value
      values.push(max);
      // Callback
      callback(values);
    },
    error);
  },

  _quantificationMethod: function(functionName, nslots, column, distinct, callback, error) {
    var tmpl = _.template('select unnest(<%= functionName %>(array_agg(<%= simplify_fn %>((<%= column %>::numeric))), <%= slots %>)) as buckets from (<%= sql %>) _table_sql where <%= column %> is not null');
    this._sqlQuery(tmpl({
      slots: nslots,
      sql: this.getSQL(),
      column: column,
      functionName: functionName,
      simplify_fn: 'distinct'
    }),
    function(data) {
      callback(_(data.rows).pluck('buckets'));
    },
    error);
  },

  discreteHistogram: function(nbuckets, column, callback, error) {

    var query = 'SELECT DISTINCT(<%= column %>) AS bucket, count(*) AS value FROM (<%= sql %>) _table_sql GROUP BY <%= column %> ORDER BY value DESC LIMIT <%= nbuckets %> + 1';

    var sql = _.template( query, {
      column: column,
      nbuckets: nbuckets,
      sql: this.getSQL(),
    });

    this._sqlQuery(sql, function(data) {

      var count = data.rows.length;
      var reached_limit = false;

      if (count > nbuckets) {
        data.rows = data.rows.slice(0, nbuckets);
        reached_limit = true;
      }

      callback({ rows: data.rows, reached_limit: reached_limit });

    });

  },

  date_histogram: function(nbuckets, column, callback, error) {

    column = "EXTRACT(EPOCH FROM " + column + "::TIMESTAMP WITH TIME ZONE )";

    var tmpl = _.template(
    'with bounds as ( ' +
     'SELECT  ' +
      'current_timestamp as tz, ' +
      'min(<%= column %>) as lower,  ' +
      'max(<%= column %>) as upper,  ' +
      '(max(<%= column %>) - min(<%= column %>)) as span,  ' +
      'CASE WHEN ABS((max(<%= column %>) - min(<%= column %>))/<%= nbuckets %>) <= 0 THEN 1 ELSE GREATEST(1.0, pow(10,ceil(log((max(<%= column %>) - min(<%= column %>))/<%= nbuckets %>)))) END as bucket_size ' +
      'FROM  (<%= sql %>) _table_sql ' +
    ')  ' +
    'select array_agg(v) val, array_agg(bucket) buckets, tz, bounds.upper, bounds.lower, bounds.span, bounds.bucket_size from ' +
    '( ' +
    'select  ' +
      'count(<%= column %>) as v,   ' +
      'round((<%= column %> - bounds.lower)/bounds.bucket_size) as bucket  ' +
       'from (<%= sql %>) _table_sql, bounds  ' +
       'where <%= column %> is not null ' +
       'group by bucket order by bucket ' +
    ') a, bounds ' +
     'group by ' +
    'bounds.upper, bounds.lower, bounds.span, bounds.bucket_size, bounds.tz ');

    // transform array_agg from postgres to a js array
    function agg_array(a) {
      return a.map(function(v) { return parseFloat(v) });
    }

    this._sqlQuery(tmpl({
      nbuckets: nbuckets,
      sql: this.getSQL(),
      column: column
    }),

    function(data) {

      if (!data.rows || data.rows.length === 0) {
        callback(null, null);
        return;
      }

      var data     = data.rows[0];
      data.val     = agg_array(data.val);
      data.buckets = agg_array(data.buckets);

      var hist   = [];
      var bounds = {};

      // create a sorted array and normalize
      var upper = data.upper;
      var lower = data.lower;
      var span  = data.span;
      var tz    = data.tz;
      var bucket_size = data.bucket_size
      var max, min;

      max = data.val[0];

      for (var r = 0; r < data.buckets.length; ++r) {
        var b = data.buckets[r];
        var v = hist[b] = data.val[r];
        max = Math.max(max, v);
      }

      //var maxBucket = _.max(data.buckets)
      for (var i = 0; i < hist.length; ++i) {
        if (hist[i] === undefined) {
          hist[i] = 0;
        } else {
          hist[i] = hist[i]/max;
        }
      }

      bounds.upper       = parseFloat(upper);
      bounds.lower       = parseFloat(lower);
      bounds.bucket_size = parseFloat(bucket_size)
      bounds.tz          = tz;

      callback(hist, bounds);

    },

    error);
  },

  histogram: function(nbuckets, column, callback, error) {

    var tmpl = _.template(
    'with bounds as ( ' +
     'SELECT  ' +
      'min(<%= column %>) as lower,  ' +
      'max(<%= column %>) as upper,  ' +
      '(max(<%= column %>) - min(<%= column %>)) as span,  ' +
      'CASE WHEN ABS((max(<%= column %>) - min(<%= column %>))/<%= nbuckets %>) <= 0 THEN 1 ELSE GREATEST(1.0, pow(10,ceil(log((max(<%= column %>) - min(<%= column %>))/<%= nbuckets %>)))) END as bucket_size ' +
      'FROM  (<%= sql %>) _table_sql  ' +
    ')  ' +
    'select array_agg(v) val, array_agg(bucket) buckets, bounds.upper, bounds.lower, bounds.span, bounds.bucket_size from ' +
    '( ' +
    'select  ' +
      'count(<%= column %>) as v,   ' +
      'round((<%= column %> - bounds.lower)/bounds.bucket_size) as bucket  ' +
       'from (<%= sql %>) _table_sql, bounds  ' +
       'where <%= column %> is not null ' +
       'group by bucket order by bucket ' +
    ') a, bounds ' +
     'group by ' +
    'bounds.upper, ' +
    'bounds.lower, bounds.span, bounds.bucket_size ');

    // transform array_agg from postgres to a js array
    function agg_array(a) {
      return a.map(function(v) { return parseFloat(v) });
      //return JSON.parse(a.replace('{', '[').replace('}', ']'))
    }

    this._sqlQuery(tmpl({
      nbuckets: nbuckets,
      sql: this.getSQL(),
      column: column
    }),

    function(data) {

      if(!data.rows || data.rows.length === 0) {
        callback(null, null);
        return;
      }

      var data = data.rows[0];

      data.val = agg_array(data.val);
      data.buckets = agg_array(data.buckets);

      var hist = [];
      var bounds = {};

      // create a sorted array and normalize
      var upper = data.upper;
      var lower = data.lower;
      var span = data.span;
      var bucket_size = data.bucket_size
      var max, min;

      max = data.val[0];

      for(var r = 0; r < data.buckets.length; ++r) {
        var b = data.buckets[r];
        var v = hist[b] = data.val[r];
        max = Math.max(max, v);
      }


      //var maxBucket = _.max(data.buckets)
      for (var i = 0; i < hist.length; ++i) {
        if (hist[i] === undefined) {
          hist[i] = 0;
        } else {
          hist[i] = hist[i]/max;
        }
      }

      bounds.upper = parseFloat(upper);
      bounds.lower = parseFloat(lower);
      bounds.bucket_size = parseFloat(bucket_size)

      callback(hist, bounds);

    },

    error);
  },

  jenkBins: function(nslots, column, callback, error) {
    this._quantificationMethod('CDB_JenksBins', nslots, column, true, callback, error);
  },

  headTails: function(nslots, column, callback, error) {
    this._quantificationMethod('CDB_HeadsTailsBins', nslots, column, false, callback, error);
  },

  quantileBins: function(nslots, column, callback, error) {
    this._quantificationMethod('CDB_QuantileBins', nslots, column, false, callback, error);
  },

  categoriesForColumn: function(max_values, column, callback, error) {

    var tmpl = _.template('\
      SELECT <%= column %>, count(<%= column %>) FROM (<%= sql %>) _table_sql ' +
      'GROUP BY <%= column %> ORDER BY count DESC LIMIT <%= max_values %> '
    );

    this._sqlQuery(tmpl({
      sql: this.getSQL(),
      column: column,
      max_values: max_values + 1
    }),
    function(data) {
      callback({
        type: data.fields[column].type || 'string',
        categories: _(data.rows).pluck(column)
      });
    },
    error);

  },

  /**
   * call callback with the geometry bounds
   */
  geometryBounds: function(callback) {
    var tmpl = _.template('SELECT ST_XMin(ST_Extent(the_geom)) as minx,ST_YMin(ST_Extent(the_geom)) as miny, ST_XMax(ST_Extent(the_geom)) as maxx,ST_YMax(ST_Extent(the_geom)) as maxy from (<%= sql %>) _table_sql');
    this._sqlQuery(tmpl({
      sql: this.getSQL()
      }),
      function(result) {
         var coordinates = result.rows[0];

          var lon0 = coordinates.maxx;
          var lat0 = coordinates.maxy;
          var lon1 = coordinates.minx;
          var lat1 = coordinates.miny;

          var minlat = -85.0511;
          var maxlat =  85.0511;
          var minlon = -179;
          var maxlon =  179;

          var clampNum = function(x, min, max) {
            return x < min ? min : x > max ? max : x;
          };

          lon0 = clampNum(lon0, minlon, maxlon);
          lon1 = clampNum(lon1, minlon, maxlon);
          lat0 = clampNum(lat0, minlat, maxlat);
          lat1 = clampNum(lat1, minlat, maxlat);
          callback([ [lat0, lon0], [lat1, lon1]]);
      }
    );
  },

  _sqlQuery: function(sql, callback, error, type) {
    var s = encodeURIComponent(sql);
    return $.ajax({
      type: type || "POST",
      data: "q=" + s + "&api_key=" + cdb.config.get('api_key'),
      url: this.url(),
      success: callback,
      error: error
    });
  },

  getSQL: function() {
    // use table.id to fetch data because if always contains the real table name
    return 'select * from ' + cdb.Utils.safeTableNameQuoting(this.table.get('id'));
  },

  fetch: function(opts) {
    var self = this;
    opts = opts || {};
    if(!opts || !opts.add) {
      this.options.attributes.page = 0;
      this.options._previousAttributes.page = 0;
      this.pages = [];
    }
   var error = opts.error;
    opts.error = function(model, resp) {
      self.fetched = true;
      self.trigger('error', model, resp);
      error && error(model, resp);
    }
    var success = opts.success;
    opts.success = function(model, resp) {
      self.fetched = true;
      success && success.apply(self, arguments);
    }
    this._fetch(opts);
  },

  _fetch: function(opts) {
    var MAX_GET_LENGTH = 1024;
    var self = this;
    this.trigger('loading', opts);

    var sql = this.getSQL();
    // if the query changes the database just send it
    if (cdb.admin.CartoDBTableMetadata.alterTableData(sql)) {
      cdb.ui.common.TableData.prototype.fetch.call(self, opts);
      return;
    }

    // use get to fetch the schema, probably cached
    this._sqlQuery(_.template('select * from (<%= sql %>) __wrapped limit 0')({ sql: sql }), function(data) {
      // get schema
      self.query_schema = self._schemaFromQueryFields(data.fields);
      if (!self.table.isInSQLView()) {
        if ('the_geom' in self.query_schema) {
          delete self.query_schema['the_geom_webmercator'];
        }
      }
      cdb.ui.common.TableData.prototype.fetch.call(self, opts);
    }, function (err) {
      self.trigger('error', self, err);
    }, sql.length > MAX_GET_LENGTH ? "POST" : "GET");
  },

  /**
   * with the data from the rows fetch create an schema
   * if the schema from original table is passed the method
   * set the column types according to it
   * return an empty list if no data was fetch
   */
  schemaFromData: function(originalTableSchema) {
    // build schema in format [ [field, type] , ...]
    return cdb.admin.CartoDBTableMetadata.sortSchema(_(this.query_schema).map(function(v, k) {
      return [k, v];
    }));
  },

  geometryTypeFromGeoJSON: function(geojson) {
    try {
      var geo = JSON.parse(geojson);
      return geo.type
    } catch(e) {
    }
  },

  geometryTypeFromWKT: function(wkt) {
    if(!wkt) return null;
    var types = cdb.admin.WKT.types;
    wkt = wkt.toUpperCase();
    for(var i = 0; i < types.length; ++i) {
      var t = types[i];
      if (wkt.indexOf(t) !== -1) {
        return t;
      }
    }
  },

  geometryTypeFromWKB: function(wkb) {
    if(!wkb) return null;

    var typeMap = {
      '0001': 'Point',
      '0002': 'LineString',
      '0003': 'Polygon',
      '0004': 'MultiPoint',
      '0005': 'MultiLineString',
      '0006': 'MultiPolygon'
    };

    var bigendian = wkb[0] === '0' && wkb[1] === '0';
    var type = wkb.substring(2, 6);
    if(!bigendian) {
      // swap '0100' => '0001'
      type = type[2] + type[3] + type[0] + type[1];
    }
    return typeMap[type];

  },


  //
  // guesses from the first row the geometry types involved
  // returns an empty array where there is no rows
  // return postgist types, like st_GEOTYPE
  //
  getGeometryTypes: function() {
    var row = null;
    var i = this.size();
    while (i-- && !(row && row.get('the_geom'))) {
      row = this.at(i);
    }
    if(!row) return [];
    var geom = row.get('the_geom') || row.get('the_geom_webmercator');
    var geoType = this.geometryTypeFromWKB(geom) || this.geometryTypeFromWKT(geom);
    if(geoType) {
      return ['ST_' + geoType[0].toUpperCase() + geoType.substring(1).toLowerCase()];
    }
    return [];
  },

});

/**
 * contains data for a sql view
 * var s = new cdb.admin.SQLViewData({ sql : "select...." });
 * s.fetch();
 */
cdb.admin.SQLViewData = cdb.admin.CartoDBTableData.extend({

  UNDEFINED_TYPE_COLUMN: 'undefined',

  initialize: function(models, options) {
    this.model.prototype.idAttribute = 'cartodb_id';
    // this.elder('initialize', models, options);
    cdb.admin.CartoDBTableData.prototype.initialize.call(this, models, options);

    this.bind('error', function() {
      this.reset([]);
    });
    //this.initOptions();
    if(options && options.sql) {
      this.setSQL(options.sql);
    }
  },


  _parseSQL: function(sql) {
    sql = sql.replace(/([^\\]){x}/g, '$10').replace(/\\{x}/g, '{x}')
    sql = sql.replace(/([^\\]){y}/g, '$10').replace(/\\{y}/g, '{y}')
    sql = sql.replace(/([^\\]){z}/g, '$10').replace(/\\{z}/g, '{z}')

    // Substitute mapnik tokens
    // resolution at zoom level 0
    var res = '156543.03515625';
    // full webmercator extent
    var ext = 'ST_MakeEnvelope(-20037508.5,-20037508.5,20037508.5,20037508.5,3857)';
    sql = sql.replace('!bbox!', ext)
             .replace('!pixel_width!', res)
             .replace('!pixel_height!', res);

    return sql
  },

  sqlSource: function() {
    return this.options.get('sql_source');
  },

  setSQL: function(sql, opts) {
    opts = opts || {}
    // reset options whiout changing raising a new fetchs
    this.options.set({
      page: 0,
      sort_order: 'asc',
      order_by: '',
      filter_column: '',
      filter_value: '',
      sql_source: opts.sql_source || null
    }, { silent: true } );

    var silent = opts.silent;
    opts.silent = true;
    this.options.set({ sql : sql ? this._parseSQL(sql): '' }, opts);
    if(!silent) {
      this.options.trigger('change:sql', this.options, sql);
    }
  },

  getSQL: function() {
    return this.options.get('sql');
  },

  url: function() {
    return this.sqlApiUrl();
  },

  isReadOnly: function() {
    return this.sqlSource() !== 'filters';
  },

  quartiles: function(nslots, column, callback, error) {
    var tmpl = _.template('SELECT quartile, max(<%= column %>) as maxAmount FROM (SELECT <%= column %>, ntile(<%= slots %>) over (order by <%= column %>) as quartile FROM (<%= sql %>) as _rambo WHERE <%= column %> IS NOT NULL) x GROUP BY quartile ORDER BY quartile');
    this._sqlQuery(tmpl({
      slots: nslots,
      sql: this.options.get('sql'),
      column: column
    }),
    function(data) {
      callback(_(data.rows).pluck('maxamount'));
    },
    error);
  },

  // returns if the query contains geo data
  isGeoreferenced: function() {
    return this.getGeometryTypes().length > 0;
  }

  /*url: function() {
    if(!this.sql) {
      throw "sql must be provided";
    }
    return '/api/v1/queries?sql=' +
      encodeURIComponent(this.sql) +
      '&limit=20&rows_per_page=40&page=0'
  }*/

});

cdb.admin.CartoDBLayer = cdb.geo.CartoDBLayer.extend({
  MAX_HISTORY: 5,
  MAX_HISTORY_QUERY: 5,
  MAX_HISTORY_TILE_STYLE: 5,

  initialize: function() {
    this.sync = _.debounce(this.sync, 1000);
    this.error = false;

    this.set('use_server_style', true);

    this.initHistory('query');
    this.initHistory('tile_style');

    this.table = new cdb.admin.CartoDBTableMetadata({
      id: this.get('table_name')
    });

    this.infowindow = new cdb.geo.ui.InfowindowModel({
      template_name:  'infowindow_light'
    });

    this.tooltip = new cdb.geo.ui.InfowindowModel({
      template_name:  'tooltip_light'
    });

    var wizard_properties = this.get('wizard_properties');

    this.wizard_properties = new cdb.admin.WizardProperties(_.extend({},
      wizard_properties, {
        table: this.table,
        layer: this
      }
    ));

    //this.wizard_properties.properties(wizard_properties);

    this.wizard_properties.bind('change:type', this._manageInteractivity, this);

    this.legend = new cdb.geo.ui.LegendModel();

    // Bindings
    this.bind('change:table_name', function() {
      this.table.set('id', this.get('table_name')).fetch();
    }, this);

    // schema changes should affect first to infowindow, tooltip
    // and legend before table
    this.bindInfowindow(this.infowindow, 'infowindow');
    this.bindInfowindow(this.tooltip, 'tooltip');
    this.bindLegend(this.legend);
    this.bindTable(this.table);

    this.tooltip.bind('change:fields', this._manageInteractivity, this);

    if (this.get('table')) {
      table_attr = this.get('table');
      delete this.attributes.table;
      this.table.set(table_attr);
    }
    if (!this.isTableLoaded()) {
      this.table.fetch();
    }
  },

  isTableLoaded: function() {
    return this.table.get('id') && this.table.get('privacy');
  },

  toLayerGroup: function() {
    var attr = _.clone(this.attributes);
    attr.layer_definition = {
      version: '1.0.1',
      layers: []
    };
    if (this.get('visible')) {
      attr.layer_definition.layers.push(this.getLayerDef());
    }
    attr.type = 'layergroup'
    return attr;
  },

  getLayerDef: function() {
    var attr = this.attributes;
    var query = attr.query || 'select * from ' + cdb.Utils.safeTableNameQuoting(attr.table_name);
    if(attr.query_wrapper) {
      query = _.template(attr.query_wrapper)({ sql: query });
    }
    return {
      type: 'cartodb',
      options: {
        sql: query,
        cartocss: this.get('tile_style'),
        cartocss_version: '2.1.1',
        interactivity: this.get('interactivity')
      }
    }
  },

  /**
   * Initializes the history if it doesn't exits and sets the position pointer to 0
   * @param  {string} property
   */
  initHistory: function(property) {
    if(!this.get(property+'_history')) {
      this.set(property+'_history', []);
    }
    this[property+'_history_position'] = 0;
    this[property+'_storage'] = new cdb.admin.localStorage(property+'_storage_'+this.get('table_name'));
  },
  /**
   * Add a value to the property history if it's not the same than the last one
   * @param {string} property
   * @param {string} value
   */
  addToHistory: function(property, value) {
    if(value != this.get(property+'_history')[this.get(property+'_history').length - 1]) {
      this.get(property+'_history').push(value);
      this.trimHistory(property);
      this[property+'_history_position'] = this.get(property+'_history').length - 1;
    }
  },
  /**
   * Trim the history array to make sure its length isn't over MAX_HISTORY
   * @param  {String} property [description]
   */
  trimHistory: function(property) {
    var limit = this['MAX_HISTORY_'+property.toUpperCase()] ?
      this['MAX_HISTORY_'+property.toUpperCase()] :
      this.MAX_HISTORY;
    while(this.get(property+'_history').length > limit) {
      var removedValue = this.get(property+'_history').splice(0,1);
      this[property+'_storage'].add(removedValue[0]);
    }
  },
  /**
   * Moves the history position pointer n positions and notify that the property needs to be refreshed on views
   * @param  {String} property
   * @param  {Integer} n
   */
  moveHistoryPosition: function(property, n) {
      var newPosition = this[property+'_history_position'] + n;
    if(newPosition >= 0 && newPosition < this.get(property+'_history').length) {
      this[property+'_history_position'] = newPosition;
    } else {
      if(newPosition < 0 && Math.abs(newPosition) <= this[property+'_storage'].get().length) {
        this[property+'_history_position'] = newPosition;
      }
    }
  },
  /**
   * returns the value saved on the position of the current _history_position, either from memory of from localStorage
   * @param  {String} property
   * @return {String}
   */
  getCurrentHistoryPosition: function(property) {
    var currentPosition = this[property+'_history_position'];
    if(this[property+'_history_position'] >= 0) {
      return this.get(property+'_history')[currentPosition];
    } else {
      if(Math.abs(currentPosition) <= this[property+'_storage'].get().length) {

        return this[property+'_storage'].get(this[property+'_storage'].get().length - Math.abs(currentPosition));
      } else {
        return this.get(property+'_history')[0]
      }
    }

  },
  /**
   * Advances by one the history_position and returns the value saved on that pos
   * @param  {String} property
   * @return {String}
   */
  redoHistory: function(property) {
    this.moveHistoryPosition(property, 1);
    return this.getCurrentHistoryPosition(property);
  },
  /**
   * Reduces by one the history_position and returns the value saved on that pos
   * @param  {String} property
   * @return {String}
   */
  undoHistory: function(property) {
    var h = this.getCurrentHistoryPosition(property);
    this.moveHistoryPosition(property, -1);
    return h;
  },

  isHistoryAtLastPosition: function(property) {
    if(this.get(property+'_history').length === 0) {
      return true;
    }
    return ((this.get(property+'_history').length-1) == this[property+'_history_position']);
  },

  isHistoryAtFirstPosition: function(property) {
    if(this.get(property+'_history').length === 0) {
      return true;
    }
    var stored = this[property+'_storage'].get();
    if(stored && stored.length === 0) {
      if(this[property+'_history_position'] === 0) {
        return true;
      }
    } else {
      var storedSize = stored ? 1*stored.length : 0;
      var minimumPos = -1* storedSize;
      return (minimumPos == this[property+'_history_position']);
    }
    return false;
  },

  clone: function() {
    var attr = _.clone(this.attributes);
    delete attr.id;
    attr.table = this.table.toJSON();
    return new cdb.admin.CartoDBLayer(attr);
  },

  toJSON: function() {
    var c = _.clone(this.attributes);
    // remove api key
    if(c.extra_params) {
      c.extra_params = _.clone(this.attributes.extra_params);
      if(c.extra_params.api_key) {
        delete c.extra_params.api_key;
      }
      if(c.extra_params.map_key) {
        delete c.extra_params.map_key;
      }
    }

    delete c.infowindow;
    delete c.tooltip;
    c.wizard_properties = this.wizard_properties.toJSON();
    c.legend = this.legend.toJSON();
    var d = {
      // for some reason backend does not accept cartodb as layer type
      kind: c.type.toLowerCase() === 'cartodb' ? 'carto': c.type,
      options: c,
      order: c.order,
      infowindow: null,
      tooltip: this.tooltip.toJSON()
    };

    // Don't send infowindow data if wizard doesn't support it
    // It will make the tiler fails
    if (this.wizard_properties.supportsInteractivity()) {
      d.infowindow = this.infowindow.toJSON();
    }

    if(c.id !== undefined) {
      d.id = c.id;
    }
    return d;
  },

  parse: function(data, xhr) {
    var c = {};
    // in case this is a response of saving the layer discard
    // values from the server
    if (!data || this._saving && !this.isNew()) {
      return c;
    }

    // if api_key exist alread, set in params to not lose it
    if(data.options.extra_params && this.attributes && this.attributes.extra_params) {
      data.options.extra_params.map_key = this.attributes.extra_params.map_key;
    }

    var attrs = this.attributes;
    var wp = attrs && attrs.wizard_properties;

    if(wp && wp.properties && wp.properties.metadata) {
      if (data.options.wizard_properties && data.options.wizard_properties.properties) {
        data.options.wizard_properties.properties.metadata = wp.properties.metadata;
      }
    }

    if (this.wizard_properties && data.options.wizard_properties) {
      this.wizard_properties.properties(data.options.wizard_properties);
    }

    _.extend(c, data.options, {
      id: data.id,
      type: data.kind === 'carto' ? 'CartoDB': data.kind,
      infowindow: data.infowindow,
      tooltip: data.tooltip,
      order: data.order
    });

    return c;
  },

  sync: function(method, model, options) {
    if(method != 'read') {
      options.data =  JSON.stringify(model.toJSON());
    }
    options.contentType = 'application/json';
    options.url = model.url();
    return Backbone.syncAbort(method, this, options);
  },

  unbindSQLView: function(sqlView) {
    this.sqlView.unbind(null, null, this);
    this.sqlView = null;
  },

  getCurrentState: function() {
    if (this.error) {
      return "error";
    }
    return "success";
  },

  bindSQLView: function(sqlView) {
    var self = this;
    this.sqlView = sqlView;
    this.sqlView.bind('error', this.errorSQLView, this);

    // on success and no modify rows save the query!
    this.sqlView.bind('reset', function() {
      // if the query was cleared while fetchin the data
      if (!self.table.isInSQLView()) return;
      self.error = false;
      if(self.sqlView.modify_rows) {
        self.set({ query: null });
        self.invalidate();
        self.table.useSQLView(null, { force_data_fetch: true });
        self.trigger('clearSQLView');
      } else {
        self.save({
          query: sqlView.getSQL(),
          sql_source: sqlView.sqlSource()
        });
      }
    }, this);

    // Set sql view if query was applied
    var sql = this.get('query');
    if (sql) {
      this.applySQLView(sql, { add_to_history: false });
    } else {
      this.table.data().fetch();
    }
  },

  bindTable: function(table) {
    this.table = table;
    var self = this;
    self.table.bind('change:name', function() {
      if (self.get('table_name') != self.table.get('name')) {
        self.fetch({
          success: function() {
            self.updateCartoCss(self.table.previous('name'), self.table.get('name'));
          }
        });
      }
    });

    this.table.bind('change:schema', this._manageInteractivity, this);
  },

  _manageInteractivity: function() {
    var interactivity = null;
    if (this.wizard_properties.supportsInteractivity()) {
      if(this.table.containsColumn('cartodb_id')) {
        interactivity = ['cartodb_id'];
      }
      var tooltipColumns = this.tooltip.getInteractivity();
      if (tooltipColumns.length) {
        interactivity = (interactivity || []).concat(tooltipColumns);
      }
      if (interactivity) {
        interactivity = interactivity.join(',');
      }
    }
    if(this.get('interactivity') !== interactivity) {
      if (this.isNew()) {
        this.set({ interactivity: interactivity });
      } else {
        this.save({ interactivity: interactivity });
      }
    }
  },

  /**
   * Updates the style chaging the table name for a new one
   * @param  {String} previousName
   * @param  {String} newName
   */
  updateCartoCss: function(previousName, newName) {
    var tileStyle = this.get('tile_style');
    if (!tileStyle) return;
    var replaceRegexp = new RegExp('#'+previousName, 'g');
    tileStyle = tileStyle.replace(replaceRegexp, '#'+newName);
    this.save({'tile_style': tileStyle});
  },

  bindLegend: function(legend) {

    var data = this.get('legend');

    if (data) {
      this.legend.set(data);
    }

    this.legend.bind('change:template change:type change:title change:show_title change:items', _.debounce(function() {
      // call with silent so the layer is no realoded
      // if some view needs to be changed when the legend is changed it should be
      // subscribed to the legend model not to dataLayer
      // (which is only a data container for the legend)
      if (!this.isNew()) {
        this.save(null, { silent: true });
      }
    }, 250), this);

  },

  bindInfowindow: function(infowindow, attr) {
    attr = attr || 'infowindow';
    var infowindowData = this.get(attr);
    if(infowindowData) {
      infowindow.set(infowindowData);
    } else {
      // assign a position from start
      var pos = 0;
      _(this.table.get('schema')).each(function(v) {
        if(!_.contains(['the_geom', 'created_at', 'updated_at', 'cartodb_id'], v[0])) {
          infowindow.addField(v[0], pos);
          ++pos;
        }
      });
    }

    this.table.linkToInfowindow(infowindow);

    var watchedFields = 'change:fields change:template_name change:alternative_names change:template change:disabled change:width change:maxHeight';
    var deferredSave = _.debounce(function() {
      // call with silent so the layer is no realoded
      // if some view needs to be changed when infowindow is changed it should be
      // subscribed to infowindow model not to dataLayer
      // (which is only a data container for infowindow)

      // since removeMissingFields changes fields, unbind changes temporally
      infowindow.unbind(watchedFields, deferredSave, this);
      // assert all the fields are where they should
      infowindow.removeMissingFields(this.table.columnNames());
      infowindow.bind(watchedFields, deferredSave, this);
      if (!this.isNew()) {
        this.save(null, { silent: true });
      }
    }, 250);

    infowindow.bind(watchedFields, deferredSave, this);
  },

  resetQuery: function() {
    if (this.get('query')) {
      this.save({
        query: undefined,
        sql_source: null
      });
    }
  },

  errorSQLView: function(m, e) {
    this.save({ query: null }, { silent: true });
    this.trigger('errorSQLView', e);
    this.error = true;
  },

  clearSQLView: function() {
    // before reset query we should remove the view
    this.table.useSQLView(null);
    this.addToHistory("query", 'SELECT * FROM ' + cdb.Utils.safeTableNameQuoting(this.table.get('name')));
    // undo history to move backwards the history pointer
    this.undoHistory("query");
    this.resetQuery();
    this.trigger('clearSQLView');
  },

  applySQLView: function(sql, options) {
    options = options || {
      add_to_history: true,
      sql_source: null
    };
    // if the sql change the table data do not save in the data layer
    // pass though and launch the query directly to the table
    this.table.useSQLView(this.sqlView);
    this.sqlView.setSQL(sql, {
      silent: true,
      sql_source: options.sql_source || null
    });
    if(options.add_to_history) {
      this.addToHistory("query", sql);
    }
    // if there is some error the query is rollbacked
    this.sqlView.fetch();
    this.trigger('applySQLView', sql);
  },

  moveToFront: function(opts) {
    var layers = this.collection;
    var dataLayers = layers.getDataLayers();

    layers.moveLayer(this, { to: dataLayers.length });
  }
}, {

  createDefaultLayerForTable: function(tableName, userName) {
    return new cdb.admin.CartoDBLayer({
      user_name: userName,
      table_name: tableName,
      tile_style: "#" + tableName + cdb.admin.CartoStyles.DEFAULT_GEOMETRY_STYLE,
      style_version: '2.1.0',
      visible: true,
      interactivity: 'cartodb_id',
      maps_api_template: cdb.config.get('maps_api_template'),
      no_cdn: true
    });
  }

});


/*
 * extend infowindow to serialize only the data we need
 */
_.extend(cdb.geo.ui.InfowindowModel.prototype, {
  toJSON: function() {
    var fields = [];

    if (!this.attributes.disabled) {
      fields = _.clone(this.attributes.fields);
    }

    return {
      fields:             fields,
      template_name:      this.attributes.template_name,
      template:           this.attributes.template,
      alternative_names:  this.attributes.alternative_names,
      old_fields:         this.attributes.old_fields,
      old_template_name:  this.attributes.old_template_name,
      width:              this.attributes.width,
      maxHeight:          this.attributes.maxHeight
    };
  },

  removeMissingFields: function(columns) {
    var columnsSet = {}
    for(var i = 0; i < columns.length; ++i) {
      var c = columns[i];
      columnsSet[c] = true;
    }
    var fields = this.get('fields');
    if (!fields) {
      return;
    }
    for(var i = 0; i < fields.length; ++i) {
      var name = fields[i].name;
      if (! (name in columnsSet)) {
        this.removeField(name);
      }
    }
  },

  addMissingFields: function(columns) {
    var fieldsSet = {};
    var fields = this.get('fields');

    for(var i = 0; i < fields.length; ++i) {
      var c = fields[i].name;
      fieldsSet[c] = true;
    }

    for(var i = 0; i < columns.length; ++i) {
      var name = columns[i];
      if (! (name in fieldsSet)) {
        this.addField(name);
      }
    }
  },

  mergeFields: function(columns) {
    // remove fields that no longer exist
    this.removeMissingFields(columns);
    // add new fields that exists
    this.addMissingFields(columns);
  },

  // return the list of columns involved in the infowindow
  // ready to set interactivity in a cartodb layer
  getInteractivity: function() {
    var fields = this.get('fields') || [];
    var columns = [];
    for(var i = 0; i < fields.length; ++i) {
      columns.push(fields[i].name);
    }
    return columns;
  }
});

/**
 * extend gmaps layer for data serialization
 */
cdb.admin.GMapsBaseLayer = cdb.geo.GMapsBaseLayer.extend({

  clone: function() {
    return new cdb.admin.GMapsBaseLayer(_.clone(this.attributes));
  },

  parse: function(data) {
    var c = {};
    _.extend(c, data.options, {
      id: data.id,
      type: 'GMapsBase',
      order: data.order,
      parent_id: data.parent_id
    });
    return c;
  },

  toJSON: function() {
    var c = _.clone(this.attributes);

    var d = {
      kind:  'gmapsbase',
      options: c,
      order: c.order
    };

    if(c.id !== undefined) {
      d.id = c.id;
    }
    return d;
  }
});

/**
 * extend wms layer for data serialization
 */
cdb.admin.WMSLayer = cdb.geo.WMSLayer.extend({

  clone: function() {
    return new cdb.admin.WMSLayer(_.clone(this.attributes));
  },

  /*
  * Create className from the urlTemplate of the basemap
  */
  _generateClassName: function(urlTemplate) {
    if (urlTemplate) {
      var className = urlTemplate;

      if (className && parseInt(className) && _.isNumber(parseInt(className))) {
        className = "w" + className;
      }

      return className.replace(/\s+/g, '').replace(/[^a-zA-Z_0-9 ]/g, "").toLowerCase();

    } else return "";
  },

  parse: function(data) {

    var self = this;
    var c = {};

    _.extend(c, data.options, {
      id: data.id,
      className: self._generateClassName(data.options.layers),
      type: 'WMS',
      order: data.order,
      parent_id: data.parent_id
    });

    return c;
  },

  toJSON: function() {
    var c = _.clone(this.attributes);

    var d = {
      kind:  'wms',
      options: c,
      order: c.order
    };

    if(c.id !== undefined) {
      d.id = c.id;
    }
    return d;
  }

});

/**
 * extend plain layer for data serialization
 */
cdb.admin.PlainLayer = cdb.geo.PlainLayer.extend({

  parse: function(data) {
    var c = {};
    _.extend(c, data.options, {
      id: data.id,
      type: 'Plain',
      order: data.order,
      parent_id: data.parent_id
    });
    return c;
  },

  toJSON: function() {
    var c = _.clone(this.attributes);

    var d = {
      kind:  'background',
      options: c,
      order: c.order
    };

    if(c.id !== undefined) {
      d.id = c.id;
    }
    return d;
  }
});

/**
 * extend tiled layer to adapt serialization
 */
cdb.admin.TileLayer = cdb.geo.TileLayer.extend({

  clone: function() {
    return new cdb.admin.TileLayer(_.clone(this.attributes));
  },

  /*
  * Create className from the urlTemplate of the basemap
  */
  _generateClassName: function(urlTemplate) {
    if (urlTemplate) {
      return urlTemplate.replace(/\s+/g, '').replace(/[^a-zA-Z_0-9 ]/g, "").toLowerCase();
    } else return "";
  },

  parse: function(data) {
    var self = this;
    var c = {};

    _.extend(c, data.options, {
      id: data.id,
      className: self._generateClassName(data.options.urlTemplate),
      type: 'Tiled',
      order: data.order,
      parent_id: data.parent_id
    });

    return c;
  },

  toJSON: function() {
    var c = _.clone(this.attributes);

    var d = {
      kind:  'tiled',
      options: c,
      order: c.order
    };

    if(c.id !== undefined) {
      d.id = c.id;
    }
    return d;
  },

  /**
   * validateTemplateURL - Validates current urlTemplate of layer.
   *
   * @param {Object} callbacks with success and error functions defined to be called depending on validation outcome.
   */
  validateTemplateURL: function(callbacks) {
    var subdomains = ['a', 'b', 'c'];
    var image = new Image();
    image.onload = callbacks.success;
    image.onerror = callbacks.error;
    image.src = this.get('urlTemplate').replace(/\{s\}/g, function() {
      return subdomains[Math.floor(Math.random() * 3)];
    })
      .replace(/\{x\}/g, '0')
      .replace(/\{y\}/g, '0')
      .replace(/\{z\}/g, '0');
  }

}, {

  /**
   * @param {String} url
   * @param {Boolean} tms
   * @return {cdb.admin.TileLayer}
   */
  byCustomURL: function(url, tms) {
    // Minimal test for "valid URL" w/o having to complicate it with regex
    if (url && url.indexOf('/') === -1) throw new TypeError('invalid URL');

    // Only lowercase the placeholder variables, since the URL may contain case-sensitive data (e.g. API keys and such)
    url = url.replace(/\{S\}/g, "{s}")
      .replace(/\{X\}/g, "{x}")
      .replace(/\{Y\}/g, "{y}")
      .replace(/\{Z\}/g, "{z}");

    var layer = new cdb.admin.TileLayer({
      urlTemplate: url,
      attribution: null,
      maxZoom: 21,
      minZoom: 0,
      name: '',
      tms: tms
    });
    layer.set('className', layer._generateClassName(url));

    return layer;
  }
});

cdb.admin.TorqueLayer = cdb.admin.CartoDBLayer.extend({

  /*parse: function(data, options) {
    var c = cdb.admin.CartoDBLayer.prototype.parse.call(this, data, options);
    c.type = 'torque';
    return c;
  }*/

});

cdb.admin.Layers = cdb.geo.Layers.extend({

  _DATA_LAYERS: ['CartoDB', 'torque'],

  // the model class works here like a factory
  // depending on the kind of layer creates a
  // type of layer or other
  model: function(attrs, options) {
    var typeClass = {
      'Tiled': cdb.admin.TileLayer,
      'CartoDB': cdb.admin.CartoDBLayer,
      'Plain': cdb.admin.PlainLayer,
      'GMapsBase': cdb.admin.GMapsBaseLayer,
      'WMS': cdb.admin.WMSLayer,
      'torque': cdb.admin.CartoDBLayer
    };
    var typeMap = {
      'Layer::Tiled': 'Tiled',
      'Layer::Carto': 'CartoDB',
      'Layer::Background': 'Plain',
      'tiled': 'Tiled',
      'carto': 'CartoDB',
      'wms': 'WMS',
      'background': 'Plain',
      'gmapsbase': 'GMapsBase',
      'torque': 'torque'
    };

    return new typeClass[typeMap[attrs.kind]](attrs, options);
  },

  initialize: function() {
    this.bind('change:order', function() {
      if (!this._isSorted()) this.sort();
    });
    cdb.geo.Layers.prototype.initialize.call(this);
  },

  add: function(models, options) {
    return Backbone.Collection.prototype.add.apply(this, arguments);
  },

  getTorqueLayers: function() {
    return this.where({ type: 'torque' });
  },

  getTiledLayers: function() {
    return this.where({ type: 'Tiled' });
  },

  // given layer model returns the index inside the layer definition
  getLayerDefIndex: function(layer) {
    var cartodbLayers = this.getLayersByType('CartoDB');
    if(!cartodbLayers.length) return -1;
    for(var i = 0, c = 0; i < cartodbLayers.length; ++i) {
      if(cartodbLayers[i].get('visible')) {
        if(cartodbLayers[i].cid === layer.cid) {
          return c;
        }
        ++c;
      }
    }
    return -1;
  },

  getLayerDef: function() {
    var cartodbLayers = this.getLayersByType('CartoDB');
    var layerDef = {
      version:'1.0.1',
      layers: []
    };

    for(var i = 0; i < cartodbLayers.length; ++i) {
      if(cartodbLayers[i].get('visible')) {
        layerDef.layers.push(cartodbLayers[i].getLayerDef());
      }
    }
    return layerDef;
  },

  /** return non-base layers */
  getDataLayers: function() {
    var self = this;
    return this.filter(function(lyr) {
      return _.contains(self._DATA_LAYERS, lyr.get('type'));
    });
  },

  /** without non-base layers */
  getTotalDataLayers: function() {
    return this.getDataLayers().length;
  },

  /** without non-base layers */
  getTotalDataLegends: function() {
    var self = this;
    return this.filter(function(lyr) {
      return _.contains(self._DATA_LAYERS, lyr.get('type')) &&
            lyr.get('legend') &&
            lyr.get('legend').type &&
            lyr.get('legend').type.toLowerCase() !== "none";
    }).length;
  },

  getLayersByType: function(type) {
    if (!type || type === '' ) {
      cdb.log.info("a layer type is necessary to get layers");
      return 0;
    }

    return this.filter(function(lyr) {
      return lyr.get('type') === type;
    });
  },

  isLayerOnTopOfDataLayers: function(layer) {
    var dataLayerOnTop = this.getDataLayers().splice(-1)[0];
    return dataLayerOnTop.cid === layer.cid;
  },

  url: function(method) {
    var version = cdb.config.urlVersion('layer', method);
    return '/api/' + version + '/maps/' +  this.map.id + '/layers';
  },

  parse: function(data) {
    return data.layers;
  },

  saveLayers: function(opts) {
    opts = opts || {};
    this.save(null, opts);
  },

  save: function(attrs, opts) {
    Backbone.sync('update', this, opts);
  },

  toJSON: function(options) {
    // We can't use the default toJSON because it uses this.map(function(){...})
    // function within it but we override it using map containing all map stuff there.
    // And we have to send all layers data within a variable called layers. 
    var array = _.map(this.models, function(model) {
      return model.toJSON(options);
    });

    return { layers: array }
  },

  clone: function(layers) {
    layers = layers || new cdb.admin.Layers();
    this.each(function(layer) {
      if(layer.clone) {
        var lyr = layer.clone();
        lyr.unset('id');
        layers.add(lyr);
      } else {
        var attrs = _.clone(layer.attributes);
        delete attrs.id;
        layers.add(attrs);
      }
    });
    return layers;
  },

  _isSorted: function() {
    var sorted = true;

    var layers = _(this.models).map(function(m) {
      return { cid: m.cid,  order: m.get('order')}
    });

    layers.sort(function(a, b) {
      return a.order - b.order;
    })

    return _.isEqual(
      _(layers).map(function(m) { return m.cid; }),
      _(this.models).map(function(m) { return m.cid; })
    )
  },

  moveLayer: function(movingLayer, options) {
    options = options || {};
    var newIndex = options.to;
    var layerAtNewIndex = this.at(newIndex);
    movingLayer.set('order', layerAtNewIndex.get('order'), { silent: true });

    // Remove and add the layer again at the new position
    this.remove(movingLayer, { silent: true });
    this.add(movingLayer, { at: newIndex, silent: true });

    // Update the order of all layers
    for (var i = 0; i < this.size(); i++) {
      var layer = this.at(i);
      layer.set('order', i);
    }

    this.trigger('reset');
    this.saveLayers({
      complete: options.complete,
      error: function() {
        throw 'Error saving layers after moving them'
      }
    });
  }
});

/**
 * this is a specialization of generic map prepared to hold two layers:
 *  - a base layer
 *  - a data layer which contains the table data
 *
 * cartodb only supports one data layer per map so this will change when
 * that changes
 */

cdb.admin.Map = cdb.geo.Map.extend({

  urlRoot: '/api/v1/maps',

  initialize: function() {
    this.constructor.__super__.initialize.apply(this);
    this.sync = Backbone.delayedSaveSync(Backbone.syncAbort, 500);
    this.bind('change:id', this._fetchLayers, this);

    this.layers = new cdb.admin.Layers();
    this.layers.map = this;
    this.layers.bind('reset add change', this._layersChanged, this);
    this.layers.bind('reset add remove change:attribution', this._updateAttributions, this);
  },

  saveLayers: function(opts) {
    opts = opts || {};
    var none = function() {}
    this.layers.saveLayers({
      success: opts.success || none,
      error: opts.error || none
    });
  },

  _layersChanged: function() {
    if(this.layers.size() >= 1) {
      this._adjustZoomtoLayer(this.layers.at(0));
      if(this.layers.size() >= 2) {
        this.set({ dataLayer: this.layers.at(1) });
      }
    }
  },

  // fetch related layers
  _fetchLayers: function() {
    this.layers.fetch();
  },

  /**
   * link to a table
   */
  relatedTo: function(table) {
    this.table = table;
    this.table.bind('change:map_id', this._fetchOrCreate, this);
  },

  parse: function(data) {
    data.bounding_box_ne = JSON.parse(data.bounding_box_ne);
    data.bounding_box_sw = JSON.parse(data.bounding_box_sw);
    data.view_bounds_ne = JSON.parse(data.view_bounds_ne);
    data.view_bounds_sw = JSON.parse(data.view_bounds_sw);
    data.center = JSON.parse(data.center);
    return data;
  },

  _fetchOrCreate: function() {
    var self = this;
    var map_id = this.table.get('map_id');
    if(!map_id) {
      this.create();
    } else {
      this.set({ id: map_id });
      this.fetch({
        error: function() {
          cdb.log.info("creating map for table");
          self.create();
        }
      });
    }
  },

  /**
   * change base layer and save all the layers to preserve the order
   */
  setBaseLayer: function(baseLayer) {
    this.trigger('savingLayers');

    // Check if the selected base layer is already selected
    if (this.isBaseLayerAdded(baseLayer)) {
      this.trigger('savingLayersFinish');
      return false;
    }

    var self = this;
    var newBaseLayer = baseLayer;
    var currentBaseLayer = this.layers.at(0);
    var newBaseLayerHasLabels = newBaseLayer.get('labels') && newBaseLayer.get('labels').url;

    // Sets the base layer
    var options = {
      success: function() {
        if (!newBaseLayerHasLabels) {
          self.trigger('savingLayersFinish');
        }
      },
      error: function() {
        cdb.log.error("error changing the basemap");
        self.trigger('savingLayersFinish');
      }
    }

    if (currentBaseLayer) {
      if (currentBaseLayer.get('type') === newBaseLayer.get('type')) {
        this._updateBaseLayer(currentBaseLayer, newBaseLayer, options);
      } else {
        this._replaceBaseLayer(currentBaseLayer, newBaseLayer, options);
      }
    } else {
      this._addBaseLayer(newBaseLayer, options);
    }


    // Adds/updates/removes layer with labels at the top
    options.success = function() {
      self.trigger('savingLayersFinish');
    }

    if (newBaseLayerHasLabels) {
      if (this._hasLabelsLayer()) {
        this._updateLabelsLayer(newBaseLayer, options);
      } else {
        this._addLabelsLayer(newBaseLayer, options);
      }
    } else {
      if (this._hasLabelsLayer()) {
        this._destroyLabelsLayer(options);
      }
    }

    return newBaseLayer;
  },

  _updateBaseLayer: function(currentBaseLayer, newBaseLayer, opts) {
    var newAttributes = _.extend(_.clone(newBaseLayer.attributes), {
      id: currentBaseLayer.get('id'),
      order: currentBaseLayer.get('order')
    });
    currentBaseLayer.clear({ silent: true });
    currentBaseLayer.set(newAttributes);
    currentBaseLayer.save(null, opts);
  },

  _replaceBaseLayer: function(currentBaseLayer, newBaseLayer, opts) {
    this.layers.remove(currentBaseLayer);
    newBaseLayer.set({
      id: currentBaseLayer.get('id'),
      order: currentBaseLayer.get('order')
    });
    this.layers.add(newBaseLayer, { at: 0 });
    newBaseLayer.save(null, opts);
  },

  _addBaseLayer: function(newBaseLayer, opts) {
    this.layers.add(newBaseLayer, { at: 0 });
    newBaseLayer.save(null, opts);
  },

  _hasLabelsLayer: function() {
    return this.layers.size() > 1 && this.layers.last().get('type') === 'Tiled';
  },

  _updateLabelsLayer: function(baseLayer, opts) {
    var labelsLayer = this.layers.last();
    labelsLayer.set({
      name: this._labelsLayerNameFromBaseLayer(baseLayer),
      urlTemplate: baseLayer.get('labels').url,
      attribution: baseLayer.get('attribution'),
      minZoom: baseLayer.get('minZoom'),
      maxZoom: baseLayer.get('maxZoom'),
      subdomains: baseLayer.get('subdomains')
    });
    labelsLayer.save(null, opts);
  },

  _addLabelsLayer: function(baseLayer, opts) {
    this.layers.add({
      name: this._labelsLayerNameFromBaseLayer(baseLayer),
      urlTemplate: baseLayer.get('labels').url,
      attribution: baseLayer.get('attribution'),
      minZoom: baseLayer.get('minZoom'),
      maxZoom: baseLayer.get('maxZoom'),
      subdomains: baseLayer.get('subdomains'),
      kind: "tiled"
    });
    var labelsLayer = this.layers.last();
    labelsLayer.save(null, opts);
  },

  _destroyLabelsLayer: function(opts) {
    this.layers.last().destroy(opts);
  },

  _labelsLayerNameFromBaseLayer: function(baseLayer) {
    return baseLayer.get('name') + " Labels";
  },

  /**
   * the first version of cartodb contains one single layer
   * per table with information.
   */
  addDataLayer: function(lyr) {
    this.addLayer(lyr);
    this.set({ dataLayer: lyr });
  },

  /**
   * create a new map. this is a helper to use from javascript command line
   */
  create: function() {
    this.unset('id');
    this.set({ table_id: this.table.id });
    this.save();
  },

  /**
   * enable save map each time the viewport changes
   * not working
   */
  autoSave: function() {
    this.bind('change:center', this.save);
    this.bind('change:zoom', this.save);
  },

  toJSON: function() {
    var c = _.clone(this.attributes);
    // data layer is a helper to work in local
    delete c.dataLayer;
    return c;
  },

  /**
   * change provider and optionally baselayer
   */
  changeProvider: function(provider, baselayer) {
    var self = this;

    if(baselayer && baselayer.get('id')) {
      cdb.log.error("the baselayer should not be saved in the server");
      return;
    }
    var _changeBaseLayer = function() {
      if(baselayer) {
        self.setBaseLayer(baselayer);
      }
    }
    if(this.get('provider') !== provider) {
      this.save({ provider: provider }, {
        success: function() {
          _changeBaseLayer();
          self.change();
        },
        error: function(e, resp) {
          self.error(_t('error switching base layer'), resp);
        },
        silent: true
      });
    } else {
      _changeBaseLayer();
    }
  },

  isProviderGmaps: function() {
    var provider = this.get("provider");
    return provider && provider.toLowerCase().indexOf("googlemaps") !== -1
  },

  clone: function(m) {
    m = m || new cdb.admin.Map();
    var attrs = _.clone(this.attributes)
    delete attrs.id;
    m.set(attrs);

    // clone lists
    m.set({
      center:           _.clone(this.attributes.center),
      bounding_box_sw:  _.clone(this.attributes.bounding_box_sw),
      bounding_box_ne:  _.clone(this.attributes.bounding_box_ne),
      view_bounds_sw:   _.clone(this.attributes.view_bounds_sw),
      view_bounds_ne:   _.clone(this.attributes.view_bounds_ne),
      attribution:      _.clone(this.attributes.attribution)
    });

    // layers
    this.layers.clone(m.layers);
    m.layers.map = m;

    return m;
  },

  notice: function(msg, type, timeout) {
    this.trigger('notice', msg, type, timeout);
  },

  error: function(msg, resp) {
    var err =  resp && JSON.parse(resp.responseText).errors[0];
    this.trigger('notice', msg + " " + err, 'error');
  },

  addCartodbLayerFromTable: function(tableName, userName, opts) {
    opts = opts || {};
    /*var newLayer = cdb.admin.CartoDBLayer.createDefaultLayerForTable(tableName, userName);
    this.layers.add(newLayer);
    newLayer.save(null, opts);
    */

    var self = this;
    var table = new cdb.admin.CartoDBTableMetadata({ id: tableName });
    table.fetch({
      success: function() {
        // Get the layers for the map
        var map = new cdb.admin.Map({ id: table.get('map_id') });
        map.layers.bind('reset', function() {
          var newLayer = map.layers.at(1).clone();
          newLayer.unset('order');

          function layerReady() {
            newLayer.table.unbind('change:geometry_types', layerReady);
            // when the layer is torque and there are other torque layers in the map, switch it to a
            // simple visualization layer
            if (newLayer.wizard_properties.get('type') === 'torque' && self.layers.getTorqueLayers().length) {
              newLayer.wizard_properties.active('polygon');
            }
            // wait: true is used to make sure the layer is not added until confirmed it was added successfully
            // pass opts for success/error callbacks to be triggered as expected
            self.layers.create(newLayer, _.extend({ wait: true }, opts));
          }

          // Wait until the layer is totally ready in order to add it to the layers and save it
          if (newLayer.isTableLoaded()) {
            layerReady();
          } else {
            newLayer.table.bind('change:geometry_types', layerReady);
            newLayer.table.data().fetch();
          }
        });
        map.layers.fetch();
      }
    });
  },

  // moves the map to interval [-180, 180]
  clamp: function() {
    var fmod = function (a,b) { return Number((a - (Math.floor(a / b) * b)).toPrecision(8)); };
    var latlng = this.get('center');
    var lon = latlng[1];
    if(lon < -180 || lon > 180) {
      lon = fmod(180 + lon, 360) - 180;
      this.set('center', [latlng[0], lon]);
    }
    return this;
  }
});

/**
 * Model representing a group.
 * Expected to be used in the context of a groups collection (e.g. cdb.admin.OrganizationGroups),
 * which defines its API endpoint path.
 */
cdb.admin.Group = cdb.core.Model.extend({

  defaults: {
    display_name: '' // UI name, as given by
    // name: '', // internal alphanumeric representation, converted from display_name internally
    // organization_id: '',
  },

  initialize: function(attrs) {
    this.parse(attrs || {}); // handle given attrs in the same way as for .fetch()
  },

  parse: function(attrs) {
    this.users = new cdb.admin.GroupUsers(attrs.users, {
      group: this
    });
    return attrs;
  }

});

/**
 * Collection of a User's groups.
 */
cdb.admin.UserGroups = Backbone.Collection.extend({

  model: cdb.admin.Group,

  initialize: function(models, opts) {
    this.organization = opts.organization;
  }

});

/**
 * A collection that holds a set of organization groups
 */
cdb.admin.OrganizationGroups = Backbone.Collection.extend({

  model: cdb.admin.Group,

  url: function(method) {
    var version = cdb.config.urlVersion('organizationGroups', method);
    return '/api/' + version + '/organization/' + this.organization.id + '/groups';
  },

  initialize: function(models, opts) {
    if (!opts.organization) throw new Error('organization is required');
    this.organization = opts.organization;
  },

  parse: function(response) {
    this.total_entries = response.total_entries;
    return response.groups;
  },

  // @return {Object} A instance of cdb.admin.Group. If group wasn't already present a new model with id and collection
  //  set will be returned, i.e. group.fetch() will be required to get the data or handle the err case (e.g. non-existing)
  newGroupById: function(id) {
    var group = this.get(id);
    if (!group) {
      group = new this.model({
        id: id
      });
      // collection set on model, but not added to collection yet
      group.collection = this;
    }
    return group;
  },

  // @return {Number, undefined} may be undefined until a first fetch is done
  totalCount: function() {
    return this.total_entries;
  }

});


/**
 * the user has some base layers saved
 */
cdb.admin.UserLayers = cdb.admin.Layers.extend({
  url: function(method) {
    var version = cdb.config.urlVersion('layer', method);
    return '/api/' + version + '/users/' +  this.user.id + '/layers';
  },

  custom: function() {
    return this.where({ category: undefined });
  }
});

cdb.admin.User = cdb.core.Model.extend({

  urlRoot: '/api/v1/users',

  defaults: {
    avatar_url: 'http://cartodb.s3.amazonaws.com/static/public_dashboard_default_avatar.png',
    username:   ''
  },

  initialize: function(attrs) {
    attrs = attrs || {};
    this.tables = [];
    // Removing avatar_url attribute if it comes as null
    // Due to a Backbone Model constructor uses _.extends
    // instead of _.defaults
    if (this.get("avatar_url") === null) {
      this.set("avatar_url", this.defaults.avatar_url);
    }

    if (this.get("get_layers")) {
      this.layers = new cdb.admin.UserLayers();
      this.layers.user = this;
      this._fetchLayers();
    }

    this.email = (typeof attrs.email !== 'undefined') ? attrs.email : '';

    if (this.get('organization')) {
      this.organization = new cdb.admin.Organization(
        this.get('organization'),
        {
          currentUserId: this.id
        }
      );
    }

    this.groups = new cdb.admin.UserGroups(attrs.groups, {
      organization: _.result(this.collection, 'organization') || this.organization
    });
  },

  isInsideOrg: function() {
    if (this.organization) {
      return this.organization.id != false || this.isOrgOwner();
    }
    return false;
  },

  isOrgOwner: function() {
    if (this.organization) {
      return this.organization.owner.get('id') === this.get('id')
    }
    return false;
  },

  isOrgAdmin: function () {
    if (this.organization) {
      return this.organization.isOrgAdmin(this);
    }
    return false;
  },

  isViewer: function() {
    return this.get('viewer') == true;
  },

  isBuilder: function() {
    return !this.isViewer();
  },

  nameOrUsername: function() {
    return this.get('name') || this.get('username');
  },

  renderData: function(currentUser) {
    var name = this.get('username');
    if (currentUser && currentUser.id === this.id) {
      name = _t('You');
    }
    return {
      username: name,
      avatar_url: this.get('avatar_url')
    }

  },

  _fetchLayers: function() {
    this.layers.fetch({ add: true });
  },

  fetchTables: function() {
    var self = this;
    if (this._fetchingTables)  return;
    var tables = new cdb.admin.Visualizations();
    tables.options.set('type', 'table')
    tables.bind('reset', function() {
      self.tables = tables.map(function(u) { return u.get('name'); })
    })
    this._fetchingTables = true;
    tables.fetch();
  },

  hasCreateDatasetsFeature: function() {
    return this.isBuilder();
  },

  canCreateDatasets: function() {
    if (!this.get('remaining_byte_quota') || this.get('remaining_byte_quota') <= 0) {
      return false
    }
    return this.hasCreateDatasetsFeature();
  },

  hasCreateMapsFeature: function() {
    return this.isBuilder();
  },

  canAddLayerTo: function(map) {
    if (!map || !map.layers || !map.layers.getDataLayers) {
      throw new Error("Map model is not defined or wrong");
    }
    var dataLayers = map.layers.getDataLayers();
    return dataLayers.length < this.getMaxLayers();
  },

  getMaxLayers: function() {
    return ( this.get('limits') && this.get('limits').max_layers ) || 5;
  },

  getMaxConcurrentImports: function() {
    return ( this.get('limits') && this.get('limits').concurrent_imports ) || 1;
  },

  featureEnabled: function(name) {
    var featureFlags = this.get('feature_flags');
    if (!featureFlags || featureFlags.length === 0 || !name) {
      return false;
    }

    return _.contains(featureFlags, name)
  },

  isCloseToLimits: function() {
    var quota = this.get("quota_in_bytes");
    var remainingQuota = this.get("remaining_byte_quota");
    return ( (remainingQuota * 100) / quota ) < 20
  },

  getMaxLayersPerMap: function() {
    return this.get('max_layers') || 4;
  },

  canStartTrial: function() {
    return !this.isInsideOrg() && this.get("account_type") === 'FREE' && this.get("table_count") > 0
  },

  canCreatePrivateDatasets: function() {
    var actions = this.get('actions');
    return actions && actions.private_tables;
  },

  equals: function(otherUser) {
    if (otherUser.get) {
      return this.get('id') === otherUser.get('id');
    }
  },

  viewUrl: function() {
    return new cdb.common.UserUrl({
      base_url: this.get('base_url'),
      is_org_admin: this.isOrgAdmin()
    });
  },

  upgradeContactEmail: function() {
    if (this.isInsideOrg()) {
      if (this.isOrgOwner()) {
        return 'enterprise-support@carto.com';
      } else {
        return this.organization.owner.get('email');
      }
    } else {
      return 'support@carto.com';
    }
  },

  usedQuotaPercentage: function() {
    return (this.get('db_size_in_bytes') * 100) / this.organization.get('available_quota_for_user');
  },

  assignedQuotaInRoundedMb: function () {
    return Math.floor(this.get('quota_in_bytes')/1024/1024).toFixed(0);
  },

  assignedQuotaPercentage: function() {
    return (this.get('quota_in_bytes') * 100) / this.organization.get('available_quota_for_user');
  }

});


/**
 * manages a cartodb permission object, it contains:
 * - owner: an cdb.admin.User instance
 * - acl: a collection which includes the user and their permission.
 *
 *   see https://github.com/Vizzuality/cartodb-management/wiki/multiuser-REST-API#permissions-object
 *
 *   this object is not created to work alone, it should be a member of an object like visualization
 *   table
 */
cdb.admin.Permission = cdb.core.Model.extend({


  urlRoot: '/api/v1/perm',

  initialize: function() {
    this.acl = new Backbone.Collection();
    this.owner = null;
    this._generateOwner();
    this._generateAcl();
    this.bind('change:owner', this._generateOwner, this);
    this.bind('change:acl', this._generateAcl, this);
  },

  _generateOwner: function() {
    if (!this.owner) {
      this.owner = new cdb.admin.User();
    }
    this.owner.set(this.get('owner'));
  },

  _generateAcl: function() {
    this.acl.reset([], { silent: true });
    _.each(this.get('acl'), function(aclItem) {
      var model;
      switch (aclItem.type) {
        case 'user':
          model = new cdb.admin.User(aclItem.entity);
          break;
        case 'org':
          model = new cdb.admin.Organization(aclItem.entity);
          break;
        case 'group':
          model = new cdb.admin.Group(aclItem.entity);
          break;
        default:
          throw new Error("Unknown ACL item type: " + aclItem.type);
      }
      this._grantAccess(model, aclItem.access);
    }, this);
  },

  cleanPermissions: function() {
    this.acl.reset();
  },

  hasAccess: function(model) {
    // Having at least read access is the same as having any access
    return this.hasReadAccess(model);
  },

  hasReadAccess: function(model) {
    // If there is a representable ACL item it must be one of at least READ_ONLY access
    return !!this.findRepresentableAclItem(model);
  },

  hasWriteAccess: function(model) {
    var access = cdb.Utils.result(this.findRepresentableAclItem(model), 'get', 'access');
    return access === cdb.admin.Permission.READ_WRITE;
  },

  canChangeReadAccess: function(model) {
    return this._canChangeAccess(model);
  },

  canChangeWriteAccess: function(model) {
    return (!model.isBuilder || model.isBuilder()) && this._canChangeAccess(model, function(representableAclItem) {
      return cdb.Utils.result(representableAclItem, 'get', 'access') !== cdb.admin.Permission.READ_WRITE;
    })
  },

  _canChangeAccess: function(model) {
    var representableAclItem = this.findRepresentableAclItem(model);
    return this.isOwner(model) || !representableAclItem ||
      representableAclItem === this._ownAclItem(model) || cdb.Utils.result(arguments, 1, representableAclItem) || false;
  },

  grantWriteAccess: function(model) {
    this._grantAccess(model, this.constructor.READ_WRITE);
  },

  grantReadAccess: function(model) {
    this._grantAccess(model, this.constructor.READ_ONLY);
  },

  revokeWriteAccess: function(model) {
    // Effectively "downgrades" to READ_ONLY
    this.grantReadAccess(model);
  },

  /**
   * Revokes access to a set of items
   * @param {Object} model A single model or an array of models
   */
  revokeAccess: function(model) {
    var aclItem = this._ownAclItem(model);
    if (aclItem) {
      this.acl.remove(aclItem);
    }
  },

  isOwner: function(model) {
    return _.result(this.owner, 'id') === _.result(model, 'id');
  },

  toJSON: function() {
    return {
      entity: this.get('entity'),
      acl: this.acl.toJSON()
    };
  },

  getUsersWithAnyPermission: function() {
    return this.acl.chain()
      .filter(this._hasTypeUser)
      .map(this._getEntity)
      .value();
  },

  isSharedWithOrganization: function() {
    return this.acl.any(this._hasTypeOrg);
  },

  clone: function() {
    var attrs = _.clone(this.attributes);
    delete attrs.id;
    return new cdb.admin.Permission(attrs);
  },

  /**
   * Overwrite this ACL list from other permission object
   * @param otherPermission {Object} instance of cdb.admin.Permission
   */
  overwriteAcl: function(otherPermission) {
    this.acl.reset(otherPermission.acl.models);
  },

  // Note that this may return an inherited ACL item
  // use ._ownAclItem instead if only model's own is wanted (if there is any)
  findRepresentableAclItem: function(model) {
    if (this.isOwner(model)) {
      return this._newAclItem(model, this.constructor.READ_WRITE);
    } else {
      var checkList = ['_ownAclItem', '_organizationAclItem', '_mostPrivilegedGroupAclItem'];
      return this._findMostPrivilegedAclItem(checkList, function(fnName) {
        return this[fnName](model);
      });
    }
  },

  _hasTypeUser: function(m) {
    return m.get('type') === 'user';
  },

  _getEntity: function(m) {
    return m.get('entity');
  },

  _hasTypeOrg: function(m) {
    return m.get('type') === 'org';
  },

  _isOrganization: function(object) {
    return object instanceof cdb.admin.Organization;
  },

  _ownAclItem: function(model) {
    if (!model || !_.isFunction(model.isNew)) {
      cdb.log.error('model is required to find an ACL item');
    }
    if (!model.isNew()) {
      return this.acl.find(function(aclItem) {
        return aclItem.get('entity').id === model.id;
      });
    }
  },

  _organizationAclItem: function(m) {
    var org = _.result(m.collection, 'organization') || m.organization;
    if (org) {
      return this._ownAclItem(org);
    }
  },

  _mostPrivilegedGroupAclItem: function(m) {
    var groups = _.result(m.groups, 'models');
    if (groups) {
      return this._findMostPrivilegedAclItem(groups, this._ownAclItem);
    }
  },

  /**
   * Iterates over a items in given list using the iteratee, stops and returns when found the ACL item with best access (i.e. READ_WRITE), or the
   * list is completed.
   * @param {Array} list
   * @param {Function} iteratee that takes an item from list and returns an access
   *   iteratee is called in context of this model.
   * @Return {String} 'r', 'rw', or undefined if there were no access for given item
   */
  _findMostPrivilegedAclItem: function(list, iteratee) {
    var aclItem;
    for (var i = 0, x = list[i]; x && cdb.Utils.result(aclItem, 'get', 'access') !== cdb.admin.Permission.READ_WRITE; x = list[++i]) {
      // Keep last ACL item if iteratee returns nothing
      aclItem = iteratee.call(this, x) || aclItem;
    }
    return aclItem;
  },

  /**
   * Grants access to a set of items
   * @param {Object} model
   * @param {String} access can take the following values:
   * - 'r': read only
   * - 'rw': read and write permission
   */
  _grantAccess: function(model, access) {
    var aclItem = this._ownAclItem(model);
    if (aclItem) {
      aclItem.set('access', access);
    } else {
      aclItem = this._newAclItem(model, access);
      if (aclItem.isValid()) {
        this.acl.add(aclItem);
      } else {
        throw new Error(access + ' is not a valid ACL access');
      }
    }
  },

  _newAclItem: function(model, access) {
    var type;
    if (model instanceof cdb.admin.User) {
      type = 'user'
    } else if (model instanceof cdb.admin.Group) {
      type = 'group';
    } else if (this._isOrganization(model)) {
      type = 'org';
    } else {
      throw new Error('model not recognized as a valid ACL entity ' + model);
    }

    return new cdb.admin.ACLItem({
      type: type,
      entity: model,
      access: access
    });
  }

}, {

  READ_ONLY: 'r',
  READ_WRITE: 'rw'

});

//TODO: add validation
cdb.admin.ACLItem = Backbone.Model.extend({
  defaults: {
    access: 'r'
  },

  isOwn: function(model) {
    return model.id === this.get('entity').id;
  },

  validate: function(attrs, options) {
    var p = cdb.admin.Permission;
    if (attrs.access !== p.READ_ONLY && attrs.access !== p.READ_WRITE) {
      return "access can't take 'r' or 'rw' values";
    }
  },

  toJSON: function() {
    var entity = _.pick(this.get('entity').toJSON(), 'id', 'username', 'avatar_url', 'name');
    // translate name to username
    if (!entity.username) {
      entity.username = entity.name;
      delete entity.name;
    }
    return {
      type: this.get('type') || 'user',
      entity: entity,
      access: this.get('access')
    };
  }
});

/**
 * A collection representing a set of users in a group.
 */
cdb.admin.GroupUsers = Backbone.Collection.extend({

  model: cdb.admin.User,

  initialize: function(models, opts) {
    if (!opts.group) throw new Error('group is required');
    this.group = opts.group;
  },

  url: function() {
    return this.group.url.apply(this.group, arguments) + '/users';
  },

  parse: function(response) {
    this.total_entries = response.total_entries;
    this.total_user_entries = response.total_user_entries;

    return response.users;
  },

  /**
   * Batch add users
   * @param {Array} userIds
   * @return {Object} a deferred jqXHR object
   */
  addInBatch: function(userIds) {
    return this._batchAsyncProcessUsers('POST', userIds);
  },

  removeInBatch: function(userIds) {
    var self = this;
    return this._batchAsyncProcessUsers('DELETE', userIds)
      .done(function() {
        _.each(userIds, self.remove.bind(self));
      });
  },

  _batchAsyncProcessUsers: function(method, ids) {
    var self = this;

    // postpone relving promise since the fetch is requries for collection to have accurate state
    var deferred = $.Deferred();
    $.ajax({
      type: method,
      url: cdb.config.prefixUrl() + this.url(),
      data: {
        users: ids
      },
      success: function() {
        var args = arguments;

        // because add/remove don't return any data, so need to fetch to get accurate state
        self.fetch({
          success: function() {
            deferred.resolve.apply(deferred, args);
          },
          error: function() {
            // could not update state, but resolve anyway since batch operation worked
            // might have inconsistent state though
            deferred.resolve.apply(deferred, args);
          }
        })
      },
      error: function() {
        deferred.reject.apply(deferred, arguments);
      }
    });

    return deferred;
  },

  // @return {Number, undefined} may be undefined until a first fetch is done
  totalCount: function() {
    return this.total_user_entries;
  }

});

/**
 * Model representing an entity (user, group, etc.) that may share a Visualization.
 * Actual model is wrapped with additional metadata for the grantable context.
 */
cdb.admin.Grantable = cdb.core.Model.extend({

  initialize: function() {
    this.entity = this._createEntity();
  },

  // @return {Object} instance of the real model this grantable entitity represents
  //   Keep in mind that this returns a new instance of that model (i.e. not a cache version)
  _createEntity: function() {
    var className = cdb.Utils.capitalize(this.get('type'));
    var model = new cdb.admin[className](this.get('model'));
    model.organization = this.collection.organization;
    return model;
  }

});

/**
 * A collection of Grantable objects.
 */
cdb.admin.Grantables = Backbone.Collection.extend({

  model: cdb.admin.Grantable,

  url: function(method) {
    var version = cdb.config.urlVersion('organizationGrantables', method);
    return '/api/' + version + '/organization/' + this.organization.id + '/grantables';
  },

  initialize: function(users, opts) {
    if (!opts.organization) throw new Error('organization is required');
    this.organization = opts.organization;
    this.currentUserId = opts.currentUserId;
    this.sync = Backbone.syncAbort; // adds abort behaviour
  },

  parse: function(response) {
    this.total_entries = response.total_entries;

    return _.reduce(response.grantables, function(memo, m) {
      if (m.id === this.currentUserId) {
        this.total_entries--;
      } else {
        memo.push(m);
      }

      return memo;
    }, [], this);
  },

  // @return {Number, undefined} may be undefined until a first fetch is done
  totalCount: function() {
    return this.total_entries;
  }

});

/**
 * this model contains information about the organization for
 * the current user and the users who are inside the organizacion.
 *
 * Attributes:
 * - users: collection with user instances whithin the organization (see cdb.admin.Organization.Users
 */
cdb.admin.Organization = cdb.core.Model.extend({

  url: '/api/v1/org/',

  initialize: function(attrs, opts) {
    attrs = attrs || {}
    this.owner = new cdb.admin.User(this.get('owner'));

    this.display_email = (typeof attrs.admin_email != 'undefined') && attrs.admin_email != null && (attrs.admin_email == '' ? this.owner.email : attrs.admin_email);

    var collectionOpts = {
      organization: this,
      currentUserId: opts && opts.currentUserId
    };
    this.users = new cdb.admin.Organization.Users(attrs.users, collectionOpts);
    this.groups = new cdb.admin.OrganizationGroups(attrs.groups, collectionOpts);
    this.grantables = new cdb.admin.Grantables(undefined, collectionOpts);

    // make sure all the users/groups have a reference to this organization
    this.users.each(this._setOrganizationOnModel, this);
    this.groups.each(this._setOrganizationOnModel, this);
  },

  _setOrganizationOnModel: function(m) {
    m.organization = this;
  },

  fetch: function() {
    throw new Error("organization should not be fetch, should be static");
  },

  containsUser: function(user) {
    return !!this.users.find(function(u) {
      return u.id === user.id;
    })
  },

  isOrgAdmin: function (user) {
    return this.owner.id === user.id || !!_.find(this.get('admins'), function (u) {
      return u.id === user.id;
    });
  },

  viewUrl: function() {
    return new cdb.common.OrganizationUrl({
      base_url: this.get('base_url')
    })
  }

});

// helper to manage organization users
cdb.admin.Organization.Users = Backbone.Collection.extend({

  model: cdb.admin.User,
  _DEFAULT_EXCLUDE_CURRENT_USER: true,

  url: function() {
    return '/api/v1/organization/' + this.organization.id + '/users';
  },

  initialize: function(models, opts) {
    if (!opts.organization) {
      throw new Error('Organization is needed for fetching organization users');
    }
    this.elder('initialize');
    this.organization = opts.organization;

    this.currentUserId = opts.currentUserId;
    this._excludeCurrentUser = this._DEFAULT_EXCLUDE_CURRENT_USER;

    // Let's add abort behaviour
    this.sync = Backbone.syncAbort;
  },

  comparator: function(mdl) {
    return mdl.get('username');
  },

  excludeCurrentUser: function(exclude) {
    exclude = !!exclude;
    this._excludeCurrentUser = exclude;
    if (exclude && !this.currentUserId) {
      cdb.log.error('set excludeCurrentUser to true, but there is no current user id set to exclude!');
    }
  },

  restoreExcludeCurrentUser: function() {
    this.excludeCurrentUser(this._DEFAULT_EXCLUDE_CURRENT_USER);
  },

  parse: function(r) {
    this.total_entries = r.total_entries;
    this.total_user_entries = r.total_user_entries;

    return _.reduce(r.users, function(memo, user) {
      if (this._excludeCurrentUser && user.id === this.currentUserId) {
        this.total_user_entries--;
        this.total_entries--;
      } else {
        memo.push(user);
      }
      return memo;
    }, [], this);
  },

  // @return {Number, undefined} may be undefined until a first fetch is done
  totalCount: function() {
    return this.total_user_entries;
  }
});

cdb.admin.Organization.Invites = cdb.core.Model.extend({

  defaults: {
    users_emails: [],
    welcome_text: 'I\'d like to invite you to my CARTO organization,\nBest regards'
  },

  url: function() {
    return '/api/v1/organization/' + this.organizationId + '/invitations';
  },

  initialize: function(attrs, opts) {
    if (!opts.organizationId) {
      throw new Error('Organization id is needed for fetching organization users');
    } else {
      this.organizationId = opts.organizationId;
    }
  }

});

cdb.admin.Like = cdb.core.Model.extend({

  defaults: {
    likeable: true
  },

  url: function(method) {
    var version = cdb.config.urlVersion('like', method)
    return '/api/' + version + '/viz/' + this.get("vis_id") + '/like';
  },

  initialize: function() {

    _.bindAll(this, "_onSaveError");

    this.on("destroy", function() {
      this.set({ liked: false, likes: this.get("likes") - 1 });
    }, this);

  },

  _onSaveError: function(model, response) {
    this.trigger("error", {
      status: response.status,
      statusText: response.statusText
    });
  },

  toggleLiked: function() {

    if (this.get("liked")) {
      this.destroy();
    } else {
      this.set({ id: null }, { silent: true });
      this.save({}, { error: this._onSaveError });
    }
  }

}, {

  newByVisData: function(opts) {
    var d = _.defaults({
      id: opts.liked ? opts.vis_id : null
    }, _.omit(opts, 'url'));

    var m = new cdb.admin.Like(d);

    if (opts.url) {
      m.url = opts.url;
    }

    return m;
  }
});



  /**
   *  Synced table model
   */

  cdb.admin.TableSynchronization = cdb.core.Model.extend({

    _X:         1.2,  // Multiply current interval for this number
    _INTERVAL:  1500, // Interval time between poll checkings
    _STATES:    ['created', 'failure', 'success', 'syncing', 'queued'],

    defaults: {
      name: '',
      url: '',
      state: '',
      run_at: 0,
      ran_at: 0,
      retried_times: 0,
      interval: 0,
      error_code: 0,
      error_message: '',
      service_name: '',
      service_item_id: '',
      content_guessing: true,
      type_guessing: true
    },

    url: function(method) {
      var version = cdb.config.urlVersion('synchronization', method);

      var base = '/api/' + version + '/synchronizations/';
      if (this.isNew()) {
        return base;
      }
      return base + this.id;
    },

    initialize: function() {
      this.bind('destroy', function() {
        this.unset('id');
      });
    },

    toJSON: function() {
      var c = _.clone(this.attributes);

      var d = {
        url:      c.url,
        interval: c.interval,
        content_guessing: c.content_guessing,
        type_guessing: c.type_guessing,
        create_vis: c.create_vis
      };

      if (c.type === "remote") {
        _.extend(d, {
          remote_visualization_id: c.remote_visualization_id,
          create_vis: false,
          value: c.value
        });
      }

      if(c.id !== undefined) {
        d.id = c.id;
      }

      // Comes from a service?
      if(c.service_name) {
        d.service_name = c.service_name;
        d.service_item_id = c.service_item_id;
      }

      return d;
    },

    syncNow: function(callback) {
      $.ajax({
        url:  cdb.config.prefixUrl() + this.url() + '/sync_now',
        type: 'PUT'
      }).always(callback)
    },

    // Checks for poll to finish
    pollCheck: function(i) {
      var self = this;
      var interval = this._INTERVAL;

      this.pollTimer = setInterval(request , interval);

      function request() {
        self.destroyCheck();

        self.fetch({
          error: function(m, e) {
            self.set({
              error_message:  e.statusText || "",
              state:          'failure'
            });
          }
        });

        interval = interval * self._X;

        self.pollTimer = setInterval(request, interval);
      }
    },

    destroyCheck: function() {
      clearInterval(this.pollTimer);
    },

    isSync: function() {
      return !this.isNew();
    },

    linkToTable: function(table) {
      var self = this;
      if (table.has('synchronization')) {
        this.set(table.get('synchronization'));
      }

      table.bind('change:synchronization', function() {
        self.set(table.get('synchronization'));
      }, table);

      table.bind('destroy', function destroy() {
        self.unbind(null, null, table);
        self.destroy();
      }, table);
      //TODO: manage table renaming
    }

  });


cdb.admin.WKT = {
  types: [
    'POINT',
    'LINESTRING',
    'POLYGON',
    'MULTIPOINT',
    'MULTILINESTRING',
    'MULTIPOLYGON'
  ]
};


/*
 * this model is created to manage the visualization order. In order to simplify API
 * the order is changed using a double linked list instead of a order attribute.
 */
cdb.admin.VisualizationOrder = cdb.core.Model.extend({

  url: function(method) {
    return this.visualization.url(method) + "/next_id"
  },

  initialize: function () {
    this.visualization = this.get('visualization');
    //set id so PUT is used
    this.set('id', this.visualization.id);
    this.unset('visualization');
  }
});

cdb.admin.Visualization = cdb.core.Model.extend({

  defaults: {
    bindMap: true
  },

  url: function(method) {
    var version = cdb.config.urlVersion('visualization', method);
    var base = '/api/' + version + '/viz';
    if (this.isNew()) {
      return base;
    }
    return base + '/' + this.id;
  },

  INHERIT_TABLE_ATTRIBUTES: [
    'name', 'description', 'privacy'
  ],

  initialize: function() {
    this.map = new cdb.admin.Map();

    this.permission = new cdb.admin.Permission(this.get('permission'));
    this.overlays = new cdb.admin.Overlays([]);
    this.overlays.vis = this;

    this.initSlides();
    this.bind('change:type', this.initSlides);

    this.transition = new cdb.admin.SlideTransition(this.get('transition_options'), { parse: true });
    this.order = new cdb.admin.VisualizationOrder({ visualization: this });

    this.like = cdb.admin.Like.newByVisData({
      vis_id: this.id,
      liked: this.get("liked"),
      likes: this.get("likes")
    });

    // Check if there are related tables and generate the collection
    if (this.get('type') === "derived" && this.get('related_tables')) this.generateRelatedTables();

    // Check if there are dependant visualizations and generate the collection //
    // TODO //

    if (this.get('bindMap')) this._bindMap();
    this.on(_(this.INHERIT_TABLE_ATTRIBUTES).map(function(t) { return 'change:' + t }).join(' '),  this._changeAttributes, this);

    this._initBinds();
  },

  initSlides: function() {
    if (this.slides) return this;
    // slides only for derived visualizations
    // and working with map enabled
    if (this.get('type') === 'derived' && this.get('bindMap')) {
      this.slides = new cdb.admin.Slides(this.get('children'), { visualization: this });
      this.slides.initializeModels();
    } else {
      this.slides = new cdb.admin.Slides([], { visualization: this });
    }
    return this;
  },

  activeSlide: function(c) {
    if (c >= 0 && c < this.slides.length) {
      this.slides.setActive(this.slides.at(c));
    }
    return this;
  },

  // set master visualization. Master manages id, name and description changes
  setMaster: function(master_vis) {

    var self = this;

    master_vis.bind('change:id', function() {
      self.changeTo(master_vis);
      self.slides.master_visualization_id = master_vis.id;
    }, this);

    master_vis.bind('change', function() {
      var c = master_vis.changedAttributes();
      if (c.type) self.set('type', master_vis.get('type'));
      self.set('description', master_vis.get('description'));
      if (c.name) self.set('name', master_vis.get('name'));
      if (c.privacy) self.set('privacy', master_vis.get('privacy'));
    });

  },

  enableOverlays: function() {
    this.bind('change:id', this._fetchOverlays, this);
    if (!this.isNew()) this._fetchOverlays();
  },

  _fetchOverlays: function() {
    this.overlays.fetch({ reset: true });
  },

  _initBinds: function() {
    this.permission.acl.bind('reset', function() {
      // Sync the local permission object w/ the raw data, so vis.save don't accidentally overwrites permissions changes
      this.set('permission', this.permission.attributes, { silent: true });
      this.trigger('change:permission', this);
    }, this);

    // Keep permission model in sync, e.g. on vis.save
    this.bind('change:permission', function() {
      this.permission.set(this.get('permission'));
    }, this);
  },

  isLoaded: function() {
    return this.has('privacy') && this.has('type');
  },


  generateRelatedTables: function(callback) {
    var tables = this.get('related_tables');

    if (tables.length) {
      var collection = new Backbone.Collection([]);

      for (var i = 0, l = tables.length; i < l; i++) {
        var table = new cdb.admin.CartoDBTableMetadata(tables[i]);
        collection.add(table);
      }

      this.related_tables = collection;
      callback && callback.success && callback.success();
    }
  },

  getRelatedTables: function(callback, options) {
    options = options || {};
    if (this.get('type') === "derived") {

      if (!options.force && this.get('related_tables')) {
        this.generateRelatedTables(callback);
        return;
      }

      var self = this;
      this.fetch({
        success: function() {
          self.generateRelatedTables(callback);
        },
        error: callback && callback.error && callback.error
      });
    }
  },

  /**
   * Get table metadata related to this vis.
   * Note that you might need to do a {metadata.fetch()} to get full data.
   *
   * @returns {cdb.admin.CartoDBTableMetadata} if this vis represents a table
   * TODO: when and when isn't it required to do a fetch really?
   */
  tableMetadata: function() {
    if (!this._metadata) {
      this._metadata = new cdb.admin.CartoDBTableMetadata(this.get('table'));
    }
    return this._metadata;
  },

  _bindMap: function() {

    this.on('change:map_id', this._fetchMap, this);

    this.map.bind('change:id', function() {
      this.set('map_id', this.map.id);
    }, this);

    this.map.set('id', this.get('map_id'));

    // when the layers change we should reload related_tables
    this.map.layers.bind('change:id remove', function() {
      this.getRelatedTables(null, {
        force: true
      });
    }, this);

  },

  /**
   *  Is this model a true visualization?
   */
  isVisualization: function() {
    return this.get('type') === "derived" || this.get('type') === 'slide';
  },

  /**
   *  Change current visualization by new one without
   *  creating a new instance.
   *
   *  When turn table visualization to derived visualization,
   *  it needs to wait until reset layers. If not, adding a new
   *  layer after create the new visualization won't work...
   *
   */
  changeTo: function(new_vis, callbacks) {
    this.set(new_vis.attributes, { silent: true });

    this.transition.set(new_vis.transition.attributes);

    var success = function() {
      this.map.layers.unbind('reset', success);
      this.map.layers.unbind('error', error);
      callbacks && callbacks.success && callbacks.success(this);
    };

    var error = function() {
      this.map.layers.unbind('reset', success);
      this.map.layers.unbind('error', error);
      callbacks && callbacks.error && callbacks.error();
    }

    this.map.layers.bind('reset', success, this);
    this.map.layers.bind('error', error, this)
    this.permission.set(new_vis.permission.attributes);
    this.set({ map_id: new_vis.get('map_id') });

    // Get related tables from the new visualization
    this.getRelatedTables();
  },

  /**
   *  Transform a table visualization/model to a original visualization
   */
  changeToVisualization: function(callback) {
    var self = this;
    if (!this.isVisualization()) {
      var callbacks = {
        success: function(new_vis) {
          self.changeTo(new_vis, callback);
          self.notice('', '', 1000);
        },
        error: function(e) {
          var msg = 'error changing to visualization';
          self.error(msg, e);
          callback && callback.error(e, msg);
        }
      };
      // Name is not saved in the back end, due to that
      // we need to pass it as parameter
      this.copy({ name: this.get('name'), description: this.get('description') }, callbacks);
    } else {
      self.notice('', '', 1000);
    }
    return this;
  },

  parse: function(data) {
    if (this.transition && data.transition_options) {
      this.transition.set(this.transition.parse(data.transition_options));
    }

    if (this.like) {
      this.like.set({ vis_id: this.id, likes: this.get("likes"), liked: this.get("liked") })
    }

    return data;
  },

  toJSON: function() {
    var attr = _.clone(this.attributes);
    delete attr.bindMap;
    delete attr.stats;
    delete attr.related_tables;
    delete attr.children;
    attr.map_id = this.map.id;
    attr.transition_options = this.transition.toJSON();
    return attr;
  },

  /**
   *  Create a child (slide) from current visualization. It clones layers but no overlays
   */
  createChild: function(attrs, options) {
    attrs = attrs || {};
    options = options || {};
    var vis = new cdb.admin.Visualization(
      _.extend({
          copy_overlays: false,
          type: 'slide',
          parent_id: this.id
        },
        attrs
      )
    );
    vis.save(null, options);
    return vis;
  },

  /**
   *  Create a copy of the visualization model
   */
  copy: function(attrs, options) {
    attrs = attrs || {};
    options = options || {};
    var vis = new cdb.admin.Visualization(
      _.extend({
          source_visualization_id: this.id
        },
        attrs
      )
    );
    vis.save(null, options);
    return vis;
  },

  /**
   *  Fetch map information
   */
  _fetchMap: function() {
    this.map
      .set('id', this.get('map_id'))
      .fetch();
  },

  /**
   *  Generic function to catch up new attribute changes
   */
  _changeAttributes: function(m, c) {
    if (!this.isVisualization()) {

      // Change table attribute if layer is CartoDB-layer
      var self = this;

      this.map.layers.each(function(layer) {
        if (layer.get('type').toLowerCase() == "cartodb") {

          // If there isn't any changed attribute
          if (!self.changedAttributes()) { return false; }

          var attrs = _.pick(self.changedAttributes(), self.INHERIT_TABLE_ATTRIBUTES);

          if (attrs) layer.fetch();
        }
      })
    }
  },


  // PUBLIC FUNCTIONS

  publicURL: function() {
    var url = this.permission.owner.viewUrl();
    return url + "/viz/" + this.get('id') + "/public_map";
  },

  deepInsightsUrl: function(user) {
    var url = user.viewUrl();
    return url + "/bivisualizations/" + this.get('id') + "/embed_map";
  },

  embedURL: function() {
    var url = this.permission.owner.viewUrl();
    return url + "/viz/" + this.get('id') + "/embed_map";
  },

  vizjsonURL: function() {
    var url = this.permission.owner.viewUrl();
    var version = cdb.config.urlVersion('vizjson', 'read', 'v2');
    return url + '/api/' + version + '/viz/' + this.get('id') + "/viz.json";
  },

  notice: function(msg, type, timeout) {
    this.trigger('notice', msg, type, timeout);
  },

  error: function(msg, resp) {
    this.trigger('notice', msg, 'error');
  },

  // return: Array of entities (user or organizations) this vis is shared with
  sharedWithEntities: function() {
    return _.map((this.permission.acl.toArray() || []), function(aclItem) {
      return aclItem.get('entity')
    });
  },

  privacyOptions: function() {
    if (this.isVisualization()) {
      return cdb.admin.Visualization.ALL_PRIVACY_OPTIONS;
    } else {
      return _.reject(cdb.admin.Visualization.ALL_PRIVACY_OPTIONS, function(option) {
        return option === 'PASSWORD';
      });
    }
  },

  isOwnedByUser: function(user) {
    return user.equals(this.permission.owner);
  },

  /**
   * Get the URL for current instance.
   * @param {Object} currentUser (Optional) Get the URL from the perspective of the current user, necessary to
   *   correctly setup URLs to tables.
   * @return {Object} instance of cdb.common.Url
   */
  viewUrl: function(currentUser) {
    var owner = this.permission.owner;
    var userUrl = this.permission.owner.viewUrl();

    // the undefined check is required for backward compability, in some cases (e.g. dependant visualizations) the type
    // is not available on the attrs, if so assume the old behavior (e.g. it's a visualization/derived/map).
    if (this.isVisualization() || _.isUndefined(this.get('type'))) {
      var id = this.get('id')
      if (currentUser && currentUser.id !== owner.id && this.permission.hasAccess(currentUser)) {
        userUrl = currentUser.viewUrl();
        id = owner.get('username') + '.' + id;
      }
      return new cdb.common.MapUrl({
        base_url: userUrl.urlToPath('viz', id)
      });
    } else {
      if (currentUser && this.permission.hasAccess(currentUser)) {
        userUrl = currentUser.viewUrl();
      }
      return new cdb.common.DatasetUrl({
        base_url: userUrl.urlToPath('tables', this.tableMetadata().getUnquotedName())
      });
    }
   },

  /**
   * Returns the URL, server-side generated
   */
  _canonicalViewUrl: function() {
    var isMap = this.isVisualization() || _.isUndefined(this.get('type'));
    var UrlModel = isMap ? cdb.common.MapUrl : cdb.common.DatasetUrl;
    return new UrlModel({
      base_url: this.get('url')
    });
  }

}, {

  ALL_PRIVACY_OPTIONS: [ 'PUBLIC', 'LINK', 'PRIVATE', 'PASSWORD' ]

});





/**
 * Visualizations endpoint available for a given user.
 *
 * Usage:
 *
 *   var visualizations = new cdb.admin.Visualizations()
 *   visualizations.fetch();
 *
 */

cdb.admin.Visualizations = Backbone.Collection.extend({

  model: cdb.admin.Visualization,

  _PREVIEW_TABLES_PER_PAGE: 10,
  _TABLES_PER_PAGE: 20,
  _PREVIEW_ITEMS_PER_PAGE: 3,
  _ITEMS_PER_PAGE: 9,

  initialize: function() {

    var default_options = new cdb.core.Model({
      tag_name        : "",
      q               : "",
      page            : 1,
      type            : "derived",
      exclude_shared  : false,
      per_page        : this._ITEMS_PER_PAGE
    });

    // Overrriding default sync, preventing
    // run several request at the same time
    this.sync = Backbone.syncAbort;
    this.options = _.extend(default_options, this.options);

    this.total_entries = 0;

    this.options.bind("change", this._changeOptions, this);
    this.bind("reset",          this._checkPage, this);
    this.bind("update",         this._checkPage, this);
    this.bind("add",            this._fetchAgain, this);

  },

  getTotalPages: function() {
    return Math.ceil(this.total_entries / this.options.get("per_page"));
  },

  _checkPage: function() {
    var total = this.getTotalPages();
    var page = this.options.get('page') - 1;

    if (this.options.get("page") > total ) {
      this.options.set({ page: total + 1});
    } else if (this.options.get("page") < 1) {
      this.options.set({ page: 1});
    }

  },

  _createUrlOptions: function() {
    return _.compact(_(this.options.attributes).map(
      function(v, k) {
        return k + "=" + encodeURIComponent(v)
      }
    )).join('&');
  },

  url: function(method) {
    var u = '';

    // TODO: remove this workaround when bi-visualizations are included as
    // standard visualizations
    if (this.options.get('deepInsights')) {
      u += '/api/v1/bivisualizations';
      u += '?page=' + this.options.get('page') + '&per_page=' + this.options.get("per_page");
    } else {
      var version = cdb.config.urlVersion('visualizations', method);
      u += '/api/' + version + '/viz/';
      u += "?" + this._createUrlOptions();
    }

    return u;
  },

  remove: function(options) {
    this.total_entries--;
    this.elder('remove', options);
  },

  // add bindMap: false for all the visulizations
  // vis model does not need map information in dashboard
  parse: function(response) {
    this.total_entries = response.total_entries;
    this.slides && this.slides.reset(response.children);
    this.total_shared = response.total_shared;
    this.total_likes = response.total_likes;
    this.total_user_entries = response.total_user_entries;
    return _.map(response.visualizations, function(v) {
      v.bindMap = false;
      return v;
    });
  },

  _changeOptions: function() {
    // this.trigger('updating');

    // var self = this;
    // $.when(this.fetch()).done(function(){
    //   self.trigger('forceReload')
    // });
  },

  create: function(m) {
    var dfd = $.Deferred();
    Backbone.Collection.prototype.create.call(this,
      m,
      {
        wait: true,
        success: function() {
          dfd.resolve();

        },
        error: function() {
          dfd.reject();
        }
      }
    );
    return dfd.promise();
  },


  fetch: function(opts) {
    var dfd = $.Deferred();
    var self = this;
    this.trigger("loading", this);

    $.when(Backbone.Collection.prototype.fetch.call(this,opts))
    .done(function(res) {
      self.trigger('loaded');
      dfd.resolve();
    }).fail(function(res) {
      self.trigger('loadFailed');
      dfd.reject(res);
    });

    return dfd.promise();
  }
});

/**
 * tabbed pane.
 * if contains n views inside it and shows only one at once
 *
 * usage:
 *
 * var pane = new cdb.ui.common.TabPane({
 *   el: $("#container")
 * });
 *
 * pane.addTab('tab1', new OtherView());
 * pane.addTab('tab2', new OtherView2());
 * pane.addTab('tab3', new OtherView3());
 *
 * pane.active('tab1');
 *
 * pane.bind('tabEnabled', function(tabName, tabView) {
 * pane.bind('tabDisabled', function(tabName, tabView) {
 * });
 */
cdb.ui.common.TabPane = cdb.core.View.extend({

  initialize: function() {
      this.tabs = {};
      this.activeTab  = null;
      this.activePane = null;
  },

  addTab: function(name, view, options) {
    options = options || { active: true };
    if(this.tabs[name] !== undefined) {
      cdb.log.debug(name + "already added");
    } else {
      this.tabs[name] = view.cid;
      this.addView(view);
      if(options.after !== undefined) {
        var e = this.$el.children()[options.after];
        view.$el.insertAfter(e);
      } else if(options.prepend) {
        this.$el.prepend(view.el);
      } else {
        this.$el.append(view.el);
      }
      this.trigger('tabAdded', name, view);
      if(options.active) {
        this.active(name);
      } else {
        view.hide();
      }
    }
  },

  getPreviousPane: function() {
    var tabs  = _.toArray(this.tabs);
    var panes = _.toArray(this._subviews);

    var i = _.indexOf(tabs, this.activePane.cid) - 1;
    if (i < 0) i = panes.length - 1;

    return panes[i];
  },

  getNextPane: function() {
    var tabs  = _.toArray(this.tabs);
    var panes = _.toArray(this._subviews);

    var i = 1 + _.indexOf(tabs, this.activePane.cid);
    if (i > panes.length - 1) i = 0;

    return panes[i];
  },

  getPane: function(name) {
    var vid = this.tabs[name];
    return this._subviews[vid];
  },

  getActivePane: function() {
    return this.activePane;
  },

  size: function() {
    return _.size(this.tabs);
  },

  clean: function() {
    this.removeTabs();
    cdb.core.View.prototype.clean.call(this)
  },

  removeTab: function(name) {
    if (this.tabs[name] !== undefined) {
      var vid = this.tabs[name];
      this._subviews[vid].clean();
      delete this.tabs[name];

      if (this.activeTab == name) {
        this.activeTab = null;
      }

      if (_.size(this.tabs)) {
        this.active(_.keys(this.tabs)[0]);
      }
    }
  },

  removeTabs: function() {
    for(var name in this.tabs) {
      var vid = this.tabs[name];
      this._subviews[vid].clean();
      delete this.tabs[name];
    }
    this.activeTab = null;
  },

  active: function(name) {
    var
    self = this,
    vid  = this.tabs[name];

    if (vid !== undefined) {

      if (this.activeTab !== name) {

        var v = this._subviews[vid];

        if (this.activeTab) {
          var vid_old  = this._subviews[this.tabs[this.activeTab]];

          vid_old.hide();
          self.trigger('tabDisabled', this.activeTab , vid_old);
          self.trigger('tabDisabled:' + this.activeTab,  vid_old);
          if(vid_old.deactivated) {
            vid_old.deactivated();
          }
        }

        v.show();
        if(v.activated) {
          v.activated();
        }

        this.activeTab = name;
        this.activePane = v;

        self.trigger('tabEnabled', name, v);
        self.trigger('tabEnabled:' + name,  v);
      }

      return this.activePane;
    }
  },

  render: function() {
      return this;
  },

  each: function(fn) {
    var self = this;
    _.each(this.tabs, function(cid, tab) {
      fn(tab, self.getPane(tab));
    });
  }

});



  /**
   * User options dropdown (extends Dropdown)
   *
   * It shows the content in a dropdown (or dropup) with a special effect.
   *
   * Usage example:
   *
      var user_menu = new cdb.admin.DropdownMenu({
        target: $('a.account'),
        model: {username: username}, // No necessary indeed
        template_base: 'common/views/settings_item'
      });
   *
   */


  cdb.admin.DropdownMenu = cdb.ui.common.Dropdown.extend({

    show: function() {
      var dfd = $.Deferred();
      var self = this;
      //sometimes this dialog is child of a node that is removed
      //for that reason we link again DOM events just in case
      this.delegateEvents();
      this.$el
        .css({
          marginTop: self.options.vertical_position == "down" ? "-10px" : "10px",
          opacity:0,
          display:"block"
        })
        .animate({
          margin: "0",
          opacity: 1
        }, {
          "duration": this.options.speedIn,
          "complete": function(){
            dfd.resolve();
          }
        });
      this.trigger("onDropdownShown",this.el);

      return dfd.promise();
    },

    /**
     * open the dialog at x, y
     */
    openAt: function(x, y) {
      var dfd = $.Deferred();

      this.$el.css({
        top: y,
        left: x,
        width: this.options.width
      })
      .addClass(
        (this.options.vertical_position == "up" ? "vertical_top" : "vertical_bottom" )
        + " " +
        (this.options.horizontal_position == "right" ? "horizontal_right" : "horizontal_left" )
        + " " +
        // Add tick class
        "tick_" + this.options.tick
      )

      this.isOpen = true;

      // Show
      $.when(this.show()).done(function(){ dfd.resolve();})
      // xabel: I've add the deferred to make it easily testable

      return dfd.promise();
    },


    hide: function(done) {

      // don't attempt to hide the dropdown if it's already hidden
      if (!this.isOpen) { done && done(); return; }

      var self    = this;
      this.isOpen = false;

      this.$el.animate({

        marginTop: self.options.vertical_position == "down" ? "10px" : "-10px",
        opacity: 0

      }, this.options.speedOut, function(){

        // Remove selected class
        $(self.options.target).removeClass("selected");

        // And hide it
        self.$el.hide();
        done && done();

        self.trigger("onDropdownHidden", self.el);

      });
    }
  });


  /**
   *  String field -> Place to edit and capture string editions
   *  - It accepts a model with {attribute: 'colum', value: 'jamón'}
   *  var string = new cdb.admin.StringField({ model: model })
   */

  cdb.admin.StringField = cdb.core.View.extend({

    tagName: 'div',
    className: 'field string',

    default_options: {
      template_name:  'old_common/views/forms/string_field',
      label:          false,
      autoResize:     true,
      readOnly:       false
    },

    events: {
      'change textarea':    '_onChange',
      'keydown textarea':  '_onKeyDown'
    },

    initialize: function() {
      _.defaults(this.options, this.default_options);

      _.bindAll(this, '_onChange', '_onKeyDown');

      this.template_base = this.options.template_base ? _.template(this.options.template_base) : cdb.templates.getTemplate(this.options.template_name);

      // Setting valid value from the beginning
      this.valid = true;

      // Get Operating System
      this._setOS();
    },

    render: function() {
      this.$el.html(this.template_base(_.extend(this.model.toJSON(), this.options)));

      if (this.options.readOnly) {
        this.undelegateEvents();
      }

      // Hack to resize correctly the textarea
      if (this.options.autoResize)
        this._resize();

      return this;
    },

    _setOS: function() {
      // Check if the SO is Mac or rest in order to use Ctrl or CMD + ENTER to save the value
      var ua = navigator.userAgent.toLowerCase();

      this.so = "rest";
      if (/mac os/.test(ua)) {
        this.so = "mac";
      }
    },

    // Public function to answer if the editor is valid or not
    isValid: function() {
      return this.valid;
    },

    _onChange: function(e) {
      var value = $(e.target).val();
      this.model.set('value', value);
    },

    _onKeyDown: function(e) {
      if (((this.so=="mac" && e.metaKey) || (this.so=="rest" && e.ctrlKey)) && e.keyCode == 13 ) {
        e.preventDefault();
        this._triggerEvent('ENTER');
        return false;
      }

      var value = $(e.target).val();

      this.model.set('value', value);

      if (this.options.autoResize)
        this._resize();
    },

    // Hack function to resize automatially textarea
    _resize: function() {
      var $textarea = this.$("textarea");

      // Hello hacky boy
      if ($textarea)
        setTimeout(function() {
          $textarea.height(20);
          $textarea.height($textarea[0].scrollHeight - 22);
        });
    },

    _triggerEvent: function(eventName, values) {
      this.trigger(eventName, values, this);
    }
  })


/**
 *  Color form view
 *
 *  - It is used in 'Marker fill', 'Polygon fill',...
 *
 */

cdb.forms.Color = cdb.core.View.extend({
  className: 'form-view form_color',

  events: {
    'click .image-picker' : '_openImagePicker',
    'click .color-picker' : '_openColorPicker'
  },

  initialize: function() {
    this.template = cdb.templates.getTemplate('old_common/views/color_form');
    this.property = this.options.property;
    this.model.bind('change', this.render, this);
    this.image_property = this.options.extra ? this.options.extra.image_property: null;
    this.image_kind = this.options.extra ? this.options.extra.image_kind: null;
    this.image_kind = this.image_kind || 'marker';
  },

  render: function() {
    this.$el.html(
      this.template({
        image_kind:     this.image_kind,
        image_property: this.image_property,
        image_value:    this.model.get(this.image_property),
        color:          this.model.get(this.property)
      })
    );

    if (this.image_property)
      this._createTooltips();

    return this;
  },

  _createTooltips: function() {
    this.addView(new cdb.common.TipsyTooltip({
      el: this.$(".image-picker"),
      delayIn:  100
    }));
  },

  _createPicker: function() {

    var tick, vertical_position, horizontal_position;

    if (this.options.extra) {

      if (this.options.extra.tick) {
        tick   = this.options.extra.tick;
      }

      if (this.options.extra.picker_vertical_position) {
        vertical_position   = this.options.extra.picker_vertical_position;
      }

      if (this.options.extra.picker_horizontal_position) {
        horizontal_position = this.options.extra.picker_horizontal_position;
      }
    }

    this.color_picker = new cdb.admin.ColorPicker({

      target: this.$el,
      colors: this.options.colors,
      extra_colors: this.options.extra_colors,
      tick: tick,
      vertical_position: vertical_position,
      horizontal_position: horizontal_position

    }).bind("colorChosen", function(color, close) {

      if (this.image_property == this.property) {
        this.model.set(this.property, color);
      } else {
        this.model.unset(this.image_property, { silent: true });
        this.model.set(this.property, color);
      }

      if (close) this._destroyPicker();

    }, this);

    this._bindColorPicker();
    this.addView(this.color_picker);
  },

  _destroyPicker: function() {
    if (this.color_picker) {
      this._unbindColorPicker();
      this.removeView(this.color_picker);
      this.color_picker.hide();
      delete this.color_picker;
    }
  },

  _bindColorPicker: function() {
    cdb.god.bind("closeDialogs",        this._destroyPicker, this);
    cdb.god.bind("closeDialogs:color",  this._destroyPicker, this);
  },

  _unbindColorPicker: function() {
    cdb.god.unbind("closeDialogs",        this._destroyPicker, this);
    cdb.god.unbind("closeDialogs:color",  this._destroyPicker, this);
  },

  setExtraColors: function(colors) {
    if (this.color_picker)
      this.color_picker.setColors('extra_colors', colors);
  },
  setColors: function(colors) {
    if (this.color_picker)
      this.color_picker.setColors('colors', colors);
  },

  _openImagePicker: function(e) {
    this.killEvent(e);

    if (!this.image_property) return this;

    cdb.god.trigger("closeDialogs:color");

    this.user = new cdb.admin.User(window.user_data);

    var dialog = new cdb.editor.ImagePickerView({
      user: this.user,
      kind: this.image_kind
    });
    dialog.appendToBody();
    dialog.bind('fileChosen', this._onImageFileChosen, this);
  },

  _onImageFileChosen: function(url) {
    if (this.image_property) {
      if (this.image_property !== this.property) {
        this.model.unset(this.property, { silent: true });
      }
      this.model.set(this.image_property, 'url(' + url + ')');
    }
  },

  _openColorPicker: function(e) {
    this.killEvent(e);

    if (this.color_picker) this._destroyPicker();

    cdb.god.trigger("closeDialogs:color");

    if (!this.color_picker) {
      this._createPicker();
      $('body').append(this.color_picker.render().el);
      this.color_picker.init(this.model.get(this.property));
    }
  }

});


/**
 *  Color widget with color picker showing
 *  all colors applied in the style.
 */
cdb.forms.ColorWizard = cdb.forms.Color.extend({

  _createPicker: function() {
    // Get wizard applied colors
    if (this.model.layer && this.model.layer.get('tile_style')) {
      var style = this.model.layer.get("tile_style");
      var cartoParser = new cdb.admin.CartoParser(style);
      this.options.extra_colors = cartoParser.colorsUsed({ mode: "hex" });
    }

    cdb.forms.Color.prototype._createPicker.call(this);
  },

});


/**
 * dummy view for hidden fields
 */
cdb.forms.Hidden = cdb.core.View.extend({
  className: 'form-view form_hidden',
  initialize: function() {
    this.add_related_model(this.model);
  }
});


cdb.forms.SimpleNumber = cdb.core.View.extend({

  className: 'form-view form_spinner',

  defaults: {
    max: 999999999999,
    min: -999999999999,
    inc: 1,
    width: 25,
    pattern: /^-?[0-9]+\.?[0-9]*$/,
    debounce_time: 200,
    disable_triggering: false
  },

  events: {
    'click .plus': '_plus',
    'click .minus': '_minus',
    'keypress input.value': '_checkInputPress',
    'keydown input.value': '_checkInputPress',
    'keyup input.value': '_checkInputUp',
    'change .value': '_checkValueChange',
    'click': '_showSlider'
  },

  initialize: function() {
    _.bindAll(this, '_fireChange', '_checkNumber');
    this.property = this.options.property;
    this.model.bind('change', this.render, this);

    // Check pattern, if it is empty or not valid,
    // delete the option before extending defaults
    if (!this.options.pattern ||
        typeof this.options.pattern !== "object" ||
        (typeof this.options.pattern === "object" && !this.options.pattern.test)
      )
    {
      delete this.options.pattern;
    }

    _.defaults(this.options, this.defaults);

    // Create slider
    if(!this.options.noSlider) {
      this._initSlider();
    }

    if(this.options.debounce_time > 0) {
      this._fireChange = _.debounce(this._fireChange, this.options.debounce_time);
    }
  },

  render: function(prop) {
    var value = this.options.initValue || this.model.get(this.property);

    if (prop && _.isNumber(prop)) {
      value = prop;
    }

    this.$el.html('<input class="value" ' + (this.options.disabled ? 'readonly' : '') + ' value="" style="width:' + (this.options.width) + 'px!important"/><a href="#" class="plus">+</a><a href="#" class="minus">-</a>');
    this.$('.value').val(value);

    if (this.options.classes) this.$el.addClass(this.options.classes);

    if (this.options.disabled) {
      this.undelegateEvents();
      this.$el
      .addClass('disabled')
      .find('a').bind('click', this.killEvent);
    }

    return this;
  },

  _fireChange: function() {
    this.model.change();
  },

  _changeValue: function(a) {
    this.model.set(a, { silent: true });
    this._fireChange();
  },

  inc: function(c) {
    var a = {};
    var v = a[this.property] = parseFloat(this.model.get(this.property)) + c;
    v = a[this.property] = Math.min(this.options.max, v.toFixed? v.toFixed(1): 1*v);
    a[this.property] = Math.max(this.options.min, v);
    this._changeValue(a);
    // don't wait to be notified by model, render as fast as the user changes the value
    this.render(a[this.property]);
  },

  _plus: function(e) {
    e && e.preventDefault();
    this.trigger("saved", this);
    this.inc(this.options.inc);
    return false;
  },

  _minus: function(e) {
    e && e.preventDefault();
    this.trigger("saved", this);
    this.inc(-this.options.inc);
    return false;
  },

  _initSlider: function() {
    var self = this;

    this.spinner_slider = new cdb.admin.SpinnerSlider({
      target: this.$el,
      template_base: 'old_common/views/spinner_slider'
    }).bind("valueSet", function(value) {
      // Set new model
      var a = {};
      a[self.property] = value;
      self.model.set(a);
    }).bind("valueChanged", function(value) {
      // Set new value
      self.$el.find(".value").val(value);
    });
    this.addView(this.spinner_slider);
  },

  _checkNumber: function(number) {
    return this.options.pattern.test(number);
  },

  _checkInputPress: function(ev) {
    var newChar = String.fromCharCode(ev.charCode);

    if(newChar == '-' || newChar == '.' || 1*newChar !== NaN) {
      return true;
    } else {
      ev.preventDefault();
      ev.stopPropagation();
      return false;
    }
  },

  _checkInputUp: function(ev) {
    this.value? null : this.value = this.model.get(this.property);
    var number = $(ev.target).val();

    if (ev.keyCode == 40) {
      ev.preventDefault();
      ev.stopPropagation();
      this.inc(-this.options.inc);
      this._saveValue(ev);
      this.$el.find("input").focus();
      return false;
    }

    if (ev.keyCode == 38) {
      ev.preventDefault();
      ev.stopPropagation();
      this.inc(this.options.inc);
      this._saveValue(ev);
      this.$el.find("input").focus();
      return false;
    }

    // If it is an ENTER -> saves!
    if (ev.keyCode === 13) {
      this._saveValue(ev, true);
      return false;
    }
    // If not, check the key
    if (!this._checkNumber(number) && number != '-' && number != '') {
      this.$el.find("input.value").val(this.value);
      // ev.stopPropagation();
      // ev.preventDefault();
    } else {
      if(number != '-' && number != '') {
        this.value = $(ev.target).val();
      }
    }
    return true;
  },

  _checkValueChange: function(ev) {
    var number = $(ev.target).val();
    number = (number == '' || number == '-')? 0 : 1*number
    if (!this._checkNumber(number)) {
      this.$el.find("input.value").val(this.value);
    } else {
      this._saveValue(ev, true);
      this.value = $(ev.target).val();
    }
    return true;
  },

  _saveValue: function(ev, close) {
    var a = {};
    var val = this.$el.find("input.value").val()
    var baseNumber = (this.options.min < 0 && this.options.max > 0)?
      0:
      this.options.min;

    var number = (val == '' || val == '-') ? baseNumber : 1*val;

    if (number < this.options.min) number = this.options.min;
    if (number > this.options.max) number = this.options.max;

    this.$el.find("input.value").val(number);

    a[this.property] = number;
    this.model.set(a);

    this.trigger("saved", this);

    if (close && !this.options.disable_triggering) {
      cdb.god.trigger("closeDialogs");
    }
  },

  _showSlider: function(ev) {
    ev.preventDefault();
    ev.stopPropagation();

    this.$el.find("input").focus();

  }
});

cdb.forms.SimpleNumberWithLabel = cdb.forms.SimpleNumber.extend({

  className: 'form-view form_spinner with-label',

  render: function(prop) {
    var value = this.options.initValue || this.model.get(this.property);

    if (prop && _.isNumber(prop)) {
      value = prop;
    }

    this.$el.html(
      this.getTemplate('old_common/forms/widget_simple_number_with_label')({
        label: this.options.label,
        isDisabled: this.options.disabled,
        width: this.options.width
      })
    );
    this.$('.value').val(value);

    if (this.options.classes) this.$el.addClass(this.options.classes);

    if (this.options.disabled) {
      this.undelegateEvents();
      this.$el
      .addClass('disabled')
      .find('a').bind('click', this.killEvent);
    }

    return this;
  }

});

cdb.forms.Spinner = cdb.core.View.extend({
  className: 'form-view form_spinner',

  defaults: {
    max: 999999999999,
    min: -999999999999,
    inc: 1,
    width: 25,
    pattern: /^-?[0-9]+\.?[0-9]*$/,
    debounce_time: 200
  },

  events: {
    'click .plus': '_plus',
    'click .minus': '_minus',
    'keypress input.value': '_checkInputPress',
    'keydown input.value': '_checkInputPress',
    'keyup input.value': '_checkInputUp',
    'change .value': '_checkValueChange',
    'click': '_showSlider'
  },

  initialize: function() {
    _.bindAll(this, '_fireChange', '_checkNumber');
    this.property = this.options.property;
    this.model.bind('change', this.render, this);

    // Check pattern, if it is empty or not valid,
    // delete the option before extending defaults
    if (!this.options.pattern ||
        typeof this.options.pattern !== "object" ||
        (typeof this.options.pattern === "object" && !this.options.pattern.test)
      )
    {
      delete this.options.pattern;
    }

    _.defaults(this.options, this.defaults);

    // Create slider
    if(!this.options.noSlider) {
      this._initSlider();
    }

    if(this.options.debounce_time > 0) {
      this._fireChange = _.debounce(this._fireChange, this.options.debounce_time);
    }
  },

  render: function(prop) {
    var value = this.options.initValue || this.model.get(this.property);

    if (prop && _.isNumber(prop)) {
      value = prop;
    }

    this.$el.html('<input class="value" ' + (this.options.disabled ? 'readonly' : '') + ' value="" style="width:' + (this.options.width) + 'px!important"/><a href="#" class="plus">+</a><a href="#" class="minus">-</a>');
    this.$('.value').val(value);

    if (this.options.disabled) {
      this.undelegateEvents();
      this.$el
      .addClass('disabled')
      .find('a').bind('click', this.killEvent);
    }

    return this;
  },

  _fireChange: function() {
    this.model.change();
  },

  _changeValue: function(a) {
    this.model.set(a, { silent: true });
    this._fireChange();
  },

  inc: function(c) {
    var a = {};
    var v = a[this.property] = this.model.get(this.property) + c;
    v = a[this.property] = Math.min(this.options.max, v.toFixed? v.toFixed(1): 1*v);
    a[this.property] = Math.max(this.options.min, v);
    this._changeValue(a);
    // don't wait to be notified by model, render as fast as the user changes the value
    this.render(a[this.property]);
  },

  _plus: function(e) {
    e && e.preventDefault();
    this.inc(this.options.inc);
    return false;
  },

  _minus: function(e) {
    e && e.preventDefault();
    this.inc(-this.options.inc);
    return false;
  },

  _initSlider: function() {
    var self = this;

    this.spinner_slider = new cdb.admin.SpinnerSlider({
      target: this.$el,
      template_base: 'old_common/views/spinner_slider'
    }).bind("valueSet", function(value) {
      // Set new model
      var a = {};
      a[self.property] = value;
      self.model.set(a);
    }).bind("valueChanged", function(value) {
      // Set new value
      self.$el.find(".value").val(value);
    });
    this.addView(this.spinner_slider);
  },

  _checkNumber: function(number) {
    return this.options.pattern.test(number);
  },

  _checkInputPress: function(ev) {
    var newChar = String.fromCharCode(ev.charCode);

    if(newChar == '-' || newChar == '.' || 1*newChar !== NaN) {
      return true;
    } else {
      ev.preventDefault();
      ev.stopPropagation();
      return false;
    }
  },

  _checkInputUp: function(ev) {
    this.value? null : this.value = this.model.get(this.property);
    var number = $(ev.target).val();

    // If it is an ENTER -> saves!
    if (ev.keyCode === 13) {
      this._saveValue(ev);
      return false;
    }

    // If not, check the key
    if (!this._checkNumber(number) && number != '-' && number != '') {
      this.$el.find("input.value").val(this.value);
      // ev.stopPropagation();
      // ev.preventDefault();
    } else {
      if(number != '-' && number != '') {
        this.value = $(ev.target).val();
      }
    }
    return true;
  },

  _checkValueChange: function(ev) {
    var number = $(ev.target).val();
    number = (number == '' || number == '-')? 0 : 1*number
    if (!this._checkNumber(number)) {
      this.$el.find("input.value").val(this.value);
    } else {
      this._saveValue(ev);
      this.value = $(ev.target).val();
    }
    return true;
  },

  _saveValue: function(ev) {
    var a = {};
    var val = this.$el.find("input.value").val()
    var baseNumber = (this.options.min < 0 && this.options.max > 0)?
      0:
      this.options.min;

    var number = (val == '' || val == '-') ? baseNumber : 1*val;

    this.$el.find("input.value").val(number);

    a[this.property] = number;
    this.model.set(a);

    cdb.god.trigger("closeDialogs");
  },

  _showSlider: function(ev) {
    if(!this.options.noSlider) {
      ev.stopPropagation();

      cdb.god.unbind("closeDialogs", this.spinner_slider.hide, this.spinner_slider);
      cdb.god.trigger("closeDialogs");

      if (!this.spinner_slider.el.parentElement) {
        $('body').append(this.spinner_slider.render().el);

        this.spinner_slider.init(this.options.max, this.options.min, this.options.inc, this.$el.find("input.value").val());

        cdb.god.bind("closeDialogs", this.spinner_slider.hide, this.spinner_slider);
        cdb.god.bind("closeDialogs:color", this.spinner_slider.hide, this.spinner_slider);
      }

      this.$el.find("input.value").focus();
    }
  }
});

cdb.forms.Opacity = cdb.forms.Spinner.extend({
  initialize: function() {
    _.defaults(this.options, {
      max: 1, min: 0, inc: 0.1
    });
    // Added correct class to the spinner
    this.$el.addClass("opacity");

    cdb.forms.Spinner.prototype.initialize.call(this);
  }
});

cdb.forms.SimpleOpacity = cdb.forms.SimpleNumber.extend({
  initialize: function() {
    _.defaults(this.options, {
      max: 1, min: 0, inc: 0.1
    });
    // Added correct class to the spinner
    this.$el.addClass("opacity");

    cdb.forms.Spinner.prototype.initialize.call(this);
  }
});

// same as Opacity but manages the case when the cartocss
// contains a polygon-pattern
cdb.forms.OpacityPolygon = cdb.forms.Spinner.extend({
  initialize: function() {
    _.defaults(this.options, {
      max: 1, min: 0, inc: 0.1
    });
    // Added correct class to the spinner
    this.$el.addClass("opacity");

    this.model.bind('change', function() {
      this.switchProperty();
    }, this);

    cdb.forms.Spinner.prototype.initialize.call(this);
    //this.switchProperty();

  },

  switchProperty: function() {
    if(this.model.get('polygon-pattern-file')) {
      if(!this.originalProperty) {
        this.originalProperty = this.property;
        this.property = 'polygon-pattern-opacity';
        var val = this.model.get(this.property);
        this.model.set(this.property, val === undefined ? this.model.get(this.originalProperty): val);
        this.model.unset(this.originalProperty);
      }
    } else {
      if(this.property === 'polygon-pattern-opacity') {
        this.property = this.originalProperty;
        this.originalProperty = null;
        this.model.set(this.property, this.model.get('polygon-pattern-opacity'));
        this.model.unset('polygon-pattern-opacity');
      }
    }
  }


});

cdb.forms.Width = cdb.forms.Spinner.extend({
  initialize: function() {
    _.defaults(this.options, {
      max: 40, min: 0, inc: 0.5
    });
    cdb.forms.Spinner.prototype.initialize.call(this);
  }
});


cdb.forms.Combo = cdb.core.View.extend({

  className: 'form-view form_combo',

  options: {
    minimumResultsForSearch: 20,
    placeholder: '',
    formatResult: false,
    formatSelection: false,
    matcher: false,
    dropdownCssClass: ''
  },

  events: {
    'change select': '_changeSelection'
  },

  initialize: function() {

    _.bindAll(this, "_onUpdate", "_changeSelection");

    this.data        = this.options.extra;


    if (this.model) {
      this.add_related_model(this.model);
      this.model.bind("change:" + this.options.property, this._onUpdate, this);
    }

  },

  deselect: function() {
    this.$el.find("select").val("").change();
  },

  updateData: function(data) {

    this.data = data;
    this._onUpdate();

  },

  _onUpdate: function() {

    this.render();

  },

  _getOptions: function() {

    var options = _.map(this.data, function(option) {

      if (_.isArray(option)) {
        return '<option value="' + option[1] + '">' + option[0] + '</option>';
      } else {
        return '<option>' + option + '</option>';
      }

    }).join("");

    if (this.options.placeholder) options = "<option></option>" + options;

    return options;

  },

  _setValue: function(value) {

    this.$select.val(value);

  },

  render: function() {

    var self = this;

    // Options
    this.$select = $('<select>' + this._getOptions() + '</select>');

    // Method
    var method = this.model && this.model.get("method") && this.model.get("method").replace(/ /g,"_").toLowerCase();

    // Attributes
    this.$select.attr({
      style: (this.options.width ? "width:" + this.options.width  : '')
    });

    this.$select.addClass(this.options.property + (method ? ' ' + method : ''));

    // Disabled?
    if (this.options.disabled) this.$select.attr("disabled", '');

    // Sets the value
    this._setValue(this.model && this.model.get(this.options.property) || this.options.property);

    // Append
    this.$el.html(this.$select);

    // Apply select2, but before destroy the bindings
    if (!this.options || !this.options.plainSelect) {

      var $select = this.$("select");
      $select.select2("destroy");

      var combo_options = {
        minimumResultsForSearch:  this.options.minimumResultsForSearch,
        placeholder:              this.options.placeholder,
        dropdownCssClass:         this.options.dropdownCssClass
      };

      if (this.options.formatResult)
        combo_options.formatResult = this._formatResult;

      if (this.options.formatSelection)
        combo_options.formatSelection = this._formatSelection;

      if (this.options.matcher)
        combo_options.matcher = this._matcher;

      $select.select2(combo_options);
    }

    return this;
  },

  _changeSelection: function(e) {
    var a = {};

    var val = this.$('select').val();

    a[this.options.property] = val;

    if (this.model) {
      if (val) this.model.set(a);
      else this.model.set(a, { silent: true });
    }

    // Send trigger
    if (val) this.trigger('change', a[this.options.property]);
  },

  _formatResult: function(data) {
    return data.id || data.text;
  },

  _matcher: function(term, text, option) {
    return text.toUpperCase().indexOf(term.toUpperCase())>=0;
  },

  clean: function() {
    this.$select.select2("destroy");
    cdb.core.View.prototype.clean.call(this);
  }

});

cdb.forms.Switch = cdb.core.View.extend({

  events: {
    'click': '_onClick'
  },

  tagName: 'a',
  className: 'form-view form_switch',

  initialize: function() {
    this.property = this.options.property;
    this.model.bind('change:' + this.property, this._change, this);
  },

  _onClick: function(e) {
    e.preventDefault();

    if (!this.$el.hasClass("inactive")) {

      var a = {};
      var value = !this.model.get(this.property);
      a[this.property] = value;
      this.model.set(a);

      this.trigger("switched", this.property, value);
    }

    return false;
  },

  _change: function() {
    if(this.model.get(this.property)) {
      this.$el.removeClass('disabled').addClass('enabled');
    } else {
      this.$el.removeClass('enabled').addClass('disabled');
    }
  },

  render: function() {
    this.$el.append("<span class='handle'></span>");
    this._change();
    return this;
  }

});

cdb.forms.TextAlign = cdb.core.View.extend({

  className: 'form-view form_align',

  defaults: {
    debounce_time: 200
  },

  events: {
    'click .align': '_align'
  },

  initialize: function() {

    _.bindAll(this, '_fireChange');

    this.property = this.options.property;

    this.template = cdb.templates.getTemplate('old_common/views/text_align');

    this.model.bind('change', this.render, this);

    // Check pattern, if it is empty or not valid,
    // delete the option before extending defaults
    if (!this.options.pattern ||
        typeof this.options.pattern !== "object" ||
        (typeof this.options.pattern === "object" && !this.options.pattern.test)
      )
    {
      delete this.options.pattern;
    }

    _.defaults(this.options, this.defaults);

    if(this.options.debounce_time > 0) {
      this._fireChange = _.debounce(this._fireChange, this.options.debounce_time);
    }
  },

  _fireChange: function() {
    this.model.change();
  },

  _align: function(e) {

    e && e.preventDefault();

    var align = $(e.target).attr("data-align");

    var a = {};

    a[this.property] = align;

    this.model.set(a, { silent: true });
    this._fireChange();

  },

  render: function(prop) {

    var value = this.options.initValue || this.model.get(this.property);

    var alignments = this.options.alignments || {};

    var left   = alignments.left   === undefined ? true : alignments.left;
    var right  = alignments.right  === undefined ? true : alignments.right;
    var center = alignments.center === undefined ? true : alignments.center;

    this.$el.html(this.template({ left: left, right: right, center: center }));

    this.$el.find("a[data-align='"+ value +"']").addClass("selected");

    if (this.options.disabled) {
      this.undelegateEvents();
      this.$el
      .addClass('disabled')
      .find('a').bind('click', this.killEvent);
    }

    return this;
  },


});


/**
 * Represents a URL.
 * Provides common semantics to manipulate a URL without having to resort to manipulating strings manually.
 * Rather don't subclass but you composition if you need to extend some functionality.
 *
 * Can safely be coerced into a string implicitly, e.g.:
 *   var myUrl = cdb.common.Url.byBasePath('http://foobar.com/some/path')
 *   alert(myUrl); // will output 'http://foobar.com/some/path'
 */
cdb.common.Url = cdb.core.Model.extend({

  initialize: function (attrs) {
    if (!attrs.base_url) {
      throw new Error('base_url is required')
    }
  },

  /**
   * Get a new URL object with new basepath.
   * @param {String,*} path new sub path. Slashes are not necessary, e.g. 'my_path'
   * @return {Object} instance of cdb.common.Url
   */
  urlToPath: function() {
    return cdb.common.Url.byBaseUrl(this.toString.apply(this, arguments));
  },

  /**
   * @return {String} Path of this URL, e.g. '/some/path'
   */
  pathname: function() {
    return this.toString().match(/^.+\/\/[^\/]+(.*)$/)[1];
  },

  toString: function() {
    return this._joinArgumentsWithSlashes(
      this.get('base_url'),
      Array.prototype.slice.call(arguments, 0)
    );
  },

  _joinArgumentsWithSlashes: function() {
    return _.chain(arguments).flatten().compact().value().join('/');
  }

}, {

  byBaseUrl: function(url) {
    return new cdb.common.Url({ base_url: url });
  }
});

/**
 * URLs associated with the dashboard visualizations.
 */
cdb.common.DashboardVisUrl = cdb.common.Url.extend({

  lockedItems: function() {
    return this.urlToPath('locked');
  },

  sharedItems: function() {
    return this.urlToPath('shared');
  },

  likedItems: function() {
    return this.urlToPath('liked');
  }
});

/**
 *  Custom scroll for blocks
 *  - el: scrollable element
 *  - parent: where to put span shadows :)
 */

cdb.admin.CustomScrolls = cdb.core.View.extend({

  events: {
    'scroll': 'checkScroll'
  },

  initialize: function() {
    var self = this;

    // Render it
    this.render();

    // Hack to check scroll form the beginning :)
    this.timeout = setTimeout(function(){
      self.checkScroll();
    },300)
  },

  render: function() {
    this.options.parent.append('<span class="top scroll"></span><span class="bottom scroll"></span>');
    return this;
  },

  checkScroll: function(ev) {
    var height_ = this.$el.outerHeight()
      , scroll_y = this.$el[0].scrollTop
      , scroll_x = this.$el[0].scrollLeft
      , scroll_y_height = this.$el[0].scrollHeight - height_
      , $parent = this.options.parent
      , $top = $parent.find('span.top')
      , $bottom = $parent.find('span.bottom');

    // Y axis for the moment
    if (scroll_y == 0) {
      $top.hide();
    } else {
      $top.show();
    }

    if (scroll_y == scroll_y_height) {
      $bottom.hide();
    } else {
      $bottom.show();
    }
  }

});


/**
 *  Class for javascript errors in CartoDB App
 *
 *  - It controls JS errors and save them into the
 *    service we set at the begining.
 */

cdb.admin.ErrorStats = cdb.core.Model.extend({

  defaults: {
    name:        'trackJs',              // Name of the service
    people:      'configure',            // Internal service function for setting people configuration
    template:    'old_common/views/trackjs', // Template for setting people configuration
    enable_logs: false                   // Sends the errors to the logger
  },

  initialize: function(opts) {
    if (opts && opts.user_data) {
      this.user_data = opts.user_data;  
    }

    if (window[this.get('name')]) {
      this._setService();
    }
  },

  _setService: function() {
    // Set people?
    if (this.get('people') && this.user_data) {
      var template = cdb.templates.getTemplate(this.get('template'));
      window[this.get('name')][this.get('people')](JSON.parse(template(this.user_data)));
    }
    // Save logs?
    if (this.get('enable_logs')) {
      cdb.log = window[this.get('name')];
    }
  }

});



  /**
   *  Boolean field -> Place to choose any boolean value
   *  - It accepts a model with {attribute: 'colum', value: true}
   *  var boolean = new cdb.admin.BooleanField({ model: model })
   */

  cdb.admin.BooleanField = cdb.admin.StringField.extend({

    className: 'field boolean',

    default_options: {
      template_name: 'old_common/views/forms/boolean_field',
      label:          false,
      readOnly:       false
    },

    events: {
      'click a.radiobutton': '_onChange'
    },

    _onChange: function(e) {
      e.preventDefault();

      var $radio = $(e.target).closest('a.radiobutton') // Always within the view!
        , value = $radio.text().toLowerCase();
      
      if (this.model.get('value') != value) {
        this.model.set('value', value);
        this._setSelected($radio)
      }
    },

    _setSelected: function($radio) {
      this.$('a.selected').removeClass('selected');
      $radio.addClass('selected');
    },

    _resize: function() {},

    _triggerEvent: function(eventName, values) {
      this.trigger(eventName, values, this);
    }
  })

  /**
   *  Color picker dropdown (extends Dropdown)
   *
   *  It shows the color options with a drop(up).
   *
   *  Usage example:
   *
   *  var color_picker = new cdb.admin.ColorPicker({
   *    target: $('a.account'),
   *    model: {},
   *    template_base: 'common/views/color_picker'
   *  });
   *
   */


  cdb.admin.ColorPicker = cdb.admin.DropdownMenu.extend({

    className: 'CDB-Text dropdown color_picker border',

    _PICKER_DELAY: 800,

    _COLORS: [
      // First file
      "#136400","#229A00","#B81609","#D6301D",
      "#F84F40","#41006D","#7B00B4","#A53ED5","#2E5387","#3E7BB6",
      "#5CA2D1","#FF6600","#FF9900","#FFCC00","#FFFFFF",
      // Second file
      "#012700","#055D00","#850200","#B40903","#F11810",
      "#11002F","#3B007F","#6B0FB2","#081B47","#0F3B82","#2167AB",
      "#FF2900","#FF5C00","#FFA300","#000000"
    ],

    default_options: {
      width: 197,
      speedIn: 150,
      speedOut: 300,
      vertical_position: "up",
      horizontal_position: "right",
      horizontal_offset: 5,
      vertical_offset: 0,
      tick: "right",
      dragUpdate: false,
      template_base: 'old_common/views/color_picker'
    },

    events: {
      'click a.advanced'          : '_openAdvanced',
      'click .default-colors li a': '_clickedColor',
      'keyup input.text'          : '_checkColor',
      'change input.text'         : '_checkColor',
      'submit form'               : '_submitColor',
      'click'                     : 'stopPropagation'
    },

    initialize: function() {
      cdb.admin.DropdownMenu.prototype.initialize.call(this);

      // Create a model with colors and "extra colors"
      this.model = new cdb.core.Model({
        visible:      false,
        colors:       this._COLORS,
        extra_colors: this.options.extra_colors,
        color:        ""
      });

      if (this.options.target)
        $(this.options.target).off("click", this._handleClick);

      this._initBinds();
    },

    _initBinds: function() {
      _.bindAll(this, "open", "hide", "_handleClick", "_keydown",
        '_openAdvanced', '_setPicker', '_setColor', '_onPickerMouseMove',
        '_onPickerMouseUp', '_submitColor');
      this.model.bind("change:colors change:extra_colors change:color", this.render, this);
    },

    render: function() {
      // Render element
      var d = this.model.toJSON();
      var self = this;

      if (d.extra_colors) {
        // Filter colors already present in default list
        d.extra_colors = _.filter(
          _.uniq( this.options.extra_colors ),
          function(c) {
            return  !_.contains( self._COLORS, c.toUpperCase() )
          }
        );
      }

      this.$el
        .html(this.template_base(d))
        .css({ width: this.options.width });

      // Init and render color picker
      ColorPicker.fixIndicators(
        this.$('.slider-indicator').get(0),
        this.$('.picker-indicator').get(0)
      );

      this.color_picker = ColorPicker(
        this.$('.slider').get(0),
        this.$('.picker').get(0),
        this._setPicker
      );

      return this;
    },

    stopPropagation: function(e) {
      e.stopPropagation();
    },

    _checkColor: function(e) {
      e.preventDefault();

      var color = new RGBColor(this.$("input.text").val());

      if (color.ok) {
        this.$("input.text").removeClass("error");
        this.$("form > span.color").css("background", color.toHex());
      } else {
        this.$("input.text").addClass("error");
      }
    },

    setColors: function(attr, value) {
      if (!attr || !value) {
        cdb.log.info('No attribute or value for color picker model');
        return false;
      }

      this.model.set(attr, value);
    },

    init: function(color) {
      color = color || '#FFFFFF';
      this.model.set('color', color);
      this._setColor(color);
      this.open();
    },

    _clickedColor: function(e) {
      e.preventDefault();
      var color = $(e.target).attr("href");
      this._triggerColor(color, true);
      this.hide();
    },

    _setPicker: function(hex, hsv, rgb, mousePicker, mouseSlide) {
      this._setColor(hex);
      ColorPicker.positionIndicators(
        this.$('.slider-indicator').get(0),
        this.$('.picker-indicator').get(0),
        mouseSlide, mousePicker
      );
    },

    _setColor: function(color) {
      this.$("form > span.color").css("background", color);
      this.$("input.text").val(color);
    },

    _submitColor: function(e) {
      if (e) e.preventDefault();
      var color = new RGBColor(this.$("input.text").val());

      if (color.ok) {
        this._triggerColor(color.toHex(), true);
        this.hide();
      }
    },

    _onPickerMouseMove: function() {
      if (this.options.dragUpdate) {
        var color = new RGBColor(this.$("input.text").val());
        if (color.ok) this._triggerColor(color.toHex(), false);
      }
    },

    _onPickerMouseUp: function() {
      var color = new RGBColor(this.$("input.text").val());
      if (color.ok) this._triggerColor(color.toHex(), false);
    },

    _bindAdvancedPicker: function() {
      this.$('.slider').bind('mousemove', this._onPickerMouseMove);
      this.$('.picker').bind('mousemove', this._onPickerMouseMove);
      this.$('.picker').bind('mouseup',   this._onPickerMouseUp);
      this.$('.slider').bind('mouseup',   this._onPickerMouseUp);
    },

    _destroyAdvancedPicker: function() {
      this.$('.slider').unbind('mousemove', this._onPickerMouseMove);
      this.$('.picker').unbind('mousemove', this._onPickerMouseMove);
      this.$('.picker').unbind('mouseup',   this._onPickerMouseUp);
      this.$('.slider').unbind('mouseup',   this._onPickerMouseUp);
    },

    _openAdvanced: function(e) {
      if (e) e.preventDefault();

      this._bindAdvancedPicker();

      this.$('div.top').addClass('advanced');
      this.positionate(e);
      // Set color in picker
      var color = new RGBColor(this.$("input.text").val());
      if (color.ok) this.color_picker.setHex(color.toHex())
    },

    _triggerColor: function(color, close) {
      // It triggers the color and if the parent
      // should close the picker or not.
      this.trigger('colorChosen', color, close, this.el);
    },

    positionate: function(e,target) {
      var $target = this.options.target;

      // Positionate
      var targetPos     = $target[this.options.position || 'offset']()
        , targetWidth   = $target.outerWidth()
        , targetHeight  = $target.outerHeight()
        , elementWidth  = this.$el.outerWidth()
        , elementHeight = this.$el.outerHeight();

      this.$el.css({
        top: targetPos.top + parseInt((this.options.vertical_position == "up") ? (- elementHeight - 10 - this.options.vertical_offset) : (targetHeight + 10 - this.options.vertical_offset)),
        left: targetPos.left + parseInt((this.options.horizontal_position == "left") ? (this.options.horizontal_offset - 15) : (targetWidth - elementWidth + 15 - this.options.horizontal_offset))
      }).addClass(
        // Add vertical and horizontal position class
        (this.options.vertical_position == "up" ? "vertical_top" : "vertical_bottom" )
        + " " +
        (this.options.horizontal_position == "right" ? "horizontal_right" : "horizontal_left" )
        + " " +
        // Add tick class
        "tick_" + this.options.tick
      )
    },

    open: function(e,target) {
      // Target
      var $target = target && $(target) || this.options.target;

      this.positionate(e,target);

      // Show it
      this.show();

      // Dropdown openned
      this.model.set('visible', true);
    },

    hide: function(ev) {
      var self = this;

      this.$el.animate({
        marginTop: self.options.vertical_position == "down" ? "10px" : "-10px",
        opacity: 0
      },this.options.speedOut, function(){
        // Remove selected class
        $(self.options.target).removeClass("selected");
        // And clean it ;)
        self.clean();
      });

      // Dropdown hidden
      this.model.set('visible', false);
    },

    clean: function() {
      if (this.color_picker) {
        this.color_picker.unBind();
      }

      if (this.options.target)
        $(this.options.target).unbind("click", this._handleClick);

      cdb.admin.DropdownMenu.prototype.clean.call(this);
    }
  });


  /**
   *  Date field -> Place to choose and edit date field
   *  - It accepts a model with {attribute: 'colum', value: '2013-02-12T12:19:58+01:00'}
   *  - It will create a new model to split this value into {day, month, year and time}
   *  var date = new cdb.admin.DateField({ model: model })
   */

  cdb.admin.DateField = cdb.admin.StringField.extend({

    className: 'field date',

    timezone: "00:00",

    default_options: {
      template_name: 'old_common/views/forms/date_field',
      label:          false,
      readOnly:       false
    },

    events: {
      'change input.time': '_onChange',
      'keyup input.time':  '_onKeyUp'
    },

    initialize: function() {
      _.defaults(this.options, this.default_options);

      _.bindAll(this, '_onChange', '_onKeyUp', '_onChangeModel');

      this.template_base = this.options.template_base ? _.template(this.options.template_base) : cdb.templates.getTemplate(this.options.template_name);

      // Get date
      var date = this._splitDate((this.model.get('value')));

      this.timezone = this._getTimeZone(this.model.get('value'));

      // Generate a new date Model (later it will be removed and destroyed)
      this.date_model = new cdb.core.Model();

      // Begins as valid
      this.valid = true;

      // Bind changes
      this.date_model.bind('change', this._onChangeModel);

      // Date model data set
      this.date_model.set(date);

      // On clean
      this.bind('clean', this._reClean);
    },

    render: function() {
      this.$el.html(this.template_base(_.extend(this.model.toJSON(), this.options)));

      // Apply views
      this._initViews();

      // Check readOnly and unbind all events
      if (this.options.readOnly) {
        this.undelegateEvents();
      }

      return this;
    },

    _initViews: function() {

      // Days spinner
      var days = this.days = new cdb.forms.Spinner({
        el: this.$el.find('div.day'),
        model:    this.date_model,
        disabled: this.options.readOnly,
        property: 'day',
        min:      1,
        max:      31,
        inc:      1,
        width:    15,
        noSlider: true,
        pattern:  /^([12]?\d{0,1}|3[01]{0,2})$/
      });

      this.addView(this.days);
      this.$("div.day").append(days.render());

      // Year spinner
      var years = this.years = new cdb.forms.Spinner({
        el: this.$el.find('div.year'),
        model:    this.date_model,
        disabled: this.options.readOnly,
        property: 'year',
        min:      1900,
        max:      2100,
        width:    28,
        noSlider: true,
        pattern:  /^([0-9]{0,4})$/
      });
      this.addView(this.years);
      this.$("div.year").append(years.render());

      // Month selector
      var months = this.months = new cdb.forms.Combo({
        el: this.$el.find('div.month'),
        model:      this.date_model,
        disabled:   this.options.readOnly,
        property:   'month',
        width:      '140px',
        extra:      [['January',1], ['February',2], ['March',3], ['April',4], ['May',5], ['June',6], ['July',7], ['August',8], ['September',9], ['October',10], ['November',11], ['December',12]]
      });
      this.addView(this.months);
      this.$("div.month").append(months.render());

      // Time input
      this.$('input.time').val(this.date_model.get('time'));
    },

    /**
     *  Extracts the timezone from a date
     */
    _getTimeZone: function(date) {

      if (date) {
        var match = date.match(/\+(.*)$/);
        if (match && match.length == 2) return match[1];
      }

      return this.timezone;

    },

    /**
     *  Split the date string
     */
    _splitDate: function(str) {
      var date = {};

      // Get default date and time
      var today = new Date();

      var day   = today.getDate();
      var month = today.getMonth() + 1;
      var year  = today.getFullYear();

      var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

      if (str == '') {
        date.day   = day;
        date.month = month;
        date.year  = year;
        date.time  = time;
      } else {
        try {
          var split_date_hour = str.split('T');

          if (split_date_hour.length > 1) {

            var split_date = split_date_hour[0].split('-');

            date.time  = split_date_hour[1].substr(0,8);
            date.day   = parseInt(split_date[2]);
            date.month = parseInt(split_date[1]);
            date.year  = parseInt(split_date[0]);

          } else {
            date.day   = day;
            date.month = month;
            date.year  = year;
            date.time  = time;
          }

        } catch (e) {
          date.day   = day;
          date.month = month;
          date.year  = year;
          date.time  = time;
        }
      }

      return date;

    },

    /**
     *  Get the date model and converts to date string
     */
    _toDate: function(date) {
      return date.year + "-" + date.month + "-" + date.day + "T" + date.time + "+" + this.timezone;
    },

    /**
     *  Check if the time is well formed or not
     */
    _checkTime: function(time) {
      var pattern = /^([01]{1}[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
      if (pattern.test(time)) {
        return true
      } else {
        return false
      }
    },


    // Events
    _onChange: function(e) {
      var time = this.$('input.time').val();

      if (this._checkTime(time)) {
        this.date_model.set('time', time);
      }
    },

    _onChangeModel: function(m) {
      this.model.set('value', this._toDate(this.date_model.toJSON()));
    },


    _onKeyDown: function() {},


    _onKeyUp: function(e) {
      var time = $(e.target).val();

      if (this._checkTime(time)) {

        if (e.keyCode === 13) {
          e.preventDefault();
          this._triggerEvent('ENTER');
          return false;
        }

        this.valid = true;
        this.date_model.set('time', time);
        $(e.target).removeClass("error");
      } else {
        this.valid = false;
        $(e.target).addClass("error");
      }
    },

    _reClean: function() {
      this.date_model.unbind('change');
      this.date_model.destroy();
    }
  })


cdb.admin.EditInPlace = cdb.core.View.extend({

  events: {
    "click .value": "_onClick",
    "keyup input":  "_onKeyUp",
    "blur input":   "_onBlur"
  },

  initialize: function() {

    this.options = _.extend({
      disabled: false,
      stripHTML: false
    }, this.options);

    _.bindAll(this, "_close", "_onKeyUp");

    this._observedField = this.options.observe;

    this.disabled  = this.options.disabled;
    this.stripHTML = this.options.stripHTML;

    this.template = this.options.template_name ? this.getTemplate(this.options.template_name) : this.getTemplate('table/menu_modules/legends/views/edit_in_place');

    this._setupConfig();

    this.add_related_model(this.model);
    this.model.bind("change:" + this._observedField, this._updateValue, this);

    this.render();

  },

  _setupConfig: function() {

    this.config = new cdb.core.Model({
      mode: "view"
    });

    this.add_related_model(this.config);
    this.config.bind("change:mode", this._updateMode, this);

  },

  _updateMode: function(mode) {

    if (this.config.get("mode") == 'edit') {

      this.$el.find(".value").hide();

      this.$input.show();
      this.$input.focus();

    } else {

      this.$el.find(".value").show();
      this.$input.hide();

      var value = this.model.get(this._observedField);

      this.$input.val(value);
      this.$el.find(".value span").html(value);

    }
  },

  _updateValue: function() {

    var value = this.model.get(this._observedField);

    if (this.stripHTML) {
      value = cdb.Utils.stripHTML(value);
    }

    if (cdb.Utils.isBlank(value)) {

      this.$input.text("");
      this.$el.find(".value").addClass("empty");
      this.$el.find(".value span").text("empty");
      this.trigger("change", null, this);

      return;
    }

    this.$input.text(value);
    this.$el.find(".value span").html(value);
    this.$el.find(".value").removeClass("empty");

    this.trigger("change", value, this);

  },

  _close: function(e) {

    e && e.preventDefault();
    e && e.stopPropagation();

    this.config.set("mode", "view");

    this._preventEmptyValue();
  },

  _preventEmptyValue: function() {

    var value = this.model.get(this._observedField);

    if (cdb.Utils.isBlank(value)) {
      this.$el.find(".value").addClass("empty");
      this.$el.find(".value span").text("empty");
    } else {
      this.$el.find(".value").removeClass("empty");
    }

  },

  _onBlur: function(e) {

    var value = this.$el.find("input").val();

    if (this.stripHTML) {
      value = cdb.Utils.stripHTML(value);
    }

    this.model.set(this._observedField, value);
    this._close();
  },

  _onKeyUp: function(e) {

    if (e.keyCode == 13) { // Enter

      var value = this.$el.find("input").val();

      if (this.stripHTML) {
        value = cdb.Utils.stripHTML(value);
      }

      this.model.set(this._observedField, value);
      this._close();

    } else if (e.keyCode == 27) { // Esc
      this._close();
    }

  },

  _onClick: function(e) {

    e && e.preventDefault();
    e && e.stopPropagation();

    if (!this.disabled) this.config.set("mode", "edit");
  },

  render: function() {

    var isEmpty = true;
    var value = this.model.get(this._observedField);

    if (this.stripHTML) {
      value = cdb.Utils.stripHTML(value);
    }

    if (cdb.Utils.isBlank(value)) {
      value = "empty";
      this.$el.append('<input type="text" value="" />');
    } else {
      isEmpty = false;
      this.$el.append('<input type="text" value="' + _.escape(value) + '" />');
    }

    this.$el.append(this.template({ value: value }));
    this.$el.addClass("edit_in_place");

    if (this.disabled) this.$el.addClass("disabled");

    if (isEmpty) {
      this.$el.find(".value").addClass("empty");
    } else {
      this.$el.find(".value").removeClass("empty");
    }

    this.$input = this.$el.find("input");

    if (this.options.maxWidth) this.$el.find("span").css("max-width", this.options.maxWidth);


  }

});


  /**
   *  Advanced combo with extra parameters
   *
   */


  cdb.forms.ColumnTypeCombo = cdb.forms.Combo.extend({

    options: {
      minimumResultsForSearch: 20,
      placeholder: '',
      formatResult: true,
      matcher: true,
      dropdownCssClass: 'column-type'
    },

    _formatResult: function(data) {
      return  '<span class="value">' + data.id + '</span>' + '<span class="type">' + (data.text && data.text.charAt(0)) + '</span>'
    },

    _matcher: function(term, text, option) {
      var val = $(option).val();
      return val.toUpperCase().indexOf(term.toUpperCase())>=0;
    }

  });


/**
 * renders a form given fields
 *
 * var form = new cdb.forms.Form({
 *  form_data: [
      {
         name: 'Marker Fill',
         form: {
           'polygon-fill': {
                 type: 'color' ,
                 value: '#00FF00'
            },
            'polygon-opacity': {
                 type: 'opacity' ,
                 value: 0.6
            }
        }
      }
    ]
 * });
 */

cdb.forms.Form = cdb.core.View.extend({
  tagName: 'ul',

  widgets: {
   'color': 'ColorWizard',
   'opacity': 'Opacity',
   'simple_opacity': 'SimpleOpacity',
   'opacity_polygon': 'OpacityPolygon',
   'number': 'Spinner',
   'simple_number': 'SimpleNumber',
   'simple_number_with_label': 'SimpleNumberWithLabel',
   'width': 'Width',
   'select': 'Combo',
   'hidden': 'Hidden',
   'switch': 'Switch',
   'text_align': 'TextAlign'
  },

  field_template: _.template('<li <% if (className) { %>class="<%- className %>"<% } %>><span><%-name %></span><span class="field"></li>'),

  initialize: function() {
    var self = this;
    this.fields = {};

    this.form_data = this.options.form_data;

    this.bind('clean', function() {
      this.fields = null;
    }, this);
  },

  updateForm: function(form) {
    this.form_data = form;
  },

  _renderField: function(field) {
    var self = this;
    var e = $(this.field_template({ name: field.title || field.name, className: field.className || false }));
    _(field.form).each(function(form, name) {

      // create the class for this data type and add it to view
      var Class = window.cdb.forms[self.widgets[form.type]];
      if (Class) {
        var opts = form;
        _.extend(opts, {
          property: name,
          model: self.model,
          extra: form.extra,
          field_name: field.name
        });
        var v = new Class(opts);
        e.find('.field').append(v.render().el);

        v.on("saved", function() {
          self.trigger("saved", self);
        });

        self.addView(v);
      } else {
        cdb.log.error("field class not found "  + form.type);
      }
    });

    // Render text if it exists after first form
    // TODO: create a new type of field called text
    if (field.text) {
      $("<span class='text light'>" + field.text + "</span>").insertAfter(e.find('.field div:eq(0)'));
    }

    return e;
  },

  /**
   * return the jquery element for a field
   * (wraps each subfield)
   */
  getFieldByName: function(name) {
    return this.fields[name];
  },

  /**
   * returns the views inside each field
   */
  getFieldsByName: function(name) {
    return _.filter(this._subviews, function(v) {
      if(v.options.field_name === name) {
        return v;
      }
    });
  },

  render: function() {
    var self = this;
    this.clearSubViews();
    _(this.filter).each(function(e) {
      e.destroy();
    });
    this.$el.html('');
    _(this.form_data).each(function(field) {
      var f= self._renderField(field);
      self.fields[field.name] = f;

      self.$el.append(f);
    });
    return this;
  }

});



  /**
   *  Geometry field -> Place to choose and edit geometry field
   *  - It accepts a model with {attribute: 'the_geom', value: '{{ "type": "Point", "coordinates": [100.0, 0.0] }}'}
   *  var geometry = new cdb.admin.GeometryField({ model: model, row: row, rowNumber: rowNumber })
   */

  cdb.admin.GeometryField = cdb.admin.StringField.extend({

    className: 'field geometry',

    default_options: {
      template_name: 'old_common/views/forms/geometry_field',
      label:          false,
      readOnly:       false
    },

    events: {
      'click .switch':    '_chooseEditor',
      'keyup input':      '_onKeyInputUp',
      'keydown textarea': '_onKeyTextareaDown',
      'change textarea':  '_onChange'
    },

    initialize: function() {
      _.defaults(this.options, this.default_options);

      _.bindAll(this, '_chooseEditor', '_onKeyInputUp', '_onKeyTextareaDown');

      this.template_base = this.options.template_base ? _.template(this.options.template_base) : cdb.templates.getTemplate(this.options.template_name);

      // Set important variables
      this.valid = true;
      this.row = this.options.row;

      // Get OS variable
      this._setOS();
    },

    render: function() {
      this.$el.html(this.template_base(_.extend(this.model.toJSON(), this.options)));

      // Apply views
      this._initViews();

      // Check readOnly and unbind all events
      if (this.options.readOnly) {
        this.undelegateEvents();
      }

      return this;
    },

    _initViews: function() {
      var geojson = this.model.get('value');

      if (!this.row.isGeomLoaded()) {
        // the_geom contents still haven't been loaded
        this._loadGeom();
      } else {
        this._chooseGeom();
      }
    },

    /**
     *  Load geom if it is not loaded
     */
    _loadGeom: function() {
      var self = this;
      this.row.bind('change', function() {
        self.model.set('value', self.row.get("the_geom"));
        self._chooseGeom();
      }, this);
      this.row.fetch({
        rowNumber: this.options.rowNumber
      });
    },


    /**
     *  Choose scenario for the editor
     */
    _chooseGeom: function() {
      var geom = null;

      try {
        geom = JSON.parse(this.model.get('value'));
      } catch(err) {
        // if the geom is not a valid json value
      }

      if (!this.options.readOnly) {
        if (!geom || geom.type.toLowerCase() == "point") {
          // Set status to point
          this.status = "point";
          // Remove loader
          this.$(".loader").remove();
          // Fill inputs
          this.$(".point").show();
          this.$(".selector").show();

          if (geom) {
            this.$("input.longitude").val(geom.coordinates[0]);
            this.$("input.latitude").val(geom.coordinates[1]);
            this.$("textarea").val(JSON.stringify(geom));
          }
        } else {
          // Set status to rest
          this.status = "rest";
          // Remove loader
          this.$(".loader").remove();
          // Fill textarea
          this.$(".rest").show();
          this.$("textarea").val(this.model.get('value'));
        }
      } else {
        this.$(".loader").remove();
        this.$(".selector").show();
        this.$("textarea").val(this.model.get('value'));
      }
    },

    _chooseEditor: function(ev) {
      this.killEvent(ev);

      var $el = $(ev.target).closest("a");

      // Change status value
      this.status = (this.status == "point") ? "rest" : "point";

      // Change switch
      $el
        .removeClass(this.status == "rest" ? "disabled" : "enabled")
        .addClass(this.status == "rest" ? "enabled" : "disabled");

      this.updateInputs();

      // Change between point to geom editor
      if (this.status == "rest") {
        this.$('.point').hide();
        this.$('.rest').show();
        this.valid = true;
      } else {
        this.$('.point').show();
        this.$('.rest').hide();
        this.valid = this._checkInputs();
      }
    },

    updateInputs: function() {
      if(this.model.get('value')) {
        try {
          var geom = JSON.parse(this.model.get('value'));
          this.$("input.longitude").val(geom.coordinates[0]);
          this.$("input.latitude").val(geom.coordinates[1]);
          this.$("textarea").val(JSON.stringify(geom));
        } catch(error) {
          return false;
        }
      }
    },

    /**
     *  Check if the number is well formed or not
     */
    _checkNumber: function(number, type) {
      var pattern = /^-?(?:[0-9]+|[0-9]*\.[0-9]+)$/;
      if (pattern.test(number)) {

        if (type === "lat") {
          if ( number >= -90 && number <= 90 ) {
            return true
          } else {
            return false
          }
        }

        if (type === "lon") {
          if ( number >= -180 && number <= 180 ) {
            return true
          } else {
            return false
          }
        }

        return true
      } else {
        return false
      }
    },


    /**
     *  Check latitude and longitude inputs
     */
    _checkInputs: function() {
      var enable = true
        , $lat = this.$("input.latitude")
        , $lon = this.$("input.longitude");

      if (this._checkNumber($lat.val(), 'lat')) {
        $lat.removeClass("error");
      } else {
        $lat.addClass("error");
        enable = false;
      }

      if (this._checkNumber($lon.val(), 'lon')) {
        $lon.removeClass("error");
      } else {
        $lon.addClass("error");
        enable = false;
      }

      return enable;
    },

    /**
     *  When user type any number we check it if it is correct
     */
    _onKeyInputUp: function(e) {

      if (this._checkInputs()) {

        if (e.keyCode === 13) {
          e.preventDefault();
          this._triggerEvent('ENTER');
          return false;
        }

        this.valid = true;

        // Save model
        var lat = parseFloat(this.$("input.latitude").val())
          , lon = parseFloat(this.$("input.longitude").val());

        this.model.set('value', JSON.stringify({"type": "Point", "coordinates": [lon,lat]}));

      } else {
        this.valid = false;
      }
    },

    /**
     *  Key press binding for textarea
     */
    _onKeyTextareaDown: function(e) {
      if (((this.so=="mac" && e.metaKey) || (this.so=="rest" && e.ctrlKey)) && e.keyCode == 13 ) {
        e.preventDefault();
        this._triggerEvent('ENTER');
        return false;
      }

      var value = $(e.target).val();

      this.model.set('value', value);
    },
  })


  /**
   *  Number field -> Place to edit and capture number editions
   *  - It accepts a model with {attribute: 'colum', value: '1235'}
   *  - It validates the number before saving it
   *  var string = new cdb.admin.NumberField({ model: model })
   *
   */

  cdb.admin.NumberField = cdb.admin.StringField.extend({

    className: 'field number',

    default_options: {
      template_name: 'old_common/views/forms/number_field',
      label:          false,
      readOnly:       false
    },

    events: {
      'change input':   '_onChange',
      'keyup input':    '_onKeyUp',
      'keydown input':  '_onKeyDown'
    },

    // Check if the number is well formed or not
    _checkNumber: function(number) {
      var pattern = /^-?(?:[0-9]+|[0-9]*\.[0-9]+)$/;
      if (pattern.test(number))
        return true
      else
        return false
    },

    _onChange: function(e) {
      var value = $(e.target).val();
      if (this._checkNumber(value)) {
        this.model.set('value', value);
      }
    },

    _onKeyDown: function(e) {
      var number = $(e.target).val();
      if ((((this.so=="mac" && e.metaKey) || (this.so=="rest" && e.ctrlKey)) && e.keyCode == 13) || e.keyCode == 13) {
        if (number === '' || this._checkNumber(number)) {
          this._setValid(number);
          this._triggerEvent('ENTER');
        }
      }
    },

    _onKeyUp: function(e) {
      var number = $(e.target).val();

      if (number === '' || this._checkNumber(number)) {
        this._setValid(number);
      } else {
        this._setInvalid(number);
      }
    },

    _setInvalid: function(number) {
      this.valid = false;
      this.$('input[type="text"]').addClass("error");
    },

    _setValid: function(number) {
      this.valid = true;

      if (number === '') {
        number = 'null';
      }

      this.$('input[type="text"]').removeClass("error");
      this.model.set('value', number);
    },

    _resize: function() {}

  })



  /**
   * Spinner slider (extends Dropdown)
   *
   * It shows the spinner slider.
   *
   * Usage example:
   *
      var spinner_slider = new cdb.admin.SpinnerSlider({
        target: $('a.account'),
        model: {},
        template_base: 'common/views/spinner_slider'
      });
   *
   */


  cdb.admin.SpinnerSlider = cdb.admin.DropdownMenu.extend({

    className: 'dropdown spinner_slider border',

    default_options: {
      width: 26,
      speedIn: 150,
      speedOut: 300,
      vertical_position: "up",
      horizontal_position: "right",
      horizontal_offset: 32,
      vertical_offset: 0,
      tick: "top"
    },

    events: {
      'click' : '_stopPropagation',
    },

    _stopPropagation: function(ev) {
      ev.stopPropagation();
      ev.preventDefault();
    },

    init: function(max,min,inc,value) {
      var self = this;

      this.$el.find("div.slider-ui").slider({
        orientation: "vertical",
        max: max,
        min: min,
        step: inc,
        value: value,
        slide: function(ev, ui) { self.trigger("valueChanged", ui.value, this.el); },
        change: function(ev, ui) { self.trigger("valueSet", ui.value, this.el); }
      });

      this.open();
    },

    hide: function(ev) {
      var self = this;
      this.isOpen = false;

      this.$el.animate({
        marginTop: self.options.vertical_position == "down" ? "10px" : "-10px",
        opacity: 0
      },this.options.speedOut, function(){
        // Remove selected class
        $(self.options.target).removeClass("selected");
        // And hide it
        self.$el.hide();
        self.$el.find("div.slider-ui").slider("destroy");
        self.remove();
      });
    }
  });

  
  /**
   *  Custom combo which it lets you to add a custom value
   *  extended from filters combo.
   *
   */
  

  cdb.forms.CustomTextCombo = cdb.forms.ColumnTypeCombo.extend({

    className: 'form_combo form_custom_text_combo',

    options: {
      minimumResultsForSearch: 20,
      placeholder: '',
      formatResult: true,
      formatSelection: true,
      matcher: true,
      freeText: true,
      dropdownCssClass: 'column-type custom_text_combo'
    },

    render: function() {    
      var self = this;

      // Options
      this.$select = $('<select>' + this._getOptions() + '</select>');

      // Method
      var method = this.model && this.model.get("method") && this.model.get("method").replace(/ /g,"_").toLowerCase();

      // Attributes
      this.$select.attr({
        style: (this.options.width ? "width:" + this.options.width  : '')
      });

      this.$select.addClass(this.options.property + (method ? ' ' + method : ''));

      // Disabled?
      if (this.options.disabled) this.$select.attr("disabled", '');

      // Sets the value
      this._setValue(this.model && this.model.get(this.options.property) || this.options.property);

      // Append
      this.$el.html(this.$select);

      // Apply select2, but before destroy the bindings
      if (!this.options || !this.options.plainSelect) {

        var $select = this.$("select");
        $select.select2("destroy");

        var combo_options = {
          minimumResultsForSearch:  this.options.minimumResultsForSearch,
          placeholder:              this.options.placeholder,
          dropdownCssClass:         this.options.dropdownCssClass,
          freeText:                 this.options.freeText
        };

        if (this.options.formatSelection)
          combo_options.formatSelection = this._formatSelection;

        if (this.options.formatResult)
          combo_options.formatResult = this._formatResult;

        if (this.options.matcher)
          combo_options.matcher = this._matcher;

        $select.select2(combo_options);
      }

      // Set value for the combo if it is not defined as an option
      var actual_value = this.model.get(this.options.property);
      if ( actual_value !== "" && !this._valueAsOption(this.model.get(this.options.property))) {
        $select.select2('val', this.model.get(this.options.property))
      }

      return this;
    },

    // Does that value exist as an option?
    _valueAsOption: function(value) {
      return _.find(this.options.extra, function(opt) { return opt[1] === value }) !== undefined
    },

    _formatSelection: function(data) {
      return data ? data.id : data.text;
    },

    _changeSelection: function(e) {
      var val = this.$('select').val() || this.$('select').data('select2').data().id;
      // Check if val is from text or value
      var isText = !this._valueAsOption(val);

      // Set model
      var a = {};
      a[this.options.property] = val;
      a[this.options.text || 'text'] = isText ? true : false;

      if (val) this.model.set(a);

      // Set icon
      this.$('.select2-choice > div')
        .removeClass()
        .addClass( isText ? 'free-text-icon' : 'combo-option-icon' )
    }

  });

/**
 * enables a catch all for clicks to send singal in godbus to close all dialogs
 */

function enableClickOut(el) {
  el.click(function() {
    cdb.god.trigger("closeDialogs");
  });
}


/**
 * Small moving label used to show errors in operations
 */

cdb.admin.GlobalError = cdb.core.View.extend({
  
  DEFAULT_TAG: '',

  initialize: function() {
    _.bindAll(this, 'hide');
    this._lastType = -1;
    this._lastTag = this.DEFAULT_TAG;
  },

  templates: {
    'info': 'old_common/views/notifications/info',
    'warn': 'old_common/views/notifications/info',
    'error': 'old_common/views/notifications/info',
    'load': 'old_common/views/notifications/loading'
  },

  priority: {
    'error': 3,
    'warn': 2,
    'info': 1,
    'load': 0
  },

  /**
   * Returns the fetched template of the passed type
   * @param  {String} type
   * @return {Function}
   */
  getTypeTemplate: function(type) {
    var url = this.templates[type]? this.templates[type] : this.templates["info"];
    var tmpl = this.getTemplate(url);
    return tmpl;
  },
  // type can be: 'info', 'error'
  showError: function(text, type, timeout, tag) {
    tag = tag || this.DEFAULT_TAG;
    timeout = timeout === undefined ? 2000: timeout;
    type || (type = 'info')

    var priority = this.priority[type] || 0;
    var currentPriority = this.priority[this._lastType] || 0;
    if(priority < currentPriority) {
      return;
    }
    this._lastType = type;
    this._lastTag = tag;

    this.$el.html(this.getTypeTemplate(type)({text: text, type: type}));

    if(this._timer) {
      clearTimeout(this._timer);
    }
    if(timeout > 0) {
      this._timer = setTimeout(this.hide, timeout);
    }
    this.show();
  },

  show: function() {
    this.$el.find("p").stop().animate({marginTop: 0}, 500);
  },

  hide: function(tag) {
    tag = tag || this.DEFAULT_TAG;
    if(this._lastTag !== tag) return;
    this.$el.find("p").stop().animate({marginTop: 40}, 500);
    this._timer = 0;
    this._lastType = -1;
    this._lastTag = this.DEFAULT_TAG;
  },

  listenGlobal: function() {
    cdb.god.bind('error', this.showError, this);
  }

});


/**
 *  Common header for vis view ( table | derived )
 *
 *  - It needs a visualization model, config and user data.
 *
 *    var header = new cdb.admin.Header({
 *      el:       this.$('header'),
 *      model:    visusalization_model,
 *      user:     user_model,
 *      config:   config,
 *      geocoder: geocoder
 *    });
 *
 */

cdb.admin.Header = cdb.core.View.extend({

  _TEXTS: {
    saving:         _t('Saving...'),
    saved:          _t('Saved'),
    error:          _t('Something went wrong, try again later'),
    metadata: {
      edit:         _t('Edit metadata...'),
      view:         _t('View metadata...')
    },
    visualization: {
      loader:       _t('Changing to visualization'),
      created:      _t('Visualization created')
    },
    share: {
      publish:        _t('PUBLISH'),
      visualize:    _t('VISUALIZE')
    },
    share_privacy: {
      ok_next:      _t('Share it now!')
    },
    rename: {
      readonly:     _t('It is not possible to rename<br/>the dataset in <%- mode %> mode'),
      owner:        _t('It is not possible to rename<br/>the dataset if you are not the owner')
    }
  },

  _MAX_DESCRIPTION_LENGTH: 200,

  events: {
    'click a.title':        '_changeTitle',
    'click .metadata a':    '_changeMetadata',
    'click a.options':      '_openOptionsMenu',
    'click a.share':        '_shareVisualization',
    'click a.privacy':      '_showPrivacyDialog',
    'click header nav a':   '_onTabClick'
  },

  initialize: function(options) {

    _.bindAll(this, '_changeTitle', '_setPrivacy');

    this.$body = $('body');
    this.dataLayer = null;
    this.globalError = this.options.globalError;
    this._initBinds();

    // Display all the visualization info
    this.setInfo();
  },

  // Set new dataLayer from the current layerView
  setActiveLayer: function(layerView) {
    // Clean before bindings
    if (this.dataLayer) {
      this.dataLayer.unbind('applySQLView applyFilter errorSQLView clearSQLView', this.setEditableInfo,  this);
      this.dataLayer.table.unbind('change:isSync', this.setEditableInfo, this);
      this.dataLayer.table.unbind('change:permission', this.setInfo, this);
    }

    // Set new datalayer
    this.dataLayer = layerView.model;

    // Apply bindings if model is not a visualization
    if (!this.model.isVisualization()) {
      this.dataLayer.bind('applySQLView applyFilter errorSQLView clearSQLView', this.setEditableInfo,  this);
      this.dataLayer.table.bind('change:isSync', this.setEditableInfo, this);
      this.dataLayer.table.bind('change:permission', this.setInfo, this);
      this.setEditableInfo();
    }

  },

  _initBinds: function() {
    this.model.bind('change:name',        this._setName,            this);
    this.model.bind('change:type',        this.setInfo,             this);
    this.model.bind('change:privacy',     this._setPrivacy,      this);
    this.model.bind('change:permission',  this._setSharedCount,  this);
  },

  _openOptionsMenu: function(e) {
    this.killEvent(e);

    var self = this;
    var $target = $(e.target);

    // Options menu
    this.options_menu = new cdb.admin.HeaderOptionsMenu({
      target: $(e.target),
      model: this.model, // master_vis
      dataLayer: this.dataLayer,
      user: this.options.user,
      private_tables: this.options.user.get("actions").private_tables,
      geocoder: this.options.geocoder,
      backgroundPollingModel: this.options.backgroundPollingModel,
      globalError: this.options.globalError,
      template_base: 'table/header/views/options_menu'
    }).bind("onDropdownShown",function(ev) {
      cdb.god.unbind("closeDialogs", self.options_menu.hide, self.options_menu);
      cdb.god.trigger("closeDialogs");
      cdb.god.bind("closeDialogs", self.options_menu.hide, self.options_menu);
    }).bind('onDropdownHidden', function() {
      this.clean();
      $target.unbind('click');
      cdb.god.unbind(null, null, self.options_menu);
    });

    this.$body.append(this.options_menu.render().el);
    this.options_menu.open(e);
  },

  /**
   *  Share visualization function, it could show
   *  the name dialog to create a new visualization
   *  or directly the share dialog :).
   */
  _shareVisualization: function(e) {
    this.killEvent(e);

    var view;
    if (this.model.isVisualization()) {
      view = new cdb.editor.PublishView({
        clean_on_hide: true,
        enter_to_confirm: true,
        user: this.options.user,
        model: this.model // vis
      });
    } else {
      view = new cdb.editor.CreateVisFirstView({
        clean_on_hide: true,
        enter_to_confirm: true,
        model: this.model,
        router: window.table_router,
        title: 'A map is required to publish',
        explanation: 'A map is a shareable mix of layers, styles and queries. You can view all your maps in your dashboard.'
      });
    }
    view.appendToBody();
  },

  _showPrivacyDialog: function(e) {
    if (e) this.killEvent(e);

    if (this.model.isOwnedByUser(this.options.user)) {
      var dialog = new cdb.editor.ChangePrivacyView({
        vis: this.model, //vis
        user: this.options.user,
        enter_to_confirm: true,
        clean_on_hide: true
      });
      dialog.appendToBody();
    }
  },

  /**
   *  Set visualization info
   */
  setInfo: function() {
    this._setName();
    this._setSyncInfo();
    this._setVisualization();
    this._setMetadata();
  },

  /**
   *  Set editable visualization info
   */
  setEditableInfo: function() {
    this._setName();
    this._setSyncInfo();
    this._setMetadata();
  },

  _setPrivacy: function() {

    var $share  = this.$('a.privacy');

    // Update shared count if it is neccessary
    this._setSharedCount();

    var privacy = this.model.get("privacy").toLowerCase();

    if (privacy == "public") {

      $share
      .removeClass("private")
      .removeClass("link_protected")
      .removeClass("password_protected")
      .removeClass("organization")
      .addClass("public");

    } else if (privacy == "link"){

      $share
      .removeClass("public")
      .removeClass("private")
      .removeClass("password_protected")
      .removeClass("organization")
      .addClass("link_protected");

    } else if (privacy == "private"){

      $share
      .removeClass("public")
      .removeClass("link_protected")
      .removeClass("password_protected")
      .removeClass("organization")
      .addClass("private");

    } else if (privacy == "password"){

      $share
      .removeClass("private")
      .removeClass("link_protected")
      .removeClass("public")
      .removeClass("organization")
      .addClass("password_protected");

    } else if (privacy == "organization"){

      $share
      .removeClass("private")
      .removeClass("link_protected")
      .removeClass("public")
      .removeClass("password_protected")
      .addClass("organization");

    }

    // User is owner of this visualization (table or derived)?
    var isOwner = this.model.permission.isOwner(this.options.user);
    $share.find('i')[ isOwner ? 'removeClass' : 'addClass' ]('disabled');

  },

  _setSharedCount: function() {
    var isOwner = this.model.permission.isOwner(this.options.user);
    var $share  = this.$('a.privacy i');

    $share.empty();

    if (isOwner) {
      var $count = $('<span>').addClass('shared_users');

      if (this.model.permission.acl.size() > 0) {
        // Get total shared users or if the whole organization has access
        var shared_users = 0;
        var users_perm = this.model.permission.getUsersWithAnyPermission();

        if (this.model.permission.isSharedWithOrganization()) {
          shared_users = 'ORG';
        } else {
          shared_users = users_perm.length;
        }

        $count.text( (shared_users !== 0) ? shared_users : '' );

        $share.append($count);
      }
    }
  },

  /**
   *  Change metadata link text
   */
  _setMetadata: function() {
    var isOwner = this.model.permission.isOwner(this.options.user);
    var $metadata = this.$('.metadata a');

    var text = this._TEXTS.metadata.edit;
    var href = "#/edit-metadata";

    if (!isOwner) {
      text = this._TEXTS.metadata.view;
      href = "#/view-metadata";
    }

    $metadata
      .attr('href', href)
      .text(text);
  },

  /**
   *  Set layer sync info if it is needed
   */
  _setSyncInfo: function() {
    this.sync_info && this.sync_info.clean();

    if (!this.model.isVisualization() && this.isSyncTable()) {
      this.$el.addClass('synced');

      this.sync_info = new cdb.admin.SyncInfo({
        dataLayer: this.dataLayer,
        user: this.options.user
      });

      this.$('.sync_status').append(this.sync_info.render().el);
      this.addView(this.sync_info);

    } else {
      this.$el.removeClass('synced');
    }
  },

  /**
   *  Set name of the visualization
   */
  _setName: function() {
    var $title = this.$('h1 a.title');

    $title
      [(this.isVisEditable() && !this.isSyncTable()) ? 'removeClass' : 'addClass' ]('disabled')
      .text(this.model.get('name'))

    document.title = this.model.get('name') + " | CARTO";
  },


  /**
   *  Set visualization type and change share button
   */
  _setVisualization: function() {
    // Change visualization type
    var $back            = this.$('a.back');
    var $share           = this.$('a.share');
    var is_visualization = this.model.isVisualization();

    if (is_visualization) {
      $share.find("span").text(this._TEXTS.share.publish);
      this._setPrivacy();
      var route = cdb.config.prefixUrl() + "/dashboard/maps";
      $back.attr("href", route );
    } else {
      $share.find("span").text(this._TEXTS.share.visualize);
      this._setPrivacy();
      var route = cdb.config.prefixUrl() + "/dashboard/datasets";
      $back.attr("href", route );
    }
  },

  /**
   *  Change visualization metadata
   */
  _changeMetadata: function(ev) {
    ev.preventDefault();

    var dlg = new cdb.editor.EditVisMetadataView({
      maxLength: this._MAX_DESCRIPTION_LENGTH,
      vis: this.model,
      dataLayer: this.dataLayer && this.dataLayer.table,
      user: this.options.user,
      clean_on_hide: true,
      enter_to_confirm: false,
      onShowPrivacy: this._showPrivacyDialog.bind(this),
      onDone: this._onChangeMetadata.bind(this)
    });

    dlg.appendToBody();
  },

  _onChangeMetadata: function(nameChanged) {
    // Check if attr saved is name to change url when
    // visualization is table type
    if (nameChanged && !this.model.isVisualization()) {
      window.table_router.navigate(this._generateTableUrl(), {trigger: false});
      window.table_router.addToHistory();
    }
  },

  /**
   *  Change visualization title
   */
  _changeTitle: function(e) {
    this.killEvent(e);

    var self = this;
    var isOwner = this.model.permission.isOwner(this.options.user);

    if (this.isVisEditable()) {
      this.title_dialog && this.title_dialog.clean();
      cdb.god.trigger("closeDialogs");

      var title_dialog = this.title_dialog = new cdb.admin.EditTextDialog({
        initial_value: this.model.get('name'),
        template_name: 'table/views/edit_name',
        clean_on_hide: true,
        modal_class: 'edit_name_dialog',
        onResponse: setTitle
      });

      cdb.god.bind("closeDialogs", title_dialog.hide, title_dialog);

      // Set position and show
      var pos = $(e.target).offset();
      pos.left -= $(window).scrollLeft()
      pos.top -= $(window).scrollTop()
      var w = Math.max($(e.target).width() + 100, 280);
      title_dialog.showAt(pos.left - 20, pos.top - 10, w);
    } else {
      var $el = $(e.target);
      $el
        .bind('mouseleave', destroyTipsy)
        .tipsy({
          fade:     true,
          trigger:  'manual',
          html:     true,
          title:    function() {
            var mode = self.isSyncTable() ? 'sync' : 'read-only';
            return _.template(self._TEXTS.rename[ !isOwner ? 'owner' : 'readonly' ])({ mode: mode })
          }
        })
        .tipsy('show')
    }

    function destroyTipsy() {
      var $el = $(this);
      var tipsy = $el.data('tipsy');
      if (tipsy) {
        $el
          .tipsy('hide')
          .unbind('mouseleave', destroyTipsy);
      }
    }

    function setTitle(val) {
      if (val !== self.model.get('name') && val != '') {
        // Sanitize description (html and events)
        var title = cdb.Utils.stripHTML(val,'');

        if (self.model.isVisualization()) {
          self._onSetAttributes({ name: title });
        } else {
          // close any prev modal if existing
          if (self.change_confirmation) {
            self.change_confirmation.clean();
          }
          self.change_confirmation = cdb.editor.ViewFactory.createDialogByTemplate('common/dialogs/confirm_rename_dataset');

          // If user confirms, app set the new name
          self.change_confirmation.ok = function() {
            self._onSetAttributes({ name: title });
            if (_.isFunction(this.close)) {
              this.close();
            }
          };

          self.change_confirmation
            .appendToBody()
            .open();
        }
      }
    }
  },



  /**
   *  Wait function before set new visualization attributes
   */
  _onSetAttributes: function(d) {

    var old_data = this.model.toJSON();
    var new_data = d;

    this.model.set(d, { silent: true });

    // Check if there is any difference
    if (this.model.hasChanged()) {
      var self = this;

      this.globalError.showError(this._TEXTS.saving, 'load', -1);

      this.model.save({},{
        wait: true,
        success: function(m) {
          // Check if attr saved is name to change url
          if (new_data.name !== old_data.name && !self.model.isVisualization()) {
            window.table_router.navigate(self._generateTableUrl(), {trigger: false});
            window.table_router.addToHistory();
          }

          self.globalError.showError(self._TEXTS.saved, 'info', 3000);
        },
        error: function(msg, resp) {
          var err =  resp && JSON.parse(resp.responseText).errors[0];
          self.globalError.showError(err, 'error', 3000);
          self.model.set(old_data, { silent: true });
          self.setInfo();
        }
      });
    }


  },

  /**
   *  Check if visualization/table is editable
   *  (Checking if it is visualization and/or data layer is in sql view)
   */
  isVisEditable: function() {
    if (this.model.isVisualization()) {
      return true;
    } else {
      var table = this.dataLayer && this.dataLayer.table;

      if (!table) {
        return false;
      } else if (table && (table.isReadOnly() || !table.permission.isOwner(this.options.user))) {
        return false;
      } else {
        return true;
      }
    }
  },


  isSyncTable: function() {
    if (this.dataLayer && this.dataLayer.table) {
      return this.dataLayer.table.isSync();
    }
    return false;
  },


  _generateTableUrl: function(e) {
    // Let's create the url ourselves //
    var url = '';

    // Check visualization type and get table or viz id
    if (this.model.isVisualization()) {
      url += '/viz/' + this.model.get('id');
    } else {
      var isOwner = this.model.permission.isOwner(this.options.user);
      var table = new cdb.admin.CartoDBTableMetadata(this.model.get('table'));

      // Qualify table urls if user is not the owner
      if (!isOwner) {
        var owner_username = this.model.permission.owner.get('username');
        url += '/tables/' + owner_username + '.' + table.getUnqualifiedName();
      } else {
        url += '/tables/' + table.getUnqualifiedName();
      }
    }

    // Get scenario parameter from event or current url (table or map)
    var current = e ? $(e.target).attr('href') : window.location.pathname;
    if (current.search('/map') != -1) {
      url += '/map'
    } else {
      url += '/table'
    }

    return url;
  },


  _onTabClick: function(e) {
    e.preventDefault();
    window.table_router.navigate(this._generateTableUrl(e), {trigger: true});
  }
});


/**
 * use as global hotkey watcher:
 *
 * cdb.god.bind('hotkey:s', function() ...
 */

cdb.admin.hotkeys = {

  _keyMap: {
    68: 's',
    67: 'c',
    83: 's'
  },

  enable: function() {
    $('body').bind('keydown', function(e) {
      if(e.altKey && e.ctrlKey) {
        var evt = cdb.admin.hotkeys._keyMap[e.keyCode];
        if(evt) {
          cdb.god.trigger('hotkey:' + evt, e);
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      }
    });
  }
};

(function(){
  var localStorageWrapper = function(name) {
    this.name = name;
  }

  localStorageWrapper.prototype.get = function(n) {

    if (localStorage.getItem(this.name)) {

      if (n === undefined) {
        return JSON.parse(localStorage.getItem(this.name));
      } else {
        var data = JSON.parse(localStorage.getItem(this.name));
        return data[n];
      }
    } else {
      return [];
    }

  }

  localStorageWrapper.prototype.search = function(searchTerm) {
    var wholeArray = JSON.parse(localStorage.getItem(this.name));
    for(var i in wholeArray) {
      if(wholeArray[i][searchTerm]) {
        return wholeArray[i][searchTerm];
      }
    }
    return null;
  }

  localStorageWrapper.prototype.set = function(data) {

    if (!localStorage.getItem(this.name)) {
      localStorage.setItem(this.name, "[]");
    }
    return localStorage.setItem(this.name, JSON.stringify(data));
  }

  localStorageWrapper.prototype.add = function(obj) {
    var data = this.get();
    if (data) {
      data.push(obj);
      return this.set(data);
    }
  }

  localStorageWrapper.prototype.remove = function(n) {
    var data = this.get();
    data.splice(n,n);
    return this.set(data);
  }

  localStorageWrapper.prototype.destroy = function() {
    localStorage.removeItem(this.name);
  }

  cdb.admin.localStorage = localStorageWrapper;
}())


  /**
   *  Metrics class for CartoDB
   *
   *  - Track user events in CartoDB.
   *  - When an event is launched, you can use our God to
   *  save the action (cdb.god.trigger('metrics', '{{ metric_name }}', { email: {{ email }}, data: {{ data }} });).
   *
   *  new cdb.admin.Metrics();
   */

  cdb.admin.Metrics = cdb.core.Model.extend({

    initialize: function(opts) {
      this.bindEvents();
    },

    bindEvents: function() {
      cdb.god.bind("metrics", this._setTrack, this);
    },

    _setTrack: function(name, obj) {

      // HubSpot tracking
      if (window.hubspot_token) {
        window._hsq = window._hsq || [];
        window._hsq.push(['identify', {
          email: obj.email
        }]);

        var event_id;

        switch(name) {
          case 'published_visualization':
            event_id = window.hubspot_ids.published_visualization
            break;
          case 'visited_dashboard':
            event_id = window.hubspot_ids.visited_dashboard
            break;
          case 'connect_dataset':
            event_id = window.hubspot_ids.connect_dataset
            break;
          case 'create_map':
            event_id = window.hubspot_ids.create_map
            break;
          case 'export_table':
            event_id = window.hubspot_ids.export_table
            break;
          case 'export_map':
            event_id = window.hubspot_ids.export_map;
            break;
          case 'select_wms':
            event_id = window.hubspot_ids.select_wms
            break;
          case 'color_basemap':
            event_id = window.hubspot_ids.color_basemap
            break;
          case 'pattern_basemap':
            event_id = window.hubspot_ids.pattern_basemap
            break;
          case 'geocoding':
            event_id = window.hubspot_ids.geocoding
            break;
          case 'visual_merge':
            event_id = window.hubspot_ids.visual_merge
            break;
          case 'common_data':
            event_id = window.hubspot_ids.common_data
            break;
          case 'cartocss_manually':
            event_id = window.hubspot_ids.cartocss_manually
            break;
          case 'wizard':
            event_id = window.hubspot_ids.wizard
            break;
          case 'filter':
            event_id = window.hubspot_ids.filter
            break;
          case 'query':
            event_id = window.hubspot_ids.query
            break;
          case 'logged_in':
            event_id = window.hubspot_ids.logged_in
            break;
          case 'visited_dashboard_first_time':
            event_id = window.hubspot_ids.visited_dashboard_first_time
            break;
          case 'applied_pecan':
            event_id = window.hubspot_ids.applied_pecan
            break;
          case 'open_pecan_list':
            event_id = window.hubspot_ids.open_pecan_list
            break;

        }

        window._hsq.push(['trackEvent', {
          id: event_id
        }]);
      }

    }

  });

/**
 * base class for all small dialogs
 * inherit from this class, see EditTextDialog
 * for an example
 */
cdb.admin.SmallDialog = cdb.ui.common.Dialog.extend({

  className: 'floating',

  initialize: function() {
    _.extend(this.options, {
              title: '',
              description: '',
              clean_on_hide: true
    });
    cdb.ui.common.Dialog.prototype.initialize.apply(this);
    this.render();
    $(document.body).append(this.el);
  },

  /** show at position */
  showAt: function(x, y, width, fix) {
    this.$el.css({
      top: y,
      left: x,
      minWidth: width
    });

    if (fix) {
      this.$el.find("> textarea, > input").css({
        minWidth: width - 22
      })
    }

    this.show();
  },

  /**
   * show the dialog on top of an element
   * useful in events:
      dlg.showAtElement(e.target);
   */
  showAtElement: function(el) {
    var pos = $(el).offset();
    this.showAt(pos.left, pos.top);
  }
});

cdb.admin.EditTextDialog = cdb.admin.SmallDialog.extend({

  events: cdb.core.View.extendEvents({
    'keypress input': '_keyPress',
    'click': '_stopPropagation'
  }),

  initialize: function() {
    _.defaults(this.options, {
      template_name: 'old_common/views/dialog_small_edit',
      ok_title: 'Save',
      modal_class: 'edit_text_dialog',
      clean_on_hide: true
    });
    this.constructor.__super__.initialize.apply(this);
  },

  render_content: function() {
    this._focusInput();
    var input = '<input value="' + this.options.initial_value.replace(/\"/g,'&quot;').replace(/\'/g,"&#39;") + '" ';
    if(this.options.maxLength) {
      input += 'maxLength = ' + this.options.maxLength;
    }
    input += ' type="text"/>';
    return input;
  },

  _stopPropagation: function(e) {
    e.stopPropagation();
  },

  _focusInput: function() {
    var self = this;
    setTimeout(function(){
      var width = self.$el.outerWidth() - self.$el.find("a.button").outerWidth() - 35;
      self.$el.find("input").width(width).focus();
    },0);
  },

  _keyPress: function(e) {
    if(e.keyCode === 13) {
      this._ok();
    }
  },

  ok: function() {
    if(this.options.onResponse) {
      this.options.onResponse(this.$('input').val());
    }
  }
});

cdb.admin.EditMarkdownDialog = cdb.admin.SmallDialog.extend({

  events: cdb.core.View.extendEvents({
    'keypress input': '_keyPress',
    'click': '_stopPropagation'
  }),

  initialize: function() {
    _.defaults(this.options, {
      old_template_name: 'old_common/views/dialog_markdown_edit',
      ok_title: 'Save',
      modal_class: 'edit_name_dialog markdown',
      clean_on_hide: true
    });
    this.constructor.__super__.initialize.apply(this);
  },

  render_content: function() {
    this._focusInput();
    var input = '<div class="input_field"><input value="' + this.options.initial_value.replace(/\"/g,'&quot;').replace(/\'/g,"&#39;") + '" ';
    if(this.options.maxLength) {
      input += 'maxLength = ' + this.options.maxLength;
    }
    input += ' type="text"/><div class="hint"><strong>**bold**</strong> <em>*italics*</em> [link title](url)</div></div>';
    return input;
  },

  _stopPropagation: function(e) {
    e.stopPropagation();
  },

  _focusInput: function() {
    var self = this;
    setTimeout(function(){
      var width = self.$el.outerWidth() - self.$el.find("a.button").outerWidth() - 35;
      self.$el.find(".input_field").width(width);
      self.$el.find(".input_field input").focus();
    },0);
  },

  _keyPress: function(e) {
    if(e.keyCode === 13) {
      this._ok();
    }
  },

  ok: function() {
    if(this.options.onResponse) {
      this.options.onResponse(this.$('input').val());
    }
  }

 
});

cdb.admin.Tabs = cdb.core.View.extend({

    events: {
      'click': '_click'
    },

    initialize: function() {
      _.bindAll(this, 'activate');
      this.preventDefault = false;
    },

    activate: function(name) {
      this.$('a').removeClass('selected');
      this.$('a[href$="#'+ ((this.options.slash) ? '/' : '') + name + '"]').addClass('selected');
    },

    desactivate: function(name) {
      this.$('a[href$="#' + ((this.options.slash) ? '/' : '') + name + '"]').removeClass('selected');
    },

    disable: function(name) {
      this.$('a[href$="#' + ((this.options.slash) ? '/' : '') + name + '"]').addClass('disabled');
    },

    enable: function(name) {
      this.$('a[href$="#' + ((this.options.slash) ? '/' : '') + name + '"]').removeClass('disabled');
    },

    getTab: function(name) {
      return this.$('a[href$="#' + ((this.options.slash) ? '/' : '') + name + '"]');
    },

    disableAll: function() {
      this.$('a').addClass('disabled');
    },

    removeDisabled: function() {
      this.$('.disabled').parent().remove();
    },

    _click: function(e) {
      if (e && this.preventDefault) e.preventDefault();

      var
      t    = $(e.target).closest('a'),
      href = t.attr('href');

      if (!t.hasClass('disabled') && href) {
        var name = href.replace('#/', '#').split('#')[1];
        this.trigger('click', name);
      }
    },

    linkToPanel: function(panel) {
      this.preventDefault = true;
      panel.bind('tabEnabled', this.activate, this);
      this.bind('click', panel.active, panel);
    }

});


  /**
   *  Tipsy tooltip view.
   *
   *  - Needs an element to work.
   *  - Inits tipsy library.
   *  - Clean bastard tipsy bindings easily.
   *
   */


  cdb.common.TipsyTooltip = cdb.core.View.extend({

    options: {
      gravity:  's',
      fade:     true
    },

    initialize: function(opts) {
      if (opts.el === undefined) {
        cdb.log.info('Element is needed to have tipsy tooltip working');
        return false;
      }
      this._tipsyOpenedManually = opts.trigger === 'manual';

      this._initTipsy();
    },

    showTipsy: function() {
      this.$el.tipsy('show');
    },

    hideTipsy: function() {
      this.$el.tipsy('hide');
    },

    _initTipsy: function() {
      this.$el.tipsy(this.options);
      this.tipsy = this.$el.data('tipsy');
    },

    _destroyTipsy: function() {
      if (this.tipsy) {
        // tipsy does not return this
        this.tipsy.hide();
        this.$el.unbind('mouseleave mouseenter');
      }
      if (this._tipsyOpenedManually) {
        this.$el.tipsy('hide');
      }
    },

    clean: function() {
      this._destroyTipsy();
      cdb.core.View.prototype.clean.call(this);
    }

  });


  /**
   *  Tooltip that follows the mouse while dragging, you have
   *   to use jQuery UI lib to get events when dragging.
   */

  cdb.admin.TooltipTrails = cdb.core.View.extend({

    className: 'tooltip-trails',
    tagName: 'div',

    options: {
      msg: _t('Checking tooltip-trails'),
      offset: [15,5] // X,Y
    },

    render: function() {
      this.$el.append(this.options.msg);
      return this;
    },

    show: function(pos) {
      this.$el.css({
        'margin-left': this.options.offset[0],
        'margin-top': this.options.offset[1],
        'left':  pos.left,
        'top': pos.top
      })

      this.$el.show();
    },

    // Needs left and top object
    move: function(pos) {
      this.$el.css(pos);
    },

    hide: function() {
      this.$el.hide();
      this.clean();
    }

  })
/**
 * URL representing dashboard datasets
 */
cdb.common.DashboardDatasetsUrl = cdb.common.DashboardVisUrl.extend({

  dataLibrary: function() {
    return this.urlToPath('library');
  }
});

/**
 * URLs associated with the dashboard.
 */
cdb.common.DashboardUrl = cdb.common.Url.extend({

  datasets: function() {
    return new cdb.common.DashboardDatasetsUrl({
      base_url: this.urlToPath('datasets')
    });
  },

  maps: function() {
    return new cdb.common.DashboardVisUrl({
      base_url: this.urlToPath('maps')
    });
  },

  deepInsights: function() {
    return new cdb.common.DashboardVisUrl({
      base_url: this.urlToPath('deep-insights')
    });
  }
});

/**
 * URL for a dataset (standard vis).
 */
cdb.common.DatasetUrl = cdb.common.Url.extend({

  edit: function() {
    return this.urlToPath();
  },

  public: function() {
    return this.urlToPath('public');
  }
});

/**
 * URL for a map (derived vis).
 */
cdb.common.MapUrl = cdb.common.Url.extend({

  edit: function() {
    return this.urlToPath('map');
  },

  public: function() {
    return this.urlToPath('public_map');
  },

  deepInsights: function() {
    return this.urlToPath('deep-insights');
  }
});

/**
 * URL for a map (derived vis).
 */
cdb.common.OrganizationUrl = cdb.common.Url.extend({

  edit: function(user) {
    if (!user) {
      throw new Error('User is needed to create the url');
    }
    return this.urlToPath(user.get('username') + '/edit');
  },

  create: function() {
    return this.urlToPath('new');
  },

  groups: function() {
    return this.urlToPath('groups');
  }

});

/**
 * URLs associated with a particular user.
 */
cdb.common.UserUrl = cdb.common.Url.extend({

  initialize: function (attrs) {
    cdb.common.Url.prototype.initialize.apply(this, arguments);
    if (_.isUndefined(attrs.is_org_admin)) {
      throw new Error('is_org_admin is required')
    }
  },

  organization: function() {
    if (this.get('is_org_admin')) {
      return new cdb.common.OrganizationUrl({
        base_url: this.urlToPath('organization')
      });
    } else {
      return this.urlToPath('account');
    }
  },

  accountSettings: function() {
    return this.urlToPath('profile');
  },

  publicProfile: function() {
    return this.urlToPath('me');
  },

  apiKeys: function() {
    return this.urlToPath('your_apps');
  },

  logout: function() {
    return this.urlToPath('logout');
  },

  dashboard: function() {
    return new cdb.common.DashboardUrl({
      base_url: this.urlToPath('dashboard')
    });
  }
});



  /*
   *  Utils for CartoDB App
   */

  cdb.Utils = {};


  /*
   *  Strip html tags from a value.
   *  input ->  string with input text (example: '<a href="#whoknows">Jamon</a> </br> <p>Vamos</p>')
   *  allowed -> allowed html tags in the result (example: '<a>')
   *
   *  return -> '<a href="#whoknows">Jamon</a> Vamos'
   */

  cdb.Utils.stripHTML = function(input, allowed) {
    allowed = (((allowed || "") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('');
    var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
    if (!input || (typeof input != "string")) return '';
    return input.replace(tags, function ($0, $1) {
      return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
    });
  }


  /*
   *  Remove events attached in html code.
   *  input ->  string with input text (example: '<a href="#whoknows" onClick="alert('jamon')">Jamon</a>')
   *
   *  return -> '<a href="#whoknows">Jamon</a>'
   */

  cdb.Utils.removeHTMLEvents = function(input) {
    if (input) {
      return input.replace(/ on\w+="[^"]*"/g, '');
    } else {
      return '';
    }
  }

  /*
   *  Truncate a string
   *  input -> string with input text
   *  length -> length of the output string
   *
   *  return -> true
   */

  cdb.Utils.truncate = function(input, length) {
    return input.substr(0, length-1) + (input.length > length ? '&hellip;' : '');
  }


  /*
   *  Simple regex to check if string is an url/ftp
   *  input ->  string with input text (example: 'https://carto.com')
   *
   *  return -> true
   */

  cdb.Utils.isURL = function(input) {
    var urlregex = /^((http|https|ftp)\:\/\/)/g;
    if (input) {
      return urlregex.test(input);
    } else {
      return false;
    }
  }


  cdb.Utils.encodeURLParams = function(url) {
    if (this.isURL(url)) {
      var urlParts = url.split('?');
      if (urlParts.length > 1) {
        return urlParts[0] + '?' + encodeURIComponent(urlParts[1]);
      } else {
        return url;
      }
    }
    return url;
  }


  /*
   *  Transform bytes to a readable format, like MB, GB
   *  input ->  34234244
   *
   *  return -> 3 MB
   */

  cdb.Utils.readablizeBytes = function(bytes, round) {
    if (!bytes || isNaN(bytes)) {
      return 0;
    }
    var s = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'];
    var e = Math.floor(Math.log(bytes)/Math.log(1024));
    var value = (bytes/Math.pow(1024, Math.floor(e))).toFixed(2);

    if (round) { value = parseInt(value) }

    return value + " " + s[e];
  }

  /*
   * isEmpty
   *
   */
  cdb.Utils.isEmpty = function(str) {
    return (!str || 0 === str.length);
  }

  /*
   * isBlank
   *
   */
  cdb.Utils.isBlank = function(str) {
    return (!str || /^\s*$/.test(str));
  }

  /*
   * formatNumber: adds thousands separators
   * @return a string
   *
   */
  cdb.Utils.formatNumber = function(x) {
    if (!x) return "0";
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }

  /*
   * rgbToHex
   *
   */
  cdb.Utils.rgbToHex = function(r, g, b) {

    function componentToHex(c) {
      var hex = c.toString(16);
      return hex.length == 1 ? "0" + hex : hex;
    }

    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
  }

  /*
   * hexToRGB
   *
   */
  cdb.Utils.hexToRGB = function(hex) {

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;

  }


  /*
   *  Generate random password
   *
   */

  cdb.Utils.genRandomPass = function(length) {

    function getRandomNum() {
      // between 0 - 1
      var rndNum = Math.random()
      // rndNum from 0 - 1000
      rndNum = parseInt(rndNum * 1000);
      // rndNum from 33 - 127
      rndNum = (rndNum % 94) + 33;
      return rndNum;
    }

    function checkPunc(num) {
      if ((num >=33) && (num <=47)) { return true; }
      if ((num >=58) && (num <=64)) { return true; }
      if ((num >=91) && (num <=96)) { return true; }
      if ((num >=123) && (num <=126)) { return true; }
      return false;
    }

    length = isNaN(length) ? "" : length
    var pass = "";
    var randomLength = !length ? true : false;

    if (randomLength) {
      length = Math.random();
      length = parseInt(length * 100);
      length = (length % 7) + 6
    }

    for (i=0; i < length; i++) {
      numI = getRandomNum();
      while (checkPunc(numI)) { numI = getRandomNum() }
      pass = pass + String.fromCharCode(numI);
    }

    return pass;
  }


  /**
   *  Add leading zeros to numbers
   *
   */
  cdb.Utils.pad = function(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
  }


  /**
   *  Remove all non-common characters like
   *  spaces, quotes, accents, etc...
   *
   */
  cdb.Utils.sanitizeString = function(str) {
    return str.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '-');
  }

  /**
   *  Convert long numbers to
   *  readizable numbers.
   *
   */
  cdb.Utils.readizableNumber = function(num) {
    if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'G';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
  }

  /**
   *  Get the extension of a string
   *
   */
  cdb.Utils.getFileExtension = function(str) {
    if (!str) return '';

    return str.substr(str.lastIndexOf('.') + 1);
  }


  /**
   *  Get ordinal string from a number
   *
   */
  cdb.Utils.getGetOrdinal = function(n) {
    if (!n) {
      return '';
    }
    var s = ["th","st","nd","rd"];
    var v = n%100;
    return n+(s[(v-20)%10]||s[v]||s[0]);
  }

  cdb.Utils.capitalize = function(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  cdb.Utils.isValidEmail = function(str) {
    var re = /^([^@]+)@([^@]+)\.([^@\.]+)$/i;
    return re.test(str);
  }

  /**
   * Similar to _.result, but also allows passing arbitrary arguments to the property if it's function.
   * This makes code more terse  when one just wants to use a value if it's available, no if-checks required.
   *
   * @example Expected output
   *   model.set('something', 'yay');
   *   cdb.Utils.result(model, 'get', 'something') // => 'yay'
   *   cdb.Utils.result(model, 'nonexisting', 'else') // => undefined
   *   cdb.Utils.result(undefinedVar, 'get') // => null
   *
   * @example Of usage
   *  return cdb.Utils.result(model, 'get', 'mightNotExist') === 'OK'
   *
   * @param {*} maybeFn
   * @return {*} Result from called maybeFn if a function, null otherwise
   */
  cdb.Utils.result = function(object, property) {
    if (object == null) return null;
    var value = object[property];
    return _.isFunction(value) ? value.apply(object, Array.prototype.slice.call(arguments, 2)) : value;
  };

  /*
   * Returns a (double) quoted table name if needed (if it contains a dash, for example).
   * Coupled to backend lib/carto/table_utils.rb#safe_table_name_quoting.
   * Duplicated at lib/assets/javascripts/cartodb3/helpers/utils.js to make it available for older models.
   */
  cdb.Utils.safeTableNameQuoting = function (table_name) {
    if (table_name === undefined || table_name.indexOf('-') === -1 || table_name[0] === '"' || table_name[table_name.length - 1] === '"') {
      return table_name;
    } else {
      return '"' + table_name + '"';
    }
  };

/**
 *  Video player
 *
 */
cdb.admin.VideoModel = cdb.core.Model.extend({

  defaults: {
    minimized: true,
    size: {
      minimized: {
        width: 420,
        height: 236
      },
      maximized: {
        width : 700,
        height: 393
      }
    },
  },

  initialize: function () {

    this._initLocalStorage();

    var minimized = this.defaults.minimized;

    if (this.videoData && this.videoData.minimized !== undefined) {
      minimized = this.videoData.minimized;
    }

    var defaults = this.defaults.size[minimized ? "minimized" : "maximized"];

    this.set({
      minimized: minimized,
      width: defaults.width,
      height: defaults.height,
      seconds: this.videoData ? this.videoData.seconds : 0,
      top: this.videoData ? this.videoData.top : null,
      left: this.videoData ? this.videoData.left : 20,
      bottom: this.videoData ? this.videoData.bottom : 20
    });

    this.bind('change',  this._onChangeProperty, this);
    this.bind('change:minimized', this._onChangeMinimized, this);

  },

  _initLocalStorage: function() {

    this.localStorage = new cdb.admin.localStorage("VideoPlayer");

    this.videoData = this.localStorage.get("currentVideo") || {};

    var video_id = this.get("video_id");

    if (video_id) {
      this._storeVideoID(video_id);
      this.videoData = this.localStorage.get("currentVideo");
    } else {
      this.set("video_id", this.videoData.video_id);
    }

  },

  _onChangeMinimized: function() {
    var defaults = this.defaults.size[this.get("minimized") ? "minimized" : "maximized"];
    this.set("width", defaults.width);
    this.set("height", defaults.height);

  }, 

  _onChangeProperty: function(m) {
    this.videoData = m.attributes;
    this._saveVideoData();
  },

  _saveVideoData: function() {
    this.set(this.videoData);
    this.localStorage.set({ currentVideo: this.videoData });
  },

  _storeVideoID: function(id) {
    this.videoData.video_id = id;
    this._saveVideoData();
  },

  clearStoredData: function(status) {
    this.set("video_id", null);
    this.videoData = {};
    this.localStorage.set({ currentVideo: null });
  }

});

cdb.admin.VideoPlayer = cdb.core.View.extend({

  className: 'VideoPlayer',

  events: {
    "dblclick": "_toggle",
    "click .js-toggle": "_toggle",
    "click .js-close": "close",
    "mouseenter": "_mouseEnter",
    "mouseleave": "_mouseLeave"
  },

  initialize: function(id) {

    _.bindAll(this, "_onInitDraggable", "_onStopDragging", "_onCloseAnimationFinished");

    this.template = cdb.templates.getTemplate('dashboard/views/video_player');

    this._initModel();
  },

  render: function() {

    var self = this;

    this.clearSubViews();

    if (this.hasVideoData()) {

      this.$el.html(
        this.template({
        id: this.model.get("video_id")
      }));

      this.$el.draggable({
        stop: self._onStopDragging,
        create: self._onInitDraggable
      });

      this.video = this.$el.find("iframe");
      this._loadScript();

    }

    return this;

  },

  _initModel: function() {
    this.model = new cdb.admin.VideoModel({ video_id: this.options.id });
    this.model.bind('change:minimized', this._onChangeMinimized, this);
  },

  _loadScript: function() {
    var self = this;
    $.getScript('//f.vimeocdn.com/js/froogaloop2.min.js', function() {
      self._initVideoBinds();
    });
  },

  _initVideoBinds: function() {
    var self = this;

    this.player = $f(this.video[0]);

    this.player.addEvent('ready', function() {

      self._seekToStoredPosition();

      self.player.addEvent('pause', function(m) {
        self.model.set("status", "stop");
      });

      self.player.addEvent('finish', function(m) {
        self.model.set("status", "stop");
        self.close(false, { dontHide: true });
      });

      self.player.addEvent('play', function(m) {
        self.model.set("status", "play");
      });

      self.player.addEvent('playProgress', function(m) {
        self.model.set("seconds", m.seconds);
      });

    });
  },

  _removeVideoBinds: function() {
    if (this.player) {
      this.player.removeEvent('ready');
    }
  },

  _onInitDraggable: function(e, ui) {

    var bottom       = this.model.get("bottom");
    var left         = this.model.get("left");
    var elHeight     = this.model.get("height");
    var elWidth      = this.model.get("width");
    var windowWidth  = $(window).width();

    if ((left + elWidth) > windowWidth) {
      left = windowWidth - elWidth - 20;
    }

    this.$el.css({
      position: "fixed",
      left: left,
      bottom: bottom
    });

    if (bottom < 0) {
      this.$el.animate({ bottom: 20, width: elWidth, height: elHeight }, { easing: "easeOutQuad", duration: 200 });
    } else {
      this.$el.animate({ width: elWidth, height: elHeight }, { easing: "easeOutQuad", duration: 200 });
    }

  },

  _onStopDragging: function(e, ui) {

    var windowHeight = $(window).height();
    var top          = ui.position.top;
    var left         = ui.position.left;
    var bottom       = windowHeight - (top + this.$el.outerHeight(true));

    this.$el.css({ bottom: "auto"})

    this.model.set({ top: top, left: left, bottom: bottom });
  },

  _mouseEnter: function() {
    this.$el.find(".VideoControls").fadeIn(150);
  },

  _mouseLeave: function() {
    this.$el.find(".VideoControls").fadeOut(150);
  },

  hasVideoData: function() {
    if (this.model.get("video_id")) {
      return true;
    } else {
      return false;
    }
  },

  _seekToStoredPosition: function() {

    var self = this;

    var seconds = this.model.get("seconds");

    if (seconds) {
      this.player.api('seekTo', seconds);
    }

    if (this.model.get("status") === "stop") {

      setTimeout(function() {
        self.player.api('pause');
      }, 100);

    }

  },

  close: function(e, opts) {

    if (e) this.killEvent(e);

    if (opts && opts.dontHide) {
      this.model.clearStoredData();
    } else {
      this.$el.animate({ width: 0, height: 0, opacity: 0 }, { easing: "easeInQuad", duration: 200, complete: this._onCloseAnimationFinished });
    }

  },

  _onCloseAnimationFinished: function() {
    this.model.clearStoredData();
    this._removeVideoBinds();
    this.remove();
  },

  _toggle: function(e) {

    if (e) this.killEvent(e);

    this.model.set("minimized", !!!this.model.get("minimized"));
  },

  _onChangeMinimized: function() {

    var self = this;

    var windowWidth    = $(window).width();
    var windowHeight   = $(window).height();
    var documentHeight = $(document).height();

    var bottom = this.model.get("bottom");
    var top    = this.model.get("top");

    var elTop  = this.$el.offset().top;
    var elLeft = this.$el.position().left;

    function setHorizontalPosition(w) {
      if ((elLeft + w) > windowWidth) {
        var right = windowWidth - elLeft - self.$el.outerWidth(true);
        self.$el.css({ left: "auto", right: right });
      }
    }

    function setVerticalPosition(h) {
       if (top < 0 || self.$el.offset().top < 0) {
        self.$el.animate({ top: 20 }, 100);
       } else if (top - h < 0 || self.$el.offset().top - h < 0) {
        self.$el.css({ bottom: "auto", top: top });
      } else if (bottom < 0) {
        self.$el.css({ top: "auto", bottom: 20 });
      } else if ((top + h) > windowHeight) {
        self.$el.css({ top: "auto", bottom: bottom });
      } 
    }

    var width  = this.model.get("width");
    var height = this.model.get("height");

    setHorizontalPosition(width);
    setVerticalPosition(height);

    this.$el.animate({ width: width, height: height }, { easing: "easeOutQuad", duration: 200, complete: function() {
      var bottom = $(window).height() - ($(".VideoPlayer").offset().top + $(".VideoPlayer").outerHeight(true));
      self.model.set("bottom", bottom);
    } });

  }

});



cdb.admin.WizardDialog = cdb.ui.common.Dialog.extend({
});

  /**
   *  Editor small dialog where cell editor will be placed on it.
   */

  cdb.admin.SmallEditorDialog = cdb.admin.SmallDialog.extend({

    initialize: function() {
      _.defaults(this.options, {
        template_name: 'old_common/views/dialog_small_edit',
        ok_title: 'Save',
        modal_class: 'edit_text_dialog',
        clean_on_hide: true
      });

      cdb.ui.common.Dialog.prototype.initialize.apply(this);
      this.render();

      // Ouch!!
      $(document.body).find("div.table table").append(this.el);
    },

    /**
     *  Render correct editor
     */
    render_content: function() {
      var $content  = $('<div>');
      
      if (this.options.editorField) {
        this.editor   = new this.options.editorField({
                        label:      false,
                        autoResize: false,
                        rowNumber:  this.options.rowNumber,
                        row:        this.options.row,
                        readOnly:   this.options.readOnly,
                        model: new cdb.core.Model({
                          attribute:  this.options.column,
                          value:      this.options.value
                        })
                      }).bind("ENTER", this._ok, this);

        $content.append(this.editor.render().el);
        this.addView(this.editor);
      }

      return $content;
    },


    /**
     *  Overwriting the show function
     */
    showAt: function(x, y, width, fix) {
      this.$el.css({
        top: y,
        left: x,
        minWidth: width
      });

      if (fix) {
        this.$el.find("textarea").css({
          'min-width': width - 22
        })
      }

      this.show();
      this.$el.find("textarea, input")
        .focus()
        .select();
    },


    /**
     *  Ok button function
     */
    _ok: function(ev) {
      if(ev) ev.preventDefault();

      // If the time is not ok, the dialog is not correct
      if (!this.editor.isValid()) {
        return false;
      }

      if (this.options.res) {
        this.options.res(this.editor.model.get('value'));
      }

      this.hide();
    }

  });

/**
 * this infowindow is shown in the map when user clicks on a feature
 */

(function() {

  var MapInfowindow = cdb.geo.ui.Infowindow.extend({

    _TEXTS: {
      _NO_FIELDS_SELECTED:        _t("You haven’t selected any fields to be shown in the infowindow."),
      _NO_FIELDS_SELECTED_BUTTON: _t("Select fields")
    },

    _TEMPLATE_URL: 'table/views/infowindow/templates',

    events: cdb.core.View.extendEvents({
      'click .edit_data': '_editData',
      'click .edit_geo':  '_editGeom',
      'click .remove':    '_removeGeom',
      'click .open_infowindow_panel': '_openInfowindowPanel'
    }),

    initialize: function() {
      var self = this;
      _.bindAll(this, '_removeGeom');
      this.table = this.options.table;
      this.model.set({ content: 'loading...' });
      // call parent
      this.constructor.__super__.initialize.apply(this);
      this.model.set('offset', [28, 0]);
      this.model.bind('change:fields', function() {
        if (!this.hasChanged('content') && self.row) {
          self.renderInfo();
        }
      });

      this.table.bind('change:schema', this.render, this);
      this.add_related_model(this.table);

      // Create a help dialog for the infowindows with images
      if (this._containsCover) this._createHelpDialog();

      // Set live tipsy when geom is enabled or disabled
      this.$("div.cartodb-edit-buttons a.button").tipsy({
        live:true,
        fade:true,
        gravity: 's',
        offset: -2,
        className: function(){
          return $(this).closest(".cartodb-popup").hasClass('dark') ? 'dark' : ''
        },
        title: function(ev){
          var enabled = !$(this).hasClass("disabled");
          if (enabled) {
            return $(this).text()
          } else {
            return 'Not available in this mode'
          }
        }
      })
    },

    _createHelpDialog: function() {
      this.helpDialog = cdb.editor.ViewFactory.createDialogByTemplate('common/dialogs/help/infowindow_with_images', {}, { clean_on_hide: false });
      this.addView(this.helpDialog);
    },

    setFeatureInfo: function(cartodb_id) {
      // Set cartodb_id
      this.cartodb_id = cartodb_id;

      // render to update cartodb_id
      this.render();

      // Get row data and show the content
      if(this.row) {
        this.row.unbind(null, null, this);
      }
      this.row = this.table.data().getRow(cartodb_id, {
        no_add: true
      });

      this.row
        .bind('change', this.renderInfo, this)
        .fetch({ cache: false, no_geom: true });

      // trigger renderInfo now to render the actual contents
      this.renderInfo();

      return this;
    },

    /**
     * renders the infowindows adding some editing features
     */
    render: function() {

      var self = this;

      // render original
      cdb.geo.ui.Infowindow.prototype.render.call(this);

      var fields = this.model.get('fields');

      // Show no_fields state when there isn't any field
      // and a custom template is not selected
      if((!fields || (fields && !fields.length)) && (!this.model.get('template'))) {

        // Add empty fields to the infowindow
        this.$('.cartodb-popup').addClass("no_fields");

        // Check if the infowindow has header or not
        var popup_class = '.cartodb-popup-content';
        if (this.$('.cartodb-popup-header').length > 0) {
          popup_class = '.cartodb-popup-header';
        }

        this.$(popup_class).html(
          '<p class="italic">' + this._TEXTS._NO_FIELDS_SELECTED + '</p>' +
          '<p><a class="margin5 underline open_infowindow_panel" href="#/select-fields">' + this._TEXTS._NO_FIELDS_SELECTED_BUTTON + '</a></p>'
        )
      } else {
        this.$('.cartodb-popup').removeClass("no_fields");
      }


      // render edit and remove buttons
      this.$('.cartodb-popup-content-wrapper')
        .append(this.getTemplate('table/views/infowindow/infowindow_footer')({ "cartodb_id": this.cartodb_id }));

      if (this.table.isReadOnly()) {
        this.$('.cartodb-popup-content-wrapper').find('a.remove, a.edit_data, a.edit_geo').addClass('disabled');
      }

      if (this._containsCover()) { // bind the help link to the helpDialog
        this.$(".image_not_found a.help").off("click");
        this.$(".image_not_found a.help").on("click", function() {
          $('body').append(self.helpDialog.render().el);
          self.helpDialog.open();
        });
      }

    },

    renderInfo: function() {
      var self = this;
      var row_attributes = self.row.attributes;
      var fields = [];

      for (var property in row_attributes) {
        if (row_attributes.hasOwnProperty(property)) {
          if (self.model.containsField(property) && !_.contains(self.model.SYSTEM_COLUMNS, property)) {
            var h = {
              title: self.model.getFieldProperty(property, 'title') ? property : null,
              value: row_attributes[property],
              position: self.model.getFieldPos(property)
            };

            fields.push(h);
          }
        }
      }

      // sort
      fields = _.compact(fields);
      fields.sort(function(a, b) {
        return a.position - b.position;
      });

      // filter and add index
      var render_fields = [];
      for(var i = 0; i < fields.length; ++i) {
        var f = fields[i];
        if(f) {
          //
          // header template use index to detect if it's the first element
          // renderer to use special style.
          // Mustache only matches as false a null, undefined or false value
          // so for the first element we set index as null
          // yes, very hacky :(
          f.index = render_fields.length ? render_fields.length: null,
          render_fields.push(f);
        }
      }

      if (fields.length > 0) {
        // Set content
        this.model.set({ content:  { fields: render_fields } });
      } else {
        // Show loading due to the fact that we don't have the content yet
        this.setLoading();
      }

      if(this.model.get('visibility')) {
        // Just move the map if need it when fields are already added.
        this.adjustPan();
      }
    },


    /**
     *  Attempts to load the cover URL and show it
     */
    _loadCover: function() {
      var self = this;

      if (!this._containsCover()) return;

      var $cover = this.$(".cover");
      var $imageNotFound = this.$(".image_not_found");
      var $img = $cover.find("img");
      var url = this._getCoverURL();

      if (!this._isValidURL(url)) {
        $imageNotFound.fadeIn(250);
        $img.hide();
        return;
      }

      // configure spinner
      var
      target  = document.getElementById('spinner'),
      opts    = { lines: 9, length: 4, width: 2, radius: 4, corners: 1, rotate: 0, color: '#ccc', speed: 1, trail: 60, shadow: true, hwaccel: false, zIndex: 2e9 },
      spinner = new Spinner(opts).spin(target);

      // create the image
      $imageNotFound.hide();

      $img.hide(function() {
        this.remove();
      });

      $img = $("<img />").attr("src", url);
      $cover.append($img);

      $img.load(function(){
        spinner.stop();

        var w  = $img.width();
        var h  = $img.height();
        var coverWidth = $cover.width();
        var coverHeight = $cover.height();

        var ratio = h / w;
        var coverRatio = coverHeight / coverWidth;

        // Resize rules
        if ( w > coverWidth && h > coverHeight) { // bigger image
          if ( ratio < coverRatio ) $img.css({ height: coverHeight });
          else {
            var calculatedHeight = h / (w / coverWidth);
            $img.css({ width: coverWidth, top: "50%", position: "absolute", "margin-top": -1*parseInt(calculatedHeight, 10)/2 });
          }
        } else {
          var calculatedHeight = h / (w / coverWidth);
          $img.css({ width: coverWidth, top: "50%", position: "absolute", "margin-top": -1*parseInt(calculatedHeight, 10)/2 });
        }

        $img.fadeIn(300);
      })
      .error(function(){
        spinner.stop();
        $imageNotFound.fadeIn(250);
      });
    },


    /**
     * triggers an editGeom event with the geometry
     * infowindow is currently showing
     */
    _editGeom: function(e) {
      this.killEvent(e);
      if (!this.table.isReadOnly()) {
        this.model.set("visibility", false);
        this.trigger('editGeom', this.row);
      }
    },

    _editData: function(e) {
      this.killEvent(e);
      if (!this.table.isReadOnly()) {
        this.model.set("visibility", false);
        this.trigger('editData', this.row);
      }
    },

    _removeGeom: function(e) {
      this.killEvent(e);
      if (!this.table.isReadOnly()) {
        this.model.set("visibility", false);
        this.trigger('removeGeom', this.row);
      }
    },

    _openInfowindowPanel: function(e) {
      this.killEvent(e);
      this.trigger('openInfowindowPanel');
    },

    _getModelTemplate: function() {
      var template_name = cdb.admin.mod.TemplateMap[this.model.get("template_name")] || this.model.get("template_name");
      return this._TEMPLATE_URL + "/" + template_name;
    }

  });

  // export
  cdb.admin.MapInfowindow = MapInfowindow;

})();


cdb.admin.Tooltip = cdb.geo.ui.Tooltip.extend({

  _TEMPLATE_URL: 'table/views/tooltip/templates',

  defaults: {
    vertical_offset: 10,
    horizontal_offset: 4,
    position: 'bottom|right'
  },

  events: {
    'mouseover': '_lock',
    'mouseout': '_unlock'
  },

  initialize: function() {
    this.table = this.options.table;
    this.options.empty_fields = true; // render empty fields
    cdb.geo.ui.Tooltip.prototype.initialize.call(this);
    this.model.bind('change:template_name', this._setTemplate, this);
    this.model.bind('change:template', this._compileTemplate, this);
    this.model.bind('change:fields',this._changeFields, this);
    this.model.bind('change:alternative_names',this._alternameNames, this);
    this._setTemplate();
    this._alternameNames();
    this._changeFields();
    if (this.model.get('template')) {
      this._compileTemplate();
    }
    this.targetPos = null;
    this.locked = false;
    this.hideTimeout = -1;
  },

  render: function(data) {
    if (this.model.fieldCount()) {
      cdb.geo.ui.Tooltip.prototype.render.call(this, data);
    } else {
      this.el.innerHTML = '';
    }

    return this;
  },

  _lock: function(e) {
    this.locked = true;
    clearTimeout(this.hideTimeout);
  },

  _unlock: function(e) {
    this.locked = false;
  },

  _changeFields: function() {
    this.setFields(this.model.get('fields'));
  },

  _alternameNames: function() {
    this.options.alternative_names = this.model.get('alternative_names');
  },

  /**
   *  Compile template of the tooltip
   */
  _compileTemplate: function() {
    var template = this.model.get('template') ?
      this.model.get('template') :
      cdb.templates.getTemplate(this._getModelTemplate());

    if(typeof(template) !== 'function') {
      this.template = new cdb.core.Template({
        template: template,
        type: this.model.get('template_type') || 'mustache'
      }).asFunction()
    } else {
      this.template = template
    }

    this.render();
  },

  _setTemplate: function() {
    if (this.model.get('template_name')) {
      this.template = cdb.templates.getTemplate(this._getModelTemplate());
      this.render();
    }
  },

  _getModelTemplate: function() {
    return this._TEMPLATE_URL + "/" + this.model.get('template_name')
  },

  _move: function() {
    if (!this.targetPos) return;
    var pos = this.$el.position();
    var dx = this.targetPos.x - pos.left;
    var dy = this.targetPos.y - pos.top;
    pos.left += dx*0.05;
    pos.top += dy*0.05;
    this.$el.css(pos);
    if (!this.locked && (Math.abs(dx) > 1 || Math.abs(dy) > 1)) {
      L.Util.requestAnimFrame(this._move, this);
    }
  }

});


/**
 * view used to render each row
 */
cdb.admin.RowView = cdb.ui.common.RowView.extend({
  classLabel: 'cdb.admin.RowView',
  events: {
    'click      .row_header': '_onOptionsClick',
    'mouseout   .row_header': '_onOptionsOut'
  },

  cellRenderers: {
    'default': '_renderDefault',
    'boolean': '_renderBoolean',
    'number': '_renderNumber',
    'geometry': '_renderGeometry'
  },

  initialize: function() {
    var self = this;
    this.elder('initialize');
    _.bindAll(this, '_onOptionsClick', '_onOptionsOut')
    this.options.row_header = true;

    this.retrigger('saving', this.model);
    this.retrigger('saved', this.model);
    this.retrigger('errorSaving', this.model);
  },

  _getRowOptions: function() {
    if(!cdb.admin.RowView.rowOptions) {
       var rowOptions = cdb.admin.RowView.rowOptions = new cdb.admin.RowHeaderDropdown({
        position: 'position',
        user: this.tableView.user,
        template_base: "table/views/table_row_header_options",
        tick: "top",
        horizontal_position: "left",
        tableData: this.getTableView().dataModel,
        table: this.getTableView().model
      });
      rowOptions.render();
      this.retrigger('createRow', rowOptions);

    }
    return cdb.admin.RowView.rowOptions;
  },

  _onOptionsOut: function(e) {
    var $relatedTarget = $(e.relatedTarget)
      , current_row_id = $relatedTarget.closest('tr').attr('id');

    if ($relatedTarget.closest('.dropdown').length == 0 && $relatedTarget.closest('.row_header').length == 0) {
      if (this.rowOptions) this.rowOptions.hide();
    }
  },

  _onOptionsClick: function(e) {
    var rowOptions, tableData, pos, tableOffset, left, top
      , $target = $(e.target);

    tableData = this.getTableView().dataModel;
    if(this.table.isReadOnly()) {
      // if data is read only do not allow
      // to add or remove rows
      return;
    }
    rowOptions = this._getRowOptions();
    e.preventDefault();
    $target.append(rowOptions.el);

    left = 30;
    top = 5;

    // If it is the last td of the table, show the dropdown upwards
    if ($target.closest("tr").is(':last-child') && $target.closest("tr").index() > 1) {
      rowOptions.options.vertical_position = "top";
      rowOptions.options.tick = "bottom";
    } else {
      rowOptions.options.vertical_position = "down";
      rowOptions.options.tick = "top";
    }

    rowOptions.setRow(this.model);
    rowOptions.openAt(left, top);
    this.rowOptions = rowOptions; // to make it testable;
    return false;
  },

  /**
   * return each cell view
   */
  valueView: function(colName, value) {

    this.table = this.table || this.getTableView().model;
    var render = '_renderDefault';
    if(colName.length) {
      var colType = this.table.getColumnType(colName);
      render = this.cellRenderers[colType] || render;
    }

    var obj = $(this[render](value));
    obj.addClass('cell');
    if(cdb.admin.Row.isReservedColumn(colName)) {
      obj.addClass('disabled');
    }

    // It is the first cell?
    if(colName === '' && value === '') {
      if(this.table.isReadOnly()) {
        // No row options button
        obj
          .addClass('disabled')
          .html('');
      } else {
        // Add row options button
        obj.addClass('row_header');
      }
    }
    return obj;
  },

  _renderDefault: function(value, additionalClasses) {
    additionalClasses = additionalClasses || '';

    var cell;

    if (value === null) {
      additionalClasses += " isNull"
      cell =  '<div class="'+ additionalClasses +'">null</div>';
    } else cell =  '<div class="'+ additionalClasses +'">' + _.escape(value) + '</div>';

    return cell;
  },

  _renderBoolean: function(value) {
    return this._renderDefault(value, 'boolean');
  },

  _renderNumber: function(value) {
    return this._renderDefault(value, 'number');
  },

  _renderGeometry: function(value) {
    var self = this;
    function geomDisplayValue(value) {
      var v = _.uniq(self.table.geomColumnTypes());
      if (!_.isNull(value) && v && v.length && v[0]) {
        v = v[0];
        // capitalize
        value = v.charAt(0).toUpperCase() + v.substring(1).toLowerCase();
      }
      return value;
    }

    var objValue = {};
    try {
      objValue = JSON.parse(value);
      function formatCoord(c) {
        var val = "       ";
        if (c !== undefined) {
          val = c.toFixed(4);
          if (c > 0) {
            val = " " + val;
          }
        }
        return val;
      }
      if(objValue.type === 'Point') {
        value = formatCoord(objValue.coordinates[0]) + ',' + formatCoord(objValue.coordinates[1]);
      } else {
        value = geomDisplayValue(value);
      }
    } catch (e) {
      value = geomDisplayValue(value);
    }
    return this._renderDefault(value);
  }

});



/**
 * header cell view, manages operations on table columns
 */

(function() {

var HeaderView = cdb.admin.HeaderView = cdb.core.View.extend({

  _TEXTS: {
    no_geo: {
      title:        _t('Georeference your table'),
      description:  _t('This funcionality is not available in the visualization view. \
                    Please, visit <a href="<%- prefix %>/tables/<%- table_name %>">your table</a> and start georeferencing there.'),
      ok:           _t('Ok, close')
    }
  },

  NO_MENU_COLUMNS: ['the_geom', 'the_geom_webmercator'],

  events: {
    'dblclick .coloptions':     'renameColumn',
    'click    .coloptions':     'showColumnOptions',
    'click    .coltype':        'showColumnTypeOptions',
    'click    .geo':            'showGeoreferenceWindow',
    'keydown  .col_name_edit':  '_checkEditColnameInput',
    'focusout input':           '_finishEdit',
    'click':                    'activateColumnOptions'
  },

  initialize: function() {
    var self = this;
    this.column = this.options.column;
    this.table = this.options.table;
    this.vis = this.options.vis;
    this.template = this.getTemplate('table/views/table_header_view');
    this.editing_name = false;
    this.changing_type = false;

    this.vis.bind('change:type', function() {
      // You can't geocode being in a visualization of type derived
      HeaderView && HeaderView.colTypeOptions.render();
    });

    this.add_related_model(this.vis);

    if (HeaderView.colOptions === undefined) {
      HeaderView.colOptions= new cdb.admin.HeaderDropdown({
        user: this.options.user,
        position: 'position',
        horizontal_position: "right",
        tick: "right",
        template_base: "table/views/table_header_options",
        sqlView: this.options.sqlView,
        vis: this.vis
      });
      HeaderView.colOptions.render();

      cdb.god.bind("closeDialogs", HeaderView.colOptions.hide, HeaderView.colOptions);
    }

    if (HeaderView.colTypeOptions === undefined) {
      HeaderView.colTypeOptions= new cdb.admin.ColumntypeDropdown({
        user: this.options.user,
        position: 'position',
        horizontal_position: "right",
        tick: "right",
        template_base: "table/views/table_column_type_options"
      });
      HeaderView.colTypeOptions.render();
      cdb.god.bind("closeDialogs", HeaderView.colTypeOptions.hide, HeaderView.colTypeOptions);
    }
  },

  _addColumn: function(column) {
    table.tableTab.tableView.addColumn(column);
  },

  render: function() {
    this.$el.html('');

    this.$el.append(this.template({
      col_name:         this.column[0],
      col_type:         this.column[1],
      editing_name:     this.editing_name,
      changing_type:    this.changing_type,
      read_only:        this.table.isReadOnly(),
      isReservedColumn: this.table.isReadOnly() || this.table.isReservedColumn(this.column[0]),
      noMenu:           (this.NO_MENU_COLUMNS.indexOf(this.column[0]) >= 0)
    }));

    // Focus in the input if it is being edited
    // and set the correct width
    if (this.editing_name) {
      // In case the element is not present in DOM or not visible the width would be 0, so fallback on a reasonable
      // width (e.g. happens for adding a column on an empty dataset)
      var w = this.$el.find("p.auto").width() || 175;
      this.$el.find("input")
        .css({
          "max-width":  w,
          "width":      w
        })
        .focus();
    }

    this.delegateEvents();

    return this;
  },

  _openColOptions: function(e) {
    var self = this;
    var colOptions = HeaderView.colOptions;

    // Unbind events
    colOptions.off();
    cdb.god.unbind('closeDialogs', HeaderView.colOptions.hide, HeaderView.colOptions);

    // Close other dialogs
    cdb.god.trigger("closeDialogs");

    // set data for column and table currently editing
    colOptions.setTable(this.table, this.column[0]);

    colOptions.bind('addColumn', this._addColumn, this);
    colOptions.bind('renameColumn', this.renameColumn, this);
    colOptions.bind('changeType', this._changeType, this);
    colOptions.bind('clearView', function(){
      self.trigger('clearView');
    }, this);
    colOptions.bind('georeference', function(column) {
      self.trigger('georeference', column);
    }, this);
    colOptions.bind('applyFilter', function(column) {
      self.trigger('applyFilter', column);
    }, this);

    // bind the stuff
    var container = $(e.target).parent().parent();
    container.append(colOptions.el);

    var link_width  = $(e.target).width() + 26
      , th          = container.parent();

    // align to the right of the target with a little of margin
    colOptions.openAt(link_width - colOptions.$el.width(), (th.height()/2) + 7);

    // Bind again!
    cdb.god.bind("closeDialogs", HeaderView.colOptions.hide, HeaderView.colOptions);
  },

  _openColTypeOptions: function(e) {
    if(this.table.isReadOnly()) {
      return;
    }
    var colOptions = HeaderView.colTypeOptions;

    // Unbind events
    colOptions.off();
    cdb.god.unbind('closeDialogs', HeaderView.colTypeOptions.hide, HeaderView.colTypeOptions);

    // Close other dialogs
    cdb.god.trigger("closeDialogs");

    // set data for column and table currently editing
    colOptions.setTable(this.table, this.column[0]);

    // bind the stuff
    var container = $(e.target).parent().parent();
    container.append(colOptions.el);

    var link_width  = $(e.target).outerWidth() + 24
      , th          = container.parent();

    // align to the right of the target with a little of margin
    colOptions.openAt(link_width - colOptions.$el.width(), (th.height()/2) + 25);


    // Bind again
    cdb.god.bind("closeDialogs", HeaderView.colTypeOptions.hide, HeaderView.colTypeOptions);
  },

  _checkEditColnameInput: function(e) {
    if(e.keyCode === 13) {
      this._submitEdit();
    }
    if(e.keyCode === 27) {
      this._finishEdit();
    }

  },

  _submitEdit: function() {
    this.table.renameColumn(this.column[0], $('.col_name_edit').val());
    this._finishEdit();
  },

  _finishEdit: function() {
    this.editing_name = false;
    this.render();
  },

  renameColumn: function(ev) {
    if (ev) {
      this.killEvent(ev)
    }

    this.editing_name = true;
    this.changing_type = false;
    this.render();
  },

  _changeType: function(column) {
    this.editing_name = false;
    this.changing_type = true;

    // Simulate click
    var $coltype_link = this.$el.find('a.coltype');
    $coltype_link.click();
  },

  activateColumnOptions: function(e) {
    this.killEvent(e);
    this.$el.find("a.coloptions").click();
  },

  showColumnOptions: function(e) {
    var self = this;
    var colOptions = HeaderView.colOptions;
    var columnName = this.column[0];

    e.preventDefault();

    // If submenu was openened before, let's close it.
    if (colOptions.isOpen && columnName == colOptions.column) {
      colOptions.hide();
      return false;
    }

    // If submenu is from different column or it is closed.
    if (this.NO_MENU_COLUMNS.indexOf(this.column[0]) < 0) {
      colOptions.hide(function() {
        colOptions.parent_ && colOptions.parent_.css('z-index', 0);
        var parent_ = self.$el.find('th > div');
        colOptions.parent_ = parent_;
        parent_.css('z-index', '100');
        self._openColOptions(e);
      });
    }

    return false;
  },

  showGeoreferenceWindow: function(e) {
    this.killEvent(e);
    this.trigger('georeference', null);
  },

  showColumnTypeOptions: function(e) {
    var self = this;
    var colOptions = HeaderView.colTypeOptions;
    var columnName = this.column[0];

    if (e) e.preventDefault();

    // If submenu was openened before, let's close it.
    if (colOptions.isOpen && columnName == colOptions.column) {
      colOptions.hide();
      return false;
    }

    // If submenu is from different column or it is closed.
    colOptions.hide(function() {
      self._openColTypeOptions(e);
    });

    return false;
  }

});

})();


(function() {

    /**
     * table view shown in admin
     */
    cdb.admin.TableView = cdb.ui.common.Table.extend({

      classLabel: 'cdb.admin.TableView',

      events: cdb.core.View.extendEvents({
          'click .clearview': '_clearView',
          'click .sqlview .export_query': '_tableFromQuery',
          'click .noRows': 'addEmptyRow'
      }),

      rowView: cdb.admin.RowView,

      initialize: function() {
        var self = this;
        this.elder('initialize');
        this.options.row_header = true;
        this.globalError = this.options.globalError;
        this.vis = this.options.vis;
        this.user = this.options.user;
        this._editorsOpened = null;

        this.initializeBindings();

        this.initPaginationAndScroll();
      },

      /**
       * Append all the bindings needed for this view
       * @return undefined
       */
      initializeBindings: function() {
        var self = this;

        _.bindAll(this, "render", "rowSaving", "addEmptyRow",
          "_checkEmptyTable", "_forceScroll", "_scrollMagic",
          "rowChanged", "rowSynched", "_startPagination", "_finishPagination",
          "rowFailed", "rowDestroyed", "emptyTable");

        this.model.data().bind('newPage', this.newPage, this);

        //this.model.data().bind('loadingRows', this._startPagination);
        this.model.data().bind('endLoadingRows', this._finishPagination);

        this.bind('cellDblClick', this._editCell, this);
        this.bind('createRow', function() {
          self._checkEmptyTable();
        });


        this.model.bind('change:dataSource', this._onSQLView, this);
        // when model changes the header is re rendered so the notice should be added
        //this.model.bind('change', this._onSQLView, this);
        this.model.bind('dataLoaded', function() {
          //self._checkEmptyTable();
          self._forceScroll();
        }, this);

        this.model.bind('change:permission', this._checkEmptyTable, this);

        this.model.bind('change:isSync', this._swicthEnabled, this);
        this._swicthEnabled();

        // Actions triggered in the right panel
        cdb.god.bind("panel_action", function(action) {
          self._moveInfo(action);
        }, this);
        this.add_related_model(cdb.god);

        // Geocoder binding
        this.options.geocoder.bind('geocodingComplete geocodingError geocodingCanceled', function() {
          this.notice(_t('loaded'));
        }, this);
        this.add_related_model(this.options.geocoder);
      },

      initPaginationAndScroll: function() {
        var self = this;
        var topReached = false;
        var bottomReached = false;

        // Initialize moving header and loaders when scrolls
        this.scroll_position = { x:$(window).scrollLeft(), y:$(window).scrollTop(), last: 'vertical' };
        $(window).scroll( this._scrollMagic );

        // Pagination
        var SCROLL_BACK_PIXELS = 2;
        this.checkScrollTimer = setInterval(function() {
          if(!self.$el.is(":visible") || self.model.data().isFetchingPage()) {
            return;
          }
          var pos = $(this).scrollTop();
          var d = self.model.data();
          // do not let to fetch previous pages
          // until the user dont scroll back a little bit
          // see comments below
          if(pos > SCROLL_BACK_PIXELS) {
            topReached = false;
          }
          var pageSize = $(window).height() - self.$el.offset().top;
          var tableHeight = this.$('tbody').height();
          var realPos = pos + pageSize;
          if(tableHeight < pageSize) {
            return;
          }
          // do not let to fetch previous pages
          // until the user dont scroll back a little bit
          // if we dont do this when the user reach the end of the page
          // and there are more rows than max_rows, the rows form the beggining
          // are removed and the scroll keeps at the bottom so a new page is loaded
          // doing this the user have to move the scroll a little bit (2 px)
          // in order to load the page again
          if(realPos < tableHeight - SCROLL_BACK_PIXELS) {
            bottomReached = false;
          }
          if(realPos >= tableHeight) {
            if(!bottomReached) {
              // Simulating loadingRows event
              if (!d.lastPage) self._startPagination('down');

              setTimeout(function() {
                d.loadPageAtBottom();
              },600);
            }
            bottomReached = true;
          } else if (pos <= 0) {
            if(!topReached) {
              // Simulating loadingRows event
              if (d.pages && d.pages[0] != 0) self._startPagination('up');

              setTimeout(function() {
                d.loadPageAtTop()
              },600);
            }
            topReached = true;
          }

          self._setUpPagination(d);
        }, 300);
        this.bind('clean', function() {
          clearInterval(this.checkScrollTimer);
        }, this);
      },

      needsRender: function(table) {
        if (!table) return true;
        var ca = table.changedAttributes();
        if (ca.geometry_types && _.keys(ca).length === 1) {
          return false;
        }
        return true;
      },

      render: function(args) {
        if (!this.needsRender(args)) return;
        this.elder('render', args);
        if (this.model.isInSQLView()) {
          this._onSQLView();
        }
        this._swicthEnabled();
        this.trigger('render');
      },

      _renderHeader: function() {
        var thead = cdb.ui.common.Table.prototype._renderHeader.apply(this);
        // New custom shadow (better performance)
        thead.append($('<div>').addClass('shadow'));
        return thead;
      },

      addColumn: function(column){
        this.newColumnName = "column_" + new Date().getTime();

        this.model.addColumn(this.newColumnName, 'string');

        this.unbind("render", this._highlightColumn, this);
        this.bind("render", this._highlightColumn, this);
      },

      _highlightColumn: function() {

        if (this.newColumnName) {

          var $th = this.$("a[href='#" + this.newColumnName + "']").parents("th");
          var position = $th.index();

          if (position) {

            setTimeout(function() {
              var windowWidth = $(window).width();
              if ($th && $th.position()) {
                var centerPosition = $th.position().left - windowWidth/2 + $th.width()/2;
                $(window).scrollLeft(centerPosition);
              }
              this.$("[data-x='" + position + "']").addClass("is-highlighted");
            }, 300);

            this.unbind("render", this._highlightColumn, this);
          }
        }
      },

      /**
       *  Take care if the table needs space at top and bottom
       *  to show the loaders.
       */
      _setUpPagination: function(d) {
        var pages = d.pages;

        // Check if the table is not in the first page
        if (pages.length > 0 && pages[0] > 0) {
          // In that case, add the paginator-up loader and leave it ready
          // when it is necessary
          if (this.$el.find('tfoot.page_loader.up').length == 0) {
            this.$el.append(this.getTemplate('table/views/table_pagination_loaders')({ direction: 'up' }));
          }
          // Table now needs some space at the top to show the loader
          this.$el.parent().addClass("page_up");
        } else {
          // Loader is not needed and table doesn't need any space at the top
          this.$el.parent().removeClass("page_up");
        }

        // Checks if we are in the last page
        if (!d.lastPage) {
          // If not, let's prepare the paginator-down
          if (this.$el.find('tfoot.page_loader.down').length == 0) {
            this.$el.append(this.getTemplate('table/views/table_pagination_loaders')({ direction: 'down' }));
          }
          // Let's say to the table that we have paginator-down
          this.$el.parent().addClass("page_down");
        } else {
          // Loader is not needed and table doesn't need any space at the bottom
          this.$el.parent().removeClass("page_down");
        }
      },


      /**
       *  What to do when a pagination starts
       */
      _startPagination: function(updown) {
        // Loader... move on buddy!
        this.$el.find(".page_loader." + updown + "").addClass('active');
      },

      /**
       *  What to do when a pagination finishes
       */
      _finishPagination: function(page, updown) {

        // If we are in a different page than 0, and we are paginating up
        // let's move a little bit the scroll to hide the loader again
        // HACKY
        if (page != 0 && updown == "up") {
          setTimeout(function(){
            $(window).scrollTop(180);
          },300);
        }

        this.$el.find('.page_loader.active').removeClass('active');
      },


      _onSQLView: function() {
        // bind each time we change dataSource because table unbind
        // all the events from sqlView object each time useSQLView is called
        this.$('.sqlview').remove();

        this.options.sqlView.unbind('reset error', this._renderSQLHeader, this);
        this.options.sqlView.unbind('loading', this._renderLoading, this);

        this.options.sqlView.bind('loading', this._renderLoading, this);
        this.options.sqlView.bind('reset', this._renderSQLHeader, this);
        this.options.sqlView.bind('error', this._renderSQLHeader, this);
        this._renderSQLHeader();
      },

      _renderLoading: function(opts) {
        opts = opts || {};
        this.cleanEmptyTableInfo();
        if(!opts.add) {
          this._renderBodyTemplate('table/views/sql_loading');
        }
      },

      _renderSQLHeader: function() {
        var self = this;
        if(self.model.isInSQLView()) {
          var empty = self.isEmptyTable();
          self.$('thead').find('.sqlview').remove();
          self.$('thead').append(
            self.getTemplate('table/views/sql_view_notice')({
              empty: empty,
              isVisualization: self.vis.isVisualization(),
              warnMsg: null
            })
          );

          self.$('thead > tr').css('height', 64 + 42);
          if(self.isEmptyTable()) {
            self.addEmptySQLIfo();
          }

          self._moveInfo();
        }
      },

      // depending if the sync is enabled add or remove a class
      _swicthEnabled: function() {
        // Synced?
        this.$el[ this.model.isSync() ? 'addClass' : 'removeClass' ]('synced');
        // Visualization?
        this.$el[ this.vis.isVisualization() ? 'addClass' : 'removeClass' ]('vis');
      },

      _clearView: function(e) {
        if (e) e.preventDefault();
        this.options.layer.clearSQLView();
        return false;
      },

      _tableFromQuery: function(e) {
        e.preventDefault();

        var duplicate_dialog = new cdb.editor.DuplicateDatasetView({
          model: this.model,
          user: this.user,
          clean_on_hide: true
        });
        duplicate_dialog.appendToBody();
      },


      /**
       *  Function to control the scroll in the table (horizontal and vertical)
       */
      _scrollMagic: function(ev) {
        var actual_scroll_position = { x:$(window).scrollLeft(), y:$(window).scrollTop() };

        if (this.scroll_position.x != actual_scroll_position.x) {
          this.scroll_position.x = actual_scroll_position.x;
          this.$el.find("thead").addClass("horizontal");

          // If last change was vertical
          if (this.scroll_position.last == "vertical") {
            this.scroll_position.x = actual_scroll_position.x;

            this.$el.find("thead > tr > th > div > div:not(.dropdown)")
              .removeAttr("style")
              .css("top", actual_scroll_position.y + "px");

            this.scroll_position.last = "horizontal";
          }

        } else if (this.scroll_position.y != actual_scroll_position.y) {
          this.scroll_position.y = actual_scroll_position.y;
          this.$el.find("thead").removeClass("horizontal");

          // If last change was horizontal
          if (this.scroll_position.last == "horizontal") {

            this.$el.find("thead > tr > th > div > div:not(.dropdown)")
              .removeAttr('style')
              .css({"marginLeft": "-" + actual_scroll_position.x + "px"});

            this.scroll_position.last = "vertical";
          }
        }
      },


      /**
       *  Move the info content if the panel is opened or hidden.
       *  - Query info if query is applied
       *  - Query loader if query is appliying in that moment
       *  - Add some padding to last column of the content to show them
       */
      _moveInfo: function(type) {
        if (type == "show") {
          this.$el
            .removeClass('narrow')
            .addClass('displaced');
        } else if (type == "narrow") {
          this.$el.addClass('displaced narrow')
        } else if (type == "hide") {
          this.$el.removeClass('displaced narrow');
        } else {
          // Check from the beginning if the right menu is openned, isOpen from
          // the menu is not working properly
          if ($('.table_panel').length > 0) {
            var opened = $('.table_panel').css("right").replace("px","") == 0 ? true : false;
            if (!opened) {
              this.$el.removeClass('displaced');
            }
          }
        }
      },

      _getEditor: function(columnType, opts) {
        var editors = {
          'string':                       cdb.admin.StringField,
          'number':                       cdb.admin.NumberField,
          'date':                         cdb.admin.DateField,
          'geometry':                     cdb.admin.GeometryField,
          'timestamp with time zone':     cdb.admin.DateField,
          'timestamp without time zone':  cdb.admin.DateField,
          'boolean':                      cdb.admin.BooleanField
        };

        var editorExists = _.filter(editors, function(a,i) { return i === columnType }).length > 0;

        if(columnType !== "undefined" && editorExists) {
          return editors[columnType];
        } else {
          return editors['string']
        }
      },


      closeEditor: function() {
        if (this._editorsOpened) {
          this._editorsOpened.hide();
          this._editorsOpened.clean();
        }
      },


      _editCell: function(e, cell, x, y) {
        var self = this;

        // Clean and close previous cell editor
        this.closeEditor();

        var column = self.model.columnName(x-1);
        var columnType = this.model.getColumnType(column);

        if (this.model.isReservedColumn(column) && !this.model.isReadOnly() && columnType!='geometry') {
          return;
        }

        var row = self.model.data().getRowAt(y);

        var initial_value = '';
        if(self.model.data().getCell(y, column) === 0 || self.model.data().getCell(y, column) === '0') {
          initial_value = '0';
        } else if (self.model.data().getCell(y, column) !== undefined) {
          initial_value = self.model.data().getCell(y, column);
        }

        // dont let generic editor
        if(column == 'the_geom') {
          columnType = 'geometry'
        }

        var prevRow = _.clone(row.toJSON());

        var dlg = this._editorsOpened = new cdb.admin.SmallEditorDialog({
          value:        initial_value,
          column:       column,
          row:          row,
          rowNumber:    y,
          readOnly:     this.model.isReadOnly(),
          editorField:  this._getEditor(columnType),
          res: function(new_value) {
            if(!_.isEqual(new_value, prevRow[column])) {
              // do not use save error callback since it avoid model error method to be called
              row.bind('error', function editError() {
                row.unbind('error', editError);
                // restore previopis on error
                row.set(column, prevRow[column]);
              });
              row
                .save(column, new_value)
                .done(function(a){
                  self.model.trigger('data:saved');
                });
            }
          }
        });

        if(!dlg) {
          cdb.log.error("editor not defined for column type " + columnType);
          return;
        }

        // auto add to table view
        // Check first if the row is the first or the cell is the last :)
        var $td = $(e.target).closest("td")
          , offset = $td.offset()
          , $tr = $(e.target).closest("tr")
          , width = Math.min($td.outerWidth(), 278);

        // Remove header spacing from top offset
        offset.top = offset.top - this.$el.offset().top;

        if ($td.parent().index() == 0) {
          offset.top += 5;
        } else {
          offset.top -= 11;
        }

        if ($td.index() == ($tr.find("td").size() - 1) && $tr.find("td").size() < 2) {
          offset.left -= width/2;
        } else {
          offset.left -= 11;
        }

        dlg.showAt(offset.left, offset.top, width, true);
      },


      headerView: function(column) {
        var self = this;

        if(column[1] !== 'header') {
          var v = new cdb.admin.HeaderView({
            column: column,
            table: this.model,
            sqlView: this.options.sqlView,
            user: this.user,
            vis: this.vis
          })
          .bind('clearView', this._clearView, this)
          .bind('georeference', function(column) {
            var dlg;
            var bkgPollingModel = this.options.backgroundPollingModel;
            var tableIsReadOnly = this.model.isSync();
            var canAddGeocoding = bkgPollingModel !== "" ? bkgPollingModel.canAddGeocoding() : true; // With new modals

            if (!this.options.geocoder.isGeocoding() && !tableIsReadOnly && canAddGeocoding) {
              var dlg = new cdb.editor.GeoreferenceView({
                table:  this.model,
                user:   this.user,
                tabs:   ['lonlat', 'city', 'admin', 'postal', 'ip', 'address'],
                option: 'lonlat',
                data:   { longitude: column }
              });

            } else if (this.options.geocoder.isGeocoding() || ( !canAddGeocoding && !tableIsReadOnly )) {
              dlg = cdb.editor.ViewFactory.createDialogByTemplate('common/background_polling/views/geocodings/geocoding_in_progress');
            } else {
              // If table can't geocode == is synched, return!
              return;
            }

            dlg.appendToBody();
          }, this)
          .bind('applyFilter', function(column) {
            self.options.menu.show('filters_mod');
            self.options.layer.trigger('applyFilter',column);
          }, this)

          this.addView(v);

          if (this.newColumnName == column[0]) {
            setTimeout(function() {
              v.renameColumn();
              self.newColumnName = null;
            }, 300);
          }

          return v.render().el;
        } else {
          return '<div><div></div></div>';
        }
      },


      /**
      * Checks if the table has any rows, and if not, launch the method for showing the appropiate view elements
      * @method _checkEmptyTable
      */
      _checkEmptyTable: function() {
        if(this.isEmptyTable()) {
          this.addEmptyTableInfo();
        } else {
          this.cleanEmptyTableInfo();
        }
      },


      /**
      * Force the table to be at the beginning
      * @method _forceScroll
      */
      _forceScroll: function(ev){
        $(window).scrollLeft(0);
      },

      _renderEmpty: function() {
        this.addEmptyTableInfo();
      },

      /**
      * Adds the view elements associated with no content in the table
      * @method addemptyTableInfo
      */
      addEmptyTableInfo: function() {
        if(this.$('.noRows').length == 0 && !this.model.isInSQLView() && this.model.get('schema')) {
          this.elder('addEmptyTableInfo');

          this.$el.hide();

          // Fake empty row if the table is not readonly
          if (!this.model.isReadOnly()) {
            //TODO: use row view instead of custom HTML
            var columnsNumber = this.model.get('schema').length;
            var columns = '<tr class="placeholder noRows"><td class="addNewRow">+</td>';
            for(var i = 0; i < columnsNumber; i++) {
              columns += '<td></td>';
            }
            columns += '</tr>';
            var columnsFooter = '<tr class="placeholder noRows decoration"><td></td>';
            for(var i = 0; i < columnsNumber; i++) {
              columnsFooter += '<td></td>';
            }
            columnsFooter += '</tr>';

            var $columns = $(columns+columnsFooter)
            this.$el.append($columns);
          }

          this.template_base = cdb.templates.getTemplate( this.model.isReadOnly() ? 'table/views/empty_readtable_info' : 'table/views/empty_table');
          var content = this.template_base();
          var $footer = $('<tfoot><tr><td colspan="100">' + content + '</td></tr></tfoot>');
          this.$el.append($footer);

          this.$el.fadeIn();
        }
      },

      /**
      * Adds the view elements associated with no content in the table when a SQL is applied
      * @method addEmptySQLIfo
      */
      addEmptySQLIfo: function() {
        if(this.model.isInSQLView()) {
          this._renderBodyTemplate('table/views/empty_sql');
        }
      },

      _renderBodyTemplate: function(tmpl) {
        this.$('tbody').html('');
        this.$('tfoot').remove();
        this.$el.hide();

        // Check if panel is opened to move the loader some bit left
        var panel_opened = false;
        if ($('.table_panel').length > 0) {
          panel_opened = $('.table_panel').css("right").replace("px","") == 0 ? true : false;
        }

        var content = cdb.templates.getTemplate(tmpl)({ panel_opened: panel_opened })
        , $footer = $('<tfoot class="sql_loader"><tr><td colspan="100">' + content + '</td></tr></tfoot>');

        this.$el.append($footer);
        this.$el.fadeIn();
      },

      /**
      * Removes from the view the no-content elements
      * @method cleanEmptyTableInfo
      */
      cleanEmptyTableInfo: function() {
        this.$('tfoot').fadeOut('fast', function() {
          $(this).remove();
        })
        this.$('.noRows').slideUp('fast', function() {
          $(this).remove();
        })
      },

      notice: function(text, type, time) {
        this.globalError.showError(text, type, time);
      },

      /**
      * Add a new row and removes the empty table view elemetns
      * @method addEmptyRow
      * @todo: (xabel) refactor this to include a "addRow" method in _models[0]
      */
      addEmptyRow: function() {
        this.dataModel.addRow({ at: 0});
        this.cleanEmptyTableInfo();
      },

      /**
      * Captures the saving event from the row and produces a notification
      * @todo (xabel) i'm pretty sure there has to be a less convulted way of doing this, without capturing a event
      * to throw another event in the model to be captured by some view
      */
      rowSaving: function() {
        this.notice('Saving your edit', 'load', -1);
      },

      /**
      * Captures the change event from the row and produces a notification
      * @method rowSynched
      * @todo (xabel) i'm pretty sure there has to be a less convulted way of doing this, without capturing a event
      * to throw another event in the model to be captured by some view
      */
      rowSynched: function() {
        this.notice('Sucessfully saved');
      },

      /**
      * Captures the change event from the row and produces a notification
      * @method rowSynched
      * @todo (xabel) i'm pretty sure there has to be a less convulted way of doing this, without capturing a event
      * to throw another event in the model to be captured by some view
      */
      rowFailed: function() {
        this.notice('Oops, there has been an error saving your changes.', 'error');
      },

      /**
      * Captures the destroy event from the row and produces a notification
      * @method rowDestroyed
      */

      rowDestroying: function() {
        this.notice('Deleting row', 'load', -1)
      },

      /**
      * Captures the sync after a destroy event from the row and produces a notification
      * @method rowDestroyed
      */

      rowDestroyed: function() {
        this.notice('Sucessfully deleted')
        this._checkEmptyTable();
      }
    });



    /**
    * table tab controller
    */
    cdb.admin.TableTab = cdb.core.View.extend({

      className: 'table',

      initialize: function() {
        this.user = this.options.user;
        this.sqlView = this.options.sqlView;
        this.geocoder = this.options.geocoder;
        this.backgroundPollingModel = this.options.backgroundPollingModel;
        this._initBinds();
      },

      setActiveLayer: function(layerView) {
        var recreate = !!this.tableView;
        this.deactivated();
        this.model = layerView.table;
        this.layer = layerView.model;
        this.sqlView = layerView.sqlView;
        if(recreate) {
          this.activated();
        }
      },

      _initBinds: function() {
        // Geocoder binding
        this.geocoder.bind('geocodingComplete geocodingError geocodingCanceled', function() {
          if (this.model.data) {
            this.model.data().refresh()
          }
        }, this);
        this.add_related_model(this.geocoder);
      },

      _createTable: function() {
        this.tableView = new cdb.admin.TableView({
          dataModel: this.model.data(),
          model: this.model,
          sqlView: this.sqlView,
          layer: this.layer,
          geocoder: this.options.geocoder,
          backgroundPollingModel: this.backgroundPollingModel,
          vis: this.options.vis,
          menu: this.options.menu,
          user: this.user,
          globalError: this.options.globalError
        });
      },

      activated: function() {
        if(!this.tableView) {
          this._createTable();
          this.tableView.render();
          this.render();
        }
      },

      deactivated: function() {
        if(this.tableView) {
          this.tableView.clean();
          this.tableView = null;
          this.hasRenderedTableView = false;
        }
      },

      render: function() {
        // Since render should be idempotent (i.e. should not append the tableView twice when called multiple times)
        if(this.tableView && !this.hasRenderedTableView) {
          this.hasRenderedTableView = true;
          this.$el.append(this.tableView.el);
        }
        return this;
      }


    });

})();

/**
 * map tab shown in cartodb admin
 */

/**
 * inside the UI all the cartodb layers should be shown merged.
 * the problem is that the editor needs the layers separated to work
 * with them so this class transform from multiple cartodb layers
 * and create only a view to represent all merged in a single layer group
 */
function GrouperLayerMapView(mapViewClass) {

  return {

    initialize: function() {
      this.groupLayer = null;
      this.activeLayerModel = null;
      mapViewClass.prototype.initialize.call(this);
    },

    _removeLayers: function() {
      var self = this;
      _.each(this.map.layers.getLayersByType('CartoDB'), function(layer) {
        layer.unbind(null, null, self);
      });
      cdb.geo.MapView.prototype._removeLayers.call(this);

      if(this.groupLayer) {
        this.groupLayer.model.unbind();
      }
      this.groupLayer = null;
    },

    _removeLayer: function(layer) {
      // if the layer is in layergroup
      if(layer.cid in this.layers) {
        if(this.layers[layer.cid] === this.groupLayer) {
          this._updateLayerDefinition(layer);
          layer.unbind(null, null, this);
          delete this.layers[layer.cid];
          this.trigger('removeLayerView', this);
        } else {
          this.trigger('removeLayerView', this);
          cdb.geo.MapView.prototype._removeLayer.call(this, layer);
        }
      } else {
        cdb.log.info("removing non existing layer");
      }
    },

    setActiveLayer: function(layer) {
      this.activeLayerModel = layer;
      this._setInteraction();
    },

    disableInteraction: function() {
      if (this.groupLayer) {
        this.groupLayer._clearInteraction();
      }
    },

    enableInteraction: function() {
      this._setInteraction();
    },

    // set interaction only for the active layer
    _setInteraction: function() {
      if(!this.groupLayer) return;
      if(this.activeLayerModel) {
        this.groupLayer._clearInteraction();
        var idx = this.map.layers.getLayerDefIndex(this.activeLayerModel);
        // when layer is not found idx == -1 so the interaction is
        // disabled for all the layers
        for(var i = 0; i < this.groupLayer.getLayerCount(); ++i) {
          this.groupLayer.setInteraction(i, i == idx);
        }
      }
    },

    _updateLayerDefinition: function(layer) {
      if(!layer) throw "layer must be a valid layer (not null)";
      if(this.groupLayer) {
        if(this.map.layers.getLayersByType('CartoDB').length === 0) {
          this.groupLayer.remove();
          this.groupLayer = null;
        } else {
          var def = this.map.layers.getLayerDef();
          this.groupLayer.setLayerDefinition(def);
          this._setInteraction();
        }
      }
    },

    /**
     * when merged layers raises an error this function send the error to the
     * layer that actually caused it
     */
    _routeErrors: function(errors) {
      var styleRegExp = /style(\d+)/;
      var postgresExp = /layer(\d+):/i;
      var generalPostgresExp = /PSQL error/i;
      var syntaxErrorExp = /syntax error/i;
      var webMercatorErrorExp = /"the_geom_webmercator" does not exist/i;
      var tilerError = /Error:/i;
      var layers = this.map.layers.where({ visible: true, type: 'CartoDB' });
      for(var i in errors) {
        var err = errors[i];
        // filter empty errors
        if(err && err.length) {
          var match = styleRegExp.exec(err);
          if(match) {
            var layerIndex = parseInt(match[1], 10);
            layers[layerIndex].trigger('parseError', [err]);
          } else {
            var match = postgresExp.exec(err);
            if(match) {
              var layerIndex = parseInt(match[1], 10);
              if (webMercatorErrorExp.exec(err)) {
                err = _t("you should select the_geom_webmercator column");
                layers[layerIndex].trigger('sqlNoMercator', [err]);
              } else {
                layers[layerIndex].trigger('sqlParseError', [err]);
              }
            } else if(generalPostgresExp.exec(err) || syntaxErrorExp.exec(err) || tilerError.exec(err)) {
              var error = 'sqlError';
              if (webMercatorErrorExp.exec(err)) {
                error = 'sqlNoMercator';
                err = _t("you should select the_geom_webmercator column");
              }
              _.each(layers, function(lyr) { lyr.trigger(error, err); });
            } else {
              _.each(layers, function(lyr) { lyr.trigger('error', err); });
            }
          }
        }
      }
    },

    _routeSignal: function(signal) {
      var self = this;
      return function() {
        var layers = self.map.layers.where({ visible: true, type: 'CartoDB' });
        var args = [signal].concat(arguments);
        _.each(layers, function(lyr) { lyr.trigger.apply(lyr, args); });
      }
    },

    _addLayer: function(layer, layers, opts) {

      // create group layer to acumulate cartodb layers
      if (layer.get('type') === 'CartoDB') {
        var self = this;
        if(!this.groupLayer) {
          // create model
          var m = new cdb.geo.CartoDBGroupLayer(
            _.extend(layer.toLayerGroup(), {
              user_name: this.options.user.get("username"),
              maps_api_template: cdb.config.get('maps_api_template'),
              no_cdn: false,
              force_cors: true // use CORS to control error management in a better way
            })
          );

          var layer_view = mapViewClass.prototype._addLayer.call(this, m, layers, _.extend({}, opts, { silent: true }));
          delete this.layers[m.cid];
          this.layers[layer.cid] = layer_view;
          this.groupLayer = layer_view;
          m.bind('error', this._routeErrors, this);
          m.bind('tileOk', this._routeSignal('tileOk'), this);
          this.trigger('newLayerView', layer_view, layer, this);
        } else {
          this.layers[layer.cid] = this.groupLayer;
          this._updateLayerDefinition(layer);
          this.trigger('newLayerView', this.groupLayer, layer, this);
        }

        layer.bind('change:tile_style change:query change:query_wrapper change:interactivity change:visible', this._updateLayerDefinition, this);
        this._addLayerToMap(this.groupLayer);
        delete this.layers[this.groupLayer.model.cid];
      } else {
        mapViewClass.prototype._addLayer.call(this, layer, layers, opts);
      }
    }
  }
};

cdb.admin.LeafletMapView = cdb.geo.LeafletMapView.extend(GrouperLayerMapView(cdb.geo.LeafletMapView));

if (typeof(google) !== 'undefined') {
  cdb.admin.GoogleMapsMapView = cdb.geo.GoogleMapsMapView.extend(GrouperLayerMapView(cdb.geo.GoogleMapsMapView));
}

cdb.admin.MapTab = cdb.core.View.extend({

  events: {
    'click .toggle_slides.button': '_toggleSlides',
    'click .add_overlay.button':   'killEvent',
    'click .canvas_setup.button':  'killEvent',
    'click .export_image.button':  '_exportImage',
    'click .sqlview .clearview':   '_clearView',
    'click .sqlview .export_query':'_tableFromQuery',
    'keydown':'_onKeyDown'
  },

  _TEXTS: {
    no_interaction_warn: _t("Map interaction is disabled, select cartodb_id to enable it")
  },

  className: 'map',
  animation_time: 300,

  initialize: function() {

    this.template = this.getTemplate('table/views/maptab');

    this.map  = this.model;
    this.user = this.options.user;
    this.vis  = this.options.vis;
    this.master_vis  = this.options.master_vis;

    this.canvas  = new cdb.core.Model({ mode: "desktop" });

    this.map_enabled     = false;
    this.georeferenced   = false;
    this.featureHovered  = null;
    this.activeLayerView = null;
    this.layerDataView   = null;
    this.layerModel      = null;
    this.legends         = [];
    this.overlays        = null;

    this.add_related_model(this.map);
    this.add_related_model(this.canvas);
    this.add_related_model(this.map.layers);

    this._addBindings();

  },

  _addBindings: function() {

    // Actions triggered in the right panel
    cdb.god.bind("panel_action", function(action) {
      this._moveInfo(action);
    }, this);

    this.add_related_model(cdb.god);

    this.map.bind('change:provider',       this.switchMapType, this);
    this.map.bind('change:legends',        this._toggleLegends, this);
    this.map.layers.bind('change:visible', this._addLegends, this);
    this.map.layers.bind('change:visible', this._addTimeline, this);
    this.map.layers.bind('change:tile_style', this._addTimeline, this);
    this.map.layers.bind('remove reset',   this._addLegends, this);
    this.map.layers.bind('remove reset',   this._addTimeline, this);

    _.bindAll(this, 'showNoGeoRefWarning', "_exportImage");

  },

  isMapEnabled: function() {
    return this.map_enabled;
  },

  deactivated: function() {
    if(this.map_enabled) {
      this.clearMap();
    }
  },

  clearMap: function() {

    clearTimeout(this.autoSaveBoundsTimer);

    this.mapView.clean();

    if (this.exportImageView) {
      this.exportImageView.clean();
      this.exportImageView = null;
    }

    if (this.overlaysDropdown)        this.overlaysDropdown.clean();
    if (this.mapOptionsDropdown)      this.mapOptionsDropdown.clean();
    if (this.basemapDropdown)         this.basemapDropdown.clean();
    if (this.configureCanvasDropdown) this.configureCanvasDropdown.clean();

    if (this.zoom) {
      this.zoom.clean();
    }

    if (this.infowindow) {
      this.infowindow.clean();
    }

    if (this.overlays) {
      this.overlays._cleanOverlays();
    }

    this._cleanLegends();

    if (this.stackedLegend) {
      this.stackedLegend.clean();
    }

    if (this.timeline) {
      this.timeline.clean();
      this.timeline = null;
    }

    if (this.geometryEditor) this.geometryEditor.clean();

    if (this.table) {
      this.table.unbind(null, null, this);
    }

    delete this.mapView;
    delete this.overlaysDropdown;
    delete this.basemapDropdown;
    delete this.mapOptionsDropdown;
    delete this.configureCanvasDropdown;

    delete this.zoom;
    delete this.infowindow;
    delete this.layer_selector;
    delete this.header;
    delete this.share;
    delete this.legends;
    delete this.overlays;
    delete this.legend;
    delete this.stackedLegend;
    delete this.geometryEditor;

    this.map_enabled = false;

    // place the map DOM object again
    this.render();
  },


  /**
   *  Hide the infowindow when a query is applied or cleared
   */
  _hideInfowindow: function() {
    if(this.infowindow) {
      this.infowindow.model.set('visibility', false);
    }
  },


  /**
   * this function is used when the map library is changed. Each map library
   * works in different way and need to recreate all the components again
   */
  switchMapType: function() {

    if (this.map_enabled) {
      this.clearMap();
      this.enableMap();
    }

  },

  _showGMapsDeprecationDialog: function() {
    var dialog = cdb.editor.ViewFactory.createDialogByTemplate('common/dialogs/confirm_gmaps_basemap_to_leaflet_conversion');

    var self = this;
    dialog.ok = function() {
      self.map.set('provider', 'leaflet', { silent: true });
      self.setupMap();
      this.close && this.close();
    };

    dialog.cancel = function() {
      if (self.user.isInsideOrg()) {
        window.location = "/u/" + self.user.get("username") + "/dashboard";
      } else {
        window.location = "/dashboard";
      }
    };

    dialog.appendToBody();
  },

  /**
   * map can't be loaded from the beggining, it needs the DOM to be loaded
   * so we wait until is actually shown to create the mapview and show it
   */
  enableMap: function() {

    this.render();

    var baseLayer = this.map.getBaseLayer();

    // check if this user has google maps enabled. In case not and the provider is google maps
    // show a message
    if ( typeof cdb.admin.GoogleMapsMapView === 'undefined') {
      if (baseLayer && this.map.isProviderGmaps()) {
        this._showGMapsDeprecationDialog();
        return;
      }
    }

    this.setupMap();

  },

  setupMap: function() {

    this.$('.tipsy').remove();

    var self = this;

    if (!this.map_enabled) {

      this._addMapView();

      this.clickTimeout = null;

      this._bindMissingClickEvents();

      this.map_enabled = true;

      $(".map")
      .append('<div class="map-options" />')
      .append("<div class='mobile_bkg' />");

      this._addBasemapDropdown();
      this._addInfowindow();
      this._addTooltip();
      this._addLegends();
      this._addOverlays();

      this._showPecan();

      this._showScratchDialog();

      if (this.user.featureEnabled('slides')) {
        this._addSlides();
      };

      var torqueLayer;

      var type = this.vis.get("type");

      if (type !== "table") {

        this._addOverlaysDropdown();
        this._addConfigureCanvasDropdown();
        this._addMapOptionsDropdown();

        this.canvas.on("change:mode", this._onChangeCanvasMode, this);

      }

      this.master_vis.on("change:type", function() {
        if (this.master_vis.previous('type') === 'table') {
          // reaload the map to show overlays and other visualization related stuff
          this.switchMapType();
        }
      }, this);

      // HACK
      // wait a little bit to give time to the mapview
      // to estabilize
      this.autoSaveBoundsTimer = setTimeout(function() {
        //self.mapView.setAutoSaveBounds();
        self.mapView.on('dragend zoomend', function() {
          self.mapView._saveLocation();
        });
      }, 1000);

    }

  },

  _addMapView: function() {

    var div = this.$('.cartodb-map');

    var mapViewClass = cdb.admin.LeafletMapView;
    if (this.map.get('provider') === 'googlemaps') {
      var mapViewClass = cdb.admin.GoogleMapsMapView;
    }

    this.mapView = new mapViewClass({
      el: div,
      map: this.map,
      user: this.user
    });

    this.mapView.bind('removeLayerView', function(layerView) {
      if (this.layer_selector) this.layer_selector.render();
    }, this);

    this.mapView.bind('newLayerView', function(layerView, model) {
      if(this.activeLayerView && this.activeLayerView.model.id === model.id) {
        this._bindDataLayer(this.activeLayerView, model);

        if (this.layer_selector) {
          this.layer_selector.render();
        }
      }
      this._addTimeline();
    }, this);

    if (this.activeLayerView) {
      this._bindDataLayer(this.activeLayerView, this.activeLayerView.model);
    }

  },

  _addConfigureCanvasDropdown: function() {
    if (!this.configureCanvasDropdown) {
      this.configureCanvasDropdown = new cdb.admin.ConfigureCanvasDropdown({
        target: $('.canvas_setup'),
        position: "position",
        canvas: this.canvas,
        template_base: "table/views/canvas_setup_dropdown",
        tick: "left",
        horizontal_position: "left",
        horizontal_offset: "40px"
      });

      this.addView(this.configureCanvasDropdown);

      this.configureCanvasDropdown.bind("onDropdownShown", function(){
        this.exportImageView && this.exportImageView.hide();
      }, this);

      cdb.god.bind("closeDialogs", this.configureCanvasDropdown.hide, this.configureCanvasDropdown);
      $(".canvas_setup").append(this.configureCanvasDropdown.render().el);
    }
  },

  _addOverlaysDropdown: function() {

    if (!this.overlaysDropdown) {

      this.overlaysDropdown = new cdb.admin.OverlaysDropdown({
        vis: this.master_vis,
        canvas: this.canvas,
        mapView: this.mapView,
        target: $('.add_overlay'),
        position: "position",
        collection: this.vis.overlays,
        template_base: "table/views/widget_dropdown",
        tick: "left",
        horizontal_position: "left",
        horizontal_offset: "40px"
      });

      this.addView(this.overlaysDropdown);

      this.overlaysDropdown.bind("onOverlayDropdownOpen", function(){
        this.slidesPanel && this.slidesPanel.hide();
        this.exportImageView && this.exportImageView.hide();
      }, this);


      cdb.god.bind("closeDialogs", this.overlaysDropdown.hide, this.overlaysDropdown);
      cdb.god.bind("closeOverlayDropdown", this.overlaysDropdown.hide, this.overlaysDropdown);

      $(".add_overlay").append(this.overlaysDropdown.render().el);
    }

  },

  _addBasemapDropdown: function() {

    if (!this.basemapDropdown) {

      if (this.vis.get("type") !== "table") {
        // TODO: use templates and _t for texts
        var $options = $('<a href="#" class="option-button dropdown basemap_dropdown"><div class="thumb"></div>Change basemap</a>');

        $(".map-options").append($options);

      }

      this.basemapDropdown = new cdb.admin.DropdownBasemap({
        target: $('.basemap_dropdown'),
        position: "position",
        template_base: "table/views/basemap/basemap_dropdown",
        model: this.map,
        mapview: this.mapView,
        user: this.user,
        baseLayers: this.options.baseLayers,
        tick: "left",
        vertical_offset: 40,
        horizontal_position: "left",
        vertical_position: this.vis.get("type") === 'table' ? "down" : "up",
        horizontal_offset: this.vis.get("type") === 'table' ? 42 : 0
      });

      this.addView(this.basemapDropdown);

      this.basemapDropdown.bind("onDropdownShown", function() {
        cdb.god.trigger("closeDialogs");
      });

      cdb.god.bind("closeDialogs", this.basemapDropdown.hide, this.basemapDropdown);

      $(".basemap_dropdown").append(this.basemapDropdown.render().el);

    }

    // Set active base layer if it already exists
    if (this.map.getBaseLayer()) {
      this.basemapDropdown.setActiveBaselayer();
    }

  },

  bindGeoRefCheck: function() {
    if(!this.table.data().fetched) {
      this.table.bind('dataLoaded', function() {
        this.checkGeoRef();
        if (!this.scratchDialog) {
          this._showScratchDialog();
        }
        if (!this.pecanView) {
          this._showPecan();
        }
      }, this);
    } else {
      this.checkGeoRef();
    }
  },

  activated: function() {
    this.checkGeoRef();
    $(window).scrollTop(0);
  },

  checkGeoRef: function() {
    if (this.options && this.table) {
      this.georeferenced = this.table.isGeoreferenced();
      if (this.noGeoRefDialog) {
        this.noGeoRefDialog.hide();
      }
      if (!this.georeferenced) {
        if (this.table.data().length > 0) {
          this[ this.table.isSync() ? '_showNoGeoWarning' : 'showNoGeoRefWarning' ]();
        }
      }
    }
  },

  // Shows a warning dialog when your current dialog doesn't have any
  // geometry on it and it is synchronized
  _showNoGeoWarning: function() {
    var noGeoWarningDialog = 'noGeoWarningDialog_' + this.table.id + '_' + this.table.get('map_id');
    if (this.noGeoWarningDialog || localStorage[noGeoWarningDialog]) {
      return;
    }

    this.noGeoWarningDialog = cdb.editor.ViewFactory.createDialogByTemplate(
      'table/views/no_geo_warning_template', {
        clean_on_hide: true
      }
    );

    this.noGeoWarningDialog.bind("hide", function() {
      localStorage[noGeoWarningDialog] = true;
    });

    this.noGeoWarningDialog.appendToBody();
  },

  _showPecan: function() {

    var hasPecan     = this.user.featureEnabled('pecan_cookies');

    var hasData = this.options.table && this.options.table.data() && this.options.table.data().length > 0 ? true : false;

    if (hasPecan && hasData) {

      var skipPencanDialog = 'pecan_' + this.options.user.get("username") + "_" + this.options.table.id;

      if (!localStorage[skipPencanDialog]) {

        this.pecanView = new cdb.editor.PecanView({
          table: this.options.table,
          backgroundPollingModel: this.options.backgroundPollingModel
        });
      }
    }
  },

  _showScratchDialog: function() {
    if (this.options.table && this.options.table.data().fetched && this.options.table.data().length === 0) {

      var skipScratchDialog = 'scratchDialog_' + this.options.table.id + '_' + this.options.table.get('map_id');

      if (!localStorage[skipScratchDialog]) {

        this.scratchDialog = new cdb.editor.ScratchView({
          table: this.options.table
        });

        this.scratchDialog.appendToBody();

        this.scratchDialog.bind("newGeometry", function(type) {
          this._addGeometry(type);
        }, this);

        this.scratchDialog.bind("skip", function() {
          localStorage[skipScratchDialog] = true;
        });
      }
    }
  },

  /**
   * this function binds click and dblclick events
   * in order to not raise click when user does a dblclick
   *
   * it raises a missingClick when the user clicks on the map
   * but not over a feature or ui component
   */
  _bindMissingClickEvents: function() {
    var self = this;
    this.mapView.bind('click', function(e) {
      if(self.clickTimeout === null) {
        self.clickTimeout = setTimeout(function() {
          self.clickTimeout = null;
          if(!self.featureHovered) {
            self.trigger('missingClick');
          }
        }, 150);
      }
      //google maps does not send an event
      if(!self.featureHovered && e.preventDefault) {
        e.preventDefault();
        e.stopPropagation();
      }
    });

    this.mapView.bind('dblclick', function() {
      if(self.clickTimeout !== null) {
        clearTimeout(self.clickTimeout);
        self.clickTimeout = null;
      }
    });
  },

  setActiveLayer: function(layerView) {
    this.activeLayerView = layerView;
    // check if the map is rendered and the layer is in the map
    if(this.mapView && this.mapView.getLayerByCid(layerView.model.cid)) {
      var layerModel = layerView.model;
      this._bindDataLayer(layerView, layerModel);
    }
  },

  /**
   * when the layer view is created this method is called
   * to attach all the click events
   */
  _bindDataLayer: function(layerView, layer) {
    var self = this;
    var layerType = layer.get('type');

    if (layerType === 'CartoDB' || layerType === 'torque') { // unbind previos stuff

      // Set data layer bindings
      if (self.layerDataView) {
        self.layerDataView.unbind(null, null, this);
      }

      if (self.layerModel) {
        self.layerModel.unbind(null, null, this);
      }

      if (self.options.geocoder) {
        self.options.geocoder.unbind(null, null, this);
      }

      self.infowindowModel  = layer.infowindow;
      self.tooltipModel     = layer.tooltip;
      self.legendModel      = layer.legend;

      self._bindTable(layer.table);
      self._bindSQLView(layer.sqlView);
      self.layerDataView = self.mapView.getLayerByCid(layer.cid);

      self.mapView.setActiveLayer(layer);
      self._addLegends();
      self._addTimeline();

      if (self.layerDataView) {
        self.layerDataView.bind('featureClick', self.featureClick, self);
        self.layerDataView.bind('featureOut',   self.featureOut,   self);
        self.layerDataView.bind('featureOver',  self.featureOver,  self);
        self.layerDataView.bind('loading',      self.loadingTiles, self);
        self.layerDataView.bind('load',         self.loadTiles,    self);
        self.layerDataView.bind('error',        self.loadTiles,    self);
        self.tooltip
          .setLayer(self.layerDataView)
          .enable();

      }

      // Set layer model binding
      if (layerView && layer) {
        layer.unbind('startEdition',this._addGeometry, this);
        layer.bind('startEdition', this._addGeometry, this);
      }

      if(layer) {
        self.layerModel = layer;
        //TODO: unbind this at some point
        layer.bind('change:interactivity', this._updateSQLHeader, this);
        this._updateSQLHeader();
      }

      if (self.options.geocoder) {
        self.options.geocoder.bind('geocodingComplete geocodingError geocodingCanceled', this.updateDataLayerView, this);
        self.add_related_model(self.options.geocoder);
      }

    }
  },

  _cleanLegends: function() {

    if (this.legends) {
      _.each(this.legends, function(legend) {
        legend.clean();
      });

    }

    this.legends = [];

  },


  _getCartoDBLayers: function() {

    return this.map.layers.models.filter(function(layerModel) {
      return layerModel.get("type") === 'CartoDB'
    });

  },

  _onKeyDown: function(e) {
    if (this.overlays && e.which == 86 && (e.ctrlKey || e.metaKey)) {
      this.overlays.paste();
    }
  },

  _onChangeCanvasMode: function() {

    var self = this;

    cdb.god.trigger("closeDialogs");

    var mode = this.canvas.get("mode");

    if (mode === "desktop") {

      this._showDesktopCanvas(mode);

      if (this.overlays.loader && this.overlays.fullscreen) {
        setTimeout(function() {
          self.overlays && self.overlays._positionOverlaysVertically(true);
        }, 500);
      }

    } else if (mode === "mobile") {

      this._showMobileCanvas(mode);

      setTimeout(function() {
        self.overlays && self.overlays._positionOverlaysVertically(true);
      }, 300);

    }

  },

  _showMobileCanvas: function(mode) {

    var self = this;

    var width  = 288;
    var height = 476;

    this.overlays._hideOverlays("desktop");

    var $map = $("div.map div.cartodb-map");

    this.$el.addClass(mode);

    // Animations step - 1
    var onBackgroundShown = function() {

      $map.animate(
        { width: width, marginLeft: -Math.round(width/2) - 1, left: "50%" },
        { easing: "easeOutQuad", duration: 200, complete: onCanvasLandscapeStretched }
      );

    };

    // Animations step - 2
    var onCanvasPortraitStretched = function() {

      self.$el.find(".mobile_bkg").animate(
        { opacity: 1 },
        { duration: 250 }
      );

      self.overlays._showOverlays(mode);

      // Let's set center view for mobile mode
      var center = self.map.get('center');
      self.mapView.invalidateSize();
      $map.fadeOut(250);

      setTimeout(function() {
        self.mapView.map.setCenter(center);
        $map.fadeIn(250);
      },300);

    };

    // Animations step - 3
    var onCanvasLandscapeStretched = function() {

      $map.animate(
        { height: height, marginTop: -Math.round(height/2) + 23,  top:  "50%" },
        { easing: "easeOutQuad", duration: 200, complete: onCanvasPortraitStretched }
      );

    };

    onBackgroundShown();

    this._enableAnimatedMap();
    this._enableMobileLayout();

  },

  _enableMobileLayout: function() {

    if (!this.mobile) {

      var torqueLayer;

      this.mobile = new cdb.admin.overlays.Mobile({
        mapView: this.mapView,
        overlays: this.overlays,
        map: this.map
      });

      this.mapView.$el.append(this.mobile.render().$el);

    } else {
      this.mobile.show();
    }

  },

  _disableMobileLayout: function() {

    if (this.mobile) this.mobile.hide();

  },

  _showDesktopCanvas: function(mode) {

    var self = this;

    this.overlays._hideOverlays("mobile");

    this.$el.removeClass("mobile");

    this.$el.find(".mobile_bkg").animate({ opacity: 0}, 250);

    var
    $map       = $("div.map div.cartodb-map"),
    top        = $map.css("top"),
    left       = $map.css("left"),
    mTop       = $map.css("marginTop"),
    mLeft      = $map.css("marginLeft"),
    curWidth   = $map.width(),
    curHeight  = $map.height(),
    autoWidth  = $map.css({width:  'auto', marginLeft: 0, left: "15px"}).width();  //temporarily change to auto and get the width.
    autoHeight = $map.css({height: 'auto', marginTop: 0,  top: "82px" }).height(); //temporarily change to auto and get the width.

    $map.height(curHeight);
    $map.width(curWidth);

    $map.css({ top: top, left: left, marginLeft: mLeft, marginTop: mTop, height: curHeight, width: curWidth });

    var onSecondAnimationFinished = function() {

      $map.css('width', 'auto');
      self.overlays._showOverlays(mode);

      // Let's set center view for desktop mode
      var center = self.map.get('center');
      self.mapView.invalidateSize();

      setTimeout(function() {
        self.mapView.map.setCenter(center);
      },300);

    };

    var onFirstAnimationFinished = function() {

      $map.css('height', 'auto');
      $map.animate(
        { width: autoWidth, left: "15px", marginLeft: "0"},
        { easing: "easeOutQuad", duration: 200, complete: onSecondAnimationFinished }
      );

    };

    var stretchMapLandscape = function() {
      $map.animate(
        { height: autoHeight, top: "82", marginTop: "0"},
        { easing: "easeOutQuad", duration: 200, complete: onFirstAnimationFinished }
      );
    };

    stretchMapLandscape();

    this._disableAnimatedMap();
    this._disableMobileLayout();

  },

  _enableAnimatedMap: function() {

    var self = this;

    setTimeout(function() {
      self.$el.addClass("animated");
    }, 800)

  },

  _disableAnimatedMap: function() {
    this.$el.removeClass("animated");
  },

  _addMapOptionsDropdown: function() {

    if (!this.mapOptionsDropdown) {

      var $options = $("<a href='#show-options' class='option-button show-table-options'>Options</a>");

      this.$options = $options;

      $(".map-options").append($options);

      this.mapOptionsDropdown = new cdb.admin.MapOptionsDropdown({
        target:              $('.show-table-options'),
        template_base:       "table/views/map_options_dropdown",
        table:               table,
        model:               this.map,
        mapview:             this.mapView,
        collection:          this.vis.overlays,
        user:                this.user,
        vis:                 this.vis,
        canvas:              this.canvas,
        position:            "position",
        tick:                "left",
        vertical_position:   "up",
        horizontal_position: "left",
        horizontal_offset:   "-3px"
      });

      this._bindMapOptions();

      this.addView(this.mapOptionsDropdown);

      $(".show-table-options").append(this.mapOptionsDropdown.render().el);

    }

  },

  _bindMapOptions: function() {

    this.mapOptionsDropdown.bind("onDropdownShown", function() {
      cdb.god.trigger("closeDialogs");
      this.$options.addClass("open");
    }, this);

    this.mapOptionsDropdown.bind("onDropdownHidden", function() {
      this.$options.removeClass("open");
    }, this);

    this.mapOptionsDropdown.bind("createOverlay", function(overlay_type, property) {
      this.vis.overlays.createOverlayByType(overlay_type, property);
    }, this);

    cdb.god.bind("closeDialogs", this.mapOptionsDropdown.hide, this.mapOptionsDropdown);

  },

  _addOverlays: function() {
    this.overlays = new cdb.admin.MapOverlays({
      headerMessageIsVisible: this._shouldAddSQLViewHeader(),
      vis: this.vis,
      canvas: this.canvas,
      mapView: this.mapView,
      master_vis: this.master_vis,
      mapToolbar: this.$el.find(".map_toolbar")
    });

  },

  _exportImage: function(e) {

    this.killEvent(e);

    if (this.exportImageView) {
      return;
    }

    this.exportImageView = new cdb.admin.ExportImageView({
      vizjson:  this.vis.vizjsonURL(),
      vis:      this.vis,
      user:     this.options.user,
      overlays: this.overlays,
      mapView:  this.mapView,
      width:    this.mapView.$el.width(),
      height:   this.mapView.$el.height(),
      map:      this.map
    });

    this.exportImageView.bind("was_removed", function() {
      this.exportImageView = null;
    }, this);

    this.mapView.$el.append(this.exportImageView.render().$el);

    cdb.god.bind("panel_action", function(action) {
      if (action !== "hide" && this.exportImageView) {
        this.exportImageView.hide();
      }
    }, this);
  },

  _addSlides: function() {

    if (!this.vis.isVisualization()) return;

    this.slidesPanel = new cdb.admin.SlidesPanel({
      user: this.user,
      slides:  this.vis.slides,
      toggle: this.$el.find(".toggle_slides")
    });

    this.slidesPanel.bind("onChangeVisible", function() {
      this.exportImageView && this.exportImageView.hide();
    }, this);

    this.$el.append(this.slidesPanel.render().el);

    this.addView(this.slidesPanel);

  },

  _addLegends: function() {

    var self = this;

    this._cleanLegends();
    
    if (!this.map.get("legends")) {
      return;
    }

    var models = this.map.layers.models;

    for (var i = models.length - 1; i >= 0; --i) {
      var layer = models[i];
      self._addLegend(layer);
    }

  },

  _addLegend: function(layer) {

    var type = layer.get('type');

    if (type === 'CartoDB' || type === 'torque') {

      if (this.table && this.mapView) {

        if (this.legend) this.legend.clean();

        if (layer.get("visible")) {

          var legend = new cdb.geo.ui.Legend({
            model:   layer.legend,
            mapView: this.mapView,
            table:   this.table
          });

          if (this.legends) {
            this.legends.push(legend);
            this._renderStackedLengeds();
          }

        }
      }
    }

  },
  
  _toggleLegends: function() {
    if (this.map.get("legends")) {
      this._addLegends();
    } else {
      this._cleanLegends();
    }
  },

  _addTimeline: function() {
    if (!this.mapView) return;
    // check if there is some torque layer
    if(!this.map.layers.any(function(lyr) { return lyr.get('type') === 'torque' && lyr.get('visible'); })) {
      this.timeline && this.timeline.clean();
      this.timeline = null;
    } else {
      var layer = this.map.layers.getLayersByType('torque')[0];
      var steps = layer.wizard_properties.get('torque-frame-count');

      if (this.timeline) {
        // check if the model is different
        if (this.timeline.torqueLayer.model.cid !== layer.cid) {
          this.timeline.clean();
          this.timeline = null;
        }
      }

      layerView = this.mapView.getLayerByCid(layer.cid);

      if (layerView && typeof layerView.getStep !== "undefined" && steps > 1) {
        if (!this.timeline) {
          this.timeline = new cdb.geo.ui.TimeSlider({
            layer: layerView,
            width: "auto"
          });

          this.mapView.$el.append(this.timeline.render().$el);
          this.addView(this.timeline);
        } else {
          this.timeline.setLayer(layerView);
        }
      }
      else if (this.timeline) {
        this.timeline.clean();
        this.timeline = null;
      }
    }
  },

  _renderStackedLengeds: function() {

    if (this.stackedLegend) this.stackedLegend.clean();
    if (this.legend)        this.legend.clean();

    this.stackedLegend = new cdb.geo.ui.StackedLegend({
      legends: this.legends
    });

    this.mapView.$el.append(this.stackedLegend.render().$el);
    this.addView(this.stackedLegend);

  },

  _renderLegend: function() {

    if (this.legend) this.legend.clean();

    this.legend = this.legends[0];

    this.mapView.$el.append(this.legend.render().$el);

    if (!this.legend.model.get("type")) this.legend.hide();
    else this.legend.show();

    this.addView(this.legend);

  },

  _addTooltip: function() {
    if(this.tooltip) this.tooltip.clean();
    if(this.table && this.mapView) {
      this.tooltip = new cdb.admin.Tooltip({
        model: this.tooltipModel,
        table: this.table,
        mapView: this.mapView,
        omit_columns: ['cartodb_id'] // don't show cartodb_id while hover
      });
      this.mapView.$el.append(this.tooltip.render().el);
      this.tooltip.bind('editData', this._editData, this);
      this.tooltip.bind('removeGeom', this._removeGeom, this);
      this.tooltip.bind('editGeom', this._editGeom, this);
      if (this.layerDataView) {
        this.tooltip
          .setLayer(this.layerDataView)
          .enable();
      }
    }
  },

  _addInfowindow: function() {
    if(this.infowindow) this.infowindow.clean();
    if(this.table && this.mapView) {
      this.infowindow = new cdb.admin.MapInfowindow({
        model: this.infowindowModel,
        mapView: this.mapView,
        table: this.table
      });
      this.mapView.$el.append(this.infowindow.el);

      // Editing geometry
      if(this.geometryEditor) {
        this.geometryEditor.discard();
        this.geometryEditor.clean();
      }

      this.geometryEditor = new cdb.admin.GeometryEditor({
        user: this.user,
        model: this.table
      });

      this.geometryEditor.mapView = this.mapView;
      this.mapView.$el.append(this.geometryEditor.render().el);
      this.geometryEditor.hide();

      this.geometryEditor.bind('editStart', this.hideDataLayer, this);
      this.geometryEditor.bind('editDiscard', this.showDataLayer, this);
      this.geometryEditor.bind('editFinish', this.showDataLayer, this);
      this.geometryEditor.bind('editFinish', this.updateDataLayerView, this);
      this.geometryEditor.bind('geomCreated', function(row) {
        this.table.data().add(row);
      }, this);

      var self = this;

      this.infowindow.bind('editData', this._editData, this);
      this.infowindow.bind('removeGeom', this._removeGeom, this);
      this.infowindow.bind('editGeom', this._editGeom, this);

      this.infowindow.bind('openInfowindowPanel', function() {
        this.activeLayerView.showModule('infowindow', 'fields');
      }, this);

      this.infowindow.bind('close', function() {
        if (this.tooltip) {
          this.tooltip.setFilter(null);
        }
      }, this);

      this.table.bind('remove:row', this.updateDataLayerView, this);

      this.table.bind('change:dataSource', function() {
        if (this.geometryEditor) this.geometryEditor.discard();
      }, this);

      this.map.bind('change:provider', function() {
        if (this.geometryEditor) this.geometryEditor.discard();
      }, this);
    }
  },

  _editGeom: function(row) {
    // when provider is leaflet move the world to [-180, 180]
    // because vector features are only rendered on that slice
    if (this.map.get('provider') === 'leaflet') {
      this.map.clamp();
    }
    this.geometryEditor.editGeom(row);
  },

  /**
   * Shows edit data modal window
   */
  _editData: function(row) {
    if (!this.table.isReadOnly()) {
      var self = this;
      row.fetch({ cache: false, no_geom: true, success: function() {
        var dlg = new cdb.editor.FeatureDataView({
          row: row,
          provider: self.map.get('provider'),
          baseLayer: self.map.getBaseLayer().clone(),
          dataLayer: self.layerModel.clone(),
          currentZoom: self.map.getZoom(),
          enter_to_confirm: false,
          table: self.table,
          user: self.user,
          clean_on_hide: true,
          onDone: self.updateDataLayerView.bind(self) // Refreshing layer when changes have been done
        });

        dlg.appendToBody();
      }});

      return false;
    }
  },

  /**
   * triggers an removeGeom event when the geometry
   * is removed from the server
   */
  _removeGeom: function(row) {
    if (!this.table.isReadOnly()) {
      var view = new cdb.editor.DeleteRowView({
        name: 'feature',
        table: this.table,
        row: row,
        clean_on_hide: true,
        enter_to_confirm: true,
        wait: true // to not remove from parent collection until server-side confirmed deletion
      });
      view.appendToBody();

      return false;
    }
  },

  _addGeometry: function(type) {
    this.geometryEditor.createGeom(this.table.data().newRow(), type);
  },

  _bindTable: function(table) {
    if (this.table) {
      this.table.unbind(null, null, this);
    }

    this.table = table;

    this.table.bind('change:dataSource', this._hideInfowindow, this);
    this.table.bind('change:dataSource', this._updateSQLHeader, this);
    this.table.bind('change:schema',     this._updateSQLHeader, this);

    this.table.bind('data:saved', this.updateDataLayerView, this);

    this._addInfowindow();

    this._addLegends();
    this._addTooltip();

    this.bindGeoRefCheck();
  },

  _bindSQLView: function(sqlView) {
    if(this.sqlView) {
      this.sqlView.unbind(null, null, this);
    }
    this.sqlView = sqlView;
    this.sqlView.bind('reset error', this._updateSQLHeader, this);
    this.sqlView.bind('loading', this._renderLoading, this);
    this._updateSQLHeader();
  },

  _renderLoading: function(opts) {
    this._removeSQLViewHeader();

    //TODO: remove this hack
    if ($('.table_panel').length > 0) {
      panel_opened = $('.table_panel').css("right").replace("px","") == 0
    }

    var html = this.getTemplate('table/views/sql_view_notice_loading')({
      panel_opened: panel_opened
    });

    if (this.overlays) {
      this.overlays.setHeaderMessageIsVisible(true);
    }

    this.$('.cartodb-map').after(html);
  },

  _updateSQLHeader: function() {
    if (this._shouldAddSQLViewHeader()) {
      this._addSQLViewHeader();
    } else {
      this._removeSQLViewHeader();
    }
  },

  _shouldAddSQLViewHeader: function() {
    return this.table && this.table.isInSQLView();
  },

  loadingTiles: function() {
    if (this.overlays.loader) this.overlays.loader.show();
  },

  loadTiles: function() {
    if (this.overlays.loader) this.overlays.loader.hide();
  },

  featureOver: function(e, latlon, pxPos, data) {
    if(this.infowindowModel.get('disabled')) return;
    this.mapView.setCursor('pointer');
    this.featureHovered = data;
  },

  featureOut: function() {
    if(this.infowindowModel.get('disabled')) return;
    this.mapView.setCursor('auto');
    this.featureHovered = null;
  },

  featureClick: function(e, latlon, pxPos, data) {
    if(this.infowindowModel.get('disabled')) return;
    if(!this.geometryEditor.isEditing()) {
      if(data.cartodb_id) {
        this.infowindow
          .setLatLng(latlon)
          .setFeatureInfo(data.cartodb_id)
          .showInfowindow();

        this.tooltip.setFilter(function(feature) {
          return feature.cartodb_id !== data.cartodb_id;
        }).hide();
      } else {
        cdb.log.error("can't show infowindow, no cartodb_id on data");
      }
    }
  },

  /**
   *  Move all necessary blocks when panel is openned (normal, narrowed,...) or closed
   */
  _moveInfo: function(type) {
    if (type === "show") {
      this.$el
        .removeClass('narrow')
        .addClass('displaced');
    } else if (type === "hide") {
      this.$el.removeClass('narrow displaced');
    } else if (type === "narrow") {
      this.$el.addClass('narrow displaced');
    }
  },

  render: function() {

    this.$el.html('');

    this.$el
    .removeClass("mobile")
    .removeClass("derived")
    .removeClass("table");

    this.$el.addClass(this.vis.isVisualization() ? 'derived': 'table');
    var provider = this.map.get("provider");

    this.$el.append(this.template({
      slides_enabled: this.user.featureEnabled('slides'),
      type: this.vis.get('type'),
      exportEnabled: !this.map.isProviderGmaps()
    }));

    return this;

  },

  showDataLayer: function() {
    this.mapView.enableInteraction();
    this.layerDataView.setOpacity && this.layerDataView.setOpacity(1.0);
  },

  hideDataLayer: function() {
    this.mapView.disableInteraction();
    this.layerDataView.setOpacity && this.layerDataView.setOpacity(0.5);
  },

  /**
   * reload tiles
   */
  updateDataLayerView: function() {
    if(this.layerDataView) {
      this.layerDataView.invalidate();
    }
  },
  /**
   * Paints a dialog with a warning when the user hasn't any georeferenced row
   * @method showNoGeorefWarning
   */
  showNoGeoRefWarning: function() {
    var warningStorageName = 'georefNoContentWarningShowed_' + this.table.id + '_' + this.table.get('map_id');

    // if the dialog already has been shown, we don't show it again
    if(!this.noGeoRefDialog && !this.table.isInSQLView() && (!localStorage[warningStorageName])) {
      localStorage[warningStorageName] = true;

      this.noGeoRefDialog = new cdb.editor.GeoreferenceView({
        table: this.table,
        user: this.user
      });
      this.noGeoRefDialog.appendToBody();
    }

  },

  //adds the green indicator when a query is applied
  _addSQLViewHeader: function() {
    this.$('.sqlview').remove();
    var total = this.table.data().size();
    var warnMsg = null;
    // if the layer does not suppor interactivity do not show the message
    if (this.layerModel && !this.layerModel.get('interactivity') && this.layerModel.wizard_properties.supportsInteractivity()) {
      warnMsg = this._TEXTS.no_interaction_warn;
    }
    if (this.layerModel && !this.layerModel.table.containsColumn('the_geom_webmercator')) {
      warnMsg = _t('the_geom_webmercator column should be selected');
    }
    var html = this.getTemplate('table/views/sql_view_notice')({
      empty: !total,
        isVisualization: this.vis.isVisualization(),
        warnMsg: warnMsg
    });

    this.$('.cartodb-map').after(html);

    if (this.overlays) {
      this.overlays.setHeaderMessageIsVisible(true);
    }
  },

  _removeSQLViewHeader: function() {
    this.$('.sqlview').remove();

    if (this.overlays) {
      this.overlays.setHeaderMessageIsVisible(false);
    }
  },

  _toggleSlides: function(e) {
    this.killEvent(e);
    this.slidesPanel && this.slidesPanel.toggle();
  },

  _clearView: function(e) {
    this.killEvent(e);
    this.activeLayerView.model.clearSQLView();
    return false;
  },

  _tableFromQuery: function(e) {
    this.killEvent(e);

    var duplicate_dialog = new cdb.editor.DuplicateDatasetView({
      model: this.table,
      user: this.user,
      clean_on_hide: true
    });
    duplicate_dialog.appendToBody();
  }

});


/**
 * dropdown when user clicks on a column name
 */
cdb.admin.HeaderDropdown = cdb.admin.DropdownMenu.extend({

  className: "dropdown border",
  isPublic: false,

  events: {
    'click .asc':                   'orderColumnsAsc',
    'click .desc':                  'orderColumnsDesc',
    'click .rename_column':         'renameColumn',
    'click .change_data_type':      'changeType',
    'click .georeference':          'georeference',
    'click .clearview':             'clearView',
    'click .filter_by_this_column': 'filterColumn',
    'click .delete_column':         'deleteColumn',
    'click .add_new_column':        'addColumn'
  },

  initialize: function() {
    this.options.reserved_column = false;
    this.options.read_only = false;
    this.options.in_sql_view = false;
    this.options.isPublic = this.isPublic;
    this.elder('initialize');
  },

  render: function() {
    cdb.admin.DropdownMenu.prototype.render.call(this);
    // Add the class public if it is reserved column or query applied
    this.$el[this.options.isPublic !== true || this.options.read_only ? 'addClass' : 'removeClass']('public');

    return this;
  },

  setTable: function(table, column) {
    this.table = table;
    this.column = column;

    // depending on column type (reserved, normal) some fields should not be shown
    // so render the dropdown again
    this.options.reserved_column = this.table.isReadOnly() || this.table.isReservedColumn(column);
    this.options.read_only = this.table.isReadOnly();
    this.options.in_sql_view = this.table.isInSQLView();
    this.render();

    this.$('.asc').removeClass('selected');
    this.$('.desc').removeClass('selected');
    //set options for ordering
    if(table.data().options.get('order_by') === column) {
      if(table.data().options.get('sort_order') === 'asc') {
        this.$('.asc').addClass('selected');
      } else {
        this.$('.desc').addClass('selected');
      }
    }
  },

  orderColumnsAsc: function(e) {
    e.preventDefault();
    this.table.data().setOptions({
      sort_order: 'asc',
      order_by: this.column
    });
    this.hide();
    return false;
  },

  orderColumnsDesc: function(e) {
    e.preventDefault();
    this.table.data().setOptions({
      sort_order: 'desc',
      order_by: this.column
    });
    this.hide();
    return false;
  },

  renameColumn: function(e) {
    e.preventDefault();
    this.hide();
    this.trigger('renameColumn');
    return false;
  },

  clearView: function(e) {
    if (e) e.preventDefault();
    this.hide();
    this.trigger('clearView');
    return false;
  },

  changeType: function(e) {
    e.preventDefault();
    this.hide();
    this.trigger('changeType', this.column);
    return false;
  },

  georeference: function(e) {
    e.preventDefault();
    this.trigger('georeference', this.column);
    this.hide();
    return false;
  },

  filterColumn: function(e) {
    this.killEvent(e);
    this._addFilter(this.column);
  },

  _addFilter: function(column_name) {
    this.trigger('applyFilter', column_name);
    this.hide();
  },

  deleteColumn: function(e) {
    e.preventDefault();
    this.hide();

    var view = new cdb.editor.DeleteColumnView({
      clean_on_hide: true,
      enter_to_confirm: true,
      table: this.table,
      column: this.column,
      clean_on_hide: true
    });
    view.appendToBody();

    return false;
  },

  addColumn: function(e) {
    e.preventDefault();
    this.trigger("addColumn", this);
    this.hide();
    return false;
  }
});


/**
 *  Model for authenticated user endpoint
 *
 */

cdb.open.AuthenticatedUser = cdb.core.Model.extend({

  defaults: {
    username: '',
    avatar_url: ''
  },

  url: function() {
    var host = this.get('host') ? this.get('host') : this._getCurrentHost();
    return "//" + host + "/api/v1/get_authenticated_users";
  },

  _getCurrentHost: function() {
    return window.location.host;
  }
});


/**
 *  Account dropdown within public header
 *
 */


cdb.open.AccountDropdown = cdb.admin.DropdownMenu.extend({

  _TEMPLATE: ' \
    <ul>\
      <li><a class="small" href="<%- urls[0] %>">View your datasets</a></li>\
      <li><a class="small" href="<%- urls[0] %>/visualizations">View your maps</a></li>\
      <li><a class="small" href="<%- urls[0].replace("dashboard", "logout") %>">Close session</a></li>\
    </ul>\
  ',

  render: function() {
    this.$el
      .html(_.template(this._TEMPLATE)(this.model.attributes))
      .css({
        width: this.options.width
      })
    
    return this;
  }

});
/**
 *  Public header, dance starts!
 *
 */
cdb.open.Header = cdb.core.View.extend({

  initialize: function() {
    this.vis = this.options.vis;
    this.template = cdb.templates.getTemplate('public/views/public_header');
    this._initBinds();
  },

  render: function() {
    this.clearSubViews();
    this.$el.html(
      this.template(
        _.defaults({
          vis_url: this.vis && this.vis.viewUrl(this.model) || '',
          isMobileDevice: this.options.isMobileDevice,
          owner_username: this.options.owner_username,
          current_view: this.options.current_view
        }, this.model.attributes)
      )
    );
    this._initViews();
    return this;
  },

  _initBinds: function() {
    this.model.bind('change', this.render, this);
  },

  _initViews: function() {
    if (this.$('.account').length > 0) {
      var dropdown = new cdb.open.AccountDropdown({
        target: this.$('a.account'),
        model: this.model,
        vertical_offset: 20,
        width: 166
      });

      this.addView(dropdown);
      cdb.god.bind("closeDialogs", dropdown.hide, dropdown);
      this.add_related_model(cdb.god);
      $('body').append(dropdown.render().el);
    }
  }

});

cdb.open.LikeView = cdb.core.View.extend({

  events: {
    "click": "_onClick"
  },

  _onClick: function(e) {

    e.preventDefault();
    e.stopPropagation();

    this.model.toggleLiked();

    var self = this;

    this.model.bind("error", function(response) {

      if (response.status === 400) { // if the item was already liked, we "fake" the like
        self.model.set({ id: self.model.get("vis_id"), liked: true });
      } else if (response.status === 403) {
        window.top.location.href = "https://carto.com/sessions/new";
      }
    });

  },

  initialize: function() {

    this.model.bind("change:likes, change:liked", function() {

      this._updateCounter();

      if (this.model.get("liked")) {

        this._highlightHeart();

      } else {

        this._unhighlightHeart();
      }

    }, this);

    if (this.options.auto_fetch) this.model.fetch();

  },

  _updateCounter: function() {

    var $counter = $(".js-like .counter");
    var count = this.model.get("likes");

    if (count > 2 || this.model.get("show_count")) {
      $counter.text(count);
    } else {
      $counter.text("");
    }

  },

  _unhighlightHeart: function() {

    var $button  = $(".js-like");
    var $icon    = $(".js-like .icon");

    $icon.addClass("is-pulsating is-animated");
    $icon.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
      $(this).removeClass("is-pulsating is-animated");
      $button.removeClass("is-highlighted");
    });

  },

  _highlightHeart: function() {

    var $button  = $(".js-like");
    var $icon    = $(".js-like .icon");

    $button.addClass("is-highlighted");
    $icon.addClass("is-pulsating is-animated");
    $icon.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
      $(this).removeClass("is-pulsating is-animated");
    });
  }

});

cdb.open.Like = cdb.admin.Like.extend({
});


  /**
   *  Public visualization model
   *
   */

  cdb.open.PublicVisualization = cdb.core.Model.extend({

    urlRoot: '/api/v1/viz',

    initialize: function() {

      this.like = new cdb.open.Like({ 
        id: this.get("liked") ? this.id : null,
        vis_id: this.id
      });

    },

    viewUrl: function() {
      return cdb.config.prefixUrl() + "/viz/" + this.id + "/";
    },

    copy: function(attrs, options) {
      attrs = attrs || {};
      options = options || {};
      var vis = new cdb.open.PublicVisualization(
        _.extend({
            source_visualization_id: this.id
          },
          attrs
        )
      );
      vis.save(null, options);
      return vis;
    }

  });

(function() {

  /**
   * contains information about the table, not the data itself
   */
  cdb.open.PublicCartoDBTableMetadata = cdb.admin.CartoDBTableMetadata.extend({

    fetch: function() {
      this.trigger('sync');
      //nothing to fetch here
    },


    data: function() {
      var self = this;
      if(this._data === undefined) {
        this._data = new cdb.admin.CartoDBTableData(null, {
          table: this
        });
        this._data.fetch = function() {  };
      }

      if(this.sqlView) {
        return this.sqlView;
      }
      return this._data;
    },

  });



})();


/**
 *  Public header for table view
 *
 *  - It needs a table model, config and user data.
 *
 *    var header = new cdb.admin.Header({
 *      el:       this.$('header'),
 *      model:    table_model,
 *      user:     user_model,
 *      config:   config
 *    });
 *
 */
cdb.open.PublicHeader = cdb.admin.Header.extend({

  _SQL: 'SELECT * FROM ',

  events: {
    'click .navigation li a':   '_onTabClick'
  },

  initialize: function() {
    this.$body = $('body');
    this.setInfo();
  },

  setInfo: function() {
    this.$('h2').text(this.model.get('name'));
    this.$('.description p').text(this.model.get("description"));
  },

  _shareVisualization: function() { /* not in public */ },
  _changeToVisualization: function(e) { /* not in public */ },
  _changePrivacy: function(ev) { /* not in public */ },
  _changeDescription: function(e) { /* not in public */ },
  _changeTitle: function(e) { /* not in public */ },
  _changeTags: function(e) { /* not in public */ },
  _onSetAttribute: function(e) { /* not in public */ },
  isVisEditable: function(e) { /* not in public */ },

  _onTabClick: function(e) {
    e.preventDefault();

    // Let's create the url ourselves //
    var url = '';

    // Get table id
    if (this.options.belong_organization) {
      url += "/" + this.model.getUnquotedName() + '/public';
    } else {
      url += "/" + this.model.getUnqualifiedName() + '/public';
    }

    // Get scenario parameter (table or map)
    if ($(e.target).closest('a').attr('href').search('/map') != -1) {
      url += '/map'
    } else {
      url += '/table'
    }

    if (window.history && window.history.pushState) window.table_router.navigate(url, {trigger: true});

  }
});


/**
 * header cell view, manages operations on table columns
 */

(function() {

HeaderView = cdb.open.PublicHeaderView = cdb.admin.HeaderView.extend({

  events: {
  },

  initialize: function() {
    var self = this;
    this.column = this.options.column;
    this.table = this.options.table;
    this.template = this.getTemplate('public_table/views/public_table_header_view');
    this.editing_name = false;
    this.changing_type = false;
  },

  render: function() {
    this.$el.html('');
    this.$el.append(this.template({
      col_name: this.column[0],
      col_type: this.column[1],
      editing_name: this.editing_name,
    }));

    // Focus in the input if it is being edited
    if (this.editing_name) {
      this.$el.find("input").focus();
    }

    this.delegateEvents();

    return this;
  },

  _openColOptions: function(e) {
    var self = this;
    var colOptions = HeaderView.colOptions;

    // Unbind events
    colOptions.off();
    cdb.god.unbind('closeDialogs', HeaderView.colOptions.hide, HeaderView.colOptions);

    // Close other dialogs
    cdb.god.trigger("closeDialogs");

    // set data for column and table currently editing
    colOptions.setTable(this.table, this.column[0]);

    colOptions.bind('renameColumn', this._renameColumn, this);
    colOptions.bind('changeType', this._changeType, this);
    colOptions.bind('georeference', function(column) {
        self.trigger('georeference', column);
    }, this);

    // bind the stuff
    var container = $(e.target).parent().parent();
    container.append(colOptions.el);
    
    var link_width  = $(e.target).width() + 26
      , th          = container.parent();

    // align to the right of the target with a little of margin
    colOptions.openAt(link_width - colOptions.$el.width(), (th.height()/2) + 7);

    // Bind again!
    cdb.god.bind("closeDialogs", HeaderView.colOptions.hide, HeaderView.colOptions);

  },

  _openColTypeOptions: function(e) {},

  _checkEditColnameInput: function(e) {},

  _submitEdit: function() {},

  _finishEdit: function() {},

  _renameColumn: function() {},

  _changeType: function() {},

  showColumnOptions: function(e) {
    var self = this;
    e.preventDefault();
    var colOptions = HeaderView.colOptions;
    colOptions.hide(function() {
      self._openColOptions(e);
    });
    return false;
  },

  showColumnTypeOptions: function(e) {}

});

})();

/**
 * this infowindow is shown in the map when user clicks on a feature
 */

(function() {

  cdb.open.PublicMapInfowindow = cdb.admin.MapInfowindow.extend({

    events: cdb.geo.ui.Infowindow.prototype.events,

    initialize: function() {
      var self = this;
      this.table = this.options.table;
      this.model.set({ content: 'loading...' });
      // call parent
      cdb.geo.ui.Infowindow.prototype.initialize.call(this);
    },

    render: function() {
      this.$el.html($(this.template(_.clone(this.model.attributes))));
      this._update();
      return this;
    },

    /**
     * Not in public
     */
    _editGeom: function(e) {

    },

    /**
     * Not in public
     */
    _removeGeom: function(e) {
    }


  });


})();

/**
 * map tab shown in cartodb admin
 */

cdb.open.PublicMapTab = cdb.admin.MapTab.extend({

  className: 'map',

  events: {
    'click .js-bounds': '_changeBounds'
  },

  initialize: function() {
    this.template = this.getTemplate('public_table/views/maptab_public');
    this.map_enabled = false;

    this._initBinds();
  },

  _initBinds: function() {
    this.model.bind('change:bounds', this._setBoundsCheckbox, this);
    this.model.bind('change:map', this._setBounds, this);
  },

  _changeBounds: function() {
    this.model.set('bounds', !this.model.get('bounds'));
  },

  _setBounds: function() {
    if (this.vis) {
      var map = this.model.get('map');
      this.vis.mapView.map.setView(map.center, map.zoom);
    }
  },

  _setBoundsCheckbox: function() {
    this.trigger('boundsChanged', { bounds: this.model.get('bounds') });
    this.$('.js-bounds .Checkbox-input').toggleClass('is-checked', !!this.model.get('bounds'));
  },

  /**
   * map can't be loaded from the beggining, it needs the DOM to be loaded
   * so we wait until is actually shown to create the mapview and show it
   */
  enableMap: function() {
    if (!this.map_enabled && !this.vis) {
      this.vis = new cdb.vis.Vis({
        el: this.$('.cartodb-map')
      });
      this.vis.load(this.options.vizjson, {
        auth_token: this.options.auth_token,
        https: this.options.https,
        search: false,
        scrollwheel: false,
        shareable: false,
        fullscreen: true,
        no_cdn: cdb.config.get('debug')
      });
    }

    this._bindBounds();
  },

  /**
   * this function binds pan and zoom events
   * in order to change the results in the table view
   * with the new bbox
   */
  _bindBounds: function() {
    this.vis.mapView.bind('dragend zoomend', function() {
      this.trigger('mapBoundsChanged', {
        map: this.vis.map
      });
    }, this);
  },

  clearMap: function() {},

  render: function() {
    this.$el.html(this.template());
    return this;
  }
});

/**
 *  entry point for public table view
 */


$(function() {

  // Add easeinquad animation
  $.extend( $.easing, {
    easeInQuad: function (x, t, b, c, d) {
      return c*(t/=d)*t + b;
    }
  })

  cdb.init(function() {
    cdb.config.set(config);
    if (api_key) cdb.config.set("api_key", api_key);
    cdb.config.set('url_prefix', window.base_url);
    cdb.templates.namespace = 'cartodb/';

    // Check if device is a mobile
    var mobileDevice = /Android|webOS|iPad|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // Window view
    var public_window = new cdb.open.PublicTableWindow({
      el: window,
      table_id: table_id, 
      table_name: table_name,
      user_name: user_name,
      owner_username: owner_username,
      vizjson: vizjson_obj,
      auth_token: auth_token,
      https: use_https,
      api_key: api_key,
      schema: schema,
      config: config,
      isMobileDevice: mobileDevice,
      belong_organization: belong_organization
    });

  });

});

  /** 
   *  Public table window "view"
   *
   */

  cdb.open.PublicTableWindow = cdb.core.View.extend({

    initialize: function() {
      this.$body = $(this.el.document.body);
      this.$map = this.$body.find('#map');
      this._initBinds();
      this._initViews();
      setTimeout(this._onStart, 250);
    },

    _initViews: function() {
      // Table view
      var table_options = _.defaults({ el: this.el.document.body, model: new cdb.core.Model({ bounds: false, map: null }) }, this.options);
      var table = new cdb.open.TablePublic(table_options);

      // Public table router
      this.el.table_router = new cdb.open.TableRouter(table);

      var pushState = true;
      var root = '/tables/';

      // Push state?
      if (!this.el.history || !this.el.history.pushState) pushState = false;

      // Organization user?
      if (this.options.belong_organization) root = '/u/' + this.options.user_name + root;

      Backbone.history.start({
        pushState:  pushState,
        root:       root
      });
    },

    _initBinds: function() {
      _.bindAll(this, '_onWindowResize', '_onOrientationChange', '_onStart');

      this.$el.on('resize', this._onWindowResize);

      if (!this.el.addEventListener) {
        this.el.attachEvent('orientationchange', this._onOrientationChange, this);
      } else {
        this.el.addEventListener('orientationchange', this._onOrientationChange);
      }
    },

    // On start view!
    _onStart: function() {
      this._setupMapDimensions();

      var windowHeight = this.$el.height();
      var top = windowHeight - this.$body.find(".cartodb-info").outerHeight(true) - this.$body.find(".cartodb-public-header").outerHeight(true);

      if (this.options.isMobileDevice) {
        var h = 120;

        if (windowHeight < 670) {
          h = 80;
        }

        top = windowHeight - this.$body.find(".cartodb-public-header").outerHeight(true) - h;
      }

      this._showNavigationBar(top)
    },

    _onWindowResize: function() {
      // Resize window
      this._setupMapDimensions();
      // Close dialogs
      cdb.god.trigger("closeDialogs");
    },

    _onOrientationChange: function() {
      // Reset disqus
      DISQUS && DISQUS.reset({ reload: true });
      // Resize window orientation
      this._setupMapDimensions(true);
    },

    // When window is resized, let's touch some things ;)
    _setupMapDimensions: function(animated) {
      var windowHeight = this.$el.height();
      var mainInfoHeight = this.$body.find('.js-Navmenu').height();
      var headerHeight = this.$body.find('.Header').height();
      var landscapeMode = this.el.matchMedia && this.el.matchMedia("(orientation: landscape)").matches;
      var h, height, top;

      if (this.options.isMobileDevice) {

        if (landscapeMode) {
          h = headerHeight + 7;
        } else {
          if (windowHeight > 670) {
            h = 220;
          } else { // iPhone, etc.
            h = 138;
          }
        }
      } else {
        h = 260;
      }

      height = windowHeight - h;
      top    = windowHeight - (h - 80);

      if (animated) {
        this.$map.animate({ height: height }, { easing: "easeInQuad", duration: 150 });
        this.$body.find(".navigation").animate({ top: top - 130 }, { easing: "easeInQuad", duration: 150 });
      } else {
        if (this.options.isMobileDevice) {
          this.$map.css({ height: height, opacity: 1 }); 
          this.$body.find(".navigation").css({ top: top - 130 }, 250);
        } else {
          // On non mobile devices
          this.$map.css({ height: windowHeight - ( mainInfoHeight + headerHeight), opacity: 1 });
          this.$body.find(".navigation").css({ top: top - 21 }, 250);
        }
      }

      // If landscape, let's scroll to show the map, and
      // leave the header hidden
      if (this.options.isMobileDevice && landscapeMode && $(window).scrollTop() < headerHeight) {
        this.$body.animate({ scrollTop: headerHeight }, 600);
      }

      if (this.map_view) this.map_view.invalidateMap();
    },

    // Show navigation (table or map view) block
    _showNavigationBar: function(top) {
      var landscapeMode = this.el.matchMedia && this.el.matchMedia("(orientation: landscape)").matches;
      var windowHeight = this.$el.height();

      if (this.options.isMobileDevice) {
        var top_ = 108;

        if (landscapeMode) {
          top_ = 48;
        }

        this.$body.find(".navigation")
          .css({ top: windowHeight })
          .animate({ top: top - top_, opacity: 1 }, 250);
      } else {
        this.$body.find(".navigation")
          .css({ top: windowHeight })
          .animate({ top: top - 201, opacity: 1 }, 250);
      }

      if (this.map_view) this.map_view.invalidateMap();
    }

  });


/**
 * view used to render each row in public tables
 */
cdb.open.PublicRowView = cdb.admin.RowView.extend({
  
  classLabel: 'cdb.open.PublicRowView',
  
  events: {},

  initialize: function() {
    this.options.row_header = false;
    this.order = this.options.order;
  },

  _renderGeometry: function(value) {
    return this._renderDefault('GeoJSON')
  },

  _getRowOptions: function() {},

  click_header: function(e) {}
});



  /**
   *  Table public view
   *
   */

  cdb.open.TablePublic = cdb.core.View.extend({

    events: {
      'click .js-Navmenu-link--download': '_exportTable',
      'click .js-Navmenu-link--api': '_apiCallTable'
    },

    initialize: function() {
      this._initModels();
      this._initViews();
      this._initBinds();
    },

    _initModels: function() {
      var self = this;

      // Table
      this.table = new cdb.open.PublicCartoDBTableMetadata({
        id: this.options.table_name,
        name: this.options.table_name,
        description: this.options.vizjson.description || ''
      });

      this.table.set({
        user_name: this.options.user_name,
        vizjson: this.options.vizjson,
        schema: this.options.schema
      });

      this.columns = this.table.data();
      this.sqlView = new cdb.admin.SQLViewData();
      this.sqlView.syncMethod = 'read';

      var query = this.query = this.table.data().getSQL()
      this.table.useSQLView(this.sqlView);
      this.sqlView.options.set('rows_per_page', 20, { silent: true });
      this._fetchData(query);

      // User
      this.user = new cdb.admin.User({ username: this.options.user_name });

      // Authenticated user
      this.authenticated_user = new cdb.open.AuthenticatedUser();

    },

    _initViews: function() {
      var self = this;

      // Public header
      if (this.$('.cartodb-public-header').length > 0) {
        var header = new cdb.open.Header({
          el: this.$('.cartodb-public-header'),
          model: this.authenticated_user,
          vis: this.table,
          current_view: this._getCurrentView(),
          owner_username: this.options.owner_username,
          isMobileDevice: this.options.isMobileDevice
        });
        this.addView(header);

        // Fetch authenticated user model
        this.authenticated_user.fetch();
      }

      // Navigation
      this.header = new cdb.open.PublicHeader({
        el: this.$('.navigation'),
        model: this.table,
        user: this.user,
        belong_organization: belong_organization,
        config: this.options.config
      });
      this.addView(this.header);

      // Likes
      var like = new cdb.open.LikeView({
        el: this.$el.find(".extra_options .js-like"),
        auto_fetch: true,
        model: new cdb.open.Like({ vis_id: this.options.vizjson.id })
      });

      // Tabpanes
      this.workViewTable = new cdb.ui.common.TabPane({
        el: this.$('.pane_table')
      });
      this.addView(this.workViewTable);

      this.workViewMap = new cdb.ui.common.TabPane({
        el: this.$('.pane_map')
      });
      this.addView(this.workViewMap);

      this.workViewMobile = new cdb.ui.common.TabPane({
        el: this.$('.panes_mobile')
      });
      this.addView(this.workViewMobile);

      // Public app tabs
      this.tabs = new cdb.admin.Tabs({
        el: this.$('.navigation ul'),
        slash: true
      });

      this.addView(this.tabs);

      // Help tooltip
      var tooltip = new cdb.common.TipsyTooltip({
        el: this.$("span.help"),
        gravity: $.fn.tipsy.autoBounds(250, 's')
      })
      this.addView(tooltip);

      // Disable comments when browser is IE7
      if ($.browser.msie && parseInt($.browser.version) === 7 ) {
        this.$(".comments .content").html("<p>Your browser doesn't support comments.</p>")
      }

      // Table tab
      this.tableTab = new cdb.open.PublicTableTab({
        model: this.table,
        vizjson: this.options.vizjson,
        user_name: this.options.user_name
      });

      this.tableTabMobile = new cdb.open.PublicTableTab({
        model: this.table,
        vizjson: this.options.vizjson,
        user_name: this.options.user_name
      });

      // Map tab
      this.mapTab = new cdb.open.PublicMapTab({
        vizjson: this.options.vizjson,
        auth_token: this.options.auth_token,
        https: this.options.https,
        vizjson_url: this.options.vizjson_url,
        model: new cdb.core.Model({
          bounds: false
        })
      });
      this.mapTab.bind('mapBoundsChanged', function(options) {
        self.model.set('map', {
          bounds: [
            options.map.get('view_bounds_ne')[1],
            options.map.get('view_bounds_ne')[0],
            options.map.get('view_bounds_sw')[1],
            options.map.get('view_bounds_sw')[0]
          ],
          center: options.map.get('center'),
          zoom: options.map.get('zoom')
        });
      });
      this.mapTab.bind('boundsChanged', function(options) {
        self.model.set('bounds', options.bounds);
      });

      this.mapTabMobile = new cdb.open.PublicMapTab({
        vizjson: this.options.vizjson,
        auth_token: this.options.auth_token,
        https: this.options.https,
        vizjson_url: this.options.vizjson_url,
        model: new cdb.core.Model({
          bounds: false
        })
      });
      this.mapTabMobile.bind('mapBoundsChanged', function(options) {
        self.model.set('map', {
          bounds: [
            options.map.get('view_bounds_ne')[1],
            options.map.get('view_bounds_ne')[0],
            options.map.get('view_bounds_sw')[1],
            options.map.get('view_bounds_sw')[0]
          ],
          center: options.map.get('center'),
          zoom: options.map.get('zoom')
        });
      });
      this.mapTabMobile.bind('boundsChanged', function(options) {
        self.model.set('bounds', options.bounds);
      });

      this.workViewMobile.addTab('table', this.tableTabMobile.render());
      this.workViewMobile.addTab('map', this.mapTabMobile.render());
      this.workViewMobile.bind('tabEnabled:map', this.mapTabMobile.enableMap, this.mapTabMobile);

      this.workViewTable.addTab('table', this.tableTab.render());
      this.workViewMap.addTab('map', this.mapTab.render());

      this.workViewMobile.bind('tabEnabled', function(mode) {
        self.$el.removeClass("table");
        self.$el.removeClass("map");
        self.$el.addClass(mode);
        $(window).trigger('resize');
      }, this.mapTabMobile);

      this.workViewMobile.bind('tabEnabled', this.tabs.activate);
      this.workViewMobile.active('table');

      this.workViewTable.active('table');
      this.workViewMap.active('map');
      this.mapTab.enableMap();

      $(".pane_table").addClass("is-active");
    },

    _updateTable: function() {
      var sql = (this.model.get('bounds') && this.model.get('map')) ? (this.query + " WHERE the_geom && ST_MakeEnvelope("+this.model.get('map')['bounds'][0]+", "+this.model.get('map')['bounds'][1]+", "+this.model.get('map')['bounds'][2]+", "+this.model.get('map')['bounds'][3]+", 4326)") : this.query;
      this._fetchData(sql);
    },

    _fetchData: function(sql) {
      if (sql) {
        this.sqlView.setSQL(sql);
      }

      this.sqlView.fetch({
        success: function() {
          self.$('.js-spinner').remove();
        }
      });
    },

    _exportTable: function(e) {
      e.preventDefault();

      // If a sql is applied but it is not valid, don't let the user export it
      if (!this.sqlView.getSQL()) return false;

      var DialogView = cdb.editor.PublicExportView;
      var export_dialog = new DialogView({
        model: this.table,
        config: config,
        user_data: this.user.toJSON(),
        bounds: this.sqlView.getSQL() !== this.query
      });

      export_dialog
        .appendToBody()
        .open();
    },

    _apiCallTable: function(e) {
      e.preventDefault();

      // If a sql is applied but it is not valid, don't show the dialog
      if (!this.sqlView.getSQL()) return false;

      api_dialog = cdb.editor.ViewFactory.createDialogByTemplate('common/dialogs/api_call', {
        url: cdb.config.getSqlApiUrl(),
        sql: this.sqlView.getSQL(),
        schema: this.table.attributes.original_schema.slice(0, 5),
        rows: this.table.dataModel.models
      });

      api_dialog
        .appendToBody()
        .open();
    },

    _initBinds: function() {
      var _this = this;

      // Global click
      enableClickOut(this.$el);

      this.model.bind('change:bounds', function() {
        _this._setBoundsCheckbox();
        _this._updateTable();
      }, this);

      this.model.bind('change:map', function() {
        _this._setBounds();
        _this._updateTable();
      }, this);

      this.authenticated_user.bind('change', this._onUserLogged, this);

      this.add_related_model(this.authenticated_user);
    },

    _setBoundsCheckbox: function() {
      this.mapTab.model.set('bounds', this.model.get('bounds'));
      this.mapTabMobile.model.set('bounds', this.model.get('bounds'));
    },

    _setBounds: function() {
      this.mapTab.model.set('map', this.model.get('map'));
      this.mapTabMobile.model.set('map', this.model.get('map'));
    },

    // Get type of current view
    // - It could be, dashboard, table or visualization
    _getCurrentView: function() {
      var pathname = location.pathname;

      if (pathname.indexOf('/tables/') !== -1 ) {
        return 'table';
      }

      if (pathname.indexOf('/viz/') !== -1 ) {
        return 'visualization';
      }

      // Other case -> dashboard (datasets, visualizations,...)
      return 'dashboard';
    },

    keyUp: function(e) {},

    _onUserLogged: function() {
      // Check if edit button should be visible
      if (this.options.owner_username === this.authenticated_user.get('username')) {
        this.$('.extra_options .edit').css('display', 'inline-block');
        this.$('.extra_options .oneclick').css('display', 'none');
      }

    }

  });

  
  /**
   *  New public table router \o/
   *
   *  - No more /#/xxx routes
   */

  cdb.open.TableRouter = Backbone.Router.extend({

    routes: {
      ':id/public/:scenario': 'change'
    },

    initialize: function(table) {
      this.table = table;
    },

    change: function(_id,scenario) {
      // Check active view, if it is different, change
      if (scenario != 'table' && scenario != 'map') scenario = 'table';
      this.table.workViewMobile.active(scenario);
    }

  });

  /**
   * public table view
   */
  cdb.open.PublicTableView = cdb.admin.TableView.extend({
    
    events: {},

    rowView: cdb.open.PublicRowView,

    initialize: function() {
      var self = this;
      this.elder('initialize');
      this.options.row_header = true;
      this._editorsOpened = null;

      this.initializeBindings();
      this.initPaginationAndScroll();
    },

    initializeBindings: function() {
      var self = this;

      _.bindAll(this, "render", "rowSaving", "addEmptyRow",
        "_checkEmptyTable", "_forceScroll", "_scrollMagic",
        "rowChanged", "rowSynched", "_startPagination", "_finishPagination",
        "rowFailed", "rowDestroyed", "emptyTable");

      this.model.data().bind('newPage', this.newPage, this);

      //this.model.data().bind('loadingRows', this._startPagination);
      this.model.data().bind('endLoadingRows', this._finishPagination);

      this.bind('cellDblClick', this._editCell, this);

      //this.model.bind('change:dataSource', this._onSQLView, this);
      // when model changes the header is re rendered so the notice should be added
      //this.model.bind('change', this._onSQLView, this);
      this.model.bind('dataLoaded', function() {
        self._checkEmptyTable();
        self._forceScroll();
      }, this);
    },

    headerView: function(column) {
      var self = this;
      if(column[1] !== 'header') {
        var v = new cdb.open.PublicHeaderView({
          column: column,
          table: this.model,
          sqlView: this.options.sqlView,
        });

        this.addView(v);
        return v.render().el;
      } else {
        return '<div><div></div></div>';
      }
    },

    _onSQLView: function() {},

    _checkEmptyTable: function() {
      if(this.isEmptyTable()) {
        this.addEmptyTableInfo();
      } else {
        this.cleanEmptyTableInfo();
        this.$('footer').remove();
      }
    },

    _swicthEnabled: function() {
      // this check is not needed in public table
    },

    addEmptyTableInfo: function() {
      this.template_base = cdb.templates.getTemplate('public_table/views/empty_table_public');
      var content = this.template_base(this.import_);

      var $footer = $('<tfoot><tr><td colspan="100">' + content + '</td></tr></tfoot>');
      this.$('footer').remove();
      this.$el.append($footer);
    },

    _scrollMagic: function() { }

  });

  /**
   *  Public table tab controller
   */

  cdb.open.PublicTableTab = cdb.admin.TableTab.extend({

    className: 'table public',

    initialize: function() {
      this.user = this.options.user;
      this.sqlView = this.options.sqlView;
    },

    _createTable: function() {
      this.tableView = new cdb.open.PublicTableView({
        dataModel: this.model.data(),
        model: this.model,
        sqlView: this.sqlView
      });
    }
  });

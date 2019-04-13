//! moment.js
//! version : 2.10.2
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.moment = factory()
}(this, function () { 'use strict';

    var hookCallback;

    function utils_hooks__hooks () {
        return hookCallback.apply(null, arguments);
    }

    // This is done to register the method called with moment()
    // without creating circular dependencies.
    function setHookCallback (callback) {
        hookCallback = callback;
    }

    function defaultParsingFlags() {
        // We need to deep clone this object.
        return {
            empty           : false,
            unusedTokens    : [],
            unusedInput     : [],
            overflow        : -2,
            charsLeftOver   : 0,
            nullInput       : false,
            invalidMonth    : null,
            invalidFormat   : false,
            userInvalidated : false,
            iso             : false
        };
    }

    function isArray(input) {
        return Object.prototype.toString.call(input) === '[object Array]';
    }

    function isDate(input) {
        return Object.prototype.toString.call(input) === '[object Date]' || input instanceof Date;
    }

    function map(arr, fn) {
        var res = [], i;
        for (i = 0; i < arr.length; ++i) {
            res.push(fn(arr[i], i));
        }
        return res;
    }

    function hasOwnProp(a, b) {
        return Object.prototype.hasOwnProperty.call(a, b);
    }

    function extend(a, b) {
        for (var i in b) {
            if (hasOwnProp(b, i)) {
                a[i] = b[i];
            }
        }

        if (hasOwnProp(b, 'toString')) {
            a.toString = b.toString;
        }

        if (hasOwnProp(b, 'valueOf')) {
            a.valueOf = b.valueOf;
        }

        return a;
    }

    function create_utc__createUTC (input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, true).utc();
    }

    function valid__isValid(m) {
        if (m._isValid == null) {
            m._isValid = !isNaN(m._d.getTime()) &&
                m._pf.overflow < 0 &&
                !m._pf.empty &&
                !m._pf.invalidMonth &&
                !m._pf.nullInput &&
                !m._pf.invalidFormat &&
                !m._pf.userInvalidated;

            if (m._strict) {
                m._isValid = m._isValid &&
                    m._pf.charsLeftOver === 0 &&
                    m._pf.unusedTokens.length === 0 &&
                    m._pf.bigHour === undefined;
            }
        }
        return m._isValid;
    }

    function valid__createInvalid (flags) {
        var m = create_utc__createUTC(NaN);
        if (flags != null) {
            extend(m._pf, flags);
        }
        else {
            m._pf.userInvalidated = true;
        }

        return m;
    }

    var momentProperties = utils_hooks__hooks.momentProperties = [];

    function copyConfig(to, from) {
        var i, prop, val;

        if (typeof from._isAMomentObject !== 'undefined') {
            to._isAMomentObject = from._isAMomentObject;
        }
        if (typeof from._i !== 'undefined') {
            to._i = from._i;
        }
        if (typeof from._f !== 'undefined') {
            to._f = from._f;
        }
        if (typeof from._l !== 'undefined') {
            to._l = from._l;
        }
        if (typeof from._strict !== 'undefined') {
            to._strict = from._strict;
        }
        if (typeof from._tzm !== 'undefined') {
            to._tzm = from._tzm;
        }
        if (typeof from._isUTC !== 'undefined') {
            to._isUTC = from._isUTC;
        }
        if (typeof from._offset !== 'undefined') {
            to._offset = from._offset;
        }
        if (typeof from._pf !== 'undefined') {
            to._pf = from._pf;
        }
        if (typeof from._locale !== 'undefined') {
            to._locale = from._locale;
        }

        if (momentProperties.length > 0) {
            for (i in momentProperties) {
                prop = momentProperties[i];
                val = from[prop];
                if (typeof val !== 'undefined') {
                    to[prop] = val;
                }
            }
        }

        return to;
    }

    var updateInProgress = false;

    // Moment prototype object
    function Moment(config) {
        copyConfig(this, config);
        this._d = new Date(+config._d);
        // Prevent infinite loop in case updateOffset creates new moment
        // objects.
        if (updateInProgress === false) {
            updateInProgress = true;
            utils_hooks__hooks.updateOffset(this);
            updateInProgress = false;
        }
    }

    function isMoment (obj) {
        return obj instanceof Moment || (obj != null && hasOwnProp(obj, '_isAMomentObject'));
    }

    function toInt(argumentForCoercion) {
        var coercedNumber = +argumentForCoercion,
            value = 0;

        if (coercedNumber !== 0 && isFinite(coercedNumber)) {
            if (coercedNumber >= 0) {
                value = Math.floor(coercedNumber);
            } else {
                value = Math.ceil(coercedNumber);
            }
        }

        return value;
    }

    function compareArrays(array1, array2, dontConvert) {
        var len = Math.min(array1.length, array2.length),
            lengthDiff = Math.abs(array1.length - array2.length),
            diffs = 0,
            i;
        for (i = 0; i < len; i++) {
            if ((dontConvert && array1[i] !== array2[i]) ||
                (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {
                diffs++;
            }
        }
        return diffs + lengthDiff;
    }

    function Locale() {
    }

    var locales = {};
    var globalLocale;

    function normalizeLocale(key) {
        return key ? key.toLowerCase().replace('_', '-') : key;
    }

    // pick the locale from the array
    // try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
    // substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
    function chooseLocale(names) {
        var i = 0, j, next, locale, split;

        while (i < names.length) {
            split = normalizeLocale(names[i]).split('-');
            j = split.length;
            next = normalizeLocale(names[i + 1]);
            next = next ? next.split('-') : null;
            while (j > 0) {
                locale = loadLocale(split.slice(0, j).join('-'));
                if (locale) {
                    return locale;
                }
                if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
                    //the next array item is better than a shallower substring of this one
                    break;
                }
                j--;
            }
            i++;
        }
        return null;
    }

    function loadLocale(name) {
        var oldLocale = null;
        // TODO: Find a better way to register and load all the locales in Node
        if (!locales[name] && typeof module !== 'undefined' &&
                module && module.exports) {
            try {
                oldLocale = globalLocale._abbr;
                require('./locale/' + name);
                // because defineLocale currently also sets the global locale, we
                // want to undo that for lazy loaded locales
                locale_locales__getSetGlobalLocale(oldLocale);
            } catch (e) { }
        }
        return locales[name];
    }

    // This function will load locale and then set the global locale.  If
    // no arguments are passed in, it will simply return the current global
    // locale key.
    function locale_locales__getSetGlobalLocale (key, values) {
        var data;
        if (key) {
            if (typeof values === 'undefined') {
                data = locale_locales__getLocale(key);
            }
            else {
                data = defineLocale(key, values);
            }

            if (data) {
                // moment.duration._locale = moment._locale = data;
                globalLocale = data;
            }
        }

        return globalLocale._abbr;
    }

    function defineLocale (name, values) {
        if (values !== null) {
            values.abbr = name;
            if (!locales[name]) {
                locales[name] = new Locale();
            }
            locales[name].set(values);

            // backwards compat for now: also set the locale
            locale_locales__getSetGlobalLocale(name);

            return locales[name];
        } else {
            // useful for testing
            delete locales[name];
            return null;
        }
    }

    // returns locale data
    function locale_locales__getLocale (key) {
        var locale;

        if (key && key._locale && key._locale._abbr) {
            key = key._locale._abbr;
        }

        if (!key) {
            return globalLocale;
        }

        if (!isArray(key)) {
            //short-circuit everything else
            locale = loadLocale(key);
            if (locale) {
                return locale;
            }
            key = [key];
        }

        return chooseLocale(key);
    }

    var aliases = {};

    function addUnitAlias (unit, shorthand) {
        var lowerCase = unit.toLowerCase();
        aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
    }

    function normalizeUnits(units) {
        return typeof units === 'string' ? aliases[units] || aliases[units.toLowerCase()] : undefined;
    }

    function normalizeObjectUnits(inputObject) {
        var normalizedInput = {},
            normalizedProp,
            prop;

        for (prop in inputObject) {
            if (hasOwnProp(inputObject, prop)) {
                normalizedProp = normalizeUnits(prop);
                if (normalizedProp) {
                    normalizedInput[normalizedProp] = inputObject[prop];
                }
            }
        }

        return normalizedInput;
    }

    function makeGetSet (unit, keepTime) {
        return function (value) {
            if (value != null) {
                get_set__set(this, unit, value);
                utils_hooks__hooks.updateOffset(this, keepTime);
                return this;
            } else {
                return get_set__get(this, unit);
            }
        };
    }

    function get_set__get (mom, unit) {
        return mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]();
    }

    function get_set__set (mom, unit, value) {
        return mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
    }

    // MOMENTS

    function getSet (units, value) {
        var unit;
        if (typeof units === 'object') {
            for (unit in units) {
                this.set(unit, units[unit]);
            }
        } else {
            units = normalizeUnits(units);
            if (typeof this[units] === 'function') {
                return this[units](value);
            }
        }
        return this;
    }

    function zeroFill(number, targetLength, forceSign) {
        var output = '' + Math.abs(number),
            sign = number >= 0;

        while (output.length < targetLength) {
            output = '0' + output;
        }
        return (sign ? (forceSign ? '+' : '') : '-') + output;
    }

    var formattingTokens = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Q|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,4}|x|X|zz?|ZZ?|.)/g;

    var localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g;

    var formatFunctions = {};

    var formatTokenFunctions = {};

    // token:    'M'
    // padded:   ['MM', 2]
    // ordinal:  'Mo'
    // callback: function () { this.month() + 1 }
    function addFormatToken (token, padded, ordinal, callback) {
        var func = callback;
        if (typeof callback === 'string') {
            func = function () {
                return this[callback]();
            };
        }
        if (token) {
            formatTokenFunctions[token] = func;
        }
        if (padded) {
            formatTokenFunctions[padded[0]] = function () {
                return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
            };
        }
        if (ordinal) {
            formatTokenFunctions[ordinal] = function () {
                return this.localeData().ordinal(func.apply(this, arguments), token);
            };
        }
    }

    function removeFormattingTokens(input) {
        if (input.match(/\[[\s\S]/)) {
            return input.replace(/^\[|\]$/g, '');
        }
        return input.replace(/\\/g, '');
    }

    function makeFormatFunction(format) {
        var array = format.match(formattingTokens), i, length;

        for (i = 0, length = array.length; i < length; i++) {
            if (formatTokenFunctions[array[i]]) {
                array[i] = formatTokenFunctions[array[i]];
            } else {
                array[i] = removeFormattingTokens(array[i]);
            }
        }

        return function (mom) {
            var output = '';
            for (i = 0; i < length; i++) {
                output += array[i] instanceof Function ? array[i].call(mom, format) : array[i];
            }
            return output;
        };
    }

    // format date using native date object
    function formatMoment(m, format) {
        if (!m.isValid()) {
            return m.localeData().invalidDate();
        }

        format = expandFormat(format, m.localeData());

        if (!formatFunctions[format]) {
            formatFunctions[format] = makeFormatFunction(format);
        }

        return formatFunctions[format](m);
    }

    function expandFormat(format, locale) {
        var i = 5;

        function replaceLongDateFormatTokens(input) {
            return locale.longDateFormat(input) || input;
        }

        localFormattingTokens.lastIndex = 0;
        while (i >= 0 && localFormattingTokens.test(format)) {
            format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
            localFormattingTokens.lastIndex = 0;
            i -= 1;
        }

        return format;
    }

    var match1         = /\d/;            //       0 - 9
    var match2         = /\d\d/;          //      00 - 99
    var match3         = /\d{3}/;         //     000 - 999
    var match4         = /\d{4}/;         //    0000 - 9999
    var match6         = /[+-]?\d{6}/;    // -999999 - 999999
    var match1to2      = /\d\d?/;         //       0 - 99
    var match1to3      = /\d{1,3}/;       //       0 - 999
    var match1to4      = /\d{1,4}/;       //       0 - 9999
    var match1to6      = /[+-]?\d{1,6}/;  // -999999 - 999999

    var matchUnsigned  = /\d+/;           //       0 - inf
    var matchSigned    = /[+-]?\d+/;      //    -inf - inf

    var matchOffset    = /Z|[+-]\d\d:?\d\d/gi; // +00:00 -00:00 +0000 -0000 or Z

    var matchTimestamp = /[+-]?\d+(\.\d{1,3})?/; // 123456789 123456789.123

    // any word (or two) characters or numbers including two/three word month in arabic.
    var matchWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i;

    var regexes = {};

    function addRegexToken (token, regex, strictRegex) {
        regexes[token] = typeof regex === 'function' ? regex : function (isStrict) {
            return (isStrict && strictRegex) ? strictRegex : regex;
        };
    }

    function getParseRegexForToken (token, config) {
        if (!hasOwnProp(regexes, token)) {
            return new RegExp(unescapeFormat(token));
        }

        return regexes[token](config._strict, config._locale);
    }

    // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
    function unescapeFormat(s) {
        return s.replace('\\', '').replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
            return p1 || p2 || p3 || p4;
        }).replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    var tokens = {};

    function addParseToken (token, callback) {
        var i, func = callback;
        if (typeof token === 'string') {
            token = [token];
        }
        if (typeof callback === 'number') {
            func = function (input, array) {
                array[callback] = toInt(input);
            };
        }
        for (i = 0; i < token.length; i++) {
            tokens[token[i]] = func;
        }
    }

    function addWeekParseToken (token, callback) {
        addParseToken(token, function (input, array, config, token) {
            config._w = config._w || {};
            callback(input, config._w, config, token);
        });
    }

    function addTimeToArrayFromToken(token, input, config) {
        if (input != null && hasOwnProp(tokens, token)) {
            tokens[token](input, config._a, config, token);
        }
    }

    var YEAR = 0;
    var MONTH = 1;
    var DATE = 2;
    var HOUR = 3;
    var MINUTE = 4;
    var SECOND = 5;
    var MILLISECOND = 6;

    function daysInMonth(year, month) {
        return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    }

    // FORMATTING

    addFormatToken('M', ['MM', 2], 'Mo', function () {
        return this.month() + 1;
    });

    addFormatToken('MMM', 0, 0, function (format) {
        return this.localeData().monthsShort(this, format);
    });

    addFormatToken('MMMM', 0, 0, function (format) {
        return this.localeData().months(this, format);
    });

    // ALIASES

    addUnitAlias('month', 'M');

    // PARSING

    addRegexToken('M',    match1to2);
    addRegexToken('MM',   match1to2, match2);
    addRegexToken('MMM',  matchWord);
    addRegexToken('MMMM', matchWord);

    addParseToken(['M', 'MM'], function (input, array) {
        array[MONTH] = toInt(input) - 1;
    });

    addParseToken(['MMM', 'MMMM'], function (input, array, config, token) {
        var month = config._locale.monthsParse(input, token, config._strict);
        // if we didn't find a month name, mark the date as invalid.
        if (month != null) {
            array[MONTH] = month;
        } else {
            config._pf.invalidMonth = input;
        }
    });

    // LOCALES

    var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_');
    function localeMonths (m) {
        return this._months[m.month()];
    }

    var defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_');
    function localeMonthsShort (m) {
        return this._monthsShort[m.month()];
    }

    function localeMonthsParse (monthName, format, strict) {
        var i, mom, regex;

        if (!this._monthsParse) {
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
        }

        for (i = 0; i < 12; i++) {
            // make the regex if we don't have it already
            mom = create_utc__createUTC([2000, i]);
            if (strict && !this._longMonthsParse[i]) {
                this._longMonthsParse[i] = new RegExp('^' + this.months(mom, '').replace('.', '') + '$', 'i');
                this._shortMonthsParse[i] = new RegExp('^' + this.monthsShort(mom, '').replace('.', '') + '$', 'i');
            }
            if (!strict && !this._monthsParse[i]) {
                regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
                this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (strict && format === 'MMMM' && this._longMonthsParse[i].test(monthName)) {
                return i;
            } else if (strict && format === 'MMM' && this._shortMonthsParse[i].test(monthName)) {
                return i;
            } else if (!strict && this._monthsParse[i].test(monthName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function setMonth (mom, value) {
        var dayOfMonth;

        // TODO: Move this out of here!
        if (typeof value === 'string') {
            value = mom.localeData().monthsParse(value);
            // TODO: Another silent failure?
            if (typeof value !== 'number') {
                return mom;
            }
        }

        dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
        mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
        return mom;
    }

    function getSetMonth (value) {
        if (value != null) {
            setMonth(this, value);
            utils_hooks__hooks.updateOffset(this, true);
            return this;
        } else {
            return get_set__get(this, 'Month');
        }
    }

    function getDaysInMonth () {
        return daysInMonth(this.year(), this.month());
    }

    function checkOverflow (m) {
        var overflow;
        var a = m._a;

        if (a && m._pf.overflow === -2) {
            overflow =
                a[MONTH]       < 0 || a[MONTH]       > 11  ? MONTH :
                a[DATE]        < 1 || a[DATE]        > daysInMonth(a[YEAR], a[MONTH]) ? DATE :
                a[HOUR]        < 0 || a[HOUR]        > 24 || (a[HOUR] === 24 && (a[MINUTE] !== 0 || a[SECOND] !== 0 || a[MILLISECOND] !== 0)) ? HOUR :
                a[MINUTE]      < 0 || a[MINUTE]      > 59  ? MINUTE :
                a[SECOND]      < 0 || a[SECOND]      > 59  ? SECOND :
                a[MILLISECOND] < 0 || a[MILLISECOND] > 999 ? MILLISECOND :
                -1;

            if (m._pf._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
                overflow = DATE;
            }

            m._pf.overflow = overflow;
        }

        return m;
    }

    function warn(msg) {
        if (utils_hooks__hooks.suppressDeprecationWarnings === false && typeof console !== 'undefined' && console.warn) {
            console.warn('Deprecation warning: ' + msg);
        }
    }

    function deprecate(msg, fn) {
        var firstTime = true;
        return extend(function () {
            if (firstTime) {
                warn(msg);
                firstTime = false;
            }
            return fn.apply(this, arguments);
        }, fn);
    }

    var deprecations = {};

    function deprecateSimple(name, msg) {
        if (!deprecations[name]) {
            warn(msg);
            deprecations[name] = true;
        }
    }

    utils_hooks__hooks.suppressDeprecationWarnings = false;

    var from_string__isoRegex = /^\s*(?:[+-]\d{6}|\d{4})-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;

    var isoDates = [
        ['YYYYYY-MM-DD', /[+-]\d{6}-\d{2}-\d{2}/],
        ['YYYY-MM-DD', /\d{4}-\d{2}-\d{2}/],
        ['GGGG-[W]WW-E', /\d{4}-W\d{2}-\d/],
        ['GGGG-[W]WW', /\d{4}-W\d{2}/],
        ['YYYY-DDD', /\d{4}-\d{3}/]
    ];

    // iso time formats and regexes
    var isoTimes = [
        ['HH:mm:ss.SSSS', /(T| )\d\d:\d\d:\d\d\.\d+/],
        ['HH:mm:ss', /(T| )\d\d:\d\d:\d\d/],
        ['HH:mm', /(T| )\d\d:\d\d/],
        ['HH', /(T| )\d\d/]
    ];

    var aspNetJsonRegex = /^\/?Date\((\-?\d+)/i;

    // date from iso format
    function configFromISO(config) {
        var i, l,
            string = config._i,
            match = from_string__isoRegex.exec(string);

        if (match) {
            config._pf.iso = true;
            for (i = 0, l = isoDates.length; i < l; i++) {
                if (isoDates[i][1].exec(string)) {
                    // match[5] should be 'T' or undefined
                    config._f = isoDates[i][0] + (match[6] || ' ');
                    break;
                }
            }
            for (i = 0, l = isoTimes.length; i < l; i++) {
                if (isoTimes[i][1].exec(string)) {
                    config._f += isoTimes[i][0];
                    break;
                }
            }
            if (string.match(matchOffset)) {
                config._f += 'Z';
            }
            configFromStringAndFormat(config);
        } else {
            config._isValid = false;
        }
    }

    // date from iso format or fallback
    function configFromString(config) {
        var matched = aspNetJsonRegex.exec(config._i);

        if (matched !== null) {
            config._d = new Date(+matched[1]);
            return;
        }

        configFromISO(config);
        if (config._isValid === false) {
            delete config._isValid;
            utils_hooks__hooks.createFromInputFallback(config);
        }
    }

    utils_hooks__hooks.createFromInputFallback = deprecate(
        'moment construction falls back to js Date. This is ' +
        'discouraged and will be removed in upcoming major ' +
        'release. Please refer to ' +
        'https://github.com/moment/moment/issues/1407 for more info.',
        function (config) {
            config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
        }
    );

    function createDate (y, m, d, h, M, s, ms) {
        //can't just apply() to create a date:
        //http://stackoverflow.com/questions/181348/instantiating-a-javascript-object-by-calling-prototype-constructor-apply
        var date = new Date(y, m, d, h, M, s, ms);

        //the date constructor doesn't accept years < 1970
        if (y < 1970) {
            date.setFullYear(y);
        }
        return date;
    }

    function createUTCDate (y) {
        var date = new Date(Date.UTC.apply(null, arguments));
        if (y < 1970) {
            date.setUTCFullYear(y);
        }
        return date;
    }

    addFormatToken(0, ['YY', 2], 0, function () {
        return this.year() % 100;
    });

    addFormatToken(0, ['YYYY',   4],       0, 'year');
    addFormatToken(0, ['YYYYY',  5],       0, 'year');
    addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');

    // ALIASES

    addUnitAlias('year', 'y');

    // PARSING

    addRegexToken('Y',      matchSigned);
    addRegexToken('YY',     match1to2, match2);
    addRegexToken('YYYY',   match1to4, match4);
    addRegexToken('YYYYY',  match1to6, match6);
    addRegexToken('YYYYYY', match1to6, match6);

    addParseToken(['YYYY', 'YYYYY', 'YYYYYY'], YEAR);
    addParseToken('YY', function (input, array) {
        array[YEAR] = utils_hooks__hooks.parseTwoDigitYear(input);
    });

    // HELPERS

    function daysInYear(year) {
        return isLeapYear(year) ? 366 : 365;
    }

    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    // HOOKS

    utils_hooks__hooks.parseTwoDigitYear = function (input) {
        return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
    };

    // MOMENTS

    var getSetYear = makeGetSet('FullYear', false);

    function getIsLeapYear () {
        return isLeapYear(this.year());
    }

    addFormatToken('w', ['ww', 2], 'wo', 'week');
    addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');

    // ALIASES

    addUnitAlias('week', 'w');
    addUnitAlias('isoWeek', 'W');

    // PARSING

    addRegexToken('w',  match1to2);
    addRegexToken('ww', match1to2, match2);
    addRegexToken('W',  match1to2);
    addRegexToken('WW', match1to2, match2);

    addWeekParseToken(['w', 'ww', 'W', 'WW'], function (input, week, config, token) {
        week[token.substr(0, 1)] = toInt(input);
    });

    // HELPERS

    // firstDayOfWeek       0 = sun, 6 = sat
    //                      the day of the week that starts the week
    //                      (usually sunday or monday)
    // firstDayOfWeekOfYear 0 = sun, 6 = sat
    //                      the first week is the week that contains the first
    //                      of this day of the week
    //                      (eg. ISO weeks use thursday (4))
    function weekOfYear(mom, firstDayOfWeek, firstDayOfWeekOfYear) {
        var end = firstDayOfWeekOfYear - firstDayOfWeek,
            daysToDayOfWeek = firstDayOfWeekOfYear - mom.day(),
            adjustedMoment;


        if (daysToDayOfWeek > end) {
            daysToDayOfWeek -= 7;
        }

        if (daysToDayOfWeek < end - 7) {
            daysToDayOfWeek += 7;
        }

        adjustedMoment = local__createLocal(mom).add(daysToDayOfWeek, 'd');
        return {
            week: Math.ceil(adjustedMoment.dayOfYear() / 7),
            year: adjustedMoment.year()
        };
    }

    // LOCALES

    function localeWeek (mom) {
        return weekOfYear(mom, this._week.dow, this._week.doy).week;
    }

    var defaultLocaleWeek = {
        dow : 0, // Sunday is the first day of the week.
        doy : 6  // The week that contains Jan 1st is the first week of the year.
    };

    function localeFirstDayOfWeek () {
        return this._week.dow;
    }

    function localeFirstDayOfYear () {
        return this._week.doy;
    }

    // MOMENTS

    function getSetWeek (input) {
        var week = this.localeData().week(this);
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    function getSetISOWeek (input) {
        var week = weekOfYear(this, 1, 4).week;
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');

    // ALIASES

    addUnitAlias('dayOfYear', 'DDD');

    // PARSING

    addRegexToken('DDD',  match1to3);
    addRegexToken('DDDD', match3);
    addParseToken(['DDD', 'DDDD'], function (input, array, config) {
        config._dayOfYear = toInt(input);
    });

    // HELPERS

    //http://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
    function dayOfYearFromWeeks(year, week, weekday, firstDayOfWeekOfYear, firstDayOfWeek) {
        var d = createUTCDate(year, 0, 1).getUTCDay();
        var daysToAdd;
        var dayOfYear;

        d = d === 0 ? 7 : d;
        weekday = weekday != null ? weekday : firstDayOfWeek;
        daysToAdd = firstDayOfWeek - d + (d > firstDayOfWeekOfYear ? 7 : 0) - (d < firstDayOfWeek ? 7 : 0);
        dayOfYear = 7 * (week - 1) + (weekday - firstDayOfWeek) + daysToAdd + 1;

        return {
            year      : dayOfYear > 0 ? year      : year - 1,
            dayOfYear : dayOfYear > 0 ? dayOfYear : daysInYear(year - 1) + dayOfYear
        };
    }

    // MOMENTS

    function getSetDayOfYear (input) {
        var dayOfYear = Math.round((this.clone().startOf('day') - this.clone().startOf('year')) / 864e5) + 1;
        return input == null ? dayOfYear : this.add((input - dayOfYear), 'd');
    }

    // Pick the first defined of two or three arguments.
    function defaults(a, b, c) {
        if (a != null) {
            return a;
        }
        if (b != null) {
            return b;
        }
        return c;
    }

    function currentDateArray(config) {
        var now = new Date();
        if (config._useUTC) {
            return [now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()];
        }
        return [now.getFullYear(), now.getMonth(), now.getDate()];
    }

    // convert an array to a date.
    // the array should mirror the parameters below
    // note: all values past the year are optional and will default to the lowest possible value.
    // [year, month, day , hour, minute, second, millisecond]
    function configFromArray (config) {
        var i, date, input = [], currentDate, yearToUse;

        if (config._d) {
            return;
        }

        currentDate = currentDateArray(config);

        //compute day of the year from weeks and weekdays
        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
            dayOfYearFromWeekInfo(config);
        }

        //if the day of the year is set, figure out what it is
        if (config._dayOfYear) {
            yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);

            if (config._dayOfYear > daysInYear(yearToUse)) {
                config._pf._overflowDayOfYear = true;
            }

            date = createUTCDate(yearToUse, 0, config._dayOfYear);
            config._a[MONTH] = date.getUTCMonth();
            config._a[DATE] = date.getUTCDate();
        }

        // Default to current date.
        // * if no year, month, day of month are given, default to today
        // * if day of month is given, default month and year
        // * if month is given, default only year
        // * if year is given, don't default anything
        for (i = 0; i < 3 && config._a[i] == null; ++i) {
            config._a[i] = input[i] = currentDate[i];
        }

        // Zero out whatever was not defaulted, including time
        for (; i < 7; i++) {
            config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
        }

        // Check for 24:00:00.000
        if (config._a[HOUR] === 24 &&
                config._a[MINUTE] === 0 &&
                config._a[SECOND] === 0 &&
                config._a[MILLISECOND] === 0) {
            config._nextDay = true;
            config._a[HOUR] = 0;
        }

        config._d = (config._useUTC ? createUTCDate : createDate).apply(null, input);
        // Apply timezone offset from input. The actual utcOffset can be changed
        // with parseZone.
        if (config._tzm != null) {
            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
        }

        if (config._nextDay) {
            config._a[HOUR] = 24;
        }
    }

    function dayOfYearFromWeekInfo(config) {
        var w, weekYear, week, weekday, dow, doy, temp;

        w = config._w;
        if (w.GG != null || w.W != null || w.E != null) {
            dow = 1;
            doy = 4;

            // TODO: We need to take the current isoWeekYear, but that depends on
            // how we interpret now (local, utc, fixed offset). So create
            // a now version of current config (take local/utc/offset flags, and
            // create now).
            weekYear = defaults(w.GG, config._a[YEAR], weekOfYear(local__createLocal(), 1, 4).year);
            week = defaults(w.W, 1);
            weekday = defaults(w.E, 1);
        } else {
            dow = config._locale._week.dow;
            doy = config._locale._week.doy;

            weekYear = defaults(w.gg, config._a[YEAR], weekOfYear(local__createLocal(), dow, doy).year);
            week = defaults(w.w, 1);

            if (w.d != null) {
                // weekday -- low day numbers are considered next week
                weekday = w.d;
                if (weekday < dow) {
                    ++week;
                }
            } else if (w.e != null) {
                // local weekday -- counting starts from begining of week
                weekday = w.e + dow;
            } else {
                // default to begining of week
                weekday = dow;
            }
        }
        temp = dayOfYearFromWeeks(weekYear, week, weekday, doy, dow);

        config._a[YEAR] = temp.year;
        config._dayOfYear = temp.dayOfYear;
    }

    utils_hooks__hooks.ISO_8601 = function () {};

    // date from string and format string
    function configFromStringAndFormat(config) {
        // TODO: Move this to another part of the creation flow to prevent circular deps
        if (config._f === utils_hooks__hooks.ISO_8601) {
            configFromISO(config);
            return;
        }

        config._a = [];
        config._pf.empty = true;

        // This array is used to make a Date, either with `new Date` or `Date.UTC`
        var string = '' + config._i,
            i, parsedInput, tokens, token, skipped,
            stringLength = string.length,
            totalParsedInputLength = 0;

        tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];

        for (i = 0; i < tokens.length; i++) {
            token = tokens[i];
            parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
            if (parsedInput) {
                skipped = string.substr(0, string.indexOf(parsedInput));
                if (skipped.length > 0) {
                    config._pf.unusedInput.push(skipped);
                }
                string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
                totalParsedInputLength += parsedInput.length;
            }
            // don't parse if it's not a known token
            if (formatTokenFunctions[token]) {
                if (parsedInput) {
                    config._pf.empty = false;
                }
                else {
                    config._pf.unusedTokens.push(token);
                }
                addTimeToArrayFromToken(token, parsedInput, config);
            }
            else if (config._strict && !parsedInput) {
                config._pf.unusedTokens.push(token);
            }
        }

        // add remaining unparsed input length to the string
        config._pf.charsLeftOver = stringLength - totalParsedInputLength;
        if (string.length > 0) {
            config._pf.unusedInput.push(string);
        }

        // clear _12h flag if hour is <= 12
        if (config._pf.bigHour === true && config._a[HOUR] <= 12) {
            config._pf.bigHour = undefined;
        }
        // handle meridiem
        config._a[HOUR] = meridiemFixWrap(config._locale, config._a[HOUR], config._meridiem);

        configFromArray(config);
        checkOverflow(config);
    }


    function meridiemFixWrap (locale, hour, meridiem) {
        var isPm;

        if (meridiem == null) {
            // nothing to do
            return hour;
        }
        if (locale.meridiemHour != null) {
            return locale.meridiemHour(hour, meridiem);
        } else if (locale.isPM != null) {
            // Fallback
            isPm = locale.isPM(meridiem);
            if (isPm && hour < 12) {
                hour += 12;
            }
            if (!isPm && hour === 12) {
                hour = 0;
            }
            return hour;
        } else {
            // this is not supposed to happen
            return hour;
        }
    }

    function configFromStringAndArray(config) {
        var tempConfig,
            bestMoment,

            scoreToBeat,
            i,
            currentScore;

        if (config._f.length === 0) {
            config._pf.invalidFormat = true;
            config._d = new Date(NaN);
            return;
        }

        for (i = 0; i < config._f.length; i++) {
            currentScore = 0;
            tempConfig = copyConfig({}, config);
            if (config._useUTC != null) {
                tempConfig._useUTC = config._useUTC;
            }
            tempConfig._pf = defaultParsingFlags();
            tempConfig._f = config._f[i];
            configFromStringAndFormat(tempConfig);

            if (!valid__isValid(tempConfig)) {
                continue;
            }

            // if there is any input that was not parsed add a penalty for that format
            currentScore += tempConfig._pf.charsLeftOver;

            //or tokens
            currentScore += tempConfig._pf.unusedTokens.length * 10;

            tempConfig._pf.score = currentScore;

            if (scoreToBeat == null || currentScore < scoreToBeat) {
                scoreToBeat = currentScore;
                bestMoment = tempConfig;
            }
        }

        extend(config, bestMoment || tempConfig);
    }

    function configFromObject(config) {
        if (config._d) {
            return;
        }

        var i = normalizeObjectUnits(config._i);
        config._a = [i.year, i.month, i.day || i.date, i.hour, i.minute, i.second, i.millisecond];

        configFromArray(config);
    }

    function createFromConfig (config) {
        var input = config._i,
            format = config._f,
            res;

        config._locale = config._locale || locale_locales__getLocale(config._l);

        if (input === null || (format === undefined && input === '')) {
            return valid__createInvalid({nullInput: true});
        }

        if (typeof input === 'string') {
            config._i = input = config._locale.preparse(input);
        }

        if (isMoment(input)) {
            return new Moment(checkOverflow(input));
        } else if (isArray(format)) {
            configFromStringAndArray(config);
        } else if (format) {
            configFromStringAndFormat(config);
        } else {
            configFromInput(config);
        }

        res = new Moment(checkOverflow(config));
        if (res._nextDay) {
            // Adding is smart enough around DST
            res.add(1, 'd');
            res._nextDay = undefined;
        }

        return res;
    }

    function configFromInput(config) {
        var input = config._i;
        if (input === undefined) {
            config._d = new Date();
        } else if (isDate(input)) {
            config._d = new Date(+input);
        } else if (typeof input === 'string') {
            configFromString(config);
        } else if (isArray(input)) {
            config._a = map(input.slice(0), function (obj) {
                return parseInt(obj, 10);
            });
            configFromArray(config);
        } else if (typeof(input) === 'object') {
            configFromObject(config);
        } else if (typeof(input) === 'number') {
            // from milliseconds
            config._d = new Date(input);
        } else {
            utils_hooks__hooks.createFromInputFallback(config);
        }
    }

    function createLocalOrUTC (input, format, locale, strict, isUTC) {
        var c = {};

        if (typeof(locale) === 'boolean') {
            strict = locale;
            locale = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c._isAMomentObject = true;
        c._useUTC = c._isUTC = isUTC;
        c._l = locale;
        c._i = input;
        c._f = format;
        c._strict = strict;
        c._pf = defaultParsingFlags();

        return createFromConfig(c);
    }

    function local__createLocal (input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, false);
    }

    var prototypeMin = deprecate(
         'moment().min is deprecated, use moment.min instead. https://github.com/moment/moment/issues/1548',
         function () {
             var other = local__createLocal.apply(null, arguments);
             return other < this ? this : other;
         }
     );

    var prototypeMax = deprecate(
        'moment().max is deprecated, use moment.max instead. https://github.com/moment/moment/issues/1548',
        function () {
            var other = local__createLocal.apply(null, arguments);
            return other > this ? this : other;
        }
    );

    // Pick a moment m from moments so that m[fn](other) is true for all
    // other. This relies on the function fn to be transitive.
    //
    // moments should either be an array of moment objects or an array, whose
    // first element is an array of moment objects.
    function pickBy(fn, moments) {
        var res, i;
        if (moments.length === 1 && isArray(moments[0])) {
            moments = moments[0];
        }
        if (!moments.length) {
            return local__createLocal();
        }
        res = moments[0];
        for (i = 1; i < moments.length; ++i) {
            if (moments[i][fn](res)) {
                res = moments[i];
            }
        }
        return res;
    }

    // TODO: Use [].sort instead?
    function min () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isBefore', args);
    }

    function max () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isAfter', args);
    }

    function Duration (duration) {
        var normalizedInput = normalizeObjectUnits(duration),
            years = normalizedInput.year || 0,
            quarters = normalizedInput.quarter || 0,
            months = normalizedInput.month || 0,
            weeks = normalizedInput.week || 0,
            days = normalizedInput.day || 0,
            hours = normalizedInput.hour || 0,
            minutes = normalizedInput.minute || 0,
            seconds = normalizedInput.second || 0,
            milliseconds = normalizedInput.millisecond || 0;

        // representation for dateAddRemove
        this._milliseconds = +milliseconds +
            seconds * 1e3 + // 1000
            minutes * 6e4 + // 1000 * 60
            hours * 36e5; // 1000 * 60 * 60
        // Because of dateAddRemove treats 24 hours as different from a
        // day when working around DST, we need to store them separately
        this._days = +days +
            weeks * 7;
        // It is impossible translate months into days without knowing
        // which months you are are talking about, so we have to store
        // it separately.
        this._months = +months +
            quarters * 3 +
            years * 12;

        this._data = {};

        this._locale = locale_locales__getLocale();

        this._bubble();
    }

    function isDuration (obj) {
        return obj instanceof Duration;
    }

    function offset (token, separator) {
        addFormatToken(token, 0, 0, function () {
            var offset = this.utcOffset();
            var sign = '+';
            if (offset < 0) {
                offset = -offset;
                sign = '-';
            }
            return sign + zeroFill(~~(offset / 60), 2) + separator + zeroFill(~~(offset) % 60, 2);
        });
    }

    offset('Z', ':');
    offset('ZZ', '');

    // PARSING

    addRegexToken('Z',  matchOffset);
    addRegexToken('ZZ', matchOffset);
    addParseToken(['Z', 'ZZ'], function (input, array, config) {
        config._useUTC = true;
        config._tzm = offsetFromString(input);
    });

    // HELPERS

    // timezone chunker
    // '+10:00' > ['10',  '00']
    // '-1530'  > ['-15', '30']
    var chunkOffset = /([\+\-]|\d\d)/gi;

    function offsetFromString(string) {
        var matches = ((string || '').match(matchOffset) || []);
        var chunk   = matches[matches.length - 1] || [];
        var parts   = (chunk + '').match(chunkOffset) || ['-', 0, 0];
        var minutes = +(parts[1] * 60) + toInt(parts[2]);

        return parts[0] === '+' ? minutes : -minutes;
    }

    // Return a moment from input, that is local/utc/zone equivalent to model.
    function cloneWithOffset(input, model) {
        var res, diff;
        if (model._isUTC) {
            res = model.clone();
            diff = (isMoment(input) || isDate(input) ? +input : +local__createLocal(input)) - (+res);
            // Use low-level api, because this fn is low-level api.
            res._d.setTime(+res._d + diff);
            utils_hooks__hooks.updateOffset(res, false);
            return res;
        } else {
            return local__createLocal(input).local();
        }
        return model._isUTC ? local__createLocal(input).zone(model._offset || 0) : local__createLocal(input).local();
    }

    function getDateOffset (m) {
        // On Firefox.24 Date#getTimezoneOffset returns a floating point.
        // https://github.com/moment/moment/pull/1871
        return -Math.round(m._d.getTimezoneOffset() / 15) * 15;
    }

    // HOOKS

    // This function will be called whenever a moment is mutated.
    // It is intended to keep the offset in sync with the timezone.
    utils_hooks__hooks.updateOffset = function () {};

    // MOMENTS

    // keepLocalTime = true means only change the timezone, without
    // affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
    // 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
    // +0200, so we adjust the time as needed, to be valid.
    //
    // Keeping the time actually adds/subtracts (one hour)
    // from the actual represented time. That is why we call updateOffset
    // a second time. In case it wants us to change the offset again
    // _changeInProgress == true case, then we have to adjust, because
    // there is no such time in the given timezone.
    function getSetOffset (input, keepLocalTime) {
        var offset = this._offset || 0,
            localAdjust;
        if (input != null) {
            if (typeof input === 'string') {
                input = offsetFromString(input);
            }
            if (Math.abs(input) < 16) {
                input = input * 60;
            }
            if (!this._isUTC && keepLocalTime) {
                localAdjust = getDateOffset(this);
            }
            this._offset = input;
            this._isUTC = true;
            if (localAdjust != null) {
                this.add(localAdjust, 'm');
            }
            if (offset !== input) {
                if (!keepLocalTime || this._changeInProgress) {
                    add_subtract__addSubtract(this, create__createDuration(input - offset, 'm'), 1, false);
                } else if (!this._changeInProgress) {
                    this._changeInProgress = true;
                    utils_hooks__hooks.updateOffset(this, true);
                    this._changeInProgress = null;
                }
            }
            return this;
        } else {
            return this._isUTC ? offset : getDateOffset(this);
        }
    }

    function getSetZone (input, keepLocalTime) {
        if (input != null) {
            if (typeof input !== 'string') {
                input = -input;
            }

            this.utcOffset(input, keepLocalTime);

            return this;
        } else {
            return -this.utcOffset();
        }
    }

    function setOffsetToUTC (keepLocalTime) {
        return this.utcOffset(0, keepLocalTime);
    }

    function setOffsetToLocal (keepLocalTime) {
        if (this._isUTC) {
            this.utcOffset(0, keepLocalTime);
            this._isUTC = false;

            if (keepLocalTime) {
                this.subtract(getDateOffset(this), 'm');
            }
        }
        return this;
    }

    function setOffsetToParsedOffset () {
        if (this._tzm) {
            this.utcOffset(this._tzm);
        } else if (typeof this._i === 'string') {
            this.utcOffset(offsetFromString(this._i));
        }
        return this;
    }

    function hasAlignedHourOffset (input) {
        if (!input) {
            input = 0;
        }
        else {
            input = local__createLocal(input).utcOffset();
        }

        return (this.utcOffset() - input) % 60 === 0;
    }

    function isDaylightSavingTime () {
        return (
            this.utcOffset() > this.clone().month(0).utcOffset() ||
            this.utcOffset() > this.clone().month(5).utcOffset()
        );
    }

    function isDaylightSavingTimeShifted () {
        if (this._a) {
            var other = this._isUTC ? create_utc__createUTC(this._a) : local__createLocal(this._a);
            return this.isValid() && compareArrays(this._a, other.toArray()) > 0;
        }

        return false;
    }

    function isLocal () {
        return !this._isUTC;
    }

    function isUtcOffset () {
        return this._isUTC;
    }

    function isUtc () {
        return this._isUTC && this._offset === 0;
    }

    var aspNetRegex = /(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/;

    // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
    // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
    var create__isoRegex = /^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/;

    function create__createDuration (input, key) {
        var duration = input,
            // matching against regexp is expensive, do it on demand
            match = null,
            sign,
            ret,
            diffRes;

        if (isDuration(input)) {
            duration = {
                ms : input._milliseconds,
                d  : input._days,
                M  : input._months
            };
        } else if (typeof input === 'number') {
            duration = {};
            if (key) {
                duration[key] = input;
            } else {
                duration.milliseconds = input;
            }
        } else if (!!(match = aspNetRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            duration = {
                y  : 0,
                d  : toInt(match[DATE])        * sign,
                h  : toInt(match[HOUR])        * sign,
                m  : toInt(match[MINUTE])      * sign,
                s  : toInt(match[SECOND])      * sign,
                ms : toInt(match[MILLISECOND]) * sign
            };
        } else if (!!(match = create__isoRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            duration = {
                y : parseIso(match[2], sign),
                M : parseIso(match[3], sign),
                d : parseIso(match[4], sign),
                h : parseIso(match[5], sign),
                m : parseIso(match[6], sign),
                s : parseIso(match[7], sign),
                w : parseIso(match[8], sign)
            };
        } else if (duration == null) {// checks for null or undefined
            duration = {};
        } else if (typeof duration === 'object' && ('from' in duration || 'to' in duration)) {
            diffRes = momentsDifference(local__createLocal(duration.from), local__createLocal(duration.to));

            duration = {};
            duration.ms = diffRes.milliseconds;
            duration.M = diffRes.months;
        }

        ret = new Duration(duration);

        if (isDuration(input) && hasOwnProp(input, '_locale')) {
            ret._locale = input._locale;
        }

        return ret;
    }

    create__createDuration.fn = Duration.prototype;

    function parseIso (inp, sign) {
        // We'd normally use ~~inp for this, but unfortunately it also
        // converts floats to ints.
        // inp may be undefined, so careful calling replace on it.
        var res = inp && parseFloat(inp.replace(',', '.'));
        // apply sign while we're at it
        return (isNaN(res) ? 0 : res) * sign;
    }

    function positiveMomentsDifference(base, other) {
        var res = {milliseconds: 0, months: 0};

        res.months = other.month() - base.month() +
            (other.year() - base.year()) * 12;
        if (base.clone().add(res.months, 'M').isAfter(other)) {
            --res.months;
        }

        res.milliseconds = +other - +(base.clone().add(res.months, 'M'));

        return res;
    }

    function momentsDifference(base, other) {
        var res;
        other = cloneWithOffset(other, base);
        if (base.isBefore(other)) {
            res = positiveMomentsDifference(base, other);
        } else {
            res = positiveMomentsDifference(other, base);
            res.milliseconds = -res.milliseconds;
            res.months = -res.months;
        }

        return res;
    }

    function createAdder(direction, name) {
        return function (val, period) {
            var dur, tmp;
            //invert the arguments, but complain about it
            if (period !== null && !isNaN(+period)) {
                deprecateSimple(name, 'moment().' + name  + '(period, number) is deprecated. Please use moment().' + name + '(number, period).');
                tmp = val; val = period; period = tmp;
            }

            val = typeof val === 'string' ? +val : val;
            dur = create__createDuration(val, period);
            add_subtract__addSubtract(this, dur, direction);
            return this;
        };
    }

    function add_subtract__addSubtract (mom, duration, isAdding, updateOffset) {
        var milliseconds = duration._milliseconds,
            days = duration._days,
            months = duration._months;
        updateOffset = updateOffset == null ? true : updateOffset;

        if (milliseconds) {
            mom._d.setTime(+mom._d + milliseconds * isAdding);
        }
        if (days) {
            get_set__set(mom, 'Date', get_set__get(mom, 'Date') + days * isAdding);
        }
        if (months) {
            setMonth(mom, get_set__get(mom, 'Month') + months * isAdding);
        }
        if (updateOffset) {
            utils_hooks__hooks.updateOffset(mom, days || months);
        }
    }

    var add_subtract__add      = createAdder(1, 'add');
    var add_subtract__subtract = createAdder(-1, 'subtract');

    function moment_calendar__calendar (time) {
        // We want to compare the start of today, vs this.
        // Getting start-of-today depends on whether we're local/utc/offset or not.
        var now = time || local__createLocal(),
            sod = cloneWithOffset(now, this).startOf('day'),
            diff = this.diff(sod, 'days', true),
            format = diff < -6 ? 'sameElse' :
                diff < -1 ? 'lastWeek' :
                diff < 0 ? 'lastDay' :
                diff < 1 ? 'sameDay' :
                diff < 2 ? 'nextDay' :
                diff < 7 ? 'nextWeek' : 'sameElse';
        return this.format(this.localeData().calendar(format, this, local__createLocal(now)));
    }

    function clone () {
        return new Moment(this);
    }

    function isAfter (input, units) {
        var inputMs;
        units = normalizeUnits(typeof units !== 'undefined' ? units : 'millisecond');
        if (units === 'millisecond') {
            input = isMoment(input) ? input : local__createLocal(input);
            return +this > +input;
        } else {
            inputMs = isMoment(input) ? +input : +local__createLocal(input);
            return inputMs < +this.clone().startOf(units);
        }
    }

    function isBefore (input, units) {
        var inputMs;
        units = normalizeUnits(typeof units !== 'undefined' ? units : 'millisecond');
        if (units === 'millisecond') {
            input = isMoment(input) ? input : local__createLocal(input);
            return +this < +input;
        } else {
            inputMs = isMoment(input) ? +input : +local__createLocal(input);
            return +this.clone().endOf(units) < inputMs;
        }
    }

    function isBetween (from, to, units) {
        return this.isAfter(from, units) && this.isBefore(to, units);
    }

    function isSame (input, units) {
        var inputMs;
        units = normalizeUnits(units || 'millisecond');
        if (units === 'millisecond') {
            input = isMoment(input) ? input : local__createLocal(input);
            return +this === +input;
        } else {
            inputMs = +local__createLocal(input);
            return +(this.clone().startOf(units)) <= inputMs && inputMs <= +(this.clone().endOf(units));
        }
    }

    function absFloor (number) {
        if (number < 0) {
            return Math.ceil(number);
        } else {
            return Math.floor(number);
        }
    }

    function diff (input, units, asFloat) {
        var that = cloneWithOffset(input, this),
            zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4,
            delta, output;

        units = normalizeUnits(units);

        if (units === 'year' || units === 'month' || units === 'quarter') {
            output = monthDiff(this, that);
            if (units === 'quarter') {
                output = output / 3;
            } else if (units === 'year') {
                output = output / 12;
            }
        } else {
            delta = this - that;
            output = units === 'second' ? delta / 1e3 : // 1000
                units === 'minute' ? delta / 6e4 : // 1000 * 60
                units === 'hour' ? delta / 36e5 : // 1000 * 60 * 60
                units === 'day' ? (delta - zoneDelta) / 864e5 : // 1000 * 60 * 60 * 24, negate dst
                units === 'week' ? (delta - zoneDelta) / 6048e5 : // 1000 * 60 * 60 * 24 * 7, negate dst
                delta;
        }
        return asFloat ? output : absFloor(output);
    }

    function monthDiff (a, b) {
        // difference in months
        var wholeMonthDiff = ((b.year() - a.year()) * 12) + (b.month() - a.month()),
            // b is in (anchor - 1 month, anchor + 1 month)
            anchor = a.clone().add(wholeMonthDiff, 'months'),
            anchor2, adjust;

        if (b - anchor < 0) {
            anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor - anchor2);
        } else {
            anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor2 - anchor);
        }

        return -(wholeMonthDiff + adjust);
    }

    utils_hooks__hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';

    function toString () {
        return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
    }

    function moment_format__toISOString () {
        var m = this.clone().utc();
        if (0 < m.year() && m.year() <= 9999) {
            if ('function' === typeof Date.prototype.toISOString) {
                // native implementation is ~50x faster, use it when we can
                return this.toDate().toISOString();
            } else {
                return formatMoment(m, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
            }
        } else {
            return formatMoment(m, 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
        }
    }

    function format (inputString) {
        var output = formatMoment(this, inputString || utils_hooks__hooks.defaultFormat);
        return this.localeData().postformat(output);
    }

    function from (time, withoutSuffix) {
        return create__createDuration({to: this, from: time}).locale(this.locale()).humanize(!withoutSuffix);
    }

    function fromNow (withoutSuffix) {
        return this.from(local__createLocal(), withoutSuffix);
    }

    function locale (key) {
        var newLocaleData;

        if (key === undefined) {
            return this._locale._abbr;
        } else {
            newLocaleData = locale_locales__getLocale(key);
            if (newLocaleData != null) {
                this._locale = newLocaleData;
            }
            return this;
        }
    }

    var lang = deprecate(
        'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
        function (key) {
            if (key === undefined) {
                return this.localeData();
            } else {
                return this.locale(key);
            }
        }
    );

    function localeData () {
        return this._locale;
    }

    function startOf (units) {
        units = normalizeUnits(units);
        // the following switch intentionally omits break keywords
        // to utilize falling through the cases.
        switch (units) {
        case 'year':
            this.month(0);
            /* falls through */
        case 'quarter':
        case 'month':
            this.date(1);
            /* falls through */
        case 'week':
        case 'isoWeek':
        case 'day':
            this.hours(0);
            /* falls through */
        case 'hour':
            this.minutes(0);
            /* falls through */
        case 'minute':
            this.seconds(0);
            /* falls through */
        case 'second':
            this.milliseconds(0);
        }

        // weeks are a special case
        if (units === 'week') {
            this.weekday(0);
        }
        if (units === 'isoWeek') {
            this.isoWeekday(1);
        }

        // quarters are also special
        if (units === 'quarter') {
            this.month(Math.floor(this.month() / 3) * 3);
        }

        return this;
    }

    function endOf (units) {
        units = normalizeUnits(units);
        if (units === undefined || units === 'millisecond') {
            return this;
        }
        return this.startOf(units).add(1, (units === 'isoWeek' ? 'week' : units)).subtract(1, 'ms');
    }

    function to_type__valueOf () {
        return +this._d - ((this._offset || 0) * 60000);
    }

    function unix () {
        return Math.floor(+this / 1000);
    }

    function toDate () {
        return this._offset ? new Date(+this) : this._d;
    }

    function toArray () {
        var m = this;
        return [m.year(), m.month(), m.date(), m.hour(), m.minute(), m.second(), m.millisecond()];
    }

    function moment_valid__isValid () {
        return valid__isValid(this);
    }

    function parsingFlags () {
        return extend({}, this._pf);
    }

    function invalidAt () {
        return this._pf.overflow;
    }

    addFormatToken(0, ['gg', 2], 0, function () {
        return this.weekYear() % 100;
    });

    addFormatToken(0, ['GG', 2], 0, function () {
        return this.isoWeekYear() % 100;
    });

    function addWeekYearFormatToken (token, getter) {
        addFormatToken(0, [token, token.length], 0, getter);
    }

    addWeekYearFormatToken('gggg',     'weekYear');
    addWeekYearFormatToken('ggggg',    'weekYear');
    addWeekYearFormatToken('GGGG',  'isoWeekYear');
    addWeekYearFormatToken('GGGGG', 'isoWeekYear');

    // ALIASES

    addUnitAlias('weekYear', 'gg');
    addUnitAlias('isoWeekYear', 'GG');

    // PARSING

    addRegexToken('G',      matchSigned);
    addRegexToken('g',      matchSigned);
    addRegexToken('GG',     match1to2, match2);
    addRegexToken('gg',     match1to2, match2);
    addRegexToken('GGGG',   match1to4, match4);
    addRegexToken('gggg',   match1to4, match4);
    addRegexToken('GGGGG',  match1to6, match6);
    addRegexToken('ggggg',  match1to6, match6);

    addWeekParseToken(['gggg', 'ggggg', 'GGGG', 'GGGGG'], function (input, week, config, token) {
        week[token.substr(0, 2)] = toInt(input);
    });

    addWeekParseToken(['gg', 'GG'], function (input, week, config, token) {
        week[token] = utils_hooks__hooks.parseTwoDigitYear(input);
    });

    // HELPERS

    function weeksInYear(year, dow, doy) {
        return weekOfYear(local__createLocal([year, 11, 31 + dow - doy]), dow, doy).week;
    }

    // MOMENTS

    function getSetWeekYear (input) {
        var year = weekOfYear(this, this.localeData()._week.dow, this.localeData()._week.doy).year;
        return input == null ? year : this.add((input - year), 'y');
    }

    function getSetISOWeekYear (input) {
        var year = weekOfYear(this, 1, 4).year;
        return input == null ? year : this.add((input - year), 'y');
    }

    function getISOWeeksInYear () {
        return weeksInYear(this.year(), 1, 4);
    }

    function getWeeksInYear () {
        var weekInfo = this.localeData()._week;
        return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
    }

    addFormatToken('Q', 0, 0, 'quarter');

    // ALIASES

    addUnitAlias('quarter', 'Q');

    // PARSING

    addRegexToken('Q', match1);
    addParseToken('Q', function (input, array) {
        array[MONTH] = (toInt(input) - 1) * 3;
    });

    // MOMENTS

    function getSetQuarter (input) {
        return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
    }

    addFormatToken('D', ['DD', 2], 'Do', 'date');

    // ALIASES

    addUnitAlias('date', 'D');

    // PARSING

    addRegexToken('D',  match1to2);
    addRegexToken('DD', match1to2, match2);
    addRegexToken('Do', function (isStrict, locale) {
        return isStrict ? locale._ordinalParse : locale._ordinalParseLenient;
    });

    addParseToken(['D', 'DD'], DATE);
    addParseToken('Do', function (input, array) {
        array[DATE] = toInt(input.match(match1to2)[0], 10);
    });

    // MOMENTS

    var getSetDayOfMonth = makeGetSet('Date', true);

    addFormatToken('d', 0, 'do', 'day');

    addFormatToken('dd', 0, 0, function (format) {
        return this.localeData().weekdaysMin(this, format);
    });

    addFormatToken('ddd', 0, 0, function (format) {
        return this.localeData().weekdaysShort(this, format);
    });

    addFormatToken('dddd', 0, 0, function (format) {
        return this.localeData().weekdays(this, format);
    });

    addFormatToken('e', 0, 0, 'weekday');
    addFormatToken('E', 0, 0, 'isoWeekday');

    // ALIASES

    addUnitAlias('day', 'd');
    addUnitAlias('weekday', 'e');
    addUnitAlias('isoWeekday', 'E');

    // PARSING

    addRegexToken('d',    match1to2);
    addRegexToken('e',    match1to2);
    addRegexToken('E',    match1to2);
    addRegexToken('dd',   matchWord);
    addRegexToken('ddd',  matchWord);
    addRegexToken('dddd', matchWord);

    addWeekParseToken(['dd', 'ddd', 'dddd'], function (input, week, config) {
        var weekday = config._locale.weekdaysParse(input);
        // if we didn't get a weekday name, mark the date as invalid
        if (weekday != null) {
            week.d = weekday;
        } else {
            config._pf.invalidWeekday = input;
        }
    });

    addWeekParseToken(['d', 'e', 'E'], function (input, week, config, token) {
        week[token] = toInt(input);
    });

    // HELPERS

    function parseWeekday(input, locale) {
        if (typeof input === 'string') {
            if (!isNaN(input)) {
                input = parseInt(input, 10);
            }
            else {
                input = locale.weekdaysParse(input);
                if (typeof input !== 'number') {
                    return null;
                }
            }
        }
        return input;
    }

    // LOCALES

    var defaultLocaleWeekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_');
    function localeWeekdays (m) {
        return this._weekdays[m.day()];
    }

    var defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_');
    function localeWeekdaysShort (m) {
        return this._weekdaysShort[m.day()];
    }

    var defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_');
    function localeWeekdaysMin (m) {
        return this._weekdaysMin[m.day()];
    }

    function localeWeekdaysParse (weekdayName) {
        var i, mom, regex;

        if (!this._weekdaysParse) {
            this._weekdaysParse = [];
        }

        for (i = 0; i < 7; i++) {
            // make the regex if we don't have it already
            if (!this._weekdaysParse[i]) {
                mom = local__createLocal([2000, 1]).day(i);
                regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
                this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (this._weekdaysParse[i].test(weekdayName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function getSetDayOfWeek (input) {
        var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
        if (input != null) {
            input = parseWeekday(input, this.localeData());
            return this.add(input - day, 'd');
        } else {
            return day;
        }
    }

    function getSetLocaleDayOfWeek (input) {
        var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
        return input == null ? weekday : this.add(input - weekday, 'd');
    }

    function getSetISODayOfWeek (input) {
        // behaves the same as moment#day except
        // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
        // as a setter, sunday should belong to the previous week.
        return input == null ? this.day() || 7 : this.day(this.day() % 7 ? input : input - 7);
    }

    addFormatToken('H', ['HH', 2], 0, 'hour');
    addFormatToken('h', ['hh', 2], 0, function () {
        return this.hours() % 12 || 12;
    });

    function meridiem (token, lowercase) {
        addFormatToken(token, 0, 0, function () {
            return this.localeData().meridiem(this.hours(), this.minutes(), lowercase);
        });
    }

    meridiem('a', true);
    meridiem('A', false);

    // ALIASES

    addUnitAlias('hour', 'h');

    // PARSING

    function matchMeridiem (isStrict, locale) {
        return locale._meridiemParse;
    }

    addRegexToken('a',  matchMeridiem);
    addRegexToken('A',  matchMeridiem);
    addRegexToken('H',  match1to2);
    addRegexToken('h',  match1to2);
    addRegexToken('HH', match1to2, match2);
    addRegexToken('hh', match1to2, match2);

    addParseToken(['H', 'HH'], HOUR);
    addParseToken(['a', 'A'], function (input, array, config) {
        config._isPm = config._locale.isPM(input);
        config._meridiem = input;
    });
    addParseToken(['h', 'hh'], function (input, array, config) {
        array[HOUR] = toInt(input);
        config._pf.bigHour = true;
    });

    // LOCALES

    function localeIsPM (input) {
        // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
        // Using charAt should be more compatible.
        return ((input + '').toLowerCase().charAt(0) === 'p');
    }

    var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i;
    function localeMeridiem (hours, minutes, isLower) {
        if (hours > 11) {
            return isLower ? 'pm' : 'PM';
        } else {
            return isLower ? 'am' : 'AM';
        }
    }


    // MOMENTS

    // Setting the hour should keep the time, because the user explicitly
    // specified which hour he wants. So trying to maintain the same hour (in
    // a new timezone) makes sense. Adding/subtracting hours does not follow
    // this rule.
    var getSetHour = makeGetSet('Hours', true);

    addFormatToken('m', ['mm', 2], 0, 'minute');

    // ALIASES

    addUnitAlias('minute', 'm');

    // PARSING

    addRegexToken('m',  match1to2);
    addRegexToken('mm', match1to2, match2);
    addParseToken(['m', 'mm'], MINUTE);

    // MOMENTS

    var getSetMinute = makeGetSet('Minutes', false);

    addFormatToken('s', ['ss', 2], 0, 'second');

    // ALIASES

    addUnitAlias('second', 's');

    // PARSING

    addRegexToken('s',  match1to2);
    addRegexToken('ss', match1to2, match2);
    addParseToken(['s', 'ss'], SECOND);

    // MOMENTS

    var getSetSecond = makeGetSet('Seconds', false);

    addFormatToken('S', 0, 0, function () {
        return ~~(this.millisecond() / 100);
    });

    addFormatToken(0, ['SS', 2], 0, function () {
        return ~~(this.millisecond() / 10);
    });

    function millisecond__milliseconds (token) {
        addFormatToken(0, [token, 3], 0, 'millisecond');
    }

    millisecond__milliseconds('SSS');
    millisecond__milliseconds('SSSS');

    // ALIASES

    addUnitAlias('millisecond', 'ms');

    // PARSING

    addRegexToken('S',    match1to3, match1);
    addRegexToken('SS',   match1to3, match2);
    addRegexToken('SSS',  match1to3, match3);
    addRegexToken('SSSS', matchUnsigned);
    addParseToken(['S', 'SS', 'SSS', 'SSSS'], function (input, array) {
        array[MILLISECOND] = toInt(('0.' + input) * 1000);
    });

    // MOMENTS

    var getSetMillisecond = makeGetSet('Milliseconds', false);

    addFormatToken('z',  0, 0, 'zoneAbbr');
    addFormatToken('zz', 0, 0, 'zoneName');

    // MOMENTS

    function getZoneAbbr () {
        return this._isUTC ? 'UTC' : '';
    }

    function getZoneName () {
        return this._isUTC ? 'Coordinated Universal Time' : '';
    }

    var momentPrototype__proto = Moment.prototype;

    momentPrototype__proto.add          = add_subtract__add;
    momentPrototype__proto.calendar     = moment_calendar__calendar;
    momentPrototype__proto.clone        = clone;
    momentPrototype__proto.diff         = diff;
    momentPrototype__proto.endOf        = endOf;
    momentPrototype__proto.format       = format;
    momentPrototype__proto.from         = from;
    momentPrototype__proto.fromNow      = fromNow;
    momentPrototype__proto.get          = getSet;
    momentPrototype__proto.invalidAt    = invalidAt;
    momentPrototype__proto.isAfter      = isAfter;
    momentPrototype__proto.isBefore     = isBefore;
    momentPrototype__proto.isBetween    = isBetween;
    momentPrototype__proto.isSame       = isSame;
    momentPrototype__proto.isValid      = moment_valid__isValid;
    momentPrototype__proto.lang         = lang;
    momentPrototype__proto.locale       = locale;
    momentPrototype__proto.localeData   = localeData;
    momentPrototype__proto.max          = prototypeMax;
    momentPrototype__proto.min          = prototypeMin;
    momentPrototype__proto.parsingFlags = parsingFlags;
    momentPrototype__proto.set          = getSet;
    momentPrototype__proto.startOf      = startOf;
    momentPrototype__proto.subtract     = add_subtract__subtract;
    momentPrototype__proto.toArray      = toArray;
    momentPrototype__proto.toDate       = toDate;
    momentPrototype__proto.toISOString  = moment_format__toISOString;
    momentPrototype__proto.toJSON       = moment_format__toISOString;
    momentPrototype__proto.toString     = toString;
    momentPrototype__proto.unix         = unix;
    momentPrototype__proto.valueOf      = to_type__valueOf;

    // Year
    momentPrototype__proto.year       = getSetYear;
    momentPrototype__proto.isLeapYear = getIsLeapYear;

    // Week Year
    momentPrototype__proto.weekYear    = getSetWeekYear;
    momentPrototype__proto.isoWeekYear = getSetISOWeekYear;

    // Quarter
    momentPrototype__proto.quarter = momentPrototype__proto.quarters = getSetQuarter;

    // Month
    momentPrototype__proto.month       = getSetMonth;
    momentPrototype__proto.daysInMonth = getDaysInMonth;

    // Week
    momentPrototype__proto.week           = momentPrototype__proto.weeks        = getSetWeek;
    momentPrototype__proto.isoWeek        = momentPrototype__proto.isoWeeks     = getSetISOWeek;
    momentPrototype__proto.weeksInYear    = getWeeksInYear;
    momentPrototype__proto.isoWeeksInYear = getISOWeeksInYear;

    // Day
    momentPrototype__proto.date       = getSetDayOfMonth;
    momentPrototype__proto.day        = momentPrototype__proto.days             = getSetDayOfWeek;
    momentPrototype__proto.weekday    = getSetLocaleDayOfWeek;
    momentPrototype__proto.isoWeekday = getSetISODayOfWeek;
    momentPrototype__proto.dayOfYear  = getSetDayOfYear;

    // Hour
    momentPrototype__proto.hour = momentPrototype__proto.hours = getSetHour;

    // Minute
    momentPrototype__proto.minute = momentPrototype__proto.minutes = getSetMinute;

    // Second
    momentPrototype__proto.second = momentPrototype__proto.seconds = getSetSecond;

    // Millisecond
    momentPrototype__proto.millisecond = momentPrototype__proto.milliseconds = getSetMillisecond;

    // Offset
    momentPrototype__proto.utcOffset            = getSetOffset;
    momentPrototype__proto.utc                  = setOffsetToUTC;
    momentPrototype__proto.local                = setOffsetToLocal;
    momentPrototype__proto.parseZone            = setOffsetToParsedOffset;
    momentPrototype__proto.hasAlignedHourOffset = hasAlignedHourOffset;
    momentPrototype__proto.isDST                = isDaylightSavingTime;
    momentPrototype__proto.isDSTShifted         = isDaylightSavingTimeShifted;
    momentPrototype__proto.isLocal              = isLocal;
    momentPrototype__proto.isUtcOffset          = isUtcOffset;
    momentPrototype__proto.isUtc                = isUtc;
    momentPrototype__proto.isUTC                = isUtc;

    // Timezone
    momentPrototype__proto.zoneAbbr = getZoneAbbr;
    momentPrototype__proto.zoneName = getZoneName;

    // Deprecations
    momentPrototype__proto.dates  = deprecate('dates accessor is deprecated. Use date instead.', getSetDayOfMonth);
    momentPrototype__proto.months = deprecate('months accessor is deprecated. Use month instead', getSetMonth);
    momentPrototype__proto.years  = deprecate('years accessor is deprecated. Use year instead', getSetYear);
    momentPrototype__proto.zone   = deprecate('moment().zone is deprecated, use moment().utcOffset instead. https://github.com/moment/moment/issues/1779', getSetZone);

    var momentPrototype = momentPrototype__proto;

    function moment__createUnix (input) {
        return local__createLocal(input * 1000);
    }

    function moment__createInZone () {
        return local__createLocal.apply(null, arguments).parseZone();
    }

    var defaultCalendar = {
        sameDay : '[Today at] LT',
        nextDay : '[Tomorrow at] LT',
        nextWeek : 'dddd [at] LT',
        lastDay : '[Yesterday at] LT',
        lastWeek : '[Last] dddd [at] LT',
        sameElse : 'L'
    };

    function locale_calendar__calendar (key, mom, now) {
        var output = this._calendar[key];
        return typeof output === 'function' ? output.call(mom, now) : output;
    }

    var defaultLongDateFormat = {
        LTS  : 'h:mm:ss A',
        LT   : 'h:mm A',
        L    : 'MM/DD/YYYY',
        LL   : 'MMMM D, YYYY',
        LLL  : 'MMMM D, YYYY LT',
        LLLL : 'dddd, MMMM D, YYYY LT'
    };

    function longDateFormat (key) {
        var output = this._longDateFormat[key];
        if (!output && this._longDateFormat[key.toUpperCase()]) {
            output = this._longDateFormat[key.toUpperCase()].replace(/MMMM|MM|DD|dddd/g, function (val) {
                return val.slice(1);
            });
            this._longDateFormat[key] = output;
        }
        return output;
    }

    var defaultInvalidDate = 'Invalid date';

    function invalidDate () {
        return this._invalidDate;
    }

    var defaultOrdinal = '%d';
    var defaultOrdinalParse = /\d{1,2}/;

    function ordinal (number) {
        return this._ordinal.replace('%d', number);
    }

    function preParsePostFormat (string) {
        return string;
    }

    var defaultRelativeTime = {
        future : 'in %s',
        past   : '%s ago',
        s  : 'a few seconds',
        m  : 'a minute',
        mm : '%d minutes',
        h  : 'an hour',
        hh : '%d hours',
        d  : 'a day',
        dd : '%d days',
        M  : 'a month',
        MM : '%d months',
        y  : 'a year',
        yy : '%d years'
    };

    function relative__relativeTime (number, withoutSuffix, string, isFuture) {
        var output = this._relativeTime[string];
        return (typeof output === 'function') ?
            output(number, withoutSuffix, string, isFuture) :
            output.replace(/%d/i, number);
    }

    function pastFuture (diff, output) {
        var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
        return typeof format === 'function' ? format(output) : format.replace(/%s/i, output);
    }

    function locale_set__set (config) {
        var prop, i;
        for (i in config) {
            prop = config[i];
            if (typeof prop === 'function') {
                this[i] = prop;
            } else {
                this['_' + i] = prop;
            }
        }
        // Lenient ordinal parsing accepts just a number in addition to
        // number + (possibly) stuff coming from _ordinalParseLenient.
        this._ordinalParseLenient = new RegExp(this._ordinalParse.source + '|' + /\d{1,2}/.source);
    }

    var prototype__proto = Locale.prototype;

    prototype__proto._calendar       = defaultCalendar;
    prototype__proto.calendar        = locale_calendar__calendar;
    prototype__proto._longDateFormat = defaultLongDateFormat;
    prototype__proto.longDateFormat  = longDateFormat;
    prototype__proto._invalidDate    = defaultInvalidDate;
    prototype__proto.invalidDate     = invalidDate;
    prototype__proto._ordinal        = defaultOrdinal;
    prototype__proto.ordinal         = ordinal;
    prototype__proto._ordinalParse   = defaultOrdinalParse;
    prototype__proto.preparse        = preParsePostFormat;
    prototype__proto.postformat      = preParsePostFormat;
    prototype__proto._relativeTime   = defaultRelativeTime;
    prototype__proto.relativeTime    = relative__relativeTime;
    prototype__proto.pastFuture      = pastFuture;
    prototype__proto.set             = locale_set__set;

    // Month
    prototype__proto.months       =        localeMonths;
    prototype__proto._months      = defaultLocaleMonths;
    prototype__proto.monthsShort  =        localeMonthsShort;
    prototype__proto._monthsShort = defaultLocaleMonthsShort;
    prototype__proto.monthsParse  =        localeMonthsParse;

    // Week
    prototype__proto.week = localeWeek;
    prototype__proto._week = defaultLocaleWeek;
    prototype__proto.firstDayOfYear = localeFirstDayOfYear;
    prototype__proto.firstDayOfWeek = localeFirstDayOfWeek;

    // Day of Week
    prototype__proto.weekdays       =        localeWeekdays;
    prototype__proto._weekdays      = defaultLocaleWeekdays;
    prototype__proto.weekdaysMin    =        localeWeekdaysMin;
    prototype__proto._weekdaysMin   = defaultLocaleWeekdaysMin;
    prototype__proto.weekdaysShort  =        localeWeekdaysShort;
    prototype__proto._weekdaysShort = defaultLocaleWeekdaysShort;
    prototype__proto.weekdaysParse  =        localeWeekdaysParse;

    // Hours
    prototype__proto.isPM = localeIsPM;
    prototype__proto._meridiemParse = defaultLocaleMeridiemParse;
    prototype__proto.meridiem = localeMeridiem;

    function lists__get (format, index, field, setter) {
        var locale = locale_locales__getLocale();
        var utc = create_utc__createUTC().set(setter, index);
        return locale[field](utc, format);
    }

    function list (format, index, field, count, setter) {
        if (typeof format === 'number') {
            index = format;
            format = undefined;
        }

        format = format || '';

        if (index != null) {
            return lists__get(format, index, field, setter);
        }

        var i;
        var out = [];
        for (i = 0; i < count; i++) {
            out[i] = lists__get(format, i, field, setter);
        }
        return out;
    }

    function lists__listMonths (format, index) {
        return list(format, index, 'months', 12, 'month');
    }

    function lists__listMonthsShort (format, index) {
        return list(format, index, 'monthsShort', 12, 'month');
    }

    function lists__listWeekdays (format, index) {
        return list(format, index, 'weekdays', 7, 'day');
    }

    function lists__listWeekdaysShort (format, index) {
        return list(format, index, 'weekdaysShort', 7, 'day');
    }

    function lists__listWeekdaysMin (format, index) {
        return list(format, index, 'weekdaysMin', 7, 'day');
    }

    locale_locales__getSetGlobalLocale('en', {
        ordinalParse: /\d{1,2}(th|st|nd|rd)/,
        ordinal : function (number) {
            var b = number % 10,
                output = (toInt(number % 100 / 10) === 1) ? 'th' :
                (b === 1) ? 'st' :
                (b === 2) ? 'nd' :
                (b === 3) ? 'rd' : 'th';
            return number + output;
        }
    });

    // Side effect imports
    utils_hooks__hooks.lang = deprecate('moment.lang is deprecated. Use moment.locale instead.', locale_locales__getSetGlobalLocale);
    utils_hooks__hooks.langData = deprecate('moment.langData is deprecated. Use moment.localeData instead.', locale_locales__getLocale);

    var mathAbs = Math.abs;

    function duration_abs__abs () {
        var data           = this._data;

        this._milliseconds = mathAbs(this._milliseconds);
        this._days         = mathAbs(this._days);
        this._months       = mathAbs(this._months);

        data.milliseconds  = mathAbs(data.milliseconds);
        data.seconds       = mathAbs(data.seconds);
        data.minutes       = mathAbs(data.minutes);
        data.hours         = mathAbs(data.hours);
        data.months        = mathAbs(data.months);
        data.years         = mathAbs(data.years);

        return this;
    }

    function duration_add_subtract__addSubtract (duration, input, value, direction) {
        var other = create__createDuration(input, value);

        duration._milliseconds += direction * other._milliseconds;
        duration._days         += direction * other._days;
        duration._months       += direction * other._months;

        return duration._bubble();
    }

    // supports only 2.0-style add(1, 's') or add(duration)
    function duration_add_subtract__add (input, value) {
        return duration_add_subtract__addSubtract(this, input, value, 1);
    }

    // supports only 2.0-style subtract(1, 's') or subtract(duration)
    function duration_add_subtract__subtract (input, value) {
        return duration_add_subtract__addSubtract(this, input, value, -1);
    }

    function bubble () {
        var milliseconds = this._milliseconds;
        var days         = this._days;
        var months       = this._months;
        var data         = this._data;
        var seconds, minutes, hours, years = 0;

        // The following code bubbles up values, see the tests for
        // examples of what that means.
        data.milliseconds = milliseconds % 1000;

        seconds           = absFloor(milliseconds / 1000);
        data.seconds      = seconds % 60;

        minutes           = absFloor(seconds / 60);
        data.minutes      = minutes % 60;

        hours             = absFloor(minutes / 60);
        data.hours        = hours % 24;

        days += absFloor(hours / 24);

        // Accurately convert days to years, assume start from year 0.
        years = absFloor(daysToYears(days));
        days -= absFloor(yearsToDays(years));

        // 30 days to a month
        // TODO (iskren): Use anchor date (like 1st Jan) to compute this.
        months += absFloor(days / 30);
        days   %= 30;

        // 12 months -> 1 year
        years  += absFloor(months / 12);
        months %= 12;

        data.days   = days;
        data.months = months;
        data.years  = years;

        return this;
    }

    function daysToYears (days) {
        // 400 years have 146097 days (taking into account leap year rules)
        return days * 400 / 146097;
    }

    function yearsToDays (years) {
        // years * 365 + absFloor(years / 4) -
        //     absFloor(years / 100) + absFloor(years / 400);
        return years * 146097 / 400;
    }

    function as (units) {
        var days;
        var months;
        var milliseconds = this._milliseconds;

        units = normalizeUnits(units);

        if (units === 'month' || units === 'year') {
            days   = this._days   + milliseconds / 864e5;
            months = this._months + daysToYears(days) * 12;
            return units === 'month' ? months : months / 12;
        } else {
            // handle milliseconds separately because of floating point math errors (issue #1867)
            days = this._days + Math.round(yearsToDays(this._months / 12));
            switch (units) {
                case 'week'   : return days / 7            + milliseconds / 6048e5;
                case 'day'    : return days                + milliseconds / 864e5;
                case 'hour'   : return days * 24           + milliseconds / 36e5;
                case 'minute' : return days * 24 * 60      + milliseconds / 6e4;
                case 'second' : return days * 24 * 60 * 60 + milliseconds / 1000;
                // Math.floor prevents floating point math errors here
                case 'millisecond': return Math.floor(days * 24 * 60 * 60 * 1000) + milliseconds;
                default: throw new Error('Unknown unit ' + units);
            }
        }
    }

    // TODO: Use this.as('ms')?
    function duration_as__valueOf () {
        return (
            this._milliseconds +
            this._days * 864e5 +
            (this._months % 12) * 2592e6 +
            toInt(this._months / 12) * 31536e6
        );
    }

    function makeAs (alias) {
        return function () {
            return this.as(alias);
        };
    }

    var asMilliseconds = makeAs('ms');
    var asSeconds      = makeAs('s');
    var asMinutes      = makeAs('m');
    var asHours        = makeAs('h');
    var asDays         = makeAs('d');
    var asWeeks        = makeAs('w');
    var asMonths       = makeAs('M');
    var asYears        = makeAs('y');

    function duration_get__get (units) {
        units = normalizeUnits(units);
        return this[units + 's']();
    }

    function makeGetter(name) {
        return function () {
            return this._data[name];
        };
    }

    var duration_get__milliseconds = makeGetter('milliseconds');
    var seconds      = makeGetter('seconds');
    var minutes      = makeGetter('minutes');
    var hours        = makeGetter('hours');
    var days         = makeGetter('days');
    var months       = makeGetter('months');
    var years        = makeGetter('years');

    function weeks () {
        return absFloor(this.days() / 7);
    }

    var round = Math.round;
    var thresholds = {
        s: 45,  // seconds to minute
        m: 45,  // minutes to hour
        h: 22,  // hours to day
        d: 26,  // days to month
        M: 11   // months to year
    };

    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
        return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
    }

    function duration_humanize__relativeTime (posNegDuration, withoutSuffix, locale) {
        var duration = create__createDuration(posNegDuration).abs();
        var seconds  = round(duration.as('s'));
        var minutes  = round(duration.as('m'));
        var hours    = round(duration.as('h'));
        var days     = round(duration.as('d'));
        var months   = round(duration.as('M'));
        var years    = round(duration.as('y'));

        var a = seconds < thresholds.s && ['s', seconds]  ||
                minutes === 1          && ['m']           ||
                minutes < thresholds.m && ['mm', minutes] ||
                hours   === 1          && ['h']           ||
                hours   < thresholds.h && ['hh', hours]   ||
                days    === 1          && ['d']           ||
                days    < thresholds.d && ['dd', days]    ||
                months  === 1          && ['M']           ||
                months  < thresholds.M && ['MM', months]  ||
                years   === 1          && ['y']           || ['yy', years];

        a[2] = withoutSuffix;
        a[3] = +posNegDuration > 0;
        a[4] = locale;
        return substituteTimeAgo.apply(null, a);
    }

    // This function allows you to set a threshold for relative time strings
    function duration_humanize__getSetRelativeTimeThreshold (threshold, limit) {
        if (thresholds[threshold] === undefined) {
            return false;
        }
        if (limit === undefined) {
            return thresholds[threshold];
        }
        thresholds[threshold] = limit;
        return true;
    }

    function humanize (withSuffix) {
        var locale = this.localeData();
        var output = duration_humanize__relativeTime(this, !withSuffix, locale);

        if (withSuffix) {
            output = locale.pastFuture(+this, output);
        }

        return locale.postformat(output);
    }

    var iso_string__abs = Math.abs;

    function iso_string__toISOString() {
        // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
        var Y = iso_string__abs(this.years());
        var M = iso_string__abs(this.months());
        var D = iso_string__abs(this.days());
        var h = iso_string__abs(this.hours());
        var m = iso_string__abs(this.minutes());
        var s = iso_string__abs(this.seconds() + this.milliseconds() / 1000);
        var total = this.asSeconds();

        if (!total) {
            // this is the same as C#'s (Noda) and python (isodate)...
            // but not other JS (goog.date)
            return 'P0D';
        }

        return (total < 0 ? '-' : '') +
            'P' +
            (Y ? Y + 'Y' : '') +
            (M ? M + 'M' : '') +
            (D ? D + 'D' : '') +
            ((h || m || s) ? 'T' : '') +
            (h ? h + 'H' : '') +
            (m ? m + 'M' : '') +
            (s ? s + 'S' : '');
    }

    var duration_prototype__proto = Duration.prototype;

    duration_prototype__proto.abs            = duration_abs__abs;
    duration_prototype__proto.add            = duration_add_subtract__add;
    duration_prototype__proto.subtract       = duration_add_subtract__subtract;
    duration_prototype__proto.as             = as;
    duration_prototype__proto.asMilliseconds = asMilliseconds;
    duration_prototype__proto.asSeconds      = asSeconds;
    duration_prototype__proto.asMinutes      = asMinutes;
    duration_prototype__proto.asHours        = asHours;
    duration_prototype__proto.asDays         = asDays;
    duration_prototype__proto.asWeeks        = asWeeks;
    duration_prototype__proto.asMonths       = asMonths;
    duration_prototype__proto.asYears        = asYears;
    duration_prototype__proto.valueOf        = duration_as__valueOf;
    duration_prototype__proto._bubble        = bubble;
    duration_prototype__proto.get            = duration_get__get;
    duration_prototype__proto.milliseconds   = duration_get__milliseconds;
    duration_prototype__proto.seconds        = seconds;
    duration_prototype__proto.minutes        = minutes;
    duration_prototype__proto.hours          = hours;
    duration_prototype__proto.days           = days;
    duration_prototype__proto.weeks          = weeks;
    duration_prototype__proto.months         = months;
    duration_prototype__proto.years          = years;
    duration_prototype__proto.humanize       = humanize;
    duration_prototype__proto.toISOString    = iso_string__toISOString;
    duration_prototype__proto.toString       = iso_string__toISOString;
    duration_prototype__proto.toJSON         = iso_string__toISOString;
    duration_prototype__proto.locale         = locale;
    duration_prototype__proto.localeData     = localeData;

    // Deprecations
    duration_prototype__proto.toIsoString = deprecate('toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)', iso_string__toISOString);
    duration_prototype__proto.lang = lang;

    // Side effect imports

    addFormatToken('X', 0, 0, 'unix');
    addFormatToken('x', 0, 0, 'valueOf');

    // PARSING

    addRegexToken('x', matchSigned);
    addRegexToken('X', matchTimestamp);
    addParseToken('X', function (input, array, config) {
        config._d = new Date(parseFloat(input, 10) * 1000);
    });
    addParseToken('x', function (input, array, config) {
        config._d = new Date(toInt(input));
    });

    // Side effect imports


    utils_hooks__hooks.version = '2.10.2';

    setHookCallback(local__createLocal);

    utils_hooks__hooks.fn                    = momentPrototype;
    utils_hooks__hooks.min                   = min;
    utils_hooks__hooks.max                   = max;
    utils_hooks__hooks.utc                   = create_utc__createUTC;
    utils_hooks__hooks.unix                  = moment__createUnix;
    utils_hooks__hooks.months                = lists__listMonths;
    utils_hooks__hooks.isDate                = isDate;
    utils_hooks__hooks.locale                = locale_locales__getSetGlobalLocale;
    utils_hooks__hooks.invalid               = valid__createInvalid;
    utils_hooks__hooks.duration              = create__createDuration;
    utils_hooks__hooks.isMoment              = isMoment;
    utils_hooks__hooks.weekdays              = lists__listWeekdays;
    utils_hooks__hooks.parseZone             = moment__createInZone;
    utils_hooks__hooks.localeData            = locale_locales__getLocale;
    utils_hooks__hooks.isDuration            = isDuration;
    utils_hooks__hooks.monthsShort           = lists__listMonthsShort;
    utils_hooks__hooks.weekdaysMin           = lists__listWeekdaysMin;
    utils_hooks__hooks.defineLocale          = defineLocale;
    utils_hooks__hooks.weekdaysShort         = lists__listWeekdaysShort;
    utils_hooks__hooks.normalizeUnits        = normalizeUnits;
    utils_hooks__hooks.relativeTimeThreshold = duration_humanize__getSetRelativeTimeThreshold;

    var _moment = utils_hooks__hooks;

    return _moment;

}));

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

cdb.admin.models = cdb.admin.models || {};

//===================================================
// histogram filter
//===================================================
cdb.admin.models.Filter = cdb.core.Model.extend({

  DEFAULT_HIST_BUCKETS: 100,
  urlRoot: '/api/v1/filters',

  initialize: function() {

    this.table = this.get('table');

    if (!this.table) {
      throw "Filter needs a table";
    }

    this.unset('table');

    this.table.bind('data:saved', function() {
      this._fetchHist();
    }, this);

    if(this.table.has('name') && this.table.has('schema')) {
      this._fetchHist();
    }
    this.table.bind('change:name change:schema', this._fetchHist, this);
    this.bind('destroy', function() {
      this.table.unbind('change:name change:schema', this._fetchHist, this);
    });
  },

  _fetchHist: function() {

    if (this.get("column_type") == 'date') this._fetchDateHist();
    else this._fetchNumericHist();

  },

  _fetchNumericHist: function() {
    var self = this;

    this.table.originalData().histogram(this.DEFAULT_HIST_BUCKETS, this.get('column'), function(hist, bounds) {

      if (hist) {
        self._changeHist(hist, bounds);
      } else {
        self.trigger('error', "numeric histogram couldn't be generated");
      }
    });

  },

  _fetchDateHist: function() {
    var self = this;

    this.table.originalData().date_histogram(this.DEFAULT_HIST_BUCKETS, this.get('column'), function(hist, bounds) {

      if (hist) {
        self._changeDateHist(hist, bounds);
      } else {
        self.trigger('error', "date histogram couldn't be generated");
      }
    });

  },

  _changeDateHist: function(hist, bounds) {

    var previousBounds = this.get('bounds');

    this.set('hist',   hist,   { silent: true });
    this.set('bounds', bounds, { silent: true });

    if (!this.has('lower')) {

      var per_bar = bounds.bucket_size;

      bounds.lower = Math.round(bounds.lower * 1000);
      bounds.upper = Math.round(bounds.upper * 1000);

      this.set({
        'bucket_size': per_bar,
        'lower': bounds.lower,
        'upper': bounds.upper,
        'lower_limit': bounds.lower,
        'upper_limit': bounds.upper,
        'tz': bounds.tz
      });

    } else {

      var lower = Math.max(bounds.lower * 1000, this.get("lower"));
      var upper = Math.min(bounds.upper * 1000, this.get("upper"));

      // Bounds have changed
      if (previousBounds) {

        // Bounds have been expanded on the upper side
        if (bounds.upper > previousBounds.upper) {
          upper = bounds.upper * 1000;
        }

        // Bounds have been expanded on the lower side
        if (bounds.lower < previousBounds.lower) {
          lower = bounds.lower * 1000;
        }
      }

      if (_.isNaN(lower) || _.isNaN(upper)) {
        lower = bounds.lower * 1000;
        upper = bounds.upper * 1000;
      }

      this.set({
        'lower': lower,
        'upper': upper,
        'lower_limit': bounds.lower * 1000,
        'upper_limit': bounds.upper * 1000,
        'tz': bounds.tz
      });

    }

  },

  _changeHist: function(hist, bounds) {

    var previousBounds = this.get('bounds');

    this.set('hist', hist, { silent: true });
    this.set('bounds', bounds, { silent: true });

    if (!this.has('lower')) {

      // calculate limits based on partitions
      var per_bar  = bounds.bucket_size;

      bounds.upper = per_bar * Math.ceil(bounds.upper/per_bar);

        this.set({
          'bucket_size': per_bar,
          'lower': bounds.lower,
          'upper': bounds.upper,
          'lower_limit': bounds.lower,
          'upper_limit': bounds.upper
        });

    } else {

      var upper = Math.min(bounds.upper, this.get('upper'));
      var lower = Math.max(bounds.lower, this.get('lower'));

      // Bounds have changed
      if (previousBounds) {

        // Bounds have been expanded on the upper side
        if (bounds.upper > previousBounds.upper) {
          upper = bounds.upper;
        }

        // Bounds have been expanded on the lower side
        if (bounds.lower < previousBounds.lower) {
          lower = bounds.lower;
        }
      }

      this.set({
        'lower': lower,
        'upper': upper,
        'lower_limit': bounds.lower,
        'upper_limit': bounds.upper
      });

    }

  },

  _getDateFromTimestamp: function(timestamp) {
    return new Date(timestamp);
  },

  interpolate: function(t) {
    var a = this.get('lower_limit');
    var b = this.get('upper_limit');
    return (1 - t)*a + t*b;
  },

  fitToBucket: function(value) {
    var b = this.get('bucket_size');
    if (!b) return 0;
    return b*Math.floor(value/b);
  },

  getSQLCondition: function() {

    if (this.attributes.column_type == 'date') return this.getSQLConditionForDate();
    else return this.getSQLConditionForNumber();

  },

  /**
   *  Extracts the timezone from a date
   */
  _getTimeZone: function(date) {
    if (date) {
      return new Date(date).getTimezoneOffset()
    }
    return 0;
  },

  getSQLConditionForDate: function() {

    var lower = this.get("lower");
    var upper = this.get("upper");

    if (_.isNaN(lower) || _.isNaN(upper) || lower == undefined || upper == undefined) return null;

    var lowerDateWithOffset = moment(lower).format("YYYY-MM-DDTHH:mm:ssZ").toString();
    var upperDateWithOffset = moment(upper).format("YYYY-MM-DDTHH:mm:ssZ").toString();

    var attributes = _.clone(this.attributes);

    var options, sql;

    if (this.get('upper') >= this.get('upper_limit')) {
      options = _.extend(attributes, {
        lower: lowerDateWithOffset,
        upper: moment(this.get('upper_limit')).format("YYYY-MM-DDTHH:mm:ssZ").toString()
      });
      sql = _.template(" (<%= column %> >= ('<%= lower %>') AND <%= column %> <= ('<%= upper %>')) ")(options);

    } else {

      options = _.extend(attributes, { lower: lowerDateWithOffset, upper: upperDateWithOffset});
      sql = _.template(" (<%= column %> >= ('<%= lower %>') AND <%= column %> <= ('<%= upper %>')) ")(options);

    }

    return sql;

  },

  getSQLConditionForNumber: function() {
    if (!this.attributes.lower && !this.attributes.upper) return _.template(" (<%= column %> IS NULL) ")(this.attributes);
    if (this.attributes.upper >= this.attributes.upper_limit) return _.template(" (<%= column %> >= <%= lower %> AND <%= column %> <= <%= upper %>) ")(this.attributes);
    return _.template(" (<%= column %> >= <%= lower %> AND <%= column %> < <%= upper %>) ")(this.attributes);
  },

  toJSON: function() {

    return {
      column: this.get('column'),
      upper:  this.get('upper'),
      lower:  this.get('lower'),
      tz:     this.get('tz'),
      column_type:   this.get('column_type')
    }
  }

});

//===================================================
// discrete filter for text columns
//===================================================
cdb.admin.models.FilterDiscrete = cdb.core.Model.extend({

  DEFAULT_HIST_BUCKETS: 65,
  urlRoot: '/api/v1/filters',

  defaults: {
    list_view: true
  },

  initialize: function() {

    this.table = this.get('table');
    this.items = new Backbone.Collection();

    if (this.get('items')) {
      this.items.reset(this.get('items'));
    }

    if (!this.table) {
      throw "Filter needs a table";
    }

    this.unset('table');

    this.table.bind('data:saved', function() {
      this._fetchHist();
    }, this);

    this.items.bind('change', function() {
      this.trigger('change', this)
      this.trigger('change:items', this, this.items);
    }, this);

    this._fetchHist();

  },

  _fetchHist: function() {
    var self = this;

    this.table.originalData().discreteHistogram(this.DEFAULT_HIST_BUCKETS, this.get('column'), function(hist) {

      if (hist) {
        self._updateHist(hist);
      } else {
        self.trigger('error', "Histogram couldn't be generated");
      }

    });
  },

  _updateHist: function(hist) {

    for (var i = 0; i < hist.rows.length; ++i) {

      var o = this.items.where({ bucket: hist.rows[i].bucket})

        if (o.length) {
          hist.rows[i].selected = o[0].get('selected')
        } else {
          hist.rows[i].selected = true;
        }

    }

    this.set("reached_limit", hist.reached_limit);
    this.items.reset(hist.rows);

  },

  _sanitize: function(s) {
    if (s) {
      return s.replace(/'/g, "''");
    }

    return s;
  },

  getSQLCondition: function() {

    if (this.get("column_type") == 'boolean') return this.getSQLConditionForBoolean();
    else return this.getSQLConditionForString();

  },

  getSQLConditionForBoolean: function() {

    if (this.items.size() === 0) { // if there aren't any items…
      return ' (true) ';
    }

    // Make some lists of values
    var selected_items            = this.items.filter(function(i) { return i.get('selected'); });
    var true_false_selected_items = this.items.filter(function(i) { return i.get('bucket') != null && i.get('selected'); });
    var null_selected_items       = this.items.filter(function(i) { return i.get('bucket') == null && i.get('selected'); });

    if (selected_items.length > 0 && null_selected_items.length == 0) { // there are just true or false values

      return _.template("<%= column %> IN (<%= opts %>) ")({
        column: this.get('column'),
             opts: true_false_selected_items.map(function(i) {
               return i.get("bucket");
             }).join(',')
      });

    }

    if (selected_items.length == 1 && null_selected_items.length == 1) { // only null values

      return _.template("<%= column %> IS NULL ")({
        column: this.get('column')
      });

    }

    if (selected_items.length > 0) {

      return _.template("<%= column %> IN (<%= opts %>) OR <%= column %> IS NULL ")({ // all kinds of values
        column: this.get('column'),
             opts: true_false_selected_items.map(function(i) {
               return i.get("bucket");
             }).join(',')
      });

    }

    return _.template("<%= column %> IN (NULL) ")({ // there aren't any selected values
      column: this.get('column'),
    });


  },

  _containsNull: function(items) {

    var containsNull = false;

    _.each(items, function(bucket) {
      if (!bucket.get("bucket")) containsNull = true;
    });

    return containsNull;

  },

  _nullIsNotSelected: function(origin, destiny) {
    var difference = _.difference(origin, destiny);

    var nullIsNotSelected = false;

    _.each(difference, function(bucket) {
      if (!bucket.get("selected") && !bucket.get("bucket")) nullIsNotSelected = true;
    });

    return nullIsNotSelected;

  },

  getSQLConditionForString: function() {

    var that = this;

    // If the user entered text…
    if (!this.get("list_view")) {

      if (this.get("free_text")) {

        var text = this._sanitize(this.get("free_text"));

        return _.template("<%= column %> ILIKE '%<%= t %>%' ")({
          column: this.get('column'),
               t: text
        });

      } else {
        return ' (true) ';
      }

    }

    // If there aren't any items…
    if (this.items.size() === 0) {
      return ' (true) ';
    }

    // If there are some items, first get the selected ones…
    var items = this.items.filter(function(i) {
      return i.get('selected');
    });

    // If there are selected items…
    if (items.length > 0) {

      var selected = items.filter(function(i) { return i.get('selected'); });

      if (items.length == this.items.length) {

        return _.template(" (true) ")({
          column: this.get('column'),
          opts: items.map(function(i) {
            var bucket = that._sanitize(i.get('bucket'));
            return "'" + bucket + "'";
          }).join(',')
        });

      } else {

        var query = "<%= column %> IN (<%= opts %>) ";

        if (this._nullIsNotSelected(this.items.models, items)) {
          query = "<%= column %> IN (<%= opts %>) AND <%= column %> IS NOT NULL "
        } else if (this._containsNull(items)) {
          query = "<%= column %> IN (<%= opts %>) OR <%= column %> IS NULL ";
        }

        return _.template(query)({
          column: this.get('column'),
          opts: items.map(function(i) {
            var bucket = that._sanitize(i.get('bucket'));

            return "'" + bucket + "'";
          }).join(',')
        });

      }

    } else { // if there's no selected element…

      return ' (true) '; // this will remove the 'WHERE' condition

    }

    // If there aren't selected items
    return "true ";

  },

  toJSON: function() {
    return {
      reached_limit: this.get("reached_limit"),
      column:        this.get('column'),
      items:         this.items.toJSON(),
      free_text:     this.get("free_text"),
      list_view:     this.get("list_view"),
      column_type:   this.get('column_type')
    }
  }
});

//===================================================
// filters collection
//===================================================
cdb.admin.models.Filters = Backbone.Collection.extend({

  model: function(attrs, options) {

    var self = options.collection;
    var col  = attrs.column;

    var schema = self.table.get("original_schema") ? "original_schema": "schema";

    var column_type = self.table.getColumnType(col, schema) || attrs.column_type;
    var FilterClass = self._getFilterModelforColumnType(column_type);

    return new FilterClass(_.extend(attrs, {
      column_type: column_type,
      table: self.table
    }));

  },

  initialize: function(m, options) {
    if (!options.table) {
      throw "Filters need a table";
    }
    this.table = options.table;
  },

  getSQLCondition: function() {

    var sqls = this.map(function(f) {
      return f.getSQLCondition();
    })

    var sql = _(sqls).compact().join(' AND ');

    return sql;
  },

  removeFilters: function() {
    while(this.size()) {
      this.at(0).destroy();
    }
  },

  _getFilterModelforColumnType: function(columnType) {
    if (columnType == 'number' || columnType == 'date') {
      return cdb.admin.models.Filter;
    } else {
      return cdb.admin.models.FilterDiscrete
    }
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

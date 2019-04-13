(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var BaseDialog = require('../../views/base_dialog/view');
var randomQuote = require('../../view_helpers/random_quote');

/**
 * Lock/unlock datasets/maps dialog.
 */
module.exports = BaseDialog.extend({

  events: BaseDialog.extendEvents({
    'click .js-ok': '_confirm',
    'click .js-download': '_download',
    'click .js-cancel': '_abortExport'
  }),

  initialize: function (attrs) {
    this.elder('initialize');

    this._initBinds();
  },

  render_content: function () {
    var state = this.model.get('state');

    if (state === 'complete') {
      var w = window.open(this.model.get('url'));

      // If w is undefined, popup was blocked: we show a "click to download" modal. Else, download has started.
      if (w === undefined) return cdb.templates.getTemplate('common/dialogs/export_map/templates/download');

      w.focus();
      this.close();
    } else if (state === 'failure') {
      return cdb.templates.getTemplate('common/templates/fail')({
        msg: 'Export has failed'
      });
    } else if (state === 'pending' || state === 'exporting' || state === 'uploading') {
      var loadingTitle = state.charAt(0).toUpperCase() + state.slice(1) + ' ...';

      return this.getTemplate('common/templates/loading')({
        title: loadingTitle,
        quote: randomQuote()
      });
    } else {
      return cdb.templates.getTemplate('common/dialogs/export_map/templates/confirm');
    }
  },

  _confirm: function () {
    this.model.requestExport();
  },

  _download: function () {
    window.open(this.model.get('url'));
    window.focus();

    this.close();
  },

  _abortExport: function () {
    this.model.cancelExport();
    this.close();
  },

  _initBinds: function () {
    this.model.bind('change:state', function () { this.render(); }, this);
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../view_helpers/random_quote":2,"../../views/base_dialog/view":3}],2:[function(require,module,exports){
/**
 * Random quote
 */
module.exports = function() {

  var template  = _.template('<p class="CDB-Text CDB-Size-medium u-altTextColor">"<%= quote %>"</p><% if (author) { %><p class="CDB-Text CDB-Size-medium u-altTextColor u-tSpace"><em>– <%- author %></em></p><% } %>');

  var quotes = [
    { quote: "Geographers never get lost. They just do accidental field work.", author: "Nicholas Chrisman" },
    { quote: "Geography is just physics slowed down, with a couple of trees stuck in it.", author: "Terry Pratchett" },
    { quote: "Not all those who wander are lost.", author: "J. R. R. Tolkien" },
    { quote: "In that Empire, the Art of Cartography attained such Perfection that the map of a single Province occupied the entirety of a City.", author: "Jorge Luis Borges" },
    { quote: "X marks the spot", author: "Indiana Jones" },
    { quote: "It's turtles all the way down.", author: null },
    { quote: "Remember: no matter where you go, there you are.", author: null },
    { quote: "Without geography, you're nowhere!", author: "Jimmy Buffett" },
    { quote: "our earth is a globe / whose surface we probe /<br />no map can replace her / but just try to trace her", author: "Steve Waterman" },
    { quote: "Everything happens somewhere.", author: "Doctor Who" },
    { quote: "A map is the greatest of all epic poems. Its lines and colors show the realization of great dreams.", author: "Gilbert H. Grosvenor" },
    { quote: "Everything is related to everything else,<br />but near things are more related than distant things.", author: "Tobler's first law of geography" },
    { quote: "Hic Sunt Dracones", author: null },
    { quote: "Here be dragons", author: null },
    { quote: "Stand in the place where you live / Now face North /<br/>Think about direction / Wonder why you haven't before", author: "R.E.M" },
    { quote: "The virtue of maps, they show what can be done with limited space, they foresee that everything can happen therein.", author: "José Saramago" }
  ];

  var r = Math.round(Math.random() * (quotes.length - 1));

  return template(quotes[r]);
};

},{}],3:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);

var BaseDialog = cdb.ui.common.Dialog;

/**
 * Abstract view for a dialog, a kind of view that takes up the full screen overlaying any previous content.
 *
 * To be extended for a specific use-case.
 * It inherits from CartoDB.js' Dialog view so has some particular behavior/convention of how to be used, see example
 *
 * Example of how to use:
 *   // Extend this view
 *   var MyDialog = BaseDialog.extend({
 *     render_content: function() {
 *       return 'Hello world!';
 *     }
 *   });
 *
 *   // Create instance object.
 *   var dialog = new MyDialog();
 *
 *   // To render & show initially (only to be called once):
 *   dialog.appendToBody();
 */
module.exports = BaseDialog.extend({

  className: 'Dialog is-opening',

  overrideDefaults: {
    template_name: 'common/views/base_dialog/template',
    triggerDialogEvents: true
  },

  initialize: function() {
    // Override defaults of parent
    _.defaults(this.options, this.overrideDefaults);
    this.elder('initialize');
    this.bind('show', this._setBodyForDialogMode.bind(this, 'add'));
    this.bind('hide', this._setBodyForDialogMode.bind(this, 'remove'));
  },

  show: function() {
    BaseDialog.prototype.show.apply(this, arguments);
    this.trigger('show');
    if (this.options.triggerDialogEvents) {
      cdb.god.trigger('dialogOpened');
    }
    this.$el.removeClass('is-closing');

    // Blur current element (e.g. a <a> tag that was clicked to open this window)
    if (document.activeElement) {
      document.activeElement.blur();
    }
  },

  render: function() {
    BaseDialog.prototype.render.apply(this, arguments);
    this.$('.content').addClass('is-newContent');

    if (this._isSticky()) {
      this.$el.addClass('is-sticky');
    }

    this.show();
    return this;
  },

  _isSticky: function() {
    return this.options && this.options.sticky;
  },

  close: function() {
    this._cancel(undefined, true);
  },

  /**
   * @override cdb.ui.common.Dialog.prototype.open for animated opening
   */
  open: function() {
    BaseDialog.prototype.open.apply(this, arguments);
    this.show();
  },

  /**
   * @override cdb.ui.common.Dialog.prototype.hide to implement animation
   */
  hide: function() {
    BaseDialog.prototype.hide.apply(this, arguments);
    this.trigger('hide');
  },

  /**
   * @override cdb.ui.common.Dialog.prototype._cancel to implement animation upon closing the dialog and to handle hide event.
   */
  _cancel: function(ev, skipCancelCallback) {
    if (ev) this.killEvent(ev);

    if (this._isSticky()) {
      return;
    }

    this.$el.removeClass('is-opening').addClass('is-closing');

    // Use timeout instead of event listener on animation since the event triggered differs depending on browser
    // Timing won't perhaps be 100% accurate but it's good enough
    // The timeout should match the .Dialog.is-closing animation duration.
    var self = this;
    setTimeout(function() {
      // from original _cancel
      if (self.cancel && !skipCancelCallback) {
        self.cancel();
      }
      BaseDialog.prototype.hide.call(self);
    }, 80); //ms

    // Trigger events immediately, don't wait for the timeout above
    this.trigger('hide');
    if (this.options.triggerDialogEvents) {
      cdb.god.trigger('dialogClosed');
    }
  },

  /**
   * @override cdb.ui.common.Dialog.prototype._ok to not hide dialog by default if there's an ok method defined.
   */
  _ok: function(ev) {
    this.killEvent(ev);
    if (this.ok) {
      this.ok();
    } else {
      this.close();
    }
  },

  _setBodyForDialogMode: function(action) {
    $('body')[action + 'Class']('is-inDialog');
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],4:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);

/**
 * Responsible for likes (♥ 123) and its toggling behaviour.
 */
module.exports = cdb.core.View.extend({
  tagName: 'a',

  events: {
    'click': '_toggleLike'
  },

  initialize: function() {
    this.template = cdb.templates.getTemplate('common/views/likes/template');
    this.model.bind('change:likeable change:liked change:likes error', this.render, this);
  },

  render: function() {
    this.$el.html(
      this.template({
        likes: this.model.get("likes"),
        size: this.model.get("size"),
        show_count: this.model.get("show_count"),
        show_label: this.model.get("show_label")
      })
    )
    .attr({
      class: this._classNames(),
      href: this._hrefLocation()
    });

    return this;
  },

  _hrefLocation: function() {
    var href = "#/like";

    if (!this.model.get('likeable')) {
      href = window.login_url;
    }

    return href;
  },

  _classNames: function() {
    var classNames = ['LikesIndicator'];

    if (this.model.get('likeable')) {
      classNames.push('is-likeable');
    }

    if (this.model.get('liked')) {
      classNames.push('is-liked');
    }

    if (this._animate) {
      classNames.push('is-animated');
      this.$el.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
        // unset animate and force re-render to avoid race conditions
        this._animate = false;
        this.render();
      }.bind(this));
    }

    return classNames.join(' ');
  },

  _toggleLike: function(ev) {
    if (this.model.get('likeable')) {
      this.killEvent(ev);

      this._animate = true;
      this.model.toggleLiked();
    }
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],5:[function(require,module,exports){
(function (global){
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);

/**
 *  MapCard previews
 *
 */

module.exports = cdb.core.View.extend({

  options: {
    width: 300,
    height: 170,
    privacy: 'PUBLIC',
    username: '',
    visId: '',
    mapsApiResource: '',
    className: '',
    authTokens: []
  },

  _TEMPLATES: {
    // Using <%= %> instead of <%- %> because if not / characters (for example) will be escaped
    regular: '<%- protocol %>://<%= mapsApiResource %>/api/v1/map/static/named/<%- tpl %>/<%- width %>/<%- height %>.png<%= authTokens %>',
    cdn: '<%- protocol %>://<%- cdn %>/<%- username %>/api/v1/map/static/named/<%- tpl %>/<%- width %>/<%- height %>.png<%= authTokens %>'
  },

  initialize: function() {
    _.each(['visId', 'mapsApiResource', 'username'], function(name) {
      if (!this.options[name]) {
        console.log(name + ' is required for Static Map instantiation');
      }
    }, this);
  },

  load: function() {
    this._startLoader();
    this._loadFromVisId();

    return this;
  },

  _generateImageTemplate: function() {
    return 'tpl_' + this.options.visId.replace(/-/g, '_');
  },

  _loadFromVisId: function() {
    var protocol = this._isHTTPS() ? 'https': 'http';
    var cdnConfig = cdb.config.get('cdn_url');
    var template = _.template(cdnConfig ? this._TEMPLATES['cdn'] : this._TEMPLATES['regular']);

    var options = {
      protocol: protocol,
      username: this.options.username,
      mapsApiResource: this.options.mapsApiResource,
      tpl: this._generateImageTemplate(),
      width: this.options.width,
      height: this.options.height,
      authTokens: this._generateAuthTokensParams()
    };

    if (cdnConfig) {
      options = _.extend(options, { cdn: cdnConfig[protocol] });
    }

    var url = template(options);

    this._loadImage({}, url);
  },

  _generateAuthTokensParams: function () {
    var authTokens = this.options.authTokens;
    if (authTokens && authTokens.length > 0) {
      return '?' + _.map(authTokens, function (t) { return 'auth_token=' + t; }).join('&');
    } else {
      return '';
    }
  },

  _isHTTPS: function() {
    return location.protocol.indexOf("https") === 0;
  },

  loadURL: function(url) {
    var $img = $('<img class="MapCard-preview" src="' + url + '" />');
    this.$el.append($img);

    if (this.options.className) {
      $img.addClass(this.options.className);
    }

    $img.fadeIn(250);
  },

  showError: function() {
    this._onError();
  },

  _startLoader: function() {
    this.$el.addClass("is-loading");
  },

  _stopLoader: function() {
    this.$el.removeClass("is-loading");
  },

  _onSuccess: function(url) {
    this._stopLoader();
    this.loadURL(url);
    this.trigger("loaded", url);
  },

  _onError: function(error) {
    this._stopLoader();
    this.$el.addClass("has-error");
    var $error = $('<div class="MapCard-error" />');
    this.$el.append($error);
    $error.fadeIn(250);
    this.trigger("error");
  },

  _loadImage: function(error, url) {
    var self = this;
    var img  = new Image();

    img.onerror = function() {
      self._onError(error);
    };

    img.onload = function() {
      self._onSuccess(url);
    };

    try {
      img.src = url;
    } catch(err) {
      this._onError(err);
    }
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],6:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
cdb.admin = (typeof window !== "undefined" ? window['cdb']['admin'] : typeof global !== "undefined" ? global['cdb']['admin'] : null);
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);

/**
 * The content of the dropdown menu opened by the industries link in the header, e.g.:
 *   CartoDB, Industries, Explore, Pricing
 *             ______/\____
 *            |            |
 *            |    this    |
 *            |____________|
 */
module.exports = cdb.admin.DropdownMenu.extend({
  className: 'CDB-Text Dropdown Dropdown--public',

  initialize: function() {
    this.elder('initialize');
    this.template_base = cdb.templates.getTemplate('public_common/user_industries/dropdown_template');

    // Necessary to hide dialog on click outside popup, for example.
    cdb.god.bind('closeDialogs', this.hide, this);
  },

  render: function() {
    this.$el.html(this.template_base());

    // TODO: taken from existing code, how should dropdowns really be added to the DOM?
    $('body').append(this.el);

    return this;
  },

  clean: function() {
    // Until https://github.com/CartoDB/cartodb.js/issues/238 is resolved:
    $(this.options.target).unbind('click', this._handleClick);
    this.constructor.__super__.clean.apply(this);
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],7:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var IndustriesDropdown = require('./user_industries/dropdown_view');
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);

/**
 * View to render the user industries section in the header.
 * Expected to be created from existing DOM element.
 */
module.exports = cdb.core.View.extend({

  events: {
    'click .js-dropdown-target': '_createDropdown'
  },

  _createDropdown: function(ev) {
    this.killEvent(ev);
    cdb.god.trigger('closeDialogs');

    var view = new IndustriesDropdown({
      target: $(ev.target),
      vertical_offset: -10,
      horizontal_offset: $(ev.target).width()-100,
      horizontal_position: 'left',
      tick: 'center'
    });
    view.render();

    view.on('onDropdownHidden', function() {
      view.clean();
    }, this);

    view.open();
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./user_industries/dropdown_view":6}],8:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);

/**
 * View to interact with the share buttons in the content.
 *
 * - Twitter code from https://dev.twitter.com/web/intents
 *
 */
module.exports = cdb.core.View.extend({

  events: {
    'click .js-Navmenu-editLink--more': '_onClickMoreLink'
  },

  initialize: function() {
    this.$metaList = this.$('.js-PublicMap-metaList--mobile');
    this.$moreLink = this.$('.js-Navmenu-editLink--more');

    this.model.on("change:active", this._toggleMeta, this);
  },

  _onClickMoreLink: function(e) {
    this.model.set('active', !this.model.get('active'));
  },

  _toggleMeta: function() {
    if (this.model.get('active')) {
      this.$moreLink.html('Less info');
      this.$metaList.slideDown(250);
    } else {
      this.$moreLink.html('More info');
      this.$metaList.slideUp(250);
    }
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],9:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
cdb.admin = (typeof window !== "undefined" ? window['cdb']['admin'] : typeof global !== "undefined" ? global['cdb']['admin'] : null);
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);

/**
 * The content of the dropdown menu opened by the user avatar in the top-right of the header, e.g.:
 *   Explore, Learn, ♞
 *             ______/\____
 *            |            |
 *            |    this    |
 *            |____________|
 */
module.exports = cdb.admin.DropdownMenu.extend({
  className: 'CDB-Text Dropdown',

  initialize: function() {
    this.elder('initialize');
    this.template_base = cdb.templates.getTemplate('public_common/user_settings/dropdown_template');

    // Necessary to hide dialog on click outside popup, for example.
    cdb.god.bind('closeDialogs', this.hide, this);
  },

  render: function() {
    var user = this.model;
    var userUrl = user.viewUrl();

    this.$el.html(this.template_base({
      name: user.get('name') || user.get('username'),
      email: user.get('email'),
      isOrgOwner: user.isOrgOwner(),
      dashboardUrl: userUrl.dashboard(),
      publicProfileUrl: userUrl.publicProfile(),
      accountSettingsUrl: userUrl.accountSettings(),
      logoutUrl: userUrl.logout()
    }));

    // TODO: taken from existing code, how should dropdowns really be added to the DOM?
    $('body').append(this.el);

    return this;
  },

  clean: function() {
    // Until https://github.com/CartoDB/cartodb.js/issues/238 is resolved:
    $(this.options.target).unbind('click', this._handleClick);
    this.constructor.__super__.clean.apply(this);
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],10:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var SettingsDropdown = require('./user_settings/dropdown_view');
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);

/**
 * View to render the user settings section in the header.
 * Expected to be created from existing DOM element.
 */
module.exports = cdb.core.View.extend({

  events: {
    'click .js-dropdown-target': '_createDropdown'
  },

  render: function() {
    var dashboardUrl = this.model.viewUrl().dashboard();
    var datasetsUrl = dashboardUrl.datasets();
    var mapsUrl = dashboardUrl.maps();

    this.$el.html(
      cdb.templates.getTemplate('public_common/user_settings_template')({
        avatarUrl: this.model.get('avatar_url'),
        mapsUrl: mapsUrl,
        datasetsUrl: datasetsUrl
      })
    );

    return this;
  },

  _createDropdown: function(ev) {
    this.killEvent(ev);
    cdb.god.trigger('closeDialogs');

    var view = new SettingsDropdown({
      target: $(ev.target),
      model: this.model, // user
      horizontal_offset: 18
    });
    view.render();

    view.on('onDropdownHidden', function() {
      view.clean();
    }, this);

    view.open();
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./user_settings/dropdown_view":9}],11:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);

/**
 * View to interact with the share buttons in the content.
 *
 * - Twitter code from https://dev.twitter.com/web/intents
 *
 */
module.exports = cdb.core.View.extend({

  events: {
    'click .js-Navmenu-shareLink': '_onClickShareLink',
    'click .js-Navmenu-closeLink': '_onClickCloseLink',
    'click .js-Navmenu-link--facebook': '_onClickFacebookLink',
    'click .js-Navmenu-link--linkedin': '_onClickLinkedinLink'
  },

  initialize: function() {
    this.$shareList = $('.js-Navmenu-shareList');

    this.model.on("change:active", this._toggleShare, this);

    this._initBindings();
  },

  _initBindings: function() {
    if (window.__twitterIntentHandler) return;
   
    if (document.addEventListener) {
      document.addEventListener('click', this._handleIntent, false);
    } else if (document.attachEvent) {
      document.attachEvent('onclick', this._handleIntent);
    }
    window.__twitterIntentHandler = true;
  },

  _onClickLinkedinLink: function(e) {
    var href = $(e.target).closest('a').attr('href'),
        m, left, top;

    var windowOptions = 'scrollbars=yes,resizable=yes,toolbar=no,location=yes',
        width = 550,
        height = 420,
        winHeight = screen.height,
        winWidth = screen.width;

    left = Math.round((winWidth / 2) - (width / 2));
    top = 0;

    if (winHeight > height) {
      top = Math.round((winHeight / 2) - (height / 2));
      console.log(top);
    }
    
    window.open(href, 'facebook', windowOptions + ',width=' + width +
                                       ',height=' + height + ',left=' + left + ',top=' + top);

    e.returnValue = false;
    e.preventDefault && e.preventDefault();
  },

  _onClickFacebookLink: function(e) {
    var href = $(e.target).closest('a').attr('href'),
        m, left, top;

    var windowOptions = 'scrollbars=yes,resizable=yes,toolbar=no,location=yes',
        width = 550,
        height = 420,
        winHeight = screen.height,
        winWidth = screen.width;

    left = Math.round((winWidth / 2) - (width / 2));
    top = 0;

    if (winHeight > height) {
      top = Math.round((winHeight / 2) - (height / 2));
      console.log(top);
    }
    
    window.open(href, 'facebook', windowOptions + ',width=' + width +
                                       ',height=' + height + ',left=' + left + ',top=' + top);

    e.returnValue = false;
    e.preventDefault && e.preventDefault();
  },

  _handleIntent: function(e) {
    e = e || window.event;
    var target = e.target || e.srcElement,
        m, left, top;
 
    while (target && target.nodeName.toLowerCase() !== 'a') {
      target = target.parentNode;
    }
 
    if (target && target.nodeName.toLowerCase() === 'a' && target.href) {
      var intentRegex = /twitter\.com(\:\d{2,4})?\/intent\/(\w+)/,
          windowOptions = 'scrollbars=yes,resizable=yes,toolbar=no,location=yes',
          width = 550,
          height = 420,
          winHeight = screen.height,
          winWidth = screen.width;

      m = target.href.match(intentRegex);
      if (m) {
        left = Math.round((winWidth / 2) - (width / 2));
        top = 0;
 
        if (winHeight > height) {
          top = Math.round((winHeight / 2) - (height / 2));
        }
 
        window.open(target.href, 'intent', windowOptions + ',width=' + width +
                                           ',height=' + height + ',left=' + left + ',top=' + top);
        e.returnValue = false;
        e.preventDefault && e.preventDefault();
      }
    }
  },

  close: function() {
    this.model.set('active', false);
  },

  _onClickShareLink: function(e) {
    this.killEvent(e);

    this.model.set('active', !this.model.get('active'));
  },

  _onClickCloseLink: function(e) {
    this.close();
  },

  _toggleShare: function() {
    if (this.model.get('active')) {
      this.$shareList.addClass('is-active');
    } else {
      this.$shareList.removeClass('is-active');
    }
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],12:[function(require,module,exports){
(function (global){
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var UserSettingsView = require('../public_common/user_settings_view');
var UserIndustriesView = require('../public_common/user_industries_view');
var PublicMapWindow = require('./public_map_window');
var MapCardPreview = require('../common/views/mapcard_preview');
var LikeView = require('../common/views/likes/view');
var UserShareView = require('../public_common/user_share_view');
var UserMetaView = require('../public_common/user_meta_view');

$(function() {

  // No attributions and no links in this map (at least from cartodb)
  cartodb.config.set({
    cartodb_attributions: "",
    cartodb_logo_link: ""
  });

  $.extend( $.easing, {
    easeInQuad: function (x, t, b, c, d) {
      return c*(t/=d)*t + b;
    }
  });

  cdb.init(function() {
    cdb.templates.namespace = 'cartodb/';
    cdb.config.set(window.config);
    cdb.config.set('url_prefix', window.base_url);

    var userIndustriesView = new UserIndustriesView({
      el: $('.js-user-industries'),
    });

    var userShareView = new UserShareView({
      el: $('.js-Navmenu-share'),
      model: new cdb.core.Model({
        active: false
      })
    });

    var userMetaView = new UserMetaView({
      el: $('.js-user-meta'),
      model: new cdb.core.Model({
        active: false
      })
    });

    $(document.body).bind('click', function() {
      cdb.god.trigger('closeDialogs');
      userShareView.close();
    });

    var authenticatedUser = new cdb.open.AuthenticatedUser();
    authenticatedUser.bind('change', function() {
      if (authenticatedUser.get('username')) {
        var user = new cdb.admin.User(authenticatedUser.attributes);
        var userSettingsView = new UserSettingsView({
          el: $('.js-user-settings'),
          model: user
        });
        userSettingsView.render();

        if (user.get('username') === window.owner_username) {
          // Show "Edit in CartoDB" button if logged user
          // is the map owner ;)
          $('.js-Navmenu-editLink').addClass('is-active');
        }
      }
    });

    // Vis likes
    $('.js-likes').each(function() {
      var likeModel = cdb.admin.Like.newByVisData({
        likeable: false,
        vis_id: $(this).data('vis-id'),
        likes: $(this).data('likes-count'),
        size: $(this).data('likes-size')
      });
      authenticatedUser.bind('change', function() {
        if (authenticatedUser.get('username')) {
          likeModel.bind('loadModelCompleted', function() {
            likeModel.set('likeable', true);
          });
          likeModel.fetch();
        }
      });
      var likeView = new LikeView({
        el: this,
        model: likeModel
      });
      likeView.render();
    });

    // More user vis cards
    $('.MapCard').each(function() {
      var visId = $(this).data('visId');
      if (visId) {
        var username = $(this).data('visOwnerName');
        var mapCardPreview = new MapCardPreview({
          el: $(this).find('.js-header'),
          visId: $(this).data('visId'),
          username: username,
          mapsApiResource: cdb.config.getMapsResourceName(username)
        });
        mapCardPreview.load();
      }
    });

    // Check if device is a mobile
    var mobileDevice = /Android|webOS|iPad|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // Window view
    var public_window = new PublicMapWindow({
      el:                   window,
      user_name:            user_name,
      owner_username:       owner_username,
      vis_id:               vis_id,
      vis_name:             vis_name,
      vizdata:              vizdata,
      config:               config,
      map_options:          map_options,
      isMobileDevice:       mobileDevice,
      belong_organization:  belong_organization
    });

    authenticatedUser.fetch();
  });
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../common/views/likes/view":4,"../common/views/mapcard_preview":5,"../public_common/user_industries_view":7,"../public_common/user_meta_view":8,"../public_common/user_settings_view":10,"../public_common/user_share_view":11,"./public_map_window":14}],13:[function(require,module,exports){
(function (global){
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);

/** 
 *  Public vis (map itself)
 *
 */

module.exports = cdb.core.View.extend({

  initialize: function() {
    this._createVis();
  },

  _manageError: function(err, layer) {
    if(layer && layer.get('type') === 'torque') {
      this.trigger('map_error', this);
      // hide all the overlays
      var overlays = vis.getOverlays()
      for (var i = 0; i < overlays.length; ++i) {
        var o = overlays[i];
        o.hide && o.hide();
      }
    }
  },

  _sendStats: function() {
    var browser;
    var ua = navigator.userAgent;
    var checks = [
      ['MSIE 11.0', 'ms11'],
      ['MSIE 10.0', 'ms10'],
      ['MSIE 9.0', 'ms9'],
      ['MSIE 8.0', 'ms8'],
      ['MSIE 7.0','ms7'],
      ['Chrome', 'chr'],
      ['Firefox', 'ff'],
      ['Safari', 'ff']
    ]
    for(var i = 0; i < checks.length && !browser; ++i) {
      if(ua.indexOf(checks[i][0]) !== -1) browser = checks[i][1];
    }
    browser = browser || 'none';
    cartodb.core.Profiler.metric('cartodb-js.embed.' + browser).inc();
  },

  _createVis: function() {
    var loadingTime  = cartodb.core.Profiler.metric('cartodb-js.embed.time_full_loaded').start();
    var visReadyTime = cartodb.core.Profiler.metric('cartodb-js.embed.time_vis_loaded').start();
    var self = this;

    cartodb.createVis('map', this.options.vizdata, this.options.map_options, function(vis) {
      self.vis = vis;

      visReadyTime.end();

      vis.on('load', function() { loadingTime.end() });

      // Check fullscreen button
      var fullscreen = vis.getOverlay("fullscreen");
      
      if (fullscreen) {
        fullscreen.options.doc = ".cartodb-public-wrapper";
        fullscreen.model.set("allowWheelOnFullscreen", self.options.map_options.scrollwheelEnabled);
      }

      //some stats
      self._sendStats();

      // Map loaded!
      self.trigger('map_loaded', vis, this);

      self.$('.js-spinner').remove();

    }).on('error', this._manageError);
  },

  // "Public" method

  invalidateMap: function() {
    this.vis && this.vis.mapView.invalidateSize()
  }

});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],14:[function(require,module,exports){
(function (global){
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var PublicMap = require('./public_map_view');
var ExportMapView = require('../common/dialogs/export_map/export_map_view');

/** 
 *  Public map window "view"
 *
 */

module.exports = cdb.core.View.extend({

  events: {
    'click .js-Navmenu-link--download-map': '_exportMap'
  },

  _exportMap: function (e) {
    e.preventDefault();

    var view = new ExportMapView({
      model: new cdb.admin.ExportMapModel({ 'visualization_id': vis_id }),
      clean_on_hide: true,
      enter_to_confirm: true
    });

    view.appendToBody();
  },

  initialize: function() {
    this.$body = $(this.el.document.body);
    this.$map = this.$body.find('#map');
    this._setupMapDimensions();
    this._initBinds();
    this._initViews();
  },

  _initViews: function() {
    // Map view
    this.mapView = new PublicMap(_.defaults({ el: this.$map }, this.options));
    this.mapView.bind('map_error', this._showNotSupportedDialog, this);
    
    this.addView(this.mapView);
  },

  _initBinds: function() {
    _.bindAll(this, '_onWindowResize', '_onOrientationChange');

    this.$el.on('resize', this._onWindowResize);

    if (!this.el.addEventListener) {
      this.el.attachEvent('orientationchange', this._onOrientationChange, this);
    } else {
      this.el.addEventListener('orientationchange', this._onOrientationChange);
    }
  },

  _showNotSupportedDialog: function() {
    this.$body.find('#not_supported_dialog').show();
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
        h = headerHeight - 20;
      } else {
        if (windowHeight > 670) {
          h = 220;
        } else { // iPhone, etc.
          h = 140;
        }        
      }
    } else {
      h = 260;
    }

    height = windowHeight - h;
    top    = windowHeight - (h - 80);

    if (animated) {
      this.$map.animate({ height: height }, { easing: "easeInQuad", duration: 150 }); 
    } else {

      if (this.options.isMobileDevice) {
        this.$map.css({ height: height, opacity: 1 }); 
      } else {
        // On non mobile devices
        this.$map.css({ height: windowHeight - ( mainInfoHeight + headerHeight), opacity: 1 })
      }
    }

    // If landscape, let's scroll to show the map, and
    // leave the header hidden
    if (this.options.isMobileDevice && landscapeMode && $(window).scrollTop() < headerHeight) {
      this.$body.animate({ scrollTop: headerHeight }, 600);
    }

    if (this.map_view) this.map_view.invalidateMap();
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../common/dialogs/export_map/export_map_view":1,"./public_map_view":13}]},{},[12])
//# sourceMappingURL=public_map.uncompressed.js.map

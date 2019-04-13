(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var BaseDialog = require('./views/base_dialog/view');

/**
 * Convenient factory to create views without having to create new files.
 */
module.exports = {

  createDialogByTemplate: function(templateOrStr, templateData, dialogOptions) {
    return this.createDialogByView(this.createByTemplate(templateOrStr, templateData), dialogOptions);
  },

  /**
   * @return {Object} instance of cdb.core.View, which takes two params of template and templateData
   */
  createByTemplate: function(templateOrStr, templateData, viewOpts) {
    var template = _.isString(templateOrStr) ? cdb.templates.getTemplate(templateOrStr) : templateOrStr;

    var view = new cdb.core.View(viewOpts);
    view.render = function() {
      this.$el.html(
        template(templateData)
      );
      return this;
    };

    return view;
  },

  /**
   * Creates a view that holds a list of views to be rendered.
   * @param {Array} list of View object, i.e. have a render method, $el, and clean method.
   * @param {Object,undefined} viewOpts view options, .e.g {className: 'Whatever'}
   * @return {Object} A view
   */
  createByList: function(views, viewOpts) {
    var listView = new cdb.core.View(viewOpts);
    listView.render = function() {
      this.clearSubViews();
      _.each(views, function(view) {
        this.addView(view);
        this.$el.append(view.render().$el);
      }, this);
      return this;
    };
    return listView;
  },

  createDialogByView: function(contentView, dialogOptions) {

    var options = _.extend({ clean_on_hide: true, enter_to_confirm: true }, dialogOptions);

    return new (BaseDialog.extend({
      initialize: function() {
        this.elder('initialize');
        this.addView(contentView);
      },

      render_content: function() {
        return contentView.render().el;
      }
    }))(options);
  }
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./views/base_dialog/view":3}],2:[function(require,module,exports){
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
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);

/**
 * Creates a default fallback map, to be used when an user don't have any own map visualizations.
 *
 * @param opts {Object} config
 *   el: {String,HTMLElement} id to element where to render map (w/o '#' prefix) or a HTMLElement node
 *   baselayer: {Object} as an item defined in app_config.yml (basemaps key)
 * @returns {Object} a new created Leaflet map
 */
module.exports = function(opts) {
  var provider = 'leaflet';
  var type = 'tiled';
  if (!opts.baselayer.url) {
    provider = 'googlemaps';
    type = 'GMapsBase';
  } else {
    opts.baselayer.urlTemplate = opts.baselayer.url;
  }
  var map = cdb.createVis(opts.el, {
    'version': '0.1.0',
    'title': 'default',
    'scrollwheel': opts.scrollwheel !== undefined ? opts.scrollwheel : false,
    'zoom': 6,
    map_provider: provider,
    center: [40.7127837, -74.0059413], // NY
    layers: [ _.extend({ type: type }, opts.baselayer) ]
  });

  return map;
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);

module.exports = cdb.core.View.extend({

  initialize: function() {
    _.bindAll(this, '_onWindowScroll');
    this._bindScroll();
  },

  _onWindowScroll: function() {
    this.$el.toggleClass('is-fixed', $(window).scrollTop() > this.options.anchorPoint);
  },

  _unbindScroll: function() {
    $(window).unbind('scroll', this._onWindowScroll);
  },

  _bindScroll: function() {
    this._unbindScroll();
    $(window).bind('scroll', this._onWindowScroll);
  },

  clean: function() {
    this._unbindScroll();
    this.elder('clean');
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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

},{"./user_industries/dropdown_view":8}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
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

},{"./user_settings/dropdown_view":10}],12:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var createDefaultFallbackMap = require('../common/views/create_default_fallback_map');

/**
 * View to render the "favourite" map, either a user's map visualization, or a default fallback map.
 */
module.exports = cdb.core.View.extend({

  render: function() {
    this.$el.removeClass('is-pre-loading').addClass('is-loading');

    var promise;
    if (this.options.createVis) {
      promise = this._createVisMap(this.options.createVis);
    } else {
      promise = this._createFallbackMap();
    }

    var self = this;
    promise.done(function() {
      self.$el.removeClass('is-loading');
      self.$('.js-spinner').remove();
    });

    return this;
  },

  _createVisMap: function(createVis) {
    return cdb.createVis(this.el, createVis.url, _.defaults(createVis.opts, {
      title:             false,
      header:            false,
      description:       false,
      search:            false,
      layer_selector:    false,
      text:              false,
      image:             false,
      shareable:         false,
      annotation:        false,
      zoom:              false,
      cartodb_logo:      false,
      scrollwheel:       false,
      mobile_layout:     true,
      slides_controller: false,
      legends:           false,
      time_slider:       false,
      loader:            false,
      fullscreen:        false,
      no_cdn:            false
    }));
  },

  _createFallbackMap: function() {
    createDefaultFallbackMap({
      el: this.el,
      baselayer: this.options.fallbackBaselayer
    });

    // Fake promise, to keep the render method consistent with how the vis map would have been handled (async)
    return {
      done: function(fn) {
        fn();
      }
    };
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../common/views/create_default_fallback_map":4}],13:[function(require,module,exports){
(function (global){
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var UserSettingsView = require('../public_common/user_settings_view');
var UserIndustriesView = require('../public_common/user_industries_view');
var FavMapView = require('../public_dashboard/fav_map_view');
var Feed = require('./view');
var ScrollableHeader = require('../common/views/scrollable_header');

/**
 * Entry point for the user feed, bootstraps all dependency models and application.
 */
$(function() {

  cdb.init(function() {

    cdb.templates.namespace = 'cartodb/';
    cdb.config.set(window.config);
    cdb.config.set('url_prefix', window.base_url);

    var userIndustriesView = new UserIndustriesView({
      el: $('.js-user-industries')
    });

    var scrollableHeader = new ScrollableHeader({
      el: $('.js-Navmenu'),
      anchorPoint: 520
    });

    var authenticatedUser = new cdb.open.AuthenticatedUser();

    $(document.body).bind('click', function() {
      cdb.god.trigger('closeDialogs');
    });

    authenticatedUser.bind('change', function() {
      if (authenticatedUser.get('username')) {
        var user = new cdb.admin.User(authenticatedUser.attributes);
        var userSettingsView = new UserSettingsView({
          el: $('.js-user-settings'),
          model: user
        });
        userSettingsView.render();

        var userDashboardUrl = user.viewUrl().dashboard();
        $('.js-user-info .UserAvatar-img').wrap($('<a>', {
          href: userDashboardUrl
        }));

        $('.js-login').hide();
        $('.js-learn').show();
      }
    });

    var favMapView = new FavMapView(window.favMapViewAttrs);
    favMapView.render();

    var feed = new Feed({
      el: $('.js-feed'),
      authenticatedUser: authenticatedUser
    });

    feed.render();
    authenticatedUser.fetch();
  });
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../common/views/scrollable_header":7,"../public_common/user_industries_view":9,"../public_common/user_settings_view":11,"../public_dashboard/fav_map_view":12,"./view":15}],14:[function(require,module,exports){
(function (global){
var Backbone = (typeof window !== "undefined" ? window['Backbone'] : typeof global !== "undefined" ? global['Backbone'] : null);

module.exports = Backbone.Collection.extend({
  url: '/api/v1/viz',
  parse: function(models) {
    this.total_entries = models.total_entries;
    return models.visualizations;
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],15:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var ViewFactory = require('../common/view_factory');
var randomQuote = require('../common/view_helpers/random_quote');
var LikeView = require('../common/views/likes/view');
var MapCardPreview = require('../common/views/mapcard_preview');
var Visualizations = require('./feed_collection');

module.exports = cdb.core.View.extend({
  tagName: 'div',

  _PAGE: 1,
  _ITEMS_PER_PAGE: 8,

  _SMALL_WIDTH: 544,

  _CARD_HEIGHT: 170,
  _LOADER_TITLE: 'Loading visualizations',

  events: {
    'click .js-more': '_onClickMore'
  },

  initialize: function() {
    _.bindAll(this, '_initLike', '_fetchLike', '_onFetchError', '_onWindowResize', '_renderStaticMaps');

    this.maps = [];

    this._initTemplates();
    this._initModels();
    this._initBindings();
  },

  render: function() {
    this.$el.html(this.template());
    this._renderLoader();
    this._fetchItems({ page: this._PAGE });

    return this;
  },

  _onWindowResize: function() {
    var width = $(window).width();

    if (width <= this._SMALL_WIDTH) {
      this.model.set('size', 'small');
    } else {
      this.model.set('size', 'big');
    }

    this._renderStaticMaps();
  },

  _initTemplates: function() {
    this.template = cdb.templates.getTemplate('user_feed/template');
    this.mapTemplate = cdb.templates.getTemplate('user_feed/map_item_template');
    this.datasetTemplate = cdb.templates.getTemplate('user_feed/dataset_item_template');
    this.loaderTemplatePath = 'user_feed/loading';
    this.emptyTemplatePath = 'user_feed/empty';
    this.errorTemplatePath = 'user_feed/error';
  },

  _initModels: function() {
    var size = 'big';
    var wWidth = $(window).width();

    if (wWidth <= this._SMALL_WIDTH) {
      size = 'small';
    }

    this.model = new cdb.core.Model({
      vis_count: 0,
      type: '',
      size: size,
      page: 0,
      order_by: 'likes'
    });

    this.collection = new Visualizations();
    this.collection.bind('reset', this._renderVisualizations, this);
  },

  _initBindings: function() {
    var self = this;

    this.model.bind('change:show_more', this._onChangeShowMore, this);
    this.model.bind('change:show_loader', this._onChangeShowLoader, this);
    this.model.bind('change:show_mast', this._onChangeShowMast, this);
    this.model.bind('change:vis_count', this._onChangeVisCount, this);

    $(window).bind('resize', this._onWindowResize);
  },

  _onChangeVisCount: function() {
    if (this.model.get('vis_count') >= this.collection.total_entries) {
      this.model.set({ show_more: false });
    } else {
      this.model.set({ show_more: true });
    }
  },

  _onChangeShowMast: function() {
    if (this.model.get('show_mast')) {
      this.$('.js-mast').removeClass('is-hidden');
    } else {
      this.$('.js-mast').addClass('is-hidden');
    }
  },

  _onChangeShowLoader: function() {
    if (this.model.get('show_loader')) {
      this.loader.show();
    } else {
      this.loader.hide();
    }
  },

  _onChangeShowMore: function() {
    this.$('.js-more').toggleClass('is-hidden', !this.model.get('show_more'));
  },

  _renderLoader: function() {
    this.loader = ViewFactory.createByTemplate(this.loaderTemplatePath, {
      title: this._LOADER_TITLE,
      quote: randomQuote()
    });

    this.$el.append(this.loader.render().$el);
  },

  _renderError: function() {
    this.error = ViewFactory.createByTemplate(this.errorTemplatePath, {
    });

    this.$el.append(this.error.render().$el);
  },

  _renderEmpty: function() {
    this.empty = ViewFactory.createByTemplate(this.emptyTemplatePath, {
      name: config.user_name
    });

    this.$el.append(this.empty.render().$el);
  },

  _getDatasetSize: function(item) {
    var size = item.get('table').size;
    return size ? cdb.Utils.readablizeBytes(size, true).split(' ') : 0;
  },

  _getGeometryType: function(geomTypes) {
    if (geomTypes && geomTypes.length > 0) {
      var types = ['point', 'polygon', 'line', 'raster'];
      var geomType = geomTypes[0];

      return _.find(types, function(type) {
        return geomType.toLowerCase().indexOf(type) !== -1;
      });

    } else {
      return null;
    }
  },

  _renderVisualizations: function() {

    if (this.collection.length === 0) {
      this.model.set({ show_loader: false });
      this._renderEmpty();
      return;
    }

    this.model.set({ vis_count: this.model.get('vis_count') + this.collection.length, show_loader: false, show_more: true, show_filters: true, show_mast: true });

    this.collection.each(function(item) {
      var template = item.get('type') === 'derived' ? this.mapTemplate : this.datasetTemplate;
      var geomType = (item.get('table') && item.get('table').geometry_types) ? this._getGeometryType(item.get('table').geometry_types) : null;

      var owner = item.get('permission').owner;

      var el = template({
        vis: item.attributes,
        datasetSize: this._getDatasetSize(item),
        username: owner.username,
        avatar_url: owner.avatar_url,
        table_count: owner.table_count,
        maps_count: owner.maps_count,
        geomType: geomType,
        account_host: config.account_host,
        base_url: cdb.config.get('url_prefix')
      });

      this.$('.js-items').append(el);

      var $item = this.$('.js-items').find('[data-vis-id="' + item.get('id') + '"]');

      if (item.get('type') === 'derived') {
        this.maps.push(item);
      }

      if (item.get('type') === 'derived' && !item.get('rendered_' + this.model.get('size'))) {
        this._renderStaticMap(item, $item);
      }

      this._initLike(item, $item.find('.js-like'));

    }, this);

  },

  _renderStaticMaps: function() {
    _.each(this.maps, function(item) {
      if (!item.get('rendered_' + this.model.get('size'))) {
        var $item = this.$('.js-items').find('[data-vis-id="' + item.get('id') + '"]');
        this._renderStaticMap(item, $item);
      }
    }, this);
  },

  _renderStaticMap: function(vis, $el) {
    var visId = vis.get('id');
    var username = vis.get('permission').owner.username;
    var width = 540;
    var className = 'is-' + this.model.get('size');

    if (this.model.get('size') === 'small') {
      width = 288;
    }

    if (visId && username) {
      vis.set('rendered_' + this.model.get('size'), true);

      new MapCardPreview({
        el: $el.find('.js-header'),
        width: width,
        height: this._CARD_HEIGHT,
        mapsApiResource: cdb.config.getMapsResourceName(username),
        username: username,
        visId: visId,
        className: className
      }).load();
    }
  },

  _getLikesEndpoint: function(vis) {
    return '/api/v1/viz/' + vis.get('id') + '/like';
  },

  _initLike: function(vis, $el) {
    var likeable = this.options.authenticatedUser && this.options.authenticatedUser.get('username');

    var likeModel = cdb.admin.Like.newByVisData({
      likeable: false,
      show_label: true,
      vis_id: vis.get('id'),
      likes: vis.get('likes')
    });

    var url = this._getLikesEndpoint(vis);

    if (likeable) {
      this._fetchLike(likeModel, url);
    } else {
      this.options.authenticatedUser.bind('change', function() {
        this._fetchLike(likeModel, url);
      }, this);
    }

    var likeView = new LikeView({
      el: $el,
      model: likeModel
    });

    likeView.render();

  },

  _fetchLike: function(model, url) {
    if (this.options.authenticatedUser.get('username')) {
      model.bind('loadModelCompleted', function() {
        model.set('likeable', true);
      });
      model.url = url;
      model.sync = Backbone.withCORS;
      model.fetch();
    }
  },

  _fetchItems: function(params) {
    var data = _.extend({
      types: 'table,derived',
      privacy: 'public',
      exclude_shared: 'true',
      per_page: this._ITEMS_PER_PAGE,
      order: 'updated_at'
    }, params);

    this.collection.fetch({
      data: data,
      error: this._onFetchError
    });
  },

  _onFetchError: function() {
    this.model.set({ show_loader: false });
    this._renderError();
  },

  _onClickMore: function(e) {
    this.killEvent(e);
    this.model.set({ show_more: false, show_loader: true });
    this._fetchItems({ page: ++this._PAGE });
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../common/view_factory":1,"../common/view_helpers/random_quote":2,"../common/views/likes/view":5,"../common/views/mapcard_preview":6,"./feed_collection":14}]},{},[13])
//# sourceMappingURL=user_feed.uncompressed.js.map

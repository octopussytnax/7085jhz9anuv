(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var cdbAdmin = (typeof window !== "undefined" ? window['cdb']['admin'] : typeof global !== "undefined" ? global['cdb']['admin'] : null);
var pollTimer = 2000; // Interval time between poll checkings
var timerMultiply = 2.5;  // Multiply interval for this number
var maxTries = 30; // Max tries until interval change

/**
 *  User creation model
 *
 */

module.exports = cdb.core.Model.extend({

  defaults: {
    email: '',
    google_sign_in: false,
    requires_validation_email: false,
    state: '',
    username: ''
  },

  url: function(method) {
    var base = '/api/v1/user_creations';
    return base + '/' + this.id;
  },

  initialize: function() {
    this._initBinds();
  },

  _initBinds: function() {
    this.bind('change:state', this._checkState, this);
  },

  _checkState: function() {
    var state = this.get('state');
    if (this.hasFinished() || this.hasFailed()) {
      this.destroyCheck();
    }
  },

  pollCheck: function() {
    if (this.pollTimer) return;
    var self = this;
    var tries = 0;
    this.pollTimer = setInterval(request, pollTimer);

    function request() {
      self.destroyCheck();
      self.fetch();
      ++tries;
      // Multiply polling timer by a number when a max
      // of tries have been reached
      var multiply = tries > maxTries ? timerMultiply : 1 ;
      self.pollTimer = setInterval(request, pollTimer * multiply);
    }

    // Start doing a fetch
    request();
  },

  destroyCheck: function() {
    clearInterval(this.pollTimer);
    delete this.pollTimer;
  },

  hasUsedGoogle: function() {
    return this.get('google_sign_in')
  },

  requiresValidationEmail: function() {
    return this.get('requires_validation_email');
  },

  hasFinished: function() {
    return this.get('state') === "success"
  },

  hasFailed: function() {
    return this.get('state') === "failure"
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],2:[function(require,module,exports){
(function (global){
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var MainView = require('./main_view');

$(function() {
  cdb.init(function() {
    cdb.templates.namespace = 'cartodb/';
    var confirmation = new MainView({
      userCreationId: user_creation_id,
      username: user_name,
      customHosted: is_custom_install,
      userURL: user_url
    });
  });
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./main_view":3}],3:[function(require,module,exports){
(function (global){
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var ConfirmationModel = require('./confirmation_model');

/**
 *  Confirmation view
 *
 */

module.exports = Backbone.View.extend({

  el: document.body,

  initialize: function(opts) {
    if (!opts.userCreationId) {
      throw new Error('user creation id is needed to check its state');
    }
    this.template = cdb.templates.getTemplate('confirmation/confirmation_info');
    this.model = new ConfirmationModel({
      id: opts.userCreationId
    });
    this._initBinds();

    this.model.pollCheck();
  },

  render: function() {
    this.$('.js-info').html(
      this.template({
        googleSignup: this.model.get('google_sign_in'),
        requiresValidationEmail: this.model.requiresValidationEmail(),
        userCreationId: this.model.get('id'),
        state: this.model.get('state'),
        customHosted: cdb.config.get('cartodb_com_hosted')
      })
    )
    return this;
  },

  _initBinds: function() {
    this.model.bind('change:state', function() {
      this._setLogo();
      this.render();
      if (this.model.hasFinished() && (this.model.hasUsedGoogle() || !this.model.requiresValidationEmail())) {
        this._goToUserURL();
      }
    }, this);
  },

  // Instead of rendering logo each time and f**k the animation
  // we toggle the 'is-loading' class when process has finished
  _setLogo: function() {
    // Loading state
    this.$('.js-logo').toggleClass('is-loading', !this.model.hasFailed() && !this.model.hasFinished());

    // Remove unnecessary notification, if needed
    if (this.model.hasFailed()) {
      this.$('.js-successNotification').remove();
    } else if (this.model.hasFinished()) {
      this.$('.js-errorNotification').remove();
    }

    // Show notification if it is failed or finished
    if (this.model.hasFailed() || this.model.hasFinished()) {
      this.$('.js-notification').show();
    }
  },

  _goToUserURL: function() {
    if (this.options.userURL) {
      window.location.href = this.options.userURL;
    }
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./confirmation_model":1}]},{},[2])
//# sourceMappingURL=confirmation.uncompressed.js.map

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var Backbone = (typeof window !== "undefined" ? window['Backbone'] : typeof global !== "undefined" ? global['Backbone'] : null);
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);

/** 
 *  Model that let user upload files
 *  to our endpoints
 *
 */

module.exports = Backbone.Model.extend({

  url: function(method) {
    var version = cdb.config.urlVersion('asset', method);
    return '/api/' + version + '/users/' + this.userId + '/assets'
  },

  fileAttribute: 'filename',

  initialize: function(attrs, opts) {
    if (!opts.userId) {
      throw new Error('user id is required');
    }
    this.userId = opts.userId;
  }

});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],2:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var AssetModel = require('./asset_model.js')

/**
 *  Change and preview new user avatar
 *
 */

module.exports = cdb.core.View.extend({
  options: {
    avatarAcceptedExtensions: ['jpeg', 'jpg', 'png', 'gif']
  },

  initialize: function() {
    this.renderModel = this.options.renderModel;
    this.model = new cdb.core.Model({ state: 'idle' });
    this.template = cdb.templates.getTemplate('common/views/avatar_selector_view');
    this._initBinds();
  },

  render: function() {
    this._destroyFileInput();
    this.clearSubViews();

    this.$el.html(
      this.template({
        state: this.model.get('state'),
        name: this.renderModel.get('name'),
        inputName: this.renderModel.get('inputName'),
        avatarURL: this.renderModel.get('avatar_url'),
        avatarAcceptedExtensions: this._formatAvatarAcceptedExtensions(this.options.avatarAcceptedExtensions)
      })
    )
    this._renderFileInput();
    return this;
  },

  _initBinds: function() {
    _.bindAll(this, '_onInputChange', '_onSuccess', '_onError');
    this.model.bind('change', this.render, this);
  },

  _destroyFileInput: function() {
    var $file = this.$(":file");
    $file.unbind('change', this._onInputChange, this);
    $file.filestyle('destroy');
  },

  _renderFileInput: function() {
    var $file = this.$(":file");
    var opts = { buttonText: 'Choose image' };
    
    // If we set disabled, no mather if it is true
    // or false, it turns into disabled
    if (this.model.get('state') === "loading") {
      opts.disabled = true
    }

    $file.filestyle(opts);
    $file.bind('change', this._onInputChange);
  },

  _onInputChange: function() {
    var file = this.$(":file").prop('files');
    var avatarUpload = new AssetModel(
      null, {
        userId: this.renderModel.get('id')
      }
    );

    avatarUpload.save({
      kind: 'orgavatar',
      filename: file
    }, {
      success: this._onSuccess,
      error: this._onError
    });

    // If we move "loading" state before starting the upload,
    // it would trigger a new render and "remove" file value :S 
    this.model.set('state', 'loading');
  },

  _onSuccess: function(m, d) {
    this.renderModel.set('avatar_url', d.public_url);
    this.model.set('state', 'success');
  },

  _onError: function() {
    this.model.set('state', 'error');
  },

  clean: function() {
    this._destroyFileInput();
    this.elder('clean');
  },

  _formatAvatarAcceptedExtensions: function(avatarAcceptedExtensions) {
    var formattedExtensions = [];

    for (var i = 0; i < avatarAcceptedExtensions.length; i++) {
      formattedExtensions[i] = "image/" + avatarAcceptedExtensions[i];
    }

    return formattedExtensions.join(",");
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./asset_model.js":1}],3:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var BaseDialog = require('./views/base_dialog/view');

/**
 *  When an organization owner wants to delete the full organization
 *
 */

module.exports = BaseDialog.extend({
  options: {
    authenticityToken: ''
  },

  events: BaseDialog.extendEvents({
    'submit .js-form': 'close'
  }),

  className: 'Dialog is-opening',

  initialize: function () {
    this.elder('initialize');
    this.template = cdb.templates.getTemplate('common/views/delete_organization');
    this._userModel = this.options.user;
  },

  render_content: function () {
    return this.template({
      formAction: cdb.config.prefixUrl() + '/organization',
      authenticityToken: this.options.authenticityToken,
      passwordNeeded: !!this._userModel.get('needs_password_confirmation')
    });
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./views/base_dialog/view":16}],4:[function(require,module,exports){
(function (global){
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var BaseDialog = require('../../views/base_dialog/view.js');
var PagedSearchView = require('../../views/paged_search/paged_search_view');
var PagedSearchModel = require('../../paged_search_model');
var randomQuote = require('../../view_helpers/random_quote');
var GroupUsersListView = require('../../../organization/groups_admin/group_users_list_view');

/**
 * Dialog to add custom basemap to current map.
 */
module.exports = BaseDialog.extend({

  initialize: function() {
    _.each(['group', 'orgUsers'], function(name) {
      if (!this.options[name]) throw new Error(name + ' is required');
    }, this);

    this.elder('initialize');
    this.model = new cdb.core.Model();

    // Include current user in fetch results
    this.options.orgUsers.excludeCurrentUser(false);

    this._initBinds();
    this._initViews();
  },

  clean: function() {
    // restore org users
    this.options.orgUsers.restoreExcludeCurrentUser();
    this.elder('clean');
  },

  /**
   * @override cdb.ui.common.Dialog.prototype.render
   */
  render: function() {
    BaseDialog.prototype.render.apply(this, arguments);
    this._onChangeSelected();
    this.$('.content').addClass('Dialog-contentWrapper');
    return this;
  },

  /**
   * @implements cdb.ui.common.Dialog.prototype.render_content
   */
  render_content: function() {
    switch(this.model.get('state')) {
      case 'saving':
        return this.getTemplate('common/templates/loading')({
          title: 'Adding users to group',
          quote: randomQuote()
        })
        break;
      case 'saveFail':
        return this.getTemplate('common/templates/fail')({
          msg: ''
        })
        break;
      default:
        var $content = $(
          this.getTemplate('common/dialogs/add_group_users/add_group_users')({
          })
        );
        $content.find('.js-dlg-body').replaceWith(this._PagedSearchView.render().el);
        return $content;
    }
  },

  ok: function() {
    var selectedUsers = this._selectedUsers();
    if (selectedUsers.length > 0 ) {
      this.model.set('state', 'saving');

      var ids = _.pluck(selectedUsers, 'id');

      var self = this;
      this.options.group.users.addInBatch(ids)
        .done(function() {
          self.options.group.users.add(selectedUsers);
          self.close();
        })
        .fail(function() {
          self.model.set('state', 'saveFail');
        })
    }
  },

  _initViews: function() {
    this._PagedSearchView = new PagedSearchView({
      isUsedInDialog: true,
      pagedSearchModel: new PagedSearchModel({
        per_page: 50,
        order: 'username'
      }),
      collection: this.options.orgUsers,
      createListView: this._createUsersListView.bind(this)
    });
    this.addView(this._PagedSearchView);
  },

  _createUsersListView: function() {
    return new GroupUsersListView({
      users: this.options.orgUsers
    });
  },

  _initBinds: function() {
    this.options.orgUsers.on('change:selected', this._onChangeSelected, this);
    this.add_related_model(this.options.orgUsers);

    this.model.on('change:state', this.render, this);
  },

  _onChangeSelected: function() {
    this.$('.ok').toggleClass('is-disabled', this._selectedUsers().length === 0);
  },

  _selectedUsers: function() {
    return this.options.orgUsers.where({ selected: true });
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../../organization/groups_admin/group_users_list_view":41,"../../paged_search_model":6,"../../view_helpers/random_quote":15,"../../views/base_dialog/view.js":16,"../../views/paged_search/paged_search_view":26}],5:[function(require,module,exports){
(function (global){
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);

/**
 *  Local storage wrapper
 *
 *  - It should be used within 'cartodb' key, for example:
 *
 *  var loc_sto = new cdb.common.LocalStorage();
 *  loc_sto.set({ 'dashboard.order': 'create_at' });
 *  loc_sto.get('dashboard.order');
 *
 */


var LocalStorageWrapper = function(name) {
  this.name = name || 'cartodb';
  if(!localStorage.getItem(this.name) && this.isEnabled()) {
    localStorage.setItem(this.name, "{}");
  }
}

// Some browsers with private mode don't allow to use
// local storage
LocalStorageWrapper.prototype.isEnabled = function() {
  try {
    localStorage.setItem('checking', 'test');
    localStorage.removeItem('checking');
    return true;
  } catch(e) {
    return false;
  }
}

LocalStorageWrapper.prototype.get = function(n) {
  if (!this.isEnabled()) return false;

  if(n === undefined) {
    return JSON.parse(localStorage.getItem(this.name));
  } else {
    var data = JSON.parse(localStorage.getItem(this.name));
    return data[n];
  }

}

LocalStorageWrapper.prototype.search = function(searchTerm) {
  if (!this.isEnabled()) return null;

  var wholeArray = JSON.parse(localStorage.getItem(this.name));
  for(var i in wholeArray) {
    if(wholeArray[i][searchTerm]) {
      return wholeArray[i][searchTerm];
    }
  }
  return null;
}

LocalStorageWrapper.prototype.set = function(data) {
  if (!this.isEnabled()) return null;
  var d = _.extend(this.get(), data);
  return localStorage.setItem(this.name, JSON.stringify(d));
}

LocalStorageWrapper.prototype.add = function(obj) {
  return this.set(obj);
}

LocalStorageWrapper.prototype.remove = function(n) {
  if (!this.isEnabled()) return null;
  var d = _.omit(this.get(), n);
  return localStorage.setItem(this.name, JSON.stringify(d));
}

LocalStorageWrapper.prototype.destroy = function() {
  delete localStorage.removeItem(this.name);
}

module.exports = LocalStorageWrapper;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],6:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);

/**
 * Model representing the query string params for a "paged search" of a collection (matching the server-side APIs).
 *
 * @example usage
 *   var PagedSearch = require('common/paged_search_model');
 *   pagedSearch = new PagedSearch({ … })
 *   pagedSearch.fetch(collection) // => jqXHR, GET /collection/123?page=1&per_page20
 *   pagedSearch.set({ page: 2, per_page: 10, q: 'test' });
 *   pagedSearch.fetch(collection) // => GET /collection/123?page=2&per_page10&q=test
 */
module.exports = cdb.core.Model.extend({

  defaults: {
    per_page: 20,
    page: 1
    // order: 'name'
    // q: '',
  },

  fetch: function(collection) {
    collection.trigger('fetching');
    return collection.fetch({
      data: this.attributes
    });
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],7:[function(require,module,exports){
(function (global){
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var Backbone = (typeof window !== "undefined" ? window['Backbone'] : typeof global !== "undefined" ? global['Backbone'] : null);

/**
 * @extends http://backbonejs.org/#Router With some common functionality in the context of this app.
 */
var Router = Backbone.Router.extend({

  /**
   * Placeholder, is replaced by enableAfterMainView().
   */
  navigate: function() {
    throw new Error('router.enableAfterMainView({ ... }) must be called before you can navigate');
  },

  /**
   * Enable router to monitor and manage browser URL and history.
   * Expected to be called after main view as the function name indicates,
   */
  enableAfterMainView: function() {
    /**
     * @override http://backbonejs.org/#Router-navigate Allow
     * @param fragmentOrUrl {String} Either a fragment (e.g. '/dashboard/datasets') or a full URL
     *  (e.g. http://user.carto.com/dashboard/datasets), the navigate method takes care to route correctly.
     */
    this.navigate = function(fragmentOrUrl, opts) {
      Backbone.Router.prototype.navigate.call(this, this.normalizeFragmentOrUrl(fragmentOrUrl), opts);
    };

    Backbone.history.start({
      pushState: true,
      root: this.rootPath() + '/' //Yes, this trailing slash is necessary for the router to update the history state properly.
    });
  },

  rootPath: function() {
    throw new Error('implement rootPath in child router (no trailing slash)');
  },

  /**
   * Normalise a given fragment or URL for navigation mechanisms to work.
   * Typically, remove the leading base URL from the given fragment or URL.
   *
   * @param {String} fragmentOrUrl
   * @return {String}
   */
  normalizeFragmentOrUrl: function(fragmentOrUrl) {
    throw new Error('implement normalizeFragmentOrUrl in child router');
  }
});

Router.supportTrailingSlashes = function(obj) {
  return _.reduce(obj, function(res, val, key) {
    res[key] = val;
    res[key + '/'] = val;
    return res;
  }, {});
};

module.exports = Router;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],8:[function(require,module,exports){
(function (global){
var Ps = require('perfect-scrollbar');
var template = require('./scroll.tpl');
var MutationObserver = window.MutationObserver;

var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);

module.exports = cdb.core.View.extend({
  tagName: 'div',
  className: 'ScrollView',

  initialize: function (opts) {
    if (!opts.createContentView) throw new Error('A factory createContentView function is required');
    this.options = opts || {};
    this._type = opts.type || 'vertical'; // vertical or horizontal
    this._maxScroll = 0;
  },

  render: function () {
    this.clearSubViews();
    this._html();

    var view = this.options.createContentView.call(this);
    this._contentContainer().append(view.render().el);
    this.addView(view);
    this._applyScroll();
    this._updateScrollWhenExist();
    return this;
  },

  _html: function () {
    this.$el.html(template({
      type: this._type
    }));

    (this._type === 'horizontal') && this.$el.addClass('ScrollView--horizontal');
  },

  _contentContainer: function () {
    return this.$('.js-content');
  },

  _wrapperContainer: function () {
    return this.$('.js-wrapper');
  },

  _updateScrollWhenExist: function () {
    // Phantom doesn't provide this api for window.
    if (!MutationObserver) return;

    // even with the changes in PS, we need to check when this element is added to the dom
    // in order to trigger manually an update.
    var element = document.body;
    var self = this._wrapperContainer().get(0);
    var onMutationObserver = function () {
      if (element.contains(self)) {
        Ps.update(self);
        observer.disconnect();
      }
    };

    var observer = new MutationObserver(onMutationObserver);
    onMutationObserver();

    var config = { subtree: true, childList: true };
    observer.observe(element, config);
  },

  _applyScroll: function () {
    Ps.initialize(this._wrapperContainer().get(0), {
      wheelSpeed: 2,
      wheelPropagation: true,
      stopPropagationOnClick: false,
      minScrollbarLength: 20,
      suppressScrollX: this._type === 'vertical',
      suppressScrollY: this._type === 'horizontal'
    });
  },

  destroyScroll: function () {
    Ps.destroy(this._wrapperContainer().get(0));
  },

  clean: function () {
    this.destroyScroll();
    cdb.core.View.prototype.clean.call(this);
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./scroll.tpl":9,"perfect-scrollbar":70}],9:[function(require,module,exports){
var _ = require('underscore');
module.exports = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div class="ScrollView-wrapper js-wrapper js-perfect-scroll">\n  <div class="ScrollView-content js-content"></div>\n</div>\n';
}
return __p;
};

},{"underscore":94}],10:[function(require,module,exports){
/**
 *  Decide what support block app should show
 *
 */

module.exports = cdb.core.View.extend({

  initialize: function() {
    this.user = this.options.user;
    this.template = cdb.templates.getTemplate('common/views/support_banner');
  },

  render: function() {
    this.$el.html(
      this.template({
        userType: this._getUserType(),
        orgDisplayEmail: this._getOrgAdminEmail(),
        isViewer: this.user.isViewer()
      })
    )
    return this;
  },

  _getUserType: function() {
    var accountType = this.user.get('account_type').toLowerCase();

    // Get user type
    if (this.user.isOrgOwner()) {
      return 'org_admin';
    } else if (this.user.isInsideOrg()) {
      return 'org';
    } else if (accountType === "internal" || accountType === "partner" || accountType === "ambassador") {
      return 'internal';
    } else if (accountType !== "free") {
      return 'client';
    } else {
      return 'regular';
    }
  },

  _getOrgAdminEmail: function() {
    if(this.user.isInsideOrg()) {
      return this.user.organization.display_email;
    } else {
      return null;
    }
  }

});

},{}],11:[function(require,module,exports){
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

},{"./views/base_dialog/view":16}],12:[function(require,module,exports){
/**
 * Object representing human-readable version of a given number of bytes.
 *
 * (Extracted logic from an old dashboard view)
 *
 * @param bytes {Number}
 * @returns {Object}
 */
var fn = function(bytes) {
  if (!(this instanceof fn)) return new fn(bytes);

  this.bytes = bytes;
  if (bytes == 0) {
    this.unit = 0;
  } else {
    this.unit = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  }

  return this;
};

fn.prototype.size = function() {
  return (this.bytes / Math.pow(1024, this.unit));
};

fn.prototype.UNIT_SUFFIXES = ['B', 'kB', 'MB', 'GB', 'TB'];
fn.prototype.suffix = function() {
  return this.UNIT_SUFFIXES[this.unit];
};

fn.prototype.toString = function(decimals) {
  var size = this.size();
  if (decimals) {
    // 1 decimal: 9.995 => 9.9
    var round = Math.pow(10, decimals);
    size = Math.floor(size * round) / round;
  } else {
    size = Math.floor(size);
  }
  return size + this.suffix();
};

module.exports = fn;

},{}],13:[function(require,module,exports){
(function (global){
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);

/**
 * Check if Linux user used right/middle click at the time of the event
 *
 * @param ev {Event}
 * @returns {boolean}
 */
function isLinuxMiddleOrRightClick(ev) {
  return ev.which === 2 || ev.which === 3;
}

/**
 * Check if Mac user used CMD key at the time of the event Mac user used CMD key at the time of the event.
 *
 * @param ev {Event}
 * @returns {boolean}
 */
function isMacCmdKeyPressed(ev) {
  return ev.metaKey;
}

function isCtrlKeyPressed(ev) {
  return ev.ctrlKey;
}

/**
 * Click handler for a cartodb.js view, to navigate event target's href URL through the view's router.navigate method.
 *
 * The default behavior is:
 * Unless cmd/ctrl keys are pressed it will cancel the default link behavior and instead navigate to the URL set in the
 * target's href attribute.
 *
 * Prerequisities:
 *  - view has a this.router instance.
 *
 * Example of how to use:
 *   - In a template:
 *     <a href="/some/uri" id="#my-link" ...
 *     <a href="/special/uri" id="#my-special-link" ...
 *
 *   - In the view file:
 *     var navigateThroughRouter = require('../../common/view_helpers/navigateThroughRouter');
 *     module.exports = new cdb.core.View.extend({
 *       events: {
 *         'click a#my-link': navigateThroughRouter
 *         'click a#my-special-link': this._myCustomRoute
 *       }
 *
 *       _myCustomRoute: function(ev) {
 *         // Here you can do you custom logic before/after the routing, e.g.:
 *         console.log('before changing route');
 *         navigateThroughRouter.apply(this, arguments);
 *         console.log('after changing route');
 *       }
 *
 * @param ev {Event}
 */
module.exports = function(ev) {
  // We always kill the default behaviour of the event, since container around view might have other click behavior.
  // In case of a cmd/ctrl click by an user.
  this.killEvent(ev);
  var url = $(ev.target).closest('a').attr('href');

  if (!url) {
    return false;
  }

  if (!isLinuxMiddleOrRightClick(ev) && !isMacCmdKeyPressed(ev)) {
    (this.router || this.options.router).navigate(url, { trigger: true });
  } else if (isCtrlKeyPressed(ev) || isMacCmdKeyPressed(ev)) {
    window.open(url, '_blank');
  }
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],14:[function(require,module,exports){
var pluralizeStr = function(singular, plural, count) {
  if (arguments.length === 2) {
    // Backward compability with prev usages, retrofit to the new params signature
    // pluralizeStr('foobar' , 3) // => foobars
    return pluralizeStr.call(this, arguments[0], arguments[0] + 's', arguments[1]);
  }

  return count === 1 ? singular : plural;
};

pluralizeStr.prefixWithCount = function(singular, plural, count) {
  return pluralizeStr(
    '1 ' + singular, // e.g. 1 item
    count + ' ' + plural, // e.g. 123 items
    count
  );
}

module.exports = pluralizeStr;

},{}],15:[function(require,module,exports){
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

},{}],16:[function(require,module,exports){
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

},{}],17:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
cdb.admin = (typeof window !== "undefined" ? window['cdb']['admin'] : typeof global !== "undefined" ? global['cdb']['admin'] : null);
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);
var navigateThroughRouter = require('../../../view_helpers/navigate_through_router');

/**
 * The content of the dropdown menu opened by the link at the end of the breadcrumbs menu, e.g.
 *   username > [Maps]
 *          ______/\____
 *         |            |
 *         |    this    |
 *         |____________|
 */
module.exports = cdb.admin.DropdownMenu.extend({
  className: 'Dropdown BreadcrumbsDropdown',

  events: {
    'click a':  '_navigateToLinksHref'
  },

  initialize: function() {
    this.elder('initialize');
    if (!this.options.viewModel) {
      throw new Error('viewModel must be provided');
    }
    this.viewModel = this.options.viewModel;
    // Optional
    this.router = this.options.router;
  },

  render: function() {
    var dashboardUrl = this.model.viewUrl().dashboard();
    var datasetsUrl = dashboardUrl.datasets();
    var deepInsightsUrl = dashboardUrl.deepInsights();
    var mapsUrl = dashboardUrl.maps();

    this.$el.html(this.template_base({
      avatarUrl: this.model.get('avatar_url'),
      userName: this.model.get('username'),
      mapsUrl: mapsUrl,
      datasetsUrl: datasetsUrl,
      deepInsightsUrl: deepInsightsUrl,
      lockedDatasetsUrl: datasetsUrl.lockedItems(),
      lockedMapsUrl: mapsUrl.lockedItems(),
      isDeepInsights: this.viewModel.isDisplayingDeepInsights(),
      isDatasets: this.viewModel.isDisplayingDatasets(),
      isMaps: this.viewModel.isDisplayingMaps(),
      isLocked: this.viewModel.isDisplayingLockedItems()
    }));

    // Necessary to hide dialog on click outside popup, for example.
    cdb.god.bind('closeDialogs', this.hide, this);

    // TODO: taken from existing code, how should dropdowns really be added to the DOM?
    $('body').append(this.el);

    return this;
  },

  _navigateToLinksHref: function() {
    this.hide(); //hide must be called before routing for proper deconstruct of dropdown
    if (this.options.router) {
      navigateThroughRouter.apply(this, arguments);
    }
  },

  clean: function() {
    // Until https://github.com/CartoDB/cartodb.js/issues/238 is resolved:
    $(this.options.target).unbind("click", this._handleClick);
    this.constructor.__super__.clean.apply(this);
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../../view_helpers/navigate_through_router":13}],18:[function(require,module,exports){
(function (global){

var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);
var Backbone = (typeof window !== "undefined" ? window['Backbone'] : typeof global !== "undefined" ? global['Backbone'] : null);
var UserNotificationModel = require('./model');
var UserOrganizationNotificationModel = require('./organization-model');

/**
 *  User notification default collection, it will
 *  require the user notification model
 */

module.exports = Backbone.Collection.extend({

  model: function(attrs, options) {
    if (attrs.type === 'org_notification') {
      return new UserOrganizationNotificationModel(attrs, options);
    } else {
      return new UserNotificationModel(attrs);
    }
  }

});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./model":20,"./organization-model":21}],19:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
cdb.admin = (typeof window !== "undefined" ? window['cdb']['admin'] : typeof global !== "undefined" ? global['cdb']['admin'] : null);
var ScrollView = require('../../../scroll/scroll-view');
var ViewFactory = require('../../../../common/view_factory');

/**
 * User notifications dropdown, rendering notifications
 * from the collection
 */

module.exports = cdb.admin.DropdownMenu.extend({
  className: 'Dropdown',

  initialize: function() {
    cdb.admin.DropdownMenu.prototype.initialize.apply(this, arguments);
    this._initBinds();
  },

  render: function () {
    this.clearSubViews();
    this.$el.html(this.template_base());
    this._renderDropdown();
    this._checkScroll();

    $('body').append(this.el);

    return this;
  },

  _renderDropdown: function () {
    this.dropdown_content = ViewFactory.createByTemplate('common/views/dashboard_header/notifications/templates/dropdown_content', {
      items: this.collection.toJSON(),
      unreadItems: this.collection.filter(function(item){ return !item.get('opened') }).length
    });
    this.addView(this.dropdown_content);

    this.$('.js-content').html(this.dropdown_content.render().el);
  },

  _checkScroll: function() {
    // we need to wait until dropdown has appeared,
    // then if it is taller than 300px we wrap the content in a ScrollView,
    // this is a fix for IE11, which needs a fixed height when using flex in a child element
    setTimeout(function () {
      if (this.$el.height() >= 300) {
        var view = new ScrollView({
          createContentView: function () {
            return this.dropdown_content;
          }.bind(this)
        });
        this.addView(view);

        this.$el.addClass('Dropdown--withScroll');
        this.$('.js-content').html(view.render().el);
      }
    }.bind(this), 301);
  },

  _initBinds: function() {
    cdb.god.bind('closeDialogs', this.hide, this);
    this.add_related_model(cdb.god);
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../../../common/view_factory":11,"../../../scroll/scroll-view":8}],20:[function(require,module,exports){
(function (global){

var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);

/**
 *  User notification default model
 */

module.exports = cdb.core.Model.extend({

  defaults: {
    type:     '',
    message:  '',
    opened:   false
  }

});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],21:[function(require,module,exports){
var UserNotificationModel = require('./model');

/**
 *  User notification default model
 */

module.exports = UserNotificationModel.extend({
  url: function (method) {
    return '/api/v3/users/' + this._userId + '/notifications/' + this.id + '?api_key=' + this._apiKey;
  },

  initialize: function (attrs, opts) {
    if (!opts.userId) {
      throw new Error('user Id is required');
    }

    if (!opts.apiKey) {
      throw new Error('apiKey is required');
    }

    this._userId = opts.userId;
    this._apiKey = opts.apiKey;
  },

  markAsRead: function () {
    this.save({
      notification: {
        read_at: new Date()
      }
    });
  }
});

},{"./model":20}],22:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);
var UserNotificationsCollection = require('./collection');
var NotificationsDropdown = require('./dropdown_view');


/**
 *  User notifactions view used to show alerts from the application
 *
 *  In storage we will check these attributes, managed by a collection:
 *
 *  try_trial       -> trial_end_at is null && user is not paid user
 *  limits_exceeded -> check table quota size
 *  close_limits    -> check table quota size < 80%
 *  upgraded        -> check upgraded_at less than one week
 *  trial_ends_soon -> trial_end_at is not null and it is close to be finished
 *  new_dashboard   -> new dashboard
 *  notification    -> check notification
 *
 */

module.exports = cdb.core.View.extend({

  attributes: {
    href: '#/notifications'
  },

  tagName: 'a',
  className: 'UserNotifications',

  events: {
    'click': '_openNotifications'
  },

  initialize: function() {
    this.user = this.options.user;
    this.localStorage = this.options.localStorage;
    this.template = cdb.templates.getTemplate('common/views/dashboard_header/notifications/templates/user_notifications');
    this.collection = new UserNotificationsCollection();
    this.collection.reset(this._generateCollection(), {
      userId: this.user.get('id'),
      apiKey: this.user.get('api_key'),
      silent: true
    });

    this._initBinds();
  },

  render: function() {
    var notificationsCount = this.collection.filter(function(item) { return !item.get('opened') }).length;

    this.$el.html(
      this.template({
        notificationsCount: notificationsCount
      })
    );

    // has alerts?
    this.$el.toggleClass('has--alerts', notificationsCount > 0);

    return this;
  },

  _initBinds: function() {
    // Make it live
    this.user.bind('change', this._onUserChange, this);
    this.collection.bind('reset', this.render, this);
    this.collection.bind('remove', this.render, this);
    this.add_related_model(this.user);
    this.add_related_model(this.collection);
  },

  _onUserChange: function() {
    // When api is ready, we will make a valid fetch :)
    this.collection.reset(this._generateCollection(), {
      userId: this.user.get('id'),
      apiKey: this.user.get('api_key')
    });
    this.render();
  },

  // This method will check notifications and create a collection with them
  // Also it will check if those have been opened or not with Local Storage.
  _generateCollection: function() {
    var arr = [];
    var d = {}; // data
    var userUrl = this.user.viewUrl();

    d.isInsideOrg = this.user.isInsideOrg();
    d.isOrgOwner = this.user.isOrgOwner();
    d.accountType = this.user.get("account_type").toLowerCase();
    d.remainingQuota = this.user.get('remaining_byte_quota');
    d.publicProfileUrl = userUrl.publicProfile();
    d.bytesQuota = this.user.get('quota_in_bytes');
    d.userType = 'regular';
    d.upgradeUrl = window.upgrade_url || '';
    d.upgradeContactEmail = this.user.upgradeContactEmail();
    d.trialEnd = this.user.get('trial_ends_at') && moment(this.user.get('trial_ends_at')).format("YYYY-MM-DD");
    d.userName = this.user.get('name') || this.user.get('username');


    // Get user type
    if (d.isInsideOrg && !d.isOrgOwner) {
      d.userType = 'org';
    } else if (d.isOrgOwner) {
      d.userType = 'admin';
    } else if (d.accountType === "internal" || d.accountType === "partner" || d.accountType === "ambassador") {
      d.userType = 'internal'
    }

    // try_trial -> trial_end_at is null && user is not paid user
    if (!d.isInsideOrg && d.accountType === 'free' && this.user.get("table_count") > 0) {
      arr.push({
        iconFont: 'CDB-IconFont-gift',
        severity: 'NotificationsDropdown-itemIcon--positive',
        type:   'try_trial',
        msg:    cdb.templates.getTemplate('common/views/dashboard_header/notifications/templates/try_trial')(d),
        opened: this.localStorage.get('notification.try_trial')
      })
    } else {
      this.localStorage.remove('notification.try_trial')
    }

    // limits_exceeded -> check table quota size
    if (d.remainingQuota <= 0) {
      arr.push({
        iconFont: 'CDB-IconFont-barometer',
        severity: 'NotificationsDropdown-itemIcon--negative',
        type:   'limits_exceeded',
        msg:    cdb.templates.getTemplate('common/views/dashboard_header/notifications/templates/limits_exceeded')(d),
        opened: this.localStorage.get('notification.limits_exceeded')
      });
    } else {
      this.localStorage.remove('notification.limits_exceeded')
    }

    // close_limits -> check table quota size < 80%
    if ((( d.remainingQuota * 100 ) / d.bytesQuota ) < 20) {
      arr.push({
        iconFont: 'CDB-IconFont-barometer',
        severity: 'NotificationsDropdown-itemIcon--alert',
        type:   'close_limits',
        msg:    cdb.templates.getTemplate('common/views/dashboard_header/notifications/templates/close_limits')(d),
        opened: this.localStorage.get('notification.close_limits')
      });
    } else {
      this.localStorage.remove('notification.close_limits')
    }

    // upgraded -> check upgraded_at less than ... one week?
    if (this.user.get("show_upgraded_message")) {
      arr.push({
        iconFont: 'CDB-IconFont-heartFill',
        severity: 'NotificationsDropdown-itemIcon--positive',
        type:   'upgraded_message',
        msg:    cdb.templates.getTemplate('common/views/dashboard_header/notifications/templates/upgraded_message')(d),
        opened: this.localStorage.get('notification.upgraded_message')
      });
    } else {
      this.localStorage.remove('notification.upgraded_message')
    }

    // trial_ends_soon -> show_trial_reminder flag
    if (this.user.get("show_trial_reminder")) {
      arr.push({
        iconFont: 'CDB-IconFont-clock',
        severity: 'NotificationsDropdown-itemIcon--alert',
        type:   'trial_ends_soon',
        msg:    cdb.templates.getTemplate('common/views/dashboard_header/notifications/templates/trial_ends_soon')(d),
        opened: this.localStorage.get('notification.trial_ends_soon')
      });
    } else {
      this.localStorage.remove('notification.trial_ends_soon')
    }

    if (window.organization_notifications) {
      for (var n = 0; n < window.organization_notifications.length; n++) {
        var notification = window.organization_notifications[n];
        var icon = notification.icon ? ('CDB-IconFont-' + notification.icon) : 'CDB-IconFont-alert';

        arr.push({
          iconFont: icon,
          severity: 'NotificationsDropdown-itemIcon--alert',
          id: notification.id,
          msg: notification.html_body,
          read_at: notification.read_at,
          type: 'org_notification'
        });
      }
    }

    return arr;
  },

  _openNotifications: function(e) {
    if (e) this.killEvent(e);

    if (this.notification) {
      this.notification.hide();
      delete this.notification;
      return this;
    }

    var view = this.notification = new NotificationsDropdown({
      target:             this.$el,
      collection:         this.collection,
      horizontal_offset:  5,
      vertical_offset:    -5,
      template_base:      'common/views/dashboard_header/notifications/templates/dropdown'
    });

    $(view.options.target).unbind('click', view._handleClick);
    this._closeAnyOtherOpenDialogs();

    view.on('onDropdownHidden', function() {
      this._onDropdownHidden(view);
    }, this);

    view.render();
    view.open();

    this.addView(view);
  },

  _onDropdownHidden: function(view) {
    var self = this;

    // All notifications have been seen, opened -> true
    this.collection.each(function(i){
      if (i.get('type') === 'org_notification') {
        i.markAsRead();
      } else if (i.get('type')) {
        i.set('opened', true);
        var d = {};
        d['notification.' + i.get('type')] = true;
        self.localStorage.set(d);
      }
    });

    // Clean collection because all notifications should
    // removed from the collection
    this.collection.reset();

    // Clean dropdown
    view.clean();
    // Remove it from subviews
    this.removeView(view);
    // Remove count
    this.$el.removeClass('has--alerts');
    // No local notification set
    delete this.notification;
  },

  _closeAnyOtherOpenDialogs: function() {
    cdb.god.trigger("closeDialogs");
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./collection":18,"./dropdown_view":19}],23:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
cdb.admin = (typeof window !== "undefined" ? window['cdb']['admin'] : typeof global !== "undefined" ? global['cdb']['admin'] : null);
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);
var bytesToSize = require('../../view_helpers/bytes_to_size');

/**
 * The content of the dropdown menu opened by the user avatar in the top-right of the header, e.g.:
 *   Explore, Learn, ♞
 *             ______/\____
 *            |            |
 *            |    this    |
 *            |____________|
 */
module.exports = cdb.admin.DropdownMenu.extend({
  className: 'Dropdown',

  initialize: function() {
    this.elder('initialize');
    if (!this.model) {
      throw new Error('model is required');
    }
    this.template_base = cdb.templates.getTemplate('common/views/dashboard_header/settings_dropdown');
  },

  shortDisplayName: function(user) {
    // This changes should also be done in Central, ./app/assets/javascripts/dashboard/users/views/user_avatar.js
    var accountTypeDisplayName = user.get('account_type_display_name');
    var displayName = _.isUndefined(accountTypeDisplayName) ? user.get('account_type') : accountTypeDisplayName;

    if(_.isUndefined(displayName)) {
      return displayName;
    }

    displayName = displayName.toLowerCase();

    if (displayName === 'organization user') {
      return 'org. user';
    } else {
      return displayName.replace(/lump-sum/gi, '- A')
                        .replace(/academic/gi, 'aca.')
                        .replace(/ - Monthly/i, ' - M')
                        .replace(/ - Annual/i, ' - A')
                        .replace(/Non-Profit/i, 'NP')
                        .replace(/On-premises/i, 'OP')
                        .replace(/Internal use engine/i, 'engine')
                        .replace(/Lite/i, 'L')
                        .replace(/Cloud Engine &/i, 'C. Engine &')
                        .replace(/& Enterprise Builder/i, '& E. Builder')
                        .replace(/CARTO for /i, '')
                        .replace(/CARTO /i, '');
    }
  },

  render: function() {
    var user = this.model;
    var usedDataBytes = user.get('db_size_in_bytes');
    var quotaInBytes = user.get('quota_in_bytes');
    var usedDataPct = Math.round(usedDataBytes / quotaInBytes * 100);
    var progressBarClass = '';

    if (usedDataPct > 80 && usedDataPct < 90) {
      progressBarClass = 'is--inAlert';
    } else if (usedDataPct > 89) {
      progressBarClass = 'is--inDanger';
    }

    var accountType = this.shortDisplayName(user);

    var userUrl = this.model.viewUrl();
    var upgradeUrl = window.upgrade_url || cdb.config.get('upgrade_url') || '';

    this.$el.html(this.template_base({
      name:         user.get('name') || user.get('username'),
      email:        user.get('email'),
      accountType:  accountType,
      isOrgAdmin:   user.isOrgAdmin(),
      usedDataStr:      bytesToSize(usedDataBytes).toString(2),
      usedDataPct:      usedDataPct,
      progressBarClass: progressBarClass,
      availableDataStr: bytesToSize(quotaInBytes).toString(2),
      showUpgradeLink:    upgradeUrl && (user.isOrgOwner() || !user.isInsideOrg()) && !cdb.config.get('cartodb_com_hosted'),
      upgradeUrl:         upgradeUrl,
      publicProfileUrl:   userUrl.publicProfile(),
      apiKeysUrl:         userUrl.apiKeys(),
      organizationUrl:    userUrl.organization(),
      accountSettingsUrl: userUrl.accountSettings(),
      logoutUrl:          userUrl.logout(),
      isViewer:           user.isViewer(),
      isBuilder:          user.isBuilder(),
      orgDisplayEmail:    user.isInsideOrg() ? user.organization.display_email : null,
      engineEnabled:      user.get('actions').engine_enabled,
      mobileAppsEnabled:  user.get('actions').mobile_sdk_enabled
    }));

    // Necessary to hide dialog on click outside popup, for example.
    cdb.god.bind('closeDialogs', this.hide, this);

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

},{"../../view_helpers/bytes_to_size":12}],24:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);

/**
 * View to render the user support link in the header.
 * Expected to be created from existing DOM element.
 */
module.exports = cdb.core.View.extend({

  initialize: function() {
    this.user = this.model;
    this.template_base = cdb.templates.getTemplate('common/views/dashboard_header/user_support_template');
  },

  render: function() {
    this.$el.html(
      this.template_base({
        userType: this._getUserType()
      })
    )

    return this;
  },

  _getUserType: function() {
    var accountType = this.user.get('account_type').toLowerCase();

    // Get user type
    if (this.user.isInsideOrg()) {
      return 'org';
    } else if (accountType === "internal" || accountType === "partner" || accountType === "ambassador") {
      return 'internal'
    } else if (accountType !== "free") {
      return 'client';
    } else {
      return 'regular'
    }
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],25:[function(require,module,exports){
(function (global){
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var SettingsDropdown = require('./dashboard_header/settings_dropdown_view');
var BreadcrumbsDropdown = require('./dashboard_header/breadcrumbs/dropdown_view');
var UserNotifications = require('./dashboard_header/notifications/view');
var UserSupportView = require('./dashboard_header/user_support_view');

/**
 * Responsible for the header part of the layout.
 * It's currently pre-rendered server-side, why the header element is required to be given when instantiating the view.
 */
module.exports = cdb.core.View.extend({
  events: {
    'click .js-breadcrumb-dropdown': '_createBreadcrumbsDropdown',
    'click .js-settings-dropdown': '_createSettingsDropdown'
  },

  initialize: function() {
    if (!this.options.el) {
      throw new Error('el element is required');
    }
    if (!this.options.viewModel) {
      throw new Error('viewModel is required');
    }

    this._viewModel = this.options.viewModel;
    this.router = this.options.router;
    this._initBinds();
  },

  render: function() {
    this.clearSubViews();

    this._renderBreadcrumbsDropdownLink();
    this._renderSupportLink();
    this._renderNotifications();
    this._renderLogoLink();

    return this;
  },

  _initBinds: function() {
    this._viewModel.bind('change', this._renderBreadcrumbsDropdownLink, this);
    if (this.router) {
      this.router.model.bind('change', this._onRouterChange, this);
      this.add_related_model(this.router.model);
    }
    if (this.collection) {
      this.collection.bind('reset', this._stopLogoAnimation, this);
      this.collection.bind('error', this._onCollectionError, this);
      this.add_related_model(this.collection);
    }
    this.add_related_model(this._viewModel);
  },

  _onCollectionError: function(col, e, opts) {
    // Old requests can be stopped, so aborted requests are not
    // considered as an error
    if (!e || (e && e.statusText !== "abort")) {
      this._stopLogoAnimation()
    }
  },

  _onRouterChange: function(m, c) {
    if (c && c.changes && !c.changes.content_type && this.collection.total_user_entries > 0) {
      this._startLogoAnimation(); 
    }
  },

  _startLogoAnimation: function() {
    this.$('.Logo').addClass('is-loading');
  },

  _stopLogoAnimation: function() {
    this.$('.Logo').removeClass('is-loading');
  },

  _renderBreadcrumbsDropdownLink: function() {
    this.$('.js-breadcrumb-dropdown').html(
      cdb.templates.getTemplate('common/views/dashboard_header/breadcrumbs/dropdown_link')({
        title: this._viewModel.breadcrumbTitle(),
        dropdownEnabled: this._viewModel.isBreadcrumbDropdownEnabled()
      })
    )
  },

  _renderNotifications: function() {
    var userNotifications = new UserNotifications({
      user: this.model,
      localStorage: this.options.localStorage
    });

    this.$('.js-user-notifications').html(userNotifications.render().el);
    this.addView(userNotifications);
  },

  _renderSupportLink: function() {
    var userSupportView = new UserSupportView({
      el: $('.js-user-support'),
      model: this.model
    });
    userSupportView.render();
  },

  _renderLogoLink: function() {
    var template = cdb.templates.getTemplate('common/views/dashboard_header/logo');
    this.$('.js-logo').html(
      template({
        homeUrl: this.model.viewUrl().dashboard(),
        googleEnabled: this.model.featureEnabled('google_maps')
      })
    );
  },

  _createSettingsDropdown: function(ev) {
    this.killEvent(ev);

    this._setupDropdown(new SettingsDropdown({
      target: $(ev.target),
      model: this.model, // a user model
      horizontal_offset: 18
    }));
  },

  _createBreadcrumbsDropdown: function(ev) {
    if (this._viewModel.isBreadcrumbDropdownEnabled()) {
      this.killEvent(ev);
      this._setupDropdown(new BreadcrumbsDropdown({
        target: $(ev.target),
        model: this.model,
        viewModel: this._viewModel,
        router: this.router, // optional
        horizontal_offset: -110,
        tick: 'center',
        template_base: 'common/views/dashboard_header/breadcrumbs/dropdown'
      }));
    }
  },

  _setupDropdown: function(dropdownView) {
    this._closeAnyOtherOpenDialogs();
    this.addView(dropdownView);

    dropdownView.on('onDropdownHidden', function() {
      dropdownView.clean();
    }, this);

    dropdownView.render();
    dropdownView.open();
  },

  _closeAnyOtherOpenDialogs: function() {
    cdb.god.trigger("closeDialogs");
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./dashboard_header/breadcrumbs/dropdown_view":17,"./dashboard_header/notifications/view":22,"./dashboard_header/settings_dropdown_view":23,"./dashboard_header/user_support_view":24}],26:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);
var Utils = (typeof window !== "undefined" ? window['cdb']['Utils'] : typeof global !== "undefined" ? global['cdb']['Utils'] : null);
var PaginationModel = require('../pagination/model');
var randomQuote = require('../../view_helpers/random_quote');
var ViewFactory = require('../../view_factory');
var PaginationView = require('../pagination/view');

/**
 * View to render a searchable/pageable collection.
 * Also allows to filter/search list.
 * Set {isUsedInDialog: true} in view opts if intended to be used in a dialog, to have proper classes to position views
 * properly.
 *
 * - collection is a collection which has a PagedSearchModel.
 */
module.exports = cdb.core.View.extend({

  events: {
    'click .js-search-link': '_onSearchClick',
    'click .js-clean-search': '_onCleanSearchClick',
    'keydown .js-search-input': '_onKeyDown',
    'submit .js-search-form': 'killEvent'
  },

  initialize: function() {
    _.each(['collection', 'pagedSearchModel', 'createListView'], function(name) {
      if (!this.options[name]) throw new Error(name + ' is required');
    }, this);
    this.collection = this.options.collection;
    this.options.noResults = this.options.noResults || {}

    var params = this.options.pagedSearchModel;
    this.paginationModel = new PaginationModel({
      current_page: params.get('page'),
      total_count: this.collection.totalCount() || 0,
      per_page: params.get('per_page')
    });

    this.elder('initialize');
    this._initBinds();
    this.options.pagedSearchModel.fetch(this.collection);
  },

  render: function() {
    this.clearSubViews();

    this._renderContent(
      this.getTemplate('common/views/paged_search/paged_search')({
        thinFilters: this.options.thinFilters,
        q: this.options.pagedSearchModel.get('q')
      })
    );

    this._initViews();
    this._$cleanSearchBtn().hide();
    this._renderExtraFilters();

    return this;
  },

  _renderExtraFilters: function() {
    if (this.options.filtersExtrasView && this.options.filtersExtrasView) {
      this.$('.js-filters').append(this.options.filtersExtrasView.render().el);
    }
  },

  _renderContent: function(html) {
    if (this.options.isUsedInDialog) {
      html = this.getTemplate('common/views/paged_search/paged_search_dialog_wrapper')({
        htmlToWrap: html
      })
    }
    this.$el.html(html);

    // Needs to be called after $el html changed:
    if (this.options.isUsedInDialog) {
      this.$el.addClass('Dialog-expandedSubContent');
      this._$tabPane().addClass('Dialog-bodyInnerExpandedWithSubFooter');
    }
  },

  _initBinds: function() {
    this.collection.bind('fetching', function() {
      this._toggleCleanSearchBtn();
      this._activatePane('loading');
    }, this);

    this.collection.bind('error', function(e) {
      // Old requests can be stopped, so aborted requests are not
      // considered as an error
      if (!e || (e && e.statusText !== "abort")) {
        this._activatePane('error');
      }
      this._toggleCleanSearchBtn();
    }, this);

    this.collection.bind('reset', function(collection) {
      this.paginationModel.set({
        total_count: this.collection.totalCount(),
        current_page: this.options.pagedSearchModel.get('page')
      });
      this._activatePane(this.collection.totalCount() > 0 ? 'list' : 'no_results');
      this._toggleCleanSearchBtn();
    }, this);

    this.paginationModel.bind('change:current_page', function(mdl, newPage) {
      this.options.pagedSearchModel.set('page', newPage);
      this.options.pagedSearchModel.fetch(this.collection);
    }, this);

    this.add_related_model(this.options.pagedSearchModel);
    this.add_related_model(this.collection);
    this.add_related_model(this.paginationModel);
  },

  _toggleCleanSearchBtn: function() {
    this._$cleanSearchBtn().toggle(!!this.options.pagedSearchModel.get('q'))
  },

  _initViews: function() {
    this._panes = new cdb.ui.common.TabPane({
      el: this._$tabPane()
    });
    this.addView(this._panes);

    this._panes.addTab('list',
      ViewFactory.createByList([
        this._createListView(),
        new PaginationView({
          className: 'CDB-Text CDB-Size-medium Pagination Pagination--shareList',
          model: this.paginationModel
        })
      ])
    );

    this._panes.addTab('error',
      ViewFactory.createByTemplate('common/templates/fail', {
        msg: ''
      })
    );

    this._panes.addTab('no_results',
      ViewFactory.createByTemplate('common/templates/no_results', {
        icon: this.options.noResults.icon || 'CDB-IconFont-defaultUser',
        title: this.options.noResults.title || 'Oh! No results',
        msg: this.options.noResults.msg || 'Unfortunately we could not find anything with these parameters'
      })
    );

    this._panes.addTab('loading',
      ViewFactory.createByTemplate('common/templates/loading', {
        title: 'Searching',
        quote: randomQuote()
      })
    );

    if (this.options.pagedSearchModel.get('q')) {
      this._focusSearchInput();
    }

    this._activatePane(this._chooseActivePaneName(this.collection.totalCount()));
  },

  _createListView: function() {
    var view = this.options.createListView();
    if (view instanceof cdb.core.View) {
      return view;
    } else {
      cdb.log.error('createListView function must return a view');
      // fallback for view to not fail miserably
      return new cdb.core.View();
    }
  },

  _activatePane: function(name) {
    // Only change active pane if the panes is actually initialized
    if (this._panes && this._panes.size() > 0) {
      // explicit render required, since tabpane doesn't do it
      this._panes.active(name).render();
    }
  },

  _chooseActivePaneName: function(totalCount) {
    if (totalCount === 0) {
      return 'no_results';
    } else if (totalCount > 0) {
      return 'list';
    } else {
      return 'loading';
    }
  },

  _focusSearchInput: function() {
    // also selects the current search str on the focus
    this._$searchInput().focus().val(this._$searchInput().val());
  },

  _onSearchClick: function(ev) {
    this.killEvent(ev);
    this._$searchInput().focus();
  },

  _onCleanSearchClick: function(ev) {
    this.killEvent(ev);
    this._cleanSearch();
  },

  _onKeyDown: function(ev) {
    var enterPressed = (ev.keyCode == $.ui.keyCode.ENTER);
    var escapePressed = (ev.keyCode == $.ui.keyCode.ESCAPE);
    if (enterPressed) {
      this.killEvent(ev);
      this._submitSearch();
    } else if (escapePressed) {
      this.killEvent(ev);
      if (this.options.pagedSearchModel.get('q')) {
        this._cleanSearch();
      }
    }
  },

  _submitSearch: function(e) {
    this._makeNewSearch(Utils.stripHTML(this._$searchInput().val().trim()));
  },

  _cleanSearch: function() {
    this._$searchInput().val('');
    this._makeNewSearch();
  },

  _makeNewSearch: function(query) {
    this.options.pagedSearchModel.set({
      q: query,
      page: 1
    });
    this.options.pagedSearchModel.fetch(this.collection);
  },

  _$searchInput: function() {
    return this.$('.js-search-input');
  },

  _$cleanSearchBtn: function() {
    return this.$('.js-clean-search');
  },

  _$tabPane: function() {
    return this.$('.js-tab-pane');
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../view_factory":11,"../../view_helpers/random_quote":15,"../pagination/model":27,"../pagination/view":28}],27:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);

/**
 * View model intended to be responsible for pagination logic, and to be used in conjunction with a Pagination view.
 */
module.exports = cdb.core.Model.extend({
  defaults: {
    total_count:          0,
    per_page:             10,
    current_page:         1,
    display_count:        5,
    extras_display_count: 1,
    url_to:               undefined
  },

  pagesCount: function() {
    return Math.max(
        Math.ceil(
          this.get('total_count') / this.get('per_page')
        ), 1);
  },

  isCurrentPage: function(page) {
    return this.get('current_page') === page;
  },

  shouldBeVisible: function() {
    var pagesCount = this.pagesCount();
    return this.get('total_count') > 0 && pagesCount > 1 && this.get('current_page') <= pagesCount;
  },

  urlTo: function(page) {
    if (this.hasUrl()) {
      return this.get('url_to')(page);
    }
  },

  hasUrl: function() {
    return typeof this.get('url_to') === 'function';
  },

  /**
   * Get the pages that are expected to be displayed.
   * The current page will be in the middle of the returned sequence.
   *
   * @returns {number[]} a sequence of Numbers
   */
  pagesToDisplay: function() {
    var rangeStart;

    if (this._inLowRange()) {
      rangeStart = 1;
    } else if (this._inHighRange()) {
      rangeStart = this.get('current_page') - this._startOffset();
    } else {
      // Somewhere between the low and high boundary
      rangeStart = this.pagesCount() - this.get('display_count') + 1;
    }
    rangeStart = Math.max(rangeStart, 1);

    return this._withExtraPages(
      _.range(rangeStart, this._rangeEnd(rangeStart))
    );
  },

  _withExtraPages: function(pagesRelativeToCurrentPage) {
    var lastPage = this.pagesCount();
    var extraCount = this.get('extras_display_count');
    var extraStartPages = _.range(1, extraCount + 1);
    var extraEndPages = _.range(lastPage - extraCount + 1, lastPage + 1);

    var startPagesDiff = pagesRelativeToCurrentPage[0] - extraStartPages.slice(-1)[0];
    if (startPagesDiff === 2) {
      // There is only one missing page in the gap, so add it
      extraStartPages.push(pagesRelativeToCurrentPage[0] - 1);
    } else if (startPagesDiff > 2) {
      // There are more hidden pages at low range, add padding at end
      extraStartPages.push(-1);
    }

    var endPagesDiff = extraEndPages[0] - pagesRelativeToCurrentPage.slice(-1);
    if (endPagesDiff === 2) {
      // There is only one missing page in the gap, so add it
      extraEndPages.unshift(extraEndPages[0] - 1);
    } if (endPagesDiff > 2) {
      // There are more hidden pages at high range, add padding at beginning
      extraEndPages.unshift(-2);
    }

    return _.union(extraStartPages, pagesRelativeToCurrentPage, extraEndPages);
  },

  _inLowRange: function() {
    return this.get('current_page') < this._startOffset();
  },

  _inHighRange: function() {
    return this.get('current_page') < this._highBoundary();
  },

  _highBoundary: function() {
    return this.pagesCount() - this._startOffset();
  },

  _startOffset: function() {
    return Math.floor(this.get('display_count') / 2);
  },

  _rangeEnd: function(rangeStart) {
    // If we are too close to the range end then cap to the pages count.
    return Math.min(rangeStart + this.get('display_count'), this.pagesCount() + 1);
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],28:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);
var navigateThroughRouter = require('../../view_helpers/navigate_through_router');

/**
 * Responsible for pagination.
 *
 * Expected to be created with a pagination model, see the model for available params, here we create w/ the minimum:
 *   new PaginationView({
 *     model: new PaginationModel({
 *       // Compulsory:
 *       urlTo:  function(page) { return '/?page='+ page },

         // Optional, to router clicks on <a> tags through router.navigate by default
 *       router: new Router(...)
 *     })
 *   });
 */
module.exports = cdb.core.View.extend({

  className: 'Pagination CDB-Text CDB-Size-medium',

  events: {
    'click a': '_paginate'
  },

  initialize: function() {
    this.template = cdb.templates.getTemplate('common/views/pagination/template');
    this.router = this.options.router;

    if (this.router && !this.model.hasUrl()) {
      throw new Error('since router is set the model must have a url method set too');
    }

    this.model.bind('change', this.render, this);
  },

  render: function() {
    if (this.model.shouldBeVisible()) {
      this.$el.html(
        this.template({
          m: this.model,
          pagesCount: this.model.pagesCount(),
          currentPage: this.model.get('current_page')
        })
      );
      this.$el.addClass(this.className);
      this.delegateEvents();
    } else {
      this.$el.html('');
    }

    return this;
  },

  _paginate: function(ev) {
    if (this.router) {
      navigateThroughRouter.apply(this, arguments);
    } else if (!this.model.hasUrl()) {
      this.killEvent(ev);
    }

    var page = $(ev.target).data('page');
    this.model.set('current_page', page);
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../view_helpers/navigate_through_router":13}],29:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var BaseDialog = require('../common/views/base_dialog/view');
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);

module.exports = BaseDialog.extend({

  events: function() {
    return _.extend({}, BaseDialog.prototype.events, {
      'click .js-ok' : '_regenerateKeys'
    });
  },

  initialize: function() {
    this.elder('initialize');
    this.template = cdb.templates.getTemplate('keys/views/regenerate_keys_dialog');
  },

  render_content: function() {
    return this.template({
      type: this.options.type,
      scope: this.options.scope,
      form_action: this.options.form_action,
      authenticity_token: this.options.authenticity_token,
      method: this.options.method || 'post'
    });
  },

  _regenerateKeys: function() {
    this.trigger('done');
    this.close();
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../common/views/base_dialog/view":16}],30:[function(require,module,exports){
(function (global){
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);

/**
 *  Color picker for organization brand color
 *
 */

module.exports = cdb.core.View.extend({

  events: {
    'click': '_openPicker'
  },

  initialize: function () {
    this.model = new cdb.core.Model({ color: this.options.color });
    this._initBinds();
  },

  _initBinds: function () {
    this.model.bind('change:color', this._onChangeColor, this);
  },

  _onChangeColor: function () {
    var color = this.model.get('color');
    this.$el.css('background-color', color);
    this.trigger('colorChosen', color, this);
  },

  _createPicker: function () {
    this.colorPicker = new cdb.admin.ColorPicker({
      className: 'dropdown color_picker border',
      target: this.$el,
      vertical_position: 'up',
      horizontal_position: 'left',
      vertical_offset: 5,
      horizontal_offset: 17,
      tick: 'left',
      dragUpdate: true
    }).bind('colorChosen', this._setColor, this);

    this._bindPicker();
    this.addView(this.colorPicker);
  },

  _openPicker: function (e) {
    this.killEvent(e);

    if (this.colorPicker) {
      this._destroyPicker();
      return false;
    }

    if (!this.colorPicker) {
      this._createPicker();
      $('body').append(this.colorPicker.render().el);
      this.colorPicker.init(this.model.get('color'));
    }
  },

  _destroyPicker: function () {
    if (this.colorPicker) {
      this._unbindPicker();
      this.removeView(this.colorPicker);
      this.colorPicker.hide();
      delete this.colorPicker;
    }
  },

  _bindPicker: function () {
    cdb.god.bind('closeDialogs', this._destroyPicker, this);
  },

  _unbindPicker: function () {
    cdb.god.unbind('closeDialogs', this._destroyPicker, this);
  },

  _setColor: function (color, close) {
    if (color) {
      this.model.set('color', color);
    }
    if (close) {
      this._destroyPicker();
    }
  },

  clean: function () {
    this._destroyPicker();
    this.elder('clean');
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],31:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var BaseDialog = require('../common/views/base_dialog/view');

module.exports = BaseDialog.extend({

  options: {
    authenticityToken: '',
    organizationUser: {}
  },

  className: 'Dialog is-opening',

  initialize: function () {
    this.elder('initialize');
    this.template = cdb.templates.getTemplate('organization/views/delete_org_user');
  },

  render_content: function () {
    return this.template({
      username: this.options.organizationUser.get('username'),
      formAction: cdb.config.prefixUrl() + '/organization/users/' + this.options.organizationUser.get('username'),
      authenticityToken: this.options.authenticityToken
    });
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../common/views/base_dialog/view":16}],32:[function(require,module,exports){
(function (global){
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var HeaderView = require('../common/views/dashboard_header_view');
var SupportView = require('../common/support_view');
var HeaderViewModel = require('./header_view_model');
var LocalStorage = require('../common/local_storage');
var OrganizationUserForm = require('./organization_user_form');
var OrganizationUserQuota = require('./organization_user_quota');
var DeleteOrganizationUser = require('./delete_org_user_view');
var DeleteOrganization = require('../common/delete_organization_view');
var AvatarSelector = require('../common/avatar_selector_view');
var ColorPickerView = require('./color_picker_view');
var OrganizationUsersView = require('./organization_users/organization_users_view');
var domainRegExp = /^[a-zA-Z0-9][a-zA-Z0-9-_]{0,61}[a-zA-Z0-9]{0,1}\.([a-zA-Z]{1,6}|[a-zA-Z0-9-]{1,30}\.[a-zA-Z]{2,3})$/;
var RegenerateKeysDialog = require('../keys/regenerate_keys_dialog_view');
var GroupsRouter = require('./groups_admin/router');
var GroupsMainView = require('./groups_admin/groups_main_view');
var FlashMessageModel = require('./flash_message_model');
var FlashMessageView = require('./flash_message_view');
var IconPickerView = require('./icon_picker/organization_icon_picker_view');
var OrganizationNotificationView = require('./organization_notification/organization_notification_view');

if (window.trackJs) {
  window.trackJs.configure({
    userId: window.user_data.username
  });
}

/**
 *  Entry point for the new organization, bootstraps all
 *  dependency models and application.
 */

$(function () {
  cdb.init(function () {
    var self = this;
    var user_data = window.user_data;
    var organization_user_data = window.organization_user_data;
    var organization_data = window.organization_data;

    cdb.templates.namespace = 'cartodb/';
    cdb.config.set('url_prefix', user_data.base_url);

    cdb.config.set(window.config); // import config

    $(document.body).bind('click', function () {
      cdb.god.trigger('closeDialogs');
    });

    var currentUser = new cdb.admin.User(user_data);
    var organizationUser;
    var organization;
    var organizationUsers;

    if (organization_user_data) {
      organizationUser = new cdb.admin.User(organization_user_data);
    }

    if (organization_data) {
      organization = new cdb.admin.Organization(organization_data);
      organizationUsers = organization.users;
    }

    var headerView = new HeaderView({
      el: $('#header'), // pre-rendered in DOM by Rails app
      model: currentUser,
      currentUserUrl: currentUser.viewUrl(),
      viewModel: new HeaderViewModel(),
      localStorage: new LocalStorage()
    });
    headerView.render();

    var flashMessageModel = new FlashMessageModel();
    var flashMessageView = new FlashMessageView({
      model: flashMessageModel
    });
    flashMessageView.render();
    flashMessageView.$el.insertAfter(headerView.$el);

    var supportView = new SupportView({
      el: $('#support-banner'),
      user: currentUser
    });
    supportView.render();

    // Avatar
    if (this.$('.js-avatarSelector').length > 0) {
      var avatarSelector = new AvatarSelector({
        el: this.$('.js-avatarSelector'),
        renderModel: new cdb.core.Model({
          inputName: this.$('.js-fileAvatar').attr('name'),
          name: currentUser.organization.get('name'),
          avatar_url: currentUser.organization.get('avatar_url'),
          id: currentUser.get('id')
        }),
        avatarAcceptedExtensions: window.avatar_valid_extensions
      });

      avatarSelector.render();
    }

    // Tooltips
    $('[data-title]').each(function (i, el) {
      new cdb.common.TipsyTooltip({ // eslint-disable-line
        el: el,
        title: function () {
          return $(this).attr('data-title');
        }
      });
    });

    // Color picker
    if (this.$('.js-colorPicker').length > 0) {
      new ColorPickerView({
        el: this.$('.js-colorPicker'),
        color: this.$('.js-colorPicker').data('color')
      }).bind('colorChosen', function (color) {
        this.$('.js-colorInput').val(color);
      }, this);
    }

    // Icon picker
    if (this.$('.js-iconPicker').length > 0) {
      this.icon_picker_view = new IconPickerView({
        el: this.$('.js-iconPicker'),
        orgId: currentUser.organization.get('id')
      });
    }

    // Domain whitelisting
    if (this.$('.js-domains').length > 0) {
      this.$('.js-domainsList').tagit({
        allowSpaces: false,
        singleField: true,
        singleFieldNode: this.$('.js-whitelist'),
        fieldName: this.$('.js-whitelist').attr('name'),
        tagLimit: 10,
        readOnly: false,
        onBlur: function () {
          self.$('.js-domains').removeClass('is-focus');

          if ($('.tagit-choice').length > 0) {
            $('.js-placeholder').hide();
          } else {
            $('.js-placeholder').show();
          }

          if ($('.tagit-new').length > 0) {
            $('.tagit-new input').val('');
          }
        },
        onFocus: function () {
          self.$('.js-domains').addClass('is-focus');

          $('.js-placeholder').hide();
        },
        beforeTagAdded: function (ev, ui) {
          if (!domainRegExp.test(ui.tagLabel)) {
            return false;
          }

          if ($('.tagit-choice').length > 0) {
            $('.js-placeholder').hide();
          } else { $('.js-placeholder').show(); }
        },
        afterTagAdded: function (ev, ui) {
          if ($('.tagit-choice').length > 0) {
            $('.js-placeholder').hide();
          } else { $('.js-placeholder').show(); }
        }
      });
    }

    // Organization user form
    if (organizationUser) {
      this.organization_user_form = new OrganizationUserForm({
        el: this.$('.js-organizationUserForm'),
        model: organizationUser
      });
    }

    // User quota main view
    if (organizationUser) {
      this.organization_user_quota = new OrganizationUserQuota({
        el: this.$('.js-userQuota'),
        model: organizationUser
      });
    }

    // Organization users list
    if (this.$('.js-orgUsersList').length === 1) {
      this.organizationUsersView = new OrganizationUsersView({
        el: this.$('.js-orgUsersList'),
        organization: organization,
        organizationUsers: organizationUsers,
        currentUser: currentUser
      });
      this.organizationUsersView.render();
    }

    // User deletion
    if (this.$('.js-deleteAccount').length > 0 && window.authenticity_token) {
      this.$('.js-deleteAccount').click(function (ev) {
        if (ev) {
          ev.preventDefault();
        }
        new DeleteOrganizationUser({
          organizationUser: organizationUser,
          authenticityToken: window.authenticity_token,
          clean_on_hide: false
        }).appendToBody();
      });
    }

    // Organization deletion
    if (this.$('.js-deleteOrganization').length > 0 && window.authenticity_token) {
      this.$('.js-deleteOrganization').click(function (ev) {
        if (ev) {
          ev.preventDefault();
        }
        new DeleteOrganization({
          authenticityToken: window.authenticity_token,
          clean_on_hide: true,
          user: currentUser
        }).appendToBody();
      });
    }

    // Notifications
    if (this.$('.js-OrganizationNotification').length > 0) {
      var authenticityToken = $('[name=authenticity_token][value]').get(0).value;

      this.organization_notification_view = new OrganizationNotificationView({
        el: this.$('.js-OrganizationNotification'),
        authenticityToken: authenticityToken
      });
      this.organization_notification_view.render();
    }

    // API keys
    var regenerateApiKeyHandler = function (ev, scope, form_action) {
      if (ev) ev.preventDefault();
      var authenticity_token = $('[name=authenticity_token][value]').get(0).value;
      var dlg = new RegenerateKeysDialog({
        type: 'api',
        scope: scope,
        form_action: form_action,
        authenticity_token: authenticity_token
      });

      dlg.appendToBody();
    };

    var toggleUserQuotas = function () {
      var viewer = $('.js-userViewerOption:checked').val();
      if (viewer === 'true') {
        $('.user-quotas').hide();
        $('.js-org-admin-row').hide();
        $('#org_admin').prop('checked', false);
      } else {
        $('.user-quotas').show();
        $('.js-org-admin-row').show();
      }
    };

    toggleUserQuotas();

    $('.js-userViewerOption').bind('change', function (ev) {
      toggleUserQuotas();
    });

    $('.js-regenerateOrgUsersApiKey').bind('click', function (ev) {
      var current_username = $(this).attr('data-current_username');

      regenerateApiKeyHandler(ev, 'organization', '/u/' + current_username + '/organization/regenerate_api_keys');
    });

    $('.js-regenerateOrgUserApiKey').bind('click', function (ev) {
      var username = $(this).attr('data-username');
      var current_username = $(this).attr('data-current_username');

      regenerateApiKeyHandler(ev, 'organization_user', '/u/' + current_username + '/organization/users/' + username + '/regenerate_api_key');
    });

    var $groups = $('.js-groups-content');
    if ($groups) {
      if (!currentUser.isOrgAdmin()) {
        window.location = currentUser.viewUrl().accountSettings();
        return false;
      }

      var groups = new cdb.admin.OrganizationGroups([], {
        organization: currentUser.organization
      });
      var router = new GroupsRouter({
        rootUrl: currentUser.viewUrl().organization().groups(),
        flashMessageModel: flashMessageModel,
        groups: groups,
        user: currentUser
      });

      var groupsMainView = new GroupsMainView({
        el: $groups,
        groups: groups,
        router: router,
        user: currentUser
      });
      groupsMainView.render();
      window.groups = groupsMainView;

      router.enableAfterMainView();
    }
  });
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../common/avatar_selector_view":2,"../common/delete_organization_view":3,"../common/local_storage":5,"../common/support_view":10,"../common/views/dashboard_header_view":25,"../keys/regenerate_keys_dialog_view":29,"./color_picker_view":30,"./delete_org_user_view":31,"./flash_message_model":33,"./flash_message_view":34,"./groups_admin/groups_main_view":46,"./groups_admin/router":47,"./header_view_model":49,"./icon_picker/organization_icon_picker_view":56,"./organization_notification/organization_notification_view":60,"./organization_user_form":62,"./organization_user_quota":63,"./organization_users/organization_users_view":69}],33:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);

module.exports = cdb.core.Model.extend({

  defaults: {
    msg: '',
    display: false
  },

  shouldDisplay: function () {
    return this.get('display') && !!this.get('msg');
  },

  show: function (str) {
    return this.set({
      display: true,
      msg: str
    });
  },

  hide: function () {
    this.set('display', false);
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],34:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);

/**
 * View for a flash message to be displayed at the header.
 */
module.exports = cdb.core.View.extend({

  className: 'FlashMessage FlashMessage--error CDB-Text',

  initialize: function () {
    if (!this.model) throw new Error('model is required');

    this._template = cdb.templates.getTemplate('organization/flash_message');

    this.model.on('change', this.render, this);
  },

  render: function () {
    this.$el.toggle(this.model.shouldDisplay());
    this.$el.html(this._html());

    return this;
  },

  _html: function () {
    return this._template({
      str: this.model.get('msg')
    });
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],35:[function(require,module,exports){
(function (global){
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var AddGroupUsersView = require('../../common/dialogs/add_group_users/add_group_users_view');
var ViewFactory = require('../../common/view_factory');
var randomQuote = require('../../common/view_helpers/random_quote');

/**
 * View for the add/remove button in the filters part.
 */
module.exports = cdb.core.View.extend({

  className: 'Filters-group',

  events: {
    'click .js-add-users': '_onClickAddUsers',
    'click .js-rm-users': '_onClickRemoveUsers'
  },

  initialize: function () {
    _.each(['group', 'orgUsers'], function (name) {
      if (!this.options[name]) throw new Error(name + ' is required');
    }, this);

    this.options.group.users.on('change:selected', this._onChangeSelectedUser, this);
    this.options.group.users.on('add remove reset', this.render, this);
    this.add_related_model(this.options.group.users);
  },

  render: function () {
    this.$el.html(
      this.getTemplate('organization/groups_admin/add_or_remove_group_users_filters_extra')({
      })
    );
    return this;
  },

  _onClickAddUsers: function (ev) {
    this.killEvent(ev);
    this._openAddGroupsUsersDialog();
  },

  _openAddGroupsUsersDialog: function () {
    var addGroupUsersView = new AddGroupUsersView({
      group: this.options.group,
      orgUsers: this.options.orgUsers
    });
    addGroupUsersView.appendToBody();
  },

  _onChangeSelectedUser: function () {
    var hasSelectedUsers = this._selectedUsers().length > 0;
    this.$('.js-add-users').toggle(!hasSelectedUsers);
    this.$('.js-rm-users').toggle(hasSelectedUsers);
  },

  _onClickRemoveUsers: function (ev) {
    this.killEvent(ev);
    var selectedUsers = this._selectedUsers();
    if (selectedUsers.length > 0) {
      var userIds = _.pluck(selectedUsers, 'id');

      var loadingView = ViewFactory.createDialogByTemplate('common/templates/loading', {
        title: 'Removing users',
        quote: randomQuote()
      });
      loadingView.appendToBody();

      this.options.group.users.removeInBatch(userIds)
        .always(function () {
          loadingView.close();
        })
        .fail(function () {
          var errorView = ViewFactory.createDialogByTemplate('common/templates/fail', {
            msg: ''
          });
          errorView.appendToBody();
        });
    }
  },

  _selectedUsers: function () {
    return this.options.group.users.where({ selected: true });
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../common/dialogs/add_group_users/add_group_users_view":4,"../../common/view_factory":11,"../../common/view_helpers/random_quote":15}],36:[function(require,module,exports){
(function (global){
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var randomQuote = require('../../common/view_helpers/random_quote');

/**
 * View to create a new group for an organization.
 */
module.exports = cdb.core.View.extend({

  tagName: 'form',

  events: {
    'click .js-create': '_onClickCreate',
    'submit form': '_onClickCreate',
    'keyup .js-name': '_onChangeName'
  },

  initialize: function () {
    _.each(['group', 'onCreated', 'flashMessageModel'], function (name) {
      if (!this.options[name]) throw new Error(name + ' is required');
    }, this);

    this.model = new cdb.core.Model();
    this._initBinds();
  },

  render: function () {
    if (this.model.get('isLoading')) {
      this.$el.html(
        this.getTemplate('common/templates/loading')({
          title: 'Creating group',
          quote: randomQuote()
        })
      );
    } else {
      this.$el.html(
        this.getTemplate('organization/groups_admin/create_group')({
        })
      );
    }
    return this;
  },

  _initBinds: function () {
    this.model.on('change:isLoading', this.render, this);
  },

  _onClickCreate: function (ev) {
    this.killEvent(ev);
    var name = this._name();
    if (name) {
      this.model.set('isLoading', true);
      this.options.group.save({
        display_name: name
      }, {
        wait: true,
        success: this.options.onCreated,
        error: this._showErrors.bind(this)
      });
    }
  },

  _showErrors: function (m, res, req) {
    this.model.set('isLoading', false);

    var str;
    try {
      str = res && JSON.parse(res.responseText).errors.join('. ');
    } catch (err) {
      str = 'Could not create group for some unknown reason, please try again';
    }

    this.options.flashMessageModel.show(str);
  },

  _onChangeName: function () {
    this.options.flashMessageModel.hide();
    this.$('.js-create').toggleClass('is-disabled', this._name().length === 0);
  },

  _name: function () {
    return this.$('.js-name').val();
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../common/view_helpers/random_quote":15}],37:[function(require,module,exports){
(function (global){
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var randomQuote = require('../../common/view_helpers/random_quote');

/**
 * View to edit an organization group.
 */
module.exports = cdb.core.View.extend({

  tagName: 'form',

  events: {
    'click .js-delete': '_onClickDelete',
    'click .js-save': '_onClickSave',
    'submit form': '_onClickSave',
    'keyup .js-name': '_onChangeName'
  },

  initialize: function () {
    _.each(['group', 'onSaved', 'onDeleted', 'flashMessageModel'], function (name) {
      if (!this.options[name]) throw new Error(name + ' is required');
    }, this);
    this.model = new cdb.core.Model();
    this._initBinds();
  },

  render: function () {
    if (this.model.get('isLoading')) {
      this.$el.html(
        this.getTemplate('common/templates/loading')({
          title: this.model.get('loadingText'),
          quote: randomQuote()
        })
      );
    } else {
      this.$el.html(
        this.getTemplate('organization/groups_admin/edit_group')({
          displayName: this.options.group.get('display_name')
        })
      );
    }
    return this;
  },

  _initBinds: function () {
    this.model.on('change:isLoading', this.render, this);
  },

  _onClickSave: function (ev) {
    this.killEvent(ev);
    var name = this._name();
    if (name && name !== this.options.group.get('display_name')) {
      this._setLoading('Saving changes');
      this.options.group.save({
        display_name: name
      }, {
        wait: true,
        success: this.options.onSaved,
        error: this._showErrors.bind(this)
      });
    }
  },

  _onClickDelete: function (ev) {
    this.killEvent(ev);
    this._setLoading('Deleting group');
    this.options.group.destroy({
      wait: true,
      success: this.options.onDeleted,
      error: this._showErrors.bind(this)
    });
  },

  _setLoading: function (msg) {
    this.options.flashMessageModel.hide();
    this.model.set({
      isLoading: !!msg,
      loadingText: msg
    });
  },

  _showErrors: function (m, res, req) {
    this._setLoading('');

    var str;
    try {
      str = res && JSON.parse(res.responseText).errors.join('. ');
    } catch (err) {
      str = 'Could not update group for some unknown reason, please try again';
    }

    this.options.flashMessageModel.show(str);
  },

  _onChangeName: function () {
    this.$('.js-save').toggleClass('is-disabled', this._name().length === 0);
    this.options.flashMessageModel.hide();
  },

  _name: function () {
    return this.$('.js-name').val();
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../common/view_helpers/random_quote":15}],38:[function(require,module,exports){
(function (global){
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var ViewFactory = require('../../common/view_factory');
var randomQuote = require('../../common/view_helpers/random_quote');

/**
 * View for the add users button and state.
 */
module.exports = cdb.core.View.extend({

  className: 'Filters-group',

  events: {
    'click .js-add-users': '_onClickAddUsers'
  },

  initialize: function () {
    _.each(['groupUsers', 'orgUsers'], function (name) {
      if (!this.options[name]) throw new Error(name + ' is required');
    }, this);

    // Init binds
    this.options.orgUsers.on('change:selected', this._onChangeSelectedUser, this);
    this.add_related_model(this.options.orgUsers);
  },

  render: function () {
    this.$el.html(
      this.getTemplate('organization/groups_admin/empty_group_filters_extra')({
      })
    );
    return this;
  },

  _onChangeSelectedUser: function () {
    this.$('.js-add-users').toggleClass('is-disabled', this._selectedUsers().length === 0);
  },

  _onClickAddUsers: function (ev) {
    this.killEvent(ev);
    var selectedUsers = this._selectedUsers();
    if (selectedUsers.length > 0) {
      var userIds = _.pluck(selectedUsers, 'id');
      var loadingView = this._createLoadingView();
      loadingView.appendToBody();

      this.options.groupUsers.addInBatch(userIds)
        .always(function () { loadingView.close(); })
        .fail(function () {
          ViewFactory.createDialogByTemplate('common/templates/fail', { msg: '' }).appendToBody();
        });
    }
  },

  _createLoadingView: function () {
    return ViewFactory.createDialogByTemplate('common/templates/loading', {
      title: 'Adding users',
      quote: randomQuote()
    });
  },

  _selectedUsers: function () {
    return this.options.orgUsers.where({ selected: true });
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../common/view_factory":11,"../../common/view_helpers/random_quote":15}],39:[function(require,module,exports){
(function (global){
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var pluralizeString = require('../../common/view_helpers/pluralize_string');

/**
 * Header view when looking at details of a specific group.
 */
module.exports = cdb.core.View.extend({

  initialize: function () {
    _.each(['group', 'urls'], function (name) {
      if (!this.options[name]) throw new Error(name + ' is required');
    }, this);
    this._initBinds();
  },

  render: function () {
    this._$orgSubheader().hide();
    var group = this.options.group;
    var isNewGroup = group.isNew();
    var d = {
      backUrl: this.options.urls.root,
      title: group.get('display_name') || 'Create new group',
      isNewGroup: isNewGroup,
      usersUrl: false
    };

    if (isNewGroup) {
      d.editUrl = window.location;
      d.editUrl.isCurrent = true;
    } else {
      d.editUrl = this.options.urls.edit;
      d.usersUrl = this.options.urls.users;
      var usersCount = group.users.length;
      d.usersLabel = usersCount === 0 ? 'Users' : usersCount + ' ' + pluralizeString('User', 'Users', usersCount);

      if (!this.options.urls.users.isCurrent) {
        d.backUrl = this.options.urls.users;
      }
    }

    this.$el.html(
      this.getTemplate('organization/groups_admin/group_header')(d)
    );
    return this;
  },

  clean: function () {
    this._$orgSubheader().show();
    cdb.core.View.prototype.clean.call(this);
  },

  _$orgSubheader: function () {
    return $('.js-org-subheader');
  },

  _initBinds: function () {
    var group = this.options.group;
    group.on('change:display_name', this.render, this);
    this.add_related_model(group);

    group.users.on('reset add remove', this.render, this);
    this.add_related_model(group.users);
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../common/view_helpers/pluralize_string":14}],40:[function(require,module,exports){
(function (global){
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var pluralizeStr = require('../../common/view_helpers/pluralize_string');

/**
 * View of a single group user.
 */
module.exports = cdb.core.View.extend({

  tagName: 'li',
  className: 'OrganizationList-user is-selectable',
  events: {
    'click': '_onClick'
  },

  initialize: function () {
    _.each(['model'], function (name) {
      if (!this.options[name]) throw new Error(name + ' is required');
    }, this);
    this._initBinds();
  },

  render: function () {
    this.$el.html(
      this.getTemplate('organization/groups_admin/group_user')({
        avatarUrl: this.model.get('avatar_url'),
        username: this.model.get('username'),
        email: this.model.get('email'),
        maps_count: pluralizeStr.prefixWithCount('map', 'maps', this.model.get('all_visualization_count')),
        table_count: pluralizeStr.prefixWithCount('dataset', 'datasets', this.model.get('table_count'))
      })
    );
    return this;
  },

  _initBinds: function () {
    this.model.on('change:selected', this._onChangeSelected, this);
  },

  _onChangeSelected: function (m, isSelected) {
    this.$el.toggleClass('is-selected', !!isSelected);
  },

  _onClick: function (ev) {
    this.killEvent(ev);
    this.model.set('selected', !this.model.get('selected'));
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../common/view_helpers/pluralize_string":14}],41:[function(require,module,exports){
(function (global){
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var GroupUserView = require('./group_user_view');

/**
 * View of group users.
 */
module.exports = cdb.core.View.extend({

  tagName: 'ul',
  className: 'OrganizationList',

  initialize: function () {
    _.each(['users'], function (name) {
      if (!this.options[name]) throw new Error(name + ' is required');
    }, this);

    // init binds
    this.options.users.bind('reset add remove', this.render, this);
    this.add_related_model(this.options.users);
  },

  render: function () {
    this.clearSubViews();
    this._renderUsers();
    return this;
  },

  _renderUsers: function () {
    this.options.users.each(this._createUserView, this);
  },

  _createUserView: function (user) {
    var view = new GroupUserView({
      model: user
    });

    this.addView(view);
    this.$el.append(view.render().el);
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./group_user_view":40}],42:[function(require,module,exports){
(function (global){
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var PagedSearchView = require('../../common/views/paged_search/paged_search_view');
var PagedSearchModel = require('../../common/paged_search_model');
var ViewFactory = require('../../common/view_factory');
var randomQuote = require('../../common/view_helpers/random_quote');
var AddRemoveFiltersExtraView = require('./add_or_remove_group_users_filters_extra_view');
var EmptyGroupFiltersExtraView = require('./empty_group_filters_extra_view');
var GroupUsersListView = require('./group_users_list_view');

/**
 * View to manage users of a group
 * It basically has two states, each which relies on its own collection:
 * - Empty group: i.e. no users, show organization users and allow to add users directly by selecting
 * - Group users: allow to add or remove users from group.
 */
module.exports = cdb.core.View.extend({

  initialize: function () {
    _.each(['group', 'orgUsers'], function (name) {
      if (!this.options[name]) throw new Error(name + ' is required');
    }, this);

    this._groupUsers = this.options.group.users;
    this._orgUsers = this.options.orgUsers;
    this._orgUsers.excludeCurrentUser(false);
    this._hasPrefetchedGroupUsers = false;
    this.model = new cdb.core.Model({
      hasPrefetchedGroupUsers: false,
      lastRendered: null //, 'groupUsers', 'empty'
    });

    // Init binds
    this._groupUsers.bind('reset', this._onResetGroupUsers, this);
    this.add_related_model(this._groupUsers);

    // Pre-fetch to know what view to render
    var self = this;
    this._groupUsers.fetch({
      success: function () {
        self.model.set('hasPrefetchedGroupUsers', true);
        self.render();
      }
    });
  },

  render: function () {
    this.clearSubViews();
    this.$el.empty();

    var view;
    if (this.model.get('hasPrefetchedGroupUsers')) {
      view = this._groupUsers.totalCount() > 0
        ? this._createViewForGroupUsers()
        : this._createViewForEmptyGroup();
    } else {
      view = this._createInitialPreloadingView();
    }

    this.addView(view);
    this.$el.append(view.render().el);

    return this;
  },

  clean: function () {
    this._orgUsers.restoreExcludeCurrentUser();
    this.elder('clean');
  },

  _createInitialPreloadingView: function () {
    return ViewFactory.createByTemplate('common/templates/loading', {
      title: 'Getting users',
      quote: randomQuote()
    });
  },

  _createViewForGroupUsers: function () {
    this.model.set('lastRendered', 'groupUsers');

    var filtersExtrasView = new AddRemoveFiltersExtraView({
      group: this.options.group,
      orgUsers: this._orgUsers
    });
    this.addView(filtersExtrasView);

    return new PagedSearchView({
      pagedSearchModel: new PagedSearchModel(),
      collection: this._groupUsers,
      createListView: this._createGroupUsersListView.bind(this, this._groupUsers),
      thinFilters: true,
      filtersExtrasView: filtersExtrasView
    });
  },

  _createViewForEmptyGroup: function () {
    this.model.set('lastRendered', 'empty');

    var filtersExtrasView = new EmptyGroupFiltersExtraView({
      groupUsers: this._groupUsers,
      orgUsers: this._orgUsers
    });
    this.addView(filtersExtrasView);

    return new PagedSearchView({
      pagedSearchModel: new PagedSearchModel(),
      collection: this._orgUsers,
      createListView: this._createGroupUsersListView.bind(this, this._orgUsers),
      thinFilters: true,
      filtersExtrasView: filtersExtrasView
    });
  },

  _createGroupUsersListView: function (usersCollection) {
    return new GroupUsersListView({
      users: usersCollection
    });
  },

  _onResetGroupUsers: function () {
    // just this.render() is not enough, because each sub-view re-renders its view on state changes,
    // Instead, only re-render when hitting the edge-cases after a rest
    var lastRendered = this.model.get('lastRendered');
    var totalGroupUsersCount = this._groupUsers.totalCount();

    if (lastRendered === 'empty') {
      // scenario: added at least one user, so group is no longer empty => change to group users view to add users
      if (totalGroupUsersCount > 0) {
        this.render();
      }
    } else if (lastRendered === 'groupUsers') {
      // scenario: removed last group user(s), so the group is now "empty" => change to org users view to add users
      if (totalGroupUsersCount === 0) {
        this.render();
      }
    }
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../common/paged_search_model":6,"../../common/view_factory":11,"../../common/view_helpers/random_quote":15,"../../common/views/paged_search/paged_search_view":26,"./add_or_remove_group_users_filters_extra_view":35,"./empty_group_filters_extra_view":38,"./group_users_list_view":41}],43:[function(require,module,exports){
(function (global){
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var pluralizeStr = require('../../common/view_helpers/pluralize_string');

/**
 * View for an individual group.
 */
module.exports = cdb.core.View.extend({

  tagName: 'li',
  className: 'OrganizationList-user',
  _PREVIEW_COUNT: 3,

  initialize: function () {
    _.each(['model', 'url'], function (name) {
      if (!this.options[name]) throw new Error(name + ' is required');
    }, this);
  },

  render: function () {
    var sharedMapsCount = this.model.get('shared_maps_count');
    var sharedDatasetsCount = this.model.get('shared_tables_count');
    this.$el.html(
      this.getTemplate('organization/groups_admin/group')({
        displayName: this.model.get('display_name'),
        sharedMapsCount: pluralizeStr('1 shared map', sharedMapsCount + ' shared maps', sharedMapsCount),
        sharedDatasetsCount: pluralizeStr('1 shared dataset', sharedDatasetsCount + ' shared datasets', sharedDatasetsCount),
        url: this.options.url,
        previewUsers: this.model.users.toArray().slice(0, this._PREVIEW_COUNT),
        usersCount: Math.max(this.model.users.length - this._PREVIEW_COUNT, 0)
      })
    );
    return this;
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../common/view_helpers/pluralize_string":14}],44:[function(require,module,exports){
(function (global){
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var GroupsListView = require('./groups_list_view');
var PagedSearchView = require('../../common/views/paged_search/paged_search_view');
var PagedSearchModel = require('../../common/paged_search_model');
var ViewFactory = require('../../common/view_factory');

/**
 * Index view of groups to list groups of an organization
 */
module.exports = cdb.core.View.extend({

  initialize: function () {
    _.each(['groups', 'router', 'newGroupUrl'], function (name) {
      if (!this.options[name]) throw new Error(name + ' is required');
    }, this);
  },

  render: function () {
    this.clearSubViews();

    var pagedSearchView = new PagedSearchView({
      pagedSearchModel: new PagedSearchModel({
        fetch_users: true,
        fetch_shared_maps_count: true,
        fetch_shared_tables_count: true
      }),
      collection: this.options.groups,
      createListView: this._createGroupsView.bind(this),
      thinFilters: true,
      filtersExtrasView: this._createFiltersExtraView(),
      noResults: {
        icon: 'CDB-IconFont-group',
        title: 'You have not created any groups yet',
        msg: 'Creating groups enables you to visualize and search for user members assigned to a business group or team in your organization.'
      }
    });
    this.addView(pagedSearchView);

    this.$el.empty();
    this.$el.append(pagedSearchView.render().el);
    return this;
  },

  _createGroupsView: function () {
    return new GroupsListView({
      groups: this.options.groups,
      newGroupUrl: this.options.newGroupUrl
    });
  },

  _createFiltersExtraView: function () {
    return ViewFactory.createByTemplate('organization/groups_admin/groups_index_filters_extra', {
      createGroupUrl: this.options.router.rootUrl.urlToPath('new')
    }, {
      className: 'Filters-group'
    });
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../common/paged_search_model":6,"../../common/view_factory":11,"../../common/views/paged_search/paged_search_view":26,"./groups_list_view":45}],45:[function(require,module,exports){
(function (global){
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var GroupView = require('./group_view');
var ViewFactory = require('../../common/view_factory');

module.exports = cdb.core.View.extend({

  initialize: function () {
    _.each(['groups'], function (name) {
      if (_.isUndefined(this.options[name])) throw new Error(name + ' is required');
    }, this);
  },

  render: function () {
    this.clearSubViews();
    this.$el.empty();
    this._renderGroupsView();
    return this;
  },

  _renderGroupsView: function () {
    var view = ViewFactory.createByList(this._createGroupViews(), {
      tagName: 'ul',
      className: 'OrganizationList'
    });
    this.addView(view);
    this.$el.append(view.render().el);
  },

  _createGroupViews: function () {
    return this.options.groups.map(function (m) {
      return new GroupView({
        model: m,
        url: this.options.newGroupUrl(m)
      });
    }, this);
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../common/view_factory":11,"./group_view":43}],46:[function(require,module,exports){
(function (global){
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var navigateThroughRouter = require('../../common/view_helpers/navigate_through_router');

/**
 * Controller view, managing view state of the groups entry point
 */
module.exports = cdb.core.View.extend({

  events: {
    'click': '_onClick'
  },

  initialize: function () {
    _.each(['router'], function (name) {
      if (!this.options[name]) throw new Error(name + ' is required');
    }, this);

    this._initBinds();
  },

  render: function () {
    this.clearSubViews();
    this.$el.html(this._contentView().render().el);
    return this;
  },

  _initBinds: function () {
    this.options.router.model.bind('change:view', this._onChangeView, this);
    this.add_related_model(this.options.router.model);
  },

  _onChangeView: function (m) {
    m.previous('view').clean();
    this.render();
  },

  _contentView: function () {
    return this.options.router.model.get('view');
  },

  _onClick: function (e) {
    if (this._isEventTriggeredOutsideOf(e, '.Dialog')) {
      // Clicks outside of any dialog "body" will fire a closeDialogs event
      cdb.god.trigger('closeDialogs');
    }

    if (!this._isEventTriggeredOutsideOf(e, 'a')) {
      var url = $(e.target).closest('a').attr('href');
      if (this.options.router.isWithinCurrentRoutes(url)) {
        navigateThroughRouter.apply(this, arguments);
      }
    }
  },

  _isEventTriggeredOutsideOf: function (ev, selector) {
    return $(ev.target).closest(selector).length === 0;
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../common/view_helpers/navigate_through_router":13}],47:[function(require,module,exports){
(function (global){
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var Router = require('../../common/router');
var RouterModel = require('./router_model');
var GroupHeaderView = require('./group_header_view');
var GroupsIndexView = require('./groups_index_view');
var CreateGroupView = require('./create_group_view');
var GroupUsersView = require('./group_users_view');
var EditGroupView = require('./edit_group_view');
var ViewFactory = require('../../common/view_factory');

/**
 *  Backbone router for organization groups urls.
 */
module.exports = Router.extend({

  routes: Router.supportTrailingSlashes({
    '': 'renderGroupsIndex',
    'new': 'renderCreateGroup',
    ':id': 'renderGroupUsers',
    ':id/edit': 'renderEditGroup',

    // If URL is lacking the trailing slash (e.g. 'http://username.carto.com/organization/groups'), treat it like index
    '*prefix/groups': 'renderGroupsIndex'
  }),

  initialize: function (opts) {
    _.each(['rootUrl', 'groups', 'user', 'flashMessageModel'], function (name) {
      if (!opts[name]) throw new Error(name + ' is required');
    }, this);

    this.model = new RouterModel();
    this.user = opts.user;
    this.groups = opts.groups;
    this.flashMessageModel = opts.flashMessageModel;
    this.rootUrl = opts.rootUrl;
    this.rootPath = this.rootUrl.pathname.bind(this.rootUrl);
    this.model.createLoadingView('Loading view'); // Until router's history is started
    this.model.on('change', this._onChange, this);
  },

  normalizeFragmentOrUrl: function (fragmentOrUrl) {
    return fragmentOrUrl ? fragmentOrUrl.toString().replace(this.rootUrl.toString(), '') : '';
  },

  isWithinCurrentRoutes: function (url) {
    return url.indexOf(this.rootUrl.pathname()) !== -1;
  },

  renderGroupsIndex: function () {
    this.model.set('view',
      new GroupsIndexView({
        newGroupUrl: this._groupUrl.bind(this),
        groups: this.groups,
        router: this
      })
    );
  },

  renderCreateGroup: function () {
    var group = this.groups.newGroupById();
    var self = this;
    this.model.set('view',
      ViewFactory.createByList([
        self._createGroupHeader(group),
        new CreateGroupView({
          flashMessageModel: self.flashMessageModel,
          group: group,
          onCreated: self._navigateToGroup.bind(self, group)
        })
      ])
    );
  },

  renderGroupUsers: function (id) {
    var self = this;
    this.model.createGroupView(this.groups, id, function (group) {
      return ViewFactory.createByList([
        self._createGroupHeader(group, 'group_users'),
        new GroupUsersView({
          group: group,
          orgUsers: self.user.organization.users
        })
      ]);
    });
  },

  renderEditGroup: function (id) {
    var self = this;
    this.model.createGroupView(this.groups, id, function (group) {
      return ViewFactory.createByList([
        self._createGroupHeader(group, 'edit_group'),
        new EditGroupView({
          flashMessageModel: self.flashMessageModel,
          group: group,
          onSaved: self._navigateToGroup.bind(self, group),
          onDeleted: self.navigate.bind(self, self.rootUrl, { trigger: true })
        })
      ]);
    });
  },

  _navigateToGroup: function (group) {
    this.navigate(this.rootUrl.urlToPath(group.id), { trigger: true });
  },

  _groupUrl: function (group, subpath) {
    var path = group.id;

    if (subpath) {
      path += '/' + subpath;
    }

    return this.rootUrl.urlToPath(path);
  },

  _createGroupHeader: function (group, current) {
    var urls = {
      root: this.rootUrl,
      users: this._groupUrl(group),
      edit: this._groupUrl(group, 'edit')
    };
    urls.users.isCurrent = current === 'group_users';
    urls.edit.isCurrent = current === 'edit_group';

    return new GroupHeaderView({
      group: group,
      urls: urls
    });
  },

  _onChange: function () {
    this.flashMessageModel.hide();
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../common/router":7,"../../common/view_factory":11,"./create_group_view":36,"./edit_group_view":37,"./group_header_view":39,"./group_users_view":42,"./groups_index_view":44,"./router_model":48}],48:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var ViewFactory = require('../../common/view_factory');
var randomQuote = require('../../common/view_helpers/random_quote');

/**
 * Model representing the router state
 */
module.exports = cdb.core.Model.extend({

  defaults: {
    view: ''
  },

  createGroupView: function (groups, id, fetchedCallback) {
    var self = this;
    var group = groups.newGroupById(id);
    fetchedCallback = fetchedCallback.bind(this, group);

    var setFetchedCallbackView = function () {
      self.set('view', fetchedCallback());
    };

    if (group.get('display_name')) {
      setFetchedCallbackView();
    } else {
      // No display name == model not fetched yet, so show loading msg meanwhile
      this.createLoadingView('Loading group details');
      group.fetch({
        data: {
          fetch_users: true
        },
        success: function () {
          groups.add(group);
          setFetchedCallbackView();
        },
        error: this.createErrorView.bind(this)
      });
    }
  },

  createLoadingView: function (msg) {
    this.set('view', ViewFactory.createByTemplate('common/templates/loading', {
      title: msg,
      quote: randomQuote()
    }));
  },

  createErrorView: function () {
    // Generic error view for now
    this.set('view', ViewFactory.createByTemplate('common/templates/fail', {
      msg: ''
    }));
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../common/view_factory":11,"../../common/view_helpers/random_quote":15}],49:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);

/**
 * Header view model to handle state for dashboard header view.
 */
module.exports = cdb.core.Model.extend({

  breadcrumbTitle: function () {
    return 'Configuration';
  },

  isBreadcrumbDropdownEnabled: function () {
    return false;
  },

  isDisplayingDatasets: function () {
    return false;
  },

  isDisplayingMaps: function () {
    return false;
  },

  isDisplayingLockedItems: function () {
    return false;
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],50:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var BaseDialog = require('../../../../../javascripts/cartodb/common/views/base_dialog/view');
var DialogIconPickerView = require('../icons/organization_icons_view');

module.exports = BaseDialog.extend({

  className: 'Dialog Modal IconPickerDialog',

  events: BaseDialog.extendEvents({
    'click .js-addIcon': '_onAddIconClicked'
  }),

  initialize: function () {
    if (!this.options.orgId) { throw new Error('Organization ID is required.'); }
    this._orgId = this.options.orgId;

    this.elder('initialize');

    this._template = cdb.templates.getTemplate('organization/icon_picker/icon_picker_dialog/icon_picker_dialog_template');
  },

  render: function () {
    this.clearSubViews();
    BaseDialog.prototype.render.call(this);
    this.$('.content').addClass('Dialog-content--expanded');
    this._initViews();
    return this;
  },

  _initViews: function () {
    this.icon_picker = new DialogIconPickerView({
      el: this.$('.js-dialogIconPicker'),
      orgId: this._orgId
    });
    this.addView(this.icon_picker);

    this.icon_picker.model.on('change:isProcessRunning', this._onIsProcessRunningChanged, this);
  },

  _onIsProcessRunningChanged: function () {
    var running = this.icon_picker.model.get('isProcessRunning');
    if (running) {
      this.$el.css('pointer-events', 'none');
    } else {
      this.$el.css('pointer-events', 'auto');
    }
  },

  // implements cdb.ui.common.Dialog.prototype.render
  render_content: function () {
    return this._template();
  },

  _onAddIconClicked: function (event) {
    this.killEvent(event);

    this._hideErrorMessage();
    this.$('.js-inputFile').trigger('click');
  },

  _hideErrorMessage: function () {
    this._hide('.js-errorMessage');
  },

  _hide: function (selector) {
    this.$(selector).addClass('is-hidden');
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../../../../javascripts/cartodb/common/views/base_dialog/view":16,"../icons/organization_icons_view":55}],51:[function(require,module,exports){
var BaseDialog = require('../../../../../javascripts/cartodb/common/views/base_dialog/view');

module.exports = BaseDialog.extend({

  initialize: function () {
    if (!this.options.okCallback) {
      throw new Error('Callback for OK action is mandatory.');
    }
    this.elder('initialize');
    this._numOfIcons = this.options.numOfIcons || 0;
    this._okCallback = this.options.okCallback;
  },

  render_content: function () {
    return this.getTemplate('organization/icon_picker/icons/delete_icons_modal')({
      numOfIcons: this._numOfIcons
    });
  },

  ok: function () {
    this._okCallback();
    this.close();
  }
});

},{"../../../../../javascripts/cartodb/common/views/base_dialog/view":16}],52:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var Backbone = (typeof window !== "undefined" ? window['Backbone'] : typeof global !== "undefined" ? global['Backbone'] : null);
var IconModel = require('./organization_icon_model');

module.exports = Backbone.Collection.extend({

  model: IconModel,

  url: function (method) {
    var version = cdb.config.urlVersion('organization-assets', method);
    return '/api/' + version + '/organization/' + this._orgId + '/assets';
  },

  initialize: function (attrs, opts) {
    if (!opts.orgId) {
      throw new Error('Organization ID is required');
    }
    this._orgId = opts.orgId;
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./organization_icon_model":53}],53:[function(require,module,exports){
(function (global){
var Backbone = (typeof window !== "undefined" ? window['Backbone'] : typeof global !== "undefined" ? global['Backbone'] : null);
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);

module.exports = Backbone.Model.extend({

  defaults: {
    selected: false,
    visible: false,
    deleted: false
  },

  fileAttribute: 'resource',

  save: function (attrs, options) {
    options || (options = {});
    attrs || (attrs = _.clone(this.attributes));

    // Filter the data to send to the server
    attrs = _.omit(attrs, ['selected', 'visible', 'deleted']);
    options.data = JSON.stringify(attrs);

    // Proxy the call to the original save function
    return Backbone.Model.prototype.save.call(this, attrs, options);
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],54:[function(require,module,exports){
(function (global){
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);

module.exports = cdb.core.View.extend({
  tagName: 'li',

  className: 'IconList-item IconList-item--small',

  events: {
    'click': '_onClick'
  },

  initialize: function (options) {
    if (_.isUndefined(options.model)) {
      throw new Error('An organization icon model is mandatory.');
    }

    this._template = cdb.templates.getTemplate('organization/icon_picker/icons/organization_icon');
    this._initBinds();
  },

  render: function () {
    this.$el.html(this._template({
      url: this.model.get('public_url')
    }));

    return this;
  },

  _initBinds: function () {
    this.model.on('change:selected', this._onSelectedChanged, this);
    this.model.on('change:deleted', this._onDeletedChanged, this);
  },

  _onClick: function () {
    this.model.set('selected', !this.model.get('selected'));
  },

  _onSelectedChanged: function () {
    this.$el.toggleClass('is-selected', this.model.get('selected'));
  },

  _onDeletedChanged: function () {
    if (this.model.get('deleted')) {
      this.$el.remove();
    }
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],55:[function(require,module,exports){
(function (global){
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var IconCollection = require('./organization_icon_collection');
var IconView = require('./organization_icon_view');
var DeleteIconsDialog = require('./delete_icons_dialog_view');

module.exports = cdb.core.View.extend({

  events: {
    'click .js-addIcon': '_onAddIconClicked',
    'click .js-selectAllIcons': '_onSelectAllIconsClicked',
    'click .js-deselectAllIcons': '_onDeselectAllIconsClicked',
    'click .js-deleteIcons': '_onDeleteIconsClicked',
    'change .js-inputFile': '_onFileSelected'
  },

  initialize: function () {
    if (!this.options.orgId) { throw new Error('Organization ID is required.'); }
    this._orgId = this.options.orgId;

    this.template = cdb.templates.getTemplate('organization/icon_picker/icons/organization_icons_template');
    this.model = new cdb.core.Model({
      isProcessRunning: false
    });
    this._iconCollection = new IconCollection(null, {
      orgId: this._orgId
    });
    this._numOfUploadingProcesses = 0;
    this._numOfDeletingProcesses = 0;
    this._fetchErrorMessage = 'Error fetching organization icons. Please refresh the page.';
    this._runningMessage = '';
    this.render();
    this._fetchAllIcons();
    this._initBinds();
  },

  render: function () {
    this.$el.html(this.template());

    return this;
  },

  _initBinds: function () {
    this._iconCollection.on('change:selected', this._refreshActions, this);
    this.model.on('change:isProcessRunning', this._onProcessRunningChanged, this);
    this.add_related_model(this._iconCollection);
  },

  _fetchAllIcons: function () {
    this._iconCollection.fetch({
      success: this._renderAllIcons.bind(this),
      error: this._onFetchIconsError.bind(this)
    });
  },

  _renderAllIcons: function () {
    _.each(this._iconCollection.models, function (icon) {
      this._addIconElement(icon);
    }, this);
  },

  _onFetchIconsError: function () {
    this._showErrorMessage(this._fetchErrorMessage);
  },

  _renderIcon: function (iconModel) {
    var iconView = new IconView({
      model: iconModel
    });
    iconView.render();
    iconModel.set('visible', true);
    this.$('.js-items').append(iconView.$el);
  },

  _addIconElement: function (iconModel) {
    this._renderIcon(iconModel);
  },

  _onAddIconClicked: function (event) {
    this.killEvent(event);

    this._hideErrorMessage();
    this.$('.js-inputFile').trigger('click');
  },

  _parseResponseText: function (response) {
    if (response && response.responseText) {
      try {
        var text = JSON.parse(response.responseText);
        if (text && text.errors && typeof text.errors === 'string') {
          return text.errors;
        }
      } catch (exc) {
        // Swallow
      }
    }
    return '';
  },

  _getSelectedFiles: function () {
    return this.$('.js-inputFile').prop('files');
  },

  _onFileSelected: function () {
    var files = this._getSelectedFiles();

    _.each(files, function (file) {
      this._iconCollection.create({
        kind: 'organization_asset',
        resource: file
      }, {
        beforeSend: this._beforeIconUpload.bind(this),
        success: this._onIconUploaded.bind(this),
        error: this._onIconUploadError.bind(this),
        complete: this._onIconUploadComplete.bind(this)
      });
    }, this);
  },

  _beforeIconUpload: function () {
    this._numOfUploadingProcesses++;
    if (this._numOfUploadingProcesses > 0) {
      this._runningMessage = 'Uploading icons...';
      this.model.set('isProcessRunning', true);
    }
  },

  _onIconUploaded: function (iconModel) {
    this._resetFileSelection();
    this._addIconElement(iconModel);
  },

  _onIconUploadError: function (model, response) {
    var errorText = this._parseResponseText(response);
    this._resetFileSelection();
    this._showErrorMessage(this._uploadErrorMessage(errorText));
  },

  _onIconUploadComplete: function () {
    this._numOfUploadingProcesses--;
    if (this._numOfUploadingProcesses <= 0) {
      this.model.set('isProcessRunning', false);
    }
  },

  _resetFileSelection: function () {
    this.$('.js-inputFile').val('');
  },

  _show: function (selector) {
    this.$(selector).removeClass('is-hidden');
  },

  _hide: function (selector) {
    this.$(selector).addClass('is-hidden');
  },

  _refreshActions: function () {
    if (this.model.get('isProcessRunning')) {
      return;
    }
    var limit = Math.min(this._iconCollection.length);
    var numOfSelectedIcons = this._getNumberOfSelectedIcons();
    var iconText = (numOfSelectedIcons === 1 ? '1 icon selected' : '' + numOfSelectedIcons + ' icons selected');
    this.$('.js-iconMainLabel').text(iconText);

    if (numOfSelectedIcons === 0) {
      this.$('.js-iconMainLabel').text('');
      this._hide('.js-iconMainLabel, .js-selectAllIcons, .js-deselectAllIcons, .js-deleteIcons');
      this._show('.js-iconsInfo');
    } else if (numOfSelectedIcons < limit) {
      this._show('.js-iconMainLabel, .js-selectAllIcons, .js-deleteIcons');
      this._hide('.js-deselectAllIcons, .js-iconsInfo');
    } else {
      this._show('.js-iconMainLabel, .js-deselectAllIcons, .js-deleteIcons');
      this._hide('.js-selectAllIcons, .js-iconsInfo');
    }

    if (numOfSelectedIcons > 1) {
      this.$('.js-deleteIcons a').text('Delete icons...');
    } else if (numOfSelectedIcons === 1) {
      this.$('.js-deleteIcons a').text('Delete icon...');
    }
  },

  _hideActions: function () {
    this._hide('.js-selectAllIcons, .js-deselectAllIcons, .js-deleteIcons, .js-iconsInfo');
  },

  _onDeselectAllIconsClicked: function (event) {
    event.preventDefault();
    this._iconCollection.each(function (icon) {
      icon.set('selected', false);
    });
  },

  _onSelectAllIconsClicked: function (event) {
    event.preventDefault();
    this._iconCollection.each(function (icon) {
      if (icon.get('visible')) {
        icon.set('selected', true);
      }
    });
  },

  _onDeleteIconsClicked: function (event) {
    event.preventDefault();
    this._openDeleteIconsDialog();
  },

  _bindDeleteIconsDialog: function () {
    cdb.god.bind('closeDialogs:delete', this._destroyDeleteIconsDialog, this);
  },

  _unbindDeleteIconsDialog: function () {
    cdb.god.unbind('closeDialogs:delete', this._destroyDeleteIconsDialog, this);
  },

  _openDeleteIconsDialog: function (e) {
    this.killEvent(e);

    cdb.god.trigger('closeDialogs:delete');

    this.delete_icons_dialog = new DeleteIconsDialog({
      numOfIcons: this._getNumberOfSelectedIcons(),
      okCallback: this._deleteIcons.bind(this)
    });

    this.delete_icons_dialog.appendToBody();

    this._bindDeleteIconsDialog();
    this.addView(this.delete_icons_dialog);
  },

  _deleteIcons: function () {
    this._hideErrorMessage();
    var iconsToDelete = this._iconCollection.where({ selected: true });

    _.each(iconsToDelete, function (icon) {
      icon.destroy({
        beforeSend: this._beforeIconDelete.bind(this),
        success: this._onIconDeleted.bind(this),
        error: this._onIconDeleteError.bind(this),
        complete: this._onIconDeleteComplete.bind(this)
      });
    }, this);
  },

  _destroyDeleteIconsDialog: function () {
    if (this.delete_icons_dialog) {
      this._unbindDeleteIconsDialog();
      this.delete_icons_dialog.remove();
      this.removeView(this.delete_icons_dialog);
      this.delete_icons_dialog.hide();
      delete this.delete_icons_dialog;
    }
  },

  _getNumberOfSelectedIcons: function () {
    return this._iconCollection.where({ selected: true }).length;
  },

  _beforeIconDelete: function () {
    this._numOfDeletingProcesses++;
    if (this._numOfDeletingProcesses > 0) {
      this._runningMessage = 'Deleting icons...';
      this.model.set('isProcessRunning', true);
    }
  },

  _onIconDeleted: function (icon) {
    icon.set('deleted', true);
    this._addExtraIcon();
  },

  _onIconDeleteError: function (icon, response) {
    var errorText = this._parseResponseText(response);
    // Even if API throws error the icon has been already removed from the collection.
    // We must add it again
    this._iconCollection.add(icon);
    this._resetSelection();
    this._showErrorMessage(this._deleteErrorMessage(errorText));
  },

  _onIconDeleteComplete: function () {
    this._numOfDeletingProcesses--;
    if (this._numOfDeletingProcesses <= 0) {
      this.model.set('isProcessRunning', false);
    }
  },

  _showSpinner: function (enable) {
    if (enable) {
      this._hide('.js-plusSign');
      this._show('.js-spinner');
    } else {
      this._show('.js-plusSign');
      this._hide('.js-spinner');
    }
  },

  _showErrorMessage: function (message) {
    this.$('.js-errorMessage label').text(message);
    this._show('.js-errorMessage');
  },

  _hideErrorMessage: function () {
    this._hide('.js-errorMessage');
  },

  _resetSelection: function () {
    this._iconCollection.each(function (icon) {
      icon.set('selected', false);
    });
    this._refreshActions();
  },

  _addExtraIcon: function () {
    var iconAdded = false;
    this._iconCollection.each(function (icon) {
      if (!icon.get('visible') && !iconAdded) {
        this._addIconElement(icon);
        iconAdded = true;
      }
    }, this);
  },

  _onProcessRunningChanged: function () {
    var running = this.model.get('isProcessRunning');
    this._showSpinner(running);
    if (running) {
      this.$el.css('pointer-events', 'none');
      this._hideActions();
      this.$('.js-runningInfo').text(this._runningMessage);
      this._show('.js-runningInfo');
    } else {
      this.$('.js-runningInfo').text('');
      this._hide('.js-runningInfo');
      this._refreshActions();
      cdb.god.trigger('refreshCollection', { cid: this.cid });
      this.$el.css('pointer-events', 'auto');
    }
  },

  _uploadErrorMessage: function (errorText) {
    var message = 'Error uploading your image. ';
    if (errorText) {
      message += '[ ' + errorText + ' ]. ';
    }
    message += 'Please try again.';

    return message;
  },

  _deleteErrorMessage: function (errorText) {
    var message = 'Error deleting your image. ';
    if (errorText) {
      message += '[ ' + errorText + ' ]. ';
    }
    message += 'Please try again.';

    return message;
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./delete_icons_dialog_view":51,"./organization_icon_collection":52,"./organization_icon_view":54}],56:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var IconPickerView = require('./icons/organization_icons_view');
var IconCollection = require('./icons/organization_icon_collection');
var IconView = require('./icons/organization_icon_view');
var IconPickerDialog = require('./icon_picker_dialog/icon_picker_dialog_view');

module.exports = IconPickerView.extend({

  events: IconPickerView.extendEvents({
    'click .js-viewAllIcons': '_onViewAllIconsClicked'
  }),

  initialize: function () {
    if (!this.options.orgId) { throw new Error('Organization ID is required.'); }
    this._orgId = this.options.orgId;

    this._maxIcons = 23;
    this.template = cdb.templates.getTemplate('organization/icon_picker/organization_icon_picker_template');
    this.model = new cdb.core.Model({
      isProcessRunning: false
    });
    this._iconCollection = new IconCollection(null, {
      orgId: this._orgId
    });
    this._numOfUploadingProcesses = 0;
    this._numOfDeletingProcesses = 0;
    this._fetchErrorMessage = 'Error fetching organization icons. Please refresh the page.';
    this._runningMessage = '';
    this.render();
    this._fetchAllIcons();
    this._initBinds();
  },

  _initBinds: function () {
    this._iconCollection.on('change:selected', this._refreshActions, this);
    this.model.on('change:isProcessRunning', this._onProcessRunningChanged, this);
    cdb.god.bind('refreshCollection', this._refreshCollection, this);
  },

  _refreshCollection: function (data) {
    if (data.cid && this.cid !== data.cid) {
      this.render();
      this._fetchAllIcons();
    }
  },

  _renderIcon: function (iconModel) {
    if (iconModel.get('index') < this._maxIcons) {
      var iconView = new IconView({
        model: iconModel
      });
      iconView.render();
      iconModel.set('visible', true);
      this.$('.js-items').append(iconView.$el);
    }
  },

  _addIconElement: function (iconModel) {
    iconModel.set('index', this._getIconIndex(iconModel));
    this._renderIcon(iconModel);
    this._refreshActions();
  },

  _refreshActions: function () {
    if (this.model.get('isProcessRunning')) {
      return;
    }
    var limit = Math.min(this._maxIcons, this._iconCollection.length);
    var numOfSelectedIcons = this._getNumberOfSelectedIcons();
    var iconText = (numOfSelectedIcons === 1 ? '1 icon selected' : '' + numOfSelectedIcons + ' icons selected');
    this.$('.js-iconMainLabel').text(iconText);

    if (numOfSelectedIcons === 0) {
      this.$('.js-iconMainLabel').text('Icons');
      this._hide('.js-selectAllIcons, .js-deselectAllIcons, .js-deleteIcons');
      this._show('.js-iconsInfo');
    } else if (numOfSelectedIcons < limit) {
      this._show('.js-selectAllIcons, .js-deleteIcons');
      this._hide('.js-deselectAllIcons, .js-iconsInfo');
    } else {
      this._hide('.js-selectAllIcons, .js-iconsInfo');
      this._show('.js-deselectAllIcons, .js-deleteIcons');
    }

    if (numOfSelectedIcons > 1) {
      this.$('.js-deleteIcons a').text('Delete icons...');
    } else if (numOfSelectedIcons === 1) {
      this.$('.js-deleteIcons a').text('Delete icon...');
    }

    if (this._iconCollection.length > this._maxIcons) {
      this._show('.js-viewAllIcons');
    } else {
      this._hide('.js-viewAllIcons');
    }
  },

  _hideActions: function () {
    this._hide('.js-selectAllIcons, .js-deselectAllIcons, .js-deleteIcons, .js-iconsInfo, .js-viewAllIcons');
  },

  _getIconIndex: function (icon) {
    return this._iconCollection.indexOf(icon);
  },

  _addExtraIcon: function () {
    var iconAdded = false;
    this._iconCollection.each(function (icon) {
      var index = this._getIconIndex(icon);
      if (index < this._maxIcons && !icon.get('visible') && !iconAdded) {
        this._addIconElement(icon);
        iconAdded = true;
      }
    }, this);
  },

  _bindIconsPicker: function () {
    cdb.god.bind('closeDialogs:icons', this._destroyPicker, this);
  },

  _unbindIconsPicker: function () {
    cdb.god.unbind('closeDialogs:icons', this._destroyPicker, this);
  },

  _destroyPicker: function () {
    if (this.icon_picker_dialog) {
      this._unbindIconsPicker();
      this.icon_picker_dialog.remove();
      this.removeView(this.icon_picker_dialog);
      this.icon_picker_dialog.hide();
      delete this.icon_picker_dialog;
    }
  },

  _onViewAllIconsClicked: function (event) {
    this.killEvent(event);

    cdb.god.trigger('closeDialogs:icons');

    this.icon_picker_dialog = new IconPickerDialog({
      orgId: this._orgId
    });
    this.icon_picker_dialog.appendToBody();

    this._bindIconsPicker();
    this.addView(this.icon_picker_dialog);
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./icon_picker_dialog/icon_picker_dialog_view":50,"./icons/organization_icon_collection":52,"./icons/organization_icon_view":54,"./icons/organization_icons_view":55}],57:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var BaseDialog = require('../../common/views/base_dialog/view');
var randomQuote = require('../../common/view_helpers/random_quote');
var ViewFactory = require('../../common/view_factory');
var InviteUsersFormView = require('./invite_users_form_view');

/**
 *  Invite users dialog
 *
 *  - Send invites via email.
 *  - Shouldn't send emails to already enabled users.
 *
 */

module.exports = BaseDialog.extend({

  className: 'Dialog is-opening InviteUsers',

  initialize: function () {
    this.elder('initialize');
    this.organization = this.options.organization;
    this.organizationUsers = this.options.organizationUsers;
    this.model = new cdb.admin.Organization.Invites(
      {},
      {
        organizationId: this.organization.id,
        enable_organization_signup: false
      }
    );
    this.template = cdb.templates.getTemplate('organization/invite_users/invite_users_dialog_template');
  },

  render: function () {
    this.clearSubViews();
    BaseDialog.prototype.render.call(this);
    this.$('.content').addClass('Dialog-content--expanded');
    this._initViews();
    return this;
  },

  render_content: function () {
    return this.template();
  },

  _initViews: function () {
    // Panes
    this._panes = new cdb.ui.common.TabPane({
      el: this.$('.js-content')
    });

    // Create form
    this._form = new InviteUsersFormView({
      model: this.model,
      organization: this.organization,
      organizationUsers: this.organizationUsers,
      el: this.$('.js-form')
    });

    this._form.bind('onSubmit', this._sendInvites, this);
    this._panes.addTab('form', this._form.render());

    // Create loading
    this._panes.addTab('loading',
      ViewFactory.createByTemplate('common/templates/loading', {
        title: 'Sending invites...',
        quote: randomQuote()
      }).render()
    );

    // Create error
    this._panes.addTab('error',
      ViewFactory.createByTemplate('common/templates/fail', {
        msg: 'Sorry, something went wrong.'
      }).render()
    );

    this._panes.active('form');
  },

  _sendInvites: function () {
    var self = this;
    this._panes.active('loading');
    this.model.save(null, {
      success: function () {
        self.close();
      },
      error: function (mdl, err) {
        try {
          var msg = JSON.parse(err.responseText).errors.users_emails[0];
          self._form.showSubmitError(msg);
          self._panes.active('form');
        } catch (e) {
          self._panes.active('error');
        }
      }
    });
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../common/view_factory":11,"../../common/view_helpers/random_quote":15,"../../common/views/base_dialog/view":16,"./invite_users_form_view":58}],58:[function(require,module,exports){
(function (global){
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var Utils = (typeof window !== "undefined" ? window['cdb']['Utils'] : typeof global !== "undefined" ? global['cdb']['Utils'] : null);

/**
 *  Form view for invite users dialog
 *
 */

module.exports = cdb.core.View.extend({

  events: {
    'submit .js-invitesForm': '_onSubmit',
    'keyup .js-welcomeText': '_onTextareaChange',
    'click .js-enableSignInButton': '_signInEnabledMessage'
  },

  initialize: function () {
    this.organizationUsers = this.options.organizationUsers;
    this.organization = this.options.organization;
    this.template = cdb.templates.getTemplate('organization/invite_users/invite_users_form_template');
    this._initBinds();
  },

  render: function () {
    this.$el.html(
      this.template({
        welcomeText: this.model.get('welcome_text'),
        signupEnabled: this.organization.get('signup_enabled'),
        viewerEnabled: this.organization.get('viewer_seats') > 0
      })
    );
    this._toggleEmailError(false);
    this._initViews();
    return this;
  },

  _renderFlashMessage: function () {
    var flashTemplate = cdb.templates.getTemplate('organization/invite_users/invite_users_flash_message_template');
    this.$('.js-signInMessageContainer').html(flashTemplate());

    this.$('.js-flashSuccess').hide();
  },

  _initBinds: function () {
    this.model.bind('change', this._onChange, this);
  },

  _initViews: function () {
    var self = this;
    var organizationUsersEmail = this.organizationUsers.pluck('email');

    this.$('.js-tagsList').tagit({
      allowSpaces: true,
      placeholderText: this.$('.js-tags').data('title'),
      onBlur: function () {
        self.$('.js-tags').removeClass('is-focus');
      },
      onFocus: function () {
        self.$('.js-tags').addClass('is-focus');
      },
      beforeTagAdded: function (ev, ui) {
        var value = ui.tagLabel;
        self._removeSubmitError();

        // It is an email
        if (!Utils.isValidEmail(value)) {
          return false;
        }

        // It is already in the organization
        if (_.contains(organizationUsersEmail, value)) {
          self._toggleEmailError(true);
          return false;
        } else {
          self._toggleEmailError(false);
        }
      },
      beforeTagRemoved: function () {
        self._removeSubmitError();
      },
      afterTagRemoved: function (ev, ui) {
        self._updateUsers();
      },
      afterTagAdded: function (ev, ui) {
        self._updateUsers();
      },
      onSubmitTags: function (ev, tagList) {
        ev.preventDefault();
        self._onSubmit();
        return false;
      }
    });

    if (!this.organization.get('signup_enabled')) {
      this._renderFlashMessage();
    }
  },

  _onTextareaChange: function () {
    this.model.set('welcome_text', this.$('.js-welcomeText').val());
  },

  _updateUsers: function () {
    this.model.set('users_emails', this.$('.js-tagsList').tagit('assignedTags'));
  },

  _onSubmit: function (ev) {
    if (ev) {
      this.killEvent(ev);
    }
    var emails = this.model.get('users_emails');
    if (emails.length > 0) {
      this.model.set('welcome_text', this.$('.js-welcomeText').val());
      this.model.set('viewer', this.$('[name=viewer]').get(0).checked);
      this.trigger('onSubmit', this);
    }
  },

  _signInEnabledMessage: function () {
    this.$('.js-signInMessage').addClass('FlashMessage--success');
    this.$('.js-flashNotice').hide();
    this.$('.js-flashSuccess').show();

    this.model.set('enable_organization_signup', true);
  },

  _toggleEmailError: function (visible) {
    this.$('.js-emailError')[ visible ? 'show' : 'hide' ]();
  },

  showSubmitError: function (msg) {
    var $serverError = this.$('.js-serverError');
    if ($serverError.length === 0) {
      this.$('.js-emailError').after('<p class="Form-rowInfoText Form-rowInfoText--error Form-rowInfoText--multipleLines js-serverError">' + msg + '</p>');
    }
  },

  _removeSubmitError: function () {
    this.$('.js-serverError').remove();
  },

  _onChange: function () {
    var users = this.model.get('users_emails');
    var welcomeText = this.model.get('welcome_text');
    this.$('.js-submit').toggleClass('is-disabled', users.length === 0 || !welcomeText);
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],59:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var BaseDialog = require('../../common/views/base_dialog/view');
var randomQuote = require('../../common/view_helpers/random_quote');
var ViewFactory = require('../../common/view_factory');

module.exports = BaseDialog.extend({

  options: {
    authenticityToken: '',
    organizationUser: {}
  },

  events: BaseDialog.extendEvents({
    'click .js-ok': '_ok',
    'click .js-cancel': '_cancel'
  }),

  className: 'Dialog is-opening',

  initialize: function () {
    this.elder('initialize');
    this.template = cdb.templates.getTemplate('organization/organization_notification/delete_notification_dialog');
  },

  render_content: function () {
    return this.template({
      formAction: cdb.config.prefixUrl() + '/organization/notifications/' + this.options.notificationId,
      authenticityToken: this.options.authenticityToken
    });
  },

  ok: function () {
    var loadingView = ViewFactory.createDialogByTemplate('common/templates/loading', {
      title: 'Removing…',
      quote: randomQuote()
    });
    loadingView.appendToBody();

    this.submit();
    this.close();
  },

  submit: function () {
    this.$('form').submit();
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../common/view_factory":11,"../../common/view_helpers/random_quote":15,"../../common/views/base_dialog/view":16}],60:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);
var RemoveNotificationDialog = require('./delete_notification_dialog_view');
var SendButton = require('./send_button_view');
var markdown = require('markdown');

module.exports = cdb.core.View.extend({

  events: {
    'click .js-resend': '_onClickResend',
    'click .js-remove': '_onClickRemove',
    'keydown .js-textarea': '_onTextareaKeydown',
    'input .js-textarea': '_updateCounter',
    'propertychange .js-textarea': '_updateCounter'
  },

  render: function () {
    this.$textarea = this.$('#carto_notification_body');

    this._initViews();
    this._updateCounter();

    return this;
  },

  _initViews: function () {
    this.sendButton = new SendButton();

    this.$('.js-send').html(this.sendButton.render().el);
    this.addView(this.sendButton);

    this.sendButton.bind('submitForm', this._submitForm, this);
  },

  _submitForm: function () {
    if (navigator.userAgent.toLowerCase().indexOf('firefox') !== -1) {
      this.$('form').clone().appendTo('body').submit(); // FF only
    } else {
      this.$('form').submit();
    }
  },

  _updateCounter: function () {
    var strLen = $(markdown.toHTML(this.$textarea.val())).text().length;
    this.sendButton.updateCounter(strLen);
  },

  _onClickResend: function (event) {
    var $notificationItem = $(event.target).closest('.js-NotificationsList-item');
    var title = $notificationItem.find('.js-html_body').data('body');
    var recipients = $notificationItem.find('.js-recipients').data('recipients');

    this.$textarea.val(title);
    this.$('input[name="carto_notification[recipients]"]').prop('checked', false);
    this.$('input[name="carto_notification[recipients]"][value="' + recipients + '"]').prop('checked', true);

    $('body').animate({
      scrollTop: 0
    });

    this._updateCounter();
  },

  _onTextareaKeydown: function (event) {
    if (event.keyCode === 13 && event.metaKey) {
      this.sendButton.onUpdate();
    }
  },

  _destroyRemoveNotificationDialog: function () {
    if (this.remove_notification_dialog) {
      this._unbindRemoveNotificationDialog();
      this.remove_notification_dialog.remove();
      this.removeView(this.remove_notification_dialog);
      this.remove_notification_dialog.hide();
      delete this.remove_notification_dialog;
    }
  },

  _bindRemoveNotificationDialog: function () {
    cdb.god.bind('closeDialogs:delete', this._destroyRemoveNotificationDialog, this);
  },

  _unbindRemoveNotificationDialog: function () {
    cdb.god.unbind('closeDialogs:delete', this._destroyRemoveNotificationDialog, this);
  },

  _onClickRemove: function (event) {
    cdb.god.trigger('closeDialogs:delete');

    var $target = $(event.target);

    this.remove_notification_dialog = new RemoveNotificationDialog({
      authenticityToken: this.options.authenticityToken,
      notificationId: $target.data('id')
    });
    this.remove_notification_dialog.appendToBody();
    this._bindRemoveNotificationDialog();
    this.addView(this.remove_notification_dialog);
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./delete_notification_dialog_view":59,"./send_button_view":61,"markdown":98}],61:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var Backbone = (typeof window !== "undefined" ? window['Backbone'] : typeof global !== "undefined" ? global['Backbone'] : null);

var MAXSTRLEN = 140;

module.exports = cdb.core.View.extend({

  className: 'FormAccount-rowData',

  events: {
    'click .js-button': 'onUpdate'
  },

  initialize: function (opts) {
    this.template = cdb.templates.getTemplate('organization/organization_notification/send_button');

    this.model = new Backbone.Model({
      status: 'idle',
      counter: 0
    });

    this._initBinds();
  },

  render: function () {
    this.clearSubViews();

    this.$el.html(this.template({
      isLoading: this._isLoading(),
      isDisabled: this._isDisabled(),
      isNegative: this._isNegative(),
      counter: MAXSTRLEN - this.model.get('counter')
    }));

    return this;
  },

  updateCounter: function (strLen) {
    this.model.set('counter', strLen);
  },

  _initBinds: function () {
    this.model.bind('change', this.render, this);
  },

  _isNegative: function () {
    return this.model.get('counter') > MAXSTRLEN;
  },

  _isDisabled: function () {
    return (this.model.get('counter') === 0) || this._isNegative() || this._isLoading();
  },

  _isLoading: function () {
    return this.model.get('status') === 'loading';
  },

  _submit: function () {
    this.trigger('submitForm');
  },

  onUpdate: function () {
    if (this._isDisabled()) return false;

    this._submit();

    this.model.set({ status: 'loading' });
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],62:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);

/* Organization user form */
module.exports = cdb.core.View.extend({
  events: {
    'submit': '_validateFormSubmit'
  },

  _validateFormSubmit: function (event) {
    if (this.$('.js-userQuotaError').length > 0) {
      return false;
    }
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],63:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var UserQuotaSlider = require('./organization_user_quota_slider');
var UserQuotaSliderInput = require('./organization_user_quota_slider_input');

/* Progress quota bar for organization users */

module.exports = cdb.core.View.extend({

  initialize: function () {
    // Quota slider
    this.userQuotaSlider = new UserQuotaSlider({
      el: this.$('.js-userQuotaSlider'),
      model: this.model
    });

    this.addView(this.userQuotaSlider);

    // Quota slider input
    this.userQuotaSliderInput = new UserQuotaSliderInput({
      el: this.$('.js-userQuotaSliderInput'),
      model: this.model
    });

    this.addView(this.userQuotaSliderInput);

    this._initBinds();
  },

  _initBinds: function () {
    this.model.bind('change:quota_in_bytes', this._onQuotaChange, this);
  },

  _onQuotaChange: function (model, quota) {
    this.$('#user_quota').val(quota);
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./organization_user_quota_slider":64,"./organization_user_quota_slider_input":65}],64:[function(require,module,exports){
(function (global){
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);

/* Progress quota bar for organization users */

module.exports = cdb.core.View.extend({

  events: {
    'hover .js-quotaProgressSlider': '_showTooltip'
  },

  initialize: function () {
    this._initBinds();
    this._initViews();
  },

  _initBinds: function () {
    this.model.bind('change:quota_in_bytes', this._onQuotaChange, this);
  },

  _initViews: function () {
    var userMinQuota = 104857600 / this.model.organization.get('available_quota_for_user');

    // Init slider
    this.$('.js-slider').slider({
      max: 100,
      min: userMinQuota,
      step: 1,
      value: this.model.assignedQuotaPercentage(),
      range: 'min',
      orientation: 'horizontal',
      slide: this._onSlideChange.bind(this)
    });

    $('.ui-slider-handle').addClass('js-quotaProgressSlider');
  },

  _onSlideChange: function (ev, ui) {
    var userQuota = Math.max(Math.floor((this.model.organization.get('available_quota_for_user') * ui.value) / 100), 1);
    var assignedPer = (userQuota * 100) / this.model.organization.get('available_quota_for_user');

    if (ui.value >= this.model.usedQuotaPercentage()) {
      this.$('.ui-slider-range').css('width', assignedPer + '%');
      this.$('.js-quotaProgressSlider').css('left', assignedPer + '%');

      var tooltipLeft = $('.js-quotaProgressSlider').offset().left -
        ($('.js-orgUserQuotaTooltip').outerWidth() / 2) +
        ($('.js-quotaProgressSlider').outerWidth() / 2);

      $('.js-orgUserQuotaTooltip').css('left', tooltipLeft);

      this.model.set('quota_in_bytes', userQuota);
    } else {
      return false;
    }
  },

  _onQuotaChange: function () {
    if (this.model.assignedQuotaPercentage() >= this.model.usedQuotaPercentage()) {
      $('.ui-slider-range').css('width', Math.min(this.model.assignedQuotaPercentage(), 100) + '%');
      $('.js-quotaProgressSlider').css('left', Math.min(this.model.assignedQuotaPercentage(), 100) + '%');
    }
  },

  _showTooltip: function () {
    var viewModel = this.model;

    this.addView(
      new cdb.common.TipsyTooltip({
        el: $('.js-quotaProgressSlider'),
        className: 'js-orgUserQuotaTooltip',
        title: function () {
          return viewModel.assignedQuotaPercentage().toFixed(0) + '% of the available org quota';
        }
      })
    );
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],65:[function(require,module,exports){
(function (global){
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);

/* Progress quota bar for organization users input */

module.exports = cdb.core.View.extend({

  events: {
    'keyup .js-assignedSize': '_onKeyup'
  },

  initialize: function () {
    this._initBinds();
    this._initViews();
  },

  _initBinds: function () {
    this.model.bind('change:quota_in_bytes', this._onQuotaChange, this);
  },

  _initViews: function () {
    var quotaInMb = Math.max(Math.floor(this.model.get('quota_in_bytes') / 1024 / 1024).toFixed(0), 1);
    this.$('.js-assignedSize').val(quotaInMb);
  },

  _onQuotaChange: function () {
    this.$('.js-assignedSize').val(Math.max(this.model.assignedQuotaInRoundedMb(), 1));
  },

  _onKeyup: function () {
    var modifiedQuotaInBytes = Math.max(Math.floor(this.$('.js-assignedSize').val() * 1048576), 1048576);
    var assignedPer = (modifiedQuotaInBytes * 100) / this.model.organization.get('available_quota_for_user');
    var errorMessage = '<p class="FormAccount-rowInfoText FormAccount-rowInfoText--error js-userQuotaError">Invalid quota, insert a valid one.</p>';

    if (!isNaN(assignedPer)) {
      this.model.set('quota_in_bytes', modifiedQuotaInBytes);
    }

    if (isNaN(assignedPer) || (this.model.get('quota_in_bytes') > this.model.organization.get('available_quota_for_user')) || (this.model.get('quota_in_bytes') < this.model.get('db_size_in_bytes'))) {
      this.$('.js-assignedSize').addClass('has-error');

      if (this.$('.js-userQuotaError').length === 0) {
        $('.js-userQuotaSliderInput').append(errorMessage);
      }
    } else {
      this.$('.js-assignedSize').removeClass('has-error');
      this.$('.js-userQuotaError').remove();
    }
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],66:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var Utils = (typeof window !== "undefined" ? window['cdb']['Utils'] : typeof global !== "undefined" ? global['cdb']['Utils'] : null);
var pluralizeStr = require('../../common/view_helpers/pluralize_string');

module.exports = cdb.core.View.extend({

  className: 'OrganizationList-user',
  tagName: 'li',

  initialize: function () {
    this.template = cdb.templates.getTemplate('organization/organization_users/organization_user');
  },

  render: function () {
    this.$el.html(
      this.template({
        totalPer: this.options.totalPer,
        userPer: this.options.userPer,
        usedPer: this.options.usedPer,
        isOwner: this.options.isOwner,
        isAdmin: this.options.isAdmin,
        isViewer: this.options.isViewer,
        editable: this.options.editable,
        url: this.options.url,
        sizeOnBytes: Utils.readablizeBytes(this.model.get('db_size_in_bytes')),
        quotaInBytes: Utils.readablizeBytes(this.model.get('quota_in_bytes')),
        avatarUrl: this.model.get('avatar_url'),
        username: this.model.get('username'),
        user_email: this.model.get('email'),
        table_count: pluralizeStr.prefixWithCount('Dataset', 'Datasets', this.model.get('table_count')),
        maps_count: pluralizeStr.prefixWithCount('Map', 'Maps', this.model.get('all_visualization_count'))
      })
    );

    return this;
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../common/view_helpers/pluralize_string":14}],67:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);

module.exports = cdb.core.View.extend({

  className: 'Form-footer',

  initialize: function () {
    this.template = cdb.templates.getTemplate('organization/organization_users/organization_users_footer');
    this._initBinds();
  },

  render: function () {
    this.$el.html(
      this.template({
        seats: this.model.get('seats'),
        users: this.options.organizationUsers.totalCount(),
        newUserUrl: this.model.viewUrl().create(),
        upgradeUrl: window.upgrade_url,
        customHosted: cdb.config.get('cartodb_com_hosted')
      })
    );

    return this;
  },

  _initBinds: function () {
    this.model.bind('change:total_users', this.render, this);
    this.options.organizationUsers.bind('reset', this.render, this);
    this.add_related_model(this.options.organizationUsers);
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],68:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);
var PaginationView = require('../../common/views/pagination/view');
var OrganizationUserView = require('./organization_user_view');

module.exports = cdb.core.View.extend({

  initialize: function () {
    this.organization = this.options.organization;
    this.paginationModel = this.options.paginationModel;
    this.currentUser = this.options.currentUser;
    this._initBinds();
  },

  render: function () {
    this.clearSubViews();

    this.$el.empty();

    // Users list
    var $ul = $('<ul>').addClass('OrganizationList');
    this.$el.append($ul);
    var totalPer = 0;
    this.collection.each(function (user) {
      // Calculations to create organization user bars
      var userPer = (user.get('quota_in_bytes') * 100) / this.organization.get('quota_in_bytes');
      var usedPer = (user.get('db_size_in_bytes') * 100) / this.organization.get('quota_in_bytes');
      user.organization = this.organization;

      var v = new OrganizationUserView({
        model: user,
        isOwner: user.isOrgOwner(),
        isAdmin: user.isOrgAdmin(),
        isViewer: user.get('viewer'),
        editable: this.currentUser.isOrgOwner() || this.currentUser.id === user.id || !user.isOrgAdmin(),
        userPer: userPer,
        usedPer: usedPer,
        totalPer: totalPer,
        url: this.organization.viewUrl().edit(user)
      });

      $ul.append(v.render().el);
      this.addView(v);

      totalPer = totalPer + userPer;
    }, this);

    // Paginator
    var $paginatorWrapper = $('<div>').addClass('OrganizationList-paginator');
    this.$el.append($paginatorWrapper);
    var paginationView = new PaginationView({
      model: this.paginationModel
    });
    $paginatorWrapper.append(paginationView.render().el);
    this.addView(paginationView);

    return this;
  },

  _initBinds: function () {
    this.collection.bind('reset', this.render, this);
    this.add_related_model(this.collection);
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../common/views/pagination/view":28,"./organization_user_view":66}],69:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);
var Utils = (typeof window !== "undefined" ? window['cdb']['Utils'] : typeof global !== "undefined" ? global['cdb']['Utils'] : null);
var OrganizationUsersListView = require('./organization_users_list_view');
var OrganizationUsersFooterView = require('./organization_users_footer_view');
var PagedSearchModel = require('../../common/paged_search_model');
var PaginationModel = require('../../common/views/pagination/model');
var randomQuote = require('../../common/view_helpers/random_quote');
var ViewFactory = require('../../common/view_factory');
var InviteUsersDialogView = require('../invite_users/invite_users_dialog_view');

/**
 *  Organization users content, list, pagination,
 *  form footer,...
 *
 */

module.exports = cdb.core.View.extend({

  events: {
    'click .js-addUserOptions': '_openAddUserDropdown',
    'click .js-search-link': '_onSearchClick',
    'click .js-clean-search': '_onCleanSearchClick',
    'keydown .js-search-input': '_onKeyDown',
    'submit .js-search-form': 'killEvent'
  },

  initialize: function () {
    this.organization = this.options.organization;
    this.organizationUsers = this.options.organizationUsers;
    this.currentUser = this.options.currentUser;
    this.pagedSearchModel = new PagedSearchModel({
      per_page: 50,
      order: 'username'
    });
    this.paginationModel = new PaginationModel({
      current_page: this.pagedSearchModel.get('page'),
      total_count: this.organizationUsers.totalCount(),
      per_page: this.pagedSearchModel.get('per_page')
    });
    this.template = cdb.templates.getTemplate('organization/organization_users/organization_users');
    this._initBinds();
    this.pagedSearchModel.fetch(this.organizationUsers);
  },

  render: function () {
    this.clearSubViews();
    this.$el.html(
      this.template({
        seats: this.organization.get('seats'),
        assigned_seats: this.organization.get('assigned_seats'),
        viewer_seats: this.organization.get('viewer_seats'),
        assigned_viewer_seats: this.organization.get('assigned_viewer_seats'),
        newUserUrl: this.organization.viewUrl().create()
      })
    );
    this._initViews();
    return this;
  },

  _initBinds: function () {
    this.organizationUsers.bind('fetching', function () {
      this._panes && this._panes.active('loading');
    }, this);

    this.organizationUsers.bind('error', function (e) {
      // Old requests can be stopped, so aborted requests are not
      // considered as an error
      if (!e || (e && e.statusText !== 'abort')) {
        this._panes.active('error');
      }
    }, this);

    this.organizationUsers.bind('reset', function (coll) {
      var total = coll.totalCount();
      this.paginationModel.set({
        total_count: total,
        current_page: this.pagedSearchModel.get('page')
      });
      this._panes && this._panes.active(total > 0 ? 'users' : 'no_results');
    }, this);

    this.organizationUsers.bind('reset error loading', function (coll) {
      this[ this.pagedSearchModel.get('q') ? '_showCleanSearchButton' : '_hideCleanSearchButton' ]();
    }, this);

    this.paginationModel.bind('change:current_page', function (mdl) {
      var newPage = mdl.get('current_page');
      this.pagedSearchModel.set('page', newPage);
      this.pagedSearchModel.fetch(this.organizationUsers);
    }, this);

    this.add_related_model(this.organizationUsers);
    this.add_related_model(this.paginationModel);
  },

  _initViews: function () {
    this._panes = new cdb.ui.common.TabPane({
      el: this.$('.js-organizationUsersPanes')
    });
    this.addView(this._panes);

    this._panes.addTab('users',
      new OrganizationUsersListView({
        organization: this.organization,
        collection: this.organizationUsers,
        paginationModel: this.paginationModel,
        currentUser: this.currentUser
      }).render()
    );

    this._panes.addTab('error',
      ViewFactory.createByTemplate('common/templates/fail', {
        msg: ''
      }).render()
    );

    this._panes.addTab('no_results',
      ViewFactory.createByTemplate('common/templates/no_results', {
        icon: 'CDB-IconFont-defaultUser',
        title: 'Oh! No results',
        msg: 'Unfortunately we haven\'t found any user with these parameters'
      }).render()
    );

    this._panes.addTab('loading',
      ViewFactory.createByTemplate('common/templates/loading', {
        title: 'Getting users…',
        quote: randomQuote()
      }).render()
    );

    // Form footer
    var footer = new OrganizationUsersFooterView({
      model: this.organization,
      organizationUsers: this.organizationUsers
    });
    this.addView(footer);
    this.$el.append(footer.render().el);

    var activePane = 'loading';
    if (this.organizationUsers.totalCount() === 0) {
      activePane = 'no_results';
    } else if (this.organizationUsers.totalCount() > 0) {
      activePane = 'users';
    }

    this._panes.active(activePane);
  },

  _openAddUserDropdown: function (e) {
    var self = this;
    this.killEvent(e);

    if (this.dropdown) {
      this._closeDropdown();
      return;
    }

    this.dropdown = new cdb.admin.DropdownMenu({
      className: 'Dropdown border',
      target: $(e.target),
      width: 120,
      template_base: 'organization/organization_users/add_users_template',
      vertical_position: 'down',
      horizontal_position: 'right',
      horizontal_offset: 0,
      vertical_offset: -10,
      createUrl: this.organization.viewUrl().create(),
      tick: 'right'
    });

    this.dropdown.bind('optionClicked', function (ev) {
      var $target = $(ev.target);
      if ($target.hasClass('js-inviteUser')) {
        ev.preventDefault();
        this._onInviteClick();
      }
    }, this);

    $('body').append(this.dropdown.render().el);
    cdb.god.bind('closeDialogs', function () {
      self._closeDropdown();
    }, this.dropdown);

    this.dropdown.open(e);
  },

  _closeDropdown: function () {
    if (this.dropdown) {
      var self = this;
      cdb.god.unbind(null, null, this.dropdown);
      this.dropdown.hide(function () {
        self.dropdown.clean();
        delete self.dropdown;
      });
    }
  },

  _showCleanSearchButton: function () {
    this.$('.js-clean-search').show();
  },

  _hideCleanSearchButton: function () {
    this.$('.js-clean-search').hide();
  },

  _focusSearchInput: function () {
    var $searchInput = this._$searchInput();
    $searchInput.focus().val($searchInput.val());
  },

  _onSearchClick: function (e) {
    if (e) this.killEvent(e);
    this._$searchInput().focus();
  },

  _onCleanSearchClick: function (ev) {
    this.killEvent(ev);
    this._cleanSearch();
  },

  _onKeyDown: function (ev) {
    var enterPressed = (ev.keyCode === $.ui.keyCode.ENTER);
    var escapePressed = (ev.keyCode === $.ui.keyCode.ESCAPE);
    if (enterPressed) {
      this.killEvent(ev);
      this._submitSearch();
    } else if (escapePressed) {
      this.killEvent(ev);
      if (this.pagedSearchModel.get('q')) {
        this._cleanSearch();
      }
    }
  },

  _submitSearch: function (e) {
    var search = this._$searchInput().val().trim();
    this.pagedSearchModel.set({
      q: Utils.stripHTML(search),
      page: 1
    });

    this.pagedSearchModel.fetch(this.organizationUsers);
  },

  _$searchInput: function () {
    return this.$('.js-search-input');
  },

  _cleanSearch: function () {
    this._$searchInput().val('');
    this.pagedSearchModel.set({
      q: '',
      page: 1
    });

    this.pagedSearchModel.fetch(this.organizationUsers);
  },

  _onInviteClick: function () {
    this.dialog = new InviteUsersDialogView({
      clean_on_hide: true,
      enter_to_confirm: false,
      organization: this.organization,
      organizationUsers: this.organizationUsers
    }).appendToBody();
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../common/paged_search_model":6,"../../common/view_factory":11,"../../common/view_helpers/random_quote":15,"../../common/views/pagination/model":27,"../invite_users/invite_users_dialog_view":57,"./organization_users_footer_view":67,"./organization_users_list_view":68}],70:[function(require,module,exports){
'use strict';

module.exports = require('./src/js/main');

},{"./src/js/main":76}],71:[function(require,module,exports){
'use strict';

function oldAdd(element, className) {
  var classes = element.className.split(' ');
  if (classes.indexOf(className) < 0) {
    classes.push(className);
  }
  element.className = classes.join(' ');
}

function oldRemove(element, className) {
  var classes = element.className.split(' ');
  var idx = classes.indexOf(className);
  if (idx >= 0) {
    classes.splice(idx, 1);
  }
  element.className = classes.join(' ');
}

exports.add = function (element, className) {
  if (element.classList) {
    element.classList.add(className);
  } else {
    oldAdd(element, className);
  }
};

exports.remove = function (element, className) {
  if (element.classList) {
    element.classList.remove(className);
  } else {
    oldRemove(element, className);
  }
};

exports.list = function (element) {
  if (element.classList) {
    return Array.prototype.slice.apply(element.classList);
  } else {
    return element.className.split(' ');
  }
};

},{}],72:[function(require,module,exports){
'use strict';

var DOM = {};

DOM.e = function (tagName, className) {
  var element = document.createElement(tagName);
  element.className = className;
  return element;
};

DOM.appendTo = function (child, parent) {
  parent.appendChild(child);
  return child;
};

function cssGet(element, styleName) {
  return window.getComputedStyle(element)[styleName];
}

function cssSet(element, styleName, styleValue) {
  if (typeof styleValue === 'number') {
    styleValue = styleValue.toString() + 'px';
  }
  element.style[styleName] = styleValue;
  return element;
}

function cssMultiSet(element, obj) {
  for (var key in obj) {
    var val = obj[key];
    if (typeof val === 'number') {
      val = val.toString() + 'px';
    }
    element.style[key] = val;
  }
  return element;
}

DOM.css = function (element, styleNameOrObject, styleValue) {
  if (typeof styleNameOrObject === 'object') {
    // multiple set with object
    return cssMultiSet(element, styleNameOrObject);
  } else {
    if (typeof styleValue === 'undefined') {
      return cssGet(element, styleNameOrObject);
    } else {
      return cssSet(element, styleNameOrObject, styleValue);
    }
  }
};

DOM.matches = function (element, query) {
  if (typeof element.matches !== 'undefined') {
    return element.matches(query);
  } else {
    if (typeof element.matchesSelector !== 'undefined') {
      return element.matchesSelector(query);
    } else if (typeof element.webkitMatchesSelector !== 'undefined') {
      return element.webkitMatchesSelector(query);
    } else if (typeof element.mozMatchesSelector !== 'undefined') {
      return element.mozMatchesSelector(query);
    } else if (typeof element.msMatchesSelector !== 'undefined') {
      return element.msMatchesSelector(query);
    }
  }
};

DOM.remove = function (element) {
  if (typeof element.remove !== 'undefined') {
    element.remove();
  } else {
    if (element.parentNode) {
      element.parentNode.removeChild(element);
    }
  }
};

DOM.queryChildren = function (element, selector) {
  return Array.prototype.filter.call(element.childNodes, function (child) {
    return DOM.matches(child, selector);
  });
};

module.exports = DOM;

},{}],73:[function(require,module,exports){
'use strict';

var EventElement = function (element) {
  this.element = element;
  this.events = {};
};

EventElement.prototype.bind = function (eventName, handler) {
  if (typeof this.events[eventName] === 'undefined') {
    this.events[eventName] = [];
  }
  this.events[eventName].push(handler);
  this.element.addEventListener(eventName, handler, false);
};

EventElement.prototype.unbind = function (eventName, handler) {
  var isHandlerProvided = (typeof handler !== 'undefined');
  this.events[eventName] = this.events[eventName].filter(function (hdlr) {
    if (isHandlerProvided && hdlr !== handler) {
      return true;
    }
    this.element.removeEventListener(eventName, hdlr, false);
    return false;
  }, this);
};

EventElement.prototype.unbindAll = function () {
  for (var name in this.events) {
    this.unbind(name);
  }
};

var EventManager = function () {
  this.eventElements = [];
};

EventManager.prototype.eventElement = function (element) {
  var ee = this.eventElements.filter(function (eventElement) {
    return eventElement.element === element;
  })[0];
  if (typeof ee === 'undefined') {
    ee = new EventElement(element);
    this.eventElements.push(ee);
  }
  return ee;
};

EventManager.prototype.bind = function (element, eventName, handler) {
  this.eventElement(element).bind(eventName, handler);
};

EventManager.prototype.unbind = function (element, eventName, handler) {
  this.eventElement(element).unbind(eventName, handler);
};

EventManager.prototype.unbindAll = function () {
  for (var i = 0; i < this.eventElements.length; i++) {
    this.eventElements[i].unbindAll();
  }
};

EventManager.prototype.once = function (element, eventName, handler) {
  var ee = this.eventElement(element);
  var onceHandler = function (e) {
    ee.unbind(eventName, onceHandler);
    handler(e);
  };
  ee.bind(eventName, onceHandler);
};

module.exports = EventManager;

},{}],74:[function(require,module,exports){
'use strict';

module.exports = (function () {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1);
  }
  return function () {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
           s4() + '-' + s4() + s4() + s4();
  };
})();

},{}],75:[function(require,module,exports){
'use strict';

var cls = require('./class');
var dom = require('./dom');

var toInt = exports.toInt = function (x) {
  return parseInt(x, 10) || 0;
};

var clone = exports.clone = function (obj) {
  if (!obj) {
    return null;
  } else if (Array.isArray(obj)) {
    return obj.map(clone);
  } else if (typeof obj === 'object') {
    var result = {};
    for (var key in obj) {
      result[key] = clone(obj[key]);
    }
    return result;
  } else {
    return obj;
  }
};

exports.debounce = function (func, wait, immediate) {
  var timeout;
  return function () {
    var context = this;
    var args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) {
      func.apply(context, args);
    }
  };
};

exports.extend = function (original, source) {
  var result = clone(original);
  for (var key in source) {
    result[key] = clone(source[key]);
  }
  return result;
};

exports.isEditable = function (el) {
  return dom.matches(el, "input,[contenteditable]") ||
         dom.matches(el, "select,[contenteditable]") ||
         dom.matches(el, "textarea,[contenteditable]") ||
         dom.matches(el, "button,[contenteditable]");
};

exports.removePsClasses = function (element) {
  var clsList = cls.list(element);
  for (var i = 0; i < clsList.length; i++) {
    var className = clsList[i];
    if (className.indexOf('ps-') === 0) {
      cls.remove(element, className);
    }
  }
};

exports.outerWidth = function (element) {
  return toInt(dom.css(element, 'width')) +
         toInt(dom.css(element, 'paddingLeft')) +
         toInt(dom.css(element, 'paddingRight')) +
         toInt(dom.css(element, 'borderLeftWidth')) +
         toInt(dom.css(element, 'borderRightWidth'));
};

exports.startScrolling = function (element, axis) {
  cls.add(element, 'ps-in-scrolling');
  if (typeof axis !== 'undefined') {
    cls.add(element, 'ps-' + axis);
  } else {
    cls.add(element, 'ps-x');
    cls.add(element, 'ps-y');
  }
};

exports.stopScrolling = function (element, axis) {
  cls.remove(element, 'ps-in-scrolling');
  if (typeof axis !== 'undefined') {
    cls.remove(element, 'ps-' + axis);
  } else {
    cls.remove(element, 'ps-x');
    cls.remove(element, 'ps-y');
  }
};

exports.env = {
  isWebKit: 'WebkitAppearance' in document.documentElement.style,
  supportsTouch: (('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch),
  supportsIePointer: window.navigator.msMaxTouchPoints !== null
};

},{"./class":71,"./dom":72}],76:[function(require,module,exports){
'use strict';

var destroy = require('./plugin/destroy');
var initialize = require('./plugin/initialize');
var update = require('./plugin/update');

module.exports = {
  initialize: initialize,
  update: update,
  destroy: destroy
};

},{"./plugin/destroy":79,"./plugin/initialize":87,"./plugin/update":92}],77:[function(require,module,exports){
'use strict';

var update = require('./update');
var MutationObserver = window.MutationObserver;
var instances = require('./instances');

var createDOMEvent = function (name) {
  var event = document.createEvent('Event');
  event.initEvent(name, true, true);
  return event;
};

module.exports = function (element) {
  if (MutationObserver === null || MutationObserver === undefined) {
    // MutationObserver is not supported
    return;
  }

  var i = instances.get(element);
  var onMutationObserver = function () {
    update(element);
    element.dispatchEvent(createDOMEvent('ps-dom-change'));
  };

  i.observer = new MutationObserver(onMutationObserver);
  onMutationObserver();

  var config = { childList: true, subtree: true };
  i.observer.observe(element, config);
};

},{"./instances":88,"./update":92}],78:[function(require,module,exports){
'use strict';

module.exports = {
  handlers: ['click-rail', 'drag-scrollbar', 'keyboard', 'wheel', 'touch'],
  maxScrollbarLength: null,
  minScrollbarLength: null,
  scrollXMarginOffset: 0,
  scrollYMarginOffset: 0,
  suppressScrollX: false,
  suppressScrollY: false,
  swipePropagation: true,
  useBothWheelAxes: false,
  wheelPropagation: false,
  wheelSpeed: 1,
  theme: 'default',
  autoupdate: true
};

},{}],79:[function(require,module,exports){
'use strict';

var _ = require('../lib/helper');
var dom = require('../lib/dom');
var instances = require('./instances');

module.exports = function (element) {
  var i = instances.get(element);

  if (!i) {
    return;
  }

  if (i.observer) {
    i.observer.disconnect();
  }

  i.event.unbindAll();
  dom.remove(i.scrollbarX);
  dom.remove(i.scrollbarY);
  dom.remove(i.scrollbarXRail);
  dom.remove(i.scrollbarYRail);
  _.removePsClasses(element);

  instances.remove(element);
};

},{"../lib/dom":72,"../lib/helper":75,"./instances":88}],80:[function(require,module,exports){
'use strict';

var instances = require('../instances');
var updateGeometry = require('../update-geometry');
var updateScroll = require('../update-scroll');

function bindClickRailHandler(element, i) {
  function pageOffset(el) {
    return el.getBoundingClientRect();
  }
  var stopPropagation = function (e) { e.stopPropagation(); };

  i.event.bind(i.scrollbarY, 'click', stopPropagation);
  i.event.bind(i.scrollbarYRail, 'click', function (e) {
    var positionTop = e.pageY - window.pageYOffset - pageOffset(i.scrollbarYRail).top;
    var direction = positionTop > i.scrollbarYTop ? 1 : -1;

    updateScroll(element, 'top', element.scrollTop + direction * i.containerHeight);
    updateGeometry(element);

    e.stopPropagation();
  });

  i.event.bind(i.scrollbarX, 'click', stopPropagation);
  i.event.bind(i.scrollbarXRail, 'click', function (e) {
    var positionLeft = e.pageX - window.pageXOffset - pageOffset(i.scrollbarXRail).left;
    var direction = positionLeft > i.scrollbarXLeft ? 1 : -1;

    updateScroll(element, 'left', element.scrollLeft + direction * i.containerWidth);
    updateGeometry(element);

    e.stopPropagation();
  });
}

module.exports = function (element) {
  var i = instances.get(element);
  bindClickRailHandler(element, i);
};

},{"../instances":88,"../update-geometry":90,"../update-scroll":91}],81:[function(require,module,exports){
'use strict';

var _ = require('../../lib/helper');
var dom = require('../../lib/dom');
var instances = require('../instances');
var updateGeometry = require('../update-geometry');
var updateScroll = require('../update-scroll');

function bindMouseScrollXHandler(element, i) {
  var currentLeft = null;
  var currentPageX = null;

  function updateScrollLeft(deltaX) {
    var newLeft = currentLeft + (deltaX * i.railXRatio);
    var maxLeft = Math.max(0, i.scrollbarXRail.getBoundingClientRect().left) + (i.railXRatio * (i.railXWidth - i.scrollbarXWidth));

    if (newLeft < 0) {
      i.scrollbarXLeft = 0;
    } else if (newLeft > maxLeft) {
      i.scrollbarXLeft = maxLeft;
    } else {
      i.scrollbarXLeft = newLeft;
    }

    var scrollLeft = _.toInt(i.scrollbarXLeft * (i.contentWidth - i.containerWidth) / (i.containerWidth - (i.railXRatio * i.scrollbarXWidth))) - i.negativeScrollAdjustment;
    updateScroll(element, 'left', scrollLeft);
  }

  var mouseMoveHandler = function (e) {
    updateScrollLeft(e.pageX - currentPageX);
    updateGeometry(element);
    e.stopPropagation();
    e.preventDefault();
  };

  var mouseUpHandler = function () {
    _.stopScrolling(element, 'x');
    i.event.unbind(i.ownerDocument, 'mousemove', mouseMoveHandler);
  };

  i.event.bind(i.scrollbarX, 'mousedown', function (e) {
    currentPageX = e.pageX;
    currentLeft = _.toInt(dom.css(i.scrollbarX, 'left')) * i.railXRatio;
    _.startScrolling(element, 'x');

    i.event.bind(i.ownerDocument, 'mousemove', mouseMoveHandler);
    i.event.once(i.ownerDocument, 'mouseup', mouseUpHandler);

    e.stopPropagation();
    e.preventDefault();
  });
}

function bindMouseScrollYHandler(element, i) {
  var currentTop = null;
  var currentPageY = null;

  function updateScrollTop(deltaY) {
    var newTop = currentTop + (deltaY * i.railYRatio);
    var maxTop = Math.max(0, i.scrollbarYRail.getBoundingClientRect().top) + (i.railYRatio * (i.railYHeight - i.scrollbarYHeight));

    if (newTop < 0) {
      i.scrollbarYTop = 0;
    } else if (newTop > maxTop) {
      i.scrollbarYTop = maxTop;
    } else {
      i.scrollbarYTop = newTop;
    }

    var scrollTop = _.toInt(i.scrollbarYTop * (i.contentHeight - i.containerHeight) / (i.containerHeight - (i.railYRatio * i.scrollbarYHeight)));
    updateScroll(element, 'top', scrollTop);
  }

  var mouseMoveHandler = function (e) {
    updateScrollTop(e.pageY - currentPageY);
    updateGeometry(element);
    e.stopPropagation();
    e.preventDefault();
  };

  var mouseUpHandler = function () {
    _.stopScrolling(element, 'y');
    i.event.unbind(i.ownerDocument, 'mousemove', mouseMoveHandler);
  };

  i.event.bind(i.scrollbarY, 'mousedown', function (e) {
    currentPageY = e.pageY;
    currentTop = _.toInt(dom.css(i.scrollbarY, 'top')) * i.railYRatio;
    _.startScrolling(element, 'y');

    i.event.bind(i.ownerDocument, 'mousemove', mouseMoveHandler);
    i.event.once(i.ownerDocument, 'mouseup', mouseUpHandler);

    e.stopPropagation();
    e.preventDefault();
  });
}

module.exports = function (element) {
  var i = instances.get(element);
  bindMouseScrollXHandler(element, i);
  bindMouseScrollYHandler(element, i);
};

},{"../../lib/dom":72,"../../lib/helper":75,"../instances":88,"../update-geometry":90,"../update-scroll":91}],82:[function(require,module,exports){
'use strict';

var _ = require('../../lib/helper');
var dom = require('../../lib/dom');
var instances = require('../instances');
var updateGeometry = require('../update-geometry');
var updateScroll = require('../update-scroll');

function bindKeyboardHandler(element, i) {
  var hovered = false;
  i.event.bind(element, 'mouseenter', function () {
    hovered = true;
  });
  i.event.bind(element, 'mouseleave', function () {
    hovered = false;
  });

  var shouldPrevent = false;
  function shouldPreventDefault(deltaX, deltaY) {
    var scrollTop = element.scrollTop;
    if (deltaX === 0) {
      if (!i.scrollbarYActive) {
        return false;
      }
      if ((scrollTop === 0 && deltaY > 0) || (scrollTop >= i.contentHeight - i.containerHeight && deltaY < 0)) {
        return !i.settings.wheelPropagation;
      }
    }

    var scrollLeft = element.scrollLeft;
    if (deltaY === 0) {
      if (!i.scrollbarXActive) {
        return false;
      }
      if ((scrollLeft === 0 && deltaX < 0) || (scrollLeft >= i.contentWidth - i.containerWidth && deltaX > 0)) {
        return !i.settings.wheelPropagation;
      }
    }
    return true;
  }

  i.event.bind(i.ownerDocument, 'keydown', function (e) {
    if ((e.isDefaultPrevented && e.isDefaultPrevented()) || e.defaultPrevented) {
      return;
    }

    var focused = dom.matches(i.scrollbarX, ':focus') ||
                  dom.matches(i.scrollbarY, ':focus');

    if (!hovered && !focused) {
      return;
    }

    var activeElement = document.activeElement ? document.activeElement : i.ownerDocument.activeElement;
    if (activeElement) {
      if (activeElement.tagName === 'IFRAME') {
        activeElement = activeElement.contentDocument.activeElement;
      } else {
        // go deeper if element is a webcomponent
        while (activeElement.shadowRoot) {
          activeElement = activeElement.shadowRoot.activeElement;
        }
      }
      if (_.isEditable(activeElement)) {
        return;
      }
    }

    var deltaX = 0;
    var deltaY = 0;

    switch (e.which) {
    case 37: // left
      if (e.metaKey) {
        deltaX = -i.contentWidth;
      } else if (e.altKey) {
        deltaX = -i.containerWidth;
      } else {
        deltaX = -30;
      }
      break;
    case 38: // up
      if (e.metaKey) {
        deltaY = i.contentHeight;
      } else if (e.altKey) {
        deltaY = i.containerHeight;
      } else {
        deltaY = 30;
      }
      break;
    case 39: // right
      if (e.metaKey) {
        deltaX = i.contentWidth;
      } else if (e.altKey) {
        deltaX = i.containerWidth;
      } else {
        deltaX = 30;
      }
      break;
    case 40: // down
      if (e.metaKey) {
        deltaY = -i.contentHeight;
      } else if (e.altKey) {
        deltaY = -i.containerHeight;
      } else {
        deltaY = -30;
      }
      break;
    case 33: // page up
      deltaY = 90;
      break;
    case 32: // space bar
      if (e.shiftKey) {
        deltaY = 90;
      } else {
        deltaY = -90;
      }
      break;
    case 34: // page down
      deltaY = -90;
      break;
    case 35: // end
      if (e.ctrlKey) {
        deltaY = -i.contentHeight;
      } else {
        deltaY = -i.containerHeight;
      }
      break;
    case 36: // home
      if (e.ctrlKey) {
        deltaY = element.scrollTop;
      } else {
        deltaY = i.containerHeight;
      }
      break;
    default:
      return;
    }

    updateScroll(element, 'top', element.scrollTop - deltaY);
    updateScroll(element, 'left', element.scrollLeft + deltaX);
    updateGeometry(element);

    shouldPrevent = shouldPreventDefault(deltaX, deltaY);
    if (shouldPrevent) {
      e.preventDefault();
    }
  });
}

module.exports = function (element) {
  var i = instances.get(element);
  bindKeyboardHandler(element, i);
};

},{"../../lib/dom":72,"../../lib/helper":75,"../instances":88,"../update-geometry":90,"../update-scroll":91}],83:[function(require,module,exports){
'use strict';

var instances = require('../instances');
var updateGeometry = require('../update-geometry');
var updateScroll = require('../update-scroll');

function bindMouseWheelHandler(element, i) {
  var shouldPrevent = false;

  function shouldPreventDefault(deltaX, deltaY) {
    var scrollTop = element.scrollTop;
    if (deltaX === 0) {
      if (!i.scrollbarYActive) {
        return false;
      }
      if ((scrollTop === 0 && deltaY > 0) || (scrollTop >= i.contentHeight - i.containerHeight && deltaY < 0)) {
        return !i.settings.wheelPropagation;
      }
    }

    var scrollLeft = element.scrollLeft;
    if (deltaY === 0) {
      if (!i.scrollbarXActive) {
        return false;
      }
      if ((scrollLeft === 0 && deltaX < 0) || (scrollLeft >= i.contentWidth - i.containerWidth && deltaX > 0)) {
        return !i.settings.wheelPropagation;
      }
    }
    return true;
  }

  function getDeltaFromEvent(e) {
    var deltaX = e.deltaX;
    var deltaY = -1 * e.deltaY;

    if (typeof deltaX === "undefined" || typeof deltaY === "undefined") {
      // OS X Safari
      deltaX = -1 * e.wheelDeltaX / 6;
      deltaY = e.wheelDeltaY / 6;
    }

    if (e.deltaMode && e.deltaMode === 1) {
      // Firefox in deltaMode 1: Line scrolling
      deltaX *= 10;
      deltaY *= 10;
    }

    if (deltaX !== deltaX && deltaY !== deltaY/* NaN checks */) {
      // IE in some mouse drivers
      deltaX = 0;
      deltaY = e.wheelDelta;
    }

    if (e.shiftKey) {
      // reverse axis with shift key
      return [-deltaY, -deltaX];
    }
    return [deltaX, deltaY];
  }

  function shouldBeConsumedByChild(deltaX, deltaY) {
    var child = element.querySelector('textarea:hover, select[multiple]:hover, .ps-child:hover');
    if (child) {
      if (!window.getComputedStyle(child).overflow.match(/(scroll|auto)/)) {
        // if not scrollable
        return false;
      }

      var maxScrollTop = child.scrollHeight - child.clientHeight;
      if (maxScrollTop > 0) {
        if (!(child.scrollTop === 0 && deltaY > 0) && !(child.scrollTop === maxScrollTop && deltaY < 0)) {
          return true;
        }
      }
      var maxScrollLeft = child.scrollLeft - child.clientWidth;
      if (maxScrollLeft > 0) {
        if (!(child.scrollLeft === 0 && deltaX < 0) && !(child.scrollLeft === maxScrollLeft && deltaX > 0)) {
          return true;
        }
      }
    }
    return false;
  }

  function mousewheelHandler(e) {
    var delta = getDeltaFromEvent(e);

    var deltaX = delta[0];
    var deltaY = delta[1];

    if (shouldBeConsumedByChild(deltaX, deltaY)) {
      return;
    }

    shouldPrevent = false;
    if (!i.settings.useBothWheelAxes) {
      // deltaX will only be used for horizontal scrolling and deltaY will
      // only be used for vertical scrolling - this is the default
      updateScroll(element, 'top', element.scrollTop - (deltaY * i.settings.wheelSpeed));
      updateScroll(element, 'left', element.scrollLeft + (deltaX * i.settings.wheelSpeed));
    } else if (i.scrollbarYActive && !i.scrollbarXActive) {
      // only vertical scrollbar is active and useBothWheelAxes option is
      // active, so let's scroll vertical bar using both mouse wheel axes
      if (deltaY) {
        updateScroll(element, 'top', element.scrollTop - (deltaY * i.settings.wheelSpeed));
      } else {
        updateScroll(element, 'top', element.scrollTop + (deltaX * i.settings.wheelSpeed));
      }
      shouldPrevent = true;
    } else if (i.scrollbarXActive && !i.scrollbarYActive) {
      // useBothWheelAxes and only horizontal bar is active, so use both
      // wheel axes for horizontal bar
      if (deltaX) {
        updateScroll(element, 'left', element.scrollLeft + (deltaX * i.settings.wheelSpeed));
      } else {
        updateScroll(element, 'left', element.scrollLeft - (deltaY * i.settings.wheelSpeed));
      }
      shouldPrevent = true;
    }

    updateGeometry(element);

    shouldPrevent = (shouldPrevent || shouldPreventDefault(deltaX, deltaY));
    if (shouldPrevent) {
      e.stopPropagation();
      e.preventDefault();
    }
  }

  if (typeof window.onwheel !== "undefined") {
    i.event.bind(element, 'wheel', mousewheelHandler);
  } else if (typeof window.onmousewheel !== "undefined") {
    i.event.bind(element, 'mousewheel', mousewheelHandler);
  }
}

module.exports = function (element) {
  var i = instances.get(element);
  bindMouseWheelHandler(element, i);
};

},{"../instances":88,"../update-geometry":90,"../update-scroll":91}],84:[function(require,module,exports){
'use strict';

var instances = require('../instances');
var updateGeometry = require('../update-geometry');

function bindNativeScrollHandler(element, i) {
  i.event.bind(element, 'scroll', function () {
    updateGeometry(element);
  });
}

module.exports = function (element) {
  var i = instances.get(element);
  bindNativeScrollHandler(element, i);
};

},{"../instances":88,"../update-geometry":90}],85:[function(require,module,exports){
'use strict';

var _ = require('../../lib/helper');
var instances = require('../instances');
var updateGeometry = require('../update-geometry');
var updateScroll = require('../update-scroll');

function bindSelectionHandler(element, i) {
  function getRangeNode() {
    var selection = window.getSelection ? window.getSelection() :
                    document.getSelection ? document.getSelection() : '';
    if (selection.toString().length === 0) {
      return null;
    } else {
      return selection.getRangeAt(0).commonAncestorContainer;
    }
  }

  var scrollingLoop = null;
  var scrollDiff = {top: 0, left: 0};
  function startScrolling() {
    if (!scrollingLoop) {
      scrollingLoop = setInterval(function () {
        if (!instances.get(element)) {
          clearInterval(scrollingLoop);
          return;
        }

        updateScroll(element, 'top', element.scrollTop + scrollDiff.top);
        updateScroll(element, 'left', element.scrollLeft + scrollDiff.left);
        updateGeometry(element);
      }, 50); // every .1 sec
    }
  }
  function stopScrolling() {
    if (scrollingLoop) {
      clearInterval(scrollingLoop);
      scrollingLoop = null;
    }
    _.stopScrolling(element);
  }

  var isSelected = false;
  i.event.bind(i.ownerDocument, 'selectionchange', function () {
    if (element.contains(getRangeNode())) {
      isSelected = true;
    } else {
      isSelected = false;
      stopScrolling();
    }
  });
  i.event.bind(window, 'mouseup', function () {
    if (isSelected) {
      isSelected = false;
      stopScrolling();
    }
  });
  i.event.bind(window, 'keyup', function () {
    if (isSelected) {
      isSelected = false;
      stopScrolling();
    }
  });

  i.event.bind(window, 'mousemove', function (e) {
    if (isSelected) {
      var mousePosition = {x: e.pageX, y: e.pageY};
      var containerGeometry = {
        left: element.offsetLeft,
        right: element.offsetLeft + element.offsetWidth,
        top: element.offsetTop,
        bottom: element.offsetTop + element.offsetHeight
      };

      if (mousePosition.x < containerGeometry.left + 3) {
        scrollDiff.left = -5;
        _.startScrolling(element, 'x');
      } else if (mousePosition.x > containerGeometry.right - 3) {
        scrollDiff.left = 5;
        _.startScrolling(element, 'x');
      } else {
        scrollDiff.left = 0;
      }

      if (mousePosition.y < containerGeometry.top + 3) {
        if (containerGeometry.top + 3 - mousePosition.y < 5) {
          scrollDiff.top = -5;
        } else {
          scrollDiff.top = -20;
        }
        _.startScrolling(element, 'y');
      } else if (mousePosition.y > containerGeometry.bottom - 3) {
        if (mousePosition.y - containerGeometry.bottom + 3 < 5) {
          scrollDiff.top = 5;
        } else {
          scrollDiff.top = 20;
        }
        _.startScrolling(element, 'y');
      } else {
        scrollDiff.top = 0;
      }

      if (scrollDiff.top === 0 && scrollDiff.left === 0) {
        stopScrolling();
      } else {
        startScrolling();
      }
    }
  });
}

module.exports = function (element) {
  var i = instances.get(element);
  bindSelectionHandler(element, i);
};

},{"../../lib/helper":75,"../instances":88,"../update-geometry":90,"../update-scroll":91}],86:[function(require,module,exports){
'use strict';

var _ = require('../../lib/helper');
var instances = require('../instances');
var updateGeometry = require('../update-geometry');
var updateScroll = require('../update-scroll');

function bindTouchHandler(element, i, supportsTouch, supportsIePointer) {
  function shouldPreventDefault(deltaX, deltaY) {
    var scrollTop = element.scrollTop;
    var scrollLeft = element.scrollLeft;
    var magnitudeX = Math.abs(deltaX);
    var magnitudeY = Math.abs(deltaY);

    if (magnitudeY > magnitudeX) {
      // user is perhaps trying to swipe up/down the page

      if (((deltaY < 0) && (scrollTop === i.contentHeight - i.containerHeight)) ||
          ((deltaY > 0) && (scrollTop === 0))) {
        return !i.settings.swipePropagation;
      }
    } else if (magnitudeX > magnitudeY) {
      // user is perhaps trying to swipe left/right across the page

      if (((deltaX < 0) && (scrollLeft === i.contentWidth - i.containerWidth)) ||
          ((deltaX > 0) && (scrollLeft === 0))) {
        return !i.settings.swipePropagation;
      }
    }

    return true;
  }

  function applyTouchMove(differenceX, differenceY) {
    updateScroll(element, 'top', element.scrollTop - differenceY);
    updateScroll(element, 'left', element.scrollLeft - differenceX);

    updateGeometry(element);
  }

  var startOffset = {};
  var startTime = 0;
  var speed = {};
  var easingLoop = null;
  var inGlobalTouch = false;
  var inLocalTouch = false;

  function globalTouchStart() {
    inGlobalTouch = true;
  }
  function globalTouchEnd() {
    inGlobalTouch = false;
  }

  function getTouch(e) {
    if (e.targetTouches) {
      return e.targetTouches[0];
    } else {
      // Maybe IE pointer
      return e;
    }
  }
  function shouldHandle(e) {
    if (e.targetTouches && e.targetTouches.length === 1) {
      return true;
    }
    if (e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== e.MSPOINTER_TYPE_MOUSE) {
      return true;
    }
    return false;
  }
  function touchStart(e) {
    if (shouldHandle(e)) {
      inLocalTouch = true;

      var touch = getTouch(e);

      startOffset.pageX = touch.pageX;
      startOffset.pageY = touch.pageY;

      startTime = (new Date()).getTime();

      if (easingLoop !== null) {
        clearInterval(easingLoop);
      }

      e.stopPropagation();
    }
  }
  function touchMove(e) {
    var target = e.target;
    var className = target && target.getAttribute && target.getAttribute('class') || '';

    if (!className.match(/ps-prevent-touchmove/)) {
      if (!inLocalTouch && i.settings.swipePropagation) {
        touchStart(e);
      }
      if (!inGlobalTouch && inLocalTouch && shouldHandle(e)) {
        var touch = getTouch(e);

        var currentOffset = {pageX: touch.pageX, pageY: touch.pageY};

        var differenceX = currentOffset.pageX - startOffset.pageX;
        var differenceY = currentOffset.pageY - startOffset.pageY;

        applyTouchMove(differenceX, differenceY);
        startOffset = currentOffset;

        var currentTime = (new Date()).getTime();

        var timeGap = currentTime - startTime;
        if (timeGap > 0) {
          speed.x = differenceX / timeGap;
          speed.y = differenceY / timeGap;
          startTime = currentTime;
        }

        if (shouldPreventDefault(differenceX, differenceY)) {
          e.stopPropagation();
          e.preventDefault();
        }
      }
    }
  }
  function touchEnd() {
    if (!inGlobalTouch && inLocalTouch) {
      inLocalTouch = false;

      clearInterval(easingLoop);
      easingLoop = setInterval(function () {
        if (!instances.get(element)) {
          clearInterval(easingLoop);
          return;
        }

        if (!speed.x && !speed.y) {
          clearInterval(easingLoop);
          return;
        }

        if (Math.abs(speed.x) < 0.01 && Math.abs(speed.y) < 0.01) {
          clearInterval(easingLoop);
          return;
        }

        applyTouchMove(speed.x * 30, speed.y * 30);

        speed.x *= 0.8;
        speed.y *= 0.8;
      }, 10);
    }
  }

  if (supportsTouch) {
    i.event.bind(window, 'touchstart', globalTouchStart);
    i.event.bind(window, 'touchend', globalTouchEnd);
    i.event.bind(element, 'touchstart', touchStart);
    i.event.bind(element, 'touchmove', touchMove);
    i.event.bind(element, 'touchend', touchEnd);
  } else if (supportsIePointer) {
    if (window.PointerEvent) {
      i.event.bind(window, 'pointerdown', globalTouchStart);
      i.event.bind(window, 'pointerup', globalTouchEnd);
      i.event.bind(element, 'pointerdown', touchStart);
      i.event.bind(element, 'pointermove', touchMove);
      i.event.bind(element, 'pointerup', touchEnd);
    } else if (window.MSPointerEvent) {
      i.event.bind(window, 'MSPointerDown', globalTouchStart);
      i.event.bind(window, 'MSPointerUp', globalTouchEnd);
      i.event.bind(element, 'MSPointerDown', touchStart);
      i.event.bind(element, 'MSPointerMove', touchMove);
      i.event.bind(element, 'MSPointerUp', touchEnd);
    }
  }
}

module.exports = function (element) {
  if (!_.env.supportsTouch && !_.env.supportsIePointer) {
    return;
  }

  var i = instances.get(element);
  bindTouchHandler(element, i, _.env.supportsTouch, _.env.supportsIePointer);
};

},{"../../lib/helper":75,"../instances":88,"../update-geometry":90,"../update-scroll":91}],87:[function(require,module,exports){
'use strict';

var _ = require('../lib/helper');
var cls = require('../lib/class');
var instances = require('./instances');
var updateGeometry = require('./update-geometry');
var autoupdate = require('./autoupdate');
var resizer = require('./resizer');

// Handlers
var handlers = {
  'click-rail': require('./handler/click-rail'),
  'drag-scrollbar': require('./handler/drag-scrollbar'),
  'keyboard': require('./handler/keyboard'),
  'wheel': require('./handler/mouse-wheel'),
  'touch': require('./handler/touch'),
  'selection': require('./handler/selection')
};
var nativeScrollHandler = require('./handler/native-scroll');

module.exports = function (element, userSettings) {
  userSettings = typeof userSettings === 'object' ? userSettings : {};

  cls.add(element, 'ps-container');

  // Create a plugin instance.
  var i = instances.add(element);

  i.settings = _.extend(i.settings, userSettings);
  cls.add(element, 'ps-theme-' + i.settings.theme);

  i.settings.handlers.forEach(function (handlerName) {
    handlers[handlerName](element);
  });

  nativeScrollHandler(element);

  updateGeometry(element);

  if (i.settings.autoupdate) {
    autoupdate(element);
    resizer(element);
  }
};

},{"../lib/class":71,"../lib/helper":75,"./autoupdate":77,"./handler/click-rail":80,"./handler/drag-scrollbar":81,"./handler/keyboard":82,"./handler/mouse-wheel":83,"./handler/native-scroll":84,"./handler/selection":85,"./handler/touch":86,"./instances":88,"./resizer":89,"./update-geometry":90}],88:[function(require,module,exports){
'use strict';

var _ = require('../lib/helper');
var cls = require('../lib/class');
var defaultSettings = require('./default-setting');
var dom = require('../lib/dom');
var EventManager = require('../lib/event-manager');
var guid = require('../lib/guid');

var instances = {};

function Instance(element) {
  var i = this;

  i.settings = _.clone(defaultSettings);
  i.containerWidth = null;
  i.containerHeight = null;
  i.contentWidth = null;
  i.contentHeight = null;

  i.isRtl = dom.css(element, 'direction') === "rtl";
  i.isNegativeScroll = (function () {
    var originalScrollLeft = element.scrollLeft;
    var result = null;
    element.scrollLeft = -1;
    result = element.scrollLeft < 0;
    element.scrollLeft = originalScrollLeft;
    return result;
  })();
  i.negativeScrollAdjustment = i.isNegativeScroll ? element.scrollWidth - element.clientWidth : 0;
  i.event = new EventManager();
  i.ownerDocument = element.ownerDocument || document;

  function focus() {
    cls.add(element, 'ps-focus');
  }

  function blur() {
    cls.remove(element, 'ps-focus');
  }

  i.scrollbarXRail = dom.appendTo(dom.e('div', 'ps-scrollbar-x-rail'), element);
  i.scrollbarX = dom.appendTo(dom.e('div', 'ps-scrollbar-x'), i.scrollbarXRail);
  i.scrollbarX.setAttribute('tabindex', 0);
  i.event.bind(i.scrollbarX, 'focus', focus);
  i.event.bind(i.scrollbarX, 'blur', blur);
  i.scrollbarXActive = null;
  i.scrollbarXWidth = null;
  i.scrollbarXLeft = null;
  i.scrollbarXBottom = _.toInt(dom.css(i.scrollbarXRail, 'bottom'));
  i.isScrollbarXUsingBottom = i.scrollbarXBottom === i.scrollbarXBottom; // !isNaN
  i.scrollbarXTop = i.isScrollbarXUsingBottom ? null : _.toInt(dom.css(i.scrollbarXRail, 'top'));
  i.railBorderXWidth = _.toInt(dom.css(i.scrollbarXRail, 'borderLeftWidth')) + _.toInt(dom.css(i.scrollbarXRail, 'borderRightWidth'));
  // Set rail to display:block to calculate margins
  dom.css(i.scrollbarXRail, 'display', 'block');
  i.railXMarginWidth = _.toInt(dom.css(i.scrollbarXRail, 'marginLeft')) + _.toInt(dom.css(i.scrollbarXRail, 'marginRight'));
  dom.css(i.scrollbarXRail, 'display', '');
  i.railXWidth = null;
  i.railXRatio = null;

  i.scrollbarYRail = dom.appendTo(dom.e('div', 'ps-scrollbar-y-rail'), element);
  i.scrollbarY = dom.appendTo(dom.e('div', 'ps-scrollbar-y'), i.scrollbarYRail);
  i.scrollbarY.setAttribute('tabindex', 0);
  i.event.bind(i.scrollbarY, 'focus', focus);
  i.event.bind(i.scrollbarY, 'blur', blur);
  i.scrollbarYActive = null;
  i.scrollbarYHeight = null;
  i.scrollbarYTop = null;
  i.scrollbarYRight = _.toInt(dom.css(i.scrollbarYRail, 'right'));
  i.isScrollbarYUsingRight = i.scrollbarYRight === i.scrollbarYRight; // !isNaN
  i.scrollbarYLeft = i.isScrollbarYUsingRight ? null : _.toInt(dom.css(i.scrollbarYRail, 'left'));
  i.scrollbarYOuterWidth = i.isRtl ? _.outerWidth(i.scrollbarY) : null;
  i.railBorderYWidth = _.toInt(dom.css(i.scrollbarYRail, 'borderTopWidth')) + _.toInt(dom.css(i.scrollbarYRail, 'borderBottomWidth'));
  dom.css(i.scrollbarYRail, 'display', 'block');
  i.railYMarginHeight = _.toInt(dom.css(i.scrollbarYRail, 'marginTop')) + _.toInt(dom.css(i.scrollbarYRail, 'marginBottom'));
  dom.css(i.scrollbarYRail, 'display', '');
  i.railYHeight = null;
  i.railYRatio = null;
}

function getId(element) {
  return element.getAttribute('data-ps-id');
}

function setId(element, id) {
  element.setAttribute('data-ps-id', id);
}

function removeId(element) {
  element.removeAttribute('data-ps-id');
}

exports.add = function (element) {
  var newId = guid();
  setId(element, newId);
  instances[newId] = new Instance(element);
  return instances[newId];
};

exports.remove = function (element) {
  delete instances[getId(element)];
  removeId(element);
};

exports.get = function (element) {
  return instances[getId(element)];
};

},{"../lib/class":71,"../lib/dom":72,"../lib/event-manager":73,"../lib/guid":74,"../lib/helper":75,"./default-setting":78}],89:[function(require,module,exports){
'use strict';

var update = require('./update');
var instances = require('./instances');
var _ = require('../lib/helper');

module.exports = function (element) {
  var i = instances.get(element);

  var onResize = function () {
    update(element);
  };

  i.event.bind(window, 'resize', _.debounce(onResize, 60));
};

},{"../lib/helper":75,"./instances":88,"./update":92}],90:[function(require,module,exports){
'use strict';

var _ = require('../lib/helper');
var cls = require('../lib/class');
var dom = require('../lib/dom');
var instances = require('./instances');
var updateScroll = require('./update-scroll');

function getThumbSize(i, thumbSize) {
  if (i.settings.minScrollbarLength) {
    thumbSize = Math.max(thumbSize, i.settings.minScrollbarLength);
  }
  if (i.settings.maxScrollbarLength) {
    thumbSize = Math.min(thumbSize, i.settings.maxScrollbarLength);
  }
  return thumbSize;
}

function updateCss(element, i) {
  var xRailOffset = {width: i.railXWidth};
  if (i.isRtl) {
    xRailOffset.left = i.negativeScrollAdjustment + element.scrollLeft + i.containerWidth - i.contentWidth;
  } else {
    xRailOffset.left = element.scrollLeft;
  }
  if (i.isScrollbarXUsingBottom) {
    xRailOffset.bottom = i.scrollbarXBottom - element.scrollTop;
  } else {
    xRailOffset.top = i.scrollbarXTop + element.scrollTop;
  }
  dom.css(i.scrollbarXRail, xRailOffset);

  var yRailOffset = {top: element.scrollTop, height: i.railYHeight};
  if (i.isScrollbarYUsingRight) {
    if (i.isRtl) {
      yRailOffset.right = i.contentWidth - (i.negativeScrollAdjustment + element.scrollLeft) - i.scrollbarYRight - i.scrollbarYOuterWidth;
    } else {
      yRailOffset.right = i.scrollbarYRight - element.scrollLeft;
    }
  } else {
    if (i.isRtl) {
      yRailOffset.left = i.negativeScrollAdjustment + element.scrollLeft + i.containerWidth * 2 - i.contentWidth - i.scrollbarYLeft - i.scrollbarYOuterWidth;
    } else {
      yRailOffset.left = i.scrollbarYLeft + element.scrollLeft;
    }
  }
  dom.css(i.scrollbarYRail, yRailOffset);

  dom.css(i.scrollbarX, {left: i.scrollbarXLeft, width: i.scrollbarXWidth - i.railBorderXWidth});
  dom.css(i.scrollbarY, {top: i.scrollbarYTop, height: i.scrollbarYHeight - i.railBorderYWidth});
}

module.exports = function (element) {
  var i = instances.get(element);

  i.containerWidth = element.clientWidth;
  i.containerHeight = element.clientHeight;
  i.contentWidth = element.scrollWidth;
  i.contentHeight = element.scrollHeight;

  var existingRails;
  if (!element.contains(i.scrollbarXRail)) {
    existingRails = dom.queryChildren(element, '.ps-scrollbar-x-rail');
    if (existingRails.length > 0) {
      existingRails.forEach(function (rail) {
        dom.remove(rail);
      });
    }
    dom.appendTo(i.scrollbarXRail, element);
  }
  if (!element.contains(i.scrollbarYRail)) {
    existingRails = dom.queryChildren(element, '.ps-scrollbar-y-rail');
    if (existingRails.length > 0) {
      existingRails.forEach(function (rail) {
        dom.remove(rail);
      });
    }
    dom.appendTo(i.scrollbarYRail, element);
  }

  if (!i.settings.suppressScrollX && i.containerWidth + i.settings.scrollXMarginOffset < i.contentWidth) {
    i.scrollbarXActive = true;
    i.railXWidth = i.containerWidth - i.railXMarginWidth;
    i.railXRatio = i.containerWidth / i.railXWidth;
    i.scrollbarXWidth = getThumbSize(i, _.toInt(i.railXWidth * i.containerWidth / i.contentWidth));
    i.scrollbarXLeft = _.toInt((i.negativeScrollAdjustment + element.scrollLeft) * (i.railXWidth - i.scrollbarXWidth) / (i.contentWidth - i.containerWidth));
  } else {
    i.scrollbarXActive = false;
  }

  if (!i.settings.suppressScrollY && i.containerHeight + i.settings.scrollYMarginOffset < i.contentHeight) {
    i.scrollbarYActive = true;
    i.railYHeight = i.containerHeight - i.railYMarginHeight;
    i.railYRatio = i.containerHeight / i.railYHeight;
    i.scrollbarYHeight = getThumbSize(i, _.toInt(i.railYHeight * i.containerHeight / i.contentHeight));
    i.scrollbarYTop = _.toInt(element.scrollTop * (i.railYHeight - i.scrollbarYHeight) / (i.contentHeight - i.containerHeight));
  } else {
    i.scrollbarYActive = false;
  }

  if (i.scrollbarXLeft >= i.railXWidth - i.scrollbarXWidth) {
    i.scrollbarXLeft = i.railXWidth - i.scrollbarXWidth;
  }
  if (i.scrollbarYTop >= i.railYHeight - i.scrollbarYHeight) {
    i.scrollbarYTop = i.railYHeight - i.scrollbarYHeight;
  }

  updateCss(element, i);

  if (i.scrollbarXActive) {
    cls.add(element, 'ps-active-x');
  } else {
    cls.remove(element, 'ps-active-x');
    i.scrollbarXWidth = 0;
    i.scrollbarXLeft = 0;
    updateScroll(element, 'left', 0);
  }
  if (i.scrollbarYActive) {
    cls.add(element, 'ps-active-y');
  } else {
    cls.remove(element, 'ps-active-y');
    i.scrollbarYHeight = 0;
    i.scrollbarYTop = 0;
    updateScroll(element, 'top', 0);
  }
};

},{"../lib/class":71,"../lib/dom":72,"../lib/helper":75,"./instances":88,"./update-scroll":91}],91:[function(require,module,exports){
'use strict';

var instances = require('./instances');

var lastTop;
var lastLeft;

var createDOMEvent = function (name) {
  var event = document.createEvent("Event");
  event.initEvent(name, true, true);
  return event;
};

module.exports = function (element, axis, value) {
  if (typeof element === 'undefined') {
    throw 'You must provide an element to the update-scroll function';
  }

  if (typeof axis === 'undefined') {
    throw 'You must provide an axis to the update-scroll function';
  }

  if (typeof value === 'undefined') {
    throw 'You must provide a value to the update-scroll function';
  }

  if (axis === 'top' && value <= 0) {
    element.scrollTop = value = 0; // don't allow negative scroll
    element.dispatchEvent(createDOMEvent('ps-y-reach-start'));
  }

  if (axis === 'left' && value <= 0) {
    element.scrollLeft = value = 0; // don't allow negative scroll
    element.dispatchEvent(createDOMEvent('ps-x-reach-start'));
  }

  var i = instances.get(element);

  if (axis === 'top' && value >= i.contentHeight - i.containerHeight) {
    // don't allow scroll past container
    value = i.contentHeight - i.containerHeight;
    if (value - element.scrollTop <= 1) {
      // mitigates rounding errors on non-subpixel scroll values
      value = element.scrollTop;
    } else {
      element.scrollTop = value;
    }
    element.dispatchEvent(createDOMEvent('ps-y-reach-end'));
  }

  if (axis === 'left' && value >= i.contentWidth - i.containerWidth) {
    // don't allow scroll past container
    value = i.contentWidth - i.containerWidth;
    if (value - element.scrollLeft <= 1) {
      // mitigates rounding errors on non-subpixel scroll values
      value = element.scrollLeft;
    } else {
      element.scrollLeft = value;
    }
    element.dispatchEvent(createDOMEvent('ps-x-reach-end'));
  }

  if (!lastTop) {
    lastTop = element.scrollTop;
  }

  if (!lastLeft) {
    lastLeft = element.scrollLeft;
  }

  if (axis === 'top' && value < lastTop) {
    element.dispatchEvent(createDOMEvent('ps-scroll-up'));
  }

  if (axis === 'top' && value > lastTop) {
    element.dispatchEvent(createDOMEvent('ps-scroll-down'));
  }

  if (axis === 'left' && value < lastLeft) {
    element.dispatchEvent(createDOMEvent('ps-scroll-left'));
  }

  if (axis === 'left' && value > lastLeft) {
    element.dispatchEvent(createDOMEvent('ps-scroll-right'));
  }

  if (axis === 'top') {
    element.scrollTop = lastTop = value;
    element.dispatchEvent(createDOMEvent('ps-scroll-y'));
  }

  if (axis === 'left') {
    element.scrollLeft = lastLeft = value;
    element.dispatchEvent(createDOMEvent('ps-scroll-x'));
  }

};

},{"./instances":88}],92:[function(require,module,exports){
'use strict';

var _ = require('../lib/helper');
var dom = require('../lib/dom');
var instances = require('./instances');
var updateGeometry = require('./update-geometry');
var updateScroll = require('./update-scroll');

module.exports = function (element) {
  var i = instances.get(element);

  if (!i) {
    return;
  }

  // Recalcuate negative scrollLeft adjustment
  i.negativeScrollAdjustment = i.isNegativeScroll ? element.scrollWidth - element.clientWidth : 0;

  // Recalculate rail margins
  dom.css(i.scrollbarXRail, 'display', 'block');
  dom.css(i.scrollbarYRail, 'display', 'block');
  i.railXMarginWidth = _.toInt(dom.css(i.scrollbarXRail, 'marginLeft')) + _.toInt(dom.css(i.scrollbarXRail, 'marginRight'));
  i.railYMarginHeight = _.toInt(dom.css(i.scrollbarYRail, 'marginTop')) + _.toInt(dom.css(i.scrollbarYRail, 'marginBottom'));

  // Hide scrollbars not to affect scrollWidth and scrollHeight
  dom.css(i.scrollbarXRail, 'display', 'none');
  dom.css(i.scrollbarYRail, 'display', 'none');

  updateGeometry(element);

  // Update top/left scroll to trigger events
  updateScroll(element, 'top', element.scrollTop);
  updateScroll(element, 'left', element.scrollLeft);

  dom.css(i.scrollbarXRail, 'display', '');
  dom.css(i.scrollbarYRail, 'display', '');
};

},{"../lib/dom":72,"../lib/helper":75,"./instances":88,"./update-geometry":90,"./update-scroll":91}],93:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],94:[function(require,module,exports){
//     Underscore.js 1.8.3
//     http://underscorejs.org
//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind,
    nativeCreate       = Object.create;

  // Naked function reference for surrogate-prototype-swapping.
  var Ctor = function(){};

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.8.3';

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  var optimizeCb = function(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      case 2: return function(value, other) {
        return func.call(context, value, other);
      };
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  };

  // A mostly-internal function to generate callbacks that can be applied
  // to each element in a collection, returning the desired result — either
  // identity, an arbitrary callback, a property matcher, or a property accessor.
  var cb = function(value, context, argCount) {
    if (value == null) return _.identity;
    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
    if (_.isObject(value)) return _.matcher(value);
    return _.property(value);
  };
  _.iteratee = function(value, context) {
    return cb(value, context, Infinity);
  };

  // An internal function for creating assigner functions.
  var createAssigner = function(keysFunc, undefinedOnly) {
    return function(obj) {
      var length = arguments.length;
      if (length < 2 || obj == null) return obj;
      for (var index = 1; index < length; index++) {
        var source = arguments[index],
            keys = keysFunc(source),
            l = keys.length;
        for (var i = 0; i < l; i++) {
          var key = keys[i];
          if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
        }
      }
      return obj;
    };
  };

  // An internal function for creating a new object that inherits from another.
  var baseCreate = function(prototype) {
    if (!_.isObject(prototype)) return {};
    if (nativeCreate) return nativeCreate(prototype);
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
  };

  var property = function(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  };

  // Helper for collection methods to determine whether a collection
  // should be iterated as an array or as an object
  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  var getLength = property('length');
  var isArrayLike = function(collection) {
    var length = getLength(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  };

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  _.each = _.forEach = function(obj, iteratee, context) {
    iteratee = optimizeCb(iteratee, context);
    var i, length;
    if (isArrayLike(obj)) {
      for (i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var keys = _.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }
    return obj;
  };

  // Return the results of applying the iteratee to each element.
  _.map = _.collect = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length,
        results = Array(length);
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Create a reducing function iterating left or right.
  function createReduce(dir) {
    // Optimized iterator function as using arguments.length
    // in the main function will deoptimize the, see #1991.
    function iterator(obj, iteratee, memo, keys, index, length) {
      for (; index >= 0 && index < length; index += dir) {
        var currentKey = keys ? keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    }

    return function(obj, iteratee, memo, context) {
      iteratee = optimizeCb(iteratee, context, 4);
      var keys = !isArrayLike(obj) && _.keys(obj),
          length = (keys || obj).length,
          index = dir > 0 ? 0 : length - 1;
      // Determine the initial value if none is provided.
      if (arguments.length < 3) {
        memo = obj[keys ? keys[index] : index];
        index += dir;
      }
      return iterator(obj, iteratee, memo, keys, index, length);
    };
  }

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  _.reduce = _.foldl = _.inject = createReduce(1);

  // The right-associative version of reduce, also known as `foldr`.
  _.reduceRight = _.foldr = createReduce(-1);

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var key;
    if (isArrayLike(obj)) {
      key = _.findIndex(obj, predicate, context);
    } else {
      key = _.findKey(obj, predicate, context);
    }
    if (key !== void 0 && key !== -1) return obj[key];
  };

  // Return all the elements that pass a truth test.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    predicate = cb(predicate, context);
    _.each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, _.negate(cb(predicate)), context);
  };

  // Determine whether all of the elements match a truth test.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  };

  // Determine if at least one element in the object matches a truth test.
  // Aliased as `any`.
  _.some = _.any = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  };

  // Determine if the array or object contains a given item (using `===`).
  // Aliased as `includes` and `include`.
  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
    if (!isArrayLike(obj)) obj = _.values(obj);
    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
    return _.indexOf(obj, item, fromIndex) >= 0;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      var func = isFunc ? method : value[method];
      return func == null ? func : func.apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matcher(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matcher(attrs));
  };

  // Return the maximum element (or element-based computation).
  _.max = function(obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value > result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value < result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Shuffle a collection, using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var set = isArrayLike(obj) ? obj : _.values(obj);
    var length = set.length;
    var shuffled = Array(length);
    for (var index = 0, rand; index < length; index++) {
      rand = _.random(0, index);
      if (rand !== index) shuffled[index] = shuffled[rand];
      shuffled[rand] = set[index];
    }
    return shuffled;
  };

  // Sample **n** random values from a collection.
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (!isArrayLike(obj)) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // Sort the object's values by a criterion produced by an iteratee.
  _.sortBy = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iteratee(value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, iteratee, context) {
      var result = {};
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key].push(value); else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key]++; else result[key] = 1;
  });

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (isArrayLike(obj)) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
  };

  // Split a collection into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var pass = [], fail = [];
    _.each(obj, function(value, key, obj) {
      (predicate(value, key, obj) ? pass : fail).push(value);
    });
    return [pass, fail];
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[0];
    return _.initial(array, array.length - n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[array.length - 1];
    return _.rest(array, Math.max(0, array.length - n));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, strict, startIndex) {
    var output = [], idx = 0;
    for (var i = startIndex || 0, length = getLength(input); i < length; i++) {
      var value = input[i];
      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
        //flatten current level of array or arguments object
        if (!shallow) value = flatten(value, shallow, strict);
        var j = 0, len = value.length;
        output.length += len;
        while (j < len) {
          output[idx++] = value[j++];
        }
      } else if (!strict) {
        output[idx++] = value;
      }
    }
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, false);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
    if (!_.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = cb(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = getLength(array); i < length; i++) {
      var value = array[i],
          computed = iteratee ? iteratee(value, i, array) : value;
      if (isSorted) {
        if (!i || seen !== computed) result.push(value);
        seen = computed;
      } else if (iteratee) {
        if (!_.contains(seen, computed)) {
          seen.push(computed);
          result.push(value);
        }
      } else if (!_.contains(result, value)) {
        result.push(value);
      }
    }
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(flatten(arguments, true, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = getLength(array); i < length; i++) {
      var item = array[i];
      if (_.contains(result, item)) continue;
      for (var j = 1; j < argsLength; j++) {
        if (!_.contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = flatten(arguments, true, true, 1);
    return _.filter(array, function(value){
      return !_.contains(rest, value);
    });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    return _.unzip(arguments);
  };

  // Complement of _.zip. Unzip accepts an array of arrays and groups
  // each array's elements on shared indices
  _.unzip = function(array) {
    var length = array && _.max(array, getLength).length || 0;
    var result = Array(length);

    for (var index = 0; index < length; index++) {
      result[index] = _.pluck(array, index);
    }
    return result;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    var result = {};
    for (var i = 0, length = getLength(list); i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // Generator function to create the findIndex and findLastIndex functions
  function createPredicateIndexFinder(dir) {
    return function(array, predicate, context) {
      predicate = cb(predicate, context);
      var length = getLength(array);
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };
  }

  // Returns the first index on an array-like that passes a predicate test
  _.findIndex = createPredicateIndexFinder(1);
  _.findLastIndex = createPredicateIndexFinder(-1);

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iteratee, context) {
    iteratee = cb(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = getLength(array);
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  };

  // Generator function to create the indexOf and lastIndexOf functions
  function createIndexFinder(dir, predicateFind, sortedIndex) {
    return function(array, item, idx) {
      var i = 0, length = getLength(array);
      if (typeof idx == 'number') {
        if (dir > 0) {
            i = idx >= 0 ? idx : Math.max(idx + length, i);
        } else {
            length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
        }
      } else if (sortedIndex && idx && length) {
        idx = sortedIndex(array, item);
        return array[idx] === item ? idx : -1;
      }
      if (item !== item) {
        idx = predicateFind(slice.call(array, i, length), _.isNaN);
        return idx >= 0 ? idx + i : -1;
      }
      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
        if (array[idx] === item) return idx;
      }
      return -1;
    };
  }

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (stop == null) {
      stop = start || 0;
      start = 0;
    }
    step = step || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Determines whether to execute a function as a constructor
  // or a normal function with the provided arguments
  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
    var self = baseCreate(sourceFunc.prototype);
    var result = sourceFunc.apply(self, args);
    if (_.isObject(result)) return result;
    return self;
  };

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
    var args = slice.call(arguments, 2);
    var bound = function() {
      return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
    };
    return bound;
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder, allowing any combination of arguments to be pre-filled.
  _.partial = function(func) {
    var boundArgs = slice.call(arguments, 1);
    var bound = function() {
      var position = 0, length = boundArgs.length;
      var args = Array(length);
      for (var i = 0; i < length; i++) {
        args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return executeBound(func, bound, this, this, args);
    };
    return bound;
  };

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = function(obj) {
    var i, length = arguments.length, key;
    if (length <= 1) throw new Error('bindAll must be passed function names');
    for (i = 1; i < length; i++) {
      key = arguments[i];
      obj[key] = _.bind(obj[key], obj);
    }
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){
      return func.apply(null, args);
    }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = _.partial(_.delay, _, 1);

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = _.now() - timestamp;

      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = _.now();
      var callNow = immediate && !timeout;
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a negated version of the passed-in predicate.
  _.negate = function(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  };

  // Returns a function that will only be executed on and after the Nth call.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Returns a function that will only be executed up to (but not including) the Nth call.
  _.before = function(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      }
      if (times <= 1) func = null;
      return memo;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = _.partial(_.before, 2);

  // Object Functions
  // ----------------

  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
                      'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

  function collectNonEnumProps(obj, keys) {
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;

    // Constructor is a special case.
    var prop = 'constructor';
    if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

    while (nonEnumIdx--) {
      prop = nonEnumerableProps[nonEnumIdx];
      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
        keys.push(prop);
      }
    }
  }

  // Retrieve the names of an object's own properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve all the property names of an object.
  _.allKeys = function(obj) {
    if (!_.isObject(obj)) return [];
    var keys = [];
    for (var key in obj) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Returns the results of applying the iteratee to each element of the object
  // In contrast to _.map it returns an object
  _.mapObject = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys =  _.keys(obj),
          length = keys.length,
          results = {},
          currentKey;
      for (var index = 0; index < length; index++) {
        currentKey = keys[index];
        results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
      }
      return results;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = createAssigner(_.allKeys);

  // Assigns a given object with all the own properties in the passed-in object(s)
  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  _.extendOwn = _.assign = createAssigner(_.keys);

  // Returns the first key on an object that passes a predicate test
  _.findKey = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = _.keys(obj), key;
    for (var i = 0, length = keys.length; i < length; i++) {
      key = keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(object, oiteratee, context) {
    var result = {}, obj = object, iteratee, keys;
    if (obj == null) return result;
    if (_.isFunction(oiteratee)) {
      keys = _.allKeys(obj);
      iteratee = optimizeCb(oiteratee, context);
    } else {
      keys = flatten(arguments, false, false, 1);
      iteratee = function(value, key, obj) { return key in obj; };
      obj = Object(obj);
    }
    for (var i = 0, length = keys.length; i < length; i++) {
      var key = keys[i];
      var value = obj[key];
      if (iteratee(value, key, obj)) result[key] = value;
    }
    return result;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj, iteratee, context) {
    if (_.isFunction(iteratee)) {
      iteratee = _.negate(iteratee);
    } else {
      var keys = _.map(flatten(arguments, false, false, 1), String);
      iteratee = function(value, key) {
        return !_.contains(keys, key);
      };
    }
    return _.pick(obj, iteratee, context);
  };

  // Fill in a given object with default properties.
  _.defaults = createAssigner(_.allKeys, true);

  // Creates an object that inherits from the given prototype object.
  // If additional properties are provided then they will be added to the
  // created object.
  _.create = function(prototype, props) {
    var result = baseCreate(prototype);
    if (props) _.extendOwn(result, props);
    return result;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Returns whether an object has a given set of `key:value` pairs.
  _.isMatch = function(object, attrs) {
    var keys = _.keys(attrs), length = keys.length;
    if (object == null) return !length;
    var obj = Object(object);
    for (var i = 0; i < length; i++) {
      var key = keys[i];
      if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }
    return true;
  };


  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      case '[object RegExp]':
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
    }

    var areArrays = className === '[object Array]';
    if (!areArrays) {
      if (typeof a != 'object' || typeof b != 'object') return false;

      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
                               _.isFunction(bCtor) && bCtor instanceof bCtor)
                          && ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    if (areArrays) {
      // Compare array lengths to determine if a deep comparison is necessary.
      length = a.length;
      if (length !== b.length) return false;
      // Deep compare the contents, ignoring non-numeric properties.
      while (length--) {
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      // Deep compare objects.
      var keys = _.keys(a), key;
      length = keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      if (_.keys(b).length !== length) return false;
      while (length--) {
        // Deep compare each member
        key = keys[length];
        if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
    return _.keys(obj).length === 0;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE < 9), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return _.has(obj, 'callee');
    };
  }

  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
  // IE 11 (#1621), and in Safari 8 (#1929).
  if (typeof /./ != 'function' && typeof Int8Array != 'object') {
    _.isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj !== +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iteratees.
  _.identity = function(value) {
    return value;
  };

  // Predicate-generating functions. Often useful outside of Underscore.
  _.constant = function(value) {
    return function() {
      return value;
    };
  };

  _.noop = function(){};

  _.property = property;

  // Generates a function for a given object that returns a given property.
  _.propertyOf = function(obj) {
    return obj == null ? function(){} : function(key) {
      return obj[key];
    };
  };

  // Returns a predicate for checking whether an object has a given set of
  // `key:value` pairs.
  _.matcher = _.matches = function(attrs) {
    attrs = _.extendOwn({}, attrs);
    return function(obj) {
      return _.isMatch(obj, attrs);
    };
  };

  // Run a function **n** times.
  _.times = function(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = optimizeCb(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() {
    return new Date().getTime();
  };

   // List of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  var unescapeMap = _.invert(escapeMap);

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  var createEscaper = function(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped
    var source = '(?:' + _.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };
  _.escape = createEscaper(escapeMap);
  _.unescape = createEscaper(unescapeMap);

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property, fallback) {
    var value = object == null ? void 0 : object[property];
    if (value === void 0) {
      value = fallback;
    }
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

  var escapeChar = function(match) {
    return '\\' + escapes[match];
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  _.template = function(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escaper, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offest.
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    try {
      var render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled source as a convenience for precompilation.
    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function. Start chaining a wrapped Underscore object.
  _.chain = function(obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result(this, func.apply(_, args));
      };
    });
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
      return result(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  _.each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result(this, method.apply(this._wrapped, arguments));
    };
  });

  // Extracts the result from a wrapped and chained object.
  _.prototype.value = function() {
    return this._wrapped;
  };

  // Provide unwrapping proxy for some methods used in engine operations
  // such as arithmetic and JSON stringification.
  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

  _.prototype.toString = function() {
    return '' + this._wrapped;
  };

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (typeof define === 'function' && define.amd) {
    define('underscore', [], function() {
      return _;
    });
  }
}.call(this));

},{}],95:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],96:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],97:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./support/isBuffer":96,"_process":93,"inherits":95}],98:[function(require,module,exports){
// Released under MIT license
// Copyright (c) 2009-2010 Dominic Baggott
// Copyright (c) 2009-2010 Ash Berlin
// Copyright (c) 2011 Christoph Dorn <christoph@christophdorn.com> (http://www.christophdorn.com)

/*jshint browser:true, devel:true */

(function( expose ) {

/**
 *  class Markdown
 *
 *  Markdown processing in Javascript done right. We have very particular views
 *  on what constitutes 'right' which include:
 *
 *  - produces well-formed HTML (this means that em and strong nesting is
 *    important)
 *
 *  - has an intermediate representation to allow processing of parsed data (We
 *    in fact have two, both as [JsonML]: a markdown tree and an HTML tree).
 *
 *  - is easily extensible to add new dialects without having to rewrite the
 *    entire parsing mechanics
 *
 *  - has a good test suite
 *
 *  This implementation fulfills all of these (except that the test suite could
 *  do with expanding to automatically run all the fixtures from other Markdown
 *  implementations.)
 *
 *  ##### Intermediate Representation
 *
 *  *TODO* Talk about this :) Its JsonML, but document the node names we use.
 *
 *  [JsonML]: http://jsonml.org/ "JSON Markup Language"
 **/
var Markdown = expose.Markdown = function(dialect) {
  switch (typeof dialect) {
    case "undefined":
      this.dialect = Markdown.dialects.Gruber;
      break;
    case "object":
      this.dialect = dialect;
      break;
    default:
      if ( dialect in Markdown.dialects ) {
        this.dialect = Markdown.dialects[dialect];
      }
      else {
        throw new Error("Unknown Markdown dialect '" + String(dialect) + "'");
      }
      break;
  }
  this.em_state = [];
  this.strong_state = [];
  this.debug_indent = "";
};

/**
 *  parse( markdown, [dialect] ) -> JsonML
 *  - markdown (String): markdown string to parse
 *  - dialect (String | Dialect): the dialect to use, defaults to gruber
 *
 *  Parse `markdown` and return a markdown document as a Markdown.JsonML tree.
 **/
expose.parse = function( source, dialect ) {
  // dialect will default if undefined
  var md = new Markdown( dialect );
  return md.toTree( source );
};

/**
 *  toHTML( markdown, [dialect]  ) -> String
 *  toHTML( md_tree ) -> String
 *  - markdown (String): markdown string to parse
 *  - md_tree (Markdown.JsonML): parsed markdown tree
 *
 *  Take markdown (either as a string or as a JsonML tree) and run it through
 *  [[toHTMLTree]] then turn it into a well-formated HTML fragment.
 **/
expose.toHTML = function toHTML( source , dialect , options ) {
  var input = expose.toHTMLTree( source , dialect , options );

  return expose.renderJsonML( input );
};

/**
 *  toHTMLTree( markdown, [dialect] ) -> JsonML
 *  toHTMLTree( md_tree ) -> JsonML
 *  - markdown (String): markdown string to parse
 *  - dialect (String | Dialect): the dialect to use, defaults to gruber
 *  - md_tree (Markdown.JsonML): parsed markdown tree
 *
 *  Turn markdown into HTML, represented as a JsonML tree. If a string is given
 *  to this function, it is first parsed into a markdown tree by calling
 *  [[parse]].
 **/
expose.toHTMLTree = function toHTMLTree( input, dialect , options ) {
  // convert string input to an MD tree
  if ( typeof input ==="string" ) input = this.parse( input, dialect );

  // Now convert the MD tree to an HTML tree

  // remove references from the tree
  var attrs = extract_attr( input ),
      refs = {};

  if ( attrs && attrs.references ) {
    refs = attrs.references;
  }

  var html = convert_tree_to_html( input, refs , options );
  merge_text_nodes( html );
  return html;
};

// For Spidermonkey based engines
function mk_block_toSource() {
  return "Markdown.mk_block( " +
          uneval(this.toString()) +
          ", " +
          uneval(this.trailing) +
          ", " +
          uneval(this.lineNumber) +
          " )";
}

// node
function mk_block_inspect() {
  var util = require("util");
  return "Markdown.mk_block( " +
          util.inspect(this.toString()) +
          ", " +
          util.inspect(this.trailing) +
          ", " +
          util.inspect(this.lineNumber) +
          " )";

}

var mk_block = Markdown.mk_block = function(block, trail, line) {
  // Be helpful for default case in tests.
  if ( arguments.length == 1 ) trail = "\n\n";

  var s = new String(block);
  s.trailing = trail;
  // To make it clear its not just a string
  s.inspect = mk_block_inspect;
  s.toSource = mk_block_toSource;

  if ( line != undefined )
    s.lineNumber = line;

  return s;
};

function count_lines( str ) {
  var n = 0, i = -1;
  while ( ( i = str.indexOf("\n", i + 1) ) !== -1 ) n++;
  return n;
}

// Internal - split source into rough blocks
Markdown.prototype.split_blocks = function splitBlocks( input, startLine ) {
  input = input.replace(/(\r\n|\n|\r)/g, "\n");
  // [\s\S] matches _anything_ (newline or space)
  // [^] is equivalent but doesn't work in IEs.
  var re = /([\s\S]+?)($|\n#|\n(?:\s*\n|$)+)/g,
      blocks = [],
      m;

  var line_no = 1;

  if ( ( m = /^(\s*\n)/.exec(input) ) != null ) {
    // skip (but count) leading blank lines
    line_no += count_lines( m[0] );
    re.lastIndex = m[0].length;
  }

  while ( ( m = re.exec(input) ) !== null ) {
    if (m[2] == "\n#") {
      m[2] = "\n";
      re.lastIndex--;
    }
    blocks.push( mk_block( m[1], m[2], line_no ) );
    line_no += count_lines( m[0] );
  }

  return blocks;
};

/**
 *  Markdown#processBlock( block, next ) -> undefined | [ JsonML, ... ]
 *  - block (String): the block to process
 *  - next (Array): the following blocks
 *
 * Process `block` and return an array of JsonML nodes representing `block`.
 *
 * It does this by asking each block level function in the dialect to process
 * the block until one can. Succesful handling is indicated by returning an
 * array (with zero or more JsonML nodes), failure by a false value.
 *
 * Blocks handlers are responsible for calling [[Markdown#processInline]]
 * themselves as appropriate.
 *
 * If the blocks were split incorrectly or adjacent blocks need collapsing you
 * can adjust `next` in place using shift/splice etc.
 *
 * If any of this default behaviour is not right for the dialect, you can
 * define a `__call__` method on the dialect that will get invoked to handle
 * the block processing.
 */
Markdown.prototype.processBlock = function processBlock( block, next ) {
  var cbs = this.dialect.block,
      ord = cbs.__order__;

  if ( "__call__" in cbs ) {
    return cbs.__call__.call(this, block, next);
  }

  for ( var i = 0; i < ord.length; i++ ) {
    //D:this.debug( "Testing", ord[i] );
    var res = cbs[ ord[i] ].call( this, block, next );
    if ( res ) {
      //D:this.debug("  matched");
      if ( !isArray(res) || ( res.length > 0 && !( isArray(res[0]) ) ) )
        this.debug(ord[i], "didn't return a proper array");
      //D:this.debug( "" );
      return res;
    }
  }

  // Uhoh! no match! Should we throw an error?
  return [];
};

Markdown.prototype.processInline = function processInline( block ) {
  return this.dialect.inline.__call__.call( this, String( block ) );
};

/**
 *  Markdown#toTree( source ) -> JsonML
 *  - source (String): markdown source to parse
 *
 *  Parse `source` into a JsonML tree representing the markdown document.
 **/
// custom_tree means set this.tree to `custom_tree` and restore old value on return
Markdown.prototype.toTree = function toTree( source, custom_root ) {
  var blocks = source instanceof Array ? source : this.split_blocks( source );

  // Make tree a member variable so its easier to mess with in extensions
  var old_tree = this.tree;
  try {
    this.tree = custom_root || this.tree || [ "markdown" ];

    blocks:
    while ( blocks.length ) {
      var b = this.processBlock( blocks.shift(), blocks );

      // Reference blocks and the like won't return any content
      if ( !b.length ) continue blocks;

      this.tree.push.apply( this.tree, b );
    }
    return this.tree;
  }
  finally {
    if ( custom_root ) {
      this.tree = old_tree;
    }
  }
};

// Noop by default
Markdown.prototype.debug = function () {
  var args = Array.prototype.slice.call( arguments);
  args.unshift(this.debug_indent);
  if ( typeof print !== "undefined" )
      print.apply( print, args );
  if ( typeof console !== "undefined" && typeof console.log !== "undefined" )
      console.log.apply( null, args );
}

Markdown.prototype.loop_re_over_block = function( re, block, cb ) {
  // Dont use /g regexps with this
  var m,
      b = block.valueOf();

  while ( b.length && (m = re.exec(b) ) != null ) {
    b = b.substr( m[0].length );
    cb.call(this, m);
  }
  return b;
};

/**
 * Markdown.dialects
 *
 * Namespace of built-in dialects.
 **/
Markdown.dialects = {};

/**
 * Markdown.dialects.Gruber
 *
 * The default dialect that follows the rules set out by John Gruber's
 * markdown.pl as closely as possible. Well actually we follow the behaviour of
 * that script which in some places is not exactly what the syntax web page
 * says.
 **/
Markdown.dialects.Gruber = {
  block: {
    atxHeader: function atxHeader( block, next ) {
      var m = block.match( /^(#{1,6})\s*(.*?)\s*#*\s*(?:\n|$)/ );

      if ( !m ) return undefined;

      var header = [ "header", { level: m[ 1 ].length } ];
      Array.prototype.push.apply(header, this.processInline(m[ 2 ]));

      if ( m[0].length < block.length )
        next.unshift( mk_block( block.substr( m[0].length ), block.trailing, block.lineNumber + 2 ) );

      return [ header ];
    },

    setextHeader: function setextHeader( block, next ) {
      var m = block.match( /^(.*)\n([-=])\2\2+(?:\n|$)/ );

      if ( !m ) return undefined;

      var level = ( m[ 2 ] === "=" ) ? 1 : 2;
      var header = [ "header", { level : level }, m[ 1 ] ];

      if ( m[0].length < block.length )
        next.unshift( mk_block( block.substr( m[0].length ), block.trailing, block.lineNumber + 2 ) );

      return [ header ];
    },

    code: function code( block, next ) {
      // |    Foo
      // |bar
      // should be a code block followed by a paragraph. Fun
      //
      // There might also be adjacent code block to merge.

      var ret = [],
          re = /^(?: {0,3}\t| {4})(.*)\n?/,
          lines;

      // 4 spaces + content
      if ( !block.match( re ) ) return undefined;

      block_search:
      do {
        // Now pull out the rest of the lines
        var b = this.loop_re_over_block(
                  re, block.valueOf(), function( m ) { ret.push( m[1] ); } );

        if ( b.length ) {
          // Case alluded to in first comment. push it back on as a new block
          next.unshift( mk_block(b, block.trailing) );
          break block_search;
        }
        else if ( next.length ) {
          // Check the next block - it might be code too
          if ( !next[0].match( re ) ) break block_search;

          // Pull how how many blanks lines follow - minus two to account for .join
          ret.push ( block.trailing.replace(/[^\n]/g, "").substring(2) );

          block = next.shift();
        }
        else {
          break block_search;
        }
      } while ( true );

      return [ [ "code_block", ret.join("\n") ] ];
    },

    horizRule: function horizRule( block, next ) {
      // this needs to find any hr in the block to handle abutting blocks
      var m = block.match( /^(?:([\s\S]*?)\n)?[ \t]*([-_*])(?:[ \t]*\2){2,}[ \t]*(?:\n([\s\S]*))?$/ );

      if ( !m ) {
        return undefined;
      }

      var jsonml = [ [ "hr" ] ];

      // if there's a leading abutting block, process it
      if ( m[ 1 ] ) {
        jsonml.unshift.apply( jsonml, this.processBlock( m[ 1 ], [] ) );
      }

      // if there's a trailing abutting block, stick it into next
      if ( m[ 3 ] ) {
        next.unshift( mk_block( m[ 3 ] ) );
      }

      return jsonml;
    },

    // There are two types of lists. Tight and loose. Tight lists have no whitespace
    // between the items (and result in text just in the <li>) and loose lists,
    // which have an empty line between list items, resulting in (one or more)
    // paragraphs inside the <li>.
    //
    // There are all sorts weird edge cases about the original markdown.pl's
    // handling of lists:
    //
    // * Nested lists are supposed to be indented by four chars per level. But
    //   if they aren't, you can get a nested list by indenting by less than
    //   four so long as the indent doesn't match an indent of an existing list
    //   item in the 'nest stack'.
    //
    // * The type of the list (bullet or number) is controlled just by the
    //    first item at the indent. Subsequent changes are ignored unless they
    //    are for nested lists
    //
    lists: (function( ) {
      // Use a closure to hide a few variables.
      var any_list = "[*+-]|\\d+\\.",
          bullet_list = /[*+-]/,
          number_list = /\d+\./,
          // Capture leading indent as it matters for determining nested lists.
          is_list_re = new RegExp( "^( {0,3})(" + any_list + ")[ \t]+" ),
          indent_re = "(?: {0,3}\\t| {4})";

      // TODO: Cache this regexp for certain depths.
      // Create a regexp suitable for matching an li for a given stack depth
      function regex_for_depth( depth ) {

        return new RegExp(
          // m[1] = indent, m[2] = list_type
          "(?:^(" + indent_re + "{0," + depth + "} {0,3})(" + any_list + ")\\s+)|" +
          // m[3] = cont
          "(^" + indent_re + "{0," + (depth-1) + "}[ ]{0,4})"
        );
      }
      function expand_tab( input ) {
        return input.replace( / {0,3}\t/g, "    " );
      }

      // Add inline content `inline` to `li`. inline comes from processInline
      // so is an array of content
      function add(li, loose, inline, nl) {
        if ( loose ) {
          li.push( [ "para" ].concat(inline) );
          return;
        }
        // Hmmm, should this be any block level element or just paras?
        var add_to = li[li.length -1] instanceof Array && li[li.length - 1][0] == "para"
                   ? li[li.length -1]
                   : li;

        // If there is already some content in this list, add the new line in
        if ( nl && li.length > 1 ) inline.unshift(nl);

        for ( var i = 0; i < inline.length; i++ ) {
          var what = inline[i],
              is_str = typeof what == "string";
          if ( is_str && add_to.length > 1 && typeof add_to[add_to.length-1] == "string" ) {
            add_to[ add_to.length-1 ] += what;
          }
          else {
            add_to.push( what );
          }
        }
      }

      // contained means have an indent greater than the current one. On
      // *every* line in the block
      function get_contained_blocks( depth, blocks ) {

        var re = new RegExp( "^(" + indent_re + "{" + depth + "}.*?\\n?)*$" ),
            replace = new RegExp("^" + indent_re + "{" + depth + "}", "gm"),
            ret = [];

        while ( blocks.length > 0 ) {
          if ( re.exec( blocks[0] ) ) {
            var b = blocks.shift(),
                // Now remove that indent
                x = b.replace( replace, "");

            ret.push( mk_block( x, b.trailing, b.lineNumber ) );
          }
          else {
            break;
          }
        }
        return ret;
      }

      // passed to stack.forEach to turn list items up the stack into paras
      function paragraphify(s, i, stack) {
        var list = s.list;
        var last_li = list[list.length-1];

        if ( last_li[1] instanceof Array && last_li[1][0] == "para" ) {
          return;
        }
        if ( i + 1 == stack.length ) {
          // Last stack frame
          // Keep the same array, but replace the contents
          last_li.push( ["para"].concat( last_li.splice(1, last_li.length - 1) ) );
        }
        else {
          var sublist = last_li.pop();
          last_li.push( ["para"].concat( last_li.splice(1, last_li.length - 1) ), sublist );
        }
      }

      // The matcher function
      return function( block, next ) {
        var m = block.match( is_list_re );
        if ( !m ) return undefined;

        function make_list( m ) {
          var list = bullet_list.exec( m[2] )
                   ? ["bulletlist"]
                   : ["numberlist"];

          stack.push( { list: list, indent: m[1] } );
          return list;
        }


        var stack = [], // Stack of lists for nesting.
            list = make_list( m ),
            last_li,
            loose = false,
            ret = [ stack[0].list ],
            i;

        // Loop to search over block looking for inner block elements and loose lists
        loose_search:
        while ( true ) {
          // Split into lines preserving new lines at end of line
          var lines = block.split( /(?=\n)/ );

          // We have to grab all lines for a li and call processInline on them
          // once as there are some inline things that can span lines.
          var li_accumulate = "";

          // Loop over the lines in this block looking for tight lists.
          tight_search:
          for ( var line_no = 0; line_no < lines.length; line_no++ ) {
            var nl = "",
                l = lines[line_no].replace(/^\n/, function(n) { nl = n; return ""; });

            // TODO: really should cache this
            var line_re = regex_for_depth( stack.length );

            m = l.match( line_re );
            //print( "line:", uneval(l), "\nline match:", uneval(m) );

            // We have a list item
            if ( m[1] !== undefined ) {
              // Process the previous list item, if any
              if ( li_accumulate.length ) {
                add( last_li, loose, this.processInline( li_accumulate ), nl );
                // Loose mode will have been dealt with. Reset it
                loose = false;
                li_accumulate = "";
              }

              m[1] = expand_tab( m[1] );
              var wanted_depth = Math.floor(m[1].length/4)+1;
              //print( "want:", wanted_depth, "stack:", stack.length);
              if ( wanted_depth > stack.length ) {
                // Deep enough for a nested list outright
                //print ( "new nested list" );
                list = make_list( m );
                last_li.push( list );
                last_li = list[1] = [ "listitem" ];
              }
              else {
                // We aren't deep enough to be strictly a new level. This is
                // where Md.pl goes nuts. If the indent matches a level in the
                // stack, put it there, else put it one deeper then the
                // wanted_depth deserves.
                var found = false;
                for ( i = 0; i < stack.length; i++ ) {
                  if ( stack[ i ].indent != m[1] ) continue;
                  list = stack[ i ].list;
                  stack.splice( i+1, stack.length - (i+1) );
                  found = true;
                  break;
                }

                if (!found) {
                  //print("not found. l:", uneval(l));
                  wanted_depth++;
                  if ( wanted_depth <= stack.length ) {
                    stack.splice(wanted_depth, stack.length - wanted_depth);
                    //print("Desired depth now", wanted_depth, "stack:", stack.length);
                    list = stack[wanted_depth-1].list;
                    //print("list:", uneval(list) );
                  }
                  else {
                    //print ("made new stack for messy indent");
                    list = make_list(m);
                    last_li.push(list);
                  }
                }

                //print( uneval(list), "last", list === stack[stack.length-1].list );
                last_li = [ "listitem" ];
                list.push(last_li);
              } // end depth of shenegains
              nl = "";
            }

            // Add content
            if ( l.length > m[0].length ) {
              li_accumulate += nl + l.substr( m[0].length );
            }
          } // tight_search

          if ( li_accumulate.length ) {
            add( last_li, loose, this.processInline( li_accumulate ), nl );
            // Loose mode will have been dealt with. Reset it
            loose = false;
            li_accumulate = "";
          }

          // Look at the next block - we might have a loose list. Or an extra
          // paragraph for the current li
          var contained = get_contained_blocks( stack.length, next );

          // Deal with code blocks or properly nested lists
          if ( contained.length > 0 ) {
            // Make sure all listitems up the stack are paragraphs
            forEach( stack, paragraphify, this);

            last_li.push.apply( last_li, this.toTree( contained, [] ) );
          }

          var next_block = next[0] && next[0].valueOf() || "";

          if ( next_block.match(is_list_re) || next_block.match( /^ / ) ) {
            block = next.shift();

            // Check for an HR following a list: features/lists/hr_abutting
            var hr = this.dialect.block.horizRule( block, next );

            if ( hr ) {
              ret.push.apply(ret, hr);
              break;
            }

            // Make sure all listitems up the stack are paragraphs
            forEach( stack, paragraphify, this);

            loose = true;
            continue loose_search;
          }
          break;
        } // loose_search

        return ret;
      };
    })(),

    blockquote: function blockquote( block, next ) {
      if ( !block.match( /^>/m ) )
        return undefined;

      var jsonml = [];

      // separate out the leading abutting block, if any. I.e. in this case:
      //
      //  a
      //  > b
      //
      if ( block[ 0 ] != ">" ) {
        var lines = block.split( /\n/ ),
            prev = [],
            line_no = block.lineNumber;

        // keep shifting lines until you find a crotchet
        while ( lines.length && lines[ 0 ][ 0 ] != ">" ) {
            prev.push( lines.shift() );
            line_no++;
        }

        var abutting = mk_block( prev.join( "\n" ), "\n", block.lineNumber );
        jsonml.push.apply( jsonml, this.processBlock( abutting, [] ) );
        // reassemble new block of just block quotes!
        block = mk_block( lines.join( "\n" ), block.trailing, line_no );
      }


      // if the next block is also a blockquote merge it in
      while ( next.length && next[ 0 ][ 0 ] == ">" ) {
        var b = next.shift();
        block = mk_block( block + block.trailing + b, b.trailing, block.lineNumber );
      }

      // Strip off the leading "> " and re-process as a block.
      var input = block.replace( /^> ?/gm, "" ),
          old_tree = this.tree,
          processedBlock = this.toTree( input, [ "blockquote" ] ),
          attr = extract_attr( processedBlock );

      // If any link references were found get rid of them
      if ( attr && attr.references ) {
        delete attr.references;
        // And then remove the attribute object if it's empty
        if ( isEmpty( attr ) ) {
          processedBlock.splice( 1, 1 );
        }
      }

      jsonml.push( processedBlock );
      return jsonml;
    },

    referenceDefn: function referenceDefn( block, next) {
      var re = /^\s*\[(.*?)\]:\s*(\S+)(?:\s+(?:(['"])(.*?)\3|\((.*?)\)))?\n?/;
      // interesting matches are [ , ref_id, url, , title, title ]

      if ( !block.match(re) )
        return undefined;

      // make an attribute node if it doesn't exist
      if ( !extract_attr( this.tree ) ) {
        this.tree.splice( 1, 0, {} );
      }

      var attrs = extract_attr( this.tree );

      // make a references hash if it doesn't exist
      if ( attrs.references === undefined ) {
        attrs.references = {};
      }

      var b = this.loop_re_over_block(re, block, function( m ) {

        if ( m[2] && m[2][0] == "<" && m[2][m[2].length-1] == ">" )
          m[2] = m[2].substring( 1, m[2].length - 1 );

        var ref = attrs.references[ m[1].toLowerCase() ] = {
          href: m[2]
        };

        if ( m[4] !== undefined )
          ref.title = m[4];
        else if ( m[5] !== undefined )
          ref.title = m[5];

      } );

      if ( b.length )
        next.unshift( mk_block( b, block.trailing ) );

      return [];
    },

    para: function para( block, next ) {
      // everything's a para!
      return [ ["para"].concat( this.processInline( block ) ) ];
    }
  }
};

Markdown.dialects.Gruber.inline = {

    __oneElement__: function oneElement( text, patterns_or_re, previous_nodes ) {
      var m,
          res,
          lastIndex = 0;

      patterns_or_re = patterns_or_re || this.dialect.inline.__patterns__;
      var re = new RegExp( "([\\s\\S]*?)(" + (patterns_or_re.source || patterns_or_re) + ")" );

      m = re.exec( text );
      if (!m) {
        // Just boring text
        return [ text.length, text ];
      }
      else if ( m[1] ) {
        // Some un-interesting text matched. Return that first
        return [ m[1].length, m[1] ];
      }

      var res;
      if ( m[2] in this.dialect.inline ) {
        res = this.dialect.inline[ m[2] ].call(
                  this,
                  text.substr( m.index ), m, previous_nodes || [] );
      }
      // Default for now to make dev easier. just slurp special and output it.
      res = res || [ m[2].length, m[2] ];
      return res;
    },

    __call__: function inline( text, patterns ) {

      var out = [],
          res;

      function add(x) {
        //D:self.debug("  adding output", uneval(x));
        if ( typeof x == "string" && typeof out[out.length-1] == "string" )
          out[ out.length-1 ] += x;
        else
          out.push(x);
      }

      while ( text.length > 0 ) {
        res = this.dialect.inline.__oneElement__.call(this, text, patterns, out );
        text = text.substr( res.shift() );
        forEach(res, add )
      }

      return out;
    },

    // These characters are intersting elsewhere, so have rules for them so that
    // chunks of plain text blocks don't include them
    "]": function () {},
    "}": function () {},

    __escape__ : /^\\[\\`\*_{}\[\]()#\+.!\-]/,

    "\\": function escaped( text ) {
      // [ length of input processed, node/children to add... ]
      // Only esacape: \ ` * _ { } [ ] ( ) # * + - . !
      if ( this.dialect.inline.__escape__.exec( text ) )
        return [ 2, text.charAt( 1 ) ];
      else
        // Not an esacpe
        return [ 1, "\\" ];
    },

    "![": function image( text ) {

      // Unlike images, alt text is plain text only. no other elements are
      // allowed in there

      // ![Alt text](/path/to/img.jpg "Optional title")
      //      1          2            3       4         <--- captures
      var m = text.match( /^!\[(.*?)\][ \t]*\([ \t]*([^")]*?)(?:[ \t]+(["'])(.*?)\3)?[ \t]*\)/ );

      if ( m ) {
        if ( m[2] && m[2][0] == "<" && m[2][m[2].length-1] == ">" )
          m[2] = m[2].substring( 1, m[2].length - 1 );

        m[2] = this.dialect.inline.__call__.call( this, m[2], /\\/ )[0];

        var attrs = { alt: m[1], href: m[2] || "" };
        if ( m[4] !== undefined)
          attrs.title = m[4];

        return [ m[0].length, [ "img", attrs ] ];
      }

      // ![Alt text][id]
      m = text.match( /^!\[(.*?)\][ \t]*\[(.*?)\]/ );

      if ( m ) {
        // We can't check if the reference is known here as it likely wont be
        // found till after. Check it in md tree->hmtl tree conversion
        return [ m[0].length, [ "img_ref", { alt: m[1], ref: m[2].toLowerCase(), original: m[0] } ] ];
      }

      // Just consume the '!['
      return [ 2, "![" ];
    },

    "[": function link( text ) {

      var orig = String(text);
      // Inline content is possible inside `link text`
      var res = Markdown.DialectHelpers.inline_until_char.call( this, text.substr(1), "]" );

      // No closing ']' found. Just consume the [
      if ( !res ) return [ 1, "[" ];

      var consumed = 1 + res[ 0 ],
          children = res[ 1 ],
          link,
          attrs;

      // At this point the first [...] has been parsed. See what follows to find
      // out which kind of link we are (reference or direct url)
      text = text.substr( consumed );

      // [link text](/path/to/img.jpg "Optional title")
      //                 1            2       3         <--- captures
      // This will capture up to the last paren in the block. We then pull
      // back based on if there a matching ones in the url
      //    ([here](/url/(test))
      // The parens have to be balanced
      var m = text.match( /^\s*\([ \t]*([^"']*)(?:[ \t]+(["'])(.*?)\2)?[ \t]*\)/ );
      if ( m ) {
        var url = m[1];
        consumed += m[0].length;

        if ( url && url[0] == "<" && url[url.length-1] == ">" )
          url = url.substring( 1, url.length - 1 );

        // If there is a title we don't have to worry about parens in the url
        if ( !m[3] ) {
          var open_parens = 1; // One open that isn't in the capture
          for ( var len = 0; len < url.length; len++ ) {
            switch ( url[len] ) {
            case "(":
              open_parens++;
              break;
            case ")":
              if ( --open_parens == 0) {
                consumed -= url.length - len;
                url = url.substring(0, len);
              }
              break;
            }
          }
        }

        // Process escapes only
        url = this.dialect.inline.__call__.call( this, url, /\\/ )[0];

        attrs = { href: url || "" };
        if ( m[3] !== undefined)
          attrs.title = m[3];

        link = [ "link", attrs ].concat( children );
        return [ consumed, link ];
      }

      // [Alt text][id]
      // [Alt text] [id]
      m = text.match( /^\s*\[(.*?)\]/ );

      if ( m ) {

        consumed += m[ 0 ].length;

        // [links][] uses links as its reference
        attrs = { ref: ( m[ 1 ] || String(children) ).toLowerCase(),  original: orig.substr( 0, consumed ) };

        link = [ "link_ref", attrs ].concat( children );

        // We can't check if the reference is known here as it likely wont be
        // found till after. Check it in md tree->hmtl tree conversion.
        // Store the original so that conversion can revert if the ref isn't found.
        return [ consumed, link ];
      }

      // [id]
      // Only if id is plain (no formatting.)
      if ( children.length == 1 && typeof children[0] == "string" ) {

        attrs = { ref: children[0].toLowerCase(),  original: orig.substr( 0, consumed ) };
        link = [ "link_ref", attrs, children[0] ];
        return [ consumed, link ];
      }

      // Just consume the "["
      return [ 1, "[" ];
    },


    "<": function autoLink( text ) {
      var m;

      if ( ( m = text.match( /^<(?:((https?|ftp|mailto):[^>]+)|(.*?@.*?\.[a-zA-Z]+))>/ ) ) != null ) {
        if ( m[3] ) {
          return [ m[0].length, [ "link", { href: "mailto:" + m[3] }, m[3] ] ];

        }
        else if ( m[2] == "mailto" ) {
          return [ m[0].length, [ "link", { href: m[1] }, m[1].substr("mailto:".length ) ] ];
        }
        else
          return [ m[0].length, [ "link", { href: m[1] }, m[1] ] ];
      }

      return [ 1, "<" ];
    },

    "`": function inlineCode( text ) {
      // Inline code block. as many backticks as you like to start it
      // Always skip over the opening ticks.
      var m = text.match( /(`+)(([\s\S]*?)\1)/ );

      if ( m && m[2] )
        return [ m[1].length + m[2].length, [ "inlinecode", m[3] ] ];
      else {
        // TODO: No matching end code found - warn!
        return [ 1, "`" ];
      }
    },

    "  \n": function lineBreak( text ) {
      return [ 3, [ "linebreak" ] ];
    }

};

// Meta Helper/generator method for em and strong handling
function strong_em( tag, md ) {

  var state_slot = tag + "_state",
      other_slot = tag == "strong" ? "em_state" : "strong_state";

  function CloseTag(len) {
    this.len_after = len;
    this.name = "close_" + md;
  }

  return function ( text, orig_match ) {

    if ( this[state_slot][0] == md ) {
      // Most recent em is of this type
      //D:this.debug("closing", md);
      this[state_slot].shift();

      // "Consume" everything to go back to the recrusion in the else-block below
      return[ text.length, new CloseTag(text.length-md.length) ];
    }
    else {
      // Store a clone of the em/strong states
      var other = this[other_slot].slice(),
          state = this[state_slot].slice();

      this[state_slot].unshift(md);

      //D:this.debug_indent += "  ";

      // Recurse
      var res = this.processInline( text.substr( md.length ) );
      //D:this.debug_indent = this.debug_indent.substr(2);

      var last = res[res.length - 1];

      //D:this.debug("processInline from", tag + ": ", uneval( res ) );

      var check = this[state_slot].shift();
      if ( last instanceof CloseTag ) {
        res.pop();
        // We matched! Huzzah.
        var consumed = text.length - last.len_after;
        return [ consumed, [ tag ].concat(res) ];
      }
      else {
        // Restore the state of the other kind. We might have mistakenly closed it.
        this[other_slot] = other;
        this[state_slot] = state;

        // We can't reuse the processed result as it could have wrong parsing contexts in it.
        return [ md.length, md ];
      }
    }
  }; // End returned function
}

Markdown.dialects.Gruber.inline["**"] = strong_em("strong", "**");
Markdown.dialects.Gruber.inline["__"] = strong_em("strong", "__");
Markdown.dialects.Gruber.inline["*"]  = strong_em("em", "*");
Markdown.dialects.Gruber.inline["_"]  = strong_em("em", "_");


// Build default order from insertion order.
Markdown.buildBlockOrder = function(d) {
  var ord = [];
  for ( var i in d ) {
    if ( i == "__order__" || i == "__call__" ) continue;
    ord.push( i );
  }
  d.__order__ = ord;
};

// Build patterns for inline matcher
Markdown.buildInlinePatterns = function(d) {
  var patterns = [];

  for ( var i in d ) {
    // __foo__ is reserved and not a pattern
    if ( i.match( /^__.*__$/) ) continue;
    var l = i.replace( /([\\.*+?|()\[\]{}])/g, "\\$1" )
             .replace( /\n/, "\\n" );
    patterns.push( i.length == 1 ? l : "(?:" + l + ")" );
  }

  patterns = patterns.join("|");
  d.__patterns__ = patterns;
  //print("patterns:", uneval( patterns ) );

  var fn = d.__call__;
  d.__call__ = function(text, pattern) {
    if ( pattern != undefined ) {
      return fn.call(this, text, pattern);
    }
    else
    {
      return fn.call(this, text, patterns);
    }
  };
};

Markdown.DialectHelpers = {};
Markdown.DialectHelpers.inline_until_char = function( text, want ) {
  var consumed = 0,
      nodes = [];

  while ( true ) {
    if ( text.charAt( consumed ) == want ) {
      // Found the character we were looking for
      consumed++;
      return [ consumed, nodes ];
    }

    if ( consumed >= text.length ) {
      // No closing char found. Abort.
      return null;
    }

    var res = this.dialect.inline.__oneElement__.call(this, text.substr( consumed ) );
    consumed += res[ 0 ];
    // Add any returned nodes.
    nodes.push.apply( nodes, res.slice( 1 ) );
  }
}

// Helper function to make sub-classing a dialect easier
Markdown.subclassDialect = function( d ) {
  function Block() {}
  Block.prototype = d.block;
  function Inline() {}
  Inline.prototype = d.inline;

  return { block: new Block(), inline: new Inline() };
};

Markdown.buildBlockOrder ( Markdown.dialects.Gruber.block );
Markdown.buildInlinePatterns( Markdown.dialects.Gruber.inline );

Markdown.dialects.Maruku = Markdown.subclassDialect( Markdown.dialects.Gruber );

Markdown.dialects.Maruku.processMetaHash = function processMetaHash( meta_string ) {
  var meta = split_meta_hash( meta_string ),
      attr = {};

  for ( var i = 0; i < meta.length; ++i ) {
    // id: #foo
    if ( /^#/.test( meta[ i ] ) ) {
      attr.id = meta[ i ].substring( 1 );
    }
    // class: .foo
    else if ( /^\./.test( meta[ i ] ) ) {
      // if class already exists, append the new one
      if ( attr["class"] ) {
        attr["class"] = attr["class"] + meta[ i ].replace( /./, " " );
      }
      else {
        attr["class"] = meta[ i ].substring( 1 );
      }
    }
    // attribute: foo=bar
    else if ( /\=/.test( meta[ i ] ) ) {
      var s = meta[ i ].split( /\=/ );
      attr[ s[ 0 ] ] = s[ 1 ];
    }
  }

  return attr;
}

function split_meta_hash( meta_string ) {
  var meta = meta_string.split( "" ),
      parts = [ "" ],
      in_quotes = false;

  while ( meta.length ) {
    var letter = meta.shift();
    switch ( letter ) {
      case " " :
        // if we're in a quoted section, keep it
        if ( in_quotes ) {
          parts[ parts.length - 1 ] += letter;
        }
        // otherwise make a new part
        else {
          parts.push( "" );
        }
        break;
      case "'" :
      case '"' :
        // reverse the quotes and move straight on
        in_quotes = !in_quotes;
        break;
      case "\\" :
        // shift off the next letter to be used straight away.
        // it was escaped so we'll keep it whatever it is
        letter = meta.shift();
      default :
        parts[ parts.length - 1 ] += letter;
        break;
    }
  }

  return parts;
}

Markdown.dialects.Maruku.block.document_meta = function document_meta( block, next ) {
  // we're only interested in the first block
  if ( block.lineNumber > 1 ) return undefined;

  // document_meta blocks consist of one or more lines of `Key: Value\n`
  if ( ! block.match( /^(?:\w+:.*\n)*\w+:.*$/ ) ) return undefined;

  // make an attribute node if it doesn't exist
  if ( !extract_attr( this.tree ) ) {
    this.tree.splice( 1, 0, {} );
  }

  var pairs = block.split( /\n/ );
  for ( p in pairs ) {
    var m = pairs[ p ].match( /(\w+):\s*(.*)$/ ),
        key = m[ 1 ].toLowerCase(),
        value = m[ 2 ];

    this.tree[ 1 ][ key ] = value;
  }

  // document_meta produces no content!
  return [];
};

Markdown.dialects.Maruku.block.block_meta = function block_meta( block, next ) {
  // check if the last line of the block is an meta hash
  var m = block.match( /(^|\n) {0,3}\{:\s*((?:\\\}|[^\}])*)\s*\}$/ );
  if ( !m ) return undefined;

  // process the meta hash
  var attr = this.dialect.processMetaHash( m[ 2 ] );

  var hash;

  // if we matched ^ then we need to apply meta to the previous block
  if ( m[ 1 ] === "" ) {
    var node = this.tree[ this.tree.length - 1 ];
    hash = extract_attr( node );

    // if the node is a string (rather than JsonML), bail
    if ( typeof node === "string" ) return undefined;

    // create the attribute hash if it doesn't exist
    if ( !hash ) {
      hash = {};
      node.splice( 1, 0, hash );
    }

    // add the attributes in
    for ( a in attr ) {
      hash[ a ] = attr[ a ];
    }

    // return nothing so the meta hash is removed
    return [];
  }

  // pull the meta hash off the block and process what's left
  var b = block.replace( /\n.*$/, "" ),
      result = this.processBlock( b, [] );

  // get or make the attributes hash
  hash = extract_attr( result[ 0 ] );
  if ( !hash ) {
    hash = {};
    result[ 0 ].splice( 1, 0, hash );
  }

  // attach the attributes to the block
  for ( a in attr ) {
    hash[ a ] = attr[ a ];
  }

  return result;
};

Markdown.dialects.Maruku.block.definition_list = function definition_list( block, next ) {
  // one or more terms followed by one or more definitions, in a single block
  var tight = /^((?:[^\s:].*\n)+):\s+([\s\S]+)$/,
      list = [ "dl" ],
      i, m;

  // see if we're dealing with a tight or loose block
  if ( ( m = block.match( tight ) ) ) {
    // pull subsequent tight DL blocks out of `next`
    var blocks = [ block ];
    while ( next.length && tight.exec( next[ 0 ] ) ) {
      blocks.push( next.shift() );
    }

    for ( var b = 0; b < blocks.length; ++b ) {
      var m = blocks[ b ].match( tight ),
          terms = m[ 1 ].replace( /\n$/, "" ).split( /\n/ ),
          defns = m[ 2 ].split( /\n:\s+/ );

      // print( uneval( m ) );

      for ( i = 0; i < terms.length; ++i ) {
        list.push( [ "dt", terms[ i ] ] );
      }

      for ( i = 0; i < defns.length; ++i ) {
        // run inline processing over the definition
        list.push( [ "dd" ].concat( this.processInline( defns[ i ].replace( /(\n)\s+/, "$1" ) ) ) );
      }
    }
  }
  else {
    return undefined;
  }

  return [ list ];
};

// splits on unescaped instances of @ch. If @ch is not a character the result
// can be unpredictable

Markdown.dialects.Maruku.block.table = function table (block, next) {

    var _split_on_unescaped = function(s, ch) {
        ch = ch || '\\s';
        if (ch.match(/^[\\|\[\]{}?*.+^$]$/)) { ch = '\\' + ch; }
        var res = [ ],
            r = new RegExp('^((?:\\\\.|[^\\\\' + ch + '])*)' + ch + '(.*)'),
            m;
        while(m = s.match(r)) {
            res.push(m[1]);
            s = m[2];
        }
        res.push(s);
        return res;
    }

    var leading_pipe = /^ {0,3}\|(.+)\n {0,3}\|\s*([\-:]+[\-| :]*)\n((?:\s*\|.*(?:\n|$))*)(?=\n|$)/,
        // find at least an unescaped pipe in each line
        no_leading_pipe = /^ {0,3}(\S(?:\\.|[^\\|])*\|.*)\n {0,3}([\-:]+\s*\|[\-| :]*)\n((?:(?:\\.|[^\\|])*\|.*(?:\n|$))*)(?=\n|$)/,
        i, m;
    if (m = block.match(leading_pipe)) {
        // remove leading pipes in contents
        // (header and horizontal rule already have the leading pipe left out)
        m[3] = m[3].replace(/^\s*\|/gm, '');
    } else if (! ( m = block.match(no_leading_pipe))) {
        return undefined;
    }

    var table = [ "table", [ "thead", [ "tr" ] ], [ "tbody" ] ];

    // remove trailing pipes, then split on pipes
    // (no escaped pipes are allowed in horizontal rule)
    m[2] = m[2].replace(/\|\s*$/, '').split('|');

    // process alignment
    var html_attrs = [ ];
    forEach (m[2], function (s) {
        if (s.match(/^\s*-+:\s*$/))       html_attrs.push({align: "right"});
        else if (s.match(/^\s*:-+\s*$/))  html_attrs.push({align: "left"});
        else if (s.match(/^\s*:-+:\s*$/)) html_attrs.push({align: "center"});
        else                              html_attrs.push({});
    });

    // now for the header, avoid escaped pipes
    m[1] = _split_on_unescaped(m[1].replace(/\|\s*$/, ''), '|');
    for (i = 0; i < m[1].length; i++) {
        table[1][1].push(['th', html_attrs[i] || {}].concat(
            this.processInline(m[1][i].trim())));
    }

    // now for body contents
    forEach (m[3].replace(/\|\s*$/mg, '').split('\n'), function (row) {
        var html_row = ['tr'];
        row = _split_on_unescaped(row, '|');
        for (i = 0; i < row.length; i++) {
            html_row.push(['td', html_attrs[i] || {}].concat(this.processInline(row[i].trim())));
        }
        table[2].push(html_row);
    }, this);

    return [table];
}

Markdown.dialects.Maruku.inline[ "{:" ] = function inline_meta( text, matches, out ) {
  if ( !out.length ) {
    return [ 2, "{:" ];
  }

  // get the preceeding element
  var before = out[ out.length - 1 ];

  if ( typeof before === "string" ) {
    return [ 2, "{:" ];
  }

  // match a meta hash
  var m = text.match( /^\{:\s*((?:\\\}|[^\}])*)\s*\}/ );

  // no match, false alarm
  if ( !m ) {
    return [ 2, "{:" ];
  }

  // attach the attributes to the preceeding element
  var meta = this.dialect.processMetaHash( m[ 1 ] ),
      attr = extract_attr( before );

  if ( !attr ) {
    attr = {};
    before.splice( 1, 0, attr );
  }

  for ( var k in meta ) {
    attr[ k ] = meta[ k ];
  }

  // cut out the string and replace it with nothing
  return [ m[ 0 ].length, "" ];
};

Markdown.dialects.Maruku.inline.__escape__ = /^\\[\\`\*_{}\[\]()#\+.!\-|:]/;

Markdown.buildBlockOrder ( Markdown.dialects.Maruku.block );
Markdown.buildInlinePatterns( Markdown.dialects.Maruku.inline );

var isArray = Array.isArray || function(obj) {
  return Object.prototype.toString.call(obj) == "[object Array]";
};

var forEach;
// Don't mess with Array.prototype. Its not friendly
if ( Array.prototype.forEach ) {
  forEach = function( arr, cb, thisp ) {
    return arr.forEach( cb, thisp );
  };
}
else {
  forEach = function(arr, cb, thisp) {
    for (var i = 0; i < arr.length; i++) {
      cb.call(thisp || arr, arr[i], i, arr);
    }
  }
}

var isEmpty = function( obj ) {
  for ( var key in obj ) {
    if ( hasOwnProperty.call( obj, key ) ) {
      return false;
    }
  }

  return true;
}

function extract_attr( jsonml ) {
  return isArray(jsonml)
      && jsonml.length > 1
      && typeof jsonml[ 1 ] === "object"
      && !( isArray(jsonml[ 1 ]) )
      ? jsonml[ 1 ]
      : undefined;
}



/**
 *  renderJsonML( jsonml[, options] ) -> String
 *  - jsonml (Array): JsonML array to render to XML
 *  - options (Object): options
 *
 *  Converts the given JsonML into well-formed XML.
 *
 *  The options currently understood are:
 *
 *  - root (Boolean): wether or not the root node should be included in the
 *    output, or just its children. The default `false` is to not include the
 *    root itself.
 */
expose.renderJsonML = function( jsonml, options ) {
  options = options || {};
  // include the root element in the rendered output?
  options.root = options.root || false;

  var content = [];

  if ( options.root ) {
    content.push( render_tree( jsonml ) );
  }
  else {
    jsonml.shift(); // get rid of the tag
    if ( jsonml.length && typeof jsonml[ 0 ] === "object" && !( jsonml[ 0 ] instanceof Array ) ) {
      jsonml.shift(); // get rid of the attributes
    }

    while ( jsonml.length ) {
      content.push( render_tree( jsonml.shift() ) );
    }
  }

  return content.join( "\n\n" );
};

function escapeHTML( text ) {
  return text.replace( /&/g, "&amp;" )
             .replace( /</g, "&lt;" )
             .replace( />/g, "&gt;" )
             .replace( /"/g, "&quot;" )
             .replace( /'/g, "&#39;" );
}

function render_tree( jsonml ) {
  // basic case
  if ( typeof jsonml === "string" ) {
    return escapeHTML( jsonml );
  }

  var tag = jsonml.shift(),
      attributes = {},
      content = [];

  if ( jsonml.length && typeof jsonml[ 0 ] === "object" && !( jsonml[ 0 ] instanceof Array ) ) {
    attributes = jsonml.shift();
  }

  while ( jsonml.length ) {
    content.push( render_tree( jsonml.shift() ) );
  }

  var tag_attrs = "";
  for ( var a in attributes ) {
    tag_attrs += " " + a + '="' + escapeHTML( attributes[ a ] ) + '"';
  }

  // be careful about adding whitespace here for inline elements
  if ( tag == "img" || tag == "br" || tag == "hr" ) {
    return "<"+ tag + tag_attrs + "/>";
  }
  else {
    return "<"+ tag + tag_attrs + ">" + content.join( "" ) + "</" + tag + ">";
  }
}

function convert_tree_to_html( tree, references, options ) {
  var i;
  options = options || {};

  // shallow clone
  var jsonml = tree.slice( 0 );

  if ( typeof options.preprocessTreeNode === "function" ) {
      jsonml = options.preprocessTreeNode(jsonml, references);
  }

  // Clone attributes if they exist
  var attrs = extract_attr( jsonml );
  if ( attrs ) {
    jsonml[ 1 ] = {};
    for ( i in attrs ) {
      jsonml[ 1 ][ i ] = attrs[ i ];
    }
    attrs = jsonml[ 1 ];
  }

  // basic case
  if ( typeof jsonml === "string" ) {
    return jsonml;
  }

  // convert this node
  switch ( jsonml[ 0 ] ) {
    case "header":
      jsonml[ 0 ] = "h" + jsonml[ 1 ].level;
      delete jsonml[ 1 ].level;
      break;
    case "bulletlist":
      jsonml[ 0 ] = "ul";
      break;
    case "numberlist":
      jsonml[ 0 ] = "ol";
      break;
    case "listitem":
      jsonml[ 0 ] = "li";
      break;
    case "para":
      jsonml[ 0 ] = "p";
      break;
    case "markdown":
      jsonml[ 0 ] = "html";
      if ( attrs ) delete attrs.references;
      break;
    case "code_block":
      jsonml[ 0 ] = "pre";
      i = attrs ? 2 : 1;
      var code = [ "code" ];
      code.push.apply( code, jsonml.splice( i, jsonml.length - i ) );
      jsonml[ i ] = code;
      break;
    case "inlinecode":
      jsonml[ 0 ] = "code";
      break;
    case "img":
      jsonml[ 1 ].src = jsonml[ 1 ].href;
      delete jsonml[ 1 ].href;
      break;
    case "linebreak":
      jsonml[ 0 ] = "br";
    break;
    case "link":
      jsonml[ 0 ] = "a";
      break;
    case "link_ref":
      jsonml[ 0 ] = "a";

      // grab this ref and clean up the attribute node
      var ref = references[ attrs.ref ];

      // if the reference exists, make the link
      if ( ref ) {
        delete attrs.ref;

        // add in the href and title, if present
        attrs.href = ref.href;
        if ( ref.title ) {
          attrs.title = ref.title;
        }

        // get rid of the unneeded original text
        delete attrs.original;
      }
      // the reference doesn't exist, so revert to plain text
      else {
        return attrs.original;
      }
      break;
    case "img_ref":
      jsonml[ 0 ] = "img";

      // grab this ref and clean up the attribute node
      var ref = references[ attrs.ref ];

      // if the reference exists, make the link
      if ( ref ) {
        delete attrs.ref;

        // add in the href and title, if present
        attrs.src = ref.href;
        if ( ref.title ) {
          attrs.title = ref.title;
        }

        // get rid of the unneeded original text
        delete attrs.original;
      }
      // the reference doesn't exist, so revert to plain text
      else {
        return attrs.original;
      }
      break;
  }

  // convert all the children
  i = 1;

  // deal with the attribute node, if it exists
  if ( attrs ) {
    // if there are keys, skip over it
    for ( var key in jsonml[ 1 ] ) {
        i = 2;
        break;
    }
    // if there aren't, remove it
    if ( i === 1 ) {
      jsonml.splice( i, 1 );
    }
  }

  for ( ; i < jsonml.length; ++i ) {
    jsonml[ i ] = convert_tree_to_html( jsonml[ i ], references, options );
  }

  return jsonml;
}


// merges adjacent text nodes into a single node
function merge_text_nodes( jsonml ) {
  // skip the tag name and attribute hash
  var i = extract_attr( jsonml ) ? 2 : 1;

  while ( i < jsonml.length ) {
    // if it's a string check the next item too
    if ( typeof jsonml[ i ] === "string" ) {
      if ( i + 1 < jsonml.length && typeof jsonml[ i + 1 ] === "string" ) {
        // merge the second string into the first and remove it
        jsonml[ i ] += jsonml.splice( i + 1, 1 )[ 0 ];
      }
      else {
        ++i;
      }
    }
    // if it's not a string recurse
    else {
      merge_text_nodes( jsonml[ i ] );
      ++i;
    }
  }
}

} )( (function() {
  if ( typeof exports === "undefined" ) {
    window.markdown = {};
    return window.markdown;
  }
  else {
    return exports;
  }
} )() );

},{"util":97}]},{},[32])
//# sourceMappingURL=organization.uncompressed.js.map

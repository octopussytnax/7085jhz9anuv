(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var MapCardPreview = require('../../../common/views/mapcard_preview');
var Utils = (typeof window !== "undefined" ? window['cdb']['Utils'] : typeof global !== "undefined" ? global['cdb']['Utils'] : null);

/**
 * View representing an item in the list under datasets route.
 */
module.exports = cdb.core.View.extend({

  tagName: 'li',
  className: 'MapsList-item',

  initialize: function() {
    this.template = cdb.templates.getTemplate('data_library/content/list/dataset_item_template');
  },

  render: function() {
    this.clearSubViews();

    var vis = this.model;

    var d = {
      vis: vis.attributes,
      date: vis.get('order') === 'updated_at' ? vis.get('updated_at') : vis.get('created_at'),
      datasetSize: this._getDatasetSize(vis.get('table')['size']),
      geomType: this._getGeometryType(vis.get('table')['geometry_types']),
      account_host: cdb.config.get('account_host'),
      dataset_base_url: cdb.config.get('dataset_base_url')
    };

    this.$el.html(this.template(d));

    this._renderMapThumbnail();

    return this;
  },

  _renderMapThumbnail: function() {
    var username = this.model.get('permission')['owner']['username'];
    var mapCardPreview = new MapCardPreview({
      el: this.$('.js-header'),
      username: username,
      width: 298,
      height: 220,
      visId: this.model.get('id'),
      mapsApiResource: cdb.config.getMapsResourceName(username)
    });

    if (this.imageURL) {
      mapCardPreview.loadURL(this.imageURL);
    } else {
      mapCardPreview.load();
    }

    mapCardPreview.bind("loaded", function(url) {
      this.imageURL = url;
    }, this);

    this.addView(mapCardPreview);
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

  _getDatasetSize: function(size) {
    return size ? cdb.Utils.readablizeBytes(size, true).split(' ') : 0;
  },

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../../common/views/mapcard_preview":2}],4:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);

/**
 * Represents a map card on data library.
 */

module.exports = cdb.core.View.extend({

  className: 'MapsList-item MapsList-item--fake',
  tagName: 'li',

  initialize: function() {
    this.template = cdb.templates.getTemplate('data_library/content/list/placeholder_item_template');
  },

  render: function() {
    this.clearSubViews();

    this.$el.html(
      this.template()
    );

    return this;
  },

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],5:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var DatasetsItem = require('./dataset_item_view');
var PlaceholderItem = require('./placeholder_item_view');
var MAP_CARDS_PER_ROW = 3;

/**
 *  View representing the list of items
 */

module.exports = cdb.core.View.extend({

  tagName: 'ul',

  initialize: function() {
    this._initBinds();
  },

  render: function() {
    if (this.collection.options.get('page') === 1) {
      this.clearSubViews();
    }

    this.collection.each(this._addItem, this);

    var klass = 'MapsList';

    if (this.collection._ITEMS_PER_PAGE * this.collection.options.get('page') >= this.collection.total_entries) {
      klass += ' is-bottom';
    }

    this.$el.attr('class', klass);

    if (this.collection.size() > 0) {
      this._fillEmptySlotsWithPlaceholderItems();
    }

    return this;
  },

  show: function() {
    this.$el.removeClass('is-hidden');
  },

  hide: function() {
    this.$el.addClass('is-hidden');
  },

  _addItem: function(m) {
    var item = new DatasetsItem({
      model: m
    });

    this.addView(item);
    this.$el.append(item.render().el);
  },

  _initBinds: function() {
    this.collection.bind('reset', this.render, this);
    this.add_related_model(this.collection);
  },

  _fillEmptySlotsWithPlaceholderItems: function() {
    _.times(this._emptySlotsCount(), function(i) {
      var view = new PlaceholderItem();
      this.$el.append(view.render().el);
      this.addView(view);
    }, this);
  },

  _emptySlotsCount: function() {
    return (this.collection._ITEMS_PER_PAGE - this.collection.size()) % MAP_CARDS_PER_ROW;
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./dataset_item_view":3,"./placeholder_item_view":4}],6:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var randomQuote = require('../../common/view_helpers/random_quote');

/*
 *  Content result default view
 */

module.exports = cdb.core.View.extend({

  initialize: function() {
    this.template = cdb.templates.getTemplate(this.options.template);

    this._initBinds();
  },

  render: function() {
    this.$el.html(this.template({
      // defaultUrl:     this.router.currentDashboardUrl(),
      defaultUrl:     '',
      page:           this.collection.options.get('page'),
      isSearching:    this.model.get('is_searching'),
      tag:            this.collection.options.get('tags'),
      q:              this.collection.options.get('q'),
      quote:          randomQuote(),
      type:           this.collection.options.get('type'),
      totalItems:     this.collection.size(),
      totalEntries:   this.collection.total_entries
    }));

    return this;
  },

  _initBinds: function() {
    this.collection.bind('change', this.render, this);
    this.collection.bind('remove add reset', this.render, this);
    this.add_related_model(this.collection);
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../common/view_helpers/random_quote":1}],7:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);

module.exports = cdb.admin.Visualizations.extend({

  _ITEMS_PER_PAGE: 12,

  model: cdb.core.Model,

  url: function() {
    var u = '//' + cdb.config.get('data_library_user') + '.' + cdb.config.get('account_host') + '/api/v1/viz';
    u += "?" + this._createUrlOptions();
    return u;
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],8:[function(require,module,exports){
(function (global){
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var UserInfoView = require('../public_dashboard/user_info_view');
var UserSettingsView = require('../public_common/user_settings_view');
var UserIndustriesView = require('../public_common/user_industries_view');
var DataLibrary = require('./main_view');

/**
 * Entry point for data-library index
 */

$(function() {
  cdb.init(function() {
    cdb.templates.namespace = 'cartodb/';
    cdb.config.set(window.config);
    cdb.config.set('data_library_user', window.config.common_data_user);
    cdb.config.set('dataset_base_url', window.dataset_base_url);

    var userIndustriesView = new UserIndustriesView({
      el: $('.js-user-industries'),
    });

    $(document.body).bind('click', function() {
      cdb.god.trigger('closeDialogs');
    });

    var authenticatedUser = new cdb.open.AuthenticatedUser({ host: cdb.config.get('data_library_user') + '.' + cdb.config.get('account_host')});

    authenticatedUser.sync = Backbone.withCORS;

    authenticatedUser.bind('change', function() {
      if (authenticatedUser.get('username')) {
        var user = new cdb.admin.User(authenticatedUser.attributes);
        var userSettingsView = new UserSettingsView({
          el: $('.js-user-settings'),
          model: user
        });
        userSettingsView.render();

        $('.js-login').hide();
        $('.js-learn').show();
      }
    });

    var userInfoView = new UserInfoView({
      el: $('.js-user-info')
    });
    userInfoView.render();

    var data_library = new DataLibrary({
      el: $('.js-data_library')
    });

    data_library.render();

    authenticatedUser.fetch();
  });
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../public_common/user_industries_view":14,"../public_common/user_settings_view":16,"../public_dashboard/user_info_view":18,"./main_view":12}],9:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
cdb.admin = (typeof window !== "undefined" ? window['cdb']['admin'] : typeof global !== "undefined" ? global['cdb']['admin'] : null);
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);

/**
 * The content of the dropdown menu opened by the user in the data-library filters, e.g.:
 *   Category ▼
 *      ______/\____
 *     |            |
 *     |    this    |
 *     |____________|
 */
module.exports = cdb.admin.DropdownMenu.extend({
  className: 'CDB-Text Dropdown Dropdown--public',

  events: {
    'click': 'killEvent',
    'click .js-all': '_onClickAll',
    'click .js-categoryLink': '_onClickLink'
  },

  initialize: function() {
    this.elder('initialize');
    this.template_base = cdb.templates.getTemplate('data_library/filters/dropdown/template');

    // TODO: fetch tags dynamically

    // Necessary to hide dialog on click outside popup, for example.
    cdb.god.bind('closeDialogs', this.hide, this);

    this._initBinds();
  },

  _initBinds: function() {
    this.add_related_model(this.collection);
  },

  _onClickAll: function(e) {
    this.collection.options.set({
      tags: '',
      page: 1
    });
    this.hide();
  },

  _onClickLink: function(e) {
    var tag = $(e.target).text();

    this.collection.options.set({
      tags: tag,
      page: 1
    });
    this.hide();
  },

  render: function() {
    this.$el.html(this.template_base({ }));

    // TODO: taken from existing code, how should dropdowns really be added to the DOM?
    $('body').append(this.el);

    return this;
  },

  clean: function() {
    this.elder('clean');
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],10:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var DropdownView = require('./dropdown/view');
var Utils = (typeof window !== "undefined" ? window['cdb']['Utils'] : typeof global !== "undefined" ? global['cdb']['Utils'] : null);

/**
 *  Dashboard filters.
 *
 *  - 'Filter by' collection.
 *  - 'Search' any pattern within collection.
 *
 */
module.exports = cdb.core.View.extend({

  events: {
    'submit .js-search-form': '_submitSearch',
    'keydown .js-search-form': '_onSearchKeyDown',
    'click .js-search-form': 'killEvent',
    'click .js-search-link': '_onSearchClick',
    'click .js-clean-search': '_onCleanSearchClick',
    'click .js-categoriesDropdown': '_createDropdown'
  },

  initialize: function() {
    this.template = cdb.templates.getTemplate('data_library/filters/template');

    this._preRender();
    this._initBinds();
  },

  _preRender: function() {
    var $uInner = $('<div>').addClass('u-inner');
    var $filtersInner = $('<div>').addClass('Filters-inner');
    this.$el.append($uInner.append($filtersInner));
  },

  render: function() {
    this.$('.Filters-inner').html(
      this.template({
        tag: this.collection.options.get('tags'),
        q: this.collection.options.get('q')
      })
    );

    return this;
  },

  _initBinds: function() {
    this.collection.bind('add remove change reset', this.render, this);
    this.collection.options.bind('change:tags', this.render, this);
    this.add_related_model(this.collection);
    this.add_related_model(this.collection.options);
    this.add_related_model(cdb.god);
  },

  _createDropdown: function(ev) {
    this.killEvent(ev);
    this._setupDropdown(new DropdownView({
      target: $(ev.target).closest('.js-categoriesDropdown'),
      horizontal_position: 'horizontal_left',
      horizontal_offset: -90,
      tick: 'center',
      collection: this.collection,
      position: 'offset',
      vertical_offset: -20
    }));
  },

  _setupDropdown: function(dropdownView) {
    this._closeAnyOtherOpenDialogs();

    this.addView(dropdownView);
    cdb.god.bind('closeDialogs', function() {
      dropdownView.clean();
    }, this);

    this.add_related_model(cdb.god);

    dropdownView.render();
    dropdownView.open();
  },

  _closeAnyOtherOpenDialogs: function() {
    cdb.god.trigger("closeDialogs");
  },

  _onSearchClick: function(e) {
    this.killEvent(e);

    this.$('.js-search-input').val('');
    this.$('.js-search-input').focus();
  },

  _onSearchKeyDown: function(e) {
    if (e.keyCode === 27) {
      this._onSearchClick(e);
    }
  },

  // Filter actions

  _onCleanSearchClick: function(e) {
    this.killEvent(e);
    this._cleanSearch();
  },

  _submitSearch: function(e) {
    this.killEvent(e);

    this.model.set('is_searching', true);

    this.collection.options.set({
      q: Utils.stripHTML(this.$('.js-search-input').val().trim(),''),
      page: 1
    });

    this.render();
  },

  _cleanSearch: function() {
    this.model.set('is_searching', false);

    this.collection.options.set({
      q: '',
      page: 1
    });

    this.render();
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./dropdown/view":9}],11:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);

/**
 * The header map in the data-library page, where the user can filter by country, e.g.:
 */
 module.exports = cdb.core.View.extend({

  className: 'DataLibrary-header',

  initialize: function() {
    _.bindAll(this, '_addGeojsonData');

    this.ACTIVE_CARTODB_ID = null;

    this.template_base = cdb.templates.getTemplate('data_library/header/template');

    this._initBindings();
  },

  events: {
    'click .js-country': '_onClickCountry',
    'click .js-back': '_onClickBack'
  },

  _initBindings: function() {
    var self = this;

    this.model.bind('change:show_more', this._onChangeShowMore, this);
    this.model.bind('change:vis_count', this._onChangeVisCount, this);
    this.model.bind('change:show_countries', this._onChangeCountries, this);
  },

  load: function() {
    this.map = L.map(this.$("#DataLibraryMap")[0], {
      zoomControl: false,
      attributionControl: false
    }).setView([44,-31], 3);

    var sqlDomain = cdb.config.get('sql_api_template').replace('{user}', cdb.config.get('data_library_user'));
    var geojsonURL = sqlDomain + '/api/v2/sql?q=' + encodeURIComponent("select * from world_borders") + '&format=geojson&filename=world_borders';
    $.getJSON(geojsonURL).done(this._addGeojsonData);
  },

  _addGeojsonData: function(geojsonData) {
    var _this = this;

    var style = {
      color: '#2E3C43',
      weight: 1,
      opacity: 1,
      fillColor: '#242D32',
      fillOpacity: 1,
    };

    this.layer = L.geoJson(geojsonData, {
      style: style,
      onEachFeature: function(feature, featureLayer) {
        featureLayer
          .on('click', function (e) {
            if (feature.properties.cartodb_id != _this.ACTIVE_CARTODB_ID) {
              _this._onClickFeature(feature, featureLayer, e.layer);
            }
          })
          .on('mouseover', function (e) {
            _this._onMouseOverFeature(featureLayer, e.target);
          })
          .on('mouseout', function () {
            _this._onMouseOutFeature();
          });
      }
    }).addTo(this.map);
  },

  _onClickFeature: function(feature, featureLayer, eventLayer) {
    this.ACTIVE_CARTODB_ID = feature.properties.cartodb_id;

    this.layer.eachLayer(function (layer) {
      layer.setStyle({ fillColor : '#242D32' });
    });

    featureLayer.setStyle({
      fillColor: '#fff'
    });

    var bbox = eventLayer.getBounds();

    this.map.fitBounds(bbox);

    this._updateBounds([
      bbox._southWest.lng,
      bbox._southWest.lat,
      bbox._northEast.lng,
      bbox._northEast.lat
    ]);
  },

  _onMouseOverFeature: function(featureLayer, target) {
    var _this = this;

    this.layer.eachLayer(function (layer) {
      if (layer.feature.properties.cartodb_id != _this.ACTIVE_CARTODB_ID) {
        layer.setStyle({ fillColor : '#242D32' });
      }
    });

    if (target.feature.properties.cartodb_id != this.ACTIVE_CARTODB_ID) {
      featureLayer.setStyle({ fillColor : '#616567' });
    }
  },

  _onMouseOutFeature: function() {
    var _this = this;

    this.layer.eachLayer(function (layer) {
      if (layer.feature.properties.cartodb_id != _this.ACTIVE_CARTODB_ID) {
        layer.setStyle({ fillColor : '#242D32' });
      }
    });
  },

  show: function() {
    $('.js-Header-title').removeClass('is-hidden');
    $('.js-Header-footer').removeClass('is-hidden');
    this.$el.addClass('is-active');
  },

  hide: function() {
    $('.js-Header-title').addClass('is-hidden');
    $('.js-Header-footer').addClass('is-hidden');

    this.$el.removeClass('is-active');
  },

  _updateBounds: function(bounds) {
    this.collection.options.set({
      bbox: bounds.join(','),
      page: 1
    });

  },

  _onClickCountry: function() {
    this.model.set('show_countries', true);
  },

  _onClickBack: function() {
    this.model.set('show_countries', false);
    this.ACTIVE_CARTODB_ID = null;
    this.collection.options.set({
      bbox: '',
      page: 1
    });

    this.map.setView([44,-31], 3);

    this.layer.eachLayer(function (layer) {
      layer.setStyle({ fillColor : '#242D32' });
    });
  },

  render: function() {
    this.$el.html(this.template_base({ }));

    return this;
  },

  _onChangeCountries: function() {
    this.$('.js-Header-title').toggleClass('is-hidden', this.model.get('show_countries'));
    this.$('.js-CountrySelector').toggleClass('is-hidden', this.model.get('show_countries'));
    this.$('.js-CountrySelector-back').toggleClass('is-hidden', !this.model.get('show_countries'));
    this.$el.toggleClass('is-active', this.model.get('show_countries'));
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],12:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var FiltersView = require('./filters/view');
var ListView = require('./content/list/view');
var ContentView = require('./content/view');
var DatasetsCollection = require('./datasets_collection');
var DataLibraryHeader = require('./header/view');


module.exports = cdb.core.View.extend({

  events: {
    'click .js-more': '_onClickMore'
  },

  initialize: function() {
    this._initModels();
    this._initViews();

    this._initBindings();
  },

  _initViews: function() {
    this.controlledViews = {};  // All available views
    this.enabledViews = [];     // Visible views

    var dataLibraryHeader = new DataLibraryHeader({
      model: this.model,
      collection: this.collection
    });

    this.addView(dataLibraryHeader);
    $('.js-Header--datalibrary').append(dataLibraryHeader.render().el);
    dataLibraryHeader.load();

    var filtersView = new FiltersView({
      el: this.$('.Filters'),
      collection: this.collection,
      model: this.model
    });
    filtersView.render();
    this.addView(filtersView);

    var moreView = new ContentView({
      model: this.model,
      collection: this.collection,
      template: 'data_library/content/more_template',
    });
    this.$el.append(moreView.render().el);
    this.addView(moreView);

    var listView = new ListView({
      collection: this.collection
    });
    this.$('.js-DataLibrary-content').append(listView.render().el);
    this.addView(listView);
    this.controlledViews['list'] = listView;

    var noResultsView = new ContentView({
      model: this.model,
      collection: this.collection,
      template: 'data_library/content/no_results_template',
    });
    this.$el.append(noResultsView.render().el);
    this.addView(noResultsView);
    this.controlledViews['no_results'] = noResultsView;

    var errorView = new ContentView({
      model: this.model,
      collection: this.collection,
      template: 'data_library/content/error_template'
    });
    this.$el.append(errorView.render().el);
    this.addView(errorView);
    this.controlledViews['error'] = errorView;

    var mainLoaderView = new ContentView({
      model: this.model,
      collection: this.collection,
      template: 'data_library/content/loader_template'
    });
    this.$el.append(mainLoaderView.render().el);
    this.addView(mainLoaderView);
    this.controlledViews['main_loader'] = mainLoaderView;
  },

  _fetchCollection: function() {
    this.collection.fetch();
  },

  render: function() {
    this._fetchCollection();

    return this;
  },

  _initBindings: function() {
    this.model.bind('change:show_more', this._onChangeShowMore, this);
    this.model.bind('change:vis_count', this._onChangeVisCount, this);

    this.collection.options.bind('change:tags', function() {
      this.model.set({ vis_count: 0 });
    }, this);
    this.collection.options.bind('change:bbox', function() {
      this.model.set({ vis_count: 0 });
    }, this);

    this.collection.options.bind('change', function() {
      this.model.set({ show_more: false });
      this._fetchCollection();
    }, this);
    this.collection.bind('reset', function() {
      this._onDataFetched();
    }, this);
    this.collection.bind('loading', function() {
      if (this.collection.options.get('page') === 1) {
        this._showLoader();
      } else {
        this._showLoaderOnly();
      }
    }, this);
    this.collection.bind('error', function(coll, e, opts) {
      if (!e || (e && e.statusText !== "abort")) {
        this._onDataError(e);
      }
    }, this);

    this.add_related_model(this.collection);
    this.add_related_model(this.collection.options);
  },

  _onChangeVisCount: function() {
    if (this.model.get('vis_count') >= this.collection.total_entries) {
      this.model.set({ show_more: false });
    } else {
      this.model.set({ show_more: true });
    }
  },

  _onChangeShowMore: function() {
    this.$('.js-more').toggleClass('is-hidden', !this.model.get('show_more'));
  },

  _onDataFetched: function() {
    var activeViews = [ ];

    if (this.collection.size() === 0) {
      activeViews.push('no_results');
    } else {
      this.model.set({ vis_count: this.model.get('vis_count') + this.collection.length, show_more: true });
      activeViews.push('list');
    }

    this._hideBlocks();
    this._showBlocks(activeViews);
  },

  _onDataError: function(e) {
    // Send error to TrackJS
    if (window.trackJs && window.trackJs.track) {
      window.trackJs.track(e);
    }

    this._hideBlocks();
    this._showBlocks([ 'error' ]);
  },

  _showBlocks: function(views) {
    var self = this;

    if (views) {
      _.each(views, function(v){
        self.controlledViews[v].show();
        self.enabledViews.push(v);
      });
    } else {
      self.enabledViews = [];
      _.each(this.controlledViews, function(v){
        v.show();
        self.enabledViews.push(v);
      });
    }
  },

  _hideBlocks: function(views) {
    var self = this;
    if (views) {
      _.each(views, function(v){
        self.controlledViews[v].hide();
        self.enabledViews = _.without(self.enabledViews, v);
      });
    } else {
      _.each(this.controlledViews, function(v){
        v.hide();
      });
      self.enabledViews = [];
    }
  },

  _isBlockEnabled: function(name) {
    if (name) {
      return _.contains(this.enabledViews, name);
    }

    return false;
  },

  _showLoader: function() {
    this._hideBlocks();
    this._showBlocks([ 'main_loader' ]);
  },

  _showLoaderOnly: function() {
    this._showBlocks([ 'main_loader' ]);
  },

  _hideLoader: function() {
    this._hideBlocks([ 'main_loader' ]);
  },

  _initModels: function() {
    this.model = new cdb.core.Model({
      vis_count: 0,
      show_countries: false,
      is_searching: false
    });

    this.collection = new DatasetsCollection();

    this._resetOptions();
  },

  _resetOptions: function() {
    this.collection.options.set({
      q: '',
      order: 'updated_at',
      page: 1,
      tags: '',
      bbox: '',
      source: [],
      type: 'table'
    });
  },

  _onClickMore: function(e) {
    this.killEvent(e);

    this.model.set({ show_more: false });

    this.collection.options.set({
      page: this.collection.options.get('page') + 1
    });
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./content/list/view":5,"./content/view":6,"./datasets_collection":7,"./filters/view":10,"./header/view":11}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
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

},{"./user_industries/dropdown_view":13}],15:[function(require,module,exports){
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

},{}],16:[function(require,module,exports){
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

},{"./user_settings/dropdown_view":15}],17:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);

/**
 * The content of the dropdown menu opened by the link at the end of the breadcrumbs menu, e.g.
 *   username / Maps v
 *            ______/\____
 *           |            |
 *           |    this    |
 *           |____________|
 */
module.exports = cdb.admin.DropdownMenu.extend({
  className: 'Dropdown',

  initialize: function() {
    this.elder('initialize');

    // Necessary to hide dialog on click outside popup, for example.
    cdb.god.bind('closeDialogs', this.hide, this);
  },

  render: function() {
    this.$el.show();

    return this;
  },

  clean: function() {
    this.$el.hide();
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],18:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);
var BreadcrumbDropdown = require('./user_info/breadcrumb_dropdown_view');

/**
 * View to render the user info section.
 * Expected to be created from existing DOM element.
 */
module.exports = cdb.core.View.extend({

  events: {
    'click .js-breadcrumb-dropdown-target': '_createBreadcrumbDropdown'
  },

  render: function() {
    return this;
  },

  _createBreadcrumbDropdown: function(ev) {
    this.killEvent(ev);
    var dropdown = new BreadcrumbDropdown({
      target: $('.js-breadcrumb-dropdown-target'),
      el: $('.js-breadcrumb-dropdown-content'),
      horizontal_offset: 3, // to match the dropdown indicator/arrow
      horizontal_position: 'right',
      tick: 'right'
    });
    this.addView(dropdown);
    dropdown.on('onDropdownShown', function () {
      cdb.god.trigger('closeDialogs');
    }, this);
    dropdown.open();
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./user_info/breadcrumb_dropdown_view":17}]},{},[8])
//# sourceMappingURL=data_library.uncompressed.js.map

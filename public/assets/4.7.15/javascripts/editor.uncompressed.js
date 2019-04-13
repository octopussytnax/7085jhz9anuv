(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var ImportsCollection = require('./models/imports_collection');
var GeocodingsCollection = require('./models/geocodings_collection');
var AnalysisCollection = require('./models/analysis_collection');
var pollingsTimer = 3000;

/**
 *  Background polling default model
 *
 */

module.exports = cdb.core.Model.extend({

  defaults: {
    showGeocodingDatasetURLButton: false,
    showSuccessDetailsButton: true,
    geocodingsPolling: false, // enable geocodings polling
    importsPolling: false // enable imports polling
  },

  initialize: function(attrs, opts) {
    this.user = opts.user;
    this.vis = opts.vis;
    this.importsCollection = opts.importsCollection || new ImportsCollection(null, { user: this.user });
    this.geocodingsCollection = opts.geocodingsCollection || new GeocodingsCollection(null, { user: this.user, vis: this.vis });
    this.analysisCollection = opts.anaylysisCollection || new AnalysisCollection(null, { user: this.user });
    this._initBinds();
    this.startPollings();
  },

  _initBinds: function() {
    this.importsCollection.bind('change:state', function(mdl) {
      this.trigger('change', mdl, this);
      this._onImportsStateChange(mdl)
    }, this);
    this.importsCollection.bind('remove', function(mdl) {
      this.trigger('importRemoved', mdl, this);
    }, this);
    this.importsCollection.bind('add', function(mdl) {
      this.trigger('importAdded', mdl, this);
    }, this);

    this.geocodingsCollection.bind('change:state', function(mdl) {
      this.trigger('change', mdl, this);
      this._onGeocodingsStateChange(mdl);
    }, this);
    this.geocodingsCollection.bind('remove', function(mdl) {
      this.trigger('geocodingRemoved', mdl, this);
    }, this);
    this.geocodingsCollection.bind('add', function(mdl) {
      this.trigger('geocodingAdded', mdl, this);
    }, this);

    this.analysisCollection.bind('reset', function() {
      if (this.analysisCollection.size() > 0) {
        this.trigger('analysisAdded', this.analysisCollection, this);
      } else {
        this.trigger('analysisRemoved', this.analysisCollection, this);  
      }
    }, this); 

    this.analysisCollection.bind('change:state', function(mdl) {
      this._onAnalysisStateChange(mdl, this.analysisCollection);
    }, this);
  },

  // Helper functions

  getTotalFailedItems: function() {
    return this.importsCollection.failedItems().length + this.geocodingsCollection.failedItems().length;
  },

  removeImportItem: function(mdl) {
    if (!mdl) {
      return false;
    }
    this.importsCollection.remove(mdl);
  },

  addImportItem: function(mdl) {
    if (!mdl) {
      return false;
    }
    this.importsCollection.add(mdl);
  },

  removeGeocodingItem: function(mdl) {
    if (!mdl || !this.canAddImport()) {
      return false;
    }
    this.geocodingsCollection.remove(mdl);
  },

  addGeocodingItem: function(mdl) {
    if (!mdl || !this.canAddGeocoding()) {
      return false;
    }
    this.geocodingsCollection.add(mdl);
  },

  removeAnalysis: function() {
    this.analysisCollection.destroyCheck();
    this.analysisCollection.reset();
  },

  addAnalysis: function(array) {
    if (!array || !this.canAddAnalysis()) {
      return false;
    }
    this.analysisCollection.reset(array);
  },

  canAddImport: function() {
    return this.importsCollection.canImport();
  },

  canAddGeocoding: function() {
    return this.geocodingsCollection.canGeocode();
  },

  canAddAnalysis: function() {
    return this.analysisCollection.canStartPecan();
  },

  getTotalImports: function() {
    return this.importsCollection.size();
  },

  getTotalGeocodings: function() {
    return this.geocodingsCollection.size();
  },

  getTotalAnalysis: function() {
    return this.analysisCollection.size() > 0 ? 1 : 0;
  },

  getTotalPollings: function() {
    return this.importsCollection.size() + this.geocodingsCollection.size() + ( this.analysisCollection.isAnalyzing() ? 1 : 0 );
  },

  stopPollings: function() {
    if (this.get('geocodingsPolling')) {
      this.geocodingsCollection.destroyCheck();
    }
    if (this.get('importsPolling')) {
      this.importsCollection.destroyCheck();
    }
  },

  startPollings: function() {
    var self = this;
    // Don't start pollings inmediately, 
    // wait some seconds
    setTimeout(function() {
      if (self.get('geocodingsPolling')) {
        self.geocodingsCollection.pollCheck();
      }
      if (self.get('importsPolling')) {
        self.importsCollection.pollCheck();
      }  
    }, pollingsTimer);
  },

  // onChange functions
  _onImportsStateChange: function() {},

  _onGeocodingsStateChange: function() {},

  _onAnalysisStateChange: function() {},

  clean: function() {
    this.importsCollection.unbind(null, null, this);
    this.geocodingsCollection.unbind(null, null, this);
    this.analysisCollection.unbind(null, null, this);
    this.elder('clean');
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./models/analysis_collection":3,"./models/geocodings_collection":6,"./models/imports_collection":9}],2:[function(require,module,exports){
(function (global){
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var ImportItemView = require('./views/imports/background_import_item_view');
var AnalysisItemView = require('./views/analysis/background_analysis_item_view');
var GeocodingItemView = require('./views/geocodings/background_geocoding_item_view');
var ImportLimitItemView = require('./views/imports/background_import_limit_view');
var ImportsModel = require('./models/imports_model');
var GeocodingModel = require('./models/geocoding_model');
var BackgroundPollingModel = require('./background_polling_model');
var BackgroundPollingHeaderView = require('./views/background_polling_header_view');

/**
 *  Background polling view
 *
 *  It will pool all polling operations that happens
 *  in Cartodb, as in imports and geocodings
 *
 */

module.exports = cdb.core.View.extend({

  className: 'BackgroundPolling',

  initialize: function() {
    this.user = this.options.user;
    this.createVis = this.options.createVis;
    this.vis = this.options.vis;
    if (!this.model) {
      this.model = new BackgroundPollingModel({}, {
        user: this.user
      });
    }
    this.template = cdb.templates.getTemplate('common/background_polling/background_polling');
    this._initBinds();
  },

  render: function() {
    this.$el.html(this.template());
    this._initViews();
    return this;
  },

  _initBinds: function() {
    this.model.bind('importAdded', this._addImport, this);
    this.model.bind('geocodingAdded', this._addGeocoding, this);
    this.model.bind('analysisAdded', this._addAnalysis, this);
    this.model.bind('analysisAdded analysisRemoved importAdded importRemoved geocodingAdded geocodingRemoved', this._checkPollingsSize, this);
    cdb.god.bind('importByUploadData', this._addDataset, this);
    cdb.god.bind('fileDropped', this._onDroppedFile, this);
    this.add_related_model(cdb.god);
  },

  _initViews: function() {
    var backgroundPollingHeaderView = new BackgroundPollingHeaderView({
      model: this.model
    });

    this.$el.prepend(backgroundPollingHeaderView.render().el);
    this.addView(backgroundPollingHeaderView);
  },

  _checkPollingsSize: function() {
    if (this.model.getTotalPollings() > 0) {
      this.show();
    } else {
      this.hide();
    }
  },

  _addAnalysis: function(collection) {

    if (this._analysisItem) {
      this._analysisItem.clean();
    }

    this._analysisItem = new AnalysisItemView({
      collection: collection,
      vis: this.vis,
      user: this.user
    });

    this._analysisItem.bind('remove', function(mdl) {
      this.model.removeAnalysis();
    }, this);

    this.$('.js-list').prepend(this._analysisItem.render().el);
    this.addView(this._analysisItem);
  },

  _addGeocoding: function(mdl) {
    var geocodingItem = new GeocodingItemView({
      showGeocodingDatasetURLButton: this.model.get('showGeocodingDatasetURLButton'),
      model: mdl,
      user: this.user
    });

    geocodingItem.bind('remove', function(mdl) {
      this.model.removeGeocodingItem(mdl);
    }, this);

    this.$('.js-list').prepend(geocodingItem.render().el);
    this.addView(geocodingItem);

    // Enable pollings again
    this.enable();
  },

  _addImport: function(m) {
    var importItem = new ImportItemView({
      showSuccessDetailsButton: this.model.get('showSuccessDetailsButton'),
      model: m,
      user: this.user
    });

    importItem.bind('remove', function(mdl) {
      this.model.removeImportItem(mdl);
    }, this);

    this.$('.js-list').prepend(importItem.render().el);
    this.addView(importItem);

    this.enable();
  },

  _addDataset: function(d) {
    if (d) {
      this._addImportsItem(d);
    }
  },

  _onDroppedFile: function(files) {
    if (files) {
      this._addImportsItem({
        type: 'file',
        value: files,
        create_vis: this.createVis
      });
    }
  },

  _addImportsItem: function(uploadData) {
    if (this.model.canAddImport()) {
      this._removeLimitItem();
    } else {
      this._addLimitItem();
      return false;
    }

    var imp = new ImportsModel({}, {
      upload: uploadData,
      user: this.user
    });
    this.model.addImportItem(imp);
  },

  // Limits view

  _addLimitItem: function() {
    if (!this._importLimit) {
      var v = new ImportLimitItemView({
        user: this.user
      });
      this.$('.js-list').prepend(v.render().el);
      this.addView(v);
      this._importLimit = v;
    }
  },

  _removeLimitItem: function() {
    var v = this._importLimit;
    if (v) {
      v.clean();
      this.removeView(v);
      delete this._importLimit;
    }
  },

  // Enable background polling checking
  // ongoing imports
  enable: function() {
    this.model.startPollings();
  },

  // Disable/stop background pollings
  disable: function() {
    this.model.stopPollings();
  },

  show: function() {
    this.$el.addClass('is-visible');
  },

  hide: function() {
    this.$el.removeClass('is-visible');
  },

  clean: function() {
    this.disable();
    this.elder('clean');
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./background_polling_model":1,"./models/geocoding_model":4,"./models/imports_model":10,"./views/analysis/background_analysis_item_view":16,"./views/background_polling_header_view":18,"./views/geocodings/background_geocoding_item_view":19,"./views/imports/background_import_item_view":21,"./views/imports/background_import_limit_view":22}],3:[function(require,module,exports){
(function (global){
var Backbone = (typeof window !== "undefined" ? window['Backbone'] : typeof global !== "undefined" ? global['Backbone'] : null);
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var Pecan = require('cartodb-pecan');
var PecanModel = require('./pecan_model');
var batchAnalysisCount = 5;

/**
 *  Analysis collection
 *
 *  - Get the stats of the current layer
 *
 */

module.exports = Backbone.Collection.extend({

  model: PecanModel,

  initialize: function(mdls, opts) {
    this.user = opts.user;
    this._initBinds();
  },

  _initBinds: function() {
    this.bind('reset', this.pollCheck, this);
  },

  // Public methods

  canStartPecan: function() {
    return this.getTotalAnalysis() === this.getCompletedAnalysis()
  },

  pollCheck: function() {
    if (this._nextAnalysisItems) {
      _.each(this._nextAnalysisItems, function(mdl) {
        mdl.unbind(null, null, this);
      }, this);
    }

    var idleItems = _.first(this.where({ state: 'idle' }),batchAnalysisCount);

    if (idleItems.length > 0) {
      this._nextAnalysisItems = idleItems;

      _.each(this._nextAnalysisItems, function(mdl) {
        if (this.user.featureEnabled('pecan_debugging')) {
          mdl.bind('print_stats', function(stats) {
            this._printStats(stats);
          }, this);
        }
        mdl.bind('change:state', function(mdl, state) {
          if (mdl.isAnalyzed()) {
            var arePendingAnalysis = _.find(this._nextAnalysisItems, function(analysis) {
              return !analysis.isAnalyzed()
            });
            if (!arePendingAnalysis) {
              this.pollCheck();
            }
          }
        }, this);
        mdl.getData();
      }, this);
    }
  },

  _printStats: function(stats) {
    var name        = stats.column;
    var type        = stats.type;
    var weight      = stats.weight;
    var skew        = stats.skew;
    var distinct    = stats.distinct;
    var count       = stats.count;
    var null_ratio  = stats.null_ratio;
    var dist_type   = stats.dist_type;
    var calc_weight = (weight + Pecan.getWeightFromShape(dist_type)) / 2;

    var distinctPercentage = (distinct / count) * 100;

    cdb.log.info("%cAnalyzing %c" + name, "text-decoration:underline; font-weight:bold", "text-decoration:underline; font-weight:normal");

    cdb.log.info('%c · %ctype%c = ' + type, 'color:#666;', 'color: #666; font-weight:bold;', "color: #666; font-weight:normal");
    cdb.log.info('%c · %cdistinctPercentage%c = ' + distinctPercentage, 'color:#666;', 'color: #666; font-weight:bold;', "color: #666; font-weight:normal");
    cdb.log.info('%c · %ccount%c = ' + count, 'color:#666;', 'color: #666; font-weight:bold;', 'color: #666; font-weight:normal;');
    cdb.log.info('%c · %cnull ratio%c = ' + null_ratio, 'color:#666;', 'color: #666; font-weight:bold;', 'color: #666; font-weight:normal;');

    if (dist_type) {
      cdb.log.info('%c · %cdist_type%c = ' + dist_type, 'color:#666;', 'color: #666; font-weight:bold;', 'color: #666; font-weight:normal;');
      cdb.log.info('%c · %ccalc_weight%c = ' + calc_weight, 'color:#666;', 'color: #666; font-weight:bold;', 'color: #666; font-weight:normal;');
    }

    if (skew) {
      cdb.log.info("%c · %cskew%c: " + skew.toFixed(2), "color:#666;", 'color: #666; font-weight:bold;', 'color: #666; font-weight:normal;');
    }

    if (weight) {
      cdb.log.info("%c · %cweight%c: " + weight.toFixed(2), "color: #666;", "color:#666; font-weight:bold;", "color:#666;font-weight:normal");
    }

    if (stats.density) {
      cdb.log.info("%c · %cdensity%c: " + stats.density, "color:#666;", 'color: #666; font-weight:bold;', 'color: #666; font-weight:normal;');
    }

  },

  destroyCheck: function() {
    var items = this.where({ state: 'idle' });
    this.remove(items);
  },

  failedItems: function() {},

  getTotalAnalysis: function() {
    return this.size();
  },

  getSuccessfullyAnalysedColumns: function() {
    return this.where({ success: true }).length;
  },

  getCompletedAnalysis: function() {
    return this.where({ state: 'analyzed' }).length;
  },

  isAnalyzing: function() {
    return this.getCompletedAnalysis() !== this.getTotalAnalysis();
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./pecan_model":12,"cartodb-pecan":234}],4:[function(require,module,exports){
(function (global){
var Backbone = (typeof window !== "undefined" ? window['Backbone'] : typeof global !== "undefined" ? global['Backbone'] : null);
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var GeocodingModelPoller = require('./geocoding_model_poller');

/**
 *  Geocoding model
 *
 */
module.exports = cdb.core.Model.extend({

  options: {
    startPollingAutomatically: true
  },

  defaults: {
    kind: '',
    formatter: '',
    table_name: '',
    state: ''
  },

  url: function(method) {
    var version = cdb.config.urlVersion('geocoding', method);

    var base = '/api/' + version + '/geocodings/';
    if (this.isNew()) {
      return base;
    }
    return base + this.id;
  },

  setUrlRoot: function(urlRoot) {
    this.urlRoot = urlRoot;
  },

  initialize: function(opts) {
    var self = this;
    this._initBinds();
    _.extend(this.options, opts);
    this.poller = new GeocodingModelPoller(this);
    if (this.options.startPollingAutomatically) {
      this._checkModel();
    };
  },

  _initBinds: function() {
    this.bind('change:id', this._checkModel, this);
  },

  _checkModel: function() {
    var self = this;

    if (this.get('id')) {
      this.pollCheck();
    } else {
      this._saveModel();
    }
  },

  _saveModel: function() {
    var self = this;
    if (this.isNew()) {
      this.save({}, {
        error: function() {
          self.set({
            state: 'failed',
            error: {
              title: 'Oops, there was a problem',
              description: 'Unfortunately there was an error starting the geocoder'
            }
          });
        }
      });
    }
  },

  pollCheck: function() {
    this.poller.start();
  },

  destroyCheck: function() {
    this.poller.stop();
  },

  getError: function() {
    return this.get('error');
  },

  hasFailed: function() {
    var state = this.get('state');
    return state === "failed" || state === "reset" || state === "cancelled"
  },

  hasCompleted: function() {
    return this.get('state') === "finished"
  },

  isOngoing: function() {
    return !this.hasCompleted() && !this.hasFailed()
  },

  cancelGeocoding: function() {
    this.save({ state: 'cancelled' }, { wait:true });
  },

  resetGeocoding: function() {
    this.set('state', 'reset');
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./geocoding_model_poller":5}],5:[function(require,module,exports){
var Poller = require('./poller');

var GeocodingModelPoller = function(model) {

  var POLLING_INTERVAL = 2000;

  var options = {
    interval: POLLING_INTERVAL,
    stopWhen: function(model) {
      return model.hasFailed() || model.hasCompleted();
    },
    error: function(model) {
      model.trigger("change");
    }
  };

  Poller.call(this, model, options);
};

GeocodingModelPoller.prototype = _.extend({}, Poller.prototype);

module.exports = GeocodingModelPoller;

},{"./poller":13}],6:[function(require,module,exports){
(function (global){
var Backbone = (typeof window !== "undefined" ? window['Backbone'] : typeof global !== "undefined" ? global['Backbone'] : null);
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var pollTimer = 60000;
var GeocodingModel = require('./geocoding_model');

/**
 *  Geocodings collection
 *
 *  - Check ongoing geocodings in order to add them
 *  to the collection.
 *
 */

module.exports = Backbone.Collection.extend({

  model: GeocodingModel,

  url: function(method) {
    var version = cdb.config.urlVersion('geocoding', method);
    return '/api/' + version + '/geocodings';
  },

  initialize: function(mdls, opts) {
    this.user = opts.user; 
    this.vis = opts.vis;
  },

  parse: function(r) {
    var self = this;

    _.each(r.geocodings, function(data) {

      // Check if that geocoding exists...
      var geocodings = self.filter(
        function(mdl) {
          return mdl.get('id') === data.id
        }
      );

      if (geocodings.length === 0) {
        self._checkOngoingGeocoding(
          new GeocodingModel(data, { startPollingAutomatically: false })
        )
      }
    });

    return this.models
  },

  _checkOngoingGeocoding: function(mdl) {
    if (!this.vis) {
      // If there is NOT a vis, let's start polling
      // this geocoding model
      this.add(mdl);
      mdl.pollCheck();
    } else {
      var self = this;
      // If there is a vis, let's check if that
      // geocoding belongs to the visualization
      this.vis.map.layers.each(function(lyr) {
        if (lyr.table && lyr.table.id === mdl.get('table_name')) {
          self.add(mdl);
          mdl.pollCheck();
        }
      })
    }
  },

  // Public methods

  canGeocode: function() {
    return !this.any(function(m) {
      return m.isOngoing();
    });
  },

  fetchGeocodings: function() {
    var self = this;
    this.fetch({
      error: function(e) {
        self.destroyCheck();
      }
    });
  },

  pollCheck: function(i) {
    if (this.pollTimer) return;

    var self = this;
    this.pollTimer = setInterval(function() {
      self.fetchGeocodings();
    }, pollTimer);

    this.fetchGeocodings();
  },

  destroyCheck: function() {
    clearInterval(this.pollTimer);
    delete this.pollTimer;
  },

  failedItems: function() {
    return this.filter(function(item) {
      return item.hasFailed();
    });
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./geocoding_model":4}],7:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var cdbAdmin = (typeof window !== "undefined" ? window['cdb']['admin'] : typeof global !== "undefined" ? global['cdb']['admin'] : null);
var ImportModelPoller = require('./import_model_poller');

/**
 *  New import model that controls
 *  the state of an import
 *
 */
module.exports = cdb.core.Model.extend({

  url: function(method) {
    var version = cdb.config.urlVersion('import', method);
    var base = '/api/' + version + '/imports';

    if (this.isNew()) {
      return base;
    }
    return base + '/' + this.id;
  },

  idAttribute: 'item_queue_id',

  initialize: function() {
    this._initBinds();
    this.poller = new ImportModelPoller(this);
  },

  _initBinds: function() {
    this.bind('change:item_queue_id', this._checkQueueId, this);
  },

  createImport: function(data) {
    var d = this._prepareData(data);
    this[d.interval === 0 ? '_createRegularImport' : '_createSyncImport'](d);
  },

  _checkQueueId: function() {
    if (this.get('item_queue_id')) {
      this.pollCheck();
    }
  },

  _prepareData: function(data) {
    var d = {
      create_vis: data.create_vis,
      privacy: data.privacy
    };

    var type = data.type;

    if (type !== 'remote') {
      _.extend(d, {
        type_guessing: data.type_guessing,
        content_guessing: data.content_guessing,
        interval: data.interval
      });
    }

    var service = data.service_name;

    // Url?
    if (type === "url") {
      _.extend(d, {
        url: data.value
      });
    }

    // Remote?
    if (type === "remote") {
      _.extend(d, {
        type: "remote",
        interval: null,
        remote_visualization_id: data.remote_visualization_id,
        create_vis: false,
        value: data.value
      });
    }

    // SQL?
    if (type === "sql") {
      _.extend(d, {
        table_name: data.table_name,
        sql: data.value
      });
    }

    // Duplicate?
    if (type === "duplication") {
      _.extend(d, {
        table_name: data.table_name,
        table_copy: data.value
      });
    }

    // Service?
    if (type === "service") {
      // If service is Twitter, service_item_id should be
      // sent stringified
      var service_item_id = (service === "twitter_search")
          ? JSON.stringify(data.service_item_id)
          : data.service_item_id;

      // User defined limits?
      if (data.user_defined_limits) {
        d.user_defined_limits = data.user_defined_limits;
      }

      _.extend(d, {
        value:            data.value,
        service_name:     data.service_name,
        service_item_id:  service_item_id
      });
    }

    return d;
  },

  _createSyncImport: function(d) {
    var self = this;
    // Create synchronization model
    var sync = new cdbAdmin.TableSynchronization(d);

    sync.save(null, {
      success: function(m) {
        self.set('item_queue_id', m.get('data_import').item_queue_id);
      },
      error: function(mdl, r, opts) {
        self._setErrorState(r);
      }
    });
  },

  _createRegularImport: function(d) {
    var self = this;

    this.save(d, {
      error: function(mdl, r, opts) {
        self._setErrorState(r);
      }
    });
  },

  _setErrorState: function(r) {
    var msg;
    try {
      msg = r && JSON.parse(r.responseText).errors.imports;
    } catch(err) {
      // e.g. if responseText is empty (seems to happen when server is down/offline)
      msg = 'Unfortunately there was an error starting the import';
    }
    this.set({
      state: 'failure',
      get_error_text: {
        title: 'There was an error',
        what_about: msg
      }
    });
  },

  pollCheck: function() {
    this.poller.start();
  },

  destroyCheck: function() {
    this.poller.stop();
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./import_model_poller":8}],8:[function(require,module,exports){
var Poller = require('./poller');

var ImportModelPoller = function(model) {

  var POLLING_INTERVAL = 2000; // Interval time between poll checkings
  var POLLING_INTERVAL_MULTIPLIER = 2.5;  // Multiply interval by this number
  var POLLING_REQUESTS_BEFORE_INTERVAL_CHANGE = 30; // Max tries until interval change

  var options = {
    interval: function(numberOfRequests) {
      if (numberOfRequests >= POLLING_REQUESTS_BEFORE_INTERVAL_CHANGE) {
        return POLLING_INTERVAL * POLLING_INTERVAL_MULTIPLIER;
      }
      return POLLING_INTERVAL;
    },
    stopWhen: function(model) {
      var state = model.get('state');
      return (state === "complete" || state === "failure");
    }
  };

  Poller.call(this, model, options);
};

ImportModelPoller.prototype = _.extend({}, Poller.prototype);

module.exports = ImportModelPoller;

},{"./poller":13}],9:[function(require,module,exports){
(function (global){
var Backbone = (typeof window !== "undefined" ? window['Backbone'] : typeof global !== "undefined" ? global['Backbone'] : null);
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var pollTimer = 30000;
var ImportsModel = require('./imports_model');

/**
 *  Imports collection
 *
 *  If it is fetched, it will add the import
 *
 */

module.exports = Backbone.Collection.extend({

  model: ImportsModel,

  url: function(method) {
    var version = cdb.config.urlVersion('import', method);
    return '/api/' + version + '/imports';
  },

  initialize: function(mdls, opts) {
    this.user = opts.user;
  },

  parse: function(r) {
    var self = this;

    if (r.imports.length === 0) {
      this.destroyCheck();
    } else {
      _.each(r.imports, function(id) {

        // Check if that import exists...
        var imports = self.filter(function(mdl){ return mdl.imp.get('item_queue_id') === id });

        if (imports.length === 0) {
          self.add(new ImportsModel({ id: id }, { user: self.user } ));
        }
      });
    }

    return this.models
  },

  canImport: function() {
    var importQuota = this.user.getMaxConcurrentImports();
    var total = this.size();
    var finished = 0;

    this.each(function(m) {
      if (m.hasFailed() || m.hasCompleted()) {
        ++finished;
      }
    });

    return (total - finished) < importQuota;
  },

  pollCheck: function(i) {
    if (this.pollTimer) return;

    var self = this;
    this.pollTimer = setInterval(function() {
      self.fetch();
    }, pollTimer || 2000);

    // Start doing a fetch
    this.fetch();
  },

  destroyCheck: function() {
    clearInterval(this.pollTimer);
    delete this.pollTimer;
  },

  failedItems: function() {
    return this.filter(function(item) {
      return item.hasFailed();
    });
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./imports_model":10}],10:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var ImportModel = require('./import_model');
var UploadModel = require('./upload_model');

/**
 *  Upload/import model
 *
 *  It takes the control of the upload and import,
 *  listening the change of any of these steps.
 *
 *  Steps:
 *  - upload
 *  - import
 *
 */

module.exports = cdb.core.Model.extend({

  defaults: {
    step: 'upload',
    state: ''
  },

  initialize: function(attrs, opts) {
    if (_.isEmpty(opts)) opts = {};
    this.user = opts && opts.user;
    this.upl = new UploadModel(opts.upload, { user: this.user });
    this.imp = new ImportModel(opts.import);
    this._initBinds();
    this._checkStatus();
  },

  _initBinds: function() {
    this.bind('change:import',  this._onImportChange, this);
    this.bind('change:upload',  this._onUploadChange, this);
    this.bind('change:id',      this._onIdChange, this);

    this.imp.bind('change', function() {
      this.trigger('change:import');
      this.trigger('change');
    }, this);
    this.upl.bind('change', function() {
      this.trigger('change:upload');
      this.trigger('change');
    }, this)
  },

  _destroyBinds: function() {
    this.upl.unbind(null, null, this);
    this.imp.unbind(null, null, this);
  },

  _onIdChange: function() {
    var item_queue_id = this.get('id');
    if (item_queue_id) this.imp.set('item_queue_id', item_queue_id);
    this.set('step', 'import');
  },

  _onUploadChange: function(m, i) {
    if (this.get('step') === "upload") {
      var item_queue_id = this.upl.get('item_queue_id');
      var state = this.upl.get('state');

      if (item_queue_id) this.set('id', item_queue_id);
      if (state) this.set('state', state);
    }
  },

  _onImportChange: function() {
    if (this.get('step') === "import") {
      var state = this.imp.get('state');
      if (state) this.set('state', state);
    }
  },

  _checkStatus: function() {
    if (!this.get('id') && !this.upl.isValid()) {
      this.trigger('change:upload');
      return;
    }

    if (this.upl.get('type') === 'file') {
      this.upl.upload();
    } else if (this.get('id')) {
      this.set('step', 'import');
      this.imp.set('item_queue_id', this.get('id'));
    } else if (!this.imp.get('item_queue_id') && this.upl.get('type') !== "") {
      this.set('step', 'import');
      this.imp.createImport(this.upl.toJSON());
    }
  },

  pause: function() {
    this.stopUpload();
    this.stopImport();
  },

  hasFailed: function() {
    var state = this.get('state');
    var step = this.get('step');

    return ( step === 'import' && state === 'failure' ) || ( step === 'upload' && state === 'error' );
  },

  hasCompleted: function() {
    return this.get('step') === "import" && this.imp && this.imp.get('state') === 'complete'
  },

  getWarnings: function() {
    var step = this.get('step');

    return step === 'import' ? this.imp.get('warnings') : '';
  },

  getError: function() {
    if (this.hasFailed()) {
      var step = this.get('step');
      return _.extend(
        {
          error_code: this[step === "upload" ? 'upl' : 'imp'].get('error_code'),
          item_queue_id: step === "import" ? this.imp.get('id') : '',
          original_url: step === "import" ? this.imp.get('original_url') : '',
          data_type: step === "import" ? this.imp.get('data_type') : '',
          http_response_code: step === "import" ? this.imp.get('http_response_code') : '',
          http_response_code_message: step === "import" ? this.imp.get('http_response_code_message') : ''
        }
        ,
        this[step === "upload" ? 'upl' : 'imp'].get('get_error_text')
      )
    }

    return {
      title: '',
      what_about: '',
      error_code: ''
    }
  },

  importedVis: function() {
    if (this.get('import').derived_visualization_id) {
      return this._getMapVis();
    } else {
      return this._getDatasetVis();
    }
  },

  _getMapVis: function() {
    var derivedVisId = this.imp.get('derived_visualization_id');

    if (!derivedVisId) {
      return false;
    }

    return this._createVis({
      type: 'derived',
      id: derivedVisId
    });
  },

  _getDatasetVis: function() {
    var tableName = this.imp.get('table_name');

    if (!tableName) {
      return false;
    }

    return this._createVis({
      type: 'table',
      table: {
        name: tableName
      }
    });
  },

  _createVis: function(attrs) {
    var vis = new cdb.admin.Visualization(attrs);
    vis.permission.owner = this.user;
    return vis;
  },

  setError: function(opts) {
    var step = this.get('step');
    var stepModel = this[ step === "upload" ? 'upl' : 'imp' ];

    this.stopUpload();
    this.stopImport();

    stepModel.set(opts);

    this.set('state', 'error');
  },

  stopUpload: function() {
    this.upl.stopUpload();
  },

  stopImport: function() {
    this.imp.destroyCheck();
  },

  get: function (attr) {
    if (attr === "upload") return this.upl.toJSON();
    if (attr === "import") return this.imp.toJSON();

    return cdb.core.Model.prototype.get.call(this, attr);
  },

  toJSON: function() {
    return {
      step: this.get('step'),
      id: this.get('id'),
      state: this.get('state'),
      upload: this.upl.toJSON(),
      import: this.imp.toJSON()
    }
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./import_model":7,"./upload_model":15}],11:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);

/**
 * A special case of a geocoding model, since lon/lat geocoding is not actually going through the common async processing
 * as the rest.
 */
module.exports = cdb.core.Model.extend({

  initialize: function(attrs) {
    if (!attrs.table) throw new Error('table is required');
    if (!attrs.longitude_column) throw new Error('longitude_column is required');
    if (!attrs.latitude_column) throw new Error('latitude_column is required');
    if (!_.isBoolean(attrs.force_all_rows)) throw new Error('force_all_rows is required');

    this.set('table_name', attrs.table.get('name'));

    this._startGeocoding();
  },

  _startGeocoding: function() {
    this._changeState('isOngoing');

    var self = this;
    var table = this.get('table');
    table.save({
      longitude_column: this.get('longitude_column'),
      latitude_column: this.get('latitude_column'),
      force_all_rows: this.get('force_all_rows')
    }, {
      success: function() {
        // when finish fetch the data again and throw a signal to notify the changes
        // TODO: this should not exist, geometry_types change should be monitored
        table.trigger('geolocated');
        table.data().fetch();
        self._changeState('hasCompleted');
      },
      error: function(msg, resp) {
        var error;
        try {
          error = resp && JSON.parse(resp.responseText).errors[0];
        } catch(err) {
          // e.g. if responseText is empty (seems to happen when server is down/offline)
          error = 'Unknown error';
        }
        self.set('error', error);
        self._changeState('hasFailed');
      },
      wait: true // don't update attrs until success is triggered
    });
  },

  isOngoing: function() {
    return this.get('isOngoing');
  },

  hasCompleted: function() {
    return this.get('hasCompleted');
  },

  hasFailed: function() {
    return this.get('hasFailed');
  },

  getError: function() {
    return this.get('error');
  },

  _changeState: function(newState) {
    var changedStates = _.reduce(['isOngoing', 'hasCompleted', 'hasFailed'], function(memo, state) {
      memo[state] = state === newState;
      return memo;
    }, {});
    this.set(changedStates);
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],12:[function(require,module,exports){
(function (global){
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var Pecan = require('cartodb-pecan');

/**
 *  Pecan model
 *
 */

module.exports = cdb.core.Model.extend({

  _PRINT_STATS: true,

  defaults: {
    table_id: '',
    column: '',
    state: 'idle'
  },

  initialize: function() {
    _.bindAll(this, "_onDescribe");
    this.sql = cdb.admin.SQL();
    this.query = 'SELECT * FROM ' + this.get("table_id");
  },

  getData: function() {
    this.sql.describe(this.query, this.get("column"), {}, this._onDescribe);
  },

  _onDescribe: function(stats) {
    var properties = {
      state: "analyzed",
      success: false
    };

    if (this._PRINT_STATS) {
      this.trigger('print_stats', stats, this);
    }

    var hasEnoughToGuess = Pecan.hasEnoughToGuess({
      stats: stats,
      isPointGeometryType: this.get('geometry_type') === 'point'
    });

    if (hasEnoughToGuess) {
      var response = Pecan.guessMap({
        tableName: this.get('table_id'),
        column: {
          stats: stats,
          geometryType: this.get('geometry_type'),
          bbox: this.get('bbox')
        },
        dependencies: {
          underscore: _
        }
      });

      if (response) {
        var overrides = {
          sql: this.query,
          success: true
        };
        properties = _.extend(properties, overrides, stats, response);
      }
    }

    if (stats.type === 'geom' && stats.bbox) {
      properties.bbox = stats.bbox;
    }

    this.set(properties);
  },

  isAnalyzed: function() {
    return this.get('state') === 'analyzed';
  },

  hasFailed: function() {
    return this.get('state') === 'failed';
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"cartodb-pecan":234}],13:[function(require,module,exports){
/*
 * Periodically fetches a model/collection. It waits for ongoing 
 * fetch requests before trying to fetch again. A stop condition
 * can be specified.
 *
 * Usage example:
 * 
 * var poller = new Poller(model, {
 *   interval: 1000,
 *   stopWhen: function(model) {
 *     return model.get('state') === 'completed';
 *   }
 * });
 * 
 * poller.start();
 *
 * // ...
 *
 * poller.stop();
 * 
 */
var Poller = function(model, options) {
  this.model = model;
  this.numberOfRequests = 0;
  this.polling = false;
  this.interval = options['interval'];
  if (typeof this.interval !== "function") {
    this.interval = function() { return options['interval']; };
  }
  this.stopWhen = options['stopWhen'];
  this.error = options['error'];
  this.autoStart = options['autoStart'];

  if (this.autoStart) {
    this.start();
  }
}

Poller.prototype.start = function() {
  if (this.timeout) {
    return;
  }

  this._scheduleFetch();
}

Poller.prototype._scheduleFetch = function() {
  this.timeout = setTimeout(this._fetch.bind(this), this.interval(this.numberOfRequests));
}

Poller.prototype._fetch = function() {
  var self = this;
  if (!self.polling) {
    self.polling = true;
    self.model.fetch({
      success: function() {
        self.polling = false;
        self.numberOfRequests++;
        if (self._continuePolling()) {
          self._scheduleFetch();
        }
      },
      error: function(e) {
        _.isFunction(self.error) && self.error(self.model);
      }
    })
  }
}

Poller.prototype._continuePolling = function() {
  return !this.stopWhen ||
    (_.isFunction(this.stopWhen) && !this.stopWhen(this.model));
}

Poller.prototype.stop = function() {
  this.polling = false;
  clearTimeout(this.timeout);
  delete(this.timeout);
}

module.exports = Poller;

},{}],14:[function(require,module,exports){

/**
 *  Default upload config
 *
 */

module.exports = {
  uploadStates: [
    'enqueued',
    'pending',
    'importing',
    'uploading',
    'guessing',
    'unpacking',
    'getting',
    'creating',
    'complete'
  ],
  fileExtensions: [
    'csv',
    'xls',
    'xlsx',
    'zip',
    'kml',
    'geojson',
    'json',
    'ods',
    'kmz',
    'tsv',
    'gpx',
    'tar',
    'gz',
    'tgz',
    'osm',
    'bz2',
    'tif',
    'tiff',
    'txt',
    'sql',
    'rar',
    'carto',
    'gpkg'
  ],
  // How big should file be?
  fileTimesBigger: 3
}

},{}],15:[function(require,module,exports){
(function (global){
var Backbone = (typeof window !== "undefined" ? window['Backbone'] : typeof global !== "undefined" ? global['Backbone'] : null);
var UploadConfig = require('./upload_config');
var Utils = (typeof window !== "undefined" ? window['cdb']['Utils'] : typeof global !== "undefined" ? global['cdb']['Utils'] : null);
var moment = (typeof window !== "undefined" ? window['moment'] : typeof global !== "undefined" ? global['moment'] : null);
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);

/**
 * Model that let user upload files to our endpoints.
 *
 * NOTE: this model extends Backbone.Model instead of cdb.core.Model, because it's required for the
 * vendor/backbone-model-file-upload.
 */
module.exports = Backbone.Model.extend({

  url: '/api/v1/imports',

  fileAttribute: 'filename',

  defaults: {
    type: '',
    value: '',
    interval: 0,
    privacy: '',
    progress: 0,
    state: 'idle',
    service_item_id: '',
    service_name: '',
    option: '',
    content_guessing: true,
    type_guessing: true,
    create_vis: true
  },

  initialize: function(val, opts) {
    this.user = opts && opts.user;
    this._initBinds();
    // We need to validate entry attributes
    this._validate(this.attributes, { validate: true});
  },

  isValidToUpload: function() {
    return this.get('value') && this.get('state') !== 'error';
  },

  setFresh: function(d) {
    if (d && !_.isEmpty(d)) {
      // Set upload properties except create_vis (defined when created)
      this.set(_.omit(d, 'create_vis'));
    } else {
      this.clear();
    }
  },

  _initBinds: function() {
    this.bind('progress', function(progress) {
      this.set({
        progress: progress*100,
        state: 'uploading'
      });
    }, this);

    this.bind('change:value', function() {
      if (this.get('state') === "error") {
        this.set({ state: 'idle' })
        this.unset('get_error_text', { silent: true });
      }
    }, this);

    this.bind('error invalid', function(m, d) {
      this.set({
        state: 'error',
        error_code: (d && d.error_code) || '',
        get_error_text: {
          title: 'Invalid import',
          what_about: (d && d.msg) || ''
        }
      }, { silent: true });
      // We need this, if not validate will run again and again and again... :(
      this.trigger('change');
    }, this);
  },

  validate: function(attrs) {
    if (!attrs) return;

    if (attrs.type === "file") {
      // Number of files
      if (attrs.value && attrs.value.length) {
        return {
          msg: "Unfortunately only one file is allowed per upload"
        }
      }

      // File name
      var name = attrs.value.name;
      if (!name) {
        return {
          msg: "File name should be defined"
        }
      }

      // File extension
      var ext = name.substr(name.lastIndexOf('.') + 1);
      if (ext) {
        ext = ext.toLowerCase();
      }
      if (!_.contains(UploadConfig.fileExtensions, ext)) {
        return {
          msg: "Unfortunately this file extension is not allowed"
        }
      }
      // File size
      if (this.user && ((this.user.get('remaining_byte_quota') * UploadConfig.fileTimesBigger) < attrs.value.size)) {
        return {
          msg: "Unfortunately the size of the file is bigger than your remaining quota",
          error_code: 8001
        }
      }
    }

    if (attrs.type === "remote") {
      // Valid remote visualization id?
      if (!attrs.remote_visualization_id) {
        return {
          msg: "The remote visualization id was not specified"
        }

      }
      // Remote size?
      if (this.user && attrs.size && ((this.user.get('remaining_byte_quota') * UploadConfig.fileTimesBigger) < attrs.size)) {
        return {
          msg: "Unfortunately the size of the remote dataset is bigger than your remaining quota",
          error_code: 8001
        }
      }
    }

    if (attrs.type === "url") {
      // Valid URL?
      if (!Utils.isURL(attrs.value)) {
        return {
          msg: "Unfortunately the URL provided is not valid"
        }
      }
    }

    if (attrs.type === "sql") {
      if (!attrs.value) {
        return {
          msg: "Query is not provided"
        }
      }
    }

    if (attrs.type === "duplication") {
      if (!attrs.value) {
        return {
          msg: "Dataset copy is not defined"
        }
      }
    }

    if (attrs.type === "service" && attrs.service_name === "twitter_search") {
      var service_item_id = attrs.service_item_id;

      // Empty?
      if (!service_item_id || _.isEmpty(service_item_id)) {
        return {
          msg: "Twitter data is empty"
        }
      }

      // Categories?
      if (_.isEmpty(service_item_id.categories)) {
        return {
          msg: "Twitter categories are not valid"
        }
      }

      // Dates?
      var dates = service_item_id.dates;
      if (!dates || _.isEmpty(dates)) {
        return {
          msg: "Twitter dates are empty"
        }
      }
      var isToDateValid = moment(dates.fromDate) <= moment(new Date());
      if (!dates.fromDate || !dates.toDate || !isToDateValid) {
        return {
          msg: "Twitter dates are not valid"
        }
      }
    }
  },

  isValid: function() {
    return this.get('value') && this.get('state') !== "error"
  },

  upload: function() {
    if (this.get('type') === "file") {
      var self = this;
      this.xhr = this.save(
        {
          filename: this.get('value')
        },
        {
          success: function(m) {
            m.set('state', 'uploaded');
          },
          error: function(m, msg) {

            var message = 'Unfortunately there was a connection error';

            if (msg && msg.status === 429) {
              var response = JSON.parse(msg.responseText);
              message = response.errors.imports;
            }

            self.set({
              state: 'error',
              get_error_text: { title: 'There was an error', what_about: message }
            });

          },
          complete: function() {
            delete self.xhr;
          }
        }
      );
    }
  },

  stopUpload: function() {
    if (this.xhr) this.xhr.abort();
  },

  setGuessing: function(val) {
    this.set({
      type_guessing: val,
      content_guessing: val
    });
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./upload_config":14}],16:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var ViewFactory = require('../../../view_factory');
var PecanDialog = require('../../../dialogs/pecan/pecan_dialog_view');

module.exports = cdb.core.View.extend({

  className: 'ImportItem',
  tagName: 'li',

  events: {
    'click .js-abort':       '_removeItem',
    'click .js-show_dialog': '_showDialog',
    'click .js-close':       '_removeItem'
  },

  initialize: function() {
    this.user = this.options.user;
    this.vis = this.options.vis;
    this.template = cdb.templates.getTemplate('common/background_polling/views/analysis/background_analysis_item');
    this._initBinds();
  },

  render: function() {
    var totalItems    = this.collection.getTotalAnalysis();
    var totalAnalyzed = this.collection.getCompletedAnalysis();
    var totalSuccess  = this.collection.getSuccessfullyAnalysedColumns();

    var d = {
      totalSuccess: totalSuccess,
      totalItems: totalItems,
      totalAnalyzed: totalAnalyzed,
      progress: (totalAnalyzed / totalItems) * 100
    };

    this.$el.html(this.template(d));

    return this;
  },

  _initBinds: function() {
    this.collection.bind('change:state', this._onChangeState, this);
    this.add_related_model(this.collection);
  },

  _onChangeState: function() {
    var totalItems    = this.collection.getTotalAnalysis();
    var totalAnalyzed = this.collection.getCompletedAnalysis();
    var totalSuccess  = this.collection.getSuccessfullyAnalysedColumns();

    this.render();

    if (totalAnalyzed === totalItems && totalSuccess === 0) {
      this._removeItem();
    }
  },

  _showDialog: function() {

    var pecanDialog = new PecanDialog({
      clean_on_hide: true,
      vis: this.vis,
      collection:this.collection,
      user: this.user
    });

    pecanDialog.appendToBody();
  },

  _skip: function() {
    var layerID = this.vis.get("active_layer_id");
    var name;
    var activeLayer  = this.vis.map.layers.where({ id: layerID });

    if (activeLayer) {
      name = activeLayer[0].table.get("name");
    }

    var skipPencanDialog = 'pecan_' + this.user.get("username") + "_" + name;
    localStorage[skipPencanDialog] = true;
  },

  _removeItem: function() {
    this.trigger('remove', this.collection, this);
    this._skip();
    this.clean();
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../../dialogs/pecan/pecan_dialog_view":185,"../../../view_factory":209}],17:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);

/**
 *  Background polling header title view
 *
 *  It will contain only the title
 *
 */

module.exports = cdb.core.View.extend({

  tagName: 'h3',
  className: 'CDB-Text CDB-Size-large u-lSpace--xl',

  initialize: function() {
    this.template = cdb.templates.getTemplate('common/background_polling/views/background_polling_header_title');
    this._initBinds();
  },

  render: function() {
    this.$el.html(
      this.template({
        imports: this.model.getTotalImports(),
        geocodings: this.model.getTotalGeocodings(),
        analysis: this.model.getTotalAnalysis(),
        totalPollings: this.model.getTotalPollings()
      })
    );

    return this;
  },

  _initBinds: function() {
    this.model.bind('change analysisAdded analysisRemoved importAdded importRemoved geocodingAdded geocodingRemoved', this.render, this);
  }

});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],18:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var BackgroundPollingHeaderTitleView = require('./background_polling_header_title_view');

/**
 *  Background polling header view
 *
 *  It will contain:
 *  - Badge
 *  - Title
 *
 */

module.exports = cdb.core.View.extend({

  className: "BackgroundPolling-header",

  initialize: function() {
    this.template = cdb.templates.getTemplate('common/background_polling/views/background_polling_header');
    this._initBinds();
  },

  render: function() {
    this.$el.html(this.template());
    this._initViews();
    this._updateBadges();
    return this;
  },

  _initBinds: function() {
    this.model.bind('change importAdded importRemoved geocodingAdded geocodingRemoved', this._updateBadges, this);
  },

  _initViews: function() {
    var headerTitle = new BackgroundPollingHeaderTitleView({
      model: this.model
    });
    this.$el.append(headerTitle.render().el);
    this.addView(headerTitle);
  },

  _updateBadges: function() {
    var failed = this.model.getTotalFailedItems();

    if (this.$('.BackgroundPolling-headerBadgeCount').length === 0 && failed > 0) {
      var $span = $('<span>').addClass("BackgroundPolling-headerBadgeCount Badge Badge--negative CDB-Text CDB-Size-small").text(failed);
      this.$('.BackgroundPolling-headerBadge')
        .append($span)
        .addClass('has-failures');
    } else if (this.$('.BackgroundPolling-headerBadgeCount').length > 0 && failed > 0) {
      this.$('.BackgroundPolling-headerBadgeCount').text(failed);
    } else if (failed === 0) {
      this.$('.BackgroundPolling-headerBadgeCount').remove();
      this.$('.BackgroundPolling-headerBadge').removeClass('has-failures');
    }

    // Show geocoding icon if only geocoding
    var geocodingsCount = this.model.getTotalGeocodings();
    var isGeocoding = geocodingsCount > 0 && geocodingsCount === this.model.getTotalPollings();
    this.$('.js-icon').toggleClass('CDB-IconFont-marker', isGeocoding);
    this.$('.js-icon').toggleClass('CDB-IconFont-cloud', !isGeocoding);
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./background_polling_header_title_view":17}],19:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var Utils = (typeof window !== "undefined" ? window['cdb']['Utils'] : typeof global !== "undefined" ? global['cdb']['Utils'] : null);
var pluralizeString = require('../../../view_helpers/pluralize_string');
var GeocodingResultDetailsView = require('./geocoding_result_details_view');

/**
 *  Geocoding item within background polling
 *
 */

module.exports = cdb.core.View.extend({

  className: 'ImportItem',
  tagName: 'li',

  events: {
    'click .js-abort': '_cancelGeocoding',
    'click .js-info': '_showDetails',
    'click .js-close': '_removeGeocoding'
  },

  initialize: function() {
    this.user = this.options.user;
    this.template = cdb.templates.getTemplate('common/background_polling/views/geocodings/background_geocoding_item');
    this._initBinds();
  },

  render: function() {
    var processedRows = this.model.get('processed_rows') || 0;
    var processableRows = this.model.get('processable_rows') || 0;
    var realRows = this.model.get('real_rows') || 0;
    var isLatLngType = this.model.get('latitude_column') && this.model.get('longitude_column');

    var d = {
      realRows: realRows,
      tableName: this.model.get('table_name'),
      canCancel: _.isFunction(this.model.cancelGeocoding),
      hasFailed: this.model.hasFailed(),
      hasCompleted: this.model.hasCompleted(),
      processedRows: processedRows,
      processableRows: processableRows,
      processableRowsFormatted: Utils.formatNumber(processableRows),
      realRowsPluralize: pluralizeString('row', 'rows', this.model.get('real_rows')),
      realRowsFormatted: Utils.formatNumber(realRows),
      processableRowsPluralize: pluralizeString('row', 'rows', processableRows),
      width: realRows > 0 ? (processableRows/realRows) : 100,
      isLatLngType: isLatLngType
    }
    this.$el.html(this.template(d));

    return this;
  },

  _initBinds: function() {
    this.model.bind('change', this.render, this);
    this.model.bind('remove', this.clean, this);
  },

  _cancelGeocoding: function() {
    this.model.cancelGeocoding();
  },

  _removeGeocoding: function() {
    this.trigger('remove', this.model, this);
    this.clean();
  },

  _showDetails: function() {
    new GeocodingResultDetailsView({
      clean_on_hide: true,
      user: this.user,
      model: this.model,
      showGeocodingDatasetURLButton: this.options.showGeocodingDatasetURLButton
    }).appendToBody();
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../../view_helpers/pluralize_string":211,"./geocoding_result_details_view":20}],20:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var BaseDialog = require('../../../views/base_dialog/view');
var pluralizeString = require('../../../view_helpers/pluralize_string');
var Utils = (typeof window !== "undefined" ? window['cdb']['Utils'] : typeof global !== "undefined" ? global['cdb']['Utils'] : null);

/**
 *  When a geocoding proccess finishes, this dialog displays
 *  all the info about the task (price, rows, errors, etc).
 *
 */

module.exports = BaseDialog.extend({

  className: 'Dialog BackgroundPollingDetails is-opening',

  initialize: function() {
    this.elder('initialize');
    this.user = this.options.user;
  },

  render_content: function() {
    var error = this.model.get('error') || {};

    var processedRows = this.model.get('processed_rows') || 0;
    var processableRows = this.model.get('processable_rows') || 0;
    var realRows = this.model.get('real_rows') || 0;
    var geometryType = this.model.get('geometry_type') || 'point';

    // Related to price and credits
    var price = this.model.get('price');
    var hasPrice = price !== undefined && price !== null;
    var googleUser = this.user.featureEnabled('google_maps');

    var datasetURL;
    if (this.user && this.model.get('table_name')) {
      var vis = new cdb.admin.Visualization({
        type: 'table',
        table: {
          name: this.model.get('table_name')
        }
      });
      vis.permission.owner = this.user;
      datasetURL = encodeURI(vis.viewUrl(this.user).edit());
    }

    // Select template
    var template = 'common/background_polling/views/geocodings/';
    if (this.model.hasCompleted()) {
      template += realRows === 0 ? 'geocoding_no_result_details' : 'geocoding_success_details';
    } else {
      template += 'geocoding_error_details';
    }

    return cdb.templates.getTemplate(template)({
      id: this.model.get('id'),
      geometryTypePluralize: pluralizeString(geometryType, geometryType + 's', processableRows),
      geometryType: geometryType,
      remainingQuotaFormatted: Utils.formatNumber(this.model.get('remaining_quota')),
      googleUser: googleUser,
      tableName: this.model.get('table_name'),
      state: this.model.get('state') || '',
      blockPrice: this.user.get('geocoding').block_price,
      realRows: realRows,
      realRowsFormatted: Utils.formatNumber(realRows),
      processedRows: processedRows,
      processableRows: processableRows,
      processableRowsFormatted: Utils.formatNumber(processableRows),
      hasPrice: hasPrice,
      price: price,
      customHosted: cdb.config.get('cartodb_com_hosted'),
      errorDescription: error.description,
      showGeocodingDatasetURLButton: this.options.showGeocodingDatasetURLButton && datasetURL,
      datasetURL: datasetURL
    });
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../../view_helpers/pluralize_string":211,"../../../views/base_dialog/view":213}],21:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var UploadConfig = require('../../models/upload_config');
var ErrorDetailsView = require('../../../views/error_details_view');
var WarningsDetailsView = require('../../../views/warnings_details_view');
var ViewFactory = require('../../../view_factory');
var TwitterImportDetailsDialog = require('./twitter_import_details_view');

/**
 *  Import item within background importer
 *
 */

module.exports = cdb.core.View.extend({

  className: 'ImportItem',
  tagName: 'li',

  events: {
    'click .js-abort':      '_removeItem',
    'click .js-show_error': '_showImportError',
    'click .js-show_warnings': '_showImportWarnings',
    'click .js-show_stats': '_showImportStats',
    'click .js-close':      '_removeItem'
  },

  initialize: function() {
    this.user = this.options.user;
    this._showSuccessDetailsButton = this.options.showSuccessDetailsButton;
    this.template = cdb.templates.getTemplate('common/background_polling/views/imports/background_import_item');
    this._initBinds();
  },

  render: function() {
    var upload = this.model.get('upload');
    var imp = this.model.get('import');

    var d = {
      name: '',
      state: this.model.get('state'),
      progress: '',
      service: '',
      step: this.model.get('step'),
      url: '',
      failed: this.model.hasFailed(),
      completed: this.model.hasCompleted(),
      warnings: this.model.getWarnings(),
      showSuccessDetailsButton: this._showSuccessDetailsButton,
      tables_created_count: imp.tables_created_count
    };

    // URL
    if (d.state === "complete") {
      var vis = this.model.importedVis();
      if (vis) {
        d.url = encodeURI(vis.viewUrl(this.user).edit());
      }
    }

    // Name
    if (upload.type) {
      if (upload.type === "file") {
        if (upload.value.length > 1) {
          d.name = upload.value.length + ' files';
        } else {
          d.name = upload.value.name;
        }
      }
      if (upload.type === "url" || upload.type === "remote") {
        d.name = upload.value;
      }
      if (upload.type === "service") {
        d.name = upload.value && upload.value.filename || '';
      }
      if (upload.service_name === "twitter_search") {
        d.name = 'Twitter import';
      }
      if (upload.type === "sql") {
        d.name = 'SQL';
      }
      if (upload.type === "duplication") {
        d.name = upload.table_name || upload.value;
      }
    } else {
      d.name = imp.display_name || imp.item_queue_id || 'import';
    }

    // Service
    d.service = upload.service_name;

    // Progress
    if (this.model.get('step') === 'upload') {
      d.progress = this.model.get('upload').progress;
    } else {
      d.progress = (UploadConfig.uploadStates.indexOf(d.state)/UploadConfig.uploadStates.length) * 100;
    }

    this.$el.html(this.template(d));

    return this;
  },

  _initBinds: function() {
    this.model.bind('change', this.render, this);
    this.model.bind('remove', this.clean, this);
  },

  _removeItem: function() {
    this.trigger('remove', this.model, this);
    this.model.pause();
    this.clean();
  },

  _showImportStats: function() {
    (new TwitterImportDetailsDialog({
      clean_on_hide: true,
      user: this.user,
      model: this.model
    })).appendToBody();
  },

  _showImportError: function() {
    var dialog = ViewFactory.createDialogByView(
      new ErrorDetailsView({
        err: this.model.getError(),
        user: this.user
      })
    );
    dialog.appendToBody();
  },

  _showImportWarnings: function() {
    var dialog = ViewFactory.createDialogByView(
      new WarningsDetailsView({
        warnings: this.model.getWarnings(),
        user: this.user
      })
    );
    dialog.appendToBody();
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../../view_factory":209,"../../../views/error_details_view":215,"../../../views/warnings_details_view":221,"../../models/upload_config":14,"./twitter_import_details_view":23}],22:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);

/**
 *  Import limit message within background importer
 *
 */

module.exports = cdb.core.View.extend({

  className: 'ImportItem ImportItem--sticky',
  tagName: 'li',

  initialize: function() {
    this.user = this.options.user;
    this.template = cdb.templates.getTemplate('common/background_polling/views/imports/background_import_limit');
  },

  render: function() {
    var importQuota = this.user.getMaxConcurrentImports();
    var isUpgradeable = !cdb.config.get('cartodb_com_hosted') && importQuota === 1;

    this.$el.html(
      this.template({
        upgradeUrl: window.upgrade_url,
        isUpgradeable: isUpgradeable,
        importQuota: importQuota
      })
    );

    return this;
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],23:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var BaseDialog = require('../../../views/base_dialog/view');
var Utils = (typeof window !== "undefined" ? window['cdb']['Utils'] : typeof global !== "undefined" ? global['cdb']['Utils'] : null);

/**
 *  When a Twitter import finishes, this dialog displays
 *  all the info about the price/cost etc.
 *
 */

module.exports = BaseDialog.extend({

  className: 'Dialog TwitterImportDetails is-opening',

  initialize: function() {
    this.elder('initialize');
    this.user = this.options.user;
    this.template = cdb.templates.getTemplate('common/background_polling/views/imports/twitter_import_details');
  },

  render_content: function() {
    var imp = this.model.get('import');
    var userTwitterValues = this.user.get('twitter');
    var availableTweets = userTwitterValues.quota - userTwitterValues.monthly_use;
    var vis = this.model.importedVis();
    var url = vis && encodeURI(vis.viewUrl(this.user).edit()) || '';
    var d = {
      type: vis && vis.get('type') === "table" ? "dataset" : "map",
      mapURL: url,
      datasetTotalRows: imp.tweets_georeferenced,
      datasetTotalRowsFormatted: Utils.formatNumber(imp.tweets_georeferenced),
      tweetsCost: imp.tweets_cost,
      tweetsCostFormatted: Utils.formatNumber(imp.tweets_cost),
      availableTweets: availableTweets,
      availableTweetsFormatted: Utils.formatNumber(availableTweets),
      tweetsOverquota: imp.tweets_overquota,
      tweetsOverquotaFormatted: Utils.formatNumber(imp.tweets_overquota),
      blockSizeFormatted: Utils.formatNumber(userTwitterValues.block_size),
      blockPriceFormatted: Utils.formatNumber(userTwitterValues.block_price)
    };
    return this.template(d);
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../../views/base_dialog/view":213}],24:[function(require,module,exports){
(function (global){
var queue = require('queue-async');
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);

/**
 * Convenient object to do async batch processing, and don't continue until all items have successfully finished.
 * In case of error it will fail immediately.
 *
 * Example usage:
 *   var batchProcess = require('../common/batch_process_items');
 *   batchProcess({
 *     items: [ ... ],
 *     done: function() {
 *       this.close();
 *     },
 *     fail: function(jqXHR, errorType, e) {
 *       this._errorMsg = 'Server response: '+ jqXHR.responseText;
 *       this.render();
 *     }
 *   });
 *
 * @param opts {Object}
 *   howManyInParallel: {Number}
 *   items: {Array} each item will be passed to processItem(item, ...
 *   processItem: {Function} given an item and a callback, should call callback() for success case, or callback(error) if something failed.
 *   fail: {Function}
 *   done: {Function} called if all items
 */
module.exports = function(opts) {
  var q = queue(opts.howManyInParallel);
  _.each(opts.items, function(item) {
    q.defer(function(callback) {
      opts.processItem(item, callback);
    });
  });

  q.awaitAll(function(error/*, result1, ..., resultN */) {
    // error and results contains outcome of the jqXHR requests above, see http://api.jquery.com/jQuery.ajax/#jqXHR
    if (error) {
      opts.fail(error);
    } else {
      opts.done();
    }
  });
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"queue-async":235}],25:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var Backbone = (typeof window !== "undefined" ? window['Backbone'] : typeof global !== "undefined" ? global['Backbone'] : null);
var XYZModel = require('./xyz/xyz_model.js');
var WMSModel = require('./wms/wms_model.js');
var NASAModel = require('./nasa/nasa_model.js');
var MapboxModel = require('./mapbox/mapbox_model.js');
var TileJSONModel = require('./tile_json/tile_json_view_model.js');

/**
 * View model for the add-custom-basemap view
 */
module.exports = cdb.core.Model.extend({

  defaults: {
    map: undefined,
    baseLayers: undefined,
    tabs: undefined,
    currentView: 'tabs',
    currentTab: 'xyz'
  },

  initialize: function(attrs) {
    this.elder('initialize');
    if (!attrs.map) throw new Error('map is required');
    if (!attrs.baseLayers) throw new Error('baseLayers is required');
    this._initTabs();
    this._initBinds();
  },

  activeTabModel: function() {
    return this.get('tabs').where({ name: this.get('currentTab') })[0];
  },

  canSaveBasemap: function() {
    return this.get('currentView') === 'tabs' && this._layerToSave();
  },

  saveBasemap: function() {
    if (!this.canSaveBasemap()) return;
    this.set('currentView', 'saving');

    var layer = this._layerToSave();
    if (this.activeTabModel().hasAlreadyAddedLayer(this.get('baseLayers'))) {
      this._onLayerSaved(layer);
    } else {
      // Add to baseLayers collection before saving, so save URL resolves to the expected endpoint.
      this.get('baseLayers').add(layer);

      var self = this;
      layer.save()
      .done(function() {
        self._onLayerSaved(layer);
      })
      .fail(function() {
        // Cleanup, remove layer it could not be saved!
        self.get('baseLayers').remove(layer);
        self.set('currentView', 'saveFail');
      });
    }
  },

  _onLayerSaved: function(layer) {
    var map = this.get('map');

    var clonedLayer = layer.clone();
    clonedLayer.unset('id');
    map.changeProvider('leaflet', clonedLayer);

    var bbox = layer.get('bounding_boxes');
    if (bbox && bbox.length === 4) {
      map.setBounds([
        [bbox[1], bbox[0]],
        [bbox[3], bbox[2]]
      ]);
    }

    this.set('currentView', 'saveDone');
  },

  _initTabs: function() {
    var tabs = new Backbone.Collection([
      new XYZModel(),
      new WMSModel({
        baseLayers: this.get('baseLayers')
      }),
      new NASAModel(),
      new MapboxModel(),
      new TileJSONModel()
    ]);
    this.set({
      tabs: tabs,
      currentTab: tabs.first().get('name')
    });
  },

  _initBinds: function() {
    this.get('tabs').each(function(tabModel) {
      tabModel.bind('saveBasemap', this.saveBasemap, this);
    }, this);
  },

  _layerToSave: function() {
    return this.activeTabModel().get('layer');
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./mapbox/mapbox_model.js":27,"./nasa/nasa_model.js":30,"./tile_json/tile_json_view_model.js":34,"./wms/wms_model.js":39,"./xyz/xyz_model.js":41}],26:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);
var BaseDialog = require('../../views/base_dialog/view.js');
var randomQuote = require('../../view_helpers/random_quote.js');
var ViewFactory = require('../../view_factory.js');
var ViewModel = require('./add_custom_basemap_model.js');
var TabsView = require('./tabs_view.js');

/**
 * Dialog to add ¯custom basemap to current map.
 */
module.exports = BaseDialog.extend({

  initialize: function() {
    this.elder('initialize');
    this.model = new ViewModel({
      map: this.options.map,
      baseLayers: this.options.baseLayers
    });
    this._initViews();
    this._initBinds();
  },

  /**
   * @override cdb.ui.common.Dialog.prototype.render
   */
  render: function() {
    BaseDialog.prototype.render.apply(this, arguments);
    this.$('.content').addClass('Dialog-contentWrapper');
    return this;
  },

  /**
   * @implements cdb.ui.common.Dialog.prototype.render_content
   */
  render_content: function() {
    var contentView = this._panes.active(this.model.get('currentView')).render();
    contentView.$el.addClass('Dialog-body Dialog-body--expanded Dialog-body--create');
    contentView.delegateEvents(); // enable events after being added to $el
    var $el = $(
      cdb.templates.getTemplate('common/dialogs/add_custom_basemap/add_custom_basemap')({
        model: this.model
      })
    );
    $el.append(contentView.el);
    return $el;
  },

  ok: function() {
    if (this.model.canSaveBasemap()) {
      this.model.saveBasemap();
    }
  },

  _initViews: function() {
    this._panes = new cdb.ui.common.TabPane({
      el: this.el
    });
    this.addView(this._panes);
    this._panes.addTab('tabs',
      new TabsView({
        model: this.model
      })
    );
    this._panes.addTab('saving',
      ViewFactory.createByTemplate('common/templates/loading', {
        title: 'Setting basemap…',
        quote: randomQuote()
      }).render()
    );
    this._panes.addTab('saveFail',
      ViewFactory.createByTemplate('common/templates/fail', {
        msg: ''
      }).render()
    );
    this._panes.active(this.model.get('currentView'));
  },

  _initBinds: function() {
    this.model.bind('change:currentView', this._onCurrentViewChange, this);
  },

  _onCurrentViewChange: function() {
    if (this.model.get('currentView') === 'saveDone') {
      this.close();
    } else {
      this.render();
    }
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../view_factory.js":209,"../../view_helpers/random_quote.js":212,"../../views/base_dialog/view.js":213,"./add_custom_basemap_model.js":25,"./tabs_view.js":32}],27:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var MapboxView = require('./mapbox_view');
var MapboxToTileLayerFactory = require('./mapbox_to_tile_layer_factory');

/**
 * View model for XYZ tab content.
 */
module.exports = cdb.core.Model.extend({

  defaults: {
    name: 'mapbox',
    label: 'Mapbox',
    currentView: 'enterURL', //, validatingInputs, valid
    lastErrorMsg: '', //set if fails to save
    layer: undefined // will be set when valid
  },

  createView: function() {
    this.set({
      currentView: 'enterURL',
      layer: undefined
    });
    return new MapboxView({
      model: this
    });
  },

  hasAlreadyAddedLayer: function(baseLayers) {
    var urlTemplate = this.get('layer').get('urlTemplate');
    return _.any(baseLayers.custom(), function(customLayer) {
      return customLayer.get('urlTemplate') === urlTemplate;
    });
  },

  save: function(url, accessToken) {
    this.set({
      currentView: 'validatingInputs',
      url: url,
      accessToken: accessToken
    });

    var self = this;
    var mf = new MapboxToTileLayerFactory({
      url: url,
      accessToken: accessToken
    });
    mf.createTileLayer({
      success: function(tileLayer) {
        self.set('layer', tileLayer);
        self.trigger('saveBasemap');
      },
      error: function(errorMsg) {
        self.set({
          currentView: 'enterURL',
          lastErrorMsg: errorMsg
        });
      }
    });
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./mapbox_to_tile_layer_factory":28,"./mapbox_view":29}],28:[function(require,module,exports){
(function (global){
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);

/**
 * Factory to create a cdb.admin.TileLayer from a given URL and access token tuple for Mapbox.
 * Extracted from mapbox_basemap_pane to maintain current logic, since it's rather complex…
 */
module.exports = cdb.core.Model.extend({

  defaults: {
    url: '',
    accessToken: ''
  },

  _MAPBOX: {
    version: 4,
    https: 'https://dnv9my2eseobd.cloudfront.net',
    base: 'https://a.tiles.mapbox.com/'
  },

  /**
   * @param {Object} callbacks
   *   success {Function} given a new TileLayer object
   *   error {Function} given an error explanation
   */
  createTileLayer: function(callbacks) {
    var val = this.get('url');
    var url = this._lowerXYZ(val);
    var access_token = this.get('accessToken');
    var type = 'json';
    var subdomains = ['a', 'b', 'c'];
    var mapbox_id;

    // Detects the URL's type
    if (url.indexOf('{x}') < 0 && url.indexOf('tiles.mapbox.com') !== -1) {
      mapbox_id = this._getMapBoxMapID(url);
      if (mapbox_id) {
        type = 'mapbox_id';
        url = mapbox_id;
      }
    } else if (url.indexOf('{x}') !== -1) {
      type = 'xyz';
      url = url.replace(/\{s\}/g, function() {
          return subdomains[Math.floor(Math.random() * 3)];
        })
        .replace(/\{x\}/g, '0')
        .replace(/\{y\}/g, '0')
        .replace(/\{z\}/g, '0');
    } else if (url && url.indexOf('http') < 0 && url.match(/(.*?)\.(.*)/) != null && url.match(/(.*?)\.(.*)/).length === 3) {
      type = 'mapbox_id';
      mapbox_id = val;
    } else { // If not, check https
      url = this._fixHTTPS(url);
    }

    var self = this;
    var image;
    if (type === 'mapbox') {
      callbacks.success(this._newTileLayer({ tiles: [url] }));
    } else if (type === 'xyz') {
      image = new Image();
      image.onload = function() {
        callbacks.success(self._newTileLayer({
          tiles: [self._lowerXYZ(val)]
        }));
      };
      image.onerror = function() {
        callbacks.error(self._errorToMsg());
      };
      image.src = url;
    } else if (type === 'mapbox_id') {
      var params = '?access_token=' + access_token;
      var base_url = this._MAPBOX.base + 'v' + this._MAPBOX.version + '/' + mapbox_id;
      var tile_url = base_url + '/{z}/{x}/{y}.png' + params;
      var json_url = base_url + '.json' + params;

      // JQuery has a faulty implementation of the getJSON method and doesn't return
      // a 404, so we use a timeout. TODO: replace with CORS
      var errorTimeout = setTimeout(function() {
        callbacks.error(self._errorToMsg());
      }, 5000);

      $.ajax({
        url: json_url,
        success: function(data) {
          clearTimeout(errorTimeout);
          callbacks.success(self._newTileLayer({
            tiles: [tile_url],
            attribution: data.attribution,
            minzoom: data.minzoom,
            maxzoom: data.maxzoom,
            name: data.name
          }));
        },
        error: function(e) {
          clearTimeout(errorTimeout);
          callbacks.error(self._errorToMsg(e));
        }
      });
    } else {
      callbacks.error(this._errorToMsg());
    }
  },

  _newTileLayer: function(data) {
    // Check if the respond is an array
    // In that case, get only the first
    if (_.isArray(data) && _.size(data) > 0) {
      data = _.first(data);
    }

    return new cdb.admin.TileLayer({
      urlTemplate: data.tiles[0],
      attribution: data.attribution || null,
      maxZoom: data.maxzoom || 21,
      minZoom: data.minzoom || 0,
      name: data.name || ''
    });
  },

  _errorToMsg: function(error) {
    if (typeof error === 'object' || !error) {
      if (error && error.status && error.status === 401) {
        return 'Error retrieving your basemap. Please, check your access token.';
      } else {
        return 'This value is not valid.';
      }
    }

    return error;
  },

  _lowerXYZ: function(url) {
    return url.replace(/\{S\}/g, "{s}")
      .replace(/\{X\}/g, "{x}")
      .replace(/\{Y\}/g, "{y}")
      .replace(/\{Z\}/g, "{z}");
  },

  // Extracts the Mapbox MapId from a Mapbox URL
  _getMapBoxMapID: function(url) {
    // http://d.tiles.mapbox.com/v3/{user}.{map}/3/4/3.png
    // http://a.tiles.mapbox.com/v3/{user}.{map}/page.html
    // http://a.tiles.mapbox.com/v4/{user}.{map}.*
    var reg1 = /https?:\/\/[a-z]?\.?tiles\.mapbox.com\/v(\d)\/([^\/.]*)\.([^\/.]*)/;

    // https://tiles.mapbox.com/{user}/edit/{map}?newmap&preset=Streets#3/0.00/-0.09
    var reg2 = /https?:\/\/tiles\.mapbox\.com\/(.*?)\/edit\/(.*?)(\?|#)/;

    var match = '';

    // Check first expresion
    match = url.match(reg1);

    if (match && match[1] && match[2]) {
      return match[2] + "." + match[3];
    }

    // Check second expresion
    match = url.match(reg2);

    if (match && match[1] && match[2]) {
      return match[1] + "." + match[2];
    }
  },

  /**
   * return a https url if the current application is loaded from https
   */
  _fixHTTPS: function(url, loc) {
    loc = loc || location;

    // fix the url to https or http
    if (url.indexOf('https') !== 0 && loc.protocol === 'https:') {
      // search for mapping
      var i = url.indexOf('mapbox.com');
      if (i !== -1) {
        return this._MAPBOX.https + url.substr(i + 'mapbox.com'.length);
      }
      return url.replace(/http/, 'https');
    }
    return url;
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],29:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var ViewFactory = require('../../../view_factory.js');
var randomQuote = require('../../../view_helpers/random_quote.js');


/**
 * Represents the Mapbox tab content.
 */
module.exports = cdb.core.View.extend({

  events: {
    'click .js-ok': '_onClickOK',
    'keydown': '_onKeyDown',
    'keyup': '_onKeyUp'
  },

  initialize: function() {
    this.elder('initialize');
    this._initBinds();
  },

  render: function() {
    this.clearSubViews();

    var view;
    switch (this.model.get('currentView')) {
      case 'validatingInputs':
        view = ViewFactory.createByTemplate('common/templates/loading', {
          title: 'Validating…',
          quote: randomQuote()
        });
        break;
      case 'enterURL':
      default:
        view = ViewFactory.createByTemplate('common/dialogs/add_custom_basemap/mapbox/enter_url', {
          url: this.model.get('url'),
          accessToken: this.model.get('accessToken'),
          lastErrorMsg: this.model.get('lastErrorMsg')
        });
    }
    this.addView(view);
    this.$el.append(view.render().el);

    return this;
  },

  _initBinds: function() {
    this.model.bind('change', this.render, this);
  },

  _hasValues: function() {
    return this._urlVal() && this._accessToken();
  },

  _urlVal: function() {
    return this.$('.js-url').val();
  },

  _accessToken: function() {
    return this.$('.js-access-token').val();
  },

  _onClickOK: function(ev) {
    this.killEvent(ev);
    if (this._hasValues()) {
      var url = this._urlVal();
      var accessToken = this._accessToken();
      this.model.save(url, accessToken);
    }
  },

  _onKeyDown: function(ev) {
    ev.stopPropagation();
    this.$('.js-error').removeClass('is-visible');
  },

  _onKeyUp: function(ev) {
    ev.stopPropagation();
    this.$('.js-ok').toggleClass('is-disabled', !this._hasValues());
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../../view_factory.js":209,"../../../view_helpers/random_quote.js":212}],30:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var NASAView = require('./nasa_view');
var moment = (typeof window !== "undefined" ? window['moment'] : typeof global !== "undefined" ? global['moment'] : null);

var TYPES = {
  day: {
    url:          'http://map1.vis.earthdata.nasa.gov/wmts-webmerc/MODIS_Terra_CorrectedReflectance_TrueColor/default/<%- date %>/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpeg',
    limit:        '2012-05-01',
    default:      '2012-05-01',
    attribution:  '<a href="http://earthdata.nasa.gov/gibs" target="_blank">NASA EOSDIS GIBS</a>',
    name:         'NASA Terra',
    maxZoom:      9,
    minZoom:      1
  },

  night: {
    url:          'http://map1.vis.earthdata.nasa.gov/wmts-webmerc/VIIRS_CityLights_2012/default/<%- date %>/GoogleMapsCompatible_Level8/{z}/{y}/{x}.jpeg',
    limit:        '2012-05-01',
    default:      '2012-05-02',
    attribution:  '<a href="http://earthdata.nasa.gov/gibs" target="_blank">NASA EOSDIS GIBS</a>',
    name:         'NASA Earth at night',
    maxZoom:      8,
    minZoom:      1
  }
};

/**
 * View model for XYZ tab content.
 */
module.exports = cdb.core.Model.extend({

  defaults: {
    name: 'nasa',
    label: 'NASA',
    layer: undefined, //gets set on dayOrNight/date changes
    layerType: 'day',

    // for date picker
    date: undefined,
    current: undefined,
    format: 'Y-m-d' // YYYY-MM-DD
  },

  initialize: function() {
    this.elder('initialize');
    this._initBinds();
  },

  createView: function() {
    var utc = new Date().getTimezoneOffset();
    var today = moment(new Date()).utcOffset(utc).format('YYYY-MM-DD');
    var yesterday = moment(new Date()).utcOffset(utc).subtract(1, 'days').format('YYYY-MM-DD');
    this.set({
      current: today,
      date: yesterday
    });

    return new NASAView({
      model: this
    });
  },

  hasAlreadyAddedLayer: function(baseLayers) {
    var urlTemplate = this.get('layer').get('urlTemplate');
    return _.any(baseLayers.custom(), function(customLayer) {
      return customLayer.get('urlTemplate') === urlTemplate;
    });
  },

  _initBinds: function() {
    this.bind('change:date change:layerType', this._onChange, this);
  },

  _onChange: function() {
    var dateStr = this.get('date');
    var layerType = this.get('layerType');
    this.set('layer', new cdb.admin.TileLayer({
      urlTemplate: _.template(TYPES[layerType].url)({
        date: dateStr
      }),
      attribution: TYPES[layerType].attribution,
      maxZoom: TYPES[layerType].maxZoom,
      minZoom: TYPES[layerType].minZoom,
      name: TYPES[layerType].name + ' ' + dateStr
    }));
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./nasa_view":31}],31:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var moment = (typeof window !== "undefined" ? window['moment'] : typeof global !== "undefined" ? global['moment'] : null);
var DateFieldView = require('../../../edit_fields/date_field/date_field_view');
var EditFieldModel = require('../../../edit_fields/edit_field_model');

/**
 * Represents the XYZ tab content.
 */
module.exports = cdb.core.View.extend({

  options: {
    dateFormat: 'YYYY-MM-DD'
  },

  events: {
    'click .js-day': '_onChangeToDay',
    'click .js-night': '_onChangeToNight'
  },

  initialize: function() {
    this.elder('initialize');
    this.dateModel = new EditFieldModel({
      value: this.model.get('date'),
      type: 'date'
    });
    this._initBinds();
  },

  render: function() {
    this.clearSubViews();

    this.$el.html(
      cdb.templates.getTemplate('common/dialogs/add_custom_basemap/nasa/nasa')({
        layerType: this.model.get('layerType'),
        initialDateStr: moment(this.dateModel.get('value')).format(this.options.dateFormat)
      })
    );

    this._renderDatePicker();

    return this;
  },

  _initBinds: function() {
    this.model.bind('change:layerType', function() {
      this.dateModel.set('readOnly', this.model.get('layerType') === "night");
      this.render()
    }, this);
    this.dateModel.bind('change:value', function() {
      var date = moment(this.dateModel.get('value')).format(this.options.dateFormat);
      this.model.set('date', date);
    }, this);
    this.add_related_model(this.dateModel);
  },

  _renderDatePicker: function() {
    // Date field 
    var dateField = new DateFieldView({
      model: this.dateModel,
      showTime: false,
      showGMT: false
    });
    this.addView(dateField);
    this._$datePicker().append(dateField.render().el);

    // Disabled tooltip
    if (this.dateModel.get('readOnly')) {
      this.addView(
        new cdb.common.TipsyTooltip({
          el: this._$datePicker(),
          title: function(e) {
            return $(this).attr('data-title')
          }
        })
      )
    }
  },

  _onChangeToNight: function(ev) {
    this.model.set('layerType', 'night');
  },

  _onChangeToDay: function() {
    this.model.set('layerType', 'day');
  },

  _$datePicker: function() {
    return this.$('.js-datePicker');
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../../edit_fields/date_field/date_field_view":195,"../../../edit_fields/edit_field_model":199}],32:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);

/**
 * View representing the tabs content of the dialog.
 */
module.exports = cdb.core.View.extend({

  events: {
    'click .js-tabs button': '_onClickTab'
  },

  initialize: function() {
    this.elder('initialize');
    this._initBinds();
  },

  render: function() {
    var $el = $(
      cdb.templates.getTemplate('common/dialogs/add_custom_basemap/tabs')({
        model: this.model
      })
    );
    $el.find('.js-tab-content').append(this._createTabContentView().el);
    this.$el.html($el);
    return this;
  },

  _initBinds: function() {
    this.model.bind('change:currentTab', this.render, this);
  },

  _createTabContentView: function() {
    if (this._currentTabView) {
      this._currentTabView.clean();
    }
    this._currentTabView = this.model.activeTabModel().createView();
    this.addView(this._currentTabView);
    return this._currentTabView.render();
  },

  _onClickTab: function(ev) {
    this.killEvent(ev);
    var name = $(ev.target).closest('button').data('name');
    if (name) {
      this.model.set('currentTab', name);
    } else {
      cdb.log.error('tab name was expected but was empty');
    }
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],33:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);

/**
 * Represents the TileJSON tab content.
 */
module.exports = cdb.core.View.extend({

  events: {
    'keydown .js-url': '_update',
    'paste .js-url': '_update'
  },

  initialize: function() {
    this.elder('initialize');
    this._lastURL = '';
  },

  render: function() {
    this.$el.html(
      cdb.templates.getTemplate('common/dialogs/add_custom_basemap/tile_json/tile_json')({
      })
    );

    return this;
  },

  _update: function(ev) {
    ev.stopPropagation();
    this._debouncedUpdate();
  },

  _debouncedUpdate: _.debounce(function() {
    this._disableOkBtn(true);
    this._indicateIsValidating(true);

    var url = this._urlWithHTTP();
    if (url === this._lastURL) {
      // Even if triggered nothing really changed so just update UI and return early
      this._indicateIsValidating(false);
      this._updateError();
      return;
    }

    this._lastURL = url;
    this._indicateIsValidating(true);
    var tileJSON = new cdb.admin.TileJSON({
      url: url
    });

    var self = this;
    tileJSON.fetch({
      success: function() {
        if (url === self._lastURL) {
          self.model.set('layer', tileJSON.newTileLayer());
          self._disableOkBtn(false);
          self._indicateIsValidating(false);
          self._updateError();
        }
      },
      error: function() {
        if (url === self._lastURL) {
          self._indicateIsValidating(false);
          // Note that this text can not be longer, or it will exceed available space of the error label.
          self._updateError('Invalid URL, please make sure it is correct');
        }
      }
    });
  }, 150),

  _disableOkBtn: function(disable) {
    this.$('.ok')[ disable ? 'addClass' : 'removeClass' ]('is-disabled');
  },

  _updateError: function(msg) {
    this.$('.js-error').text(msg)[ msg ? 'addClass' : 'removeClass' ]('is-visible');
  },

  _indicateIsValidating: function(indicate) {
    if (indicate) {
      this.$('.js-idle').hide();
      this.$('.js-validating').show();
    } else {
      this.$('.js-validating').hide();
      this.$('.js-idle').show();
    }
  },

  // So don't try to be fetched relatively to current URL path later
  _urlWithHTTP: function() {
    var str = this.$('.js-url').val();
    if (str.indexOf('http://') === -1) {
      return 'http://' + str;
    } else {
      return str;
    }
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],34:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var TileJSONView = require('./tile_json_view');

/**
 * View model for TileJSON tab content.
 */
module.exports = cdb.core.Model.extend({

  defaults: {
    name: 'tile_json',
    label: 'TileJSON',
    layer: undefined // will be set when valid
  },

  createView: function() {
    this.set({
      layer: undefined
    });
    return new TileJSONView({
      model: this
    });
  },

  hasAlreadyAddedLayer: function(baseLayers) {
    var urlTemplate = this.get('layer').get('urlTemplate');
    return _.any(baseLayers.custom(), function(customLayer) {
      return customLayer.get('urlTemplate') === urlTemplate;
    });
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./tile_json_view":33}],35:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);

/**
 * Model for an individual WMS/WMTS layer.
 */
module.exports = cdb.core.Model.extend({

  defaults: {
    state: 'idle', //, saving, saveDone, saveFail
    layer: undefined // set after saveDone
  },

  canSave: function(baseLayers) {
    return !_.any(baseLayers.custom(), function(customLayer) {
      return customLayer.get('name') === this.get('title');
    }, this);
  },

  save: function() {
    this.set('state', 'saving');
    this._shouldBeProxied() ? this._createProxiedLayer() : this._newTileLayer();
  },

  _shouldBeProxied: function() {
    if (this.get('type') === 'wmts') {
      var supportedMatrixSets = cdb.admin.WMSService.supportedMatrixSets(this.get('matrix_sets') || []);
      return supportedMatrixSets.length > 0;
    }
    return true;
  },

  _createProxiedLayer: function() {
    var self = this;
    var w = new cdb.admin.WMSService({
      wms_url: this.url(),
      title: this.get('title'),
      name: this.get('name'),
      layer: this.get('name'),
      srs: this.get('srs'),
      bounding_boxes: this.get('llbbox'),
      type: this.get('type'), // wms/wmts
      matrix_sets: this.get('matrix_sets')
    });

    // Event tracking "WMS layer selected"
    cdb.god.trigger('metrics', 'select_wms', {
      email: window.user_data.email
    });

    var self = this;
    w.save({}, {
      success: function(m) {
        var tileLayer;
        try {
          tileLayer = m.newTileLayer();
        } catch(e) {
        }
        if (tileLayer) {
          self._setNewTileLayer(tileLayer);
        } else {
          self.set('state', 'saveFail');
        }
      },
      error: function() {
        self.set('state', 'saveFail');
      }
    });

    return w;
  },

  _setNewTileLayer: function(tileLayer) {
    this.set({
      state: 'saveDone',
      tileLayer: tileLayer
    });
  },

  _newTileLayer: function() {
    var tileLayer = cdb.admin.TileLayer.byCustomURL(this._xyzURLTemplate(), false);
    tileLayer.set({
      name: this.get('title') || this.get('name'),
      attribution: this.get('attribution'),
      bounding_boxes: this.get('llbbox')
    });
    this._setNewTileLayer(tileLayer);
    return tileLayer;
  },

  _xyzURLTemplate: function() {
    var urlTemplate = this.get('url_template') || '';
    // Convert the proxy template variables to XYZ format, http://foo.com/bar/%%(z)s/%%(x)s/%%(y)s.png"
    return urlTemplate.replace(/%%\((\w)\)s/g, '{$1}');
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],36:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);

/**
 * View for an individual layer item.
 */
module.exports = cdb.core.View.extend({

  tagName: 'li',
  className: 'List-row',

  events: {
    'click .js-add': '_onClickAdd'
  },

  render: function() {
    this.$el.html(
      cdb.templates.getTemplate('common/dialogs/add_custom_basemap/wms/layer')({
        model: this.model,
        canSave: this.model.canSave(this.options.baseLayers)
      })
    );
    return this;
  },

  _onClickAdd: function(ev) {
    this.killEvent(ev);
    if (this.model.canSave(this.options.baseLayers)) {
      this.model.save();
    }
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],37:[function(require,module,exports){
(function (global){
var Backbone = (typeof window !== "undefined" ? window['Backbone'] : typeof global !== "undefined" ? global['Backbone'] : null);
var LayerModel = require('./layer_model.js');

module.exports = Backbone.Collection.extend({

  model: LayerModel,

  fetch: function(url, callback) {
    this.url = url;

    var wmsService = new cdb.admin.WMSService({
      wms_url: url
    });

    var self = this;
    wmsService.fetch().always(function() {
      self.reset(wmsService.get('layers'));
      self.each(function(model) {
        model.set('type', wmsService.get('type')); // wms/wmts
      });
      callback();
    });
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./layer_model.js":35}],38:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);
var pluralizeStr = require('../../../view_helpers/pluralize_string');
var LayerView = require('./layer_view.js');

/**
 * Sub view, to select what layer to use as basemap.
 */
module.exports = cdb.core.View.extend({

  events: {
    'click .js-back': '_onClickBack'
  },

  render: function() {

    this.clearSubViews();

    var $el = $(
      cdb.templates.getTemplate('common/dialogs/add_custom_basemap/wms/select_layer')({
        searchQuery: this.model.get('searchQuery'),
        layersFound: this.model.getLayers(),
        layersAvailableCount: this.model.layersAvailableCount(),
        pluralizeStr: pluralizeStr
      })
    );
    var $list = $el.find('.js-layers');
    $list.append.apply($list, this._renderedLayers());
    this.$el.html($el);
    return this;
  },

  _renderedLayers: function() {
    return this.model.getLayers().map(function(layer) {
      var view = new LayerView({
        model: layer,
        baseLayers: this.model.get('baseLayers')
      });
      this.addView(view);
      return view.render().el;
    }, this);
  },

  _onClickBack: function(ev) {
    this.killEvent(ev);
    this.model.set('currentView', 'enterURL');
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../../view_helpers/pluralize_string":211,"./layer_view.js":36}],39:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var WMSView = require('./wms_view.js');
var LayersCollection = require('./layers_collection.js');

/**
 * View model for WMS/WMTS tab content.
 */
module.exports = cdb.core.Model.extend({

  defaults: {
    name: 'wms',
    label: 'WMS/WMTS',
    currentView: 'enterURL', // [fetchingLayers, selectLayer, savingLayer]
    layersFetched: false,
    layers: undefined,
    baseLayers: undefined // expected when instantiated
  },

  initialize: function() {
    this.elder('initialize');
    this.set('layers', new LayersCollection());
    this._initBinds();
  },

  createView: function() {
    this.set({
      currentView: 'enterURL',
      layersFetched: false
    });
    return new WMSView({
      model: this
    });
  },

  fetchLayers: function(url) {
    this.set('currentView', 'fetchingLayers');
    var self = this;
    this.get('layers').fetch(url, function() {
      self.set({
        currentView: self.get('layers').length > 0 ? 'selectLayer' : 'enterURL',
        layersFetched: true
      });
    });
  },

  layersAvailableCount: function() {
    return _.difference(
      this.get('layers').pluck('title'),
      this.get('baseLayers').pluck('name')
    ).length;
  },

  get: function(name) {
    if (name === 'layer') {
      return this.get('layers')
        .find(function(m) {
          return m.get('state') === 'saveDone';
        })
        .get('tileLayer');
    } else {
      return cdb.core.Model.prototype.get.apply(this, arguments);
    }
  },

  getLayers: function() {
    if (this.get("searchQuery")) {
      var regExp = new RegExp(this.get("searchQuery"), 'i');
      return this.get("layers").filter(function(layer) {
        return layer.get("name").match(regExp);
      }, this);
    } else {
      return this.get("layers");
    }
  },

  hasAlreadyAddedLayer: function() {
    // Already added layers are disabled to be saved for each layer
    return false;
  },

  _initBinds: function() {
    this.get('layers').bind('change:state', this._onLayerStateChange, this);
  },

  _onLayerStateChange: function(_, newState) {
    switch (newState) {
      case 'saving':
        this.set('currentView', 'savingLayer');
        break;
      case 'saveDone':
        this.trigger('saveBasemap');
        break;
      case 'saveFail':
      this.set('currentView', 'saveFail');
        break;
      default:
        this.set('currentView', 'selectLayer');
    }
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./layers_collection.js":37,"./wms_view.js":40}],40:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var randomQuote = require('../../../view_helpers/random_quote.js');
var SelectLayerView = require('./select_layer_view.js');
var ViewFactory = require('../../../view_factory.js');

/**
 * Represents the WMS/WMTS tab category.
 * Current state is defined by presence (or lack of) layers
 */
module.exports = cdb.core.View.extend({

  events: {
    'keydown .js-search-input': '_onKeyDown',
    'submit .js-search-form': 'killEvent',
    'keydown .js-url': '_update',
    'paste .js-url': '_update',
    'click .js-fetch-layers': '_onClickFetchLayers',
    'click .js-clean-search': '_onCleanSearchClick',
    'click .js-search-link': '_submitSearch'
  },

  initialize: function() {
    this.elder('initialize');
    this._initBinds();
  },

  render: function() {
    this.clearSubViews();
    var view;

    switch (this.model.get('currentView')) {
      case 'savingLayer':
        view = ViewFactory.createByTemplate('common/templates/loading', {
          title: 'Saving layer…',
          quote: randomQuote()
        });
        break;
      case 'selectLayer':
        view = new SelectLayerView({
          model: this.model
        });
        break;
      case 'saveFail':
        view = ViewFactory.createByTemplate('common/templates/fail', {
          msg: ''
        });
        break;
      case 'fetchingLayers':
        view = ViewFactory.createByTemplate('common/templates/loading', {
          title: 'Fetching layers…',
          quote: randomQuote()
        });
        break;
      case 'enterURL':
      default:
        view = ViewFactory.createByTemplate('common/dialogs/add_custom_basemap/wms/enter_url', {
          layersFetched: this.model.get('layersFetched'),
          layers: this.model.get('layers')
        });
        break;
    }
    this.addView(view);
    this.$el.append(view.render().el);

    this.$(".js-search-input").focus();

    return this;
  },

  _showCleanSearchButton: function() {
    this.$('.js-clean-search').show();
  },

  _hideCleanSearchButton: function() {
    this.$('.js-clean-search').hide();
  },

  _initBinds: function() {
    this.model.bind('change', this.render, this);
    this.model.bind('change', this._onChangeSearchQuery, this);
    this.model.get("layers").bind('reset', this.render, this);
  },

  _update: function(ev) {
    ev.stopPropagation();
    this._debouncedUpdate();
  },

  _debouncedUpdate: _.debounce(function() {
    this._enableFetchLayersButton(!!this.$('.js-url').val());
    this.$('.js-error').removeClass('is-visible'); // resets error state when changed
  }, 100),

  _enableFetchLayersButton: function(enable) {
    this.$('.js-fetch-layers')[ enable ? 'removeClass' : 'addClass' ]('is-disabled');
  },

  _onKeyDown: function(ev) {
    var enterPressed = (ev.keyCode == $.ui.keyCode.ENTER);
    if (enterPressed) {
      this.killEvent(ev);
      this._submitSearch();
    } 
  },

  _submitSearch: function(ev) {
    this.killEvent(ev);

    this.model.set("searchQuery", this.$(".js-search-input").val());
  },

  _onChangeSearchQuery: function() {

    var searchQuery = this.model.get("searchQuery");

    if (!searchQuery) {
      this._hideCleanSearchButton();
    }
  
  },

  _onCleanSearchClick: function(ev) {
    this.killEvent(ev);
    this.model.set("searchQuery", "");
  },

  _onClickFetchLayers: function(ev) {
    this.killEvent(ev);
    var url = this.$('.js-url').val();
    if (url) {
      this.model.fetchLayers(url);
    }
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../../view_factory.js":209,"../../../view_helpers/random_quote.js":212,"./select_layer_view.js":38}],41:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var XYZView = require('./xyz_view');

/**
 * View model for XYZ tab content.
 */
module.exports = cdb.core.Model.extend({

  defaults: {
    name: 'xyz',
    label: 'XYZ',
    tms: false,
    layer: undefined // will be set when valid
  },

  createView: function() {
    return new XYZView({
      model: this
    });
  },

  hasAlreadyAddedLayer: function(baseLayers) {
    var urlTemplate = this.get('layer').get('urlTemplate');
    return _.any(baseLayers.custom(), function(customLayer) {
      return customLayer.get('urlTemplate') === urlTemplate;
    });
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./xyz_view":42}],42:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);

/**
 * Represents the XYZ tab content.
 */
module.exports = cdb.core.View.extend({

  className: 'XYZPanel',

  events: {
    'click .js-tms': '_changeTMS',
    'keydown .js-url': '_update',
    'paste .js-url': '_update'
  },

  initialize: function() {
    this.elder('initialize');
    this._lastCallSeq = 0;
    this._initBinds();
  },

  render: function() {
    this.clearSubViews();
    this.$el.html(
      cdb.templates.getTemplate('common/dialogs/add_custom_basemap/xyz/xyz')({
      })
    );
    this._initViews();
    return this;
  },

  _initViews: function() {
    // Add TMS tooltip
    var tooltip = new cdb.common.TipsyTooltip({
      el: this.$('.js-tms'),
      title: function() {
        return $(this).data('title')
      }
    })
    this.addView(tooltip);
  },

  _initBinds: function() {
    this.model.bind('change:tms', this._setTMSCheckbox, this);
  },

  _update: function(ev) {
    ev.stopPropagation();
    this._debouncedUpdate();
  },

  _changeTMS: function(ev) {
    this.model.set('tms', !this.model.get('tms'));
    this._update(ev);
  },

  _setTMSCheckbox: function(e) {
    this.$('.js-tms .Checkbox-input')[ this.model.get('tms') ? 'addClass' : 'removeClass' ]('is-checked');
  },

  _debouncedUpdate: _.debounce(function() {
    this._disableOkBtn(true);
    this._indicateIsValidating(true);
    var layer;
    var urlErrorMsg;

    var url = this.$('.js-url').val();
    var tms = this.model.get('tms');

    if (url) {
      try {
        layer = cdb.admin.TileLayer.byCustomURL(url, tms);
      } catch (e) {
        urlErrorMsg = 'It does not look like a valid XYZ URL';
      }
    }

    this.model.set('layer', layer);
    if (layer) {
      var self = this;
      // Make sure only the last call made is the one that defines view change,
      // avoids laggy responses to indicate wrong state
      var thisCallSeq = ++this._lastCallSeq;
      layer.validateTemplateURL({
        success: function() {
          if (thisCallSeq === self._lastCallSeq) {
            self._disableOkBtn(false);
            self._indicateIsValidating(false);
            self._updateError();
          }
        },
        error: function() {
          if (thisCallSeq === self._lastCallSeq) {
            self._disableOkBtn(false);
            self._indicateIsValidating(false);
            // Note that this text can not be longer, or it will exceed available space of the error label.
            self._updateError("We couldn't validate this, if you're sure it contains data click \"add basemap\"");
          }
        }
      });
    } else if (url) {
      this._indicateIsValidating(false);
      this._updateError(urlErrorMsg);
    } else {
      this._indicateIsValidating(false);
      this._updateError();
    }
  }, 150),

  _setTMS: function(ev) {
    var $checkbox = $(ev.target).closest('.Checkbox');
    $checkbox.find('.Checkbox-input').toggleClass('is-checked');
    this._update(ev);
  },

  _disableOkBtn: function(disable) {
    this.$('.ok')[ disable ? 'addClass' : 'removeClass' ]('is-disabled');
  },

  _updateError: function(msg) {
    this.$('.js-error').text(msg)[ msg ? 'addClass' : 'removeClass' ]('is-visible');
  },

  _indicateIsValidating: function(indicate) {
    if (indicate) {
      this.$('.js-validating').show();
    } else {
      this.$('.js-validating').hide();
    }
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],43:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var BaseDialog = require('../../views/base_dialog/view');
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);

module.exports = BaseDialog.extend({

  events: function () {
    return _.extend({}, BaseDialog.prototype.events, {
      'click .js-ok': '_continue'
    });
  },

  initialize: function () {
    this.elder('initialize');
    this.template = cdb.templates.getTemplate('common/dialogs/builder_features_warning/template');
  },

  render_content: function () {
    return this.template({

    });
  },

  _continue: function () {
    this.close();
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../views/base_dialog/view":213}],44:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var BaseDialog = require('../../views/base_dialog/view');
var pluralizeString = require('../../view_helpers/pluralize_string');
var randomQuote = require('../../view_helpers/random_quote');

/**
 * Lock/unlock datasets/maps dialog.
 */
module.exports = BaseDialog.extend({

  events: function() {
    return _.extend({}, BaseDialog.prototype.events, {
      'click .js-ok': '_ok'
    });
  },

  initialize: function() {
    this.elder('initialize');
    this.options.template = this.options.template || cdb.templates.getTemplate('common/dialogs/change_lock/templates/dashboard');
    this.model.bind('change', function() {
      if (this.model.get('state') === 'ProcessItemsDone') {
        this.close();
      } else {
        this.render();
      }
    }, this);
  },

  /**
   * @implements cdb.ui.common.Dialog.prototype.render_content
   */
  render_content: function() {
    return this['_render' + this.model.get('state')]();
  },

  _renderConfirmChangeLock: function() {
    // An entity can be an User or Organization
    var itemsCount = this.model.get('items').length;
    var areLocked = this.model.get('initialLockValue');

    return this.options.template({
      model: this.model,
      itemsCount: itemsCount,
      ownerName: this.options.ownerName,
      isOwner: this.options.isOwner,
      thisOrTheseStr: itemsCount === 1 ? 'this' : 'these',
      itOrThemStr: itemsCount === 1 ? 'it' : 'them',
      areLocked: areLocked,
      positiveOrNegativeStr: areLocked ? 'positive' : 'alert',
      lockOrUnlockStr: areLocked ? 'unlock' : 'lock',
      contentTypePluralized: pluralizeString(
        this.model.get('contentType') === 'datasets' ? 'dataset' : 'map', //singular
        this.model.get('contentType'), // plural
        itemsCount
      )
    });
  },

  /**
   * @overrides BaseDialog.prototype._ok
   */
  _ok: function(e) {
    this.killEvent(e);
    this.model.inverseLock();
    this.render();
  },

  _renderProcessingItems: function() {
    var lockingOrUnlockingStr = this.model.get('initialLockValue') ? 'Unlocking' : 'Locking';
    return cdb.templates.getTemplate('common/templates/loading')({
      title: lockingOrUnlockingStr + ' ' + pluralizeString(this.model.get('contentType') === 'datasets' ? 'dataset' : 'map', this.model.get('items').length) + '…',
      quote: randomQuote()
    });
  },

  _renderProcessItemsFail: function() {
    var lockingOrUnlockingStr = this.model.get('initialLockValue') ? 'unlock' : 'lock';
    return cdb.templates.getTemplate('common/templates/fail')({
      msg: 'Failed to ' + lockingOrUnlockingStr + ' all items'
    });
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../view_helpers/pluralize_string":211,"../../view_helpers/random_quote":212,"../../views/base_dialog/view":213}],45:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var Backbone = (typeof window !== "undefined" ? window['Backbone'] : typeof global !== "undefined" ? global['Backbone'] : null);
var batchProcessItems = require('../../batch_process_items');

/**
 * View model for change lock view.
 * Manages the life cycle states for the change lock view.
 */
module.exports = cdb.core.Model.extend({

  defaults: {
    state: 'ConfirmChangeLock',
    initialLockValue: false,
    contentType: 'datasets',
    items: undefined // a Backbone collection
  },

  initialize: function(attrs) {
    this.elder('initialize');
    this.set('items', new Backbone.Collection(attrs.items));
    if (this.get('items').chain().map(function(item) { return item.get('locked'); }).uniq().value().length > 1) {
      var errorMsg = 'It is assumed that all items have the same locked state, a user should never be able to ' +
        'select a mixed item with current UI. If you get an error with this message something is broken';
      if (window.trackJs && window.trackJs.track) {
        window.trackJs.track(errorMsg);
      } else {
        throw new Error(errorMsg);
      }
    }

    this.set('initialLockValue', this.get('items').at(0).get('locked'));
  },

  inverseLock: function() {
    this.set('state', 'ProcessingItems');

    batchProcessItems({
      howManyInParallel: 5,
      items: this.get('items').toArray(),
      processItem: this._lockItem.bind(this, !this.get('initialLockValue')),
      done: this.set.bind(this, 'state', 'ProcessItemsDone'),
      fail: this.set.bind(this, 'state', 'ProcessItemsFail')
    });
  },

  _lockItem: function(newLockedValue, item, callback) {
    item.save({ locked: newLockedValue })
      .done(function() {
        callback();
      })
      .fail(function() {
        callback('something failed');
      });
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../batch_process_items":24}],46:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var StartView = require('./start_view');
var PrivacyOptions = require('./options_collection');
var BaseDialog = require('../../views/base_dialog/view');
var randomQuote = require('../../view_helpers/random_quote');
var ViewFactory = require('../../view_factory');
var ShareView = require('./share/share_view');

/**
 * Change privacy datasets/maps dialog.
 */
var ChangePrivacyView = BaseDialog.extend({

  initialize: function() {
    this.elder('initialize');
    this._privacyOptions = PrivacyOptions.byVisAndUser(this.options.vis, this.options.user);
    this._initViews();
    this._initBinds();
  },

  /**
   * @implements cdb.ui.common.Dialog.prototype.render_content
   */
  render_content: function() {
    return this._panes.getActivePane().render().el;
  },

  ok: function() {
    var selectedOption = this._privacyOptions.selectedOption();
    if (!selectedOption.canSave()) {
      return;
    }

    var self = this;
    this._panes.active('saving');
    selectedOption.saveToVis(this.options.vis, {
      success: function() {
        self.close();
      },
      error: function() {
        self._panes.active('saveFail');
      }
    });
  },

  _initViews: function() {
    this._panes = new cdb.ui.common.TabPane({
      el: this.el
    });
    this.addView(this._panes);
    this._panes.addTab('start',
      new StartView({
        privacyOptions: this._privacyOptions,
        user: this.options.user,
        vis: this.options.vis
      })
    );
    this._panes.addTab('saving',
      ViewFactory.createByTemplate('common/templates/loading', {
        title: 'Saving privacy…',
        quote: randomQuote()
      }).render()
    );
    this._panes.addTab('saveFail',
      ViewFactory.createByTemplate('common/templates/fail', {
        msg: ''
      }).render()
    );
    this._panes.active('start');
  },

  _initBinds: function() {
    this._panes.bind('tabEnabled', this.render, this);
    this._panes.getPane('start').bind('clickedShare', this._openShareDialog, this);
  },

  _openShareDialog: function() {
    var view = new ShareView({
      clean_on_hide: true,
      enter_to_confirm: true,
      user: this.options.user,
      vis: this.options.vis,
      ChangePrivacyView: ChangePrivacyView
    });

    // Order matters, close this dialog before appending the share one, for side-effects to work as expected (body.is-inDialog)
    this.close();
    view.appendToBody();
  }
});

module.exports = ChangePrivacyView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../view_factory":209,"../../view_helpers/random_quote":212,"../../views/base_dialog/view":213,"./options_collection":48,"./share/share_view":55,"./start_view":57}],47:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);

/**
 * Default model for a privacy option.
 */
module.exports = cdb.core.Model.extend({

  defaults: {
    privacy: 'PUBLIC',
    disabled: false,
    selected: false,
    password: undefined
  },

  validate: function(attrs) {
    if (attrs.disabled && attrs.selected) {
      return 'Option can not be disabled and selected at the same time';
    }
  },

  classNames: function() {
    return _.chain(['disabled', 'selected'])
      .map(function(attr) { return !!this.attributes[attr] ? 'is-'+attr : undefined; }, this)
      .compact().value().join(' ');
  },

  canSave: function() {
    return !this.get('disabled');
  },

  /**
   * @param vis {Object} instance of cdb.admin.Visualization
   * @param callbacks {Object}
   */
  saveToVis: function(vis, callbacks) {
    return vis.save(this._attrsToSave(), _.extend({ wait: true }, callbacks));
  },

  /**
   * @returns {Object} attrs
   * @protected
   */
  _attrsToSave: function() {
    return _.pick(this.attributes, 'privacy', 'password');
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],48:[function(require,module,exports){
(function (global){
var Backbone = (typeof window !== "undefined" ? window['Backbone'] : typeof global !== "undefined" ? global['Backbone'] : null);
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var OptionModel = require('./option_model');
var PasswordOptionModel = require('./password_option_model');

/**
 * type property should match the value given from the API.
 */
var ALL_OPTIONS = [{
  privacy: 'PUBLIC',
  illustrationType: 'positive',
  iconFontType: 'unlock',
  title: 'Public',
  desc: 'Everyone can view and download it',
  alwaysEnable: true
}, {
  privacy: 'LINK',
  illustrationType: 'alert',
  iconFontType: 'unlock',
  title: 'With link',
  desc: 'Only the people with the link can view it'
}, {
  privacy: 'PASSWORD',
  illustrationType: 'alert',
  iconFontType: 'unlockWithEllipsis',
  title: 'Password protected',
  desc: 'Only the people with the password can view it'
}, {
  privacy: 'PRIVATE',
  illustrationType: 'negative',
  iconFontType: 'lock',
  title: 'Private',
  desc: 'Only you can access it'
}];


/**
 * Collection that holds the different privacy options.
 */
module.exports = Backbone.Collection.extend({

  model: function(attrs, options) {
    if (attrs.privacy === 'PASSWORD') {
      return new PasswordOptionModel(attrs, options);
    } else {
      return new OptionModel(attrs, options);
    }
  },

  initialize: function() {
    this.bind('change:selected', this._deselectLastSelected, this)
  },

  selectedOption: function() {
    return this.find(function(option) {
      return option.get('selected');
    })
  },

  passwordOption: function() {
    return this.find(function(option) {
      return option.get('privacy') === 'PASSWORD';
    })
  },

  _deselectLastSelected: function(m, isSelected) {
    if (isSelected) {
      this.each(function(option) {
        if (option !== m) {
          option.set({selected: false}, {silent: true});
        }
      });
    }
  }

}, { // Class properties:

  /**
   * Get a privacy options collection from a Vis model
   *
   * Note that since the user's permissions should change very seldom, it's reasonable to assume they will be static for
   * the collection's lifecycle, so set them on the models attrs when creating the collection.
   * collection is created.
   *
   * @param vis {Object} instance of cdb.admin.Visualization
   * @param user {Object} instance of cdb.admin.User
   * @returns {Object} instance of this collection
   */
  byVisAndUser: function(vis, user) {
    var canSelectPremiumOptions = user.get('actions')[ vis.isVisualization() ? 'private_maps' : 'private_tables' ];
    var currentPrivacy = vis.get('privacy');
    var availableOptions = vis.privacyOptions();

    return new this(
      _.chain(ALL_OPTIONS)
        .filter(function(option) {
          return _.contains(availableOptions, option.privacy);
        })
        .map(function(option) {
          // Set state that depends on vis and user attrs, they should not vary during the lifecycle of this collection
          return _.defaults({
            selected: option.privacy === currentPrivacy,
            disabled: !(option.alwaysEnable || canSelectPremiumOptions)
          }, option)
        })
        .value()
    );
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./option_model":47,"./password_option_model":49}],49:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var OptionModel = require('./option_model');

/**
 * View model for the special privacy option representing a password protected map.
 * It handles the logic related to the password that needs to be set for the option.
 */
var PasswordOptionModel = OptionModel.extend({
  
  initialize: function() {
    OptionModel.prototype.initialize.apply(this, arguments);

    // Initially a default fake password is set, but if option is selected (like switching option) it's reset
    this.set('password', PasswordOptionModel.DEFAULT_FAKE_PASSWORD);
  },

  /**
   * @override OptionModel.attrsToSave
   */
  _attrsToSave: function() {
    var attrs = OptionModel.prototype._attrsToSave.call(this);
    
    if (attrs.password === PasswordOptionModel.DEFAULT_FAKE_PASSWORD) {
      delete attrs.password;
    }
    
    return attrs;
  }, 
  
  canSave: function() {
    return OptionModel.prototype.canSave.call(this) && !_.isEmpty(this.get('password'));
  }
  
}, {
  
  DEFAULT_FAKE_PASSWORD: '!@#!@#'
  
});

module.exports = PasswordOptionModel;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./option_model":47}],50:[function(require,module,exports){
(function (global){
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var PermissionView = require('./permission_view');
var UserDetailsView = require('./user_details_view');
var GroupDetailsView = require('./group_details_view');
var ViewFactory = require('../../../view_factory');

/**
 * Content view of the share dialog, lists of users to share item with.
 * - model: {Object} the share view model
 * - collection: {cdb.admin.Grantables}
 * - hasSearch: {Boolean}
 */
module.exports = cdb.core.View.extend({

  initialize: function() {
    _.each(['model', 'collection', 'pagedSearchModel'], function(name) {
      if (_.isUndefined(this.options[name])) throw new Error(name + ' is required');
    }, this);

    this._initBinds();
  },

  render: function() {
    this.clearSubViews();
    this.$el.empty();

    if (!this.options.pagedSearchModel.get('q')) {
      this._renderOrganizationPermissionView()
    }
    this._renderGrantablesViews();
    return this;
  },

  _initBinds: function() {
    this.collection.bind('reset', this.render, this);
    this.add_related_model(this.collection);

    this.options.pagedSearchModel.on('change:q', this.render, this);
    this.add_related_model(this.options.pagedSearchModel);
  },

  _renderGrantablesViews: function() {
    var dependentVisualizations = this.model.get('vis').tableMetadata().dependentVisualizations();
    this.collection.each(function(grantable) {
      this._appendView(
        new PermissionView({
          model: grantable.entity,
          permission: this.model.get('permission'),
          isWriteAccessTogglerAvailable: this.model.isWriteAccessTogglerAvailable(),
          detailsView: this._createDetailsView(
            this._detailsViewOpts.bind(this, dependentVisualizations, grantable.entity),
            grantable
          )
        })
      )
    }, this);
  },

  _renderOrganizationPermissionView: function() {
    this._appendView(
      new PermissionView({
        model: this.model.get('organization'),
        permission: this.model.get('permission'),
        isWriteAccessTogglerAvailable: this.model.isWriteAccessTogglerAvailable(),
        detailsView: ViewFactory.createByTemplate('common/dialogs/change_privacy/share/details', {
          avatarUrl: false,
          willRevokeAccess: false,
          title: 'Default settings for your Organization',
          desc: 'New users will have this permission',
          roleLabel: false
        }, {
          className: 'ChangePrivacy-shareListItemInfo'
        })
      })
    );
  },

  _appendView: function(view) {
    this.$el.append(view.render().el);
    this.addView(view);
  },

  _createDetailsView: function(detailsViewOpts, grantable) {
    var type = grantable.get('type');
    switch(type) {
      case 'user':
        return new UserDetailsView(
          detailsViewOpts([grantable.id])
        );
        break;
      case 'group':
        return new GroupDetailsView(
          detailsViewOpts(
            grantable.entity.users.chain()
              .reject(this._isCurrentUser)
              .pluck('id')
              .value()
          )
        );
        break;
      default:
        cdb.log.error('No details view for grantable model of type ' + type);
        return new cdb.core.View(detailsViewOpts());
    }
  },

  _detailsViewOpts: function(dependentVisualizations, grantableEntity, userIds) {
    return {
      className: 'ChangePrivacy-shareListItemInfo',
      model: grantableEntity,
      permission: this.model.get('permission'),
      isUsingVis: _.any(dependentVisualizations, function(vis) {
        return _.any(userIds, function(userId) {
          return userId === vis.permission.owner.id;
        })
      })
    };
  },

  _isCurrentUser: function(user) {
    return user.id === cdb.config.get('user').id;
  },

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../../view_factory":209,"./group_details_view":51,"./permission_view":53,"./user_details_view":56}],51:[function(require,module,exports){
(function (global){
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var pluralizeString = require('../../../view_helpers/pluralize_string')

module.exports = cdb.core.View.extend({

  initialize: function() {
    _.each(['permission', 'isUsingVis'], function(name) {
      if (_.isUndefined(this.options[name])) throw new Error(name + ' is required');
    }, this);
  },

  render: function() {
    this.$el.html(
      this.getTemplate('common/dialogs/change_privacy/share/details')({
        willRevokeAccess: this._willRevokeAccess(),
        avatarUrl: this.model.get('avatar_url'),
        title: this.model.get('display_name'),
        desc: this._desc(),
        roleLabel: false
      })
    );
    return this;
  },

  _desc: function() {
    var usersCount = this.model.users.length;
    var xMembers = pluralizeString.prefixWithCount('member', 'members', usersCount);

    if (this._willRevokeAccess()) {
      return xMembers + '. ' + pluralizeString("Member's", "Members'", usersCount) + ' maps will be affected';
    } else if (this.options.isUsingVis) {
      return xMembers + '. ' + pluralizeString('Member is', 'Members are', usersCount) + ' using this dataset';
    } else {
      return xMembers;
    }
  },

  _willRevokeAccess: function() {
    return this.options.isUsingVis && !this.options.permission.hasReadAccess(this.model);
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../../view_helpers/pluralize_string":211}],52:[function(require,module,exports){
(function (global){
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);

/**
 * View for an individual access toggler.
 */
module.exports = cdb.core.View.extend({

  tagName: 'span',

  events: {
    'mouseover .js-toggler.is-disabled': '_onHoverDisabledToggler',
    'mouseout .js-toggler': '_closeTooltip',
    'mouseleave .js-toggler': '_closeTooltip',
    'change .js-input': '_onChangeInput'
  },

  initialize: function() {
    _.each(['model', 'permission', 'hasAccess', 'canChangeAccess', 'toggleAccess', 'label'], function(name) {
      if (_.isUndefined(this.options[name])) throw new Error(name + ' is required');
    }, this);
  },

  render: function() {
    this.clearSubViews();
    this.$el.html(
      cdb.templates.getTemplate('common/dialogs/change_privacy/share/permission_toggler')({
        cid: this.cid,
        hasAccess: this.options.hasAccess(),
        canChangeAccess: this.options.canChangeAccess(),
        label: this.options.label
      })
    );
    return this;
  },

  _onChangeInput: function() {
    this.options.toggleAccess();
  },

  _onHoverDisabledToggler: function(ev) {
    var aclItem = this.options.permission.findRepresentableAclItem(this.model);
    if (aclItem && !aclItem.isOwn(this.model)) {
      this._tooltipView().showTipsy();
    }
  },

  _closeTooltip: function() {
    this._tooltipView().hideTipsy();
  },

  _tooltipView: function(el) {
    if (!this._tooltip) {
      this._tooltip = this._newTooltipView();
      this.addView(this._tooltip);
    }
    return this._tooltip;
  },

  _newTooltipView: function(el) {
    return new cdb.common.TipsyTooltip({
      el: this.$('.js-toggler'),
      trigger: 'manual',
      title: this._inheritedAccessTooltipText.bind(this)
    });
  },

  _inheritedAccessTooltipText: function() {
    var aclItem = this.options.permission.findRepresentableAclItem(this.model);
    var type = aclItem.get('type');
    switch(type) {
      case 'group':
        return 'Access is inherited from group ' + aclItem.get('entity').get('name');
      case 'org':
        return 'Access is inherited from organization';
      default:
        cdb.log.error('Trying to display inherited access for an unrecognized type ' + type)
        return ''
    }
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],53:[function(require,module,exports){
(function (global){
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var PermissionTogglerview = require('./permission_toggler_view');
var ViewFactory = require('../../../view_factory');

/**
 * View to change permission for a given model.
 */
module.exports = cdb.core.View.extend({

  className: 'ChangePrivacy-shareListItem',

  initialize: function() {
    _.each(['model', 'permission', 'isWriteAccessTogglerAvailable', 'detailsView'], function(name) {
      if (_.isUndefined(this.options[name])) throw new Error(name + ' is required');
    }, this);

    this._initBinds();
  },

  _initBinds: function() {
    this.options.permission.acl.bind('add remove reset change', this.render, this);
    this.add_related_model(this.options.permission);
  },

  render: function() {
    this.clearSubViews();
    this._renderDetails();
    this._renderAccessTogglers();
    return this;
  },

  _renderDetails: function() {
    this._renderView(this.options.detailsView);
  },

  _renderAccessTogglers: function() {
    var togglers = [
      this._newReadToggler()
    ];

    if (this.options.isWriteAccessTogglerAvailable) {
      togglers.unshift(this._newWriteToggler());
    }

    this._renderView(ViewFactory.createByList(togglers));
  },

  _newWriteToggler: function() {
    var p = this.options.permission;
    return new PermissionTogglerview({
      className: 'ChangePrivacy-shareListItemTogglerContainer',
      model: this.model,
      permission: p,
      label: 'Write',
      hasAccess: p.hasWriteAccess.bind(p, this.model),
      canChangeAccess: p.canChangeWriteAccess.bind(p, this.model),
      toggleAccess: this._toggleWrite.bind(this)
    });
  },

  _newReadToggler: function() {
    var p = this.options.permission;
    return new PermissionTogglerview({
      model: this.model,
      permission: p,
      label: 'Read',
      hasAccess: p.hasReadAccess.bind(p, this.model),
      canChangeAccess: p.canChangeReadAccess.bind(p, this.model),
      toggleAccess: this._toggleRead.bind(this)
    });
  },

  _renderView: function(view) {
    this.addView(view);
    this.$el.append(view.render().el)
  },

  _toggleWrite: function() {
    var p = this.options.permission;
    if (p.canChangeWriteAccess(this.model)) {
      if (p.hasWriteAccess(this.model)) {
        p.revokeWriteAccess(this.model);
      } else {
        p.grantWriteAccess(this.model);
      }
    }
  },

  _toggleRead: function() {
    var p = this.options.permission;
    if (p.canChangeReadAccess(this.model)) {
      if (p.hasReadAccess(this.model)) {
        p.revokeAccess(this.model);
      } else {
        p.grantReadAccess(this.model);
      }
    }
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../../view_factory":209,"./permission_toggler_view":52}],54:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);

/**
 * View model for a share view modal.
 */
module.exports = cdb.core.Model.extend({

  defaults: {
    vis: undefined,
    permission: undefined,
    organization: undefined
  },

  initialize: function(attrs) {
    if (!attrs.vis) throw new Error('vis is required');
    if (!attrs.organization) throw new Error('organization is required');

    var vis = this.get('vis');
    this.set('permission', vis.permission.clone());

    if (!vis.isVisualization()) {
      var self = this;
      vis.tableMetadata().fetch({
        silent: true,
        success: function() {
          self.trigger('all');
        }
      });
    }
  },

  name: function() {
    return this.get('vis').get('name');
  },

  isWriteAccessTogglerAvailable: function() {
    return !this.get('vis').isVisualization();
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],55:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var BaseDialog = require('../../../views/base_dialog/view');
var randomQuote = require('../../../view_helpers/random_quote');
var ViewFactory = require('../../../view_factory');
var PagedSearchModel = require('../../../paged_search_model');
var PagedSearchView = require('../../../views/paged_search/paged_search_view');
var ShareModel = require('./share_model');
var GrantablesView = require('./grantables_view');

/**
 * Dialog to share item with other users in organization.
 */
module.exports = BaseDialog.extend({

  events: BaseDialog.extendEvents({
    'click .js-back': '_openChangePrivacy'
  }),

  initialize: function() {
    if (!this.options.ChangePrivacyView) throw new Error('ChangePrivacyView is required');
    this.user = this.options.user;
    this.organization = this.user.organization;
    this.model = new ShareModel({
      vis: this.options.vis,
      organization: this.organization
    });
    this.elder('initialize');
    this._initViews();
    this._initBinds();
  },

  render: function() {
    BaseDialog.prototype.render.apply(this, arguments);
    this.$('.content').addClass('Dialog-content--expanded');
    return this;
  },

  // @implements cdb.ui.common.Dialog.prototype.render_content
  render_content: function() {
    return [
      this._htmlNode(
        cdb.templates.getTemplate('common/dialogs/change_privacy/share/share_header')({
          name: this.options.vis.get('name')
        })
      ),
      this._grantablesView.render().el,
      this._htmlNode(cdb.templates.getTemplate('common/dialogs/change_privacy/share/share_footer')())
    ];
  },

  // @implements cdb.ui.common.Dialog.prototype.ok
  ok: function() {
    var loadingView = ViewFactory.createDialogByTemplate('common/templates/loading', {
      title: 'Sharing…',
      quote: randomQuote()
    });
    loadingView.appendToBody();

    var permission = this.options.vis.permission;
    permission.overwriteAcl(this.model.get('permission'));
    permission.save()
      .always(function() {
        loadingView.close();
      })
      .fail(function() {
        var failView = ViewFactory.createDialogByTemplate('common/templates/fail', {
          msg: ''
        });
        failView.appendToBody();
      })
      .done(this._openChangePrivacy.bind(this));
  },

  _initViews: function() {
    var model = this.model;
    var grantables = this.organization.grantables;
    var pagedSearchModel = new PagedSearchModel({
      per_page: 50,
      order: 'name',
    });
    this._grantablesView = new PagedSearchView({
      isUsedInDialog: true,
      pagedSearchModel: pagedSearchModel,
      collection: grantables,
      createListView: function() {
        return new GrantablesView({
          model: model,
          collection: grantables,
          pagedSearchModel: pagedSearchModel
        })
      }
    });
  },

  _initBinds: function() {
    this.model.on('all', this._grantablesView.render, this._grantablesView);
  },

  _htmlNode: function(htmlStr) {
    return $(htmlStr)[0];
  },

  _openChangePrivacy: function() {
    var view = new this.options.ChangePrivacyView({
      clean_on_hide: true,
      enter_to_confirm: true,
      vis: this.options.vis,
      user: this.user
    });
    view.appendToBody();
    this.close();
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../../paged_search_model":206,"../../../view_factory":209,"../../../view_helpers/random_quote":212,"../../../views/base_dialog/view":213,"../../../views/paged_search/paged_search_view":218,"./grantables_view":50,"./share_model":54}],56:[function(require,module,exports){
(function (global){
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);

/**
 * View for the user details to show in the context of a permission item.
 */
module.exports = cdb.core.View.extend({

  initialize: function() {
    _.each(['permission', 'isUsingVis'], function(name) {
      if (_.isUndefined(this.options[name])) throw new Error(name + ' is required');
    }, this);
  },

  render: function() {
    this.$el.html(
      this.getTemplate('common/dialogs/change_privacy/share/details')({
        willRevokeAccess: this._willRevokeAccess(),
        avatarUrl: this.model.get('avatar_url'),
        title: this.model.get('username'),
        desc: this._desc(),
        roleLabel: this.model.get('viewer') ? 'Viewer' : 'Builder'
      })
    );
    return this;
  },

  _desc: function() {
    var email = this.model.get('email')

    if (this._willRevokeAccess()) {
      return email + ". User's maps will be affected";
    } else if (this.options.isUsingVis) {
      return email + ". User is using this dataset";
    } else {
      return email;
    }
  },

  _willRevokeAccess: function() {
    return this.options.isUsingVis && !this.options.permission.hasReadAccess(this.model);
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],57:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);
var pluralizeStr = require('../../view_helpers/pluralize_string');

var DISABLED_SAVE_CLASS_NAME = 'is-disabled';
var SHARED_ENTITIES_SAMPLE_SIZE = 5;

/**
 * View represent the start screen when opening the privacy dialog.
 * Display privacy options and possibly a upgrade or share banner depending on user privileges.
 */
module.exports = cdb.core.View.extend({

  events: {
    'click .js-option': '_onClickOption',
    'click .js-share': '_onClickShare',
    'keyup .js-password-input': '_onKeyUpPasswordInput'
  },

  initialize: function() {
    this.elder('initialize');
    if (!this.options.privacyOptions) throw new Error('privacyOptions is required');
    if (!this.options.user) throw new Error('user is required');
    if (!this.options.vis) throw new Error('vis is required');
    this.template = cdb.templates.getTemplate('common/dialogs/change_privacy/start');
    this._initBinds();
  },

  render: function() {
    // Password might not be available (i.e. for changing privacy of a dataset)
    var pwdOption = this.options.privacyOptions.passwordOption();
    var password = pwdOption ? pwdOption.get("password") : '';

    var selectedOption = this.options.privacyOptions.selectedOption();
    var upgradeUrl = cdb.config.get('upgrade_url');
    var sharedEntities = this.options.vis.permission.getUsersWithAnyPermission();

    this.$el.html(
      this.template({
        vis: this.options.vis,
        privacyOptions: this.options.privacyOptions,
        password: password,
        saveBtnClassNames: selectedOption.canSave() ? '' : DISABLED_SAVE_CLASS_NAME,
        showUpgradeBanner: upgradeUrl && this.options.privacyOptions.any(function(o) { return !!o.get('disabled'); }),
        upgradeUrl: upgradeUrl,
        showTrial: this.options.user.canStartTrial(),
        showShareBanner: this.options.user.organization,
        sharedEntitiesCount: sharedEntities.length,
        personOrPeopleStr: pluralizeStr('person', 'people', sharedEntities.length),
        sharedEntitiesSampleCount: SHARED_ENTITIES_SAMPLE_SIZE,
        sharedEntitiesSample: _.take(sharedEntities, SHARED_ENTITIES_SAMPLE_SIZE),
        sharedWithOrganization: this.options.vis.permission.isSharedWithOrganization()
      })
    );

    this.delegateEvents();

    return this;
  },

  _initBinds: function() {
    this.options.privacyOptions.bind('change:selected change:disabled', this.render, this);
    this.options.privacyOptions.bind('change:password', this._onChangePassword, this);
    this.add_related_model(this.options.privacyOptions);
  },

  _onClickOption: function(ev) {
    var i = $(ev.target).closest('.js-option').data('index');
    var option = this.options.privacyOptions.at(i);

    if (!option.get('disabled')) {
      option.set('selected', true);
    }

    var pwdOption = this.options.privacyOptions.passwordOption();
    if (option === pwdOption) {
      this.$(".js-password-input")
        .val('') // reset any existing input value
        .focus()
        .keyup(); // manually trigger a key up event to change password state
    } else if (pwdOption) { // Password might not be available (i.e. for changing privacy of a dataset)
      this.$(".js-password-input").val(pwdOption.get("password"));
    }
  },

  _onChangePassword: function() {
    this.$('.ok').toggleClass(DISABLED_SAVE_CLASS_NAME, !this.options.privacyOptions.selectedOption().canSave());
  },

  _onKeyUpPasswordInput: function(ev) {
    this.options.privacyOptions.passwordOption().set('password', ev.target.value);
  },

  _onClickShare: function(ev) {
    this.killEvent(ev);
    this.trigger('clickedShare');
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../view_helpers/pluralize_string":211}],58:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var DatasetsView = require('./listing/datasets_view');
var ImportsView = require('./listing/imports_view');

/**
 *  Create listing view
 *
 *  It will display all the possibilities to select
 *  any of your current datasets or connect a new dataset.
 *
 */
module.exports = cdb.core.View.extend({

  className: 'CreateDialog-listing CreateDialog-listing--noPaddingTop',

  initialize: function() {
    this.user = this.options.user;
    this.createModel = this.options.createModel;
    this.template = cdb.templates.getTemplate('common/views/create/create_listing');

    // Bug with binding... do not work with the usual one for some reason :(
    this.createModel.bind('change:listing', this._onChangeListing.bind(this));
    this.add_related_model(this.createModel);
    this._onChangeListing();
  },

  render: function() {
    this.clearSubViews();
    this.$el.html(this.template());
    this._initViews();
    return this;
  },

  _onChangeListing: function() {
    if (this.listingPane) {
      this.listingPane.active(this.createModel.get('listing'));
    }
  },

  _initViews: function() {
    // Listing content pane
    this.listingPane = new cdb.ui.common.TabPane({
      el: this.$(".ListingContent")
    });
    this.addView(this.listingPane);

    // Datasets view
    var datasetsView = new DatasetsView({
      defaultUrl: this.user.viewUrl().dashboard().datasets(),
      user: this.user,
      createModel: this.createModel,
      routerModel: this.createModel.visFetchModel,
      collection: this.createModel.collection
    });

    datasetsView.render();
    this._addListingPane('datasets', datasetsView);

    // Imports view
    if (this.user.canCreateDatasets()) {
      var importsView = new ImportsView({
        user: this.user,
        createModel: this.createModel
      });

      importsView.render();
      this._addListingPane('import', importsView);
    }
  },

  _addListingPane: function(name, view) {
    this.listingPane.addTab(name, view, {
      active: this.createModel.get('listing') === name
    });
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./listing/datasets_view":66,"./listing/imports_view":91}],59:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);

/**
 * Manages if upcoming import should guess or not.
 * Expected to be rendered in the footer of a create dialog.
 */
module.exports = cdb.core.View.extend({

  events: {
    'click .js-toggle': '_toggle'
  },

  initialize: function() {
    this.elder('initialize');
    this.createModel = this.options.createModel;
    this.template = cdb.templates.getTemplate('common/dialogs/create/footer/guessing_toggler');
    this._initBinds();
  },

  render: function() {
    var htmlStr = '';
    if (this.createModel.showGuessingToggler()) {
      htmlStr = this.template({
        isGuessingEnabled: this.model.get('guessing'),
        importState: this.createModel.getImportState(),
        isUploadValid: this.createModel.upload.isValidToUpload(),
        customHosted: cdb.config.get('cartodb_com_hosted')
      });
    }
    this.$el.html(htmlStr);

    return this;
  },

  _initBinds: function() {
    this.createModel.bind('change', this.render, this);
    this.model.bind('change', this.render, this);
    this.add_related_model(this.createModel);
  },

  _toggle: function() {
    var value = !this.model.get('guessing');
    this.model.set('guessing', value);
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],60:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);

/**
 *  Change the privacy of the new dataset.
 *  - If the user can't change the privacy, it will refer to the upgrade page
 *   unless app is the "open source" version
 *
 */

module.exports = cdb.core.View.extend({
  events: {
    'click': '_onClick'
  },

  initialize: function () {
    this.user = this.options.user;
    this.createModel = this.options.createModel;
    this.template = cdb.templates.getTemplate('common/dialogs/create/footer/privacy_toggler_template');
    this._initBinds();
  },

  render: function () {
    this.clearSubViews();
    this.$el.empty();

    if (this.createModel.showPrivacyToggler()) {
      var canChangePrivacy = this.user.canCreatePrivateDatasets();
      var privacy = this.model.get('privacy');
      var nexPrivacy = privacy === 'PUBLIC' ? 'PRIVATE' : 'PUBLIC';
      var icon = privacy === 'PUBLIC' ? 'unlock' : 'lock';
      var upgradeUrl = cdb.config.get('upgrade_url') || window.upgrade_url;
      var canUpgrade = !cdb.config.get('cartodb_com_hosted') && !canChangePrivacy && upgradeUrl;

      this.$el.html(
        this.template({
          privacy: privacy,
          isDisabled: !canChangePrivacy,
          canUpgrade: canUpgrade,
          nextPrivacy: nexPrivacy,
          upgradeUrl: upgradeUrl,
          icon: icon
        })
      );

      this._initViews();
    }

    return this;
  },

  _initBinds: function () {
    this.model.bind('change:privacy', this.render, this);
  },

  _initViews: function () {
    // Tooltip
    this.addView(
      new cdb.common.TipsyTooltip({
        el: this.$('.js-toggler'),
        html: true,
        title: function () {
          return $(this).attr('data-title');
        }
      })
    );
  },

  _onClick: function () {
    if (this.user.canCreatePrivateDatasets()) {
      var privacy = this.model.get('privacy');
      this.model.set('privacy', privacy === 'PUBLIC' ? 'PRIVATE' : 'PUBLIC');
      return;
    }
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],61:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
cdb.admin = (typeof window !== "undefined" ? window['cdb']['admin'] : typeof global !== "undefined" ? global['cdb']['admin'] : null);
var randomQuote = require('../../../../../common/view_helpers/random_quote');

/*
 *  Content result default view
 */

module.exports = cdb.core.View.extend({

  events: {
    'click .js-connect': '_onConnectClick'
  },

  initialize: function() {
    if (!this.options.defaultUrl) {
      throw new Error('defaultUrl is required')
    }
    this.user = this.options.user;
    this.routerModel = this.options.routerModel;
    this.template = cdb.templates.getTemplate(this.options.template);

    this._initBinds();
  },

  render: function() {
    var type = this.routerModel.get('content_type');

    this.$el.html(this.template({
      defaultUrl:     this.options.defaultUrl,
      page:           this.routerModel.get('page'),
      tag:            this.routerModel.get('tag'),
      q:              this.routerModel.get('q'),
      shared:         this.routerModel.get('shared'),
      locked:         this.routerModel.get('locked'),
      library:        this.routerModel.get('library'),
      quote:          randomQuote(),
      type:           type,
      totalItems:     this.collection.size(),
      totalEntries:   this.collection.total_entries
    }));

    return this;
  },

  _initBinds: function() {
    this.routerModel.bind('change', this.render, this);
    this.collection.bind('reset', this.render, this);
    this.add_related_model(this.routerModel);
    this.add_related_model(this.collection);
  },

  _onConnectClick: function() {
    this.trigger('connectDataset', this);
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../../../../common/view_helpers/random_quote":212}],62:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var moment = (typeof window !== "undefined" ? window['moment'] : typeof global !== "undefined" ? global['moment'] : null);
var Utils = (typeof window !== "undefined" ? window['cdb']['Utils'] : typeof global !== "undefined" ? global['cdb']['Utils'] : null);
var pluralizeString = require('../../../../view_helpers/pluralize_string');
var LikesView = require('../../../../views/likes/view');

/**
 * View representing an item in the list under datasets route.
 */
module.exports = cdb.core.View.extend({

  tagName: 'li',
  className: 'DatasetsList-item DatasetsList-item--selectable',

  events: {
    'click .js-tag-link': '_onTagClick',
    'click': '_toggleSelected'
  },

  initialize: function() {
    this.user = this.options.user;
    this.routerModel = this.options.createModel.visFetchModel;
    this.template = cdb.templates.getTemplate('common/views/create/listing/dataset_item');
    this.table = new cdb.admin.CartoDBTableMetadata(this.model.get('table'));

    this.model.on('change', this.render, this);
  },

  render: function() {
    var vis = this.model;
    var table = this.table;
    var tags = vis.get('tags') || [];
    var description = vis.get('description') && Utils.stripHTML(markdown.toHTML(vis.get('description'))) || '';

    var d = {
      isRaster:                vis.get('kind') === 'raster',
      geometryType:            table.geomColumnTypes().length > 0 ? table.geomColumnTypes()[0] : '',
      title:                   vis.get('name'),
      isOwner:                 vis.permission.isOwner(this.user),
      owner:                   vis.permission.owner.renderData(this.user),
      showPermissionIndicator: !vis.permission.hasWriteAccess(this.user),
      description:             description,
      privacy:                 vis.get('privacy').toLowerCase(),
      likes:                   vis.get('likes') || 0,
      timeDiff:                moment(vis.get('updated_at')).fromNow(),
      tags:                    tags,
      tagsCount:               tags.length,
      maxTagsToShow:           3,
      rowCount:                undefined,
      datasetSize:             undefined,
      syncStatus:              undefined,
      syncRanAt:               undefined
    };

    var rowCount = table.get('row_count');
    if (rowCount >= 0) {
      d.rowCount = ( rowCount < 10000 ? Utils.formatNumber(rowCount) : Utils.readizableNumber(rowCount) );
      d.pluralizedRows = pluralizeString('Row', rowCount);
    }

    var datasetSize = table.get('size');
    if (datasetSize >= 0) {
      d.datasetSize = Utils.readablizeBytes(datasetSize, true);
    }

    if (!_.isEmpty(vis.get("synchronization"))) {
      d.syncRanAt = moment(vis.get("synchronization").ran_at || new Date()).fromNow();
      d.syncStatus = vis.get("synchronization").state;
    }

    this.$el.html(this.template(d));

    this._renderLikesIndicator();
    this._renderTooltips();

    // Item selected?
    this.$el[ vis.get('selected') ? 'addClass' : 'removeClass' ]('is--selected');

    return this;
  },

  _renderLikesIndicator: function() {
    var view = new LikesView({
      model: this.model.like
    });
    this.$('.js-likes-indicator').replaceWith(view.render().el);
    this.addView(view);
  },

  _renderTooltips: function() {
    if (!_.isEmpty(this.model.get("synchronization"))) {
      this.addView(
        new cdb.common.TipsyTooltip({
          el: this.$('.DatasetsList-itemStatus'),
          title: function(e) {
            return $(this).attr('data-title')
          }
        })
      )
    }
  },

  _onTagClick: function(ev) {
    var tag = $(ev.target).val();

    if (tag) {
      this.routerModel.set('tag', tag);
    }
  },

  _toggleSelected: function(ev) {
    // Let links use default behaviour
    if (ev.target.tagName !== 'A') {
      this.killEvent(ev);
      if (this.options.createModel.canSelect(this.model)) {
        this.model.set('selected', !this.model.get('selected'));
      }
    }
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../../../view_helpers/pluralize_string":211,"../../../../views/likes/view":216}],63:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var PaginationModel = require('../../../../views/pagination/model');
var PaginationView = require('../../../../views/pagination/view');


/**
 * Responsible for the datasets paginator
 *  ___________________________________________________________________________
 * |                                                                           |
 * |                                             Page 2 of 42 [1] 2 [3][4][5]  |
 * |___________________________________________________________________________|
 *
 */

module.exports = cdb.core.View.extend({

  className: 'DatasetsPaginator',

  initialize: function() {
    this.routerModel = this.options.routerModel;
    this.collection = this.options.collection;
    this.model = new PaginationModel({
      current_page: this.routerModel.get('page')
    });

    this._initBinds();
    this._initViews();
  },

  render: function() {
    this.clearSubViews();
    this.$el.append(this.paginationView.render().el);
    return this;
  },

  _initBinds: function() {
    this.model.bind('change', this.render, this);
    this.model.bind('change:current_page', function() {
      this.routerModel.set('page', this.model.get('current_page'));
    }, this);
    this.collection.bind('reset', this._updatePaginationModelByCollection, this);
    this.routerModel.bind('change:page', this._updatePaginationModelByRouterModel, this);

    this.add_related_model(this.routerModel);
    this.add_related_model(this.collection);
    this.add_related_model(this.model);
  },

  _initViews: function() {
    this.paginationView = new PaginationView({
      model: this.model
    });
    this.addView(this.paginationView);
  },

  _updatePaginationModelByCollection: function() {
    this.model.set({
      per_page:    this.collection.options.get('per_page'),
      total_count: this.collection.total_entries
    });
  },

  _updatePaginationModelByRouterModel: function() {
    this.model.set('current_page', this.routerModel.get('page'));
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../../../views/pagination/model":219,"../../../../views/pagination/view":220}],64:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);
var DatasetItem = require('./dataset_item_view');
var Utils = (typeof window !== "undefined" ? window['cdb']['Utils'] : typeof global !== "undefined" ? global['cdb']['Utils'] : null);
var UploadConfig = require('../../../../background_polling/models/upload_config');
var pluralizeString = require('../../../../view_helpers/pluralize_string');

/**
 *  Remote dataset item view
 *
 */

module.exports = DatasetItem.extend({

  tagName: 'li',
  className: 'DatasetsList-item',

  events: {
    'click .js-tag-link': '_onTagClick',
    'click': '_toggleSelected'
  },

  initialize: function() {
    this.elder('initialize');
    this.template = cdb.templates.getTemplate('common/views/create/listing/remote_dataset_item');
    this.table = new cdb.admin.CartoDBTableMetadata(this.model.get('external_source'));
  },

  render: function() {
    var vis = this.model;
    var table = this.table;
    var tags = vis.get('tags') || [];
    var description = vis.get('description') && Utils.stripHTML(markdown.toHTML(vis.get('description'))) || '';
    var source = vis.get('source') && markdown.toHTML(vis.get('source')) || '';

    var d = {
      isRaster:                vis.get('kind') === 'raster',
      geometryType:            table.geomColumnTypes().length > 0 ? table.geomColumnTypes()[0] : '',
      title:                   vis.get('display_name') || vis.get('name'),
      source:                  source,
      description:             description,
      timeDiff:                moment(vis.get('updated_at')).fromNow(),
      tags:                    tags,
      tagsCount:               tags.length,
      routerModel:             this.routerModel,
      maxTagsToShow:           3,
      canImportDataset:        this._canImportDataset(),
      rowCount:                undefined,
      datasetSize:             undefined
    };

    var rowCount = table.get('row_count');
    if (rowCount >= 0) {
      d.rowCount = ( rowCount < 10000 ? Utils.formatNumber(rowCount) : Utils.readizableNumber(rowCount) );
      d.pluralizedRows = pluralizeString('Row', rowCount);
    }

    var datasetSize = table.get('size');
    if (datasetSize >= 0) {
      d.datasetSize = Utils.readablizeBytes(
        datasetSize,
        datasetSize.toString().length > 9 ? false : true
      );
    }

    this.$el.html(this.template(d));
    this._setItemClasses();
    this._renderTooltips();

    return this;
  },

  _setItemClasses: function() {
    // Item selected?
    this.$el[ this.model.get('selected') ? 'addClass' : 'removeClass' ]('is--selected');
    // Check if it is selectable
    this.$el[ this._canImportDataset() ? 'addClass' : 'removeClass' ]('DatasetsList-item--selectable');
    // Check if it is importable
    this.$el[ this._canImportDataset() ? 'removeClass' : 'addClass' ]('DatasetsList-item--banned');
  },

  _renderTooltips: function() {
    this.addView(
      new cdb.common.TipsyTooltip({
        el: this.$('.DatasetsList-itemStatus'),
        title: function(e) {
          return $(this).attr('data-title')
        }
      })
    )
  },

  _onTagClick: function(ev) {
    if (ev) {
      this.killEvent(ev);
    }

    var tag = $(ev.target).val();

    if (tag) {
      this.routerModel.set({
        tag: tag,
        library: true
      });
    }
  },

  _canImportDataset: function() {
    var table_size = this.table.get('size') || 0;
    return (
        this.user.get('remaining_byte_quota') * UploadConfig.fileTimesBigger >= table_size &&
        this.user.get('limits')['import_file_size'] > table_size
      );
  },

  _toggleSelected: function(ev) {
    // Let links use default behaviour
    if (ev.target.tagName !== 'A') {
      this.killEvent(ev);
      if (this._canImportDataset() && this.options.createModel.canSelect(this.model)) {
        this.model.set('selected', !this.model.get('selected'));
      }
    }
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../../../background_polling/models/upload_config":14,"../../../../view_helpers/pluralize_string":211,"./dataset_item_view":62}],65:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var DatasetsItem = require('./datasets/dataset_item_view');
var RemoteDatasetsItem = require('./datasets/remote_dataset_item_view');

/**
 * View representing the list of items
 */
module.exports = cdb.core.View.extend({

  tagName: 'ul',

  className: 'DatasetsList',

  events: {},

  _ITEMS: {
    'remotes':  RemoteDatasetsItem,
    'datasets': DatasetsItem
  },

  initialize: function() {
    this.user = this.options.user;
    this.createModel = this.options.createModel;
    this.collection.bind('reset', this.render, this);
    this.add_related_model(this.collection);
  },

  render: function() {
    this.clearSubViews();
    this.collection.each(this._addItem, this);
    return this;
  },

  _addItem: function(m, i) {
    var type = m.get('type') === "remote" ? 'remotes' : 'datasets';

    var item = new this._ITEMS[type]({
      model:       m,
      createModel: this.createModel,
      user:        this.user
    });

    this.addView(item);
    this.$el.append(item.render().el);
  },

  show: function() {
    this.$el.removeClass('is-hidden');
  },

  hide: function() {
    this.$el.addClass('is-hidden');
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./datasets/dataset_item_view":62,"./datasets/remote_dataset_item_view":64}],66:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var DatasetsList = require('./datasets_list_view');
var ContentResult = require('./datasets/content_result_view');
var DatasetsPaginator = require('./datasets/datasets_paginator_view');

/**
 *  Datasets list view
 *
 *  Show datasets view to select them for
 *  creating a map or importing a dataset
 *
 */

module.exports = cdb.core.View.extend({

  initialize: function() {
    this.user = this.options.user;
    this.createModel = this.options.createModel;
    this.routerModel = this.options.routerModel;

    this._initViews();
    this._initBindings();
  },

  _initBindings: function() {
    this.routerModel.bind('change', this._onRouterChange, this);
    this.collection.bind('loading', this._onDataLoading, this);
    this.collection.bind('reset', this._onDataFetched, this);
    this.collection.bind('error', function(e) {
      // Old requests can be stopped, so aborted requests are not
      // considered as an error
      if (!e || (e && e.statusText !== "abort")) {
        this._onDataError()
      }
    }, this);
    this.add_related_model(this.routerModel);
    this.add_related_model(this.createModel);
    this.add_related_model(this.collection);
  },

  _initViews: function() {
    this.controlledViews = {};  // All available views
    this.enabledViews = [];     // Visible views

    var noDatasetsView = new ContentResult({
      className:  'ContentResult no-datasets',
      user: this.user,
      defaultUrl: this.options.defaultUrl,
      routerModel: this.routerModel,
      collection: this.collection,
      template: 'common/views/create/listing/content_no_datasets'
    });
    noDatasetsView.bind('connectDataset', function() {
      if (this.user.canCreateDatasets()) {
        this.createModel.set('listing', 'import');
      }
    }, this);
    noDatasetsView.render().hide();
    this.controlledViews.no_datasets = noDatasetsView;
    this.$el.append(noDatasetsView.el);
    this.addView(noDatasetsView);

    var listView = new DatasetsList({
      user:         this.user,
      createModel:  this.createModel,
      routerModel:  this.routerModel,
      collection:   this.collection
    });
    this.controlledViews.list = listView;
    this.$el.append(listView.render().el);
    this.addView(listView);

    var noResultsView = new ContentResult({
      defaultUrl: this.options.defaultUrl,
      routerModel: this.routerModel,
      collection: this.collection,
      template: 'common/views/create/listing/datasets_no_result'
    });
    noResultsView.render().hide();
    this.controlledViews.no_results = noResultsView;
    this.$el.append(noResultsView.el);
    this.addView(noResultsView);

    var errorView = new ContentResult({
      defaultUrl: this.options.defaultUrl,
      routerModel: this.routerModel,
      collection: this.collection,
      template: 'common/views/create/listing/datasets_error'
    });
    errorView.render().hide();
    this.controlledViews.error = errorView;
    this.$el.append(errorView.el);
    this.addView(errorView);

    var mainLoaderView = new ContentResult({
      defaultUrl: this.options.defaultUrl,
      routerModel: this.routerModel,
      collection: this.collection,
      template: 'common/views/create/listing/datasets_loader'
    });

    this.controlledViews.main_loader = mainLoaderView;
    this.$el.append(mainLoaderView.render().el);
    this.addView(mainLoaderView);

    var datasetsPaginator = new DatasetsPaginator({
      routerModel: this.routerModel,
      collection: this.collection
    });

    this.controlledViews.content_footer = datasetsPaginator;
    this.$el.append(datasetsPaginator.render().el);
    this.addView(datasetsPaginator);
  },

  _onRouterChange: function() {
    this._hideBlocks();
    this._showBlocks([ 'main_loader' ]);
  },

  /**
   * Arguments may vary, depending on if it's the collection or a model that triggers the event callback.
   * @private
   */
  _onDataFetched: function() {
    var activeViews = [ 'content_footer' ];
    var tag = this.routerModel.get('tag');
    var q = this.routerModel.get('q');
    var shared = this.routerModel.get('shared');
    var locked = this.routerModel.get('locked');
    var library = this.routerModel.get('library');

    if (library && this.collection.total_user_entries === 0) {
      activeViews.push('no_datasets');
    }

    if (this.collection.size() === 0) {
      if (!tag && !q && shared === "no" && !locked) {
        if (!library) {
          this._goToLibrary();
          return;
        } else {
          activeViews.push('no_results');
        }
      } else {
        activeViews.push('no_results');
      }
    } else {
      activeViews.push('list');
    }

    this._hideBlocks();
    this._showBlocks(activeViews);
  },

  _onDataLoading: function() {
    this._hideBlocks();
    this._showBlocks([ 'main_loader' ]);
  },

  _onDataError: function(e) {
    this._hideBlocks();
    this._showBlocks([ 'error' ]);
  },

  _showBlocks: function(views) {
    var self = this;
    if (views) {
      _.each(views, function(v){
        if (self.controlledViews[v]) {
          self.controlledViews[v].show();
          self.enabledViews.push(v);
        }
      })
    } else {
      self.enabledViews = [];
      _.each(this.controlledViews, function(v){
        v.show();
        self.enabledViews.push(v);
      })
    }
  },

  _goToLibrary: function() {
    this.routerModel.set({
      shared: 'no',
      library: true,
      page: 1
    });
  },

  _hideBlocks: function(views) {
    var self = this;
    if (views) {
      _.each(views, function(v){
        if (self.controlledViews[v]) {
          self.controlledViews[v].hide();
          self.enabledViews = _.without(self.enabledViews, v);
        }
      })
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
    return false
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./datasets/content_result_view":61,"./datasets/datasets_paginator_view":63,"./datasets_list_view":65}],67:[function(require,module,exports){
var ImportService = require('./imports/service_import/import_service_view');
var ImportTwitter = require('./imports/twitter_import/import_twitter_view');
var ImportDataView = require('./imports/import_data_view');
var ImportArcGISView = require('./imports/import_arcgis_view');

/**
 * Attributes:
 *
 *  className: import pane class view
 *  enabled: function that takes cdb.config and returns whether the service is enabled
 *  fallbackClassName: ...
 *  name: local name
 *  title: text for tab link
 *  options:
 *    - service:
 *    - fileExtensions:
 *    - showAvailableFormats:
 *    - acceptSync:
 *    - fileAttrs:
 *
 */

module.exports = {
  File: {
    className: ImportDataView,
    enabled: function (config, userData) { return true; },
    name: 'file',
    title: 'Data file',
    options: {
      type: 'url',
      fileEnabled: true,
      acceptSync: true
    }
  },
  GDrive:   {
    className: ImportService,
    enabled: function (config, userData) { return !!config.get('oauth_gdrive'); },
    name: 'gdrive',
    title: 'Google Drive',
    options: {
      service: 'gdrive',
      fileExtensions: ['Google SpreadSheet', 'CSV'],
      showAvailableFormats: false,
      acceptSync: true,
      fileAttrs: {
        ext: true,
        title: 'filename',
        description: {
          content: [{
            name: 'size',
            format: 'size',
            key: true
          }]
        }
      }
    }
  },
  Dropbox: {
    className: ImportService,
    enabled: function (config, userData) { return !!config.get('oauth_dropbox'); },
    name: 'dropbox',
    title: 'Dropbox',
    options: {
      service: 'dropbox',
      fileExtensions: ['CSV', 'XLS'],
      showAvailableFormats: false,
      acceptSync: true,
      fileAttrs: {
        ext: true,
        title: 'filename',
        description: {
          content: [
            {
              name: 'id',
              format: ''
            },
            {
              name: 'size',
              format: 'size',
              key: true
            }
          ],
          separator: '-'
        }
      }
    }
  },
  Box: {
    className: ImportService,
    enabled: function (config, userData) { return !!config.get('oauth_box'); },
    name: 'box',
    title: 'Box',
    fallback: 'common/views/create/listing/import_box_fallback',
    options: {
      service: 'box',
      fileExtensions: ['CSV', 'XLS'],
      showAvailableFormats: false,
      acceptSync: true,
      fileAttrs: {
        ext: true,
        title: 'filename',
        description: {
          content: [
            {
              name: 'size',
              format: 'size',
              key: true
            }
          ],
          separator: '-'
        }
      }
    }
  },
  Twitter: {
    className: ImportTwitter,
    enabled: function (config, userData) { return userData.twitter.enabled && !!config.get('datasource_search_twitter'); },
    fallback: 'common/views/create/listing/import_twitter_fallback',
    name: 'twitter',
    title: 'Twitter'
  },
  Mailchimp: {
    className: ImportService,
    enabled: function (config, userData) { return userData.mailchimp.enabled && !!config.get('oauth_mailchimp'); },
    fallback: 'common/views/create/listing/import_mailchimp_fallback',
    name: 'mailchimp',
    title: 'MailChimp',
    options: {
      service: 'mailchimp',
      fileExtensions: [],
      acceptSync: true,
      showAvailableFormats: false,
      headerTemplate: 'common/views/create/listing/import_types/data_header_mailchimp',
      fileAttrs: {
        ext: true,
        title: 'filename',
        description: {
          content: [{
            name: 'member_count',
            format: 'number',
            key: true
          }],
          itemName: 'member',
          separator: ''
        }
      }
    }
  },
  // Instagram: {
  //   className: ImportService,
  //   fallback: 'common/views/create/listing/import_instagram_fallback',
  //   name: 'instagram',
  //   title: 'Instagram',
  //   options: {
  //     service: 'instagram',
  //     fileExtensions: [],
  //     acceptSync: false,
  //     showAvailableFormats: false,
  //     fileAttrs: {
  //       ext: false,
  //       title: 'title'
  //     }
  //   }
  // },
  Arcgis: {
    className: ImportArcGISView,
    enabled: function (config, userData) { return config.get('arcgis_enabled'); },
    fallback: 'common/views/create/listing/import_arcgis_fallback',
    name: 'arcgis',
    title: 'ArcGIS Server&trade;'
  },
  Salesforce: {
    className: ImportDataView,
    enabled: function (config, userData) { return config.get('salesforce_enabled'); },
    fallback: 'common/views/create/listing/import_salesforce_fallback',
    name: 'salesforce',
    title: 'Salesforce',
    options: {
      type: 'service',
      service_name: 'salesforce',
      acceptSync: true,
      formTemplate: 'common/views/create/listing/import_types/data_form_salesforce',
      headerTemplate: 'common/views/create/listing/import_types/data_header_salesforce'
    }
  }
};

},{"./imports/import_arcgis_view":71,"./imports/import_data_view":72,"./imports/service_import/import_service_view":76,"./imports/twitter_import/import_twitter_view":86}],68:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
cdb.admin = (typeof window !== "undefined" ? window['cdb']['admin'] : typeof global !== "undefined" ? global['cdb']['admin'] : null);

/**
 *  Form view for url import for example
 *
 *  - It accepts an url
 *  - It checks if it is valid
 *  - It could have a file option
 *
 */

module.exports = cdb.core.View.extend({

  options: {
    template: '',
    fileEnabled: false
  },

  events: {
    'keyup .js-textInput': '_onTextChanged',
    'submit .js-form': '_onSubmitForm'
  },

  initialize: function() {
    this.user = this.options.user;
    this.template = cdb.templates.getTemplate(this.options.template || 'common/views/create/listing/import_types/data_form');
    this._initBinds();
    this._checkVisibility();
  },

  render: function() {
    this.$el.html(
      this.template(this.options)
    )
    this._initViews();
    return this;
  },

  _initBinds: function() {
    this.model.bind('change:state', this._checkVisibility, this);
  },

  _initViews: function() {
    if (this.options.fileEnabled) {
      var self = this;
      this.$('.js-fileInput').bind('change', function(e) {
        if (this.files && this.files.length > 0) {
          self._onFileChanged(this.files);
        }
        this.value = "";
      });

      this._initDropzone();
    }
  },

  _initDropzone: function() {
    var el = $('html')[0]; // :(
    var self = this;

    this.dragster = new Dragster(el);

    $(el).bind("dragster:enter", function (e) {
      self._showDropzone();
    });

    $(el).bind("dragster:leave", function (e) {
      self._hideDropzone();
    });

    if (el.dropzone) { // avoid loading the dropzone twice
      return;
    }

    this.dropzone = new Dropzone(el, {
      url: ':)',
      autoProcessQueue: false,
      previewsContainer: false
    });

    this.dropzone.on('dragover', function() {
      self._showDropzone();
    });

    this.dropzone.on("drop", function (ev) {
      var files = ev.dataTransfer.files;
      self._onFileChanged(files);
      self._hideDropzone();
    });
  },

  _destroyDropzone: function() {
    var el = $('html')[0]; // :(

    if (this.dragster) {
      this.dragster.removeListeners();
      this.dragster.reset();
      $(el).unbind('dragster:enter dragster:leave');
    }

    if (this.dropzone) {
      this.dropzone.destroy();
    }
  },

  _setValidFileExtensions: function(list) {
    return RegExp("(\.|\/)(" + list.join('|') + ")$", "i");
  },

  _onTextChanged: function() {
    var value = this.$('.js-textInput').val();
    if (!value) {
      this._hideTextError();
    }
  },

  _onFileChanged: function(files) {
    this.trigger('fileSelected', this);

    if (files && files.length === 1) {
      files = files[0];
    }

    this.model.set({
      type: 'file',
      value: files
    });

    if (this.model.get('state') !== "error") {
      this._hideFileError();
      this.model.set('state', 'selected');
    } else {
      this._showFileError();
    }
  },

  _showTextError: function() {
    this.$('.Form-inputError').addClass('is-visible');
  },

  _hideTextError: function() {
    this.$('.Form-inputError').removeClass('is-visible');
  },

  _showDropzone: function() {
    this.$('.Form-upload').addClass('is-dropping');
    this._hideFileError();
  },

  _hideDropzone: function() {
    this.$('.Form-upload').removeClass('is-dropping');
  },

  _showFileError: function() {
    if (this.model.get('state') === "error") {
      this.$('.js-fileError')
        .text(this.model.get('get_error_text').what_about)
        .show();
      this.$('.js-fileLabel').hide();
      this.$('.js-fileButton').addClass('Button--negative');
    }
  },

  _hideFileError: function() {
    this.$('.js-fileError').hide();
    this.$('.js-fileLabel').show();
    this.$('.js-fileButton').removeClass('Button--negative');
  },

  _onSubmitForm: function(e) {
    if (e) this.killEvent(e);

    // URL submit
    var value = this.$('.js-textInput').val();

    if (!value) {
      this._hideTextError();
      return;
    }

    // Change file attributes :S
    this.trigger('urlSelected', this);

    // Change model
    var importType = this.model.get('service_name') ? 'service' : 'url';
    this.model.set({
      type: importType,
      value: value,
      service_item_id: value,
      state: 'idle'
    });

    if (this.model.get('state') !== "error") {
      // Remove errors
      this._hideFileError();
      this._hideTextError();
      this.model.set('state', 'selected');
    } else {
      this._showTextError();
    }
  },

  _checkVisibility: function() {
    var state = this.model.get('state');
    this[ state !== "selected" ? 'show' : 'hide' ]()
  },

  clean: function() {
    this._destroyDropzone();
    this.$('.js-fileInput').unbind('change');
    this.elder('clean');
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],69:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);

/**
 *  Data header view
 *
 *  - It will change when upload state changes
 *  - Possibility to change state with a header button
 *
 */

module.exports = cdb.core.View.extend({

  events: {
    'click .js-back': '_goToStart'
  },

  options: {
    fileEnabled: false,
    acceptSync: false
  },

  initialize: function() {
    this.user = this.options.user;
    this.template = cdb.templates.getTemplate(this.options.template || 'common/views/create/listing/import_types/data_header');
    this._initBinds();
    this._checkVisibility();
  },

  render: function() {
    var acceptSync = this.options.acceptSync && this.user.get('actions') && this.user.get('actions').sync_tables && this.model.get('type') !== "file"; 
    
    this.$el.html(
      this.template({
        type: this.model.get('type'),
        fileEnabled: this.options.fileEnabled,
        acceptSync: acceptSync,
        state: this.model.get('state')
      })
    );
    this._checkVisibility();
    return this;
  },

  _initBinds: function() {
    this.model.bind('change:state', this.render, this);
  },

  _checkVisibility: function() {
    this.show()
  },

  _goToStart: function() {
    this.model.set('state', 'idle');
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],70:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
cdb.admin = (typeof window !== "undefined" ? window['cdb']['admin'] : typeof global !== "undefined" ? global['cdb']['admin'] : null);
var Utils = (typeof window !== "undefined" ? window['cdb']['Utils'] : typeof global !== "undefined" ? global['cdb']['Utils'] : null);
var SelectedDataset = require('./import_selected_dataset_view');

/**
 *  Selected ArcGIS dataset
 *
 *  - Displays the result when an ArcGIS url/dataset is selected, no matter the type.
 *  - It will show available sync options if user can and the url is an ArcGIS layer.
 *  - Upgrade link for people who don't have sync permissions.
 *
 */

module.exports = SelectedDataset.extend({

  render: function() {
    var title = this.options.fileAttrs.title && this.model.get('value')[this.options.fileAttrs.title] || this.model.get('value');
    var description = this._genDescription();
    var ext = this.options.fileAttrs.ext ? Utils.getFileExtension(title) : '' ;

    if (this.options.fileAttrs.ext) {
      title = title && title.replace('.' + ext, '');
    }

    var upgradeUrl = window.upgrade_url;
    var userCanSync = this.user.get('actions') && this.user.get('actions').sync_tables;
    var customInstall = cdb.config.get('cartodb_com_hosted');

    this.$el.html(
      this.template({
        title: title,
        description: description,
        ext: ext,
        interval: this.model.get('interval'),
        importCanSync: this.options.acceptSync && this._isArcGISLayer(title),
        userCanSync: userCanSync,
        showTrial: this.user.canStartTrial(),
        showUpgrade: !userCanSync && !customInstall && upgradeUrl && !this.user.isInsideOrg(),
        upgradeUrl: upgradeUrl
      })
    );
    return this;
  },

  _isArcGISLayer: function(url) {
    return url.search(/([0-9]+\/|[0-9]+)/) !== -1
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./import_selected_dataset_view":75}],71:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
cdb.admin = (typeof window !== "undefined" ? window['cdb']['admin'] : typeof global !== "undefined" ? global['cdb']['admin'] : null);
var FormView = require('./data_import/data_form_view');
var HeaderView = require('./data_import/data_header_view');
var SelectedDataset = require('./import_arcgis_selected_dataset_view');
var ImportDataView = require('./import_data_view');

/**
 *  Import ArcGIS panel
 *
 *  - It only accepts an url, and it could be a map or a layer.
 *
 */

module.exports = ImportDataView.extend({

  options: {
    fileExtensions: [],
    type: 'service',
    service: 'arcgis',
    acceptSync: true,
    fileEnabled: false,
    fileAttrs: {
      ext: false,
      title: '',
      description: ''
    }
  },

  _initViews: function() {
    // Data header
    var headerView = new HeaderView({
      el: this.$('.ImportPanel-header'),
      model: this.model,
      user: this.user,
      collection: this.collection,
      fileEnabled: this.options.fileEnabled,
      acceptSync: this.options.acceptSync,
      template: 'common/views/create/listing/import_types/data_header_arcgis'
    });
    headerView.render();
    this.addView(headerView);

    // Dataset selected
    var selected = new SelectedDataset({
      el: this.$('.DatasetSelected'),
      user: this.user,
      model: this.model,
      acceptSync: this.options.acceptSync,
      fileAttrs: this.options.fileAttrs
    });
    selected.render();
    this.addView(selected);

    // Data Form
    var formView = new FormView({
      el: this.$('.ImportPanel-form'),
      user: this.user,
      model: this.model,
      template: 'common/views/create/listing/import_types/data_form_arcgis',
      fileEnabled: this.options.fileEnabled
    });

    formView.render();
    this.addView(formView);

  }

})

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./data_import/data_form_view":68,"./data_import/data_header_view":69,"./import_arcgis_selected_dataset_view":70,"./import_data_view":72}],72:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
cdb.admin = (typeof window !== "undefined" ? window['cdb']['admin'] : typeof global !== "undefined" ? global['cdb']['admin'] : null);
var ImportDefaultView = require('./import_default_view');
var UploadModel = require('../../../../background_polling/models/upload_model');
var FormView = require('./data_import/data_form_view');
var HeaderView = require('./data_import/data_header_view');
var SelectedDataset = require('./import_selected_dataset_view');

/**
 *  Import data panel
 *
 *  - It accepts an url
 *  - It checks if it is valid
 *
 */

module.exports = ImportDefaultView.extend({

  options: {
    fileExtensions: [],
    type: 'url',
    service: '',
    acceptSync: false,
    fileEnabled: false,
    formTemplate: '',
    headerTemplate: '',
    fileAttrs: {}
  },

  className: 'ImportPanel ImportDataPanel',

  initialize: function() {
    this.user = this.options.user;
    this.model = new UploadModel({
      type: this.options.type,
      service_name: this.options.service
    }, {
      user: this.user
    });

    this.template = cdb.templates.getTemplate('common/views/create/listing/import_types/import_data');

    this._initBinds();
  },

  render: function() {
    this.clearSubViews();
    this.$el.html(this.template());
    this._initViews();
    return this;
  },

  _initViews: function() {
    // Data header
    var headerView = new HeaderView({
      el: this.$('.ImportPanel-header'),
      model: this.model,
      user: this.user,
      fileEnabled: this.options.fileEnabled,
      acceptSync: this.options.acceptSync,
      template: this.options.headerTemplate
    });
    headerView.render();
    this.addView(headerView);

    // Dataset selected
    var selected = new SelectedDataset({
      el: this.$('.DatasetSelected'),
      user: this.user,
      model: this.model,
      acceptSync: this.options.acceptSync,
      fileAttrs: this.options.fileAttrs
    });
    selected.render();
    this.addView(selected);

    // Data Form
    var formView = new FormView({
      el: this.$('.ImportPanel-form'),
      user: this.user,
      model: this.model,
      template: this.options.formTemplate,
      fileEnabled: this.options.fileEnabled
    });

    formView.bind('fileSelected', function() {
      selected.setOptions({
        acceptSync: false,
        fileAttrs: {
          ext: true,
          title: 'name',
          description: {
            content: [{
              name: 'size',
              format: 'size'
            }]
          }
        }
      });
    });

    formView.bind('urlSelected', function() {
      selected.setOptions({
        acceptSync: true,
        fileAttrs: {
          ext: false,
          title: '',
          description: ''
        }
      });
    });
    formView.render();
    this.addView(formView);

  },

  _initBinds: function() {
    this.model.bind('change:state', this._checkState, this);
    this.model.bind('change', this._triggerChange, this);
  },

  _checkState: function() {
    if (this.model.previous('state') === "selected") {
      this.model.set({
        type: undefined,
        value: '',
        service_name: '',
        service_item_id: '',
        interval: 0
      });
    }
  }

})

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../../../background_polling/models/upload_model":15,"./data_import/data_form_view":68,"./data_import/data_header_view":69,"./import_default_view":74,"./import_selected_dataset_view":75}],73:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);

/**
 *  Import fallback default panel
 *
 */

module.exports = cdb.core.View.extend({

  className: 'ImportPanel',

  initialize: function() { 
    this.template = cdb.templates.getTemplate( this.options.template || 'common/views/create/listing/import_default_fallback' );
  },

  render: function() {
    this.$el.append(this.template());
  }

})
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],74:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var UploadModel = require('../../../../background_polling/models/upload_model');

/**
 *  Default view for an import item
 *
 *  - It is based in an upload model.
 *  - Will trigger a change when model changes.
 *  - It returns their data if it is requested with a method.
 */


module.exports = cdb.core.View.extend({

  initialize: function() {
    this.user = this.options.user;
    this.model = new UploadModel(null, { user: this.user });
    this._initBinds();
  },

  _initBinds: function() {
    this.model.bind('change', this._triggerChange, this);
  },

  _triggerChange: function() {
    this.trigger('change', this.model.toJSON(), this);
  },

  getModelData: function() {
    if (this.model) {
      return this.model.toJSON()
    }
    return {}
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../../../background_polling/models/upload_model":15}],75:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
cdb.admin = (typeof window !== "undefined" ? window['cdb']['admin'] : typeof global !== "undefined" ? global['cdb']['admin'] : null);
var Utils = (typeof window !== "undefined" ? window['cdb']['Utils'] : typeof global !== "undefined" ? global['cdb']['Utils'] : null);
var pluralizeString = require('../../../../view_helpers/pluralize_string');

/**
 *  Selected dataset
 *
 *  - Displays the result when a dataset is selected, no matter the type.
 *  - It will show available sync options if that import lets it.
 *  - Upgrade link for people who don't have sync permissions.
 *
 */

module.exports = cdb.core.View.extend({

  className: 'DatasetSelected',

  _FORMATTERS: {
    'size': Utils.readablizeBytes,
    'number': Utils.formatNumber
  },

  options: {
    acceptSync: false,
    fileAttrs: {
      ext: false,
      title: '',
      description: {
        content: [{
          name: 'id',
          format: ''
        }],
        itemName: '',
        separator: ''
      }
    }
  },

  events: {
    'click .js-interval-0': '_onIntervalZero',
    'click .js-interval-1': '_onIntervalHour',
    'click .js-interval-2': '_onIntervalDay',
    'click .js-interval-3': '_onIntervalWeek',
    'click .js-interval-4': '_onIntervalMonth'
  },

  initialize: function() {
    this.user = this.options.user;
    this.template = cdb.templates.getTemplate('common/views/create/listing/import_selected_dataset');
    this._initBinds();
    this._checkVisibility();
  },

  render: function() {
    var title = this.options.fileAttrs.title && this.model.get('value')[this.options.fileAttrs.title] || this.model.get('value');
    var description = this._genDescription();
    var ext = this.options.fileAttrs.ext ? Utils.getFileExtension(title) : '' ;

    if (this.options.fileAttrs.ext) {
      title = title && title.replace('.' + ext, '');
    }

    var upgradeUrl = window.upgrade_url;
    var userCanSync = this.user.get('actions') && this.user.get('actions').sync_tables;
    var customInstall = cdb.config.get('cartodb_com_hosted');

    this.$el.html(
      this.template({
        title: title,
        description: description,
        ext: ext,
        interval: this.model.get('interval'),
        importCanSync: this.options.acceptSync,
        userCanSync: userCanSync,
        showTrial: this.user.canStartTrial(),
        showUpgrade: !userCanSync && !customInstall && upgradeUrl && !this.user.isInsideOrg(),
        upgradeUrl: upgradeUrl
      })
    );
    return this;
  },

  _initBinds: function() {
    this.model.bind('change:value', this.render, this);
    this.model.bind('change:interval', this.render, this);
    this.model.bind('change:state', this._checkVisibility, this);
  },

  _genDescription: function() {
    if (this.options.fileAttrs && this.options.fileAttrs.description) {
      var descriptionOpts = this.options.fileAttrs.description;
      var descriptionKeyValue = '';
      var descriptionStr = '';
      var self = this;

      if (descriptionOpts.content && descriptionOpts.content.length > 0) {
        _.each(descriptionOpts.content, function(item, i) {

          if (i > 0 && descriptionOpts.separator) {
            descriptionStr += " " + descriptionOpts.separator + ' ';
          }

          var value = self.model.get('value')[item.name];
          var format = item.format && self._FORMATTERS[item.format];
          descriptionStr += format && format(value) || value;

          if (item.key) {
            descriptionKeyValue = item.name;
          }
        })
      }

      if (descriptionOpts.itemName && descriptionKeyValue) {
        descriptionStr += ' ' + (descriptionOpts.itemName && pluralizeString(descriptionOpts.itemName, descriptionKeyValue) || '');
      }

      return descriptionStr;
    }

    return '';
  },

  _onIntervalZero: function() {
    this.model.set('interval', 0);
  },

  _onIntervalHour: function() {
    if (this.options.acceptSync && this.user.get('actions').sync_tables) {
      this.model.set('interval', 3600);
    }
  },

  _onIntervalDay: function() {
    if (this.options.acceptSync && this.user.get('actions').sync_tables) {
      this.model.set('interval', 86400);
    }
  },

  _onIntervalWeek: function() {
    if (this.options.acceptSync && this.user.get('actions').sync_tables) {
      this.model.set('interval', 604800);
    }
  },

  _onIntervalMonth: function() {
    if (this.options.acceptSync && this.user.get('actions').sync_tables) {
      this.model.set('interval', 2592000);
    }
  },

  // Change options
  setOptions: function(d) {
    if (d && !_.isEmpty(d)) {
      _.extend(this.options, d);
    }
  },

  _checkVisibility: function() {
    var state = this.model.get('state');
    if (state === 'selected') {
      this.show();
    } else {
      this.hide();
    }
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../../../view_helpers/pluralize_string":211}],76:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
cdb.admin = (typeof window !== "undefined" ? window['cdb']['admin'] : typeof global !== "undefined" ? global['cdb']['admin'] : null);
var ImportDefaultView = require('../import_default_view');
var UploadModel = require('../../../../../background_polling/models/upload_model');
var ServiceHeader = require('./service_header_view');
var ServiceLoader = require('./service_loader_view');
var ServiceList = require('./service_list_view');
var ServiceSelectedFile = require('../import_selected_dataset_view');
var ServiceToken = require('../../../../../service_models/service_token_model');
var ServiceOauth = require('../../../../../service_models/service_oauth_model');
var ServiceCollection = require('./service_items_collection');

/**
 *  Import service view
 *
 *  - Use a service import panel
 *  - It will request login to the service
 *  - If it works, a list of available files will appear.
 *  - Once a file is selected, sync options will appear.
 *
 */

module.exports = ImportDefaultView.extend({

  _DATASOURCE_NAME: '',
  _WINDOW_INTERVAL: 1000, // miliseconds

  className: 'ImportPanel ImportPanelService',

  options: {
    service: '',                  // Name of the service
    showAvailableFormats: false,  // If all available format link should appear or not
    fileExtensions: [],           // File extensions
    acceptSync: false,            // Accept sync this service?
    fileAttrs: {                  // Attributes or changes for service list or selected file:
      ext: false,                 // If files should show extension
      title: 'filename',          // Title attribute
      description: '<%- size %>', // Description attribute
      formatDescription: 'size',  // If any format function should be applied over the description
      headerTemplate: ''          // Header template
    }
  },

  initialize: function() {
    if (!this.options.service) {
      cdb.log.info('Service provider not set for import panel!')
      return false;
    } else {
      this._DATASOURCE_NAME = this.options.service;
    }

    this.user = this.options.user;
    this.model = new UploadModel({
      type: 'service',
      service_name: this._DATASOURCE_NAME
    }, { user: this.user });

    this.template = cdb.templates.getTemplate('common/views/create/listing/import_types/import_service');

    this._initModels();
    this._initBinds();
  },

  render: function() {
    this.clearSubViews();
    this.$el.html(this.template(this.options));
    this._initViews();
    return this;
  },

  _initModels: function() {
    // Token
    this.token = new ServiceToken(null, { datasource_name: this._DATASOURCE_NAME });
    // Service model
    this.service = new ServiceOauth(null, { datasource_name: this._DATASOURCE_NAME });
    // List collection
    this.collection = new ServiceCollection(null, { datasource_name: this._DATASOURCE_NAME });
  },

  _initBinds: function() {
    this.model.bind('change', this._triggerChange, this);
    this.model.bind('change:state', this._checkState, this);
    this.token.bind('change:oauth_valid', this._onOauthChange, this);
    this.service.bind('change:url', this._openWindow, this);
    this.add_related_model(this.service);
    this.add_related_model(this.token);
  },

  _initViews: function() {
    // Header
    var header = new ServiceHeader({
      el: this.$('.ImportPanel-header'),
      user: this.user,
      model: this.model,
      collection: this.collection,
      title: this.options.title,
      showAvailableFormats: this.options.showAvailableFormats,
      fileExtensions: this.options.fileExtensions,
      acceptSync: this.options.acceptSync,
      template: this.options.headerTemplate
    });
    header.render();
    this.addView(header);

    // Loader
    var loader = new ServiceLoader({
      el: this.$('.ServiceLoader'),
      model: this.model,
      token: this.token,
      service: this.service
    });
    loader.render();
    this.addView(loader);

    // List
    var list = new ServiceList({
      el: this.$('.ServiceList'),
      model: this.model,
      collection: this.collection,
      title: this.options.title,
      fileAttrs: this.options.fileAttrs
    });
    list.render();
    this.addView(list);

    // Selected file
    var selected = new ServiceSelectedFile({
      el: this.$('.ServiceSelected'),
      user: this.user,
      model: this.model,
      acceptSync: this.options.acceptSync,
      fileAttrs: this.options.fileAttrs
    });
    selected.render();
    this.addView(selected);
  },

  _onOauthChange: function() {
    if (this.token.get('oauth_valid')) {
      this._getFiles();
    }
  },

  _getFiles: function() {
    var self = this;

    this.model.set('state', 'retrieving');

    this.collection.fetch({
      // data: {
      //   filter: this.options.acceptFileTypes
      // },
      error: function() {
        self.model.set('state', 'error');
      },
      success:  function() {
        self.model.set('state', 'list');
      }
    });
  },

  _checkState: function() {
    if (this.model.get('state') === "list") {
      if (this.collection.size() === 1) {
        var item = this.collection.at(0);
        this.model.set({
          state: 'selected',
          value: item.toJSON(),
          service_item_id: item.get('id')
        });
      }
    }
    if (this.model.get('state') !== "selected") {
      this.model.set({
        value: '',
        service_item_id: '',
        interval: 0
      });
    }
  },

  _openWindow: function() {
    var url = this.service.get('url');
    var self = this;
    var i = window.open(url, null, "menubar=no,toolbar=no,width=600,height=495");
    var e = window.setInterval(function() {
      if (i && i.closed) {
        self._getFiles();
        clearInterval(e)
      } else if (!i) {
        self.model.set('state', 'error');
        clearInterval(e)
      }
    }, this._WINDOW_INTERVAL);
  }

})

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../../../../background_polling/models/upload_model":15,"../../../../../service_models/service_oauth_model":207,"../../../../../service_models/service_token_model":208,"../import_default_view":74,"../import_selected_dataset_view":75,"./service_header_view":77,"./service_items_collection":80,"./service_list_view":82,"./service_loader_view":83}],77:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);

/**
 *  Service header
 *
 *  - It will change when upload state changes
 *  - Possibility to change state with a header button
 *
 */

module.exports = cdb.core.View.extend({

  events: {
    'click .js-back': '_goToList'
  },

  options: {
    title: 'Service',
    showAvailableFormats: false,
    acceptSync: false,
    fileExtensions: [],
    template: ''
  },

  initialize: function() {
    this.user = this.options.user;
    this.template = cdb.templates.getTemplate( this.options.template || 'common/views/create/listing/import_types/service_header' );
    this._initBinds();
  },

  render: function() {
    this.$el.html(
      this.template({
        items: this.collection.size(),
        service_name: this.model.get("service_name"),
        showAvailableFormats: this.options.showAvailableFormats,
        fileExtensions: this.options.fileExtensions,
        acceptSync: this.options.acceptSync && this.user.get('actions').sync_tables,
        state: this.model.get('state'),
        title: this.options.title
      })
    );
    this._checkVisibility();
    return this;
  },

  _initBinds: function() {
    this.model.bind('change:state', this.render, this);
  },

  _checkVisibility: function() {
    var state = this.model.get('state');
    this[ state !== "list" ? 'show' : 'hide' ]()
  },

  _goToList: function() {
    this.model.set('state', 'list');
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],78:[function(require,module,exports){
(function (global){
var Utils = (typeof window !== "undefined" ? window['cdb']['Utils'] : typeof global !== "undefined" ? global['cdb']['Utils'] : null);

/**
 *  Service list item format utils
 *
 *  - Create customized functions for service list items.
 *
 */

module.exports = {

  // Due to the fact that backend data source service
  // returns 0 size when it doesn't know it
  formatSize: function(s) {
    if (s && s > 0) {
      return Utils.readablizeBytes(s);
    } else {
      return 'Unknown'
    }
  }

}
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],79:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);

/**
 *  Service item model
 *
 */

module.exports = cdb.core.Model.extend({
  
  defaults: {
    id: '',
    filename: '',
    checksum: '',
    service: '',
    size: '',
    title: ''
  }

});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],80:[function(require,module,exports){
(function (global){
var ServiceItem = require('./service_item_model.js');
var Backbone = (typeof window !== "undefined" ? window['Backbone'] : typeof global !== "undefined" ? global['Backbone'] : null);

/**
 *  Service item model + Service items collection
 *
 *  - It needs a datasource name or it won't work.
 *
 */

module.exports = Backbone.Collection.extend({

  _DATASOURCE_NAME: 'dropbox',

  model: ServiceItem,

  initialize: function(coll, opts) {
    if (opts.datasource_name) {
      this._DATASOURCE_NAME = opts.datasource_name;
    }
  },

  fetch: function() {
    this.trigger("fetch", this);

    // Pass through to original fetch.
    return Backbone.Collection.prototype.fetch.apply(this, arguments);
  },

  parse: function(r) {
    return r.files;
  },

  url: function(method) {
    var version = cdb.config.urlVersion('imports_service', method);
    return '/api/' + version + '/imports/service/' + this._DATASOURCE_NAME + '/list_files'
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./service_item_model.js":79}],81:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var Utils = (typeof window !== "undefined" ? window['cdb']['Utils'] : typeof global !== "undefined" ? global['cdb']['Utils'] : null);
var ServiceUtilsFormat = require('./service_item_description_format');
var pluralizeString = require('../../../../../view_helpers/pluralize_string');

/**
 *  Service list item view
 *
 *  - Displays the item info.
 *  - It lets user to select the item for a future import.
 *
 */

module.exports = cdb.core.View.extend({

  options: {
    title: '',
    fileAttrs: {
      ext: false,
      title: 'filename',
      description: 'size',
      itemName: 'file',
      formatDescription: ''
    }
  },

  _FORMATTERS: {
    'size': ServiceUtilsFormat.formatSize,
    'number': Utils.formatNumber
  },

  className: 'ServiceList-item',
  tagName: 'li',

  events: {
    'click .js-choose': '_onSelectItem'
  },

  initialize: function() {
    this.template = cdb.templates.getTemplate('common/views/create/listing/import_types/service_list_item');
  },

  render: function() {
    var title = this.model.get(this.options.fileAttrs.title);
    var description = this._genDescription();
    var ext = this.options.fileAttrs.ext ? Utils.getFileExtension(title) : '' ;

    if (this.options.fileAttrs.ext) {
      title = title && title.replace('.' + ext, '');
    }

    this.$el.html(
      this.template({
        name: this.options.title,
        ext: ext,
        title: title,
        description: description
      })
    );
    return this;
  },

  _genDescription: function() {
    if (this.options.fileAttrs && this.options.fileAttrs.description) {
      var descriptionOpts = this.options.fileAttrs.description;
      var descriptionKeyValue = '';
      var descriptionStr = '';
      var self = this;

      if (descriptionOpts.content && descriptionOpts.content.length > 0) {
        _.each(descriptionOpts.content, function(item, i) {

          if (i > 0 && descriptionOpts.separator) {
            descriptionStr += " " + descriptionOpts.separator + ' ';
          }

          var value = self.model.get(item.name);
          var format = item.format && self._FORMATTERS[item.format];
          descriptionStr += format && format(value) || value;

          if (item.key) {
            descriptionKeyValue = item.name;
          }
        })
      }

      if (descriptionOpts.itemName && descriptionKeyValue) {
        descriptionStr += ' ' + (descriptionOpts.itemName && pluralizeString(descriptionOpts.itemName, descriptionKeyValue) || '');
      }

      return descriptionStr;
    }

    return '';
  },

  _onSelectItem: function() {
    this.trigger('selected', this.model, this);
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../../../../view_helpers/pluralize_string":211,"./service_item_description_format":78}],82:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var ServiceListItem = require('./service_list_item_view');
var pluralizeString = require('../../../../../view_helpers/pluralize_string');

/**
 *  Service list view
 *
 *  - It will display all the items available under
 *  the service and the possibility to chose one of
 *  them.
 *
 */

module.exports = cdb.core.View.extend({

  _TEXTS: {
    item: _t('item')
  },

  options: {
    title: 'service',
    fileAttrs: {}
  },

  initialize: function() {
    this.template = cdb.templates.getTemplate('common/views/create/listing/import_types/service_list');
    this._initBinds();
    this._checkVisibility();
  },

  render: function() {
    this.clearSubViews();
    var size = this.collection.size();
    this.$el.html(
      this.template({
        size: size,
        title: this.options.title,
        pluralize: pluralizeString(this._TEXTS.item, size)
      })
    );
    if (this.collection.size() > 0) {
      this.collection.each(this._addItem, this);
    }
    return this;
  },

  _initBinds: function() {
    this.collection.bind('reset', this.render, this);
    this.model.bind('change:state', this._checkVisibility, this);
    this.add_related_model(this.collection);
  },

  _addItem: function(m) {
    var item = new ServiceListItem({
      model: m,
      title: this.options.title,
      fileAttrs: this.options.fileAttrs
    });
    item.bind('selected', this._onSelectedItem, this);
    this.$('.ServiceList-items').append(item.render().el);
    this.addView(item);
  },

  _onSelectedItem: function(mdl) {
    this.model.set({
      state: 'selected',
      value: mdl.toJSON(),
      service_item_id: mdl.get('id')
    });
  },

  _checkVisibility: function() {
    var state = this.model.get('state');
    if (state === 'list') {
      this.show();
    } else {
      this.hide();
    }
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../../../../view_helpers/pluralize_string":211,"./service_list_item_view":81}],83:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);

/**
 *  Service loader view
 *
 *  - It will be on charge to make token and oauth petitions
 *
 */

module.exports = cdb.core.View.extend({

  events: {
    'click .js-connect': '_checkToken'
  },

  initialize: function() {
    this.token = this.options.token;
    this.service = this.options.service;
    this.template = cdb.templates.getTemplate('common/views/create/listing/import_types/service_loader');
    this._initBinds();
    this._checkVisibility();
  },

  render: function() {
    this.$el.html(
      this.template({
        state: this.model.get('state')
      })
    );
    return this;
  },

  _initBinds: function() {
    this.model.bind('change:state', this.render, this);
    this.model.bind('change:state', this._checkVisibility, this);
  },

  _checkToken: function() {
    var self = this;
    this.model.set('state', 'token');

    var self = this;
    this.token.fetch({
      success: function(r) {
        if (!r.get('oauth_valid')) {
          self._getOauthURL();
        }
      },
      error: function(e) {
        self._getOauthURL();
      }
    });
  },

  _checkVisibility: function() {
    var state = this.model.get('state');
    if (state !== 'list' && state !== 'selected') {
      this.show();
    } else {
      this.hide();
    }
  },

  _getOauthURL: function() {
    var self = this;
    this.model.set('state', 'oauth');
    this.service.set({ url: '' }, { silent: true });
    this.service.fetch({
      error: function() {
        self.model.set('state', 'error');
      }
    });
  }

})
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],84:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
cdb.admin = (typeof window !== "undefined" ? window['cdb']['admin'] : typeof global !== "undefined" ? global['cdb']['admin'] : null);
var Utils = (typeof window !== "undefined" ? window['cdb']['Utils'] : typeof global !== "undefined" ? global['cdb']['Utils'] : null);

/**
 *  Credits info view
 *
 *  - Percentage of use
 *  - Possible money spent
 *
 */

module.exports = cdb.core.View.extend({

  initialize: function() {
    this.user = this.options.user;
    this._initBinds();
    this.template = cdb.templates.getTemplate('common/views/create/listing/import_types/credits_info');
  },

  render: function() {
    var twitterData = this.user.get('twitter');
    var remaining = twitterData.quota - twitterData.monthly_use;
    var per = Math.min(100,Math.ceil((this.model.get('value') * 100) / remaining));

    this.$el.html(
      this.template({
        value: this.model.get('value'),
        remaining: remaining,
        per: per,
        hardLimit: twitterData.hard_limit,
        remainingFormatted: Utils.formatNumber(remaining),
        quota: twitterData.quota,
        block_price: twitterData.block_price,
        block_size: Utils.readizableNumber(twitterData.block_size)
      })
    )
    return this;
  },

  _initBinds: function() {
    this.model.bind('change', this.render, this);
  }

});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],85:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
cdb.admin = (typeof window !== "undefined" ? window['cdb']['admin'] : typeof global !== "undefined" ? global['cdb']['admin'] : null);
var CreditsInfo = require('./credits_info_view');

/**
 *  Set max use of credits for Twitter
 *
 *  - Slider range = 1000 credits
 *  - Last step should be infinite if user doesn't
 *    have "soft_limit".
 *
 */

module.exports = cdb.core.View.extend({

  _DEFAULT_PER_VALUE: 80, // Default percentage value for slider
  _MIN_PER_VALUE: 1,      // Default min percentage value for slider

  initialize: function() {
    this.user = this.options.user;
    this.model = new cdb.core.Model();
    this._initBinds();
    this._setModel();
  },

  render: function() {
    this.clearSubViews();
    this.$(".js-slider").slider("destroy");
    this._initViews();
    return this;
  },

  _initBinds: function() {
    _.bindAll(this, '_onSlideChange');
    this.model.bind('change:value', this._onValueChange, this);
  },

  _setModel: function() {
    var twitterData = this.user.get('twitter');
    var max = twitterData.quota - twitterData.monthly_use;
    var min =  (this._MIN_PER_VALUE * max) / 100; // Just 1% of the quota
    var defaultValue = (max * this._DEFAULT_PER_VALUE) / 100;
    var value = max > 0 ? defaultValue : (max + 1);
    
    this.model.set({
      max: (twitterData.hard_limit ? max : max + 1 ),
      min: min,
      step: min,
      value: max > 0 ? value : twitterData.quota,
      disabled: max > 0 ? false : true
    });
  },

  _initViews: function() {
    // Slider
    this.$(".js-slider").slider(
      _.extend({
          range: 'min',
          orientation: "horizontal",
          slide: this._onSlideChange,
          change: this._onSlideChange
        },
        this.model.attributes
      )
    );

    // Info
    var creditsInfo = new CreditsInfo({
      el: this.$('.js-info'),
      user: this.user,
      model: this.model
    });
    creditsInfo.render();
    this.addView(creditsInfo);
  },

  _onSlideChange: function(ev, ui) {
    this.model.set('value', ui.value);
  },

  _onValueChange: function() {
    this.trigger('maxCreditsChange', this.getMaxCredits(), this);
  },

  getMaxCredits: function() {
    var twitterData = this.user.get('twitter');
    var max = twitterData.quota - twitterData.monthly_use;
    var value = this.model.get('value');
    return value > max ? 0 : value
  }

});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./credits_info_view":84}],86:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
cdb.admin = (typeof window !== "undefined" ? window['cdb']['admin'] : typeof global !== "undefined" ? global['cdb']['admin'] : null);
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var ImportDefaultView = require('../../../../../dialogs/create/listing/imports/import_default_view');
var UploadModel = require('../../../../../background_polling/models/upload_model');
var DatesRangePicker = require('../../../../../views/date_pickers/dates_range_picker');
var TwitterCategories = require('../../../../../dialogs/create/listing/imports/twitter_import/twitter_categories/twitter_categories_view');
var CreditsUsage = require('./credits_usage_view.js');

/**
 *  Import twitter panel
 *
 *  - It accepts up to 3 categories
 *  - Date range can't be longer than 30 days
 *
 */

module.exports = ImportDefaultView.extend({

  options: {
    acceptSync: false,
    type: 'service',
    service: 'twitter_search'
  },

  className: 'ImportPanel ImportTwitterPanel',

  initialize: function() {
    this.user = this.options.user;
    this.model = new UploadModel({
      type: this.options.type,
      service_name: this.options.service
    }, {
      user: this.user
    });

    this.template = cdb.templates.getTemplate('common/views/create/listing/import_types/import_twitter');

    this._initBinds();
  },

  render: function() {
    this.clearSubViews();
    this.$el.html(this.template());
    this._initViews();
    return this;
  },

  _initViews: function() {
    // Categories
    var categories = this.categories = new TwitterCategories();
    categories.bind('changeCategory', this._setModel, this);
    this.$('.ImportTwitterPanel-cagetories').append(categories.render().el);
    this.addView(categories);

    // Date picker
    var datepicker = this.datepicker = new DatesRangePicker({
      className: 'DatePicker DatePicker--withBorder'
    });
    datepicker.bind('changeDate', this._setModel, this);
    this.$('.js-picker').append(datepicker.render().el);
    this.addView(datepicker);

    // Use slider
    var creditsUsage = this.creditsUsage = new CreditsUsage({
      el: this.$('.CreditsUsage'),
      user: this.user
    });
    creditsUsage.bind('maxCreditsChange', this._setModel, this);
    creditsUsage.render();
    this.addView(creditsUsage);

    this._setModel();
  },

  _initBinds: function() {
    this.model.bind('change', this._triggerChange, this);
  },

  _getCategories: function() {
    var categories = this.categories.getCategories();
    return _.filter(categories, function(c) {
      return c.category && c.terms.length > 0
    });
  },

  _getDates: function() {
    return this.datepicker.getDates();
  },

  _getMaxCredits: function() {
    return this.creditsUsage.getMaxCredits();
  },

  _setModel: function() {
    var categories = this._getCategories();
    var dates = this._getDates();
    var maxCredits = this._getMaxCredits();
    var d = {
      categories: categories,
      dates: dates
    };

    this.model.set({
      value: d,
      service_item_id: d,
      user_defined_limits: {
        twitter_credits_limit: maxCredits
      }
    });
  }

})

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../../../../background_polling/models/upload_model":15,"../../../../../dialogs/create/listing/imports/import_default_view":74,"../../../../../dialogs/create/listing/imports/twitter_import/twitter_categories/twitter_categories_view":88,"../../../../../views/date_pickers/dates_range_picker":214,"./credits_usage_view.js":85}],87:[function(require,module,exports){
(function (global){
var Backbone = (typeof window !== "undefined" ? window['Backbone'] : typeof global !== "undefined" ? global['Backbone'] : null);
var TwitterCategoryModel = require('./twitter_category_model');
  
// Twitter categories collection

module.exports = Backbone.Collection.extend({
  model: TwitterCategoryModel
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./twitter_category_model":89}],88:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
cdb.admin = (typeof window !== "undefined" ? window['cdb']['admin'] : typeof global !== "undefined" ? global['cdb']['admin'] : null);
var TwitterCategoriesCollection = require('./twitter_categories_collection');
var TwitterCategoriesModel = require('./twitter_category_model');
var TwitterCategoryView = require('./twitter_category_view');

/**
 *  Twitter category list view
 *  - It will generate a collection to store all the 
 *    terms added.
 */

module.exports = cdb.core.View.extend({

  _MAX_CATEGORIES: 4,
  _MAX_TERMS: 29,

  initialize: function() {
    // Add a first empty model
    var m = this._generateCategory();
    this.collection = new TwitterCategoriesCollection([ m ]);

    this._initBinds();
  },

  render: function() {
    this.clearSubViews();
    this.collection.each(this._addCategory, this);
    return this;
  },

  _initBinds: function() {
    this.collection.bind('change', this._manageCategories, this);
    this.collection.bind('change', this._onCategoryChange, this);
    this.add_related_model(this.collection);
  },

  _manageCategories: function() {
    var self = this;
    var collection_size = this.collection.size();

    // Check if already created models are completed
    var nonFilled = this.collection.filter(function(m) {
      return m.get('terms').length === 0
    });

    // if so, generate new one
    if (nonFilled.length === 0 && collection_size < this._MAX_CATEGORIES) {
      var m = this._generateCategory();
      this.collection.add(m);
      this._addCategory(m);
      return false;
    }

    // else, let's check
    if (nonFilled.length > 0) {
      var m = _.first(nonFilled);
      var v = _.find(this._subviews, function(view){ return m.cid === view.model.cid });
      var pos = v.$el.index();
      
      // Only one item in the collection, do nothing
      if (collection_size === 1) return false;

      // If it is the last item but there is no more items, do nothing
      if (pos === (collection_size - 1)) return false;

      // If it is not the last item and there is another non-filled element
      // let's remove that one.
      if (pos !== (collection_size - 1) && nonFilled.length > 1) {
        m = nonFilled[1];
        v = _.find(this._subviews, function(view){ return m.cid === view.model.cid });
        this._removeCategory(v);
      }

      // Reorder category indexes :(
      this._setCategoryIndex();
    }
  },

  // Set proper index after any category removed
  _setCategoryIndex: function() {
    var self = this;

    // Hack to set properly category numbers
    this.$('.twitter-category').each(function(i,el) {
      // Get category, removing Category word
      var category = $(el).find('.js-category').text().replace('Category ','');

      if (category !== (i+1) ) {
        // Find model
        var m = self.collection.find(function(m) { return m.get('category') === category });
        // Find view
        m.set('category', (i+1).toString() );  
      }
      
    })
  },

  _generateCategory: function() {
    return new TwitterCategoriesModel({
      terms: [],
      category: (this.collection ? ( this.collection.size() + 1 ) : 1 ).toString()
    });
  },

  _addCategory: function(m) {
    var category = new TwitterCategoryView({ model: m });
    
    category.bind('submit', this._onCategorySubmit, this);
    category.bind('limit', this._onCategoryLimit, this);
    category.bind('nolimit', this._onCategoryNoLimit, this);

    this.$el.append(category.render().el);
    
    this.addView(category);
    this.trigger("addCategory");
  },

  _removeCategory: function(v) {
    v.hide();
    v.clean();
    v.model.destroy();
    this.trigger("removeCategory");
  },

  _onCategorySubmit: function() {
    this.trigger('submitCategory', this.collection.toJSON(), this);
  },

  _onCategoryLimit: function() {
    this.trigger('limitCategory', this.collection.toJSON(), this);
  },

  _onCategoryNoLimit: function() {
    this.trigger('noLimitCategory', this.collection.toJSON(), this);
  },

  _onCategoryChange: function() {
    this.trigger('changeCategory', this.collection.toJSON(), this);
  },

  getCategories: function() {
    return this.collection.toJSON();
  }

});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./twitter_categories_collection":87,"./twitter_category_model":89,"./twitter_category_view":90}],89:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);

// Twitter category model

module.exports = cdb.core.Model.extend({

  _MAX_COUNTER: 1014,

  _CHAR_MAP: {
    ' ': 2,
    '-': 2,
    '_': 2,
    '.': 2
  },
  
  defaults: {
    terms:    [],
    category: '',
    counter:  1014
  },

  initialize: function() {
    this._initBinds();
  },

  _initBinds: function() {
    this.bind('change:terms', this._setCounter, this);
  },

  _setCounter: function() {
    var count = this._MAX_COUNTER;
    var self = this;

    // Check terms number
    if (this.get('terms').length > 1) {
      count = count - ( ( this.get('terms').length - 1 ) * 4 )
    }

    // Check characters
    _.each(this.get('terms'), function(term) {
      _.each(term, function(c) {
        if (self._CHAR_MAP[c] !== undefined) {
          count = count - self._CHAR_MAP[c];
        } else {
          count--
        }
      });
    });

    // Count never should be fewer then 0 please!
    this.set('counter', Math.max(0,count));
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],90:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);


/**
 *  Twitter category item view
 *  - It just needs a twitter category model
 */

module.exports = cdb.core.View.extend({

  className: 'TwitterCategory',

  _MAX_CATEGORIES: 4,
  _MAX_TERMS: 29,

  events: {
    'keydown .js-terms':   '_onInputChange',
    'keypress .js-terms':  '_onInputChange',
    'keyup .js-terms':     '_onInputChange'
  },

  initialize: function() {
    this.template = cdb.templates.getTemplate('common/views/create/listing/import_types/twitter_category');
    this._initBinds();
  },

  render: function() {
    this.$el.append(
      this.template({
        terms: this.model.get('terms'),
        category: this.model.get('category'),
        counter: this.model.get('counter')
      })
    );

    // Show category
    this.show();

    return this;
  },

  _initBinds: function() {
    _.bindAll(this, '_onInputChange');
    this.model.bind('change:category', this._onCategoryChange, this);
  },

  _onCategoryChange: function() {
    this.$('.js-category').text('Category ' + this.model.get('category'));
  },

  _onInputChange: function(e) {
    var value = $(e.target).val();

    // It was a ENTER key event? Send signal!
    if (e.keyCode === 13) {
      e.preventDefault();
      this.trigger('submit', this.model, this);
      return false;
    }

    // Change icon class
    this.$('.CDB-IconFont-twitter')[value.length > 0 ? 'addClass' : 'removeClass']('is-highlighted');

    // Check if it is possible to add new characters
    // if not, stop the action, unless user is deleting
    // any previous character
    if (( this.model.get('counter') === 0 || this.model.get('terms').length > this._MAX_TERMS) &&
      e.keyCode !== 37 /* left */ && e.keyCode !== 39 /* right */ && e.keyCode !== 8 && value.length > 0) {
      this.killEvent(e);
      this.trigger('limit', this.model, this);
      return false;
    } else {
      this.trigger('nolimit', this.model, this);
    }

    var $input = $(e.target);
    var value = $input.val();
    var d = {};

    // Get valid terms array
    if (!value) {
      value = [];
    } else {
      value = value.split(',');
    }

    d['terms'] = value;

    this.model.set(d);
  },

  show: function() {
    this.$el.addClass('enabled');
  },

  hide: function() {
    this.$el.removeClass('enabled');
  }

});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],91:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
cdb.admin = (typeof window !== "undefined" ? window['cdb']['admin'] : typeof global !== "undefined" ? global['cdb']['admin'] : null);
var ImportOptions = require('./import_options');
var ImportFallback = require('./imports/import_default_fallback_view');
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);

/**
 *  Imports view
 *
 *  Displays all the import options available
 *  through new create dialog.
 *
 *  IMPORTANT!!
 *
 *  If you need to add a new import pane:
 *
 *  - Create the proper class within imports folder and its tests.
 *  - Add necessary info in import_options file.
 *  - Create a check function here if needed, if not will appear
 *    always enabled (for everybody!).
 *
 */


module.exports = cdb.core.View.extend({

  className: 'ImportOptions',

  _TABS_PER_ROW: 5,
  _DEFAULT_IMPORT: 'file',
  _IMPORT_OPTIONS: ImportOptions,

  _TEXTS: {
    key:      _t('<%- name %> key is not specified and panel can\'t be enabled'),
    account:  _t('<%- name %> data source is not available in your plan. Please upgrade'),
    limits:   _t('You\'ve reached the limits for your account. Please upgrade'),
    credits:  _t('You\'ve reached the available <%- name %> credits for your account this month')
  },

  events: {
    'click .js-goNext': '_moveNextTabs',
    'click .js-goPrev': '_movePrevTabs'
  },

  initialize: function() {
    this.user = this.options.user;
    this.model = new cdb.core.Model({ page: 1, maxPages: 0 });
    this.createModel = this.options.createModel;
    this.template = cdb.templates.getTemplate('common/views/create/listing/import_view');
  },

  render: function() {
    this._destroyBinds();
    this.clearSubViews();
    this.$el.empty();

    // Append template content
    this.$el.append(this.template());
    // Generate tabs!
    this._genTabs();
    // Generate tabs navigation
    this._genTabsNavigation();
    // Generate panes!
    this._genPanes();
    // Set binds
    this._initBinds();
    // Set option
    this._setOption();

    return this;
  },


  ////////////////////
  // TABS && PANES! //
  ////////////////////

  _genTabs: function() {
    var tabs = "";
    var tabTemplate = cdb.templates.getTemplate('common/views/create/listing/import_tab');

    _.each(this._IMPORT_OPTIONS, function(t) {
      if (!_.isEmpty(t) && t.enabled(cdb.config, this.user_data)) {
        tabs += tabTemplate(t);
      }
    });

    this.$('.ImportOptions-tabsList').append(tabs);

    // Create tabs
    this.importTabs = new cdb.admin.Tabs({
      el:     this.$('.ImportOptions-tabsList'),
      slash:  true
    });
    this.addView(this.importTabs);
  },

  _genTabsNavigation: function() {
    var numTabs = this.$('.ImportOptions-tab').size();
    if (numTabs <= 1) {
      this.$('.ImportOptions-tabs').hide();
    }

    // Set max pages
    this.model.set('maxPages', Math.ceil(numTabs / this._TABS_PER_ROW));
    this._checkTabsNavigation();
    if (this.model.get('maxPages') <= 1) {
      this.$('.ImportOptions-navigation').hide();
    }
  },

  _moveNextTabs: function() {
    var page = this.model.get('page');
    var maxPages = this.model.get('maxPages');

    if (page < maxPages) {
      this.model.set('page', page + 1);
    }
  },

  _movePrevTabs: function() {
    var page = this.model.get('page');
    if (page > 1) {
      this.model.set('page', page - 1);
    }
  },

  _moveTabsNavigation: function() {
    var page = this.model.get('page');
    var rowWidth = 800;

    this.$('.ImportOptions-tabsList').css('margin-left', '-' + (rowWidth * (page-1)) + 'px');
    this._checkTabsNavigation();
  },

  _checkTabsNavigation: function() {
    var page = this.model.get('page');
    var maxPages = this.model.get('maxPages');

    // Check prev button
    this.$('.js-goPrev')[ page > 1 ? 'removeClass' : 'addClass' ]('is-disabled');

    // Check next button
    this.$('.js-goNext')[ page < maxPages ? 'removeClass' : 'addClass' ]('is-disabled');
  },

  _genPanes: function() {
    var self = this;

    // Create TabPane
    this.importPanes = new cdb.ui.common.TabPane({
      el: this.$(".ImportOptions-panes")
    });
    this.addView(this.importPanes);

    // Link tabs with panes
    this.importTabs.linkToPanel(this.importPanes);

    // Render panes!
    _.each(this._IMPORT_OPTIONS, function(imp,i) {
      var pane = '';

      // Check if import option function exists
      var fn = self['_check' + i + 'Import'];
      var isEnabled = (fn && fn(imp, self));

      if (( isEnabled || isEnabled === undefined ) && !_.isEmpty(imp)) {
        pane = new imp.className(
          _.extend(
            ( imp.options || {} ),
            {
              user: self.user,
              title: imp.title
            }
          )
        );
      } else if (imp.fallback) {
        pane = new ImportFallback({
          template: imp.fallback
        });
      }

      if (pane) {
        pane.render();
        pane.bind('change', self._setUploadModel, self);
        self.importPanes.addTab(imp.name, pane);
        self.addView(pane);
      }
    });
  },

  _checkGDriveImport: function(imp, v) {
    if (!cdb.config.get('oauth_gdrive')) {
      v._setFailedTab('gdrive', 'key');
      return false;
    }
    return true;
  },

  _checkDropboxImport: function(imp, v) {
    if (!cdb.config.get('oauth_dropbox')) {
      v._setFailedTab('dropbox', 'key');
      return false;
    }
    return true;
  },

  _checkBoxImport: function(imp, v) {
    if (!cdb.config.get('oauth_box')) {
      v._setFailedTab('box', 'key');
      return false;
    }
    return true;
  },

  _checkTwitterImport: function(imp, v) {
    // Check if user have twitter datasource enabled!
    if (!cdb.config.get('datasource_search_twitter')) {
      v._setFailedTab('twitter', 'key');
      return false;
    }
    // Check if user can create or import a new file or user has
    // enough rights to enable twitter!
    if (!v.user.get('twitter').enabled) {
      return false;
    }
    // Check if user can create or import a new file or user has
    // enough rights to enable twitter!
    if (( v.user.get('twitter').quota - v.user.get('twitter').monthly_use ) <= 0 && v.user.get('twitter').hard_limit) {
      v._setFailedTab('twitter', 'credits');
      return false;
    }
    return true;
  },

  _checkInstagramImport: function(imp, v) {
    if (!v.user.featureEnabled('instagram_import')) {
      return false;
    }
    if (!cdb.config.get('oauth_instagram')) {
      v._setFailedTab('instagram', 'key');
      return false;
    }
    return true;
  },

  _checkSalesforceImport: function(imp, v) {
    // Check if salesforce feature is enabled
    if (!v.user.get('salesforce').enabled) {
      return false;
    }
    return true;
  },

  _checkMailchimpImport: function(imp, v) {
    // Config available?
    if (!cdb.config.get('oauth_mailchimp')) {
      v._setFailedTab('mailchimp', 'key');
      return false;
    }
    // Feature enabled?
    if (!v.user.featureEnabled('mailchimp_import')) {
      return false;
    }
    return true;
  },

  _setFailedTab: function(tab, type) {
    var $tab = this.importTabs.getTab(tab);
    $tab.addClass('disabled');
    this._createTooltip(tab, type);
  },

  _createTooltip: function(tab, type) {
    var self = this;
    var $tab = this.importTabs.getTab(tab);

    // Tipsy?
    var tooltip = new cdb.common.TipsyTooltip({
      el: $tab,
      title: function() {
        return _.template(self._TEXTS[type])({ name: tab })
      }
    })
    this.addView(tooltip);
  },

  _setUploadModel: function(d) {
    this.createModel.upload.setFresh(d);
  },

  _initBinds: function() {
    this.model.bind('change:page', this._moveTabsNavigation, this);
    if (this.importPanes) {
      this.importPanes.bind('tabEnabled',  this._onTabChange, this);
    }
  },

  _destroyBinds: function() {
    if (this.importPanes) {
      this.importPanes.unbind('tabEnabled', null, this);
    }
  },

  _setOption: function() {
    // First option > data file
    this.importPanes.active(this._DEFAULT_IMPORT);
    this._updateImportOption();
  },

  _updateImportOption: function() {
    this.createModel.setActiveImportPane(this.importPanes.activeTab);
  },


  ////////////
  // Events //
  ////////////

  _onTabChange: function(tabName) {
    var v = this.importPanes.getPane(tabName);
    // Set upload model from activated pane to create model
    var upload = v.getModelData && v.getModelData();
    if (upload) {
      this._setUploadModel(upload);
    } else {
      this._setUploadModel({});
    }
    this._updateImportOption();
  },

  clean: function() {
    this._destroyBinds();
    cdb.core.View.prototype.clean.call(this);
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./import_options":67,"./imports/import_default_fallback_view":73}],92:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var Utils = (typeof window !== "undefined" ? window['cdb']['Utils'] : typeof global !== "undefined" ? global['cdb']['Utils'] : null);
var pluralizeString = require('../../../view_helpers/pluralize_string');

/**
 *  Listing datasets navigation.
 *
 *  - 'Filter by' datasets.
 *  - 'Search' any pattern within dataset collection.
 *
 */
module.exports = cdb.core.View.extend({

  events: {
    'submit .js-search-form':   '_submitSearch',
    'keydown .js-search-form':  '_onSearchKeyDown',
    'click .js-search-form':    'killEvent',
    'click .js-search-link':    '_onSearchClick',
    'click .js-clean-search':   '_onCleanSearchClick',
    'click .js-shared':         '_onSharedClick',
    'click .js-library':        '_onLibraryClick',
    'click .js-connect':        '_onConnectClick',
    'click .js-datasets':       '_onDatasetsClick',
    'click .js-create_empty':   '_onCreateEmptyClick'
  },

  _TEXTS: {
    createFromScratchLabel: {
      map: 'Create empty map',
      dataset: 'Create empty dataset',
      addLayer: 'Add an empty layer'
    }
  },

  initialize: function() {
    this.routerModel = this.options.routerModel;
    this.createModel = this.options.createModel;
    this.user = this.options.user;
    this.template = cdb.templates.getTemplate('common/views/create/listing/navigation');
    this.model = new cdb.core.Model();

    this._preRender();
    this._initBinds();
  },

  // It is necessary to add two static elements because
  // they can't be removed/replaced using render method
  // each time a change (in a model or a collection) happens.
  // This is due to the behaviour of the CSS animations.
  _preRender: function() {
    var $uInner = $('<div>').addClass('u-inner');
    var $filtersInner = $('<div>').addClass('Filters-inner');
    this.$el.append($uInner.append($filtersInner));
  },

  render: function(m, c) {
    this.clearSubViews();

    var selectedItemsCount = this._selectedItems().length;
    // If a change is made from content type we have to know
    // preventing show wrong data about total items
    var changedContentType = c && c.changes && c.changes.content_type;
    var createModelType = this.createModel.get('type');

    this.$('.Filters-inner').html(
      this.template(
        _.extend({
            createModel:           this.createModel,
            canCreateDataset:      this.user.canCreateDatasets(),
            listing:               this.createModel.get('listing'),
            isInsideOrg:           this.user.isInsideOrg(),
            selectedItemsCount:    selectedItemsCount,
            maxLayersByMap:        this.user.getMaxLayers(),
            totalShared:           changedContentType ? 0 : this.collection.total_shared,
            totalItems:            changedContentType ? 0 : this.collection.total_user_entries,
            pageItems:             this.collection.size(),
            routerModel:           this.routerModel,
            pluralizedContentType: pluralizeString('dataset', changedContentType ? 0 : this.collection.total_user_entries),
            pluralizedContentTypeSelected: pluralizeString('dataset', selectedItemsCount),
            createFromScratchLabel: this._TEXTS.createFromScratchLabel[createModelType]
          },
          this.routerModel.attributes
        )
      )
    );

    this._animate();
    if (this.routerModel.isSearching()) {
      this._focusSearchInput();
    }

    return this;
  },

  _initBinds: function() {
    this.model.on('change:isSearchEnabled', this._onChangeIsSearchEnabled, this);
    this.createModel.bind('change:listing', this.render, this);
    this.routerModel.bind('change', this.render, this);
    this.collection.bind('reset', this.render, this);
    cdb.god.bind('closeDialogs', this._animate, this);
    this.add_related_model(cdb.god);
    this.add_related_model(this.createModel);
    this.add_related_model(this.collection);
    this.add_related_model(this.routerModel);
  },

  _onChangeIsSearchEnabled: function(model, isSearchEnabled) {
    this._enableSearchUI(isSearchEnabled);

    if (this.routerModel.isSearching()) {
      this._cleanSearch();
    } else if (isSearchEnabled) {
      this._$searchInput().val('');
      this._focusSearchInput();
    }
  },

  _$searchInput: function() {
    return this.$('.js-search-input')
  },

  _focusSearchInput: function() {
    this._$searchInput()
      .select()
      .focus();
  },

  _onSearchKeyDown: function(e) {
    // ESC
    if (e.keyCode === 27) {
      this.killEvent(e);
      this._cleanSearch();
    }
  },

  _selectedItems: function() {
    return this.collection.where({ selected: true });
  },

  _animate: function() {
    this._enableSearchUI(!!this.routerModel.isSearching());

    // Check if user doesn't have any table and it is in library section
    // to remove useless shadow
    var inLibrarySection = this.routerModel.get('library');
    var inDatasetsSection = this.createModel.get('listing') === "datasets";
    var hasDatasets = this.collection.total_user_entries > 0;
    this.$el.toggleClass('no-shadow', inLibrarySection && !hasDatasets && inDatasetsSection);
  },

  _enableSearchUI: function(enable) {
    this.$('.js-search-field').toggle(enable);
    this.$('.js-links-list').toggleClass('is-hidden', enable);
    this.$('.js-order-list').toggleClass('is-hidden', enable);
  },

  _onDatasetsClick: function() {
    this.routerModel.set({
      shared: 'no',
      library: false,
      page: 1
    });
    this.createModel.set('listing', 'datasets');
  },

  _onSharedClick: function() {
    this.routerModel.set({
      shared: 'only',
      library: false,
      page: 1
    });
    this.createModel.set('listing', 'datasets');
  },

  _onLibraryClick: function() {
    this.routerModel.set({
      shared: 'no',
      library: true,
      page: 1
    });
    this.createModel.set('listing', 'datasets');

    // Event tracking "Clicked Common data"
    cdb.god.trigger('metrics', 'common_data', {
      email: window.user_data.email
    });
  },

  _onConnectClick: function() {
    if (this.user.canCreateDatasets()) {
      this.createModel.set('listing', 'import');
    }
  },

  _onCreateEmptyClick: function() {
    if (this.user.canCreateDatasets()) {
      this.createModel.createFromScratch();
    }
  },

  // Selection actions

  _onSearchClick: function(e) {
    if (e) this.killEvent(e);
    this.model.set('isSearchEnabled', !this.model.get('isSearchEnabled'));
  },

  // Filter actions

  _onCleanSearchClick: function(e) {
    if (e) e.preventDefault();
    this._cleanSearch();
  },

  _cleanSearch: function() {
    this.routerModel.set({
      q: '',
      tag: '',
      shared: 'no',
      library: this.createModel.showLibrary()
    });
    this.model.set('isSearchEnabled', false);
  },

  _submitSearch: function(e) {
    if (e) this.killEvent(e);
    var val = Utils.stripHTML(this.$('.js-search-input').val().trim(),'');
    var tag = val.search(':') === 0 ? val.replace(':', '') : '';
    var q = val.search(':') !== 0 ? val : '';

    this.routerModel.set({
      page: 1,
      tag: tag,
      q: q,
      shared: 'yes'
    });

    this.createModel.set('listing', 'datasets');
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../../view_helpers/pluralize_string":211}],93:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var BaseDialog = require('../../views/base_dialog/view');
var ViewFactory = require('../../view_factory');
var randomQuote = require('../../view_helpers/random_quote');

/**
 * Create a vis from a dataset, required for some contexts to have a vis before be able to carry out next task
 *  - duplicate vis
 *  - add layer
 */
module.exports = BaseDialog.extend({

  initialize: function() {
    this.elder('initialize');
    if (!this.model) throw new Error('model is required (cdb.admin.Visualization)');
    if (!this.options.title) throw new Error('title is required');
    if (!this.options.explanation) throw new Error('title is required');
    if (!this.options.router) throw new Error('router callback is required');
    this._initViews();
    this._initBinds();
  },

  render_content: function() {
    return this._panes.getActivePane().render().el;
  },

  _initViews: function() {
    this._panes = new cdb.ui.common.TabPane({
      el: this.el
    });
    this.addView(this._panes);
    this._panes.addTab('confirm',
      ViewFactory.createByTemplate('common/dialogs/create_vis_first/template', {
        title: this.options.title,
        explanation: this.options.explanation
      })
    );
    this._panes.addTab('loading',
      ViewFactory.createByTemplate('common/templates/loading', {
        title: 'Creating map…',
        quote: randomQuote()
      })
    );
    this._panes.addTab('fail',
      ViewFactory.createByTemplate('common/templates/fail', {
        msg: 'Could not create map for some reason'
      })
    );
    this._panes.active('confirm');
  },

  _initBinds: function() {
    this._panes.bind('tabEnabled', this.render, this);
  },

  ok: function() {
    this._panes.active('loading');
    var self = this;
    this.model.changeToVisualization({
      success: function(vis) {
        self.options.router.changeToVis(vis);
        if (self.options.success) {
          self.options.success(vis);
        }
        self.clean();
      },
      error: function() {
        self._panes.active('fail');
      }
    });
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../view_factory":209,"../../view_helpers/random_quote":212,"../../views/base_dialog/view":213}],94:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var BaseDialog = require('../../views/base_dialog/view');
var ViewFactory = require('../../view_factory');
var randomQuote = require('../../view_helpers/random_quote');

module.exports = BaseDialog.extend({

  initialize: function() {
    this.elder('initialize');

    if (!this.options.table) {
      throw new Error('table is required');
    }

    if (!this.options.column) {
      throw new Error('column is required');
    }
    this._initViews();
    this._initBinds();
  },

  render_content: function() {
    return this._panes.getActivePane().render().el;
  },

  _initViews: function() {

    this.table = this.options.table;
    this.column = this.options.column;

    this._panes = new cdb.ui.common.TabPane({
      el: this.el
    });
    this.addView(this._panes);
    this._panes.addTab('confirm',
      ViewFactory.createByTemplate('common/dialogs/delete_column/template', {
        column: this.column
      })
    );
    this._panes.addTab('loading',
      ViewFactory.createByTemplate('common/templates/loading', {
        title: 'Deleting column…',
        quote: randomQuote()
      })
    );
    this._panes.addTab('fail',
      ViewFactory.createByTemplate('common/templates/fail', {
        msg: 'Could not delete column for some reason'
      })
    );
    this._panes.active('confirm');
  },

  _initBinds: function() {
    this._panes.bind('tabEnabled', this.render, this);
  },

  ok: function() {
    this._panes.active('loading');
    this.table.deleteColumn(this.column);
    this.close();
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../view_factory":209,"../../view_helpers/random_quote":212,"../../views/base_dialog/view":213}],95:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var BaseDialog = require('../views/base_dialog/view');
var pluralizeString = require('../view_helpers/pluralize_string');
var randomQuote = require('../view_helpers/random_quote');
var MapCardPreview = require('../views/mapcard_preview');
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);
var moment = (typeof window !== "undefined" ? window['moment'] : typeof global !== "undefined" ? global['moment'] : null);

var AFFECTED_ENTITIES_SAMPLE_COUNT = 3;
var AFFECTED_VIS_COUNT = 3;

/**
 * Delete items dialog
 */
module.exports = BaseDialog.extend({

  initialize: function() {
    this.elder('initialize');
    if (!this.options.viewModel) {
      throw new TypeError('viewModel is required');
    }
    if (!this.options.user) {
      throw new TypeError('user is required');
    }

    this._viewModel = this.options.viewModel;
    this._viewModel.loadPrerequisites();
    this._viewModel.bind('change', function() {
      if (this._viewModel.state() === 'DeleteItemsDone') {
        this.close();
      } else {
        this.render();
      }
    }, this);
    this.add_related_model(this._viewModel);
  },

  render: function() {
    BaseDialog.prototype.render.call(this);
    this._loadMapPreviews();
    return this;
  },

  /**
   * @implements cdb.ui.common.Dialog.prototype.render_content
   */
  render_content: function() {
    return this['_render' + this._viewModel.state()]();
  },

  _renderLoadingPrerequisites: function() {
    return cdb.templates.getTemplate('common/templates/loading')({
      title: 'Checking what consequences deleting the selected ' + this._pluralizedContentType() + ' would have...',
      quote: randomQuote()
    });
  },

  _renderLoadPrerequisitesFail: function() {
    return cdb.templates.getTemplate('common/templates/fail')({
      msg: 'Failed to check consequences of deleting the selected ' + this._pluralizedContentType()
    });
  },

  _renderConfirmDeletion: function() {
    // An entity can be an User or Organization
    var affectedEntities = this._viewModel.affectedEntities();
    var affectedVisData = this._viewModel.affectedVisData();

    return cdb.templates.getTemplate('common/dialogs/delete_items_view_template')({
      firstItemName: this._getFirstItemName(),
      selectedCount: this._viewModel.length,
      isDatasets: this._viewModel.isDeletingDatasets(),
      pluralizedContentType: this._pluralizedContentType(),
      affectedEntitiesCount: affectedEntities.length,
      affectedEntitiesSample: affectedEntities.slice(0, AFFECTED_ENTITIES_SAMPLE_COUNT),
      affectedEntitiesSampleCount: AFFECTED_ENTITIES_SAMPLE_COUNT,
      affectedVisCount: affectedVisData.length,
      pluralizedMaps: pluralizeString('map', affectedVisData.length),
      affectedVisVisibleCount: AFFECTED_VIS_COUNT,
      visibleAffectedVis: this._prepareVisibleAffectedVisForTemplate(affectedVisData.slice(0, AFFECTED_VIS_COUNT))
    });
  },

  _prepareVisibleAffectedVisForTemplate: function(visibleAffectedVisData) {
    return visibleAffectedVisData.map(function(visData) {
      var vis = new cdb.admin.Visualization(visData);
      var owner = vis.permission.owner;
      return {
        visId: vis.get('id'),
        name: vis.get('name'),
        url: vis.viewUrl(this.options.user).edit(),
        owner: owner,
        ownerName: owner.get('username'),
        isOwner: vis.permission.isOwner(this.options.user),
        showPermissionIndicator: !vis.permission.hasWriteAccess(this.options.user),
        timeDiff: moment(vis.get('updated_at')).fromNow()
      };
    }, this);
  },

  /**
   * @overrides BaseDialog.prototype.ok
   */
  ok: function() {
    this._viewModel.deleteItems();
    this.render();
  },

  _loadMapPreviews: function() {
    var self = this;

    this.$el.find('.MapCard').each(function() {
      var username = $(this).data('visOwnerName');
      var mapCardPreview = new MapCardPreview({
        el: $(this).find('.js-header'),
        width: 298,
        height: 130,
        mapsApiResource: cdb.config.getMapsResourceName(username),
        visId: $(this).data('visId'),
        username: username
      }).load();

      self.addView(mapCardPreview);
    });
  },

  _renderDeletingItems: function() {
    return cdb.templates.getTemplate('common/templates/loading')({
      title: 'Deleting the selected ' + this._pluralizedContentType() + '...',
      quote: randomQuote()
    });
  },

  _renderDeleteItemsFail: function() {
    var message = this._viewModel.errorMessage().replace(/\n/g, '<br>');
    if (message === 'something failed') {
      message = '';
    }
    return cdb.templates.getTemplate('common/templates/fail')({
      msg: 'Failed to delete the selected ' + this._pluralizedContentType() + '. ' + message
    });
  },

  _pluralizedContentType: function() {
    return pluralizeString(
      this._viewModel.isDeletingDatasets() ? 'dataset' : 'map',
      this._viewModel.length
    );
  },

  _getFirstItemName: function() {
    if (!this.options.viewModel) return;

    var firstItem = this.options.viewModel.at(0);

    if (firstItem) {
      return firstItem.get("name");
    }
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../view_helpers/pluralize_string":211,"../view_helpers/random_quote":212,"../views/base_dialog/view":213,"../views/mapcard_preview":217}],96:[function(require,module,exports){
(function (global){
var Backbone = (typeof window !== "undefined" ? window['Backbone'] : typeof global !== "undefined" ? global['Backbone'] : null);
var batchProcessItems = require('../../common/batch_process_items');

/**
 * View model for delete items view.
 * Manages the states changes for the delete items view.
 */
module.exports = Backbone.Collection.extend({

  initialize: function(models, opts) {
    if (!opts.contentType) {
      throw new TypeError('contentType is required')
    }

    this._contentType = opts.contentType;
  },

  state: function() {
    return this._state;
  },

  errorMessage: function() {
    return this._errorMessage;
  },

  setState: function(newState) {
    this._state = newState;
    this.trigger('change');
    this.trigger(newState);
  },

  isDeletingDatasets: function() {
    return this._contentType === 'datasets';
  },

  loadPrerequisites: function() {
    var setStateToConfirmDeletion = this.setState.bind(this, 'ConfirmDeletion');

    if (this.isDeletingDatasets()) {
      this.setState('LoadingPrerequisites');

      batchProcessItems({
        howManyInParallel: 5,
        items: this.toArray(),
        processItem: this._loadPrerequisitesForModel,
        done: setStateToConfirmDeletion,
        fail: this.setState.bind(this, 'LoadPrerequisitesFail')
      });
    } else {
      setStateToConfirmDeletion();
    }
  },

  affectedEntities: function() {
    return this.chain()
      .map(function(m) {
        return m.sharedWithEntities();
      })
      .flatten().compact().value();
  },

  affectedVisData: function() {
    var visData = this.chain()
      .map(function(m) {
          var metadata = m.tableMetadata();
          return []
            .concat(metadata.get('dependent_visualizations'))
            .concat(metadata.get('non_dependent_visualizations'));
        })
      .flatten().compact().value();

    return _.uniq(visData, function(metadata) {
      return metadata.id;
    });
  },

  deleteItems: function() {
    this.setState('DeletingItems');

    // INFO: Don't put more than 1 delete in parallel because this lead to a
    // race condicition in the derived map deletion (if any)
    batchProcessItems({
      howManyInParallel: 1,
      items: this.toArray(),
      processItem: this._deleteItem,
      done: this.setState.bind(this, 'DeleteItemsDone'),
      fail: this._deletionFailed.bind(this)
    });
  },

  _deletionFailed: function(error) {
    this._errorMessage = error;
    this.setState('DeleteItemsFail');
  },

  _loadPrerequisitesForModel: function(m, callback) {
    var metadata = m.tableMetadata();

    // TODO: extract to be included in fetch call instead? modifying global state is not very nice
    metadata.no_data_fetch = true;

    metadata.fetch({
      wait: true, // TODO: from old code (delete_dialog), why is it necessary?
      success: function() {
        callback();
      },
      error: function(model, jqXHR) {
        callback(jqXHR.responseText);
      }
    });
  },

  _deleteItem: function(item, callback) {
    item.destroy({ wait: true })
      .done(function() {
        callback();
      })
      .fail(function(response) {
        var errorMessage;

        try {
          errorMessage = JSON.parse(response.responseText).errors.join('; ');
        } catch (e) {
          errorMessage = 'something failed';
        }

        callback(errorMessage);
      });
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../common/batch_process_items":24}],97:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var BaseDialog = require('../../views/base_dialog/view');
var ViewFactory = require('../../view_factory');
var randomQuote = require('../../view_helpers/random_quote');

/**
 * Create a vis from a dataset, required for some contexts to have a vis before be able to carry out next task
 *  - duplicate vis
 *  - add layer
 */
module.exports = BaseDialog.extend({

  initialize: function() {
    this.elder('initialize');

    // Clean on hide and enter to confirm
    // have to be mandatory
    _.extend(
      this.options,
      {
        clean_on_hide: true,
        enter_to_confirm: true
      }
    );

    if (!this.model) throw new Error('model is required (layer)');
    this._initViews();
    this._initBinds();
  },

  render_content: function() {
    return this._panes.getActivePane().render().el;
  },

  _initViews: function() {
    this._panes = new cdb.ui.common.TabPane({
      el: this.el
    });
    this.addView(this._panes);
    this._panes.addTab('confirm',
      ViewFactory.createByTemplate('common/dialogs/delete_layer/template', {
      })
    );
    this._panes.addTab('loading',
      ViewFactory.createByTemplate('common/templates/loading', {
        title: 'Deleting layer…',
        quote: randomQuote()
      })
    );
    this._panes.addTab('fail',
      ViewFactory.createByTemplate('common/templates/fail', {
        msg: 'Could not delete layer for some reason'
      })
    );
    this._panes.active('confirm');
  },

  _initBinds: function() {
    this._panes.bind('tabEnabled', this.render, this);
  },

  ok: function() {
    this._panes.active('loading');
    var self = this;
    this.model.destroy({
      wait: true,
      success: function() {
        self.close();
      },
      error: function() {
        self._panes.active('fail');
      }
    });
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../view_factory":209,"../../view_helpers/random_quote":212,"../../views/base_dialog/view":213}],98:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var BaseDialog = require('../../views/base_dialog/view');
var ViewFactory = require('../../view_factory');
var randomQuote = require('../../view_helpers/random_quote');

/**
 * Modal to delete a row/feature (e.g. a point or polygon), on the table or map view .
 */
module.exports = BaseDialog.extend({

  initialize: function() {
    this.elder('initialize');

    if (!this.options.table) {
      throw new Error('table is required');
    }

    if (!this.options.row) {
      throw new Error('row is required');
    }

    this.options.name = this.options.name || 'row';

    this._initViews();
    this._initBinds();
  },

  render_content: function() {
    return this._panes.getActivePane().render().el;
  },

  _initViews: function() {
    this.table = this.options.table;
    this.row = this.options.row;

    this._panes = new cdb.ui.common.TabPane({
      el: this.el
    });
    this.addView(this._panes);
    this._panes.addTab('confirm',
      ViewFactory.createByTemplate('common/dialogs/delete_row/template', {
        name: this.options.name
      })
    );
    this._panes.addTab('loading',
      ViewFactory.createByTemplate('common/templates/loading', {
        title: 'Deleting ' + this.options.name + '…',
        quote: randomQuote()
      })
    );
    this._panes.addTab('fail',
      ViewFactory.createByTemplate('common/templates/fail', {
        msg: 'Could not delete ' + this.options.name + ' for some reason'
      })
    );
    this._panes.active('confirm');
  },

  _initBinds: function() {
    this._panes.bind('tabEnabled', this.render, this);
  },

  ok: function() {
    var self = this
    this._panes.active('loading');
    this.table.trigger('removing:row');
    this.row.destroy({
      success: function() {
        self.table.trigger('remove:row', self.row);
        self.close();
      },
      error: function() {
        self._panes.active('fail');
      }
    }, {
      wait: this.options.wait
    });
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../view_factory":209,"../../view_helpers/random_quote":212,"../../views/base_dialog/view":213}],99:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var BaseDialog = require('../views/base_dialog/view');
var ViewFactory = require('../view_factory');
var randomQuote = require('../view_helpers/random_quote');
var ErrorDetailsView = require('../views/error_details_view');

/**
 * Dialog to manage duplication process of a cdb.admin.CartoDBTableMetadata object.
 */
module.exports = BaseDialog.extend({

  initialize: function() {
    this.elder('initialize');
    if (!this.model) throw new Error('model is required (cdb.admin.CartoDBTableMetadata)');
    if (!this.options.user) throw new Error('user is required');
    this.elder('initialize');
    this._initViews();
    this._initBinds();
    this._duplicateDataset();
  },

  render_content: function() {
    return this._panes.getActivePane().render().el;
  },

  _initViews: function() {
    this._panes = new cdb.ui.common.TabPane({
      el: this.el
    });
    this.addView(this._panes);
    this._panes.addTab('loading',
      ViewFactory.createByTemplate('common/templates/loading', {
        title: this.model.isInSQLView() ? 'Creating dataset from your query' : 'Duplicating your dataset',
        quote: randomQuote()
      })
    );
    this._panes.active('loading');
  },

  _initBinds: function() {
    this._panes.bind('tabEnabled', this.render, this);
  },

  _duplicateDataset: function(newName) {
    var self = this;
    var newName = this.model.get('name') + '_copy';
    this.model.duplicate(newName, {
      success: function(newTable) {
        self._redirectTo(newTable.viewUrl());
      },
      error: self._showError.bind(self)
    });
  },

  _showError: function(model) {
    var view;
    try {
      var err = _.clone(model.attributes);
      view = new ErrorDetailsView({
        err: _.extend(err, model.attributes.get_error_text),
        user: this.options.user
      });
    } catch(err) {
      view = ViewFactory.createByTemplate('common/templates/fail', {
        msg: "Sorry, something went wrong, but we're not sure why."
      });
    }
    this._panes.addTab('fail', view.render());
    this._panes.active('fail');
  },

  _redirectTo: function(url) {
    window.location = url;
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../view_factory":209,"../view_helpers/random_quote":212,"../views/base_dialog/view":213,"../views/error_details_view":215}],100:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var BaseDialog = require('../views/base_dialog/view');
var ViewFactory = require('../view_factory');
var randomQuote = require('../view_helpers/random_quote');
var ErrorDetailsView = require('../views/error_details_view');

/**
 * Dialog to manage duplication process of a cdb.admin.Visualization object.
 */
module.exports = BaseDialog.extend({

  initialize: function() {
    this.elder('initialize');
    if (!this.model) throw new Error('model is required (cdb.admin.Visualization)');
    if (!this.options.user) throw new Error('user is required');
    this.elder('initialize');
    this._initViews();
    this._initBinds();
    this._duplicateMap();
  },

  render_content: function() {
    return this._panes.getActivePane().render().el;
  },

  _initViews: function() {
    this._panes = new cdb.ui.common.TabPane({
      el: this.el
    });
    this.addView(this._panes);
    this._panes.addTab('loading',
      ViewFactory.createByTemplate('common/templates/loading', {
        title: 'Duplicating your map',
        quote: randomQuote()
      })
    );
    this._panes.active('loading');
  },

  _initBinds: function() {
    this._panes.bind('tabEnabled', this.render, this);
  },

  _duplicateMap: function(newName) {
    var self = this;
    var newName = this.model.get('name') + ' copy';
    this.model.copy({
      name: newName
    }, {
      success: function(newVis) {
        self._redirectTo(newVis.viewUrl(self.options.user).edit().toString());
      },
      error: self._showError.bind(self)
    });
  },

  _showError: function(model) {
    var view;
    try {
      var err = _.clone(model.attributes);
      view = new ErrorDetailsView({
        err: _.extend(err, model.attributes.get_error_text),
        user: this.options.user
      });
    } catch(err) {
      view = ViewFactory.createByTemplate('common/templates/fail', {
        msg: "Sorry, something went wrong, but we're not sure why."
      });
    }
    this._panes.addTab('fail', view.render());
    this._panes.active('fail');
  },

  _redirectTo: function(url) {
    window.location = url;
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../view_factory":209,"../view_helpers/random_quote":212,"../views/base_dialog/view":213,"../views/error_details_view":215}],101:[function(require,module,exports){
(function (global){
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var Utils = (typeof window !== "undefined" ? window['cdb']['Utils'] : typeof global !== "undefined" ? global['cdb']['Utils'] : null);


/**
 *  Edit visualization (dataset or map) dialog
 *
 */
module.exports = cdb.core.View.extend({

  options: {
    maxLength: 200
  },

  events: {
    'keydown .js-name': '_onNameKeyDown',
    'click .js-privacy': '_showPrivacy',
    'submit': '_onSubmit'
  },

  initialize: function() {
    this.user = this.options.user;
    this.template = cdb.templates.getTemplate('common/dialogs/edit_vis_metadata/edit_vis_form');
    this._initBinds();
  },

  render: function() {
    this.clearSubViews();
    this._destroyTags();
    this.$el.html(
      this.template({
        isDataset: this.model.isDataset(),
        isDataLibraryEnabled: this.user.featureEnabled('data_library'),
        visValue: this.model.get('name'),
        visDescription: this.model.get('description'),
        visPrivacy: this.model.get('privacy').toLowerCase(),
        visSource: this.model.get('source'),
        visAttributions: this.model.get('attributions'),
        visDisplayName: this.model.get('display_name'),
        isNameEditable: this.model.isNameEditable(),
        isMetadataEditable: this.model.isMetadataEditable(),
        maxLength: this.options.maxLength
      })
    );
    this._initViews();
    return this;
  },

  _initBinds: function() {
    this.model.bind('error', this._setFields, this);
    this.model.bind('valid', this._setFields, this);
  },

  _initViews: function() {
    var self = this;

    // Markdown tooltip
    this.addView(
      new cdb.common.TipsyTooltip({
        el: this.$('.js-markdown'),
        html: true,
        title: function() {
          return $(this).data('title');
        }
      })
    );

    // Name error tooltip
    this.addView(
      new cdb.common.TipsyTooltip({
        el: this.$('.js-name'),
        title: function() {
          return self.model.getError();
        }
      })
    );

    // Tags
    _.each(this.model.get('tags'), function(li) {
      this.$(".js-tagsList").append("<li>" + cdb.core.sanitize.html(li) + "</li>");
    }, this);

    var tagsPlaceholder = (!this.model.isMetadataEditable() && this.model.get('tags').length === 0) ? 'No tags' : 'Add tags';

    this.$(".js-tagsList").tagit({
      allowSpaces: true,
      placeholderText: tagsPlaceholder,
      readOnly: !this.model.isMetadataEditable(),
      onBlur: function() {
        if (self.model.isMetadataEditable()) {
          self.$('.js-tags').removeClass('is-focus')
        }
      },
      onFocus: function() {
        if (self.model.isMetadataEditable()) {
          self.$('.js-tags').addClass('is-focus')
        }
      },
      onSubmitTags: function(ev, tagList) {
        ev.preventDefault();
        self._onSubmit();
        return false;
      }
    });

    // Licenses dropdown
    if (this.model.isDataset()) {
      this._licenseDropdown = new cdb.forms.Combo({
        className: 'Select',
        width: '100%',
        property: 'license',
        model: this.model,
        disabled: !this.model.isMetadataEditable(),
        extra: this._getLicensesForFormsCombo()
      });
      this.addView(this._licenseDropdown);
      this.$('.js-license').append(this._licenseDropdown.render().el);
    }
  },

  _getLicensesForFormsCombo: function() {
    var items = cdb.config.get('licenses');
    var emptyOption = [{
      id: '',
      name: '-'
    }];
    return _.chain(emptyOption.concat(items))
      .compact()
      .map(function(d) {
        return [d.name, d.id];
      })
      .value();
  },

  _setFields: function() {
    // for the moment only name input is required
    this.$('.js-name').toggleClass('is-invalid', !!this.model.getError());
  },

  _showPrivacy: function(ev) {
    this.killEvent(ev);
    this.trigger('onPrivacy', this);
  },

  // Form events

  _onNameKeyDown: function(ev) {
    if (ev.keyCode === $.ui.keyCode.ENTER) {
      ev.preventDefault();
      this._onSubmit();
      return false;
    }
  },

  _onSubmit: function(ev) {
    if (ev) {
      this.killEvent(ev);
    }

    // values
    var attrs = {};
    if (this.model.isNameEditable()) {
      attrs['name'] = Utils.stripHTML(this.$('.js-name').val());
    }
    if (this.model.isMetadataEditable()) {
      attrs['description'] = Utils.removeHTMLEvents(this.$('.js-description').val());
      attrs['tags'] = this.$('.js-tagsList').tagit("assignedTags");

      if (this.model.isDataset()) {
        attrs.source = this.$('.js-source').val();
        attrs.attributions = this.$('.js-attributions').val();
        attrs.display_name = this.$('.js-displayName').val();
        // license is set through dropdown view, so no need to do an explicit set here
      }
    }

    this.model.set(attrs);

    if (this.model.isValid()) {
      this.trigger('onSubmit', this.model, this);
    }
  },

  // Clean functions

  _destroyTags: function() {
    this.$('.js-tagsList').tagit('destroy');
  },

  clean: function() {
    this._destroyTags();
    this.elder('clean');
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],102:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);

/**
 *  Edit vis metadata dialog model
 *  to control if name and metadata
 *  are editable or not.
 *
 */

module.exports = cdb.core.Model.extend({

  defaults: {
    name: '',
    description: '',
    tags: '',
    privacy: ''
  },

  initialize: function(attrs, opts) {
    if (!opts || !opts.vis || !opts.user || !opts.dataLayer) {
      throw new Error('Visualization, user and dataLayer models are required');
    }
    this.vis = opts.vis;
    this.user = opts.user;
    this.dataLayer = opts.dataLayer;

    var data = {
      name: this.vis.get('name'),
      description: this.vis.get('description'),
      tags: this.vis.get('tags'),
      privacy: this.vis.get('privacy')
    };
    if (!this.vis.isVisualization()) {
      // Additional fields, only for dataset, w/ fallbacks for defaults
      data.source = this.vis.get('source') || '';
      data.attributions = this.vis.get('attributions') || '';
      data.license = this.vis.get('license') || '';
      data.display_name = this.vis.get('display_name') || '';
    }
    this.set(data);

    // Validation control variable
    this.validationError = '';
    this._initBinds();
  },

  _initBinds: function() {
    this.bind('valid', function() {
      this.validationError = '';
    }, this);
    this.bind('error', function(m, error) {
      this.validationError = error;
    }, this);
  },

  // Validation
  _validate: function(attrs) {
    var valid = cdb.core.Model.prototype._validate.apply(this, arguments);
    if (valid) {
      this.trigger('valid')
      return true;
    } else {
      return false;
    }
  },

  validate: function(attrs) {
    if (!attrs) return;

    if (!attrs.name) {
      return "Name can't be blank"
    }
  },

  getError: function() {
    return this.validationError;
  },

  isValid: function() {
    if (!this.validate) {
      return true;
    }
    return !this.validate(this.attributes) && this.validationError === "";
  },

  // Helper functions
  isDataset: function() {
    return !this.vis.isVisualization();
  },

  isVisEditable: function() {
    return this.vis.permission.isOwner(this.user);
  },

  isAttributeEditable: function(type) {
    if (this.vis.isVisualization()) {
      return this.isVisEditable();
    } else {
      var isReadOnly = type === "name" ? this.dataLayer.isReadOnly() : false;
      if (!this.dataLayer) {
        return false;
      } else if (this.dataLayer && (isReadOnly || !this.dataLayer.permission.isOwner(this.user))) {
        return false;
      } else {
        return true;
      }
    }
  },

  isNameEditable: function() {
    return this.isAttributeEditable('name');
  },

  isMetadataEditable: function() {
    return this.isAttributeEditable('rest');
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],103:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var BaseDialog = require('../../views/base_dialog/view');
var ViewFactory = require('../../view_factory');
var FormView = require('./edit_vis_form_view');
var EditVisMetadataModel = require('./edit_vis_metadata_dialog_model');
var randomQuote = require('../../view_helpers/random_quote');
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);


/**
 *  Edit visualization (dataset or map) dialog
 *
 */
module.exports = BaseDialog.extend({

  events: BaseDialog.extendEvents({
    'click .js-back': '_showForm'
  }),

  className: 'Dialog is-opening EditVisMetadata',

  initialize: function() {
    this.elder('initialize');

    if (!this.options.vis) {
      throw new TypeError('vis model is required');
    }

    this.vis = this.options.vis;
    this.user = this.options.user;
    this.dataLayer = this.options.dataLayer;
    this.model = new EditVisMetadataModel({}, {
      vis: this.vis,
      dataLayer: this.dataLayer,
      user: this.user
    });
    this.template = cdb.templates.getTemplate('common/dialogs/edit_vis_metadata/edit_vis_metadata_dialog');
  },

  render: function() {
    this.clearSubViews();
    BaseDialog.prototype.render.call(this);
    this.$('.content').addClass('Dialog-content--expanded');
    this._initViews();
    return this;
  },

  render_content: function() {
    var visType = this.vis.isVisualization() ? 'map' : 'dataset';
    return this.template({
      visType: visType,
      visTypeCapitalized: visType.charAt(0).toUpperCase() + visType.slice(1),
      isNameEditable: this.model.isNameEditable(),
      isMetadataEditable: this.model.isMetadataEditable()
    });
  },

  _initViews: function() {
    // Panes
    this._panes = new cdb.ui.common.TabPane({
      el: this.$('.js-content')
    });

    // Create form
    var form = new FormView({
      el: this.$('.js-form'),
      model: this.model,
      user: this.user,
      maxLength: this.options.maxLength
    });

    form.bind('onPrivacy', this._showPrivacy, this);
    form.bind('onSubmit', this._saveAttributes, this);
    this._panes.addTab('form', form.render());

    // Create loading
    this._panes.addTab('loading',
      ViewFactory.createByTemplate('common/templates/loading', {
        title: 'Saving new data...',
        quote: randomQuote()
      }).render()
    );

    // Create error
    this._panes.addTab('error',
      ViewFactory.createByTemplate('common/templates/fail', {
        msg: 'Sorry, something went wrong but you can get <button class="Button--link js-back">back to the form</button>.'
      }).render()
    );

    this._panes.active('form');
  },

  _saveAttributes: function() {
    var self = this;
    var newAttrs = _.omit(this.model.toJSON(), 'privacy');
    var oldAttrs = {
      name: this.vis.get('name'),
      description: this.vis.get('description'),
      tags: this.vis.get('tags')
    };
    if (this.model.isDataset()) {
      oldAttrs.source = this.vis.get('source');
      oldAttrs.attributions = this.vis.get('attributions');
      oldAttrs.license = this.vis.get('license');
    }

    if (!_.isEmpty(this.vis.changedAttributes(newAttrs))) {
      this._panes.active('loading');
      this.vis.save(newAttrs,{
        success: function() {
          self.options.onDone && self.options.onDone(oldAttrs.name !== newAttrs.name);
          self.hide();
        },
        error: function() {
          self.vis.set(oldAttrs);
          self._panes.active('error');
        }
      })
    } else {
      this.hide();
    }
  },

  _showPrivacy: function() {
    this.options.onShowPrivacy && this.options.onShowPrivacy();
    this.hide();
  },

  _showForm: function() {
    this._panes.active('form');
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../view_factory":209,"../../view_helpers/random_quote":212,"../../views/base_dialog/view":213,"./edit_vis_form_view":101,"./edit_vis_metadata_dialog_model":102}],104:[function(require,module,exports){
(function (global){
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var BaseDialog = require('../../views/base_dialog/view');

/**
 * shows a dialog to get the table exported
 * new ExportDialog({
 *  table: table_model
 * })
 *
 * (Migrated almost-as-is from old editor to not break functionality)
 */
module.exports = BaseDialog.extend({

  _CSV_FILTER: "SELECT * FROM (%%sql%%) as subq ",
  _MAX_SQL_GET_LENGTH: 1000,
  events: BaseDialog.extendEvents({
    'click .js-option:not(.is-disabled)': '_export'
  }),

  /**
   * Allowed formats on the exporter
   * @type {Array}
   */
  formats: [
    {format: 'csv', fetcher: 'fetchCSV', geomRequired: false, illustrationIconModifier: 'IllustrationIcon--neutral' },
    {format: 'shp', fetcher: 'fetch', geomRequired: true, illustrationIconModifier: 'IllustrationIcon--magenta' },
    {format: 'kml', fetcher: 'fetch', geomRequired: true, illustrationIconModifier: 'IllustrationIcon--sunrise' },
    {format: 'geojson', label: 'geo json', fetcher: 'fetch', geomRequired: true, illustrationIconModifier: 'IllustrationIcon--cyan' },
    {format: 'svg', fetcher: 'fetchSVG', geomRequired: true, illustrationIconModifier: 'IllustrationIcon--royalDark' }
  ],

  initialize: function() {
    _.extend(this.options, {
      clean_on_hide: true,
      table_id: this.model.id
    });
    this.elder('initialize');
    _.bindAll(this, '_export');
    this.baseUrl = cdb.config.getSqlApiUrl();
    this.model.bind('change:geometry_types', this.refresh, this);
  },

  /**
   * search a format based on its name in the format array
   * @param  {string} format Format name
   * @return {Object}
   */
  getFormat: function(format) {
    for(var n in this.formats) {
      if(this.formats[n].format === format) {
        return this.formats[n]
      }
    }
  },

  /**
   * Answer to button event and lauchn the export method associated to that format
   * @param  {Event} ev
   */
  _export: function(ev) {
    this.killEvent(ev);
    var $button = $(ev.currentTarget);
    var formatName = $button.data('format');
    var format = this.getFormat(formatName);
    this[format.fetcher](formatName);
  },


  /**
   * Create a dictionary with the options shared between all the methods
   * @return {Object}
   */
  getBaseOptions: function() {
    var options = {};
    options.filename = this.model.get('name');

    if (this.options.user_data) {
      options.api_key = this.options.user_data.api_key;
    }

    return options;
  },

  /**
   * Returns the base sql to retrieve the data
   * @return {string}
   */
  getPlainSql: function() {
    if(this.options.sql) {
      sql = this.options.sql;
    } else {
      if(this.model.sqlView) {
        sql = this.model.sqlView.getSQL();
      } else {
        sql = "select * from " + this.model.get('name')
      }
    }
    return sql;
  },

  /**
   * Returns a specific sql filtered by the_geom, used on CSV exports
   * @return {string}
   */
  getGeomFilteredSql: function() {
    var sql = this.getPlainSql();
    // if we have "the_geom" in our current schema, we apply a custom sql
    if(this.model.isGeoreferenced()) {
      return this._CSV_FILTER.replace(/%%sql%%/g, sql);
    }
    // Otherwise, we apply regular sql
    return sql;
  },

  /**
   * Populates the hidden form with the format related values and submits them to get the file
   * @param  {Object} options Base options
   * @param  {String} sql Sql of the document to be retrieved
   */
  _fetch: function(options, sql) {
    this._showElAndHideRest('.js-preparing-download');
    this.$('.format').val(options.format);
    this.$('.q').val(sql);
    this.$('.filename').val(options.filename);
    this.$('.api_key').val(options.api_key);

    if (options.format === 'csv') {
      this.$('.skipfields').val("the_geom_webmercator");
    } else {
      this.$('.skipfields').val("the_geom,the_geom_webmercator");
    }

    if (window.user_data && window.user_data.email) {
      // Event tracking "Exported table data"
      cdb.god.trigger('metrics', 'export_table', {
        email: window.user_data.email
      });
    }

    // check if the sql is big or not, and send the request as a verb or other. This is a HACK.
    if (sql.length < this._MAX_SQL_GET_LENGTH) {
      var location = this.$('form').attr('action') + '?' + this.$('form').serialize()
      this._fetchGET(location);
    } else {
      // I can't find a way of making the iframe trigger load event when its get a form posted,
      // so we need to leave like it was until
      this.submit();
    }

    this.$('.db').attr('disabled', 'disabled');
    this.$('.skipfields').attr('disabled', 'disabled');

    if (this.options.autoClose) {
      this.close();
      this.trigger('generating', this.$('.js-preparing-download').html());
    }

  },

  showError: function(error) {
    this.$('.js-error').html(
      this.getTemplate('common/templates/fail')({
        msg: error
      })
    );
    this._showElAndHideRest('.js-error');
  },

  _fetchGET: function(url) {
    function getError(content) {
      // sql api returns a json when it fails
      // but if the browser is running some plugin that
      // formats it, the window content is the html
      // so search for the word "error"
      var error = null;
      try {
        var json = JSON.parse(content);
        error = json.error[0];
      } catch(e) {
        if (content && content.indexOf('error') !== -1) {
          error = "an error occurred";
        }
      }
      return error;
    }

    var self = this;
    var checkInterval;

    var w = window.open(url);
    w.onload = function() {
      clearInterval(checkInterval);
      var error = getError(w.document.body.textContent);
      if(error) {
        self.showError(error);
      } else {
        self.close();
      }
      w.close();
    };
    window.focus();
    checkInterval = setInterval(function check() {
      // safari needs to check the body because it never
      // calls onload
      if (w.closed || (w.document && w.document.body.textContent.length === 0)) {
        self.close();
        clearInterval(checkInterval);
      }
    }, 100);
  },

  /**
   * Submits the form. This method is separated to ease the testing
   */
  submit: function() {
    this.$('form').submit();
  },

  /**
   * Base fetch, for the formats that don't require special threatment
   * @param  {String} formatName
   */
  fetch: function(formatName) {
    var options = this.getBaseOptions();
    options.format = formatName;
    var sql = this.getPlainSql();
    this._fetch(options, sql);
  },

  /**
   * Gets the options needed for csv format and fetch the document
   * @param  {String} formatName
   */
  fetchCSV: function() {
    var options = this.getBaseOptions();
    options.format = 'csv';
    var sql = this.getGeomFilteredSql();
    this.$('.skipfields').removeAttr('disabled');
    this._fetch(options, sql);
  },
  /**
   * Gets the options needed for svg format and fetch the document
   * @param  {String} formatName
   */
  fetchSVG: function(){
    this.$('.db').removeAttr('disabled');
    this.fetch('svg');
  },
  /**
   * Returns the html populated with current data
   * @return {String}
   */
  render_content: function() {
    var isGeoreferenced = this.model.isGeoreferenced();
    if (_.isBoolean(isGeoreferenced)) {
      return this.getTemplate('common/dialogs/export/export_template')({
        preparingDownloadContent: this._renderLoadingContent('We are preparing your download. Depending on the size, it could take some time.'),
        formats: this.formats,
        url: this.baseUrl,
        isGeoreferenced: isGeoreferenced
      });
    } else {
      return this._renderLoadingContent('Checking georeferences…');
    }
  },

  refresh: function() {
    this.$('.content').html(this.render_content());
  },

  _renderLoadingContent: function(title) {
    return this.getTemplate('common/templates/loading')({
      title: title,
      quote: cdb.editor.randomQuote()
    });
  },

  _showElAndHideRest: function(classNameToShow) {
    [
      '.js-start',
      '.js-preparing-download',
      '.js-error'
    ].forEach(function(className) {
      this.$(className)[ className === classNameToShow ? 'show' : 'hide' ]();
    }, this);
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../views/base_dialog/view":213}],105:[function(require,module,exports){
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

},{"../../view_helpers/random_quote":212,"../../views/base_dialog/view":213}],106:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);

/**
 *  Add column view
 *
 */

module.exports = cdb.core.View.extend({

  className: 'AddColumn js-addField',

  events: {
    'click .js-addColumn': '_addColumn'  
  },

  initialize: function() {
    this.model = new cdb.core.Model({
      state: 'idle'
    });
    this.table = this.options.table;
    this.template = cdb.templates.getTemplate('common/dialogs/feature_data/add_column/add_column');
    this._initBinds();
  },

  render: function() {
    this.$el.html(
      this.template({
        state: this.model.get('state')
      })
    )
    return this;
  },

  _initBinds: function() {
    this.model.bind('change:state', this.render, this);
  },

  _addColumn: function() {
    var self = this;
    // Loading
    this.model.set('state', 'loading');

    this.table.addColumn('column_' + new Date().getTime(), 'string', {
      success: function(mdl, data) {
        self.trigger('newColumn', mdl, this);
        self.model.set('state', 'idle');
      },
      error: function() {
        self.model.set('state', 'error');
      }
    });
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],107:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var BaseDialog = require('../../views/base_dialog/view');
var FormView = require('./form_view');
var ViewFactory = require('../../view_factory');
var randomQuote = require('../../view_helpers/random_quote');
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);


/**
 *  Feature data edition dialog
 */
module.exports = BaseDialog.extend({

  events: BaseDialog.extendEvents({
    'click .js-back': '_showForm'
  }),

  className: 'Dialog is-opening FeatureData',

  initialize: function() {
    this.elder('initialize');

    if (!this.options.table) {
      throw new TypeError('table is required');
    }

    this.row = this.options.row;
    this.table = this.options.table;
    this.baseLayer = this.options.baseLayer;
    this.dataLayer = this.options.dataLayer;
    this.provider = this.options.provider;
    this.currentZoom = this.options.currentZoom;
    this.user = this.options.user;
    this._template = cdb.templates.getTemplate('common/dialogs/feature_data/feature_data_dialog');
  },

  render: function() {
    this.clearSubViews();
    BaseDialog.prototype.render.call(this);
    this.$('.content').addClass('Dialog-content--expanded');
    this._initViews();
    return this;
  },

  render_content: function() {
    return this._template({
      featureType: this.row.getFeatureType(),
      quote: randomQuote()
    });
  },

  _initViews: function() {
    var self = this;

    // Panes
    this._panes = new cdb.ui.common.TabPane({
      el: this.$('.js-content')
    });

    // Create map
    setTimeout(function() {
      self._createPreviewMap()
    }, 200);

    // Create form
    this.form = new FormView({
      el: this.$('.js-form'),
      table: this.table,
      row: this.row
    });

    this.form.bind('onSubmit', this._changeAttributes, this);
    this.form.bind('onError', this._scrollToError, this);
    this._panes.addTab('form', this.form.render());

    this.addView(this.form);

    // Create loading
    this._panes.addTab('loading',
      ViewFactory.createByTemplate('common/templates/loading', {
        title: 'Saving new data...',
        quote: randomQuote()
      }).render()
    );

    // Create error
    this._panes.addTab('error',
      ViewFactory.createByTemplate('common/templates/fail', {
        msg: 'Sorry, something went wrong but you can get <button class="Button--link js-back">back to the form</button>.'
      }).render()
    );

    this._panes.active('form');
  },

  _scrollToError: function(mdl) {
    this.$('.js-content').animate({
      scrollTop: ( this.$(".EditField-label[value='" + mdl.get('attribute') + "']").position().top - 20 )
    });
  },

  _changeAttributes: function(attrs) {
    var self = this;
    var newData = _.object(_.pluck(attrs, 'attribute'), _.pluck(attrs, 'value'));
    var oldData = {};

    // Change state
    this._panes.active('loading');

    // Unset columns already not present in the
    // new form data
    _.each(this.row.attributes, function(val, key) {
      if (newData[key] === undefined && !cdb.admin.Row.isReservedColumn(key) && key !== "id") {
        self.row.unset(key) 
      }
      oldData[key] = val;
    });

    if (!_.isEmpty(this.row.changedAttributes(newData))) {
      // Save new attributes
      this.row.save(newData, {
        success: function() {
          self._ok();
        },
        error: function() {
          self.row.set(oldData);
          self._panes.active('error');
        }
      });
    } else {
      self._cancel();
    }
  },

  _createPreviewMap: function() {
    var self = this;

    // Create map
    var div = this.$('.js-map');

    var mapViewClass = cdb.admin.LeafletMapView;
    if (this.provider === 'googlemaps') {
      var mapViewClass = cdb.admin.GoogleMapsMapView;
    }

    // New map
    this.map = new cdb.admin.Map();

    this.mapView = new mapViewClass({
      el: div,
      map: this.map,
      user: this.user
    });

    // Base layer
    this.baseLayer.set('attribution', '');
    this.map.addLayer(this.baseLayer);

    // Data layer
    this.dataLayer.set('query', 'SELECT * FROM ' + this.table.get('name') + ' WHERE cartodb_id=' + this.row.get('cartodb_id'));
    this.dataLayer.set('attribution', '');
    this.map.addLayer(this.dataLayer);

    // Set bounds
    var sql = new cdb.admin.SQL({
      user: this.user.get('username'),
      api_key: this.user.get('api_key')
    });
    sql.getBounds('SELECT * FROM ' + this.table.get('name') + ' WHERE cartodb_id=' + this.row.get('cartodb_id')).done(function(r) {
      if (r) {
        if (r[0][0] === r[1][0] && r[0][1] === r[1][1]) {
          // Point geometry
          self.map.setCenter(r[0]);
        } else {
          // Rest of geometries
          self.map.setBounds(r);
        }
        self.map.setZoom(self.currentZoom);
      }
    });
  },

  _showForm: function() {
    this._panes.active('form');
  },

  _ok: function() {
    this.options.onDone && this.options.onDone();
    this.elder('_ok');
  },

  _cancel: function() {
    this.elder('_cancel');
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../view_factory":209,"../../view_helpers/random_quote":212,"../../views/base_dialog/view":213,"./form_view":110}],108:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var Backbone = (typeof window !== "undefined" ? window['Backbone'] : typeof global !== "undefined" ? global['Backbone'] : null);

/**
 *  Collection with all fields model
 *  included.
 *
 */

module.exports = Backbone.Collection.extend({

  isValid: function() {
    return !this.getInvalid();
  },

  getInvalid: function() {
    return this.find(function(mdl) {
      return !mdl.isValid()
    });
  }

})
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],109:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var StringFieldView = require('../../../edit_fields/string_field/string_field_view');
var NumberFieldView = require('../../../edit_fields/number_field/number_field_view');
var BooleanFieldView = require('../../../edit_fields/boolean_field/boolean_field_view');
var DateFieldView = require('../../../edit_fields/date_field/date_field_view');

/**
 *  Form field view for edit feature metadata
 *
 */

module.exports = cdb.core.View.extend({

  events: {
    'keydown .js-columnName': '_onInputChange',
    'focusout .js-columnName': '_onColNameChange',
  },

  _FIELD_VIEW: {
    'string': StringFieldView,
    'number': NumberFieldView,
    'boolean': BooleanFieldView,
    'date': DateFieldView,
    'timestamp with time zone': DateFieldView,
    'timestamp without time zone': DateFieldView
  },

  initialize: function() {
    this.model = new cdb.core.Model({
      columnError: '',
      typeError: '',
      fieldError: ''
    });
    this.table = this.options.table;
    this.row = this.options.row;
    this.fieldModel = this.options.fieldModel;
    this.template = cdb.templates.getTemplate('common/dialogs/feature_data/form_field/form_field');
    this._initBinds();
  },

  render: function() {
    this.clearSubViews();
    this.$el.html(
      this.template({
        type: this.fieldModel.get('type'),
        value: this.fieldModel.get('value'),
        attribute: this.fieldModel.get('attribute'),
        readOnly: this.fieldModel.get('readOnly'),
        typeError: this.model.get('typeError'),
        columnError: this.model.get('columnError')
      })
    );
    this._initViews();
    return this;
  },

  _initBinds: function() {
    this.fieldModel.bind('change:readOnly', this.render, this);
    this.fieldModel.bind('change:type', this._onTypeChanged, this);
    this.add_related_model(this.fieldModel);
  },

  _initViews: function() {
    var self = this;

    // Field view
    var editorField = this._FIELD_VIEW[this.fieldModel.get('type')] || this._FIELD_VIEW['string'];
    var v = new editorField({
      readOnly: this.fieldModel.get('readOnly'),
      model: this.fieldModel
    }).bind('onSubmit', function(e) {
      this.trigger('onSubmit');
    }, this);

    this.$('.js-editField').append(v.render().el);
    this.addView(v);

    // Field tooltip
    var fieldTooltip = new cdb.common.TipsyTooltip({
      el: this.$('.js-editField'),
      title: function() {
        return self.fieldModel.getError()
      }
    });
    this.addView(fieldTooltip);

    // Column type combo
    // Current value has to be available in the extra array,
    // if not select will place first item as value
    var types = [this.fieldModel.get('type')].concat(_.filter(['string', 'boolean', 'number', 'date'], function(type){
      return self.table.isTypeChangeAllowed(self.fieldModel.get('attribute'), type)
    }));
    var combo = new cdb.forms.Combo({
      el: this.$('.js-fieldType'),
      model: this.fieldModel,
      property: 'type',
      disabled: this.fieldModel.get('readOnly'),
      width: '85px',
      extra: types
    });

    this.$(".js-fieldType").append(combo.render());
    combo.bind('change', function(type) {
      this.fieldModel.set({
        value: null,
        type: type
      })
    }, this);
    this.addView(combo);

    // Column type tooltip
    var typeTooltip = new cdb.common.TipsyTooltip({
      el: this.$('.js-fieldType'),
      title: function() {
        return self.model.get('typeError')
      }
    });
    this.addView(typeTooltip);

    // Column name tooltip
    var typeTooltip = new cdb.common.TipsyTooltip({
      el: this.$('.js-columnName'),
      title: function() {
        return self.model.get('columnError');
      }
    });
    this.addView(typeTooltip);
  },

  _onTypeChanged: function() {
    var self = this;
    var previousType = this.fieldModel.previous('type');
    var previousValue = this.fieldModel.previous('value');

    this.model.set('typeError', '');

    // Readonly everything
    this.fieldModel.set('readOnly', true);

    this.table.changeColumnType(this.fieldModel.get('attribute'), this.fieldModel.get('type'), {
      success: function() {
        // refresh record data after change
        // readOnly to false
        self._refreshRecordData(function() {
          self.fieldModel.set('readOnly', false);
        })
      },
      error: function() {
        // Avoiding silent:true and the event trigger
        // when other attribute is changed
        self.fieldModel.attributes.readOnly = false;
        self.fieldModel.attributes.value = previousValue;
        self.fieldModel.attributes.type = previousType;

        try {
          var msg = JSON.parse(e.responseText).errors[0];
          self.model.set('typeError', msg);
        } catch (e) {}
        self.render();
      }
    });
  },

  _onInputChange: function(ev) {
    if (ev.keyCode === 13) {
      $(ev.target).blur();
      this.killEvent(ev);
    }
  },

  _onColNameChange: function(ev) {
    var self = this;
    var val = $(ev.target).val();
    var oldVal = this.fieldModel.get('attribute');
    
    if (oldVal !== val) {
      this.fieldModel.set({
        attribute: val,
        readOnly: true
      });

      this.table.renameColumn(oldVal, val, {
        success: function(mdl, data) {
          self.model.set('columnError', '');
          self.fieldModel.set({
            attribute: data.name,
            readOnly: false
          });
        },
        error: function(mdl, err) {
          try {
            var msg = JSON.parse(err.responseText).errors[0];
            self.model.set('columnError', msg);
          } catch (e) {}
          self.fieldModel.set({
            attribute: oldVal,
            readOnly: false
          });
        }
      });
    }
  },

  _refreshRecordData: function(onComplete) {
    var self = this;

    this.row.fetch({
      success: function(r) {
        var newValue = r && r.rows[0] && r.rows[0][self.fieldModel.get('attribute')];
        self.fieldModel.set('value', newValue);
        onComplete && onComplete();
      },
      error: function() {
        onComplete && onComplete();
      }
    })
  },
  
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../../edit_fields/boolean_field/boolean_field_view":194,"../../../edit_fields/date_field/date_field_view":195,"../../../edit_fields/number_field/number_field_view":201,"../../../edit_fields/string_field/string_field_view":202}],110:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var FormFieldView = require('./form_field/form_field_view');
var AddColumnView = require('./add_column/add_column_view');
var EditFieldModel = require('../../edit_fields/edit_field_model');
var FormCollection = require('./form_collection');
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);

/**
 *  Form view for edit feature metadata
 *
 */

module.exports = cdb.core.View.extend({

  events: {
    'click .js-submit': '_onSubmit',
    'submit': '_onSubmit'
  },

  initialize: function() {
    this.model = new cdb.core.Model({ state: 'idle' });
    this.table = this.options.table;
    this.row = this.options.row;
    this.collection = new FormCollection();
    this._generateCollection();
  },

  render: function() {
    this.clearSubViews();
    this._newColumn();
    this.collection.each(this._renderField, this);
    return this;
  },

  _generateCollection: function() {
    var self = this;
    var tableSchema = this.table.get('schema');
    var hiddenColumns = this.table.hiddenColumns;

    _.each(tableSchema, function(pair) {
      if (!_.contains(hiddenColumns, pair[0])) {
        var mdl = self._generateModel(pair[0], pair[1], self.row.get(pair[0]));
        self.collection.add(mdl);
      }
    });
  },

  _generateModel: function(column, type, value) {
    return new EditFieldModel({
      attribute: column,
      value: value,
      type: type
    });
  },

  _renderField: function(mdl) {
    var v = new FormFieldView({
      fieldModel: mdl,
      table: this.table,
      row: this.row
    });
    this.$('.js-addField').before(v.render().el);
    v.bind('onSubmit', this._onSubmit, this);
    this.addView(v);
  },

  _newColumn: function() {
    var newColumn = new AddColumnView({ table: this.table });
    newColumn.bind('newColumn', function(d){
      // add it to the form
      var mdl = this._generateModel(d.get('_name'), d.get('type'), null);
      this.collection.add(mdl);
      this._renderField(mdl);
    }, this);
    this.addView(newColumn);
    this.$el.append(newColumn.render().el);
  },

  _onSubmit: function(ev) {
    this.killEvent(ev);
    
    // Check if all models are valid, if so
    // let's go my buddy!
    var invalid = this.collection.getInvalid();
    if (!invalid) {
      var attrs = this.collection.toJSON();
      this.trigger('onSubmit', attrs, this);
    } else {
      this.trigger('onError', invalid, this);
    }
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../edit_fields/edit_field_model":199,"./add_column/add_column_view":106,"./form_collection":108,"./form_field/form_field_view":109}],111:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var Backbone = (typeof window !== "undefined" ? window['Backbone'] : typeof global !== "undefined" ? global['Backbone'] : null);
var StepsView = require('./steps_view');
var RowModel = require('./row_model');
var DefaultFooterView = require('./default_footer_view');
var ViewFactory = require('../../view_factory');

/**
 * Model for the administrative regions georeference option.
 */
module.exports = cdb.core.Model.extend({

  TAB_LABEL: 'Admin. Regions',
  KIND: 'admin1',

  defaults: {
    step: 0,
    columns: []
  },

  initialize: function(attrs) {
    if (!attrs.geocodeStuff) throw new Error('geocodeStuff is required');
    if (!attrs.columnsNames) throw new Error('columnsNames is required');
    if (!attrs.columns) throw new Error('columns is required');
  },

  createView: function() {
    this._initRows();
    this._setStateForFirstStep();

    return ViewFactory.createByList([
      new StepsView({
        title: 'Select the column that has Administrative Regions',
        desc: "Georeference your data by country, state, province or municipality",
        model: this
      }),
      new DefaultFooterView({
        model: this
      })
    ]);
  },

  assertIfCanContinue: function() {
    var value = this.get('step') === 0 ? this._columnNameValue() : this.get('geometryType');
    this.set('canContinue', !!value);
  },

  continue: function() {
    if (this.get('step') === 0) {
      this._setStateForSecondStep();
    } else {
      this._geocode();
    }
  },

  goBack: function() {
    this._setStateForFirstStep();
  },

  availableGeometriesFetchData: function() {
    return this.get('geocodeStuff').availableGeometriesFetchData(this.KIND, this._locationValue(), this._isLocationFreeText());
  },

  _setStateForFirstStep: function() {
    this.set({
      step: 0,
      canGoBack: false,
      canContinue: false,
      hideFooter: false
    });
    this.get('rows').invoke('unset', 'value');
  },

  _setStateForSecondStep: function() {
    this.set({
      step: 1,
      canGoBack: true,
      canContinue: false,
      hideFooter: true,
      geometryType: ''
    });
  },

  _initRows: function() {
    var rows = new Backbone.Collection([
      new RowModel({
        comboViewClass: 'Combo',
        label: 'Select Your Region Name',
        placeholder: 'Select column',
        data: this.get('columnsNames')
      }),
      new RowModel({
        label: "Select Your Country Data",
        data: this.get('columns')
      })
    ]);
    this.set('rows', rows);
  },

  _geocode: function() {
    var geocodeStuff = this.get('geocodeStuff');
    var locationValue = this._locationValue();
    var isLocationFreeText = this._isLocationFreeText();

    var d = geocodeStuff.geocodingChosenData({
      type: 'admin',
      kind: geocodeStuff.isLocationWorld(locationValue, isLocationFreeText, true) ? 'admin0' : this.KIND, // migrated from old code, unclear why this is needed
      location: locationValue,
      column_name: this._columnNameValue(),
      geometry_type: this.get('geometryType')
    }, isLocationFreeText, true);

    this.set('geocodeData', d);
  },

  _columnNameValue: function() {
    return this.get('rows').first().get('value');
  },

  _locationValue: function() {
    return this._location().get('value');
  },

  _isLocationFreeText: function() {
    return this._location().get('isFreeText');
  },

  _location: function() {
    return this.get('rows').last();
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../view_factory":209,"./default_footer_view":114,"./row_model":122,"./steps_view":125}],112:[function(require,module,exports){
(function (global){
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var GeometryItemView = require('./geometry_item_view');
var ViewFactory = require('../../view_factory');
var randomQuote = require('../../view_helpers/random_quote');

/**
 * View to select which geometry type to use for georeference process.
 */
module.exports = cdb.core.View.extend({

  initialize: function() {
    this.availableGeometries = new cdb.admin.Geocodings.AvailableGeometries();

    this._initBinds();
    this._fetchAvailableGeometries();
  },

  render: function() {
    this.clearSubViews();
    this.$el.html(
      this.getTemplate('common/dialogs/georeference/choose_geometry')()
    );
    _.each(
      this.availableGeometries.get('available_geometries') ? this._createItemsViews() : [this._createLoadingView()],
      this._appendView, this
    );
    return this;
  },

  _appendView: function(view) {
    this.addView(view);
    this.$('.js-items').append(view.render().el);
  },

  _createItemsViews: function() {
    return [
      this._createItemView({
        type: 'point',
        titles: {
          available: 'Georeference your data with points',
          unavailable: 'No point data available for your selection'
        }
      }),
      this._createItemView({
        type: 'polygon',
        titles: {
          available: 'Georeference your data with administrative regions',
          unavailable: 'No polygon data available for your selection.',
          learnMore: "Sorry, we don't have polygons available for the datatype you are trying to geocode. " +
            'For example, if you are geocoding placenames we can only give you points for where those places exist.'
        }
      })
    ];
  },

  _createItemView: function(d) {
    return new GeometryItemView(_.extend({
      model: this.model,
      availableGeometries: this.availableGeometries
    }, d));
  },

  _createLoadingView: function() {
    return ViewFactory.createByTemplate('common/templates/loading', {
      title: 'Checking for available geometries…',
      quote: randomQuote()
    });
  },

  _initBinds: function() {
    this.availableGeometries.bind('change:available_geometries', this.render, this);
    this.add_related_model(this.availableGeometries);
  },

  _fetchAvailableGeometries: function() {
    this.availableGeometries.fetch({
      data: this.model.availableGeometriesFetchData()
    });
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../view_factory":209,"../../view_helpers/random_quote":212,"./geometry_item_view":116}],113:[function(require,module,exports){
(function (global){
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var Backbone = (typeof window !== "undefined" ? window['Backbone'] : typeof global !== "undefined" ? global['Backbone'] : null);
var StepsView = require('./steps_view');
var RowModel = require('./row_model');
var DefaultFooterView = require('./default_footer_view');
var ViewFactory = require('../../view_factory');

/**
 * Model for the city names georeference option.
 */
module.exports = cdb.core.Model.extend({

  TAB_LABEL: 'City Names',
  KIND: 'namedplace',

  defaults: {
    step: 0,
    columns: []
  },

  initialize: function(attrs) {
    if (!attrs.geocodeStuff) throw new Error('geocodeStuff is required');
    if (!attrs.columnsNames) throw new Error('columnsNames is required');
    if (!attrs.columns) throw new Error('columns is required');
  },

  createView: function() {
    this._initRows();
    this._setStateForFirstStep();

    return ViewFactory.createByList([
      new StepsView({
        title: "Select the column that contains the City's Name",
        desc: 'No matter the type of the columns you select, we will transform them to number for georeferencing.',
        model: this
      }),
      new DefaultFooterView({
        model: this
      })
    ]);
  },

  assertIfCanContinue: function() {
    var value = this.get('step') === 0 ? this._columnNameValue() : this.get('geometryType');
    this.set('canContinue', !!value);
  },

  continue: function() {
    if (this.get('step') === 0) {
      this._setStateForSecondStep();
    } else {
      this._geocode();
    }
  },

  goBack: function() {
    this._setStateForFirstStep();
  },

  availableGeometriesFetchData: function() {
    return this.get('geocodeStuff').availableGeometriesFetchData(this.KIND, this._locationValue(), this._isLocationFreeText());
  },

  _setStateForFirstStep: function() {
    this.set({
      step: 0,
      canGoBack: false,
      canContinue: false,
      hideFooter: false
    });
  },

  _setStateForSecondStep: function() {
    this.set({
      step: 1,
      canGoBack: true,
      canContinue: false,
      hideFooter: true,
      geometryType: ''
    });
  },

  _geocode: function() {
    var d = this.get('geocodeStuff').geocodingChosenData({
      type: 'city',
      kind: this.KIND,
      location: this._locationValue(),
      column_name: this._columnNameValue(),
      geometry_type: this.get('geometryType')
    }, this._isLocationFreeText(), true);

    var region = this._regionValue();
    if (!_.isEmpty(region)) {
      d.region = region;
      d.region_text = this._isRegionFreeText();
    }

    this.set('geocodeData', d);
  },

  _initRows: function() {
    var rows = new Backbone.Collection([
      new RowModel({
        comboViewClass: 'Combo',
        label: 'In which column are your city names stored?',
        placeholder: 'Select column',
        data: this.get('columnsNames')
      }),
      new RowModel({
        label: "Admin. Region where city's located, if known",
        data: this.get('columns')
      }),
      new RowModel({
        label: "Country where city's located, if known",
        data: this.get('columns')
      })
    ]);
    this.set('rows', rows);
  },

  _columnNameValue: function() {
    return this.get('rows').first().get('value');
  },

  _regionValue: function() {
    return this._region().get('value');
  },

  _isRegionFreeText: function() {
    return this._region().get('isFreeText');
  },

  _region: function() {
    return this.get('rows').at(1); // 2nd row
  },

  _locationValue: function() {
    return this._location().get('value');
  },

  _isLocationFreeText: function() {
    return this._location().get('isFreeText');
  },

  _location: function() {
    return this.get('rows').last();
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../view_factory":209,"./default_footer_view":114,"./row_model":122,"./steps_view":125}],114:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);

/**
 * View for the default footer
 */
module.exports = cdb.core.View.extend({

  events: {
    'click .js-force-all-rows': '_onClickForceAllRows'
  },

  initialize: function() {
    this._initBinds();
  },

  render: function() {
    this.$el.html(
      this.getTemplate('common/dialogs/georeference/default_footer')()
    );
    return this;
  },

  _initBinds: function() {
    this.model.bind('change:canContinue', this._onChangeCanContinue, this);
    this.model.bind('change:hideFooter', this._onChangeHideFooter, this);

    var geocodeStuff = this._geocodeStuff();
    geocodeStuff.bind('change:forceAllRows', this._onChangeForceAllRows, this);
    this.add_related_model(geocodeStuff);
  },

  _onChangeCanContinue: function(m, canContinue) {
    this.$('.ok').toggleClass('is-disabled', !canContinue);
  },

  _onChangeHideFooter: function(m, hideFooter) {
    this.$el.toggle(!hideFooter);
  },

  _onChangeForceAllRows: function(m, hasForceAllRows) {
    this.$('.js-force-all-rows button').toggleClass('is-checked', !!hasForceAllRows);
  },

  _onClickForceAllRows: function(ev) {
    this.killEvent(ev);
    var m = this._geocodeStuff();
    m.set('forceAllRows', !m.get('forceAllRows'));
  },

  _geocodeStuff: function() {
    return this.model.get('geocodeStuff');
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],115:[function(require,module,exports){
(function (global){
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);

/**
 * Simple object for common logic in the georeference modal, e.g. for available geometries, and
 * creating chosen geocoding data, etc.
 */
module.exports = cdb.core.Model.extend({

  defaults: {
    tableName: undefined,
    forceAllRows: false
  },

  initialie: function(attrs) {
    if (!attrs.tableName) throw new Error('tableName is required');
  },

  /**
   * @param {String} kind
   * @param {String} location
   * @param {Boolean} isLocationFreeText
   * @return {Object} hash
   */
  availableGeometriesFetchData: function(kind, location, isLocationFreeText) {
    if (!kind) throw new Error('kind is required');

    var d = {
      kind: kind
    };

    if (_.isEmpty(location)) {
      d.free_text = 'World';
    } else {
      if (isLocationFreeText) {
        d.free_text = location;
      } else {
        d.column_name = location;
        d.table_name = this.get('tableName');
      }
    }

    return d;
  },

  // @return {Boolean} true if location is considered a "world" geocoding search value.
  isLocationWorld: function(location, isFreeText, useFallbackIfLocationIsMissing) {
    var isLocationMissingAndShouldFallback = (location === undefined && useFallbackIfLocationIsMissing);
    var isWorld = location === '' || isLocationMissingAndShouldFallback;
    return isWorld || (!!isFreeText && location.search('world') !== -1);
  },

  /**
   * Creates the expected data for the 'geocodingChosen' event on the cdb.god model.
   * Adheres to the existing workflow and was extracted from old views.
   * @param {Object} d
   * @param {Boolean} isLocationFreeText true if location prop was created through a free-text input field, and
   *  false if matches a column name on the table
   * @param {Boolean} useFallbackIfLocationIsMissing true if should use fallback value for a missing location value.
   * @return {Object}
   */
  geocodingChosenData: function(d, isLocationFreeText, useFallbackIfLocationIsMissing) {
    d.table_name = this.get('tableName');

    if (this.isLocationWorld(d.location, isLocationFreeText, useFallbackIfLocationIsMissing)) {
      d.location = 'world';
      d.text = true; // Set free text
    } else if (_.isBoolean(isLocationFreeText) && isLocationFreeText) {
      d.text = true;
    }

    if (this.get('forceAllRows')) {
      d.force_all_rows = true;
    }

    return d;
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],116:[function(require,module,exports){
(function (global){
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);

/**
 * View for an individual geometry type
 */
module.exports = cdb.core.View.extend({

  className: 'OptionCard OptionCard--blocky',

  events: {
    'click': '_onClick'
  },

  initialize: function() {
    if (!this.options.type) cdb.log.error('type is required');
    if (!this.options.titles) cdb.log.error('titles is required');
    if (!this.options.titles.available) cdb.log.error('titles.available is required');
    if (!this.options.titles.unavailable) cdb.log.error('titles.unavailable is required');
    this.availableGeometries = this.options.availableGeometries;
    this._initBinds();
  },

  render: function() {
    this.clearSubViews();

    this.$el.html(
      this.getTemplate('common/dialogs/georeference/geometry_item_' + this.options.type)({
      })
    );

    this._onChangeAvailableGeometries();

    return this;
  },

  _initBinds: function() {
    this.availableGeometries.bind('change:available_geometries', this._onChangeAvailableGeometries, this);
    this.add_related_model(this.availableGeometries);

    this.model.bind('change:geometryType', this._onChangeGeometryType, this);
  },

  _onChangeGeometryType: function(m, type) {
    this.$el.toggleClass('is-selected', type === this.options.type);
  },

  _onChangeAvailableGeometries: function() {
    var isAvailable = this._isAvailable();

    this.$el.toggleClass('OptionCard--static', !isAvailable);
    this.$('.js-icon').toggleClass('u-disabled', !isAvailable);
    this.$('.js-warning').toggle(!isAvailable);
    this.$('.js-title')
      .toggleClass('u-disabled', !isAvailable)
      .text(this.options.titles[isAvailable ? 'available' : 'unavailable']);
  },

  _onClick: function(ev) {
    this.killEvent(ev);
    if (this._isAvailable()) {
      this.model.set('geometryType', this.options.type);
      this.model.continue();
    }
  },

  _isAvailable: function() {
    return _.contains(this.availableGeometries.get('available_geometries'), this.options.type);
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],117:[function(require,module,exports){
(function (global){
var Backbone = (typeof window !== "undefined" ? window['Backbone'] : typeof global !== "undefined" ? global['Backbone'] : null);
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var LonLatColumnsModel = require('./lon_lat_columns_model');
var CityNamesModel = require('./city_names_model');
var AdminRegionsModel = require('./admin_regions_model');
var PostalCodesModel = require('./postal_codes_model');
var IpAddressesModel = require('./ip_addresses_model');
var StreetAddressesModel = require('./street_addresses/street_addresses_model');
var GeocodeStuffModel = require('./geocode_stuff_model');
var UserGeocodingModel = require('./user_geocoding_model');

/**
 * View model for merge datasets view.
 */
module.exports = cdb.core.Model.extend({

  _EXCLUDED_COLUMN_NAMES: ['cartodb_id', 'the_geom', 'updated_at', 'created_at', 'cartodb_georef_status'],
  _ALLOWED_COLUMN_TYPES: ['string', 'number', 'boolean', 'date'],

  defaults: {
    options: undefined // Collection, created with model
  },

  initialize: function(attrs) {
    if (!attrs.table) throw new Error('table is required');
    if (!attrs.user) throw new Error('user is required');
    this._initGeocodeStuff();
    this._initOptions();
  },

  changedSelectedTab: function(newTab) {
    this.get('options').chain()
      .without(newTab).each(this._deselect);
  },

  createView: function() {
    return this._selectedTabModel().createView();
  },

  canContinue: function() {
    return this._selectedTabModel().get('canContinue');
  },

  continue: function() {
    if (this.canContinue()) {
      this._selectedTabModel().continue();
    }
  },

  canGoBack: function() {
    return this._selectedTabModel().get('canGoBack');
  },

  goBack: function() {
    if (this.canGoBack()) {
      this._selectedTabModel().goBack();
    }
  },

  _selectedTabModel: function() {
    return this.get('options').find(this._isSelected);
  },

  _columnsNames: function() {
    // Maintained old logic, so for some reason the column types filter is not applied for the places where the column names are usd
    return _.chain(this.get('table').get('schema'))
      .filter(this._isAllowedColumnName, this)
      .map(this._columnName)
      .value();
  },

  _filteredColumns: function() {
    var table = this.get('table');
    // original_schema may be set if not in SQL view (see where attr is set in the table model)
    // maintained from code to not break behavior when implementing this new modal
    return _.chain(table.get('original_schema') || table.get('schema'))
      .filter(this._isAllowedColumnName, this)
      .filter(this._isAllowedColumnType, this)
      .map(this._inverColumnRawValues)
      .value();
  },

  _inverColumnRawValues: function(rawColumn) {
    // The cdb.forms.CustomTextCombo expects the data to be in order of [type, name], so need to translate the raw schema
    var type = rawColumn[1];
    var name = rawColumn[0];
    return [type, name];
  },

  _isAllowedColumnName: function(rawColumn) {
    return !_.contains(this._EXCLUDED_COLUMN_NAMES, this._columnName(rawColumn));
  },

  _isAllowedColumnType: function(rawColumn) {
    return _.contains(this._ALLOWED_COLUMN_TYPES, this._columnType(rawColumn));
  },

  _columnName: function(rawColumn) {
    return rawColumn[0];
  },

  _columnType: function(rawColumn) {
    return rawColumn[1];
  },

  _isSelected: function(m) {
    return m.get('selected');
  },

  _deselect: function(m) {
    m.set('selected', false);
  },

  _initGeocodeStuff: function() {
    var m = new GeocodeStuffModel({
      tableName: this.get('table').get('id')
    });
    this.set('geocodeStuff', m);
  },

  _initOptions: function() {
    var geocodeStuff = this.get('geocodeStuff');
    var columnsNames = this._columnsNames();
    var columns = this._filteredColumns();

    this.set('options',
      new Backbone.Collection([
        new LonLatColumnsModel({
          geocodeStuff: geocodeStuff,
          columnsNames: columnsNames,
          selected: true
        }),
        new CityNamesModel({
          geocodeStuff: geocodeStuff,
          columnsNames: columnsNames,
          columns: columns
        }),
        new AdminRegionsModel({
          geocodeStuff: geocodeStuff,
          columnsNames: columnsNames,
          columns: columns
        }),
        new PostalCodesModel({
          geocodeStuff: geocodeStuff,
          columnsNames: columnsNames,
          columns: columns
        }),
        new IpAddressesModel({
          geocodeStuff: geocodeStuff,
          columnsNames: columnsNames,
          columns: columns
        }),
        new StreetAddressesModel({
          geocodeStuff: geocodeStuff,
          columns: columns,
          isGoogleMapsUser: this._isGmeGeocoderEnabled(),
          userGeocoding: this._userGeocoding(),
          lastBillingDate: this.get('user').get('billing_period'),
          estimation: new cdb.admin.Geocodings.Estimation({
            id: this.get('table').getUnquotedName()
          })
        })
      ])
    );

    if (this.get('user').featureEnabled('georef_disabled')) {
      this._disableGeorefTabs();
    } else {
      this._maybeDisabledStreetAddresses();
    }
  },

  _disableGeorefTabs: function() {
    _.each(this._georefTabs(), this._disableTab.bind(this, "You don't have this option available in this version"));
  },

  _georefTabs: function() {
     // exclude 1st tab (LonLat), since it should not be affected by this feature flag
    return this.get('options').rest();
  },

  _maybeDisabledStreetAddresses: function() {
    var isGmeGeocoderEnabled = this._isGmeGeocoderEnabled();
    if (this._isGoogleMapsEnabled()) {
      if (!isGmeGeocoderEnabled) {
        this._disableTab('Google Maps geocoder is not configured. Please contact us at sales@carto.com', this._streetAddrTabModel());
      }
    } else {
      if (isGmeGeocoderEnabled) {
        this._disableTab('Geocoder is not configured properly. Please contact us at sales@carto.com', this._streetAddrTabModel());
      } else if (!this._userGeocoding().hasQuota()) {
        // Credits are only used for users that use non-GME geocoder
        this._disableTab('Your geocoding quota is not defined. Please contact us at sales@carto.com', this._streetAddrTabModel());
      }
    }
  },

  _userGeocoding: function() {
    return new UserGeocodingModel(this.get('user').get('geocoding'));
  },

  _isGoogleMapsEnabled: function() {
    return this._hasUserActionEnabled('google_maps_enabled');
  },

  _isGmeGeocoderEnabled: function() {
    return this._hasUserActionEnabled('google_maps_geocoder_enabled');
  },

  _hasUserActionEnabled: function(actionName) {
    return !!this.get('user').get('actions')[actionName];
  },

  _streetAddrTabModel: function() {
    return this.get('options').find(function(m) {
      return m instanceof StreetAddressesModel;
    });
  },

  _disableTab: function(msg, tabModel) {
    tabModel.set('disabled', msg);
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./admin_regions_model":111,"./city_names_model":113,"./geocode_stuff_model":115,"./ip_addresses_model":119,"./lon_lat_columns_model":120,"./postal_codes_model":121,"./street_addresses/street_addresses_model":128,"./user_geocoding_model":133}],118:[function(require,module,exports){
(function (global){
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var BaseDialog = require('../../views/base_dialog/view.js');
var GeoreferenceModel = require('./georeference_model');
var TabItemView = require('./tab_item_view');

/**
 * Dialog to georeference a table.
 * This view only acts as a high-level view, that managed the general view logic for the modal.
 * What is supposed to happen is delegated to the model and in turn the selected georeference option.
 */
module.exports = BaseDialog.extend({

  events: BaseDialog.extendEvents({
    'click .js-back:not(.is-disabled)': '_onGoBack'
  }),

  initialize: function() {
    if (!this.options.user) throw new Error('user is required');
    this.options.clean_on_hide = true;
    this.options.enter_to_confirm = true;
    this.elder('initialize');

    this.model = new GeoreferenceModel({
      table: this.options.table,
      user: this.options.user
    });
    this._initViews();
    this._initBinds();
  },

  /**
   * @override BaseDialog.prototype.render
   */
  render: function() {
    BaseDialog.prototype.render.apply(this, arguments);
    this.$('.content').addClass('Dialog-contentWrapper');
    return this;
  },

  render_content: function() {
    var table = this.model.get('table');
    var $el = $(
      this.getTemplate('common/dialogs/georeference/georeference')({
        hasNoGeoferencedData: !table.isGeoreferenced() && table.data().length > 0
      })
    );
    this._renderTabs($el.find('.js-tabs'));
    this._renderTabContent($el);

    return $el;
  },

  ok: function() {
    this.model.continue();
  },

  _initViews: function() {
    this._tabViews = this.model.get('options').map(this._createDefaultTabView, this);
  },

  _createDefaultTabView: function(model) {
    var view = new TabItemView({
      model: model
    });
    this.addView(view);
    return view;
  },

  _renderTabs: function($target) {
    $target.append.apply($target, _.map(this._tabViews, this._getRenderedElement));
  },

  _getRenderedElement: function(view) {
    return view.render().el;
  },

  _renderTabContent: function($target) {
    if (this._tabContentView) {
      this._tabContentView.clean();
    }
    this._tabContentView = this.model.createView();
    this.addView(this._tabContentView);
    $target.find('.js-tab-content').html(this._tabContentView.render().el);
  },

  _initBinds: function() {
    var options = this.model.get('options');
    options.bind('change:selected', this._onChangeSelectedTab, this);
    options.bind('change:canGoBack', this._onChangeCanGoBack, this);
    options.bind('change:geocodeData', this._onChangeGeocodeData, this);
    this.add_related_model(options);
  },

  _onChangeSelectedTab: function(tabModel, isSelected) {
    if (isSelected) {
      this.model.changedSelectedTab(tabModel);
      this._renderTabContent(this.$el);
    }
  },

  _onChangeCanGoBack: function(tabModel, canGoBack) {
    this.$('.js-back').toggle(!!canGoBack);
  },

  _onGoBack: function() {
    this.model.goBack();
  },

  _onChangeGeocodeData: function(tabModel, data) {
    cdb.god.trigger('geocodingChosen', data);
    this.close();
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../views/base_dialog/view.js":213,"./georeference_model":117,"./tab_item_view":132}],119:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var Backbone = (typeof window !== "undefined" ? window['Backbone'] : typeof global !== "undefined" ? global['Backbone'] : null);
var RowModel = require('./row_model');
var RowsView = require('./rows_view');
var DefaultFooterView = require('./default_footer_view');
var ViewFactory = require('../../view_factory');

/**
 * Model for the IP addresses georeference option.
 */
module.exports = cdb.core.Model.extend({

  TAB_LABEL: 'IP Addresses',

  initialize: function(attrs) {
    if (!attrs.geocodeStuff) throw new Error('geocodeStuff is required');
    if (!attrs.columnsNames) throw new Error('columnsNames is required');
  },

  createView: function() {
    this._initRows();
    this.set({
      canContinue: false,
      hideFooter: false
    });

    return ViewFactory.createByList([
      ViewFactory.createByTemplate('common/dialogs/georeference/default_content_header', {
        title: "Select the column that that contains the IP's name",
        desc: 'Convert IP address into geographical locations.'
      }),
      new RowsView({
        model: this
      }),
      new DefaultFooterView({
        model: this
      })
    ]);
  },

  assertIfCanContinue: function() {
    this.set('canContinue', !!this._columnNameValue());
  },

  continue: function() {
    var d = this.get('geocodeStuff').geocodingChosenData({
      type: 'ip',
      kind: 'ipaddress',
      column_name: this._columnNameValue(),
      geometry_type: 'point'
    });

    this.set('geocodeData', d);
  },

  _initRows: function() {
    var rows = new Backbone.Collection([
      new RowModel({
        comboViewClass: 'Combo',
        label: 'In which column are your IP addresses stored?',
        placeholder: 'Select column',
        data: this.get('columnsNames')
      })
    ]);
    this.set('rows', rows);
  },

  _columnNameValue: function() {
    return this.get('rows').first().get('value');
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../view_factory":209,"./default_footer_view":114,"./row_model":122,"./rows_view":124}],120:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var Backbone = (typeof window !== "undefined" ? window['Backbone'] : typeof global !== "undefined" ? global['Backbone'] : null);
var RowModel = require('./row_model');
var RowsView = require('./rows_view');
var DefaultFooterView = require('./default_footer_view');
var ViewFactory = require('../../view_factory');

/**
 * Model for the Lon/Lat georeference option.
 */
module.exports = cdb.core.Model.extend({

  TAB_LABEL: 'Lon/Lat Columns',

  defaults: {
    columnsNames: []
  },

  initialize: function(attrs) {
    if (!attrs.geocodeStuff) throw new Error('geocodeStuff is required');
    if (!attrs.columnsNames) throw new Error('columnsNames is required');
  },

  createView: function() {
    this.set({
      canContinue: false,
      hideFooter: false
    });
    this._initRows();

    return ViewFactory.createByList([
      ViewFactory.createByTemplate('common/dialogs/georeference/default_content_header', {
        title: 'Select the columns containing your Lon/Lat columns',
        desc: 'The selected columns are transformed into georeference coordinates.'
      }),
      new RowsView({
        model: this
      }),
      new DefaultFooterView({
        model: this
      })
    ]);
  },

  assertIfCanContinue: function() {
    var canContinue = this.get('rows').all(function(m) {
      return !!m.get('value');
    });
    this.set('canContinue', canContinue);
  },

  continue: function() {
    var d = this.get('geocodeStuff').geocodingChosenData({
      type: 'lonlat',
      longitude: this.get('rows').first().get('value'),
      latitude: this.get('rows').last().get('value')
    });

    this.set('geocodeData', d);
  },

  _initRows: function() {
    var rows = new Backbone.Collection([
      new RowModel({
        comboViewClass: 'Combo',
        label: 'Select your Longitude',
        placeholder: 'Select column',
        property: 'longitude',
        data: this.get('columnsNames')
      }),
      new RowModel({
        comboViewClass: 'Combo',
        label: 'Select your Latitude',
        placeholder: 'Select column',
        property: 'latitude',
        data: this.get('columnsNames')
      })
    ]);
    this.set('rows', rows);
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../view_factory":209,"./default_footer_view":114,"./row_model":122,"./rows_view":124}],121:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var Backbone = (typeof window !== "undefined" ? window['Backbone'] : typeof global !== "undefined" ? global['Backbone'] : null);
var RowModel = require('./row_model');
var StepsView = require('./steps_view');
var DefaultFooterView = require('./default_footer_view');
var ViewFactory = require('../../view_factory');

/**
 * Model for the postal codes georeference option.
 */
module.exports = cdb.core.Model.extend({

  TAB_LABEL: 'Postal Codes',
  KIND: 'postalcode',

  defaults: {
    step: 0,
    columns: []
  },

  initialize: function(attrs) {
    if (!attrs.geocodeStuff) throw new Error('geocodeStuff is required');
    if (!attrs.columnsNames) throw new Error('columnsNames is required');
    if (!attrs.columns) throw new Error('columns is required');
  },

  createView: function() {
    this._initRows();
    this._setStateForFirstStep();

    return ViewFactory.createByList([
      new StepsView({
        title: 'Select the column that has the Postal Codes',
        desc: 'Georeference your data by postal codes.',
        model: this
      }),
      new DefaultFooterView({
        model: this
      })
    ]);
  },

  assertIfCanContinue: function() {
    var value = this.get('step') === 0 ? this._columnNameValue() : this.get('geometryType');
    this.set('canContinue', !!value);
  },

  continue: function() {
    if (this.get('step') === 0) {
      this._setStateForSecondStep();
    } else {
      this._geocode();
    }
  },

  goBack: function() {
    this._setStateForFirstStep();
  },

  availableGeometriesFetchData: function() {
    return this.get('geocodeStuff').availableGeometriesFetchData(this.KIND, this._locationValue(), this._isLocationFreeText());
  },

  _setStateForFirstStep: function() {
    this.set({
      step: 0,
      canGoBack: false,
      canContinue: false,
      hideFooter: false
    });
  },

  _setStateForSecondStep: function() {
    this.set({
      step: 1,
      canGoBack: true,
      canContinue: false,
      hideFooter: true,
      geometryType: ''
    });
  },

  _geocode: function() {
    var d = this.get('geocodeStuff').geocodingChosenData({
      type: 'postal',
      kind: this.KIND,
      location: this._locationValue(),
      column_name: this._columnNameValue(),
      geometry_type: this.get('geometryType')
    }, this._isLocationFreeText(), true);

    this.set('geocodeData', d);
  },

  _initRows: function() {
    var rows = new Backbone.Collection([
      new RowModel({
        comboViewClass: 'Combo',
        label: 'In which column are your postal codes stored?',
        placeholder: 'Select column',
        data: this.get('columnsNames')
      }),
      new RowModel({
        label: 'Country where postal codes are located, if known',
        data: this.get('columns')
      })
    ]);
    this.set('rows', rows);
  },

  _columnNameValue: function() {
    return this.get('rows').first().get('value');
  },

  _locationValue: function() {
    return this._location().get('value');
  },

  _isLocationFreeText: function() {
    return this._location().get('isFreeText');
  },

  _location: function() {
    return this.get('rows').last();
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../view_factory":209,"./default_footer_view":114,"./row_model":122,"./steps_view":125}],122:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var RowView = require('./row_view');

/**
 * Model for an individual row
 */
module.exports = cdb.core.Model.extend({

  defaults: {
    comboViewClass: 'CustomTextCombo',
    label: '',
    placeholder: 'Select column or type it',
    isFreeText: false,
    data: []
  },

  createView: function() {
    return new RowView({
      model: this
    });
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./row_view":123}],123:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);

/**
 * View for the street addresses georeference option.
 */
module.exports = cdb.core.View.extend({

  className: 'Form-row Form-row--step',

  initialize: function() {
    this._initViews();
    this._initBinds();
  },

  render: function() {
    this.$el.html(
      this.getTemplate('common/dialogs/georeference/row')({
        label: this.model.get('label')
      })
    );
    this.$('.js-select').append(this._selectView.render().el);
    return this;
  },

  _initBinds: function() {
    this.model.bind('change:value', this._onChangeValue, this);
  },

  _initViews: function() {
    this._selectView = new cdb.forms[this.model.get('comboViewClass')]({
      model: this.model,
      placeholder: this.model.get('placeholder'),
      disabled: this.model.get('disabled'),
      extra: this.model.get('data'),
      className: 'Select',
      width: '100%',
      property: 'value',

      // This is only needed for a ComboFreeText view, but doesn't hurt for the normal Combo so let's leave it
      text: 'isFreeText'
    });
    this.addView(this._selectView);

    // Simulate a initial selection to update model to be in sync with the view
    this._selectView.render()._changeSelection();
  },

  _onChangeValue: function(m, val) {
    this.$el.toggleClass('is-done', !!val);
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],124:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);

/**
 * View to render a set of rows.
 */
module.exports = cdb.core.View.extend({

  initialize: function() {
    this._initBinds();
  },

  render: function() {
    this.clearSubViews();
    this._renderRows();
    return this;
  },

  _initBinds: function() {
    var rows = this.model.get('rows');
    rows.bind('change', this.model.assertIfCanContinue, this.model);
    this.add_related_model(rows);
  },

  _renderRows: function() {
    this.model.get('rows').chain()
      .map(this._createRowView, this)
      .map(this._appendRowToDOM, this);
  },

  _createRowView: function(m) {
    var view = m.createView();
    this.addView(view);
    return view;
  },

  _appendRowToDOM: function(view) {
    this.$el.append(view.render().el);
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],125:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var RowsView = require('./rows_view');
var ChooseGeometryView = require('./choose_geometry_view');
var ViewFactory = require('../../view_factory');

/**
 * View for the georeference types that requires the two-steps flow.
 * First select columns values, and then the geometry type to use.
 */
module.exports = cdb.core.View.extend({

  initialize: function() {
    this._initBinds();
  },

  render: function() {
    this.clearSubViews();

    if (this.model.get('step') === 1) {
      this._renderChooseGeometry();
    } else {
      this._renderHeader();
      this._renderRows();
    }

    return this;
  },

  _renderHeader: function() {
    this._appendView(
      ViewFactory.createByTemplate('common/dialogs/georeference/default_content_header', {
        title: this.options.title,
        desc: this.options.desc
      })
    );
  },

  _renderRows: function() {
    this._appendView(
      new RowsView({
        model: this.model
      })
    );
  },

  _renderChooseGeometry: function() {
    this._appendView(
      new ChooseGeometryView({
        model: this.model
      })
    );
  },

  _appendView: function(view) {
    this.addView(view);
    this.$el.append(view.render().$el);
  },

  _initBinds: function() {
    this.model.bind('change:step', this.render, this);
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../view_factory":209,"./choose_geometry_view":112,"./rows_view":124}],126:[function(require,module,exports){
(function (global){
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);

module.exports = cdb.core.View.extend({

  className: 'Georeference-estimation',

  initialize: function() {
    if (!_.isBoolean(this.options.hasHardLimit)) throw new Error('hasHardLimit is required');
    if (!this.options.userGeocoding) throw new Error('userGeocoding is required');
    this._initBinds();
  },

  render: function() {
    var estimation = this.model.get('estimation');
    var rows = this.model.get('rows');

    this.$el.html(
      this.getTemplate('common/dialogs/georeference/street_addresses/estimation')({
        hasEstimation: estimation !== undefined && rows !== undefined,
        hasHardLimit: this.options.hasHardLimit,
        costInCredits: this.model.costInCredits(),
        costInDollars: this.model.costInDollars(),
        blockPriceInDollars: this.options.userGeocoding.blockPriceInDollars(),
        hasRows: rows !== 0
      })
    );
    return this;
  },

  _initBinds: function() {
    this.model.bind('change error', this.render, this);
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],127:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);

module.exports = cdb.core.View.extend({

  className: 'Georeference-quota',

  render: function() {
    this.$el.html(
      this.getTemplate('common/dialogs/georeference/street_addresses/quota')({
        quotaLeft: this.model.quotaLeftThisMonth(),
        quotaUsedInPct: this.model.quotaUsedThisMonthInPct()
      })
    );
    return this;
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],128:[function(require,module,exports){
(function (global){
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var Backbone = (typeof window !== "undefined" ? window['Backbone'] : typeof global !== "undefined" ? global['Backbone'] : null);
var moment = (typeof window !== "undefined" ? window['moment'] : typeof global !== "undefined" ? global['moment'] : null);
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var StreetAddressesView = require('./street_addresses_view');
var RowModel = require('../row_model');
var StreetRowModel = require('./street_row_model');

/**
 * Model for the street addresses georeference option.
 */
module.exports = cdb.core.Model.extend({

  TAB_LABEL: 'Street Addresses',
  MAX_STREET_ROWS: 3,

  defaults: {
    columnsNames: [],
    columns: [],
    estimation: undefined
  },

  initialize: function(attrs) {
    if (!attrs.geocodeStuff) throw new Error('geocodeStuff is required');
    if (!_.isBoolean(attrs.isGoogleMapsUser)) throw new Error('isGoogleMapsUser is required');
    if (!attrs.userGeocoding) throw new Error('userGeocoding is required');
    if (!attrs.columns) throw new Error('columns is required');
    if (!attrs.estimation) throw new Error('estimation is required'); // cdb.admin.Geocodings.Estimations
  },

  createView: function() {
    this.set({
      canContinue: false,
      hideFooter: false,
      mustAgreeToTOS: false,
      confirmTOS: false,
      hasAgreedToTOS: false
    });
    this._initRows();

    return new StreetAddressesView({
      model: this
    });
  },

  isDisabled: function() {
    return !this.get('isGoogleMapsUser') && this.get('userGeocoding').hasReachedMonthlyQuota();
  },

  showCostsInfo: function() {
    return !this.get('isGoogleMapsUser');
  },

  getFormatterItemByRow: function(m) {
    var val = m.get('value');
    if (val) {
      return m.get('isFreeText') ? val.trim() : '{' + val + '}';
    }
  },

  assertIfCanAddMoreRows: function() {
    // If can add more rows, enable the add button only on the last street row
    var streetRows = this.get('rows').filter(this._isStreetRow);
    _.invoke(streetRows, 'set', 'canAddRow', false);
    _.last(streetRows).set('canAddRow', streetRows.length < this.MAX_STREET_ROWS);
  },

  daysLeftToNextBilling: function() {
    var today = moment().startOf('day');
    return moment(this.get('lastBillingDate')).add(30, 'days').diff(today, 'days')
  },

  continue: function() {
    var mustAgreeToTOS = this.get('mustAgreeToTOS');

    if (this._hasAgreedToTOS() || !mustAgreeToTOS) {
      var d = this.get('geocodeStuff').geocodingChosenData({
        type: 'address',
        kind: 'high-resolution',
        formatter: this.get('formatter')
      });
      this.set('geocodeData', d);
    } else if (mustAgreeToTOS) {
      this.set('confirmTOS', true);
    }
  },

  hasHardLimit: function() {
    return !!this.get('userGeocoding').get('hard_limit');
  },

  _hasAgreedToTOS: function() {
    return this.get('mustAgreeToTOS') && this.get('hasAgreedToTOS');
  },

  _isStreetRow: function(row) {
    return row instanceof StreetRowModel;
  },

  _initRows: function() {
    var columns = this.get('columns');
    var isDisabled = this.isDisabled();
    var rows = new Backbone.Collection([
      new StreetRowModel({
        label: 'Which column are your street addresses stored in?',
        data: columns,
        canAddRow: true,
        disabled: isDisabled
      }),
      new RowModel({
        label: 'State/province where address is located, if known',
        data: columns,
        disabled: isDisabled
      }),
      new RowModel({
        label: 'Country where street address is located, if known',
        data: columns,
        disabled: isDisabled
      })
    ]);
    this.set('rows', rows);
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../row_model":122,"./street_addresses_view":129,"./street_row_model":130}],129:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var ViewFactory = require('../../../view_factory');
var EstimationView = require('./estimation_view');
var QuotaView = require('./quota_view');
var DefaultFooterView = require('../default_footer_view');
var pluralizeString = require('../../../view_helpers/pluralize_string');

/**
 * View to select long/lat couple to do the georeference.
 */
module.exports = cdb.core.View.extend({

  initialize: function() {
    this._initBinds();
    this._fetchEstimation();
  },

  render: function() {
    this.clearSubViews();
    this.$el.html(
      this.getTemplate('common/dialogs/georeference/street_addresses/street_addresses')({
      })
    );
    this._renderHeader();
    this._renderRows();

    var showCostsInfo = this.model.showCostsInfo();
    if (showCostsInfo) {
      this._renderEstimation();
      this._renderQuota();
    }
    this.$('.js-costs-info').toggle(!!showCostsInfo);

    this._renderFooter();
    return this;
  },

  _renderHeader: function() {
    var view = ViewFactory.createByTemplate('common/dialogs/georeference/default_content_header', {
      title: 'Select the column(s) that has your street address',
      desc: 'Use this option if you need high resolution geocoding of your street adresses data.'
    });
    this.addView(view);
    this.$el.prepend(view.render().$el);
  },

  _renderRows: function() {
    this._$rows().toggleClass('u-disabled', !!this.model.isDisabled());
    this.model.get('rows').chain()
      .map(this._createRowView, this)
      .map(this._appendRowToDOM, this);
  },

  _renderEstimation: function() {
    var view = new EstimationView({
      model: this.model.get('estimation'),
      userGeocoding: this.model.get('userGeocoding'),
      hasHardLimit: this.model.hasHardLimit()
    });
    this.addView(view);
    this.$('.js-estimation').append(view.render().el);
  },

  _renderQuota: function() {
    var view = new QuotaView({
      model: this.model.get('userGeocoding')
    });
    this.addView(view);
    this.$('.js-quota').append(view.render().el);
  },

  _renderFooter: function() {
    var content;

    if (this.model.isDisabled()) {
      content = this.getTemplate('common/dialogs/georeference/street_addresses/upgrade_footer')({
        cartodb_com_hosted: cdb.config.get('cartodb_com_hosted'),
        upgradeURL: cdb.config.get('upgrade_url'),
        pluralizeString: pluralizeString,
        daysLeftToNextBilling: this.model.daysLeftToNextBilling()
      });
    } else {
      var view = new DefaultFooterView({
        model: this.model
      });
      this.addView(view);
      content = view.render().$el;
    }

    this.$el.append(content);
  },

  _createRowView: function(m) {
    var view = m.createView();
    this.addView(view);
    return view;
  },

  _appendRowToDOM: function(view) {
    this._$rows().append(view.render().el);
  },

  _$rows: function() {
    return this.$('.js-rows');
  },

  _initBinds: function() {
    var rows = this.model.get('rows');
    rows.bind('change', this._onChangeRows, this);
    rows.bind('add', this._onAddRow, this);
    this.add_related_model(rows);

    var estimation = this.model.get('estimation');
    estimation.bind('change', this._onChangeEstimation, this);
    estimation.bind('error', this._onEstimationError, this);
    this.add_related_model(estimation);

    var geocodeStuff = this.model.get('geocodeStuff');
    geocodeStuff.bind('change:forceAllRows', this._onChangeForceAllRows, this);
    this.add_related_model(geocodeStuff);

    this.model.bind('change:confirmTOS', this._onChangeConfirmTOS, this);
    this.model.bind('change:isGoogleMapsUser', this.render, this);
  },

  _onChangeForceAllRows: function() {
    this.model.get('estimation').reset();
    this._fetchEstimation();
  },

  _fetchEstimation: function() {
    if (this.model.showCostsInfo()) {
      this.model.get('estimation').fetch({
        data: {
          force_all_rows: this.model.get('geocodeStuff').get('forceAllRows')
        }
      });
    }
  },

  _onChangeRows: function() {
    var formatter = this.model.get('rows').chain()
      .map(this.model.getFormatterItemByRow)
      .compact() // there might be rows that have no value, if so skip them
      .value().join(', ');

    this.model.set({
      formatter: formatter,
      canContinue: !_.isEmpty(formatter)
    });
  },

  _onAddRow: function(newRow, rows, opts) {
    var rowView = this._createRowView(newRow);
    this.$('.js-rows').children().eq(opts.index).before(rowView.render().el);
    this.model.assertIfCanAddMoreRows();
  },

  _onChangeEstimation: function() {
    var mustAgreeToTOS = this.model.get('estimation').mayHaveCost() && !this.model.hasHardLimit();
    this.model.set('mustAgreeToTOS', mustAgreeToTOS);
  },

  _onEstimationError: function() {
    // Force re-render, handled in subview
    this.model.get('estimation').set({
      estimation: -1,
      rows: -1
    });
  },

  _onChangeConfirmTOS: function(m, confirmTOS) {
    if (confirmTOS) {
      this.model.set('confirmTOS', false, { silent: true }); // to re-renable if cancelled
      var view = ViewFactory.createDialogByTemplate('common/dialogs/georeference/street_addresses/confirm_tos', {
        // template data
        costInDollars: this.model.get('estimation').costInDollars()
      }, {
        // dialog options
        triggerDialogEvents: false, // to avoid closing this modal
        enter_to_confirm: true,
        clean_on_hide: false
      });
      view.ok = this._onAgreeToTOS.bind(this);
      this.addView(view);
      view.appendToBody();
    }
  },

  _onAgreeToTOS: function() {
    this.model.set('hasAgreedToTOS', true);
    this.model.continue();
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../../view_factory":209,"../../../view_helpers/pluralize_string":211,"../default_footer_view":114,"./estimation_view":126,"./quota_view":127}],130:[function(require,module,exports){
var RowModel = require('../row_model');
var StreetRowView = require('./street_row_view');

/**
 * Specialization for the street row, to add an additonal row
 */
module.exports = RowModel.extend({

  createView: function() {
    return new StreetRowView({
      model: this
    });
  },

  addRow: function() {
    var newRowModel = new this.constructor({
      label: 'Additional information to complete street address',
      data: this.get('data')
    });
    this.collection.add(newRowModel, { at: this._indexAfterThisModel() });
  },

  _indexAfterThisModel: function() {
    return this.collection.indexOf(this) + 1;
  }

});

},{"../row_model":122,"./street_row_view":131}],131:[function(require,module,exports){
var RowView = require('../row_view');

/**
 * Special view for the street addresses georeference option
 * This allows to potentially add more
 */
module.exports = RowView.extend({

  events: RowView.extendEvents({
    'click .js-add-row': '_onClickAddRow'
  }),

  initialize: function() {
    RowView.prototype.initialize.apply(this, arguments);
    this._initStreetRowBinds();
  },

  render: function() {
    RowView.prototype.render.call(this);
    if (!this.model.get('disabled')) {
      this.$el.append(
        this.getTemplate('common/dialogs/georeference/street_addresses/row_add_row')()
      );
    }
    return this;
  },

  _initStreetRowBinds: function() {
    this.model.bind('change:canAddRow', this._onChangeCanAddRow, this);
  },

  _onClickAddRow: function(ev) {
    this.killEvent(ev);
    this.model.addRow();
  },

  _onChangeCanAddRow: function(m, canAddRow) {
    this.$('.js-add-row').toggle(!!canAddRow);
  }

});

},{"../row_view":123}],132:[function(require,module,exports){
(function (global){
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);

/**
 * View for an indvidual tab item
 */
module.exports = cdb.core.View.extend({

  tagName: 'li',
  className: 'Filters-typeItem Filters-typeItem--moreMargins',

  events: {
    'click .js-btn': '_onClick'
  },

  initialize: function() {
    this._initBinds();
  },

  render: function() {
    this.clearSubViews();

    this.$el.html(
      this.getTemplate('common/dialogs/georeference/tab_item')({
        label: this.model.TAB_LABEL,
        isDisabled: this.model.get('disabled')
      })
    );
    this._onChangeSelected(this.model, this.model.get('selected'));
    this._onChangeDisabled(this.model, this.model.get('disabled'));
    this._createDisabledTooltip();

    return this;
  },

  _initBinds: function() {
    this.model.bind('change:selected', this._onChangeSelected, this);
    this.model.bind('change:disabled', this._onChangeDisabled, this);
  },

  _onChangeSelected: function(m, isSelected) {
    this.$('button').toggleClass('is-selected', !!isSelected);
  },

  _onChangeDisabled: function(m, isDisabled) {
    isDisabled ? this.undelegateEvents() : this.delegateEvents();
  },

  _createDisabledTooltip: function() {
    var msg = this.model.get('disabled');
    if (!_.isEmpty(msg)) {
      this.addView(
        new cdb.common.TipsyTooltip({
          el: this.$('.js-btn'),
          fallback: msg,
          gravity: 's',
          offset: -30
        })
      );
    }
  },

  _onClick: function(ev) {
    this.killEvent(ev);
    this.model.set('selected', true);
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],133:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);

/**
 * A value object to encapsulate logic related to user view model.
 *
 * Expected to be create with geocoding value from an user, e.g.:
 *   new UserGeocoding(user.get('geocoding'));
 */
module.exports = cdb.core.Model.extend({

  defaults: {
    quota: null, // is based on monthly usage
    block_price: null, // cost (in cents) per each 1000 credits extra
    monthly_use: 0,
    hard_limit: false
  },

  hasQuota: function() {
    var quota = this.get('quota');
    return quota !== null && quota !== undefined && quota !== '';
  },

  hasReachedMonthlyQuota: function() {
    return this.get('hard_limit') && this._maybe(function(quota, monthlyUse) {
      return (monthlyUse >= quota);
    }, false);
  },

  /**
   * Returns the quota left.
   * @return {Number} a non-negative number (.e.g in the case of monthly usage exceeds the quota, returns 0)
   */
  quotaLeftThisMonth: function() {
    return this._maybe(function(quota, monthlyUse) {
      return Math.max(quota - monthlyUse, 0);
    }, 0);
  },

  quotaUsedThisMonthInPct: function() {
    return this._maybe(function(quota, monthlyUse) {
      return (monthlyUse * 100) / quota;
    }, 0);
  },

  blockPriceInDollars: function() {
    return Math.ceil(this.get('block_price') / 100);
  },

  // Make sure monthly_use and quota are set
  _maybe: function(fn, fallbackVal) {
    var monthlyUse = this.get('monthly_use');
    var quota = this.get('quota');

    if (monthlyUse >= 0 && quota >= 0) {
      return fn(quota, monthlyUse);
    } else {
      return fallbackVal;
    }
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],134:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var Utils = (typeof window !== "undefined" ? window['cdb']['Utils'] : typeof global !== "undefined" ? global['cdb']['Utils'] : null)

/**
 *  Limits reach content
 *
 */

module.exports = cdb.core.View.extend({

  events: {
    'click .js-toggler': '_onLumpSumClick'
  },

  initialize: function() {
    this.user = this.options.user;
    this.model = new cdb.core.Model({
      lumpSum: false
    });
    this.template = cdb.templates.getTemplate('common/dialogs/limits_reach/limits_reached_content');
    this._initBinds();
  },

  render: function() {
    var canUpgrade = cdb.config.get('upgrade_url') && !cdb.config.get('cartodb_com_hosted') && !this.user.isInsideOrg();
    var currentPlan = this.user.get("account_type");

    var availablePlans = _.compact(this.collection.map(function(plan, index) {
      var price = plan.get('price');
      var planName = plan.get('title');

      return {
        name: planName.toLowerCase(),
        price: Utils.formatNumber(price),
        isUserPlan: planName.search(currentPlan) !== -1,
        lumpSumPrice: price == "0" ? "0" : Utils.formatNumber(plan.get('lump_sum').price),
        quota: Utils.readablizeBytes(plan.get('bytes_quota')).replace(/\.00/g,'').replace(" ", ""),
        layers: plan.get('max_layers'),
        privateMaps: plan.get('private_tables'),
        removableBrand: plan.get('removable_brand')
      }
    }));

    this.$el.html(
      this.template({
        lumpSum: this.model.get('lumpSum'),
        itemHighlighted: this._getHighlighted(availablePlans, this.user.get("account_type")),
        canUpgrade: canUpgrade,
        availablePlans: availablePlans,
        organizationAdmin: this.user.isOrgOwner(),
        organizationUser: (this.user.isInsideOrg() && !this.user.isOrgOwner()),
        customHosted: cdb.config.get('cartodb_com_hosted'),
        upgradeURL: cdb.config.get('upgrade_url'),
        canStartTrial: this.user.canStartTrial()
      })
    );

    return this;
  },

  _initBinds: function() {
    this.model.bind('change', this.render, this);
    this.collection.bind('reset', this.render, this);
    this.add_related_model(this.collection);
  },

  _getHighlighted: function(plans, currentPlan) {
    var item = 0;
    for (var i = 0, l = plans.length; i < l; i++) {
      if (plans[i].name.search(currentPlan) !== -1) {
        item = i;
      }
    }
    return item < 2 ? 2 : 3;
  },

  _onLumpSumClick: function() {
    this.model.set('lumpSum', !this.model.get('lumpSum'));
  }

})

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],135:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var UserPlansCollection = require('./user_plans_collection');
var LimitsReachedContentView = require('./limits_reached_content_view');
var BaseDialog = require('../../views/base_dialog/view');
var randomQuote = require('../../view_helpers/random_quote');
var ViewFactory = require('../../view_factory');

/**
 *  Show upgrade possibilities per user type
 *
 */

module.exports = BaseDialog.extend({

  initialize: function() {
    this.user = this.options.user;
    this.userPlans = new UserPlansCollection(null, { user: this.user });
    this.elder('initialize');
    this._initBinds();
  },

  render_content: function() {
    var canUpgrade = cdb.config.get('upgrade_url') && !cdb.config.get('cartodb_com_hosted') && !this.user.isInsideOrg();
    var organizationAdminEmail = this.user.isInsideOrg() && this.user.organization.get('owner').email || '';
    var $el = $(cdb.templates.getTemplate('common/dialogs/limits_reach/limits_reached')({
      canUpgrade: canUpgrade,
      organizationAdminEmail: organizationAdminEmail,
      organizationAdmin: this.user.isOrgOwner(),
      organizationUser: (this.user.isInsideOrg() && !this.user.isOrgOwner()),
      layersCount: this.user.getMaxLayers(),
      customHosted: cdb.config.get('cartodb_com_hosted')
    }));
    this._initViews($el);
    return $el;
  },

  _initBinds: function() {
    this.userPlans.bind('error', function() {
      this._panes.active('error');
    }, this);
    this.userPlans.bind('reset', function() {
      this._panes.active('content');
    }, this);
    this.add_related_model(this.userPlans);
  },

  _initViews: function($el) {
    this._panes = new cdb.ui.common.TabPane({
      el: $el.find('.js-content')
    });
    this.addView(this._panes);

    this._panes.addTab('loading',
      ViewFactory.createByTemplate('common/templates/loading', {
        title: 'Getting plans info…',
        quote: randomQuote()
      }).render()
    );

    this._panes.addTab('error',
      ViewFactory.createByTemplate('common/templates/fail', {
        msg: 'Sorry, something went wrong trying to get your available plans.'
      }).render()
    );

    this._panes.addTab('content',
      new LimitsReachedContentView({
        user: this.user,
        collection: this.userPlans
      }).render()
    );

    var canUpgrade = cdb.config.get('upgrade_url') && !cdb.config.get('cartodb_com_hosted') && !this.user.isInsideOrg();

    this._panes.active(canUpgrade ? 'loading' : 'content');

    if (canUpgrade) {
      this.userPlans.fetch({
        error: function() {
          this.trigger('error');
        }
      });
    }
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../view_factory":209,"../../view_helpers/random_quote":212,"../../views/base_dialog/view":213,"./limits_reached_content_view":134,"./user_plans_collection":137}],136:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var Backbone = (typeof window !== "undefined" ? window['Backbone'] : typeof global !== "undefined" ? global['Backbone'] : null);

/**
 *  User plans model
 *
 */

module.exports = cdb.core.Model.extend({

  defaults: {
    title: '',
    desc: '',
    price: 0,
    tables_quota: '',
    bytes_quota: 0,
    support: '',
    private_tables: false,
    removable_brand: false,
    max_layers: 4
  }

})
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],137:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var Backbone = (typeof window !== "undefined" ? window['Backbone'] : typeof global !== "undefined" ? global['Backbone'] : null);
var UserPlanModel = require('./user_plan_model');

/**
 *  User plans collection
 *
 *  - It will get the available plans per user
 */


module.exports = Backbone.Collection.extend({

  model: UserPlanModel,

  url: function() {
    return '//' + cdb.config.get('account_host') + '/account/' + this.user.get('username') + '.json'
  },

  initialize: function(models, opts) {
    if (!opts.user) {
      throw new Error('user model is needed')
    }
    this.user = opts.user;
  },

  sync: function(method, model, options) {
    var self = this;
    var params = _.extend({
      type: 'GET',
      dataType: 'jsonp',
      url: self.url(),
      processData: false
    }, options);

    return $.ajax(params);
  },

  parse: function(r) {
    return r.available_plans
  }

})
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./user_plan_model":136}],138:[function(require,module,exports){
(function (global){
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var GuessingTogglerView = require('../../create/footer/guessing_toggler_view');
var PrivacyTogglerView = require('../../create/footer/privacy_toggler_view');

/**
 * Footer view for the add layer modal.
 */
module.exports = cdb.core.View.extend({

  events: {
    'click .js-ok': '_finish'
  },

  initialize: function() {
    this.elder('initialize');
    this.user = this.options.user;
    this.guessingModel = new cdb.core.Model({ guessing: true });
    this.privacyModel = new cdb.core.Model({
      privacy: this.user.canCreatePrivateDatasets() ? 'PRIVATE' : 'PUBLIC'
    });
    this._template = cdb.templates.getTemplate('common/dialogs/map/add_layer/footer');
    this._initBinds();
  },

  render: function() {
    this.clearSubViews();

    var $el = $(
      this._template({
        canFinish: this.model.canFinish(),
        listing: this.model.get('listing')
      })
    );
    this.$el.html($el);

    this._initViews();

    return this;
  },

  _initViews: function() {
    var guessingTogglerView = new GuessingTogglerView({
      model: this.guessingModel,
      createModel: this.model
    });
    this.$('.js-footer-info').append(guessingTogglerView.render().el);
    this.addView(guessingTogglerView);

    this.privacyTogglerView = new PrivacyTogglerView({
      model: this.privacyModel,
      user: this.user,
      createModel: this.model
    });
    this.$('.js-footerActions').prepend(this.privacyTogglerView.render().el);
    this.addView(this.privacyTogglerView);
  },

  _initBinds: function() {
    this.model.upload.bind('change', this.render, this);
    this.model.selectedDatasets.bind('all', this._update, this);
    this.model.bind('change', this._update, this);
    this.add_related_model(this.model.upload);
    this.add_related_model(this.model.selectedDatasets);
  },

  _update: function() {
    var contentPane = this.model.get('contentPane');
    var listing = this.model.get('listing');
    if (contentPane === 'listing' && listing !== 'scratch') {
      this.render().show();
    } else {
      this.hide();
    }
  },

  _finish: function(e) {
    this.killEvent(e);
    if (this.model.canFinish()) {
      // Set proper guessing values before starting the upload
      // if dialog is in import section
      if (this.model.get('listing') === 'import') {
        this.model.upload.set('privacy', this.privacyModel.get('privacy'));
        this.model.upload.setGuessing(this.guessingModel.get('guessing'));
      }
      this.model.finish();
    }
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../create/footer/guessing_toggler_view":59,"../../create/footer/privacy_toggler_view":60}],139:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var UploadModel = require('../../background_polling/models/upload_model');
var VisFetchModel = require('../../visualizations_fetch_model');

/**
 * Add layer model
 *
 * "Implements" the CreateListingModel.
 */
module.exports = cdb.core.Model.extend({

  defaults: {
    type: 'addLayer',
    contentPane: 'listing', // [listing, loading]
    listing: 'datasets', // [import, datasets, scratch]
    collectionFetched: false,
    activeImportPane: 'file'
  },

  initialize: function(attrs, opts) {
    this.user = opts.user;
    this.vis = opts.vis;
    this.map = opts.map;

    this.upload = new UploadModel({
      create_vis: false
    }, {
      user: this.user
    });

    this.selectedDatasets = new Backbone.Collection();
    this.collection = new cdb.admin.Visualizations();
    this.visFetchModel = new VisFetchModel({
      content_type: 'datasets',
      library: this.showLibrary()
    });
    this._initBinds();
    this._maybePrefetchDatasets();
  },

  // For create-listing view
  canSelect: function(dataset) {
    return dataset.get('selected') || this.selectedDatasets.length < 1; // for now only allow 1 item
  },

  // For create-listing view
  showLibrary: function() {
    return false;
  },

  // For create-listing view
  showDatasets: function() {
    return true;
  },

  // For create-listing-import view
  setActiveImportPane: function(name) {
    this.set('activeImportPane', name);
  },

  // For footer
  canFinish: function() {
    if (this.get('listing') === 'import') {
      return this.upload.isValidToUpload();
    } else if (this.get('listing') === 'datasets') {
      return this.selectedDatasets.length > 0;
    }
  },

  finish: function() {
    if (this.get('listing') === 'import') {
      cdb.god.trigger('importByUploadData', this.upload.toJSON(), this);
    } else if (this.get('listing') === 'datasets') {
      var mdl = this.selectedDatasets.at(0);
      if (mdl.get('type') === 'remote') {
        var d = {
          create_vis: false,
          type: 'remote',
          value: mdl.get('name'),
          remote_visualization_id: mdl.get('id'),
          size: mdl.get('external_source') ? mdl.get('external_source').size : undefined
        };
        // See BackgroundImporter where the same event is bound to be handled..
        cdb.god.trigger('importByUploadData', d, this);
      } else {
        this._addNewLayer(mdl.tableMetadata().get('name'));
      }
    }
  },

  // For footer (type guessing)
  getImportState: function() {
    return this.get('activeImportPane');
  },

  // For footer (type guessing)
  showGuessingToggler: function() {
    return this.get('listing') === 'import';
  },

  // For create-footer view
  showPrivacyToggler: function() {
    return this.get('listing') === 'import';
  },

  // For create-from-scratch view
  createFromScratch: function() {
    this.set('contentPane', 'creatingFromScratch');
    var self = this;
    var table = new cdb.admin.CartoDBTableMetadata();
    table.save({}, {
      success: function() {
        self._addNewLayer(table.get('name'));
      },
      error: function() {
        this.set('contentPane', 'addLayerFailed');
      }
    });
  },

  _initBinds: function() {
    this.upload.bind('change', function() {
      this.trigger('change:upload', this);
    }, this);
    this.visFetchModel.bind('change', this._fetchCollection, this);
    this.bind('change:listing', this._maybePrefetchDatasets);

    this.collection.bind('change:selected', function(changedModel, wasSelected) {
      this.selectedDatasets[ wasSelected ? 'add' : 'remove' ](changedModel);
    }, this);
    this.collection.bind('reset', function() {
      this.selectedDatasets.each(function(model) {
        var sameModel = this.collection.get(model.id);
        if (sameModel) {
          sameModel.set('selected', true);
        }
      }, this);
    }, this);
  },

  _maybePrefetchDatasets: function() {
    if (this.get('listing') === 'datasets' && !this.get('collectionFetched') && !this.visFetchModel.isSearching()) {
      this.set('collectionFetched', true);
      this._fetchCollection();
    }
  },

  _fetchCollection: function() {
    var params = this.visFetchModel.attributes;
    var types;

    if (this.visFetchModel.isSearching()) {
      // Supporting search in data library and user datasets at the same time
      types = 'table,remote';
    } else {
      types = params.library ? 'remote' : 'table';
    }

    this.collection.options.set({
      locked: '',
      q: params.q,
      page: params.page || 1,
      tags: params.tag,
      per_page: this.collection['_TABLES_PER_PAGE'],
      shared: params.shared,
      only_liked: params.liked,
      order: 'updated_at',
      type: '',
      types: types,
      exclude_raster: true
    });

    this.collection.fetch();
  },

  _onCollectionChange: function() {
    this.selectedDatasets.reset(this.collection.where({ selected: true }));
  },

  _addNewLayer: function(tableName) {
    this.set('contentPane', 'addingNewLayer');

    var self = this;
    this.map.addCartodbLayerFromTable(tableName, this.user.get('username'), {
      vis: this.vis,
      success: function() {
        // layers need to be saved because the order may changed
        self.map.layers.saveLayers();
        self.trigger('addLayerDone');
      },
      error: function() {
        self.set('contentPane', 'addLayerFailed');
      }
    });
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../background_polling/models/upload_model":15,"../../visualizations_fetch_model":222}],140:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var BaseDialog = require('../../views/base_dialog/view');
var CreateListing = require('../create/create_listing');
var FooterView = require('./add_layer/footer_view');
var ViewFactory = require('../../view_factory');
var randomQuote = require('../../view_helpers/random_quote');
var NavigationView = require('../create/listing/navigation_view');

/**
 * Add layer dialog, typically used from editor
 */
module.exports = BaseDialog.extend({

  initialize: function() {
    this.elder('initialize');
    if (!this.model) {
      throw new TypeError('model is required');
    }
    if (!this.options.user) {
      throw new TypeError('user is required');
    }

    this._template = cdb.templates.getTemplate('common/dialogs/map/add_layer_template');
    this._initBinds();
  },

  // implements cdb.ui.common.Dialog.prototype.render
  render: function() {
    this.clearSubViews();
    BaseDialog.prototype.render.call(this);
    this.$('.content').addClass('Dialog-content--expanded');
    this._initViews();
    this.$('.js-footer').append(this._footerView.render().el);
    return this;
  },

  // implements cdb.ui.common.Dialog.prototype.render
  render_content: function() {
    return this._template({
    });
  },

  _initBinds: function() {
    this.model.bind('addLayerDone', this.close, this);
    this.model.bind('change:contentPane', this._onChangeContentView, this);
    cdb.god.bind('importByUploadData', this.close, this);
    this.add_related_model(cdb.god);
  },

  _initViews: function() {
    this._contentPane = new cdb.ui.common.TabPane({
      el: this.$('.js-content-container')
    });
    this.addView(this._contentPane);

    this._navigationView = new NavigationView({
      el: this.$('.js-navigation'),
      user: this.options.user,
      routerModel: this.model.visFetchModel,
      createModel: this.model,
      collection: this.model.collection
    });
    this._navigationView.render();
    this.addView(this._navigationView);

    this._addTab('listing',
      new CreateListing({
        createModel: this.model,
        user: this.options.user
      })
    );
    this._addTab('creatingFromScratch',
      ViewFactory.createByTemplate('common/templates/loading', {
        title: 'Creating empty dataset…',
        quote: randomQuote()
      })
    );
    this._addTab('addingNewLayer',
      ViewFactory.createByTemplate('common/templates/loading', {
        title: 'Adding new layer…',
        quote: randomQuote()
      })
    );
    this._addTab('addLayerFailed',
      ViewFactory.createByTemplate('common/templates/fail', {
        msg: 'Could not add layer'
      })
    );
    this._contentPane.active(this.model.get('contentPane'));

    this._footerView = new FooterView({
      model: this.model,
      user: this.options.user
    });
    this.addView(this._footerView);
  },

  _addTab: function(name, view) {
    this._contentPane.addTab(name, view.render());
    this.addView(view);
  },

  _onChangeContentView: function() {
    var pane = this.model.get('contentPane');
    this._contentPane.active(pane);
    if (pane === 'loading') {
      this._footerView.hide();
    }
    if (pane !== "listing") {
      this._navigationView.hide();
    }
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../view_factory":209,"../../view_helpers/random_quote":212,"../../views/base_dialog/view":213,"../create/create_listing":58,"../create/listing/navigation_view":92,"./add_layer/footer_view":138}],141:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);

/**
 *  Asset item previewing image
 *
 *  - It needs a model with asset url and state (is-idle, is-selected, is-destroying).
 *
 *  new AssetsItemView({
 *    model: asset_model
 *  })
 */
module.exports = cdb.core.View.extend({

  _SIZE: 60, // Thumbnail size (same cm for width and height)
  _MIN_SIZE: 32, // Minimal thumbnail size (same cm for width and height)

  tagName: 'li',

  options: {
    template: 'common/dialogs/map/image_picker/assets_item'
  },

  events: {
    'click a.delete': '_openDropdown',
    'click':          '_onClick'
  },

  initialize: function() {
    this.template = cdb.templates.getTemplate(this.options.template);
    this._initBinds();
  },

  render: function() {
    this.clearSubViews();
    this.$el.append(this.template(this.model.toJSON()));

    this._calcBkgImg(this.model.get("public_url"));

    return this;
  },

  _initBinds: function() {
    _.bindAll(this, '_onClick', '_openDropdown');

    this.model.bind('change:state', this._changeState, this);
    this.model.bind('destroy', this.remove, this);
  },

  _calcBkgImg: function(src) {
    var img = new Image();
    var self = this;

    img.onload = function() {
      var w = this.width;
      var h = this.height;

      var $thumbnail = self.$("a.image");

      self.$el.css("background","none");

      if(self.model.get("kind") === 'marker') {
        if(h > self._SIZE) {
          $thumbnail.css({
            "background-size":  "cover",
            "background-origin": "content-box"
          });
        } else if ((w || h) < self._MIN_SIZE) {
          // Scale up images smaller than considered min size (e.g. maki icons).
          $thumbnail.css({
            "background-size": self._MIN_SIZE + "px"
          });
        }
      } else {
        if ((w || h) > self._SIZE) {
          $thumbnail.css({
            "background-size":  "cover",
            "background-origin": "content-box"
          });
        } else {
          $thumbnail.css({
            "background-position": "0 0",
            "background-repeat": "repeat"
          });
        }
      }
    }

    img.onerror = function(e){ cdb.log.info(e) };
    img.src = src;
  },

  _onClick: function(e) {
    this.killEvent(e);

    if (this.model.get('state') !== 'selected' && this.model.get('state') != 'destroying') {
      this.trigger('selected', this.model);
      this.model.set('state', 'selected');
    }
  },

  _changeState: function() {
    this.$el
      .removeClass('is-idle is-selected is-destroying')
      .addClass("is-" + this.model.get('state'));
  },

  _openDropdown: function(e) {
    var self = this;

    this.killEvent(e);
    e.stopImmediatePropagation();

    this.dropdown = new cdb.admin.DropdownMenu({
      className: 'dropdown border tiny',
      target: $(e.target),
      width: 196,
      speedIn: 150,
      speedOut: 300,
      template_base: 'common/dialogs/map/image_picker/remove_asset',
      vertical_position: "down",
      horizontal_position: "left",
      horizontal_offset: 3,
      tick: "left"
    });

    this.dropdown.bind("optionClicked", function(ev) {
      ev.preventDefault();
      self._deleteAsset();
    });

    $('body').append(this.dropdown.render().el);
    this.dropdown.open(e);
    cdb.god.bind("closeDialogs", this.dropdown.hide, this.dropdown);
  },

  _deleteAsset: function() {
    var self = this;
    this.model.set('state', 'destroying');

    this.model.destroy({
      success: function() {},
      error: function() {
        self.model.set('state', 'idle');
      }
    })
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],142:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var StaticAssetItemView = require('./static_assets_item_view');

module.exports = cdb.core.View.extend({

  className: 'AssetPane',

  initialize: function() {
    this.model = this.options.model;
    this.template = cdb.templates.getTemplate('common/dialogs/map/image_picker/assets_template');
    this._setupAssets();
  },

  render: function() {
    this.clearSubViews();
    this.$el.html(this.template());
    this._renderAssets();
    return this;
  },

  _setupAssets: function() {
    var opts = {};

    if (this.options.folder !== undefined)  opts.folder = this.options.folder;
    if (this.options.size   !== undefined)  opts.size   = this.options.size;
    if (this.options.host   !== undefined)  opts.host   = this.options.host;
    if (this.options.ext    !== undefined)  opts.ext    = this.options.ext;

    if (!_.isEmpty(opts)) {
      this.options.icons = _.map(this.options.icons, function(a) {
        return _.extend(a, opts);
      });
    }

    this.collection = new cdb.admin.StaticAssets(this.options.icons);
  },

  _renderAssets: function() {
    var self = this;
    var items = this.collection.where({ kind: this.options.kind });

    _(items).each(function(mdl) {
      var item = new StaticAssetItemView({
        className: 'AssetItem ' + (self.options.folder || ''),
        template: 'common/dialogs/map/image_picker/static_assets_item',
        model: mdl
      });
      item.bind('selected', self._selectItem, self);

      self.$('ul').append(item.render().el);
      self.addView(item);
    });
  },

  _selectItem: function(m) {
    this.model.set('value', m.get('public_url'));
    this.trigger('fileChosen', this);
    this._unselectItems(m);
  },

  // Unselect all images expect the selected one
  _unselectItems: function(m) {
    this.collection.each(function(mdl) {
      if (mdl !== m && mdl.get('state') === 'selected') {
        mdl.set('state', 'idle');
      }
    });
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./static_assets_item_view":152}],143:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
cdb.admin = (typeof window !== "undefined" ? window['cdb']['admin'] : typeof global !== "undefined" ? global['cdb']['admin'] : null);
var UploadModel = require('./upload_model');

module.exports = cdb.core.View.extend({

  className: 'AssetPane',

  events: {
    'click .js-fileButton': '_onBoxClick'
  },

  _UPLOADER: {
    url:              '/api/v1/users/<%- id %>/assets',
    uploads:          1, // Max uploads at the same time
    maxFileSize:      1048576, // 1MB
    acceptFileTypes:  ['png','svg','jpeg','jpg'],
    acceptSync:       undefined,
    resolution:       "1024x1024"
  },

  initialize: function() {
    _.bindAll(this, '_onDbxChooserSuccess');

    this.kind = this.options.kind;
    this.user = this.options.user;
    this._setupModel();
    this.collection = this.options.collection;
  },

  render: function() {
    this.clearSubViews();

    this.template = cdb.templates.getTemplate('common/dialogs/map/image_picker/box_template');

    this.$el.html(this.template());

    return this;
  },

  _setupModel: function() {
    this.model = new UploadModel({
      type: this.options.type,
      kind: this.options.kind
    }, {
      userId: this.user.get("id")
    });
    this._initBinds();
  },

  _initBinds: function() {
    this.model.bind('change:state', this._onChangeState, this);
  },

  _onStateUploaded: function() {
    this.collection.fetch();
    this.model.setFresh({ kind: this.kind });
  },

  _onStateError: function() {
    this._showFileError();
    this.trigger("hide_loader", this);
    this.$(".js-import-panel").show();
    this.model.setFresh({ kind: this.kind });
  },

  _showFileError: function() {
    if (this.model.get('state') === "error") {
      this.$('.js-fileError')
        .text(this.model.get('get_error_text').what_about)
        .show();
      this.$('.js-fileButton').addClass('Button--negative');
    }
  },

  _hideFileError: function() {
    this.$('.js-fileError').hide();
    this.$('.js-fileLabel').show();
    this.$('.js-fileButton').removeClass('Button--negative');
  },

  _onChangeState: function() {
    var state = this.model.get('state');

    if (state === 'uploaded') {
      this._onStateUploaded();
    } else {
      if (state == "error") {
        this._onStateError();
      } else if (state === 'idle' || state === "uploading") {
        this.$(".js-import-panel").hide();
        this.trigger("show_loader", this);
      } else {
        this.$(".js-import-panel").show();
        this.trigger("hide_loader", this);
      }
    }
  },


  _onBoxClick: function(e) {
    this.killEvent(e);

    Box.choose({
      success:      this._onDbxChooserSuccess,
      multiselect:  false,
      linkType:     "direct",
      extensions:   _.map(this._UPLOADER.acceptFileTypes, function(ext) { return '.' + ext })
    });
  },

  _onDbxChooserSuccess: function(files) {
    if (files && files[0]) {
      this.model.set({
        type: 'url',
        value: files[0].link,
        state: 'uploading'
      });

      this.model.upload();

      if (this.model.get('state') !== "error") {
        // Remove errors
        this._hideFileError();
      } else {
        this._showFileError();
      }
    }
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./upload_model":153}],144:[function(require,module,exports){
// Maki icons from https://github.com/mapbox/maki
// and https://github.com/mapbox/maki/blob/mb-pages/_includes/maki.json
module.exports = {
  disclaimer: '<a href="https://github.com/mapbox/maki" target="_blank">Maki Icons</a>, an open source project by <a href="http://mapbox.com" target="_blank">Mapbox</a>',
  icons: [
    {
        "name": "Circle stroked",
        "icon": "circle-stroked"
    },
    {
        "name": "Circle solid",
        "icon": "circle"
    },
    {
        "name": "Square stroked",
        "icon": "square-stroked"
    },
    {
        "name": "Square solid",
        "icon": "square"
    },
    {
        "name": "Triangle stroked",
        "icon": "triangle-stroked"
    },
    {
        "name": "Triangle solid",
        "icon": "triangle"
    },
    {
        "name": "Star stroked",
        "icon": "star-stroked"
    },
    {
        "name": "Star solid",
        "icon": "star"
    },
    {
        "name": "Cross",
        "icon": "cross"
    },
    {
        "name": "Marker Stroke",
        "icon": "marker-stroked"
    },
    {
        "name": "Marker Solid",
        "icon": "marker"
    },
    {
        "name": "Religious Jewish",
        "icon": "religious-jewish"
    },
    {
        "name": "Religious Christian",
        "icon": "religious-christian"
    },
    {
        "name": "Religious Muslim",
        "icon": "religious-muslim"
    },
    {
        "name": "Cemetery",
        "icon": "cemetery"
    },
    {
        "name": "Rocket",
        "icon": "rocket"
    },
    {
        "name": "Airport",
        "icon": "airport"
    },
    {
        "name": "Heliport",
        "icon": "heliport"
    },
    {
        "name": "Rail",
        "icon": "rail"
    },
    {
        "name": "Rail Metro",
        "icon": "rail-metro"
    },
    {
        "name": "Rail Light",
        "icon": "rail-light"
    },
    {
        "name": "Bus",
        "icon": "bus"
    },
    {
        "name": "Fuel",
        "icon": "fuel"
    },
    {
        "name": "Parking",
        "tags": [
            "parking",
            "transportation"
        ],
        "icon": "parking"
    },
    {
        "name": "Parking Garage",
        "tags": [
            "parking",
            "transportation",
            "garage"
        ],
        "icon": "parking-garage"
    },
    {
        "name": "Airfield",
        "tags": [
            "airfield",
            "airport",
            "plane",
            "landing strip"
        ],
        "icon": "airfield"
    },
    {
        "name": "Roadblock",
        "tags": [
            "roadblock",
            "stop",
            "warning",
            "dead end"
        ],
        "icon": "roadblock"
    },
    {
        "name": "Ferry",
        "tags": [
            "ship",
            "boat",
            "water",
            "ferry",
            "transportation"
        ],
        "icon": "ferry"
    },
    {
        "name": "Harbor",
        "tags": [
            "marine",
            "dock",
            "water",
            "wharf"
        ],
        "icon": "harbor"
    },
    {
        "name": "Bicycle",
        "tags": [
            "cycling",
            "cycle",
            "transportation"
        ],
        "icon": "bicycle"
    },
    {
        "name": "Park",
        "tags": [
            "recreation",
            "park",
            "forest",
            "tree",
            "green",
            "woods",
            "nature"
        ],
        "icon": "park"
    },
    {
        "name": "Park 2",
        "tags": [
            "recreation",
            "park",
            "forest",
            "tree",
            "green",
            "woods",
            "nature"
        ],
        "icon": "park2"
    },
    {
        "name": "Museum",
        "tags": [
            "recreation",
            "museum",
            "tourism"
        ],
        "icon": "museum"
    },
    {
        "name": "Lodging",
        "tags": [
            "lodging",
            "hotel",
            "recreation",
            "motel",
            "tourism"
        ],
        "icon": "lodging"
    },
    {
        "name": "Monument",
        "tags": [
            "recreation",
            "statue",
            "monument",
            "tourism"
        ],
        "icon": "monument"
    },
    {
        "name": "Zoo",
        "tags": [
            "recreation",
            "zoo",
            "animal",
            "giraffe"
        ],
        "icon": "zoo"
    },
    {
        "name": "Garden",
        "tags": [
            "recreation",
            "garden",
            "park",
            "flower",
            "nature"
        ],
        "icon": "garden"
    },
    {
        "name": "Campsite",
        "tags": [
            "recreation",
            "campsite",
            "camp",
            "camping",
            "tent",
            "nature"
        ],
        "icon": "campsite"
    },
    {
        "name": "Theatre",
        "tags": [
            "recreation",
            "theatre",
            "theater",
            "entertainment",
            "play",
            "performance"
        ],
        "icon": "theatre"
    },
    {
        "name": "Art gallery",
        "tags": [
            "art",
            "center",
            "museum",
            "gallery",
            "creative",
            "recreation",
            "entertainment",
            "studio"
        ],
        "icon": "art-gallery"
    },
    {
        "name": "Pitch",
        "tags": [
            "pitch",
            "track",
            "athletic",
            "sports",
            "field"
        ],
        "icon": "pitch"
    },
    {
        "name": "Soccer",
        "tags": [
            "soccer",
            "sports"
        ],
        "icon": "soccer"
    },
    {
        "name": "American Football",
        "tags": [
            "football",
            "sports"
        ],
        "icon": "america-football"
    },
    {
        "name": "Tennis",
        "tags": [
            "tennis",
            "court",
            "ball",
            "sports"
        ],
        "icon": "tennis"
    },
    {
        "name": "Basketball",
        "tags": [
            "basketball",
            "ball",
            "sports"
        ],
        "icon": "basketball"
    },
    {
        "name": "Baseball",
        "tags": [
            "baseball",
            "softball",
            "ball",
            "sports"
        ],
        "icon": "baseball"
    },
    {
        "name": "Golf",
        "tags": [
            "golf",
            "sports",
            "course"
        ],
        "icon": "golf"
    },
    {
        "name": "Swimming",
        "tags": [
            "swimming",
            "water",
            "swim",
            "sports"
        ],
        "icon": "swimming"
    },
    {
        "name": "Cricket",
        "tags": [
            "cricket",
            "sports"
        ],
        "icon": "cricket"
    },
    {
        "name": "Skiing",
        "tags": [
            "winter",
            "skiing",
            "ski",
            "sports"
        ],
        "icon": "skiing"
    },
    {
        "name": "School",
        "tags": [
            "school",
            "highschool",
            "elementary",
            "children",
            "amenity",
            "middle"
        ],
        "icon": "school"
    },
    {
        "name": "College",
        "tags": [
            "college",
            "school",
            "amenity",
            "university"
        ],
        "icon": "college"
    },
    {
        "name": "Library",
        "tags": [
            "library",
            "books",
            "amenity"
        ],
        "icon": "library"
    },
    {
        "name": "Post",
        "tags": [
            "post",
            "office",
            "amenity",
            "mail",
            "letter"
        ],
        "icon": "post"
    },
    {
        "name": "Fire station",
        "tags": [
            "fire",
            "station",
            "amenity"
        ],
        "icon": "fire-station"
    },
    {
        "name": "Town hall",
        "tags": [
            "townhall",
            "mayor",
            "building",
            "amenity",
            "government"
        ],
        "icon": "town-hall"
    },
    {
        "name": "Police",
        "tags": [
            "police",
            "jail",
            "arrest",
            "amenity",
            "station"
        ],
        "icon": "police"
    },
    {
        "name": "Prison",
        "tags": [
            "prison",
            "jail",
            "amenity"
        ],
        "icon": "prison"
    },
    {
        "name": "Embassy",
        "tags": [
            "embassy",
            "diplomacy",
            "consulate",
            "amenity",
            "flag"
        ],
        "icon": "embassy"
    },
    {
        "name": "Beer",
        "tags": [
            "bar",
            "beer",
            "drink",
            "commercial",
            "biergarten",
            "pub"
        ],
        "icon": "beer"
    },
    {
        "name": "Restaurant",
        "tags": [
            "restaurant",
            "commercial"
        ],
        "icon": "restaurant"
    },
    {
        "name": "Cafe",
        "tags": [
            "cafe",
            "coffee",
            "commercial",
            "tea"
        ],
        "icon": "cafe"
    },
    {
        "name": "Shop",
        "tags": [
            "shop",
            "mall",
            "commercial",
            "store"
        ],
        "icon": "shop"
    },
    {
        "name": "Fast Food",
        "tags": [
            "food",
            "fast",
            "commercial",
            "burger",
            "drive-through"
        ],
        "icon": "fast-food"
    },
    {
        "name": "Bar",
        "tags": [
            "bar",
            "drink",
            "commercial",
            "club",
            "martini",
            "lounge"
        ],
        "icon": "bar"
    },
    {
        "name": "Bank",
        "tags": [
            "bank",
            "atm",
            "commercial",
            "money"
        ],
        "icon": "bank"
    },
    {
        "name": "Grocery",
        "tags": [
            "food",
            "grocery",
            "commercial",
            "store",
            "market"
        ],
        "icon": "grocery"
    },
    {
        "name": "Cinema",
        "tags": [
            "cinema",
            "theatre",
            "film",
            "movie",
            "commercial",
            "theater",
            "entertainment"
        ],
        "icon": "cinema"
    },
    {
        "name": "Pharmacy",
        "tags": [
            "pharmacy",
            "drugs",
            "medication",
            "social",
            "medicine",
            "prescription"
        ],
        "icon": "pharmacy"
    },
    {
        "name": "Hospital",
        "tags": [
            "hospital",
            "health",
            "medication",
            "social",
            "medicine",
            "medical",
            "clinic"
        ],
        "icon": "hospital"
    },
    {
        "name": "Danger",
        "tags": [
            "minefield",
            "landmine",
            "disaster",
            "dangerous",
            "hazard"
        ],
        "icon": "danger"
    },
    {
        "name": "Industrial",
        "tags": [
            "industrial",
            "factory",
            "property",
            "building"
        ],
        "icon": "industrial"
    },
    {
        "name": "Warehouse",
        "tags": [
            "warehouse",
            "property",
            "storage",
            "building"
        ],
        "icon": "warehouse"
    },
    {
        "name": "Commercial",
        "tags": [
            "commercial",
            "property",
            "business",
            "building"
        ],
        "icon": "commercial"
    },
    {
        "name": "Building",
        "tags": [
            "building",
            "property",
            "structure",
            "business",
            "building"
        ],
        "icon": "building"
    },
    {
        "name": "Place of worship",
        "tags": [
            "religion",
            "ceremony",
            "religious",
            "nondenominational",
            "church",
            "temple"
        ],
        "icon": "place-of-worship"
    },
    {
        "name": "Alcohol shop",
        "tags": [
            "alcohol",
            "liquor",
            "store",
            "shop",
            "beer",
            "wine",
            "vodka"
        ],
        "icon": "alcohol-shop"
    },
    {
        "name": "Logging",
        "tags": [
            "logger",
            "chainsaw",
            "woods",
            "industry"
        ],
        "icon": "logging"
    },
    {
        "name": "Oil well",
        "tags": [
            "oil",
            "natural",
            "environment",
            "industry",
            "resources"
        ],
        "icon": "oil-well"
    },
    {
        "name": "Slaughterhouse",
        "tags": [
            "cows",
            "cattle",
            "food",
            "meat",
            "industry",
            "resources"
        ],
        "icon": "slaughterhouse"
    },
    {
        "name": "Dam",
        "tags": [
            "water",
            "natural",
            "hydro",
            "hydroelectric",
            "energy",
            "environment",
            "industry",
            "resources"
        ],
        "icon": "dam"
    },
    {
    "name": "Water",
    "tags": [
        "water",
        "natural",
        "hydro",
        "lake",
        "river",
        "ocean",
        "resources"
    ],
    "icon": "water"
    },
    {
    "name": "Wetland",
    "tags": [
        "water",
        "swamp",
        "natural"
    ],
    "icon": "wetland"
    },
    {
    "name": "Disability",
    "tags": [
        "handicap",
        "wheelchair",
        "access"
    ],
    "icon": "disability"
    },
    {
    "name": "Telephone",
    "tags": [
        "payphone",
        "call"
    ],
    "icon": "telephone"
    },
    {
    "name": "Emergency Telephone",
    "tags": [
        "payphone",
        "danger",
        "safety",
        "call"
    ],
    "icon": "emergency-telephone"
    },
    {
    "name": "Toilets",
    "tags": [
        "bathroom",
        "men",
        "women",
        "sink",
        "washroom",
        "lavatory"
    ],
    "icon": "toilets"
    },
    {
    "name": "Waste Basket",
    "tags": [
        "trash",
        "rubbish",
        "bin",
        "garbage"
    ],
    "icon": "waste-basket"
    },
    {
    "name": "Music",
    "tags": [
        "stage",
        "performance",
        "band",
        "concert",
        "venue"
    ],
    "icon": "music"
    },
    {
    "name": "Land Use",
    "tags": [
        "zoning",
        "usage",
        "area"
    ],
    "icon": "land-use"
    },
    {
    "name": "City",
    "tags": [
        "area",
        "point",
        "place",
        "urban"
    ],
    "icon": "city"
    },
    {
    "name": "Town",
    "tags": [
        "area",
        "point",
        "place",
        "small"
    ],
    "icon": "town"
    },
    {
    "name": "Village",
    "tags": [
        "area",
        "point",
        "place",
        "small",
        "rural"
    ],
    "icon": "village"
    },
    {
    "name": "Farm",
    "tags": [
        "building",
        "farming",
        "crops",
        "plants",
        "agriculture",
        "rural"
    ],
    "icon": "farm"
    },
    {
    "name": "Bakery",
    "tags": [
        "bakery",
        "pastry",
        "croissant",
        "food",
        "shop",
        "bread"
    ],
    "icon": "bakery"
    },
  {
    "name": "Dog Park",
    "tags": [
        "dog",
        "pet"
    ],
    "icon": "dog-park"
    },
   {
    "name": "Lighthouse",
    "tags": [
        "building",
        "navigation",
        "nautical",
        "ocean",
        "logistics"
    ],
    "icon": "lighthouse"
    },
    {
    "name": "Clothing Store",
    "tags": [
        "clothing",
        "store",
        "shop"
    ],
    "icon": "clothing-store"
    },
    {
    "name": "Polling Place",
    "icon": "polling-place"
    },
    {
    "name": "Playground",
    "icon": "playground"
    },
    {
    "name": "Entrance",
    "icon": "entrance"
    },
    {
    "name": "Heart",
    "icon": "heart"
    },
    {
    "name": "London Underground",
    "icon": "london-underground"
    },
    {
    "name": "Minefield",
    "icon": "minefield"
    },
    {
    "name": "Rail Underground",
    "icon": "rail-underground"
    },
    {
    "name": "Rail Above",
    "icon": "rail-above"
    },
    {
     "name": "Camera",
     "icon": "camera"
    },
    {
    "name": "Laundry",
    "icon": "laundry"
    },
    {
        "name": "Car",
        "icon": "car"
    },
    {
    "name": "Suitcase",
    "icon": "suitcase"
    },
    {
    "name": "Hairdresser",
    "icon": "hairdresser"
    },
    {
    "name": "Chemist",
    "icon": "chemist"
    },
    {
    "name": "Mobile phone",
    "icon": "mobilephone"
    },
    {
    "name": "Scooter",
    "icon": "scooter"
    }
  ]
};

},{}],145:[function(require,module,exports){
module.exports = {
  icons: [
    { kind: "pattern", ext: "png", name: 'diagonal_1px_fast', icon: 'diagonal_1px_fast'},
    { kind: "pattern", ext: "png", name: 'diagonal_1px_med', icon: 'diagonal_1px_med', },
    { kind: "pattern", ext: "png", name: 'diagonal_1px_slow', icon: 'diagonal_1px_slow'},
    { kind: "pattern", ext: "png", name: 'diagonal_2px_fast', icon: 'diagonal_2px_fast', },
    { kind: "pattern", ext: "png", name: 'diagonal_2px_med', icon: 'diagonal_2px_med', },
    { kind: "pattern", ext: "png", name: 'diagonal_2px_slow', icon: 'diagonal_2px_slow'},
    { kind: "pattern", ext: "png", name: 'donuts_4px_med', icon: 'donuts_4px_med', },
    { kind: "pattern", ext: "png", name: 'donuts_6px_med', icon: 'donuts_6px_med', },
    { kind: "pattern", ext: "png", name: 'dots_2px_fast', icon: 'dots_2px_fast', },
    { kind: "pattern", ext: "png", name: 'dots_2px_med', icon: 'dots_2px_med', },
    { kind: "pattern", ext: "png", name: 'dots_2px_slow', icon: 'dots_2px_slow'},
    { kind: "pattern", ext: "png", name: 'dots_4px_fast', icon: 'dots_4px_fast'},
    { kind: "pattern", ext: "png", name: 'dots_4px_med', icon: 'dots_4px_med', },
    { kind: "pattern", ext: "png", name: 'dots_6px_fast', icon: 'dots_6px_fast' },
    { kind: "pattern", ext: "png", name: 'dots_6px_med',  icon: 'dots_6px_med' }
  ]
};

},{}],146:[function(require,module,exports){
// Pin maps from http://www.flaticon.com/packs/pins-of-maps/
module.exports = {
  disclaimer: '<a href="http://www.flaticon.com/packs/pins-of-maps/" target="_blank">Pin Maps</a>, icons by <a href="http://freepik.com" target="_blank">freepik.com</a>',
  icons: [
    { name: 'air', icon: 'air' },
    { name: 'air2', icon: 'air2' },
    { name: 'anchor2', icon: 'anchor2' },
    { name: 'anchor3', icon: 'anchor3' },
    { name: 'bag1', icon: 'bag1' },
    { name: 'bag2', icon: 'bag2' },
    { name: 'balloon', icon: 'balloon' },
    { name: 'black41', icon: 'black41' },
    { name: 'boat1', icon: 'boat1' },
    { name: 'book16', icon: 'book16' },
    { name: 'building', icon: 'building' },
    { name: 'burger', icon: 'burger' },
    { name: 'bus6', icon: 'bus6' },
    { name: 'caravan2', icon: 'caravan2' },
    { name: 'church1', icon: 'church1' },
    { name: 'church3', icon: 'church3' },
    { name: 'club', icon: 'club' },
    { name: 'cocktail3', icon: 'cocktail3' },
    { name: 'coffee2', icon: 'coffee2' },
    { name: 'dark11', icon: 'dark11' },
    { name: 'disabled', icon: 'disabled' },
    { name: 'dog2', icon: 'dog2' },
    { name: 'favourite1', icon: 'favourite1' },
    { name: 'flag5', icon: 'flag5' },
    { name: 'flat', icon: 'flat' },
    { name: 'hotel', icon: 'hotel' },
    { name: 'information3', icon: 'information3' },
    { name: 'location10', icon: 'location10' },
    { name: 'location11', icon: 'location11' },
    { name: 'location5', icon: 'location5' },
    { name: 'location6', icon: 'location6' },
    { name: 'location7', icon: 'location7' },
    { name: 'location8', icon: 'location8' },
    { name: 'location9', icon: 'location9' },
    { name: 'marker2', icon: 'marker2' },
    { name: 'marker3', icon: 'marker3' },
    { name: 'marker4', icon: 'marker4' },
    { name: 'marker5', icon: 'marker5' },
    { name: 'marker6', icon: 'marker6' },
    { name: 'marker7', icon: 'marker7' },
    { name: 'monument2', icon: 'monument2' },
    { name: 'mountains', icon: 'mountains' },
    { name: 'p', icon: 'p' },
    { name: 'petrol', icon: 'petrol' },
    { name: 'petrol2', icon: 'petrol2' },
    { name: 'pharmacy', icon: 'pharmacy' },
    { name: 'phone13', icon: 'phone13' },
    { name: 'pin10', icon: 'pin10' },
    { name: 'pins', icon: 'pins' },
    { name: 'pins1', icon: 'pins1' },
    { name: 'pins10', icon: 'pins10' },
    { name: 'pins11', icon: 'pins11' },
    { name: 'pins12', icon: 'pins12' },
    { name: 'pins13', icon: 'pins13' },
    { name: 'pins14', icon: 'pins14' },
    { name: 'pins15', icon: 'pins15' },
    { name: 'pins16', icon: 'pins16' },
    { name: 'pins17', icon: 'pins17' },
    { name: 'pins18', icon: 'pins18' },
    { name: 'pins19', icon: 'pins19' },
    { name: 'pins2', icon: 'pins2' },
    { name: 'pins20', icon: 'pins20' },
    { name: 'pins21', icon: 'pins21' },
    { name: 'pins22', icon: 'pins22' },
    { name: 'pins23', icon: 'pins23' },
    { name: 'pins24', icon: 'pins24' },
    { name: 'pins25', icon: 'pins25' },
    { name: 'pins26', icon: 'pins26' },
    { name: 'pins27', icon: 'pins27' },
    { name: 'pins28', icon: 'pins28' },
    { name: 'pins29', icon: 'pins29' },
    { name: 'pins3', icon: 'pins3' },
    { name: 'pins30', icon: 'pins30' },
    { name: 'pins31', icon: 'pins31' },
    { name: 'pins32', icon: 'pins32' },
    { name: 'pins33', icon: 'pins33' },
    { name: 'pins34', icon: 'pins34' },
    { name: 'pins35', icon: 'pins35' },
    { name: 'pins36', icon: 'pins36' },
    { name: 'pins37', icon: 'pins37' },
    { name: 'pins38', icon: 'pins38' },
    { name: 'pins39', icon: 'pins39' },
    { name: 'pins4', icon: 'pins4' },
    { name: 'pins40', icon: 'pins40' },
    { name: 'pins41', icon: 'pins41' },
    { name: 'pins42', icon: 'pins42' },
    { name: 'pins43', icon: 'pins43' },
    { name: 'pins44', icon: 'pins44' },
    { name: 'pins45', icon: 'pins45' },
    { name: 'pins46', icon: 'pins46' },
    { name: 'pins47', icon: 'pins47' },
    { name: 'pins48', icon: 'pins48' },
    { name: 'pins49', icon: 'pins49' },
    { name: 'pins5', icon: 'pins5' },
    { name: 'pins50', icon: 'pins50' },
    { name: 'pins51', icon: 'pins51' },
    { name: 'pins52', icon: 'pins52' },
    { name: 'pins53', icon: 'pins53' },
    { name: 'pins54', icon: 'pins54' },
    { name: 'pins55', icon: 'pins55' },
    { name: 'pins56', icon: 'pins56' },
    { name: 'pins57', icon: 'pins57' },
    { name: 'pins58', icon: 'pins58' },
    { name: 'pins59', icon: 'pins59' },
    { name: 'pins6', icon: 'pins6' },
    { name: 'pins60', icon: 'pins60' },
    { name: 'pins61', icon: 'pins61' },
    { name: 'pins62', icon: 'pins62' },
    { name: 'pins63', icon: 'pins63' },
    { name: 'pins64', icon: 'pins64' },
    { name: 'pins65', icon: 'pins65' },
    { name: 'pins66', icon: 'pins66' },
    { name: 'pins67', icon: 'pins67' },
    { name: 'pins68', icon: 'pins68' },
    { name: 'pins69', icon: 'pins69' },
    { name: 'pins7', icon: 'pins7' },
    { name: 'pins70', icon: 'pins70' },
    { name: 'pins71', icon: 'pins71' },
    { name: 'pins72', icon: 'pins72' },
    { name: 'pins73', icon: 'pins73' },
    { name: 'pins74', icon: 'pins74' },
    { name: 'pins75', icon: 'pins75' },
    { name: 'pins76', icon: 'pins76' },
    { name: 'pins77', icon: 'pins77' },
    { name: 'pins78', icon: 'pins78' },
    { name: 'pins79', icon: 'pins79' },
    { name: 'pins8', icon: 'pins8' },
    { name: 'pins80', icon: 'pins80' },
    { name: 'pins81', icon: 'pins81' },
    { name: 'pins82', icon: 'pins82' },
    { name: 'pins83', icon: 'pins83' },
    { name: 'pins84', icon: 'pins84' },
    { name: 'pins85', icon: 'pins85' },
    { name: 'pins86', icon: 'pins86' },
    { name: 'pins87', icon: 'pins87' },
    { name: 'pins88', icon: 'pins88' },
    { name: 'pins89', icon: 'pins89' },
    { name: 'pins9', icon: 'pins9' },
    { name: 'pins90', icon: 'pins90' },
    { name: 'pins91', icon: 'pins91' },
    { name: 'position', icon: 'position' },
    { name: 'restaurant2', icon: 'restaurant2' },
    { name: 'right14', icon: 'right14' },
    { name: 'road3', icon: 'road3' },
    { name: 'shop2', icon: 'shop2' },
    { name: 'shopping8', icon: 'shopping8' },
    { name: 'sit', icon: 'sit' },
    { name: 'ski1', icon: 'ski1' },
    { name: 'soccer1', icon: 'soccer1' },
    { name: 'suitcase1', icon: 'suitcase1' },
    { name: 'suitcase2', icon: 'suitcase2' },
    { name: 'telephone3', icon: 'telephone3' },
    { name: 'tent', icon: 'tent' },
    { name: 'tent1', icon: 'tent1' },
    { name: 'train3', icon: 'train3' },
    { name: 'train4', icon: 'train4' },
    { name: 'turn7', icon: 'turn7' },
    { name: 'walk', icon: 'walk' },
    { name: 'wifi11', icon: 'wifi11' }
  ]
};

},{}],147:[function(require,module,exports){
// Simple icons from http://www.flaticon.com/packs/simpleicon-places/
module.exports = {
  disclaimer: '<a href="http://www.flaticon.com/packs/simpleicon-places/" target="_blank">SimpleIcons Places</a>, icons by <a href="http://www.simpleicon.com" target="_blank">simpleicon.com</a>',
  icons: [
    { name: 'beach3', icon: 'beach3' },
    { name: 'beach4', icon: 'beach4' },
    { name: 'boat12', icon: 'boat12' },
    { name: 'building21', icon: 'building21' },
    { name: 'building22', icon: 'building22' },
    { name: 'building23', icon: 'building23' },
    { name: 'building24', icon: 'building24' },
    { name: 'buildings5', icon: 'buildings5' },
    { name: 'castle7', icon: 'castle7' },
    { name: 'church7', icon: 'church7' },
    { name: 'coconut5', icon: 'coconut5' },
    { name: 'compass44', icon: 'compass44' },
    { name: 'compass45', icon: 'compass45' },
    { name: 'compass46', icon: 'compass46' },
    { name: 'compass47', icon: 'compass47' },
    { name: 'compass49', icon: 'compass49' },
    { name: 'compass50', icon: 'compass50' },
    { name: 'factory7', icon: 'factory7' },
    { name: 'factory8', icon: 'factory8' },
    { name: 'flag31', icon: 'flag31' },
    { name: 'flag32', icon: 'flag32' },
    { name: 'heart206', icon: 'heart206' },
    { name: 'home84', icon: 'home84' },
    { name: 'home85', icon: 'home85' },
    { name: 'home86', icon: 'home86' },
    { name: 'home87', icon: 'home87' },
    { name: 'home88', icon: 'home88' },
    { name: 'home89', icon: 'home89' },
    { name: 'home90', icon: 'home90' },
    { name: 'map35', icon: 'map35' },
    { name: 'map36', icon: 'map36' },
    { name: 'map37', icon: 'map37' },
    { name: 'map38', icon: 'map38' },
    { name: 'map39', icon: 'map39' },
    { name: 'map40', icon: 'map40' },
    { name: 'map41', icon: 'map41' },
    { name: 'map42', icon: 'map42' },
    { name: 'map43', icon: 'map43' },
    { name: 'map44', icon: 'map44' },
    { name: 'map45', icon: 'map45' },
    { name: 'map46', icon: 'map46' },
    { name: 'map47', icon: 'map47' },
    { name: 'map48', icon: 'map48' },
    { name: 'map49', icon: 'map49' },
    { name: 'map50', icon: 'map50' },
    { name: 'map51', icon: 'map51' },
    { name: 'map52', icon: 'map52' },
    { name: 'map53', icon: 'map53' },
    { name: 'map54', icon: 'map54' },
    { name: 'map55', icon: 'map55' },
    { name: 'map56', icon: 'map56' },
    { name: 'map57', icon: 'map57' },
    { name: 'map58', icon: 'map58' },
    { name: 'map59', icon: 'map59' },
    { name: 'map60', icon: 'map60' },
    { name: 'palm9', icon: 'palm9' },
    { name: 'placeholder4', icon: 'placeholder4' },
    { name: 'sailboat5', icon: 'sailboat5' },
    { name: 'sunbathing', icon: 'sunbathing' },
    { name: 'sunbathing1', icon: 'sunbathing1' },
    { name: 'tower15', icon: 'tower15' },
    { name: 'town', icon: 'town' }
  ]
};

},{}],148:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
cdb.admin = (typeof window !== "undefined" ? window['cdb']['admin'] : typeof global !== "undefined" ? global['cdb']['admin'] : null);
var UploadModel = require('./upload_model');

module.exports = cdb.core.View.extend({

  className: 'AssetPane',

  events: {
    'click .js-fileButton': '_onDropboxClick'
  },

  _UPLOADER: {
    url:              '/api/v1/users/<%- id %>/assets',
    uploads:          1, // Max uploads at the same time
    maxFileSize:      1048576, // 1MB
    acceptFileTypes:  ['png','svg','jpeg','jpg'],
    acceptSync:       undefined,
    resolution:       "1024x1024"
  },

  initialize: function() {
    _.bindAll(this, '_onDbxChooserSuccess');

    this.kind = this.options.kind;
    this.user = this.options.user;
    this._setupModel();
    this.collection = this.options.collection;
  },

  render: function() {
    this.clearSubViews();

    this.template = cdb.templates.getTemplate('common/dialogs/map/image_picker/dropbox_template');

    this.$el.html(this.template());

    return this;
  },

  _setupModel: function() {
    this.model = new UploadModel({
      type: this.options.type,
      kind: this.options.kind
    }, {
      userId: this.user.get("id")
    });
    this._initBinds();
  },

  _initBinds: function() {
    this.model.bind('change:state', this._onChangeState, this);
  },

  _onStateUploaded: function() {
    this.collection.fetch();
    this.model.setFresh({ kind: this.kind });
  },

  _onStateError: function() {
    this._showFileError();
    this.trigger("hide_loader", this);
    this.$(".js-import-panel").show();
    this.model.setFresh({ kind: this.kind });
  },

  _showFileError: function() {
    if (this.model.get('state') === "error") {
      this.$('.js-fileError')
        .text(this.model.get('get_error_text').what_about)
        .show();
      this.$('.js-fileButton').addClass('Button--negative');
    }
  },

  _hideFileError: function() {
    this.$('.js-fileError').hide();
    this.$('.js-fileLabel').show();
    this.$('.js-fileButton').removeClass('Button--negative');
  },

  _onChangeState: function() {
    var state = this.model.get('state');

    if (state === 'uploaded') {
      this._onStateUploaded();
    } else {
      if (state == "error") {
        this._onStateError();
      } else if (state === 'idle' || state === "uploading") {
        this.$(".js-import-panel").hide();
        this.trigger("show_loader", this);
      } else {
        this.$(".js-import-panel").show();
        this.trigger("hide_loader", this);
      }
    }
  },


  _onDropboxClick: function(e) {
    this.killEvent(e);

    Dropbox.choose({
      success:      this._onDbxChooserSuccess,
      multiselect:  false,
      linkType:     "direct",
      extensions:   _.map(this._UPLOADER.acceptFileTypes, function(ext) { return '.' + ext })
    });
  },

  _onDbxChooserSuccess: function(files) {
    if (files && files[0]) {
      this.model.set({
        type: 'url',
        value: files[0].link,
        state: 'uploading'
      });

      this.model.upload();

      if (this.model.get('state') !== "error") {
        // Remove errors
        this._hideFileError();
      } else {
        this._showFileError();
      }
    }
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./upload_model":153}],149:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
cdb.admin = (typeof window !== "undefined" ? window['cdb']['admin'] : typeof global !== "undefined" ? global['cdb']['admin'] : null);
var UploadModel = require('./upload_model');

module.exports = cdb.core.View.extend({

  className: 'AssetPane',

  options: {
    type: 'url',
    acceptSync: false,
    fileEnabled: true,
    formTemplate: '',
    headerTemplate: '',
    fileAttrs: {}
  },

  events: {
    'keyup .js-textInput': '_onTextChanged',
    'submit .js-form': '_onSubmitForm'
  },

  initialize: function() {

    this.user = this.options.user;
    this.kind = this.options.kind;

    this.collection = this.options.collection;

    this._setupModel();

    this.template = cdb.templates.getTemplate('common/dialogs/map/image_picker/file_upload_template');

  },

  render: function() {
    this.$el.html(
      this.template(_.extend(this.options, this.model.attributes))
    );

    this._initViews();
    return this;
  },

  _setupModel: function() {
    this.model = new UploadModel({
      type: this.options.type,
      kind: this.options.kind
    }, {
      userId: this.user.get("id")
    });
    this._initBinds();
  },

  _initBinds: function() {
    this.model.bind('change:state', this._onChangeState, this);
  },

  _initViews: function() {
    if (this.options.fileEnabled) {
      var self = this;
      this.$('.js-fileInput').bind('change', function(e) {
        if (this.files && this.files.length > 0) {
          self._onFileChanged(this.files);
        }
      });

      this._initDropzone();
    }
  },

  _onTextChanged: function() {
    var value = this.$('.js-textInput').val();
    if (!value) {
      this._hideTextError();
    }
  },

  _onSubmitForm: function(e) {
    if (e) this.killEvent(e);

    // URL submit
    var value = this.$('.js-textInput').val();

    if (!value) {
      this._hideTextError();
      return;
    }

    // Change file attributes :S
    this.trigger('urlSelected', this);

    // Change model
    this.model.set({
      type: 'url',
      value: value,
      state: 'idle'
    });

    this.model.upload();

    if (this.model.get('state') !== "error") {
      // Remove errors
      this._hideFileError();
      this._hideTextError();
    } else {
      this._showTextError();
    }
  },


  _initDropzone: function() {
    var el = $('html')[0]; // :(
    var self = this;

    this.dragster = new Dragster(el);

    $(el).bind("dragster:enter", function (e) {
      self._showDropzone();
    });

    $(el).bind("dragster:leave", function (e) {
      self._hideDropzone();
    });

    if (el.dropzone) { // avoid loading the dropzone twice
      return;
    }

    this.dropzone = new Dropzone(el, {
      url: ':)',
      autoProcessQueue: false,
      previewsContainer: false
    });

    this.dropzone.on('dragover', function() {
      self._showDropzone();
    });

    this.dropzone.on("drop", function (ev) {
      var files = ev.dataTransfer.files;
      self._onFileChanged(files);
      self._hideDropzone();
    });
  },

  _destroyDropzone: function() {
    var el = $('html')[0]; // :(

    if (this.dragster) {
      this.dragster.removeListeners();
      this.dragster.reset();
      $(el).unbind('dragster:enter dragster:leave');
    }

    if (this.dropzone) {
      this.dropzone.destroy();
    }
  },

  _setValidFileExtensions: function(list) {
    return RegExp("(\.|\/)(" + list.join('|') + ")$", "i");
  },

  _onFileChanged: function(files) {

    if (files && files.length === 1) {
      files = files[0];
    }

    this.model.set({
      type: 'file',
      value: files
    });

    if (this.model.get('state') !== "error") {
      this._hideFileError();
      this.model.set('state', 'selected');
      this.model.upload();
    } else {
      this._showFileError();
    }
  },

  _showTextError: function() {
    this.$('.Form-inputError').addClass('is-visible');
  },

  _hideTextError: function() {
    this.$('.Form-inputError').removeClass('is-visible');
  },

  _showDropzone: function() {
    this.$('.Form-upload').addClass('is-dropping');
    this._hideFileError();
  },

  _hideDropzone: function() {
    this.$('.Form-upload').removeClass('is-dropping');
  },

  _showFileError: function() {
    if (this.model.get('state') === "error") {
      this.$('.js-fileError')
        .text(this.model.get('get_error_text').what_about)
        .show();
      this.$('.js-fileLabel').hide();
      this.$('.js-fileButton').addClass('Button--negative');
    }
  },

  _hideFileError: function() {
    this.$('.js-fileError').hide();
    this.$('.js-fileLabel').show();
    this.$('.js-fileButton').removeClass('Button--negative');
  },

  _onStateUploaded: function() {
    this.collection.fetch();
    this.model.setFresh({ kind: this.kind });
    this.$(".js-textInput").val("");
  },

  _onStateError: function() {
    this._showFileError();
    this.$(".js-form").show();
    this.trigger("hide_loader", this);
    this.model.setFresh({ kind: this.kind });
  },

  _onChangeState: function() {
    var state = this.model.get('state');

    if (state === 'uploaded') {
      this._onStateUploaded();
    } else {
      if (state === "error") {
        this._onStateError();
      } else if (state === 'idle' || state === "uploading" || state === "selected") {
        this.$(".js-form").hide();
        this.trigger("show_loader", this);
      } else {
        this.$(".js-form").show();
        this.trigger("hide_loader", this);
      }
    }
  },

  clean: function() {
    this._destroyDropzone();
    this.$('.js-fileInput').unbind('change');
    this.elder('clean');
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./upload_model":153}],150:[function(require,module,exports){
(function (global){
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);

module.exports = cdb.core.View.extend({

  _TEXTS: {
    ok:           {
      simple_icons: _t('Set image'),
      pin_icons:    _t('Set image'),
      maki_icons:   _t('Set image'),
      your_icons:   _t('Set image'),
      upload_file:  _t('Upload image'),
      dropbox:      _t('Upload image'),
      box:      _t('Upload image')
    }
  },

  events: {
    'click .js-ok': '_finish'
  },

  initialize: function() {
    this.elder('initialize');
    this._template = cdb.templates.getTemplate('common/dialogs/map/image_picker/footer_template');
    this._initBinds();
  },

  render: function() {
    this.clearSubViews();

    var action = this._TEXTS.ok[this.model.get('pane')] || "Set image";
    var options = _.extend(this.model.attributes, { action:  action });
    var $el = $(this._template(options));

    this.$el.html($el);

    return this;
  },

  _initBinds: function() {
    this.model.bind('change', this.render, this);
    this.model.bind('change:disclaimer', this._updateFooterInfo, this);
  },

  _updateFooterInfo: function() {
    this.$el.find(".js-footer-info").html(this.model.get("disclaimer"));
  },

  _finish: function(e) {
    this.killEvent(e);

    if (this.model.get("submit_enabled")) {
      this.trigger("finish", this);
    }
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],151:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);

module.exports = cdb.core.View.extend({

  events: {
    'click .js-item':       '_onItemClick',
    'click .js-your-icons': '_onYourIconsClick'
  },

  initialize: function() {
    this.model = this.options.model;
    this.kind  = this.options.kind;
    this.collection = this.options.collection;
    this.template = cdb.templates.getTemplate('common/dialogs/map/image_picker/navigation_template');

    this._preRender();
    this._initBinds();
  },

  // It is necessary to add two static elements because
  // they can't be removed/replaced using render method
  // each time a change (in a model or a collection) happens.
  // This is due to the behaviour of the CSS animations.
  _preRender: function() {
    var $uInner = $('<div>').addClass('u-inner');
    var $filtersInner = $('<div>').addClass('Filters-inner');
    this.$el.append($uInner.append($filtersInner));
  },

  render: function(m, c) {
    this.clearSubViews();

    this.$('.Filters-inner').html(
      this.template({
      dropbox_enabled: this.model.get("dropbox_enabled"),
      box_enabled: this.model.get("box_enabled"),
      pane: this.model.get('pane'),
      kind: this.kind
    }));

    if (this.collection.where({ kind: this.kind }).length > 0) {
      var type = "your_icons";
      this.$el.find('[data-type="' + type + '"]').removeClass("is-disabled");
    }

    return this;
  },

  _initBinds: function() {
    this.model.bind('change:pane', this.render, this);
    this.model.bind('change:pane', this._enableFilter, this);
    this.add_related_model(this.model);
  },

  _onYourIconsClick: function(e) {
    if (this.collection.where({ kind: this.kind }).length > 0) {
      var type = $(e.target).data("type")
      this.model.set('pane', type);
    }
  },

  _onItemClick: function(e) {
    var type = $(e.target).data("type")
    this.model.set('pane', type);
  },

  _enableFilter: function(e) {
    var type = this.model.get('pane');
    var $el = this.$el.find('[data-type="' + type + '"]');
    $el.removeClass("is-disabled");
  }
});




}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],152:[function(require,module,exports){
var AssetsItemView = require('./assets_item_view');

module.exports = AssetsItemView.extend({

  events: {
    'click': '_onClick'
  },

  _deleteAsset: function() {},
  _openDropdown: function() {}

});

},{"./assets_item_view":141}],153:[function(require,module,exports){
(function (global){
var Backbone = (typeof window !== "undefined" ? window['Backbone'] : typeof global !== "undefined" ? global['Backbone'] : null);
var Utils = (typeof window !== "undefined" ? window['cdb']['Utils'] : typeof global !== "undefined" ? global['cdb']['Utils'] : null);
var moment = (typeof window !== "undefined" ? window['moment'] : typeof global !== "undefined" ? global['moment'] : null);
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);

/**
 * Model that let user upload files to our endpoints.
 *
 * NOTE: this model extends Backbone.Model instead of cdb.core.Model, because it's required for the
 * vendor/backbone-model-file-upload.
 */
module.exports = Backbone.Model.extend({

  url: function(method) {
    var version = cdb.config.urlVersion('asset', method);
    return '/api/' + version + '/users/' + this.userId + '/assets'
  },

  fileAttribute: 'filename',

  defaults: {
    type: '',
    value: '',
    interval: 0,
    progress: 0,
    state: 'idle',
    option: ''
  },

  initialize: function(val, opts) {
    this.user = opts && opts.user;

    if (!opts.userId) {
      throw new Error('userId is required');
    }

    this.userId = opts.userId;

    this._initBinds();
    this._validate(this.attributes, { validate: true });
  },

  isValidToUpload: function() {
    return this.get('value') && this.get('state') !== 'error';
  },

  setFresh: function(attributes) {
    this.clear();
    this.set(attributes);
  },

  _initBinds: function() {
    this.bind('progress', function(progress) {
      this.set({
        progress: progress*100,
        state: 'uploading'
      });
    }, this);

    this.bind('change:value', function() {
      if (this.get('state') === "error") {
        this.set({ state: 'idle' })
        this.unset('get_error_text', { silent: true });
      }
    }, this);

    this.bind('error invalid', function(m, d) {
      this.set({
        state: 'error',
        error_code: (d && d.error_code) || '',
        get_error_text: {
          title: 'Invalid import',
          what_about: (d && d.msg) || ''
        }
      }, { silent: true });
      // We need this, if not validate will run again and again and again... :(
      this.trigger('change');
    }, this);
  },

  validate: function(attrs) {
    if (!attrs) return;

    if (attrs.type === "file") {
      // Number of files
      if (attrs.value && attrs.value.length) {
        return {
          msg: "Unfortunately only one file is allowed per upload"
        }
      }
      // File extension
      var name = attrs.value.name;
      var ext = name.substr(name.lastIndexOf('.') + 1);
      if (ext) {
        ext = ext.toLowerCase();
      }
      if (!_.contains(["jpg", "png", "gif", "svg"], ext)) {
        return {
          msg: "Unfortunately this file extension is not allowed"
        }
      }
    }

    if (attrs.type === "url") {
      // Valid URL?
      if (!Utils.isURL(attrs.value)) {
        return {
          msg: "Unfortunately the URL provided is not valid"
        }
      }
    }

  },

  isValid: function() {
    return this.get('value') && this.get('state') !== "error"
  },

  upload: function() {
    var self = this;

    var options = {
      kind: this.get('kind')
    };

    if (this.get('type') === "file") {
      options.filename = this.get('value');
    } else if (this.get('type') === "url") {
      options.url = this.get('value');
    }

    this.xhr = this.save(options, {
      success: function(m) {
        m.set('state', 'uploaded');
      },
      error: function(m, msg) {

        var message = 'Unfortunately there was a connection error';

        if (msg && msg.status === 429) {
          var response = JSON.parse(msg.responseText);
          message = response.error;
        } else if (msg && msg.status === 400) {
          var response = JSON.parse(msg.responseText);
          message = response.error;
        }

        self.set({
          state: 'error',
          get_error_text: { title: 'There was an error', what_about: message }
        });

      },
      complete: function() {
        delete self.xhr;
      }
    });
  },

  stopUpload: function() {
    if (this.xhr) this.xhr.abort();
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],154:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
cdb.admin = (typeof window !== "undefined" ? window['cdb']['admin'] : typeof global !== "undefined" ? global['cdb']['admin'] : null);
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var AssetsView = require('./assets_view');
var AssetsItemView = require('./assets_item_view');

module.exports = AssetsView.extend({

  className: 'AssetPane AssetPane-userIcons',

  initialize: function() {
    this.model = this.options.model;
    this.template = cdb.templates.getTemplate('common/dialogs/map/image_picker/assets_template');

    this.collection.bind('add remove reset', this.render, this);
  },

  _renderAssets: function() {

    var self = this;
    var items = this.collection.where({ kind: this.options.kind });

    _(items).each(function(mdl) {
      var item = new AssetsItemView({
        className: 'AssetItem AssetItem-User',
        model: mdl
      });
      item.bind('selected', self._selectItem, self);

      self.$('ul').append(item.render().el);
      self.addView(item);
    });
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./assets_item_view":141,"./assets_view":142}],155:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var BaseDialog = require('../../views/base_dialog/view');
var ImagePickerNavigationView = require('./image_picker/navigation_view');
var FooterView = require('./image_picker/footer_view');
var AssetsView = require('./image_picker/assets_view');
var UserIconsView = require('./image_picker/user_icons_view');
var UploadView = require('./image_picker/file_upload_view');
var DropboxView = require('./image_picker/dropbox_view');
var BoxView = require('./image_picker/box_view');
var makiIcons = require('./image_picker/data/maki_icons');
var patterns = require('./image_picker/data/patterns');
var pinMaps = require('./image_picker/data/pin_maps');
var simpleicon = require('./image_picker/data/simpleicon');
var ViewFactory = require('../../view_factory');
var randomQuote = require('../../view_helpers/random_quote');

module.exports = BaseDialog.extend({

  className: "Dialog ImagePicker",

  initialize: function() {
    this.elder('initialize');

    this._validate();

    this.kind = this.options.kind;
    this.model = new cdb.core.Model({
      disclaimer: "",
      dropbox_enabled: cdb.config.get('dropbox_api_key') ? true : false,
      box_enabled: cdb.config.get('box_api_key') ? true : false,
      submit_enabled: false
    });

    this.collection = new cdb.admin.Assets([], {
      user: this.options.user
    });

    this._template = cdb.templates.getTemplate('common/dialogs/map/image_picker_template');
    this._initBinds();
    this._onChangePane();
  },

  render: function() {
    this.clearSubViews();
    BaseDialog.prototype.render.call(this);
    this.$('.content').addClass('Dialog-content--expanded');
    this._initViews();
    this._initAssets();
    return this;
  },

  _initAssets: function() {
    this.collection.bind('add remove reset',  this._onAssetsFetched,  this);
    this.collection.fetch();
  },

  _showLoader: function() {
    var loader = this._contentPane.getPane("loader");
    if (loader) {
      loader.show();
    }
  },

  _hideLoader: function() {
    var loader = this._contentPane.getPane("loader");
    if (loader) {
      loader.hide();
    }
  },

  _showUploadLoader: function() {
    var loader = this._contentPane.getPane("upload_loader");

    if (loader) {
      loader.show();
    }
  },

  _hideUploadLoader: function() {
    var loader = this._contentPane.getPane("upload_loader");
    if (loader) {
      loader.hide();
    }
  },

  _onAssetsFetched: function() {
    this._hideLoader();

    var items = this.collection.where({ kind: this.kind });

    if (items.length === 0) {
      if (this.kind === 'marker') {
        this.model.set("pane", "simple_icons");
      } else {
        this.model.set("pane", "patterns");
      }
    } else {
      this.model.set("pane", "your_icons");
    }

  },

  // implements cdb.ui.common.Dialog.prototype.render
  render_content: function() {
    return this._template({ kind: this.kind });
  },

  _initViews: function() {
    this._renderContentPane();
    this._renderNavigation();
    this._renderTabPane();

    this._renderLoader();
    this._renderUploadLoader();

    if (this.kind === "marker") {
      this._renderSimpleiconPane();
      this._renderPinIconsPane();
      this._renderMakisPane();
    } else if (this.kind === "pattern") {
      this._renderPatternPane();
    }

    this._renderUserIconsPane();
    this._renderFilePane();
    this._renderDropboxPane();
    this._renderBoxPane();

    this._renderFooter();
    this._contentPane.active('loader');
  },

  _renderFooter: function() {
    this._footerView = new FooterView({
      model: this.model
    });

    this._footerView.bind("finish", this._ok, this);
    this.$('.js-footer').append(this._footerView.render().el);

    this.addView(this._footerView);
  },

  _renderTabPane: function() {
    this.tabPane = new cdb.ui.common.TabPane({
      el: this.$(".AssetsContent")
    });

    this.addView(this.tabPane);
  },

  _renderContentPane: function() {
    this._contentPane = new cdb.ui.common.TabPane({
      el: this.$('.js-content-container')
    });

    this.addView(this._contentPane);
    this._contentPane.active(this.model.get('contentPane'));
  },

  _renderNavigation: function() {
    var navigationView = new ImagePickerNavigationView({
      el: this.$('.js-navigation'),
      kind: this.kind,
      collection: this.collection,
      user: this.options.user,
      model: this.model
    });

    navigationView.render();

    this.addView(navigationView);
  },

  _renderPane: function(name, pane) {
    pane.bind('fileChosen', this._onFileChosen, this);
    pane.render();
    this._addPane(name, pane);
  },

  _renderUploadLoader: function() {
    this._addTab('upload_loader',
      ViewFactory.createByTemplate('common/templates/loading', {
        title: 'Uploading asset…',
        quote: randomQuote()
      })
    );
  },

  _renderLoader: function() {
    this._addTab('loader',
      ViewFactory.createByTemplate('common/templates/loading', {
        title: 'Loading assets…',
        quote: randomQuote()
      })
    );
  },

  _renderPatternPane: function() {
    var pane = new AssetsView({
      model:      this.model,
      collection: this.collection,
      kind:       this.kind,
      icons:      patterns.icons,
      folder:     'patterns',
      size:       ''
    });

    this._renderPane('patterns', pane);
  },

  _renderSimpleiconPane: function() {
    var pane = new AssetsView({
      model:      this.model,
      collection: this.collection,
      kind:       this.kind,
      icons:      simpleicon.icons,
      disclaimer: simpleicon.disclaimer,
      folder:     'simpleicon',
      size:       ''
    });
    this._renderPane('simple_icons', pane);
  },

  _renderMakisPane: function() {
    var pane = new AssetsView({
      model:      this.model,
      collection: this.collection,
      kind:       this.kind,
      icons:      makiIcons.icons,
      disclaimer: makiIcons.disclaimer,
      folder:     'maki-icons',
      size:       '18'
    });

    this._renderPane('maki_icons', pane);
  },

  _renderUserIconsPane: function() {
    var pane = new UserIconsView({
      model:      this.model,
      collection: this.collection,
      kind:       this.kind,
      folder:     'your-icons'
    });

    this._renderPane('your_icons', pane);
  },

  _renderPinIconsPane: function() {
    var pane = new AssetsView({
      model:      this.model,
      collection: this.collection,
      kind:       this.kind,
      icons:      pinMaps.icons,
      disclaimer: pinMaps.disclaimer,
      folder:     'pin-maps',
      size:       ''
    });

    this._renderPane('pin_icons', pane);
  },

  _renderFilePane: function() {

    var pane = new UploadView({
      collection: this.collection,
      kind:       this.kind,
      user:       this.options.user
    });

    pane.bind('valueChange', this._onFileChosen, this);
    pane.bind('show_loader', this._showUploadLoader, this);
    pane.bind('hide_loader', this._hideUploadLoader, this);
    this._renderPane('upload_file', pane);
  },

  _renderDropboxPane: function() {
    if (this.model.get("dropbox_enabled")) {

      var pane = new DropboxView({
        model:      this.model,
        collection: this.collection,
        kind:       this.kind,
        user:       this.options.user
      });

      pane.bind('valueChange', this._onFileChosen, this);
      pane.bind('show_loader', this._showUploadLoader, this);
      pane.bind('hide_loader', this._hideUploadLoader, this);
      this._renderPane('dropbox', pane);
    }
  },

  _renderBoxPane: function() {
    if (this.model.get("box_enabled")) {

      var pane = new BoxView({
        model:      this.model,
        collection: this.collection,
        kind:       this.kind,
        user:       this.options.user
      });

      pane.bind('valueChange', this._onFileChosen, this);
      pane.bind('show_loader', this._showUploadLoader, this);
      pane.bind('hide_loader', this._hideUploadLoader, this);
      this._renderPane('box', pane);
    }
  },

  _addPane: function(name, view) {
    this.tabPane.addTab(name, view, {
      active: this.model.get('pane') === name
    });
  },

  _addTab: function(name, view) {
    this._contentPane.addTab(name, view.render());
    this.addView(view);
  },

  _validate: function() {
    if (!this.options.user) {
      throw new TypeError('user is required');
    }

    if (!this.options.kind) {
      throw new Error('kind should be passed');
    }
  },

  _initBinds: function() {
    // Bug with binding... do not work with the usual one for some reason :(
    this.model.bind('change:pane', this._onChangePane.bind(this));
  },

  _onChangePane: function() {
    if (this.tabPane) {
      this.tabPane.active(this.model.get('pane'));

      this.model.set("submit_enabled", false);
      var activePane = this.tabPane.getActivePane();

      if (activePane) {
        this.model.set("disclaimer", activePane.options.disclaimer);
      }
    }
  },

  _ok: function() {
    this.trigger("fileChosen", this.model.get("value"));
    this.close();
  },

  _onFileChosen: function() {
    this.model.set("submit_enabled", true);
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../view_factory":209,"../../view_helpers/random_quote":212,"../../views/base_dialog/view":213,"./image_picker/assets_view":142,"./image_picker/box_view":143,"./image_picker/data/maki_icons":144,"./image_picker/data/patterns":145,"./image_picker/data/pin_maps":146,"./image_picker/data/simpleicon":147,"./image_picker/dropbox_view":148,"./image_picker/file_upload_view":149,"./image_picker/footer_view":150,"./image_picker/navigation_view":151,"./image_picker/user_icons_view":154}],156:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var BaseDialog = require('../../views/base_dialog/view');

/**
 * Scratch modal
 */
module.exports = BaseDialog.extend({

  events: cdb.core.View.extendEvents({
    "click .js-option" : "_onOptionClick",
    "click .js-skip"   : "_onSkipClick"
  }),

  options: {
    skipDisabled: false
  },

  initialize: function() {
    this.elder('initialize');

    if (!this.options.table) {
      throw new TypeError('table is required');
    }

    this.table = this.options.table;
    this._template = cdb.templates.getTemplate('common/dialogs/map/scratch_view_template');

  },

  // implements cdb.ui.common.Dialog.prototype.render
  render: function() {
    this.clearSubViews();
    BaseDialog.prototype.render.call(this);
    return this;
  },

  // implements cdb.ui.common.Dialog.prototype.render
  render_content: function() {
    return this._template({
      name: this.table.get("name"),
      skipDisabled: this.options.skipDisabled 
    });
  },

  _onSkipClick: function(e) {
    this.killEvent(e);
    this.close();
    this.trigger("skip", this);
  },

  _onOptionClick: function(e) {
    this.killEvent(e);
    this.close();
    this.trigger("newGeometry", $(e.target).closest('.js-option').data("type"));
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../views/base_dialog/view":213}],157:[function(require,module,exports){
(function (global){
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var Backbone = (typeof window !== "undefined" ? window['Backbone'] : typeof global !== "undefined" ? global['Backbone'] : null);
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var ChooseKeyColumnsView = require('./choose_key_columns_view');
var SelectColumns = require('./select_columns_model');

module.exports = cdb.core.Model.extend({

  INSTRUCTIONS_SAFE_HTML: 'Select the dataset on the right that you want to merge the left with. ' +
    'You can only merge datasets by joining by columns of the same type (e.g. number to a number).',

  defaults: {
    user: undefined,
    isReadyForNextStep: false,
    excludeColumns: [],
    leftTable: undefined,
    leftColumns: undefined,
    rightTableData: undefined,
    rightColumns: undefined
  },

  initialize: function() {
    this._initColumns();
  },

  createView: function() {
    // Reset state
    this.set('gotoNextStep', false);
    var leftColumns = this.get('leftColumns');
    leftColumns.each(function(m) {
      m.unset('selected');
    });
    this.get('rightColumns').reset(); // columns are fetched by view
    this._resetSorting(leftColumns);
    this._resetSorting(this.get('rightColumns'));

    return new ChooseKeyColumnsView({
      model: this
    });
  },

  changeRightTable: function(tableData) {
    this.get('rightColumns').reset();
    this.set('rightTableData', tableData);

    // TODO: extracted from old code, cdb.admin.TableColumnSelector._getColumns,
    //   isnt there some better way to get the schema/columns?
    $.ajax({
      url: cdb.config.prefixUrl() + '/api/v1/tables/' + tableData.id,
      dataType: 'jsonp',
      success: this._onFetchedColumns.bind(this)
    });
  },

  _onFetchedColumns: function(results) {
    var filteredColumns = this._filterColumns(results.schema);
    this.get('rightColumns').reset(filteredColumns);
    var selectedLeftColumn = this.selectedItemFor('leftColumns');
    if (selectedLeftColumn) {
      this.disableRightColumnsNotMatchingType(selectedLeftColumn.get('type'));
    }
  },

  disableRightColumnsNotMatchingType: function(leftKeyColumnType) {
    this.get('rightColumns').each(function(column) {
      var shouldDisable = column.get('type') !== leftKeyColumnType;
      if (shouldDisable && column.get('selected')) {
        // Don't leave the column selected if should be disabled
        column.set('selected', false);
      }
      column.set('disabled', shouldDisable);
    });
  },

  assertIfReadyForNextStep: function() {
    var isReady = !!(this.selectedItemFor('leftColumns') &&
                  this.selectedItemFor('rightColumns') &&
                  this.get('rightTableData'));
    this.set('isReadyForNextStep', isReady);
  },

  nextStep: function() {
    return new this.constructor.nextStep({
      user: this.get('user'),
      leftTable: this.get('leftTable'),
      leftColumns: this.get('leftColumns'),
      leftKeyColumn: this.selectedItemFor('leftColumns').clone(),
      rightKeyColumn: this.selectedItemFor('rightColumns').clone(),
      rightColumns: this.get('rightColumns'),
      rightTableData: this.get('rightTableData')
    });
  },

  selectedItemFor: function(collectionName) {
    return this.get(collectionName).find(function(column) {
      return column.get('selected');
    });
  },

  _initColumns: function() {
    var filteredLeftColumns = this._filterColumns(this.get('leftTable').get('schema'));
    this.set('leftColumns', new Backbone.Collection(filteredLeftColumns));
    this.set('rightColumns', new Backbone.Collection([]));
  },

  _filterColumns: function(tableSchema) {
    var excludeColumns = this.get('excludeColumns');

    return _.chain(tableSchema)
      .map(function(columnData) {
        return {
          // TODO: why don't we use a proper model for schema, to provide convenient method to get columns as a collection already?
          name: columnData[0],
          type: columnData[1]
        };
      })
      .reject(function(column) {
        return _.contains(excludeColumns, column.name);
      })
      .value();
  },

  _resetSorting: function(columns) {
    // May been set on next step, so reset sorters if going back:
    columns.comparator = function(column) {
      return column.get('name');
    };
    columns.sort();
  }

}, {
  header: {
    icon: 'CDB-IconFont-play',
    title: 'Choose merge column'
  },
  nextStep: SelectColumns
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./choose_key_columns_view":158,"./select_columns_model":162}],158:[function(require,module,exports){
(function (global){
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var ColumnsSelectorView = require('../columns_selector_view');
var TablesSelectorView = require('../tables_selector_view');
var FooterView = require('../footer_view');
var FooterInfoView = require('./footer_info_view');

/**
 * View to choose the key columns (and implicitly the right table).
 */
module.exports = cdb.core.View.extend({

  initialize: function() {
    this._initViews();
    this._initBinds();
  },

  render: function() {
    var $el = $(
      this.getTemplate('common/dialogs/merge_datasets/column_merge/choose_key_columns')({
        leftTableName: this.model.get('leftTable').get('name')
      })
    );
    $el.find('.js-left-table').append(this._leftTableComboView.render().$el);
    $el.find('.js-left-columns').append(this._leftColumnsView.render().$el);
    $el.find('.js-right-tables').append(this._rightTableSelectorView.render().$el);
    $el.find('.js-right-columns').append(this._rightColumnsView.render().$el);
    $el.append(this._footerView.render().$el);
    this.$el.html($el);

    return this;
  },

  _initViews: function() {
    var leftTableName = this.model.get('leftTable').get('name');

    this._leftTableComboView = new cdb.forms.Combo({
      className: 'Select',
      width: '100%',
      disabled: true,
      extra: [leftTableName]
    });
    this.addView(this._leftTableComboView);

    this._leftColumnsView = new ColumnsSelectorView({
      collection: this.model.get('leftColumns'),
      excludeFilter: this._columnsExcludeFilter,
      selectorType: 'radio'
    });
    this.addView(this._leftColumnsView);

    this._rightTableSelectorView = new TablesSelectorView({
      excludeFilter: function(vis) {
        return vis.get('name') === leftTableName;
      }
    });
    this.addView(this._rightTableSelectorView);

    this._rightColumnsView = new ColumnsSelectorView({
      collection: this.model.get('rightColumns'),
      excludeFilter: this._columnsExcludeFilter,
      selectorType: 'radio',
      loading: 'datasets'
    });
    this.addView(this._rightColumnsView);

    this._footerView = new FooterView({
      model: this.model,
      infoView: new FooterInfoView({
        model: this.model
      })
    });
    this.addView(this._footerView);
  },

  _columnsExcludeFilter: function(column) {
    return column.get('name') === 'the_geom';
  },

  _initBinds: function() {
    var leftColumns = this.model.get('leftColumns');
    leftColumns.bind('change:selected', this._onChangeSelectedLeftColumn, this);
    this.add_related_model(leftColumns);

    var rightColumns = this.model.get('rightColumns');
    rightColumns.bind('change:selected', this._onChangeSelectedRightColumn, this);
    rightColumns.bind('reset', this._assertIfReadyForNextStep, this);
    this.add_related_model(rightColumns);

    var rightTablesModel = this._rightTableSelectorView.model;
    rightTablesModel.bind('change:tableData', this._onChangeRightTableData, this);
    this.add_related_model(rightTablesModel);
  },

  _onChangeSelectedLeftColumn: function(m, isSelected) {
    if (isSelected) {
      this.model.disableRightColumnsNotMatchingType(m.get('type'));
    }
    this._assertIfReadyForNextStep();
  },

  _onChangeSelectedRightColumn: function() {
    this._assertIfReadyForNextStep();
  },

  _assertIfReadyForNextStep: function() {
    this.model.assertIfReadyForNextStep();
  },

  _onChangeRightTableData: function(model, tableData) {
    this._rightColumnsView.model.set('loading', 'columns');
    this.model.changeRightTable(tableData);
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../columns_selector_view":165,"../footer_view":166,"../tables_selector_view":183,"./footer_info_view":160}],159:[function(require,module,exports){
(function (global){
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var ChooseKeyColumnsModel = require('./choose_key_columns_model');

/**
 * Entry point model that represents the merge flavor of doing a column merge.
 */
module.exports = cdb.core.Model.extend({

  ILLUSTRATION_ICON_TYPE: 'IllustrationIcon--alert',
  ICON: 'CDB-IconFont-mergeColumns',
  TITLE: 'Column join',
  DESC: 'Merge two datasets based on a shared value (ex. ISO codes in both datasets)',

  defaults: {
    user: undefined,
    table: undefined,
    excludeColumns: []
  },

  initialize: function(attrs) {
    if (!attrs.table) throw new Error('table is required');
    if (!attrs.excludeColumns || _.isEmpty(attrs.excludeColumns)) cdb.log.error('excludeColumns was empty');
  },

  isAvailable: function() {
    // Need at least one more column than the_geom to do a column merge
    return _.chain(this.get('table').get('schema'))
      .map(this._columnDataName)
      .difference(this.get('excludeColumns'))
      .any(this._isntTheGeomName)
      .value();
  },

  _columnDataName: function(columnData) {
    return columnData[0]; //name
  },

  _isntTheGeomName: function(columnName) {
    return columnName !== 'the_geom';
  },

  firstStep: function() {
    return new ChooseKeyColumnsModel({
      user: this.get('user'),
      leftTable: this.get('table'),
      excludeColumns: this.get('excludeColumns')
    });
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./choose_key_columns_model":157}],160:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);

/**
 * View to indicate the selected key columns relationship.
 * Shared for both step 1 and 2
 */
module.exports = cdb.core.View.extend({

  initialize: function() {
    this._initBinds();
  },

  render: function() {
    var leftKeyColumn = this.model.get('leftKeyColumn');
    var rightKeyColumn = this.model.get('rightKeyColumn');
    this.$el.html(
      this.getTemplate('common/dialogs/merge_datasets/column_merge/footer_info')({
        leftKeyColumnName: leftKeyColumn ? leftKeyColumn.get('name') : '',
        rightKeyColumnName: rightKeyColumn ? rightKeyColumn.get('name') : ''
      })
    );
    return this;
  },

  _initBinds: function() {
    if (this.model.selectedItemFor) {
      var leftColumns = this.model.get('leftColumns');
      leftColumns.bind('change:selected', this._onChangeLeftColumn, this);
      this.add_related_model(leftColumns);

      var rightColumns = this.model.get('rightColumns');
      rightColumns.bind('change:selected', this._onChangeRightColumn, this);
      this.add_related_model(rightColumns);
    }
  },

  _onChangeLeftColumn: function() {
    var m = this.model.selectedItemFor('leftColumns');
    this.$('.js-left-key-column').text(m ? m.get('name') : '');
  },

  _onChangeRightColumn: function() {
    var m = this.model.selectedItemFor('rightColumns');
    this.$('.js-right-key-column')
      .text(m ? m.get('name') : '')
      .toggleClass('is-placeholder', !m);
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],161:[function(require,module,exports){
(function (global){
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);

// Used for both left and right table
var selectColumn = function(tableName, otherTableName, columnName) {
  if (columnName === 'the_geom') {
    return [
      'CASE WHEN ' + tableName + '.' + columnName + ' IS NULL THEN',
      otherTableName + '.' + columnName,
      'ELSE',
      tableName + '.' + columnName,
      'END AS',
        columnName
    ];
  } else {
    return [ tableName + '.' + columnName ];
  }
};

// SQL query as taken from old code, cdb.admin.MergeTablesDialog
// Cleaned up to remove noise and avoid string concatenation to be more legible.
module.exports = function(d) {
  var leftTableName = d.leftTableName;
  var leftColumnsNames = d.leftColumnsNames;
  var leftKeyColumnName = d.leftKeyColumnName;
  var leftKeyColumnType = d.leftKeyColumnType;

  var rightTableName = d.rightTableName;
  var rightColumnsNames = d.rightColumnsNames;
  var rightKeyColumnName = d.rightKeyColumnName;
  var rightKeyColumnType = d.rightKeyColumnType;

  // Add left table columns
  var sql = ['SELECT'];
  var selects = _.map(leftColumnsNames, function(columnName) {
    return selectColumn(leftTableName, rightTableName, columnName).join(' ');
  });

  // Add right table columns
  selects.push.apply(selects,
    _.map(rightColumnsNames, function(columnName) {
      var colSQL = selectColumn(rightTableName, leftTableName, columnName);

      var isColumnPresentInLeftTable = _.any(leftColumnsNames, function(leftColumnName) {
        return columnName === leftColumnName;
      });
      if (isColumnPresentInLeftTable) {
        colSQL = colSQL.concat('AS ' + rightTableName + '_' + columnName);
      }

      return colSQL.join(' ');
    })
  );

  // Make sure all select fields are comma separated
  sql.push(_.flatten(selects).join(', '));

  // LEFT JOIN
  sql.push('FROM ' + leftTableName + ' FULL OUTER JOIN ' + rightTableName + ' ON');

  // JOIN FIELD
  if (leftKeyColumnType === 'string' && rightKeyColumnType === 'string') {
    sql.push(
      'LOWER(TRIM(' + leftTableName + '.' + leftKeyColumnName + '))',
      '=',
      'LOWER(TRIM(' + rightTableName + '.' + rightKeyColumnName + '))'
    );
  } else {
    sql.push(
      leftTableName + '.' + leftKeyColumnName,
      '=',
      rightTableName + '.' + rightKeyColumnName
    );
  }

  return sql.join(' ');
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],162:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var SelectColumnsView = require('./select_columns_view');
var generateColumnMergeSQL = require('./generate_column_merge_sql');
var MergeModel = require('../merge_step_model');

/**
 * View for 2nd step of a column merge, where the user should select the column fields to merge
 */
module.exports = cdb.core.Model.extend({

  INSTRUCTIONS_SAFE_HTML: 'Choose other columns you want in your dataset.',

  defaults: {
    user: undefined,
    isReadyForNextStep: true,
    leftTable: undefined,
    leftKeyColumn: undefined,
    leftColumns: undefined,
    rightTableData: undefined,
    rightColumns: undefined,
    rightKeyColumn: undefined
  },

  createView: function() {
    // Reset state
    this.set('gotoNextStep', false);
    this._resetColumns(this.get('leftColumns'), function(column) {
      column.set('selected', true);
    });
    this._resetColumns(this.get('rightColumns'), function(column) {
      if (column.get('name') !== 'the_geom') {
        column.set('selected', true);
      }
      column.set('disabled', false);
    });

    return new SelectColumnsView({
      model: this
    });
  },

  onlyAllowOneSelectedTheGeomColumn: function(column, isSelected) {
    if (column.get('name') !== 'the_geom') return;

    var leftColumn = this._theGeomColumnFor('leftColumns');
    var rightColumn = this._theGeomColumnFor('rightColumns');

    if (column === leftColumn) {
      leftColumn.set('selected', isSelected);
      rightColumn.set('selected', !isSelected);
    } else if (column === rightColumn) {
      leftColumn.set('selected', !isSelected);
      rightColumn.set('selected', isSelected);
    }
  },

  nextStep: function() {
    var leftKeyColumn = this.get('leftKeyColumn');
    var rightKeyColumn = this.get('rightKeyColumn');

    var sql = generateColumnMergeSQL({
      leftTableName: this.get('leftTable').get('name'),
      leftKeyColumnName: leftKeyColumn.get('name'),
      leftKeyColumnType: leftKeyColumn.get('type'),
      leftColumnsNames: this._selectedColumnsNamesFor('leftColumns'),
      rightTableName: this.get('rightTableData').name,
      rightKeyColumnName: rightKeyColumn.get('name'),
      rightKeyColumnType: rightKeyColumn.get('type'),
      rightColumnsNames: this._selectedColumnsNamesFor('rightColumns')
    });

    return new this.constructor.nextStep({
      user: this.get('user'),
      tableName: this.get('leftTable').get('name'),
      sql: sql
    });
  },

  _selectedColumnsNamesFor: function(collectionName) {
    return this.get(collectionName)
      .chain()
      .filter(function(column) {
        return column.get('selected');
      }).
      map(function(column) {
        return column.get('name');
      })
      .value();
  },

  _theGeomColumnFor: function(which) {
    return this.get(which).find(function(column) {
      return column.get('name') === 'the_geom';
    });
  },

  _resetColumns: function(columns, eachReset) {
    columns.comparator = function(column) {
      var columnName = column.get('name');
      return columnName === 'the_geom' ? '00000' : columnName;
    };
    columns.each(eachReset, this);
    columns.sort();
  }

}, {
  header: {
    icon: 'CDB-IconFont-wizard',
    title: 'Choose the rest to add'
  },
  nextStep: MergeModel
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../merge_step_model":170,"./generate_column_merge_sql":161,"./select_columns_view":163}],163:[function(require,module,exports){
(function (global){
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var ColumnsSelectorView = require('../columns_selector_view');
var StickyHeaderView = require('../sticky_header_view');
var FooterView = require('../footer_view');
var FooterInfoView = require('./footer_info_view');

/**
 * View to select the columns to merge.
 */
module.exports = cdb.core.View.extend({

  initialize: function() {
    this._initViews();
    this._initBinds();
  },

  render: function() {
    var $el = $(
      this.getTemplate('common/dialogs/merge_datasets/column_merge/select_columns')({
        leftKeyColumn: this.model.get('leftKeyColumn'),
        rightKeyColumn: this.model.get('rightKeyColumn')
      })
    );
    $el.find('.js-sticky-header').append(this._stickyHeaderView.render().$el);
    $el.find('.js-left-table').append(this._leftTableComboView.render().$el);
    $el.find('.js-left-columns').append(this._leftColumnsView.render().$el);
    $el.find('.js-right-table').append(this._rightTableComboView.render().$el);
    $el.find('.js-right-columns').append(this._rightColumnsView.render().$el);
    $el.append(this._footerView.render().$el);
    this.$el.html($el);

    return this;
  },

  onChangeKeyColumnsVisiblity: function() {
    this._stickyHeaderView.$el.slideToggle(200);
  },

  _initViews: function() {
    this._stickyHeaderView = new StickyHeaderView({
      leftKeyColumn: this.model.get('leftKeyColumn'),
      rightKeyColumn: this.model.get('rightKeyColumn')
    });
    this.addView(this._stickyHeaderView);

    this._leftTableComboView = new cdb.forms.Combo({
      className: 'Select',
      width: '100%',
      disabled: true,
      extra: [this.model.get('leftTable').get('name')]
    });
    this.addView(this._leftTableComboView);

    this._leftColumnsView = new ColumnsSelectorView({
      collection: this.model.get('leftColumns'),
      selectorType: 'switch'
    });
    this.addView(this._leftColumnsView);

    this._rightTableComboView = new cdb.forms.Combo({
      className: 'Select',
      width: '100%',
      disabled: true,
      extra: [this.model.get('rightTableData').name]
    });
    this.addView(this._rightTableComboView);

    this._rightColumnsView = new ColumnsSelectorView({
      collection: this.model.get('rightColumns'),
      selectorType: 'switch'
    });
    this.addView(this._rightColumnsView);

    this._footerView = new FooterView({
      model: this.model,
      nextLabel: 'Merge datasets',
      infoView: new FooterInfoView({
        model: this.model
      })
    });
    this.addView(this._footerView);
  },

  _initBinds: function() {
    this.model.get('leftColumns').bind('change:selected', this._onChangeSelectedColumn, this);
    this.add_related_model(this.model.get('leftColumns'));

    this.model.get('rightColumns').bind('change:selected', this._onChangeSelectedColumn, this);
    this.add_related_model(this.model.get('rightColumns'));
  },

  _onChangeSelectedColumn: function(column, isSelected) {
    this.model.onlyAllowOneSelectedTheGeomColumn(column, isSelected);
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../columns_selector_view":165,"../footer_view":166,"../sticky_header_view":182,"./footer_info_view":160}],164:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);

/**
 * View to select one or multiple columns.
 *  - For only allowing selecting one set selectorType to 'radio'
 *  - For allowing multiple selections set selectorType to 'switch'
 */
module.exports = cdb.core.View.extend({

  className: 'List-row',

  events: {
    'click': '_onClick',
    'mouseenter': '_onMouseEnter',
    'mouseleave': '_onMouseLeave'
  },

  initialize: function() {
    if (!this.options.selectorType) throw new Error('selectorType is required');

    this.model = new cdb.core.Model({
      type: this.options.selectorType
    });

    this.column = this.options.column;

    this._initBinds();
  },

  render: function() {
    this.$el.html(
      this.getTemplate('common/dialogs/merge_datasets/column_selector')({
        selectorType: this.model.get('type'),
        columnName: this.column.get('name'),
        columnType: this.column.get('type')
      })
    );

    if (!this._tooltip) {
      this._tooltip = new cdb.common.TipsyTooltip({
        el: this.el,
        offset: -20,
        trigger: 'manual',
        fallback: 'Your column type is not compatible with the column you have selected in the left column'
      });
      this.addView(this._tooltip);
    }

    this._onChangeSelected(this.column, this.column.get('selected'));
    this._onChangeDisabled(this.column, this.column.get('disabled'));

    return this;
  },

  _initBinds: function() {
    this.column.bind('change:selected', this._onChangeSelected, this);
    this.column.bind('change:disabled', this._onChangeDisabled, this);
    this.add_related_model(this.column);
  },

  _onChangeSelected: function(column, isSelected) {
    if (this.model.get('type') === 'radio') {
      this.$el.toggleClass('is-selected', !!isSelected);
    }
    this.$('.js-radio').toggleClass('is-checked', !!isSelected);
    this.$('.js-switch').prop('checked', !!isSelected);
  },

  _onChangeDisabled: function(column, isDisabled) {
    isDisabled = !!isDisabled;
    this.$el.toggleClass('is-disabled', isDisabled);
  },

  _onClick: function(ev) {
    this.killEvent(ev);
    if (!this._isDisabled()) {
      var inverseSelectedVal = !this.column.get('selected');

      // radio buttons can only be selected, unselection of other items should be handled by collection/parent
      if (inverseSelectedVal || this.model.get('type') !== 'radio') {
        this.column.set('selected', inverseSelectedVal);
      }
    }
  },

  _onMouseEnter: function() {
    if (this._isDisabled()) {
      this._tooltip.showTipsy();
    }
  },

  _onMouseLeave: function() {
    this._tooltip.hideTipsy();
  },

  _isDisabled: function() {
    return this.column.get('disabled');
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],165:[function(require,module,exports){
(function (global){
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var ColumnSelectorView = require('./column_selector_view');
var randomQuote = require('../../view_helpers/random_quote');

/**
 * View to select an individual column.
 * The selector type is passed to the child view of class ColumnSelectorView.
 */
module.exports = cdb.core.View.extend({

  className: 'List',

  events: {
    'click .js-select-all': '_onClickSelectAll',
    'click': 'killEvent'
  },

  initialize: function() {
    this.model = new cdb.core.Model({
      showSelectAllToggle: this.options.selectorType === 'switch' || false,
      enforceSingleSelected: this.options.selectorType === 'radio' || false,
      loading: this.options.loading
    });
    this._initBinds();
  },

  render: function() {
    this.clearSubViews();
    this.$el.html('');

    if (this.collection.length > 0) {
      var chain = this.collection.chain();
      if (this.options.excludeFilter) {
        chain = chain.reject(this.options.excludeFilter);
      }
      chain.each(this._addColumnSelectorView, this);

      this._renderSelectAllToggle();
    } else if (this.model.get('loading')) {
      this._renderLoading();
    }

    return this;
  },

  _renderLoading: function() {
    this.$el.html(
      this.getTemplate('common/templates/loading')({
        title: 'Fetching ' + this.model.get('loading'),
        quote: randomQuote()
      })
    );
  },

  _addColumnSelectorView: function(model) {
    var view = new ColumnSelectorView(
      _.chain({
        column: model
      })
      .extend(this.options)
      .omit(['el', 'collection'])
      .value()
    );
    this.addView(view);
    this.$el.append(view.render().$el);
  },

  _renderSelectAllToggle: function() {
    if (this.model.get('showSelectAllToggle')) {
      this.$el.append(
        this.getTemplate('common/dialogs/merge_datasets/columns_selector_toggle_all')({
          areAllSelected: this._areAllSelected()
        })
      );
    }
  },

  _initBinds: function() {
    this.collection.bind('reset', this.render, this);
    this.collection.bind('change:selected', this._onChangeSelected, this);
    this.add_related_model(this.collection);

    this.model.bind('change:loading', this.render, this);
  },

  _onChangeSelected: function(model, isSelected) {
    if (isSelected && this.model.get('enforceSingleSelected')) {
      this._unselectAllExcept(model);
      this.collection.sort();
      this.render(); // to re-render with new sort order
    }
    this.$('.js-select-all input').prop('checked', this._areAllSelected());
  },

  _unselectAllExcept: function(exceptionModel) {
    this.collection.each(function(m) {
      if (m !== exceptionModel) {
        m.set('selected', false);
      }
    });
  },

  _onClickSelectAll: function() {
    var invertedAllSelected = !this._areAllSelected();
    this.collection.chain()
    .reject(function(m) {
      return m.get('disabled');
    })
    .each(function(m) {
      m.set('selected', invertedAllSelected);
    });
  },

  _areAllSelected: function() {
    return this.collection.all(function(m) {
      return m.get('selected');
    });
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../view_helpers/random_quote":212,"./column_selector_view":164}],166:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);

/**
 * View that represents the footer.
 * May contain an additional info view with more state details depending on context.
 */
module.exports = cdb.core.View.extend({

  events: {
    'click .js-next': '_onClickNext'
  },

  initialize: function() {
    if (this.options.infoView) {
      this.addView(this.options.infoView);
    }
    this._initBinds();
  },

  render: function() {
    this.$el.html(
      this.getTemplate('common/dialogs/merge_datasets/footer')({
        nextLabel: this.options.nextLabel || 'next step'
      })
    );
    this._onChangeIsReadyForNextStep(this.model, this.model.get('isReadyForNextStep'));
    this._maybeRenderInfoView();
    return this;
  },

  _maybeRenderInfoView: function() {
    if (this.options.infoView) {
      this.$('.js-info').append(this.options.infoView.render().$el);
    }
  },

  _initBinds: function() {
    this.model.bind('change:isReadyForNextStep', this._onChangeIsReadyForNextStep, this);
  },

  _onChangeIsReadyForNextStep: function(model, isReady) {
    this.$('.js-next').toggleClass('is-disabled', !isReady);
  },

  _onClickNext: function() {
    if (this.model.get('isReadyForNextStep')) {
      this.model.set('gotoNextStep', true);
    }
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],167:[function(require,module,exports){
(function (global){
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var Backbone = (typeof window !== "undefined" ? window['Backbone'] : typeof global !== "undefined" ? global['Backbone'] : null);
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var ColumnMergeModel = require('./column_merge/column_merge_model');
var SpatialMergeModel = require('./spatial_merge/spatial_merge_model');

/**
 * View model for merge datasets view.
 */
module.exports = cdb.core.Model.extend({

  excludeColumns: [
    'cartodb_id',
    'created_at',
    'updated_at',
    'the_geom_webmercator',
    'cartodb_georef_status'
  ],

  defaults: {
    mergeFlavors: undefined, // Collection, created with model
    prevSteps: [],
    currentStep: undefined,
    table: undefined,
    user: undefined
  },

  initialize: function(attrs) {
    if (!attrs.table) throw new Error('table is required');
    if (!attrs.user) throw new Error('user is required');

    var data = {
      user: this.get('user'),
      table: this.get('table'),
      excludeColumns: this.excludeColumns
    };
    this.set('mergeFlavors', new Backbone.Collection([
      new ColumnMergeModel(data),
      new SpatialMergeModel(data)
    ]));
  },

  headerSteps: function() {
    var steps = [];

    var currentStep = this.get('currentStep');
    var firstStep = this.get('prevSteps')[0] || currentStep;
    var isFinished = true;
    if (firstStep) {
      var Model = firstStep.constructor;
      while (Model) {
        if (Model.header) {
          var isCurrent = Model === currentStep.constructor;
          if (isCurrent) {
            isFinished = false;
          }
          steps.push(
            _.extend({
              isFinished: isFinished,
              isCurrent: isCurrent
            }, Model.header)
          );
        }

        Model = Model === Model.nextStep ? undefined : Model.nextStep;
      }
    }

    return steps;
  },

  gotoNextStep: function() {
    var currentStep = this.get('currentStep');
    var nextStep = currentStep.nextStep();
    this.set({
      prevSteps: this.get('prevSteps').concat(currentStep),
      currentStep: nextStep
    });
  },

  gotoPrevStep: function() {
    this.set('currentStep', this.get('prevSteps').pop());
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./column_merge/column_merge_model":159,"./spatial_merge/spatial_merge_model":180}],168:[function(require,module,exports){
(function (global){
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);
var BaseDialog = require('../../views/base_dialog/view.js');
var MergeDatasetsModel = require('./merge_datasets_model.js');
var MergeFlavorView = require('./merge_flavor_view');

/**
* Shows a dialog to start merging two tables
*  new MergeDatasetsDialog({
*    model: table
*  })
* Migrated from old code.
*/
module.exports = BaseDialog.extend({

  events: BaseDialog.extendEvents({
    'click .js-back': '_onBackClick'
  }),

  initialize: function() {
    this.options.clean_on_hide = true;
    this.options.enter_to_confirm = false;
    this.elder('initialize');

    this.model = new MergeDatasetsModel({
      table: this.options.table,
      user: this.options.user
    });

    this._initBinds();
  },

  /**
   * @override BaseDialog.prototype.render
   */
  render: function() {
    BaseDialog.prototype.render.apply(this, arguments);
    this.$('.content').addClass('Dialog-contentWrapper');

    // Let the current step view know when the scroll has crossed the expected threshold for the key columns to be visible
    this.$('.js-scroll').off('scroll');
    if (this._stepView && this._stepView.onChangeKeyColumnsVisiblity) {
      this._areKeyColumnsVisible = true;
      var self = this;
      this.$('.js-scroll').on('scroll', function(ev) {
        var areKeyColumnsVisible = ev.target.scrollTop <= 175;
        if (areKeyColumnsVisible !== self._areKeyColumnsVisible) {
          self._areKeyColumnsVisible = areKeyColumnsVisible;
          self._stepView.onChangeKeyColumnsVisiblity(areKeyColumnsVisible);
        }
      });
    }

    return this;
  },

  render_content: function() {
    this.clearSubViews();
    var $el;
    var defaultTemplate = this.getTemplate('common/dialogs/merge_datasets/merge_datasets_content');

    var currentStep = this.model.get('currentStep');
    if (currentStep) {
      var $step = this._$renderedStep(currentStep);
      if (currentStep.get('skipDefaultTemplate')) {
        // Render the view as content w/o wrapping it in the default template
        return $step;
      }

      $el = $(defaultTemplate({
        currentStep: currentStep,
        headerSteps: this.model.headerSteps()
      }));
      $el.find('.js-details').append($step);
    } else {
      $el = $(defaultTemplate({
        currentStep: undefined
      }));
      var $mergeFlavorsList = $el.find('.js-flavors');
      $mergeFlavorsList.append.apply($mergeFlavorsList, this._$renderedMergeFlavors());
    }

    return $el;
  },

  _$renderedMergeFlavors: function() {
    return this.model.get('mergeFlavors')
      .map(function(model) {
        var view = new MergeFlavorView({
          model: model
        });
        this.addView(view);
        return view.render().$el;
      }, this);
  },

  _onChangeSelectedMergeFlavor: function(model, wasSelected) {
    // Only change to next step if there's one selected
    if (wasSelected) {
      // reset selected state, so if/when user goes back to start view can select again
      model.unset('selected');

      // Set new current step
      var firstStep = model.firstStep();
      this.model.set('currentStep', firstStep);

      // Event tracking "Use visual merge"
      cdb.god.trigger('metrics', 'visual_merge', {
        email: window.user_data.email
      });
    }
  },

  _initBinds: function() {
    var mergeFlavors = this.model.get('mergeFlavors');
    mergeFlavors.bind('change:selected', this._onChangeSelectedMergeFlavor, this);
    this.add_related_model(mergeFlavors);

    this.model.bind('change:currentStep', this.render, this);
  },

  _onChangeGotoNextStep: function(model, isTrue) {
    if (isTrue) {
      this.model.gotoNextStep();
    }
  },

  _$renderedStep: function(step) {
    // Clean up prev step, if there is any
    if (this._stepView) {
      this._stepView.clean();
      this.removeView(this._stepView);

      this._stepModel.unbind('change:gotoNextStep');
      this._models = _.without(this._models, this._stepModel); // TODO: why no this.remove_related_model?
    }

    this._stepModel = step;
    this._stepModel.bind('change:gotoNextStep', this._onChangeGotoNextStep, this);
    this.add_related_model(this._stepModel);

    this._stepView = step.createView();
    this._stepView.bind('clickedNext', this._onClickNext, this);
    this.addView(this._stepView);
    return this._stepView.render().$el;
  },

  _onClickNext: function(e) {
    this.killEvent(e);
    this.model.gotoNextStep();
  },

  _onBackClick: function(e) {
    this.killEvent(e);
    this.model.gotoPrevStep();
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../views/base_dialog/view.js":213,"./merge_datasets_model.js":167,"./merge_flavor_view":169}],169:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);

module.exports = cdb.core.View.extend({

  className: 'OptionCard OptionCard--blocky',

  events: {
    'click': '_onClick'
  },

  render: function() {
    this.$el.html(
      this.getTemplate('common/dialogs/merge_datasets/merge_flavor')({
        illustrationIconType: this.model.ILLUSTRATION_ICON_TYPE,
        icon: this.model.ICON,
        title: this.model.TITLE,
        desc: this.model.DESC
      })
    );

    if (!this.model.isAvailable()) {
      this.$el.addClass('is-disabled');
    }

    return this;
  },

  _onClick: function(ev) {
    this.killEvent(ev);
    if (this.model.isAvailable()) {
      this.model.set('selected', true);
    }
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],170:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var MergeStepView = require('./merge_step_view');

/**
 * Last step in the merge flows, managed the actual merge flow
 */
module.exports = cdb.core.Model.extend({

  defaults: {
    skipDefaultTemplate: true,
    user: undefined,
    tableName: '',
    sql: undefined
  },

  createView: function() {
    return new MergeStepView({
      model: this
    });
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./merge_step_view":171}],171:[function(require,module,exports){
(function (global){
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var randomQuote = require('../../view_helpers/random_quote.js');
var ErrorDetailsView = require('../../views/error_details_view');

/**
 * View for the last step of all merge kinds, creates the actual merged table.
 * TODO: taken from old code, cdb.admin.MergeTableDialog.merge, could this be done in a better way?
 */
module.exports = cdb.core.View.extend({

  initialize: function() {
    _.bindAll(this, '_onMergeSuccess', '_onMergeError');
    this._startMerge();
  },

  render: function() {
    this.$el.html(
      this.getTemplate('common/templates/loading')({
        title: 'Merging datasets and generating the new one…',
        quote: randomQuote()
      })
    );
    return this;
  },

  _startMerge: function() {
    // TODO: taken from old code, cdb.admin.MergeTableDialog.merge
    //   could this be done in a better way?
    $.ajax({
      type: 'POST',
      url: cdb.config.prefixUrl() + '/api/v1/imports',
      data: {
        table_name: this.model.get('tableName') + '_merge',
        sql: this.model.get('sql')
      },
      success: this._onMergeSuccess,
      error: this._onMergeError
    });
  },

  _onMergeSuccess: function(r) {
    var imp = this.importation = new cdb.admin.Import({
      item_queue_id: r.item_queue_id
    });
    this.add_related_model(imp);

    // Bind complete event
    imp.bind('importComplete', function() {
      imp.unbind();
      window.location.href = cdb.config.prefixUrl() + "/tables/" + (imp.get("table_name") || imp.get("table_id")) + "/";
    }, this);

    var self = this;
    imp.bind('importError', function(e) {
      self._showError(
        e.attributes.error_code,
        e.attributes.get_error_text.title,
        e.attributes.get_error_text.what_about,
        e.attributes.item_queue_id
      );
    }, this);
    imp.pollCheck();
  },

  _onMergeError: function(e) {
    try {
      this._showError(
        e.attributes.error_code,
        e.attributes.get_error_text.title,
        e.attributes.get_error_text.what_about,
        e.attributes.item_queue_id
      );
    } catch(err) {
      this._showError('99999', 'Unknown', '');
    }
  },

  //Show the error when duplication fails
  _showError: function(number, title, what_about, item_queue_id) {
    var view = new ErrorDetailsView({
      err: {
        error_code: number,
        title: title,
        what_about: what_about,
        item_queue_id: item_queue_id
      },
      user: this.model.get('user')
    });
    this.addView(view);
    this.$el.html(view.render().el);
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../view_helpers/random_quote.js":212,"../../views/error_details_view":215}],172:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var SpatialMergeView = require('./spatial_merge_view');
var MergeModel = require('../merge_step_model');
var generateSpatialMergeSQL = require('./generate_spatial_merge_sql');

/**
 * Step 2 for a spatial merge, select merge method and right column.
 */
module.exports = cdb.core.Model.extend({

  INSTRUCTIONS_SAFE_HTML: 'Calculate the intersecting geospatial records between two datasets (ex. points in polygons).<br/>' +
    "You'll need to decide the operation to perform here.",

  defaults: {
    isReadyForNextStep: false,
    user: undefined,
    mergeMethods: undefined,
    leftTable: undefined,
    leftKeyColumn: undefined,
    leftColumns: undefined,
    rightTableData: undefined,
    rightKeyColumn: undefined,
    rightColumns: undefined
  },

  createView: function() {
    // Reset state
    this.set('gotoNextStep', false);
    this.get('mergeMethods').each(function(m) {
      m.set('disabled', !this.isCountMergeMethod(m));
    }, this);
    this.get('rightColumns').comparator = function(column) {
      return column.get('name'); // sort alphabetically
    };

    return new SpatialMergeView({
      model: this
    });
  },

  selectedMergeMethod: function() {
    return this.get('mergeMethods').find(this._isSelectedColumn);
  },

  selectedRightMergeColumn: function() {
    return this.get('rightColumns').find(this._isSelectedColumn);
  },

  changedRightMergeColumn: function(newColumn) {
    this._updateMergeMethods(newColumn);
    this._assertIfReadyForNextStep();
  },

  changedSelectedMergeMethod: function(newMergeMethod) {
    var c = this.get('mergeMethods').chain().without(newMergeMethod);
    c.each(this._deselect); //all but the new selected merge method

    if (this.isCountMergeMethod(newMergeMethod)) {
      c.each(this._enable); //enable all, so the user can "go back" to see available columns for AVG/SUM merge methods
      this.get('rightColumns').each(this._deselect); // reset prev selection if any
    } else {
      // If not a count mege method update state based on current selection of merge column.
      this._updateMergeMethods(this.selectedRightMergeColumn());
    }

    this._assertIfReadyForNextStep();
  },

  _updateMergeMethods: function(newColumn) {
    // Each merge method should know how it should render based on selected merge column
    this.get('mergeMethods').each(function(m) {
      m.changedMergeColumn(newColumn);
    });
  },

  isCountMergeMethod: function(m) {
    return m && m.NAME === 'count';
  },

  nextStep: function() {
    return new this.constructor.nextStep({
      user: this.get('user'),
      tableName: this.get('leftTable').get('name'),
      sql: this._sqlForMergeMethod()
    });
  },

  _deselect: function(m) {
    m.set('selected', false);
  },

  _disable: function(m) {
    m.set('disabled', true);
  },

  _enable: function(m) {
    m.set('disabled', false);
  },

  _assertIfReadyForNextStep: function() {
    var mergeMethod = this.selectedMergeMethod();
    var isReady = mergeMethod && (
        this.isCountMergeMethod(mergeMethod) ||
        (!mergeMethod.get('disabled') && this.selectedRightMergeColumn())
      );
    this.set('isReadyForNextStep', isReady);
  },

  _sqlForMergeMethod: function() {
    var rightTableName = this.get('rightTableData').name;
    var mergeMethod = this.selectedMergeMethod();
    var selectedMergeColumn = this.selectedRightMergeColumn();
    var selectClause = mergeMethod.sqlSelectClause(rightTableName, selectedMergeColumn ? selectedMergeColumn.get('name') : '');

    return generateSpatialMergeSQL({
      leftTableName: this.get('leftTable').get('name'),
      leftColumnsNames: this._selectedLeftColumnsNames(),
      rightTableName: rightTableName,
      selectClause: selectClause,
      intersectType: mergeMethod.NAME
    });
  },

  _selectedLeftColumnsNames: function() {
    return this.get('leftColumns')
    .filter(this._isSelectedColumn)
    .map(function(m) {
      return m.get('name');
    });
  },

  _isSelectedColumn: function(m) {
    return m.get('selected');
  }

}, {
  header: {
    icon: 'CDB-IconFont-wizard',
    title: 'Choose merge columns'
  },
  nextStep: MergeModel
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../merge_step_model":170,"./generate_spatial_merge_sql":175,"./spatial_merge_view":181}],173:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var Backbone = (typeof window !== "undefined" ? window['Backbone'] : typeof global !== "undefined" ? global['Backbone'] : null);
var SumMergeMethod = require('./merge_methods/sum_merge_method');
var AVGMergeMethod = require('./merge_methods/avg_merge_method');
var CountMergeMethod = require('./merge_methods/count_merge_method');
var SpatialMergeView = require('./spatial_merge_view');
var ChooseMergeMethod = require('./choose_merge_method_model');

/**
 * First step for a spatial merge - select a dataset table.
 */
module.exports = cdb.core.Model.extend({

  INSTRUCTIONS_SAFE_HTML: 'Calculate the intersecting geospatial records between two datasets (ex. points in polygons).<br/>' +
    "You'll need to decide the operation to perform here.",

  defaults: {
    user: undefined,
    leftTable: undefined,
    excludeColumns: undefined,
    leftKeyColumn: undefined,
    leftColumns: undefined,
    mergeMethods: undefined,

    rightTableData: undefined,
    rightColumns: undefined
  },

  initialize: function(attrs) {
    if (!attrs.leftTable) throw new Error('leftTable is required');
    if (!attrs.excludeColumns || _.isEmpty(attrs.excludeColumns)) cdb.log.error('excludeColumns was empty');
    this._initColumns();
    this._initLeftKeyColumn();
    this._initMergeMethods();
  },

  createView: function() {
    // Reset state
    this.set({
      gotoNextStep: false,
      rightTableData: undefined
    });
    this.get('mergeMethods').each(function(m) {
      m.set({
        selected: false,
        disabled: true
      });
    });
    this.get('rightColumns').reset();

    return new SpatialMergeView({
      model: this
    });
  },

  assertIfReadyForNextStep: function() {
    // Always return false, goes to next step implicitly on selecting table
    return false;
  },

  fetchRightColumns: function(tableData) {
    this.set('rightTableData', tableData);
    // TODO: extracted from old code, cdb.admin.TableColumnSelector._getColumns,
    //   isnt there some better way to get the schema/columns?
    $.ajax({
      url: cdb.config.prefixUrl() + '/api/v1/tables/' + tableData.id,
      dataType: 'jsonp',
      success: this._onFetchedRightColumns.bind(this)
    });
  },

  nextStep: function() {
    return new this.constructor.nextStep({
      user: this.get('user'),
      mergeMethods: this.get('mergeMethods'),
      leftTable: this.get('leftTable'),
      leftKeyColumn: this.get('leftKeyColumn'),
      leftColumns: this.get('leftColumns'),
      rightTableData: this.get('rightTableData'),
      rightKeyColumn: this._rightKeyColumn(),
      rightColumns: this.get('rightColumns')
    });
  },

  _initColumns: function() {
    var filteredLeftColumns = this._filterColumns(this.get('leftTable').get('schema'));
    this.set('leftColumns', new Backbone.Collection(filteredLeftColumns));
    this.set('rightColumns', new Backbone.Collection());
  },

  _initMergeMethods: function() {
    var mergeMethods = new Backbone.Collection([
      new SumMergeMethod(),
      new CountMergeMethod(),
      new AVGMergeMethod()
    ]);
    this.set('mergeMethods', mergeMethods);
  },

  _filterColumns: function(tableSchema) {
    var excludeColumns = this.get('excludeColumns');

    return _.chain(tableSchema)
      .map(this._columnDataToColumn)
      .reject(function(column) {
        return _.contains(excludeColumns, column.name);
      })
      .value();
  },

  _columnDataToColumn: function(columnData) {
    return {
      // TODO: why don't we use a proper model for schema, to provide convenient method to get columns as a collection already?
      name: columnData[0],
      type: columnData[1]
    };
  },

  _initLeftKeyColumn: function() {
    var theGeomColumn = this.get('leftColumns').find(this._isColumnTheGeom);
    this.set('leftKeyColumn', theGeomColumn.clone());
  },

  _onFetchedRightColumns: function(results) {
    var filteredColumns = this._filterColumns(results.schema);
    this.get('rightColumns').reset(filteredColumns, { silent: true }); // handled in next step
    this.set('gotoNextStep', true);
  },

  _rightKeyColumn: function() {
    return this.get('rightColumns')
      .find(this._isColumnTheGeom)
      .clone();
  },

  _isColumnTheGeom: function(column) {
    return column.get('name') === 'the_geom';
  }

}, {
  header: {
    icon: 'CDB-IconFont-play',
    title: 'Choose dataset to merge'
  },
  nextStep: ChooseMergeMethod
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./choose_merge_method_model":172,"./merge_methods/avg_merge_method":177,"./merge_methods/count_merge_method":178,"./merge_methods/sum_merge_method":179,"./spatial_merge_view":181}],174:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);

/**
 * View to indicate the selected key columns relationship and merge method relationship.
 */
module.exports = cdb.core.View.extend({

  initialize: function() {
    this._initBinds();
  },

  render: function() {
    var rightColumns = this.model.get('rightColumns');
    this.$el.html(
      this.getTemplate('common/dialogs/merge_datasets/spatial_merge/footer_info')({
        leftTableName: this.model.get('leftTable').get('name'),
        rightColumnName: rightColumns ? rightColumns.get('name') : ''
      })
    );
    return this;
  },

  _initBinds: function() {
    var rightColumns = this.model.get('rightColumns');
    rightColumns.bind('change:selected', this._updatePieces, this);
    this.add_related_model(rightColumns);

    var mergeMethods = this.model.get('mergeMethods');
    mergeMethods.bind('change:selected', this._updatePieces, this);
    this.add_related_model(mergeMethods);
  },

  _updatePieces: function() {
    var selectedMergMethod = this.model.selectedMergeMethod();
    this.$('.js-merge-method-name').text(selectedMergMethod ? selectedMergMethod.NAME : '');

    if (this.model.isCountMergeMethod(selectedMergMethod)) {
      this._changeRightPiece(this.model.get('rightTableData').name);
    } else {
      var m = this.model.selectedRightMergeColumn();
      this._changeRightPiece(m ? m.get('name') : '');
    }
  },

  _changeRightPiece: function(text) {
    this.$('.js-right')
      .text(text || '')
      .toggleClass('is-placeholder', !text);
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],175:[function(require,module,exports){
(function (global){
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);

// SQL query as taken from old code, cdb.admin.MergeTablesDialog
// Cleaned up to remove noise and avoid string concatenation to be more legible.
module.exports = function(d) {
  var leftTableName = d.leftTableName;
  var leftColumnsNames = d.leftColumnsNames;
  var rightTableName = d.rightTableName;
  var selectClause = d.selectClause;
  var intersectType = d.intersectType;

  var sql = ['SELECT',
    leftTableName + '.cartodb_id,',
    leftTableName + '.the_geom_webmercator,',
    leftTableName + '.the_geom,'
  ];

  _.each(leftColumnsNames, function(columnName) {
    if (columnName !== 'the_geom') {
      sql.push(leftTableName + '.' + columnName + ',');
    }
  });

  sql.push(
    '(SELECT ' + selectClause + ' FROM ' + rightTableName,
      'WHERE ST_Intersects(' + leftTableName + '.the_geom, ' + rightTableName + '.the_geom)',
    ') AS intersect_' + intersectType,
    'FROM ' + leftTableName
  );

  return sql.join(' ');
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],176:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);

/**
 * View to render a individual merge method.
 */
module.exports = cdb.core.View.extend({

  className: 'TabLink TabLink--positive TabLink--textCenterUpcase',

  events: {
    'hover': '_onHover',
    'mouseout': '_onMouseOut',
    'click': '_onClick'
  },

  initialize: function() {
    this._initBinds();
  },

  render: function() {
    var isDisabled = this.model.get('disabled');

    this.$el
      .text(this.model.NAME)
      .toggleClass('disabled', isDisabled)
      .toggleClass('selected', this.model.get('selected') && !isDisabled);

    if (isDisabled) {
      this._tooltipView().show();
    }

    return this;
  },

  _tooltipView: function() {
    if (!this._tooltip) {
      this._tooltip = new cdb.common.TipsyTooltip({
        el: this.$el,
        trigger: 'manual',
        title: function() {
          // For now there's only one reason why a merge method would be disabled, so inline it here.
          // If there are more methods set the reason as an attr on the model instead, and update that attr based on state
          return 'Select a column of type number to use this merge method';
        }
      });
      this.addView(this._tooltip);
    }
    return this._tooltip;
  },

  _initBinds: function() {
    this.model.bind('change:selected', this.render, this);
    this.model.bind('change:disabled', this.render, this);
  },

  _onHover: function(ev) {
    this.killEvent(ev);
    if (this.model.get('disabled')) {
      this._tooltip.showTipsy();
    }
  },

  _onMouseOut: function(ev) {
    this.killEvent(ev);
    if (this._tooltip) {
      this._tooltip.hideTipsy();
    }
  },

  _onClick: function(ev) {
    this.killEvent(ev);
    if (!this.model.get('disabled')) {
      this.model.set('selected', true);
    }
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],177:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);

/**
 * Merge method to create SQL query for doing a spatial AVG.
 */
module.exports = cdb.core.Model.extend({

  NAME: 'avg',

  defaults: {
    disabled: false,
    selected: false
  },

  changedMergeColumn: function(newMergeColumn) {
    var shouldDisable = !newMergeColumn || newMergeColumn.get('type') !== 'number';
    this.set({
      disabled: shouldDisable,
      selected: this.get('selected') && !shouldDisable
    });
  },

  sqlSelectClause: function(tableName, columnName) {
    return 'AVG(' + tableName + '.' + columnName + ')';
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],178:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);

/**
 * Merge method to create SQL query for doing a spatial count.
 */
module.exports = cdb.core.Model.extend({

  NAME: 'count',

  defaults: {
    disabled: false,
    selected: false
  },

  changedMergeColumn: function(newMergeColumn) {
  },

  sqlSelectClause: function() {
    return 'COUNT(*)';
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],179:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);

/**
 * Merge method to create SQL query for doing a spatial sum.
 */
module.exports = cdb.core.Model.extend({

  NAME: 'sum',

  defaults: {
    disabled: false,
    selected: false
  },

  changedMergeColumn: function(newMergeColumn) {
    var shouldDisable = !newMergeColumn || newMergeColumn.get('type') !== 'number';
    this.set({
      disabled: shouldDisable,
      selected: this.get('selected') && !shouldDisable
    });
  },

  sqlSelectClause: function(tableName, columnName) {
    return 'SUM(' + tableName + '.' + columnName + ')';
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],180:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var ChooseRightDatasetModel = require('./choose_right_dataset_model');

/**
 * Entry point model that represents the merge flavor of doing a spatial merge.
 */
module.exports = cdb.core.Model.extend({

  ILLUSTRATION_ICON_TYPE: 'IllustrationIcon--royal',
  ICON: 'CDB-IconFont-mergeSpatial',
  TITLE: 'Spatial join',
  DESC: 'Measure the number of intesecting records between two datasets (ex. count point inside polygons)',

  defaults: {
    user: undefined,
    table: undefined,
    excludeColumns: []
  },

  initialize: function(attrs) {
    if (!attrs.user) throw new Error('user is required');
    if (!attrs.table) throw new Error('table is required');
    if (!attrs.excludeColumns || _.isEmpty(attrs.excludeColumns)) cdb.log.error('excludeColumns was empty');
  },

  isAvailable: function() {
    return true;
  },

  firstStep: function() {
    return new ChooseRightDatasetModel({
      user: this.get('user'),
      leftTable: this.get('table'),
      excludeColumns: this.get('excludeColumns')
    });
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./choose_right_dataset_model":173}],181:[function(require,module,exports){
(function (global){
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var ColumnsSelectorView = require('../columns_selector_view');
var TablesSelectorView = require('../tables_selector_view');
var MergeMethodView = require('./merge_method_view');
var StickyHeaderView = require('../sticky_header_view');
var FooterView = require('../footer_view');
var FooterInfoView = require('./footer_info_view');

/**
 * Shared view for both steps of doing a spatial merge, since they are essentially the same
 */
module.exports = cdb.core.View.extend({

  initialize: function() {
    this._initViews();
    this._initBinds();
  },

  render: function() {
    var hasSelectedRightTable = this._hasSelectedRightTable();

    var $el = $(
      this.getTemplate('common/dialogs/merge_datasets/spatial_merge/spatial_merge')({
        leftKeyColumn: this.model.get('leftKeyColumn'),
        hasSelectedRightTable: hasSelectedRightTable,
        rightKeyColumn: this.model.get('rightKeyColumn'),
        rightColumns: this.model.get('rightColumns')
      })
    );

    $el.find('.js-left-table').append(this._leftTableComboView.render().$el);
    $el.find('.js-left-columns').append(this._leftColumnsView.render().$el);
    $el.find('.js-right-columns').append(this._rightColumnsView.render().$el);
    $el.append(this._footerView.render().$el);

    if (hasSelectedRightTable) {
      $el.find('.js-sticky-header').append(this._stickyHeaderView.render().$el);
      $el.find('.js-right-table').append(this._rightTableComboView.render().$el);
      this._renderMergeMethods($el.find('.js-merge-methods'));
    } else {
      $el.find('.js-right-tables').append(this._rightTablesSelectorView.render().$el);
    }

    this.$el.html($el);

    return this;
  },

  onChangeKeyColumnsVisiblity: function() {
    if (this._hasSelectedRightTable()) {
      this._stickyHeaderView.$el.slideToggle(200);
    }
  },

  _hasSelectedRightTable: function() {
    return _.isObject(this.model.get('rightTableData'));
  },

  _initViews: function() {
    this._leftTableComboView = new cdb.forms.Combo({
      className: 'Select',
      width: '100%',
      disabled: true,
      extra: [this.model.get('leftTable').get('name')]
    });
    this.addView(this._leftTableComboView);

    this._leftColumnsView = new ColumnsSelectorView({
      collection: this.model.get('leftColumns'),
      excludeFilter: this._columnsExcludeFilter,
      selectorType: 'switch'
    });
    this.addView(this._leftColumnsView);

    var footerInfoView; // only set for 2nd step
    var rightTableData = this.model.get('rightTableData');
    if (rightTableData) {
      this._stickyHeaderView = new StickyHeaderView({
        leftKeyColumn: this.model.get('leftKeyColumn'),
        rightKeyColumn: this.model.get('rightKeyColumn'),
        addRadioPlaceholder: true
      });
      this.addView(this._stickyHeaderView);

      this._rightTableComboView = new cdb.forms.Combo({
        className: 'Select',
        width: '100%',
        disabled: true,
        extra: [this.model.get('rightTableData').name]
      });
      this.addView(this._rightTableComboView);
      footerInfoView = new FooterInfoView({
        model: this.model
      })
    } else {
      this._rightTablesSelectorView = new TablesSelectorView({
        excludeFilter: this._rightTablesExcludeFilter.bind(this),
        initialOption: {
          label: rightTableData ? rightTableData.name : 'Select dataset'
        }
      });
      this.addView(this._rightTablesSelectorView);
    }

    this._rightColumnsView = new ColumnsSelectorView({
      collection: this.model.get('rightColumns'),
      excludeFilter: this._columnsExcludeFilter,
      selectorType: 'radio'
    });
    this.addView(this._rightColumnsView);

    this._mergeMethodViews = this.model.get('mergeMethods').map(this._createMergeMethodView, this);

    this._footerView = new FooterView({
      model: this.model,
      nextLabel: rightTableData ? 'Merge datasets' : undefined,
      infoView: footerInfoView
    });
    this.addView(this._footerView);
  },

  _createMergeMethodView: function(m) {
    var view = new MergeMethodView({ model: m });
    this.addView(view);
    return view;
  },

  _initBinds: function() {
    var rightColumns = this.model.get('rightColumns');
    rightColumns.bind('change:selected', this._onChangeSelectedRightColumn, this);
    this.add_related_model(rightColumns);

    var mergeMethods = this.model.get('mergeMethods');
    if (mergeMethods) {
      mergeMethods.bind('change:selected', this._onChangeSelectedMergeMethod, this);
      this.add_related_model(mergeMethods);
    }

    if (this._rightTablesSelectorView) {
      this._rightTablesSelectorView.model.bind('change:tableData', this._onChangeRightTableData, this);
      this.add_related_model(this._rightTablesSelectorView.model);
    }
  },

  _onChangeRightTableData: function(m, tableData) {
    this._rightColumnsView.model.set('loading', 'columns');
    this.model.fetchRightColumns(tableData);
  },

  _onChangeSelectedRightColumn: function(m, isSelected) {
    if (isSelected) {
      this.model.changedRightMergeColumn(m);
    }
  },

  _onChangeSelectedMergeMethod: function(m, isSelected) {
    if (!isSelected) return;

    this.model.changedSelectedMergeMethod(m);

    var isCountMergeMethod = this.model.isCountMergeMethod(m);
    this.$('.js-count-merge-method-info').toggle(isCountMergeMethod);
    this.$('.js-right-columns').toggle(!isCountMergeMethod);
  },

  _renderMergeMethods: function($target) {
    $target.append.apply($target, this._$renderedMergeMethodViews());
  },

  _$renderedMergeMethodViews: function() {
    return _.map(this._mergeMethodViews, function(view) {
      return view.render().$el;
    });
  },

  _columnsExcludeFilter: function(column) {
    return column.get('name') === 'the_geom';
  },

  _rightTablesExcludeFilter: function(vis) {
    return vis.get('name') === this.model.get('leftTable').get('name');
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../columns_selector_view":165,"../footer_view":166,"../sticky_header_view":182,"../tables_selector_view":183,"./footer_info_view":174,"./merge_method_view":176}],182:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);

/**
 * Sticky header, should be displayed when the key columns goes out of view
 */
module.exports = cdb.core.View.extend({

  className: 'MergeDatasets-stickyHeader',
  attributes: {
    style: 'display: none'
  },

  render: function() {
    var leftKeyColumn = this.options.leftKeyColumn;
    var rightKeyColumn = this.options.rightKeyColumn;

    this.$el.html(
      this.getTemplate('common/dialogs/merge_datasets/sticky_header')({
        leftColumnName: leftKeyColumn.get('name'),
        leftColumnType: leftKeyColumn.get('type'),
        rightColumnName: rightKeyColumn.get('name'),
        rightColumnType: rightKeyColumn.get('type'),
        addRadioPlaceholder: this.options.addRadioPlaceholder
      })
    );
    return this;
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],183:[function(require,module,exports){
(function (global){
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);

/**
 * View to select a table. extends the cdb.admin.Combo to handle the tables fetch and similar.
 */
module.exports = cdb.forms.Combo.extend({

  className: 'Select',

  initialize: function() {
    this.options.width = '100%';
    this.options.disabled = true;
    this.options.extra = [this._initialOptionDataItem() || 'Loading tables…'];
    this.options.excludeFilter = this.options.excludeFilter || function() {};

    this.elder('initialize');
    this.model = this.model || new cdb.core.Model();

    this._initVisualizations();
    this._initBinds();
    this._fetchTables();
  },

  _formatResult: function(state) {
    return JSON.stringify(state);
  },

  _initVisualizations: function() {
    // Taken from old code, cdb.admin.TableColumnSelector._getTables
    var visualizations = new cdb.admin.Visualizations();
    visualizations.options.set({
      type: 'table',
      per_page: 100000,
      table_data: false
    });
    this.model.set('visualizations', visualizations);
  },

  _initBinds: function() {
    this.bind('change', this._onChangeOption, this);

    var visualizations = this.model.get('visualizations');
    visualizations.bind('reset', this._onResetTables, this);
    this.add_related_model(visualizations);
  },

  _fetchTables: function() {
    // Taken from old code, cdb.admin.TableColumnSelector._getTables
    this.model.get('visualizations').fetch({
      data: {
        o: {
          updated_at: 'desc'
        },
        exclude_raster: true
      }
    });
  },

  _onResetTables: function() {
    this.options.disabled = false;

    var filteredVisualizations = this.model.get('visualizations').reject(this.options.excludeFilter);
    var newData = _.map(filteredVisualizations, this._visToComboDataItem, this);

    // Prepend initial item to new data, if there's one
    var initialItem = this._initialOptionDataItem();
    if (initialItem) {
      newData.unshift(initialItem);
    }
    this.updateData(newData);

    // pre-select 1st item, unless there's an initialOption
    var firstFilteredVis = filteredVisualizations[0];
    if (!initialItem && firstFilteredVis) {
      this._onChangeOption(firstFilteredVis.id);
    }
  },

  _visToComboDataItem: function(vis) {
    // required data format for an option for the cdb.admin.combo…
    return this._comboDataItem(vis.get('name'), vis.id);
  },

  _initialOptionDataItem: function() {
    if (_.isObject(this.options.initialOption)) {
      var obj = this.options.initialOption;
      // required data format for an option for the cdb.admin.combo…
      return this._comboDataItem(obj.label, obj.value);
    }
  },

  _comboDataItem: function(label, value) {
    return [label, value];
  },

  _onChangeOption: function(visId) {
    var vis = this.model.get('visualizations').get(visId);
    this.model.set('tableData', vis ? vis.get('table') : undefined);
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],184:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var Utils = (typeof window !== "undefined" ? window['cdb']['Utils'] : typeof global !== "undefined" ? global['cdb']['Utils'] : null);
var Pecan = require('cartodb-pecan');

module.exports = cdb.core.View.extend({

  _CARD_WIDTH: 288,
  _CARD_HEIGHT: 170,
  _TABS_PER_ROW: 3,
  _GET_BBOX_FROM_THE_GEOM: true,

  tagName: "li",
  className: "GalleryList-item MapsList-item js-card",

  events: {
    "click ": "_onClick"
  },

  initialize: function() {
    this.template = cdb.templates.getTemplate('common/dialogs/pecan/card');
  },

  render: function() {
    var src = this.options.url + "?api_key=" + this.options.api_key;

    var wizardName = this.model.get("visualizationType").charAt(0).toUpperCase() + this.model.get("visualizationType").slice(1);

    var null_count = +(this.model.get("null_ratio") * this.model.get("count")).toFixed(2);
    var prettyNullCount = Utils.formatNumber(null_count);

    this.$el.html(
      this.template({
      column: this.model.get("column"),
      wizard: wizardName,
      metadata: this.model.get("metadata"),
      null_count: prettyNullCount,
      weight: this.model.get("weight")
    }));

    if (this.model.get("visualizationType") === "choropleth") {
      this._addHistogram();
    }

    var self = this;
    var img = new Image();
    img.onerror = function() {
      cdb.log.info("error loading the image for " + self.model.get("column"));
    };
    img.onload = function() {
      self.$(".js-loader").hide();
      self.$(".js-header").append('<img class="MapCard-preview" src="' + src + '" />');
      self.$("img").show();
    };

    img.src = src;

    return this;
  },

  _onClick: function(e) {
    this.killEvent(e);
    this.trigger("click", this.model, this);
  },

  _addHistogram: function() {
    var data = this.model.get("cat_hist").slice(0, 7);
    data = _.sortBy(data, function(d){ return d[0]; });
    var rampName = Pecan.getMethodProperties(this.model.attributes).name;

    var width = 37;
    var height = 11;
    var minHeight = 2;

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var svg = d3.select(this.$(".js-graph")[0]).append("svg")
        .attr("width", width)
        .attr("height", height)
      .append("g");

    x.domain(data.map(function(d) { return d[0]; }));
    y.domain([0, d3.max(data, function(d) { return d[1]; })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.selectAll(".bar")
        .data(data)
      .enter().append("rect")
        .attr("fill", function(d, i) {
          return cdb.admin.color_ramps[rampName][7][i];
        })
        .attr("class", "HistogramGraph-bar")
        .attr('data-title', function(d) {
          return Utils.formatNumber(d[1])
        })
        .attr("x", function(d) { return x(d[0]); })
        .attr("width", 4)
        .attr("y", function(d) {
          var value = height - y(d[1]);
          var yPos = y(d[1]);
          return value < minHeight ? (height - minHeight) : yPos;
        })
        .attr("height", function(d) {
          var value = height - y(d[1]);
          return value < minHeight ? minHeight : value;
        })

    return this;
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"cartodb-pecan":234}],185:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var Utils = (typeof window !== "undefined" ? window['cdb']['Utils'] : typeof global !== "undefined" ? global['cdb']['Utils'] : null);
var Pecan = require('cartodb-pecan');
var BaseDialog = require('../../views/base_dialog/view');
var ViewFactory = require('../../view_factory');
var randomQuote = require('../../view_helpers/random_quote');
var PecanCard = require('./pecan_card');

module.exports = BaseDialog.extend({

  _CARD_MARGIN: 20,
  _CARD_WIDTH: 288,
  _CARD_HEIGHT: 170,
  _STROKE_PX_LIMIT: 0.04,
  _TABS_PER_ROW: 3,
  _GET_BBOX_FROM_THE_GEOM: true,
  _DEFAULT_BASEMAP_TEMPLATE: "http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
  _SUPPORTED_BASEMAPS: ["light_all", "dark_all", "light_nolabels", "dark_nolabels", "base-antique", "base-flatblue", "toner", "watercolor"],

  events: BaseDialog.extendEvents({
    "click .js-goPrev": "_prevPage",
    "click .js-goNext": "_nextPage",
    "click .js-skip"  : "cancel"
  }),

  initialize: function() {
    this.elder('initialize');

    if (!this.options.vis) {
      throw new Error('vis is required');
    }

    if (!this.options.user) {
      throw new Error('user is required');
    }

    this.columns = this.options.collection;
    this.add_related_model(this.collection);

    this._initModels();
    this._initViews();
    this._initBinds();
  },

  render_content: function() {
    return this._panes.getActivePane().render().el;
  },

  render: function() {
    BaseDialog.prototype.render.apply(this, arguments);
    return this;
  },

  _initModels: function() {
    this.model = new cdb.core.Model({ page: 1, maxPages: 0 });
  },

  _initViews: function() {

    _.bindAll(this, "_addCard", "_generateThumbnail", "_refreshMapList", "_setWizardProperties");

    this.vis   = this.options.vis;
    this.map   = this.vis.map;
    this.user  = this.options.user;

    this._panes = new cdb.ui.common.TabPane({
      el: this.el
    });

    this.addView(this._panes);

    this._panes.addTab('vis',
      ViewFactory.createByTemplate('common/dialogs/pecan/template', {
      })
    );

    this._panes.addTab('applying',
      ViewFactory.createByTemplate('common/templates/loading', {
        title: 'Applying style…',
        quote: randomQuote()
      })
    );

    this._panes.addTab('loading',
      ViewFactory.createByTemplate('common/templates/loading', {
        title: 'Loading previews…',
        quote: randomQuote()
      })
    );

    this._getBBox();
    this._sendOpenStats();
    this._loadCards();

  },

  _initBinds: function() {
    this.model.bind('change:page', this._moveTabsNavigation, this);
    this._panes.bind('tabEnabled', this.render, this);
  },

  _getBBox: function() {
    this.columns.each(function(column) {
      if (column.get("column") === "the_geom") {
        this.bbox = column.get("bbox");
      }
    }, this);
  },

  _loadCards: function() {
    this.columns.each(this._loadCard, this);
  },

  _loadCard: function(column) {
    var self = this;

    if (column.get("success")) {
      this._generateThumbnail(column, function(error, url) {
        if (!error) {
          self._addCard(url, column);
        } else {
          cdb.log.error(error);
        }
      });
    }
  },

  _sendAppliedStats: function() {
    cdb.god.trigger('metrics', 'applied_pecan', {
      email: window.user_data.email
    });
  },

  _sendOpenStats: function() {
    cdb.god.trigger('metrics', 'open_pecan_list', {
      email: window.user_data.email
    });
  },

  _skip: function() {
    var layerID = this.vis.get("active_layer_id");
    var name;
    var activeLayer  = this.vis.map.layers.where({ id: layerID });

    if (activeLayer) {
      name = activeLayer[0].table.get("name");
    }

    var skipPencanDialog = 'pecan_' + this.options.user.get("username") + "_" + name;
    localStorage[skipPencanDialog] = true;
  },

  _nextPage: function() {
    var page = this.model.get('page');
    var maxPages = this.model.get('maxPages');

    if (page < maxPages) {
      this.model.set('page', page + 1);
    }
  },

  _prevPage: function() {
    var page = this.model.get('page');
    if (page > 1) {
      this.model.set('page', page - 1);
    }
  },

  _moveTabsNavigation: function() {
    var page = this.model.get('page');
    var rowWidth = 960;

    var p = rowWidth * (page - 1);
    this.$('.js-map-list').css('margin-left', '-' + p + 'px');
    this._refreshNavigation();
  },

  _refreshNavigation: function() {
    var page = this.model.get('page');
    var maxPages = this.model.get('maxPages');

    this.$('.js-goPrev')[ page > 1 ? 'removeClass' : 'addClass' ]('is-disabled');
    this.$('.js-goNext')[ page < maxPages ? 'removeClass' : 'addClass' ]('is-disabled');
  },

  _hideNavigation: function() {
    this.$('.js-navigation').addClass("is-hidden");
  },

  _setupCSS: function(css, geometryType) {
    var row_count = this.options.vis.tableMetadata().get("row_count");
    var removeStrokeIndex = row_count / (this._CARD_WIDTH * this._CARD_HEIGHT);
    var removeStroke = (removeStrokeIndex > this._STROKE_PX_LIMIT);

    if (geometryType !== "line" && removeStroke) {
      css = css.replace("marker-line-width: 1;", "marker-line-width: 0.7;");
      css = css.replace("marker-width: 10;", "marker-width: 7;");
    }

    return css;
  },

  _setupTemplate: function() {
    var template = this.map.getLayerAt(0).get("urlTemplate");

    if (template) {
      var supportedBasemap = _.find(this._SUPPORTED_BASEMAPS, function(basemap) {
        return template.indexOf(basemap) !== -1
      });
    }

    if (!template || !supportedBasemap) {
      template = this._DEFAULT_BASEMAP_TEMPLATE;
    }

    return template;
  },

  _generateLayerDefinition: function(column) {

    var type = column.get("visualizationType");
    var sql = column.get("sql");
    var css = this._setupCSS(column.get("css"), column.get("geometryType"));

    var api_key  = this.user.get("api_key");
    var maps_api_template = cdb.config.get('maps_api_template');

    var template = this._setupTemplate();

    var layerDefinition = {
      user_name: user_data.username,
      maps_api_template: maps_api_template,
      api_key: api_key,
      layers: [{
        type: "http",
        options: {
          urlTemplate: template,
          subdomains: [ "a", "b", "c" ]
        }
      }, {
        type: "cartodb",
        options: {
          sql: sql,
          cartocss: css,
          cartocss_version: "2.1.1"
        }
      }]
    };

    if (type === "torque" || type === "heatmap"){
      layerDefinition.layers[1] = {
        type: "torque",
        options: {
          sql: sql,
          cartocss: css,
          cartocss_version: "2.1.1"
        }
      }
    }

    return layerDefinition;
  },

  _generateThumbnail: function(column, callback) {

    var layerDefinition = this._generateLayerDefinition(column);

    var onImageReady = function(error, url) {
      callback && callback(error, url);
    };

    var the_geom = this.columns.find(function(column) {
      return column.get("column") === 'the_geom'
    });

    if (this.bbox && this._GET_BBOX_FROM_THE_GEOM) {
      cdb.Image(layerDefinition).size(this._CARD_WIDTH, this._CARD_HEIGHT).bbox(this.bbox).getUrl(onImageReady);
    } else {
      cdb.Image(layerDefinition).size(this._CARD_WIDTH, this._CARD_HEIGHT).zoom(this.map.get("zoom")).center(this.map.get("center")).getUrl(onImageReady);
    }

  },

  _addCard: function(url, column) {

    var card = new PecanCard({
      url: url,
      urlTemplate: this.map.getLayerAt(0).get("urlTemplate"),
      api_key: this.user.get("api_key"),
      model: column
    });

    card.bind("click", this._onCardClick, this);
    card.render();

    this._panes.active('vis');

    if (this._getSuccessColumns().length < 3) {
      this.$(".js-map-list").addClass("is--centered");
    }

    if (column.get("visualizationType") === 'heatmap' || column.get("visualizationType") === 'torque') {
      this.$(".js-map-list").prepend(card.$el);
    } else {
      this.$(".js-map-list").append(card.$el);
    }

    this._refreshMapList(card.$el);
    this._refreshNavigation();
  },

  _refreshMapList: function($el) {
    var w = $el.width();
    var l = this.$(".js-card").length;
    this.$(".js-map-list").width(w * l + (l - 1) * this._CARD_MARGIN);
    this.model.set('maxPages', Math.ceil(this.$('.js-card').size() / this._TABS_PER_ROW));
  },

  _getSuccessColumns: function() {
    return this.columns.filter(function(c) { return c.get("success")});
  },

  _bindDataLayer: function() {
    this.layer.wizard_properties.unbind("load", this._setWizardProperties, this);
    this.layer.wizard_properties.bind("load", this._setWizardProperties, this);
  },

  _getProperties: function(column) {

    var property = column.get("column");
    var wizard = this._getWizardName(column.get("visualizationType"));

    var properties = { property: property };

    if (wizard === "category") {
      return this._getCategoriesProperties(properties);
    } else if (wizard === 'choropleth') {
      return this._getChoroplethProperties(properties);
    } else if(wizard === "heatmap") {
      return this._getHeatmapProperties(properties);
    }

  },

  _onCardClick: function(column) {
    this._panes.active('applying');
    this.model.set("column", column);

    this._skip();

    this.layer = this._getDataLayer();

    this._sendAppliedStats();

    var wizard = this._getWizardName(column.get("visualizationType"));
    var properties = this._getProperties(column);

    this._bindDataLayer();
    this.layer.wizard_properties.active(wizard, properties);
  },

  _getWizardName: function(name){
    var mappings = {"heatmap": "torque_heat"};
    return mappings[name] || name;
  },

  _getDataLayer: function() {
    return this.map.layers.getDataLayers()[0];
  },

  _setWizardProperties: function() { // TODO: hack, we should find a way to remove this
    var properties = this._getProperties(this.model.get("column"));
    this.layer.wizard_properties.unbind("load", this._setWizardProperties, this);
    if (properties) {
      this.layer.wizard_properties.set(properties);
    }
    this.close();
  },

  _getChoroplethProperties: function(properties) {
    var column = this.model.get("column");

    var property = column.get("column");
    var type     = column.get("type");
    var dist     = column.get("dist_type");
    var stats    = column.get("stats");

    properties.qfunction  = this._getQFunction(dist);
    properties.color_ramp = Pecan.getMethodProperties(stats).name;

    return properties;
  },

  _getCategoriesProperties: function(properties) {
    var column = this.model.get("column");
    properties.metadata   = column.get("metadata");
    properties.categories = column.get("metadata");
    return properties;
  },

  _getHeatmapProperties: function(properties){
    properties.property = "cartodb_id";
    properties["torque-resolution"] = 2;
    return properties;
  },

  _getQFunction: function(dist) {
    var qfunction = "Jenks";

    if (dist === 'L' || dist == 'J') {
      qfunction = "Heads/Tails";
    } else if (dist === 'A' || dist == 'U') {
      qfunction = "Jenks";
    } else if (dist === 'F') {
      qfunction = "Quantile"; // we could use 'Equal Interval' too
    }
    return qfunction;
  },

  _keydown: function(e) {
    if (e.keyCode === $.ui.keyCode.LEFT) {
      this._prevPage();
    } else if (e.keyCode === $.ui.keyCode.RIGHT) {
      this._nextPage();
    }
    BaseDialog.prototype._keydown.call(this, e);
  },

  clean: function() {
    if (this.layer) {
      this.layer.wizard_properties.unbind("load", this._setWizardProperties, this);
    }

    BaseDialog.prototype.clean.call(this);
  },

  cancel: function(e) {
    this.killEvent(e);
    this.model.set('disabled', true);
    this._skip();
    this.elder('cancel');
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../view_factory":209,"../../view_helpers/random_quote":212,"../../views/base_dialog/view":213,"./pecan_card":184,"cartodb-pecan":234}],186:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var Utils = (typeof window !== "undefined" ? window['cdb']['Utils'] : typeof global !== "undefined" ? global['cdb']['Utils'] : null);
var BaseDialog = require('../../views/base_dialog/view');
var ViewFactory = require('../../view_factory');
var randomQuote = require('../../view_helpers/random_quote');

module.exports = cdb.core.View.extend({

  _MAX_ROWS: 100000,
  _MAX_COLS: 60,
  _EXCLUDED_COLUMNS: [
    'cartodb_id', 'lat', 'lon', 'lng', 'long', 'latitude', 'longitude', 'longitudenumber','latitudenumber', 
    'minlat', 'maxlat', 'minlon', 'maxlon', 'minlng', 'maxlng', 'center_lat', 'centerlat', 'center_lon', 'centerlon',
    'latdd', 'longdd', 'shape_length', 'shape_area', 'objectid', 'id', 'created_at', 'updated_at',
    'iso2', 'iso3', 'x', 'y', 'x_coord', 'y_coord', 'xcoord', 'ycoord', 'coord_x', 'coord_y', 'coordx', 'coordy', 
    'cartodb_georef_status','scalerank', 'strokweig', 'country', 'state', 'area_sqkm', 'region', 'subregion', 'funcstat',
    'classfp', 'county_fip', 'county', 'aland10'
  ],

  initialize: function() {
    this.elder('initialize');

    if (!this.options.table) {
      throw new Error('table is required');
    }

    this._initModels();
    this._initViews();
  },

  _check: function() {

    var isGeoreferenced = this.options.table.isGeoreferenced();

    var tableData     = this.options.table.data();
    var geometryTypes = tableData.table && tableData.table.get("geometry_types");
    var hasGeometries = geometryTypes && geometryTypes.length > 0 ? true : false;

    var row_count     = tableData.table.get("rows_counted");
    var hasRows       = row_count > 0 && row_count < this._MAX_ROWS;

    var col_count = _(this.query_schema).size();
    var hasColumns = col_count > 0 && col_count < this._MAX_COLS;

    return isGeoreferenced && hasGeometries && hasRows && hasColumns;
  },

  _initModels: function() {
    this.columns = new Backbone.Collection();
    this.model = new cdb.core.Model({ page: 1, maxPages: 0 });
  },

  _initViews: function() {

    this.table = this.options.table;
    this.query_schema = this.table.data().query_schema;
    this.backgroundPollingModel = this.options.backgroundPollingModel;

    if (this._check() && this.backgroundPollingModel.canAddAnalysis()) {
      this._setupColumns();
      this._start();
    }
  },

  _getSimplifiedGeometryType: function(g) {
    return {
      st_multipolygon: 'polygon',
      st_polygon: 'polygon',
      st_multilinestring: 'line',
      st_linestring: 'line',
      st_multipoint: 'point',
      st_point: 'point'
    }[g.toLowerCase()];
  },

  _getGeometryType: function() {
    var geometryTypes = this.table.data().table.get("geometry_types");
    return this._getSimplifiedGeometryType(geometryTypes[0]);
  },

  _start: function() {
    var columns = this.columns.map(function(column) {
      return { table_id: this.table.id, column: column.get("name"), geometry_type: column.get("geometry_type") };
    }, this);

    this.backgroundPollingModel.addAnalysis(columns);
  },

  _setupColumns: function() {
    _(this.query_schema).each(function(type, name) {
      if (!_.include(this._EXCLUDED_COLUMNS, name)) {
        this.columns.add({ name: name.concat(""), geometry_type: this._getGeometryType() });
      }
    }, this);
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../view_factory":209,"../../view_helpers/random_quote":212,"../../views/base_dialog/view":213}],187:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);

/**
 * View model for an option that may be disabled due to Vis' privacy being set to private.
 */
module.exports = cdb.core.Model.extend({

  isDisabled: function() {
    return this.get('isPrivacyPrivate');
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],188:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);

/**
 * View to handle the visual representation of a publish option.
 */
module.exports = cdb.core.View.extend({

  className: 'OptionCard OptionCard--static',

  events: {
    'click input': '_onClickInput'
  },

  initialize: function() {
    this.elder('initialize');
    this._template = cdb.templates.getTemplate(this.model.get('template'));
    this._initBinds();
  },

  render: function() {
    this.clearSubViews();

    this.$el.html(
      this._template({
        model: this.model
      })
    );
    this.$el.toggleClass('is-disabled', !!this.model.isDisabled());

    return this;
  },

  _initBinds: function() {
    this.model.bind('change', this.render, this);
  },

  _onClickInput: function(ev) {
    this.killEvent(ev);
    this.$('input').select();
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],189:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);
var Backbone = (typeof window !== "undefined" ? window['Backbone'] : typeof global !== "undefined" ? global['Backbone'] : null);
var BaseDialog = require('../../views/base_dialog/view');
var OptionView = require('./publish_option_view');
var ViewModel = require('./options/view_model');

/**
 * Delete items dialog
 */
module.exports = BaseDialog.extend({

  events: function() {
    return _.extend({}, BaseDialog.prototype.events, {
      'click .js-change-privacy': '_openPrivacyDialog'
    });
  },

  initialize: function() {
    this.elder('initialize');
    if (!this.model) throw new Error('model (vis) is required');
    if (!this.options.user) throw new Error('user is required');
    this._initOptions();
    this._initBinds();
  },

  /**
   * @implements cdb.ui.common.Dialog.prototype.render_content
   */
  render_content: function() {
    this.clearSubViews();

    var $el = $(
      cdb.templates.getTemplate('common/dialogs/publish/publish')({
      })
    );

    this._options.each(function(model) {
      var view = new OptionView({
        model: model
      });
      this.addView(view);
      $el.find('.js-publish-options').append(view.render().el);
    }, this);

    // Event tracking "Published visualization"
    cdb.god.trigger('metrics', 'published_visualization', {
      email: window.user_data.email
    });

    return $el;
  },

  _initOptions: function() {
    // Public URL option
    this._options = new Backbone.Collection();
    this._publicUrlOption = new ViewModel({
      template: 'common/dialogs/publish/options/public_url'
    });
    this._options.add(this._publicUrlOption);

    // Embed option
    this._embedOption = new ViewModel({
      template: 'common/dialogs/publish/options/embed',
      embedURL: this.model.embedURL()
    });
    this._options.add(this._embedOption);

    // CartoDB.js option
    this._options.add(
      new ViewModel({
        template: 'common/dialogs/publish/options/cdb',
        vizjsonURL: this.model.vizjsonURL()
      })
    );

    this._updateOptionsWithNewPrivacy();
  },

  _updateOptionsWithNewPrivacy: function() {
    var isPrivate = this.model.get('privacy') === 'PRIVATE';

    this._publicUrlOption.set('isPrivacyPrivate', isPrivate);
    this._embedOption.set('isPrivacyPrivate', isPrivate);

    if (!isPrivate) {
      var publicURL = this.model.publicURL();
      this._publicUrlOption.set({
        url: publicURL
      });
    }
  },

  _initBinds: function() {
    this.model.bind('change:privacy', this._updateOptionsWithNewPrivacy, this);
  },

  _openPrivacyDialog: function(e) {
    this.killEvent(e);

    var privacyModal = new cdb.editor.ChangePrivacyView({
      vis: this.model, //vis
      user: this.options.user,
      clean_on_hide: true,
      enter_to_confirm: true
    });

    // Do not remove this dialog but keep it until returning
    var originalCleanOnHideValue = this.options.clean_on_hide;
    this.options.clean_on_hide = false;
    this.close();
    privacyModal.appendToBody();

    // Return to this view when done
    var self = this;
    var onClose = function() {
      privacyModal.unbind('hide', onClose);
      self.options.clean_on_hide = originalCleanOnHideValue;
      self.show();
      privacyModal.close();
    };
    privacyModal.bind('hide', onClose);
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../views/base_dialog/view":213,"./options/view_model":187,"./publish_option_view":188}],190:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var BaseDialog = require('../../views/base_dialog/view');
var ViewFactory = require('../../view_factory');
var randomQuote = require('../../view_helpers/random_quote');
var moment = (typeof window !== "undefined" ? window['moment'] : typeof global !== "undefined" ? global['moment'] : null);

module.exports = BaseDialog.extend({

  _FORMAT: 'png',

  events: BaseDialog.extendEvents({
    'click .js-format': '_onClickFormat',
    'keyup .js-textInput': '_onKeyUp',
    'focus .js-textInput': '_onFocus',
    'blur .js-textInput': '_onBlur'
  }),

  initialize: function() {
    this.elder('initialize');

    this.options = _.defaults(this.options, { format: this._FORMAT });
    this.model = new cdb.core.Model(this.options);
    this.mapView = this.options.mapView;
    this._initBinds();
  },

  render_content: function() {
    return this.getTemplate('common/dialogs/static_image/advanced_export_view')(this.model.attributes);
  },

  _initBinds: function() {
    this.model.on('change:format', this._onChangeFormat, this);
  },

  _onKeyUp: function(e) {
    var value = +$(e.target).val();
    $(e.target).parent().toggleClass('has-error', !(_.isNumber(value) && value > 10));
  },

  _onFocus: function(e) {
    $(e.target).parent().addClass('is-focused');
  },

  _onBlur: function(e) {
    $(e.target).parent().removeClass('is-focused');
  },

  _onChangeFormat: function() {
    this.$('.js-radioButton').removeClass('is-checked');
    this.$('.js-' + this.model.get('format')).addClass('is-checked');
  },

  _onClickFormat: function(e) {
    this.killEvent(e);
    var $el = $(e.target).closest('.js-format');
    this.model.set('format', $el.data('format'));
  },

  _getBounds: function() {
    var nw = this.mapView.pixelToLatLon([this.options.x + this.options.width, this.options.y]);
    var sw = this.mapView.pixelToLatLon([this.options.x, this.options.y + this.options.height]);
    return [[sw.lat, sw.lng], [nw.lat, nw.lng]];
  },

  _ok: function() {
    var width = +this.$('.js-width').val();
    var height = +this.$('.js-height').val();
    var format = this.model.get('format');
    var bounds = this._getBounds();

    this.trigger('generate_image', { width: width, height: height, bounds: bounds, format: format });
    this.close();
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../view_factory":209,"../../view_helpers/random_quote":212,"../../views/base_dialog/view":213}],191:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var BaseDialog = require('../../views/base_dialog/view');
var ViewFactory = require('../../view_factory');
var randomQuote = require('../../view_helpers/random_quote');
var moment = (typeof window !== "undefined" ? window['moment'] : typeof global !== "undefined" ? global['moment'] : null);

module.exports = BaseDialog.extend({

  events: BaseDialog.extendEvents({
    'click .js-input': '_onInputClick',
    'click .js-open-image': 'close'
  }),

  initialize: function() {
    this.elder('initialize');
    this._initViews();
    this._initBinds();
  },

  render_content: function() {
    return this._panes.getActivePane().render().el;
  },

  _initViews: function() {
    this.vis = this.options.vis;
    this.user = this.options.user;
    this.column = this.options.column;

    this._panes = new cdb.ui.common.TabPane({
      el: this.el
    });

    this.addView(this._panes);

    this._panes.addTab('loading',
      ViewFactory.createByTemplate('common/templates/loading', {
        title: 'Generating image',
        quote: randomQuote()
      })
    );
    this._panes.addTab('fail',
      ViewFactory.createByTemplate('common/templates/fail', {
        msg: 'Could not generate image'
      })
    );

    this._panes.active('loading');
  },

  loadURL: function(url) {
    this._showResult({ displayedLink: url, filename: url, content: url, type: 'url' });
  },

  _generateImageFilename: function() {
    var filename = (this.vis.get('name') + ' by ' + this.user.nameOrUsername() + ' ' + moment(new Date()).format('MM DD YYYY hh mm ss'));
    return filename.replace(/ /g, '_').toLowerCase();
  },

  generateImage: function(url) {
    var callback = function(url) {
      var filename = this._generateImageFilename();
      this._showResult({
        content: url,
        type: 'url',
        displayedLink: filename + '.' + this.options.format,
        filename: filename
      });
    };

    if (cdb.config.get('static_image_upload_endpoint')) {
      callback = this._exportImage;
    }

    this._loadMapImage(url, callback.bind(this));
  },

  _showResult: function(options) {
    this._panes.addTab('result',
      ViewFactory.createByTemplate('common/dialogs/static_image/export_image_result_view', {
        column: this.column,
        response: options
      })
    );
    this._panes.active('result');
    this.trigger('finish', this);
  },

  _initBinds: function() {
    this._panes.bind('tabEnabled', this.render, this);
  },

  /* Load first the map image and then merge with the overlays rendered frontend side */
  _loadMapImage: function(url, callback) {
    var self = this;
    var mapImage = new Image();
    mapImage.crossOrigin = 'Anonymous';
    mapImage.onload = function() {
      self._mergeAnnotations(mapImage, callback);
    };
    mapImage.src = url;
  },

  _exportImage: function(base64Image) {
    var self = this;
    var vis = this.options.vis;
    // in case a image uploading endpoint is set post the image url there
    // and show the html payload to the user
    $.ajax({
      type: 'POST',
      url: cdb.config.get('static_image_upload_endpoint'),
      data: {
        base64image: base64Image,
        name: vis.get('name'),
        visualization_uuid: vis.get('id'),
        description: vis.get('description')
      },
      success: function(content) {
        self._showResult({ content: content, type: 'html' });
      },
      error: function(error) {
        cdb.editor.ViewFactory.createDialogByTemplate('common/templates/fail', { msg: error.errors })
        .render().appendToBody();
      }
    });
  },

  _mergeAnnotations: function(mapImage, callback) {
    var x = this.options.x;
    var y = this.options.y;
    var width = this.options.width;
    var height = this.options.height;
    var format = this.options.format;

    if (format === 'jpg') {
      format = 'jpeg';
    }

    var imageProxyURL = cdb.config.get('url_prefix') + '/api/v1/image_proxy';

    html2canvas($('.cartodb-map')[0], {
      allowTaint: false, // don't allow non cors images taint the canvas
      taintTest: true,
      // useCORS: true,
      proxy: {
        url: imageProxyURL,
        api_key: this.options.user.get('api_key')
      },
      background: undefined, // for transparent
      // this function is called from html2canvas before the screenshot is taken
      // first parameter is a clone of the current DOM
      onclone: function(clonedDom) {
        var doc = $(clonedDom);
        // remove all the elements but annontations, text and image
        // if other elements are present it's likely you get a tainted canvas because
        // images not loaded with cors enabled
        doc.find('.cartodb-map > div:not(.annotation, .text, .image, .ExportImageView)').remove();
        doc.find('.ExportImageView').addClass('is-exportable');
        // default background color for leaflet is gray, set to transparent so the image
        // can be rendered on top of map image
        doc.find('.cartodb-map').css('background-color', 'transparent');
        return true;
      },
      onrendered: function(overlaysCanvas) {
        var finalCanvas = document.createElement('canvas');
        finalCanvas.width = width;
        finalCanvas.height = height;
        var ctx = finalCanvas.getContext('2d');
        // map image alread has the final image size so render from the top,left
        ctx.drawImage(mapImage, 0, 0);
        // overlay canvas renders the full map size so crop it
        ctx.drawImage(overlaysCanvas, x, y, width, height, 0, 0, width, height);
        callback(finalCanvas.toDataURL('image/' + format));
      }
    });
  },

  ok: function() {
    this.close();
  },

  _onInputClick: function(e) {
    $(e.target).focus().select();
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../view_factory":209,"../../view_helpers/random_quote":212,"../../views/base_dialog/view":213}],192:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);

/**
 * Sync interval
 */
module.exports = cdb.core.View.extend({

  tagName: "li",

  className: "DatasetSelected-syncOptionsItem",

  events: {
    "click": "_onClick"
  },

  initialize: function() {
    this._setupModel();
    this._template = cdb.templates.getTemplate('common/dialogs/sync_dataset/interval_template');
    this._initBinds();
  },

  render: function() {
    this.clearSubViews();
    this.$el.html(this._template(this.model.attributes));
    return this;
  },

  _initBinds: function() {
    this.model.bind('change:checked', this._onToggleChecked, this);
  },

  _setupModel: function() {
    this.model = this.options.model;
  },

  _onClick: function(e) {
    this.killEvent(e);

    if (!this.model.get("disabled")) {
      this.model.set("checked", true);
      this.trigger("checked", this.model, this);
    }
  },

  _onToggleChecked: function() {
    if (this.model.get("checked")) {
      this.$(".js-interval").addClass("is-checked");
      this.$(".js-input").addClass("is-checked");
    } else {
      this.$(".js-interval").removeClass("is-checked");
      this.$(".js-input").removeClass("is-checked");
    }
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],193:[function(require,module,exports){
(function (global){
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var Backbone = (typeof window !== "undefined" ? window['Backbone'] : typeof global !== "undefined" ? global['Backbone'] : null);
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var BaseDialog = require('../../views/base_dialog/view');
var IntervalView = require('./interval_view');
var randomQuote = require('../../view_helpers/random_quote');

/**
 * Sync modal
 */
module.exports = BaseDialog.extend({

  _INTERVALS: [
    { name: 'Every hour', time: 60 * 60, type: 'hourly', if_external_source: false },
    { name: 'Every day', time: 60 * 60 * 24, type: 'daily', if_external_source: false },
    { name: 'Every week', time: 60 * 60 * 24 * 7, type: 'weekly', if_external_source: false },
    { name: 'Every month', time: 60 * 60 * 24 * 30, type: 'monthly', if_external_source: true },
    { name: 'Never', time: 0, type: 'never', if_external_source: true }
  ],

  initialize: function() {
    if (!this.options.table) {
      throw new TypeError('table is required');
    }
    this.elder('initialize');

    this.model = new cdb.core.Model({
      option: 'interval',
      state: 'prefetching',
      wait: true // await ack before changing model
    });
    this.table = this.options.table;

    this._initBinds();

    // Prefetch
    this.table.fetch({
      success: this._onFetchedTable.bind(this),
      error: this._setterForDefaultErrorState()
    });
  },

  _initBinds: function() {
    this.model.bind('change:state', this.render, this);
  },

  // implements cdb.ui.common.Dialog.prototype.render
  render: function() {
    this.clearSubViews();
    BaseDialog.prototype.render.call(this);
    this._initIntervals();
    return this;
  },

  // implements cdb.ui.common.Dialog.prototype.render
  render_content: function() {
    switch (this.model.get('state')) {
      case 'prefetching':
        return this._renderLoading('Checking synchronization');
      case 'error':
        return this.getTemplate('common/templates/fail')({ msg: '' });
      case 'saving':
        return this._renderLoading('Saving…');
      default:
        return this.getTemplate('common/dialogs/sync_dataset/sync_dataset')({
          service: this._serviceName(),
          url: this._serviceURL()
        });
    }
  },

  _onFetchedTable: function() {
    this.model.set({
      state: 'idle',
      interval: this.table.synchronization.get('interval')
    });
  },

  _renderLoading: function(title) {
    return this.getTemplate('common/templates/loading')({
      title: title,
      quote: randomQuote()
    });
  },

  _serviceURL: function() {
    // Does it come from a datasource service (Dropbox, GDrive, ...)?
    if (this.table.synchronization.get('service_name') || this.table.synchronization.get('service_item_id')) {
      return this.table.synchronization.get('service_item_id');
    }
    return this.table.synchronization.get('url');
  },

  _serviceName: function() {
    var name = this.table.synchronization.get('service_name');
    if (name && _.isString(name)) {
      return cdb.Utils.capitalize(name);
    }
  },

  _initIntervals: function() {
    this._intervals = new Backbone.Collection();

    var fromExternalSource = this.table.synchronization.from_external_source;

    _.each(this._INTERVALS, function(interval) {
      var disabled = fromExternalSource && !interval.if_external_source;

      this._intervals.add({
        name: interval.name,
        interval: interval.time,
        checked: this.table.synchronization.get("interval") === interval.time,
        disabled: disabled
      });
    }, this);

    this._intervals.each(function(interval) {
      var view = new IntervalView({ model: interval });
      view.bind("checked", this._onIntervalChecked, this);
      this.$(".js-intervals").append(view.render().$el);
      this.addView(view);
    }, this);
  },

  _onIntervalChecked: function(interval) {
    this._intervals.each(function(i) {
      if (interval.get("interval") !== i.get("interval")) {
        i.set("checked", false);
      }
    }, this);
  },

  _getSelectedInterval: function() {
    return this._intervals.find(function(interval) {
      return interval.get("checked")
    });
  },

  _addTab: function(name, view) {
    this._contentPane.addTab(name, view.render());
    this.addView(view);
  },

  ok: function() {
    var selectedInterval = this._getSelectedInterval();

    if (selectedInterval) {
      this.model.set('state', 'saving');
      var callbacks = {
        success: this.close.bind(this),
        error: this._setterForDefaultErrorState()
      };

      var interval = selectedInterval.get('interval');
      if (interval) {
        this.table.synchronization.save({
          interval: interval
        }, callbacks);
      } else {
        this.table.synchronization.destroy(callbacks);
      }
    } else {
      this.close();
    }
  },

  _setterForDefaultErrorState: function() {
    return this.model.set.bind(this.model, 'state', 'error');
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../view_helpers/random_quote":212,"../../views/base_dialog/view":213,"./interval_view":192}],194:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var EditFieldView = require('../edit_field_view');
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);

/**
 *  Boolean field
 *  
 *  Choosing between true, false or null
 *
 *  new BooleanFieldView({
 *    model: new EditFieldModel({ attribute: 'column', value: 'paco' }),
 *    option: false
 *  })
 */

module.exports = EditFieldView.extend({

  options: {
    template: 'common/edit_fields/boolean_field/boolean_field'
  },

  events: {
    'click .js-true': '_onTrueClick',
    'click .js-false': '_onFalseClick',
    'click .js-null': '_onNullClick'
  },

  _initBinds: function() {
    this.model.bind('change', this.render, this);
  },

  _onTrueClick: function() {
    this.model.set('value', true);
  },

  _onFalseClick: function() {
    this.model.set('value', false);
  },

  _onNullClick: function() {
    this.model.set('value', null);
  }

})

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../edit_field_view":200}],195:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var EditFieldView = require('../edit_field_view');
var DatePickerView = require('./date_picker/date_picker_view');
var TimeInputView = require('./time_input/time_input_view');
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);

/**
 *  Date field
 *  
 *  Place to change a date value
 *
 *  new DateFieldView({
 *    model: new EditFieldModel({ type: 'date', attribute: 'column', value: 'paco' }),
 *    option: false
 *  })
 */

module.exports = EditFieldView.extend({

  className: 'EditField EditField--withBorder EditField--withSeparator',

  options: {
    showTime: true,
    showGMT: false,
    timezone: 'Z' // In PostgreSQL 'Z' is the same as +00:00
  },

  render: function() {
    this.clearSubViews();
    this._initViews();
    return this;
  },

  _initViews: function() {
    // Date picker
    this.datePicker = new DatePickerView({
      model: this.model
    });

    this.datePicker.bind('onDateChange', this._setDate, this);
    this.$el.append(this.datePicker.render().el);
    this.addView(this.datePicker);
     
    // Time input
    if (this.options.showTime) {
      this.timeInput = new TimeInputView({
        model: this.model
      });

      this.$el.append(this.timeInput.render().el);
      this.timeInput.bind('onTimeChange', this._setTime, this);
      this.timeInput.bind('onSubmit', function() {
        this.trigger('onSubmit', this.model, this);
      }, this);
      this.addView(this.timeInput);
    }
  },

  _setTime: function(time) {
    var oldDate = moment(this.model.get('value'));
    var newDate = moment(new Date());
    var date;

    if (oldDate.isValid()) {
      oldDate
        .hour(newDate.hour())
        .minutes(newDate.minutes())
        .seconds(newDate.seconds());
      date = oldDate.format('YYYY-MM-DDT');
    } else {
      date = newDate.format('YYYY-MM-DDT');
    }

    this.model.set('value', date + time + this.options.timezone);
  },

  _setDate: function(date) {
    var oldDate = moment(this.model.get('value'));
    var newDate = moment(date);
    var dateStr;

    if (oldDate.isValid()) {
      oldDate
        .month(newDate.month())
        .date(newDate.date())
        .year(newDate.year());
      dateStr = oldDate.format('YYYY-MM-DDTHH:mm:ss');
    } else {
      dateStr = newDate.format('YYYY-MM-DDTHH:mm:ss');
    }

    this.model.set('value', dateStr + this.options.timezone);
  }

})

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../edit_field_view":200,"./date_picker/date_picker_view":197,"./time_input/time_input_view":198}],196:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);
var moment = (typeof window !== "undefined" ? window['moment'] : typeof global !== "undefined" ? global['moment'] : null);

/**
 * Dropdown for a calendar selector.
 * Uses the DatePicker plugin internally to render the calendar and view behaviour.
 */

module.exports = cdb.admin.DropdownMenu.extend({

  className: 'Dropdown',

  // defaults, used for
  options: {
    flat: true,
    date: '2008-07-01',
    current: '2008-07-31',
    calendars: 1,
    starts: 1
  },

  initialize: function() {
    if (!this.model) throw new Error('model is required');
    this.elder('initialize');
    this.template = cdb.templates.getTemplate('common/edit_fields/date_field/date_picker/calendar_dropdown');
    this._initDefaults();
  },

  render: function() {
    this.$el.html(
      this.template({
        initialDateStr: moment(this.model.get('value')).format('YYYY-MM-DD')
      })
    );

    cdb.god.bind('closeDialogs', this.hide, this);
    $('body').append(this.el);
    this._initCalendar(); // must be called after element is added to body!

    return this;
  },

  clean: function() {
    this._$calendar().DatePickerHide();
    cdb.admin.DropdownMenu.prototype.clean.call(this);
  },

  _initDefaults: function() {
    var utc = new Date().getTimezoneOffset();
    var today = moment(new Date()).utcOffset(utc).format('YYYY-MM-DD');
    this.options.date = this.model.get('value') && moment(this.model.get('value')).format('YYYY-MM-DD') || today;
    this.options.current = this.options.date;
  },

  // should not be called until element is located in document
  _initCalendar: function() {
    var self = this;
    this._$calendar().DatePicker(
      _.extend(this.options, this.model.attributes, {
        onChange: function(formatted, date) {
          self.trigger('onDateSelected', date, this);
          self.hide();
        }
      })
    );
  },

  _$calendar: function() {
    return this.$('.js-calendar');
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],197:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);
var moment = (typeof window !== "undefined" ? window['moment'] : typeof global !== "undefined" ? global['moment'] : null);
var CalendarDropdown = require('./calendar_dropdown_view.js');

/**
 * Date picker for a single date.
 */
module.exports = cdb.admin.DropdownMenu.extend({

  className: 'DatePicker',

  events: {
    'click .js-date-picker': '_onClickDateBtn'
  },

  options: {
    vertical_position: 'down',
    tick: 'center',
    dateFormat: 'YYYY-MM-DD'
  },

  initialize: function() {
    this.elder('initialize');
    this._initBinds();
  },

  render: function() {
    var date = this.model.get('value') || new Date();

    this.$el.html(
      cdb.templates.getTemplate('common/edit_fields/date_field/date_picker/date_picker')({
        readOnly: this.model.get('readOnly'),
        date: moment(date).format(this.options.dateFormat)
      })
    );

    if (this.model.get('readOnly')) {
      this.undelegateEvents();
    }

    return this;
  },

  _initBinds: function() {
    this.model.bind('change', this.render, this);
  },

  _onClickDateBtn: function(ev) {
    this.killEvent(ev);

    // Behave like a toggle
    if (this._calendar) {
      this._destroyCalendarDropdown();
    } else {
      this._calendar = new CalendarDropdown(
        _.extend(this.options, {
          target: $(ev.target).closest('button'),
          model: this.model
        })
      );
      this.addView(this._calendar);
      this._calendar.render();
      this._calendar.on('onDropdownHidden', this._destroyCalendarDropdown, this);
      this._calendar.on('onDateSelected', function(date) {
        this.trigger('onDateChange', date, this);
      }, this);
      this._calendar.open();
    }
  },

  _destroyCalendarDropdown: function() {
    this._calendar.options.target.unbind('click', this._calendar._handleClick);
    this._calendar.clean();
    this._calendar = null;
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./calendar_dropdown_view.js":196}],198:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);


/**
 *  Time input for date field
 *  
 *  Place to change hours, minutes and seconds
 *  for the date field.
 *
 */

module.exports = cdb.core.View.extend({

  className: 'TimeInput',

  events: {
    'keydown .js-input': '_onKeyDown',
    'keyup .js-input': '_onKeyUp'
  },

  initialize: function() {
    this.template = cdb.templates.getTemplate('common/edit_fields/date_field/time_input/time_input');
  },

  render: function() {
    var date = this.model.get('value') || new Date();
    this.$el.html(
      this.template({
        readOnly: this.model.get('readOnly'),
        time: moment(date).format('HH:mm:ss')
      })
    )

    if (this.model.get('readOnly')) {
      this.undelegateEvents();
    }

    return this;
  },

  _onKeyDown: function(ev) {
    if (ev.keyCode === 13) {
      ev.preventDefault();
      this.trigger('onSubmit', this);
      return false;
    }
  },

  _onKeyUp: function(ev) {
    var value = $(ev.target).val();
    this.trigger('onTimeChange', value, this);
  }

})

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],199:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var moment = (typeof window !== "undefined" ? window['moment'] : typeof global !== "undefined" ? global['moment'] : null);

/**
 *  Default model for each field model
 *
 */

module.exports = cdb.core.Model.extend({

  defaults: {
    attribute: '',
    value: '',
    type: 'string',
    readOnly: false
  },

  initialize: function() {
    // Validation control variable
    this.validationError = '';
    this.bind('valid', function() {
      this.validationError = '';
    }, this);
    this.bind('error', function(m, error) {
      this.validationError = error;
    });
  },

  _validate: function(attrs, options) {
    var valid = cdb.core.Model.prototype._validate.apply(this, arguments);
    if (valid) {
      this.trigger('valid')
      return true;
    } else {
      return false;
    }
  },

  validate: function(attrs) {
    if (!attrs) return;

    var val = attrs.value;
    var type = attrs.type;

    if (attrs.type === "number") {
      var pattern = /^(\+|-)?(?:[0-9]+|[0-9]*\.[0-9]+)$/;
      if (val && !pattern.test(val)) {
        return "Invalid number"
      }  
    }

    if (type === "boolean") {
      if (val !== null && val !== true && val !== false) {
        return "Invalid boolean"
      }
    }

    if (type === "date") {
      if (val && !moment(val).isValid()) {
        return "Invalid date"
      }
    }
  },

  getError: function() {
    return this.validationError;
  },

  isValid: function() {
    if (!this.validate) {
      return true;
    }
    return !this.validate(this.attributes) && this.validationError === "";
  }

})

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],200:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);

/**
 *  Common edit field view
 *  
 */


module.exports = cdb.core.View.extend({

  className: 'EditField',

  options: {
    template: 'common/edit_fields/edit_field',
  },

  initialize: function() {
    if (!this.model) {
      this.model = new cdb.core.Model({ value: '' });
    }
    if (this.options.template) {
      this.template = cdb.templates.getTemplate(this.options.template);  
    }
    this._initBinds();
  },

  render: function() {
    this.$el.html(
      this.template(
        _.extend(
          this.options,
          {
            type: this.model.get('type'),
            value: this.model.get('value'),
            attribute: this.model.get('attribute'),
            readOnly: this.model.get('readOnly')    
          }
        )
      )
    );

    if (this.model.get('readOnly')) {
      this.undelegateEvents();
    }

    return this;
  },

  _initBinds: function() {
    this.model.bind('error valid', this._setFieldStyle, this);
    this.model.bind('change:readOnly', this.render, this);
  },

  _setFieldStyle: function() {
    this.$el[ this.model.getError() ? 'addClass' : 'removeClass']('is-invalid');
  },

  _hasSubmit: function(ev) {
    if (!ev) {
      throw new Error('event needed to check if user has submitted from the input');
    }

    var ua = navigator.userAgent.toLowerCase();
    var isMac = /mac os/.test(ua);

    return ( (isMac && ev.metaKey) || (!isMac && ev.ctrlKey) ) && ev.keyCode === 13;
  },

  isValid: function() {
    return this.model.isValid();
  }

});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],201:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var EditFieldView = require('../edit_field_view');
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);

/**
 *  Number field
 *  
 *  Place to add/edit number editions
 *  - It accepts a number model with {attribute: 'colum', value: 'hello'}.
 *
 *  new NumberFieldView({
 *    model: new NumberFieldModel({ attribute: 'column', value: 'paco' }),
 *    option: false
 *  })
 */

module.exports = EditFieldView.extend({

  options: {
    template: 'common/edit_fields/number_field/number_field'
  },

  events: {
    'keydown .js-input': '_onKeyDown',
    'keyup .js-input': '_onKeyUp'
  },

  _hasSubmit: function(ev) {
    if (!ev) {
      throw new Error('event needed to check if user has submitted from the input');
    }
    return ev.keyCode === 13
  },

  _onKeyDown: function(ev) {
    if (this._hasSubmit(ev) && this.model.isValid()) {
      ev.preventDefault();
      this.trigger('onSubmit', this.model, this);
      return false;
    }
  },

  _onKeyUp: function(ev) {
    if (this._hasSubmit(ev) && this.model.isValid()) {
      ev.preventDefault();
      return false;
    }

    var value = $(ev.target).val();
    // Null values are valid for number type
    if (value === "") {
      value = null;
    }
    this.model.set('value', value);
  }

})

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../edit_field_view":200}],202:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var EditFieldView = require('../edit_field_view');
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);

/**
 *  String field
 *  
 *  Place to edit and capture string editions
 *  - It accepts a default model with {attribute: 'colum', value: 'hello'}.
 *
 *  new StringFieldView({
 *    model: new EditFieldModel({ attribute: 'column', value: 'paco' }),
 *    option: false
 *  })
 */

module.exports = EditFieldView.extend({

  options: {
    template: 'common/edit_fields/string_field/string_field',
    autoResize: true
  },

  events: {
    'keydown .js-textarea': '_onKeyDown',
    'keyup .js-textarea':  '_onKeyUp'
  },

  render: function() {
    this.elder('render');

    // Hack to resize correctly the textarea
    if (this.options.autoResize) {
      this._resize();
    }

    return this;
  },

  _onKeyDown: function(ev) {
    if (this._hasSubmit(ev)) {
      ev.preventDefault();
      this.trigger('onSubmit', this.model, this);
      return false;
    }
  },

  _onKeyUp: function(ev) {
    ev.preventDefault();
    var value = $(ev.target).val();
    this.model.set('value', value);

    if (this.options.autoResize) {
      this._resize();
    }
  },

  // Hack function to resize automatially textarea
  _resize: function() {
    var $textarea = this.$(".js-textarea");

    // Hello hacky boy
    if ($textarea) {
      setTimeout(function() {
        $textarea.height(20);
        $textarea.height($textarea[0].scrollHeight - 22);
      });
    }
  }

})

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../edit_field_view":200}],203:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
cdb.admin = (typeof window !== "undefined" ? window['cdb']['admin'] : typeof global !== "undefined" ? global['cdb']['admin'] : null);
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);

/** 
 *  Old form spinner
 *
 */

module.exports = cdb.core.View.extend({
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
    'change .value': '_checkValueChange'
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
  }

});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],204:[function(require,module,exports){
var BaseDialog = require('../views/base_dialog/view');

/**
 *  Dialog for drop actions using mamufas
 *
 */


module.exports = BaseDialog.extend({

  className: 'Dialog is-opening MamufasDialog',

  overrideDefaults: {
    template_name: 'common/views/base_dialog/template',
    triggerDialogEvents: false
  },

  initialize: function() {
    BaseDialog.prototype.initialize.apply(this, arguments);
    this.template = cdb.templates.getTemplate('common/mamufas_import/mamufas_import_dialog');
  },

  render_content: function() {
    return this.template();
  },

  render: function() {
    this.elder('render');
    this.$('.Dialog-content').addClass('Dialog-content--expanded');
    return this;
  },

  hide: function() {
    BaseDialog.prototype.hide.apply(this, arguments);
    this.trigger('hide');
    this._setBodyForDialogMode('remove')
  }

});

},{"../views/base_dialog/view":213}],205:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var MamufasDialog = require('./mamufas_import_dialog_view');

/**
 *  Big mamufas to import files
 *  using drag and drop
 *
 */

module.exports = cdb.core.View.extend({

  initialize: function() {
    this.user = this.options.user;
    this.model = new cdb.core.Model({ visible: false });
  },

  render: function() {
    return this;
  },

  _createDragster: function() {
    if (this.dragster) {
      this._destroyDragster();
    }
    this.dragster = new Dragster(this.$el[0]);
  },

  _createDropzone: function() {
    if (this.dropzone) {
      this._destroyDropzone();
    }
    this.dropzone = new Dropzone(this.$el[0], {
      url: ':)',
      autoProcessQueue: false,
      previewsContainer: false
    });
  },

  _destroyDragster: function() {
    if (this.dragster) {
      this.dragster.removeListeners();
      this.dragster.reset();
      delete this.dragster;
    }
  },

  _destroyDropzone: function() {
    if (this.dropzone) {
      this.dropzone.destroy();
      delete this.dropzone;
    }
  },

  _initBinds: function() {
    var self = this;
    var mamufas = new MamufasDialog({ clean_on_hide: true });

    this.$el.on( "dragster:enter", function (e) {
      mamufas.appendToBody();
    });

    this.$el.on( "dragster:leave", function (e) {
      mamufas.hide();
    });

    this.dropzone.on("drop", function (ev) {
      self.dragster.dragleave(ev);
      mamufas.hide();
      self.dropzone.removeFile(ev);

      var files = ev.dataTransfer.files;
      if (files && files.length > 0) {
        if (files.length === 1) { files = files[0] }
        cdb.god.trigger('fileDropped', files, this);
      }
    });
  },

  _removeBinds: function() {
    this.$el.off("dragster:enter");
    this.$el.off("dragster:leave");
  },

  enable: function() {
    if (!this.model.get('visible')) {
      this._createDragster();
      this._createDropzone();
      this._initBinds();
      this.model.set('visible', true);
    }
  },

  disable: function() {
    if (this.model.get('visible')) {
      this._removeBinds();
      this._destroyDragster();
      this._destroyDropzone();
      this.model.set('visible', false);
    }
  },

  clean: function() {
    this._removeBinds();
    this.elder('clean');
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./mamufas_import_dialog_view":204}],206:[function(require,module,exports){
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

},{}],207:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);

/**
 *  Get oauth url from the service requested
 *
 *  - It needs a datasource name or it won't work.
 *
 *  new cdb.admin.Service({ datasource_name: 'dropbox' })
 */

module.exports = cdb.core.Model.extend({

  _DATASOURCE_NAME: 'dropbox',

  initialize: function(attrs, opts) {
    if (opts.datasource_name) {
      this._DATASOURCE_NAME = opts.datasource_name;
    }
  },

  url: function(method) {
    var version = cdb.config.urlVersion('imports_service', method);
    return '/api/' + version + '/imports/service/' + this._DATASOURCE_NAME + '/auth_url'
  },

  parse: function(r) {
    return r
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],208:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);

/**
 *  Model to check if oAuth token is valid or not
 *
 *  - It needs a datasource name or it won't work.
 *
 *  new ServiceToken({ datasource_name: 'dropbox' })
 */

module.exports = cdb.core.Model.extend({

  _DATASOURCE_NAME: 'dropbox',

  initialize: function(attrs, opts) {
    if (opts.datasource_name) {
      this._DATASOURCE_NAME = opts.datasource_name;
    }
  },

  url: function(method) {
    var version = cdb.config.urlVersion('imports_service', method);
    return '/api/' + version + '/imports/service/' + this._DATASOURCE_NAME + '/token_valid'
  },

  parse: function(r) {
    return r
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],209:[function(require,module,exports){
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

},{"./views/base_dialog/view":213}],210:[function(require,module,exports){
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

},{}],211:[function(require,module,exports){
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

},{}],212:[function(require,module,exports){
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

},{}],213:[function(require,module,exports){
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

},{}],214:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
cdb.admin = (typeof window !== "undefined" ? window['cdb']['admin'] : typeof global !== "undefined" ? global['cdb']['admin'] : null);
var moment = (typeof window !== "undefined" ? window['moment'] : typeof global !== "undefined" ? global['moment'] : null);
var Spinner = require('../../forms/spinner');

/**
 * Custom picer for a dates range.
 */
module.exports = cdb.core.View.extend({

  _MAX_RANGE: 30,

  className: 'DatePicker',

  options: {
    flat: true,
    date: ['2008-07-31', '2008-07-31'],
    current: '2008-07-31',
    calendars: 2,
    mode: 'range',
    starts: 1
  },

  events: {
    'click .js-dates': '_toggleCalendar',
    'click .js-fourHours': '_setLastFourHours',
    'click .js-oneDay': '_setLastDay',
    'click .js-oneWeek': '_setLastWeek'
  },

  initialize: function() {
    // Generate model
    this.model = new cdb.core.Model({
      fromDate: '',
      fromHour: 0,
      fromMin:  0,
      toDate: '',
      toHour: 23,
      toMin:  59,
      user_timezone: 0 // Explained as GMT+0
    });

    this.template = this.options.template || cdb.templates.getTemplate('common/views/date_pickers/dates_range');

    // Init binds
    this._initBinds();

    // Set default dates
    this._setToday();
  },

  render: function() {
    var self = this;

    this.clearSubViews();

    this.$el.append(
      this.template(
        _.extend(
          this.model.attributes,
          { max_days: this._MAX_RANGE }
        )
      )
    );

    setTimeout(function() {
      self._initCalendar();
      self._hideCalendar();
      self._initTimers();
    }, 100);

    return this;
  },

  _initBinds: function() {
    _.bindAll(this, '_onDatesChange', '_onDocumentClick');

    this.model.bind('change', this._setValues,      this);
    this.model.bind('change', this._onValuesChange, this);

    // Outside click
    $(document).bind('click', this._onDocumentClick);
  },

  _destroyBinds: function() {
    $(document).unbind('click', this._onDocumentClick);
  },

  _setValues: function(m, c) {
    var text = 'Choose your dates';
    var data = this.model.attributes;

    if (data.fromDate && data.toDate) {
      text =
        'From ' +
        '<strong>' +
        this.model.get('fromDate') + ' ' +
        (cdb.Utils.pad(this.model.get('fromHour'),2) + ':' + cdb.Utils.pad(this.model.get('fromMin'),2)) +
        '</strong>' +
        ' to ' +
        '<strong>' +
        this.model.get('toDate') + ' ' +
        (cdb.Utils.pad(this.model.get('toHour'),2) + ':' + cdb.Utils.pad(this.model.get('toMin'),2)) +
        '</strong>' +
        '<i class="CDB-IconFont CDB-IconFont-calendar DatePicker-datesIcon"></i>';
    }

    this.$('.DatePicker-dates').html(text);
  },

  _setToday: function() {
    var datesUTC = this.model.get('user_timezone');
    var today = moment().utc(datesUTC);
    var previous = moment().utc(datesUTC).subtract((this._MAX_RANGE - 1), 'days');
    this.options.date = [previous.format("YYYY-MM-DD"), today.format("YYYY-MM-DD")];
    this.options.current = today.format("YYYY-MM-DD");
    this._setModelFromPrevious(previous);
  },

  _initCalendar: function() {
    var selector = '.DatePicker-calendar';

    // Can't initialize calendar if not already present in document... avoid errors being thrown
    if (!document.body.contains(this.$(selector)[0])) return;

    this.calendar = this.$(selector).DatePicker(
      _.extend(this.options, {
        onChange: this._onDatesChange,
        onRender: function(d) { // Disable future dates and dates < 30 days ago

          var date = d.valueOf();
          var now = new Date();

          var thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(now.getDate() - 30);

          return (date < thirtyDaysAgo) || (date > now) ? { disabled: true } : ''

        }
      })
    );
  },

  _onDatesChange: function(formatted, dates) {

    // Check if selected dates have more than 30 days
    var start = moment(formatted[0]);
    var end = moment(formatted[1]);

    if (Math.abs(start.diff(end, 'days')) > this._MAX_RANGE) {
      formatted[1] = moment(formatted[0]).add('days', this._MAX_RANGE).format("YYYY-MM-DD");
      this.$('.DatePicker-calendar').DatePickerSetDate([formatted[0], formatted[1]]);
    }

    this.model.set({
      fromDate: formatted[0],
      toDate:   formatted[1]
    })
  },

  _hideCalendar: function(e) {
    if (e) this.killEvent(e);
    this.$('.DatePicker-dropdown').hide();
  },

  _toggleCalendar: function(ev) {
    if (ev) this.killEvent(ev);
    this.$('.DatePicker-dropdown').toggle();
  },

  _setLastFourHours: function() {
    var previous = moment().utc(0).subtract(4, 'hours');
    this._setModelFromPrevious(previous);
    this._setDatepickerFromPrevious(previous);
    this.closeCalendar();
  },

  _setLastDay: function() {
    var previous = moment().utc(0).subtract(1, 'day');
    this._setModelFromPrevious(previous);
    this._setDatepickerFromPrevious(previous);
    this.closeCalendar();
  },

  _setLastWeek: function() {
    var previous = moment().utc(0).subtract(1, 'week');
    this._setModelFromPrevious(previous);
    this._setDatepickerFromPrevious(previous);
    this.closeCalendar();
  },

  _setModelFromPrevious: function(previous) {
    var today = moment().utc(0);

    this.model.set({
      fromDate: previous.format('YYYY-MM-DD'),
      fromHour: parseInt(previous.format('H')),
      fromMin:  parseInt(previous.format('m')),
      toDate: today.format('YYYY-MM-DD'),
      toHour: parseInt(today.format('H')),
      toMin:  parseInt(today.format('m'))
    });
  },

  _setDatepickerFromPrevious: function(previous) {
    var today = moment().utc(0);    
    this.$('.DatePicker-calendar').DatePickerSetDate([ previous.format('YYYY-MM-DD') , today.format('YYYY-MM-DD') ]);
  },

  _initTimers: function() {
    // 'From' div
    var $from = this.$('.DatePicker-timersFrom');

    // From hour
    var fromHour = new Spinner({
      model:    this.model,
      property: 'fromHour',
      min:      0,
      max:      23,
      inc:      1,
      width:    15,
      pattern:  /^([12]?\d{0,1}|3[01]{0,2})$/,
      debounce_time: 0
    });

    $from.find('.DatePicker-timersHour').append(fromHour.render().el);
    this.addView(fromHour);

    // From min
    var fromMin = new Spinner({
      model:    this.model,
      property: 'fromMin',
      min:      0,
      max:      59,
      inc:      1,
      width:    15,
      pattern:  /^([12345]?\d{0,1})$/,
      debounce_time: 0
    });

    $from.find('.DatePicker-timersMin').append(fromMin.render().el);
    this.addView(fromMin);


    // 'To' div
    var $to = this.$('.DatePicker-timersTo');

    // To hour
    var toHour = new Spinner({
      model:    this.model,
      property: 'toHour',
      min:      0,
      max:      23,
      inc:      1,
      width:    15,
      pattern:  /^([12]?\d{0,1}|3[01]{0,2})$/,
      debounce_time: 0
    });

    $to.find('.DatePicker-timersHour').append(toHour.render().el);
    this.addView(toHour);

    // To min
    var toMin = new Spinner({
      model:    this.model,
      property: 'toMin',
      min:      0,
      max:      59,
      inc:      1,
      width:    15,
      pattern:  /^([12345]?\d{0,1})$/,
      debounce_time: 0
    });

    $to.find('.DatePicker-timersMin').append(toMin.render().el);
    this.addView(toMin);
  },

  _onValuesChange: function() {
    this.trigger('changeDate', this.model.toJSON(), this);
  },

  getDates: function() {
    return this.model.toJSON();
  },

  closeCalendar: function() {
    this.$('.DatePicker-dropdown').hide();
  },

  _onDocumentClick: function(e) {
    var $el = $(e.target);

    if ($el.closest('.DatePicker').length === 0) {
      this.closeCalendar();
    }
  },

  clean: function() {
    this._destroyBinds();
    this.closeCalendar();
    this.$('.DatePicker-calendar').DatePickerHide();
    cdb.core.View.prototype.clean.call(this);
  }

})

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../forms/spinner":203}],215:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);

/**
 * Error details view, to be used together with an error object from an import model.
 *
 */

module.exports = cdb.core.View.extend({

  _TEMPLATES: {
    8001: 'common/views/size_error_details_upgrade_template',
    8005: 'common/views/layers_error_details_upgrade_template',
    default: 'common/views/error_details'
  },

  initialize: function() {
    this.user = this.options.user;
    this.err = this.options.err;
  },

  render: function() {
    // Preventing problems checking if the error_code is a number or a string
    // we make the comparision with only double =.
    var errorCode = this.err.error_code && parseInt(this.err.error_code);
    var upgradeUrl = cdb.config.get('upgrade_url');
    var userCanUpgrade = upgradeUrl && !cdb.config.get('cartodb_com_hosted') && (!this.user.isInsideOrg() || this.user.isOrgOwner());
    var templatePath = this._TEMPLATES['default'];
    var originalUrl = this.err.original_url;
    var httpResponseCode = this.err.http_response_code;
    var httpResponseCodeMessage = this.err.http_response_code_message;

    if (userCanUpgrade && this._TEMPLATES[errorCode]) {
      templatePath = this._TEMPLATES[errorCode];
    }

    var template = cdb.templates.getTemplate(templatePath);

    this.$el.html(
      template({
        errorCode: errorCode,
        title: this.err.title,
        text: this.err.what_about,
        itemQueueId: this.err.item_queue_id,
        originalUrl: originalUrl,
        httpResponseCode: httpResponseCode,
        httpResponseCodeMessage: httpResponseCodeMessage,
        userCanUpgrade: userCanUpgrade,
        showTrial: this.user.canStartTrial(),
        upgradeUrl: upgradeUrl
      })
    );

    return this;
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],216:[function(require,module,exports){
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

},{}],217:[function(require,module,exports){
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

},{}],218:[function(require,module,exports){
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

},{"../../view_factory":209,"../../view_helpers/random_quote":212,"../pagination/model":219,"../pagination/view":220}],219:[function(require,module,exports){
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

},{}],220:[function(require,module,exports){
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

},{"../../view_helpers/navigate_through_router":210}],221:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);

/**
 * Error details view, to be used together with an error object from an import model.
 *
 */

module.exports = cdb.core.View.extend({
  _TEMPLATES: {
    'partial_import': 'common/views/partial_import_details',
    'too_many_files': 'common/views/too_many_files_details',
    'too_many_rows_connection': 'common/views/too_many_rows_connection_details'
  },

  initialize: function() {
    this.warnings = this.options.warnings;
  },

  render: function() {
    var warnings = this.warnings;

    var template_file_key = this._getTemplateKey(warnings);
    var template = cdb.templates.getTemplate(this._TEMPLATES[template_file_key]);

    this.$el.html(
      template({
        warnings: warnings
      })
    );

    return this;
  },

  _getTemplateKey: function(warnings) {
    // We have warnings precedence between max layers an max tables per import.
    // For example, one import could reach the limit of layers an tables at the
    // same time.
    if (warnings.user_max_layers && warnings.max_tables_per_import) {
      return (warnings.user_max_layers < warnings.max_tables_per_import) ? 'partial_import' : 'too_many_files'
    } else if (warnings.user_max_layers) {
      return 'partial_import';
    } else if (warnings.max_tables_per_import) {
      return 'too_many_files';
    } else if (warnings.max_rows_per_connection) {
      return 'too_many_rows_connection';
    }
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],222:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);

/**
 * Model that encapsulates params for fetching data in a cdb.admin.Visualizations collection.
 */
module.exports = cdb.core.Model.extend({

  defaults: {
    content_type:   '',
    page:           1,
    q:              '',
    tag:            '',
    category:       '',
    shared:         'no',
    locked:         false,
    liked:          false,
    library:        false,
    order:          'updated_at',
    deepInsights:   false
  },

  isSearching: function() {
    return this.get('q') || this.get('tag');
  },

  isDatasets: function() {
    return this.get('content_type') === 'datasets';
  },

  isMaps: function() {
    return this.get('content_type') === 'maps';
  },

  isDeepInsights: function() {
    return this.isMaps() && this.get('deepInsights');
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],223:[function(require,module,exports){
(function (global){
// Not a unique entry file, but dependencies required for old table.js bundle, to retrofit newer browserify files to be
// usable in a non-browserified bundle
//
// Expected to be loaded after cdb.js but before table.js
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
cdb.editor = {
  CreateVisFirstView: require('./common/dialogs/create_vis_first/create_vis_first_view'),
  ImportsCollection: require('./common/background_polling/models/imports_collection'),
  GeocodingModel: require('./common/background_polling/models/geocoding_model'),
  LonLatGeocodingModel: require('./common/background_polling/models/lon_lat_geocoding_model'),
  BackgroundPollingModel: require('./editor/background_polling_model'),
  ImagePickerView: require('./common/dialogs/map/image_picker_view'),
  BackgroundPollingView: require('./common/background_polling/background_polling_view'),
  AddLayerView: require('./common/dialogs/map/add_layer_view'),
  SyncView: require('./common/dialogs/sync_dataset/sync_dataset_view'),
  ScratchView: require('./common/dialogs/map/scratch_view'),
  AddLayerModel: require('./common/dialogs/map/add_layer_model'),
  FeatureDataView: require('./common/dialogs/feature_data/feature_data_dialog_view'),

  ChangePrivacyView: require('./common/dialogs/change_privacy/change_privacy_view'),
  EditVisMetadataView: require('./common/dialogs/edit_vis_metadata/edit_vis_metadata_dialog_view'),

  DeleteItemsView: require('./common/dialogs/delete_items_view'),
  DeleteItemsViewModel: require('./common/dialogs/delete_items_view_model'),
  DeleteLayerView: require('./common/dialogs/delete_layer/delete_layer_view'),
  DeleteColumnView: require('./common/dialogs/delete_column/delete_column_view'),
  DeleteRowView: require('./common/dialogs/delete_row/delete_row_view'),

  ExportImageResultView: require('./common/dialogs/static_image/export_image_result_view'),

  AdvancedExportView: require('./common/dialogs/static_image/advanced_export_view'),

  PublishView: require('./common/dialogs/publish/publish_view'),

  ChangeLockViewModel: require('./common/dialogs/change_lock/change_lock_view_model'),
  ChangeLockView: require('./common/dialogs/change_lock/change_lock_view'),

  BuilderFeaturesWarningDialog: require('./common/dialogs/builder_features_warning/builder_features_warning_view'),

  PecanView: require('./common/dialogs/pecan/pecan_view'),

  DuplicateVisView: require('./common/dialogs/duplicate_vis_view'),
  DuplicateDatasetView: require('./common/dialogs/duplicate_dataset_view'),

  ExportView: require('./common/dialogs/export/export_view'),

  MergeDatasetsView: require('./common/dialogs/merge_datasets/merge_datasets_view'),
  GeoreferenceView: require('./common/dialogs/georeference/georeference_view'),

  LimitsReachView: require('./common/dialogs/limits_reach/limits_reached_view'),

  MamufasImportView: require('./common/mamufas_import/mamufas_import_view'),

  AddCustomBasemapView: require('./common/dialogs/add_custom_basemap/add_custom_basemap_view'),
  ViewFactory: require('./common/view_factory'),
  randomQuote: require('./common/view_helpers/random_quote.js'),

  ExportMapView: require('./common/dialogs/export_map/export_map_view')
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./common/background_polling/background_polling_view":2,"./common/background_polling/models/geocoding_model":4,"./common/background_polling/models/imports_collection":9,"./common/background_polling/models/lon_lat_geocoding_model":11,"./common/dialogs/add_custom_basemap/add_custom_basemap_view":26,"./common/dialogs/builder_features_warning/builder_features_warning_view":43,"./common/dialogs/change_lock/change_lock_view":44,"./common/dialogs/change_lock/change_lock_view_model":45,"./common/dialogs/change_privacy/change_privacy_view":46,"./common/dialogs/create_vis_first/create_vis_first_view":93,"./common/dialogs/delete_column/delete_column_view":94,"./common/dialogs/delete_items_view":95,"./common/dialogs/delete_items_view_model":96,"./common/dialogs/delete_layer/delete_layer_view":97,"./common/dialogs/delete_row/delete_row_view":98,"./common/dialogs/duplicate_dataset_view":99,"./common/dialogs/duplicate_vis_view":100,"./common/dialogs/edit_vis_metadata/edit_vis_metadata_dialog_view":103,"./common/dialogs/export/export_view":104,"./common/dialogs/export_map/export_map_view":105,"./common/dialogs/feature_data/feature_data_dialog_view":107,"./common/dialogs/georeference/georeference_view":118,"./common/dialogs/limits_reach/limits_reached_view":135,"./common/dialogs/map/add_layer_model":139,"./common/dialogs/map/add_layer_view":140,"./common/dialogs/map/image_picker_view":155,"./common/dialogs/map/scratch_view":156,"./common/dialogs/merge_datasets/merge_datasets_view":168,"./common/dialogs/pecan/pecan_view":186,"./common/dialogs/publish/publish_view":189,"./common/dialogs/static_image/advanced_export_view":190,"./common/dialogs/static_image/export_image_result_view":191,"./common/dialogs/sync_dataset/sync_dataset_view":193,"./common/mamufas_import/mamufas_import_view":205,"./common/view_factory":209,"./common/view_helpers/random_quote.js":212,"./editor/background_polling_model":224}],224:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var ImportsCollection = require('../common/background_polling/models/imports_collection');
var GeocodingsCollection = require('../common/background_polling/models/geocodings_collection');
var BackgroundPollingModel = require('../common/background_polling/background_polling_model');


/**
 *  Background importer model for the editor context.
 *
 */

module.exports = BackgroundPollingModel.extend({

  addImportItem: function(mdl) {
    if (!mdl) {
      return false;
    }

    if (!this.user.canAddLayerTo(this.vis.map)) {
      mdl.setError({
        error_code: 8005,
        get_error_text: {
          title: "Max layers per map reached",
          what_about: "You can't add more layers to your map. Please upgrade your account."
        }
      });
    }

    this.importsCollection.add(mdl);
  },

  _onImportsStateChange: function(importsModel) {
    if (importsModel.hasCompleted()) {
      this.trigger('importCompleted', importsModel, this);
      var self = this;
      this.vis.map.addCartodbLayerFromTable(importsModel.imp.get('table_name'), this.user.get('username'), {
        vis: this.vis,
        success: function() {
          // layers need to be saved because the order may changed
          self.vis.map.layers.saveLayers();
          // Don't remove import item if it is Twitter type
          var serviceName = importsModel.get('upload').service_name;
          var twitterImport = serviceName && serviceName === "twitter_search";
          if (!twitterImport) {
            self.importsCollection.remove(importsModel);
          }
        },
        error: function() {
          self.trigger('importLayerFail', 'Failed to add the connected dataset as a layer to this map');
          self.importsCollection.remove(importsModel);
        }
      });
    }
  },

  _onGeocodingsStateChange: function(geocodingModel) {
    if (geocodingModel.hasCompleted()) {
      this.trigger('geocodingCompleted', geocodingModel, this);
    }
    if (geocodingModel.hasFailed()) {
      this.trigger('geocodingFailed', geocodingModel, this);
    }
  },

  _onAnalysisStateChange: function(mdl, collection) {}

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../common/background_polling/background_polling_model":1,"../common/background_polling/models/geocodings_collection":6,"../common/background_polling/models/imports_collection":9}],225:[function(require,module,exports){
var geoAttr = require('./cartocss/get-geo-attr');
var getDefaultCSSForGeometryType = require('./cartocss/get-default-css-for-geometry-type');
var ramps = require('./cartocss/color-ramps');

module.exports = {
  choropleth: function(quartiles, tableName, prop, geometryType, ramp) {
    var attr = geoAttr(geometryType);
    var tableID = '#' + tableName;

    var defaultCSS = getDefaultCSSForGeometryType(geometryType);
    var css = "/** choropleth visualization */\n\n" + tableID + " {\n  " + attr + ": " + ramp[0] + ";\n" + defaultCSS.join("\n") + "\n}\n";

    for (var i = quartiles.length - 1; i >= 0; --i) {
      if (quartiles[i] !== undefined && quartiles[i] != null) {
        css += "\n" + tableID + "[" + prop + " <= " + quartiles[i] + "] {\n";
        css += '  ' + attr  + ':' + ramp[i] + ";\n}"
      }
    }
    return css;
  },

  categoryMetadata: function(cats, options) {
    var metadata = [];

    var ramp = (options && options.ramp) ? options.ramp : ramps.category;
    var type = options && options.type ? options.type : 'string';

    for (var i = 0; i < cats.length; i++) {
      var cat = cats[i];
      if (i < 10 && cat !== undefined && ((type === 'string' && cat != null) || (type !== 'string'))) {
        metadata.push({
          title: cat,
          title_type: type,
          value_type: 'color',
          color: ramp[i]
        });
      }
    }

    if (cats.length > 10) {
      metadata.push({
        title: 'Others',
        value_type: 'color',
        default: true,
        color: ramp[ramp.length - 1]
      });
    }

    return metadata;
  },

  category: function(cats, tableName, prop, geometryType, options) {
    var attr = geoAttr(geometryType);
    var tableID = '#' + tableName;
    var ramp = ramps.category;
    var name, value;

    var type = options && options.type ? options.type : 'string';
    var ramp = (options && options.ramp) ? options.ramp : ramps.category;

    var defaultCSS = getDefaultCSSForGeometryType(geometryType);

    var css = "/** category visualization */\n\n" + tableID + " {\n  " + attr + ": " + ramp[0] + ";\n" + defaultCSS.join("\n") + "\n}\n";

    for (var i = 0; i < cats.length; i++) {

      var cat = cats[i];

      if (type === 'string') {
        name = cat.replace(/\n/g,'\\n').replace(/\"/g, "\\\"");
        value = "\"" + name + "\"";
      } else {
        value = cat;
      }

      if (i < 10 && cat !== undefined && ((type === 'string' && cat != null) || (type !== 'string'))) {
        css += "\n" + tableID + '[' + prop + '=' + value + "] {\n";
        css += '  ' + attr  + ':' + ramp[i] + ";\n}"
      }
    }

    if (cats.length > 10) {
      css += "\n" + tableID + "{\n";
      css += '  ' + attr  + ': ' + ramp[ramp.length - 1]+ ";\n}"
    }

    return css;
  },

  torque: function(stats, tableName, options){
    var tableID = '#' + tableName;
    var aggFunction = 'count(cartodb_id)';
    var css = [
        '/** torque visualization */',
        'Map {',
        '  -torque-time-attribute: ' + stats.column + ';',
        '  -torque-aggregation-function: "count(cartodb_id)";',
        '  -torque-frame-count: ' + stats.steps + ';',
        '  -torque-animation-duration: 10;',
        '  -torque-resolution: 2;',
        '}',
        tableID + ' {',
        '  marker-width: 3;',
        '  marker-fill-opacity: 0.8;',
        '  marker-fill: #0F3B82; ',
        '  comp-op: "lighten"; ',
        '  [frame-offset = 1] { marker-width: 10; marker-fill-opacity: 0.05;}',
        '  [frame-offset = 2] { marker-width: 15; marker-fill-opacity: 0.02;}',
        '}'
    ];
    css = css.join("\n");

    return css;

  },

  bubble: function(quartiles, tableName, prop) {
    var tableID = '#' + tableName;
    var css = "/** bubble visualization */\n\n" + tableID + " {\n";
    css += getDefaultCSSForGeometryType('point').join("\n");
    css += "\nmarker-fill: #FF5C00;";
    css += "\n}\n\n";

    var min = 10;
    var max = 30;

    var values = [];

    var NPOINS = 10;
    for(var i = 0; i < NPOINS; ++i) {
      var t = i/(NPOINS-1);
      values.push(min + t*(max - min));
    }

    // generate carto
    for(var i = NPOINS - 1; i >= 0; --i) {
      if(quartiles[i] !== undefined && quartiles[i] != null) {
        css += "\n#" + tableName + ' [ ' + prop + ' <= ' + quartiles[i] + "] {\n"
        css += '   marker-width: ' + values[i].toFixed(1) + ";\n}"
      }
    }
    return css;
  },

  heatmap: function(stats, tableName, options){
    var tableID = '#' + tableName;
    var css = [
        '/** heatmap visualization */',
        'Map {',
        '  -torque-time-attribute: "cartodb_id";',
        '  -torque-aggregation-function: "count(cartodb_id)";',
        '  -torque-frame-count: 1;',
        '  -torque-animation-duration: 10;',
        '  -torque-resolution: 2;',
        '}',
        tableID + ' {',
        '  marker-width: 10;',
        '  marker-fill-opacity: 0.4;',
        '  marker-fill: #0F3B82; ',
        '  comp-op: "lighten"; ',
        '  image-filters: colorize-alpha(blue, cyan, lightgreen, yellow , orange, red);',
        '  marker-file: url(http://s3.amazonaws.com/com.cartodb.assets.static/alphamarker.png);',
        '}'
    ];
    css = css.join("\n");
    return css;
  }
};

},{"./cartocss/color-ramps":226,"./cartocss/get-default-css-for-geometry-type":227,"./cartocss/get-geo-attr":228}],226:[function(require,module,exports){
module.exports = {
  bool: ['#229A00', '#F84F40', '#DDDDDD'],
  green:  ['#EDF8FB', '#D7FAF4', '#CCECE6', '#66C2A4', '#41AE76', '#238B45', '#005824'],
  blue:  ['#FFFFCC', '#C7E9B4', '#7FCDBB', '#41B6C4', '#1D91C0', '#225EA8', '#0C2C84'],
  pink: ['#F1EEF6', '#D4B9DA', '#C994C7', '#DF65B0', '#E7298A', '#CE1256', '#91003F'],
  black:  ['#F7F7F7', '#D9D9D9', '#BDBDBD', '#969696', '#737373', '#525252', '#252525'],
  red:  ['#FFFFB2', '#FED976', '#FEB24C', '#FD8D3C', '#FC4E2A', '#E31A1C', '#B10026'],
  category: ['#A6CEE3', '#1F78B4', '#B2DF8A', '#33A02C', '#FB9A99', '#E31A1C', '#FDBF6F', '#FF7F00', '#CAB2D6', '#6A3D9A', '#DDDDDD'],
  divergent: ['#0080FF', '#40A0FF', '#7FBFFF', '#FFF2CC', '#FFA6A6', '#FF7A7A', '#FF4D4D']
};

},{}],227:[function(require,module,exports){
module.exports = function(geometryType) {
  if (geometryType === 'polygon') {
    return [
      'polygon-opacity: 0.7;',
      'line-color: #FFF;',
      'line-width: 0.5;',
      'line-opacity: 1;'
    ];
  } else if (geometryType === 'line') {
    return [
      'line-width: 2;',
      'line-opacity: 0.7;'
    ];
  } else {
    return [
      'marker-fill-opacity: 0.9;',
      'marker-line-color: #FFF;',
      'marker-line-width: 1;',
      'marker-line-opacity: 1;',
      'marker-placement: point;',
      'marker-type: ellipse;',
      'marker-width: 10;',
      'marker-allow-overlap: true;'
    ];
  }
};

},{}],228:[function(require,module,exports){
module.exports = function(geometryType) {
  return {
    "line": 'line-color',
    'polygon': "polygon-fill",
    'point': "marker-fill"
  }[geometryType];
};

},{}],229:[function(require,module,exports){

/**
 * Like _.defaults, but also applies to deep object structure.
 *
 * @param {Object} customs
 * @param {Object} defaults
 * @return {Object}
 */
var deepDefaults = function(customs, defaults) {
  var memo = {};

  for (var key in defaults) {
    if (defaults.hasOwnProperty(key)) {
      var defaultsItem = defaults[key];
      var customsItem;

      if (typeof customs === 'object') {
        customsItem = customs[key];
      }

      if (typeof defaultsItem === 'object' && typeof customsItem === 'object') {
        // both defaultsItem and customsItem are objecs, go down one level, set returned result as value for key
        memo[key] = deepDefaults(customsItem, defaultsItem);
      } else if (typeof defaultsItem !== 'object' && customsItem !== undefined) {
        memo[key] = customsItem;
      } else {
        memo[key] = defaultsItem;
      }
    }
  }

  return memo || {};
};

module.exports = deepDefaults;

},{}],230:[function(require,module,exports){
var ramps = require('./cartocss/color-ramps.js');

// TODO: only require the necessary params
module.exports = function(stats) {
  var method;
  var ramp = ramps.blue;
  var name = 'blue';

  if (['A','U'].indexOf(stats.dist_type) != -1) { // apply divergent scheme
    method = stats.jenks;

    if (stats.min < 0 && stats.max > 0){
      ramp = ramps.divergent;
      name = 'spectrum2';
    }
  } else if (stats.dist_type === 'F') {
    method = stats.equalint;
    ramp = ramps.red;
    name = 'red';
  } else if (stats.dist_type === 'J') {
    method = stats.headtails;
    ramp = ramps.blue;
    name = 'blue';
  } else {
    method = stats.headtails;
    ramp = ramps.red;
    name = 'red';
  }

  return {
    name: name,
    ramp: ramp,
    method: method
  };
};

},{"./cartocss/color-ramps.js":226}],231:[function(require,module,exports){
module.exports = function(distType) {
  return {
    U: 0.9,
    A: 0.9,
    L: 0.7,
    J: 0.7,
    S: 0.5,
    F: 0.3
  }[distType];
};

},{}],232:[function(require,module,exports){
var ramps = require('./cartocss/color-ramps');
var getWeightFromShape = require('./get-weight-from-shape');
var getMethodProperties = require('./get-method-properties');
var deepDefaults = require('./deep-defaults');
var CSS = require('./cartocss');

/**
 * Get metadata to render a CartoDB map (visualization) from a set of given table and column data, see params.
 *
 * @param {Object} opts hash with following keys:
 *   - tableName: {String}
 *   - column: {Object} hash with following keys:
 *     - stats: {Object} stats as given from a describe call on a SQL API.
 *     - geometryType: {String} e.g. 'points', 'polygon' or similar.
 *     - bbox: {Array[Array]} e.g. [[0.0, 0.1], [1.0, 1.1]]
 *   - dependencies: {Object} hash with following keys:
 *     - underscore: {Object} only used for some column types though, e.g. number, string
 *   - thresholds: {Object} See list in code
 * @return {Object}
 */
module.exports = function(opts) {
  var _ = opts.dependencies.underscore;
  var tableName = opts.tableName;

  var thresholds = deepDefaults(opts.thresholds, {
    number: {
      forBubbleMap: {
        minCalcWeight: 0.5,
        maxStatsCount: 200
      },
      forCategoryOrBubbleMap: {
        minStatsWeight: 0.5,
        distinctPercentage: 25,
        forCategory: {
          maxDistinctPercentage: 1
        },
        forBubble: {
          minDistinctPercentage: 1
        }
      }
    }
  });

  var column = opts.column;
  var geometryType = column.geometryType;
  var stats = column.stats;
  var columnName = stats.column;

  var visualizationType = 'choropleth';
  var css = null;
  var type = stats.type;
  var metadata = [];
  var distinctPercentage = (stats.distinct / stats.count) * 100;

  if (type === 'number') {
    var calcWeight = (stats.weight + getWeightFromShape(stats.dist_type)) / 2;

    if (calcWeight >= thresholds.number.forBubbleMap.minCalcWeight) {
      var visFunction = CSS.choropleth;
      var properties = getMethodProperties(stats);

      if (stats.count < thresholds.number.forBubbleMap.maxStatsCount && geometryType === 'point'){
        visualizationType = 'bubble';
        visFunction = CSS.bubble;
      }

      css = visFunction(properties.method, tableName, columnName, geometryType, properties.ramp);

    } else if (stats.weight > thresholds.number.forCategoryOrBubbleMap.minStatsWeight || distinctPercentage < thresholds.number.forCategoryOrBubbleMap.maxDistinctPercentage) {
      if (distinctPercentage < thresholds.number.forCategoryOrBubbleMap.forCategory.maxDistinctPercentage) {
        visualizationType = 'category';

        var cats = stats.cat_hist;
        cats = _.sortBy(cats, function(cat) { return cat[1]; }).reverse().slice(0, ramps.category.length);
        cats = _.sortBy(cats, function(cat) { return cat[0]; });
        cats = cats.map(function(r) { return r[0]; });

        css = CSS.category(cats, tableName, columnName, geometryType, { type: type });
        metadata = CSS.categoryMetadata(cats, { type: type });

      } else if (distinctPercentage >= thresholds.number.forCategoryOrBubbleMap.forBubble.minDistinctPercentage) {

        var visFunction = CSS.choropleth;

        if (geometryType === 'point'){
          visualizationType = 'bubble';
          visFunction = CSS.bubble;
        }

        var properties = getMethodProperties(stats);
        css = visFunction(properties.method, tableName, columnName, geometryType, properties.ramp);
      }
    }

  } else if (type === 'string') {
    visualizationType = 'category';

    var cats = stats.hist;
    cats = _.sortBy(cats, function(cat) { return cat[1]; }).reverse().slice(0, ramps.category.length);
    cats = _.sortBy(cats, function(cat) { return cat[0]; });
    cats = cats.map(function(r) { return r[0]; });

    css = CSS.category(cats, tableName, columnName, geometryType);
    metadata = CSS.categoryMetadata(cats);

  } else if (type === 'date') {
    visualizationType = 'torque';
    css = CSS.torque(stats, tableName);

  } else if (type === 'boolean') {
    visualizationType = 'category';
    var ramp = ramps.bool;
    var cats = ['true', 'false', null];
    var options = { type: type, ramp: ramp };
    css = CSS.category(cats, tableName, columnName, geometryType, options);
    metadata = CSS.categoryMetadata(cats, options);

  } else if (stats.type === 'geom') {
    visualizationType = 'heatmap';
    css = CSS.heatmap(stats, tableName, options);
  }

  var properties = {
    geometryType: geometryType,
    column: columnName,
    bbox: column.bbox,
    type: type,
    visualizationType: visualizationType
  };

  if (css) {
    properties.css = css;
  } else {
    properties.css = null;
    properties.weight = -100;
  }

  if (stats) {
    properties.stats = stats;
  }

  if (metadata) {
    properties.metadata = metadata;
  }

  return properties;
};

},{"./cartocss":225,"./cartocss/color-ramps":226,"./deep-defaults":229,"./get-method-properties":230,"./get-weight-from-shape":231}],233:[function(require,module,exports){
var getWeightFromShape = require('./get-weight-from-shape');
var deepDefaults = require('./deep-defaults');

var analyzeMethods = {
  geom: function(data) {
    var stats = data.stats;
    return data.isPointGeometryType && stats.cluster_rate * stats.density >= data.thresholds.geom.minStatsDensity;
  },

  string: function(data) {
    return data.stats.weight >= data.thresholds.string.minWeight;
  },

  number: function(data) {
    var stats = data.stats;
    var distinctPercentage = (stats.distinct / stats.count) * 100;
    var calcWeight = (stats.weight + getWeightFromShape(stats.dist_type)) / 2;
    return stats.weight >= data.thresholds.number.minWeight &&
      (
        calcWeight >= data.thresholds.number.minCalcWeight ||
        stats.weight > data.thresholds.number.minWeightIfNoOtherApplies ||
        distinctPercentage < data.thresholds.number.maxDistinctPercentage
      );
  },

  boolean: function(data) {
    return data.stats.null_ratio <= data.thresholds.boolean.maxNullRatio;
  },

  date: function(data) {
    return data.isPointGeometryType && data.stats.null_ratio <= data.thresholds.date.maxNullRatio;
  }
};

/**
 * Check wether the given stats is enough to make guesses for pecan maps.
 * @param {Object} stats Results from a describe call on a table column.
 *   A stats object that lacks any relevant statistics will most likely yield a false.
 * @return {Boolean} true if good enough
 */
module.exports = function(data) {
  var isGoodEnough = false;
  var data = data || {};

  data.thresholds = deepDefaults(data.thresholds, {
    geom: {
      minStatsDensity: 0.1
    },
    string: {
      minWeight: 0.8
    },
    number: {
      minWeight: 0.1,
      minCalcWeight: 0.5,
      maxDistinctPercentage: 25,
      minWeightIfNoOtherApplies: 0.5
    },
    boolean: {
      maxNullRatio: 0.75
    },
    date: {
      maxNullRatio: 0.75
    }
  });

  if (data && data.stats) {
    var method = analyzeMethods[data.stats.type];
    if (typeof method === 'function') {
      isGoodEnough = method.call(this, data);
    }
  }

  return isGoodEnough;
};

},{"./deep-defaults":229,"./get-weight-from-shape":231}],234:[function(require,module,exports){
module.exports = {
  hasEnoughToGuess: require('./has-enough-to-guess'),
  guessMap: require('./guess-map'),
  getWeightFromShape: require('./get-weight-from-shape'),
  getMethodProperties: require('./get-method-properties')
};

},{"./get-method-properties":230,"./get-weight-from-shape":231,"./guess-map":232,"./has-enough-to-guess":233}],235:[function(require,module,exports){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define('queue', factory) :
  (global.queue = factory());
}(this, function () { 'use strict';

  var slice = [].slice;

  function noop() {}

  var noabort = {};
  var success = [null];
  function newQueue(concurrency) {
    if (!(concurrency >= 1)) throw new Error;

    var q,
        tasks = [],
        results = [],
        waiting = 0,
        active = 0,
        ended = 0,
        starting, // inside a synchronous task callback?
        error,
        callback = noop,
        callbackAll = true;

    function start() {
      if (starting) return; // let the current task complete
      while (starting = waiting && active < concurrency) {
        var i = ended + active,
            t = tasks[i],
            j = t.length - 1,
            c = t[j];
        t[j] = end(i);
        --waiting, ++active, tasks[i] = c.apply(null, t) || noabort;
      }
    }

    function end(i) {
      return function(e, r) {
        if (!tasks[i]) throw new Error; // detect multiple callbacks
        --active, ++ended, tasks[i] = null;
        if (error != null) return; // only report the first error
        if (e != null) {
          abort(e);
        } else {
          results[i] = r;
          if (waiting) start();
          else if (!active) notify();
        }
      };
    }

    function abort(e) {
      error = e; // ignore new tasks and squelch active callbacks
      waiting = NaN; // stop queued tasks from starting
      notify();
    }

    function notify() {
      if (error != null) callback(error);
      else if (callbackAll) callback(null, results);
      else callback.apply(null, success.concat(results));
    }

    return q = {
      defer: function(f) {
        if (callback !== noop) throw new Error;
        var t = slice.call(arguments, 1);
        t.push(f);
        ++waiting, tasks.push(t);
        start();
        return q;
      },
      abort: function() {
        if (error == null) {
          var i = ended + active, t;
          while (--i >= 0) (t = tasks[i]) && t.abort && t.abort();
          abort(new Error("abort"));
        }
        return q;
      },
      await: function(f) {
        if (callback !== noop) throw new Error;
        callback = f, callbackAll = false;
        if (!waiting && !active) notify();
        return q;
      },
      awaitAll: function(f) {
        if (callback !== noop) throw new Error;
        callback = f, callbackAll = true;
        if (!waiting && !active) notify();
        return q;
      }
    };
  }

  function queue(concurrency) {
    return newQueue(arguments.length ? +concurrency : Infinity);
  }

  queue.version = "1.2.1";

  return queue;

}));
},{}]},{},[223])
//# sourceMappingURL=editor.uncompressed.js.map

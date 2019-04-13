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

},{"./background_polling_model":1,"./models/geocoding_model":4,"./models/imports_model":10,"./views/analysis/background_analysis_item_view":15,"./views/background_polling_header_view":17,"./views/geocodings/background_geocoding_item_view":18,"./views/imports/background_import_item_view":20,"./views/imports/background_import_limit_view":21}],3:[function(require,module,exports){
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

},{"./pecan_model":11,"cartodb-pecan":163}],4:[function(require,module,exports){
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

},{"./poller":12}],6:[function(require,module,exports){
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

},{"./poller":12}],9:[function(require,module,exports){
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

},{"./import_model":7,"./upload_model":14}],11:[function(require,module,exports){
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

},{"cartodb-pecan":163}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){

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

},{}],14:[function(require,module,exports){
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

},{"./upload_config":13}],15:[function(require,module,exports){
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

},{"../../../dialogs/pecan/pecan_dialog_view":84,"../../../view_factory":108}],16:[function(require,module,exports){
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

},{}],17:[function(require,module,exports){
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

},{"./background_polling_header_title_view":16}],18:[function(require,module,exports){
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

},{"../../../view_helpers/pluralize_string":111,"./geocoding_result_details_view":19}],19:[function(require,module,exports){
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

},{"../../../view_helpers/pluralize_string":111,"../../../views/base_dialog/view":113}],20:[function(require,module,exports){
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

},{"../../../view_factory":108,"../../../views/error_details_view":125,"../../../views/warnings_details_view":131,"../../models/upload_config":13,"./twitter_import_details_view":22}],21:[function(require,module,exports){
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

},{}],22:[function(require,module,exports){
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

},{"../../../views/base_dialog/view":113}],23:[function(require,module,exports){
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

},{"queue-async":187}],24:[function(require,module,exports){
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

},{"../../view_helpers/pluralize_string":111,"../../view_helpers/random_quote":112,"../../views/base_dialog/view":113}],25:[function(require,module,exports){
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

},{"../../batch_process_items":23}],26:[function(require,module,exports){
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

},{"../../view_factory":108,"../../view_helpers/random_quote":112,"../../views/base_dialog/view":113,"./options_collection":28,"./share/share_view":35,"./start_view":37}],27:[function(require,module,exports){
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

},{}],28:[function(require,module,exports){
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

},{"./option_model":27,"./password_option_model":29}],29:[function(require,module,exports){
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

},{"./option_model":27}],30:[function(require,module,exports){
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

},{"../../../view_factory":108,"./group_details_view":31,"./permission_view":33,"./user_details_view":36}],31:[function(require,module,exports){
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

},{"../../../view_helpers/pluralize_string":111}],32:[function(require,module,exports){
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

},{}],33:[function(require,module,exports){
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

},{"../../../view_factory":108,"./permission_toggler_view":32}],34:[function(require,module,exports){
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

},{}],35:[function(require,module,exports){
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

},{"../../../paged_search_model":99,"../../../view_factory":108,"../../../view_helpers/random_quote":112,"../../../views/base_dialog/view":113,"../../../views/paged_search/paged_search_view":128,"./grantables_view":30,"./share_model":34}],36:[function(require,module,exports){
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

},{}],37:[function(require,module,exports){
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

},{"../../view_helpers/pluralize_string":111}],38:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var CreateHeader = require('./create_header');
var CreateFooter = require('./create_footer');
var CreateListing = require('./create_listing');
var CreateLoading = require('./create_loading');
var NavigationView = require('./listing/navigation_view');

/**
 *  Create content view
 *
 *  It will manage big components within dialog. They are:
 *
 *  - Create header
 *  - Navigation
 *  - Create body
 *  - Create footer
 *  - Create loading
 *
 */

module.exports = cdb.core.View.extend({

  events: {
    'click': '_onClickContent'
  },

  initialize: function() {
    this.user = this.options.user;
    this._initBinds();
  },

  render: function() {
    this.clearSubViews();
    this._initViews();
    this._setOption();
    return this;
  },

  _initViews: function() {
    // Create dialog header
    var createHeader = new CreateHeader({
      el: this.$('.CreateDialog-header'),
      user: this.user,
      model: this.model
    })
    createHeader.render();
    this.addView(createHeader);

    // Navigation view
    var navigationView = new NavigationView({
      el: this.$('.js-navigation'),
      user: this.user,
      routerModel: this.model.visFetchModel,
      createModel: this.model,
      collection: this.model.collection
    });
    navigationView.render();
    this.addView(navigationView);

    // Create dialog footer
    var createFooter = new CreateFooter({
      el: this.$('.CreateDialog-footer'),
      user: this.user,
      createModel: this.model
    });

    createFooter.render();
    this.addView(createFooter);

    // Create pane
    this.createPane = new cdb.ui.common.TabPane({
      el: this.$(".Dialog-body--create")
    });
    // Don't show navigation menu when
    // a map or dataset is being created
    this.createPane.bind('tabEnabled', function(tabName) {
      navigationView[tabName === "listing" ? 'show' : 'hide' ]();
    }, this);
    this.addView(this.createPane);

    // Create dialog loading state
    var createLoading = new CreateLoading({
      user: this.user,
      createModel: this.model
    });

    createLoading.render();
    this.createPane.addTab('loading', createLoading);

    // Create dialog listing
    this._createListing = new CreateListing({
      user: this.user,
      createModel: this.model
    });
    this._createListing.render();
    this.createPane.addTab('listing', this._createListing);
    this.addView(this._createListing);

    this.model.set('option', 'listing');
  },

  _setOption: function() {
    this.createPane.active(this.model.getOption());
  },

  _initBinds: function() {
    _.bindAll(this, '_onScrollContent');
    this.model.bind('change:option', this._setOption, this);
    this.model.bind('change:option', this._maybeShowOnboarding, this);
    this.$(".Dialog-body--create").bind('scroll', this._onScrollContent);
  },

  _maybeShowOnboarding: function() {
    if (this._onboardingView && this.model.showOnboarding()) {
      this._createListing.$el.append(this._onboardingView.render().el);
      this._onboardingView.show();
    }
  },

  _onClickContent: function() {
    cdb.god.trigger('closeDialogs');
  },

  _onScrollContent: function() {
    var isScrolled = this.$(".Dialog-body--create").scrollTop() > 0;
    this.$('.js-navigation').toggleClass('with-long-separator', !!isScrolled);
  },

  clean: function() {
    this.$(".Dialog-body--create").unbind('scroll', this._onScrollContent);
    this.elder('clean');
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./create_footer":40,"./create_header":41,"./create_listing":42,"./create_loading":43,"./listing/navigation_view":79}],39:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var UploadModel = require('../../background_polling/models/upload_model');
var VisFetchModel = require('../../visualizations_fetch_model');

/**
 *  Create dataset model
 *
 *  - Store the state of the dialog (listing or loading).
 *  - Store the selected datasets for a map creation.
 *  - Store the upload info for a dataset creation.
 */
module.exports = cdb.core.Model.extend({

  defaults: {
    type: 'dataset',
    option: 'listing',
    listing: 'import' // [import, datasets, scratch]
  },

  initialize: function(val, opts) {
    this.user = opts.user;
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
  },

  viewsReady: function() {
    // nothing to do for this use-case
  },

  // For create-listing view
  showLibrary: function() {
    return true;
  },

  // For create-listing view
  showDatasets: function() {
    return false;
  },

  // For create-listing view
  canSelect: function() {
    return true;
  },

  // Get option state (it could be loading or listing)
  getOption: function() {
    var option = this.get('option');
    var states = option.split('.');

    if (states.length > 0) {
      return states[0];
    }

    return '';
  },

  // Get import state (it could be any of the possibilities of the import options, as in scratch, dropbox, etc...)
  // For create-footer view
  getImportState: function() {
    var option = this.get('option');
    var states = option.split('.');

    if (states.length > 0 && states.length < 4 && states[0] === "listing" && states[1] === "import") {
      return states[2];
    }

    return '';
  },

  // For create-footer view
  showGuessingToggler: function() {
    return true;
  },

  // For create-footer view
  showPrivacyToggler: function() {
    return true;
  },

  // For create-footer view
  startUpload: function() {
    cdb.god.trigger('importByUploadData', this.upload.toJSON());
  },

  // For create-listing-import view
  setActiveImportPane: function(option) {
    if (option && this.get('listing') === "import" && this.getImportState() !== option) {
      this.set('option', 'listing.import.' + option);
    }
  },

  // For create-footer view
  isMapType: function() {
    return false;
  },

  // For create-from-scratch view
  createFromScratch: function() {
    this.trigger('creatingDataset', 'dataset', this);
    this.set('option', 'loading');

    var self = this;
    var dataset = new cdb.admin.CartoDBTableMetadata();

    dataset.save({}, {
      success: function(m) {
        self.trigger('datasetCreated', m, self);
      },
      error: function(m, e) {
        self.trigger('datasetError', e, self);
      }
    });
  },

  _initBinds: function() {
    this.upload.bind('change', function() {
      this.trigger('change:upload', this);
    }, this);
    this.collection.bind('change:selected', this._onItemSelected, this);
    this.visFetchModel.bind('change', this._fetchCollection, this);
    this.bind('change:option', this._maybePrefetchDatasets, this);
    this.bind('change:listing', this._maybePrefetchDatasets, this);
  },

  _maybePrefetchDatasets: function() {
    var isDatasets = this.get('listing') === 'datasets';

    // Fetch collection if it was never fetched (and a search is not applied!)
    if (isDatasets && !this.get('collectionFetched') && !this.visFetchModel.isSearching()) {
      this.set('collectionFetched', true);
      this._fetchCollection();
    }
  },

  _selectedItems: function() {
    return this.collection.where({ selected: true });
  },

  _fetchCollection: function() {
    var params = this.visFetchModel.attributes;

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
      types: params.library ? 'remote' : 'table',
      exclude_raster: true
    });

    this.collection.fetch();
  },

  _onItemSelected: function(changedModel) {
    // Triggers an import immediately
    if (changedModel.get('type') === 'remote') {
      // previously located in listings/datasets/remote_datasets_item_view
      var table = new cdb.admin.CartoDBTableMetadata(changedModel.get('external_source'));
      var d = {
        type: 'remote',
        value: changedModel.get('name'),
        remote_visualization_id: changedModel.get('id'),
        size: table.get('size'),
        create_vis: false
      };
      cdb.god.trigger('importByUploadData', d);
    }
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../background_polling/models/upload_model":14,"../../visualizations_fetch_model":132}],40:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var GuessingTogglerView = require('./footer/guessing_toggler_view');
var PrivacyTogglerView = require('./footer/privacy_toggler_view');

/**
 *  Create footer view
 *
 *  It will show possible choices depending the
 *  selected option and the state of the main model
 *
 */

module.exports = cdb.core.View.extend({

  events: {
    'click .js-templates': '_goToTemplates',
    'click .js-create_map': '_createMap',
    'click .js-connect': '_connectDataset',
    'click .js-videoTutorial': '_startTutorial'
  },

  initialize: function() {
    this.user = this.options.user;
    this.createModel = this.options.createModel;
    this.guessingModel = new cdb.core.Model({ guessing: true });
    this.privacyModel = new cdb.core.Model({
      privacy: this.user.canCreatePrivateDatasets() ? 'PRIVATE' : 'PUBLIC'
    });
    this.template = cdb.templates.getTemplate('common/views/create/create_footer');
    this._initBinds();
  },

  render: function() {
    this.clearSubViews();
    var userCanUpgrade = window.upgrade_url && !cdb.config.get('cartodb_com_hosted') && (!this.user.isInsideOrg() || this.user.isOrgOwner() );

    this.$el.html(
      this.template({
        isMapType: this.createModel.isMapType(),
        option: this.createModel.getOption(),
        listingState: this.createModel.get('listing'),
        isLibrary: this.createModel.visFetchModel.get('library'),
        importState: this.createModel.getImportState(),
        isUploadValid: this.createModel.upload.isValidToUpload(),
        selectedDatasetsCount: this.createModel.selectedDatasets.length,
        maxSelectedDatasets: this.user.getMaxLayers(),
        mapTemplate: this.createModel.get('mapTemplate'),
        userCanUpgrade: userCanUpgrade,
        upgradeUrl: window.upgrade_url,
        currentUrl: window.location.href
      })
    );

    this._initViews();

    return this;
  },

  _initBinds: function() {
    this.createModel.bind('change:upload', this.render, this);
    this.createModel.bind('change:option', this.render, this);
    this.createModel.bind('change:listing', this.render, this);
    this.createModel.selectedDatasets.bind('all', this.render, this);
    this.createModel.visFetchModel.bind('change:library', this.render, this);
    this.add_related_model(this.createModel);
    this.add_related_model(this.createModel.selectedDatasets);
    this.add_related_model(this.createModel.visFetchModel);
  },

  _initViews: function() {
    this.guessingTogglerView = new GuessingTogglerView({
      model: this.guessingModel,
      createModel: this.createModel
    });
    this.$('.js-footer-info').append(this.guessingTogglerView.render().el);
    this.addView(this.guessingTogglerView);

    this.privacyTogglerView = new PrivacyTogglerView({
      model: this.privacyModel,
      user: this.user,
      createModel: this.createModel
    });
    this.$('.js-footerActions').prepend(this.privacyTogglerView.render().el);
    this.addView(this.privacyTogglerView);
  },

  _connectDataset: function() {
    if (this.createModel.upload.isValidToUpload()) {
      // Setting privacy for new import if toggler is enabled
      if (this.createModel.showPrivacyToggler()) {
        this.createModel.upload.set('privacy', this.privacyModel.get('privacy'));
      }
      // Set proper guessing values before starting the upload
      this.createModel.upload.setGuessing(this.guessingModel.get('guessing'));
      this.createModel.startUpload();
    }
  },

  _startTutorial: function() {
    this.createModel.startTutorial();
  },

  _goToTemplates: function(e) {
    if (e) e.preventDefault();
    this.createModel.set('option', 'templates');
  },

  _createMap: function() {
    var selectedDatasets = this.createModel.selectedDatasets;
    if (selectedDatasets.length > 0 && selectedDatasets.length <= this.user.getMaxLayers()) {
      this.createModel.createMap();
    }
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./footer/guessing_toggler_view":46,"./footer/privacy_toggler_view":47}],41:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);

/**
 *  Create header view
 *
 *  It will manage which content should be displayed
 *  depending create model
 *
 */

module.exports = cdb.core.View.extend({
  
  initialize: function() {
    this.user = this.options.user;
    this.template = cdb.templates.getTemplate('common/views/create/create_header');
    this._initBinds();
  },

  render: function() {
    this.$el.html(
      this.template({
        type: this.model.get('type'),
        option: this.model.getOption()
      })
    );
    return this;
  },

  _initBinds: function() {
    this.model.bind('change:option', this.render, this);
  }

});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],42:[function(require,module,exports){
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

},{"./listing/datasets_view":53,"./listing/imports_view":78}],43:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var randomQuote = require('../../view_helpers/random_quote');

/**
 *  Create loading view
 *
 *  It will show a big loading when a new map is gonna be created
 *
 */

module.exports = cdb.core.View.extend({

  className: 'IntermediateInfo',
  tagName: 'div',

  initialize: function() {
    this.createModel = this.options.createModel;
    this.user = this.options.user;
    this.model = new cdb.core.Model({ state: 'loading', type: 'dataset' });
    this._initBinds();
  },

  render: function() {
    var currentImport = this.model.get('currentImport');
    var d = {
      createModelType: this.createModel.get('type'),
      type: this.model.get('type'),
      state: this.model.get('state'),
      currentImport: currentImport,
      currentImportName: currentImport && ( currentImport.upl.get('service_item_id') || currentImport.upl.get('value') ),
      tableIdsArray: this.model.get('tableIdsArray'),
      selectedDatasets: this.createModel.selectedDatasets,
      upgradeUrl: window.upgrade_url,
      freeTrial: this.user.get('show_trial_reminder'),
      quote: randomQuote()
    };

    if (currentImport) {
      d.err = currentImport.getError();
      d.err.item_queue_id = currentImport.get('id');
    }

    if (d.state === "error") {
      var sizeError = d.err && d.err.error_code && d.err.error_code == "8001";
      var userCanUpgrade = !cdb.config.get('cartodb_com_hosted') && (!this.user.isInsideOrg() || this.user.isOrgOwner());

      this.template = cdb.templates.getTemplate(
        sizeError && userCanUpgrade ?
          'common/views/create/create_loading_upgrade' :
          'common/views/create/create_loading_error'
      )
    } else {
      this.template = cdb.templates.getTemplate('common/views/create/create_loading');
    }

    this.$el.html( this.template(d) );
    return this;
  },

  _initBinds: function() {
    this.model.bind('change:state change:tableIdsArray change:currentImport', this.render, this);
    // Dataset
    this.createModel.bind('datasetError', this._onDatasetError, this);
    this.createModel.bind('creatingDataset', this._creatingDataset, this);

    // Map
    this.createModel.bind('importingRemote', this._importingRemote, this);
    this.createModel.bind('importFailed', this._onImportFailed, this);
    this.createModel.bind('creatingMap', this._creatingMap, this);
    this.createModel.bind('mapError', this._onMapError, this);

    this.add_related_model(this.createModel);
  },

  _creatingDataset: function() {
    this.model.set({
      type: 'dataset',
      state: 'loading'
    });
  },

  _onDatasetError: function() {
    this.model.set({
      type: 'dataset',
      state: 'error'
    });
  },

  _importingRemote: function(m) {
    this.model.set(
      _.extend(
        m.toJSON(),
        {
          state: 'importing'
        }
      )
    );
  },

  _onImportFailed: function(m) {
    this.model.set(
      _.extend(
        m.toJSON(),
        {
          state: 'error'
        }
      )
    );
  },

  _creatingMap: function(m) {
    this.model.set(
      _.extend(
        m.toJSON(),
        {
          state: 'creating'
        }
      )
    );
  },

  _onMapError: function(m) {
    this.model.set(
      _.extend(
        m.toJSON(),
        {
          state: 'error'
        }
      )
    );
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../view_helpers/random_quote":112}],44:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var ImportsModel = require('../../background_polling/models/imports_model');
var UploadModel = require('../../background_polling/models/upload_model');
var VisFetchModel = require('../../visualizations_fetch_model');

/**
 *  This model will be on charge of create a new map
 *  using user selected datasets, where they can be
 *  already imported datasets or remote (and needed to import)
 *  datasets.
 */
module.exports = cdb.core.Model.extend({

  defaults: {
    type: 'map',
    option: 'listing',
    currentImport: null,
    tableIdsArray: [],
    listing: 'datasets' // [import, datasets, scratch]
  },

  _DEFAULT_MAP_NAME: 'Untitled Map',

  initialize: function(attrs, opts) {
    this.user = opts.user;
    this.upload = new UploadModel({
      create_vis: true
    }, {
      user: this.user
    });

    this.selectedDatasets = new Backbone.Collection(opts.selectedItems);
    this.collection = new cdb.admin.Visualizations();
    this.vis = new cdb.admin.Visualization({ name: 'Untitled map' });
    this.visFetchModel = new VisFetchModel({
      content_type: 'datasets',
      library: this.showLibrary()
    });

    this._initBinds();
  },

  // For entry point, notifies model that depending views are ready for changes (required for custom events)
  viewsReady: function() {
    if (this.selectedDatasets.isEmpty()) {
      this._maybePrefetchDatasets();
    } else {
      // Not empty, so start creating map from these preselected items
      this.createMap();
    }
  },

  // For create-listing view
  showLibrary: function() {
    return false;
  },

  // For create-listing view
  showDatasets: function() {
    return true;
  },

  // For create-listing view
  canSelect: function(datasetModel) {
    if (datasetModel.get('selected')) {
      return true;
    } else {
      return this.selectedDatasets.length < this.user.getMaxLayers();
    }
  },

  // Get option state (it could be listing or loading)
  getOption: function() {
    var option = this.get('option');
    var states = option.split('.');

    if (states.length > 0) {
      return states[0];
    }

    return '';
  },

  // Get import state (it could be any of the possibilities of the import options, as in scratch, dropbox, etc...)
  // For create-footer view
  getImportState: function() {
    var option = this.get('option');
    var states = option.split('.');

    if (states.length > 0 && states.length < 4 && states[0] === "listing" && states[1] === "import") {
      return states[2];
    }

    return '';
  },

  // For create-footer view
  showGuessingToggler: function() {
    return true;
  },

  // For create-footer view
  showPrivacyToggler: function() {
    return this.get('listing') === 'import';
  },

  // For create-listing-import view
  setActiveImportPane: function(option) {
    if (option && this.get('listing') === "import" && this.getImportState() !== option) {
      this.set('option', 'listing.import.' + option);
    }
  },

  // For create-footer view
  isMapType: function() {
    return true;
  },

  startTutorial: function() {
    this.trigger('startTutorial', this);
  },

  // For create-footer view
  startUpload: function() {
    cdb.god.trigger('importByUploadData', this.upload.toJSON());
  },

  createMap: function() {
    if (this.selectedDatasets.length === 0) {
      return;
    }
    this.set('option', 'loading');
    this._checkCollection();
  },

  // For create-from-scratch view
  createFromScratch: function() {
    this.trigger('creatingDataset', 'dataset', this);
    this.set('option', 'loading');

    var self = this;
    var dataset = new cdb.admin.CartoDBTableMetadata();

    dataset.save({}, {
      success: function(m) {
        self.trigger('datasetCreated', m, self);
      },
      error: function(m, e) {
        self.trigger('datasetError', e, self);
      }
    });
  },

  _initBinds: function() {
    this.upload.bind('change', function() {
      this.trigger('change:upload', this);
    }, this);
    this.bind('change:option', this._onOptionChange, this);

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
    this.visFetchModel.bind('change', this._fetchCollection, this);

    if (this.selectedDatasets.isEmpty()) {
      this.bind('change:option', this._maybePrefetchDatasets, this);
      this.bind('change:listing', this._maybePrefetchDatasets, this);
    }
  },

  _maybePrefetchDatasets: function() {
    var isDatasets = this.get('listing') === 'datasets';

    // Fetch collection if it was never fetched (and a search is not applied!)
    if (isDatasets && !this.get('collectionFetched') && !this.visFetchModel.isSearching()) {
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

  _selectedItems: function() {
    return this.selectedDatasets;
  },

  _checkCollection: function() {
    if (this.selectedDatasets.length > 0) {
      this._importDataset(this.selectedDatasets.pop());
    } else {
      this.set('currentImport', '');
      this._createMap();
    }
  },

  _importDataset: function(mdl) {
    var tableIdsArray = _.clone(this.get('tableIdsArray'));

    if (mdl.get('type') === "remote") {
      var d = {
        create_vis: false,
        type: 'remote',
        value: mdl.get('name'),
        remote_visualization_id: mdl.get('id'),
        size: mdl.get('external_source') ? mdl.get('external_source').size : undefined
      };

      var impModel = new ImportsModel({}, {
        upload: d,
        user: this.user
      });
      this.set('currentImport', _.clone(impModel));
      this.trigger('importingRemote', this);

      impModel.bind('change:state', function(m) {
        if (m.hasCompleted()) {
          var data = m.imp.toJSON();
          tableIdsArray.push(data.table_name);
          this.set('tableIdsArray', tableIdsArray);
          this._checkCollection();
          this.trigger('importCompleted', this);
        }
        if (m.hasFailed()) {
          this.trigger('importFailed', this);
        }
      }, this);

      // If import model has any errors at the beginning
      if (impModel.hasFailed()) {
        this.trigger('importFailed', this);
      }
    } else {
      var table = mdl.tableMetadata();
      tableIdsArray.push(table.get('name'));
      this.set({
        currentImport: '',
        tableIdsArray: tableIdsArray
      });
      this._checkCollection();
    }
  },

  _createMap: function() {
    var self = this;
    var vis = new cdb.admin.Visualization({
      name: this._DEFAULT_MAP_NAME,
      type: 'derived'
    });

    this.trigger('creatingMap', this);

    vis.save({
      tables: this.get('tableIdsArray')
    }, {
      success: function() {
        self._redirectTo(vis.viewUrl(self.user).edit().toString());
      },
      error: function() {
        self.trigger('mapError', self);
      }
    });
  },

  _redirectTo: function(url) {
    window.location = url;
  }


});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../background_polling/models/imports_model":10,"../../background_polling/models/upload_model":14,"../../visualizations_fetch_model":132}],45:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var BaseDialog = require('../../views/base_dialog/view');
var CreateContent = require('./create_content');

/**
 *  Create view dialog
 *
 *  It let user create a new dataset or map, just
 *  decide the type before creating this dialog, by default
 *  it will help you to create a map.
 *
 */

module.exports = BaseDialog.extend({

  className: 'Dialog is-opening CreateDialog',

  initialize: function() {
    this.elder('initialize');
    this.user = this.options.user;
    this.template = cdb.templates.getTemplate('common/views/create/dialog_template');
    this._initBinds();
  },

  render: function() {
    BaseDialog.prototype.render.call(this);
    this.$('.content').addClass('Dialog-content--expanded');
    this._initViews();
    return this;
  },

  render_content: function() {
    return this.template();
  },

  _initBinds: function() {
    cdb.god.bind('importByUploadData', this.close, this);
    this.add_related_model(cdb.god);
  },

  _initViews: function() {
    var createContent = new CreateContent({
      el: this.$el,
      model: this.model,
      user: this.user
    });
    createContent.render();
    this.addView(createContent);
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../views/base_dialog/view":113,"./create_content":38}],46:[function(require,module,exports){
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

},{}],47:[function(require,module,exports){
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

},{}],48:[function(require,module,exports){
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

},{"../../../../../common/view_helpers/random_quote":112}],49:[function(require,module,exports){
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

},{"../../../../view_helpers/pluralize_string":111,"../../../../views/likes/view":126}],50:[function(require,module,exports){
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

},{"../../../../views/pagination/model":129,"../../../../views/pagination/view":130}],51:[function(require,module,exports){
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

},{"../../../../background_polling/models/upload_config":13,"../../../../view_helpers/pluralize_string":111,"./dataset_item_view":49}],52:[function(require,module,exports){
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

},{"./datasets/dataset_item_view":49,"./datasets/remote_dataset_item_view":51}],53:[function(require,module,exports){
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

},{"./datasets/content_result_view":48,"./datasets/datasets_paginator_view":50,"./datasets_list_view":52}],54:[function(require,module,exports){
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

},{"./imports/import_arcgis_view":58,"./imports/import_data_view":59,"./imports/service_import/import_service_view":63,"./imports/twitter_import/import_twitter_view":73}],55:[function(require,module,exports){
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

},{}],56:[function(require,module,exports){
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

},{}],57:[function(require,module,exports){
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

},{"./import_selected_dataset_view":62}],58:[function(require,module,exports){
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

},{"./data_import/data_form_view":55,"./data_import/data_header_view":56,"./import_arcgis_selected_dataset_view":57,"./import_data_view":59}],59:[function(require,module,exports){
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

},{"../../../../background_polling/models/upload_model":14,"./data_import/data_form_view":55,"./data_import/data_header_view":56,"./import_default_view":61,"./import_selected_dataset_view":62}],60:[function(require,module,exports){
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

},{}],61:[function(require,module,exports){
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

},{"../../../../background_polling/models/upload_model":14}],62:[function(require,module,exports){
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

},{"../../../../view_helpers/pluralize_string":111}],63:[function(require,module,exports){
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

},{"../../../../../background_polling/models/upload_model":14,"../../../../../service_models/service_oauth_model":103,"../../../../../service_models/service_token_model":104,"../import_default_view":61,"../import_selected_dataset_view":62,"./service_header_view":64,"./service_items_collection":67,"./service_list_view":69,"./service_loader_view":70}],64:[function(require,module,exports){
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

},{}],65:[function(require,module,exports){
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

},{}],66:[function(require,module,exports){
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

},{}],67:[function(require,module,exports){
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

},{"./service_item_model.js":66}],68:[function(require,module,exports){
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

},{"../../../../../view_helpers/pluralize_string":111,"./service_item_description_format":65}],69:[function(require,module,exports){
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

},{"../../../../../view_helpers/pluralize_string":111,"./service_list_item_view":68}],70:[function(require,module,exports){
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

},{}],71:[function(require,module,exports){
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

},{}],72:[function(require,module,exports){
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

},{"./credits_info_view":71}],73:[function(require,module,exports){
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

},{"../../../../../background_polling/models/upload_model":14,"../../../../../dialogs/create/listing/imports/import_default_view":61,"../../../../../dialogs/create/listing/imports/twitter_import/twitter_categories/twitter_categories_view":75,"../../../../../views/date_pickers/dates_range_picker":124,"./credits_usage_view.js":72}],74:[function(require,module,exports){
(function (global){
var Backbone = (typeof window !== "undefined" ? window['Backbone'] : typeof global !== "undefined" ? global['Backbone'] : null);
var TwitterCategoryModel = require('./twitter_category_model');
  
// Twitter categories collection

module.exports = Backbone.Collection.extend({
  model: TwitterCategoryModel
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./twitter_category_model":76}],75:[function(require,module,exports){
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

},{"./twitter_categories_collection":74,"./twitter_category_model":76,"./twitter_category_view":77}],76:[function(require,module,exports){
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

},{}],77:[function(require,module,exports){
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

},{}],78:[function(require,module,exports){
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

},{"./import_options":54,"./imports/import_default_fallback_view":60}],79:[function(require,module,exports){
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

},{"../../../view_helpers/pluralize_string":111}],80:[function(require,module,exports){
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

},{"../view_helpers/pluralize_string":111,"../view_helpers/random_quote":112,"../views/base_dialog/view":113,"../views/mapcard_preview":127}],81:[function(require,module,exports){
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

},{"../../common/batch_process_items":23}],82:[function(require,module,exports){
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

},{"../view_factory":108,"../view_helpers/random_quote":112,"../views/base_dialog/view":113,"../views/error_details_view":125}],83:[function(require,module,exports){
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

},{"cartodb-pecan":163}],84:[function(require,module,exports){
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

},{"../../view_factory":108,"../../view_helpers/random_quote":112,"../../views/base_dialog/view":113,"./pecan_card":83,"cartodb-pecan":163}],85:[function(require,module,exports){
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

},{}],86:[function(require,module,exports){
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

},{"../../view_helpers/random_quote":112,"../../views/base_dialog/view":113,"./interval_view":85}],87:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);

/**
 *  Video tutorial footer view
 *
 *  Footer content for video tutorials
 *
 */

module.exports = cdb.core.View.extend({

  events: {
    'click .js-start': '_startTutorial'
  },
  
  initialize: function() {
    this.template = cdb.templates.getTemplate('common/dialogs/video_tutorial/video_tutorial_footer_template');
    this._initBinds();
  },

  render: function() {
    this.$el.html(
      this.template({
        isVideoSelected: this.model.isVideoSelected()
      })
    );
    return this;
  },

  _initBinds: function() {
    this.model.bind('change:videoId', this.render, this);
  },

  _startTutorial: function(e) {
    var videoId = this.model.get('videoId');
    if (videoId) {
      cdb.god.trigger('startTutorial', videoId, this);
    }
  }

});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],88:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);

/**
 *  Video tutorial header view
 *
 *  Header content for video tutorials
 *
 */

module.exports = cdb.core.View.extend({

  events: {
    'click .js-back': '_backToList'
  },
  
  initialize: function() {
    this.template = cdb.templates.getTemplate('common/dialogs/video_tutorial/video_tutorial_header_template');
    this._initBinds();
  },

  render: function() {
    this.$el.html(
      this.template({
        isVideoSelected: this.model.isVideoSelected()
      })
    );
    return this;
  },

  _initBinds: function() {
    this.model.bind('change:videoId', this.render, this);
  },

  _backToList: function() {
    this.model.unset('videoId');
  }

});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],89:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);

/**
 *  Video tutorial item view
 *
 *  Display primary info about the template item.
 *  Like the name or the description. Once it is
 *  selected the video will be displayed.
 *
 */

module.exports = cdb.core.View.extend({

  className: 'VideoTutorial-item',
  tagName: 'li',

  events: {
    'click .js-button': '_selectVideo'
  },
  
  initialize: function() {
    this.template = cdb.templates.getTemplate('common/dialogs/video_tutorial/video_tutorial_item_template');
  },

  render: function() {
    this.$el.html(
      this.template({
        shortName: this.model.get('short_name'),
        shortDescription: this.model.get('short_description'),
        color: this.model.get('color'),
        icon: this.model.get('icon') || '',
        duration: this.model.get('duration') || '',
        difficulty: this.model.get('difficulty') || '',
        iconUrl: this.model.get('icon_url') || ''
      })
    );
    return this;
  },

  _selectVideo: function() {
    this.trigger('selected', this.model, this);
  }

});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],90:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var Backbone = (typeof window !== "undefined" ? window['Backbone'] : typeof global !== "undefined" ? global['Backbone'] : null);
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var MapTemplates = require('../../map_templates');
var VideoTutorialItemView = require('./video_tutorial_item_view');

/**
 *  Create templates view
 *
 *  It will display all template options for creating
 *  a new map.
 *
 */

module.exports = cdb.core.View.extend({

  className: 'VideoTutorial-listWrapper',

  initialize: function() {
    this.collection = new Backbone.Collection(MapTemplates);
    this._initBinds();
  },

  render: function() {
    this.clearSubViews();
    this.$el.empty();
    this.$el.append('<ul class="VideoTutorial-list js-list"></ul>');
    this.collection.reset(MapTemplates);
    return this;
  },

  _initBinds: function() {
    this.collection.bind('reset', this._renderList, this);
    this.add_related_model(this.collection);
  },

  _renderList: function() {
    this.collection.each(this._addItem, this);
  },

  _addItem: function(mdl) {
    var videoItem = new VideoTutorialItemView({ model: mdl });
    this.$('.js-list').append(videoItem.render().el);
    videoItem.bind('selected', this._onItemSelected, this);
    this.addView(videoItem);
  },

  _onItemSelected: function(mdl) {
    this.model.set('videoId', mdl.get('videoId'));
    cdb.god.trigger('onTemplateSelected', this);
  }

});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../map_templates":98,"./video_tutorial_item_view":89}],91:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var Backbone = (typeof window !== "undefined" ? window['Backbone'] : typeof global !== "undefined" ? global['Backbone'] : null);
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var MapTemplates = require('../../map_templates');

/** 
 *  Model that controls video tutorial
 *  views
 *
 */

module.exports = Backbone.Model.extend({

  defaults: {
    videoId: '' 
  },

  isVideoSelected: function() {
    return !!this.get('videoId')
  },

  getVideoTemplate: function() {
    var videoId = this.get('videoId');

    if (videoId) {
      var item = _.find(MapTemplates, function(item) {
        return item.videoId === videoId;
      });

      if (!_.isEmpty(item)) {
        return item;
      }
    }

    return false;
  }

});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../map_templates":98}],92:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);

/**
 *  Video preview view
 *
 *  It will display the selected map template, a video
 *  with advices
 *
 */

module.exports = cdb.core.View.extend({

  className: 'VideoTutorial-video',

  initialize: function() {
    this.template = cdb.templates.getTemplate('common/dialogs/video_tutorial/video_tutorial_preview_template');
    this.localStorage = new cdb.admin.localStorage("VideoPlayer");
    this._initBinds();
  },

  render: function() {
    this.clearSubViews();
    var d = this.model.getVideoTemplate();
    if (d && d.name) {
      this.$el.html(this.template(d));
      this._loadScript();
    }
    return this;
  },

  _storeVideoInfo: function(seconds) {
    this.localStorage.set({ currentVideo: { seconds: seconds } });
  },

  _storeVideoInfoWithId: function(seconds) {
    var videoId = this.model.get('videoId');
    this.localStorage.set({ currentVideo: { video_id: videoId, seconds: seconds } });
  },

  _loadScript: function() {
    var self = this;
    $.getScript('//f.vimeocdn.com/js/froogaloop2.min.js', function() {
      self._initVideoBinds();
    });
  },

  _initVideoBinds: function() {
    var self = this;

    this._removeVideoBinds();
    this.player = $f(this.$("iframe")[0]);

    this.player.addEvent('ready', function() {
      self.player.addEvent('playProgress', function(m) {
        self._storeVideoInfo(m.seconds);
      });
    });
  },

  _removeVideoBinds: function() {
    if (!this.player) return;
    this.player.removeEvent('ready');
  },

  _initBinds: function() {
    this.model.bind('change:videoId', this.render, this);
  },

  clean: function() {
    this._removeVideoBinds();
    this.elder('clean');
  }

});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],93:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var BaseDialog = require('../../views/base_dialog/view');
var VideoTutorialModel = require('./video_tutorial_model');
var VideoTutorialHeaderView = require('./video_tutorial_header_view');
var VideoTutorialFooterView = require('./video_tutorial_footer_view');
var VideoTutorialListView = require('./video_tutorial_list_view');
var VideoTutorialVideoView = require('./video_tutorial_preview_view');

/**
 *  Video tutorial dialog
 *
 *  It will let the user check how 
 *
 */

module.exports = BaseDialog.extend({

  className: 'Dialog is-opening VideoTutorial',

  initialize: function() {
    this.model = new VideoTutorialModel({
      videoId: this.options.videoId
    });
    this.elder('initialize');
    this.template = cdb.templates.getTemplate('common/dialogs/video_tutorial/video_tutorial_template');
    this._initBinds();
  },

  render: function() {
    this.clearSubViews()
    this.elder('render');
    this._initViews();
    return this;
  },

  render_content: function() {
    return this.template();
  },

  _initBinds: function() {
    this.model.bind('change:videoId', this.setContentVisibility, this);
    cdb.god.bind('startTutorial', this.close, this);
    this.add_related_model(cdb.god);
  },

  _initViews: function() {
    // Video tutorial header
    var videoTutorialHeader = new VideoTutorialHeaderView({
      el: this.$('.VideoTutorial-header'),
      model: this.model
    })
    videoTutorialHeader.render();
    this.addView(videoTutorialHeader);

    // Video tutorial footer
    var videoTutorialFooter = new VideoTutorialFooterView({
      el: this.$('.VideoTutorial-footer'),
      model: this.model
    });

    videoTutorialFooter.render();
    this.addView(videoTutorialFooter);

    // Video tutorial tabpane
    this._videoTutorialContent = new cdb.ui.common.TabPane({
      el: this.$(".VideoTutorial-content")
    });
    this.addView(this._videoTutorialContent);

    // Videos tutorial list
    this._videoTutorialContent.addTab(
      'list',
      new VideoTutorialListView({
        model: this.model
      }).render()
    );

    // Videos tutorial preview
    this._videoTutorialContent.addTab(
      'video',
      new VideoTutorialVideoView({
        model: this.model
      }).render()
    );

    this.setContentVisibility();
  },

  setContentVisibility: function() {
    // If video id is defined, content will show video preview
    this._videoTutorialContent.active( this.model.isVideoSelected() ? 'video' : 'list' );
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../views/base_dialog/view":113,"./video_tutorial_footer_view":87,"./video_tutorial_header_view":88,"./video_tutorial_list_view":90,"./video_tutorial_model":91,"./video_tutorial_preview_view":92}],94:[function(require,module,exports){
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

},{}],95:[function(require,module,exports){
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

},{}],96:[function(require,module,exports){
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

},{"../views/base_dialog/view":113}],97:[function(require,module,exports){
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

},{"./mamufas_import_dialog_view":96}],98:[function(require,module,exports){

/**
 *  Map templates
 *
 *  It will display all the possibilities to select
 *  any of your current datasets or connect a new dataset.
 *
 */

module.exports = [
  {
    name: 'Create animated maps',
    short_name: 'Create animated maps',
    description: 'Learn how to animate your data, by using historic United States tornado data.',
    short_description: 'Create maps for showing events over time',
    icon: 'snake',
    color: '#CB3F29',
    difficulty: 'easy',
    duration: '5:01',
    videoId: '122308083',
    map: {
      url: 'https://examples.carto.com/viz/960736aa-cd8c-11e4-a309-0e6e1df11cbf/embed_map',
      source: [
        'https://examples.carto.com/api/v2/sql?q=SELECT%20*%20FROM%20tornado_centroids&filename=tornados&format=geojson'
      ]
    }
  },
  {
    name: 'Animate the life of a cat',
    short_name: 'Create GPS Data maps',
    description: 'Let\'s take a look at one week of movements for a cat named Spencer. Using GPS collected data, we can animate Spencer over time to see his patterns of exploration in his neighborhood.',
    short_description: 'Mapping your GPS data was never so easy!',
    icon: 'points',
    color: '#AC638B',
    difficulty: 'easy',
    duration: '1:53',
    videoId: '122308076',
    map: {
      url: 'https://examples.carto.com/viz/00c8701c-c121-11e4-b828-0e4fddd5de28/embed_map',
      source: [
        'https://examples.carto.com/api/v2/sql?q=SELECT%20*%20FROM%20spencer_the_cat&filename=spencer_the_cat&format=geojson'
      ]
    }
  },
  {
    name: 'Create your own data using the CARTO Editor',
    short_name: 'Create your own datasets',
    description: 'Learn to create your own point, line, or polygon dataset directly in the CARTO editor.',
    short_description: ' Add and style features in a map using the CARTO UI',
    icon: 'notes',
    color: '#F2C000',
    difficulty: 'easy',
    duration: '5:39',
    videoId: '122308073',
    map: {
      url: 'https://examples.carto.com/viz/eaa226aa-cd8e-11e4-893e-0e0c41326911/embed_map'
    }
  },
  {
    name: 'Map your local world',
    short_name: 'Map your local world',
    description: "We will use a publically available set of buildings to map Nantucket Island. Then we will use CARTO's annotation tools to highlight our point of interest.",
    short_description: 'Learn to create and style a map of your city',
    icon: 'mountain',
    color: '#EA703D',
    difficulty: 'easy',
    duration: '2:57',
    videoId: '122308073',
    map: {
      url: 'https://examples.carto.com/viz/b8847e3e-c1f4-11e4-8c09-0e853d047bba/embed_map',
      source: [
        'https://examples.carto.com/api/v2/sql?q=SELECT%20*%20FROM%20structures_poly_197&filename=buildings_nantucket&format=geojson'
      ]
    }
  },
  {
    name: 'Create your first choropleth map using Table Join',
    short_name: 'Join Datasets',
    description: 'Create your first choropleth map by joining historic tornado data with United States polygons',
    short_description: 'Build your first choropleth map by joining two datasets',
    icon: 'rectangles',
    color: '#86B765',
    difficulty: 'medium',
    duration: '5:17',
    videoId: '122308079',
    map: {
      url: 'https://examples.carto.com/viz/339c7670-cd90-11e4-ab8c-0e018d66dc29/embed_map',
      source: [
        'https://examples.carto.com/api/v2/sql?q=SELECT%20*%20FROM%20tornado_centroids&filename=tornados&format=geojson',
        'https://examples.carto.com/api/v2/sql?q=SELECT%20*%20FROM%20tornados_in_us&filename=tornados_us&format=geojson'
      ]
    }
  },
  {
    name: 'Map your MailChimp Campaigns',
    short_name: 'Map MailChimp Campaigns',
    description: 'Create a map of where your subscribers are and which of them have opened any of your campaigns. Also this is a great way to learn about conditional styling.',
    short_description: 'Map your engagement using the MailChimp Connector.',
    icon: 'email',
    color: '#AC638B',
    difficulty: 'easy',
    duration: '1:49',
    videoId: '125895396',
    map: {
      url: 'https://examples.carto.com/viz/560de38c-ea88-11e4-aac4-0e5e07bb5d8a/embed_map',
      source: []
    }
  }
]

},{}],99:[function(require,module,exports){
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

},{}],100:[function(require,module,exports){
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

},{}],101:[function(require,module,exports){
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

},{"./scroll.tpl":102,"perfect-scrollbar":164}],102:[function(require,module,exports){
var _ = require('underscore');
module.exports = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div class="ScrollView-wrapper js-wrapper js-perfect-scroll">\n  <div class="ScrollView-content js-content"></div>\n</div>\n';
}
return __p;
};

},{"underscore":188}],103:[function(require,module,exports){
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

},{}],104:[function(require,module,exports){
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

},{}],105:[function(require,module,exports){
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

},{}],106:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var Backbone = (typeof window !== "undefined" ? window['Backbone'] : typeof global !== "undefined" ? global['Backbone'] : null);
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);

module.exports = cdb.core.Model.extend({
  sync: function (method, model, options) {
    return Backbone.sync('update', model, options);
  },

  url: function () {
    var baseUrl = this._configModel.get('url_prefix');
    return baseUrl + '/api/v3/notifications/' + this.get('key');
  },

  initialize: function (attrs, opts) {
    if (!opts.key) throw new Error('key is required');
    if (!opts.configModel) throw new Error('configModel is required');

    this._configModel = opts.configModel;
    this.attributes = _.extend({ notifications: attrs }, { key: opts.key });
  },

  getKey: function (key) {
    var notifications = this.get('notifications') || {};
    return notifications[key];
  },

  setKey: function (key, value) {
    var notifications = this.get('notifications') || {};
    notifications[key] = value;
    this.set('notifications', notifications);
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],107:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);
var DASHBOARD_NOTIFICATION_KEY = 'builder_activated';

module.exports = cdb.core.View.extend({
  className: 'js-builderNotification',
  events: {
    'click .js-close': '_onClose'
  },

  initialize: function () {
    if (!this.options.notification) { throw new Error('notification is required'); }

    this._notification = this.options.notification;
    this._template = cdb.templates.getTemplate('common/user_notification/user_notification');

    this.render();
  },

  render: function () {
    this.$el.html(this._template());

    $('body').prepend(this.$el);
    return this;
  },

  _onClose: function () {
    this._notification.setKey(DASHBOARD_NOTIFICATION_KEY, true);
    this._notification.save();

    this.clean();
  },

  clean: function () {
    this.constructor.__super__.clean.apply(this);
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],108:[function(require,module,exports){
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

},{"./views/base_dialog/view":113}],109:[function(require,module,exports){
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

},{}],110:[function(require,module,exports){
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

},{}],111:[function(require,module,exports){
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

},{}],112:[function(require,module,exports){
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

},{}],113:[function(require,module,exports){
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

},{}],114:[function(require,module,exports){
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

},{}],115:[function(require,module,exports){
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

},{"../../../view_helpers/navigate_through_router":110}],116:[function(require,module,exports){
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

},{"./model":118,"./organization-model":119}],117:[function(require,module,exports){
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

},{"../../../../common/view_factory":108,"../../../scroll/scroll-view":101}],118:[function(require,module,exports){
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

},{}],119:[function(require,module,exports){
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

},{"./model":118}],120:[function(require,module,exports){
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

},{"./collection":116,"./dropdown_view":117}],121:[function(require,module,exports){
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

},{"../../view_helpers/bytes_to_size":109}],122:[function(require,module,exports){
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

},{}],123:[function(require,module,exports){
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

},{"./dashboard_header/breadcrumbs/dropdown_view":115,"./dashboard_header/notifications/view":120,"./dashboard_header/settings_dropdown_view":121,"./dashboard_header/user_support_view":122}],124:[function(require,module,exports){
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

},{"../../forms/spinner":94}],125:[function(require,module,exports){
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

},{}],126:[function(require,module,exports){
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

},{}],127:[function(require,module,exports){
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

},{}],128:[function(require,module,exports){
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

},{"../../view_factory":108,"../../view_helpers/random_quote":112,"../pagination/model":129,"../pagination/view":130}],129:[function(require,module,exports){
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

},{}],130:[function(require,module,exports){
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

},{"../../view_helpers/navigate_through_router":110}],131:[function(require,module,exports){
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

},{}],132:[function(require,module,exports){
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

},{}],133:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var BackgroundPollingModel = require('../common/background_polling/background_polling_model');

/**
 *  Background polling model for the dashboard context.
 */

module.exports = BackgroundPollingModel.extend({

  _onImportsStateChange: function(importsModel) {
    // Redirect to dataset/map url?
    if (( this.importsCollection.size() - this.importsCollection.failedItems().length ) === 1 &&
        importsModel.hasCompleted() &&
        importsModel.imp.get('tables_created_count') === 1 &&
        importsModel.imp.get('service_name') !== 'twitter_search') {
      var vis = importsModel.importedVis();
      if (vis) {
        this._redirectTo(encodeURI(vis.viewUrl(this.user).edit()));
        return;
      }
    }

    if (importsModel.hasCompleted()) {
      this.trigger('importCompleted', importsModel, this);
    }
  },

  _redirectTo: function(url) {
    window.location = url;
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../common/background_polling/background_polling_model":1}],134:[function(require,module,exports){
(function (global){
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
cdb.admin = (typeof window !== "undefined" ? window['cdb']['admin'] : typeof global !== "undefined" ? global['cdb']['admin'] : null);

var FiltersView = require('./filters_view');
var ListView = require('./list_view');
var ContentResult = require('./content_result_view');
var OnboardingView = require('./onboarding_view');
var ContentFooterView = require('./content_footer/view');
var LoadingLibraryView = require('./datasets/loading_library_view');

module.exports = cdb.core.View.extend({

  initialize: function() {
    this.user = this.options.user;
    this.router = this.options.router;
    this.localStorage = this.options.localStorage;

    this._initViews();
    this._initBindings();
  },

  _initBindings: function() {
    this.router.model.bind('change', this._onRouterChange, this);
    this.collection.bind('reset', this._onDataFetched, this);
    this.collection.bind('loading', this._onDataLoading, this);
    this.collection.bind('add', this._onDataChange, this);
    this.collection.bind('error', function(col, e, opts) {
      // Old requests can be stopped, so aborted requests are not
      // considered as an error
      if (!e || (e && e.statusText !== "abort")) {
        this._onDataError()
      }
    }, this);

    // Binding window scroll :(
    $(window).bind('scroll', this._onWindowScroll);

    this.add_related_model(this.router.model);
    this.add_related_model(this.collection);
  },

  _initViews: function() {
    this.controlledViews = {};  // All available views
    this.enabledViews = [];     // Visible views

    var onboardingView = new OnboardingView({
      user: this.user
    });
    this.controlledViews['onboarding'] = onboardingView;
    this.$el.prepend(onboardingView.render().el);
    this.addView(onboardingView);

    var filtersView = new FiltersView({
      el:           this.$('.Filters'),
      headerHeight: this.options.headerHeight,
      user:         this.user,
      router:       this.router,
      collection:   this.collection,
      localStorage: this.localStorage
    });

    this.controlledViews['filters'] = filtersView;
    filtersView.render();
    this.addView(filtersView);

    var noDatasetsView = new ContentResult({
      className:  'ContentResult no-datasets',
      user:       this.user,
      router:     this.router,
      collection: this.collection,
      template:   'dashboard/views/content_no_datasets'
    });
    noDatasetsView.bind('connectDataset', function() {
      if (this.user && this.user.canCreateDatasets()) {
        cdb.god.trigger(
          'openCreateDialog',
          {
            type: 'dataset'
          }
        );
      }
    }, this);

    this.controlledViews['no_datasets'] = noDatasetsView;
    this.$('.NoDatasets').append(noDatasetsView.render().el);
    this.addView(noDatasetsView);

    var listView = new ListView({
      user:         this.user,
      router:       this.router,
      collection:   this.collection
    });

    var self = this;

    cdb.god.bind('onTemplateSelected', function(id) {
      if (self.player) {
        self.player.close();
      }
    });

    cdb.god.bind('startTutorial', function(id) {
      self._addVideoPlayer(id);
    });

    this._addVideoPlayer();

    this.controlledViews['list'] = listView;
    this.$('#content-list').append(listView.render().el);
    this.addView(listView);

    var noResultsView = new ContentResult({
      router:     this.router,
      collection: this.collection,
      template:   'dashboard/views/content_no_results',
    });

    this.controlledViews['no_results'] = noResultsView;
    this.$el.append(noResultsView.render().el);
    this.addView(noResultsView);

    var errorView = new ContentResult({
      router:     this.router,
      collection: this.collection,
      template:   'dashboard/views/content_error'
    });

    var loadingLibrary = new LoadingLibraryView();
    this.controlledViews['loading_library'] = loadingLibrary;
    this.$el.append(loadingLibrary.render().el);
    this.addView(loadingLibrary);

    this.controlledViews['error'] = errorView;
    this.$el.append(errorView.render().el);
    this.addView(errorView);

    var mainLoaderView = new ContentResult({
      router:     this.router,
      collection: this.collection,
      template:   'dashboard/views/content_loader'
    });

    this.controlledViews['main_loader'] = mainLoaderView;
    this.$el.append(mainLoaderView.render().el);
    this.addView(mainLoaderView);

    // No need to call render, will render itself upon initial collection fetch
    var contentFooter = new ContentFooterView({
      el:         this.$('#content-footer'),
      model:      this.user,
      router:     this.router,
      collection: this.collection
    });

    this.controlledViews['content_footer'] = contentFooter;
    // Move element to end of the parent, if not paginator will appear
    // before other elements
    this.$('#content-footer').appendTo(this.$el);
    this.addView(contentFooter);
  },

  _onRouterChange: function(m, c) {
    var blocks = [];

    if (c && c.changes && c.changes.content_type) {
      // If it changes to a different type (or tables or visualizations)
      // Show the main loader
      blocks = [ 'filters', 'main_loader' ];
    } else {
      blocks = ['filters'];

      if (this._isBlockEnabled('list') && this.collection.total_user_entries > 0) {
        // If list was enabled, keep it visible
        blocks.push('list', 'content_footer');
      } else {
        blocks.push('main_loader');
      }

      // If no_results was enabled, keep it visible
      if (this._isBlockEnabled('no_results') || this._isBlockEnabled('error')) {
        if (!_.contains(blocks, 'main_loader')) {
          blocks.push('main_loader');
        }
      }
    }

    this._hideBlocks();
    this._showBlocks(blocks);
    this._scrollToTop();
  },

  _onDataLoading: function() {
    this.$el.removeClass('on-boarding');
  },

  /**
   * Arguments may vary, depending on if it's the collection or a model that triggers the event callback.
   * @private
   */
  _onDataFetched: function() {
    var activeViews = [ 'filters', 'content_footer' ];
    var tag = this.router.model.get('tag');
    var q = this.router.model.get('q');
    var shared = this.router.model.get('shared');
    var liked = this.router.model.get('liked');
    var locked = this.router.model.get('locked');
    var library = this.router.model.get('library');

    if (library && this.collection.total_user_entries === 0) {
      activeViews.push('no_datasets');
    }

    if (this.collection.size() === 0) {
      if (!tag && !q && shared === "no" && !locked && !liked) {

        if (this.router.model.get('content_type') === "maps") {
          // If there are no maps, let's show onboarding
          if (this.collection.total_shared > 0) {
            this.router.navigate(this.user.viewUrl().dashboard().maps().urlToPath('shared'), { trigger: true });
            return;
          } else {
            this.$el.addClass('on-boarding');
            activeViews = ['onboarding', 'filters'];
          }
        } else if (library) {
          // Library is loaded async on 1st visit by user, so this code path is only reached until the library has been
          // stocked up. Show an intermediate loading info, and retry fetching data until while user stays here.
          // See https://github.com/CartoDB/cartodb/pull/2741 for more details.
          activeViews.push('loading_library');
          this.controlledViews['loading_library'].retrySoonAgainOrAbortIfLeavingLibrary(this.collection, this.router.model);
        } else if (!library && this.router.model.get('content_type') === "datasets") {
          if (this.collection.total_shared > 0) {
            this.router.navigate(this.user.viewUrl().dashboard().datasets().urlToPath('shared'), { trigger: true });
            return;
          } else if (this.user.hasCreateDatasetsFeature() && cdb.config.get('data_library_enabled')) {
            this.router.navigate(this.user.viewUrl().dashboard().datasets().dataLibrary(), { trigger: true });
            return;
          } else {
            activeViews.push('no_results');
          }
        } else {

          // None of the rest, no-results
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

  _onDataChange: function() {
    // Fetch collection again to check if current
    // view has suffered a change
    this.collection.fetch();
  },

  _onDataError: function(e) {
    this._hideBlocks();
    this._showBlocks([ 'filters', 'error' ]);
  },

  _showBlocks: function(views) {
    var self = this;
    if (views) {
      _.each(views, function(v){
        self.controlledViews[v].show();
        self.enabledViews.push(v);
      })
    } else {
      self.enabledViews = [];
      _.each(this.controlledViews, function(v){
        v.show();
        self.enabledViews.push(v);
      })
    }
  },

  _hideBlocks: function(views) {
    var self = this;
    if (views) {
      _.each(views, function(v){
        self.controlledViews[v].hide();
        self.enabledViews = _.without(self.enabledViews, v);
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
  },

  _scrollToTop: function() {
    $('body').animate({ scrollTop: 0 }, 550);
  },


  _addVideoPlayer: function(id) {
    var opts = { id: id };

    this.player = new cdb.admin.VideoPlayer(opts);

    if (this.player.hasVideoData()) {
      this.$el.append(this.player.render().$el);
    }
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./content_footer/view":135,"./content_result_view":136,"./datasets/loading_library_view":138,"./filters_view":143,"./list_view":145,"./onboarding_view":151}],135:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var PaginationModel = require('../../common/views/pagination/model');
var PaginationView = require('../../common/views/pagination/view');
var pluralizeString = require('../../common/view_helpers/pluralize_string');
var navigateThroughRouter = require('../../common/view_helpers/navigate_through_router');

var filterShortcutId = 'filter-shortcut';
var events = {};
events['click #' + filterShortcutId + ' a'] = navigateThroughRouter;

/**
 * Responsible for the content footer of the layout.
 *  ___________________________________________________________________________
 * |                                                                           |
 * | [show your locked datasets/maps]           Page 2 of 42 [1] 2 [3][4][5]  |
 * |___________________________________________________________________________|
 *
 */
module.exports = cdb.core.View.extend({

  events: events,

  initialize: function(args) {
    if (!args.el) throw new Error('The root element must be provided from parent view');

    this.collection = args.collection;
    this.router = args.router;
    this.router.model.bind('change', this.render, this);
    this.add_related_model(this.router.model);

    this._createPaginationView(this.collection, this.router);
    this._setupFilterShortcut(this.collection, this.router);
  },

  render: function() {
    this.clearSubViews();

    this._renderFilterShortcut();
    this._renderPaginationView();

    return this;
  },

  _createPaginationView: function(collection, router) {
    var model = new PaginationModel({
      current_page: router.model.get('page'),
      url_to: function(page) { return router.currentUrl({ page: page }) }
    });

    // Some properties (e.g. total_entries) cannot be observed, so listen to all changes and update model accordingly
    collection.bind('all', _.partial(this._updatePaginationModelByCollection, model, collection));
    router.model.bind('change', _.partial(this._updatePaginationModelByRouter, model, router.model));

    this.paginationView = new PaginationView({
      model:  model,
      router: this.router
    });
    this.addView(this.paginationView);
  },

  _updatePaginationModelByCollection: function(model, collection) {
    model.set({
      per_page:    collection.options.get('per_page'),
      total_count: collection.total_entries
    });
  },

  _updatePaginationModelByRouter: function(model, routerModel) {
    model.set('current_page', routerModel.get('page'));
  },

  _renderFilterShortcut: function() {
    // Create DOM placeholder for first render..
    this.$el.append('<div id="' + filterShortcutId + '"></div>');

    // ..for subsequent render simply replace the placeholder's content (by overriding this fn to):
    this._renderFilterShortcut = function() {
      var html = '';

      var rModel = this.router.model;
      var currentUrl = this.router.currentDashboardUrl();
      var totalCount = this.filterShortcutVis.total_entries;
      var d = {
        totalCount:         totalCount,
        pluralizedContents: this._pluralizedContentType(totalCount),
        url:                rModel.get('locked') ? currentUrl : currentUrl.lockedItems()
      };

      if (rModel.get('locked')) {
        html = this.filterShortcutNonLockedTemplate(d);
      } else if (totalCount > 0 && this._isLockInfoNeeded()) {
        html = this.filterShortcutLockedTemplate(d);
      }

      this.$('#'+ filterShortcutId).html(html);
    }
  },

  _pluralizedContentType: function(totalCount) {
    var contentTypeWithoutTrailingS = this.router.model.get('content_type').slice(0, -1);
    return pluralizeString(contentTypeWithoutTrailingS, totalCount);
  },

  _setupFilterShortcut: function(collection, router) {
    this.filterShortcutLockedTemplate =    cdb.templates.getTemplate('dashboard/content_footer/filter_shortcut/locked_template');
    this.filterShortcutNonLockedTemplate = cdb.templates.getTemplate('dashboard/content_footer/filter_shortcut/non_locked_template');
    this.filterShortcutVis = new cdb.admin.Visualizations();
    collection.bind('loaded', this._updateFilterShortcut, this);
    this.add_related_model(collection);
  },

  _isLockInfoNeeded: function() {
    return this.router.model.get('shared') === 'no' &&
      !this.router.model.get('library') &&
      !this.router.model.isSearching();
  },

  _updateFilterShortcut: function() {
    if (this._isLockInfoNeeded()) {
      this.filterShortcutVis.options.set({
        locked:         !this.router.model.get('locked'),
        shared:         'no',
        page:           1,
        per_page:       1,
        only_liked:     this.router.model.get('liked'),
        q:              this.router.model.get('q'),
        tag:            this.router.model.get('tags'),
        type:           this.router.model.get('content_type') === 'datasets' ? 'table' : 'derived'
      });

      var self = this;
      this.filterShortcutVis.fetch({
        success: function(c) {
          self.render();
        }
      });
    } else {
      this.render();
    }
  },

  _renderPaginationView: function() {
    this.paginationView.render();
    this.$el.append(this.paginationView.el);
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../common/view_helpers/navigate_through_router":110,"../../common/view_helpers/pluralize_string":111,"../../common/views/pagination/model":129,"../../common/views/pagination/view":130}],136:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
cdb.admin = (typeof window !== "undefined" ? window['cdb']['admin'] : typeof global !== "undefined" ? global['cdb']['admin'] : null);
var navigateThroughRouter = require('../common/view_helpers/navigate_through_router');
var randomQuote = require('../common/view_helpers/random_quote');

/*
 *  Content result default view
 */

module.exports = cdb.core.View.extend({

  events: {
    'click .js-mail-link': '_onMailClick',
    'click .js-link': navigateThroughRouter,
    'click .js-connect': '_onConnectClick'
  },

  initialize: function() {
    this.user = this.options.user;
    this.router = this.options.router;
    this.template = cdb.templates.getTemplate(this.options.template);

    this._initBinds();
  },

  render: function() {
    this.$el.html(this.template({
      defaultUrl:     this.router.currentDashboardUrl(),
      page:           this.router.model.get('page'),
      tag:            this.router.model.get('tag'),
      q:              this.router.model.get('q'),
      shared:         this.router.model.get('shared'),
      liked:          this.router.model.get('liked'),
      locked:         this.router.model.get('locked'),
      library:        this.router.model.get('library'),
      isSearching:    this.router.model.isSearching(),
      quote:          randomQuote(),
      type:           this.router.model.get('content_type'),
      totalItems:     this.collection.size(),
      totalEntries:   this.collection.total_entries
    }));

    return this;
  },

  _initBinds: function() {
    this.router.model.bind('change', this.render, this);
    this.collection.bind('remove add reset', this.render, this);
    this.add_related_model(this.router.model);
    this.add_related_model(this.collection);
  },

  _onMailClick: function(e) {
    if (e) {
      e.stopPropagation();
    }
  },

  _onConnectClick: function(e) {
    if (e) {
      e.preventDefault();
    }

    this.trigger('connectDataset', this);
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../common/view_helpers/navigate_through_router":110,"../common/view_helpers/random_quote":112}],137:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var moment = (typeof window !== "undefined" ? window['moment'] : typeof global !== "undefined" ? global['moment'] : null);
var Utils = (typeof window !== "undefined" ? window['cdb']['Utils'] : typeof global !== "undefined" ? global['cdb']['Utils'] : null);
var navigateThroughRouter = require('../../common/view_helpers/navigate_through_router');
var pluralizeString = require('../../common/view_helpers/pluralize_string');
var LikesView = require('../../common/views/likes/view');
var EditableDescription = require('../../dashboard/editable_fields/editable_description');
var EditableTags = require('../../dashboard/editable_fields/editable_tags');
var SyncView = require('../../common/dialogs/sync_dataset/sync_dataset_view');

/**
 * View representing an item in the list under datasets route.
 */
module.exports = cdb.core.View.extend({

  tagName: 'li',
  className: 'DatasetsList-item DatasetsList-item--selectable',

  events: {
    'click .js-tag-link': navigateThroughRouter,
    'click .js-privacy': '_openPrivacyDialog',
    'click .js-sync': '_openSyncDialog',
    'click': '_selectDataset'
  },

  initialize: function() {
    this.user = this.options.user;
    this.router = this.options.router;
    this.template = cdb.templates.getTemplate('dashboard/views/datasets_item');

    this._initBinds();
  },

  render: function() {
    this.clearSubViews();
    var vis = this.model;
    var table = vis.tableMetadata();
    var tags = vis.get('tags') || [];

    var url = vis.viewUrl(this.user);
    url = (this.router.model.get('liked') && !vis.permission.hasAccess(this.user)) ? url.public() : url.edit();

    var d = {
      isRaster:                vis.get('kind') === 'raster',
      geometryType:            table.statsGeomColumnTypes().length > 0 ? table.statsGeomColumnTypes()[0] : '',
      title:                   vis.get('name'),
      datasetUrl:              encodeURI(url),
      isOwner:                 vis.permission.isOwner(this.user),
      owner:                   vis.permission.owner.renderData(this.user),
      showPermissionIndicator: !vis.permission.hasWriteAccess(this.user),
      privacy:                 vis.get('privacy').toLowerCase(),
      likes:                   vis.get('likes') || 0,
      timeDiff:                moment(vis.get('updated_at')).fromNow(),
      tags:                    tags,
      tagsCount:               tags.length,
      router:                  this.router,
      maxTagsToShow:           3,
      rowCount:                undefined,
      datasetSize:             undefined,
      syncStatus:              undefined,
      syncRanAt:               undefined,
      fromExternalSource:      ""
    };

    var rowCount = table.get('row_count');
    if (rowCount >= 0) {
      d.rowCount = ( rowCount < 10000 ? Utils.formatNumber(rowCount) : Utils.readizableNumber(rowCount) );
      d.pluralizedRows = pluralizeString('Row', rowCount);
    }

    if (!_.isEmpty(vis.get("synchronization"))) {
      d.fromExternalSource = vis.get("synchronization").from_external_source;
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

    this._renderDescription();
    this._renderTags();
    this._renderLikesIndicator();
    this._renderTooltips();

    // Item selected?
    this.$el[ vis.get('selected') ? 'addClass' : 'removeClass' ]('is--selected');

    return this;
  },

  _initBinds: function() {
    this.model.on('change', this.render, this);
  },

  _renderDescription: function() {
    var isOwner = this.model.permission.isOwner(this.user);
    var view = new EditableDescription({
      el: this.$('.js-item-description'),
      model: this.model,
      editable: isOwner && this.user.hasCreateDatasetsFeature()
    });
    this.addView(view.render());
  },

  _renderTags: function() {
    var isOwner = this.model.permission.isOwner(this.user);
    var view = new EditableTags({
      el: this.$('.js-item-tags'),
      model: this.model,
      router: this.router,
      editable: isOwner && this.user.hasCreateDatasetsFeature()
    });
    this.addView(view.render());
  },

  _renderLikesIndicator: function() {
    var view = new LikesView({
      model: this.model.like
    });
    this.$('.js-likes-indicator').replaceWith(view.render().el);
    this.addView(view);
  },

  _renderTooltips: function() {
    var synchronization = this.model.get("synchronization");

    if (!_.isEmpty(synchronization)) {
      this.addView(
        new cdb.common.TipsyTooltip({
          el: this.$('.js-syncInfo'),
          title: function(e) {
            return $(this).attr('data-title')
          }
        })
      )
    }

    if (!this.model.permission.isOwner(this.user)) {
      this.addView(
        new cdb.common.TipsyTooltip({
          el: this.$('.UserAvatar'),
          title: function(e) {
            return $(this).attr('data-title')
          }
        })
      )
    }

    if (!_.isEmpty(synchronization) && synchronization.from_external_source) {
      this.addView(
        new cdb.common.TipsyTooltip({
          el: this.$('.js-public'),
          title: function(e) {
            return $(this).attr('data-title')
          }
        })
      )
    }
  },

  _openPrivacyDialog: function(ev) {
    this.killEvent(ev);
    cdb.god.trigger('openPrivacyDialog', this.model);
  },

  _openSyncDialog: function(ev) {
    this.killEvent(ev);
    var view = new SyncView({
      clean_on_hide: true,
      enter_to_confirm: true,
      table: this.model.tableMetadata()
    });

    // Force render of this item after changing sync settings
    var self = this;
    var originalOK = view.ok;
    view.ok = function() {
      originalOK.apply(view, arguments);
      self.model.fetch(); // to force a re-render due to possible changed sync settings
    };

    view.appendToBody();
  },

  _selectDataset: function(ev) {
    // Let links use default behaviour
    if (ev.target.tagName !== 'A') {
      this.killEvent(ev);
      this.model.set('selected', !this.model.get('selected'));
    }
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../common/dialogs/sync_dataset/sync_dataset_view":86,"../../common/view_helpers/navigate_through_router":110,"../../common/view_helpers/pluralize_string":111,"../../common/views/likes/view":126,"../../dashboard/editable_fields/editable_description":140,"../../dashboard/editable_fields/editable_tags":141}],138:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);

/**
 * Data library loading view, since data library is loaded async.
 */
module.exports = cdb.core.View.extend({

  render: function() {
    this.$el.html(
      cdb.templates.getTemplate('common/templates/loading')({
        title: 'Your Data library is being stocked up',
        quote: 'Please wait while we load the list of Datasets in the Data library for you.'
      })
    );

    return this;
  },

  retrySoonAgainOrAbortIfLeavingLibrary: function(collection, routerModel) {
    var timeout;

    var abort = function() {
      clearTimeout(timeout);
      routerModel.unbind('all', abort);
      collection.unbind('reset', abort);
    };

    var retry = function() {
      timeout = setTimeout(function() {
        collection.bind('reset', abort);
        collection.fetch();
      }, 10000);
    };

    routerModel.bind('all', abort);
    retry();
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],139:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var DatasetsItem = require('../../dashboard/datasets/datasets_item');
var navigateThroughRouter = require('../../common/view_helpers/navigate_through_router');
var UploadConfig = require('../../common/background_polling/models/upload_config');
var Utils = (typeof window !== "undefined" ? window['cdb']['Utils'] : typeof global !== "undefined" ? global['cdb']['Utils'] : null);
var pluralizeString = require('../../common/view_helpers/pluralize_string');

/**
 *  Remote dataset item view
 *
 */

module.exports = DatasetsItem.extend({

  tagName: 'li',
  className: 'DatasetsList-item',

  events: {
    'click .js-tag-link': navigateThroughRouter,
    'click': '_selectDataset'
  },

  initialize: function() {
    this.user = this.options.user;
    this.router = this.options.router;
    this.template = cdb.templates.getTemplate('dashboard/views/remote_datasets_item');
    this.table = new cdb.admin.CartoDBTableMetadata(this.model.get('external_source'));

    this._initBinds();
  },

  render: function() {
    var vis = this.model;
    var table = this.table;
    var tags = vis.get('tags') || [];
    var description = vis.get('description') && Utils.stripHTML(markdown.toHTML(vis.get('description'))) || '';
    var source = vis.get('source') && markdown.toHTML(vis.get('source')) || '';

    var d = {
      isRaster:                vis.get('kind') === 'raster',
      geometryType:            table.statsGeomColumnTypes().length > 0 ? table.statsGeomColumnTypes()[0] : '',
      title:                   vis.get('display_name') || vis.get('name'),
      source:                  source,
      description:             description,
      timeDiff:                moment(vis.get('updated_at')).fromNow(),
      tags:                    tags,
      tagsCount:               tags.length,
      router:                  this.router,
      maxTagsToShow:           3,
      canImportDataset:        this._canImportDataset(),
      rowCount:                undefined,
      datasetSize:             undefined,
      fromExternalSource:      ""
    };

    var rowCount = table.get('row_count');
    if (rowCount >= 0) {
      d.rowCount = ( rowCount < 10000 ? Utils.formatNumber(rowCount) : Utils.readizableNumber(rowCount) );
      d.pluralizedRows = pluralizeString('Row', rowCount);
    }

    if (!_.isEmpty(vis.get("synchronization"))) {
      d.fromExternalSource = vis.get("synchronization").from_external_source;
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

  _setItemClasses: function() {
    // Item selected?
    this.$el[ this.model.get('selected') ? 'addClass' : 'removeClass' ]('is--selected');
    // Check if it is selectable
    this.$el[ this._canImportDataset() ? 'addClass' : 'removeClass' ]('DatasetsList-item--selectable');
    // Check if it is importable
    this.$el[ this._canImportDataset() ? 'removeClass' : 'addClass' ]('DatasetsList-item--banned');
  },

  _canImportDataset: function() {
    var table_size = this.table.get('size') || 0;
    return (
        this.user.get('remaining_byte_quota') * UploadConfig.fileTimesBigger >= table_size &&
        this.user.get('limits')['import_file_size'] > table_size
      );
  },

  _selectDataset: function(ev) {
    if (ev.target.tagName !== 'A') {
      // If it fits on user quota, user can select it
      if (this._canImportDataset()) {
        this.killEvent(ev);
        this.model.set('selected', !this.model.get('selected'));
      }
    }
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../common/background_polling/models/upload_config":13,"../../common/view_helpers/navigate_through_router":110,"../../common/view_helpers/pluralize_string":111,"../../dashboard/datasets/datasets_item":137}],140:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);

/**
 *  Editable description
 */
module.exports = cdb.core.View.extend({

  events: {
    "click .js-add-btn": "_edit",
    "click .js-field-input": "killEvent",
    "blur .js-field-input": "_cancelEditing",
    "keydown .js-field-input": "_keyPressed"
  },

  options: {
    editable: true,
    maxLength: 200
  },

  initialize: function() {
    this.template = cdb.templates.getTemplate('dashboard/editable_fields/editable_description');

    // Backbone's className won't work here because we are providing an el
    this.$el.addClass('EditableField');
  },

  render: function() {
    var safeHTML = cdb.core.sanitize.html(markdown.toHTML(this.model.get('description') || ''))
    var value = {
      safeHTML: safeHTML,
      clean: cdb.Utils.stripHTML(safeHTML)
    };
    this.$el.html(this.template({
      value: value,
      editable: this.options.editable,
      maxLength: this.options.maxLength
    }));

    return this;
  },

  _edit: function(ev) {
    this.killEvent(ev);

    this.$el.addClass('is-editing');
    this.$('.js-field-input').val('').focus();
  },

  _keyPressed: function(ev) {
    var escPressed = (ev.keyCode == $.ui.keyCode.ESCAPE);
    var cmdEnterPressed = ((ev.metaKey || ev.ctrlKey) &&  ev.keyCode == $.ui.keyCode.ENTER);
    var enterPressed = (ev.keyCode == $.ui.keyCode.ENTER);
    var currentText = this.$('.js-field-input').val();

    if (cmdEnterPressed) {
      ev.preventDefault();
      this._addNewLine();
    } else if (enterPressed && currentText.trim() != '') {
      ev.preventDefault();
      this._save();
    } else if (escPressed) {
      this._cancelEditing();
    }
  },

  _addNewLine: function() {
    var $input = this.$('.js-field-input');
    $input.val($input.val() + "\n");

    // Scroll to bottom of the textarea
    $input[0].scrollTop = $input[0].scrollHeight;
  },

  _save: function() {
    var attributes = {
      description: this.$('.js-field-input').val()
    };
    this.model.save(attributes);
    this.$el.removeClass('is-editing');
    this.render();
  },

  _cancelEditing: function() {
    this.$el.removeClass('is-editing');
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],141:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);

/**
 *  Editable tags
 */
module.exports = cdb.core.View.extend({

  events: {
    "click .js-add-btn": "_edit",
    "click .js-field-input": "killEvent",
    "keydown .js-field-input": "_keyPressed",
    "blur .js-field-input": "_cancelEditing"
  },

  initialize: function() {
    this.template = cdb.templates.getTemplate('dashboard/editable_fields/editable_tags');
    this.editable = this.options.editable;

    // Backbone's className won't work here because we are providing an el
    this.$el.addClass('EditableField');
  },

  render: function() {
    var self = this;
    var tags = this.model.get('tags') || [];
    this.$el.html(this.template({
      tags: _.compact(tags),
      tagsCount: tags.length,
      editable: this.editable,
      router: this.options.router
    }));

    return this;
  },

  _edit: function(ev) {
    this.killEvent(ev);
    this.$el.addClass('is-editing');
    this.$('.js-field-input').val('').focus();
  },

  _keyPressed: function(ev) {
    var enterPressed = (ev.keyCode == $.ui.keyCode.ENTER);
    var escapePressed = (ev.keyCode == $.ui.keyCode.ESCAPE);
    if (enterPressed) {
      this._save();
    } else if (escapePressed) {
      this._cancelEditing();
    }
  },

  _save: function() {
    var tags = this.$('.js-field-input').val().split(',').map(function(tag){
      return cdb.Utils.stripHTML(tag.trim());
    })
    tags = _.chain(tags).compact().uniq().value();
    this.model.save({
      tags: tags
    });
    this.$el.removeClass('is-editing');
    this.render();
  },

  _cancelEditing: function(ev) {
    this.$el.removeClass('is-editing');
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],142:[function(require,module,exports){
(function (global){
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var Router = require('./router');
var MainView = require('./main_view');
var ChangePrivacyDialog = require('../common/dialogs/change_privacy/change_privacy_view');
var CreateDialog = require('../common/dialogs/create/create_view');
var CreateDatasetModel = require('../common/dialogs/create/create_dataset_model');
var CreateMapModel = require('../common/dialogs/create/create_map_model');
var VideoTutorialView = require('../common/dialogs/video_tutorial/video_tutorial_view');
var UserNotificationView = require('../common/user_notification/user_notification_view');
var UserNotificationModel = require('../common/user_notification/user_notification_model');
var DEFAULT_VIS_NAME = 'Untitled map';

if (window.trackJs) {
  window.trackJs.configure({
    userId: window.user_data.username
  });
}

/**
 * Entry point for the new dashboard, bootstraps all dependency models and application.
 */
$(function() {
  cdb.init(function() {
    cdb.templates.namespace = 'cartodb/';
    cdb.config.set('url_prefix', user_data.base_url);
    cdb.config.set('default_fallback_basemap', window.default_fallback_basemap);

    // TODO: This is still necessary implicitly, for the Backbone.sync method to work (set in app.js)
    //       once that case is removed we could skip cdb.config completely.
    cdb.config.set(window.config); // import config

    var currentUser = new cdb.admin.User(window.user_data);

    cdb.config.set('user', currentUser);
    var router = new Router({
      dashboardUrl: currentUser.viewUrl().dashboard()
    });

    if (!cdb.config.get('cartodb_com_hosted')) {
      if (currentUser.get('actions').builder_enabled && currentUser.get('show_builder_activated_message') &&
          _.isEmpty(window.dashboard_notifications)) {
        var userNotificationModel = new UserNotificationModel(window.dashboard_notifications, {
          key: 'dashboard',
          configModel: cdb.config
        });

        var dashboardNotification = new UserNotificationView({
          notification: userNotificationModel
        });

        window.dashboardNotification = dashboardNotification;
      }
    }

    // Why not have only one collection?
    var collection =  new cdb.admin.Visualizations();

    var dashboard = new MainView({
      el: document.body,
      collection: collection,
      user: currentUser,
      config: window.config,
      router: router
    });
    window.dashboard = dashboard;

    router.enableAfterMainView();

    var metrics = new cdb.admin.Metrics();

    // Event tracking "Visited Dashboard"
    cdb.god.trigger('metrics', 'visited_dashboard', {
      email: window.user_data.email
    });

    if (window.isJustLoggedIn) {
      // Event tracking "Logged in"
      cdb.god.trigger('metrics', 'logged_in', {
        email: window.user_data.email
      });
    }

    if (window.isFirstTimeViewingDashboard) {
      // Event tracking "Visited Dashboard for the first time"
      cdb.god.trigger('metrics', 'visited_dashboard_first_time', {
        email: window.user_data.email
      });
    }

    cdb.god.bind('openPrivacyDialog', function(vis) {
      if (vis.isOwnedByUser(currentUser) && currentUser.hasCreateDatasetsFeature()) {
        var dialog = new ChangePrivacyDialog({
          vis: vis,
          user: currentUser,
          enter_to_confirm: true,
          clean_on_hide: true
        });
        dialog.appendToBody();
      }
    });

    cdb.god.bind('openCreateDialog', function(d) {
      var createModel;
      d = d || {};
      if (d.type === 'dataset') {
        createModel = new CreateDatasetModel({}, {
          user: currentUser
        });
      } else {
        createModel = new CreateMapModel({}, _.extend({
          user: currentUser
        }, d));
      }

      var createDialog = new CreateDialog({
        model: createModel,
        user: currentUser,
        clean_on_hide: true
      });

      createModel.bind('startTutorial', function() {
        createDialog.close();

        var dlg = new VideoTutorialView({
          clean_on_hide: true,
          enter_to_confirm: false
        })
        cdb.god.trigger("onTemplateSelected", this);
        dlg.appendToBody();
      });

      createModel.bind('datasetCreated', function(tableMetadata) {
        if (router.model.isDatasets()) {
          var vis = new cdb.admin.Visualization({ type: 'table' });
          vis.permission.owner = currentUser;
          vis.set('table', tableMetadata.toJSON());
          window.location = vis.viewUrl(currentUser).edit();
        } else {
          var vis = new cdb.admin.Visualization({ name: DEFAULT_VIS_NAME });
          vis.save({
            tables: [ tableMetadata.get('id') ]
          },{
            success: function(m) {
              window.location = vis.viewUrl(currentUser).edit();
            },
            error: function(e) {
              createDialog.close();
              collection.trigger('error');
            }
          });
        }
      }, this);

      createDialog.appendToBody();
      createModel.viewsReady();
    });
  });
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../common/dialogs/change_privacy/change_privacy_view":26,"../common/dialogs/create/create_dataset_model":39,"../common/dialogs/create/create_map_model":44,"../common/dialogs/create/create_view":45,"../common/dialogs/video_tutorial/video_tutorial_view":93,"../common/user_notification/user_notification_model":106,"../common/user_notification/user_notification_view":107,"./main_view":146,"./router":152}],143:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var Utils = (typeof window !== "undefined" ? window['cdb']['Utils'] : typeof global !== "undefined" ? global['cdb']['Utils'] : null);
var navigateThroughRouter = require('../common/view_helpers/navigate_through_router');
var pluralizeString = require('../common/view_helpers/pluralize_string');
var DuplicateMap = require('../common/dialogs/duplicate_vis_view');
var DeleteItemsDialog = require('../common/dialogs/delete_items_view');
var ChangeLockDialog = require('../common/dialogs/change_lock/change_lock_view');
var ChangeLockViewModel = require('../common/dialogs/change_lock/change_lock_view_model');
var DeleteItemsViewModel = require('../common/dialogs/delete_items_view_model');

/**
 *  Dashboard filters.
 *
 *  - 'Order by' (time,likes,etc) collection.
 *  - 'Filter by' collection.
 *  - 'Search' any pattern within collection.
 *
 */
module.exports = cdb.core.View.extend({

  _TOOLTIPS: ['js-likes', 'js-mapviews', 'js-updated_at', 'js-size'],

  events: {
    'submit .js-search-form':   '_submitSearch',
    'keydown .js-search-form':  '_onSearchKeyDown',
    'click .js-search-form':    'killEvent',
    'click .js-search-link':    '_onSearchClick',
    'click .js-clean-search':   '_onCleanSearchClick',
    'click .js-deselect_all':   '_unselectAll',
    'click .js-select_all':     '_selectAll',
    'click .js-order-link':     '_changeOrder',
    'click .js-delete':         '_openDeleteItemsDialog',
    'click .js-create_map':     '_createMap',
    'click .js-import_remote':  '_importRemote',
    'click .js-new_dataset':    '_connectDataset',
    'click .js-duplicate_dataset': '_duplicateDataset',
    'click .js-duplicate_map':  '_duplicateMap',
    'click .js-new_map':        '_newMap',
    'click .js-lock':           '_openChangeLockDialog',
    'click .js-privacy':        '_openPrivacyDialog',
    'click .js-link':           navigateThroughRouter
  },

  initialize: function() {
    this.router = this.options.router;
    this.user = this.options.user;
    this.localStorage = this.options.localStorage;
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
    var $filtersInner = $('<div>').addClass('Filters-inner js-skip-unselect-all');
    this.$el.append($uInner.append($filtersInner));
  },

  render: function(m, c) {
    this.clearSubViews();

    var selectedItemsCount = this._selectedItems().length;
    // If a change is made from content type we have to know
    // preventing show wrong data about total items
    var changedContentType = c && c.changes && c.changes.content_type;
    var routerContentType = this.router.model.get('content_type');
    var isDeepInsights = this.router.model.isDeepInsights();
    var contentType = isDeepInsights ? 'dashboard' : routerContentType.slice(0, -1);

    var template = cdb.templates.getTemplate(
      isDeepInsights ? 'dashboard/views/filters_deep_insights' : 'dashboard/views/filters'
    );

    var pluralizedContentType = pluralizeString(
      contentType,
      changedContentType ? 0 : this.collection.total_user_entries
    );

    var pluralizedContentTypeSelected = pluralizeString(contentType, selectedItemsCount)

    this.$('.Filters-inner').html(
      template(
        _.extend({
            canCreateDatasets: this.user.canCreateDatasets(),
            hasCreateMapsFeature: this.user.hasCreateMapsFeature(),
            hasCreateDatasetsFeature: this.user.hasCreateDatasetsFeature(),
            canDeleteItems: this._canDeleteSelectedItems(),
            order: this.localStorage.get('dashboard.order'),
            isInsideOrg: this.user.isInsideOrg(),
            isMaps: this.router.model.isMaps(),
            selectedItemsCount: selectedItemsCount,
            isSelectedItemLibrary: this._isSelectedItemLibrary(),
            maxLayersByMap: this.user.getMaxLayers(),
            totalShared: changedContentType ? 0 : this.collection.total_shared,
            totalLiked: changedContentType ? 0 : this.collection.total_likes,
            totalItems: changedContentType ? 0 : this.collection.total_user_entries,
            pageItems: this.collection.size(),
            router: this.router,
            currentDashboardUrl: this.router.currentDashboardUrl(),
            pluralizedContentType: pluralizedContentType,
            pluralizedContentTypeSelected: pluralizedContentTypeSelected
          },
          this.router.model.attributes
        )
      )
    );

    this._initViews();
    this._checkScroll();
    this._animate();

    if (this.router.model.isSearching()) {
      this._focusSearchInput();
    }

    return this;
  },

  _initBinds: function() {
    this.model.on('change:isSearchEnabled', this._onChangeIsSearchEnabled, this);
    this.router.model.bind('change', this.render, this);
    this.collection.bind('loading', function() {
      this.$el.removeClass('is-relative');
    }, this);
    this.collection.bind('add remove change reset', this.render, this);
    this.user.bind('change:remaining_byte_quota', this.render, this);
    cdb.god.bind('closeDialogs', this._animate, this);
    cdb.god.bind('unselectAllItems', this._unselectAll, this);
    _.bindAll(this, '_onWindowScroll');


    this.add_related_model(this.collection);
    this.add_related_model(this.router.model);
    this.add_related_model(this.user);
    this.add_related_model(cdb.god);
  },

  _checkScroll: function() {
    var content_type = this.router.model.get('content_type');
    var shared = this.router.model.get('shared');
    var locked = this.router.model.get('locked');
    var liked = this.router.model.get('liked');
    var search = this.router.model.isSearching();
    var total_entries = this.collection.total_entries;

    // Bind scroll
    if (total_entries === 0 && content_type === "maps" && shared === "no" && !locked && !liked && !search) {
      // If there is no maps, onboarding should appear
      // and filters block should be after that section
      this.$el.addClass('is-relative');
      this._unbindScroll();
    } else {
      this.$el.removeClass('is-relative');
      this._bindScroll();
    }
  },

  _bindScroll: function() {
    this._unbindScroll();
    $(window).bind('scroll', this._onWindowScroll);
  },

  _unbindScroll: function() {
    $(window).unbind('scroll', this._onWindowScroll);
  },

  _initViews: function() {
    // Tipsys?
    var self = this;
    _.each(this._TOOLTIPS, function(el) {
      self.addView(
        new cdb.common.TipsyTooltip({
          el: self.$('.' + el),
          title: function() {
            var isFixed = self.$el.hasClass('is-fixed');
            return isFixed ? '' : 'Order by ' + $(this).attr('data-title');
          }
        })
      )
    });
  },

  _selectedItems: function() {
    return this.collection.where({ selected: true });
  },

  _animate: function() {
    this.$('.Filters-inner').toggleClass('show-second-row', this._selectedItems().length > 0);
    this._enableSearchUI(!!this.router.model.isSearching());
  },

  _selectAll: function(e) {
    this._select(e, true);
  },

  _unselectAll: function(e) {
    this._select(e, false);
  },

  _select: function(e, val) {
    this.killEvent(e);
    var user = this.user;
    this.collection.each(function(vis) {
      vis.set('selected', val);
    });
  },

  _openDeleteItemsDialog: function(e) {
    e.preventDefault();

    var viewModel = new DeleteItemsViewModel(this._selectedItems(), {
      contentType: this.router.model.get('content_type')
    });

    viewModel.bind('DeleteItemsDone', function() {
      this.user.fetch(); // needed in order to keep the "quota" synchronized
      this.collection.fetch();
    }, this);

    var view = new DeleteItemsDialog({
      viewModel: viewModel,
      user: this.user,
      clean_on_hide: true,
      enter_to_confirm: true
    });

    view.appendToBody();
  },

  _openChangeLockDialog: function(e) {
    e.preventDefault();

    var viewModel = new ChangeLockViewModel({
      items: this._selectedItems(),
      contentType: this.router.model.get('content_type')
    });
    viewModel.bind('change:state', function() {
      if (viewModel.get('state') === 'ProcessItemsDone') {
        this.collection.fetch();
      }
    }, this);

    var view = new ChangeLockDialog({
      model: viewModel,
      clean_on_hide: true,
      enter_to_confirm: true
    });

    view.appendToBody();
  },

  _openPrivacyDialog: function(e) {
    e.preventDefault();
    cdb.god.trigger('openPrivacyDialog', this._selectedItems()[0]);
  },

  _onSearchClick: function(e) {
    this.killEvent(e);
    this.model.set('isSearchEnabled', !this.model.get('isSearchEnabled'));
  },

  _onChangeIsSearchEnabled: function(model, isSearchEnabled) {
    this._enableSearchUI(isSearchEnabled);

    if (this.router.model.isSearching()) {
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
    this._$searchInput().select();
    this._$searchInput().focus();
  },

  _enableSearchUI: function(enable) {
    this.$('.js-search-field').toggle(enable);
    this.$('.js-links-list').toggle(!enable);
    this.$('.js-order-list').toggle(!enable);
  },

  _onSearchKeyDown: function(e) {
    // ESC
    if (e.keyCode === 27) {
      this._cleanSearch();
    }
  },

  // Creation actions

  _createMap: function(e) {
    if (e) e.preventDefault();
    this._openCreateDialog('map', true);
  },

  _newMap: function(e) {
    if (e) e.preventDefault();

    // Event tracking "Opened Create new map"
    cdb.god.trigger('metrics', 'create_map', {
      email: window.user_data.email
    });

    this._openCreateDialog('map');
  },

  _connectDataset: function(e) {
    if (e) e.preventDefault();

    // Event tracking "Opened Connect new dataset"
    cdb.god.trigger('metrics', 'connect_dataset', {
      email: window.user_data.email
    });

    if (this.user.canCreateDatasets()) {
      this._openCreateDialog('dataset');
    }
  },

  _duplicateDataset: function(e) {
    if (e) this.killEvent(e);
    var selectedDatasets = this._selectedItems();

    if (selectedDatasets.length === 1) {
      var m = selectedDatasets[0];
      var table = m.tableMetadata();
      var tableName = table.get('name');

      cdb.god.trigger('importByUploadData', {
        type: 'duplication',
        table_name: table.getUnqualifiedName() + '_copy',
        value: tableName,
        create_vis: false
      });
    }
  },

  _duplicateMap: function(e) {
    if (e) {
      this.killEvent(e);
    }

    var selectedDatasets = this._selectedItems();

    if (selectedDatasets.length === 1) {
      var m = selectedDatasets[0];
      var table = m.tableMetadata();

      new DuplicateMap({
        model: m,
        table: table,
        user: this.user,
        clean_on_hide: true
      }).appendToBody();
    }
  },

  _importRemote: function(e) {
    if (e) this.killEvent(e);

    var selectedItems = this._selectedItems();
    if (selectedItems.length !== 1) {
      return;
    }

    var remoteItem = selectedItems[0];
    var remoteItemTable = remoteItem.get('table');

    var d = {
      type: 'remote',
      value: remoteItem.get('name'),
      remote_visualization_id: remoteItem.get('id'),
      size: remoteItemTable && remoteItemTable.size,
      create_vis: false
    };

    cdb.god.trigger('importByUploadData', d, this);

    this._select(false);
  },

  _openCreateDialog: function(type, selectedItems) {
    cdb.god.trigger(
      'openCreateDialog',
      {
        type: type,
        selectedItems: selectedItems ? this._selectedItems() : []
      }
    );
  },

  // Filter actions

  _onCleanSearchClick: function(e) {
    this.killEvent(e);
    this._cleanSearch();
  },

  _submitSearch: function(e) {
    this.killEvent(e);
    this._navigateToUrl({
      search: Utils.stripHTML(this.$('.js-search-input').val().trim(),''),
      page: 1,
      liked: false,
      shared: 'no',
      library: false,
      locked: false
    });
  },

  _cleanSearch: function() {
    this._navigateToUrl({
      search: '',
      liked: false,
      library: false,
      shared: 'no'
    });
    this.model.set('isSearchEnabled', false);
  },

  _navigateToUrl: function(opts) {
    this.router.navigate(this.router.currentUrl(opts), { trigger: true });
  },

  _changeOrder: function(e) {
    if (e) e.preventDefault();

    var $el = $(e.target).closest('.js-order-link');
    var order = 'updated_at';

    if ($el.hasClass('js-mapviews')) order = 'mapviews';
    if ($el.hasClass('js-likes')) order = 'likes';
    if ($el.hasClass('js-size')) order = 'size';

    // Order change?
    if (this.router.model.get('order') !== order) {
      this.localStorage.set({ 'dashboard.order': order });
      this.router.model.set('order', order);
    }
  },

  _onWindowScroll: function() {
    var offset = $(window).scrollTop();
    var anchorPoint = this.options.headerHeight + ( this.user.get('notification') ? this.options.headerHeight : 0 );
    this.$el[ offset > anchorPoint ? 'addClass' : 'removeClass' ]('is-fixed with-long-separator');
  },

  _canDeleteSelectedItems: function() {
    var self = this;
    return !_.find(this._selectedItems(), function(m) {
      return !m.permission.isOwner(self.user) || m.get('type') === "remote"
    });
  },

  _isSelectedItemLibrary: function() {
    var selectedItems = this._selectedItems();
    if (selectedItems.length === 1 && selectedItems[0].get('type') === "remote") {
      return true;
    } else {
      return false;
    }
  },

  clean: function() {
    this._unbindScroll();
    cdb.core.View.prototype.clean.call(this);
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../common/dialogs/change_lock/change_lock_view":24,"../common/dialogs/change_lock/change_lock_view_model":25,"../common/dialogs/delete_items_view":80,"../common/dialogs/delete_items_view_model":81,"../common/dialogs/duplicate_vis_view":82,"../common/view_helpers/navigate_through_router":110,"../common/view_helpers/pluralize_string":111}],144:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);

/**
 * Header view model to handle state for dashboard header view.
 */
module.exports = cdb.core.Model.extend({

  initialize: function(router) {
    this.router = router;
    this.router.model.bind('change', this.trigger.bind(this, 'change')); // simple re-trigger
  },

  breadcrumbTitle: function() {
    var contentType = this.router.model.get('content_type');
    if (this.isDisplayingLockedItems()) {
      return 'Locked ' + contentType;
    } else if (this.isDisplayingDeepInsights()) {
      return 'Deep insights';
    } else {
      // Capitalize string
      return contentType && contentType[0].toUpperCase() + contentType.slice(1);
    }
  },

  isBreadcrumbDropdownEnabled: function() {
    return true;
  },

  isDisplayingDatasets: function() {
    return this.router.model.get('content_type') === 'datasets';
  },

  isDisplayingMaps: function() {
    return this.router.model.get('content_type') === 'maps';
  },

  isDisplayingLockedItems: function() {
    return !!this.router.model.get('locked');
  },

  isDisplayingDeepInsights: function() {
    var routerModel = this.router.model;
    return routerModel.isDeepInsights();
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],145:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var DatasetsItem = require('./datasets/datasets_item');
var MapsItem = require('./maps/maps_item');
var DeepInsightsItem = require('./maps/deep_insights_item');
var PlaceholderItem = require('./maps/placeholder_item_view');
var RemoteDatasetsItem = require('./datasets/remote_datasets_item');
var MapTemplates = require('../common/map_templates');
var MAP_CARDS_PER_ROW = 3;

/**
 *  View representing the list of items
 */

module.exports = cdb.core.View.extend({

  tagName: 'ul',

  events: {},

  _ITEMS: {
    'remotes': RemoteDatasetsItem,
    'datasets': DatasetsItem,
    'deepInsights': DeepInsightsItem,
    'maps': MapsItem
  },

  initialize: function() {
    this.router = this.options.router;
    this.user = this.options.user;
    this._initBinds();
  },

  render: function() {
    this.clearSubViews();
    this.$el.attr('class', this.router.model.isDatasets() ? 'DatasetsList' : 'MapsList');
    this.collection.each(this._addItem, this);

    if (this.router.model.isMaps() && this.collection.size() > 0) {
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
    var type = this.router.model.get('content_type');

    if (m.get('type') === "remote" && this.router.model.isDatasets()) {
      type = "remotes";
    }

    if (this.router.model.isDeepInsights()) {
      type = "deepInsights";
    }

    var item = new this._ITEMS[type]({
      model:  m,
      router: this.router,
      user:   this.user
    });

    this.addView(item);
    this.$el.append(item.render().el);
  },

  _initBinds: function() {
    this.collection.bind('loading', this._onItemsLoading, this);
    this.collection.bind('reset', this.render, this);
    this.add_related_model(this.collection);
  },

  _onItemsLoading: function() {
    this.$el.addClass('is-loading');
  },

  _fillEmptySlotsWithPlaceholderItems: function() {
    var mapTemplates = _.shuffle(MapTemplates);
    _.times(this._emptySlotsCount(), function(i) {
      var d = mapTemplates[i];
      if (d) {
        var m = new cdb.core.Model(d);
        var view = new PlaceholderItem({
          model: m,
          collection: this.collection
        });
        this.$el.append(view.render().el);
        this.addView(view);
      }
    }, this);
  },

  _emptySlotsCount: function() {
    return (this.collection._ITEMS_PER_PAGE - this.collection.size()) % MAP_CARDS_PER_ROW;
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../common/map_templates":98,"./datasets/datasets_item":137,"./datasets/remote_datasets_item":139,"./maps/deep_insights_item":147,"./maps/maps_item":148,"./maps/placeholder_item_view":149}],146:[function(require,module,exports){
(function (global){
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
cdb.admin = (typeof window !== "undefined" ? window['cdb']['admin'] : typeof global !== "undefined" ? global['cdb']['admin'] : null);
var LocalStorage = require('../common/local_storage');
var HeaderView = require('../common/views/dashboard_header_view');
var SupportView = require('../common/support_view');
var MamufasImportView = require('../common/mamufas_import/mamufas_import_view');
var BackgroundPollingView = require('../common/background_polling/background_polling_view');
var DashboardBackgroundPollingModel = require('./background_polling_model');
var ContentControllerView = require('./content_controller_view');
var HeaderViewModel = require('./header_view_model');

module.exports = cdb.core.View.extend({

  events: {
    'click': '_onClick'
  },

  initialize: function() {
    this._initModels();
    this._initViews();
    this._initBindings();
  },

  _initBindings: function() {
    this.router.model.bind('change', this._onRouterChange, this);
    this.add_related_model(this.router.model);
  },

  _initModels: function() {
    this.user = this.options.user;
    this.router = this.options.router;
    this.localStorage = new LocalStorage();

    // Update order and category attribute to router model
    this.router.model.set('order',    this.localStorage.get('dashboard.order'), { silent: true });
    this.router.model.set('category', this.localStorage.get('dashboard.category'), { silent: true });
  },

  _onRouterChange: function(m, changes) {
    this._fetchCollection(m, changes);

    // Only create a visualization from an import if user is in maps section
    this._backgroundPollingView.createVis = this.router.model.isMaps();
  },

  _fetchCollection: function(m, changes) {
    var params = this.router.model.attributes;

    // Get order from localStorage if it is not defined or
    // come from other type (tables or visualizations)
    var order = this.localStorage.get("dashboard.order") || 'updated_at';
    // Maps doesn't have size order, so if that order is set
    // in maps section we will show with 'updated_at' order
    if (params.content_type === "maps" && order === "size") {
      order = 'updated_at'
    }

    var types = params.content_type === "datasets" ? 'table' : 'derived';

    // Requesting data library items?
    if (params.library) {
      types = 'remote';
    }

    // Supporting search in data library and user datasets at the same time
    if ((params.q || params.tag) && params.content_type === "datasets") {
      types = 'table,remote';
    }

    // TODO: review, should collection params really be set here?
    this.collection.options.set({
      q:              params.q,
      page:           params.page || 1,
      tags:           params.tag,
      per_page:       this.collection[ "_" + ( params.content_type === "datasets" ? 'TABLES' : 'ITEMS') + '_PER_PAGE'],
      shared:         params.shared,
      locked:         params.liked ? '' : params.locked, // If not locked liked items are not rendered
      only_liked:     params.liked,
      order:          order,
      types:          types,
      type:           '',
      deepInsights:   !!params.deepInsights
    });

    this.collection.fetch();
  },

  _initViews: function() {
    var backgroundPollingModel = new DashboardBackgroundPollingModel({
      showGeocodingDatasetURLButton: true,
      geocodingsPolling: true,
      importsPolling: true
    }, {
      user: this.user
    });

    this._backgroundPollingView = new BackgroundPollingView({
      model: backgroundPollingModel,
      // Only create a visualization from an import if user is in maps section
      createVis: this.router.model.isMaps(),
      user: this.user
    });
    backgroundPollingModel.bind('importCompleted', function() {
      this.collection.fetch();
      this.user.fetch();
    }, this);
    this.$el.append(this._backgroundPollingView.render().el);

    this.addView(this._backgroundPollingView);

    var mamufasView = new MamufasImportView({
      el: this.$el,
      user: this.user
    });

    cdb.god.bind('dialogOpened', function() {
      mamufasView.disable();
      backgroundPollingModel.stopPollings();
    }, this);
    cdb.god.bind('dialogClosed', function() {
      mamufasView.enable();
      backgroundPollingModel.startPollings();
    }, this);

    mamufasView.render();
    mamufasView.enable();

    var headerView = new HeaderView({
      el:             this.$('#header'), //pre-rendered in DOM by Rails app
      model:          this.user,
      viewModel:      new HeaderViewModel(this.router),
      router:         this.router,
      collection:     this.collection,
      localStorage:   this.localStorage
    });
    headerView.render();

    this.controllerView = new ContentControllerView({
      el:           this.$('#content-controller'),
      // Pass the whole element for only calculating
      // the height is not "fair"
      headerHeight: this.$('#header').height(),
      user:         this.user,
      router:       this.router,
      collection:   this.collection,
      localStorage: this.localStorage
    });

    this.controllerView.render();

    var supportView = new SupportView({
      el: this.$('#support-banner'),
      user: this.user
    });

    supportView.render();
  },

  _onClick: function(e) {
    // Clicks outside of any dialog "body" will fire a closeDialogs event
    if (this._isEventTriggeredOutsideOf(e, '.Dialog')) {
      cdb.god.trigger('closeDialogs');

      // If click outside the filters view should also unselect any selected items
      if (this._isEventTriggeredOutsideOf(e, '.js-skip-unselect-all')) {
        cdb.god.trigger('unselectAllItems');
      }
    }
  },

  _isEventTriggeredOutsideOf: function(ev, selector) {
    return $(ev.target).closest(selector).length === 0;
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../common/background_polling/background_polling_view":2,"../common/local_storage":95,"../common/mamufas_import/mamufas_import_view":97,"../common/support_view":105,"../common/views/dashboard_header_view":123,"./background_polling_model":133,"./content_controller_view":134,"./header_view_model":144}],147:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var moment = (typeof window !== "undefined" ? window['moment'] : typeof global !== "undefined" ? global['moment'] : null);
var navigateThroughRouter = require('../../common/view_helpers/navigate_through_router');
var Utils = (typeof window !== "undefined" ? window['cdb']['Utils'] : typeof global !== "undefined" ? global['cdb']['Utils'] : null);
cdb.admin = (typeof window !== "undefined" ? window['cdb']['admin'] : typeof global !== "undefined" ? global['cdb']['admin'] : null);

/**
 * Represents a map card on dashboard.
 */
module.exports = cdb.core.View.extend({

  className: 'MapsList-item',
  tagName: 'li',

  initialize: function() {
    this.router = this.options.router;
    this.user = this.options.user;
    this.template = cdb.templates.getTemplate('dashboard/views/deep_insights_item');
  },

  render: function() {
    this.clearSubViews();
    var url = this.model.deepInsightsUrl(this.user);

    this.$el.html(
      this.template({
        url: url,
        title: this.model.get('title'),
        description: this.model.get('description'),
        timeDiff: moment(this.model.get('updated_at')).fromNow(),
      })
    );

    return this;
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../common/view_helpers/navigate_through_router":110}],148:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var moment = (typeof window !== "undefined" ? window['moment'] : typeof global !== "undefined" ? global['moment'] : null);
var navigateThroughRouter = require('../../common/view_helpers/navigate_through_router');
var MapviewsGraph = require('../../dashboard/mapviews_graph');
var MapCardPreview = require('../../common/views/mapcard_preview');
var LikesView = require('../../common/views/likes/view');
var EditableDescription= require('../../dashboard/editable_fields/editable_description');
var EditableTags = require('../../dashboard/editable_fields/editable_tags');
var Utils = (typeof window !== "undefined" ? window['cdb']['Utils'] : typeof global !== "undefined" ? global['cdb']['Utils'] : null);
cdb.admin = (typeof window !== "undefined" ? window['cdb']['admin'] : typeof global !== "undefined" ? global['cdb']['admin'] : null);

/**
 * Represents a map card on dashboard.
 */
module.exports = cdb.core.View.extend({

  className: 'MapsList-item',
  tagName: 'li',

  events: {
    'click tag-link': navigateThroughRouter,
    'click .js-privacy': '_openPrivacyDialog',
    'click':          '_onCardClick'
  },

  initialize: function() {
    this.router = this.options.router;
    this.user = this.options.user;
    this.template = cdb.templates.getTemplate('dashboard/views/maps_item');

    this._initBinds();
  },

  render: function() {
    this.clearSubViews();

    var url = this.model.viewUrl(this.user);
    url = this.router.model.get('liked') && !this.model.permission.hasAccess(this.user) ? url.public() : url.edit();

    this.$el.html(
      this.template({
        url:                     url,
        name:                    this.model.get('name'),
        privacy:                 this.model.get('privacy').toLowerCase(),
        isOwner:                 this.model.permission.isOwner(this.user),
        owner:                   this.model.permission.owner.renderData(this.user),
        showPermissionIndicator: !this.model.permission.hasWriteAccess(this.user),
        timeDiff:                moment(this.model.get('updated_at')).fromNow(),
        likes:                   this.model.get('likes') || 0,
        liked:                   this.model.get('liked') || false
      })
    );

    this._renderDescription();
    this._renderTags();
    this._renderMapviewsGraph();
    this._renderLikesIndicator();
    this._renderMapThumbnail();
    this._renderTooltips();
    this._checkSelected();

    return this;
  },

  _initBinds: function() {
    this.model.on('change:selected', this._checkSelected, this);
    this.model.on('change:privacy', this.render, this);
  },

  _renderDescription: function() {
    var isOwner = this.model.permission.isOwner(this.user);
    var view = new EditableDescription({
      el: this.$('.js-item-description'),
      model: this.model,
      editable: isOwner && this.user.hasCreateMapsFeature()
    });
    this.addView(view.render());
  },

  _renderTags: function() {
    var isOwner = this.model.permission.isOwner(this.user);
    var view = new EditableTags({
      el: this.$('.js-item-tags'),
      model: this.model,
      router: this.router,
      editable: isOwner && this.user.hasCreateMapsFeature()
    });
    this.addView(view.render());
  },

  _renderLikesIndicator: function() {
    var view = new LikesView({
      model: this.model.like
    });
    this.$('.js-likes-indicator').replaceWith(view.render().el);
    this.addView(view);
  },

  _renderMapviewsGraph: function() {
    var graph = new MapviewsGraph({
      el:     this.$('.js-header-graph'),
      stats:  this.model.get('stats')
    });
    this.addView(graph.render());
  },

  _renderTooltips: function() {
    // Owner
    if (!this.model.permission.isOwner(this.user)) {
      this.addView(
        new cdb.common.TipsyTooltip({
          el: this.$('.UserAvatar'),
          title: function(e) {
            return $(this).attr('data-title')
          }
        })
      )
    }
  },

  _renderMapThumbnail: function() {
    var zoom = this.model.get("zoom");
    var owner = this.model.permission.owner;
    var ownerUsername = owner.get('username');
    var previewZoom = (zoom + 2 <= this.model.map.get("maxZoom")) ? zoom + 2 : zoom;

    var mapCardPreview = new MapCardPreview({
      el: this.$('.js-header'),
      privacy: this.model.get("privacy"),
      mapsApiResource: cdb.config.getMapsResourceName(ownerUsername),
      username: ownerUsername,
      visId: this.model.get('id'),
      authTokens: this.model.get('auth_tokens')
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

  _checkSelected: function() {
    this.$(".MapCard")[this.model.get("selected") ? "addClass" : "removeClass"]("is-selected");
  },

  _openPrivacyDialog: function(ev) {
    this.killEvent(ev);
    cdb.god.trigger('openPrivacyDialog', this.model);
  },

  _onCardClick: function(ev) {
    // Let links use default behaviour
    if (!$(ev.target).closest('a')[0]) {
      this.killEvent(ev);
      var isOwner = this.model.permission.isOwner(this.user);
      if (isOwner) {
        this.model.set('selected', !this.model.get('selected'));
      }
    }
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../common/view_helpers/navigate_through_router":110,"../../common/views/likes/view":126,"../../common/views/mapcard_preview":127,"../../dashboard/editable_fields/editable_description":140,"../../dashboard/editable_fields/editable_tags":141,"../../dashboard/mapviews_graph":150}],149:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var CreateDialog = require('../../common/dialogs/create/create_view');
var VideoTutorialView = require('../../common/dialogs/video_tutorial/video_tutorial_view');

/**
 * Represents a map card on dashboard.
 */

module.exports = cdb.core.View.extend({

  className: 'MapsList-item',
  tagName: 'li',

  events: {
    'click .js-open': '_openVideoTutorialDialog'
  },

  initialize: function() {
    this.template = cdb.templates.getTemplate('dashboard/maps/placeholder_item');
  },

  render: function() {
    this.clearSubViews();

    this.$el.html(
      this.template({
        desc: this.model.get('short_description'),
        icon: this.model.get('icon')
      })
    );

    return this;
  },

  _openVideoTutorialDialog: function() {
    var dlg = new VideoTutorialView({
      videoId: this.model.get('videoId'),
      clean_on_hide: true,
      enter_to_confirm: false
    })
    cdb.god.trigger("onTemplateSelected", this);
    dlg.appendToBody();
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../common/dialogs/create/create_view":45,"../../common/dialogs/video_tutorial/video_tutorial_view":93}],150:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var pluralizeString = require('../common/view_helpers/pluralize_string');
var Utils = (typeof window !== "undefined" ? window['cdb']['Utils'] : typeof global !== "undefined" ? global['cdb']['Utils'] : null);
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);


/**
 *  Visualization mapviews graph
 *
 */

module.exports = cdb.core.View.extend({

  options: {
    stats:        [],
    width:        127,
    height:       22
  },

  initialize: function() {
    this.options.stats = _.map(
      this.options.stats,
      function(val, date) {
        return {
          mapviews: val,
          when: date,
          today: moment(new Date(date)).format('DD/MM/YYYY') == moment(new Date()).format('DD/MM/YYYY')
        }
      }
    );
  },

  render: function() {
    var self = this;
    var width = this.options.width;
    var height = this.options.height;
    var data = this.options.stats;
    var minHeight = 2;

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var svg = d3.select(this.$el[0]).append("svg")
        .attr("width", width)
        .attr("height", height)
      .append("g");

    
    x.domain(data.map(function(d) { return d.when; }));
    y.domain([0, d3.max(data, function(d) { return d.mapviews; })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.selectAll(".bar")
        .data(data)
      .enter().append("rect")
        .attr("class", "MapviewsGraph-bar")
        .attr('data-title', function(d) {
          return Utils.formatNumber(d.mapviews) + ' ' + pluralizeString('mapview', d.mapviews) + ( d.today ? (' today') : (' on ' + d.when) )
        })
        .attr("x", function(d) { return x(d.when); })
        .attr("width", 3)
        .attr("y", function(d) {
          var value = height - y(d.mapviews);
          var yPos = y(d.mapviews);
          return value < minHeight ? (height - minHeight) : yPos;
        })
        .attr("height", function(d) {
          var value = height - y(d.mapviews);
          return value < minHeight ? minHeight : value;
        })
        .on('mouseover', function(d) {
          if (d.mapviews > 0) {
            var $el = $(d3.select(this)[0]);
            self.addView(
              new cdb.common.TipsyTooltip({
                el: $el,
                className: 'MapviewsGraph-tooltip',
                html: true,
                trigger: 'manual',
                title: function(e) { return $(this).attr('data-title') }
              })
            );
            $el.tipsy('show');  
          }
        })
        .on('mouseout', function(d) {
          if (d.mapviews > 0) {
            var $el = $(d3.select(this)[0]);
            // Eliminating tipsy thing from the single graph bar
            $el.tipsy('hide');
            $el.unbind('mouseleave mouseenter');
          }
        });

    return this;
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../common/view_helpers/pluralize_string":111}],151:[function(require,module,exports){
(function (global){
'use strict';
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
cdb.admin = (typeof window !== "undefined" ? window['cdb']['admin'] : typeof global !== "undefined" ? global['cdb']['admin'] : null);
var createDefaultFallbackMap = require('../common/views/create_default_fallback_map');

/**
 *  Onboarding view
 *
 *  It includes:
 *  - onboard map (rendered when element is visible)
 *  - welcome text (visible checking local storage)
 *
 */


module.exports = cdb.core.View.extend({

  tagName: 'div',
  className: 'OnBoarding',

  events: {
    'click .js-createMap': '_createMap'
  },

  initialize: function() {
    this.user = this.options.user;
    this.template = cdb.templates.getTemplate('dashboard/views/onboarding');
    this._resizeMap();
    this._initBindings();
  },

  render: function() {
    this.$el.html(
      this.template({
        username: this.user.get('name') || this.user.get('username'),
        hasCreateMapsFeature: this.user.hasCreateMapsFeature()
      })
    );

    return this;
  },

  _renderMap: function() {
    if (this.map) {
      return;
    }

    this.map = createDefaultFallbackMap({
      el: this.$('.js-onboarding-map'),
      baselayer: cdb.config.get('default_fallback_basemap'),
      scrollwheel: false
    });
  },

  _createMap: function() {
    cdb.god.trigger('openCreateDialog', { type: 'map' });
  },

  _destroyMap: function() {
    if (this.map) {
      this.map.remove();
    }
  },

  _initBindings: function() {
    _.bindAll(this, '_resizeMap');
    $(window).on('resize', this._resizeMap);
  },

  _destroyBindings: function() {
    $(window).off('resize', this._resizeMap);
  },

  _resizeMap: function() {
    // 71px is the height of the main header
    this.$el.height( window.innerHeight - 71 );
  },

  show: function() {
    this.$el.show();
    // We need to have element visible in order
    // to render leaflet map properly
    this._renderMap();
  },

  hide: function() {
    this.$el.hide();
  },

  clean: function() {
    this._destroyMap();
    this._destroyBindings();
    cdb.core.View.prototype.clean.call(this);
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../common/views/create_default_fallback_map":114}],152:[function(require,module,exports){
(function (global){
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var Router = require('../common/router');
var VisFetchModel = require('../common/visualizations_fetch_model');
var CurrentUrlModel = require('./router/current_url_model');
var Utils = (typeof window !== "undefined" ? window['cdb']['Utils'] : typeof global !== "undefined" ? global['cdb']['Utils'] : null);

/**
 *  Backbone router for dashboard urls.
 *  Actual URLs can be retrieved from router.model.toXXX-methods.
 *
 *  - Manage all available urls
 *    · Organization
 *    · Shared
 *    · Pretty urls
 *    · ...
 */
module.exports = Router.extend({

  routes: {

    // Index
    '':                                              '_changeRouteToMaps',
    '?:queries':                                     '_changeRouteToMaps',

    // If URL is lacking the trailing slash (e.g. 'http://username.carto.com/dashboard'), treat it like index
    'dashboard':                                     '_changeRouteToMaps',
    'dashboard?:queries':                            '_changeRouteToMaps',
    '*prefix/dashboard':                             '_changeRouteToMaps',
    '*prefix/dashboard?:queries':                    '_changeRouteToMaps',

    // Supporting old tables/vis urls
    'tables':                                        '_changeRouteToDatasets',
    'tables/:whatever':                              '_changeRouteToDatasets',
    'visualizations':                                '_changeRouteToMaps',
    'visualizations/:whatever':                      '_changeRouteToMaps',

    // Search
    ':content_type/search/:q':                       '_changeRouteToSearch',
    ':content_type/search/:q/:page':                 '_changeRouteToSearch',

    // Tags only in shared datasets/maps
    ':content_type/shared/tag/:tag':                 '_changeRouteToTag',
    ':content_type/shared/tag/:tag/:page':           '_changeRouteToTag',

    // Tags only in liked datasets/maps
    ':content_type/liked/tag/:tag':                  '_changeRouteToTag',
    ':content_type/liked/tag/:tag/:page':            '_changeRouteToTag',

    // Tags in my locked datasets/maps
    ':content_type/locked/tag/:tag':                 '_changeRouteToTag',
    ':content_type/locked/tag/:tag/:page':           '_changeRouteToTag',

    // Tags in library datasets/maps
    ':content_type/library/tag/:tag':                '_changeRouteToTag',
    ':content_type/library/tag/:tag/:page':          '_changeRouteToTag',

    // Tags
    ':content_type/tag/:tag':                        '_changeRouteToTag',
    ':content_type/tag/:tag/:page':                  '_changeRouteToTag',

    // Liked datasets
    'datasets/liked':                         '_changeRouteToDatasets',
    'datasets/liked/':                        '_changeRouteToDatasets',
    'datasets/liked?:q':                      '_changeRouteToDatasets',
    'datasets/liked/:page':                   '_changeRouteToDatasets',
    'datasets/liked/:page?:q':                '_changeRouteToDatasets',


    // Shared datasets
    'datasets/shared':                        '_changeRouteToDatasets',
    'datasets/shared/':                       '_changeRouteToDatasets',
    'datasets/shared?:q':                     '_changeRouteToDatasets',
    'datasets/shared/:page':                  '_changeRouteToDatasets',
    'datasets/shared/:page?:q':               '_changeRouteToDatasets',

    // Datasets locked
    'datasets/locked':                        '_changeRouteToDatasets',
    'datasets/locked/':                       '_changeRouteToDatasets',
    'datasets/locked?:q':                     '_changeRouteToDatasets',
    'datasets/locked/:page':                  '_changeRouteToDatasets',
    'datasets/locked/:page?:q':               '_changeRouteToDatasets',

    // Library datasets
    'datasets/library':                       '_changeRouteToDatasets',
    'datasets/library/':                      '_changeRouteToDatasets',
    'datasets/library?:q':                    '_changeRouteToDatasets',
    'datasets/library/:page':                 '_changeRouteToDatasets',
    'datasets/library/:page?:q':              '_changeRouteToDatasets',

    // Datasets
    'datasets':                               '_changeRouteToDatasets',
    'datasets/':                              '_changeRouteToDatasets',
    'datasets?:q':                            '_changeRouteToDatasets',
    'datasets/:page':                         '_changeRouteToDatasets',
    'datasets/:page?:q':                      '_changeRouteToDatasets',

    // My shared maps
    'maps/shared':                            '_changeRouteToMaps',
    'maps/shared/':                           '_changeRouteToMaps',
    'maps/shared?:q':                         '_changeRouteToMaps',
    'maps/shared/:page':                      '_changeRouteToMaps',
    'maps/shared/:page?:q':                   '_changeRouteToMaps',

    // Locked maps
    'maps/locked':                            '_changeRouteToMaps',
    'maps/locked/':                           '_changeRouteToMaps',
    'maps/locked?:q':                         '_changeRouteToMaps',
    'maps/locked/:page':                      '_changeRouteToMaps',
    'maps/locked/:page?:q':                   '_changeRouteToMaps',

    // Shared locked maps
    'maps/shared/locked':                     '_changeRouteToMaps',
    'maps/shared/locked/':                    '_changeRouteToMaps',
    'maps/shared/locked?:q':                  '_changeRouteToMaps',
    'maps/shared/locked/:page':               '_changeRouteToMaps',
    'maps/shared/locked/:page?:q':            '_changeRouteToMaps',

    // Liked maps
    'maps/liked':                             '_changeRouteToMaps',
    'maps/liked/':                            '_changeRouteToMaps',
    'maps/liked?:q':                          '_changeRouteToMaps',
    'maps/liked/:page':                       '_changeRouteToMaps',
    'maps/liked/:page?:q':                    '_changeRouteToMaps',

    // Maps
    'maps':                                   '_changeRouteToMaps',
    'maps/':                                  '_changeRouteToMaps',
    'maps?:q':                                '_changeRouteToMaps',
    'maps/:page':                             '_changeRouteToMaps',
    'maps/:page?:q':                          '_changeRouteToMaps',

    // Deep insights
    'deep-insights':                           '_changeRouteToDeepInsights',
    'deep-insights/':                          '_changeRouteToDeepInsights',
    'deep-insights?:q':                        '_changeRouteToDeepInsights',
    'deep-insights/:page':                     '_changeRouteToDeepInsights',
    'deep-insights/:page?:q':                  '_changeRouteToDeepInsights'
  },

  initialize: function(opts) {
    this._dashboardUrl = opts.dashboardUrl;
    this._rootPath = this._dashboardUrl.pathname();

    this.model = new VisFetchModel({
      // Attributes will be set by one of the route handlers below, upon router.enableAfterMainView()
    });
    this._currentUrl = new CurrentUrlModel({
      visFetchModel: this.model,
      dashboardUrl: this._dashboardUrl
    });
  },

  rootPath: function() {
    return this._rootPath;
  },

  normalizeFragmentOrUrl: function(fragmentOrUrl) {
    return fragmentOrUrl && fragmentOrUrl.toString().replace(this._dashboardUrl, '') || this.currentDashboardUrl().toString();
  },

  /**
   * Get current dashboard URL (i.e. datasets or maps).
   * @return {Object} instance of cdb.common.DashboardVisUrl
   */
  currentDashboardUrl: function() {
    return this._currentUrl.forCurrentContentType();
  },

  /**
   * Get a URL based on current state.
   * @params {Object} override hash of keys to override, see Router.model.forCurrentState for alternatives.
   */
  currentUrl: function(override) {
    return this._currentUrl.forCurrentState(override);
  },

  _changeRouteToSearch: function(contentType, q, page) {
    page = this._getPage(page);

    this.model.set({
      action:         'search',
      content_type:   contentType,
      q:              Utils.stripHTML(decodeURIComponent(q),''),
      tag:            '',
      page:           page,
      shared:         'yes',
      locked:         null,
      liked:          null,
      library:        null,
      deepInsights:   false
    });
  },

  _changeRouteToTag: function(contentType, tag, page) {
    page = this._getPage(page);

    this.model.set({
      action:         'tag',
      content_type:   contentType,
      tag:            Utils.stripHTML(decodeURIComponent(tag),''),
      q:              '',
      page:           page,
      shared:         'yes',
      locked:         null,
      liked:          null,
      library:        null,
      deepInsights:   false
    });
  },

  _changeRouteToDatasets: function(page) {
    page = this._getPage(page);
    var shared = this._doesCurrentUrlContain('datasets/shared');
    var locked = this._doesCurrentUrlContain('datasets/locked') || this._doesCurrentUrlContain('shared/locked');
    var liked = this._doesCurrentUrlContain('datasets/liked');
    var library = this._doesCurrentUrlContain('datasets/library');

    this.model.set({
      content_type:   'datasets',
      page:           page,
      q:              '',
      tag:            '',
      shared:         shared ? 'only' : 'no',
      locked:         locked,
      liked:          liked,
      library:        library,
      deepInsights:   false
    });
  },

  _changeRouteToMaps: function(page) {
    page = this._getPage(page);
    var shared = this._doesCurrentUrlContain('maps/shared');
    var locked = this._doesCurrentUrlContain('maps/locked') || this._doesCurrentUrlContain('shared/locked');
    var liked = this._doesCurrentUrlContain('maps/liked');

    this.model.set({
      content_type:   'maps',
      page:           page,
      q:              '',
      tag:            '',
      shared:         shared ? 'only' : 'no',
      locked:         locked,
      liked:          liked,
      library:        false,
      deepInsights:   false
    });
  },

  _changeRouteToDeepInsights: function(page) {
    page = this._getPage(page);
    this.model.set({
      content_type:   'maps',
      page:           page,
      q:              '',
      tag:            '',
      shared:         'no',
      locked:         false,
      liked:          false,
      library:        false,
      deepInsights:   true
    });
  },

  _doesCurrentUrlContain: function(uri) {
    return Backbone.history.fragment.search(uri) !== -1;
  },

  _getPage: function(page) {
    page = parseInt(page);
    return page && _.isNumber(page) ? page : 1;
  }

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../common/router":100,"../common/visualizations_fetch_model":132,"./router/current_url_model":153}],153:[function(require,module,exports){
(function (global){
var cdb = (typeof window !== "undefined" ? window['cdb'] : typeof global !== "undefined" ? global['cdb'] : null);
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);

/**
 * Model that holds the dashboard state.
 * Expected to be used with the dashboard Router.
 */
module.exports = cdb.core.Model.extend({

  defaults: {
    dashboardUrl: undefined, // cdb.common.DashboardUrl
    visFetchModel: undefined // common/visualizations_fetch_model
  },

  initialize: function() {
    // Methods used in _compose need to have the model's context bound to be able to access internal attrs.
    _.bindAll(this, '_appendPage', '_appendSearch', '_appendLocked', '_appendLibrary', '_appendSharedOrLiked');
    if (!this.get('dashboardUrl')) {
      throw new Error('dashboardUrl is required');
    }
    if (!this.get('visFetchModel')) {
      throw new Error('visFetchModel is required');
    }
  },

  forCurrentContentType: function() {
    var contentType = this.get('visFetchModel').get('content_type') || 'datasets';
    // This might get called upon page initializatioin w/o any content_type set, fallback on datasets
    return this.get('dashboardUrl')[
      !this.isDeepInsights() ? contentType : 'deepInsights'
    ]();
  },

  /**
   * Get the URL based on current state.
   * Provide a hash to override current state's values for the returned URL.
   *
   * @param {Object} override hash that allows the following, optional keys:
   *   search: {String,undefined} E.g. 'foobar', ':tag'
   *   page:   {Number,String,undefined} E.g. 24, '42'
   *   locked: {Boolean,undefined}
   * @returns {Object} instance of cdb.common.Url
   */
  forCurrentState: function(override) {
    // Since JS is an object we can add the options directly on the start value and let each compose method attach its
    // path based on given options.
    var array = _.extend([ this.forCurrentContentType() ], override);

    var baseUrl = _.compose(
      this._appendPage,
      this._appendSearch,
      this._appendLocked,
      this._appendLibrary,
      this._appendSharedOrLiked
    )(array)
      .join('/');

    return new cdb.common.Url({
      base_url: baseUrl
    });
  },

  isSearching: function() {
    var visFetchModel = this.get('visFetchModel');
    return visFetchModel.get('q') || visFetchModel.get('tag');
  },

  isDeepInsights: function() {
    var visFetchModel = this.get('visFetchModel');
    return this.isMaps() && visFetchModel.get('deepInsights');
  },

  isDatasets: function() {
    return this.get('visFetchModel').get('content_type') === 'datasets';
  },

  isMaps: function() {
    return this.get('visFetchModel').get('content_type') === 'maps';
  },

  /**
   * Append pagination page item to given array.
   */
  _appendPage: function(array) {
    var value = array.page;

    if (_.isUndefined(value)) {
      value = this.get('visFetchModel').get('page');
    }

    // Ommit page if is first page
    if (value > 1) {
      array.push(encodeURIComponent(value));
    }

    return array;
  },

  /**
   * Append search items to given array.
   * Can be either a search by string ['search', 'foboar'], or a tag, ['tag', 'baz'].
   *
   * @param obj {Object}
   * @returns {Object}
   * @private
   */
  _appendSearch: function(array) {
    var items = [];
    var value = array.search;

    if (_.isUndefined(value)) {
      var visFetchModel = this.get('visFetchModel');
      var tag = visFetchModel.get('tag');
      var q = visFetchModel.get('q');
      if (tag) {
        items = this._keyValueItems('tag', tag);
      } else if (q) {
        items = this._keyValueItems('search', q);
      }
    } else {
      if (value.search(':') === 0) {
        items = this._keyValueItems('tag', value.replace(':', ''));
      } else if (!_.isEmpty(value)) {
        items = this._keyValueItems('search', value);
      }
    }

    // If used Array.prototype.concat would loose any properties array holds, since concat creates a copy of values only
    array.push.apply(array, items);
    return array;
  },

  _keyValueItems: function(key, value) {
    return [ key, encodeURIComponent(value) ];
  },

  _appendLocked: function(array) {
    var value = array.locked;

    if ((_.isUndefined(value) && this.get('visFetchModel').get('locked')) || value) {
      array.push('locked');
    }

    return array;
  },

  _appendLibrary: function(array) {
    var value = array.library;

    if ((_.isUndefined(value) && this.get('visFetchModel').get('library')) || value) {
      array.push('library');
    }

    return array;
  },

  _appendSharedOrLiked: function(array) {
    var shared = array.shared;
    var liked = array.liked;

    if ((_.isUndefined(shared) && this.get('visFetchModel').get('shared') === 'only') || shared === 'only') {
      array.push('shared');
    } else if ((_.isUndefined(liked) && this.get('visFetchModel').get('liked')) || liked) {
      array.push('liked');
    }

    return array;
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],154:[function(require,module,exports){
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

},{"./cartocss/color-ramps":155,"./cartocss/get-default-css-for-geometry-type":156,"./cartocss/get-geo-attr":157}],155:[function(require,module,exports){
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

},{}],156:[function(require,module,exports){
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

},{}],157:[function(require,module,exports){
module.exports = function(geometryType) {
  return {
    "line": 'line-color',
    'polygon': "polygon-fill",
    'point': "marker-fill"
  }[geometryType];
};

},{}],158:[function(require,module,exports){

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

},{}],159:[function(require,module,exports){
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

},{"./cartocss/color-ramps.js":155}],160:[function(require,module,exports){
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

},{}],161:[function(require,module,exports){
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

},{"./cartocss":154,"./cartocss/color-ramps":155,"./deep-defaults":158,"./get-method-properties":159,"./get-weight-from-shape":160}],162:[function(require,module,exports){
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

},{"./deep-defaults":158,"./get-weight-from-shape":160}],163:[function(require,module,exports){
module.exports = {
  hasEnoughToGuess: require('./has-enough-to-guess'),
  guessMap: require('./guess-map'),
  getWeightFromShape: require('./get-weight-from-shape'),
  getMethodProperties: require('./get-method-properties')
};

},{"./get-method-properties":159,"./get-weight-from-shape":160,"./guess-map":161,"./has-enough-to-guess":162}],164:[function(require,module,exports){
'use strict';

module.exports = require('./src/js/main');

},{"./src/js/main":170}],165:[function(require,module,exports){
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

},{}],166:[function(require,module,exports){
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

},{}],167:[function(require,module,exports){
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

},{}],168:[function(require,module,exports){
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

},{}],169:[function(require,module,exports){
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

},{"./class":165,"./dom":166}],170:[function(require,module,exports){
'use strict';

var destroy = require('./plugin/destroy');
var initialize = require('./plugin/initialize');
var update = require('./plugin/update');

module.exports = {
  initialize: initialize,
  update: update,
  destroy: destroy
};

},{"./plugin/destroy":173,"./plugin/initialize":181,"./plugin/update":186}],171:[function(require,module,exports){
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

},{"./instances":182,"./update":186}],172:[function(require,module,exports){
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

},{}],173:[function(require,module,exports){
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

},{"../lib/dom":166,"../lib/helper":169,"./instances":182}],174:[function(require,module,exports){
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

},{"../instances":182,"../update-geometry":184,"../update-scroll":185}],175:[function(require,module,exports){
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

},{"../../lib/dom":166,"../../lib/helper":169,"../instances":182,"../update-geometry":184,"../update-scroll":185}],176:[function(require,module,exports){
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

},{"../../lib/dom":166,"../../lib/helper":169,"../instances":182,"../update-geometry":184,"../update-scroll":185}],177:[function(require,module,exports){
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

},{"../instances":182,"../update-geometry":184,"../update-scroll":185}],178:[function(require,module,exports){
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

},{"../instances":182,"../update-geometry":184}],179:[function(require,module,exports){
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

},{"../../lib/helper":169,"../instances":182,"../update-geometry":184,"../update-scroll":185}],180:[function(require,module,exports){
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

},{"../../lib/helper":169,"../instances":182,"../update-geometry":184,"../update-scroll":185}],181:[function(require,module,exports){
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

},{"../lib/class":165,"../lib/helper":169,"./autoupdate":171,"./handler/click-rail":174,"./handler/drag-scrollbar":175,"./handler/keyboard":176,"./handler/mouse-wheel":177,"./handler/native-scroll":178,"./handler/selection":179,"./handler/touch":180,"./instances":182,"./resizer":183,"./update-geometry":184}],182:[function(require,module,exports){
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

},{"../lib/class":165,"../lib/dom":166,"../lib/event-manager":167,"../lib/guid":168,"../lib/helper":169,"./default-setting":172}],183:[function(require,module,exports){
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

},{"../lib/helper":169,"./instances":182,"./update":186}],184:[function(require,module,exports){
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

},{"../lib/class":165,"../lib/dom":166,"../lib/helper":169,"./instances":182,"./update-scroll":185}],185:[function(require,module,exports){
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

},{"./instances":182}],186:[function(require,module,exports){
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

},{"../lib/dom":166,"../lib/helper":169,"./instances":182,"./update-geometry":184,"./update-scroll":185}],187:[function(require,module,exports){
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
},{}],188:[function(require,module,exports){
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

},{}]},{},[142])
//# sourceMappingURL=dashboard.uncompressed.js.map

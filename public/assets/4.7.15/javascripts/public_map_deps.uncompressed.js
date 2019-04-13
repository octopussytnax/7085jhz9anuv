
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

/* global cdb */

cdb.admin.ExportMapModel = cdb.core.Model.extend({
  /*
   * Creates an export_visualization job and polls until it finishes.
   * Results in zip download containing visualization metadata + data.
  */
  urlRoot: '/api/v3/visualization_exports',

  initialize: function (attrs) {
    this._loadAttributes(attrs);
  },

  requestExport: function () {
    this.save(null, { success: this._requestExportSuccessHandler.bind(this) });

    if (window.user_data && window.user_data.email) {
      cdb.god.trigger('metrics', 'export_map', {
        email: window.user_data.email
      });
    } else {
      cdb.god.trigger('metrics', 'export_map_public', {});
    }
  },

  cancelExport: function () {
    this._interrupt();
  },

  _requestExportSuccessHandler: function () {
    this._pollPID = setInterval(function () {
      this.fetch({
        success: this._checkState.bind(this),
        error: this._errorHandler.bind(this)
      });
    }.bind(this), 2000);
  },

  _checkState: function () {
    if (this.get('state') === 'complete') {
      this._finishExport();
    } else if (this.get('state') === 'failure') {
      this._errorHandler();
    }
  },

  _finishExport: function () {
    clearInterval(this._pollPID);
  },

  _errorHandler: function () {
    this._interrupt();

    throw new Error('There is a problem with your export. Please try again.');
  },

  _interrupt: function () {
    clearInterval(this._pollPID);
  },

  _loadAttributes: function (attrs) {
    if (!attrs) throw new Error('no attributes were specified');

    if (!attrs.visualization_id) throw new Error('\'visualization_id\' is required');

    this.visualization_id = attrs.visualization_id;
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

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

cdb.admin.carto = cdb.admin.carto || {};

cdb.admin.carto.category = {
  max_values: 10,
  others_value: "Others",

  /**
   *  New category generator. It replaces Color wizard
   */
  category_generator: function(table, props, changed, callback) {

    var self = this;

    var type = table.geomColumnTypes() && table.geomColumnTypes()[0] || "polygon";


    // Get fill cartocss parameter
    var fill = 'polygon-fill';
    switch (type) {
      case 'polygon': fill = 'polygon-fill'; break;
      case 'line':    fill = 'line-color'; break;
      default:        fill = 'marker-fill';
    }

    // Generate default styles
    var table_name = table.getUnqualifiedName();
    var css = '#' + table_name + " {\n";

    var cartocss_props = manage_carto_properies(props);

    for (var i in cartocss_props) {
      if (i !== "categories" && i !=="colors" &&  i !== "property") {
        css +=  "   " + i + ": " + props[i] + ";\n";
      }
    }

    // Close defaults
    css += "}\n";

    if (changed.property || !props.categories || props.categories.length === 0) {
      this.get_categories(props.property, table, function(colors) {
        callback(css + self.generate_categories(props, table, colors), colors);
      });
    } else {
      callback(css + this.generate_categories(props, table, props.categories), props.categories);
    }
  },

  // Get values with default colors from the sql
  get_categories: function(property, table, callback) {

    var self = this;

    // We request an extra category to determine if we need to display the "Others" legend
    table.data().categoriesForColumn(this.max_values + 1, property, function(cat) {
      var column_type = cat.type;
      var showOthers = cat.categories.length > self.max_values;

      // Limit the categories we display and sort them alphabetically
      var categories = cat.categories.slice(0, self.max_values).sort();

      var colors = [];

      // Generate categories metadata
      for (var i in categories) {
        var obj = {};
        obj.title = categories[i];
        obj.title_type = column_type;
        obj.color = cdb.admin.color_brewer[i];
        obj.value_type = 'color';
        colors.push(obj);
      }
      if (showOthers) {
        colors.push({
          title: self.others_value,
          value_type: 'color',
          color: cdb.admin.color_brewer[categories.length],
          default: true
        })
      }
      callback(colors);
    });
  },

  // Generate categories css 
  generate_categories: function(props, table, metadata, property_name) {
    property_name = property_name || props['property'];

    function _normalizeValue(v) {
      return v.replace(/\n/g,'\\n')
              // .replace(/\'/g, "\\'") // Not necessary right now becuase tiler does it itself.
              .replace(/\"/g, "\\\"");
    }

    var table_name = table.getUnqualifiedName();
    var css = '';
    var type = table.geomColumnTypes() && table.geomColumnTypes()[0] || "polygon";
    var categories = metadata || props.categories;
    if (categories) {
      // type of the column, number -> no quotes, string -> quotes, boolean -> no quotes
      for (var i in categories) {

        var category = categories[i][categories[i].value_type];
        var fill = 'polygon-fill';

        switch (type) {
          case 'polygon': fill = (categories[i].value_type == "file") ? 'polygon-pattern-file' : 'polygon-fill'; break;
          case 'line':    fill = (categories[i].value_type == "file") ? 'line-pattern-file' : 'line-color'; break;
          default:        fill = (categories[i].value_type == "file") ? 'marker-file' : 'marker-fill';
        }

        if (categories[i]["default"]) {
          // Default category
          css += "\n#" + table_name + " {\n   " + fill + ": " + category + ";\n}";
        } else {
          // Set correct value type
          var value = '';
          if (categories[i].title_type != "string" || categories[i].title === null) {
            value = categories[i].title;
          } else {
            value = "\"" + _normalizeValue(categories[i].title) + "\"";
          }

          // Custom category
          css += "\n#" + table_name + "[" + property_name + "=" + value + "] {\n   " + fill + ": " + category + ";\n";

          // Trick!
          // When polygon-pattern-file is applied, we have to
          // remove the polygon fill opacity and apply polygon-pattern-opacity (-:(·):-)
          if (type === "polygon" && fill === "polygon-pattern-file") {
            css += "   polygon-opacity:0;\n";
            css += "   polygon-pattern-opacity:" + (props['polygon-opacity'] || 1) + ";\n";
          }

          css += "}";
        }
      }
    }

    return css;
  }

}

cdb.admin.carto = cdb.admin.carto || {};

cdb.admin.carto.torque = {

  torque_generator: function(table, props, changed, callback) {
    var carto_props = _.omit(props, [
      'property',
      'torque-duration',
      'torque-frame-count',
      'torque-blend-mode',
      'torque-trails',
      'torque-cumulative',
      'torque-resolution',
      'torque-aggregation-function'
    ]);

    var torque_props =
    "Map {\n" +
      [
      '-torque-frame-count:' + props['torque-frame-count'],
      '-torque-animation-duration:' + props['torque-duration'],
      '-torque-time-attribute:"' + props['property'] + '"',
      '-torque-aggregation-function:' + (props['torque-aggregation-function'] ? '"' + props['torque-aggregation-function'] + '"': '"count(cartodb_id)"'),
      '-torque-resolution:' + props['torque-resolution'],
      '-torque-data-aggregation:' + (props['torque-cumulative'] ? 'cumulative': 'linear')
      ].join(';\n') +
    ";\n}";

    if(props['torque-blend-mode']) {
      carto_props['comp-op'] = props['torque-blend-mode'];
    }

    if (carto_props['type'] === 'torque_heat') {
      if(typeof carto_props['marker-opacity'] === 'number'){
        carto_props['marker-opacity'] += "*[value]";
      }
    }

    simple_polygon_generator(table, carto_props, changed, function(css) {
      // add trails
      for (var i = 1; i <= props['torque-trails']; ++i) {
       var trail = "\n#" + table.getUnqualifiedName() + "[frame-offset=" + i  +"] {\n marker-width:" + (props['marker-width'] + 2*i) + ";\n marker-fill-opacity:" + (props['marker-opacity']/(2*i)) +"; \n}";
       css += trail;
      }
      callback(torque_props + "\n\n" + css);
    });
  }

};

cdb.admin.carto = cdb.admin.carto || {};

cdb.admin.carto.torque_cat = {

  sql: function(categories, column) {
    function _normalizeValue(v) {
      return v.replace(/\n/g,'\\n').replace(/\"/g, "\\\"");
    }
    var s = ['select *, (CASE'];
    torque_cat = 1;
    for(var c in categories) {
      var cat = categories[c];
      var value;
      if (cat.title_type !== "string" || cat.title === null) {
        if (cat.title === cdb.admin.carto.category.others_value) {
          value = undefined;
        } else {
          value = cat.title;
        }
      } else {
        value = "\'" + _normalizeValue(cat.title) + "\'";
      }
      if (value !== undefined) {
        if (value === null) {
          s.push('WHEN "' + column + '" is ' + value + ' THEN ' + (torque_cat) );
        } else {
          s.push('WHEN "' + column + '" = ' + value + ' THEN ' + (torque_cat) );
        }
        torque_cat += 1;
      }
    }
    s.push('ELSE ' + torque_cat + ' END) as torque_category FROM __wrapped _cdb_wrap');
    return s.join(' ');
  },

  generate: function(table, props, changed, callback) {
    var self = this;

    // return torque cateogries form real categories
    function torque_categories(categories) {
      return _.map(categories, function(c, i) {
        c = _.clone(c);
        c.title = i + 1;
        c.title_type = 'number';
        return c;
      });
    }

    var cat = cdb.admin.carto.category;
    props['torque-aggregation-function'] = 'CDB_Math_Mode(torque_category)';
    cdb.admin.carto.torque.torque_generator(table, props, changed, function(css) {
      function gen(colors) {
          // modify to assign one integer for each cat
          var cats = torque_categories(colors);
          var sql = self.sql(colors, props.property_cat);
          callback(css + cat.generate_categories(props, table, cats, 'value'), colors, sql);
      }

      // if changed generate again if not reuse existing ones
      if (changed.property_cat || !props.categories || props.categories.length === 0) {
        cat.get_categories(props.property_cat, table, gen);
      } else {
        gen(props.categories);
      }
    });
  }

};



  /*
   *  User asset Model
   */

  cdb.admin.Asset = cdb.core.Model.extend({
    
    defaults: {
      state:  'idle',
      name:   ''
    }

  });


  /*
   *  User assets Collection
   */

  cdb.admin.Assets = Backbone.Collection.extend({

    model: cdb.admin.Asset,

    url: function(method) {
      var version = cdb.config.urlVersion('asset', method);
      return '/api/' + version + '/users/' + this.user.id + '/assets'
    },

    initialize: function(models, opts) {
      this.user = opts.user;
    },

    parse: function(resp, xhr) {
      return resp.assets;
    }

  });


  /**
   *  Static assets
   *
   */

  cdb.admin.StaticAsset = cdb.admin.Asset.extend({

    defaults: {
      state:      'idle',
      public_url: '',
      kind:       'marker',
      name:       '',
      host:       'http://com.cartodb.users-assets.production.s3.amazonaws.com',
      folder:     'maki-icons',
      ext:        'svg',
      size:       '18'
    },

    toJSON: function() {
      var c = _.clone(this.attributes);
      c['public_url'] = this.get("host") + '/' + this.get("folder") + '/' + c['icon'] + (this.get("size") ? '-' + this.get("size") : '') + '.' + this.get("ext");
      return c;
    },
    
    get: function(attr) {
      var r = this.attributes[attr];

      if (attr === "public_url") {
        r = this.get("host") + '/' + this.get("folder") + '/' + this.attributes['icon'] + (this.get("size") ? '-' + this.get("size") : '') + '.' + this.get("ext");
      }

      return r;
    }

  });



  /*
   *  Static assets Collection
   */

  cdb.admin.StaticAssets = cdb.admin.Assets.extend({

    model: cdb.admin.StaticAsset,

    url: function() { return '' },

    initialize: function(models, opts) {},

    parse: function(resp, xhr) { return [] }

  });


carto_quotables = [
  'text-face-name'
];

carto_variables = [
  'text-name'
];

var carto_functionMap= {
  'Equal Interval': 'equalInterval',
  'Jenks': 'jenkBins',
  'Heads/Tails': 'headTails',
  'Quantile': 'quantileBins'
};

DEFAULT_QFUNCTION = 'Quantile';

/**
 *  Manage some carto properties depending on
 *  type (line, polygon or point), for choropleth.
 */
function manage_choropleth_props(type, props) {
  var carto_props = {
    'marker-width': props['marker-width'],
    'marker-fill-opacity': props['marker-opacity'],
    'marker-line-width': props['marker-line-width'],
    'marker-line-color': props['marker-line-color'],
    'marker-line-opacity': props['marker-line-opacity'],
    'marker-allow-overlap': props['marker-allow-overlap'],
    'line-color': props['line-color'],
    'line-opacity': props['line-opacity'],
    'line-width': props['line-width'],
    'polygon-opacity': type == "line" ? 0 : props['polygon-opacity'],
    'text-name': props['text-name'],
    'text-halo-fill': props['text-halo-fill'],
    'text-halo-radius': props['text-halo-radius'],
    'text-face-name': props['text-face-name'],
    'text-size': props['text-size'],
    'text-dy': props['text-dy'],
    'text-allow-overlap': props['text-allow-overlap'],
    'text-placement': props['text-placement'],
    'text-placement-type': props['text-placement-type'],
    'text-label-position-tolerance': props['text-label-position-tolerance'],
    'text-fill': props['text-fill']
  }

  // Remove all undefined properties
  _.each(carto_props, function(v, k){
    if(v === undefined) delete carto_props[k];
  });

  return carto_props;
}

function getProp(obj, prop) {
  var p = [];
  for(var k in obj) {
    var v = obj[k];
    if (k === prop) {
      p.push(v);
    } else if (typeof(v) === 'object') {
      p = p.concat(getProp(v, prop));
    }
  }
  return p;
}

var _cartocss_spec_props = getProp(carto.default_reference.version.latest, 'css');

/**
 * some carto properties depends on others, this function
 * remove or add properties needed to carto works
 */
function manage_carto_properies(props) {

  if(/none/i.test(props['text-name']) || !props['text-name']) {
    // remove all text-* properties
    for(var p in props) {
      if(isTextProperty(p)) {
        delete props[p];
      }
    }
  }

  if(/none/i.test(props['polygon-comp-op'])) {
    delete props['polygon-comp-op'];
  }
  if(/none/i.test(props['line-comp-op'])) {
    delete props['line-comp-op'];
  }
  if(/none/i.test(props['marker-comp-op'])) {
    delete props['marker-comp-op'];
  }

  // if polygon-pattern-file is present polygon-fill should be removed
  if('polygon-pattern-file' in props) {
    delete props['polygon-fill'];
  }

  delete props.zoom;

  // translate props
  props = translate_carto_properties(props);

  return _.pick(props, _cartocss_spec_props);

}

function isTextProperty(p) {
  return /^text-/.test(p);
}

function generate_carto_properties(props) {
  return _(props).map(function(v, k) {
    if(_.include(carto_quotables, k)) {
      v = "'" + v + "'";
    }
    if(_.include(carto_variables, k)) {
      v = "[" + v + "]";
    }
    return "  " + k + ": " + v + ";";
  });
}

function filter_props(props, fn) {
  var p = {};
  for(var k in props) {
    var v = props[k];
    if(fn(k, v)) {
      p[k] = v;
    }
  }
  return p;
}

function translate_carto_properties(props) {
  if ('marker-opacity' in props) {
    props['marker-fill-opacity'] = props['marker-opacity'];
    delete props['marker-opacity'];
  }
  return props;
}

function simple_polygon_generator(table, props, changed, callback) {

  // remove unnecesary properties, for example
  // if the text-name is not present remove all the
  // properties related to text
  props = manage_carto_properies(props);

  var text_properties = filter_props(props, function(k, v) { return isTextProperty(k); });
  var general_properties = filter_props(props, function(k, v) { return !isTextProperty(k); });


  // generate cartocss with the properties
  generalLayerProps = generate_carto_properties(general_properties);
  textLayerProps = generate_carto_properties(text_properties);


  // layer with non-text properties
  var generalLayer = "#" + table.getUnqualifiedName() + "{\n" + generalLayerProps.join('\n') + "\n}";
  var textLayer = '';
  if (_.size(textLayerProps)) {
    textLayer = "\n\n#" + table.getUnqualifiedName() + "::labels {\n" + textLayerProps.join('\n') + "\n}\n";
  }

  // text properties layer
  callback(generalLayer + textLayer);
}

function intensity_generator(table, props, changed, callback) {

  // remove unnecesary properties, for example
  // if the text-name is not present remove all the
  // properties related to text
  props = manage_carto_properies(props);

  var carto_props = {
    'marker-fill': props['marker-fill'],
    'marker-width': props['marker-width'],
    'marker-line-color': props['marker-line-color'],
    'marker-line-width': props['marker-line-width'],
    'marker-line-opacity': props['marker-line-opacity'],
    'marker-fill-opacity': props['marker-fill-opacity'],
    'marker-comp-op': 'multiply',
    'marker-type': 'ellipse',
    'marker-placement': 'point',
    'marker-allow-overlap': true,
    'marker-clip': false,
    'marker-multi-policy': 'largest'
  };

  var table_name = table.getUnqualifiedName();
  var css = "\n#" + table_name +"{\n";

  _(carto_props).each(function(prop, name) {
    css += "  " + name + ": " + prop + "; \n";
  });

  css += "}";
  callback(css);

}

function cluster_sql(table, zoom, props, nquartiles) {

  var grids = ["A", "B", "C", "D", "E"];
  var bucket = "bucket" + grids[0];
  var mainBucket = bucket;

  var sizes = [];
  var step = 1 / (nquartiles + 1);

  for (var i = 0; i < nquartiles; i++) {
    sizes.push( 1 - step * i)
  }

  var sql = "WITH meta AS ( " +
    "   SELECT greatest(!pixel_width!,!pixel_height!) as psz, ext, ST_XMin(ext) xmin, ST_YMin(ext) ymin FROM (SELECT !bbox! as ext) a " +
    " ), " +
    " filtered_table AS ( " +
    "   SELECT t.* FROM <%= table %> t, meta m WHERE t.the_geom_webmercator && m.ext " +
    " ), ";

  for (var i = 0; i<nquartiles; i++) {
    bucket = "bucket" + grids[i];

    if (i == 0){
      sql += mainBucket + "_snap AS (SELECT ST_SnapToGrid(f.the_geom_webmercator, 0, 0, m.psz * <%= size %>, m.psz * <%= size %>) the_geom_webmercator, count(*) as points_count, 1 as cartodb_id, array_agg(f.cartodb_id) AS id_list "
    }
    if (i > 0){
      sql += "\n" + bucket + "_snap AS (SELECT ST_SnapToGrid(f.the_geom_webmercator, 0, 0, m.psz * " + sizes[i] + " * <%= size %>, m.psz * " + sizes[i] + " * <%= size %>) the_geom_webmercator, count(*) as points_count, 1 as cartodb_id, array_agg(f.cartodb_id) AS id_list "
    }

    sql += " FROM filtered_table f, meta m "

    if (i == 0){
      sql += " GROUP BY ST_SnapToGrid(f.the_geom_webmercator, 0, 0, m.psz * <%= size %>, m.psz * <%= size %>), m.xmin, m.ymin), ";
    }

    if (i > 0){
      sql += " WHERE cartodb_id NOT IN (select unnest(id_list) FROM " + mainBucket + ") ";

      for (var j = 1; j<i; j++) {
        bucket2 = "bucket" + grids[j];
        sql += " AND cartodb_id NOT IN (select unnest(id_list) FROM " + bucket2 + ") ";
      }

      sql += " GROUP BY ST_SnapToGrid(f.the_geom_webmercator, 0, 0, m.psz * " + sizes[i] + " * <%= size %>, m.psz * " + sizes[i] + " * <%= size %>), m.xmin, m.ymin), ";

    }

    sql +=  bucket + "  AS (SELECT * FROM " + bucket + "_snap WHERE points_count > ";

    if (i == nquartiles - 1) {
      sql += " GREATEST(<%= size %> * 0.1, 2) ";
    } else {
      sql += " <%= size %> * " + sizes[i];
    }

    sql += " ) ";

    if (i < nquartiles - 1) sql += ", ";

  }

  sql += " SELECT the_geom_webmercator, 1 points_count, cartodb_id, ARRAY[cartodb_id] as id_list, 'origin' as src, cartodb_id::text cdb_list FROM filtered_table WHERE ";

  for (var i = 0; i < nquartiles; i++) {
    bucket = "bucket" + grids[i];
    sql += "\n" + (i > 0 ? "AND " : "") + "cartodb_id NOT IN (select unnest(id_list) FROM " + bucket + ") ";
  }

  for (var i = 0; i < nquartiles; i++) {
    bucket = "bucket" + grids[i];
    sql += " UNION ALL SELECT *, '" + bucket + "' as src, array_to_string(id_list, ',') cdb_list FROM " + bucket
  }

  return _.template(sql, {
    name: table.get("name"),
    //size: props["radius_min"],
    size: 48,
    table: "__wrapped"
  });
}

function cluster_generator(table, props, changed, callback) {

  var methodMap = {
    '2 Buckets': 2,
    '3 Buckets': 3,
    '4 Buckets': 4,
    '5 Buckets': 5,
  };

  var grids = ["A", "B", "C", "D", "E"];

  var nquartiles = methodMap[props['method']];
  var table_name = table.getUnqualifiedName();

  var sql = cluster_sql(table, props.zoom, props, nquartiles);

  var c = "#" + table_name + "{\n";
  c += "  marker-width: " + (Math.round(props["radius_min"]/2)) + ";\n";
  c += "  marker-fill: " + props['marker-fill'] + ";\n";
  c += "  marker-line-width: 1.5;\n";

  c += "  marker-fill-opacity: " + props['marker-opacity'] + ";\n";
  c += "  marker-line-opacity: " + props['marker-line-opacity'] + ";\n";
  c += "  marker-line-color: " + props['marker-line-color'] + ";\n";
  c += "  marker-allow-overlap: true;\n";

  var base = 20;
  var min = props["radius_min"];
  var max = props["radius_max"];
  var sizes = [min];

  var step = Math.round((max-min)/ (nquartiles - 1));

  for (var i = 1; i < nquartiles - 1; i++) {
    sizes.push(min + step * i);
  }

  sizes.push(max);

  for (var i = 0; i < nquartiles; i++) {
    c += "\n  [src = 'bucket"+grids[nquartiles - i - 1]+"'] {\n";
    c += "    marker-line-width: " + props['marker-line-width'] + ";\n";
    c += "    marker-width: " + sizes[i] + ";\n";
    c += "  } \n";
  }

  c += "}\n\n";

  // Generate label properties
  c += "#" + table.getUnqualifiedName() + "::labels { \n";
  c += "  text-size: 0; \n";
  c += "  text-fill: " + props['text-fill'] + "; \n";
  c += "  text-opacity: 0.8;\n";
  c += "  text-name: [points_count]; \n";
  c += "  text-face-name: '" + props['text-face-name'] + "'; \n";
  c += "  text-halo-fill: " + props['text-halo-fill'] + "; \n";
  c += "  text-halo-radius: 0; \n";

  for (var i = 0; i < nquartiles; i++) {
    c += "\n  [src = 'bucket"+grids[nquartiles - i - 1]+"'] {\n";
    c += "    text-size: " + (i * 5 + 12) + ";\n";
    c += "    text-halo-radius: " + props['text-halo-radius'] + ";";
    c += "\n  }\n";
  }

  c += "\n  text-allow-overlap: true;\n\n";
  c += "  [zoom>11]{ text-size: " + Math.round(props["radius_min"] * 0.66) + "; }\n";
  c += "  [points_count = 1]{ text-size: 0; }\n";
  c += "}\n";

  callback(c, {}, sql);

}

function bubble_generator(table, props, changed, callback) {
  var carto_props = {
   'marker-fill': props['marker-fill'],
   'marker-line-color': props['marker-line-color'],
   'marker-line-width': props['marker-line-width'],
   'marker-line-opacity': props['marker-line-opacity'],
   'marker-fill-opacity': props['marker-opacity'],
   'marker-comp-op': props['marker-comp-op'],
   'marker-placement': 'point',
   'marker-type': 'ellipse',
   'marker-allow-overlap': true,
   'marker-clip':false,
   'marker-multi-policy':'largest'
  };

  var prop = props['property'];
  var min = props['radius_min'];
  var max = props['radius_max'];
  var fn = carto_functionMap[props['qfunction'] || DEFAULT_QFUNCTION];

  if(/none/i.test(props['marker-comp-op'])) {
    delete carto_props['marker-comp-op'];
  }

  var values = [];

  var NPOINS = 10;
  // TODO: make this related to the quartiles size
  // instead of linear. The circle area should be related
  // to the data and a little correction due to the problems
  // humans have to measure the area of a circle

  //calculate the bubles sizes
  for(var i = 0; i < NPOINS; ++i) {
    var t = i/(NPOINS-1);
    values.push(min + t*(max - min));
  }

  // generate carto
  simple_polygon_generator(table, carto_props, changed, function(css) {
    var table_name = table.getUnqualifiedName();
    table.data()[fn](NPOINS, prop, function(quartiles)  {
      for(var i = NPOINS - 1; i >= 0; --i) {
        if(quartiles[i] !== undefined && quartiles[i] != null) {
          css += "\n#" + table_name +" [ " + prop + " <= " + quartiles[i] + "] {\n"
          css += "   marker-width: " + values[i].toFixed(1) + ";\n}"
        }
      }
      callback(css, quartiles);
    });
  });
}

/**
 * when quartiles are greater than 1<<31 cast to float added .01
 * at the end. If you append only .0 it is casted to int and it
 * does not work
 */
function normalizeQuartiles(quartiles) {
  var maxNumber = 2147483648; // unsigned (1<<31);
  var normalized = [];
  for(var i = 0;  i < quartiles.length; ++i) {
    var q = quartiles[i];
    if(q > Math.abs(maxNumber) && String(q).indexOf('.') === -1) {
      q = q + ".01";
    }
    normalized.push(q);
  }
  return normalized;
}

function choropleth_generator(table, props, changed, callback) {
  var type = table.geomColumnTypes() && table.geomColumnTypes()[0] || "polygon";

  var carto_props = manage_choropleth_props(type,props);

  if(props['polygon-comp-op'] && !/none/i.test(props['polygon-comp-op'])) {
    carto_props['polygon-comp-op'] = props['polygon-comp-op'];
  }
  if(props['line-comp-op'] && !/none/i.test(props['line-comp-op'])) {
    carto_props['line-comp-op'] = props['line-comp-op'];
  }
  if(props['marker-comp-op'] && !/none/i.test(props['marker-comp-op'])) {
    carto_props['marker-comp-op'] = props['marker-comp-op'];
  }

  var methodMap = {
    '3 Buckets': 3,
    '5 Buckets': 5,
    '7 Buckets': 7
  };


  if(!props['color_ramp']) {
    return;
  }

  var fn = carto_functionMap[props['qfunction'] || DEFAULT_QFUNCTION];
  var prop = props['property'];
  var nquartiles = methodMap[props['method']];
  var ramp = cdb.admin.color_ramps[props['color_ramp']][nquartiles];

  if(!ramp) {
    cdb.log.error("no color ramp defined for " + nquartiles + " quartiles");
  } else {

    if (type == "line") {
      carto_props["line-color"] = ramp[0];
    } else if (type == "polygon") {
      carto_props["polygon-fill"] = ramp[0];
    } else {
      carto_props["marker-fill"] = ramp[0];
    }

  }

  simple_polygon_generator(table, carto_props, changed, function(css) {
    var table_name = table.getUnqualifiedName();
    table.data()[fn](nquartiles, prop, function(quartiles)  {
      quartiles = normalizeQuartiles(quartiles);
      for(var i = nquartiles - 1; i >= 0; --i) {
        if(quartiles[i] !== undefined && quartiles[i] != null) {
          css += "\n#" + table_name +" [ " + prop + " <= " + quartiles[i] + "] {\n";

          if (type == "line") {
            css += "   line-color: " + ramp[i] + ";\n}"
          } else if (type == "polygon") {
            css += "   polygon-fill: " + ramp[i] + ";\n}"
          } else {
            css += "   marker-fill: " + ramp[i] + ";\n}"
          }
        }
      }
      callback(css, quartiles);
    });
  });
}


function density_sql(table, zoom, props) {
    var prop = 'cartodb_id';
    var sql;

    // we generate a grid and get the number of points
    // for each cell. With that the density is generated
    // and calculated for zoom level 10, which is taken as reference when we calculate the quartiles for the style buclets
    // see models/carto.js
    if(props['geometry_type'] === 'Rectangles') {
      sql = "WITH hgrid AS (SELECT CDB_RectangleGrid(ST_Expand(!bbox!, greatest(!pixel_width!,!pixel_height!) * <%= size %>), greatest(!pixel_width!,!pixel_height!) * <%= size %>, greatest(!pixel_width!,!pixel_height!) * <%= size %>) as cell) SELECT hgrid.cell as the_geom_webmercator, count(i.<%=prop%>) as points_count,count(i.<%=prop%>)/power( <%= size %> * CDB_XYZ_Resolution(<%= z %>), 2 )  as points_density, 1 as cartodb_id FROM hgrid, <%= table %> i where ST_Intersects(i.the_geom_webmercator, hgrid.cell) GROUP BY hgrid.cell";
    } else {
      sql = "WITH hgrid AS (SELECT CDB_HexagonGrid(ST_Expand(!bbox!, greatest(!pixel_width!,!pixel_height!) * <%= size %>), greatest(!pixel_width!,!pixel_height!) * <%= size %>) as cell) SELECT hgrid.cell as the_geom_webmercator, count(i.<%=prop%>) as points_count, count(i.<%=prop%>)/power( <%= size %> * CDB_XYZ_Resolution(<%= z %>), 2 ) as points_density, 1 as cartodb_id FROM hgrid, <%= table %> i where ST_Intersects(i.the_geom_webmercator, hgrid.cell) GROUP BY hgrid.cell";
    }
    return _.template(sql, {
      prop: prop,
      table: '__wrapped',
      size: props['polygon-size'],
      z: zoom
    });
}

/*
 *
 */
function density_generator(table, props, changed, callback) {
  var carto_props = {
   'line-color': props['line-color'],
   'line-opacity': props['line-opacity'],
   'line-width': props['line-width'],
   'polygon-opacity': props['polygon-opacity'],
   'polygon-comp-op': props['polygon-comp-op']
  }

  if(/none/i.test(props['polygon-comp-op'])) {
    delete carto_props['polygon-comp-op'];
  }

  var methodMap = {
    '3 Buckets': 3,
    '5 Buckets': 5,
    '7 Buckets': 7
  };

  var polygon_size = props['polygon-size'];
  var nquartiles = methodMap[props['method']];
  var ramp = cdb.admin.color_ramps[props['color_ramp']][nquartiles];

  if(!ramp) {
    cdb.log.error("no color ramp defined for " + nquartiles + " quartiles");
  }

  carto_props['polygon-fill'] = ramp[ramp.length - 1];

  var density_sql_gen = density_sql(table, props.zoom, props);

  simple_polygon_generator(table, carto_props, changed, function(css) {

    // density
    var tmpl = _.template("" +
    "WITH clusters as ( " +
    "SELECT  " +
        "cartodb_id,   " +
        "st_snaptogrid(the_geom_webmercator, <%= polygon_size %>*CDB_XYZ_Resolution(<%= z %>)) as center  " +
    "FROM <%= table_name %>" +
    "), " +
    "points as ( " +
        "SELECT  " +
            "count(cartodb_id) as npoints,  " +
            "count(cartodb_id)/power( <%= polygon_size %> * CDB_XYZ_Resolution(<%= z %>), 2 ) as density  " +
        "FROM  " +
            "clusters  " +
        "group by  " +
            "center " +
    "), " +
    "stats as ( " +
        "SELECT  " +
            "npoints,  " +
            "density,  " +
            "ntile(<%= slots %>) over (order by density) as quartile  " +
        "FROM points  " +
    ")  " +
    "SELECT  " +
        "quartile,  " +
        "max(npoints) as maxAmount,  " +
        "max(density) as maxDensity   " +
    "FROM stats  " +
    "GROUP BY quartile ORDER BY quartile ");

    var sql = tmpl({
        slots: nquartiles,
        table_name: table.get('name'),
        polygon_size: polygon_size,
        z: props.zoom
    });

    table.data()._sqlQuery(sql, function(data) {
      // extract quartiles by zoom level
      var rows = data.rows;
      var quartiles = [];
      for(var i = 0; i < rows.length; ++i) {
        quartiles.push(rows[i].maxdensity);
      }

      quartiles = normalizeQuartiles(quartiles);
      var table_name = table.getUnqualifiedName();

      css += "\n#" + table_name + "{\n"
      for(var i = nquartiles - 1; i >= 0; --i) {
        if(quartiles[i] !== undefined) {
          css += "  [points_density <= " + quartiles[i] + "] { polygon-fill: " + ramp[i] + ";  }\n";
        }
      }
      css += "\n}"

      callback(css, quartiles, density_sql_gen);
    });
  });
}

cdb.admin.CartoStyles = Backbone.Model.extend({

    defaults: {
      type: 'polygon',
      properties: {
        'polygon-fill': '#FF6600',
        'line-color': '#FFFFFF',
        'line-width': 1,
        'polygon-opacity': 0.7,
        'line-opacity':1
      }
    },

    initialize: function() {
      this.table = this.get('table');

      if (!this.table) {
        throw "table must be passed as param"
        return;
      }

      this.properties = new cdb.core.Model(this.get('properties'));
      this.bind('change:properties', this._generateCarto, this);

      this.generators = {};
      this.registerGenerator('polygon',    simple_polygon_generator);
      this.registerGenerator('cluster',    cluster_generator);
      this.registerGenerator('bubble',     bubble_generator);
      this.registerGenerator('intensity',  intensity_generator);
      this.registerGenerator('choropleth', choropleth_generator);
      this.registerGenerator('color',      cdb.admin.carto.category.category_generator.bind(cdb.admin.carto.category)),
      this.registerGenerator('category',   cdb.admin.carto.category.category_generator.bind(cdb.admin.carto.category)),
      this.registerGenerator('density',    density_generator); // the same generator than choroplet
      this.registerGenerator('torque',     cdb.admin.carto.torque.torque_generator.bind(cdb.admin.carto.torque));
      this.registerGenerator('torque_heat',     cdb.admin.carto.torque.torque_generator.bind(cdb.admin.carto.torque));
      this.registerGenerator('torque_cat',     cdb.admin.carto.torque_cat.generate.bind(cdb.admin.carto.torque_cat));
    },

    // change a property attribute
    attr: function(name, val) {
      var old = this.attributes.properties[name];
      this.attributes.properties[name] = val;
      if(old != val) {
        this.trigger('change:properties', this, this.attributes.properties);
        this.trigger('changes', this);
      }
    },

    registerGenerator: function(name, gen) {
      this.generators[name] = gen;
    },

    /**
     * generate a informative header
     */
    _generateHeader: function() {
      var typeMap = {
        'polygon': 'simple'
      }
      var t = this.get('type');
      t = typeMap[t] || t;
      var c = "/** " + t + " visualization */\n\n";
      return c;
    },

    regenerate: function() {
      //TODO: apply patch if it's possible
      this._generateCarto();
    },

    _generateCarto: function(){
      var self = this;
      var gen = this.generators[this.get('type')];

      var gen_type = this.get('type');

      if(!gen) {
        cdb.log.info("can't get style generator for " + this.get('type'));
        return;
      }

      // Get changed properties
      var changed = {};
      this.properties.bind('change', function() {
        changed = this.properties.changedAttributes();
      }, this);
      this.properties.set(this.get('properties'));
      this.properties.unbind('change', null, this);
      this.trigger('loading');


      gen(this.table, this.get('properties'), changed, function(style, metadata, sql) {
        if (self.get('type') !== gen_type) {
          return;
        }
        var attrs = {
          style: self._generateHeader() + style
        };

        if(sql) {
          attrs.sql = sql;
        } else {
          self.unset('sql', { silent: true });
        }

        if (metadata) {
          attrs.metadata = metadata;
        }

        self.set(attrs, { silent: true });

        self.change({ changes: {'style': ''}});
        self.trigger('load');
      })
    }

}, {
    DEFAULT_GEOMETRY_STYLE: "{\n // points\n [mapnik-geometry-type=point] {\n    marker-fill: #FF6600;\n    marker-opacity: 1;\n    marker-width: 12;\n    marker-line-color: white;\n    marker-line-width: 3;\n    marker-line-opacity: 0.9;\n    marker-placement: point;\n    marker-type: ellipse;marker-allow-overlap: true;\n  }\n\n //lines\n [mapnik-geometry-type=linestring] {\n    line-color: #FF6600; \n    line-width: 2; \n    line-opacity: 0.7;\n  }\n\n //polygons\n [mapnik-geometry-type=polygon] {\n    polygon-fill:#FF6600;\n    polygon-opacity: 0.7;\n    line-opacity:1;\n    line-color: #FFFFFF;\n   }\n }",
});


/**
 * this class provides methods to parse and extract information from the
 * cartocss like expressions used, filters, colors and errors
 */

cdb.admin.CartoParser = function(cartocss) {
  this.parse_env = null;
  this.ruleset = null;
  if(cartocss) {
    this.parse(cartocss);
  }
}

cdb.admin.CartoParser.prototype = {

  RESERVED_VARIABLES: ['mapnik-geometry-type', 'points_density', 'points_count', 'src', 'value'], // value due to torque

  parse: function(cartocss) {
    var self = this;
    var parse_env = this.parse_env = {
      validation_data: false,
      frames: [],
      errors: [],
      error: function(obj) {
        obj.line =  carto.Parser().extractErrorLine(cartocss, obj.index);
        this.errors.push(obj);
      }
    };

    var ruleset = null;
    var defs = null;
    try {
      // set default reference
      carto.tree.Reference.setData(carto.default_reference.version.latest);
      ruleset = (new carto.Parser(parse_env)).parse(cartocss);
    } catch(e) {
      // add the style.mss string to match the response from the server
      this.parse_env.errors = this._parseError(["style\.mss" + e.message])
      return;
    }
    if(ruleset) {
      var existing = {}
      this.definitions = defs = ruleset.toList(parse_env);
      var mapDef;
      for(var i in defs){
        if(defs[i].elements.length > 0){
            if(defs[i].elements[0].value === "Map"){
                mapDef = defs.splice(i, 1)[0];
            }
        }
      }
      var symbolizers = torque.cartocss_reference.version.latest.layer;
      if (mapDef){
        mapDef.rules.forEach(function(r){
          var key = r.name;
          if (!(key in symbolizers)) {
              parse_env.error({
                  message: 'Rule ' + key + ' not allowed for Map.',
                  index: r.index
              });
          }
          else{
            var type = symbolizers[r.name].type;
            var element = r.value.value[0].value[0];
            if(!self._checkValidType(element, type)){
              parse_env.error({
                  message: 'Expected type ' + type + '.' ,
                  index: r.index
              });
            }
          }
        });
      }
      var defs = carto.inheritDefinitions(defs, parse_env);
      defs = carto.sortStyles(defs, parse_env);
      for (var i in defs) {
        for (var j in defs[i]) {
          var r = defs[i][j]
          if(r && r.toXML) {
            r.toXML(parse_env, existing);
          }
        }
      }

      // toList uses parse_env.errors.message to put messages
      if (parse_env.errors.message) {
        _(parse_env.errors.message.split('\n')).each(function(m) {
          parse_env.errors.push(m);
        });
      }
    }
    this.ruleset = ruleset;
    return this;
  },

  _checkValidType: function(e, type){
    if (["number", "float"].indexOf(type) > -1) {
      return typeof e.value === "number";
    }
    else if (type === "string"){
      return e.value !== "undefined" && typeof e.value === "string";
    } 
    else if (type.constructor === Array){
      return type.indexOf(e.value) > -1 || e.value === "linear";
    }
    else if (type === "color"){
      return checkValidColor(e);
    }
    return true;
  },

  _checkValidColor: function(e){
    var expectedArguments = { rgb: 3, hsl: 3, rgba: 4, hsla: 4};
    return typeof e.rgb !== "undefined" || expectedArguments[e.name] === e.args;
  },

  /**
   * gets an array of parse errors from windshaft
   * and returns an array of {line:1, error: 'string'] with user friendly
   * strings. Parses errors in format:
   *
   *  'style.mss:7:2 Invalid code: asdasdasda'
   */
  _parseError: function(errors) {
    var parsedErrors = [];
    for(var i in errors) {
      var err = errors[i];
      if(err && err.length > 0) {
        var g = err.match(/.*:(\d+):(\d+)\s*(.*)/);
        if(g) {
          parsedErrors.push({
            line: parseInt(g[1], 10),
            message: g[3]
          });
        } else {
          parsedErrors.push({
            line: null,
            message: err
          })
        }
      }
    }
    // sort by line
    parsedErrors.sort(function(a, b) { return a.line - b.line; });
    parsedErrors = _.uniq(parsedErrors, true, function(a) { return a.line + a.message; });
    return parsedErrors;
  },

  /**
   * return the error list, empty if there were no errors
   */
  errors: function() {
    return this.parse_env ? this.parse_env.errors : [];
  },

  _colorsFromRule: function(rule) {
    var self = this;
    function searchRecursiveByType(v, t) {
      var res = []
      for(var i in v) {
        if(v[i] instanceof t) {
          res.push(v[i]);
        } else if(typeof(v[i]) === 'object') {
          var r = searchRecursiveByType(v[i], t);
          if(r.length) {
            res = res.concat(r);
          }
        }
      }
      return res;
    }
    return searchRecursiveByType(rule.ev(this.parse_env), carto.tree.Color);
  },

  _varsFromRule: function(rule) {
    function searchRecursiveByType(v, t) {
      var res = []
      for(var i in v) {
        if(v[i] instanceof t) {
          res.push(v[i]);
        } else if(typeof(v[i]) === 'object') {
          var r = searchRecursiveByType(v[i], t);
          if(r.length) {
            res = res.concat(r);
          }
        }
      }
      return res;
    }
    return searchRecursiveByType(rule, carto.tree.Field);
  },

  /**
   * Extract information from the carto using the provided method.
   * */
  _extract: function(method, extractVariables) {
    var columns = [];
    if (this.ruleset) {
      var definitions = this.ruleset.toList(this.parse_env);
      for (var d in definitions) {
        var def = definitions[d];

         if(def.filters) {
          // extract from rules
          for(var r in def.rules) {
            var rule = def.rules[r];
            var columnList = method(this, rule);
            columns = columns.concat(columnList);
          }

          if (extractVariables) {
            for(var f in def.filters) {
              var filter = def.filters[f];
              for (var k in filter) {
                var filter_key = filter[k]
                if (filter_key.key && filter_key.key.value) {
                  columns.push(filter_key.key.value);
                }
              }
          }
        }
      }
    }
    var self = this;
    return _.reject(_.uniq(columns), function(v) {
      return _.contains(self.RESERVED_VARIABLES, v);
    });
    }
  },

  /**
   * return a list of colors used in cartocss
   */
  colorsUsed: function(opt) {

    // extraction method
    var method = function(self, rule) {
      return _.map(self._colorsFromRule(rule), function(f) {
        return f.rgb;
      })
    };

    var colors =  this._extract(method, false);

    if (opt && opt.mode == 'hex') {
      colors = _.map(colors, function(color) {
        return cdb.Utils.rgbToHex(color[0], color[1], color[2]);
      });

    }

    return colors;

  },

  /**
   * return a list of variables used in cartocss
   */
  variablesUsed: function() {

    // extraction method
    var method = function(self, rule) {
      return _.map(self._varsFromRule(rule), function(f) {
        return f.value;
      });
    };

    return this._extract(method, true);
   },

  /**
   * returns the default layer
   */
  getDefaultRules: function() {
    var rules = [];
    for(var i = 0; i < this.definitions.length; ++i) {
      var def = this.definitions[i];
      // all zooms and default attachment so we don't get conditional variables
      if (def.zoom === 8388607 && _.size(def.filters.filters) === 0 && def.attachment === '__default__') {
        rules = rules.concat(def.rules);
      }
    }

    var rulesMap = {};
    for (var r in rules) {
      var rule = rules[r];
      rulesMap[rule.name] = rule;
    }
    return rulesMap;
  },

  getRuleByName: function(definition, ruleName) {
    if (!definition._rulesByName) {
      var rulesMap = definition._rulesByName = {};
      for (var r in definition.rules) {
        var rule = definition.rules[r];
        rulesMap[rule.name] = rule;
      }
    }
    return definition._rulesByName[ruleName];
  }


};


/**
 * color ramps for choroplet visualization
 */

cdb.admin.color_ramps = {
  green: {
   '3': ['#E5F5F9', '#99D8C9', '#2CA25F'],
   '4': ['#EDF8FB', '#B2E2E2', '#66C2A4', '#238B45'],
   '5': ['#EDF8FB', '#B2E2E2', '#66C2A4', '#2CA25F', '#006D2C'],
   '6': ['#EDF8FB', '#CCECE6', '#99D8C9', '#66C2A4', '#2CA25F', '#006D2C'],
   '7': ['#EDF8FB', '#D7FAF4', '#CCECE6', '#66C2A4', '#41AE76', '#238B45', '#005824']
  },
  blue: {
    '3': ['#EDF8B1', '#7FCDBB', '#2C7FB8'],
    '4': ['#FFFFCC', '#A1DAB4', '#41B6C4', '#225EA8'],
    '5': ['#FFFFCC', '#A1DAB4', '#41B6C4', '#2C7FB8', '#253494'],
    '6': ['#FFFFCC', '#C7E9B4', '#7FCDBB', '#41B6C4', '#2C7FB8', '#253494'],
    '7': ['#FFFFCC', '#C7E9B4', '#7FCDBB', '#41B6C4', '#1D91C0', '#225EA8', '#0C2C84']
        },
  pink: {
    '3': ['#E7E1EF', '#C994C7', '#DD1C77'],
    '4': ['#F1EEF6', '#D7B5D8', '#DF65B0', '#CE1256'],
    '5': ['#F1EEF6', '#D7B5D8', '#DF65B0', '#DD1C77', '#980043'],
    '6': ['#F1EEF6', '#D4B9DA', '#C994C7', '#DF65B0', '#DD1C77', '#980043'],
    '7': ['#F1EEF6', '#D4B9DA', '#C994C7', '#DF65B0', '#E7298A', '#CE1256', '#91003F']
        },
  black: {
    '3': ['#F0F0F0', '#BDBDBD', '#636363'],
    '4': ['#F7F7F7', '#CCCCCC', '#969696', '#525252'],
    '5': ['#F7F7F7', '#CCCCCC', '#969696', '#636363', '#252525'],
    '6': ['#F7F7F7', '#D9D9D9', '#BDBDBD', '#969696', '#636363', '#252525'],
    '7': ['#F7F7F7', '#D9D9D9', '#BDBDBD', '#969696', '#737373', '#525252', '#252525']
         },
  red: {
    '3': ['#FFEDA0', '#FEB24C', '#F03B20'],
    '4': ['#FFFFB2', '#FECC5C', '#FD8D3C', '#E31A1C'],
    '5': ['#FFFFB2', '#FECC5C', '#FD8D3C', '#F03B20', '#BD0026'],
    '6': ['#FFFFB2', '#FED976', '#FEB24C', '#FD8D3C', '#F03B20', '#BD0026'],
    '7': ['#FFFFB2', '#FED976', '#FEB24C', '#FD8D3C', '#FC4E2A', '#E31A1C', '#B10026']
       },
  inverted_green: {
    '3':['#2CA25F','#99D8C9','#E5F5F9'],
    '4':['#238B45','#66C2A4','#B2E2E2','#EDF8FB'],
    '5':['#006D2C','#2CA25F','#66C2A4','#B2E2E2','#EDF8FB'],
    '6':['#006D2C','#2CA25F','#66C2A4','#99D8C9','#CCECE6','#EDF8FB'],
    '7':['#005824','#238B45','#41AE76','#66C2A4','#CCECE6','#D7FAF4','#EDF8FB']
    },
  inverted_blue: {
    '3':['#2C7FB8','#7FCDBB','#EDF8B1'],
    '4':['#225EA8','#41B6C4','#A1DAB4','#FFFFCC'],
    '5':['#253494','#2C7FB8','#41B6C4','#A1DAB4','#FFFFCC'],
    '6':['#253494','#2C7FB8','#41B6C4','#7FCDBB','#C7E9B4','#FFFFCC'],
    '7':['#0C2C84','#225EA8','#1D91C0','#41B6C4','#7FCDBB','#C7E9B4','#FFFFCC']
  },
  inverted_pink: {
    '3':['#DD1C77','#C994C7','#E7E1EF'],
    '4':['#CE1256','#DF65B0','#D7B5D8','#F1EEF6'],
    '5':['#980043','#DD1C77','#DF65B0','#D7B5D8','#F1EEF6'],
    '6':['#980043','#DD1C77','#DF65B0','#C994C7','#D4B9DA','#F1EEF6'],
    '7':['#91003F','#CE1256','#E7298A','#DF65B0','#C994C7','#D4B9DA','#F1EEF6']
  },
  inverted_black: {
    '3':['#636363','#BDBDBD','#F0F0F0'],
    '4':['#525252','#969696','#CCCCCC','#F7F7F7'],
    '5':['#252525','#636363','#969696','#CCCCCC','#F7F7F7'],
    '6':['#252525','#636363','#969696','#BDBDBD','#D9D9D9','#F7F7F7'],
    '7':['#252525','#525252','#737373','#969696','#BDBDBD','#D9D9D9','#F7F7F7']
  },
  inverted_red: {
    '3':['#F03B20','#FEB24C','#FFEDA0'],
    '4':['#E31A1C','#FD8D3C','#FECC5C','#FFFFB2'],
    '5':['#BD0026','#F03B20','#FD8D3C','#FECC5C','#FFFFB2'],
    '6':['#BD0026','#F03B20','#FD8D3C','#FEB24C','#FED976','#FFFFB2'],
    '7':['#B10026','#E31A1C','#FC4E2A','#FD8D3C','#FEB24C','#FED976','#FFFFB2']
  },
  spectrum1: {
    '3': ['#1a9850', '#fff2cc', '#d73027'],
    '4': ['#1a9850', '#d2ecb4', '#fed6b0', '#d73027'],
    '5': ['#1a9850', '#8cce8a', '#fff2cc', '#f79272', '#d73027'],
    '6': ['#1a9850', '#8cce8a', '#d2ecb4', '#fed6b0', '#f79272', '#d73027'],
    '7': ['#1a9850', '#8cce8a', '#d2ecb4', '#fff2cc', '#fed6b0', '#f79272', '#d73027']
  },
  spectrum2: {
    '3': ['#0080ff', '#fff2cc', '#ff4d4d'],
    '4': ['#0080ff', '#7fbfff', '#ffa6a6', '#ff4d4d'],
    '5': ['#0080ff', '#40a0ff', '#fff2cc', '#ff7a7a', '#ff4d4d'],
    '6': ['#0080ff', '#40a0ff', '#7fbfff', '#ffa6a6', '#ff7a7a', '#ff4d4d'],
    '7': ['#0080ff', '#40a0ff', '#7fbfff', '#fff2cc', '#ffa6a6', '#ff7a7a', '#ff4d4d']
  },

  purple_states: {
    '3': ["#F1E6F1", "#B379B3", "#8A4E8A"],
    '4': ["#F1E6F1", "#D8BBD8", "#A05AA0", "#8A4E8A"],
    '5': ["#F1E6F1", "#D8BBD8", "#B379B3", "#A05AA0", "#8A4E8A"],
    '6': ["#F1E6F1", "#D8BBD8", "#CCA5CC", "#B379B3", "#A05AA0", "#8A4E8A"],
    '7': ["#F1E6F1", "#D8BBD8", "#CCA5CC", "#C08FC0", "#B379B3", "#A05AA0", "#8A4E8A"]
  },
  red_states: {
    '3': ["#F2D2D3", "#D4686C", "#C1373C"],
    '4': ["#F2D2D3", "#EBB7B9", "#CC4E52", "#C1373C"],
    '5': ["#F2D2D3", "#EBB7B9", "#D4686C", "#CC4E52", "#C1373C"],
    '6': ["#F2D2D3", "#EBB7B9", "#E39D9F", "#D4686C", "#CC4E52", "#C1373C"],
    '7': ["#F2D2D3", "#EBB7B9", "#E39D9F", "#DB8286", "#D4686C", "#CC4E52", "#C1373C"]
  },
  blue_states: {
    '3': ["#ECF0F6", "#6182B5", "#43618F"],
    '4': ["#ECF0F6", "#B2C2DB", "#4E71A6", "#43618F"],
    '5': ["#ECF0F6", "#B2C2DB", "#6182B5", "#4E71A6", "#43618F"],
    '6': ["#ECF0F6", "#B2C2DB", "#9BB0D0", "#6182B5", "#4E71A6", "#43618F"],
    '7': ["#ECF0F6", "#B2C2DB", "#9BB0D0", "#849EC5", "#6182B5", "#4E71A6", "#43618F"]
  },
  inverted_purple_states: {
    '3': ['#8A4E8A', '#B379B3', '#F1E6F1'],
    '4': ['#8A4E8A', '#A05AA0', '#D8BBD8', '#F1E6F1'],
    '5': ['#8A4E8A', '#A05AA0', '#B379B3', '#D8BBD8', '#F1E6F1'],
    '6': ['#8A4E8A', '#A05AA0', '#B379B3', '#CCA5CC', '#D8BBD8', '#F1E6F1'],
    '7': ['#8A4E8A', '#A05AA0', '#B379B3', '#C08FC0', '#CCA5CC', '#D8BBD8', '#F1E6F1']
  },
  inverted_red_states: {
    '3': ['#C1373C', '#D4686C', '#F2D2D3'],
    '4': ['#C1373C', '#CC4E52', '#EBB7B9', '#F2D2D3'],
    '5': ['#C1373C', '#CC4E52', '#D4686C', '#EBB7B9', '#F2D2D3'],
    '6': ['#C1373C', '#CC4E52', '#D4686C', '#E39D9F', '#EBB7B9', '#F2D2D3'],
    '7': ['#C1373C', '#CC4E52', '#D4686C', '#DB8286', '#E39D9F', '#EBB7B9', '#F2D2D3']
  },
  inverted_blue_states: {
    '3': ['#43618F', '#6182B5', '#ECF0F6'],
    '4': ['#43618F', '#4E71A6', '#B2C2DB', '#ECF0F6'],
    '5': ['#43618F', '#4E71A6', '#6182B5', '#B2C2DB', '#ECF0F6'],
    '6': ['#43618F', '#4E71A6', '#6182B5', '#9BB0D0', '#B2C2DB', '#ECF0F6'],
    '7': ['#43618F', '#4E71A6', '#6182B5', '#849EC5', '#9BB0D0', '#B2C2DB', '#ECF0F6']
  }

};

// Default colors for color/category wizard
cdb.admin.color_brewer = ['#A6CEE3', '#1F78B4', '#B2DF8A', '#33A02C', '#FB9A99', '#E31A1C', '#FDBF6F', '#FF7F00', '#CAB2D6', '#6A3D9A', '#DDDDDD'];


  /**
   *  Collection for common data
   *  - For the moment is static.
   */

  cdb.admin.CommonTables = Backbone.Collection.extend({});
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
   *  Geocoding endpoint by id
   *
   *  - State property could be:
   *
   *    · null -> it haven't started
   *    · started -> it has just started
   *    · submitted -> it has sent to the geocoder service
   *    · completed -> geocoder service has finished
   *    · finished -> Our database has finished, process completed
   *
   */


  cdb.admin.Geocoding = cdb.core.Model.extend({

    _POLLTIMER: 2000,

    defaults: {
      kind: '',
      formatter: '',
      table_name: ''
    },

    idAttribute: 'id',

    url: function(method) {
      var version = cdb.config.urlVersion('geocoding', method);

      var base = '/api/' + version + '/geocodings/';
      if (this.isNew()) {
        return base;
      }
      return base + this.id;
    },

    initialize: function() {
      this.bind('change', this._checkFinish, this);
    },

    setUrlRoot: function(urlRoot) {
      this.urlRoot = urlRoot;
    },

    /**
     * checks for poll to finish
     */
    pollCheck: function(i) {
      var self = this;
      var tries = 0;
      this.pollTimer = setInterval(function() {
        self.fetch({
          error: function(e) {
            self.trigger("change");
          }
        });
        ++tries;
      }, i || this._POLLTIMER);
    },

    destroyCheck: function() {
      clearInterval(this.pollTimer);
    },

    _checkFinish: function() {
      var state = this.get('state');
      var error = this.get('error');

      var attributes = _.clone(this.attributes);

      if (state === null) {
        this.trigger('geocodingStarted', this);
      } else if (state === "finished") {
        this.destroyCheck();
        this.clear({ silent: true });
        this.trigger('geocodingComplete', attributes, this);
      } else if (state === "failed") {
        this.destroyCheck();
        this.clear({ silent: true });
        this.trigger('geocodingError', error, this);
      } else if (state === "reset" || state === "cancelled") {
        this.clear({ silent: true });
      } else {
        this.trigger('geocodingChange', this);
      }
    },

    cancelGeocoding: function() {
      this.destroyCheck();
      this.trigger('geocodingCanceled', this);
      this.save({ state:'cancelled' }, { wait:true });
    },

    resetGeocoding: function() {
      this.destroyCheck();
      this.trigger('geocodingReset', this);
      this.set('state', 'reset');
    },

    isGeocoding: function() {
      return this.get('id') && this.get('table_name') && (this.get('formatter') || this.get('kind'))
    }

  });


  /**
   *  Geocoding endpoint to get all running geocodings
   */
  cdb.admin.Geocodings = cdb.core.Model.extend({

    url: function(method) {
      var version = cdb.config.urlVersion('geocoding', method);

      return '/api/' + version + '/geocodings';
    }

  });

  /**
   * Model to get available geometries from a location (column_name from table or free_text)
   */
  cdb.admin.Geocodings.AvailableGeometries = cdb.core.Model.extend({

    url: function(method) {
      var version = cdb.config.urlVersion('geocoding', method);
      return '/api/' + version + '/geocodings/available_geometries';
    },

    parse: function(r) {
      return { available_geometries: r }
    }

  });

  /**
   *  Geocoding estimation for a table
   *
   *  - It will show the estimate price of geocoding that table.
   *
   */
  cdb.admin.Geocodings.Estimation = cdb.core.Model.extend({

    // defaults: {
    //   rows:       0,
    //   estimation: 0 - actually the cost (in credits)
    // },

    urlRoot: function() {
      var version = cdb.config.urlVersion('geocoding', 'read');
      return "/api/" + version + "/geocodings/estimation_for/";
    },

    reset: function() {
      this.unset('rows');
      this.unset('estimation');
    },

    costInCredits: function() {
      return this.get('estimation');
    },

    mayHaveCost: function() {
      // also includes undefined, for the case when the price is unknown)
      return this.costInCredits() !== 0;
    },

    costInDollars: function() {
      return Math.ceil(this.costInCredits() / 100);
    }

  });

cdb.admin.Import = cdb.core.Model.extend({

  idAttribute: 'item_queue_id',

  urlRoot: '/api/v1/imports',

  initialize: function() {
    this.bind('change', this._checkFinish, this);
  },

  setUrlRoot: function(urlRoot) {
    this.urlRoot = urlRoot;
  },

  /**
   * checks for poll to finish
   */
  pollCheck: function(i) {
    var self = this;
    var tries = 0;
    this.pollTimer = setInterval(function() {
      // cdb.log.debug("checking job for finish: " + tries);
      self.fetch({
        error: function(e) {
          self.trigger("change");
        }
      });
      ++tries;
    }, i || 1500);
  },

  destroyCheck: function() {
    clearInterval(this.pollTimer);
  },

  _checkFinish: function() {
    // cdb.log.info("state: " + this.get('state'), "success: " + this.get("success"));

    if(this.get('success') === true) {
      // cdb.log.debug("job finished");
      clearInterval(this.pollTimer);
      this.trigger('importComplete', this);
    } else if (this.get('success') === false) {
      // cdb.log.debug("job failure");
      clearInterval(this.pollTimer);
      this.trigger('importError', this);
    } else {
      this.trigger('importChange', this);
    }
  }
});

cdb.admin.SlideTransition = cdb.core.Model.extend({
  defaults: {
    time: 0
  }
});

/**
 * contains and manages the state for an slide
 */
cdb.admin.Slide = cdb.core.Model.extend({

  initialize: function() {
    var self = this;
    this._tracked = []; 
    this.visualization = null;
    this.bind('change:active', function _active() {
      if (self.isActive() && self.master && self.visualization) {
        self.master.changeTo(this.visualization);
      }
    });
  },

  // unload the visualization from memory and deattach all the stuff
  unload: function() {
    var self = this;
    this.unbind(null, null, this);
    this.visualization.unbind(null, null, this);
    this.visualization = null;
    this.master.map.unbind(null, null, this);
    this.master.unbind(null, null, this);
    _.each(this._tracked, function(o) {
      o.unbind(null, null, self);
    });
    this._tracked = [];
    this.loaded = false;
  },

  // track object state using restore and serialize
  _trackObject: function(obj, properties, serialize) {

    this._tracked.push(obj);

    // build list of properties to listen
    var listen = 'change';
    if (properties && properties.length) {
      listen = properties.map(function(p) {
        return 'change:' + p;
      }).join(' ');
    }

    // serialize object state to slide
    obj.bind(listen, function() {
      if (this.isActive()) {
        serialize.call(this, obj, properties ? _.pick(obj.attributes, properties): obj.attributes);
      }
    }, this);

  },

  setMaster: function(vis) {
    var self = this;
    this.master = vis;
    if (!this.visualization) {
      this.visualization = new cdb.admin.Visualization(
      _.extend(
        _.pick(this.attributes, 'id', 'map_id', 'next_id', 'prev_id', 'transition_options', 'type'), { bindMap: false, parent_id: vis.id }
      ));
    }
  },

  isActive: function() {
    return !!this.get('active');
  },

  destroy: function() {
    this.visualization.destroy.apply(this.visualization, arguments);
    this.trigger('destroy', this, this.collection);
    return this;
  }, 

  setNext: function(next_visualization_id, opt) {
    var v = new cdb.admin.Visualization({ id: this.id });
    v.order.save('next_id', next_visualization_id, opt);
    this._reorder(next_visualization_id);
    this.trigger('change:next_id', this, next_visualization_id);
    return this;
  },

  _reorder: function(next_visualization_id) {
    var s, insertIndex;
    // look for the slide in collection
    if (this.collection) {
      var col = this.collection;
      if (next_visualization_id !== null) {
        s = col.get(next_visualization_id);
        insertIndex = col.indexOf(s);
      } else {
        insertIndex = col.length;
      }
      if (insertIndex >= 0) {
        var currentIndex = col.indexOf(this);
        // insert just before the
        col.models.splice(insertIndex, 0, this);
        if (currentIndex >= insertIndex) currentIndex += 1;
        // remove previous one
        col.models.splice(currentIndex, 1);
      }
    }

  }

});


/**
 * slide collection
 */
cdb.admin.Slides = Backbone.Collection.extend({

  model: cdb.admin.Slide,

  initialize: function(models, options) {
    if (!options || !options.visualization) {
      throw new Error("visualization is undefined");
    }

    // master visualization
    this.visualization = options.visualization;
    // save the master visualization id so when a new visualization is created
    // we set this as parent, see create method
    this.master_visualization_id = this.visualization.id;


    var self = this;

    var _setMaster = function(m) { 
      m.setMaster(self.visualization);
    };

    this.bind('add', _setMaster, this);
    this.bind('add', function(slide) {
      this.setActive(slide);
    }, this);

    this.bind('reset', function() { 
      this.each(_setMaster);
      this.setActive(this.at(0));
    }, this);

    this.bind('remove', this._onRemoveSlide, this);
  },

  _onRemoveSlide: function(slide, collection, options) {
    if (slide.isActive() && this.length > 0) {
      if (options.index !== this.length) {
        this.setActive(this.at(options.index));
      } else if (options.index == this.length)  {
        this.setActive(this.at(options.index - 1));
      }
    }
  },

  // https://github.com/jashkenas/backbone/issues/962
  initializeModels: function() {
    var self = this;
    var _setMaster = function(m) {
      m.setMaster(self.visualization);
    };
    this.each(_setMaster);
  },

  // creates a new slide
  // there is an special case when there is no slides: two slides are actually created, one to clone the master one and the new one the user is actually adding
  create: function(done) {
    var self = this;
    if (this.length === 0) {
      this._createSlide(function(slide) {
        self._createSlide(function(slide2) {
          self.add(slide)
          self.add(slide2);
          done && done(slide2);
        }, { no_add: true, prev_id: slide.id });
      }, { no_add: true });
    } else {
      this._createSlide(done);
    }
  },

  _createSlide: function(done, options) {
    options = options || {}
    var self = this;
    var prev_id = options.prev_id || null;
    if (!prev_id && this.length) {
      prev_id = this.last().visualization.id
    }
    return this.visualization.copy({
      copy_overlays: true,
      type: 'slide',
      parent_id: this.master_visualization_id,
      prev_id: prev_id
    }, {
      success: function(vis) {
        vis.map.layers.bind('reset', function() {
          // on create assign the track id
          var slide = new cdb.admin.Slide({ id: vis.id });
          slide.visualization = vis;
          if (!options.no_add) self.add(slide);
          done && done(slide);
        });
      }
    });
  },

  setActive: function(slide) {
    var active = this.find(function (s) {
      return s.get('active');
    });
    if (active) {
      active.set('active', false);
    }
    if (slide) slide.set('active', true);
  },

  /*
   * return true if some layer inside any of the visualization contain a torque layer
   */
  existsTorqueLayer: function() {
    return this.any(function(s) {
      return s.visualization.map.layers.getTorqueLayers().length !== 0;
    });
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

/**
 * Model to representing a TileJSON endpoint
 * See https://github.com/mapbox/tilejson-spec/tree/master/2.1.0 for details
 */
cdb.admin.TileJSON = cdb.core.Model.extend({

  idAttribute: 'url',

  url: function() {
    return this.get('url');
  },

  save: function() {
    // no-op, obviously no write privileges ;)
  },

  newTileLayer: function() {
    if (!this._isFetched()) throw new Error('no tiles, have fetch been called and returned a successful resultset?');

    var layer = new cdb.admin.TileLayer({
      urlTemplate: this._urlTemplate(),
      name: this._name(),
      attribution: this.get('attribution'),
      maxZoom: this.get('maxzoom'),
      minZoom: this.get('minzoom'),
      bounding_boxes: this.get('bounds'),
      tms: this.get('scheme') === 'tms'
    });

    return layer;
  },

  _isFetched: function() {
    return this.get('tiles').length > 0;
  },

  _urlTemplate: function() {
    return this.get('tiles')[0];
  },

  _name: function() {
    return this.get('name') || this.get('description');
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

// form validation

var alwaysTrueValidator = function(form) { return true };

function columnExistsValidatorFor(column_name) {
  return function(form) {
    var field = form[column_name];
    return field.form.property.extra.length > 0;
  };
}
var columnExistsValidator = columnExistsValidatorFor('Column');

//
// defines a form schema, what fields contains and so on
//
cdb.admin.FormSchema = cdb.core.Model.extend({

  validators: {
    polygon: alwaysTrueValidator,
    cluster: alwaysTrueValidator,
    intensity: alwaysTrueValidator,
    bubble: columnExistsValidator,
    choropleth: columnExistsValidator,
    color: columnExistsValidator,
    category: columnExistsValidator,
    density: alwaysTrueValidator,
    torque: columnExistsValidatorFor('Time Column'),
    torque_cat: columnExistsValidatorFor('Time Column'),
    torque_heat: columnExistsValidatorFor('Time Column')
  },

  initialize: function() {
    this.table = this.get('table');
    this.unset('table');
    if(!this.table) throw new Error('table is undefined');

    // validate type
    // it should be polygon, bubble or some of the defined wizard types
    var type = this.get('type');
    if(!type) {
      throw new Error('type is undefined');
    }

    // get the default values
    var form_data = this.defaultFor(type);
    if (!form_data) {
      throw new Error('invalid type: ' + type);
    }
    // assign index to be able to compose the order
    form_data.forEach(function(v, i) { v.index = i });
    this.set(_.object(_.pluck(form_data, 'name'), form_data),  { silent: true });

    this._fillColumns();

    this.table.bind('change:schema', function() {
      var opts = {};
      if (!this.table.previous('schema')) {
        opts.silent = true;
      }
      this._fillColumns(opts);
      if (opts.silent) {
        this._previousAttributes = _.clone(this.attributes);
      }
    }, this);

  },

  toJSON: function() {
    var form_data = _.values(_.omit(this.attributes, 'type'));
    form_data.sort(function(a, b) { return a.index - b.index; });
    return form_data;
  },

  _fillColumns: function(opts) {
    var self = this;
    // lazy shallow copy
    var attrs = JSON.parse(JSON.stringify(this.attributes));
    _.each(attrs, function(field) {
      for (var k in field.form) {
        var f = field.form[k];
        if (f.columns) {
          var types = f.columns.split('|');
          var extra = [];
          if (f.extra_default) extra = f.extra_default.slice();
          for(var i in types) {
            var type = types[i];
            var columns = self.table.columnNamesByType(type);
            extra = extra.concat(
              _.without(columns, 'cartodb_id')
            )
            if (f.default_column === type) {
              var customColumns = _.without(columns, 'cartodb_id', 'created_at', 'updated_at');
              if (customColumns.length) {
                f.value = customColumns[0];
              }
            }
          }
          if (!f.value) f.value = extra[0];
          else if (!_.contains(extra, f.value)) {
            f.value = extra[0];
          }
          f.extra = extra;
        }
      }
    });
    this.set(attrs, opts);
  },

  defaultFor: function(type) {
    var form_data = cdb.admin.forms.get(type)[this.table.geomColumnTypes()[0] || 'point'];
    return form_data;
  },

  // return the default style properties
  // based on forms value
  style: function(props) {
    var default_data = {};
    _(this.attributes).each(function(field) {
      if (props && !_.contains(props, field)) return;
      _(field.form).each(function(v, k) {
        default_data[k] =  v.value;
      });
    });
    return default_data;
  },

  isValid: function(type) {
    return this.validators[type || 'polygon'](this.attributes);
  },

  // return true if this form was valid before the current change
  // this method should be only called during a change event
  wasValid: function(type) {
    return this.validators[type](this.previousAttributes());
  },

  dynamicProperties: function() {
    var props = [];
    _.each(this.attributes, function(field) {
      for (var k in field.form) {
        var f = field.form[k];
        if (f.columns) {
          props.push(field);
        }
      }
    });
    return props;
  },

  // return true is some property used to regenerate style has been changed
  changedDinamycProperty: function() {
    var changed = [];
    var d = this.dynamicProperties();
    for(var i in d) {
      if (this.changedAttributes(d[i])) {
        changed.push(d[i]);
      }
    }
    return changed;
  },

  dinamycProperty: function(c) {
    return _.keys(this.get(c.name).form)[0];
  },

  dinamycValues: function(c) {
    var v = this.get(c.name);
    var k = this.dinamycProperty(c);
    return v.form[k].extra;
  }


});

cdb.admin.WizardProperties = cdb.core.Model.extend({

  initialize: function() {
    // params
    this.table = this.get('table');
    this.unset('table');
    if(!this.table) throw new Error('table is undefined');

    this.layer = this.get('layer');
    this.unset('layer');
    if(!this.layer) throw new Error('layer is undefined');

    // stores forms for geometrys and type
    this.forms = {};
    this._savedStates = {};

    this.cartoStylesGeneration = new cdb.admin.CartoStyles(_.extend({},
      this.layer.get('wizard_properties'), {
      table: this.table
    })
    );

    if (this.attributes.properties && _.keys(this.attributes.properties).length !== 0) {
      this.properties(this.attributes);
    }
    delete this.attributes.properties;

    // bind loading and load
    this.cartoStylesGeneration.bind('load', function() { this.trigger('load'); }, this)
    this.cartoStylesGeneration.bind('loading', function() { this.trigger('loading'); }, this)

    this.table.bind('columnRename', function(newName, oldName) {
      if (this.isDisabled()) return;
      var attrs = {};
      // search for columns
      for(var k in this.attributes) {
        if(this.get(k) === oldName) {
          attrs[k] = newName;
        }
      }
      this.set(attrs);
    }, this);
    // when table schema changes regenerate styles
    // notice this not update properties, only regenerate
    // the style
    this.table.bind('change:schema', function() {
      if (!this.isDisabled() && this.table.previous('schema') !== undefined) this.cartoStylesGeneration.regenerate();
    }, this);

    this.table.bind('change:geometry_types', function() {
      if(!this.table.changedAttributes()) {
        return;
      }
      var geoTypeChanged = this.table.geometryTypeChanged();
      if(geoTypeChanged) this.trigger('change:form');
      var prev = this.table.previous('geometry_types');
      var current = this.table.geomColumnTypes();
      // wizard non initialized
      if((!prev || prev.length === 0) && !this.get('type')) {
        this.active('polygon');
        return;
      }
      if (!current || current.length === 0) {
        if (!this.table.isInSQLView()) {
          // empty table
          this.unset('type', { silent: true });
        }
        return;
      }
      if (!prev || prev.length === 0) return;
      if (geoTypeChanged) {
        this.active('polygon', {}, { persist: false });
      }
    }, this);

    this.linkLayer(this.layer);

    this.bindGenerator();

    // unbind previous form and bind the new one
    this.bind('change:type', this._updateForm);
    this.table.bind('change:geometry_types', this._updateForm, this);
    this._updateForm();

    // generator should be always filled in case sql
    // or table schema is changed
    this._fillGenerator({ silent: true });

  },

  _updateForm: function() {
    //unbind all forms
    for(var k in this.forms) {
      var forms = this.forms[k];
      for(var f in forms) {
        var form = forms[f];
        form.unbind(null, null, this);
      }
    }

    var t = this.get('type');
    if (t) {
      var f = this._form(t);
      f.bind('change', function() {
        if (!f.isValid(this.get('type'))) {
          this.active('polygon');
        }
        else if(!f.wasValid(this.get('type'))) {
          if(!this.isDisabled()) {
            // when the form had no column previously
            // that means the wizard was invalid
            this.active(this.get('type'), null, { persist: false, restore: false });
          }
        } else {
          var self = this;
          var c = f.changedDinamycProperty();
          var propertiesChanged = [];
          if(c.length) {
            _.each(c, function(form_p) {
              var k = f.dinamycProperty(form_p);
              if (self.has(k) && !_.contains(f.dinamycValues(form_p), self.get(k))) {
                propertiesChanged.push(form_p);
              }
            });
            if (propertiesChanged.length) {
              var st = f.style(propertiesChanged);
              this.set(st);
            }
          }
        }
        this.trigger('change:form');
      }, this);
    }
  },

  _form: function(type, geomType) {
    var form = this.forms[type] || (this.forms[type] = {});
    geomType = geomType || this.table.geomColumnTypes()[0] || 'point';
    if (!form[geomType]) {
      form[geomType] = new cdb.admin.FormSchema({
        table: this.table,
        type: type || 'polygon'
      });
      form[geomType].__geomType = geomType;
    }
    return form[geomType];
  },

  formData: function(type) {
    var self = this;
    var form = this._form(type);
    return form.toJSON();
  },

  defaultStyleForType: function(type) {
    return this._form(type).style();
  },

  // save current state
  saveCurrent: function(type, geom) {
    var k = type + "_" + geom;
    this._savedStates[k] = _.clone(this.attributes);
  },

  getSaved: function(type, geom) {
    var k = type + "_" + geom;
    return this._savedStates[k] || {};
  },

  // active a wizard type
  active: function(type, props, opts) {
    opts = _.defaults(opts || {}, { persist: true });

    // if the geometry is undefined the wizard can't be applied
    var currentGeom = this.table.geomColumnTypes()[0];
    if (!currentGeom) {
      return;
    }
    opts = _.defaults(opts || {}, { persist: true, restore: true });

    // previously category map was called color. this avoids
    // color wizard is enabled since it's compatible with category
    if (type === "color") type = 'category';

    // if the geometry type has changed do not allow to persist previous
    // properties. This avoids cartocss properties from different
    // geometries are mixed
    if (this.get('geometry_type') && currentGeom !== this.get('geometry_type')) {
      opts.persist = false;
    }

    // get the default props for current type and use previously saved
    // attributes to override them
    var geomForm = this.defaultStyleForType(type);
    var current = (opts.persist && type === this.get('type')) ? this.attributes: {};
    _.extend(geomForm, opts.restore ? this.getSaved(type, currentGeom): {}, current, props);
    geomForm.type = type;
    geomForm.geometry_type = currentGeom;

    // if the geometry is invalid, do not save previous attributes
    var t = this.get('type');
    var gt = this.get('geometry_type');
    if(t && gt && this._form(t, gt).isValid(t)) {
      this.saveCurrent(t, gt);
    }
    this.clear({ silent: true });
    this.cartoStylesGeneration.unset('metadata', {silent: true});
    this.cartoStylesGeneration.unset('properties', { silent: true });
    // set layer as enabled to change style
    this.enableGeneration();
    this.set(geomForm);
  },

  enableGeneration: function() {
    this.layer.set('tile_style_custom', false, { silent: true });
  },

  // the style generation can be disabled because of a custom style
  isDisabled: function() {
    return this.layer.get('tile_style_custom');
  },

  properties: function(props) {
    if (!props) return this;
    var t = props.type === 'color' ? 'category': props.type;
    var vars = _.extend(
      { type: t },
      props.properties
    );
    return this.set(vars);
  },

  _fillGenerator: function(opts) {
      opts = opts || {}
      this.cartoStylesGeneration.set({
        'properties': _.clone(this.attributes),
        'type': this.get('type')
      }, opts);
  },

  _updateGenerator: function() {
      var t = this.get('type');
      var isValid = this._form(t).isValid(t);
      this._fillGenerator({ silent: !isValid || this.isDisabled() });
  },

  bindGenerator: function() {
    // every time properties change update the generator
    this.bind('change', this._updateGenerator, this);
  },

  unbindGenerator: function() {
    this.unbind('change', this._updateGenerator, this);
  },

  toJSON: function() {
    return {
      type: this.get('type'),
      properties: _.omit(this.attributes, 'type', 'metadata')
    };
  },

  linkLayer: function(layer) {
    var self = this;
    /*
     * this is disabled because we need to improve propertiesFromStyle method
     * in order to not override properties which shouldn't be, see CDB-1566
     *
     layer.bind('change:tile_style', function() {
      if(this.isDisabled()) {
        this.unbindGenerator();
        this.set(this.propertiesFromStyle(layer.get('tile_style')));
        this.bindGenerator();
      }
    }, this);
    */

    layer.bind('change:query', function() {
      if(!this.isDisabled()) this.cartoStylesGeneration.regenerate();
    }, this);

    var changeLayerStyle = function(st, sql, layerType) {
      layerType = layerType || 'CartoDB';

      // update metadata from cartocss generation
      self.unbindGenerator();
      var meta = self.cartoStylesGeneration.get('metadata');
      if (meta) {
        self.set('metadata', meta);
      } else {
        self.unset('metadata');
      }
      self.bindGenerator();

      var attrs = {
        tile_style: st,
        type: layerType,
        tile_style_custom: false
      };

      if(sql) {
        attrs.query_wrapper = sql.replace(/__wrapped/g, '(<%= sql %>)');//"with __wrapped as (<%= sql %>) " + sql;
      } else {
        attrs.query_wrapper = null;
      }
      attrs.query_generated = attrs.query_wrapper !== null;

      // update the layer model
      if (layer.isNew() || !layer.collection) {
        layer.set(attrs);
      } else {
        layer.save(attrs);
      }
    };

    // this is the sole entry point where the cartocss is changed.
    this.cartoStylesGeneration.bind('change:style change:sql', function() {
      var st = this.cartoStylesGeneration.get('style');
      if(st) {
        changeLayerStyle(
          st,
          this.cartoStylesGeneration.get('sql'),
          this.get('layer-type')
        );
      }
    }, this);


  },

  unlinkLayer: function(layer) {
    this.unbind(null, null, layer);
    layer.unbind(null, null, this);
  },

  getEnabledWizards: function() {
    var _enableMap = {
      'point': ['polygon', 'cluster', 'choropleth', 'bubble', 'density', 'category', 'intensity', 'torque', 'torque_cat', 'torque_heat'],
      'line':['polygon', 'choropleth', 'category', 'bubble'],
      'polygon': ['polygon', 'choropleth', 'category', 'bubble']
    };
    return _enableMap[this.table.geomColumnTypes()[0] || 'point'];
  },

  //MOVE to the model
  propertiesFromStyle: function(cartocss) {
    var parser = new cdb.admin.CartoParser();
    var parsed = parser.parse(cartocss);
    if (!parsed) return {};
    var rules = parsed.getDefaultRules();
    if(parser.errors().length) return {};
    var props = {};
    var t = this._getTypeFromCSS(cartocss);
    var valid_attrs =_.uniq(_.keys(this.attributes).concat(_.keys(this._form(t).style())));
    if (rules) {
      for(var p in valid_attrs) {
        var prop = valid_attrs[p];
        var rule = rules[prop];
        if (rule) {
          rule = rule.ev();
          if (!carto.tree.Reference.validValue(parser.parse_env, rule.name, rule.value)) {
            return {};
          }
          var v = rule.value.ev(this.parse_env);
          if (v.is === 'color') {
            v = v.toString();
          } else if (v.is === 'uri') {
            v = 'url(' + v.toString() + ')';
          } else {
            v = v.value;
          }
          props[prop] = v;
        }
      }
      if("image-filters" in props && !props["image-filters"]){
        props["image-filters"] = rules["image-filters"].value.value[0].value[0]
      }
      return props;
    }
    return {};
  },

  _getTypeFromCSS: function(css) {
    if (css.indexOf("colorize-alpha") > -1) {
      return "torque_heat";
    }
    else if (css.indexOf("torque-time-attribute") > -1) {
      return "torque";
    }
    else {
      return this.get('type');
    } 
  },

  // returns true if current wizard supports user
  // interaction
  supportsInteractivity: function() {
    var t = this.get('type');
    if (_.contains(['torque', 'cluster', 'density', 'torque_cat'], t)) {
      return false;
    }
    return true;
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

cdb.admin.WMSService = Backbone.Model.extend({

  _PROXY_URL:   '//cartodb-wms.global.ssl.fastly.net/api',
  _PROXY_TILES: '//cartodb-wms.global.ssl.fastly.net/mapproxy',

  methodToURL: {
    'read':   '/check',
    'create': '/add'
  },

  sync: function(method, model, options) {
    options = options || {};
    options.url = this.url(method.toLowerCase());
    options.dataType = 'jsonp';
    method = "READ";
    return Backbone.sync.apply(this, arguments);
  },

  url: function(method) {
    var req = this._PROXY_URL + this.methodToURL[method];
    var url = this.get('wms_url');

    var parser = document.createElement('a');

    parser.href = url;

    var params = parser.search.substr(1).split("&");

    var hasCapabilities = _.find(params, function(p) { return p.toLowerCase().indexOf("request=getcapabilities") !== -1; });
    var hasService      = _.find(params, function(p) { return p.toLowerCase().indexOf("service=wms") !== -1; });

    // If the user didn't provided the necessary params, let's add them

    if (!hasCapabilities) {
      params.push("request=GetCapabilities");
    }

    if (!hasService) {
      params.push("service=WMS");
    }

    url += "?" + params.join("&");
    req += '?url=' + encodeURIComponent(url);

    var isWMTS = this.get('type') === 'wmts';
    req += '&type=' + (isWMTS ? 'wmts' : 'wms');

    if (method === 'create') {
      if (this.get('layer') && this.get('srs')) {
        req += "&layer=" + this.get('layer');
        req += "&srs=EPSG:" + this.get('srs')[0].split(':')[1];
      } else if (isWMTS && this.get('layer') && this.get('matrix_sets').length > 0) {
        req += '&layer=' + this.get('layer');
        req += '&matrix_set=' + cdb.admin.WMSService.supportedMatrixSets(this.get('matrix_sets' || []))[0];
      }
    }

    return req;
  },

  newTileLayer: function() {
    if (!this.get('mapproxy_id')) {
      throw new Error('mapproxy_id must be set');
    }
    return new cdb.admin.TileLayer({
      urlTemplate: this._PROXY_TILES + '/' + this.get('mapproxy_id') + '/wmts/map/webmercator/{z}/{x}/{y}.png',
      attribution: this.get('attribution') || null,
      maxZoom: 21,
      minZoom: 0,
      name: this.get('title') || this.get('name'),
      proxy: true,
      bounding_boxes: this.get('bounding_boxes')
    });
  }
}, {

  SUPPORTED_MATRIX_SETS: [
    'EPSG:4326',
    'EPSG:4258'
  ],

  /**
   * Unfortunately the WMS proxy do not support all matrix sets for a WMTS kind of resource, so filter out the ones
   * that are actually supported for now.
   * @return {Array}
   */
  supportedMatrixSets: function(matrixSets) {
    // matrixSets = matrixSets || [];
    return _.intersection(matrixSets, this.SUPPORTED_MATRIX_SETS);
  }
});

cdb.admin.overlays = cdb.admin.overlays || {};

/*
 * Model for the Overlays
 * */
cdb.admin.models.Overlay = cdb.core.Model.extend({

  defaults: {
    order: 1
  },

  sync: Backbone.syncAbort,

  url: function(method) {
    var version = cdb.config.urlVersion('overlays', method);
    var base = '/api/' + version + '/viz/' + this.collection.vis.id + '/overlays';
    if (this.isNew()) {
      return base;
    }
    return base + '/' + this.id;
  },

  _clone: function(obj) {

    var copy;

    // Handle  a couple of types, plus null and undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Array
    if (obj instanceof Array) {
      copy = [];
      for (var i = 0, len = obj.length; i < len; i++) {
        copy[i] = this._clone(obj[i]);
      }
      return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
      copy = {};
      for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = this._clone(obj[attr]);
      }
      return copy;
    }

    throw new Error("Type not supported");
  },

  cloneAttributes: function() {
    return this._clone(this.attributes);
  },

  /*
   * Overwrite serialization method to use our Overlay structure
   * */
  toJSON: function() {

    return {
      template: this.get("template"),
      order:    this.get("order"),
      type:     this.get("type"),
      options:  {
        x:       this.get("x"),
        y:       this.get("y"),
        device:  this.get("device"),
        display: this.get("display"),
        style:   this.get("style"),
        extra:   this.get("extra")
      }
    }
  }, 

  parse: function(resp) {
    resp.display = resp.options.display;
    var options = resp.options;
    if (options) {
      options = typeof options === 'string' ? JSON.parse(options): options;
      _.extend(resp, {
        x:            options.x,
        y:            options.y,
        device:       options.device,
        extra:        options.extra,
        style:        options.style,
        display:      options.display
      });
    }
    delete resp.options.display;
    return resp;
  },

  clone: function() {
    return new cdb.admin.models.Overlay(_.omit(_.clone(this.attributes), 'id', 'parent_id'));
  }

});

/*
 * Overlays collection
 * */
cdb.admin.Overlays = Backbone.Collection.extend({

  model: cdb.admin.models.Overlay,

  url: function(method) {
    var version = cdb.config.urlVersion('overlays', method);
    return '/api/' + version + '/viz/' + this.vis.get("id") + '/overlays';
  },


  comparator: function(item) {
    return item.get("order");
  },

  initialize: function() {

    this._bindOverlays();

  },

  _bindOverlays: function() {

    this.bind("reset", function(){

      var headers = this.filter(function(overlay) { return overlay.get("type") === "header"; });

      if (headers.length) {

        var self = this;

        this.vis.on("change:name change:description", function() {

          headers[0].set({
            title:  this.get("name"),
            description: self._getMarkdown(this.get('description'))
          });

        }, this.vis);

      }

    }, this);

  },

  /*
   * Returns an array with all the overlays z-indexes
   * */
  getOverlaysZIndex: function(mode) {

    var overlays = this.filter(function(o) { 
      return o.get("device") === mode && (o.get("type") === "text" || o.get("type") === "annotation" || o.get("type") === "image");
    });

    return _.map(overlays, function(o) { return parseInt(o.get("style")["z-index"]) });

  },

  createOverlayByType: function(overlay_type, property) {
      var byType = {
        'fullscreen':     this._createFullScreenOverlay,
        'header':         this._createHeaderOverlay,
        'layer_selector': this._createLayerSelectorOverlay,
        'share':          this._createShareOverlay,
        'search':         this._createSearchOverlay,
        'zoom':           this._createZoomOverlay,
        'logo':           this._createLogoOverlay
      };
      var c = byType[overlay_type];
      if (c) {
        return c.call(this, property);
      }
  },

  _createZoomOverlay: function() {
    var options = {
      type: "zoom",
      order: 6,
      display: true,
      template: '<a href="#zoom_in" class="zoom_in">+</a> <a href="#zoom_out" class="zoom_out">-</a>',
      x: 20,
      y: 20
    };
    this.create(options);
  },

  _createLogoOverlay: function() {
    var options = {
      type: "logo",
      order: 10,
      display: true,
      x: 10,
      y: 40
    };
    this.create(options);
  },

  _createSearchOverlay: function() {
    var options = {
      type: "search",
      order: 3,
      display: true,
      x: 60,
      y: 20
    }
    this.create(options);
  },

  _createLayerSelectorOverlay: function() {
    var options = {
      type: "layer_selector",
      order: 4,
      display: true,
      x: 212,
      y: 20
    };
    this.create(options);
  },

  _createShareOverlay: function() {

    var options = {
      type: "share",
      order: 2,
      display: true,
      x: 20,
      y: 20
    };

    this.create(options);

  },

  _getMarkdown: function(text) {
    return text ? $(markdown.toHTML(text)).html() : "";
  },

  _createHeaderOverlay: function(property) {

    var self = this;

    var show_title       = false;
    var show_description = false;

    if (property === "title")       show_title       = true;
    if (property === "description") show_description = true;

    var description = this.vis.get("description");
    var title       = this.vis.get("name");

    if (!show_title && property == 'description' && !description) return;

    var options = {
      type: "header",
      order: 1,
      display: true,
      extra: {
        title: title,
        description: description,
        show_title: show_title,
        show_description: show_description
      }
    };

    var model = this.create(options);
    var vis = this.vis;

    this.vis.on("change:name change:description", function() {
      model.set({
        title:  vis.get("name"),
        description: self._getMarkdown(vis.get('description'))
      });
    }, model);

    model.bind('destroy', function() {
      vis.unbind(null, null, model);
    });

  },

  _createFullScreenOverlay: function() {
    var options = {
      type: "fullscreen",
      order: 7,
      display: true,
      x: 20,
      y: 172
    };
    this.create(options);
  }
});

/*! v4.7.15 - 2017-05-30 */
cdb.open.AuthenticatedUser=cdb.core.Model.extend({defaults:{username:"",avatar_url:""},url:function(){var a=this.get("host")?this.get("host"):this._getCurrentHost();return"//"+a+"/api/v1/get_authenticated_users"},_getCurrentHost:function(){return window.location.host}}),cdb.admin.CartoDBLayer=cdb.geo.CartoDBLayer.extend({MAX_HISTORY:5,MAX_HISTORY_QUERY:5,MAX_HISTORY_TILE_STYLE:5,initialize:function(){this.sync=_.debounce(this.sync,1e3),this.error=!1,this.set("use_server_style",!0),this.initHistory("query"),this.initHistory("tile_style"),this.table=new cdb.admin.CartoDBTableMetadata({id:this.get("table_name")}),this.infowindow=new cdb.geo.ui.InfowindowModel({template_name:"infowindow_light"}),this.tooltip=new cdb.geo.ui.InfowindowModel({template_name:"tooltip_light"});var a=this.get("wizard_properties");this.wizard_properties=new cdb.admin.WizardProperties(_.extend({},a,{table:this.table,layer:this})),this.wizard_properties.bind("change:type",this._manageInteractivity,this),this.legend=new cdb.geo.ui.LegendModel,this.bind("change:table_name",function(){this.table.set("id",this.get("table_name")).fetch()},this),this.bindInfowindow(this.infowindow,"infowindow"),this.bindInfowindow(this.tooltip,"tooltip"),this.bindLegend(this.legend),this.bindTable(this.table),this.tooltip.bind("change:fields",this._manageInteractivity,this),this.get("table")&&(table_attr=this.get("table"),delete this.attributes.table,this.table.set(table_attr)),this.isTableLoaded()||this.table.fetch()},isTableLoaded:function(){return this.table.get("id")&&this.table.get("privacy")},toLayerGroup:function(){var a=_.clone(this.attributes);return a.layer_definition={version:"1.0.1",layers:[]},this.get("visible")&&a.layer_definition.layers.push(this.getLayerDef()),a.type="layergroup",a},getLayerDef:function(){var a=this.attributes,b=a.query||"select * from "+cdb.Utils.safeTableNameQuoting(a.table_name);return a.query_wrapper&&(b=_.template(a.query_wrapper)({sql:b})),{type:"cartodb",options:{sql:b,cartocss:this.get("tile_style"),cartocss_version:"2.1.1",interactivity:this.get("interactivity")}}},initHistory:function(a){this.get(a+"_history")||this.set(a+"_history",[]),this[a+"_history_position"]=0,this[a+"_storage"]=new cdb.admin.localStorage(a+"_storage_"+this.get("table_name"))},addToHistory:function(a,b){b!=this.get(a+"_history")[this.get(a+"_history").length-1]&&(this.get(a+"_history").push(b),this.trimHistory(a),this[a+"_history_position"]=this.get(a+"_history").length-1)},trimHistory:function(a){for(var b=this["MAX_HISTORY_"+a.toUpperCase()]?this["MAX_HISTORY_"+a.toUpperCase()]:this.MAX_HISTORY;this.get(a+"_history").length>b;){var c=this.get(a+"_history").splice(0,1);this[a+"_storage"].add(c[0])}},moveHistoryPosition:function(a,b){var c=this[a+"_history_position"]+b;c>=0&&c<this.get(a+"_history").length?this[a+"_history_position"]=c:c<0&&Math.abs(c)<=this[a+"_storage"].get().length&&(this[a+"_history_position"]=c)},getCurrentHistoryPosition:function(a){var b=this[a+"_history_position"];return this[a+"_history_position"]>=0?this.get(a+"_history")[b]:Math.abs(b)<=this[a+"_storage"].get().length?this[a+"_storage"].get(this[a+"_storage"].get().length-Math.abs(b)):this.get(a+"_history")[0]},redoHistory:function(a){return this.moveHistoryPosition(a,1),this.getCurrentHistoryPosition(a)},undoHistory:function(a){var b=this.getCurrentHistoryPosition(a);return this.moveHistoryPosition(a,-1),b},isHistoryAtLastPosition:function(a){return 0===this.get(a+"_history").length||this.get(a+"_history").length-1==this[a+"_history_position"]},isHistoryAtFirstPosition:function(a){if(0===this.get(a+"_history").length)return!0;var b=this[a+"_storage"].get();if(!b||0!==b.length){var c=b?1*b.length:0,d=-1*c;return d==this[a+"_history_position"]}return 0===this[a+"_history_position"]},clone:function(){var a=_.clone(this.attributes);return delete a.id,a.table=this.table.toJSON(),new cdb.admin.CartoDBLayer(a)},toJSON:function(){var a=_.clone(this.attributes);a.extra_params&&(a.extra_params=_.clone(this.attributes.extra_params),a.extra_params.api_key&&delete a.extra_params.api_key,a.extra_params.map_key&&delete a.extra_params.map_key),delete a.infowindow,delete a.tooltip,a.wizard_properties=this.wizard_properties.toJSON(),a.legend=this.legend.toJSON();var b={kind:"cartodb"===a.type.toLowerCase()?"carto":a.type,options:a,order:a.order,infowindow:null,tooltip:this.tooltip.toJSON()};return this.wizard_properties.supportsInteractivity()&&(b.infowindow=this.infowindow.toJSON()),void 0!==a.id&&(b.id=a.id),b},parse:function(a,b){var c={};if(!a||this._saving&&!this.isNew())return c;a.options.extra_params&&this.attributes&&this.attributes.extra_params&&(a.options.extra_params.map_key=this.attributes.extra_params.map_key);var d=this.attributes,e=d&&d.wizard_properties;return e&&e.properties&&e.properties.metadata&&a.options.wizard_properties&&a.options.wizard_properties.properties&&(a.options.wizard_properties.properties.metadata=e.properties.metadata),this.wizard_properties&&a.options.wizard_properties&&this.wizard_properties.properties(a.options.wizard_properties),_.extend(c,a.options,{id:a.id,type:"carto"===a.kind?"CartoDB":a.kind,infowindow:a.infowindow,tooltip:a.tooltip,order:a.order}),c},sync:function(a,b,c){return"read"!=a&&(c.data=JSON.stringify(b.toJSON())),c.contentType="application/json",c.url=b.url(),Backbone.syncAbort(a,this,c)},unbindSQLView:function(a){this.sqlView.unbind(null,null,this),this.sqlView=null},getCurrentState:function(){return this.error?"error":"success"},bindSQLView:function(a){var b=this;this.sqlView=a,this.sqlView.bind("error",this.errorSQLView,this),this.sqlView.bind("reset",function(){b.table.isInSQLView()&&(b.error=!1,b.sqlView.modify_rows?(b.set({query:null}),b.invalidate(),b.table.useSQLView(null,{force_data_fetch:!0}),b.trigger("clearSQLView")):b.save({query:a.getSQL(),sql_source:a.sqlSource()}))},this);var c=this.get("query");c?this.applySQLView(c,{add_to_history:!1}):this.table.data().fetch()},bindTable:function(a){this.table=a;var b=this;b.table.bind("change:name",function(){b.get("table_name")!=b.table.get("name")&&b.fetch({success:function(){b.updateCartoCss(b.table.previous("name"),b.table.get("name"))}})}),this.table.bind("change:schema",this._manageInteractivity,this)},_manageInteractivity:function(){var a=null;if(this.wizard_properties.supportsInteractivity()){this.table.containsColumn("cartodb_id")&&(a=["cartodb_id"]);var b=this.tooltip.getInteractivity();b.length&&(a=(a||[]).concat(b)),a&&(a=a.join(","))}this.get("interactivity")!==a&&(this.isNew()?this.set({interactivity:a}):this.save({interactivity:a}))},updateCartoCss:function(a,b){var c=this.get("tile_style");if(c){var d=new RegExp("#"+a,"g");c=c.replace(d,"#"+b),this.save({tile_style:c})}},bindLegend:function(a){var b=this.get("legend");b&&this.legend.set(b),this.legend.bind("change:template change:type change:title change:show_title change:items",_.debounce(function(){this.isNew()||this.save(null,{silent:!0})},250),this)},bindInfowindow:function(a,b){b=b||"infowindow";var c=this.get(b);if(c)a.set(c);else{var d=0;_(this.table.get("schema")).each(function(b){_.contains(["the_geom","created_at","updated_at","cartodb_id"],b[0])||(a.addField(b[0],d),++d)})}this.table.linkToInfowindow(a);var e="change:fields change:template_name change:alternative_names change:template change:disabled change:width change:maxHeight",f=_.debounce(function(){a.unbind(e,f,this),a.removeMissingFields(this.table.columnNames()),a.bind(e,f,this),this.isNew()||this.save(null,{silent:!0})},250);a.bind(e,f,this)},resetQuery:function(){this.get("query")&&this.save({query:void 0,sql_source:null})},errorSQLView:function(a,b){this.save({query:null},{silent:!0}),this.trigger("errorSQLView",b),this.error=!0},clearSQLView:function(){this.table.useSQLView(null),this.addToHistory("query","SELECT * FROM "+cdb.Utils.safeTableNameQuoting(this.table.get("name"))),this.undoHistory("query"),this.resetQuery(),this.trigger("clearSQLView")},applySQLView:function(a,b){b=b||{add_to_history:!0,sql_source:null},this.table.useSQLView(this.sqlView),this.sqlView.setSQL(a,{silent:!0,sql_source:b.sql_source||null}),b.add_to_history&&this.addToHistory("query",a),this.sqlView.fetch(),this.trigger("applySQLView",a)},moveToFront:function(a){var b=this.collection,c=b.getDataLayers();b.moveLayer(this,{to:c.length})}},{createDefaultLayerForTable:function(a,b){return new cdb.admin.CartoDBLayer({user_name:b,table_name:a,tile_style:"#"+a+cdb.admin.CartoStyles.DEFAULT_GEOMETRY_STYLE,style_version:"2.1.0",visible:!0,interactivity:"cartodb_id",maps_api_template:cdb.config.get("maps_api_template"),no_cdn:!0})}}),_.extend(cdb.geo.ui.InfowindowModel.prototype,{toJSON:function(){var a=[];return this.attributes.disabled||(a=_.clone(this.attributes.fields)),{fields:a,template_name:this.attributes.template_name,template:this.attributes.template,alternative_names:this.attributes.alternative_names,old_fields:this.attributes.old_fields,old_template_name:this.attributes.old_template_name,width:this.attributes.width,maxHeight:this.attributes.maxHeight}},removeMissingFields:function(a){for(var b={},c=0;c<a.length;++c){var d=a[c];b[d]=!0}var e=this.get("fields");if(e)for(var c=0;c<e.length;++c){var f=e[c].name;f in b||this.removeField(f)}},addMissingFields:function(a){for(var b={},c=this.get("fields"),d=0;d<c.length;++d){var e=c[d].name;b[e]=!0}for(var d=0;d<a.length;++d){var f=a[d];f in b||this.addField(f)}},mergeFields:function(a){this.removeMissingFields(a),this.addMissingFields(a)},getInteractivity:function(){for(var a=this.get("fields")||[],b=[],c=0;c<a.length;++c)b.push(a[c].name);return b}}),cdb.admin.GMapsBaseLayer=cdb.geo.GMapsBaseLayer.extend({clone:function(){return new cdb.admin.GMapsBaseLayer(_.clone(this.attributes))},parse:function(a){var b={};return _.extend(b,a.options,{id:a.id,type:"GMapsBase",order:a.order,parent_id:a.parent_id}),b},toJSON:function(){var a=_.clone(this.attributes),b={kind:"gmapsbase",options:a,order:a.order};return void 0!==a.id&&(b.id=a.id),b}}),cdb.admin.WMSLayer=cdb.geo.WMSLayer.extend({clone:function(){return new cdb.admin.WMSLayer(_.clone(this.attributes))},_generateClassName:function(a){if(a){var b=a;return b&&parseInt(b)&&_.isNumber(parseInt(b))&&(b="w"+b),b.replace(/\s+/g,"").replace(/[^a-zA-Z_0-9 ]/g,"").toLowerCase()}return""},parse:function(a){var b=this,c={};return _.extend(c,a.options,{id:a.id,className:b._generateClassName(a.options.layers),type:"WMS",order:a.order,parent_id:a.parent_id}),c},toJSON:function(){var a=_.clone(this.attributes),b={kind:"wms",options:a,order:a.order};return void 0!==a.id&&(b.id=a.id),b}}),cdb.admin.PlainLayer=cdb.geo.PlainLayer.extend({parse:function(a){var b={};return _.extend(b,a.options,{id:a.id,type:"Plain",order:a.order,parent_id:a.parent_id}),b},toJSON:function(){var a=_.clone(this.attributes),b={kind:"background",options:a,order:a.order};return void 0!==a.id&&(b.id=a.id),b}}),cdb.admin.TileLayer=cdb.geo.TileLayer.extend({clone:function(){return new cdb.admin.TileLayer(_.clone(this.attributes))},_generateClassName:function(a){return a?a.replace(/\s+/g,"").replace(/[^a-zA-Z_0-9 ]/g,"").toLowerCase():""},parse:function(a){var b=this,c={};return _.extend(c,a.options,{id:a.id,className:b._generateClassName(a.options.urlTemplate),type:"Tiled",order:a.order,parent_id:a.parent_id}),c},toJSON:function(){var a=_.clone(this.attributes),b={kind:"tiled",options:a,order:a.order};return void 0!==a.id&&(b.id=a.id),b},validateTemplateURL:function(a){var b=["a","b","c"],c=new Image;c.onload=a.success,c.onerror=a.error,c.src=this.get("urlTemplate").replace(/\{s\}/g,function(){return b[Math.floor(3*Math.random())]}).replace(/\{x\}/g,"0").replace(/\{y\}/g,"0").replace(/\{z\}/g,"0")}},{byCustomURL:function(a,b){if(a&&a.indexOf("/")===-1)throw new TypeError("invalid URL");a=a.replace(/\{S\}/g,"{s}").replace(/\{X\}/g,"{x}").replace(/\{Y\}/g,"{y}").replace(/\{Z\}/g,"{z}");var c=new cdb.admin.TileLayer({urlTemplate:a,attribution:null,maxZoom:21,minZoom:0,name:"",tms:b});return c.set("className",c._generateClassName(a)),c}}),cdb.admin.TorqueLayer=cdb.admin.CartoDBLayer.extend({}),cdb.admin.Layers=cdb.geo.Layers.extend({_DATA_LAYERS:["CartoDB","torque"],model:function(a,b){var c={Tiled:cdb.admin.TileLayer,CartoDB:cdb.admin.CartoDBLayer,Plain:cdb.admin.PlainLayer,GMapsBase:cdb.admin.GMapsBaseLayer,WMS:cdb.admin.WMSLayer,torque:cdb.admin.CartoDBLayer},d={"Layer::Tiled":"Tiled","Layer::Carto":"CartoDB","Layer::Background":"Plain",tiled:"Tiled",carto:"CartoDB",wms:"WMS",background:"Plain",gmapsbase:"GMapsBase",torque:"torque"};return new c[d[a.kind]](a,b)},initialize:function(){this.bind("change:order",function(){this._isSorted()||this.sort()}),cdb.geo.Layers.prototype.initialize.call(this)},add:function(a,b){return Backbone.Collection.prototype.add.apply(this,arguments)},getTorqueLayers:function(){return this.where({type:"torque"})},getTiledLayers:function(){return this.where({type:"Tiled"})},getLayerDefIndex:function(a){var b=this.getLayersByType("CartoDB");if(!b.length)return-1;for(var c=0,d=0;c<b.length;++c)if(b[c].get("visible")){if(b[c].cid===a.cid)return d;++d}return-1},getLayerDef:function(){for(var a=this.getLayersByType("CartoDB"),b={version:"1.0.1",layers:[]},c=0;c<a.length;++c)a[c].get("visible")&&b.layers.push(a[c].getLayerDef());return b},getDataLayers:function(){var a=this;return this.filter(function(b){return _.contains(a._DATA_LAYERS,b.get("type"))})},getTotalDataLayers:function(){return this.getDataLayers().length},getTotalDataLegends:function(){var a=this;return this.filter(function(b){return _.contains(a._DATA_LAYERS,b.get("type"))&&b.get("legend")&&b.get("legend").type&&"none"!==b.get("legend").type.toLowerCase()}).length},getLayersByType:function(a){return a&&""!==a?this.filter(function(b){return b.get("type")===a}):(cdb.log.info("a layer type is necessary to get layers"),0)},isLayerOnTopOfDataLayers:function(a){var b=this.getDataLayers().splice(-1)[0];return b.cid===a.cid},url:function(a){var b=cdb.config.urlVersion("layer",a);return"/api/"+b+"/maps/"+this.map.id+"/layers"},parse:function(a){return a.layers},saveLayers:function(a){a=a||{},this.save(null,a)},save:function(a,b){Backbone.sync("update",this,b)},toJSON:function(a){var b=_.map(this.models,function(b){return b.toJSON(a)});return{layers:b}},clone:function(a){return a=a||new cdb.admin.Layers,this.each(function(b){if(b.clone){var c=b.clone();c.unset("id"),a.add(c)}else{var d=_.clone(b.attributes);delete d.id,a.add(d)}}),a},_isSorted:function(){var a=_(this.models).map(function(a){return{cid:a.cid,order:a.get("order")}});return a.sort(function(a,b){return a.order-b.order}),_.isEqual(_(a).map(function(a){return a.cid}),_(this.models).map(function(a){return a.cid}))},moveLayer:function(a,b){b=b||{};var c=b.to,d=this.at(c);a.set("order",d.get("order"),{silent:!0}),this.remove(a,{silent:!0}),this.add(a,{at:c,silent:!0});for(var e=0;e<this.size();e++){var f=this.at(e);f.set("order",e)}this.trigger("reset"),this.saveLayers({complete:b.complete,error:function(){throw"Error saving layers after moving them"}})}}),cdb.admin.Map=cdb.geo.Map.extend({urlRoot:"/api/v1/maps",initialize:function(){this.constructor.__super__.initialize.apply(this),this.sync=Backbone.delayedSaveSync(Backbone.syncAbort,500),this.bind("change:id",this._fetchLayers,this),this.layers=new cdb.admin.Layers,this.layers.map=this,this.layers.bind("reset add change",this._layersChanged,this),this.layers.bind("reset add remove change:attribution",this._updateAttributions,this)},saveLayers:function(a){a=a||{};var b=function(){};this.layers.saveLayers({success:a.success||b,error:a.error||b})},_layersChanged:function(){this.layers.size()>=1&&(this._adjustZoomtoLayer(this.layers.at(0)),this.layers.size()>=2&&this.set({dataLayer:this.layers.at(1)}))},_fetchLayers:function(){this.layers.fetch()},relatedTo:function(a){this.table=a,this.table.bind("change:map_id",this._fetchOrCreate,this)},parse:function(a){return a.bounding_box_ne=JSON.parse(a.bounding_box_ne),a.bounding_box_sw=JSON.parse(a.bounding_box_sw),a.view_bounds_ne=JSON.parse(a.view_bounds_ne),a.view_bounds_sw=JSON.parse(a.view_bounds_sw),a.center=JSON.parse(a.center),a},_fetchOrCreate:function(){var a=this,b=this.table.get("map_id");b?(this.set({id:b}),this.fetch({error:function(){cdb.log.info("creating map for table"),a.create()}})):this.create()},setBaseLayer:function(a){if(this.trigger("savingLayers"),this.isBaseLayerAdded(a))return this.trigger("savingLayersFinish"),!1;var b=this,c=a,d=this.layers.at(0),e=c.get("labels")&&c.get("labels").url,f={success:function(){e||b.trigger("savingLayersFinish")},error:function(){cdb.log.error("error changing the basemap"),b.trigger("savingLayersFinish")}};return d?d.get("type")===c.get("type")?this._updateBaseLayer(d,c,f):this._replaceBaseLayer(d,c,f):this._addBaseLayer(c,f),f.success=function(){b.trigger("savingLayersFinish")},e?this._hasLabelsLayer()?this._updateLabelsLayer(c,f):this._addLabelsLayer(c,f):this._hasLabelsLayer()&&this._destroyLabelsLayer(f),c},_updateBaseLayer:function(a,b,c){var d=_.extend(_.clone(b.attributes),{id:a.get("id"),order:a.get("order")});a.clear({silent:!0}),a.set(d),a.save(null,c)},_replaceBaseLayer:function(a,b,c){this.layers.remove(a),b.set({id:a.get("id"),order:a.get("order")}),this.layers.add(b,{at:0}),b.save(null,c)},_addBaseLayer:function(a,b){this.layers.add(a,{at:0}),a.save(null,b)},_hasLabelsLayer:function(){return this.layers.size()>1&&"Tiled"===this.layers.last().get("type")},_updateLabelsLayer:function(a,b){var c=this.layers.last();c.set({name:this._labelsLayerNameFromBaseLayer(a),urlTemplate:a.get("labels").url,attribution:a.get("attribution"),minZoom:a.get("minZoom"),maxZoom:a.get("maxZoom"),subdomains:a.get("subdomains")}),c.save(null,b)},_addLabelsLayer:function(a,b){this.layers.add({name:this._labelsLayerNameFromBaseLayer(a),urlTemplate:a.get("labels").url,attribution:a.get("attribution"),minZoom:a.get("minZoom"),maxZoom:a.get("maxZoom"),subdomains:a.get("subdomains"),kind:"tiled"});var c=this.layers.last();c.save(null,b)},_destroyLabelsLayer:function(a){this.layers.last().destroy(a)},_labelsLayerNameFromBaseLayer:function(a){return a.get("name")+" Labels"},addDataLayer:function(a){this.addLayer(a),this.set({dataLayer:a})},create:function(){this.unset("id"),this.set({table_id:this.table.id}),this.save()},autoSave:function(){this.bind("change:center",this.save),this.bind("change:zoom",this.save)},toJSON:function(){var a=_.clone(this.attributes);return delete a.dataLayer,a},changeProvider:function(a,b){var c=this;if(b&&b.get("id"))return void cdb.log.error("the baselayer should not be saved in the server");var d=function(){b&&c.setBaseLayer(b)};this.get("provider")!==a?this.save({provider:a},{success:function(){d(),c.change()},error:function(a,b){c.error(_t("error switching base layer"),b)},silent:!0}):d()},isProviderGmaps:function(){var a=this.get("provider");return a&&a.toLowerCase().indexOf("googlemaps")!==-1},clone:function(a){a=a||new cdb.admin.Map;var b=_.clone(this.attributes);return delete b.id,a.set(b),a.set({center:_.clone(this.attributes.center),bounding_box_sw:_.clone(this.attributes.bounding_box_sw),bounding_box_ne:_.clone(this.attributes.bounding_box_ne),view_bounds_sw:_.clone(this.attributes.view_bounds_sw),view_bounds_ne:_.clone(this.attributes.view_bounds_ne),attribution:_.clone(this.attributes.attribution)}),this.layers.clone(a.layers),a.layers.map=a,a},notice:function(a,b,c){this.trigger("notice",a,b,c)},error:function(a,b){var c=b&&JSON.parse(b.responseText).errors[0];this.trigger("notice",a+" "+c,"error")},addCartodbLayerFromTable:function(a,b,c){c=c||{};var d=this,e=new cdb.admin.CartoDBTableMetadata({id:a});e.fetch({success:function(){var a=new cdb.admin.Map({id:e.get("map_id")});a.layers.bind("reset",function(){function b(){e.table.unbind("change:geometry_types",b),"torque"===e.wizard_properties.get("type")&&d.layers.getTorqueLayers().length&&e.wizard_properties.active("polygon"),d.layers.create(e,_.extend({wait:!0},c))}var e=a.layers.at(1).clone();e.unset("order"),e.isTableLoaded()?b():(e.table.bind("change:geometry_types",b),e.table.data().fetch())}),a.layers.fetch()}})},clamp:function(){var a=function(a,b){return Number((a-Math.floor(a/b)*b).toPrecision(8))},b=this.get("center"),c=b[1];return(c<-180||c>180)&&(c=a(180+c,360)-180,this.set("center",[b[0],c])),this}}),cdb.admin.Group=cdb.core.Model.extend({defaults:{display_name:""},initialize:function(a){this.parse(a||{})},parse:function(a){return this.users=new cdb.admin.GroupUsers(a.users,{group:this}),a}}),cdb.admin.UserGroups=Backbone.Collection.extend({model:cdb.admin.Group,initialize:function(a,b){this.organization=b.organization}}),cdb.admin.OrganizationGroups=Backbone.Collection.extend({model:cdb.admin.Group,url:function(a){var b=cdb.config.urlVersion("organizationGroups",a);return"/api/"+b+"/organization/"+this.organization.id+"/groups"},initialize:function(a,b){if(!b.organization)throw new Error("organization is required");this.organization=b.organization},parse:function(a){return this.total_entries=a.total_entries,a.groups},newGroupById:function(a){var b=this.get(a);return b||(b=new this.model({id:a}),b.collection=this),b},totalCount:function(){return this.total_entries}}),cdb.admin.UserLayers=cdb.admin.Layers.extend({url:function(a){var b=cdb.config.urlVersion("layer",a);return"/api/"+b+"/users/"+this.user.id+"/layers"},custom:function(){return this.where({category:void 0})}}),cdb.admin.User=cdb.core.Model.extend({urlRoot:"/api/v1/users",defaults:{avatar_url:"http://cartodb.s3.amazonaws.com/static/public_dashboard_default_avatar.png",username:""},initialize:function(a){a=a||{},this.tables=[],null===this.get("avatar_url")&&this.set("avatar_url",this.defaults.avatar_url),this.get("get_layers")&&(this.layers=new cdb.admin.UserLayers,this.layers.user=this,this._fetchLayers()),this.email="undefined"!=typeof a.email?a.email:"",this.get("organization")&&(this.organization=new cdb.admin.Organization(this.get("organization"),{currentUserId:this.id})),this.groups=new cdb.admin.UserGroups(a.groups,{organization:_.result(this.collection,"organization")||this.organization})},isInsideOrg:function(){return!!this.organization&&(0!=this.organization.id||this.isOrgOwner())},isOrgOwner:function(){return!!this.organization&&this.organization.owner.get("id")===this.get("id")},isOrgAdmin:function(){return!!this.organization&&this.organization.isOrgAdmin(this)},isViewer:function(){return 1==this.get("viewer")},isBuilder:function(){return!this.isViewer()},nameOrUsername:function(){return this.get("name")||this.get("username")},renderData:function(a){var b=this.get("username");return a&&a.id===this.id&&(b=_t("You")),{username:b,avatar_url:this.get("avatar_url")}},_fetchLayers:function(){this.layers.fetch({add:!0})},fetchTables:function(){var a=this;if(!this._fetchingTables){var b=new cdb.admin.Visualizations;b.options.set("type","table"),b.bind("reset",function(){a.tables=b.map(function(a){return a.get("name")})}),this._fetchingTables=!0,b.fetch()}},hasCreateDatasetsFeature:function(){return this.isBuilder()},canCreateDatasets:function(){return!(!this.get("remaining_byte_quota")||this.get("remaining_byte_quota")<=0)&&this.hasCreateDatasetsFeature()},hasCreateMapsFeature:function(){return this.isBuilder()},canAddLayerTo:function(a){if(!a||!a.layers||!a.layers.getDataLayers)throw new Error("Map model is not defined or wrong");var b=a.layers.getDataLayers();return b.length<this.getMaxLayers()},getMaxLayers:function(){return this.get("limits")&&this.get("limits").max_layers||5},getMaxConcurrentImports:function(){return this.get("limits")&&this.get("limits").concurrent_imports||1},featureEnabled:function(a){var b=this.get("feature_flags");return!(!b||0===b.length||!a)&&_.contains(b,a)},isCloseToLimits:function(){var a=this.get("quota_in_bytes"),b=this.get("remaining_byte_quota");return 100*b/a<20},getMaxLayersPerMap:function(){return this.get("max_layers")||4},canStartTrial:function(){return!this.isInsideOrg()&&"FREE"===this.get("account_type")&&this.get("table_count")>0},canCreatePrivateDatasets:function(){var a=this.get("actions");return a&&a.private_tables},equals:function(a){if(a.get)return this.get("id")===a.get("id")},viewUrl:function(){return new cdb.common.UserUrl({base_url:this.get("base_url"),is_org_admin:this.isOrgAdmin()})},upgradeContactEmail:function(){return this.isInsideOrg()?this.isOrgOwner()?"enterprise-support@carto.com":this.organization.owner.get("email"):"support@carto.com"},usedQuotaPercentage:function(){return 100*this.get("db_size_in_bytes")/this.organization.get("available_quota_for_user")},assignedQuotaInRoundedMb:function(){return Math.floor(this.get("quota_in_bytes")/1024/1024).toFixed(0)},assignedQuotaPercentage:function(){return 100*this.get("quota_in_bytes")/this.organization.get("available_quota_for_user")}}),cdb.admin.Permission=cdb.core.Model.extend({urlRoot:"/api/v1/perm",initialize:function(){this.acl=new Backbone.Collection,this.owner=null,this._generateOwner(),this._generateAcl(),this.bind("change:owner",this._generateOwner,this),this.bind("change:acl",this._generateAcl,this)},_generateOwner:function(){this.owner||(this.owner=new cdb.admin.User),this.owner.set(this.get("owner"))},_generateAcl:function(){this.acl.reset([],{silent:!0}),_.each(this.get("acl"),function(a){var b;switch(a.type){case"user":b=new cdb.admin.User(a.entity);break;case"org":b=new cdb.admin.Organization(a.entity);break;case"group":b=new cdb.admin.Group(a.entity);break;default:throw new Error("Unknown ACL item type: "+a.type)}this._grantAccess(b,a.access)},this)},cleanPermissions:function(){this.acl.reset()},hasAccess:function(a){return this.hasReadAccess(a)},hasReadAccess:function(a){return!!this.findRepresentableAclItem(a)},hasWriteAccess:function(a){var b=cdb.Utils.result(this.findRepresentableAclItem(a),"get","access");return b===cdb.admin.Permission.READ_WRITE},canChangeReadAccess:function(a){return this._canChangeAccess(a)},canChangeWriteAccess:function(a){return(!a.isBuilder||a.isBuilder())&&this._canChangeAccess(a,function(a){return cdb.Utils.result(a,"get","access")!==cdb.admin.Permission.READ_WRITE})},_canChangeAccess:function(a){var b=this.findRepresentableAclItem(a);return this.isOwner(a)||!b||b===this._ownAclItem(a)||cdb.Utils.result(arguments,1,b)||!1},grantWriteAccess:function(a){this._grantAccess(a,this.constructor.READ_WRITE)},grantReadAccess:function(a){this._grantAccess(a,this.constructor.READ_ONLY)},revokeWriteAccess:function(a){this.grantReadAccess(a)},revokeAccess:function(a){var b=this._ownAclItem(a);b&&this.acl.remove(b)},isOwner:function(a){return _.result(this.owner,"id")===_.result(a,"id")},toJSON:function(){return{entity:this.get("entity"),acl:this.acl.toJSON()}},getUsersWithAnyPermission:function(){return this.acl.chain().filter(this._hasTypeUser).map(this._getEntity).value()},isSharedWithOrganization:function(){return this.acl.any(this._hasTypeOrg)},clone:function(){var a=_.clone(this.attributes);return delete a.id,new cdb.admin.Permission(a)},overwriteAcl:function(a){this.acl.reset(a.acl.models)},findRepresentableAclItem:function(a){if(this.isOwner(a))return this._newAclItem(a,this.constructor.READ_WRITE);var b=["_ownAclItem","_organizationAclItem","_mostPrivilegedGroupAclItem"];return this._findMostPrivilegedAclItem(b,function(b){return this[b](a)})},_hasTypeUser:function(a){return"user"===a.get("type")},_getEntity:function(a){return a.get("entity")},_hasTypeOrg:function(a){return"org"===a.get("type")},_isOrganization:function(a){return a instanceof cdb.admin.Organization},_ownAclItem:function(a){if(a&&_.isFunction(a.isNew)||cdb.log.error("model is required to find an ACL item"),!a.isNew())return this.acl.find(function(b){return b.get("entity").id===a.id})},_organizationAclItem:function(a){var b=_.result(a.collection,"organization")||a.organization;if(b)return this._ownAclItem(b)},_mostPrivilegedGroupAclItem:function(a){var b=_.result(a.groups,"models");if(b)return this._findMostPrivilegedAclItem(b,this._ownAclItem)},_findMostPrivilegedAclItem:function(a,b){for(var c,d=0,e=a[d];e&&cdb.Utils.result(c,"get","access")!==cdb.admin.Permission.READ_WRITE;e=a[++d])c=b.call(this,e)||c;return c},_grantAccess:function(a,b){var c=this._ownAclItem(a);if(c)c.set("access",b);else{if(c=this._newAclItem(a,b),!c.isValid())throw new Error(b+" is not a valid ACL access");this.acl.add(c)}},_newAclItem:function(a,b){var c;if(a instanceof cdb.admin.User)c="user";else if(a instanceof cdb.admin.Group)c="group";else{if(!this._isOrganization(a))throw new Error("model not recognized as a valid ACL entity "+a);c="org"}return new cdb.admin.ACLItem({type:c,entity:a,access:b})}},{READ_ONLY:"r",READ_WRITE:"rw"}),cdb.admin.ACLItem=Backbone.Model.extend({defaults:{access:"r"},isOwn:function(a){return a.id===this.get("entity").id},validate:function(a,b){var c=cdb.admin.Permission;if(a.access!==c.READ_ONLY&&a.access!==c.READ_WRITE)return"access can't take 'r' or 'rw' values"},toJSON:function(){var a=_.pick(this.get("entity").toJSON(),"id","username","avatar_url","name");return a.username||(a.username=a.name,delete a.name),{type:this.get("type")||"user",entity:a,access:this.get("access")}}}),cdb.admin.GroupUsers=Backbone.Collection.extend({model:cdb.admin.User,initialize:function(a,b){if(!b.group)throw new Error("group is required");this.group=b.group},url:function(){return this.group.url.apply(this.group,arguments)+"/users"},parse:function(a){return this.total_entries=a.total_entries,this.total_user_entries=a.total_user_entries,a.users},addInBatch:function(a){return this._batchAsyncProcessUsers("POST",a)},removeInBatch:function(a){var b=this;return this._batchAsyncProcessUsers("DELETE",a).done(function(){_.each(a,b.remove.bind(b))})},_batchAsyncProcessUsers:function(a,b){var c=this,d=$.Deferred();return $.ajax({type:a,url:cdb.config.prefixUrl()+this.url(),data:{users:b},success:function(){var a=arguments;c.fetch({success:function(){d.resolve.apply(d,a)},error:function(){d.resolve.apply(d,a)}})},error:function(){d.reject.apply(d,arguments)}}),d},totalCount:function(){return this.total_user_entries}}),cdb.admin.Grantable=cdb.core.Model.extend({initialize:function(){this.entity=this._createEntity()},_createEntity:function(){var a=cdb.Utils.capitalize(this.get("type")),b=new cdb.admin[a](this.get("model"));return b.organization=this.collection.organization,b}}),cdb.admin.Grantables=Backbone.Collection.extend({model:cdb.admin.Grantable,url:function(a){var b=cdb.config.urlVersion("organizationGrantables",a);return"/api/"+b+"/organization/"+this.organization.id+"/grantables"},initialize:function(a,b){if(!b.organization)throw new Error("organization is required");this.organization=b.organization,this.currentUserId=b.currentUserId,this.sync=Backbone.syncAbort},parse:function(a){return this.total_entries=a.total_entries,_.reduce(a.grantables,function(a,b){return b.id===this.currentUserId?this.total_entries--:a.push(b),a},[],this)},totalCount:function(){return this.total_entries}}),cdb.admin.Organization=cdb.core.Model.extend({url:"/api/v1/org/",initialize:function(a,b){a=a||{},this.owner=new cdb.admin.User(this.get("owner")),this.display_email="undefined"!=typeof a.admin_email&&null!=a.admin_email&&(""==a.admin_email?this.owner.email:a.admin_email);var c={organization:this,currentUserId:b&&b.currentUserId};this.users=new cdb.admin.Organization.Users(a.users,c),this.groups=new cdb.admin.OrganizationGroups(a.groups,c),this.grantables=new cdb.admin.Grantables(void 0,c),this.users.each(this._setOrganizationOnModel,this),this.groups.each(this._setOrganizationOnModel,this)},_setOrganizationOnModel:function(a){a.organization=this},fetch:function(){throw new Error("organization should not be fetch, should be static")},containsUser:function(a){return!!this.users.find(function(b){return b.id===a.id})},isOrgAdmin:function(a){return this.owner.id===a.id||!!_.find(this.get("admins"),function(b){return b.id===a.id})},viewUrl:function(){return new cdb.common.OrganizationUrl({base_url:this.get("base_url")
})}}),cdb.admin.Organization.Users=Backbone.Collection.extend({model:cdb.admin.User,_DEFAULT_EXCLUDE_CURRENT_USER:!0,url:function(){return"/api/v1/organization/"+this.organization.id+"/users"},initialize:function(a,b){if(!b.organization)throw new Error("Organization is needed for fetching organization users");this.elder("initialize"),this.organization=b.organization,this.currentUserId=b.currentUserId,this._excludeCurrentUser=this._DEFAULT_EXCLUDE_CURRENT_USER,this.sync=Backbone.syncAbort},comparator:function(a){return a.get("username")},excludeCurrentUser:function(a){a=!!a,this._excludeCurrentUser=a,a&&!this.currentUserId&&cdb.log.error("set excludeCurrentUser to true, but there is no current user id set to exclude!")},restoreExcludeCurrentUser:function(){this.excludeCurrentUser(this._DEFAULT_EXCLUDE_CURRENT_USER)},parse:function(a){return this.total_entries=a.total_entries,this.total_user_entries=a.total_user_entries,_.reduce(a.users,function(a,b){return this._excludeCurrentUser&&b.id===this.currentUserId?(this.total_user_entries--,this.total_entries--):a.push(b),a},[],this)},totalCount:function(){return this.total_user_entries}}),cdb.admin.Organization.Invites=cdb.core.Model.extend({defaults:{users_emails:[],welcome_text:"I'd like to invite you to my CARTO organization,\nBest regards"},url:function(){return"/api/v1/organization/"+this.organizationId+"/invitations"},initialize:function(a,b){if(!b.organizationId)throw new Error("Organization id is needed for fetching organization users");this.organizationId=b.organizationId}}),cdb.admin.Like=cdb.core.Model.extend({defaults:{likeable:!0},url:function(a){var b=cdb.config.urlVersion("like",a);return"/api/"+b+"/viz/"+this.get("vis_id")+"/like"},initialize:function(){_.bindAll(this,"_onSaveError"),this.on("destroy",function(){this.set({liked:!1,likes:this.get("likes")-1})},this)},_onSaveError:function(a,b){this.trigger("error",{status:b.status,statusText:b.statusText})},toggleLiked:function(){this.get("liked")?this.destroy():(this.set({id:null},{silent:!0}),this.save({},{error:this._onSaveError}))}},{newByVisData:function(a){var b=_.defaults({id:a.liked?a.vis_id:null},_.omit(a,"url")),c=new cdb.admin.Like(b);return a.url&&(c.url=a.url),c}}),cdb.admin.ExportMapModel=cdb.core.Model.extend({urlRoot:"/api/v3/visualization_exports",initialize:function(a){this._loadAttributes(a)},requestExport:function(){this.save(null,{success:this._requestExportSuccessHandler.bind(this)}),window.user_data&&window.user_data.email?cdb.god.trigger("metrics","export_map",{email:window.user_data.email}):cdb.god.trigger("metrics","export_map_public",{})},cancelExport:function(){this._interrupt()},_requestExportSuccessHandler:function(){this._pollPID=setInterval(function(){this.fetch({success:this._checkState.bind(this),error:this._errorHandler.bind(this)})}.bind(this),2e3)},_checkState:function(){"complete"===this.get("state")?this._finishExport():"failure"===this.get("state")&&this._errorHandler()},_finishExport:function(){clearInterval(this._pollPID)},_errorHandler:function(){throw this._interrupt(),new Error("There is a problem with your export. Please try again.")},_interrupt:function(){clearInterval(this._pollPID)},_loadAttributes:function(a){if(!a)throw new Error("no attributes were specified");if(!a.visualization_id)throw new Error("'visualization_id' is required");this.visualization_id=a.visualization_id}}),cdb.admin.DropdownMenu=cdb.ui.common.Dropdown.extend({show:function(){var a=$.Deferred(),b=this;return this.delegateEvents(),this.$el.css({marginTop:"down"==b.options.vertical_position?"-10px":"10px",opacity:0,display:"block"}).animate({margin:"0",opacity:1},{duration:this.options.speedIn,complete:function(){a.resolve()}}),this.trigger("onDropdownShown",this.el),a.promise()},openAt:function(a,b){var c=$.Deferred();return this.$el.css({top:b,left:a,width:this.options.width}).addClass(("up"==this.options.vertical_position?"vertical_top":"vertical_bottom")+" "+("right"==this.options.horizontal_position?"horizontal_right":"horizontal_left")+" tick_"+this.options.tick),this.isOpen=!0,$.when(this.show()).done(function(){c.resolve()}),c.promise()},hide:function(a){if(!this.isOpen)return void(a&&a());var b=this;this.isOpen=!1,this.$el.animate({marginTop:"down"==b.options.vertical_position?"10px":"-10px",opacity:0},this.options.speedOut,function(){$(b.options.target).removeClass("selected"),b.$el.hide(),a&&a(),b.trigger("onDropdownHidden",b.el)})}}),cdb.common.Url=cdb.core.Model.extend({initialize:function(a){if(!a.base_url)throw new Error("base_url is required")},urlToPath:function(){return cdb.common.Url.byBaseUrl(this.toString.apply(this,arguments))},pathname:function(){return this.toString().match(/^.+\/\/[^\/]+(.*)$/)[1]},toString:function(){return this._joinArgumentsWithSlashes(this.get("base_url"),Array.prototype.slice.call(arguments,0))},_joinArgumentsWithSlashes:function(){return _.chain(arguments).flatten().compact().value().join("/")}},{byBaseUrl:function(a){return new cdb.common.Url({base_url:a})}}),cdb.common.DashboardVisUrl=cdb.common.Url.extend({lockedItems:function(){return this.urlToPath("locked")},sharedItems:function(){return this.urlToPath("shared")},likedItems:function(){return this.urlToPath("liked")}}),cdb.common.DashboardDatasetsUrl=cdb.common.DashboardVisUrl.extend({dataLibrary:function(){return this.urlToPath("library")}}),cdb.common.DashboardUrl=cdb.common.Url.extend({datasets:function(){return new cdb.common.DashboardDatasetsUrl({base_url:this.urlToPath("datasets")})},maps:function(){return new cdb.common.DashboardVisUrl({base_url:this.urlToPath("maps")})},deepInsights:function(){return new cdb.common.DashboardVisUrl({base_url:this.urlToPath("deep-insights")})}}),cdb.common.DatasetUrl=cdb.common.Url.extend({edit:function(){return this.urlToPath()},public:function(){return this.urlToPath("public")}}),cdb.common.MapUrl=cdb.common.Url.extend({edit:function(){return this.urlToPath("map")},public:function(){return this.urlToPath("public_map")},deepInsights:function(){return this.urlToPath("deep-insights")}}),cdb.common.OrganizationUrl=cdb.common.Url.extend({edit:function(a){if(!a)throw new Error("User is needed to create the url");return this.urlToPath(a.get("username")+"/edit")},create:function(){return this.urlToPath("new")},groups:function(){return this.urlToPath("groups")}}),cdb.common.UserUrl=cdb.common.Url.extend({initialize:function(a){if(cdb.common.Url.prototype.initialize.apply(this,arguments),_.isUndefined(a.is_org_admin))throw new Error("is_org_admin is required")},organization:function(){return this.get("is_org_admin")?new cdb.common.OrganizationUrl({base_url:this.urlToPath("organization")}):this.urlToPath("account")},accountSettings:function(){return this.urlToPath("profile")},publicProfile:function(){return this.urlToPath("me")},apiKeys:function(){return this.urlToPath("your_apps")},logout:function(){return this.urlToPath("logout")},dashboard:function(){return new cdb.common.DashboardUrl({base_url:this.urlToPath("dashboard")})}});
//# sourceMappingURL=public_map_deps.js.map
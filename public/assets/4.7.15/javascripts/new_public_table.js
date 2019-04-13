/*! v4.7.15 - 2017-05-30 */
!function a(b,c,d){function e(g,h){if(!c[g]){if(!b[g]){var i="function"==typeof require&&require;if(!h&&i)return i(g,!0);if(f)return f(g,!0);var j=new Error("Cannot find module '"+g+"'");throw j.code="MODULE_NOT_FOUND",j}var k=c[g]={exports:{}};b[g][0].call(k.exports,function(a){var c=b[g][1][a];return e(c?c:a)},k,k.exports,a,b,c,d)}return c[g].exports}for(var f="function"==typeof require&&require,g=0;g<d.length;g++)e(d[g]);return e}({1:[function(a,b,c){(function(c){var d="undefined"!=typeof window?window._:"undefined"!=typeof c?c._:null,e="undefined"!=typeof window?window.$:"undefined"!=typeof c?c.$:null,f="undefined"!=typeof window?window.cdb:"undefined"!=typeof c?c.cdb:null,g=a("../../views/base_dialog/view");b.exports=g.extend({_CSV_FILTER:"SELECT * FROM (%%sql%%) as subq ",_MAX_SQL_GET_LENGTH:1e3,events:g.extendEvents({"click .js-option:not(.is-disabled)":"_export"}),formats:[{format:"csv",fetcher:"fetchCSV",geomRequired:!1,illustrationIconModifier:"IllustrationIcon--neutral"},{format:"shp",fetcher:"fetch",geomRequired:!0,illustrationIconModifier:"IllustrationIcon--magenta"},{format:"kml",fetcher:"fetch",geomRequired:!0,illustrationIconModifier:"IllustrationIcon--sunrise"},{format:"geojson",label:"geo json",fetcher:"fetch",geomRequired:!0,illustrationIconModifier:"IllustrationIcon--cyan"},{format:"svg",fetcher:"fetchSVG",geomRequired:!0,illustrationIconModifier:"IllustrationIcon--royalDark"}],initialize:function(){d.extend(this.options,{clean_on_hide:!0,table_id:this.model.id}),this.elder("initialize"),d.bindAll(this,"_export"),this.baseUrl=f.config.getSqlApiUrl(),this.model.bind("change:geometry_types",this.refresh,this)},getFormat:function(a){for(var b in this.formats)if(this.formats[b].format===a)return this.formats[b]},_export:function(a){this.killEvent(a);var b=e(a.currentTarget),c=b.data("format"),d=this.getFormat(c);this[d.fetcher](c)},getBaseOptions:function(){var a={};return a.filename=this.model.get("name"),this.options.user_data&&(a.api_key=this.options.user_data.api_key),a},getPlainSql:function(){return this.options.sql?sql=this.options.sql:this.model.sqlView?sql=this.model.sqlView.getSQL():sql="select * from "+this.model.get("name"),sql},getGeomFilteredSql:function(){var a=this.getPlainSql();return this.model.isGeoreferenced()?this._CSV_FILTER.replace(/%%sql%%/g,a):a},_fetch:function(a,b){if(this._showElAndHideRest(".js-preparing-download"),this.$(".format").val(a.format),this.$(".q").val(b),this.$(".filename").val(a.filename),this.$(".api_key").val(a.api_key),"csv"===a.format?this.$(".skipfields").val("the_geom_webmercator"):this.$(".skipfields").val("the_geom,the_geom_webmercator"),window.user_data&&window.user_data.email&&f.god.trigger("metrics","export_table",{email:window.user_data.email}),b.length<this._MAX_SQL_GET_LENGTH){var c=this.$("form").attr("action")+"?"+this.$("form").serialize();this._fetchGET(c)}else this.submit();this.$(".db").attr("disabled","disabled"),this.$(".skipfields").attr("disabled","disabled"),this.options.autoClose&&(this.close(),this.trigger("generating",this.$(".js-preparing-download").html()))},showError:function(a){this.$(".js-error").html(this.getTemplate("common/templates/fail")({msg:a})),this._showElAndHideRest(".js-error")},_fetchGET:function(a){function b(a){var b=null;try{var c=JSON.parse(a);b=c.error[0]}catch(c){a&&a.indexOf("error")!==-1&&(b="an error occurred")}return b}var c,d=this,e=window.open(a);e.onload=function(){clearInterval(c);var a=b(e.document.body.textContent);a?d.showError(a):d.close(),e.close()},window.focus(),c=setInterval(function(){(e.closed||e.document&&0===e.document.body.textContent.length)&&(d.close(),clearInterval(c))},100)},submit:function(){this.$("form").submit()},fetch:function(a){var b=this.getBaseOptions();b.format=a;var c=this.getPlainSql();this._fetch(b,c)},fetchCSV:function(){var a=this.getBaseOptions();a.format="csv";var b=this.getGeomFilteredSql();this.$(".skipfields").removeAttr("disabled"),this._fetch(a,b)},fetchSVG:function(){this.$(".db").removeAttr("disabled"),this.fetch("svg")},render_content:function(){var a=this.model.isGeoreferenced();return d.isBoolean(a)?this.getTemplate("common/dialogs/export/export_template")({preparingDownloadContent:this._renderLoadingContent("We are preparing your download. Depending on the size, it could take some time."),formats:this.formats,url:this.baseUrl,isGeoreferenced:a}):this._renderLoadingContent("Checking georeferences…")},refresh:function(){this.$(".content").html(this.render_content())},_renderLoadingContent:function(a){return this.getTemplate("common/templates/loading")({title:a,quote:f.editor.randomQuote()})},_showElAndHideRest:function(a){[".js-start",".js-preparing-download",".js-error"].forEach(function(b){this.$(b)[b===a?"show":"hide"]()},this)}})}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"../../views/base_dialog/view":5}],2:[function(a,b,c){(function(c){var d="undefined"!=typeof window?window._:"undefined"!=typeof c?c._:null,e="undefined"!=typeof window?window.$:"undefined"!=typeof c?c.$:null,f=("undefined"!=typeof window?window.cdb:"undefined"!=typeof c?c.cdb:null,a("./export_view"));b.exports=f.extend({events:{"click .js-option:not(.is-disabled)":"_export","click .js-bounds":"_changeBounds","click .cancel":"_cancel","click .close":"_cancel"},initialize:function(){this.elder("initialize"),this.model.set("bounds",this.options.bounds),this.model.bind("change:bounds",this._setBoundsCheckbox,this)},_changeBounds:function(){this.model.set("bounds",!this.model.get("bounds"))},_setBoundsCheckbox:function(){this.$(".js-bounds .Checkbox-input").toggleClass("is-checked",!!this.model.get("bounds"))},_toggleBounds:function(a){this.killEvent(a);var b=e(a.currentTarget),c=b.data("format"),d=this.getFormat(c);this[d.fetcher](c)},getBaseOptions:function(){var a={};return a.filename=this.model.get("name"),a.filename.indexOf(".")!=-1&&(a.filename=a.filename.split(".")[1]),this.options.user_data&&(a.api_key=this.options.user_data.api_key),a},getPlainSql:function(){return this.options.sql?sql=this.options.sql:this.model.sqlView&&this.model.get("bounds")?sql=this.model.sqlView.getSQL():sql="select * from "+this.model.get("name"),sql},render_content:function(){var a=this.model.isGeoreferenced(),b=this.model.get("bounds");return d.isBoolean(a)?this.getTemplate("common/dialogs/export/public_export_template")({preparingDownloadContent:this._renderLoadingContent("We are preparing your download. Depending on the size, it could take some time."),formats:this.formats,url:this.baseUrl,isGeoreferenced:a,hasBounds:b}):this._renderLoadingContent("Checking georeferences…")}})}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./export_view":1}],3:[function(a,b,c){(function(c){var d="undefined"!=typeof window?window._:"undefined"!=typeof c?c._:null,e="undefined"!=typeof window?window.cdb:"undefined"!=typeof c?c.cdb:null,f=a("./views/base_dialog/view");b.exports={createDialogByTemplate:function(a,b,c){return this.createDialogByView(this.createByTemplate(a,b),c)},createByTemplate:function(a,b,c){var f=d.isString(a)?e.templates.getTemplate(a):a,g=new e.core.View(c);return g.render=function(){return this.$el.html(f(b)),this},g},createByList:function(a,b){var c=new e.core.View(b);return c.render=function(){return this.clearSubViews(),d.each(a,function(a){this.addView(a),this.$el.append(a.render().$el)},this),this},c},createDialogByView:function(a,b){var c=d.extend({clean_on_hide:!0,enter_to_confirm:!0},b);return new(f.extend({initialize:function(){this.elder("initialize"),this.addView(a)},render_content:function(){return a.render().el}}))(c)}}}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./views/base_dialog/view":5}],4:[function(a,b,c){b.exports=function(){var a=_.template('<p class="CDB-Text CDB-Size-medium u-altTextColor">"<%= quote %>"</p><% if (author) { %><p class="CDB-Text CDB-Size-medium u-altTextColor u-tSpace"><em>– <%- author %></em></p><% } %>'),b=[{quote:"Geographers never get lost. They just do accidental field work.",author:"Nicholas Chrisman"},{quote:"Geography is just physics slowed down, with a couple of trees stuck in it.",author:"Terry Pratchett"},{quote:"Not all those who wander are lost.",author:"J. R. R. Tolkien"},{quote:"In that Empire, the Art of Cartography attained such Perfection that the map of a single Province occupied the entirety of a City.",author:"Jorge Luis Borges"},{quote:"X marks the spot",author:"Indiana Jones"},{quote:"It's turtles all the way down.",author:null},{quote:"Remember: no matter where you go, there you are.",author:null},{quote:"Without geography, you're nowhere!",author:"Jimmy Buffett"},{quote:"our earth is a globe / whose surface we probe /<br />no map can replace her / but just try to trace her",author:"Steve Waterman"},{quote:"Everything happens somewhere.",author:"Doctor Who"},{quote:"A map is the greatest of all epic poems. Its lines and colors show the realization of great dreams.",author:"Gilbert H. Grosvenor"},{quote:"Everything is related to everything else,<br />but near things are more related than distant things.",author:"Tobler's first law of geography"},{quote:"Hic Sunt Dracones",author:null},{quote:"Here be dragons",author:null},{quote:"Stand in the place where you live / Now face North /<br/>Think about direction / Wonder why you haven't before",author:"R.E.M"},{quote:"The virtue of maps, they show what can be done with limited space, they foresee that everything can happen therein.",author:"José Saramago"}],c=Math.round(Math.random()*(b.length-1));return a(b[c])}},{}],5:[function(a,b,c){(function(a){var c="undefined"!=typeof window?window.cdb:"undefined"!=typeof a?a.cdb:null,d="undefined"!=typeof window?window._:"undefined"!=typeof a?a._:null,e="undefined"!=typeof window?window.$:"undefined"!=typeof a?a.$:null,f=c.ui.common.Dialog;b.exports=f.extend({className:"Dialog is-opening",overrideDefaults:{template_name:"common/views/base_dialog/template",triggerDialogEvents:!0},initialize:function(){d.defaults(this.options,this.overrideDefaults),this.elder("initialize"),this.bind("show",this._setBodyForDialogMode.bind(this,"add")),this.bind("hide",this._setBodyForDialogMode.bind(this,"remove"))},show:function(){f.prototype.show.apply(this,arguments),this.trigger("show"),this.options.triggerDialogEvents&&c.god.trigger("dialogOpened"),this.$el.removeClass("is-closing"),document.activeElement&&document.activeElement.blur()},render:function(){return f.prototype.render.apply(this,arguments),this.$(".content").addClass("is-newContent"),this._isSticky()&&this.$el.addClass("is-sticky"),this.show(),this},_isSticky:function(){return this.options&&this.options.sticky},close:function(){this._cancel(void 0,!0)},open:function(){f.prototype.open.apply(this,arguments),this.show()},hide:function(){f.prototype.hide.apply(this,arguments),this.trigger("hide")},_cancel:function(a,b){if(a&&this.killEvent(a),!this._isSticky()){this.$el.removeClass("is-opening").addClass("is-closing");var d=this;setTimeout(function(){d.cancel&&!b&&d.cancel(),f.prototype.hide.call(d)},80),this.trigger("hide"),this.options.triggerDialogEvents&&c.god.trigger("dialogClosed")}},_ok:function(a){this.killEvent(a),this.ok?this.ok():this.close()},_setBodyForDialogMode:function(a){e("body")[a+"Class"]("is-inDialog")}})}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],6:[function(a,b,c){(function(a){var c="undefined"!=typeof window?window.cdb:"undefined"!=typeof a?a.cdb:null;b.exports=c.core.View.extend({tagName:"a",events:{click:"_toggleLike"},initialize:function(){this.template=c.templates.getTemplate("common/views/likes/template"),this.model.bind("change:likeable change:liked change:likes error",this.render,this)},render:function(){return this.$el.html(this.template({likes:this.model.get("likes"),size:this.model.get("size"),show_count:this.model.get("show_count"),show_label:this.model.get("show_label")})).attr({class:this._classNames(),href:this._hrefLocation()}),this},_hrefLocation:function(){var a="#/like";return this.model.get("likeable")||(a=window.login_url),a},_classNames:function(){var a=["LikesIndicator"];return this.model.get("likeable")&&a.push("is-likeable"),this.model.get("liked")&&a.push("is-liked"),this._animate&&(a.push("is-animated"),this.$el.one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend",function(){this._animate=!1,this.render()}.bind(this))),a.join(" ")},_toggleLike:function(a){this.model.get("likeable")&&(this.killEvent(a),this._animate=!0,this.model.toggleLiked())}})}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],7:[function(a,b,c){(function(a){var c="undefined"!=typeof window?window.$:"undefined"!=typeof a?a.$:null,d="undefined"!=typeof window?window.cdb:"undefined"!=typeof a?a.cdb:null,e="undefined"!=typeof window?window._:"undefined"!=typeof a?a._:null;b.exports=d.core.View.extend({options:{width:300,height:170,privacy:"PUBLIC",username:"",visId:"",mapsApiResource:"",className:"",authTokens:[]},_TEMPLATES:{regular:"<%- protocol %>://<%= mapsApiResource %>/api/v1/map/static/named/<%- tpl %>/<%- width %>/<%- height %>.png<%= authTokens %>",cdn:"<%- protocol %>://<%- cdn %>/<%- username %>/api/v1/map/static/named/<%- tpl %>/<%- width %>/<%- height %>.png<%= authTokens %>"},initialize:function(){e.each(["visId","mapsApiResource","username"],function(a){this.options[a]||console.log(a+" is required for Static Map instantiation")},this)},load:function(){return this._startLoader(),this._loadFromVisId(),this},_generateImageTemplate:function(){return"tpl_"+this.options.visId.replace(/-/g,"_")},_loadFromVisId:function(){var a=this._isHTTPS()?"https":"http",b=d.config.get("cdn_url"),c=e.template(b?this._TEMPLATES.cdn:this._TEMPLATES.regular),f={protocol:a,username:this.options.username,mapsApiResource:this.options.mapsApiResource,tpl:this._generateImageTemplate(),width:this.options.width,height:this.options.height,authTokens:this._generateAuthTokensParams()};b&&(f=e.extend(f,{cdn:b[a]}));var g=c(f);this._loadImage({},g)},_generateAuthTokensParams:function(){var a=this.options.authTokens;return a&&a.length>0?"?"+e.map(a,function(a){return"auth_token="+a}).join("&"):""},_isHTTPS:function(){return 0===location.protocol.indexOf("https")},loadURL:function(a){var b=c('<img class="MapCard-preview" src="'+a+'" />');this.$el.append(b),this.options.className&&b.addClass(this.options.className),b.fadeIn(250)},showError:function(){this._onError()},_startLoader:function(){this.$el.addClass("is-loading")},_stopLoader:function(){this.$el.removeClass("is-loading")},_onSuccess:function(a){this._stopLoader(),this.loadURL(a),this.trigger("loaded",a)},_onError:function(a){this._stopLoader(),this.$el.addClass("has-error");var b=c('<div class="MapCard-error" />');this.$el.append(b),b.fadeIn(250),this.trigger("error")},_loadImage:function(a,b){var c=this,d=new Image;d.onerror=function(){c._onError(a)},d.onload=function(){c._onSuccess(b)};try{d.src=b}catch(a){this._onError(a)}}})}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],8:[function(a,b,c){(function(a){var c="undefined"!=typeof window?window.cdb:"undefined"!=typeof a?a.cdb:null;c.admin="undefined"!=typeof window?window.cdb.admin:"undefined"!=typeof a?a.cdb.admin:null;var d="undefined"!=typeof window?window.$:"undefined"!=typeof a?a.$:null;b.exports=c.admin.DropdownMenu.extend({className:"CDB-Text Dropdown Dropdown--public",initialize:function(){this.elder("initialize"),this.template_base=c.templates.getTemplate("public_common/user_industries/dropdown_template"),c.god.bind("closeDialogs",this.hide,this)},render:function(){return this.$el.html(this.template_base()),d("body").append(this.el),this},clean:function(){d(this.options.target).unbind("click",this._handleClick),this.constructor.__super__.clean.apply(this)}})}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],9:[function(a,b,c){(function(c){var d="undefined"!=typeof window?window.cdb:"undefined"!=typeof c?c.cdb:null,e=a("./user_industries/dropdown_view"),f="undefined"!=typeof window?window.$:"undefined"!=typeof c?c.$:null;b.exports=d.core.View.extend({events:{"click .js-dropdown-target":"_createDropdown"},_createDropdown:function(a){this.killEvent(a),d.god.trigger("closeDialogs");var b=new e({target:f(a.target),vertical_offset:-10,horizontal_offset:f(a.target).width()-100,horizontal_position:"left",tick:"center"});b.render(),b.on("onDropdownHidden",function(){b.clean()},this),b.open()}})}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./user_industries/dropdown_view":8}],10:[function(a,b,c){(function(a){var c="undefined"!=typeof window?window.cdb:"undefined"!=typeof a?a.cdb:null;"undefined"!=typeof window?window.$:"undefined"!=typeof a?a.$:null;b.exports=c.core.View.extend({events:{"click .js-Navmenu-editLink--more":"_onClickMoreLink"},initialize:function(){this.$metaList=this.$(".js-PublicMap-metaList--mobile"),this.$moreLink=this.$(".js-Navmenu-editLink--more"),this.model.on("change:active",this._toggleMeta,this)},_onClickMoreLink:function(a){this.model.set("active",!this.model.get("active"))},_toggleMeta:function(){this.model.get("active")?(this.$moreLink.html("Less info"),this.$metaList.slideDown(250)):(this.$moreLink.html("More info"),this.$metaList.slideUp(250))}})}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],11:[function(a,b,c){(function(a){var c="undefined"!=typeof window?window.cdb:"undefined"!=typeof a?a.cdb:null;c.admin="undefined"!=typeof window?window.cdb.admin:"undefined"!=typeof a?a.cdb.admin:null;var d="undefined"!=typeof window?window.$:"undefined"!=typeof a?a.$:null;b.exports=c.admin.DropdownMenu.extend({className:"CDB-Text Dropdown",initialize:function(){this.elder("initialize"),this.template_base=c.templates.getTemplate("public_common/user_settings/dropdown_template"),c.god.bind("closeDialogs",this.hide,this)},render:function(){var a=this.model,b=a.viewUrl();return this.$el.html(this.template_base({name:a.get("name")||a.get("username"),email:a.get("email"),isOrgOwner:a.isOrgOwner(),dashboardUrl:b.dashboard(),publicProfileUrl:b.publicProfile(),accountSettingsUrl:b.accountSettings(),logoutUrl:b.logout()})),d("body").append(this.el),this},clean:function(){d(this.options.target).unbind("click",this._handleClick),this.constructor.__super__.clean.apply(this)}})}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],12:[function(a,b,c){(function(c){var d="undefined"!=typeof window?window.cdb:"undefined"!=typeof c?c.cdb:null,e=a("./user_settings/dropdown_view"),f="undefined"!=typeof window?window.$:"undefined"!=typeof c?c.$:null;b.exports=d.core.View.extend({events:{"click .js-dropdown-target":"_createDropdown"},render:function(){var a=this.model.viewUrl().dashboard(),b=a.datasets(),c=a.maps();return this.$el.html(d.templates.getTemplate("public_common/user_settings_template")({avatarUrl:this.model.get("avatar_url"),mapsUrl:c,datasetsUrl:b})),this},_createDropdown:function(a){this.killEvent(a),d.god.trigger("closeDialogs");var b=new e({target:f(a.target),model:this.model,horizontal_offset:18});b.render(),b.on("onDropdownHidden",function(){b.clean()},this),b.open()}})}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./user_settings/dropdown_view":11}],13:[function(a,b,c){(function(b){var c="undefined"!=typeof window?window.$:"undefined"!=typeof b?b.$:null,d="undefined"!=typeof window?window.cdb:"undefined"!=typeof b?b.cdb:null,e=a("./public_common/user_settings_view"),f=a("./public_common/user_industries_view"),g=a("./common/views/mapcard_preview"),h=a("./common/views/likes/view"),i=a("./public_common/user_meta_view");d.editor={PublicExportView:a("./common/dialogs/export/public_export_view"),randomQuote:a("./common/view_helpers/random_quote.js"),ViewFactory:a("./common/view_factory")},c(function(){d.init(function(){d.templates.namespace="cartodb/",d.config.set(window.config),d.config.set("url_prefix",window.base_url);new f({el:c(".js-user-industries")}),new i({el:c(".js-user-meta"),model:new d.core.Model({active:!1})});c(document.body).bind("click",function(){d.god.trigger("closeDialogs")});var a=new d.open.AuthenticatedUser;a.bind("change",function(){if(a.get("username")){var b=new d.admin.User(a.attributes),f=new e({el:c(".js-user-settings"),model:b});f.render(),c(".js-login").hide(),c(".js-learn").show(),b.get("username")===window.owner_username&&(c(".js-edit").css("display","inline-block"),c(".js-oneclick").hide())}}),c(".MapCard").each(function(){var a=c(this).data("visId");if(a){var b=c(this).data("visOwnerName"),e=new g({el:c(this).find(".js-header"),visId:c(this).data("visId"),username:b,mapsApiResource:d.config.getMapsResourceName(b)});e.load()}}),c(".js-likes").each(function(){var b=d.admin.Like.newByVisData({likeable:!1,vis_id:c(this).data("vis-id"),likes:c(this).data("likes-count"),size:c(this).data("likes-size")});a.bind("change",function(){a.get("username")&&(b.bind("loadModelCompleted",function(){b.set("likeable",!0)}),b.fetch())});var e=new h({el:this,model:b});e.render()}),a.fetch()})})}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./common/dialogs/export/public_export_view":2,"./common/view_factory":3,"./common/view_helpers/random_quote.js":4,"./common/views/likes/view":6,"./common/views/mapcard_preview":7,"./public_common/user_industries_view":9,"./public_common/user_meta_view":10,"./public_common/user_settings_view":12}]},{},[13]);
//# sourceMappingURL=new_public_table.js.map
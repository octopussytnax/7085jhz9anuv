/*! v4.7.15 - 2017-05-30 */
function _t(a){return a}cdb.common={},cdb.admin={},cdb.admin.dashboard={},cdb.forms={},cdb.open={},cdb.dashboard={},cdb.config.setUrlVersion=function(a,b,c){cdb.config.set(a+"_"+b+"_url_version",c||"v1")},cdb.config.urlVersion=function(a,b,c){b=b||"";var d=cdb.config.get(a+"_"+b+"_url_version");return d||c||"v1"},cdb.config.prefixUrl=function(){return this.get("url_prefix")||""},cdb.config.prefixUrlPathname=function(){var a=this.prefixUrl();if(""!==a)try{if(a&&a.indexOf("/")===-1)throw new TypeError("invalid URL");var b=document.createElement("a");b.href=a;var c=b.pathname;return c.replace(/\/$/,"")}catch(a){}return a},cdb.config.getMapsResourceName=function(a){var b,c=this.get("maps_api_template");return c&&(b=c.replace(/(http|https)?:\/\//,"").replace(/{user}/g,a)),b};var i18n={format:function(a){for(var b=1;b<arguments.length;++b){var c=arguments[b];for(var d in c)a=a.replace(RegExp("\\{"+d+"\\}","g"),c[d])}return a}};!function(){var a=function(a,b,c){return a&&a[b]?_.isFunction(a[b])?a[b](c):a[b]:null},b=function(){throw new Error('A "url" property or function must be specified')};Backbone.originalSync=Backbone.sync,Backbone.sync=function(c,d,e){var f=e.url||a(d,"url",c)||b(),g=0===f.indexOf("http")||0===f.indexOf("//");return g?e.url=f:e.url=cdb.config.prefixUrl()+f,"read"!==c&&d.surrogateKeys&&Backbone.cachedSync.invalidateSurrogateKeys(a(d,"surrogateKeys")),Backbone.originalSync(c,d,e)},Backbone.currentSync=Backbone.sync,Backbone.withCORS=function(a,b,c){return c||(c={}),c.crossDomain||(c.crossDomain=!0),c.xhrFields||(c.xhrFields={withCredentials:!0}),Backbone.currentSync(a,b,c)},Backbone.cachedSync=function(c,d){if(!c)throw new Error("cachedSync needs a namespace as argument");var e=c,f=window.user_data&&window.user_data.username;if(!f)return Backbone.sync;c+="-"+f;var g="cdb-cache/"+c,h={_keys:function(){return JSON.parse(localStorage.getItem(g)||"{}")},add:function(a){var b=this._keys();b[a]=+new Date,localStorage.setItem(g,JSON.stringify(b))},invalidate:function(){var a=this._keys();_.each(a,function(a,b){localStorage.removeItem(b)}),localStorage.removeItem(g)}},i={setItem:function(a,b){return localStorage.setItem(a,b),h.add(a),this},getItem:function(a,b){var c=localStorage.getItem(a);_.defer(function(){b(c)})},removeItem:function(a){localStorage.removeItem(a),h.invalidate()}},j=function(c,e,f){var h=f.url||a(e,"url")||b(),j=g+"/"+h;if("read"===c){var k=f.success,l=null;f.success=function(a,b,c){l&&c.responseText===l||(i.setItem(j,c.responseText),k(a,b,c))},i.getItem(j,function(a){l=a,a&&k(JSON.parse(a),"success")})}else i.removeItem(j);return(d||Backbone.sync)(c,e,f)};return j.invalidate=function(){h.invalidate()},j.cache=i,Backbone.cachedSync.surrogateKeys[e]=j,j},Backbone.cachedSync.surrogateKeys={},Backbone.cachedSync.invalidateSurrogateKeys=function(a){_.each(a,function(a){var b=Backbone.cachedSync.surrogateKeys[a];b?b.invalidate():cdb.log.debug("surrogate key not found: "+a)})}}(),Backbone.syncAbort=function(){var a=arguments[1];return a._xhr&&a._xhr.abort(),a._xhr=Backbone.sync.apply(this,arguments),a._xhr.always(function(){a._xhr=null}),a._xhr},Backbone.delayedSaveSync=function(a,b){var c=_.debounce(a,b);return function(b,d,e){return"create"===b||"update"===b?c(b,d,e):a(b,d,e)}},Backbone.saveAbort=function(){var a=this;this._saving&&this._xhr&&this._xhr.abort(),this._saving=!0;var b=Backbone.Model.prototype.save.apply(this,arguments);return this._xhr=b,b.always(function(){a._saving=!1}),b},cdb.config.set("assets_url","/assets/4.7.15"),console.log("cartodbui v4.7.15");
//# sourceMappingURL=app.js.map
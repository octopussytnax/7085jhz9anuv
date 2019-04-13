this["JST"] = this["JST"] || {};

this["JST"]["cartodb/common/background_polling/background_polling"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="BackgroundPolling-body CDB-Text CDB-Size-medium">\n  <ul class="BackgroundPolling-list js-list"></ul>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/background_polling/views/analysis/background_analysis_item"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 if (totalAnalyzed === totalItems) { ;
__p += '\n  ';
 if (totalSuccess > 0) { ;
__p += '\n    <div class="ImportItem-text is-completed">\n      We discovered ' +
__e( totalSuccess ) +
' interesting map' +
__e( (totalSuccess === 1) ? '' : 's' ) +
'!\n    </div>\n    <button class="Button Button-importShowDetails js-show_dialog">SHOW</button>\n    ';
 } else {;
__p += '\n    <div class="ImportItem-text is-failed">\n      Sorry, we couldn\'t discover any interesting map.\n    </div>\n    ';
 } ;
__p += '\n  <button class="ImportItem-closeButton js-close">\n    <i class="CDB-IconFont CDB-IconFont-close ImportItem-closeButtonIcon"></i>\n  </button>\n';
 } else { ;
__p += '\n  <div class="ImportItem-text">\n    Analyzing columns (' +
__e( totalAnalyzed ) +
'/' +
__e( totalItems ) +
')\n  </div>\n  <div class="ImportItem-progress">\n    <div class="progress-bar">\n      <span class="bar-2" style="width:' +
__e( progress ) +
'%"></span>\n    </div>\n  </div>\n  <button class="ImportItem-closeButton js-abort">\n    <i class="CDB-IconFont CDB-IconFont-close ImportItem-closeButtonIcon"></i>\n  </button>\n';
 } ;
__p += '\n';

}
return __p
};

this["JST"]["cartodb/common/background_polling/views/background_polling_header"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="BackgroundPolling-headerBadge LayoutIcon">\n  <i class="CDB-IconFont CDB-IconFont-cloud BackgroundPolling-headerBadgeIcon js-icon"></i>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/background_polling/views/background_polling_header_title"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 if (totalPollings === 1) { ;
__p += '\n  ';
 if (imports > 0) { ;
__p += '\n    Connecting\n  ';
 } ;
__p += '\n  ';
 if (geocodings > 0) { ;
__p += '\n    Geocoding\n  ';
 } ;
__p += '\n  ';
 if (analysis > 0) { ;
__p += '\n    Analyzing\n  ';
 } ;
__p += '\n  dataset...\n';
 } else { ;
__p += '\n  Working...\n';
 } ;


}
return __p
};

this["JST"]["cartodb/common/background_polling/views/geocodings/background_geocoding_item"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 if (hasFailed) { ;
__p += '\n  <div class="ImportItem-text is-failed" title="' +
__e( tableName ) +
'">\n    Ouch! Error geocoding ' +
__e( tableName ) +
' layer\n  </div>\n  <button class="Button Button-importShowDetails js-info">SHOW</button>\n  <button class="ImportItem-closeButton js-close">\n    <i class="CDB-IconFont CDB-IconFont-close ImportItem-closeButtonIcon"></i>\n  </button>\n';
 } else if (hasCompleted) { ;
__p += '\n  ';
 if (isLatLngType) { ;
__p += '\n    <div class="ImportItem-text is-completed">\n      Geocoded by latitude and longitude\n    </div>\n  ';
 } else { ;
__p += '\n    <div class="ImportItem-text ' +
__e( realRows > 0 ? 'is-completed' : 'is-alerted' ) +
'" title="' +
__e( tableName ) +
'">\n      ';
 if (realRows === 0) { ;
__p += '\n        No rows geocoded ';
 if (tableName) { ;
__p += 'in ' +
__e( tableName ) +
' dataset';
 } ;
__p += '\n      ';
 } else { ;
__p += '\n        ' +
__e( realRowsFormatted ) +
' ' +
__e( realRowsPluralize ) +
' geocoded ';
 if (tableName) { ;
__p += 'in ' +
__e( tableName ) +
' dataset';
 } ;
__p += '\n      ';
 } ;
__p += '\n    </div>\n    <button type="button" class="Button Button-importShowDetails js-info">SHOW</button>\n  ';
 } ;
__p += '\n  <button class="ImportItem-closeButton js-close">\n    <i class="CDB-IconFont CDB-IconFont-close ImportItem-closeButtonIcon"></i>\n  </button>\n';
 } else { ;
__p += '\n  <div class="ImportItem-text" title="' +
__e( tableName ) +
'">\n    ';
 if (realRows > 0) { ;
__p += '\n      ' +
__e( realRowsFormatted ) +
'/' +
__e( processableRowsFormatted ) +
' ' +
__e( processableRowsPluralize ) +
' geocoded...\n    ';
 } else { ;
__p += '\n      Geocoding ' +
__e( tableName ) +
' dataset...\n    ';
 } ;
__p += '\n  </div>\n  <div class="ImportItem-progress">\n    <div class="progress-bar">\n      <span class="bar-2" style="width:' +
__e( width ) +
'%"></span>\n    </div>\n  </div>\n  ';
 if (canCancel) { ;
__p += '\n    <button class="ImportItem-closeButton js-abort">\n      <i class="CDB-IconFont CDB-IconFont-close ImportItem-closeButtonIcon"></i>\n    </button>\n  ';
 } ;
__p += '\n';
 } ;
__p += '\n';

}
return __p
};

this["JST"]["cartodb/common/background_polling/views/geocodings/geocoding_error_details"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="Dialog-header u-inner">\n  <div class="LayutIcon LayoutIcon--negative Dialog-headerIcon">\n    <i class="CDB-IconFont CDB-IconFont-' +
__e( geometryType && geometryType === "point" ? 'Streets' : 'Globe' ) +
'"></i>\n    <span class="Badge Badge--negative">!</span>\n  </div>\n  <p class="Dialog-headerTitle">Geocoding Error</p>\n  <p class="Dialog-headerText Dialog-headerText--centered Dialog-narrowerContent">\n    ' +
__e( errorDescription || "There was a problem georeferencing your data" ) +
'.\n    ';
 if (!customHosted && id) { ;
__p += '\n      Please try again and if the problem persists, <a href="mailto:support@carto.com?subject=Geocoding error with id:' +
__e( id ) +
'">contact us</a>\n      with the following code: <br/><strong>' +
__e( id ) +
'</strong>.\n    ';
 } ;
__p += '\n  </p>\n</div>\n<div class="Dialog-footer Dialog-footer--simple u-inner Dialog-narrowerContent">\n  <button class="cancel Button Button--secondary ' +
__e( showGeocodingDatasetURLButton ? 'Dialog-footerBtn' : '' ) +
'">\n    <span>close</span>\n  </button>\n  ';
 if (showGeocodingDatasetURLButton) { ;
__p += '\n    <a href="' +
__e( datasetURL ) +
'" class="Button Button--main">\n      <span>view dataset</span>\n    </a>\n  ';
 } ;
__p += '\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/background_polling/views/geocodings/geocoding_in_progress"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="Dialog-header u-inner">\n  <div class="LayoutIcon Dialog-headerIcon">\n    <i class="CDB-IconFont CDB-IconFont-globe"></i>\n  </div>\n  <h3 class="Dialog-headerTitle">Geocoder is already running</h3>\n  <p class="Dialog-headerText Dialog-headerText--centered Dialog-narrowerContent">\n    If you want to georeference using another pattern, please cancel the current one (at the right bottom of your screen) and start again the process...\n  </p>\n</div>\n<div class="Dialog-footer Dialog-footer--simple u-inner Dialog-narrowerContent">\n  <button class="cancel Button Button--secondary">\n    <span>close</span>\n  </button>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/background_polling/views/geocodings/geocoding_no_result_details"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="Dialog-header u-inner">\n  <div class="LayutIcon LayoutIcon--negative Dialog-headerIcon">\n    <i class="CDB-IconFont CDB-IconFont-' +
__e( geometryType && geometryType === "point" ? 'streets' : 'globe' ) +
'"></i>\n    <span class="Badge Badge--negative">!</span>\n  </div>\n  <p class="Dialog-headerTitle">No rows were georeferenced</p>\n  <p class="Dialog-headerText Dialog-headerText--centered Dialog-narrowerContent">\n    These rows contained empty values or perhaps we just didn\'t know what the values meant.\n    We encourage you to take a look and try again.\n  </p>\n</div>\n<div class="Dialog-footer Dialog-footer--simple u-inner Dialog-narrowerContent">\n  <button class="cancel Button Button--secondary ' +
__e( showGeocodingDatasetURLButton ? 'Dialog-footerBtn' : '' ) +
'">\n    <span>close</span>\n  </button>\n  ';
 if (showGeocodingDatasetURLButton) { ;
__p += '\n    <a href="' +
__e( datasetURL ) +
'" class="Button Button--main">\n      <span>view dataset</span>\n    </a>\n  ';
 } ;
__p += '\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/background_polling/views/geocodings/geocoding_success_details"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="Dialog-header u-inner">\n  <div class="LayutIcon LayoutIcon--positive Dialog-headerIcon">\n    <i class="CDB-IconFont CDB-IconFont-' +
__e( geometryType && geometryType === 'point' ? 'streets' : 'globe' ) +
'"></i>\n    <span class="Badge Badge--positive Dialog-headerIconBadge">\n      <i class="CDB-IconFont CDB-IconFont-check"></i>\n    </span>\n  </div>\n  <h3 class="Dialog-headerTitle">Data geocoded</h3>\n  <p class="Dialog-headerText Dialog-headerText--centered Dialog-narrowerContent">\n    We\'ve successfully geocoded ' +
__e( realRowsFormatted ) +
' ' +
__e( geometryTypePluralize ) +
' of ' +
__e( processableRowsFormatted ) +
'.\n  </p>\n</div>\n\n';
 if (processableRows > realRows) { ;
__p += '\n  <div class="Dialog-body Dialog-resultsBody">\n    <span class="Dialog-resultsBodyIcon NavButton ">?</span>\n    <div class="Dialog-resultsBodyTexts">\n      <p class="DefaultParagraph">\n        Rows that are not geocoded could have errors on their column values, or just doesn’t exist in our data.\n        Try geocoding again and check the "override all values" to try again.\n        ';
 if (!googleUser) { ;
__p += '\n          Unsuccessful rows don\'t count against your quota, so we encourage you to take a look and try again.\n        ';
 };
__p += '\n      </p>\n    </div>\n  </div>\n';
 } ;
__p += '\n\n';
 if (!googleUser && hasPrice) { ;
__p += '\n  <div class="Dialog-body Dialog-resultsBody">\n    <div class="Dialog-resultsBodyIcon LayoutIcon ' +
__e( price > 0 ? 'LayoutIcon--warning' :  'LayoutIcon--positive' ) +
'">\n      <span class="CDB-IconFont CDB-IconFont-dollar CDB-IconFont--super"></span>\n    </div>\n    <div class="Dialog-resultsBodyTexts">\n      ';
 if (price > 0) { ;
__p += '\n        <p class="DefaultTitle">\n          <strong>$' +
__e( price / 100 ) +
'</strong> will be charged to your account\n        </p>\n        <p class="DefaultParagraph DefaultParagraph--tertiary">\n          You have consumed all your credits during this billing cycle, price is $' +
__e( blockPrice / 100  ) +
'/1,000 extra credits.\n        </p>\n      ';
 } else { ;
__p += '\n        <p class="DefaultTitle">\n          No extra charges have been done\n        </p>\n        <p class="DefaultParagraph DefaultParagraph--tertiary">\n          You still have ' +
__e( remainingQuotaFormatted ) +
' credits left for this month.\n        </p>\n      ';
 } ;
__p += '\n    </div>\n  </div>\n';
 } ;
__p += '\n\n<div class="Dialog-footer Dialog-footer--simple u-inner Dialog-narrowerContent">\n  <button class="cancel Button Button--secondary ' +
__e( showGeocodingDatasetURLButton ? 'Dialog-footerBtn' : '' ) +
'">\n    <span>close</span>\n  </button>\n  ';
 if (showGeocodingDatasetURLButton) { ;
__p += '\n    <a href="' +
__e( datasetURL ) +
'" class="Button Button--main">\n      <span>view dataset</span>\n    </a>\n  ';
 } ;
__p += '\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/background_polling/views/imports/background_import_item"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 if (failed) { ;
__p += '\n  <div class="ImportItem-text is-failed" title="' +
__e( name ) +
'">\n    Ouch! Error connecting ' +
__e( name ) +
' ';
 if (service) { ;
__p += ' from ' +
__e( service ) +
' ';
 } ;
__p += '\n  </div>\n  <button class="CDB-Button CDB-Button--secondary CDB-Button--small js-show_error"><span class="CDB-Button-Text CDB-Text is-semibold CDB-Size-small">SHOW</span></button>\n  <button class="CDB-Shape js-close">\n    <div class="CDB-Shape-close is-blue is-large"></div>\n  </button>\n';
 } else if (completed && !warnings) { ;
__p += '\n  <div class="ImportItem-text is-completed" title="' +
__e( name ) +
'">\n    ' +
__e( name ) +
' ';
 if (service && service != "twitter_search") { ;
__p += ' from ' +
__e( service ) +
' ';
 } ;
__p += ' completed!\n  </div>\n  ';
 if (showSuccessDetailsButton) { ;
__p += '\n    ';
 if (service && service === "twitter_search") { ;
__p += '\n      <button class="CDB-Button CDB-Button--secondary CDB-Button--small js-show_stats"><span class="CDB-Button-Text CDB-Text is-semibold CDB-Size-small">SHOW</span></button>\n    ';
 } else if (tables_created_count === 1) { ;
__p += '\n\n      <a href="' +
__e( url ) +
'" class="CDB-Button CDB-Button--secondary CDB-Button--small js-show"><span class="CDB-Button-Text CDB-Text is-semibold CDB-Size-small">SHOW</span></a>\n    ';
 } ;
__p += '\n  ';
 } ;
__p += '\n  <button class="CDB-Shape js-close">\n    <div class="CDB-Shape-close is-blue is-large"></div>\n  </button>\n';
 } else if (completed && warnings) { ;
__p += '\n  <div class="ImportItem-text has-warnings" title="' +
__e( name ) +
'">\n    Some warnings were produced for ' +
__e( name ) +
' ';
 if (service) { ;
__p += ' from ' +
__e( service ) +
' ';
 } ;
__p += '\n  </div>\n  <button class="CDB-Button CDB-Button--secondary CDB-Button--small js-show_warnings"><span class="CDB-Button-Text CDB-Text is-semibold CDB-Size-small">SHOW</span></button>\n  <button class="CDB-Shape js-close">\n    <div class="CDB-Shape-close is-blue is-large"></div>\n  </button>\n';
 } else { ;
__p += '\n  <div class="ImportItem-text" title="' +
__e( name ) +
'">\n    <span class="ImportItem-textState">' +
__e( state ) +
'</span> ' +
__e( name ) +
' ';
 if (service && service != "twitter_search") { ;
__p += ' from ' +
__e( service ) +
' ';
 } ;
__p += '\n  </div>\n  <div class="ImportItem-progress">\n    <div class="progress-bar">\n      <span class="bar-2" style="width:' +
__e( progress ) +
'%"></span>\n    </div>\n  </div>\n  ';
 if (state === "uploading" && step === "upload") { ;
__p += '\n    <button class="ImportItem-closeButton js-abort">\n      <i class="CDB-IconFont CDB-IconFont-close ImportItem-closeButtonIcon"></i>\n    </button>\n  ';
 } ;
__p += '\n';
 } ;
__p += '\n';

}
return __p
};

this["JST"]["cartodb/common/background_polling/views/imports/background_import_limit"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="ImportItem-text is-long">\n  ';
 if (isUpgradeable) { ;
__p += '\n    In a hurry? <a href="' +
__e( upgradeUrl ) +
'">Upgrade your account</a> to import several files at a time\n  ';
 } else { ;
__p += '\n    Unfortunately you can only import up to ' +
__e( importQuota ) +
' files at the same time\n  ';
 } ;
__p += '\n</div>';

}
return __p
};

this["JST"]["cartodb/common/background_polling/views/imports/twitter_import_details"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="Dialog-header BackgroundPollingDetails-header TwitterImportDetails-header">\n  <div class="Dialog-headerIcon Dialog-headerIcon--positive">\n    <i class="CDB-IconFont CDB-IconFont-twitter"></i>\n    <span class="Badge Badge--positive Dialog-headerIconBadge">\n      <i class="CDB-IconFont CDB-IconFont-check"></i>\n    </span>\n  </div>\n  <h3 class="Dialog-headerTitle">Your Twitter ' +
__e( type ) +
' is created</h3>\n  <p class="Dialog-headerText">\n    ';
 if (datasetTotalRows === 0) { ;
__p += '\n      Your search query was correct but returned no results, please try with a different set of parameters before running it again\n    ';
 } else { ;
__p += '\n      We\'ve created a new ' +
__e( type ) +
' containing a total of ' +
__e( datasetTotalRowsFormatted ) +
' <br/>tweet' +
__e( datasetTotalRows != 1 ? 's' : '' ) +
' with your search terms\n    ';
 } ;
__p += '\n  </p>\n</div>\n<div class="BackgroundPollingDetails-body">\n  <div class="LayoutIcon BackgroundPollingDetails-icon ' +
__e( tweetsCost > 0 ? 'is-nonFree' : 'is-free' ) +
'">\n    <i class="CDB-IconFont CDB-IconFont-dollar"></i>\n  </div>\n  <div class="BackgroundPollingDetails-info">\n    <h4 class="BackgroundPollingDetails-infoTitle">\n      ';
 if (tweetsCost > 0) { ;
__p += '\n        $' +
__e( tweetsCostFormatted ) +
' will be charged to your account\n      ';
 } else { ;
__p += '\n        No extra charges have been done\n      ';
 } ;
__p += '\n    </h4>\n    <p class="BackgroundPollingDetails-infoText DefaultParagraph">\n      ';
 if (tweetsCost > 0 || availableTweets <= 0) { ;
__p += '\n        You have consumed all your credits during this billing cycle (price is $' +
__e( blockPriceFormatted ) +
'/' +
__e( blockSizeFormatted ) +
' extra credits).\n      ';
 } else { ;
__p += '\n        You still have ' +
__e( availableTweetsFormatted ) +
' credit' +
__e( availableTweets != 1 ? 's' : ''  ) +
' left for this billing cycle.\n      ';
 } ;
__p += '\n    </p>\n  </div>\n</div>\n<div class="Dialog-footer BackgroundPollingDetails-footer">\n  <a href="' +
__e( mapURL ) +
'" class="Button Button--secondary BackgroundPollingDetails-footerButton">\n    <span>view ' +
__e( type ) +
'</span>\n  </a>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/add_custom_basemap/add_custom_basemap"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="Dialog-content Dialog-content--expanded">\n  <div class="Dialog-header Dialog-header--expanded CreateDialog-header">\n    <ul class="CreateDialog-headerSteps">\n      <li class="CreateDialog-headerStep CreateDialog-headerStep--single">\n        <div class="Dialog-headerIcon Dialog-headerIcon--neutral">\n          <i class="CDB-IconFont CDB-IconFont-layerStack"></i>\n        </div>\n        <p class="Dialog-headerTitle">Add a custom basemap</p>\n        <p class="Dialog-headerText">Select from these great resources.</p>\n      </li>\n    </ul>\n  </div>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/add_custom_basemap/mapbox/enter_url"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="ImportPanel">\n  <div class="ImportPanel-header">\n    <h3 class="CDB-Text CDB-Size-large u-mainTextColor u-secondaryTextColor u-bSpace--m">Insert your Mapbox URL</h3>\n  </div>\n  <div class="Form-row">\n    <div class="Form-rowLabel">\n      <label class="Form-label">Enter your map ID/URL</label>\n    </div>\n    <div class="Form-rowData Form-rowData--longer">\n      <input type="text" class="Form-input Form-input--longer js-url" value="' +
__e( url ) +
'" placeholder="E.g. username.ab12cd3">\n    </div>\n  </div>\n  <div class="Form-row">\n    <div class="Form-rowLabel">\n      <label class="Form-label">Enter your access token</label>\n    </div>\n    <div class="Form-rowData Form-rowData--longer">\n      <input type="text" class="Form-input Form-input--longer js-access-token" value="' +
__e( accessToken ) +
'" placeholder="E.g. pk.bfg32ewdsadeyJ1Ijoi…">\n      <div class="Form-inputError js-error ' +
__e( lastErrorMsg ? 'is-visible' : '' ) +
'">' +
__e( lastErrorMsg ) +
'</div>\n    </div>\n  </div>\n</div>\n<div class="Dialog-footer Dialog-footer--withoutBorder u-inner">\n  <button class="Button Button--main Button--inline js-ok is-disabled">\n    <span>Add basemap</span>\n  </button>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/add_custom_basemap/nasa/nasa"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="ImportPanel">\n  <div class="ImportPanel-header">\n    <h3 class="CDB-Text CDB-Size-large u-mainTextColor u-secondaryTextColor u-bSpace--m">Basemaps provided by NASA Worldview</h3>\n    <p class="CDB-Text CDB-Size-medium u-altTextColor u-bSpace--xl ImportPanel-headerDescription">Select a date from which you want a global basemap.</p>\n  </div>\n  <div class="Form-row Form-row--centered">\n    <div class="Form-rowData Form-rowData--short Form-rowData--alignLeft">\n      <div class="Form-rowData Form-rowData--full">\n        <div class="RadioButton js-day">\n          <button type="button" class="RadioButton-input ';
 if (layerType === 'day') { ;
__p += 'is-checked';
 } ;
__p += '"></button>\n          <label class="RadioButton-label" for="nasa-type-day">Day</label>\n        </div>\n      </div>\n      <div class="Form-rowData Form-rowData--full">\n        <div class="RadioButton js-night">\n          <button type="button" class="RadioButton-input ';
 if (layerType === 'night') { ;
__p += 'is-checked';
 } ;
__p += '"/></button>\n          <label class="RadioButton-label" for="nasa-type-night">Night</label>\n        </div>\n      </div>\n    </div>\n    <div class="Form-rowData Form-rowData--short">\n      <div class="js-datePicker" data-title="You can\'t select a date in night mode"></div>\n    </div>\n  </div>\n</div>\n<div class="Dialog-footer Dialog-footer--withoutBorder u-inner">\n  ';
/* ok class == let parent dialog view handle the click event */;
__p += '\n  <button class="Button Button--main Button--inline ok">\n    <span>Add basemap</span>\n  </button>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/add_custom_basemap/tabs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="CreateDialog-listing">\n  <div class="Filters Filters--navListing js-navigation">\n    <div class="u-inner">\n      <div class="Filters-inner">\n        <span class="Filters-separator"></span>\n        <div class="Filters-row Filters-row--centered">\n          <ul class="Filters-group js-tabs">\n            ';
 model.get('tabs').each(function(tab) { ;
__p += '\n              <li class="Filters-typeItem">\n                <button data-name="' +
__e( tab.get('name') ) +
'" class="Filters-typeLink ' +
__e( model.get('currentTab') === tab.get('name') ? 'is-selected' : '' ) +
'">\n                  ' +
__e( tab.get('label') ) +
'\n                </button>\n              </li>\n            ';
 }) ;
__p += '\n          </ul>\n        </div>\n      </div>\n    </div>\n  </div>\n  <div class="js-tab-content"></div>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/add_custom_basemap/tile_json/tile_json"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="ImportPanel">\n  <div class="ImportPanel-header">\n    <h3 class="CDB-Text CDB-Size-large u-mainTextColor u-secondaryTextColor u-bSpace--m">Insert your TileJSON URL</h3>\n  </div>\n  <div class="Form-row">\n    <div class="Form-rowLabel">\n      <label class="Form-label">Enter a URL</label>\n    </div>\n    <div class="Form-rowData Form-rowData--longer">\n      <input type="text" class="Form-input Form-input--longer has-icon js-url" value="" placeholder="E.g. http://domain.com/tiles.json?foo=bar">\n      <i class="CDB-IconFont CDB-IconFont-dribbble Form-inputIcon js-idle"></i>\n      <i class="Spinner Spinner--formIcon Form-inputIcon js-validating" style="display: none;"></i>\n      <div class="Form-inputError js-error"></div>\n    </div>\n  </div>\n</div>\n<div class="Dialog-footer Dialog-footer--withoutBorder u-inner">\n  ';
/* ok class == let parent dialog view handle the click event */;
__p += '\n  <button class="ok Button Button--main Button--inline is-disabled">\n    <span>Add basemap</span>\n  </button>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/add_custom_basemap/wms/enter_url"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="ImportPanel">\n  <div class="ImportPanel-header">\n    <h3 class="CDB-Text CDB-Size-large u-mainTextColor u-secondaryTextColor u-bSpace--m">Insert your WMS/WMTS URL</h3>\n    <p class="CDB-Text CDB-Size-medium u-altTextColor u-bSpace--xl ImportPanel-headerDescription">A list of available layers will be shown below.</p>\n  </div>\n  <div class="Form-row">\n    <div class="Form-rowLabel">\n      <label class="Form-label">Enter a URL</label>\n    </div>\n    <div class="Form-rowData Form-rowData--longer">\n      <input type="text" class="Form-input Form-input--longer has-icon js-url" value="" placeholder="E.g. http://openlayers.org/en/v3.5.0/examples/data/ogcsample.xml">\n      <i class="CDB-IconFont CDB-IconFont-dribbble Form-inputIcon js-idle"></i>\n      <div class="Form-inputError js-error ' +
__e( (layersFetched && layers.length === 0) ? 'is-visible' : '' ) +
'">\n        ';
 if (layersFetched && layers.length === 0) { ;
__p += '\n          The URL is either invalid or contains unsupported projections <a target="_blank" href="https://docs.carto.com/cartodb-editor.html#including-an-external-basemap">(see docs)</a>\n        ';
 } ;
__p += '\n      </div>\n    </div>\n  </div>\n</div>\n<div class="Dialog-footer Dialog-footer--withoutBorder u-inner">\n  <button class="Button Button--main Button--inline js-fetch-layers is-disabled">\n    <span>Get layers</span>\n  </button>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/add_custom_basemap/wms/layer"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="List-rowItem">\n  <div class="DefaultTitle ' +
__e( canSave ? '': 'is-disabled' ) +
'">' +
__e( model.get('title') || model.get('name') ) +
'</div>\n  <button class="js-add Button Button--secondary Button--secondaryTransparentBkg ' +
__e( canSave ? '' : 'is-disabled' ) +
'">\n    <span>Add this</span>\n  </button>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/add_custom_basemap/wms/select_layer"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="u-inner">\n  <div class="Filters WMSSSelectLayer-Filter is-relative">\n    <div class="Filters-inner">\n      <div class="Filters-row">\n        <ul class="Filters-group">\n          <li class="Filters-typeItem Filters-typeItem--searchEnabler">\n            <a href="#/search" class="Filters-searchLink js-search-link">\n              <i class="Filters-searchLinkIcon CDB-IconFont CDB-IconFont-lens"></i>Search\n            </a>\n          </li>\n          <li class="Filters-typeItem Filters-typeItem--searchField">\n            <form class="Filters-searchForm js-search-form" action="#">\n              <input class="Filters-searchInput js-search-input" type="text" value="' +
__e( searchQuery ) +
'" placeholder="' +
__e( layersFound.length ) +
' ' +
__e( pluralizeStr('layer', 'layers', layersFound.length) ) +
' found, ' +
__e( layersAvailableCount ) +
' ' +
__e( pluralizeStr('layer', 'layers', layersAvailableCount) ) +
' available" />\n              <button type="button" class="Filters-cleanSearch js-clean-search u-actionTextColor">\n                <i class="CDB-IconFont CDB-IconFont-close"></i>\n              </button>\n            </form>\n          </li>\n        </ul>\n        <span class="Filters-separator"></span>\n      </div>\n    </div>\n  </div>\n  <ul class="List js-layers"></ul>\n\n  ';
 if (searchQuery && layersFound.length == 0) { ;
__p += '\n  <div class="IntermediateInfo">\n    <div class="LayoutIcon">\n      <i class="CDB-IconFont CDB-IconFont-defaultUser"></i>\n    </div>\n    <h4 class="CDB-Text CDB-Size-large u-mainTextColor u-secondaryTextColor u-bSpace--m u-tSpace-xl">Oh! No results</h4>\n    <p class="CDB-Text CDB-Size-medium u-altTextColor">\n      Unfortunately we couldn\'t found any layer that matched your search term\n    </p>\n  </div>\n</div>\n';
 } ;
__p += '\n\n<button class="NavButton Dialog-backBtn js-back">\n  <i class="CDB-IconFont CDB-IconFont-arrowPrev"></i>\n</button>\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/add_custom_basemap/xyz/xyz"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="ImportPanel">\n  <div class="ImportPanel-header">\n    <h3 class="CDB-Text CDB-Size-large u-mainTextColor u-secondaryTextColor u-bSpace--m">Insert your XYZ URL</h3>\n  </div>\n  <div class="Form-row">\n    <div class="Form-rowLabel">\n      <label class="Form-label">Enter a URL</label>\n    </div>\n    <div class="Form-rowData Form-rowData--longer">\n      <input type="text" class="Form-input Form-input--longerMorePadding has-icon XYZPanel-input js-url" value="" placeholder="E.g. https://{s}.carto.com/foobar/{z}/{x}/{y}.png">\n      <i class="Spinner XYZPanel-inputIcon XYZPanel-inputIcon--loader Spinner--formIcon Form-inputIcon js-validating" style="display: none;"></i>\n      <div class="Checkbox XYZPanel-inputCheckbox js-tms" data-title="Inverts Y axis numbering for tiles">\n        <button class="Checkbox-input"></button>\n        <label class="Checkbox-label">TMS</label>\n      </div>\n      <div class="Form-inputError js-error"></div>\n    </div>\n  </div>\n</div>\n<div class="Dialog-footer Dialog-footer--withoutBorder u-inner">\n  ';
/* ok class == let parent dialog view handle the click event */;
__p += '\n  <button class="Button Button--main Button--inline ok is-disabled">\n    <span>Add basemap</span>\n  </button>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/add_group_users/add_group_users"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="CDB-Text Dialog-content Dialog-content--expanded">\n  <div class="Dialog-header Dialog-header--expanded CreateDialog-header">\n    <ul class="CreateDialog-headerSteps">\n      <li class="CreateDialog-headerStep CreateDialog-headerStep--single">\n        <div class="Dialog-headerIcon Dialog-headerIcon--neutral">\n          <i class="CDB-IconFont CDB-IconFont-boss"></i>\n        </div>\n        <p class="Dialog-headerTitle">Add users to this group</p>\n        <p class="Dialog-headerText">When sharing a dataset or map with a group all the users within that group will get the same permissions.</p>\n      </li>\n    </ul>\n  </div>\n  <div class="CDB-Text js-dlg-body"></div>\n\n  <div class="Dialog-stickyFooter">\n    <div class="Dialog-footer ChangePrivacy-shareFooter u-inner">\n      <div></div>\n      <button class="CDB-Button CDB-Button--primary ok is-disabled">\n        <span class="CDB-Button-Text CDB-Text is-semibold CDB-Size-small u-upperCase">Add users</span>\n      </button>\n    </div>\n  </div>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/api_call"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="CDB-Text Dialog-header u-inner">\n  <div class="Dialog-headerIcon Dialog-headerIcon--neutral Dialog-headerIcon--small">\n    <i class="CDB-IconFont CDB-IconFont-markup"></i>\n  </div>\n  <p class="Dialog-headerTitle">Query this table</p>\n  <p class="Dialog-headerText">Using the <a href="https://docs.carto.com/cartodb-platform/sql-api.html" target="_blank">CARTO SQL API</a> you can perform any SQL query to either yours or other users tables.</p>\n</div>\n\n<div class="Dialog-body Dialog-body--tall u-inner OptionCards">\n  <code class="OptionCard OptionCard--static OptionCard--code OptionCard--codeRequest">\n    <pre>' +
__e( url ) +
'?q=' +
__e( sql ) +
'</pre>\n  </code>\n  <code class="OptionCard OptionCard--static OptionCard--code OptionCard--codeResult">\n    <pre>{\n  rows: [';
 _.each(rows, function(row, i) { ;
__p += '\n    {';
 var j = 0 ;

 _.each(row.attributes, function(val, key) { ;
__p += '\n      "' +
__e( key ) +
'": "' +
__e( val ) +
'"';
 if (j !== _.size(row.attributes)-1) { ;
__p += ',';
 } ;

 j++ ;

 }) ;
__p += '\n    }';
 if (i !== rows.length-1) { ;
__p += ',';
 } ;

 }) ;
__p += '\n  }],\n  time: 0.013,\n  fields: {';
 _.each(schema, function(field, i) { ;
__p += '\n    "' +
__e( field[0] ) +
'": { "type": "' +
__e( field[1] ) +
'" }';
 if (i !== schema.length-1) { ;
__p += ',';
 } ;

 }) ;
__p += '\n  },\n  total_rows: 20\n}</pre>\n    <div class="OptionCard-shadow"></div>\n  </code>\n</div>\n\n<div class="Dialog-footer Dialog-footer--simple u-inner">\n  <button class="CDB-Text CDB-Button CDB-Button--secondary u-upperCase CDB-Size-medium cancel">\n    <span>Close</span>\n  </button>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/builder_features_warning/template"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="Dialog-header u-inner">\n  <div class="Dialog-headerIcon Dialog-headerIcon--alert">\n    <i class="CDB-IconFont CDB-IconFont-question"></i>\n  </div>\n  <p class="Dialog-headerTitle">\n    WAIT! This map contains new Builder features that are not supported in the Editor\n  </p>\n  <p class="Dialog-headerText">\n    If you continue, the map may not display correctly and some features will not be available.<br />\n    It is recommended that you use Builder to edit and build maps.<br />\n    To enable Builder again, please <a href="mailto:support@carto.com">contact us</a>.\n  </p>\n</div>\n<div class="Dialog-footer Dialog-footer--simple u-inner">\n  <button class="Button Button--secondary Dialog-footerBtn cancel">\n    <span>Back to dashboard</span>\n  </button>\n  <button class="js-ok Button Button--main">\n    <span>Continue</span>\n  </button>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/change_lock/templates/dashboard"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="Dialog-header u-inner">\n  <div class="Dialog-headerIcon Dialog-headerIcon--' +
__e( positiveOrNegativeStr ) +
'">\n    <i class="CDB-IconFont ' +
__e( areLocked ? 'CDB-IconFont-unlock' : 'CDB-IconFont-lock' ) +
'"></i>\n    ';
 if (itemsCount > 1) { ;
__p += '\n      <span class="Badge Badge--' +
__e( positiveOrNegativeStr ) +
' Dialog-headerIconBadge CDB-Text CDB-Size-small ">' +
__e( itemsCount ) +
'</span>\n    ';
 } ;
__p += '\n  </div>\n  <h3 class="CDB-Text CDB-Size-large u-mainTextColor u-secondaryTextColor u-bSpace--m u-tSpace-xl">\n    You are about to ' +
__e( lockOrUnlockStr ) +
' ' +
__e( itemsCount ) +
' ' +
__e( contentTypePluralized ) +
'.\n  </h3>\n  <p class="CDB-Text CDB-Size-medium u-altTextColor">\n    ';
 if (areLocked) { ;
__p += '\n      Unlocking ' +
__e( thisOrTheseStr ) +
' ' +
__e( contentTypePluralized ) +
' will show ' +
__e( itOrThemStr ) +
' on the dashboard again.\n    ';
 } else { ;
__p += '\n      Locking ' +
__e( thisOrTheseStr ) +
' ' +
__e( contentTypePluralized ) +
' will hide ' +
__e( itOrThemStr ) +
' from the dashboard. Reveal ' +
__e( itOrThemStr ) +
' using the header menu or the bottom link.\n    ';
 } ;
__p += '\n  </p>\n</div>\n<div class="Dialog-footer Dialog-footer--simple u-inner">\n  <button class="CDB-Button CDB-Button--secondary cancel">\n    <span class="CDB-Button-Text CDB-Text is-semibold CDB-Size-small u-upperCase">cancel</span>\n  </button>\n  <button class="js-ok CDB-Button CDB-Button--primary CDB-Button--' +
__e( positiveOrNegativeStr ) +
' u-lSpace--xl">\n    <span class="CDB-Button-Text CDB-Text is-semibold CDB-Size-small u-upperCase">Ok, ' +
__e( lockOrUnlockStr ) +
'</span>\n  </button>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/change_lock/templates/unlock_to_editor"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="Dialog-header u-inner">\n  <div class="Dialog-headerIcon Dialog-headerIcon--positive">\n    <i class="CDB-IconFont CDB-IconFont-unlock"></i>\n    ';
 if (itemsCount > 1) { ;
__p += '\n    <span class="Badge Badge--positive Dialog-headerIconBadge">' +
__e( itemsCount ) +
'</span>\n    ';
 } ;
__p += '\n  </div>\n  <p class="Dialog-headerTitle">\n    ';
 if (isOwner) { ;
__p += '\n    Your ' +
__e( contentTypePluralized ) +
' ' +
__e( model.get('items').at(0).get('name') ) +
' is locked.\n    ';
 } else { ;
__p += '\n    The ' +
__e( contentTypePluralized ) +
' ' +
__e( model.get('items').at(0).get('name') ) +
' was locked by ' +
__e( ownerName ) +
'.\n    ';
 } ;
__p += '\n  </p>\n  <p class="Dialog-headerText">That means you need to unlock it before doing anything. Are you sure?</p>\n</div>\n<div class="Dialog-footer Dialog-footer--simple u-inner">\n  <button class="Button Button--secondary Dialog-footerBtn cancel">\n    <span>Back to dashboard</span>\n  </button>\n  <button class="js-ok Button Button--main">\n    <span>Ok, unlock</span>\n  </button>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/change_privacy/share/details"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 if (avatarUrl) { ;
__p += '\n  <div class="UserAvatar ChangePrivacy-shareListItemIcon ';
 if (willRevokeAccess) { ;
__p += 'is-error';
 } ;
__p += '">\n    <img src="' +
__e( avatarUrl ) +
'" class="UserAvatar-img UserAvatar-img--medium ';
 if (willRevokeAccess) { ;
__p += 'is-error';
 } ;
__p += '" />\n  </div>\n';
 } else { ;
__p += '\n  <div class="LayoutIcon ChangePrivacy-shareListItemIcon ';
 if (willRevokeAccess) { ;
__p += 'LayoutIcon--negative ';
 } ;
__p += '">\n    <i class="CDB-IconFont CDB-IconFont-people CDB-IconFont--super"></i>\n  </div>\n';
 } ;
__p += '\n<div>\n  <div class="CDB-Text DefaultTitle CDB-Size-medium is-semibold u-ellipsLongText">\n    ' +
__e( title ) +
'\n    ';
 if (roleLabel) { ;
__p += '\n      <span class="UserRoleIndicator CDB-Text CDB-Size-small is-semibold u-upperCase u-altTextColor u-lSpace ' +
__e( roleLabel ) +
'">' +
__e( roleLabel ) +
'</span>\n    ';
 } ;
__p += '\n  </div>\n  <p class="CDB-Text u-tSpace--m DefaultDescription CDB-Size-medium u-ellipsLongText ';
 if (willRevokeAccess) { ;
__p += 'DefaultDescription--error';
 } ;
__p += '">\n    ' +
__e( desc ) +
'\n  </p>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/change_privacy/share/permission_toggler"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="CDB-Text Toggler ChangePrivacy-shareListItemToggler ';
 if (!canChangeAccess) { ;
__p += 'is-disabled';
 } ;
__p += ' js-toggler">\n  <input type="checkbox" id="' +
__e( cid ) +
'" class="js-input"\n      ';
 if (hasAccess) { ;
__p += 'checked="checked"';
 } ;
__p += '\n      ';
 if (!canChangeAccess) { ;
__p += 'disabled="disabled"';
 } ;
__p += '\n    />\n  <label for="' +
__e( cid ) +
'" />\n</div>\n<span class="CDB-Text CDB-Size-medium DefaultDescription">' +
__e( label ) +
'</span>\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/change_privacy/share/share_footer"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="Dialog-stickyFooter">\n  <div class="Dialog-footer ChangePrivacy-shareFooter u-inner">\n    <button class="cancel CDB-Button CDB-Button--secondary">\n      <span class="CDB-Button-Text CDB-Text is-semibold CDB-Size-small u-upperCase">cancel</span>\n    </button>\n    <button class="ok CDB-Button CDB-Button--primary">\n      <span class="CDB-Button-Text CDB-Text is-semibold CDB-Size-small u-upperCase">Save settings</span>\n    </button>\n  </div>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/change_privacy/share/share_header"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="CDB-Text Dialog-header Dialog-header--expanded u-inner">\n  <button class="Dialog-backBtn js-back u-actionTextColor">\n    <i class="CDB-IconFont CDB-IconFont-arrowPrev"></i>\n  </button>\n\n  <div class="Dialog-headerIcon Dialog-headerIcon--neutral">\n    <i class="CDB-IconFont CDB-IconFont-unlock"></i>\n  </div>\n  <p class="Dialog-headerTitle u-ellipsLongText">' +
__e( name ) +
' privacy</p>\n  <p class="Dialog-headerText">Select your colleagues you want to give access in the list below</p>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/change_privacy/start"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="CDB-Text Dialog-header u-inner">\n  <div class="Dialog-headerIcon Dialog-headerIcon--neutral">\n    <i class="CDB-IconFont CDB-IconFont-unlock"></i>\n  </div>\n  <h4 class="CDB-Text CDB-Size-large u-mainTextColor u-secondaryTextColor u-bSpace--m u-tSpace-xl">' +
__e( vis.get('name') ) +
' privacy</h4>\n  <p class="CDB-Text CDB-Size-medium u-altTextColor">\n    Although we believe in the power of open data, you can also protect your ' +
__e( vis.isVisualization() ? 'map' : 'dataset' ) +
'.\n  </p>\n</div>\n<div class="CDB-Text Dialog-body u-inner OptionCards">\n  ';
 privacyOptions.each(function(m, index) { ;
__p += '\n    <div class="OptionCard OptionCard--blocky ' +
__e( m.classNames() ) +
' js-option" data-index="' +
__e( index ) +
'">\n      <div class="OptionCard-icon IllustrationIcon IllustrationIcon--' +
__e( m.get('illustrationType') ) +
'">\n        <i class="CDB-IconFont CDB-IconFont-' +
__e( m.get('iconFontType') ) +
'"></i>\n      </div>\n      <h5 class="OptionCard-title OptionCard-title CDB-Text CDB-Size-large">' +
__e( m.get('title') ) +
'</h5>\n      ';
 if (m.get('privacy') == 'PASSWORD') { ;
__p += '\n        <input class="js-password-input Input ChangePrivacy-passwordInput CDB-Text CDB-Size-medium u-altTextColor" placeholder="Type your password here" value="' +
__e( password ) +
'" type="password" />\n      ';
 } else { ;
__p += '\n      <div class="OptionCard-desc CDB-Text CDB-Size-medium u-altTextColor">' +
__e( m.get('desc') ) +
'</div>\n      ';
 } ;
__p += '\n    </div>\n  ';
 }); ;
__p += '\n</div>\n\n';
 if (showUpgradeBanner) { ;
__p += '\n  <div class="CDB-Text Dialog-body u-inner ChangePrivacy-upgradeBanner">\n    <div class="UpgradeElement ChangePrivacy-upgradeBannerInner">\n      <div class="UpgradeElement-info">\n        <p class="UpgradeElement-infoText u-ellipsLongText">To get advantage of all the privacy options you should upgrade your plan</p>\n      </div>\n      <div class="UpgradeElement-actions">\n        ';
 if (showTrial) { ;
__p += '\n          <div class="UpgradeElement-trial">\n            <i class="CDB-IconFont CDB-IconFont-gift UpgradeElement-trialIcon"></i>\n            <p class="UpgradeElement-trialText u-ellipsLongText">14 days Free trial</p>\n          </div>\n        ';
 } ;
__p += '\n        <a href="' +
__e( upgradeUrl ) +
'" class="Button Button--secondary UpgradeElement-button ChangePrivacy-upgradeActionButton">\n          <span>upgrade</span>\n        </a>\n      </div>\n    </div>\n  </div>\n';
 } ;
__p += '\n\n';
 if (showShareBanner) { ;
__p += '\n  ';
 if (sharedEntitiesCount > 0) { ;
__p += '\n    <div class="CDB-Text Dialog-body u-inner ChangePrivacy-shareBanner Dialog-affectedEntities">\n      <div class="Dialog-affectedEntities">\n        <div class="LayoutIcon ChangePrivacy-shareBannerIcon">\n          <i class="CDB-IconFont CDB-IconFont-people CDB-IconFont--super"></i>\n          <span class="Badge Dialog-headerIconBadge">' +
__e( sharedEntitiesCount ) +
'</span>\n        </div>\n        <div class="DefaultParagraph DefaultParagraph--secondary">\n          ';
 if (sharedWithOrganization) { ;
__p += '\n            Shared with your whole organization.\n          ';
 } else { ;
__p += '\n            Shared with ' +
__e( sharedEntitiesCount ) +
' ' +
__e( personOrPeopleStr ) +
'.\n          ';
 } ;
__p += '\n          <a href="#" class="js-share">Open sharing settings</a>\n        </div>\n      </div>\n      <div class="u-flex">\n        ';
 sharedEntitiesSample.forEach(function(user) { ;
__p += '\n          <span class="UserAvatar Dialog-sharedEntitiesAvatar u-lSpace--xl">\n            ';
 if (user.get('avatar_url')) { ;
__p += '\n              <img class="UserAvatar-img UserAvatar-img--medium" src="' +
__e( user.get('avatar_url') ) +
'" alt="' +
__e( user.get('name') || user.get('username') ) +
'" title="' +
__e( user.get('name') || user.get('username') ) +
'" />\n            ';
 } else { ;
__p += '\n              <div class="UserAvatar-img UserAvatar-img--medium UserAvatar-img--no-src" title="' +
__e( user.get('name') || user.get('username') ) +
'"></div>\n            ';
 } ;
__p += '\n          </span>\n        ';
 }); ;
__p += '\n        ';
 if (sharedEntitiesCount > sharedEntitiesSampleCount) { ;
__p += '\n          <div class="UserAvatar Dialog-sharedEntitiesAvatar">\n            <span class="UserAvatar-img UserAvatar-img--medium UserAvatar--moreItems" />\n          </div>\n        ';
 } ;
__p += '\n      </div>\n    </div>\n  ';
 } else { ;
__p += '\n    <div class="Dialog-body u-inner ChangePrivacy-shareBanner">\n      <div class="LayoutIcon ChangePrivacy-shareBannerIcon">\n        <i class="CDB-IconFont CDB-IconFont-people CDB-IconFont--super"></i>\n      </div>\n      <div class="DefaultParagraph DefaultParagraph--secondary CDB-Text CDB-Size-medium">Team work is always better. <a href="#" class="js-share">Share it with your colleagues</a></div>\n    </div>\n  ';
 } ;
__p += '\n';
 } ;
__p += '\n\n<div class="CDB-Text Dialog-footer Dialog-footer--simple u-inner ChangePrivacy-startFooter">\n  <button class="CDB-Button CDB-Button--secondary cancel">\n    <span class="CDB-Button-Text CDB-Text is-semibold CDB-Size-small u-upperCase">Cancel</span>\n  </button>\n  <button class="ok u-lSpace--xl CDB-Button CDB-Button--primary ' +
__e( saveBtnClassNames ) +
'">\n    <span class="CDB-Button-Text CDB-Text is-semibold CDB-Size-small u-upperCase">Save settings</span>\n  </button>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/confirm_delete_slide"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="Dialog-header u-inner">\n  <div class="Dialog-headerIcon Dialog-headerIcon--negative">\n    <i class="CDB-IconFont CDB-IconFont-trash"></i>\n  </div>\n  <p class="Dialog-headerTitle">You are about to delete a slide</p>\n  <p class="Dialog-headerText">The deleted slide cannot be recovered, be sure before proceeding.</p>\n</div>\n\n<div class="Dialog-footer Dialog-footer--simple u-inner">\n  <div class="Dialog-footerContent MapsList-footer">\n    <button class="Button Button--secondary Dialog-footerBtn cancel">\n      <span>cancel</span>\n    </button>\n    <button class="Button Button--negative ok">\n      <span>Ok, delete</span>\n    </button>\n  </div>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/confirm_edit_geom"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="Dialog-header u-inner">\n  <div class="Dialog-headerIcon Dialog-headerIcon--alert">\n    <i class="CDB-IconFont CDB-IconFont-question"></i>\n  </div>\n  <p class="Dialog-headerTitle">This geometry is too big to edit from the web</p>\n  <p class="Dialog-headerText">\n    Editing this geometry could freeze or crash your browser, and you could lose your work.\n    We encourage you to edit this feature through the API.\n  </p>\n</div>\n\n<div class="Dialog-footer Dialog-footer--simple u-inner">\n  <button class="Button Button--secondary Dialog-footerBtn cancel">\n    <span>cancel</span>\n  </button>\n  <button class="Button Button--alert ok">\n    <span>Ok, continue</span>\n  </button>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/confirm_gmaps_basemap_to_leaflet_conversion"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="Dialog-header u-inner">\n  <div class="Dialog-headerIcon Dialog-headerIcon--alert">\n    <i class="CDB-IconFont CDB-IconFont-question"></i>\n  </div>\n  <p class="Dialog-headerTitle">We are removing the support for Google Maps</p>\n  <p class="Dialog-headerText">\n    Since this visualization uses a Google Maps basemap, if you proceed we\'ll automatically change your basemap to an equivalent one provided by Leaflet.\n    Click \'cancel\' to go back to your dashboard without changing anything.\n  </p>\n  <p class="Dialog-headerText">\n    If you have any questions regarding this change, please contact us at <a href=\'mailto:support@carto.com\'>support@carto.com</a>\n  </p>\n</div>\n\n<div class="Dialog-footer Dialog-footer--simple u-inner">\n  <button class="Button Button--secondary Dialog-footerBtn cancel">\n    <span>cancel</span>\n  </button>\n  <button class="Button Button--alert ok">\n    <span>Ok, proceed</span>\n  </button>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/confirm_rename_dataset"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="Dialog-header u-inner">\n  <div class="Dialog-headerIcon Dialog-headerIcon--alert">\n    <i class="CDB-IconFont CDB-IconFont-question"></i>\n  </div>\n  <p class="Dialog-headerTitle">Renaming dataset will affect your API calls</p>\n  <p class="Dialog-headerText">If you are accessing this dataset via API don\'t forget to use the new name in your API calls afterwards.</p>\n</div>\n\n<div class="Dialog-footer Dialog-footer--simple u-inner">\n  <button class="Button Button--secondary Dialog-footerBtn cancel">\n    <span>cancel</span>\n  </button>\n  <button class="Button Button--alert ok">\n    <span>Ok, rename</span>\n  </button>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/confirm_type_change"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="Dialog-header u-inner">\n  <div class="Dialog-headerIcon Dialog-headerIcon--alert">\n    <i class="CDB-IconFont CDB-IconFont-question"></i>\n  </div>\n  <p class="Dialog-headerTitle">' +
__e( title ) +
'</p>\n  <p class="Dialog-headerText">' +
__e( description ) +
'</p>\n</div>\n\n<div class="Dialog-footer Dialog-footer--simple u-inner">\n  <button class="Button Button--secondary Dialog-footerBtn cancel">\n    <span>cancel</span>\n  </button>\n  <button class="Button Button--alert ok">\n    <span>ok, change it</span>\n  </button>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/create/footer/guessing_toggler"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 if (importState !== "twitter") { ;
__p += '\n  <div class="js-toggle Checkbox CDB-Text CDB-Size-medium u-altTextColor">\n    <button class="Checkbox-input ' +
__e( isGuessingEnabled ? 'is-checked' : '' ) +
'"></button>\n    <label class="Checkbox-label CDB-Text CDB-Size-medium u-altTextColor">Let CARTO automatically guess data types and content on import.</label>\n  </div>\n';
 } else if (!customHosted) { ;
__p += '\n  <p class="CDB-Text CDB-Size-medium u-altTextColor">\n    To get access to historical data (older than 30 days) you need to <a href="mailto:support@carto.com">contact our team</a>\n  </p>\n';
 } ;
__p += '\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/create/footer/privacy_toggler_template"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 if (canUpgrade) { ;
__p += '\n  <a href="' +
__e( upgradeUrl ) +
'" class="PrivacyToggler js-toggler PrivacyToggler--' +
__e( privacy ) +
' is-disabled" data-title="You cannot change the privacy of your new datasets. Click here to upgrade your account.">\n    <i class="CDB-IconFont CDB-IconFont-' +
__e( icon ) +
'"></i>\n  </a>\n';
 } else {;
__p += '\n  <button type="button" class="PrivacyToggler js-toggler PrivacyToggler--' +
__e( privacy ) +
' ' +
__e( isDisabled ? 'is-disabled' : '' ) +
'"\n    data-title="\n      ';
 if (!isDisabled) { ;
__p += '\n      Your new dataset will be ' +
__e( privacy.toLowerCase() ) +
'.<br />Click to change it to ' +
__e( nextPrivacy.toLowerCase() ) +
'\n      ';
 } else { ;
__p += '\n        You cannot change the privacy of your new datasets.\n      ';
 } ;
__p += '\n    ">\n    <i class="CDB-IconFont CDB-IconFont-' +
__e( icon ) +
'"></i>\n  </button>\n';
 } ;
__p += '\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/create_vis_first/template"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="Dialog-header u-inner">\n  <div class="Dialog-headerIcon Dialog-headerIcon--positive">\n    <i class="CDB-IconFont CDB-IconFont-map"></i>\n  </div>\n  <p class="Dialog-headerTitle">' +
__e( title ) +
'</p>\n  <p class="Dialog-headerText">' +
__e( explanation ) +
'</p>\n</div>\n\n<div class="Dialog-footer Dialog-footer--simple u-inner">\n  <button class="Button Button--secondary Dialog-footerBtn cancel">\n    <span>cancel</span>\n  </button>\n  <button class="Button Button--positive ok">\n    <span>Ok, create map</span>\n  </button>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/delete_column/template"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="Dialog-header u-inner">\n  <div class="Dialog-headerIcon Dialog-headerIcon--negative">\n    <i class="CDB-IconFont CDB-IconFont-trash"></i>\n  </div>\n  <p class="Dialog-headerTitle">You are about to delete the \'' +
__e( column ) +
'\' column</p>\n  <p class="Dialog-headerText">Are you sure you want to delete it?</p>\n</div>\n<div class="Dialog-footer Dialog-footer--simple u-inner">\n  <button class="Button Button--secondary Dialog-footerBtn cancel">\n    <span>cancel</span>\n  </button>\n  <button class="Button Button--negative ok">\n    <span>Ok, delete</span>\n  </button>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/delete_items_view_template"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="CDB-Text Dialog-header u-inner">\n  <div class="Dialog-headerIcon Dialog-headerIcon--negative">\n    <i class="CDB-IconFont CDB-IconFont-trash"></i>\n    <span class="Badge Badge--negative Dialog-headerIconBadge CDB-Text CDB-Size-small">' +
__e( selectedCount ) +
'</span>\n  </div>\n  <h4 class="CDB-Text CDB-Size-large u-mainTextColor u-secondaryTextColor u-bSpace--m u-tSpace-xl">\n    ';
 if (selectedCount > 1) { ;
__p += '\n    You are about to delete ' +
__e( selectedCount ) +
' ' +
__e( pluralizedContentType ) +
'.\n    ';
 } else { ;
__p += '\n    You are about to delete the ' +
__e( firstItemName ) +
' ' +
__e( pluralizedContentType ) +
'.\n    ';
 } ;
__p += '\n  </h4>\n  <p class="CDB-Text CDB-Size-medium u-altTextColor">\n    ';
 if (affectedVisCount > 0) { ;
__p += '\n      Doing so will imply changes in <strong>' +
__e( affectedVisCount ) +
' affected ' +
__e( pluralizedMaps ) +
'</strong>.\n    ';
 } ;
__p += '\n    The deleted ' +
__e( pluralizedContentType ) +
' cannot be recovered, be sure before proceeding.\n  </p>\n  ';
 if (isDatasets) { ;
__p += '\n    <p class="CDB-Text CDB-Size-medium u-altTextColor">We recommend you to export your dataset before deleting it.</p>\n  ';
 } ;
__p += '\n</div>\n\n';
 if (affectedVisCount > 0) { ;
__p += '\n  <ul class="Dialog-body MapsList MapsList--centerItems is-singleRow">\n    ';
 visibleAffectedVis.forEach(function(vis) { ;
__p += '\n      <li class="MapsList-item MapsList-item--woTopBottomMargins">\n        <div class="MapCard" data-vis-id="' +
__e( vis.visId ) +
'" data-vis-owner-name="' +
__e( vis.ownerName ) +
'">\n          <a href="' +
__e( vis.url ) +
'" target="_blank" class="MapCard-header MapCard-header--compact js-header">\n            <div class="MapCard-loader"></div>\n          </a>\n          <div class="MapCard-content MapCard-content--compact">\n            <div class="MapCard-contentBody">\n              <div class="MapCard-contentBodyRow MapCard-contentBodyRow--flex">\n                <h3 class="CDB-Text CDB-Size-medium u-bSpace u-ellipsis u-actionTextColor">\n                  <a href="' +
__e( vis.url ) +
'" target="_blank" title="' +
__e( vis.name ) +
'">' +
__e( vis.name ) +
'</a>\n                </h3>\n                ';
 if (vis.showPermissionIndicator) { ;
__p += '\n                  <span class="CDB-Text PermissionIndicator"></span>\n                ';
 } ;
__p += '\n              </div>\n              <p class="MapCard-contentBodyTimeDiff DefaultTimeDiff CDB-Text CDB-Size-small u-altTextColor">\n                ' +
__e( vis.timeDiff ) +
'\n                ';
 if (!vis.isOwner) { ;
__p += '\n                  by <span class="UserAvatar">\n                    <img class="UserAvatar-img UserAvatar-img--smaller" src="' +
__e( vis.owner.get('avatar_url') ) +
'" alt="' +
__e( vis.owner.nameOrUsername()  ) +
'" title="' +
__e( vis.owner.nameOrUsername() ) +
'" />\n                  </span>\n                ';
 } ;
__p += '\n              </p>\n            </div>\n          </div>\n        </div>\n      </li>\n    ';
 }); ;
__p += '\n  </ul>\n';
 } ;
__p += '\n\n';
 if (affectedEntitiesCount > 0) { ;
__p += '\n  <div class="Dialog-body Dialog-affectedEntities">\n    <p class="DefaultParagraph CDB-Text CDB-Size u-altTextColor">Some users will lose access to your ' +
__e( pluralizedContentType ) +
'</p>\n    <div class="u-flex">\n      ';
 affectedEntitiesSample.forEach(function(user) { ;
__p += '\n        <span class="UserAvatar is-in-list">\n          ';
 if (user.get('avatar_url')) { ;
__p += '\n            <img class="UserAvatar-img UserAvatar-img--medium" src="' +
__e( user.get('avatar_url') ) +
'" alt="' +
__e( user.get('name') || user.get('username') ) +
'" title="' +
__e( user.get('name') || user.get('username') ) +
'" />\n          ';
 } else { ;
__p += '\n            <div class="UserAvatar-img UserAvatar-img--medium UserAvatar-img--no-src" title="' +
__e( user.get('name') || user.get('username') ) +
'"></div>\n          ';
 } ;
__p += '\n        </span>\n      ';
 }); ;
__p += '\n      ';
 if (affectedEntitiesCount > affectedEntitiesSampleCount) { ;
__p += '\n        <div class="UserAvatar is-in-list">\n          <span class="UserAvatar-img UserAvatar-img--medium UserAvatar--moreItems" />\n        </div>\n      ';
 } ;
__p += '\n    </div>\n  </div>\n';
 } ;
__p += '\n\n<div class="Dialog-footer Dialog-footer--simple u-inner">\n  <div class="Dialog-footerContent MapsList-footer">\n    <button class="CDB-Button CDB-Button--secondary cancel">\n      <span class="CDB-Button-Text CDB-Text is-semibold CDB-Size-small u-upperCase">Cancel</span>\n    </button>\n    <button class="u-lSpace--xl CDB-Button CDB-Button--error ok">\n      <span class="CDB-Button-Text CDB-Text is-semibold CDB-Size-small u-upperCase">Ok, delete</span>\n    </button>\n  </div>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/delete_layer/template"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="Dialog-header u-inner">\n  <div class="Dialog-headerIcon Dialog-headerIcon--negative">\n    <i class="CDB-IconFont CDB-IconFont-trash"></i>\n  </div>\n  <p class="Dialog-headerTitle">You are about to delete this layer</p>\n  <p class="Dialog-headerText">Doing so won\'t delete your dataset, only this map will be affected.</p>\n</div>\n<div class="Dialog-footer Dialog-footer--simple u-inner">\n  <button class="Button Button--secondary Dialog-footerBtn cancel">\n    <span>cancel</span>\n  </button>\n  <button class="Button Button--negative ok">\n    <span>Ok, delete</span>\n  </button>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/delete_row/template"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="Dialog-header u-inner">\n  <div class="Dialog-headerIcon Dialog-headerIcon--negative">\n    <i class="CDB-IconFont CDB-IconFont-trash"></i>\n  </div>\n  <p class="Dialog-headerTitle">You are about to delete a ' +
__e( name ) +
'</p>\n  <p class="Dialog-headerText">Are you sure you want to delete it?</p>\n</div>\n<div class="Dialog-footer Dialog-footer--simple u-inner">\n  <button class="Button Button--secondary Dialog-footerBtn cancel">\n    <span>cancel</span>\n  </button>\n  <button class="Button Button--negative ok">\n    <span>Ok, delete</span>\n  </button>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/edit_vis_metadata/edit_vis_form"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="Form-row">\n  <div class="Form-rowLabel">\n    <label class="Form-label">' +
__e( isDataset ? 'Dataset' : 'Map' ) +
' name</label>\n  </div>\n  <div class="Form-rowData Form-rowData--long">\n    <input class="Form-input Form-input--long js-name ';
 if (!isNameEditable) { ;
__p += 'is-disabled';
 } ;
__p += '" placeholder="' +
__e( isDataset ? 'Dataset' : 'Map' ) +
' name is required" value="' +
__e( visValue ) +
'" ';
 if (!isNameEditable) { ;
__p += 'readonly="readonly"';
 } ;
__p += '/>\n  </div>\n  <div class="Form-rowInfo"></div>\n</div>\n\n<div class="Form-row">\n  <div class="Form-rowLabel">\n    <label class="Form-label">Description</label>\n  </div>\n  <div class="Form-rowData Form-rowData--withLabel Form-rowData--long">\n    <textarea maxlength="' +
__e( maxLength ) +
'" class="Form-input Form-input--long Form-textarea js-description ';
 if (!isMetadataEditable) { ;
__p += 'is-disabled';
 } ;
__p += '" placeholder="';
 if (isMetadataEditable) { ;
__p += 'Type your description here...';
 } else { ;
__p += 'Empty description';
 } ;
__p += '" ';
 if (!isMetadataEditable) { ;
__p += 'readonly="readonly"';
 } ;
__p += '>' +
__e( visDescription ) +
'</textarea>\n    ';
 if (isMetadataEditable) { ;
__p += '\n      <label class="EditVisMetadata-markdown js-markdown" data-title="<em>_italics_</em><br/><b>*bold*</b><br/>[link](http://link.com)">\n        <span class="EditVisMetadata-markdownIcon">\n          <i class="EditVisMetadata-markdownIconText">M</i>\n          <i class="EditVisMetadata-markdownIconChar">￬</i>\n        </span>\n        Markdown supported\n      </label>\n    ';
 } ;
__p += '\n  </div>\n  <div class="Form-rowInfo"></div>\n</div>\n\n';
 if (isDataset) { ;
__p += '\n  <div class="Form-row">\n    <div class="Form-rowLabel">\n      <label class="Form-label">Source</label>\n    </div>\n    <div class="Form-rowData Form-rowData">\n      <input class="Form-input Form-input--long js-source ';
 if (!isMetadataEditable) { ;
__p += 'is-disabled';
 } ;
__p += '" placeholder="Enter the source of the data" value="' +
__e( visSource ) +
'" ';
 if (!isMetadataEditable) { ;
__p += 'readonly="readonly"';
 } ;
__p += '/>\n    </div>\n    <div class="Form-rowInfo"></div>\n  </div>\n\n  <div class="Form-row">\n    <div class="Form-rowLabel">\n      <label class="Form-label">Attributions</label>\n    </div>\n    <div class="Form-rowData Form-rowData">\n      <input class="Form-input Form-input--long js-attributions ';
 if (!isMetadataEditable) { ;
__p += 'is-disabled';
 } ;
__p += '" placeholder="Enter the attributions of the data" value="' +
__e( visAttributions ) +
'" ';
 if (!isMetadataEditable) { ;
__p += 'readonly="readonly"';
 } ;
__p += '/>\n    </div>\n    <div class="Form-rowInfo"></div>\n  </div>\n\n  <div class="Form-row">\n    <div class="Form-rowLabel">\n      <label class="Form-label">License</label>\n    </div>\n    <div class="Form-rowData js-license">\n    </div>\n    <div class="Form-rowInfo"></div>\n  </div>\n\n  ';
 if (isDataLibraryEnabled) { ;
__p += '\n    <div class="Form-row">\n      <div class="Form-rowLabel">\n        <label class="Form-label">Display name</label>\n      </div>\n      <div class="Form-rowData Form-rowData">\n        <input class="Form-input Form-input--long js-displayName ';
 if (!isMetadataEditable) { ;
__p += 'is-disabled';
 } ;
__p += '" placeholder="Enter a good display name" value="' +
__e( visDisplayName ) +
'" ';
 if (!isMetadataEditable) { ;
__p += 'readonly="readonly"';
 } ;
__p += '/>\n      </div>\n      <div class="Form-rowInfo"></div>\n    </div>\n  ';
 } ;
__p += '\n';
 } ;
__p += '\n\n<div class="Form-row">\n  <div class="Form-rowLabel">\n    <label class="Form-label">Tags</label>\n  </div>\n  <div class="Form-rowData Form-rowData--long">\n    <div class="Form-tags js-tags ';
 if (!isMetadataEditable) { ;
__p += 'is-disabled';
 } ;
__p += '">\n      <ul class="Form-tagsList js-tagsList"></ul>\n    </div>\n  </div>\n  <div class="Form-rowInfo"></div>\n</div>\n\n<div class="Form-row">\n  <div class="Form-rowLabel">\n    <label class="Form-label">Privacy</label>\n  </div>\n  <div class="Form-rowData Form-rowData--long">\n    ';
 if (!isMetadataEditable) { ;
__p += '\n      <p class="CDB-Tag CDB-Text CDB-Size-small is-semibold u-upperCase PrivacyIndicator is-' +
__e( visPrivacy ) +
'">' +
__e( visPrivacy ) +
'</p>\n    ';
 } else { ;
__p += '\n      <button type="button" class="CDB-Tag CDB-Text CDB-Size-small is-semibold u-upperCase PrivacyIndicator is-' +
__e( visPrivacy ) +
' EditVisMetadata-privacyIndicator js-privacy">' +
__e( visPrivacy ) +
'</button>\n    ';
 } ;
__p += '\n  </div>\n  <div class="Form-rowInfo"></div>\n</div>\n\n<div class="Dialog-stickyFooter">\n  <div class="Dialog-footer EditVisMetadata-formFooter">\n    <div>';
/* placeholder for flex layout */;
__p += '</div>\n    ';
 if (isMetadataEditable) { ;
__p += '\n      <button type="submit" class="Button Button--main Button--inline js-submit">\n        <span>Save</span>\n      </button>\n    ';
 } else { ;
__p += '\n      <button type="button" class="Button Button--main Button--inline cancel">\n        <span>Close</span>\n      </button>\n    ';
 }  ;
__p += '\n  </div>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/edit_vis_metadata/edit_vis_metadata_dialog"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="EditVisMetadata-header">\n  <div class="Dialog-headerIcon Dialog-headerIcon--neutral">\n    <i class="CDB-IconFont CDB-IconFont-emptyDoc"></i>\n  </div>\n  <h3 class="Dialog-headerTitle">' +
__e( visTypeCapitalized ) +
' metadata</h3>\n  <p class="Dialog-headerText">\n    ';
 if (!isMetadataEditable) { ;
__p += '\n      You can\'t edit the ' +
__e( visType ) +
' attributes.\n    ';
 } else if (!isNameEditable) { ;
__p += '\n      Edit your ' +
__e( visType ) +
' attributes, but name is not allowed in this state.\n    ';
 } else { ;
__p += '\n      Edit the attributes of your ' +
__e( visType ) +
'\n    ';
 } ;
__p += '\n  </p>\n</div>\n<div class="Dialog-expandedSubContent js-content">\n  <div class="EditVisMetadata-form">\n    <form class="EditVisMetadata-formContent js-form"></form>\n  </div>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/export/export_template"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="js-start">\n  <div class="CDB-Text Dialog-header u-inner">\n    <div class="Dialog-headerIcon Dialog-headerIcon--neutral">\n      <i class="CDB-IconFont CDB-IconFont-cloudDownArrow"></i>\n    </div>\n    <p class="Dialog-headerTitle">Export dataset</p>\n    <p class="Dialog-headerText">Select the preferred file format.</p>\n    ';
 if (!isGeoreferenced) { ;
__p += '\n      <p class="Dialog-headerText">To download any geospatial format like SHP, KML or GeoJSON don\'t forget to select the_geom on your query.</p>\n    ';
 } ;
__p += '\n  </div>\n\n  <div class="CDB-Text Dialog-body">\n    <div class="OptionCards">\n      ';
 _.each( formats, function( format ){ ;
__p += '\n       <div data-format="' +
__e( format.format ) +
'"\n            class="js-option OptionCard OptionCard--onlyIcons ';

              if (isGeoreferenced === false && format.geomRequired === true) { ;
__p += ' is-disabled ';
 }
            ;
__p += '">\n         <div class="IllustrationIcon ' +
__e( format.illustrationIconModifier ) +
'">\n           <div class="IllustrationIcon-text">' +
__e( format.label || format.format ) +
'</div>\n         </div>\n       </div>\n      ';
 }); ;
__p += '\n    </div>\n  </div>\n\n  <div class="Dialog-footer Dialog-footer--simple u-inner">\n    <button class="CDB-Text CDB-Button CDB-Button--secondary CDB-Size-medium u-upperCase cancel">\n      <span>Cancel</span>\n    </button>\n  </div>\n</div>\n\n<div class="CDB-Text js-preparing-download" style="display: none;">\n  ' +
__e( preparingDownloadContent ) +
'\n</div>\n\n<div class="CDB-Text js-error" style="display: none;"></div>\n\n<form class="hack" method="POST" action="' +
__e( url ) +
'">\n  <input type="hidden" class="filename" name="filename" />\n  <input type="hidden" class="q" name="q" />\n  <input type="hidden" class="format" name="format" />\n  <input type="hidden" class="api api_key" name="api_key" />\n  <input type="hidden" class="skipfields" name="skipfields" disabled="disabled" value="" />\n  <input type="hidden" class="dp" name="dp" value="4" disabled="disabled" />\n</form>\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/export/public_export_template"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="js-start">\n  <div class="CDB-Text Dialog-header u-inner">\n    <div class="Dialog-headerIcon Dialog-headerIcon--neutral">\n      <i class="CDB-IconFont CDB-IconFont-cloudDownArrow"></i>\n    </div>\n    <p class="Dialog-headerTitle">Export dataset</p>\n    <p class="Dialog-headerText">Select the preferred file format.</p>\n    ';
 if (!isGeoreferenced) { ;
__p += '\n      <p class="Dialog-headerText">To download any geospatial format like SHP, KML or GeoJSON don\'t forget to select the_geom on your query.</p>\n    ';
 } ;
__p += '\n  </div>\n\n  <div class="CDB-Text Dialog-body">\n    ';
 if (hasBounds) { ;
__p += '\n      <div class="OptionCheck">\n        <div class="Checkbox js-bounds">\n          <button class="Checkbox-input is-checked"></button>\n          <label class="Checkbox-label"><strong class="Checkbox-strong">Match rows with the map view.</strong> This option reduces file size.</label>\n        </div>\n      </div>\n    ';
 } ;
__p += '\n\n    <div class="OptionCards">\n      ';
 _.each( formats, function( format ){ ;
__p += '\n       <div data-format="' +
__e( format.format ) +
'"\n            class="js-option OptionCard OptionCard--onlyIcons ';

              if (isGeoreferenced === false && format.geomRequired === true) { ;
__p += ' is-disabled ';
 }
            ;
__p += '">\n         <div class="IllustrationIcon ' +
__e( format.illustrationIconModifier ) +
'">\n           <div class="IllustrationIcon-text">' +
__e( format.label || format.format ) +
'</div>\n         </div>\n       </div>\n      ';
 }); ;
__p += '\n    </div>\n  </div>\n\n  <div class="Dialog-footer Dialog-footer--simple u-inner">\n    <button class="CDB-Text CDB-Button CDB-Button--secondary CDB-Size-medium u-upperCase cancel">\n      <span>Cancel</span>\n    </button>\n  </div>\n</div>\n\n<div class="CDB-Text js-preparing-download" style="display: none;">\n  ' +
__e( preparingDownloadContent ) +
'\n</div>\n\n<div class="CDB-Text js-error" style="display: none;"></div>\n\n<form class="hack" method="POST" action="' +
__e( url ) +
'">\n  <input type="hidden" class="filename" name="filename" />\n  <input type="hidden" class="q" name="q" />\n  <input type="hidden" class="format" name="format" />\n  <input type="hidden" class="bounds" name="bounds" />\n  <input type="hidden" class="api api_key" name="api_key" />\n  <input type="hidden" class="skipfields" name="skipfields" disabled="disabled" value="" />\n  <input type="hidden" class="dp" name="dp" value="4" disabled="disabled" />\n</form>\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/export_map/templates/confirm"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="Dialog-header u-inner">\n  <div class="Dialog-headerIcon Dialog-headerIcon--neutral">\n    <i class="CDB-IconFont CDB-IconFont-map"></i>\n  </div>\n  <p class="CDB-Text CDB-Size-large u-mainTextColor u-secondaryTextColor u-bSpace--m">Export map</p>\n  <p class="CDB-Text CDB-Size-medium u-altTextColor">This map, and the connected data, will be exported as a .carto file</p>\n</div>\n\n<div class="Dialog-footer Dialog-footer--simple u-inner">\n  <button class="js-cancel CDB-Button CDB-Button--secondary u-rSpace--xl">\n    <span class="CDB-Button-Text CDB-Text is-semibold CDB-Size-medium u-upperCase">Cancel</span>\n  </button>\n\n  <button class="js-ok CDB-Button CDB-Button--primary CDB-Button--big">\n    <span class="CDB-Button-Text CDB-Text is-semibold CDB-Size-medium u-upperCase">Ok, export</span>\n  </button>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/export_map/templates/download"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="Dialog-header u-inner">\n  <div class="Dialog-headerIcon Dialog-headerIcon--neutral">\n    <i class="CDB-IconFont CDB-IconFont-download"></i>\n  </div>\n  <h4 class="CDB-Text CDB-Size-large u-mainTextColor u-secondaryTextColor u-bSpace--m">Ready to Download</h4>\n  <p class="CDB-Text CDB-Size-medium u-altTextColor">Tip: Allow pop-ups from CARTO in your web browser.<br/>Click Download to begin the .carto file download.</p>\n</div>\n\n<div class="Dialog-footer Dialog-footer--simple u-inner">\n  <button class="js-download CDB-Text CDB-Button CDB-Button--primary">\n    <span class="CDB-Button-Text CDB-Text is-semibold CDB-Size-medium u-upperCase">Download</span>\n  </button>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/feature_data/add_column/add_column"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="Form-row">\n  <div class="Form-rowLabel"></div>\n  <div class="Form-rowData Form-rowData--med">\n    ';
 if (state === "error") { ;
__p += '    \n      <p class="DefaultParagraph DefaultParagraph--error">\n        There was an error, <button type="button" class="Button--link js-addColumn">try again</button>\n      </p>\n    ';
 } else if (state === "loading") { ;
__p += '\n      <div class="Spinner Spinner--formIcon"></div>\n    ';
 } else { ;
__p += '\n      <button type="button" class="Button--link js-addColumn">Add new column</button>\n    ';
 } ;
__p += '\n  </div>\n</div>';

}
return __p
};

this["JST"]["cartodb/common/dialogs/feature_data/feature_data_dialog"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="Dialog-header Dialog-header--expanded">\n  <div class="Dialog-headerIcon Dialog-headerIcon--neutral">\n    <i class="CDB-IconFont CDB-IconFont-marker"></i>\n  </div>\n  <p class="Dialog-headerTitle">Edit ' +
__e( featureType ) +
' metadata</p>\n  <p class="Dialog-headerText">\n    Edit your ' +
__e( featureType ) +
' data, or create new columns on your dataset.\n  </p>\n  <div class="FeatureData-mapWrapper">\n    <div class="FeatureData-mapContainer js-map"></div>\n    <div class="FeatureData-mapMamufas"></div>\n  </div>\n</div>\n<div class="Dialog-expandedSubContent js-content">\n  <div class="FeatureData-form">\n    <form class="Form FeatureData-formContent js-form">\n      <div class="Dialog-stickyFooter">\n        <div class="Dialog-footer FeatureData-formFooter">\n          <div>';
/* placeholder for flex layout */;
__p += '</div>\n          <button type="submit" class="Button Button--main Button--inline js-submit">\n            <span>Save</span>\n          </button>\n        </div>\n      </div>\n    </form>\n  </div>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/feature_data/form_field/form_field"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="Form-row">\n  <div class="Form-rowLabel">\n    <input class="EditField-label ';
 if (columnError) { ;
__p += 'has-failed';
 } ;
__p += ' js-columnName ';
 if (readOnly) { ;
__p += ' is-disabled ';
 } ;
__p += '" value="' +
__e( attribute ) +
'" ';
 if (readOnly) { ;
__p += ' readonly ';
 } ;
__p += ' />\n  </div>\n  <div class="Form-rowData Form-rowData--med js-editField"></div>\n  <div class="Form-rowInfo">\n    <div class="EditField-select EditField-select--' +
__e( type ) +
' ';
 if (typeError) { ;
__p += 'has-failed';
 } ;
__p += ' js-fieldType"></div>\n    ';
 if (readOnly) { ;
__p += '\n      <div class="Spinner Spinner--formIcon EditField-loader"></div>\n    ';
 } else { ;
__p += '\n      <i class="EditField-info CDB-IconFont CDB-IconFont-info js-info" title="Changing column type or name could provoke changes in your record values"></i>\n    ';
 } ;
__p += '\n  </div>\n</div>';

}
return __p
};

this["JST"]["cartodb/common/dialogs/georeference/choose_geometry"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="Dialog-contentSubHeader">\n  <button class="NavButton js-back">\n    <i class="CDB-IconFont CDB-IconFont-arrowPrev"></i>\n  </button>\n  <p class="DefaultTitle">\n    Georeference your data\n  </p>\n  <div>\n    ';
/* Empty div to render the prev node in center, based on the layout */;
__p += '\n  </div>\n</div>\n<div class="Georeference-contentItem OptionCards js-items"></div>\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/georeference/default_content_header"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="ImportPanel-header">\n  <h3 class="DefaultTitle">\n    ' +
__e( title ) +
'\n  </h3>\n  <p class="ImportPanel-headerDescription ImportPanel-headerDescription--withoutWidth">\n    ' +
__e( desc ) +
'\n  </p>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/georeference/default_footer"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="Dialog-footer Dialog-footer--expanded CreateDialog-footer">\n  <div>\n    <div class="CreateDialog-footerShadow"></div>\n    <div class="CreateDialog-footerLine"></div>\n    <div class="CreateDialog-footerInner">\n      <div class="CreateDialog-footerInfo">\n        <div class="Checkbox js-force-all-rows">\n          <button class="Checkbox-input"></button>\n          <label class="Checkbox-label">\n            Override all values. Geocode all your rows, even those with geometry data.\n          </label>\n        </div>\n      </div>\n      <div class="CreateDialog-footerActions">\n        <button class="Button Button--main u-tSpace-xl ok is-disabled">\n          <span>Continue</span>\n        </button>\n      </div>\n    </div>\n  </div>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/georeference/geometry_item_point"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="OptionCard-icon">\n  <div class="Georeference-geometryIcon">\n    <i class="Georeference-geometryIconImg Georeference-geometryIconImg--point js-icon">\n      <i class="Georeference-geometryIconMarker Georeference-geometryIconMarker--a"></i>\n      <i class="Georeference-geometryIconMarker Georeference-geometryIconMarker--b"></i>\n      <i class="Georeference-geometryIconMarker Georeference-geometryIconMarker--c"></i>\n    </i>\n    <i class="Georeference-geometryIconHighlightIcon HighlightIcon HighlightIcon--warning js-warning">!</i>\n  </div>\n</div>\n<div class="OptionCard-title DefaultTitle js-title"></div>\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/georeference/geometry_item_polygon"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="OptionCard-icon">\n  <div class="Georeference-geometryIcon">\n    <i class="CDB-IconFont CDB-IconFont-globe Georeference-geometryIconFont js-icon"></i>\n    <i class="Georeference-geometryIconHighlightIcon HighlightIcon HighlightIcon--warning js-warning">!</i>\n  </div>\n</div>\n<div class="OptionCard-title DefaultTitle js-title"></div>\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/georeference/georeference"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="Dialog-content Dialog-content--expanded">\n  <div class="Dialog-contentWrapper">\n\n    <div class="Dialog-header Dialog-header--expanded CreateDialog-header">\n      <ul class="CreateDialog-headerSteps">\n        <li class="CreateDialog-headerStep CreateDialog-headerStep--single">\n          <div class="Dialog-headerIcon Dialog-headerIcon--neutral">\n            <i class="CDB-IconFont CDB-IconFont-marker"></i>\n          </div>\n          <p class="Dialog-headerTitle">Georeference your dataset</p>\n          <p class="Dialog-headerText">Transform your data into coordinates</p>\n        </li>\n      </ul>\n    </div>\n\n    <div class="Dialog-body Dialog-body--expanded Dialog-body--create">\n      <div class="CreateDialog-listing ' +
__e( hasNoGeoferencedData ? 'CreateDialog-listing--withFlashMessage': '' ) +
'">\n        ';
 if (hasNoGeoferencedData) { ;
__p += '\n          <div class="FlashMessage FlashMessage--inDialogWithFiltersNavListing">\n            <div class="u-inner">\n              No georeferenced data on your layer. If you don’t georeference your data your map will be blank.\n            </div>\n          </div>\n        ';
 } ;
__p += '\n        <div class="Filters Filters--navListing ' +
__e( hasNoGeoferencedData ? 'Filters--navListing--withFlashMessage': '' ) +
'">\n          <div class="u-inner">\n            <div class="Filters-inner">\n              <div class="Filters-row Filters-row--centered">\n                <span class="Filters-separator"></span>\n                <ul class="Filters-group js-tabs"></ul>\n              </div>\n            </div>\n          </div>\n        </div>\n        <div class="Dialog-bodyInnerExpandedWithPreFooter Georeference-content js-tab-content"></div>\n      </div>\n    </div>\n  </div>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/georeference/row"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="Form-label Form-label--step">\n  <label class="ImportPanel-headerDescription ImportPanel-headerDescription--normalWeight">\n    ' +
__e( label ) +
'\n  </label>\n</div>\n<div class="Form-rowData Form-rowData--step js-select"></div>\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/georeference/street_addresses/confirm_tos"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="Dialog-header u-inner">\n  <div class="Dialog-headerIcon LayoutIcon LayoutIcon--warning">\n    <i class="CDB-IconFont CDB-IconFont-dollar CDB-IconFont--super"></i>\n  </div>\n  <p class="Dialog-headerTitle">\n    This task would cost you <strong>$' +
__e( costInDollars ) +
'</strong>\n  </p>\n  <p class="Dialog-headerText">\n    We made an estimation of your geocoding task.\n  </p>\n</div>\n\n<div class="Dialog-body Dialog-resultsBody">\n  <span class="Dialog-resultsBodyIcon NavButton ">?</span>\n  <div class="Dialog-resultsBodyTexts">\n    <p class="DefaultParagraph DefaultParagraph--tertiary">\n      This task could have a possible cost, be sure to read our <a href="https://carto.com/terms" target="_blank">terms and conditions</a> before proceeding.\n    </p>\n  </div>\n</div>\n\n<div class="Dialog-footer Dialog-footer--simple u-inner Dialog-narrowerContent">\n  <button class="Button Button--secondary Dialog-footerBtn cancel">\n    <span>cancel</span>\n  </button>\n  <button class="Button Button--main ok">\n    <span>Yes, I agree</span>\n  </button>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/georeference/street_addresses/estimation"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 if (hasEstimation) { ;
__p += '\n  ';
 if (costInCredits === 0 || hasHardLimit) { ;
__p += '\n    ';
 if (hasRows) { ;
__p += '\n      <div class="LayoutIcon LayoutIcon--positive">\n        <i class="CDB-IconFont CDB-IconFont-dollar CDB-IconFont--super"></i>\n      </div>\n      <p class="DefaultParagraph DefaultParagraph--normalSize">\n        This geocoding operation will have no cost for you!\n        ';
 if (hasHardLimit) { ;
__p += '\n          But it will only geocode as many locations as your available credits permit.\n        ';
 } else { /* aka soft limit */ ;
__p += '\n          After available credits they will cost $' +
__e( blockPriceInDollars ) +
'/1,000 credits.\n        ';
 } ;
__p += '\n      </p>\n    ';
 } else { ;
__p += '\n      <div class="LayoutIcon">\n        <i class="CDB-IconFont CDB-IconFont-question"></i>\n      </div>\n      <p class="DefaultParagraph DefaultParagraph--normalSize">\n        No rows will be geocoded. Check the checkbox below to override your columns\' values.\n      </p>\n    ';
 } ;
__p += '\n  ';
 } else if (costInCredits > 0) { ;
__p += '\n    <div class="LayoutIcon LayoutIcon--warning">\n      <i class="CDB-IconFont CDB-IconFont-dollar CDB-IconFont--super"></i>\n    </div>\n    <p class="DefaultParagraph DefaultParagraph--normalSize">\n      This task could cost you as much as <strong>$' +
__e( costInDollars ) +
'</strong> (' +
__e( costInCredits ) +
' extra credits).\n      Based on an extra credit cost of $' +
__e( blockPriceInDollars ) +
'/1,000 credits.\n    </p>\n  ';
 } else { ;
__p += '\n    <div class="LayoutIcon LayoutIcon--negative">\n      <i class="CDB-IconFont CDB-IconFont-dollar CDB-IconFont--super"></i>\n    </div>\n    <p class="DefaultParagraph DefaultParagraph--normalSize">\n      Unfortunately there was a problem estimating cost of this geocoding operation.\n    </p>\n  ';
 } ;
__p += '\n';
 } else { ;
__p += '\n  <div class="LayoutIcon">\n    <i class="CDB-IconFont CDB-IconFont-dollar CDB-IconFont--super"></i>\n  </div>\n  <p class="DefaultParagraph DefaultParagraph--normalSize">\n    Estimating possible cost for this geocoding operation…\n  </p>\n';
 } ;
__p += '\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/georeference/street_addresses/quota"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<p class="DefaultParagraph DefaultParagraph--normalSize">\n  ' +
__e( cdb.Utils.formatNumber(quotaLeft) ) +
' credits left this month\n</p>\n<div class="Georeference-progressBar ">\n  <div class="progress-bar">\n    <span class="bar-2 ';
 if (quotaUsedInPct > 90) { ;
__p += 'danger';
 } else if (quotaUsedInPct > 75) { ;
__p += 'caution';
 } ;
__p += '"\n      style="width: ' +
__e( quotaUsedInPct ) +
'%"></span>\n  </div>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/georeference/street_addresses/row_add_row"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="Form-rowDataExtra">\n  <button class="NavButton NavButton--withText js-add-row">\n    <span>+</span>\n  </button>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/georeference/street_addresses/street_addresses"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="js-rows"></div>\n<div class="Dialog-preFooter js-costs-info" style="display: none;">\n  <div class="Georeference-preFooter">\n    <div class="js-estimation"></div>\n    <div class="js-quota"></div>\n  </div>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/georeference/street_addresses/upgrade_footer"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="Dialog-footer Dialog-footer--expanded CreateDialog-footer">\n  <div>\n    <div class="CreateDialog-footerShadow"></div>\n    <div class="CreateDialog-footerLine"></div>\n    <div class="CreateDialog-footerInner">\n      <div class="CreateDialog-footerInfo">\n        <div class="Georeference-upgradeFooter">\n          <div class="LayoutIcon LayoutIcon--negative">\n            <div class="Badge Badge--negative is-icon">!</div>\n          </div>\n          <p class="DefaultParagraph DefaultParagraph--normalSize">\n            You have reached the maximum number of geocode operations allotted for this month.\n            ';
 if (!cartodb_com_hosted) { ;
__p += '\n              <br/>\n              Contact <a href="mailto:sales@carto.com">Sales</a> if you need to increase the number of your geocoding credits before your next billing cycle starts';
 if (daysLeftToNextBilling > 0) { ;
__p += ',\n                <strong>in ' +
__e( daysLeftToNextBilling ) +
' ' +
__e( pluralizeString('day', 'days', daysLeftToNextBilling) ) +
'.</strong>\n                ';
 } else { ;
__p += '.';
 } ;
__p += '\n            ';
 } ;
__p += '\n          </p>\n        </div>\n      </div>\n      <div class="CreateDialog-footerActions">\n        ';
 if (!cartodb_com_hosted && upgradeURL) { ;
__p += '\n          <a href="' +
__e( upgradeURL ) +
'" class="Button Button--main">\n            <span>UPGRADE</span>\n          </a>\n        ';
 } ;
__p += '\n      </div>\n    </div>\n  </div>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/georeference/tab_item"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<button class="Filters-typeLink ' +
__e( isDisabled ? 'is-disabled' : '' ) +
' js-btn">\n  <span>' +
__e( label ) +
'</span>\n</button>\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/help/carto_css"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="Dialog-header u-inner">\n  <div class="Dialog-headerIcon Dialog-headerIcon--neutral">\n    <i class="CDB-IconFont CDB-IconFont-bubble"></i>\n  </div>\n  <p class="Dialog-headerTitle">Advanced map styling with CartoCSS</p>\n  <p class="Dialog-headerText">We support a superset of CSS to make your maps look better.</p>\n</div>\n\n<div class="Dialog-body Dialog-resultsBody Dialog-resultsBody--vcenter">\n  <span class="Dialog-resultsBodyIcon NavButton">1</span>\n  <div class="Dialog-resultsBodyTexts">\n    <p class="DefaultParagraph DefaultParagraph--tertiary">\n      If you know how to use CSS to style websites, you already know how to use CartoCSS to style your maps. See <a href="https://docs.carto.com/cartodb-platform/cartocss/" target="_blank">CartoCSS</a> for details.\n    </p>\n  </div>\n</div>\n<div class="Dialog-body Dialog-resultsBody Dialog-resultsBody--vcenter">\n  <span class="Dialog-resultsBodyIcon NavButton">?</span>\n  <div class="Dialog-resultsBodyTexts">\n    <p class="DefaultParagraph DefaultParagraph--tertiary">\n      Visit The Map Academy to view lessons related to CartoCSS, <a href="https://academy.carto.com/courses/design-for-beginners/" target="_blank">Introduction to Map Design</a> and <a href="https://academy.carto.com/courses/intermediate-design/" target="_blank">Intermediate Map Design</a>\n    </p>\n  </div>\n</div>\n\n<div class="Dialog-footer Dialog-footer--simple u-inner Dialog-narrowerContent">\n  <button class="Button Button--secondary Dialog-footerBtn cancel">\n    <span>skip</span>\n  </button>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/help/infowindow_with_images"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="Dialog-header u-inner">\n  <div class="Dialog-headerIcon Dialog-headerIcon--neutral">\n    <i class="CDB-IconFont CDB-IconFont-bubble"></i>\n  </div>\n  <p class="Dialog-headerTitle">Adding images to your infowindows</p>\n  <p class="Dialog-headerText">This template allows you to add an image to your infowindow</p>\n</div>\n\n<div class="Dialog-body Dialog-resultsBody Dialog-resultsBody--vcenter">\n  <span class="Dialog-resultsBodyIcon NavButton">1</span>\n  <div class="Dialog-resultsBodyTexts">\n    <p class="DefaultParagraph DefaultParagraph--tertiary">\n      The image URLs will need to be stored as a column in your table. Tip: You can add rows and columns to your dataset with the CARTO sidebar options from the Map View, or by using the context menu items from the Data View.\n    </p>\n  </div>\n</div>\n<div class="Dialog-body Dialog-resultsBody Dialog-resultsBody--vcenter">\n  <span class="Dialog-resultsBodyIcon NavButton">2</span>\n  <div class="Dialog-resultsBodyTexts">\n    <p class="DefaultParagraph DefaultParagraph--tertiary">\n      Next, you will need to change the order of the labels by dragging the URL field to the top of the fields list in the <a href="https://docs.carto.com/cartodb-editor/maps/#infowindows" target="_blank">infowindow</a> options.\n    </p>\n  </div>\n</div>\n\n<div class="Dialog-footer Dialog-footer--simple u-inner Dialog-narrowerContent">\n  <button class="Button Button--secondary Dialog-footerBtn cancel">\n    <span>Ok, close</span>\n  </button>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/help/mustache_templates"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="Dialog-header u-inner">\n  <div class="Dialog-headerIcon Dialog-headerIcon--neutral">\n    <i class="CDB-IconFont CDB-IconFont-bubble"></i>\n  </div>\n  <p class="Dialog-headerTitle">Templating infowindows in CARTO</p>\n  <p class="Dialog-headerText">We support HTML infowindows, so here are some tips to work with them.</p>\n</div>\n\n<div class="Dialog-body Dialog-resultsBody Dialog-resultsBody--vcenter">\n  <span class="Dialog-resultsBodyIcon NavButton ">1</span>\n  <div class="Dialog-resultsBodyTexts">\n    <p class="DefaultParagraph DefaultParagraph--tertiary">\n      You can use the name of your columns as <strong>{{name}}</strong>, <strong>{{description}}</strong>, etc.\n    </p>\n  </div>\n</div>\n<div class="Dialog-body Dialog-resultsBody Dialog-resultsBody--vcenter">\n  <span class="Dialog-resultsBodyIcon NavButton ">2</span>\n  <div class="Dialog-resultsBodyTexts">\n    <p class="DefaultParagraph DefaultParagraph--tertiary">\n      Be sure to have elements with class names of <strong>cartodb-popup</strong> and <strong>close</strong> elements. Reference the <a href="https://github.com/CartoDB/cartodb.js/tree/develop/themes/css/infowindow" target="_blank">CSS Library</a> for the latest infowindow stylesheet code. They are needed for basic interactions.\n    </p>\n  </div>\n</div>\n<div class="Dialog-body Dialog-resultsBody Dialog-resultsBody--vcenter">\n  <span class="Dialog-resultsBodyIcon NavButton ">?</span>\n  <div class="Dialog-resultsBodyTexts">\n    <p class="DefaultParagraph DefaultParagraph--tertiary">\n      If you want to know how to work with infowindows classes, view the\n      <a href="http://mustache.github.io/mustache.5.html" target="_blank">Mustache docs</a>\n      and\n      <a href="http://mustache.github.io/#demo" target="_blank">Mustache demo</a>\n    </p>\n  </div>\n</div>\n\n<div class="Dialog-footer Dialog-footer--simple u-inner Dialog-narrowerContent">\n  <button class="Button Button--secondary Dialog-footerBtn cancel">\n    <span>skip</span>\n  </button>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/help/postgres_sql"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="Dialog-header u-inner">\n  <div class="Dialog-headerIcon Dialog-headerIcon--neutral">\n    <i class="CDB-IconFont CDB-IconFont-bubble"></i>\n  </div>\n  <p class="Dialog-headerTitle">Performing SQL queries on CARTO</p>\n  <p class="Dialog-headerText">Enhance your SQL skills to make better maps.</p>\n</div>\n\n<div class="Dialog-body Dialog-resultsBody Dialog-resultsBody--vcenter">\n  <span class="Dialog-resultsBodyIcon NavButton ">1</span>\n  <div class="Dialog-resultsBodyTexts">\n    <p class="DefaultParagraph DefaultParagraph--tertiary">\n      To see your <strong>data on the map</strong>, CARTO requires that <strong>the_geom_webmercator</strong> column is in your results (<a href="https://docs.carto.com/tips-and-tricks/geospatial-analysis/#about-thegeomwebmercator" target="_blank">CARTO basic geospatial analysis</a>).\n    </p>\n  </div>\n</div>\n<div class="Dialog-body Dialog-resultsBody Dialog-resultsBody--vcenter">\n  <span class="Dialog-resultsBodyIcon NavButton ">2</span>\n  <div class="Dialog-resultsBodyTexts">\n    <p class="DefaultParagraph DefaultParagraph--tertiary">\n     In order to get the <strong>interactivity layer</strong> in your maps, the column <strong>cartodb_id</strong> must be in your results.\n    </p>\n  </div>\n</div>\n<div class="Dialog-body Dialog-resultsBody Dialog-resultsBody--vcenter">\n  <span class="Dialog-resultsBodyIcon NavButton ">?</span>\n  <div class="Dialog-resultsBodyTexts">\n    <p class="DefaultParagraph DefaultParagraph--tertiary">\n      Learn more about using SQL and PostGIS in CARTO by viewing the\n      <a href="https://academy.carto.com/courses/sql-postgis/" target="_blank">SQL and PostGIS</a>\n      course in\n      <a href="https://academy.carto.com" target="_blank">The Map Academy</a>.\n    </p>\n  </div>\n</div>\n<div class="Dialog-body Dialog-resultsBody Dialog-resultsBody--vcenter">\n  <span class="Dialog-resultsBodyIcon NavButton ">?</span>\n  <div class="Dialog-resultsBodyTexts">\n    <p class="DefaultParagraph DefaultParagraph--tertiary">\n      Do you need more information? View the FAQ\'s about <a href="https://docs.carto.com/faqs/postgresql-and-postgis/" target="_blank">PostgreSQL Functions and PostGIS Expressions</a>, or visit the official <a href="http://www.postgresql.org/docs/9.5/static/reference.html" target="_blank">PostgreSQL docs</a> and <a href="http://postgis.net/docs/manual-2.2/reference.html" target="_blank">PostGIS</a> documentation.\n    </p>\n  </div>\n</div>\n\n<div class="Dialog-footer Dialog-footer--simple u-inner Dialog-narrowerContent">\n  <button class="Button Button--secondary Dialog-footerBtn cancel">\n    <span>skip</span>\n  </button>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/limits_reach/limits_reached"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div>\n  <div class="Dialog-header Dialog-header--expanded">\n    <div class="Dialog-headerIcon Dialog-headerIcon--neutral">\n      <i class="CDB-IconFont CDB-IconFont-layerStack"></i>\n    </div>\n    <h4 class="Dialog-headerTitle">Your plan doesn\'t allow you to add more layers (' +
__e( layersCount ) +
' max)</h4>\n    <p class="Dialog-headerText">\n    ';
 if ((canUpgrade && !organizationAdmin) && !customHosted) { ;
__p += '\n      Take a look to the plans below in order to increase the available amount of map layers\n    ';
 } else if (organizationAdmin) { ;
__p += '\n      Contact <a href="mailto:sales@carto.com">Sales</a> to increase the available amount of map layers for your organization\n    ';
 } else if (organizationUser) { ;
__p += '\n      Contact <a href="mailto:' +
__e( organizationAdminEmail ) +
'">your organization administrator</a> to request more information about map layers\n    ';
 } else { ;
__p += '\n      Sorry but you\'ve reached your map layers limit\n    ';
 } ;
__p += '\n    </p>\n  </div>\n  <div class="Dialog-body Dialog-content js-content"></div>\n  <div class="Dialog-footer--simple u-inner">\n    <button class="Button Button-inner Button--inline Button--secondary Button--secondaryTransparentBkg cancel">\n      <span>close</span>\n    </button>\n  </div>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/limits_reach/limits_reached_content"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 if (canUpgrade) { ;
__p += '\n  <div class="PricePlans">\n    <div class="PricePlans-options">\n      <div class="PricePlans-yearly">\n        <div class="Toggler Toggler--grey">\n          <input type="checkbox" class="js-toggler" ';
 if (lumpSum) { ;
__p += 'checked';
 } ;
__p += ' id="limits_reached_toggler" />\n          <label for="limits_reached_toggler"></label>\n        </div>\n        <p class="PricePlans-yearlyText">Pay yearly and get <em class="PricePlans-yearlyText--highlight">1 month off</em></p>\n      </div>\n      ';
 if (canStartTrial) { ;
__p += '\n        <div class="PricePlans-trial">\n          <p class="PricePlans-trialText">\n            All personal plans come with 14 days free trial\n            <i class="CDB-IconFont CDB-IconFont-gift PricePlans-trialIcon"></i>\n          </p>\n        </div>\n      ';
 } ;
__p += '\n    </div>\n\n    <ul class="PricePlans-list">\n      ';
 for (var i = 0, l = availablePlans.length; i < l; i++) { ;
__p += '\n        <li class="PricePlans-item">\n          <div class="PricePlans-itemHeader">\n            <h4 class="PricePlans-itemTitle">' +
__e( availablePlans[i].name ) +
'</h4>\n            <p class="PricePlans-itemPrice">\n              $<span class="PricePlans-itemPriceFigure">';
 if (lumpSum) { ;
__p +=
__e( availablePlans[i].lumpSumPrice );
 } else { ;
__p +=
__e( availablePlans[i].price );
 } ;
__p += '</span>\n              <span class="PricePlans-itemPriceRest">/ ';
 if (lumpSum) { ;
__p += 'year';
 } else { ;
__p += 'month';
 if (i === 3) { ;
__p += '*';
 } ;

 } ;
__p += '</span>\n            </p>\n            ';
 if (i === 3 && !lumpSum) { ;
__p += '\n              <p class="PricePlans-itemPriceException">*Starting at. Billed annually</p>\n            ';
 } ;
__p += '\n          </div>\n          <ul class="PricePlans-itemContent">\n            <li class="PricePlans-itemContentAttr">\n              ';
 if (!availablePlans[i].isUserPlan) { ;
__p += '\n                <a href="' +
__e( upgradeURL ) +
'" class="Button Button--main PricePlans-button Button--block">\n                  <span>learn more</span>\n                </a>\n              ';
 } else { ;
__p += '\n                <button class="Button PricePlans-button PricePlans-button--grey is-disabled">your plan</button>\n              ';
 } ;
__p += '\n            </li>\n            <li class="PricePlans-itemContentAttr">Unlimited datasets</li>\n            <li class="PricePlans-itemContentAttr">Unlimited mapviews</li>\n            ';
 if (availablePlans[i].name == "enterprise") { ;
__p += '\n              <li class="PricePlans-itemContentAttr">+' +
__e( availablePlans[i].layers ) +
' layers</li>\n            ';
 } else { ;
__p += '\n              <li class="PricePlans-itemContentAttr">' +
__e( availablePlans[i].layers ) +
' layers</li>\n            ';
 } ;
__p += '\n            ';
 if (availablePlans[i].name == "enterprise") { ;
__p += '\n              <li class="PricePlans-itemContentAttr">Starting at ' +
__e( availablePlans[i].quota ) +
' of vector data</li>\n            ';
 } else { ;
__p += '\n              <li class="PricePlans-itemContentAttr">' +
__e( availablePlans[i].quota ) +
' of vector data</li>\n            ';
 } ;
__p += '\n            ';
 if (availablePlans[i].privateMaps) { ;
__p += '\n              <li class="PricePlans-itemContentAttr">Private maps</li>\n            ';
 } ;
__p += '\n            ';
 if (availablePlans[i].removableBrand) { ;
__p += '\n              <li class="PricePlans-itemContentAttr">Removable Brand</li>\n            ';
 } ;
__p += '\n            ';
 if (availablePlans[i].name == "enterprise") { ;
__p += '\n              <li class="PricePlans-itemContentAttr">Teams</li>\n            ';
 } ;
__p += '\n          </ul>\n        </li>\n      ';
 } ;
__p += '\n    </ul>\n  </div>\n';
 } else if (organizationAdmin) { ;
__p += '\n  <div class="DefaultParagraph DefaultParagraph--short DefaultParagraph--centered">\n    Just contact us in order to check how to make available more resources for all your organization users.\n  </div>\n';
 } ;
__p += '\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/map/add_layer/footer"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="CreateDialog-footerShadow"></div>\n<div class="CreateDialog-footerLine"></div>\n<div class="CreateDialog-footerInner ">\n  <div class="js-footer-info CreateDialog-footerInfo">\n  </div>\n  <div class="CreateDialog-footerActions js-footerActions">\n    <button class="js-ok Button Button--positive ' +
__e( canFinish ? '' : 'is-disabled' ) +
'">\n      <span>Add layer</span>\n    </button>\n  </div>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/map/add_layer_template"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="Dialog-header Dialog-header--expanded CreateDialog-header with-separator">\n  <ul class="CreateDialog-headerSteps">\n    <li class="CreateDialog-headerStep is-selected">\n      <div class="Dialog-headerIcon Dialog-headerIcon--neutral">\n        <i class="CDB-IconFont CDB-IconFont-add"></i>\n      </div>\n      <p class="Dialog-headerTitle">Add a new layer</p>\n      <p class="Dialog-headerText">Select an existing dataset or connect a new one</p>\n    </li>\n  </ul>\n</div>\n<div class="Filters Filters--navListing Filters--static js-navigation"></div>\n<div class="js-content-container Dialog-body Dialog-body--expanded Dialog-body--create Dialog-body--noPaddingTop Dialog-body--withoutBorder"></div>\n<div class="Dialog-footer Dialog-footer--expanded CreateDialog-footer js-footer"></div>';

}
return __p
};

this["JST"]["cartodb/common/dialogs/map/image_picker/assets_item"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<a href="#/select-asset" class="image" style="background-image:url(' +
__e( public_url ) +
')"></a>\n<a href="#/delete-asset" class="delete"></a>\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/map/image_picker/assets_template"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<ul class="AssetsList"></ul>\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/map/image_picker/box_template"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="ImportPanel ImportPanelService js-import-panel">\n  <div class="ImportPanel-header">\n    <h3 class="CDB-Text CDB-Size-large u-mainTextColor u-secondaryTextColor u-bSpace--m">Connect with Box</h3>\n    <p class="CDB-Text CDB-Size-medium u-altTextColor u-bSpace--xl ImportPanel-headerDescription">JPG, GIF, PNG, SVG formats are supported </p>\n  </div>\n  <div class="ImportPanel-body">\n    <div class="ImportPanel-bodyWrapper">\n      <div class="ImportPanel-state is-active">\n        <div class="ImportPanel-actions">\n          <button class="Button Button--main ImportPanel-actionsButton js-fileButton">Pick up asset</button>\n          <label class="Form-fileLabel Form-fileLabel--error js-fileError"></label>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/map/image_picker/dropbox_template"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="ImportPanel ImportPanelService js-import-panel">\n  <div class="ImportPanel-header">\n    <h3 class="CDB-Text CDB-Size-large u-mainTextColor u-secondaryTextColor u-bSpace--m">Connect with Dropbox</h3>\n    <p class="CDB-Text CDB-Size-medium u-altTextColor u-bSpace--xl ImportPanel-headerDescription">JPG, GIF, PNG, SVG formats are supported </p>\n  </div>\n  <div class="ImportPanel-body">\n    <div class="ImportPanel-bodyWrapper">\n      <div class="ImportPanel-state is-active">\n        <div class="ImportPanel-actions">\n          <button class="Button Button--main ImportPanel-actionsButton js-fileButton">Pick up asset</button>\n          <label class="Form-fileLabel Form-fileLabel--error js-fileError"></label>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/map/image_picker/file_upload_template"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<form class="Form js-form">\n  <div class="ImportPanel-header">\n    <h3 class="CDB-Text CDB-Size-large u-mainTextColor u-secondaryTextColor u-bSpace--m">Upload a file or a URL</h3>\n    <p class="CDB-Text CDB-Size-medium u-altTextColor u-bSpace--xl ImportPanel-headerDescription">\n      Paste a URL ';
 if (fileEnabled) { ;
__p += 'or select a file like JPG, GIF, PNG, SVG';
 } ;
__p += '\n    </p>\n  </div>\n  <div class="Form-row Form-row--centered">\n    ';
 if (fileEnabled) { ;
__p += '\n      <div class="Form-rowData Form-rowData--med Form-rowData--noMargin js-dropzone">\n        <div class="Form-upload">\n          <label class="Form-fileLabel js-fileLabel">Drag & drop your file</label>\n          <label class="Form-fileLabel Form-fileLabel--error CDB-Text CDB-Size-small js-fileError"></label>\n          <div class="Form-file">\n            <input type="file" class="js-fileInput" accept=".jpg,.gif,.png,.svg" />\n            <span class="Button Button--main Form-fileButton js-fileButton">browse</span>\n          </div>\n        </div>\n      </div>\n      <span class="u-lSpace--xl u-rSpace--xl u-flex u-alignCenter CDB-Text CDB-Size-medium u-altTextColor">or</span>\n    ';
 } ;
__p += '\n    <div class="Form-rowData Form-rowData--noMargin Form-rowData--med">\n      <input type="text" class="Form-input Form-input--med has-submit js-textInput" placeholder="https://carto.com/logo.png" />\n      <button type="submit" class="Button Button--secondaryBlue Form-inputSubmit"><span>submit</span></button>\n      <div class="CDB-Text Form-inputError">Error. Your URL doesn’t look correct.</div>\n    </div>\n  </div>\n</form>\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/map/image_picker/footer_template"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="CreateDialog-footerShadow CreateDialog-footerShadow--tall"></div>\n<div class="CreateDialog-footerLine"></div>\n<div class="CreateDialog-footerInner ">\n  <div class="js-footer-info CreateDialog-footerInfo">' +
((__t = ( disclaimer )) == null ? '' : __t) +
'</div>\n  <div class="CreateDialog-footerActions">\n    <button class="js-ok Button Button--main ';
 if (!submit_enabled) { ;
__p += 'is-disabled';
 } ;
__p += '">\n      <span>' +
__e( action ) +
'</span>\n    </button>\n  </div>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/map/image_picker/navigation_template"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<span class="Filters-separator"></span>\n<div class="Filters-row">\n  <ul class="Filters-group">\n    ';
 if (kind == 'marker') { ;
__p += '\n    <li class="Filters-typeItem">\n      <button data-type="simple_icons" class="Filters-typeLink js-item' +
__e( pane === 'simple_icons' ? ' is-selected' : '' ) +
'">\n        Simple icons\n      </button>\n    </li>\n    <li class="Filters-typeItem">\n      <button data-type="pin_icons" class="Filters-typeLink js-item' +
__e( pane === 'pin_icons' ? ' is-selected' : '' ) +
'">\n        Pin icons\n      </button>\n    </li>\n    <li class="Filters-typeItem">\n      <button data-type="maki_icons" class="Filters-typeLink js-item' +
__e( pane === 'maki_icons' ? ' is-selected' : '' ) +
'">\n        Maki icons\n      </button>\n    </li>\n    ';
 } ;
__p += '\n    ';
 if (kind == 'pattern') { ;
__p += '\n    <li class="Filters-typeItem">\n      <button data-type="patterns" class="Filters-typeLink js-item' +
__e( pane === 'patterns' ? ' is-selected' : '' ) +
'">\n        CARTO Patterns Library\n      </button>\n    </li>\n    ';
 } ;
__p += '\n  </ul>\n  <ul class="Filters-group">\n    <li class="Filters-typeItem">\n      <button data-type="your_icons" class="Filters-typeLink is-disabled js-your-icons' +
__e( pane === 'your_icons' ? ' is-selected' : '' ) +
'">\n        Your icons\n      </button>\n    </li>\n    <li class="Filters-typeItem">\n      <button data-type="upload_file" class="Filters-typeLink js-item' +
__e( pane === 'upload_file' ? ' is-selected' : '' ) +
'">\n        Upload file\n      </button>\n    </li>\n    ';
 if (dropbox_enabled) { ;
__p += '\n    <li class="Filters-typeItem">\n      <button data-type="dropbox" class="Filters-typeLink js-item' +
__e( pane === 'dropbox' ? ' is-selected' : '' ) +
'">\n        Dropbox\n      </button>\n    </li>\n    ';
 } ;
__p += '\n  </ul>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/map/image_picker/remove_asset"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<ul>\n  <li><a class="small red" href="#/remove-asset">Delete this...</a></li>\n</ul>';

}
return __p
};

this["JST"]["cartodb/common/dialogs/map/image_picker/static_assets_item"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<a href="#/select-asset" class="image" style="background-image:url(' +
__e( public_url ) +
')" title="' +
__e( name ) +
'"></a>\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/map/image_picker/user_icons_template"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<ul class="AssetsList"></ul>\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/map/image_picker_template"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="Dialog-header Dialog-header--expanded CreateDialog-header">\n  <ul class="CreateDialog-headerSteps">\n    <li class="CreateDialog-headerStep is-selected">\n      <div class="Dialog-headerIcon Dialog-headerIcon--neutral">\n        <i class="CDB-IconFont CDB-IconFont-marker"></i>\n      </div>\n      <p class="Dialog-headerTitle">Select a ' +
__e( kind ) +
' image</p>\n      <p class="Dialog-headerText">Upload your icons or just use our nice selection.</p>\n    </li>\n  </ul>\n</div>\n<div class="js-content-container Dialog-body Dialog-body--expanded Dialog-body--create">\n  <div class="Filters Filters--navListing js-navigation"></div>\n  <div class="AssetsContent Dialog-bodyInnerExpandedWithSubFooter"></div>\n</div>\n\n<div class="Dialog-footer Dialog-footer--expanded CreateDialog-footer js-footer"></div>\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/map/scratch_view_template"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="Dialog-header u-inner">\n  <div class="Dialog-headerIcon Dialog-headerIcon--neutral">\n    <i class="CDB-IconFont CDB-IconFont-fountainPen"></i>\n  </div>\n\n  <p class="Dialog-headerTitle">Start by adding points, lines or polygons.</p>\n  <p class="Dialog-headerText Dialog-headerText--ellipsis Dialog-headerText--centered Dialog-headerText--small ">Select the geometry type that you want to have in "' +
__e( name ) +
'"</p>\n</div>\n\n<div class="Dialog-body u-inner OptionCards">\n  <div class="Dialog-Stretcher Dialog-Stretcher--small">\n    <div class="OptionCard js-option" data-type="point">\n      <div class="OptionCard-icon IllustrationIcon IllustrationIcon--geometryPoint"></div>\n      <div class="CDB-Text CDB-Size-large u-mainTextColor u-bSpace--m">Add points</div>\n      <div class="CDB-Text CDB-Size-medium u-altTextColor">Useful to mark POIs or specific places</div>\n    </div>\n    <div class="OptionCard js-option" data-type="line">\n      <div class="OptionCard-icon IllustrationIcon IllustrationIcon--geometryLine"></div>\n      <div class="CDB-Text CDB-Size-large u-mainTextColor u-bSpace--m">Add lines</div>\n      <div class="CDB-Text CDB-Size-medium u-altTextColor">Perfect for representing roads, rivers or tracks</div>\n    </div>\n    <div class="OptionCard js-option" data-type="polygon">\n      <div class="OptionCard-icon IllustrationIcon IllustrationIcon--geometryPolygon"></div>\n      <div class="CDB-Text CDB-Size-large u-mainTextColor u-bSpace--m">Add polygons</div>\n      <div class="CDB-Text CDB-Size-medium u-altTextColor">Great for mapping buildings or other kinds of areas</div>\n    </div>\n  </div>\n</div>\n\n<div class="Dialog-footer Dialog-footer Dialog-footer--simple u-inner">\n  ';
 if (skipDisabled) { ;
__p += '\n  <button class="Button Button--secondary close">\n    <span>Close</span>\n  </button>\n  ';
 } else { ;
__p += '\n  <button class="Button Button--secondary ok js-skip">\n    <span>Skip</span>\n  </button>\n  ';
 } ;
__p += '\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/merge_datasets/column_merge/choose_key_columns"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="MergeDatasets">\n  <div class="MergeDatasets-list">\n    <div class="MergeDatasets-select js-left-table"></div>\n    <div class="js-left-columns"></div>\n  </div>\n\n  <div class="MergeDatasets-list MergeDatasets-list--2nd">\n    <div class="MergeDatasets-select js-right-tables"></div>\n    <div class="js-right-columns"></div>\n  </div>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/merge_datasets/column_merge/footer_info"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="Puzzle">\n  <div class="Puzzle-piece connect-right js-left-key-column">' +
__e( leftKeyColumnName ) +
'</div>\n  <div class="Puzzle-piece Puzzle-piece--inset">\n    <div class="Puzzle-pieceIcon">\n      <i class="CDB-IconFont CDB-IconFont-tieFighter CDB-IconFont--super"></i>\n    </div>\n  </div>\n  <div class="Puzzle-piece connect-left js-right-key-column ' +
__e( rightKeyColumnName ? '' : 'is-placeholder' ) +
'">' +
__e( rightKeyColumnName ) +
'</div>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/merge_datasets/column_merge/select_columns"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="MergeDatasets">\n  <div class="js-sticky-header"></div>\n  <div class="MergeDatasets-list">\n    <div class="List List--selections">\n      <div class="List-row">\n        <div class="List-rowItem List-rowItem--compact List-rowItem--withoutBottomBorder List-rowItem--withoutBottomPadding js-left-table"></div>\n      </div>\n      <div class="List-row is-disabled">\n        <div class="List-rowItem List-rowItem--compact">\n          <div class="MergeDatasets-rowItem">\n            <div class="MergeDatasets-rowItemRadio">\n              <div class="RadioButton">\n                <button class="RadioButton-input is-checked is-disabled" />\n              </div>\n            </div>\n            <div>\n              <div class="DefaultTitle">' +
__e( leftKeyColumn.get('name') ) +
'</div>\n              <p class="DefaultParagraph DefaultParagraph--tertiary">' +
__e( leftKeyColumn.get('type') ) +
'</p>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n    <div class="js-left-columns"></div>\n  </div>\n\n  <div class="MergeDatasets-list MergeDatasets-list--2nd">\n    <div class="List List--selections">\n      <div class="List-row">\n        <div class="List-rowItem List-rowItem--compact List-rowItem--withoutBottomBorder List-rowItem--withoutBottomPadding js-right-table"></div>\n      </div>\n      <div class="List-row is-disabled">\n        <div class="List-rowItem List-rowItem--compact">\n          <div class="MergeDatasets-rowItem">\n            <div class="MergeDatasets-rowItemRadio">\n              <div class="RadioButton">\n                <button class="RadioButton-input is-checked is-disabled" />\n              </div>\n            </div>\n            <div>\n              <div class="DefaultTitle">' +
__e( rightKeyColumn.get('name') ) +
'</div>\n              <p class="DefaultParagraph DefaultParagraph--tertiary">' +
__e( rightKeyColumn.get('type') ) +
'</p>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n    <div class="js-right-columns"></div>\n  </div>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/merge_datasets/column_selector"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="List-rowItem List-rowItem--compact">\n  <div class="MergeDatasets-rowItem">\n    ';
 if (selectorType === 'radio') { ;
__p += '\n      <div class="MergeDatasets-rowItemRadio">\n        <div class="RadioButton">\n          <button class="RadioButton-input js-radio" />\n        </div>\n      </div>\n    ';
 } ;
__p += '\n    <div>\n      <div class="DefaultTitle">' +
__e( columnName ) +
'</div>\n      <p class="DefaultParagraph DefaultParagraph--tertiary">' +
__e( columnType ) +
'</p>\n    </div>\n  </div>\n  <div>\n    ';
 if (selectorType === 'switch') { ;
__p += '\n      <div class="Toggler">\n        <input type="checkbox" class="js-switch" />\n        <label />\n      </div>\n    ';
 } ;
__p += '\n  </div>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/merge_datasets/columns_selector_toggle_all"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="MergeDatasets-list MergeDatasets-fixedAboveFooter">\n  <div class="List-row">\n    <div class="List-rowItem List-rowItem--compact">\n      <div></div>\n      <div class="MergeDatasets-rowItem">\n        <div class="DefaultParagraph--tertiary MergeDatasets-selectAllText">Select all columns</div>\n        <div class="Toggler js-select-all">\n          <input type="checkbox" ' +
__e( areAllSelected ? 'checked="checked"' : '' ) +
' />\n          <label />\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/merge_datasets/footer"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="Dialog-footer Dialog-footer--expanded CreateDialog-footer">\n  <div>\n    <div class="CreateDialog-footerShadow"></div>\n    <div class="CreateDialog-footerLine"></div>\n    <div class="CreateDialog-footerInner ">\n      <div class="CreateDialog-footerInfo js-info"></div>\n      <div class="CreateDialog-footerActions">\n        <button class="Button Button--main is-disabled js-next">\n          <span>' +
__e( nextLabel ) +
'</span>\n        </button>\n      </div>\n    </div>\n  </div>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/merge_datasets/merge_datasets_content"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="Dialog-content Dialog-content--expanded">\n\n  <div class="Dialog-contentWrapper">\n    ';
 if (currentStep) { ;
__p += '\n      <button class="NavButton Dialog-backBtn js-back">\n        <i class="CDB-IconFont CDB-IconFont-arrowPrev"></i>\n      </button>\n    ';
 } ;
__p += '\n\n    <div class="Dialog-header Dialog-header--expanded ' +
__e( currentStep ? 'CreateDialog-header' : '' ) +
'">\n      <ul class="CreateDialog-headerSteps">\n        ';
 if (currentStep) { ;
__p += '\n          ';
 headerSteps.forEach(function(d, i) { ;
__p += '\n            <li class="CreateDialog-headerStep ' +
__e( d.isCurrent ? 'is-selected' : '' ) +
'">\n              <div class="Dialog-headerIcon">\n                <i class="CDB-IconFont ' +
__e( d.icon ) +
'"></i>\n                ';
 if (d.isFinished) { ;
__p += '\n                  <span class="Badge Dialog-headerIconBadge">\n                    <i class="CDB-IconFont CDB-IconFont-check"></i>\n                  </span>\n                ';
 } ;
__p += '\n              </div>\n              <p class="Dialog-headerTitle">' +
__e( d.title ) +
'</p>\n              <p class="Dialog-headerText">Step ' +
__e( i + 2 ) +
' of ' +
__e( headerSteps.length + 1 ) +
'</p>\n            </li>\n          ';
 }) ;
__p += '\n        ';
 } else { ;
__p += '\n          <li class="CreateDialog-headerStep CreateDialog-headerStep--single is-selected">\n            <div class="Dialog-headerIcon Dialog-headerIcon--neutral">\n              <i class="CDB-IconFont CDB-IconFont-mergeArrow"></i>\n            </div>\n            <p class="Dialog-headerTitle">Merge with another table</p>\n            <p class="Dialog-headerText">Merging is useful if you want to combine data from two datasets into a single new one.</p>\n            <p class="Dialog-headerText">You can merge datasets by a column attribute or as a spatial intersection.</p>\n          </li>\n        ';
 } ;
__p += '\n      </ul>\n    </div>\n\n    <div class="Dialog-body Dialog-body--expanded Dialog-body--create js-scroll">\n      <div class="Dialog-bodyInnerExpandedWithPreFooter u-inner">\n        ';
 if (currentStep) { ;
__p += '\n          <div class="MergeDatasets-instructions">\n            <p class="DefaultParagraph">' +
((__t = ( currentStep.INSTRUCTIONS_SAFE_HTML || '' )) == null ? '' : __t) +
'</p>\n          </div>\n          <div class="js-details"></div>\n        ';
 } else { ;
__p += '\n          <div class="OptionCards js-flavors"></div>\n        ';
 } ;
__p += '\n      </div>\n    </div>\n\n  </div>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/merge_datasets/merge_flavor"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="OptionCard-icon IllustrationIcon ' +
__e( illustrationIconType ) +
'">\n  <i class="CDB-IconFont ' +
__e( icon ) +
'"></i>\n</div>\n<div class="OptionCard-title">' +
__e( title ) +
'</div>\n<div class="OptionCard-desc">' +
__e( desc ) +
'</div>\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/merge_datasets/spatial_merge/footer_info"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="Puzzle">\n  <div class="Puzzle-piece connect-right">' +
__e( leftTableName ) +
'</div>\n  <div class="Puzzle-piece Puzzle-piece--inset">\n    <div class="MergeDatasets-puzzleMergeMethod js-merge-method-name"></div>\n  </div>\n  <div class="Puzzle-piece connect-left is-placeholder js-right"></div>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/merge_datasets/spatial_merge/spatial_merge"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="MergeDatasets">\n  <div class="js-sticky-header"></div>\n  <div class="MergeDatasets-list">\n    <div class="List List--selections">\n      <div class="List-row">\n        <div class="List-rowItem List-rowItem--compact List-rowItem--withoutBottomBorder List-rowItem--withoutBottomPadding js-left-table"></div>\n      </div>\n      <div class="List-row is-disabled">\n        <div class="List-rowItem List-rowItem--compact List-rowItem--compact">\n          <div class="MergeDatasets-rowItem">\n            <div class="MergeDatasets-rowItemRadio">\n              <div class="RadioButton">\n                <button class="RadioButton-input is-checked is-disabled" />\n              </div>\n            </div>\n            <div>\n              <div class="DefaultTitle">' +
__e( leftKeyColumn.get('name') ) +
'</div>\n              <p class="DefaultParagraph DefaultParagraph--tertiary">' +
__e( leftKeyColumn.get('type') ) +
'</p>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n    <div class="js-left-columns"></div>\n  </div>\n\n  <div class="MergeDatasets-list MergeDatasets-list--2nd">\n    ';
 if (hasSelectedRightTable) { ;
__p += '\n      <div class="List List--selections">\n        <div class="List-row">\n          <div class="List-rowItem List-rowItem--compact List-rowItem--withoutBottomBorder List-rowItem--withoutBottomPadding js-right-table"></div>\n        </div>\n        <div class="List-row is-disabled">\n          <div class="List-rowItem List-rowItem--compact List-rowItem--compact">\n            <div class="MergeDatasets-rowItem">\n              <div class="MergeDatasets-rowItemRadio">\n                <div class="RadioButton">\n                  <button class="RadioButton-input is-checked is-disabled" />\n                </div>\n              </div>\n              <div>\n                <div class="DefaultTitle">' +
__e( rightKeyColumn.get('name') ) +
'</div>\n                <p class="DefaultParagraph DefaultParagraph--tertiary">' +
__e( rightKeyColumn.get('type') ) +
'</p>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n    ';
 } else { ;
__p += '\n      <div class="List">\n        <div class="List-row">\n          <div class="List-rowItem List-rowItem--compact js-right-tables"></div>\n        </div>\n      </div>\n    ';
 } ;
__p += '\n\n    <div class="js-right-columns"></div>\n\n    ';
 if (hasSelectedRightTable) { ;
__p += '\n      <div class="List js-count-merge-method-info" style="display: none;">\n        <div class="List-row MergeDatasets-desc">\n          <i class="MergeDatasets-countDescIcon"></i>\n          <div class="MergeDatasets-countDesc">\n            <p class="DefaultParagraph">\n              Count the number of features in your dataset intersecting the geometries of your second dataset.\n            </p>\n          </div>\n        </div>\n      </div>\n      <div class="List MergeDatasets-list MergeDatasets-fixedAboveFooter">\n        <div class="List-row">\n          <div class="List-rowItem List-rowItem--compact List-rowItem--withoutSideMargins TabsPanel js-merge-methods"></div>\n        </div>\n      </div>\n    ';
 } ;
__p += '\n  </div>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/merge_datasets/sticky_header"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="u-inner MergeDatasets-stickyHeaderContent">\n\n  <div class="MergeDatasets-list MergeDatasets-list--sticky1st">\n    <div class="List-rowItem List-rowItem--compactSelected List-rowItem--compactSelected List-rowItem--withoutBottomBorder">\n      <div class="MergeDatasets-rowItem">\n        <div>\n          <div class="DefaultTitle">' +
__e( leftColumnName ) +
'</div>\n          <p class="DefaultParagraph DefaultParagraph--tertiary">' +
__e( leftColumnType ) +
'</p>\n        </div>\n      </div>\n    </div>\n  </div>\n\n  <div class="MergeDatasets-list MergeDatasets-list--sticky2nd">\n    <div class="List-rowItem List-rowItem--compactSelected List-rowItem--compactSelected List-rowItem--withoutBottomBorder">\n      <div class="MergeDatasets-rowItem">\n        ';
 if (addRadioPlaceholder) { ;
__p += '\n          <div class="MergeDatasets-radioPlaceholder"></div>\n        ';
 } ;
__p += '\n        <div>\n          <div class="DefaultTitle">' +
__e( rightColumnName ) +
'</div>\n          <p class="DefaultParagraph DefaultParagraph--tertiary">' +
__e( rightColumnType ) +
'</p>\n        </div>\n      </div>\n    </div>\n  </div>\n\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/pecan/card"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="MapCard">\n  <a href="#" class="MapCard-header js-header is-loading">\n    <div class="MapCard-loader js-loader"></div>\n    ';
 if (wizard === "Torque") { ;
__p += '\n      <span class="Pecan-TorqueWirzardIcon"></span>\n    ';
 };
__p += '\n  </a>\n  <div class="MapCard-content MapCard-content--small">\n    <div class="MapCard-contentBody">\n      <div class="MapCard-contentBodyRow">\n        <h3 class="DefaultTitle">\n          ';
 if (wizard === "Heatmap") { ;
__p += '\n          <a href="#" class="DefaultTitle-link u-ellipsLongText" title="' +
__e( wizard ) +
'"><strong>' +
__e( wizard ) +
'</strong></a>\n          ';
 } else { ;
__p += '\n          <a href="#" class="DefaultTitle-link u-ellipsLongText" title="' +
__e( wizard ) +
' on ' +
__e( column ) +
'">' +
__e( wizard ) +
' on <strong>' +
__e( column ) +
'</strong></a>\n          ';
 } ;
__p += '\n        </h3>\n      </div>\n    </div>\n    <div class="MapCard-contentFooter PecanCard-footer">\n      ';
 if (wizard === 'Choropleth') { ;
__p += '\n        <div class="HistogramGraph js-graph"></div>\n      ';
 } ;
__p += '\n      ';
 if (wizard === 'Category') { ;
__p += '\n        <ul class="CategoryList">\n          ';
 metadata.forEach(function(m) { ;
__p += '\n          <li class="CategoryList-item" style="background:' +
__e( m.color ) +
'"></li>\n          ';
 }) ;
__p += '\n        </ul>\n      ';
 } ;
__p += '\n      <span class="NullCount">\n        ' +
__e( null_count ) +
' null value' +
__e( null_count !== "1" ? 's' : '' ) +
'\n      </span>\n    </div>\n  </div>\n</div>\n\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/pecan/template"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="Dialog-header u-inner">\n  <div class="Dialog-headerIcon Dialog-headerIcon Dialog-headerIcon--neutral">\n    <i class="CDB-IconFont CDB-IconFont-wizard"></i>\n  </div>\n  <p class="Dialog-headerTitle">Select a default style for your new layer</p>\n  <p class="Dialog-headerText">We\'ve created a set of possible maps based on your data. Select one or just start with the simple one.</p>\n</div>\n\n<div class="MapsGallery">\n  <div class="PecanMap-navigation js-navigation">\n    <button class="Button NavButton PecanMap-navigationButton PecanMap-navigationButton--prev js-goPrev">\n      <i class="CDB-IconFont CDB-IconFont-arrowPrev"></i>\n    </button>\n    <button class="Button NavButton PecanMap-navigationButton PecanMap-navigationButton--next js-goNext">\n      <i class="CDB-IconFont CDB-IconFont-arrowNext"></i>\n    </button>\n  </div>\n  <ul class="PecanMap-MapsList js-map-list"></ul>\n</div>\n\n<div class="Dialog-footer Dialog-footer--simple u-inner">\n  <button class="Button Button--secondary ok js-skip">\n    <span>Skip</span>\n  </button>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/publish/options/cdb"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="OptionCard-icon IllustrationIcon IllustrationIcon--lingon">\n  <i class="CDB-IconFont CDB-IconFont-tools"></i>\n</div>\n<p class="OptionCard-title">CartoDB.js</p>\n<p class="OptionCard-desc">\n  Add your map to your applications by using this URL.\n  <a href="https://docs.carto.com/cartodb-platform/cartodb-js.html" target="_blank">Read more</a>\n</p>\n<input type="text" value="' +
__e( model.get('vizjsonURL') ) +
'" class="Publish-copyableInput Input Input--slim" />\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/publish/options/embed"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="OptionCard-icon IllustrationIcon IllustrationIcon--royal">\n  <i class="CDB-IconFont CDB-IconFont-jigsaw CDB-IconFont--super"></i>\n</div>\n';
 if (model.get('isPrivacyPrivate')) { ;
__p += '\n  <p class="OptionCard-title">Your map is private</p>\n  <p class="OptionCard-desc">Change your <a href="#" class="js-change-privacy">privacy settings</a> to embed your map. Right now it\'s private.</p>\n';
 } else { ;
__p += '\n  <p class="OptionCard-title">Embed it</p>\n  <p class="OptionCard-desc">\n    Publish your map on your blog or website.<br />\n    <a href="' +
__e( encodeURI(model.get('embedURL')) ) +
'" target="_blank">Go to your map</a>\n  </p>\n  <input type="text" class="Publish-copyableInput Input Input--slim"\n    value="' +
__e( '<iframe width="100%" height="520" frameborder="0" src="' + encodeURI(model.get('embedURL')) + '" allowfullscreen webkitallowfullscreen mozallowfullscreen oallowfullscreen msallowfullscreen></iframe>' ) +
'" />\n';
 } ;
__p += '\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/publish/options/public_url"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="OptionCard-icon IllustrationIcon IllustrationIcon--positive">\n  <i class="CDB-IconFont CDB-IconFont-anchor"></i>\n</div>\n';
 if (model.get('isPrivacyPrivate')) { ;
__p += '\n  <p class="OptionCard-title">Your map is private</p>\n  <p class="OptionCard-desc">Change your <a href="#" class="js-change-privacy">privacy settings</a> to share your map. Right now it\'s private.</p>\n';
 } else { ;
__p += '\n  <p class="OptionCard-title">Get the link</p>\n  <p class="OptionCard-desc">Share it with your friends or co-workers, or post it in your social networks.</p>\n  <input type="text" value="' +
__e( model.get('url') ) +
'" class="Publish-copyableInput Input Input--slim" />\n';
 } ;
__p += '\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/publish/publish"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div>\n  <div class="Dialog-header u-inner">\n    <div class="Dialog-headerIcon Dialog-headerIcon--neutral">\n      <i class="CDB-IconFont CDB-IconFont-outside"></i>\n    </div>\n    <p class="Dialog-headerTitle">Publish your map</p>\n    <p class="Dialog-headerText">Share the link, embed it in your website or develop a cartodb.js application with it.</p>\n  </div>\n\n  <div class="js-publish-options Dialog-body OptionCards">\n  </div>\n\n  <div class="Dialog-footer Dialog-footer--simple u-inner">\n    <button class="Button Button--secondary Dialog-footerBtn cancel">\n      <span>cancel</span>\n    </button>\n  </div>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/static_image/advanced_export_view"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="u-inner">\n  <div class="Dialog-header">\n    <div class="Dialog-headerIcon Dialog-headerIcon--neutral">\n      <i class="CDB-IconFont CDB-IconFont-download"></i>\n    </div>\n    <p class="Dialog-headerTitle">Export custom image size</p>\n    <p class="Dialog-headerText Dialog-headerText--ellipsis Dialog-headerText--centered Dialog-headerText--small ">The image will be centered using the map\'s current center and won\'t export your widgets.<br />Please, be sure you have the pop-up blocker deactivated for this site.</p>\n  </div>\n  <div class="Dialog-body Dialog-body--small">\n\n    <form class="Form js-form">\n      <div class="Form-row Form-row--centered">\n\n        <div class="Form-rowLabel Form-rowLabel--export">\n          <label class="Form-label">Width</label>\n        </div>\n\n        <div class="Form-rowData Form-rowData--export">\n          <div class="Form-inputField Form-inputField--withLabel">\n            <input type="text" class="Form-input Form-input--shorter js-width js-textInput" value="' +
__e( width ) +
'" /> <span class="Form-inputLabel">px</span>\n          </div>\n          <label class="Form-label">Height</label>\n          <div class="Form-inputField Form-inputField--withLabel">\n            <input type="text" class="Form-input Form-input--shorter js-height js-textInput" value="' +
__e( height ) +
'" /> <span class="Form-inputLabel">px</span>\n          </div>\n        </div>\n\n      </div>\n\n      <div class="Form-row Form-row--centered">\n        <div class="Form-rowLabel Form-rowLabel--export">\n          <label class="Form-label">Format</label>\n        </div>\n\n        <div class="Form-rowData Form-rowData--export">\n          <ul class="ExportImage-formatList">\n            <li class="ExportImage-formatItem">\n              <div class="RadioButton RadioButton--export js-format" data-format="png">\n                <button class="RadioButton-input ';
 if (format == 'png') {;
__p += 'is-checked';
 } ;
__p += ' js-radioButton js-png"></button>\n                <label class="RadioButton-label">.png</label>\n              </div>\n            </li>\n            <li class="ExportImage-formatItem">\n              <div class="RadioButton RadioButton--export js-format" data-format="jpg">\n                <button class="RadioButton-input ';
 if (format == 'jpg') {;
__p += 'is-checked';
 } ;
__p += ' js-radioButton js-jpg"></button>\n                <label class="RadioButton-label">.jpg</label>\n              </div>\n            </li>\n          </ul>\n        </div>\n      </div>\n\n    </form>\n\n  </div>\n  <div class="Dialog-footer Dialog-footer--small Dialog-footer Dialog-footer--simple u-inner">\n    <button class="Button Button--main ok js-ok">\n      <span>Export</span>\n    </button>\n  </div>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/static_image/export_image_result_view"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="u-inner">\n  <div class="Dialog-header">\n    <div class="Dialog-headerIcon Dialog-headerIcon--neutral">\n      <i class="CDB-IconFont CDB-IconFont-ray"></i>\n    </div>\n    <p class="Dialog-headerTitle">Your image has been generated correctly</p>\n    ';
 if (response.type === 'url') {;
__p += '\n    <p class="Dialog-headerText">It\'s now available in: <a href="' +
__e( response.content ) +
'" target="_blank" class="ExportImageResult--url" download="' +
__e( response.filename ) +
'">' +
__e( response.displayedLink ) +
'</a></p>\n    ';
 } else { ;
__p += '\n    <p class="Dialog-headerText">To embed it in your website, use the code below</p>\n  </div>\n  <div class="Dialog-body">\n    <div class="Dialog-Stretcher Dialog-Stretcher--medium">\n\n      <form class="Form js-form">\n        ';
 for (var i = 0; i < response.content.length; ++i) { ;
__p += '\n        <div class="Form-row">\n          <div class="Form-rowLabel">\n            <label class="Form-label">' +
__e( response.content[i].title ) +
'</label>\n          </div>\n          <div class="Form-rowData Form-rowData--longer">\n            <input type="text" class="Input js-input StaticImageResponse--input" value="' +
__e( response.content[i].html ) +
'" />\n          </div>\n        </div>\n        ';
 } ;
__p += '\n      </form>\n\n    </div>\n    ';
 } ;
__p += '\n  </div>\n  <div class="Dialog-footer Dialog-footer--simple">\n\n    ';
 if (response.type === 'url') {;
__p += '\n    <a href="' +
__e( response.content ) +
'" target="_blank" class="Button Button--secondary js-open-image">\n      <span>view image</span>\n    </a>\n    ';
 } else { ;
__p += '\n    <button class="Button Button--secondary Dialog-footerBtn cancel">\n      <span>close</span>\n    </button>\n    ';
 } ;
__p += '\n  </div>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/sync_dataset/interval_template"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="RadioButton js-interval' +
__e( disabled ? ' is-disabled' : '' ) +
'' +
__e( checked ? ' is-checked' : '' ) +
'' +
__e( interval === 0 ? ' is-alert' : '' ) +
'">\n  <button class="RadioButton-input js-input' +
__e( checked ? ' is-checked' : '' ) +
'"></button>\n  <label class="RadioButton-label">' +
__e( name ) +
'</label>\n</div>\n\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/sync_dataset/sync_dataset"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="Dialog-header u-inner">\n  <div class="Dialog-headerIcon Dialog-headerIcon--neutral">\n    <i class="CDB-IconFont CDB-IconFont-alarm"></i>\n  </div>\n  <h4 class="Dialog-headerTitle">Sync dataset options</h4>\n  <p class="Dialog-headerText Dialog-headerText--ellipsis Dialog-headerText--centered Dialog-headerText--small" title="' +
__e( url ) +
'">\n    Your dataset is in sync with a ' +
__e( service ) +
' file: <br/>' +
__e( url ) +
'\n  </p>\n</div>\n<div class="Dialog-body Dialog-body--small">\n  <div class="Form-row">\n    <div class="Form-rowLabel Form-rowLabel--leftAligned">\n      <label class="Form-label Form-label--large">Sync my data</label>\n    </div>\n    <div class="Form-rowData Form-rowData--noMargin Form-rowData--full">\n      <ul class="DatasetSelected-syncOptionsList DatasetSelected-syncOptionsList--syncView js-intervals"></ul>\n    </div>\n  </div>\n</div>\n\n<div class="Dialog-footer Dialog-footer--small Dialog-footer Dialog-footer--simple u-inner">\n  <button class="Button Button--main ok">\n    <span>Save settings</span>\n  </button>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/dialogs/video_tutorial/video_tutorial_footer_template"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 if (isVideoSelected) { ;
__p += '\n  <div class="Dialog-footer u-inner u-flex u-alignCenter u-justifySpace">\n    <div class="u-flex u-alignCenter CDB-Text CDB-Size-medium u-altTextColor">\n      <i class="CDB-IconFont CDB-IconFont-info VideoTutorial-footerInfoIcon HighlightIcon HighlightIcon--warning"></i>Take your time to watch this tutorial or skip it and start creating your map now\n    </div>\n    <button class="CDB-Button CDB-Button--secondary js-start">\n      <span class="CDB-Button-Text CDB-Text is-semibold CDB-Size-medium u-upperCase">start guided tutorial</span>\n    </button>\n  </div>\n';
 } ;


}
return __p
};

this["JST"]["cartodb/common/dialogs/video_tutorial/video_tutorial_header_template"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="Dialog-headerIcon Dialog-headerIcon--neutral u-flex u-alignCenter u-justifyCenter">\n  <i class="CDB-IconFont CDB-IconFont-play Videotutorial-headerIcon"></i>\n</div>\n<h4 class="CDB-Text CDB-Size-large u-mainTextColor u-secondaryTextColor u-bSpace--m">Create a map with a video-tutorial</h4>\n<p class="CDB-Text CDB-Size-medium u-altTextColor">We can help you to create your map with one of our video-tutorials.</p>\n\n';
 if (isVideoSelected) { ;
__p += '\n  <button class="Dialog-backBtn js-back u-actionTextColor">\n    <i class="CDB-IconFont CDB-IconFont-arrowPrev"></i>\n  </button>\n';
 } ;


}
return __p
};

this["JST"]["cartodb/common/dialogs/video_tutorial/video_tutorial_item_template"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<button class="VideoTutorial-itemButton js-button">\n  <i\n    class="\n      ';
 if (icon) { ;
__p += '\n        CDB-IconFont CDB-IconFont-' +
__e( icon ) +
'\n      ';
 } ;
__p += '\n      VideoTutorial-itemIcon\n    "\n    style="border-color: ' +
__e( color ) +
'; color: ' +
__e( color ) +
'"\n  ></i>\n  <h6 class="VideoTutorial-itemTitle CDB-Text CDB-size-large u-mainTextColor">' +
__e( shortName ) +
'</h6>\n  <p class="VideoTutorial-itemDes CDB-Text CDB-Size-medium u-altTextColor">' +
__e( shortDescription ) +
'</p>\n  ';
 if (difficulty || duration) { ;
__p += '\n    <div class="VideoTutorial-itemInfo CDB-Text CDB-Size-small u-hintTextColor">\n      <label class="VideoTutorial-itemDifficulty">' +
__e( difficulty ) +
'</label>\n      ';
 if (duration) { ;
__p += '\n        <label class="VideoTutorial-itemDuration">\n          <i class="CDB-IconFont CDB-IconFont-clock VideoTutorial-itemDurationIcon"></i>\n          <span class="VideoTutorial-itemDurationText">' +
__e( duration ) +
'</span>\n        </label>\n      ';
 } ;
__p += '\n    </div>\n  ';
 } ;
__p += '\n</button>';

}
return __p
};

this["JST"]["cartodb/common/dialogs/video_tutorial/video_tutorial_preview_template"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="MapTemplate">\n  <div class="MapTemplate-info">\n    <h4 class="CDB-Text CDB-Size-large u-mainTextColor u-bSpace--xl">' +
__e( name ) +
'</h4>\n    <p class="CDB-Text CDB-Size-medium u-secondaryTextColor">' +
__e( description ) +
'</p>\n    <ul class="MapTemplate-infoList CDB-Text CDB-Size-small">\n      ';
 var i = 0; ;
__p += '\n      ';
 if (typeof map.source != "undefined") { ;
__p += '\n        ';
 for (var i = 0, l = map.source.length; i < l; i++) { ;
__p += '\n          <li class="MapTemplate-infoDataset">\n            <span class="MapTemplate-infoDatasetPos">' +
__e( i + 1 ) +
'</span>\n            <a target="_blank" class="MapTemplate-infoDatasetLink" href="' +
__e( map.source[i] ) +
'">Get ';
 if (l > 1) { ;
__p +=
__e( cdb.Utils.getGetOrdinal( i + 1 ) );
 } ;
__p += ' dataset</a>\n          </li>\n        ';
 } ;
__p += '\n      ';
 } ;
__p += '\n      ';
 if (typeof map.url != "undefined") { ;
__p += '\n        <li class="MapTemplate-infoDataset">\n          <span class="MapTemplate-infoDatasetPos">' +
__e( i + 1 ) +
'</span>\n          <a class="MapTemplate-infoDatasetLink" target="_blank" href="' +
__e( map.url ) +
'">View resulting map</a>\n        </li>\n      ';
 } ;
__p += '\n    </ul>\n    <div class="MapTemplate-infoSteps"></div>\n  </div>\n  <div class="MapTemplate-video">\n    <iframe class="MapTemplate-videoIframe" src="//player.vimeo.com/video/' +
__e( videoId ) +
'?api=1" width="620" height="350"></iframe>\n  </div>\n</div>';

}
return __p
};

this["JST"]["cartodb/common/dialogs/video_tutorial/video_tutorial_template"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="Dialog-header VideoTutorial-header"></div>\n<div class="Dialog-body VideoTutorial-content"></div>\n<div class="VideoTutorial-footer"></div>';

}
return __p
};

this["JST"]["cartodb/common/edit_fields/boolean_field/boolean_field"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="RadioButton EditField-radiobutton js-true ';
 if (readOnly) { ;
__p += ' is-disabled ';
 } ;
__p += '">\n  <button class="RadioButton-input ';
 if (value === true) { ;
__p += ' is-checked ';
 } ;
__p += '"></button>\n  <label class="RadioButton-label">True</label>\n</div>\n<div class="RadioButton EditField-radiobutton js-false ';
 if (readOnly) { ;
__p += ' is-disabled ';
 } ;
__p += '">\n  <button class="RadioButton-input ';
 if (value === false) { ;
__p += ' is-checked ';
 } ;
__p += '"></button>\n  <label class="RadioButton-label">False</label>\n</div>\n<div class="RadioButton EditField-radiobutton js-null ';
 if (readOnly) { ;
__p += ' is-disabled ';
 } ;
__p += '">\n  <button class="RadioButton-input ';
 if (value === null) { ;
__p += ' is-checked ';
 } ;
__p += '"></button>\n  <label class="RadioButton-label">Null</label>\n</div>';

}
return __p
};

this["JST"]["cartodb/common/edit_fields/date_field/date_picker/calendar_dropdown"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="DatePicker">\n  <div class="js-calendar DatePicker-calendar DatePicker-calendar--simple"></div>\n</div>';

}
return __p
};

this["JST"]["cartodb/common/edit_fields/date_field/date_picker/date_picker"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<button class="js-date-picker DatePicker-dates DatePicker-dates--singleDate has-icon ';
 if (readOnly) { ;
__p += ' is-disabled ';
 } ;
__p += '">\n  <strong class="js-date-str">' +
__e( date ) +
'</strong>\n  <i class="CDB-IconFont CDB-IconFont-calendar DatePicker-datesIcon"></i>\n</button>';

}
return __p
};

this["JST"]["cartodb/common/edit_fields/date_field/time_input/time_input"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<input type="text" class="Form-input Form-input--short Form-input--noBorder Form-input--noBkg has-icon js-input ';
 if (readOnly) { ;
__p += ' is-disabled ';
 } ;
__p += '" value="' +
__e( time ) +
'" ';
 if (readOnly) { ;
__p += ' readonly ';
 } ;
__p += ' />\n<i class="CDB-IconFont CDB-IconFont-clock Form-inputIcon Form-inputIcon--clock"></i>';

}
return __p
};

this["JST"]["cartodb/common/edit_fields/edit_field"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<input type="text" class="Form-input" value="' +
__e( value ) +
'" ';
 if (readOnly) { ;
__p += ' readonly ';
 } ;
__p += '/>\n';

}
return __p
};

this["JST"]["cartodb/common/edit_fields/number_field/number_field"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<input type="text" class="Form-input EditField-input is-number js-input ';
 if (readOnly) { ;
__p += ' is-disabled ';
 } ;
__p += '" value="' +
__e( value ) +
'" ';
 if (readOnly) { ;
__p += ' readonly ';
 } ;
__p += '/>';

}
return __p
};

this["JST"]["cartodb/common/edit_fields/string_field/string_field"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<textarea\n  class="Form-input Form-textarea EditField-textarea js-textarea ';
 if (readOnly) { ;
__p += ' is-disabled ';
 } ;
__p += '"\n  ';
 if (readOnly) { ;
__p += ' readonly ';
 } ;
__p += '\n>' +
__e( value ) +
'</textarea>';

}
return __p
};

this["JST"]["cartodb/common/mamufas_import/mamufas_import_dialog"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="CDB-Text Dialog-header MamufasDialog-header">\n  <div class="Dialog-headerIcon Dialog-headerIcon--neutral">\n    <i class="CDB-IconFont CDB-IconFont-step"></i>\n  </div>\n  <p class="Dialog-headerTitle">Drag and drop your data to this window</p>\n  <p class="Dialog-headerText">Drop your file to connect a new dataset.</p>\n</div>\n<div class="Dialog-body Dialog-body--expanded MamufasDialog-body">\n  <div class="MamufasDialog-dropZone">\n    <i class="CDB-IconFont CDB-IconFont-addDocument MamufasDialog-dropZoneIcon"></i>\n  </div>\n</div>\n<div class="CDB-Text Dialog-footer Dialog-footer--expanded MamufasDialog-footer">\n  <p class="MamufasDialog-footerInfo">\n    <i class="CDB-IconFont CDB-IconFont-info MamufasDialog-footerInfoIcon"></i>\n    Files like CSV, GPX, XLS and many more are supported\n  </p>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/templates/fail"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="IntermediateInfo">\n  <div class="LayoutIcon LayoutIcon--negative">\n    <i class="CDB-IconFont CDB-IconFont-cockroach"></i>\n  </div>\n  <h4 class="CDB-Text CDB-Size-large u-mainTextColor u-secondaryTextColor u-bSpace--m u-tSpace-xl">Oouch! There has been an error</h4>\n  ';
 if (msg) { ;
__p += '\n    <p class="CDB-Text CDB-Size-medium u-altTextColor">' +
((__t = ( msg )) == null ? '' : __t) +
'</p>\n  ';
 } ;
__p += '\n  <p class="CDB-Text CDB-Size-medium u-altTextColor">If the problem persists contact us at <a class="js-mail-link" href="mailto:support@carto.com">support@carto.com</a>.</p>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/templates/loading"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="IntermediateInfo">\n  <div class="Spinner"></div>\n  <h4 class="CDB-Text CDB-Size-large u-mainTextColor u-secondaryTextColor u-bSpace--m u-tSpace-xl">' +
__e( title ) +
'</h4>\n  <div class="DefaultParagraph DefaultParagraph--short CDB-Text CDB-Size-medium u-altTextColor">' +
((__t = ( quote )) == null ? '' : __t) +
'</div>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/templates/no_results"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="IntermediateInfo">\n  <div class="LayoutIcon">\n    <i class="CDB-IconFont ' +
__e( icon ) +
'"></i>\n  </div>\n  <h4 class="CDB-Text CDB-Size-large u-mainTextColor u-secondaryTextColor u-bSpace--m u-tSpace-xl">' +
__e( title ) +
'</h4>\n  <p class="CDB-Text CDB-Size-medium u-altTextColor">\n    ' +
__e( msg ) +
'\n  </p>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/user_notification/user_notification"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="onboardingNotification Color-MainDark CDB-Text CDB-Size-medium u-flex u-justifyCenter">\n  <p>CARTO Builder has been activated in your account. <a href="https://carto.com/learn/guides" class="onboardingNotification-link">Learn more</a> about it and let us know what you think or <a href="mailto:builder-support@carto.com" class="onboardingNotification-link">contact us</a>. Happy mapping!</p>\n\n  <button class="onboardingNotification-closeButton js-close">\n    <div class="CDB-Shape-close is-large is-white"></div>\n  </button>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/views/avatar_selector_view"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="CDB-Text js-avatarSelector">\n  <div class="FormAccount-rowLabel">\n    <label class="CDB-Text CDB-Size-medium is-semibold u-mainTextColor">\n      ';
 if (inputName == "user[avatar_url]") { ;
__p += '\n        Avatar\n      ';
 } else if (inputName == "organization[avatar_url]") { ;
__p += '\n        Organization logo\n      ';
 } ;
__p += '\n    </label>\n  </div>\n  <div class="FormAccount-rowData FormAccount-avatar">\n    <div class="FormAccount-avatarPreview">\n      ';
 if (avatarURL) { ;
__p += '\n        <img src="' +
__e( avatarURL ) +
'" title="' +
__e( username ) +
'" alt="' +
__e( username ) +
'" class="FormAccount-avatarPreviewImage" />\n      ';
 } else { ;
__p += '\n        <svg width="100px" height="100px" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="FormAccount-avatarPreviewImage">\n          <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\n            <g id="Group-2">\n              <rect id="Rectangle" fill="#F9F9F9" x="0" y="0" width="100" height="100"></rect>\n              <g id="seats-icon" transform="translate(21.093750, 25.000000)" fill="#B1B8C1">\n                <g id="Group">\n                  <path d="M13.0696615,16.6666666 L1.18815104,16.6666666 C0.532291666,16.6666666 0,17.2 0,17.8571429 L0,25 C0,27.5785714 0.7984375,29.1190477 2.37630209,29.6 L2.37630209,39.2857143 C2.37630209,39.9428571 2.90859375,40.4761905 3.56445312,40.4761905 L10.6933594,40.4761905 C11.3492187,40.4761905 11.8815104,39.9428571 11.8815104,39.2857143 L11.8815104,29.6 C13.4569987,29.1190477 14.2554362,27.5785714 14.2578125,25 L14.2578125,17.8571429 C14.2578125,17.2 13.7255209,16.6666666 13.0696615,16.6666666 L13.0696615,16.6666666 L13.0696615,16.6666666 Z M11.8815104,25 C11.8791341,27.3809523 11.2208984,27.3809523 10.6933594,27.3809523 C10.0375,27.3809523 9.50520836,27.9142857 9.50520836,28.5714286 L9.50520836,38.0952381 L4.75260416,38.0952381 L4.75260416,28.5714286 C4.75260416,27.9142857 4.2203125,27.3809523 3.56445312,27.3809523 C3.03453776,27.3809523 2.37630209,27.3809523 2.37630209,25 L2.37630209,19.0476191 L11.8815104,19.0476191 L11.8815104,25 L11.8815104,25 L11.8815104,25 Z M55.843099,16.6666666 L43.9615885,16.6666666 C43.3057291,16.6666666 42.7734375,17.2 42.7734375,17.8571429 L42.7734375,25 C42.7734375,27.5785714 43.571875,29.1190477 45.1497396,29.6 L45.1497396,39.2857143 C45.1497396,39.9428571 45.6820313,40.4761905 46.3378906,40.4761905 L53.4667969,40.4761905 C54.1226562,40.4761905 54.6549479,39.9428571 54.6549479,39.2857143 L54.6549479,29.6 C56.2304362,29.1190477 57.0288737,27.5785714 57.03125,25 L57.03125,17.8571429 C57.03125,17.2 56.4989584,16.6666666 55.843099,16.6666666 L55.843099,16.6666666 L55.843099,16.6666666 Z M54.6549479,25 C54.6525716,27.3809523 53.9943359,27.3809523 53.4667969,27.3809523 C52.8109375,27.3809523 52.2786459,27.9142857 52.2786459,28.5714286 L52.2786459,38.0952381 L47.5260416,38.0952381 L47.5260416,28.5714286 C47.5260416,27.9142857 46.99375,27.3809523 46.3378906,27.3809523 C45.8079752,27.3809523 45.1497396,27.3809523 45.1497396,25 L45.1497396,19.0476191 L54.6549479,19.0476191 L54.6549479,25 L54.6549479,25 L54.6549479,25 Z M36.8326823,16.6666666 L20.1985677,16.6666666 C19.5427084,16.6666666 19.0104166,17.2 19.0104166,17.8571429 L19.0104166,29.7619048 C19.0104166,32.6380952 21.0540365,35.0404762 23.7630209,35.5952381 L23.7630209,48.8095238 C23.7630209,49.4666666 24.2953125,50 24.9511719,50 L32.0800781,50 C32.7359375,50 33.2682291,49.4666666 33.2682291,48.8095238 L33.2682291,35.5952381 C35.9772135,35.0428571 38.0208334,32.6380952 38.0208334,29.7619048 L38.0208334,17.8571429 C38.0208334,17.2 37.4885416,16.6666666 36.8326823,16.6666666 L36.8326823,16.6666666 L36.8326823,16.6666666 Z M35.6445312,29.7619048 C35.6445312,31.7309523 34.0452799,33.3333334 32.0800781,33.3333334 C31.4242188,33.3333334 30.8919271,33.8666666 30.8919271,34.5238095 L30.8919271,47.6190477 L26.1393229,47.6190477 L26.1393229,34.5238095 C26.1393229,33.8666666 25.6070312,33.3333334 24.9511719,33.3333334 C22.9859701,33.3333334 21.3867188,31.7309523 21.3867188,29.7619048 L21.3867188,19.0476191 L35.6445312,19.0476191 L35.6445312,29.7619048 L35.6445312,29.7619048 L35.6445312,29.7619048 Z M7.12890625,14.2857143 C9.74996742,14.2857143 11.8815104,12.15 11.8815104,9.52380953 C11.8815104,6.89523809 9.74996742,4.76190477 7.12890625,4.76190477 C4.50784505,4.76190477 2.37630209,6.89523809 2.37630209,9.52380953 C2.37630209,12.15 4.50784505,14.2857143 7.12890625,14.2857143 L7.12890625,14.2857143 L7.12890625,14.2857143 Z M7.12890625,7.14285714 C8.43824867,7.14285714 9.50520836,8.21190477 9.50520836,9.52380953 C9.50520836,10.8357143 8.43824867,11.9047619 7.12890625,11.9047619 C5.8195638,11.9047619 4.75260416,10.8357143 4.75260416,9.52380953 C4.75260416,8.21190477 5.8195638,7.14285714 7.12890625,7.14285714 L7.12890625,7.14285714 L7.12890625,7.14285714 Z M49.9023438,14.2857143 C52.5234049,14.2857143 54.6549479,12.15 54.6549479,9.52380953 C54.6549479,6.89523809 52.5234049,4.76190477 49.9023438,4.76190477 C47.2812826,4.76190477 45.1497396,6.89523809 45.1497396,9.52380953 C45.1497396,12.15 47.2812826,14.2857143 49.9023438,14.2857143 L49.9023438,14.2857143 L49.9023438,14.2857143 Z M49.9023438,7.14285714 C51.2116862,7.14285714 52.2786459,8.21190477 52.2786459,9.52380953 C52.2786459,10.8357143 51.2116862,11.9047619 49.9023438,11.9047619 C48.5930013,11.9047619 47.5260416,10.8357143 47.5260416,9.52380953 C47.5260416,8.21190477 48.5930013,7.14285714 49.9023438,7.14285714 L49.9023438,7.14285714 L49.9023438,7.14285714 Z M28.515625,14.2857143 C32.4460287,14.2857143 35.6445312,11.0809523 35.6445312,7.14285714 C35.6445312,3.20476191 32.4460287,0 28.515625,0 C24.5852213,0 21.3867188,3.20476191 21.3867188,7.14285714 C21.3867188,11.0809523 24.5852213,14.2857143 28.515625,14.2857143 L28.515625,14.2857143 L28.515625,14.2857143 Z M28.515625,2.38095238 C31.1366862,2.38095238 33.2682291,4.51428571 33.2682291,7.14285714 C33.2682291,9.76904766 31.1366862,11.9047619 28.515625,11.9047619 C25.8945638,11.9047619 23.7630209,9.76904766 23.7630209,7.14285714 C23.7630209,4.51428571 25.8945638,2.38095238 28.515625,2.38095238 L28.515625,2.38095238 L28.515625,2.38095238 Z" id="Shape"></path>\n                </g>\n              </g>\n            </g>\n          </g>\n        </svg>\n      ';
 } ;
__p += '\n\n      ';
 if (state === "loading") { ;
__p += '\n        <div class="FormAccount-avatarPreviewLoader">\n          <div class="Spinner FormAccount-avatarPreviewSpinner"></div>\n        </div>\n      ';
 } ;
__p += '\n    </div>\n    <input class="js-fileAvatar" type="file" value="Choose image" accept="' +
__e( avatarAcceptedExtensions ) +
'" />\n    <input class="js-inputAvatar" id="user_avatar_url" name="' +
__e( inputName ) +
'" type="hidden" value="' +
__e( avatarURL ) +
'" />\n    <div class="FormAccount-rowInfo FormAccount-rowInfo--marginLeft">\n      ';
 if (state === "error") { ;
__p += '\n        <p class="FormAccount-rowInfoText FormAccount-rowInfoText--error FormAccount-rowInfoText--maxWidth">There was an error uploading your avatar. Check the height and size (max 1MB) of the image</p>\n      ';
 } else { ;
__p += '\n        <p class="FormAccount-rowInfoText FormAccount-rowInfoText--smaller">Recommended images should be 128x128 pixels of size</p>\n      ';
 } ;
__p += '\n    </div>\n  </div>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/views/base_dialog/template"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="Dialog-contentWrapper">\n  ';
 /* Note that some CSS class names are required by parent Dialog view, e.g. "close", "content", ... */ ;
__p += '\n  <button class="CDB-Shape Dialog-closeBtn close js-cancel">\n    <div class="CDB-Shape-close is-blue is-huge"></div>\n  </button>\n  <div class="Dialog-content content"></div>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/views/change_mobile_app_type"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<form accept-charset="UTF-8">\n  <input name="utf8" type="hidden" value="&#x2713;" />\n\n  <div class="CDB-Text Dialog-header u-inner">\n    <div class="Dialog-headerIcon Dialog-headerIcon--negative">\n      <i class="CDB-IconFont CDB-IconFont-mobile"></i>\n    </div>\n    <p class="Dialog-headerTitle">Are you sure you want to change your application type?</p>\n    <p class="Dialog-headerText">The license key will change and you will need to update it in your app.</p>\n  </div>\n\n  <div class="Dialog-footer u-inner">\n    <button type="button" class="CDB-Button CDB-Button--secondary cancel">\n      <span class="CDB-Button-Text CDB-Text is-semibold CDB-Size-small u-upperCase">Cancel</span>\n    </button>\n    <button type="button" class="CDB-Button CDB-Button--error js-ok">\n      <span class="CDB-Button-Text CDB-Text is-semibold CDB-Size-small u-upperCase">Change application type</span>\n    </button>\n  </div>\n</form>\n';

}
return __p
};

this["JST"]["cartodb/common/views/create/create_footer"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 if (option !== "loading") { ;
__p += '\n  <div class="CreateDialog-footerShadow"></div>\n  <div class="CreateDialog-footerLine"></div>\n\n  <div class="CreateDialog-footerInner u-flex u-alignCenter u-justifySpace">\n    ';
 if (option === 'listing') { ;
__p += '\n\n      ';
 if (listingState === "datasets") { ;
__p += '\n        ';
 if (isLibrary && !isMapType) { ;
__p += '\n          <div class="CDB-Text CDB-Size-medium u-altTextColor u-flex u-alignCenter">\n            <i class="CDB-IconFont CDB-IconFont-info CreateDialog-footerInfoIcon HighlightIcon HighlightIcon--warning"></i> Once you click over one of these items it will be imported to your account.\n          </div>\n        ';
 } else { ;
__p += '\n          <div class="CDB-Text CDB-Size-medium u-altTextColor u-flex u-alignCenter">\n            ';
 if (selectedDatasetsCount === 0) { ;
__p += '\n              <i class="CDB-IconFont CDB-IconFont-info CreateDialog-footerInfoIcon HighlightIcon HighlightIcon--warning"></i>\n              Or you can start with&nbsp;<button class="u-actionTextColor js-videoTutorial">a video tutorial</button>\n            ';
 } else if (selectedDatasetsCount < maxSelectedDatasets) { ;
__p += '\n              ' +
__e( selectedDatasetsCount ) +
' dataset' +
__e( selectedDatasetsCount !== 1 ? 's' : '' ) +
' selected\n            ';
 } else { ;
__p += '\n              You have reached the max layers for a new map (' +
__e( maxSelectedDatasets ) +
' max)\n            ';
 } ;
__p += '\n          </div>\n          <div class="CreateDialog-footerActions">\n            ';
 if (selectedDatasetsCount === maxSelectedDatasets && userCanUpgrade) { ;
__p += '\n              <a class="Button Button--main CreateDialog-footerActionsButton is-separated js-upgrade" href="' +
__e( upgradeUrl ) +
'"><span>upgrade</span></a>\n            ';
 } ;
__p += '\n            <button class="CDB-Button CDB-Button--primary CreateDialog-footerActionsButton js-create_map ' +
__e( selectedDatasetsCount === 0 ? 'is-disabled' : '' ) +
'">\n              <span class="CDB-Button-Text CDB-Text is-semibold CDB-Size-small u-upperCase">create map</span>\n            </button>\n          </div>\n        ';
 } ;
__p += '\n      ';
 } ;
__p += '\n\n      ';
 if (listingState === "import") { ;
__p += '\n        ';
 if (importState === 'scratch') { ;
__p += '\n          ';
 if (isMapType) { ;
__p += '\n            <div class="CreateDialog-footerInfo">\n              <i class="CDB-IconFont CDB-IconFont-info CreateDialog-footerInfoIcon HighlightIcon HighlightIcon--warning"></i>New on CARTO? Start with one of <a href="#/templates" class="js-templates">our templates</a>.\n            </div>\n          ';
 } ;
__p += '\n        ';
 } else { ;
__p += '\n          <div class="js-footer-info CreateDialog-footerInfo"></div>\n          <div class="CreateDialog-footerActions js-footerActions">\n            <button class="CDB-Button CDB-Button--primary CreateDialog-footerActionsButton ';
 if (!isUploadValid) { ;
__p += 'is-disabled';
 } ;
__p += ' js-connect">\n              <span class="CDB-Button-Text CDB-Text is-semibold CDB-Size-small u-upperCase">connect dataset</span>\n            </button>\n          </div>\n        ';
 } ;
__p += '\n      ';
 } ;
__p += '\n    ';
 } ;
__p += '\n  </div>\n';
 } ;
__p += '\n';

}
return __p
};

this["JST"]["cartodb/common/views/create/create_header"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<ul class="CreateDialog-headerSteps">\n  ';
 if (type === "dataset") { ;
__p += '\n    <li class="CreateDialog-headerStep is-selected">\n      <div class="Dialog-headerIcon">\n        <i class="CDB-IconFont CDB-IconFont-add"></i>\n      </div>\n      <h2 class="CDB-Text CDB-Size-large u-mainTextColor u-bSpace">Connect dataset</h2>\n      <h3 class="CDB-Text CDB-Size-medium u-altTextColor">Connect datasets from external services or upload your data files.</h3>\n    </li>\n  ';
 } else { ;
__p += '\n    <li class="CreateDialog-headerStep ' +
__e( option === "listing" || option === "loading" ? 'is-selected' : '' ) +
'">\n      <div class="Dialog-headerIcon">\n        <i class="CDB-IconFont CDB-IconFont-add"></i>\n      </div>\n      <h2 class="CDB-Text CDB-Size-large u-mainTextColor u-bSpace">Add datasets</h2>\n      <h3 class="CDB-Text CDB-Size-medium u-altTextColor">Select your datasets</h3>\n    </li>\n  ';
 } ;
__p += '\n</ul>';

}
return __p
};

this["JST"]["cartodb/common/views/create/create_listing"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="ListingContent"></div>';

}
return __p
};

this["JST"]["cartodb/common/views/create/create_loading"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="IntermediateInfo">\n';
 if (type === "dataset") { ;
__p += '\n  <div class="Spinner"></div>\n  <h4 class="CDB-Text CDB-Size-large u-mainTextColor u-secondaryTextColor u-bSpace--m u-tSpace-xl">Creating new ' +
__e( createModelType ) +
'</h4>\n  <p class="CDB-Text CDB-Size-medium u-altTextColort">\n    ' +
((__t = ( quote )) == null ? '' : __t) +
'\n  </p>\n';
 } else { ;
__p += '\n  <div class="Spinner"></div>\n  <h4 class="CDB-Text CDB-Size-large u-mainTextColor u-secondaryTextColor u-bSpace--m u-tSpace-xl">\n    ';
 if (selectedDatasets.length > 0 || currentImport) { ;
__p += '\n      Connecting ' +
__e( currentImportName ) +
' (' +
__e( tableIdsArray.length + (currentImport ? 1 : 0) ) +
'/' +
__e( selectedDatasets.length + tableIdsArray.length + (currentImport ? 1 : 0) ) +
')\n    ';
 } else { ;
__p += '\n      Creating map\n    ';
 } ;
__p += '\n  </h4>\n  <p class="CDB-Text CDB-Size-medium u-altTextColor">\n    ' +
((__t = ( quote )) == null ? '' : __t) +
'\n  </p>\n';
 } ;
__p += '\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/views/create/create_loading_error"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="IntermediateInfo">\n';
 if (type === "dataset") { ;
__p += '\n  <div class="LayoutIcon LayoutIcon--negative">\n    <i class="CDB-IconFont CDB-IconFont-cockroach"></i>\n  </div>\n  <h4 class="CDB-Text CDB-Size-large u-secondaryTextColor u-bSpace--m u-tSpace-xl">Oouch! There has been an error</h4>\n  <p class="CDB-Text CDB-Size-medium u-altTextColor">If the problem persists contact us at <a class="js-mail-link" href="mailto:support@carto.com">support@carto.com</a>.</p>\n';
 } else { ;
__p += '\n  <div class="LayoutIcon LayoutIcon--negative">\n    <i class="CDB-IconFont CDB-IconFont-cloud"></i>\n  </div>\n  <h4 class="CDB-Text CDB-Size-large u-secondaryTextColor u-bSpace--m u-tSpace-xl">\n    ';
 if ((selectedDatasets && selectedDatasets.length > 0) || currentImport) { ;
__p += '\n      ' +
__e( err.title ) +
' ';
 if (err.error_code) { ;
__p += '(' +
__e( err.error_code ) +
')';
 } ;
__p += '\n    ';
 } else { ;
__p += '\n      Error creating the new map\n    ';
 } ;
__p += '\n  </h4>\n  <p class="CDB-Text CDB-Size-medium u-secondaryTextColor">\n    ';
 if ((selectedDatasets && selectedDatasets.length > 0) || currentImport) { ;
__p += '\n      ' +
((__t = ( cdb.core.sanitize.html(err.what_about) )) == null ? '' : __t) +
'\n    ';
 } else { ;
__p += '\n      If the problem persists contact us at <a class="js-mail-link" href="mailto:support@carto.com">support@carto.com</a>.\n    ';
 } ;
__p += '\n  </p>\n';
 } ;
__p += '\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/views/create/create_loading_upgrade"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="IntermediateInfo">\n  <div class="LayoutIcon LayoutIcon--negative">\n    <i class="CDB-IconFont CDB-IconFont-barometer"></i>\n  </div>\n  <h4 class="CDB-Text CDB-Size-large u-mainTextColor u-secondaryTextColor u-bSpace--m u-tSpace-xl">You have run out of quota</h4>\n  <p class="CDB-Text CDB-Size-medium u-altTextColor">Remove some of your datasets to gain available space or upgrade your account</p>\n\n  <div class="UpgradeElement UpgradeElement--fixed">\n    <div class="UpgradeElement-info">\n      <div class="LayoutIcon UpgradeElement-infoIcon">\n        <i class="CDB-IconFont CDB-IconFont-rocket"></i>\n      </div>\n      <p class="UpgradeElement-infoText u-ellipsLongText CDB-Text">Keep your data and get more quota by upgrading your plan</p>\n    </div>\n    ';
 if (freeTrial) { ;
__p += '\n      <div class="UpgradeElement-trial">\n        <i class="CDB-IconFont CDB-IconFont-gift UpgradeElement-trialIcon"></i>\n        <p class="UpgradeElement-trialText u-ellipsLongText">14 days Free trial</p>\n      </div>\n    ';
 } ;
__p += '\n  </div>\n\n  <a href="' +
__e( upgradeUrl ) +
'" class="Button Button--main CDB-Text">\n    <span>upgrade</span>\n  </a>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/views/create/dialog_template"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="Dialog-header Dialog-header--expanded CreateDialog-header with-separator"></div>\n<div class="Filters Filters--navListing Filters--static js-navigation"></div>\n<div class="Dialog-body Dialog-body--expanded Dialog-body--create Dialog-body--noPaddingTop Dialog-body--withoutBorder"></div>\n<div class="Dialog-footer Dialog-footer--expanded CreateDialog-footer">\n  <div class="u-inner"></div>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/views/create/listing/content_no_datasets"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<h4 class="CDB-Text CDB-Size-large u-mainTextColor u-secondaryTextColor u-bSpace--m u-tSpace-xl">You have not connected any datasets yet</h4>\n<p class="CDB-Text CDB-Size-medium u-altTextColor">You can <button class="Button--link js-connect">connect your own dataset</button> or choose one from our Data Library.</p>\n<div class="NoDatasets-illustration NoDatasets-illustration--secondary"></div>\n';

}
return __p
};

this["JST"]["cartodb/common/views/create/listing/dataset_item"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="DatasetsList-itemCategory is--' +
__e( isRaster ? 'raster' : geometryType ) +
'Dataset">\n  ';
 if (syncStatus) { ;
__p += '\n    <i\n    ';
 if (syncStatus === "failure") { ;
__p += '\n      data-title="Sync failed, last attempt was ' +
__e( syncRanAt ) +
'"\n    ';
 } else if (syncStatus === "syncing") { ;
__p += '\n      data-title="Syncing"\n    ';
 } else { ;
__p += '\n      data-title="Synced ' +
__e( syncRanAt ) +
'"\n    ';
 } ;
__p += '\n    class="CDB-IconFont CDB-IconFont-wifi DatasetsList-itemStatus is-' +
__e( syncStatus ) +
'"></i>\n  ';
 } ;
__p += '\n</div>\n<div class="DatasetsList-itemInfo">\n  <div class="DatasetsList-itemPrimaryInfo">\n    <h3 class="CDB-Text CDB-Size-large u-bSpace u-ellipsis">\n      ' +
__e( title ) +
'\n      ';
 if (showPermissionIndicator) { ;
__p += '\n        <span class="CDB-Text DatasetsList-itemTitlePermission PermissionIndicator">READ</span>\n      ';
 } ;
__p += '\n    </h3>\n    ';
 if (description && description.length > 0) { ;
__p += '\n      <p class="u-ellipsis CDB-Text CDB-Size-medium u-altTextColor" title="' +
__e( description ) +
'">' +
__e( description ) +
'</p>\n    ';
 } else { ;
__p += '\n      <span class="NoResults CDB-Text CDB-Size-medium">No description</span>\n    ';
 } ;
__p += '\n  </div>\n  <div class="DatasetsList-itemSecondaryInfo">\n    <div class="DatasetsList-itemMeta">\n      <button class="CDB-Tag CDB-Text is-semibold CDB-Size-small u-upperCase is-' +
__e( privacy ) +
'">' +
__e( privacy ) +
'</button>\n      <span class="js-likes-indicator" />\n      ';
 if (rowCount) { ;
__p += '\n        <span class="CDB-Text CDB-Size-small u-altTextColor">\n          ' +
__e( rowCount ) +
' ' +
__e( pluralizedRows ) +
'\n        </span>\n      ';
 } ;
__p += '\n      ';
 if (datasetSize) { ;
__p += '\n        <span class="CDB-Text CDB-Size-small u-altTextColor">\n          ' +
__e( datasetSize ) +
'\n        </span>\n      ';
 } ;
__p += '\n      <span class="DatasetsList-itemTimeDiff DefaultTimeDiff CDB-Text CDB-Size-small u-altTextColor">\n          ' +
__e( timeDiff ) +
'\n          ';
 if (!isOwner) { ;
__p += '\n            by\n            <span class="UserAvatar">\n              <img class="UserAvatar-img UserAvatar-img--smaller" src="' +
__e( owner.avatar_url ) +
'" alt="' +
__e( owner.name || owner.username  ) +
'" title="' +
__e( owner.name || owner.username  ) +
'" />\n            </span>\n          ';
 } ;
__p += '\n      </span>\n    </div>\n    <div class="DatasetsList-itemMeta DatasetsList-itemTags">\n      ';
 if (tagsCount > 0) { ;
__p += '\n        <p class="DefaultTags CDB-Text">\n          ';
 for (var i = 0, l = Math.min(maxTagsToShow, tags.length); i < l; ++i) { ;
__p += '\n            <a class="CDB-Tag CDB-Text CDB-Size-small is-semibold u-upperCase js-tag-link" value="' +
__e( tags[i] ) +
'">' +
__e( tags[i] ) +
'</a>';
 if (i !== (l-1)) { ;

 } ;
__p += '\n          ';
 } ;
__p += '\n          ';
 if (tagsCount > maxTagsToShow) { ;
__p += '\n            and ' +
__e( tagsCount - maxTagsToShow ) +
' more\n          ';
 } ;
__p += '\n        </p>\n      ';
 } else { ;
__p += '\n        <p class="NoResults CDB-Text CDB-Size-small u-altTextColor">No tags</p>\n      ';
 } ;
__p += '\n    </div>\n  </div>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/views/create/listing/datasets_error"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="IntermediateInfo">\n  <div class="LayoutIcon LayoutIcon--negative">\n    <i class="CDB-IconFont CDB-IconFont-cockroach"></i>\n  </div>\n  <h4 class="CDB-Text CDB-Size-large u-mainTextColor u-secondaryTextColor u-bSpace--m u-tSpace-xl">Oouch! There has been an error</h4>\n  <p class="CDB-Text CDB-Size-medium u-altTextColor">Try viewing <a class="ContentResult-urlLink js-link" href="' +
__e( defaultUrl ) +
' ">your ' +
__e( type ) +
'</a> or if the problem persists contact us at <a class="js-mail-link" href="mailto:support@carto.com">support@carto.com</a>.</p>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/views/create/listing/datasets_loader"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="IntermediateInfo">\n  <div class="Spinner"></div>\n  <h4 class="CDB-Text CDB-Size-large u-mainTextColor u-secondaryTextColor u-bSpace--m u-tSpace-xl">' +
__e( q || tag  ? 'Searching' : 'Loading' ) +
'...</h4>\n  <p class="CDB-Text CDB-Size-medium u-altTextColor">' +
((__t = ( quote )) == null ? '' : __t) +
'</p>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/views/create/listing/datasets_no_result"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="IntermediateInfo">\n  <div class="LayoutIcon ';
 (q || tag) ? 'LayoutIcon--negative' : '' ;
__p += '">\n    <i class="CDB-IconFont\n      ';
 if (shared) { ;
__p += ' CDB-IconFont-defaultUser\n      ';
 } else if (locked) { ;
__p += ' CDB-IconFont-lock\n      ';
 } else if (library) { ;
__p += ' CDB-IconFont-dribbble\n      ';
 } else { ;
__p += ' CDB-IconFont-lens ';
 } ;
__p += '" />\n  </div>\n  <h4 class="CDB-Text CDB-Size-large u-mainTextColor u-secondaryTextColor u-bSpace--m u-tSpace-xl">\n    ';
 if (page > 1 || totalItems === 0 && totalEntries > 0) { ;
__p += '\n      There are no results in this page\n    ';
 } ;
__p += '\n\n    ';
 if (( tag || q ) && totalItems === 0 && totalEntries === 0) { ;
__p += '\n      0 ' +
__e( tag || q ) +
' ' +
__e( type ) +
' found\n    ';
 } ;
__p += '\n\n    ';
 if (page === 1 && !tag && !q && totalItems === 0 && totalEntries === 0) { ;
__p += '\n      There are no ' +
__e( shared === "only" ? 'shared' : '' ) +
' ' +
__e( locked ? 'locked' : '' ) +
' ' +
__e( library ? 'library' : '' ) +
' ' +
__e( type ) +
'\n    ';
 } ;
__p += '\n  </h4>\n  <p class="CDB-Text CDB-Size-medium u-altTextColor">\n    ';
 if (!tag && !q && totalItems === 0 && totalEntries === 0) { ;
__p += '\n      No ' +
__e( type ) +
', no fun\n    ';
 } ;
__p += '\n  </p>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/views/create/listing/datasets_paginator"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 if (totalEntries > 0 && totalPages > 1) { ;
__p += '\n  <div class="ContentFooter DatasetsPaginator" >\n    <div class="u-inner ContentFooter-inner">\n      <div class="ContentFooterEmpty"></div>\n      <div class="Pagination CDB-Text CDB-Size-medium">\n        <span class="DefaultDescription Pagination-label">\n          Page ' +
__e( page ) +
' of ' +
__e( totalPages ) +
'\n        </span>\n        <ul class="Pagination-list">\n          ';
 if (page > 1) { ;
__p += '\n\n            ';
 maxPages = (totalPages - page) > 2 ? (totalPages - page) : pagesCount ;
__p += '\n\n            ';
 for (var i = 1, l = maxPages; i <= l; i++) { ;
__p += '\n              ';
 if (i < page && pagesCount > 0) { ;
__p += '\n                ';
 pagesCount-- ;
__p += '\n                <li class="Pagination-listItem">\n                  <button class="Pagination-listItemLink" value="' +
__e( i ) +
'">' +
__e( i ) +
'</button>\n                </li>\n              ';
 } ;
__p += '\n            ';
 } ;
__p += '\n            \n          ';
 } ;
__p += '\n          <li class="Pagination-listItem is-current">\n            <button class="Pagination-listItemLink" value="' +
__e( page ) +
'">' +
__e( page ) +
'</button>\n          </li>\n          ';
 if (page < totalPages) { ;
__p += '\n            ';
 for (var i = page + 1, l = totalPages; i <= l; i++) { ;
__p += '\n              ';
 if (i > page && i <= totalPages && pagesCount > 0) { ;
__p += '\n                ';
 pagesCount-- ;
__p += '\n                <li class="Pagination-listItem">\n                  <button class="Pagination-listItemLink" value="' +
__e( i ) +
'">' +
__e( i ) +
'</button>\n                </li>\n              ';
 } ;
__p += '\n            ';
 } ;
__p += '\n          ';
 } ;
__p += '\n        </ul>\n      </div>\n    </div>\n  </div>\n';
 } ;


}
return __p
};

this["JST"]["cartodb/common/views/create/listing/import_arcgis_fallback"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="ImportPanel-header">\n  <div class="LayoutIcon ImportPanel-headerIcon">\n    <i class="CDB-IconFont CDB-IconFont-gift"></i>\n  </div>\n  <h3 class=""CDB-Text CDB-Size-large u-mainTextColor u-secondaryTextColor u-bSpace--m">ArcGIS<sup>&trade;</sup> connector</h3>\n  <p class="CDB-Text CDB-Size-medium u-altTextColor u-bSpace--xl">Enable the ArcGIS<sup>&trade;</sup> connector in your account to connect your ArcGIS Server<sup>&trade;</sup> data to CARTO and mantain it in sync with the source.</p>\n</div>\n<div class="ImportPanel-body u-flex u-justifyCenter">\n  <a href="mailto:sales@carto.com?subject=I am interested in the ArcGIS connector&body=Hi, I am interested in testing the ArcGIS connector. Please, contact me to schedule a demo of this feature." class="CDB-Button CDB-Button--primary CDB-Button--medium">\n    <span class="CDB-Button-Text CDB-Text is-semibold CDB-Size-medium u-upperCase">ask for a demo</span>\n  </a>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/views/create/listing/import_box_fallback"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="ImportPanel-header">\n  <div class="LayoutIcon ImportPanel-headerIcon">\n    <i class="CDB-IconFont CDB-IconFont-gift"></i>\n  </div>\n  <h3 class="CDB-Text CDB-Size-large u-mainTextColor u-secondaryTextColor u-bSpace--m">Box connector</h3>\n  <p class="CDB-Text CDB-Size-medium u-altTextColor u-bSpace--xl">Enable the Box connector in your account to map your Box files in CARTO or mantain your CARTO maps in sync with your Box data.</p>\n</div>\n<div class="ImportPanel-body u-flex u-justifyCenter">\n  <a href="mailto:sales@carto.com?subject=I am interested in the Box connector&body=Hi, I am interested in testing the Box connector. Please, contact me to schedule a demo of this feature." class="CDB-Button CDB-Button--primary CDB-Button--medium">\n    <span class="CDB-Button-Text CDB-Text is-semibold CDB-Size-medium u-upperCase">ask for a demo</span>\n  </a>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/views/create/listing/import_default_fallback"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="ImportPanel-header">\n  <div class="LayoutIcon ImportPanel-headerIcon">\n    <i class="CDB-IconFont CDB-IconFont-gift"></i>\n  </div>\n  <h3 class="CDB-Text CDB-Size-large u-mainTextColor u-secondaryTextColor u-bSpace--m">Connector disabled</h3>\n  <p class="CDB-Text CDB-Size-medium u-altTextColor u-bSpace--xl">Enable this connector in your account to connect.</p>\n</div>\n<div class="ImportPanel-body u-flex u-justifyCenter">\n  <a href="mailto:sales@carto.com" class="CDB-Button CDB-Button--primary CDB-Button--medium">\n    <span class="CDB-Button-Text CDB-Text is-semibold CDB-Size-medium u-upperCase">ask for a demo</span>\n  </a>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/views/create/listing/import_instagram_fallback"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="ImportPanel-header">\n  <div class="LayoutIcon ImportPanel-headerIcon">\n    <i class="CDB-IconFont CDB-IconFont-gift"></i>\n  </div>\n  <h3 class="CDB-Text CDB-Size-large u-mainTextColor u-secondaryTextColor u-bSpace--m">Instagram connector</h3>\n  <p class="CDB-Text CDB-Size-medium u-altTextColor u-bSpace--xl">Enable the Instagram connector to map your photos or videos from your account in CARTO.</p>\n</div>\n<div class="ImportPanel-body u-flex u-justifyCenter">\n  <a href="mailto:sales@carto.com?subject=I am interested in the Instagram connector&body=Hi, I am interested in testing the Instagram connector. Please, contact me to schedule a demo of this feature." class="CDB-Button CDB-Button--primary CDB-Button--medium">\n    <span class="CDB-Button-Text CDB-Text is-semibold CDB-Size-medium u-upperCase">ask for a demo</span>\n  </a>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/views/create/listing/import_mailchimp_fallback"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="ImportPanel-header">\n  <div class="LayoutIcon ImportPanel-headerIcon">\n    <i class="CDB-IconFont CDB-IconFont-gift"></i>\n  </div>\n  <h3 class="CDB-Text CDB-Size-large u-mainTextColor u-secondaryTextColor u-bSpace--m">MailChimp connector</h3>\n  <p class="CDB-Text CDB-Size-medium u-altTextColor u-bSpace--xl">Enable the MailChimp connector in your account to map your user lists from MailChimp in CARTO or mantain your CARTO maps in sync with your MailChimp data.</p>\n</div>\n<div class="ImportPanel-body u-flex u-justifyCenter">\n  <a href="mailto:sales@carto.com?subject=I am interested in the MailChimp connector&body=Hi, I am interested in testing the MailChimp connector. Please, contact me to schedule a demo of this feature." class="CDB-Button CDB-Button--primary CDB-Button--medium">\n    <span class="CDB-Button-Text CDB-Text is-semibold CDB-Size-medium u-upperCase">ask for a demo</span>\n  </a>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/views/create/listing/import_salesforce_fallback"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="ImportPanel-header">\n  <div class="LayoutIcon ImportPanel-headerIcon">\n    <i class="CDB-IconFont CDB-IconFont-gift"></i>\n  </div>\n  <h3 class="CDB-Text CDB-Size-large u-mainTextColor u-secondaryTextColor u-bSpace--m">Salesforce connector</h3>\n  <p class="CDB-Text CDB-Size-medium u-altTextColor u-bSpace--xl">Enable the Salesforce connector in your account to map your user lists from Salesforce in CARTO or mantain your CARTO maps in sync with your Salesforce data.</p>\n</div>\n<div class="ImportPanel-body u-flex u-justifyCenter">\n  <a href="mailto:sales@carto.com?subject=I am interested in the Salesforce connector&body=Hi, I am interested in testing the Salesforce connector. Please, contact me to schedule a demo of this feature." class="CDB-Button CDB-Button--primary CDB-Button--medium">\n    <span class="CDB-Button-Text CDB-Text is-semibold CDB-Size-medium u-upperCase">ask for a demo</span>\n  </a>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/views/create/listing/import_selected_dataset"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="DatasetSelected-item">\n  <div class="DatasetSelected-itemExt CDB-Text">\n    ' +
__e( ext || '?' ) +
'\n  </div>\n  <div class="DatasetSelected-itemInfo u-ellipsLongText">\n    <h6 class="CDB-Text CDB-Size-large u-ellipsis" title="' +
__e( title ) +
'">' +
__e( title ) +
'</h6>\n    <p class="CDB-Text CDB-Size-small u-ellipsis u-altTextColor">' +
__e( description ) +
'</p>\n  </div>\n</div>\n';
 if (importCanSync) { ;
__p += '\n  <div class="DatasetSelected-sync">\n    <div class="DatasetSelected-syncOptions">\n      <label class="DatasetSelected-syncLabel CDB-Text CDB-Size-medium u-altTextColor">Sync my data</label>\n      <ul class="DatasetSelected-syncOptionsList">\n        <li class="DatasetSelected-syncOptionsItem">\n          <div class="RadioButton">\n            <button class="RadioButton-input u-rSpace--m js-interval-0 ' +
__e( interval === 0 ? 'is-checked' : '' ) +
'"></button>\n            <label class="CDB-Text CDB-Size-medium u-altTextColor">Never</label>\n          </div>\n        </li>\n        <li class="DatasetSelected-syncOptionsItem">\n          <div class="RadioButton ' +
__e( !userCanSync ? 'is-disabled' : '' ) +
'">\n            <button class="RadioButton-input u-rSpace--m js-interval-1 ' +
__e( interval === 3600 ? 'is-checked' : '' ) +
'"></button>\n            <label class="CDB-Text CDB-Size-medium u-altTextColor">Every hour</label>\n          </div>\n        </li>\n        <li class="DatasetSelected-syncOptionsItem">\n          <div class="RadioButton ' +
__e( !userCanSync ? 'is-disabled' : '' ) +
'">\n            <button class="RadioButton-input u-rSpace--m js-interval-2 ' +
__e( interval === 86400 ? 'is-checked' : '' ) +
'"></button>\n            <label class="CDB-Text CDB-Size-medium u-altTextColor">Every day</label>\n          </div>\n        </li>\n        <li class="DatasetSelected-syncOptionsItem">\n          <div class="RadioButton ' +
__e( !userCanSync ? 'is-disabled' : '' ) +
'">\n            <button class="RadioButton-input u-rSpace--m js-interval-3 ' +
__e( interval === 604800 ? 'is-checked' : '' ) +
'"></button>\n            <label class="CDB-Text CDB-Size-medium u-altTextColor">Every week</label>\n          </div>\n        </li>\n        <li class="DatasetSelected-syncOptionsItem">\n          <div class="RadioButton ' +
__e( !userCanSync ? 'is-disabled' : '' ) +
'">\n            <button class="RadioButton-input u-rSpace--m js-interval-4 ' +
__e( interval === 2592000 ? 'is-checked' : '' ) +
'"></button>\n            <label class="CDB-Text CDB-Size-medium u-altTextColor">Every month</label>\n          </div>\n        </li>\n      </ul>\n    </div>\n    ';
 if (showUpgrade) { ;
__p += '\n      <div class="CDB-Text UpgradeElement DatasetSelected-upgrade">\n        <div class="UpgradeElement-info">\n          <p class="CDB-Size-medium UpgradeElement-infoText u-ellipsLongText">Upgrade your account to get sync options and <a href="https://carto.com/pricing">more features</a></p>\n        </div>\n        <div class="UpgradeElement-actions">\n          ';
 if (showTrial) { ;
__p += '\n            <div class="UpgradeElement-trial">\n              <i class="CDB-IconFont CDB-IconFont-gift UpgradeElement-trialIcon"></i>\n              <p class="UpgradeElement-trialText u-ellipsLongText CDB-Size-medium">14 days Free trial</p>\n            </div>\n          ';
 } ;
__p += '\n          <a href="' +
__e( upgradeUrl ) +
'" class="CDB-Button CDB-Button--secondary UpgradeElement-button DatasetSelected-upgradeButton">\n            <span class="CDB-Button-Text CDB-Text is-semibold CDB-Size-small u-upperCase">Upgrade</span>\n          </a>\n        </div>\n      </div>\n    ';
 } ;
__p += '\n  </div>\n';
 } ;
__p += '\n';

}
return __p
};

this["JST"]["cartodb/common/views/create/listing/import_tab"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<li class=\'ImportOptions-tab ' +
__e( name ) +
'\'>\n  <a href="#/' +
__e( name ) +
'" class=\'TabLink ' +
__e( name ) +
'\'>\n    <i class=\'TabIcon is-' +
__e( name ) +
'\'></i>\n    <span>' +
((__t = ( title )) == null ? '' : __t) +
'</span>\n  </a>\n</li>\n';

}
return __p
};

this["JST"]["cartodb/common/views/create/listing/import_twitter_fallback"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="ImportPanel-header">\n  <div class="LayoutIcon ImportPanel-headerIcon">\n    <i class="CDB-IconFont CDB-IconFont-gift"></i>\n  </div>\n  <h3 class="CDB-Text CDB-Size-large u-mainTextColor u-secondaryTextColor u-bSpace--m">Enable the Twitter Connector</h3>\n  <p class="CDB-Text CDB-Size-medium u-altTextColor u-bSpace--xl">The Twitter Connector allows you to map twitter activity data related to your Brand, Event or any term you may be interested in.</p>\n</div>\n<div class="ImportPanel-body u-flex u-justifyCenter">\n  <a href="mailto:sales@carto.com?subject=I am interested in the Twitter connector&body=Hi, I am interested in testing the Twitter connector. Please, contact me to schedule a demo of this feature." class="CDB-Button CDB-Button--primary CDB-Button--medium">\n    <span class="CDB-Button-Text CDB-Text is-semibold CDB-Size-medium u-upperCase">ask for a demo</span>\n  </a>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/views/create/listing/import_types/create_scratch"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="ImportPanel-header">\n  <h3 class="CDB-Text CDB-Size-large u-mainTextColor u-secondaryTextColor u-bSpace--m">' +
__e( title ) +
'</h3>\n  <p class="CDB-Text CDB-Size-medium u-altTextColor u-bSpace--xl ImportPanel-headerDescription">' +
__e( explanationOfSideEffects ) +
'</p>\n</div>\n<div class="ImportPanel-body">\n  <div class="ImportPanel-actions">\n    <button class="Button Button--main ImportPanel-actionsButton js-create">' +
__e( createButtonLabel ) +
'</button>\n  </div>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/views/create/listing/import_types/credits_info"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 if (value <= remaining) { ;
__p += '\n  ' +
__e( per ) +
'% of your ' +
__e( remainingFormatted ) +
' Twitter credits left\n';
 } else if (remaining <= 0 && !hardLimit) { ;
__p += '\n  Twitter credits for this period consumed - <strong>$' +
__e( block_price/100 ) +
'/' +
__e( block_size ) +
' extra tweets</strong> will be charged\n';
 } else { ;
__p += '\n  No limits - <strong>$' +
__e( block_price/100 ) +
'/' +
__e( block_size ) +
' extra tweets</strong> will be charged\n';
 } ;


}
return __p
};

this["JST"]["cartodb/common/views/create/listing/import_types/data_form"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<form class="Form js-form">\n  <div class="Form-row Form-row--centered">\n    ';
 if (fileEnabled) { ;
__p += '\n      <div class="Form-rowData Form-rowData--med Form-rowData--noMargin js-dropzone">\n        <div class="Form-upload">\n          <label class="Form-fileLabel js-fileLabel CDB-Text CDB-Size-medium">Drag & drop your file</label>\n          <label class="Form-fileLabel Form-fileLabel--error CDB-Text CDB-Size-small js-fileError"></label>\n          <div class="Form-file">\n            <input type="file" class="js-fileInput" />\n            <span class="CDB-Button CDB-Button--primary Form-fileButton CDB-Button-Text CDB-Text is-semibold CDB-Size-small u-upperCase  Form-fileButton js-fileButton">browse</span>\n          </div>\n        </div>\n      </div>\n      <span class="u-lSpace--xl u-rSpace--xl u-flex u-alignCenter CDB-Text CDB-Size-medium u-altTextColor">or</span>\n    ';
 } ;
__p += '\n    <div class="Form-rowData Form-rowData--noMargin Form-rowData--med">\n      <input type="text" class="Form-input Form-input--med has-submit js-textInput CDB-Text CDB-Size-medium" value="" placeholder="https://www.carto.com/data-library" />\n      <button type="submit" class="CDB-Text CDB-Size-small Form-inputSubmit u-upperCase u-actionTextColor Form-inputSubmit"><span>submit</span></button>\n      <div class="CDB-Text Form-inputError">Error. Your URL doesn’t look correct.</div>\n    </div>\n  </div>\n</form>\n';

}
return __p
};

this["JST"]["cartodb/common/views/create/listing/import_types/data_form_arcgis"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<form class="Form js-form">\n  <div class="Form-row u-alignCenter">\n    <div class="Form-rowLabel">\n      <label class="Form-label CDB-Text CDB-Size-medium u-mainTextColor">Enter a URL</label>\n    </div>\n    <div class="Form-rowData Form-rowData--longer">\n      <input type="text" class="Form-input Form-input--longer has-submit js-textInput CDB-Text CDB-Size-medium" value="" placeholder="Paste here your ArcGIS Server&trade; table URL" />\n      <button type="submit" class="CDB-Text CDB-Size-small u-upperCase u-actionTextColor Form-inputSubmit"><span>submit</span></button>\n      <div class="Form-inputError CDB-Text u-flex u-alignCenter">Error. Your URL doesn’t look correct.</div>\n    </div>\n  </div>\n  <div class="Form-row">\n    <div class="Form-rowLabel"></div>\n    <div class="Form-rowData Form-rowData--longer">\n      <p class="CDB-Text CDB-Size-small u-hintTextColor Form-rowInfoText--centered Form-rowInfoText--smaller Form-rowInfoText--block">\n        Format: http://&#60;host&#62;/arcgis/rest/services/&#60;folder&#62;/&#60;serviceName&#62;/&#60;serviceType&#62;<br/>\n        To retrieve a particular layer, add the layer index at the end of the URL\n      </p>\n    </div>\n  </div>\n</form>\n';

}
return __p
};

this["JST"]["cartodb/common/views/create/listing/import_types/data_form_salesforce"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<form class="Form js-form">\n  <div class="Form-row u-alignCenter">\n    <div class="Form-rowLabel">\n      <label class="Form-label CDB-Text CDB-Size-medium u-mainTextColor">Enter a URL</label>\n    </div>\n    <div class="Form-rowData Form-rowData--longer">\n      <input type="text" class="Form-input Form-input--longer has-submit js-textInput CDB-Text CDB-Size-medium" value="" placeholder="Paste here your Salesforce URL" />\n      <button type="submit" class="CDB-Text CDB-Size-small u-upperCase u-actionTextColor Form-inputSubmit"><span>submit</span></button>\n      <div class="Form-inputError CDB-Text u-flex u-alignCenter">Error. Your URL doesn’t look correct.</div>\n    </div>\n  </div>\n</form>\n';

}
return __p
};

this["JST"]["cartodb/common/views/create/listing/import_types/data_header"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<h3 class="js-title CDB-Text CDB-Size-large u-mainTextColor u-secondaryTextColor u-bSpace--m">\n  ';
 if (state === 'selected') { ;
__p += '\n    File selected\n  ';
 } else { ;
__p += '\n    Upload ' +
__e( fileEnabled ? 'a file or' : '' ) +
' a URL\n  ';
 } ;
__p += '\n</h3>\n<p class="js-description CDB-Text CDB-Size-medium u-altTextColor">\n  ';
 if (state !== "selected") { ;
__p += '\n    Paste a URL ';
 if (fileEnabled) { ;
__p += 'or select a file like CSV, XLS, ZIP, KML, GPX, <a href="https://docs.carto.com/cartodb-editor/datasets/#supported-file-formats">see all formats</a>.';
 } ;
__p += '\n  ';
 } ;
__p += '\n  ';
 if (state === "selected") { ;
__p += '\n    ';
 if (acceptSync) { ;
__p += '\n      You can also choose when to sync the file.\n    ';
 } else { ;
__p += '\n      Sync options are not available\n    ';
 } ;
__p += '\n  ';
 } ;
__p += '\n</p>\n';
 if (state === "selected") { ;
__p += '\n  <button class="CDB-Size-large ImportPanel-headerButton js-back">\n    <i class="CDB-IconFont CDB-IconFont-arrowPrev u-actionTextColor"></i>\n  </button>\n';
 } ;
__p += '\n';

}
return __p
};

this["JST"]["cartodb/common/views/create/listing/import_types/data_header_arcgis"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<h3 class="CDB-Text CDB-Size-large u-mainTextColor u-secondaryTextColor u-bSpace--m">\n  ';
 if (state === 'selected') { ;
__p += '\n    ArcGIS<sup>&trade;</sup> selected\n  ';
 } else { ;
__p += '\n    ArcGIS<sup>&trade;</sup> import\n  ';
 } ;
__p += '\n</h3>\n<p class="CDB-Text CDB-Size-medium u-altTextColor u-bSpace--xl">\n  ';
 if (state !== "selected") { ;
__p += '\n    Import your data from an ArcGIS Server<sup>&trade;</sup> instance\n  ';
 } else { ;
__p += '\n    Sync options only available for a layer\n  ';
 } ;
__p += '\n</p>\n';
 if (state === "selected") { ;
__p += '\n  <button class="CDB-Size-large ImportPanel-headerButton js-back">\n    <i class="CDB-IconFont CDB-IconFont-arrowPrev u-actionTextColor"></i>\n  </button>\n';
 } ;
__p += '\n';

}
return __p
};

this["JST"]["cartodb/common/views/create/listing/import_types/data_header_mailchimp"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 if (state !== 'list' ) { ;
__p += '\n  <h3 class="CDB-Text CDB-Size-large u-mainTextColor u-secondaryTextColor u-bSpace--m">\n    ';
 if (state === 'selected') { ;
__p += '\n      MailChimp campaign selected\n    ';
 } else { ;
__p += '\n      Map your MailChimp Campaigns\n    ';
 } ;
__p += '\n  </h3>\n  <p class="CDB-Text CDB-Size-medium u-altTextColor u-bSpace--xl ImportPanel-headerDescription ';
 if (state === "error") { ;
__p += 'ImportPanel-headerDescription--negative';
 } ;
__p += '">\n    ';
 if (state === "idle") { ;
__p += '\n      Connect your MailChimp account to select any of your campaigns.\n    ';
 } ;
__p += '\n    ';
 if (state === "error") { ;
__p += '\n      We are sorry, It has been an error while connecting to your MailChimp account. Just in case it helps, be sure you have the pop-up blocker deactivated for this website.\n    ';
 } ;
__p += '\n    ';
 if (state === "token") { ;
__p += '\n      Checking MailChimp Token.\n    ';
 } ;
__p += '\n    ';
 if (state === "oauth") { ;
__p += '\n      Requesting oAuth.\n    ';
 } ;
__p += '\n    ';
 if (state === "retrieving") { ;
__p += '\n      A list of your MailChimp campaigns will be displayed in a moment.\n    ';
 } ;
__p += '\n    ';
 if (state === "selected") { ;
__p += '\n      Campaign selected.\n    ';
 } ;
__p += '\n  </p>\n  ';
 if (state === "selected") { ;
__p += '\n    <button class="CDB-Size-large ImportPanel-headerButton js-back">\n      <i class="CDB-IconFont CDB-IconFont-arrowPrev u-actionTextColor"></i>\n    </button>\n  ';
 } ;
__p += '\n';
 } ;
__p += '\n';

}
return __p
};

this["JST"]["cartodb/common/views/create/listing/import_types/data_header_salesforce"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<h3 class="CDB-Text CDB-Size-large u-mainTextColor u-secondaryTextColor u-bSpace--m">\n  ';
 if (state === 'selected') { ;
__p += '\n    Salesforce selected\n  ';
 } else { ;
__p += '\n    Salesforce import\n  ';
 } ;
__p += '\n</h3>\n<p class="CDB-Text CDB-Size-medium u-altTextColor u-bSpace--xl">\n  ';
 if (state !== "selected") { ;
__p += '\n    Import your data from a Salesforce URL\n  ';
 } else { ;
__p += '\n    ';
 if (acceptSync) { ;
__p += '\n      Keep it synchronized with the source\n    ';
 } else { ;
__p += '\n      Sync options are not available\n    ';
 } ;
__p += '  \n  ';
 } ;
__p += '\n</p>\n';
 if (state === "selected") { ;
__p += '\n    <button class="CDB-Size-large ImportPanel-headerButton js-back">\n      <i class="CDB-IconFont CDB-IconFont-arrowPrev u-actionTextColor"></i>\n    </button>\n';
 } ;


}
return __p
};

this["JST"]["cartodb/common/views/create/listing/import_types/import_data"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="ImportPanel-header">\n  <h3 class="CDB-Text CDB-Size-large u-mainTextColor u-secondaryTextColor u-bSpace--m">Upload a URL</h3>\n  <p class="CDB-Text CDB-Size-medium u-altTextColor u-bSpace--xl ImportPanel-headerDescription">Paste a URL and start the import</p>\n</div>\n<div class="ImportPanel-body">\n  <div class="ImportPanel-bodyWrapper">\n    <div class="ImportPanel-state ImportPanel-form is-idle"></div>\n    <div class="ImportPanel-state is-selected DatasetSelected"></div>\n  </div>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/views/create/listing/import_types/import_service"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="ImportPanel-header"></div>\n<div class="ImportPanel-body">\n  <div class="ImportPanel-bodyWrapper">\n    <div class="ImportPanel-state ServiceLoader is-idle is-token is-oauth is-retrieving is-error"></div>\n    <div class="ImportPanel-state ServiceList is-list"></div>\n    <div class="ImportPanel-state ServiceSelected DatasetSelected is-selected"></div>\n  </div>\n</div>';

}
return __p
};

this["JST"]["cartodb/common/views/create/listing/import_types/import_twitter"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="ImportPanel-header">\n  <h3 class="CDB-Text CDB-Size-large u-mainTextColor u-secondaryTextColor u-bSpace--m">Twitter trends</h3>\n  <p class="CDB-Text CDB-Size-medium u-altTextColor u-bSpace--xl">Enter up to four search terms using the Category fields.</p>\n</div>\n<div class="ImportPanel-body">\n  <form class="Form">\n    <div class="ImportTwitterPanel-cagetories"></div>\n    <div class="ImportTwitterPanel-datePicker">\n      <div class="Form-row u-alignCenter">\n        <div class="Form-rowLabel">\n          <label class="Form-label CDB-Text CDB-Size-medium">From / to</label>\n        </div>\n        <div class="Form-rowData Form-rowData--longer js-picker"></div>\n        <div class="Form-rowInfo DatePicker-info">\n          <p class="Form-rowInfoText DatePicker-infoText CDB-Text CDB-Size-small u-hintTextColor">Time is in GMT+0 <br/>(you are in GMT' +
__e( moment().format('Z') ) +
')</p>\n        </div>\n      </div>\n    </div>\n    <div class="ImportTwitterPanel-creditsUsage">\n      <div class="Form-row u-alignCenter">\n        <div class="Form-rowLabel">\n          <label class="Form-label CDB-Text CDB-Size-medium">Use</label>\n        </div>\n        <div class="Form-rowData Form-rowData--longer CreditsUsage">\n          <div class="UISlider CreditsUsage-slider js-slider"></div>\n          <div class="CreditsUsage-info js-info CDB-Text CDB-Size-small"></div>\n        </div>\n      </div>\n    </div>\n  </form>\n</div>';

}
return __p
};

this["JST"]["cartodb/common/views/create/listing/import_types/service_header"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 if (state !== 'list' ) { ;
__p += '\n  <h3 class="CDB-Text CDB-Size-large u-mainTextColor u-secondaryTextColor u-bSpace--m">\n    ';
 if (state === 'selected') { ;
__p += '\n      ';
 if (service_name === 'instagram') { ;
__p += '\n        Account connected\n        ';
 } else { ;
__p += '\n        Item selected\n      ';
 } ;
__p += '\n    ';
 } else { ;
__p += '\n      Connect with ' +
__e( title ) +
'\n    ';
 } ;
__p += '\n  </h3>\n  <p class="CDB-Text CDB-Size-medium u-altTextColor u-bSpace--xl ';
 if (state === "error") { ;
__p += 'ImportPanel-headerDescription--negative';
 } ;
__p += '">\n    ';
 if (state === "idle") { ;
__p += '\n      ';
 if (fileExtensions.length > 0) { ;
__p += '\n        ' +
__e( fileExtensions.join(', ') );
 if (showAvailableFormats) { ;
__p += ' and <a target="_blank" href="https://docs.carto.com/cartodb-editor/datasets/#supported-file-formats" class="ImportPanel-headerDescriptionLink">many more formats</a> ';
 } ;
__p += ' supported.\n      ';
 } else { ;
__p += '\n        Log in with your account and select any item.\n      ';
 } ;
__p += '\n    ';
 } ;
__p += '\n    ';
 if (state === "error") { ;
__p += '\n      We are sorry, can’t connect to your ' +
__e( title ) +
' account. Just in case it helps, be sure you have the pop-up blocker deactivated for this website.\n    ';
 } ;
__p += '\n    ';
 if (state === "token") { ;
__p += '\n      Checking Token.\n    ';
 } ;
__p += '\n    ';
 if (state === "oauth") { ;
__p += '\n      Requesting oAuth.\n    ';
 } ;
__p += '\n    ';
 if (state === "retrieving") { ;
__p += '\n      A list of your ' +
__e( title ) +
' files will be displayed in a moment.\n    ';
 } ;
__p += '\n    ';
 if (state === "selected") { ;
__p += '\n      ';
 if (acceptSync) { ;
__p += '\n        You can also choose when to sync the file.\n      ';
 } else { ;
__p += '\n      ';
 if (service_name === 'instagram') { ;
__p += '\n        A map containing all your georeferenced photos will be created\n        ';
 } else { ;
__p += '\n        Sync options are not available.\n        ';
 } ;
__p += '\n      ';
 } ;
__p += '\n    ';
 } ;
__p += '\n  </p>\n  ';
 if (state === "selected" && items > 1) { ;
__p += '\n    <button class="CDB-Size-large ImportPanel-headerButton js-back">\n      <i class="CDB-IconFont CDB-IconFont-arrowPrev u-actionTextColor"></i>\n    </button>\n  ';
 } ;
__p += '\n';
 } ;
__p += '\n';

}
return __p
};

this["JST"]["cartodb/common/views/create/listing/import_types/service_list"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="ServiceList-header">\n  <p class="CDB-Text CDB-Size-medium u-altTextColor">' +
__e( size ) +
' ' +
__e( pluralize ) +
' found in ' +
__e( title ) +
'</p>\n</div>\n<div class="ServiceList-body">\n  ';
 if (size > 0) { ;
__p += '\n  <ul class="ServiceList-items"></ul>\n  ';
 } else { ;
__p += '\n    <div class="IntermediateInfo ServiceList-empty">\n      <div class="LayoutIcon">\n        <i class="CDB-IconFont CDB-IconFont-lens"></i>\n      </div>\n      <h4 class="CDB-Text CDB-Size-large u-mainTextColor u-secondaryTextColor u-bSpace--m u-tSpace-xl">Oouch! There is no results</h4>\n      <p class="CDB-Text CDB-Size-medium u-altTextColor">We haven\'t found any valid file from your account</p>\n    </div>\n  ';
 } ;
__p += '\n</div>';

}
return __p
};

this["JST"]["cartodb/common/views/create/listing/import_types/service_list_item"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="ServiceList-itemExt u-ellipsLongText CDB-Text CDB-Size-medium u-rSpace--xl">\n  ' +
__e( ext || '?' ) +
'\n</div>\n<div class="ServiceList-itemInfo u-flex u-alignCenter u-justifySpace">\n  <div class="ServiceList-itemInfoTitle">\n    <h6 class="CDB-Text CDB-Size-large u-bSpace u-ellipsis" >' +
__e( title ) +
'</h6>\n    <p class="CDB-Text CDB-Size-medium u-altTextColor u-ellipsis">' +
__e( description ) +
'</p>\n  </div>\n  <div class="ServiceList-itemActions">\n    <button class="CDB-Button CDB-Button--secondary js-choose">\n      <span class="CDB-Button-Text CDB-Text is-semibold CDB-Size-small u-upperCase">Choose</span>\n    </button>\n  </div>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/views/create/listing/import_types/service_loader"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="ImportPanel-actions">\n  ';
 if (state === "idle") { ;
__p += '\n    <button class="CDB-Button CDB-Button--primary CDB-Button--medium js-connect">\n    <span class="CDB-Button-Text CDB-Text is-semibold CDB-Size-medium u-upperCase">Connect</span></button>\n  ';
 } else if (state === "error") { ;
__p += '\n    <button class="CDB-Button CDB-Button--primary CDB-Button--medium js-connect"><span class="CDB-Button-Text CDB-Text is-semibold CDB-Size-medium u-upperCase">Try again</span></button>\n  ';
 } else { ;
__p += '\n    <div class="Spinner ImportPanel-actionsLoader"></div>\n  ';
 } ;
__p += '\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/views/create/listing/import_types/twitter_category"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="Form-row u-alignCenter">\n  <div class="Form-rowLabel CDB-Text CDB-Size-medium">\n    <label class="Form-label js-category">Category ' +
__e( category ) +
'</label>\n  </div>\n  <div class="Form-rowData Form-rowData--longer">\n    <input type="text" class="CDB-Text CDB-Size-medium Form-input Form-input--longer has-icon js-terms" value="' +
__e( terms.join(",") ) +
'" placeholder="Insert your terms separated by commas" />\n    <i class="CDB-IconFont CDB-IconFont-twitter Form-inputIcon"></i>\n  </div>\n</div>';

}
return __p
};

this["JST"]["cartodb/common/views/create/listing/import_view"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="ImportOptions-navigation">\n  <button class="ImportOptions-navigationButton ImportOptions-navigationButton--prev js-goPrev">\n    <i class="CDB-IconFont CDB-IconFont-arrowPrev u-actionTextColor"></i>\n  </button>\n  <button class="ImportOptions-navigationButton ImportOptions-navigationButton--next  js-goNext">\n    <i class="CDB-IconFont CDB-IconFont-arrowNext u-actionTextColor"></i>\n  </button>\n</div>\n<div class="ImportOptions-tabs">\n  <ul class="ImportOptions-tabsList CDB-Text CDB-Size-medium u-altTextColor"></ul>\n</div>\n<div class="ImportOptions-panes"></div>';

}
return __p
};

this["JST"]["cartodb/common/views/create/listing/navigation"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '  <span class="Filters-separator"></span>\n\n  <div class="Filters-row">\n    <div class="Filters-group">\n      <div class="Filters-typeItem Filters-typeItem--searchEnabler js-search-enabler">\n        <button class="Filters-searchLink CDB-Text is-semibold u-upperCase CDB-Size-medium js-search-link">\n          <i class="Filters-searchLinkIcon CDB-IconFont CDB-IconFont-lens"></i>Search\n        </button>\n      </div>\n\n      <ul class="Filters-group js-links-list">\n        <li class="Filters-typeItem js-filter-type">\n          <button class="u-actionTextColor CDB-Text is-semibold u-upperCase CDB-Size-medium Filters-typeLink js-connect ' +
__e( listing === 'import' ? 'is-selected' : '' ) +
' ' +
__e( !canCreateDataset ? 'is-disabled' : '' ) +
'">\n            Connect dataset\n          </button>\n        </li>\n        ';
 if (createModel.showDatasets()) { ;
__p += '\n          <li class="Filters-typeItem js-filter-type">\n            <button class="u-actionTextColor CDB-Text is-semibold u-upperCase CDB-Size-medium Filters-typeLink js-datasets ' +
__e( listing === 'datasets' && shared !== 'only' && !library ? 'is-selected' : '' ) +
'">\n              ';
 if (totalItems) { ;
__p += '\n                <strong>' +
__e( totalItems ) +
'</strong>\n              ';
 } ;
__p += '\n              ' +
__e( pluralizedContentType.charAt(0).toUpperCase() + pluralizedContentType.substring(1) ) +
'\n            </button>\n          </li>\n          ';
 if (isInsideOrg) { ;
__p += '\n            <li class="Filters-typeItem js-filter-type">\n              <button class="u-actionTextColor CDB-Text is-semibold u-upperCase CDB-Size-medium Filters-typeLink js-shared ' +
__e( listing === 'datasets' && shared === "only" ? 'is-selected' : '' ) +
'">\n                ';
 if (totalShared) { ;
__p += '\n                  <strong>' +
__e( totalShared ) +
'</strong>\n                ';
 } ;
__p += '\n                Shared with you\n              </button>\n            </li>\n          ';
 } ;
__p += '\n        ';
 } ;
__p += '\n        ';
 if (cdb.config.get('data_library_enabled')) { ;
__p += '\n          <li class="Filters-typeItem js-filter-type">\n            <button class="u-actionTextColor CDB-Text is-semibold u-upperCase CDB-Size-medium Filters-typeLink js-library ' +
__e( listing === 'datasets' && library ? 'is-selected' : '' ) +
'">\n              Data library\n            </button>\n          </li>\n        ';
 } ;
__p += '\n      </ul>\n    </div>\n\n    <div class="Filters-typeItem Filters-typeItem--searchField js-search-field">\n      <form class="Filters-searchForm js-search-form">\n        <input class="CDB-Text CDB-Size-medium u-secondaryTextColor Filters-searchInput js-search-input" type="text" value="' +
__e( ( tag && (':' + tag) ) || q ) +
'" placeholder="by name, description or :tag" />\n        ';
 if (tag || q) { ;
__p += '\n          <button type="button" class="Filters-cleanSearch js-clean-search u-actionTextColor">\n            <i class="CDB-IconFont CDB-IconFont-close"></i>\n          </button>\n        ';
 } ;
__p += '\n      </form>\n    </div>\n\n    <div class="Filters-group js-order-list">\n      <button class="u-actionTextColor CDB-Text is-semibold u-upperCase CDB-Size-medium Filters-typeLink js-create_empty ' +
__e( listing === 'scratch' ? 'is-selected' : '' ) +
' ' +
__e( !canCreateDataset ? 'is-disabled' : '' ) +
'">\n        ' +
__e( createFromScratchLabel ) +
'\n      </button>\n    </div>\n  </div>\n';

}
return __p
};

this["JST"]["cartodb/common/views/create/listing/remote_dataset_item"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="DatasetsList-itemCategory is--' +
__e( isRaster ? 'raster' : geometryType ) +
'Dataset">\n  <i data-title="Public dataset" class="CDB-IconFont CDB-IconFont-book DatasetsList-itemStatus ' +
__e( canImportDataset ? 'is-public' : 'is-banned' ) +
'"></i>\n</div>\n<div class="DatasetsList-itemInfo">\n  <div class="DatasetsList-itemPrimaryInfo">\n    <h3 class="CDB-Text CDB-Size-large u-bSpace u-ellipsis">\n      ' +
__e( title ) +
'\n    </h3>\n    ';
 if (description && description.length > 0) { ;
__p += '\n      <p class="CDB-Text CDB-Size-medium u-secondaryTextColor u-ellipsis" title="' +
__e( description ) +
'">' +
__e( description ) +
'</p>\n    ';
 } else { ;
__p += '\n      <span class="CDB-Text CDB-Size-medium u-altTextColor u-ellipsis">No description</span>\n    ';
 } ;
__p += '\n  </div>\n  <div class="DatasetsList-itemSecondaryInfo">\n    <ul class="DatasetsList-itemMeta CDB-Text CDB-Size-small u-altTextColor">\n      ';
 if (rowCount) { ;
__p += '\n        <label class="RowsIndicator">\n          ' +
__e( rowCount ) +
' ' +
__e( pluralizedRows ) +
'\n        </label>\n      ';
 } ;
__p += '\n      ';
 if (datasetSize) { ;
__p += '\n        <label class="SizeIndicator">\n          ' +
__e( datasetSize ) +
'\n        </label>\n      ';
 } ;
__p += '\n      <label class="DatasetsList-itemTimeDiff DefaultTimeDiff">\n        ' +
__e( timeDiff ) +
' <span class="DatasetsList-itemSource js-source">';
 if (source) { ;
__p += 'from ' +
((__t = ( cdb.core.sanitize.html(source) )) == null ? '' : __t);
 } ;
__p += '</span>\n      </label>\n    </ul>\n    <div class="DatasetsList-itemMeta DatasetsList-itemTags">\n      ';
 if (tagsCount > 0) { ;
__p += '\n        <div class="DefaultTags CDB-Text CDB-Size-small">\n          ';
 for (var i = 0, l = Math.min(maxTagsToShow, tags.length); i < l; ++i) { ;
__p += '\n            <button class="CDB-Tag CDB-Text CDB-Size-small u-upperCase DefaultTags-item js-tag-link" value="' +
__e( tags[i] ) +
'">' +
__e( tags[i] ) +
'</button>';
 if (i !== (l-1)) { ;

 } ;
__p += '\n          ';
 } ;
__p += '\n          ';
 if (tagsCount > maxTagsToShow) { ;
__p += '\n            and ' +
__e( tagsCount - maxTagsToShow ) +
' more\n          ';
 } ;
__p += '\n        </div>\n      ';
 } else { ;
__p += '\n        <p class="NoResults CDB-Text CDB-Size-small u-altTextColor">No tags</p>\n      ';
 } ;
__p += '\n    </div>\n  </div>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/views/dashboard_header/breadcrumbs/dropdown"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<ul class="BreadcrumbsDropdown-list CDB-Text CDB-Size-medium">\n  <li class="BreadcrumbsDropdown-listItem">\n    <span class="BreadcrumbsDropdown-icon u-rSpace--xl">\n      <img class="UserAvatar-img UserAvatar-img--small" src="' +
__e( avatarUrl ) +
'" title="' +
__e( userName ) +
'" alt="' +
__e( userName ) +
'" />\n    </span>\n    <nav class="BreadcrumbsDropdown-options">\n      <a href="' +
__e( mapsUrl ) +
'" class="BreadcrumbsDropdown-optionsItem ' +
__e( isMaps && !isDeepInsights && !isLocked ? 'is-selected' : '' ) +
'">Your maps</a>\n      <a href="' +
__e( datasetsUrl ) +
'" class="BreadcrumbsDropdown-optionsItem has-margin ' +
__e( isDatasets && !isLocked ? 'is-selected' : '' ) +
'">Your datasets</a>\n    </nav>\n  </li>\n  <li class="BreadcrumbsDropdown-listItem is-dark u-flex">\n    <i class="CDB-IconFont CDB-IconFont-lock BreadcrumbsDropdown-lockIcon BreadcrumbsDropdown-icon u-flex u-alignCenter u-justifyCenter u-rSpace--xl"></i>\n    <nav class="BreadcrumbsDropdown-options">\n      <a href="' +
__e( lockedMapsUrl ) +
'" class="BreadcrumbsDropdown-optionsItem ' +
__e( isMaps && isLocked ? 'is-selected' : '' ) +
'">Your locked maps</a>\n      <a href="' +
__e( lockedDatasetsUrl ) +
'" class="BreadcrumbsDropdown-optionsItem has-margin ' +
__e( isDatasets && isLocked ? 'is-selected' : '' ) +
'">Your locked datasets</a>\n    </nav>\n  </li>\n</ul>\n';

}
return __p
};

this["JST"]["cartodb/common/views/dashboard_header/breadcrumbs/dropdown_link"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<button class="Header-navigationBreadcrumbLink ' +
__e( dropdownEnabled ? 'DropdownLink DropdownLink--white' : 'is-disabled' ) +
'">' +
__e( title ) +
'</button>\n';

}
return __p
};

this["JST"]["cartodb/common/views/dashboard_header/logo"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<a class="Logo" href="' +
__e( homeUrl ) +
'">\n  <?xml version="1.0" encoding="UTF-8" standalone="no"?>\n  <svg width="92px" height="36px" viewBox="0 0 92 36" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\n      <g transform="translate(-162.000000, -282.000000)" fill="#FFFFFF">\n        <g transform="translate(162.000000, 282.000000)">\n          <path d="M74,36 C83.9411255,36 92,27.9411255 92,18 C92,8.0588745 83.9411255,0 74,0 C64.0588745,0 56,8.0588745 56,18 C56,27.9411255 64.0588745,36 74,36 Z" id="halo" fill-opacity="0.200000018"></path>\n          <path d="M6.25280899,23.981602 C8.76747566,23.981602 10.220757,22.882802 11.2984713,21.390402 L8.9144367,19.684802 C8.22861851,20.521202 7.52647133,21.078802 6.33445401,21.078802 C4.73421159,21.078802 3.60751029,19.734002 3.60751029,18.012002 L3.60751029,17.979202 C3.60751029,16.306402 4.73421159,14.928802 6.33445401,14.928802 C7.4284973,14.928802 8.1796315,15.470002 8.83279168,16.273602 L11.2168263,14.420402 C10.204428,13.026402 8.70215964,12.042402 6.36711202,12.042402 C2.9053631,12.042402 0.358038428,14.666402 0.358038428,18.012002 L0.358038428,18.044802 C0.358038428,21.472402 2.98700813,23.981602 6.25280899,23.981602 L6.25280899,23.981602 Z M16.732047,23.752002 L20.0468349,23.752002 L20.8632851,21.685602 L25.2884453,21.685602 L26.1048955,23.752002 L29.5013284,23.752002 L24.6352851,12.190002 L21.5817613,12.190002 L16.732047,23.752002 Z M21.7940384,19.209202 L23.0840297,15.962002 L24.357692,19.209202 L21.7940384,19.209202 Z M35.6697093,23.752002 L38.8375361,23.752002 L38.8375361,20.275202 L40.2418305,20.275202 L42.5442201,23.752002 L46.1855881,23.752002 L43.4586443,19.750402 C44.8792677,19.143602 45.810021,17.979202 45.810021,16.208002 L45.810021,16.175202 C45.810021,15.043602 45.4671119,14.174402 44.7976227,13.502002 C44.0301595,12.731202 42.8218132,12.272002 41.0746097,12.272002 L35.6697093,12.272002 L35.6697093,23.752002 Z M38.8375361,17.782402 L38.8375361,15.010802 L40.9276487,15.010802 C41.9727049,15.010802 42.6421941,15.470002 42.6421941,16.388402 L42.6421941,16.421202 C42.6421941,17.257602 42.005363,17.782402 40.9439777,17.782402 L38.8375361,17.782402 Z M55.2605317,23.752002 L58.4283585,23.752002 L58.4283585,15.060002 L61.8574495,15.060002 L61.8574495,12.272002 L51.8477698,12.272002 L51.8477698,15.060002 L55.2605317,15.060002 L55.2605317,23.752002 Z M74,24 C77.3137085,24 80,21.3137085 80,18 C80,14.6862915 77.3137085,12 74,12 C70.6862915,12 68,14.6862915 68,18 C68,21.3137085 70.6862915,24 74,24 Z" id="logotype"></path>\n        </g>\n      </g>\n    </g>\n  </svg>\n  ';
 if (googleEnabled) { ;
__p += '\n    <span class="Logo-sub Logo-sub--google"></span>\n  ';
 } ;
__p += '\n</a>\n';

}
return __p
};

this["JST"]["cartodb/common/views/dashboard_header/notifications/templates/close_limits"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += 'Hey <strong>' +
__e( userName ) +
'</strong>, looks like you\'re about to reach your account limit.\n';
 if (userType === "admin") { ;
__p += '\n  <a href="mailto:' +
__e( upgradeContactEmail ) +
'">Contact us</a> for upgrading your account.\n';
 } ;
__p += '\n';
 if (userType === "org") { ;
__p += '\n  Start thinking about <a href="mailto:' +
__e( upgradeContactEmail ) +
'">contacting your admin</a>.\n';
 } ;
__p += '\n';
 if (userType === "regular") { ;
__p += '\n  Start thinking about <a href="' +
__e( upgradeUrl ) +
'?utm_source=Dashboard_Limits_Nearing&utm_medium=referral&utm_campaign=Upgrade_from_Dashboard&utm_content=upgrading%20your%20plan" class ="underline">upgrading your plan</a>.\n';
 } ;
__p += '\n';
 if (userType === "internal") { ;
__p += '\n  Feel free to <a href="mailto:' +
__e( upgradeContactEmail ) +
'">contact us</a> for more resources.\n';
 } ;
__p += '\n';

}
return __p
};

this["JST"]["cartodb/common/views/dashboard_header/notifications/templates/dropdown"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="Dropdown-content Dropdown-content--withScroll js-content"></div>\n';

}
return __p
};

this["JST"]["cartodb/common/views/dashboard_header/notifications/templates/dropdown_content"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<ul class="NotificationsDropdown ">\n  ';
 if (items.length > 0) { ;
__p += '\n    ';
 _.each(items, function(item){ ;
__p += '\n      ';
 if (!item.opened) { ;
__p += '\n        <li class="u-flex NotificationsDropdown-item is-new CDB-Text CDB-Size-medium">\n          <i class="u-hintTextColor u-flex u-alignCenter u-justifyCenter NotificationsDropdown-icon CDB-IconFont ' +
__e( item.iconFont ) +
' ' +
__e( item.severity ) +
'"></i>\n          <p class="NotificationsDropdown-text u-altTextColor">' +
((__t = ( cdb.core.sanitize.html(item.msg) )) == null ? '' : __t) +
'</p>\n        </li>\n      ';
 } ;
__p += '\n    ';
 }) ;
__p += '\n\n    ';
 _.each(items, function(item){ ;
__p += '\n      ';
 if (item.opened) { ;
__p += '\n        <li class="u-flex NotificationsDropdown-item CDB-Text CDB-Size-medium">\n          <i class="u-hintTextColor  u-flex u-alignCenter u-justifyCenter NotificationsDropdown-icon CDB-IconFont ' +
__e( item.iconFont ) +
'"></i>\n          <p class="NotificationsDropdown-text u-altTextColor">' +
((__t = ( cdb.core.sanitize.html(item.msg) )) == null ? '' : __t) +
'</p>\n        </li>\n      ';
 } ;
__p += '\n    ';
 }) ;
__p += '\n\n  ';
 } else { ;
__p += '\n    <li class="u-flex u-alignCenter NotificationsDropdown-item NotificationsDropdown-item--no-notifications CDB-Text CDB-Size-medium">\n      <p class="NotificationsDropdown-text u-altTextColor">There are no notifications :)</p>\n    </li>\n  ';
 } ;
__p += '\n</ul>\n';

}
return __p
};

this["JST"]["cartodb/common/views/dashboard_header/notifications/templates/limits_exceeded"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += 'Hey <strong>' +
__e( userName ) +
'</strong>, you\'re over your disk limits.\n';
 if (userType === "admin") { ;
__p += '\n  <a href="mailto:' +
__e( upgradeContactEmail ) +
'">Contact us</a> for upgrading your account.\n';
 } ;
__p += '\n';
 if (userType === "org") { ;
__p += '\n  Start thinking about <a href="mailto:' +
__e( upgradeContactEmail ) +
'">contacting your admin</a>.\n';
 } ;
__p += '\n';
 if (userType === "regular") { ;
__p += '\n  Start thinking about <a href="' +
__e( upgradeUrl ) +
'?utm_source=Dashboard_Limits_Nearing&utm_medium=referral&utm_campaign=Upgrade_from_Dashboard&utm_content=upgrading%20your%20plan" class ="underline">upgrading your plan</a>.\n';
 } ;
__p += '\n';
 if (userType === "internal") { ;
__p += '\n  Feel free to <a href="mailto:' +
__e( upgradeContactEmail ) +
'">contact us</a> for more resources.\n';
 } ;
__p += '\n';

}
return __p
};

this["JST"]["cartodb/common/views/dashboard_header/notifications/templates/new_dashboard"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += 'Welcome to your new CARTO Dashboard!\n';

}
return __p
};

this["JST"]["cartodb/common/views/dashboard_header/notifications/templates/new_public_dashboard"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += 'Haven\'t you checked out <a href="' +
__e( publicProfileUrl ) +
'" target="_blank">your public profile</a> yet? Fill it with lovely public maps and let your skills shine!';

}
return __p
};

this["JST"]["cartodb/common/views/dashboard_header/notifications/templates/trial_ends_soon"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += 'Just a reminder, your <strong>' +
__e( accountType ) +
'</strong> trial will finish the next ' +
__e( trialEnd ) +
'. Happy mapping!';

}
return __p
};

this["JST"]["cartodb/common/views/dashboard_header/notifications/templates/try_trial"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += 'Start your 14-day trial to experience the full CARTO.\n<br/>\n<a href="' +
__e( upgradeUrl ) +
'">Start now</a>\n';

}
return __p
};

this["JST"]["cartodb/common/views/dashboard_header/notifications/templates/upgraded_message"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += 'Welcome to your brand new <strong>' +
__e( accountType ) +
'</strong> CARTO. Now we love you even more than before ;)\n';

}
return __p
};

this["JST"]["cartodb/common/views/dashboard_header/notifications/templates/user_notifications"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<i class="UserNotifications-Icon CDB-IconFont CDB-IconFont-alert"></i>\n';
 if (notificationsCount > 0) { ;
__p += '\n<span class="Badge UserNotifications-badge">' +
__e( notificationsCount ) +
'</span>\n';
 } ;
__p += '\n';

}
return __p
};

this["JST"]["cartodb/common/views/dashboard_header/settings_dropdown"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<ul class="SettingsDropdown">\n  <li>\n    <div class="SettingsDropdown-sameline">\n      <p class="CDB-Text CDB-Size-medium">' +
__e( name ) +
'</p>\n      <p class="SettingsDropdown-accountType CDB-Text CDB-Size-small u-altTextColor u-upperCase">' +
__e( accountType ) +
'</p>\n    </div>\n    <p class="CDB-Text CDB-Size-medium u-altTextColor u-tSpace u-ellipsis">\n      ' +
__e( email ) +
'\n    </p>\n  </li>\n  <li class="u-tSpace-xl">\n    <p class="SettingsDropdown-userRole">\n      ';
 if (isViewer) { ;
__p += '\n        <span class="UserRoleIndicator Viewer CDB-Text CDB-Size-small is-semibold u-altTextColor">VIEWER</span>\n        ';
 if (orgDisplayEmail) { ;
__p += '\n          <a href="mailto:' +
__e( orgDisplayEmail ) +
'" class="CDB-Text CDB-Size-small">Become a Builder</a>\n        ';
 } ;
__p += '\n      ';
 } ;
__p += '\n      ';
 if (isBuilder) { ;
__p += '\n        <span class="UserRoleIndicator Builder CDB-Text CDB-Size-small is-semibold u-altTextColor">BUILDER</span>\n      ';
 } ;
__p += '\n    </p>\n  </li>\n  <li class="u-tSpace-xl">\n    ';
 if (showUpgradeLink) { ;
__p += '\n      <a href="' +
__e( upgradeUrl ) +
'" class="SettingsDropdown-itemLink">\n    ';
 } ;
__p += '\n\n    <div class="SettingsDropdown-sameline u-bSpace CDB-Text CDB-Size-medium u-altTextColor">\n      <p class="DefaultDescription">' +
__e( usedDataStr ) +
' of ' +
__e( availableDataStr ) +
' used</p>\n      ';
 if (showUpgradeLink) { ;
__p += '\n        <p class="SettingsDropdown-itemLinkText u-actionTextColor">Upgrade</p>\n      ';
 } ;
__p += '\n    </div>\n    <div class="SettingsDropdown-progressBar ' +
__e( progressBarClass ) +
'">\n      <div class="progress-bar">\n        <span class="bar-2" style="width: ' +
__e( usedDataPct ) +
'%"></span>\n      </div>\n    </div>\n\n    ';
 if (showUpgradeLink) { ;
__p += '\n      </a>\n    ';
 } ;
__p += '\n  </li>\n</ul>\n<div class="BreadcrumbsDropdown-listItem is-dark CDB-Text CDB-Size-medium">\n  <ul>\n    <li class="u-bSpace--m"><a href="' +
__e( publicProfileUrl ) +
'">View your public profile</a></li>\n    <li class="u-bSpace--m"><a href="' +
__e( accountSettingsUrl ) +
'">Your account</a></li>\n    ';
 if (isOrgAdmin) { ;
__p += '\n      <li class="u-bSpace--m"><a href="' +
__e( organizationUrl ) +
'">Your organization</a></li>\n    ';
 } ;
__p += '\n    ';
 if (engineEnabled || mobileAppsEnabled) { ;
__p += '\n      <li class="u-bSpace--m"><a href="' +
__e( apiKeysUrl ) +
'">Your API keys</a></li>\n    ';
 } ;
__p += '\n    <li><a href="' +
__e( logoutUrl ) +
'">Close session</a></li>\n  </ul>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/views/dashboard_header/user_support_template"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 if (userType === 'org') { ;
__p += '\n  <a href="mailto:enterprise-support@carto.com" class="Header-navigationLink u-hideOnMobile">Support</a>\n';
 } else if (userType === 'client' || userType === 'internal') { ;
__p += '\n  <a href="mailto:support@carto.com" class="Header-navigationLink u-hideOnMobile">Support</a>\n';
 } else { ;
__p += '\n  <a href="http://gis.stackexchange.com/questions/tagged/carto" class="Header-navigationLink u-hideOnMobile">Support</a>\n';
 } ;
__p += '\n';

}
return __p
};

this["JST"]["cartodb/common/views/date_pickers/calendar_dropdown"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="DatePicker">\n  <div class="js-calendar DatePicker-calendar DatePicker-calendar--simple"></div>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/views/date_pickers/dates_range"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<button class="DatePicker-dates js-dates has-icon CDB-Text CDB-Size-medium">\n  From <strong>' +
__e( fromDate ) +
' ' +
__e( cdb.Utils.pad(fromHour,2) ) +
':' +
__e( cdb.Utils.pad(fromMin,2) ) +
'</strong> to <strong>' +
__e( toDate ) +
' ' +
__e( cdb.Utils.pad(toHour,2) ) +
':' +
__e( cdb.Utils.pad(toMin,2) ) +
'</strong>\n  <i class="CDB-IconFont CDB-IconFont-calendar DatePicker-datesIcon"></i>\n</button>\n<div class="DatePicker-dropdown CDB-Text">\n  <div class="DatePicker-calendar"></div>\n  <div class="DatePicker-timers">\n    <div class="DatePicker-timersFrom">\n      <div class="DatePicker-timersHour">\n        <label class="DatePicker-timersLabel">HOUR</label>\n      </div>\n      <div class="DatePicker-timersMin">\n        <label class="DatePicker-timersLabel">MIN</label>\n      </div>\n    </div>\n    <div class="DatePicker-timersTo">\n      <div class="DatePicker-timersHour">\n        <label class="DatePicker-timersLabel">HOUR</label>\n      </div>\n      <div class="DatePicker-timersMin">\n        <label class="DatePicker-timersLabel">MIN</label>\n      </div>\n    </div>\n  </div>\n  <div class="DatePicker-shortcuts">\n    <p class="DatePicker-shortcutsText">\n      Get last <button type="button" class="Button--link js-fourHours">4 hours</button>,\n      <button type="button" class="Button--link js-oneDay">1 day</button> or\n      <button type="button" class="Button--link js-oneWeek">1 week</button>\n    </p>\n    <p class="DatePicker-shortcutsText">Dates must be specified in UTC.</p>\n  </div>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/views/delete_account"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<form accept-charset="UTF-8" action="' +
__e( formAction ) +
'" method="post" class="js-form">\n  <input name="utf8" type="hidden" value="&#x2713;" />\n  <input name="authenticity_token" type="hidden" value="' +
__e( authenticityToken ) +
'" />\n  <input name="_method" type="hidden" value="delete" />\n\n  <div class="CDB-Text Dialog-header u-inner">\n    <div class="Dialog-headerIcon Dialog-headerIcon--negative">\n      <i class="CDB-IconFont CDB-IconFont-defaultUser"></i>\n    </div>\n    <p class="Dialog-headerTitle">You are about to delete your account.</p>\n    <p class="Dialog-headerText">\n      Remember, once you delete your account there is no going back.<br/>\n      All your maps, data and work will be lost. Are you sure you want to proceed?<br/>\n      ';
 if (passwordNeeded) { ;
__p += '\n        In any case, you need to type your password.\n      ';
 } ;
__p += '\n    </p>\n  </div>\n\n  ';
 if (passwordNeeded) { ;
__p += '\n    <div class="CDB-Text Dialog-body">\n      <div class="Form-row Form-row--centered has-label">\n        <div class="Form-rowLabel">\n          <label class="Form-label">Your password</label>\n        </div>\n        <div class="Form-rowData">\n          <input type="password" name="deletion_password_confirmation" class="CDB-InputText CDB-Text Form-input Form-input--long" value=""/>\n        </div>\n      </div>\n    </div>\n  ';
 } ;
__p += '\n\n  <div class="Dialog-footer u-inner">\n    <button type="button" class="CDB-Button CDB-Button--secondary cancel">\n      <span class="CDB-Button-Text CDB-Text is-semibold CDB-Size-small u-upperCase">Cancel</span>\n    </button>\n    <button type="submit" class="CDB-Button CDB-Button--error js-ok">\n      <span class="CDB-Button-Text CDB-Text is-semibold CDB-Size-small u-upperCase">Yes, delete my account</span>\n    </button>\n  </div>\n</form>\n';

}
return __p
};

this["JST"]["cartodb/common/views/delete_mobile_app"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<form accept-charset="UTF-8" action="' +
__e( formAction ) +
'" method="post" class="js-form">\n  <input name="utf8" type="hidden" value="&#x2713;" />\n  <input name="authenticity_token" type="hidden" value="' +
__e( authenticityToken ) +
'" />\n  <input name="_method" type="hidden" value="delete" />\n\n  <div class="CDB-Text Dialog-header u-inner">\n    <div class="Dialog-headerIcon Dialog-headerIcon--negative">\n      <i class="CDB-IconFont CDB-IconFont-keys"></i>\n    </div>\n    <p class="Dialog-headerTitle">You are about to delete your application</p>\n    <p class="Dialog-headerText">Remember, once you delete it there is no going back</p>\n  </div>\n\n  <div class="Dialog-footer u-inner">\n    <button type="button" class="CDB-Button CDB-Button--secondary cancel">\n      <span class="CDB-Button-Text CDB-Text is-semibold CDB-Size-small u-upperCase">Cancel</span>\n    </button>\n    <button type="submit" class="CDB-Button CDB-Button--error js-ok">\n      <span class="CDB-Button-Text CDB-Text is-semibold CDB-Size-small u-upperCase">Delete this application</span>\n    </button>\n  </div>\n</form>\n';

}
return __p
};

this["JST"]["cartodb/common/views/delete_organization"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<form accept-charset="UTF-8" action="' +
__e( formAction ) +
'" method="post" class="js-form">\n    <input name="utf8" type="hidden" value="&#x2713;" />\n    <input name="authenticity_token" type="hidden" value="' +
__e( authenticityToken ) +
'" />\n    <input name="_method" type="hidden" value="delete" />\n\n    <div class="CDB-Text Dialog-header u-inner">\n        <div class="Dialog-headerIcon Dialog-headerIcon--negative">\n            <i class="CDB-IconFont CDB-IconFont-defaultUser"></i>\n        </div>\n        <p class="Dialog-headerTitle">You are about to delete your organization.</p>\n        <p class="Dialog-headerText">\n            You will remove this organization and all its users (including this account)<br/>\n            and it will not be possible to recover its information (including tables and data) after this deletion.<br/>\n            ';
 if (passwordNeeded) { ;
__p += '\n                If you want to proceed, type your password:<br/>\n            ';
 } ;
__p += '\n        </p>\n    </div>\n\n    ';
 if (passwordNeeded) { ;
__p += '\n    <div class="CDB-Text Dialog-body">\n        <div class="Form-row Form-row--centered has-label">\n            <div class="Form-rowLabel">\n                <label class="Form-label">Your password</label>\n            </div>\n            <div class="Form-rowData">\n                <input type="password" name="deletion_password_confirmation" class="CDB-InputText CDB-Text Form-input Form-input--long" value=""/>\n            </div>\n        </div>\n    </div>\n    ';
 } ;
__p += '\n\n    <div class="Dialog-footer u-inner">\n        <button type="button" class="CDB-Button CDB-Button--secondary cancel">\n            <span class="CDB-Button-Text CDB-Text is-semibold CDB-Size-small u-upperCase">Cancel</span>\n        </button>\n        <button type="submit" class="CDB-Button CDB-Button--error js-ok">\n            <span class="CDB-Button-Text CDB-Text is-semibold CDB-Size-small u-upperCase">Yes, delete the organization</span>\n        </button>\n    </div>\n</form>\n';

}
return __p
};

this["JST"]["cartodb/common/views/error_details"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="Dialog-header ErrorDetails-header">\n  <div class="Dialog-headerIcon Dialog-headerIcon--negative">\n    <i class="CDB-IconFont CDB-IconFont-cloud"></i>\n  </div>\n  <h3 class="CDB-Text CDB-Size-large u-mainTextColor u-secondaryTextColor u-bSpace--m">\n    ' +
__e( title ) +
' ';
 if (errorCode) { ;
__p += '(' +
__e( errorCode ) +
')';
 } ;
__p += '\n  </h3>\n  <p class="CDB-Text CDB-Size-medium u-altTextColor">\n    ';
 if (itemQueueId) { ;
__p += '\n      Don’t panic, here\'s some info that might help\n    ';
 } else { ;
__p += '\n      Check errors\n    ';
 } ;
__p += '\n  </p>\n</div>\n<div class="Dialog-body ErrorDetails-body">\n  <ul class="ErrorDetails-list CDB-Text CDB-Size-medium u-altTextColor">\n    ';
 if (httpResponseCode) { ;
__p += '\n      <li class="ErrorDetails-item">\n        <div class="ErrorDetails-itemStep">1</div>\n        <div class="ErrorDetails-itemText">\n          The remote server returned a <span class="ErrorDetails-itemTextStrong">' +
__e( httpResponseCode ) +
'</span> code. ' +
__e( httpResponseCodeMessage ) +
'\n        </div>\n      </li>\n      <li class="ErrorDetails-item">\n        <div class="ErrorDetails-itemStep">2</div>\n        <div class="ErrorDetails-itemText">\n          Check that the URL you provided is OK: <br/>\n          <span class="ErrorDetails-itemTextStrong"><a href="' +
__e( originalUrl ) +
'">' +
__e( originalUrl ) +
'</a></span>\n        </div>\n      </li>\n    ';
 } else { ;
__p += '\n      <li class="ErrorDetails-item">\n        <div class="ErrorDetails-itemStep">1</div>\n        <div class="ErrorDetails-itemText">\n          ';
 if (text) { ;
__p += '\n          ' +
((__t = ( cdb.core.sanitize.html(text) )) == null ? '' : __t) +
'\n          ';
 } else { ;
__p += '\n          An unknown error has happened\n          ';
 } ;
__p += '\n        </div>\n      </li>\n    ';
 } ;
__p += '\n    ';
 if (itemQueueId) { ;
__p += '\n      <li class="ErrorDetails-item">\n        <div class="ErrorDetails-itemStep">!</div>\n        <div class="ErrorDetails-itemText">\n          Persisting error? Please <a href="mailto:support@carto.com">send us</a> the following code: <br/>\n          <span class="ErrorDetails-itemTextStrong">' +
__e( itemQueueId ) +
'</span>\n        </div>\n      </li>\n    ';
 } ;
__p += '\n  </ul>\n</div>\n<div class="Dialog-footer ErrorDetails-footer">\n  <button class="CDB-Button CDB-Button--secondary cancel">\n    <span class="CDB-Button-Text CDB-Text is-semibold CDB-Size-medium u-upperCase">close</span>\n  </button>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/views/google_plus"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="FormAccount-row GooglePlus-row js-googleRow">\n  <div class="FormAccount-rowLabel">\n    <label class="FormAccount-label">Google+</label>\n  </div>\n  <div class="FormAccount-rowData">\n    <iframe class="FormAccount-GooglePlus-iframe GooglePlus-iframe js-googleIframe" src="' +
__e( iframeSrc ) +
'" width="300" height="41"></iframe>\n    <div class="FormAccount-rowInfo">\n      <button type="button" class="CDB-Size-medium FormAccount-link js-googleDisconnect">Disconnect your Google+ account</button>\n    </div>\n  </div>\n  <div class="FormAccount-rowInfo">\n    <p class="FormAccount-rowInfoText js-googleText">Set a new password in order to disconnect from Google</p>\n  </div>\n</div>\n\n\n<script>\n  function disconnectGoogleAccount(callback, errorCallback) {\n    var revokeUrl = \'https://accounts.google.com/o/oauth2/revoke?token=\' + access_token;\n    $.ajax({\n      type: \'GET\',\n      url: revokeUrl,\n      async: false,\n      contentType: "application/json",\n      dataType: \'jsonp\',\n      success: callback,\n      error: errorCallback\n    });\n  }\n\n  function signinCallback(authResult) {\n    if (typeof authResult.access_token != \'undefined\') {\n      // INFO: user exists, let\'s sign in\n      if (authResult[\'status\'][\'signed_in\']) {\n        access_token = authResult.access_token;\n        currentUser.set({\n          logged_with_google: true,\n          google_enabled: true\n        });\n      }\n    } else {\n      window.currentUser.set(\'google_enabled\', false);\n    }\n    if(typeof signinCallbackCalled != \'undefined\') {\n      signinCallbackCalled(authResult);\n    }\n  }\n</script>\n';

}
return __p
};

this["JST"]["cartodb/common/views/icon_selector_view"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="js-iconSelector">\n  <div class="FormAccount-rowLabel">\n    <label class="CDB-Text CDB-Size-medium is-semibold u-mainTextColor">App icon</label>\n  </div>\n  <div class="FormAccount-rowData FormAccount-avatar">\n    <div class="FormAccount-avatarPreview">\n      ';
 if (iconURL == null) { ;
__p += '\n        <div class="FormAccount-inputIcon--noIcon">No icon</div>\n      ';
 } else { ;
__p += '\n        <img src="' +
__e( iconURL ) +
'" title="' +
__e( name ) +
'" alt="' +
__e( name ) +
'" class="FormAccount-avatarPreviewImage" />\n      ';
 } ;
__p += '\n      ';
 if ( state === "loading" ) { ;
__p += '\n        <div class="FormAccount-avatarPreviewLoader">\n          <div class="Spinner FormAccount-avatarPreviewSpinner"></div>\n        </div>\n      ';
 } ;
__p += '\n    </div>\n    <input class="js-fileIcon" type="file" value="Choose image" accept="' +
__e( iconAcceptedExtensions ) +
'" />\n    <input class="js-inputIcon" id="mobile_app_icon_url" name="' +
__e( inputName ) +
'" type="hidden" value="' +
__e( iconURL ) +
'" />\n    <div class="FormAccount-rowInfo FormAccount-rowInfo--marginLeft">\n      ';
 if (state === "error") { ;
__p += '\n        <p class="FormAccount-rowInfoText FormAccount-rowInfoText--error FormAccount-rowInfoText--maxWidth">There was an error uploading the icon. Check the height and size (max 1MB) of the image</p>\n      ';
 } else { ;
__p += '\n        <p class="FormAccount-rowInfoText FormAccount-rowInfoText--smaller">Recommended images should be 128x128 pixels of size</p>\n      ';
 } ;
__p += '\n    </div>\n  </div>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/views/layers_error_details_upgrade_template"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="Dialog-header ErrorDetails-header">\n  <div class="Dialog-headerIcon Dialog-headerIcon--negative">\n    <i class="CDB-IconFont CDB-IconFont-barometer"></i>\n  </div>\n  <p class="Dialog-headerTitle">You have reached your layers limit</p>\n  <p class="Dialog-headerText">Remove any layer or upgrade your account</p>\n</div>\n<div class="Dialog-body ErrorDetails-body ErrorDetails-body--no-line">\n  <div class="UpgradeElement">\n    <div class="UpgradeElement-info">\n      <div class="LayoutIcon UpgradeElement-infoIcon">\n        <i class="CDB-IconFont CDB-IconFont-rocket"></i>\n      </div>\n      <p class="UpgradeElement-infoText u-ellipsLongText">Keep your maps and get more layers quota by upgrading your plan</p>\n    </div>\n    ';
 if (showTrial) { ;
__p += '\n      <div class="UpgradeElement-trial">\n        <i class="CDB-IconFont CDB-IconFont-gift UpgradeElement-trialIcon"></i>\n        <p class="UpgradeElement-trialText u-ellipsLongText">14 days Free trial</p>\n      </div>\n    ';
 } ;
__p += '\n  </div>\n</div>\n<div class="Dialog-footer ErrorDetails-footer ErrorDetails-footer--no-line">\n  <a href="' +
__e( upgradeUrl ) +
'" class="Button Button--main ErrorDetails-footerButton">\n    <span>upgrade</span>\n  </a>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/views/likes/template"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<i class="CDB-IconFont CDB-IconFont-heartFill LikesIndicator-icon ';
 if ((typeof size != "undefined") && size == 'big') { ;
__p += 'LikesIndicator-icon--big Navmenu-icon';
 } ;
__p += '"></i>';
 if (likes > 2 || show_count) { ;
__p += '<span class="CDB-Text CDB-Size-medium LikesIndicator-count">' +
__e( likes ) +
'</span>';
 if (show_label && likes > 1) { ;
__p += ' <span class="CDB-Text CDB-Size-medium LikesIndicator-label">' +
__e( (likes != 1) ? 'likes' : 'like' ) +
'</span>';
 } ;

 } ;
__p += '\n';

}
return __p
};

this["JST"]["cartodb/common/views/paged_search/paged_search"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="Filters is-relative ';
 if (thinFilters) { ;
__p += 'Filters--thin';
 } ;
__p += '">\n  <div class="Filters-inner">\n    <div class="Filters-row js-filters">\n      <div class="Filters-typeItem Filters-typeItem--searchEnabler">\n        <p class="Filters-searchLink js-search-link u-alignCenter CDB-Text CDB-Size-medium">\n          <i class="Filters-searchLinkIcon CDB-IconFont CDB-IconFont-lens"></i> Search\n        </p>\n      </div>\n      <div class="Filters-typeItem Filters-typeItem--searchField">\n        <form class="Filters-searchForm js-search-form" action="#">\n          <input class="Filters-searchInput CDB-Text CDB-Size-medium js-search-input" type="text" value="' +
__e( q ) +
'" placeholder="Search by username or email" />\n          <button type="button" class="Filters-cleanSearch js-clean-search u-actionTextColor">\n            <i class="CDB-IconFont CDB-IconFont-close"></i>\n          </button>\n        </form>\n      </div>\n    </div>\n  </div>\n  <span class="Filters-separator"></span>\n</div>\n<div class="js-tab-pane"></div>\n';

}
return __p
};

this["JST"]["cartodb/common/views/paged_search/paged_search_dialog_wrapper"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="Dialog-body Dialog-body--share Dialog-body--withoutBorder Dialog-body--expanded">\n  <div class="u-inner">\n    ' +
((__t = ( htmlToWrap )) == null ? '' : __t) +
'\n  </div>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/views/pagination/template"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<span class="DefaultDescription Pagination-label">\n  Page ' +
__e( currentPage ) +
' of ' +
__e( pagesCount ) +
'\n</span>\n<ul class="Pagination-list">\n  ';
 m.pagesToDisplay().forEach(function(page) { ;
__p += '\n    ';
 if (page > 0) { ;
__p += '\n      <li class="Pagination-listItem ' +
__e( m.isCurrentPage(page) ? 'is-current' : '' ) +
'">\n        <a class="Pagination-listItemInner Pagination-listItemInner--link" href="' +
__e( m.urlTo(page) ) +
'" data-page="' +
__e( page ) +
'">' +
__e( page ) +
'</a>\n      </li>\n    ';
 } else { ;
__p += '\n      <li class="Pagination-listItem Pagination-listItem">\n        <span class="Pagination-listItemInner Pagination-listItemInner--more">&hellip;</span>\n      </li>\n    ';
 } ;
__p += '\n  ';
 }) ;
__p += '\n</ul>\n';

}
return __p
};

this["JST"]["cartodb/common/views/partial_import_details"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="Dialog-header ErrorDetails-header">\n  <div class="Dialog-headerIcon Dialog-headerIcon--alert">\n    <i class="CDB-IconFont CDB-IconFont-cloud"></i>\n  </div>\n  <p class="CDB-Text CDB-Size-large u-mainTextColor u-secondaryTextColor u-bSpace--m u-tSpace-xl">\n    Unable to add all imported Datasets as Layers\n  </p>\n  <p class="CDB-Text CDB-Size-medium u-altTextColor">\n    You can find all the connected datasets under the Datasets section. </br>\n    <a href="https://carto.com/pricing/">Upgrade your account</a> to add more than ' +
__e( warnings.user_max_layers ) +
' layers to your maps.\n  </p>\n</div>\n';
 if(warnings.max_tables_per_import) { ;
__p += '\n  <div class="Dialog-body ErrorDetails-body">\n    <ul class="ErrorDetails-list">\n      <li class="ErrorDetails-item">\n        <div class="ErrorDetails-itemStep CDB-Text u-altTextColor">!</div>\n        <div class="ErrorDetails-itemText CDB-Text CDB-Size-medium u-altTextColor">\n          NOTE: The file you uploaded contained too many Datasets. No more than ' +
__e( warnings.max_tables_per_import ) +
' Datasets can be imported from a single file.\n        </div>\n      </li>\n    </ul>\n  </div>\n';
 } ;
__p += '\n<div class="Dialog-footer ErrorDetails-footer">\n  <button class="CDB-Button CDB-Button--secondary cancel">\n    <span class="CDB-Button-Text CDB-Text is-semibold CDB-Size-small u-upperCase">CONTINUE</span>\n  </button>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/views/size_error_details_upgrade_template"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="Dialog-header ErrorDetails-header">\n  <div class="Dialog-headerIcon Dialog-headerIcon--negative">\n    <i class="CDB-IconFont CDB-IconFont-barometer"></i>\n  </div>\n  <p class="Dialog-headerTitle CDB-Text">You have run out of quota</p>\n  <p class="Dialog-headerText CDB-Text">Remove some of your datasets to gain available space or upgrade your account</p>\n</div>\n<div class="Dialog-body ErrorDetails-body ErrorDetails-body--no-line">\n  <div class="UpgradeElement">\n    <div class="UpgradeElement-info">\n      <div class="LayoutIcon UpgradeElement-infoIcon">\n        <i class="CDB-IconFont CDB-IconFont-rocket"></i>\n      </div>\n      <p class="UpgradeElement-infoText u-ellipsLongText CDB-Text">Keep your data and get more quota by upgrading your plan</p>\n    </div>\n    ';
 if (showTrial) { ;
__p += '\n      <div class="UpgradeElement-trial">\n        <i class="CDB-IconFont CDB-IconFont-gift UpgradeElement-trialIcon"></i>\n        <p class="UpgradeElement-trialText u-ellipsLongText">14 days Free trial</p>\n      </div>\n    ';
 } ;
__p += '\n  </div>\n</div>\n<div class="Dialog-footer ErrorDetails-footer ErrorDetails-footer--no-line">\n  <a href="' +
__e( upgradeUrl ) +
'" class="Button Button--main ErrorDetails-footerButton CDB-Text">\n    <span>upgrade</span>\n  </a>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/views/support_banner"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="u-inner">\n  <div class="SupportBanner-inner">\n    <div class="SupportBanner-info">\n      <h4 class="CDB-Text CDB-Size-large u-secondaryTextColor u-bSpace">\n        ';
 if (userType === 'org_admin' || userType === 'client') { ;
__p += '\n          As a paying customer, you have access to our dedicated support.\n        ';
 } else if (isViewer) { ;
__p += '\n            Contact the <a href="mailto:' +
__e( orgDisplayEmail ) +
'">organization administrator</a> to become a builder.\n        ';
 } else if (userType === 'org') { ;
__p += '\n          Contact the <a href="mailto:' +
__e( orgDisplayEmail ) +
'">organization administrator</a> for support.\n        ';
 } else if (userType === "internal") { ;
__p += '\n          You are part of CARTO, you deserve outstanding support.\n        ';
 } else { ;
__p += '\n          For all technical questions, contact our community support forum.\n        ';
 } ;
__p += '\n      </h4>\n      <p class="CDB-Text CDB-Size-medium u-altTextColor">\n        ';
 if (isViewer) { ;
__p += '\n          You will be able to create your own maps!\n        ';
 } else if (userType === 'org' || userType === 'org_admin' || userType === 'client') { ;
__p += '\n          Remember that there is a lot of information in our <a href="http://gis.stackexchange.com/questions/tagged/carto" target="_blank">community forums</a>.\n        ';
 } else if (userType === "internal") { ;
__p += '\n          Don&#39;t forget to share your knowledge in our <a href="http://gis.stackexchange.com/questions/tagged/carto"  target="_blank">community forums</a>.\n        ';
 } else { ;
__p += '\n          If you experience any problems with the CARTO service, feel free to <a href="mailto:support@carto.com">contact us</a>.\n        ';
 } ;
__p += '\n      </p>\n    </div>\n    ';
 if (userType === 'org_admin') { ;
__p += '\n      <a href="mailto:enterprise-support@carto.com" class="SupportBanner-link CDB-Button CDB-Button--secondary">\n        <span class="CDB-Button-Text CDB-Text is-semibold CDB-Size-medium u-upperCase">Contact support</span>\n      </a>\n    ';
 } else if (userType === 'org') { ;
__p += '\n        <a href="mailto:' +
__e( orgDisplayEmail ) +
'" class="SupportBanner-link CDB-Button CDB-Button--secondary">\n          <span class="CDB-Button-Text CDB-Text is-semibold CDB-Size-medium u-upperCase">Contact administrator</span>\n        </a>\n    ';
 } else if (userType === 'client' || userType === 'internal') { ;
__p += '\n      <a href="mailto:support@carto.com" class="SupportBanner-link CDB-Button CDB-Button--secondary">\n        <span class="CDB-Button-Text CDB-Text is-semibold CDB-Size-medium u-upperCase">Contact us</span>\n      </a>\n    ';
 } else { ;
__p += '\n      <a href="http://gis.stackexchange.com/questions/tagged/carto" class="SupportBanner-link CDB-Button CDB-Button--secondary" target="_blank">\n        <span class="CDB-Button-Text CDB-Text is-semibold CDB-Size-medium u-upperCase">Community support</span>\n      </a>\n    ';
 } ;
__p += '\n  </div>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/views/too_many_files_details"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="Dialog-header ErrorDetails-header">\n  <div class="Dialog-headerIcon Dialog-headerIcon--alert">\n    <i class="CDB-IconFont CDB-IconFont-cloud"></i>\n  </div>\n  <p class="CDB-Text CDB-Size-large u-mainTextColor u-secondaryTextColor u-bSpace--m u-tSpace-xl">\n    Unable to import all Datasets in file\n  </p>\n  <p class="CDB-Text CDB-Size-medium u-altTextColor">\n    No more than ' +
__e( warnings.max_tables_per_import ) +
' Datasets can be imported from a single file. </br>\n    You can find all the connected datasets under the Datasets section.\n  </p>\n</div>\n<div class="Dialog-footer ErrorDetails-footer">\n  <button class="CDB-Button CDB-Button--secondary cancel">\n    <span class="CDB-Button-Text CDB-Text is-semibold CDB-Size-small u-upperCase">CONTINUE</span>\n  </button>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/views/too_many_rows_connection_details"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="Dialog-header ErrorDetails-header">\n  <div class="Dialog-headerIcon Dialog-headerIcon--alert">\n    <i class="CDB-IconFont CDB-IconFont-cloud"></i>\n  </div>\n  <p class="CDB-Text CDB-Size-large u-mainTextColor u-secondaryTextColor u-bSpace--m u-tSpace-xl">\n    You may have reached the maximum limit\n  </p>\n  <p class="CDB-Text CDB-Size-medium u-altTextColor">\n    For a database connector import, the number of rows allowed is ' +
__e( warnings.max_rows_per_connection ) +
'. Some of your data may not be imported.\n  </p>\n</div>\n<div class="Dialog-footer ErrorDetails-footer">\n  <button class="CDB-Button CDB-Button--secondary cancel">\n    <span class="CDB-Button-Text CDB-Text is-semibold CDB-Size-small u-upperCase">CONTINUE</span>\n  </button>\n</div>\n';

}
return __p
};

this["JST"]["cartodb/common/views/upgrade_message"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 if (closeToLimits && canUpgrade) { ;
__p += '\n<div class="CDB-Text FlashMessage FlashMessage--main UpgradeElement UpgradeElement--noMargins">\n  <div class="u-inner">\n    <div class="UpgradeElement-info">\n      <p class="UpgradeElement-infoText u-ellipsLongText">\n        ';
 if (quotaPer <= 0) { ;
__p += '\n          You have reached your limits.\n        ';
 } else { ;
__p += '\n          You are close to your limits.\n        ';
 } ;
__p += '\n        Upgrade your account to boost your quota\n      </p>\n    </div>\n    <div class="UpgradeElement-actions">\n      ';
 if (showTrial) { ;
__p += '\n        <div class="UpgradeElement-trial">\n          <i class="CDB-IconFont CDB-IconFont-gift UpgradeElement-trialIcon"></i>\n          <p class="UpgradeElement-trialText u-ellipsLongText">14 days Free trial</p>\n        </div>\n      ';
 } ;
__p += '\n      <a href="' +
__e( upgradeUrl ) +
'" class="Button Button--secondary UpgradeElement-button ChangePrivacy-upgradeActionButton">\n        <span>upgrade your plan</span>\n      </a>\n    </div>\n  </div>\n</div>\n';
 } ;
__p += '\n';

}
return __p
};

this["JST"]["cartodb/account/views/service_disconnect_dialog"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="CDB-Text Dialog-header u-inner">\n  <div class="Dialog-headerIcon Dialog-headerIcon--negative">\n    <i class="CDB-IconFont CDB-IconFont-cloud"></i>\n  </div>\n  <p class="Dialog-headerTitle">\n    Disconnect your ' +
__e( title ) +
' account\n  </p>\n  <p class="Dialog-headerText">\n    ';
 if (revoke_url) { ;
__p += '\n      Revoke the access to CARTO\n    ';
 } else { ;
__p += '\n      Are you sure you want to revoke the CARTO access to your ' +
__e( title ) +
' account?\n    ';
 } ;
__p += '\n  </p>\n</div>\n\n';
 if (revoke_url) { ;
__p += '\n  <div class="Dialog-body">\n    <p class="DefaultParagraph DefaultParagraph--short DefaultParagraph--centered DefaultParagraph--spaced">\n      We can\'t revoke the access for your ' +
__e( title ) +
' account automatically.\n    </p>\n    <p class="DefaultParagraph DefaultParagraph--short DefaultParagraph--centered DefaultParagraph--spaced">\n      For your own security, we are unable to disconnect your ' +
__e( title ) +
' account from CARTO.\n      You can revoke access yourself by manually editing your ' +
__e( title ) +
' authorized applications.\n    </p>\n  </div>\n';
 } ;
__p += '\n\n<div class="Dialog-footer u-inner">\n  ';
 if (revoke_url) { ;
__p += '\n    <a href="' +
__e( revoke_url) +
'" target="_blank" class="Button Button-inner Button--inline Button--secondary ">\n      <span>go to ' +
__e( title ) +
'</span>\n    </a>\n  ';
 } else { ;
__p += '\n    <button class="CDB-Text Button Button--secondary Dialog-footerBtn Button--inline cancel">\n      <span>cancel</span>\n    </button>\n    <button class="CDB-Text js-revoke Button Button--negative Button--inline">\n      <span>Revoke access</span>\n    </button>\n  ';
 } ;
__p += '\n</div>\n';

}
return __p
};

this["JST"]["cartodb/account/views/service_item"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="FormAccount-rowLabel">\n  <label class="CDB-Text CDB-Size-medium is-semibold u-mainTextColor FormAccount-label">' +
__e( title ) +
'</label>\n</div>\n<div class="FormAccount-rowData">\n  ';
 if (connected) { ;
__p += '\n    <input class="CDB-InputText CDB-Text FormAccount-input FormAccount-input--med is-disabled" readonly value="Connected" />\n  ';
 } else { ;
__p += '\n    ';
 if (state === "loading") { ;
__p += '\n      <button type="button" class="CDB-Size-medium FormAccount-link is-disabled">Connecting...</button>\n    ';
 } else { ;
__p += '\n      <button type="button" class="CDB-Size-medium FormAccount-link js-connect">\n        <i class="ServiceIcon ServiceIcon--' +
__e( name ) +
'"></i>Connect\n      </button>\n    ';
 } ;
__p += '\n  ';
 } ;
__p += '\n\n  <div class="FormAccount-rowInfo FormAccount-rowInfo--marginLeft FormAccount-rowInfoText--multipleLines">\n    <p class="FormAccount-rowInfoText ' +
__e( state === "error" ? 'FormAccount-rowInfoText--error' : '' ) +
'">\n    ';
 if (connected) { ;
__p += '\n      ';
 if (state === "error") { ;
__p += '\n        Ooops! There was an error, please <button type="button" class="FormAccount-link js-disconnect">try it again</button>\n        or <a class="FormAccount-link" href="mailto:support@carto.com">contact us</a> if the problem persists\n      ';
 } else if (state === "loading") { ;
__p += '\n        Disconnecting...\n      ';
 } else { ;
__p += '\n        <button type="button" class="CDB-Size-medium FormAccount-link js-disconnect">Disconnect</button>\n      ';
 } ;
__p += '\n    ';
 } else { ;
__p += '\n      ';
 if (state === "error") { ;
__p += '\n        There was an error, please be sure your pop-up blocker is disabled and try again or\n        <a class="FormAccount-link" href="mailto:support@carto.com">contact us</a> if the problem persists\n      ';
 } ;
__p += '\n    ';
 } ;
__p += '\n    </p>\n  </div>\n</div>\n';

}
return __p
};
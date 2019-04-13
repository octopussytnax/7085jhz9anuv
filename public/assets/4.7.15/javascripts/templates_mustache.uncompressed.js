this["JST"] = this["JST"] || {};

this["JST"]["cartodb/table/views/infowindow/custom_templates/infowindow_dark"] = cdb.core.Template.compile('<div class="cartodb-popup dark v2">\n  <a href="#close" class="cartodb-popup-close-button close">x</a>\n  <div class="cartodb-popup-content-wrapper">\n    <div class="cartodb-popup-content">\n      {{#content.fields}}\n      {{#title}}\n      {{#alternative_name}}\n      <h4>{{alternative_name}}</h4>\n      {{/alternative_name}}\n      {{^alternative_name}}\n      <h4>{{name}}</h4>\n      {{/alternative_name}}\n      <p>{{=<% %>=}}{{<%={{ }}=%>{{{ name }}}{{=<% %>=}}}}<%={{ }}=%></p>\n      {{/title}}\n      {{^title}}\n      <p>{{=<% %>=}}{{<%={{ }}=%>{{{ name }}}{{=<% %>=}}}}<%={{ }}=%></p>\n      {{/title}}\n      {{/content.fields}}\n    </div>\n  </div>\n  <div class="cartodb-popup-tip-container"></div>\n</div>\n', 'mustache');

this["JST"]["cartodb/table/views/infowindow/custom_templates/infowindow_header_with_image"] = cdb.core.Template.compile('<div class="cartodb-popup header with-image v2" data-cover="true">\n  <a href="#close" class="cartodb-popup-close-button close">x</a>\n  <div class="cartodb-popup-header">\n    <div class="cover">\n      <div id="spinner"></div>\n      <div class="image_not_found"> <i></i> <a href="#/map" class="help">Non-valid picture URL</a></div>\n      {{#content.fields}}\n      {{^position}}\n      <span class="separator"></span>\n      {{#content.fields.1 }}\n      <h1 class="order1">{{=<% %>=}}{{<%={{ }}=%>{{{ content.fields.1.name }}}{{=<% %>=}}}}<%={{ }}=%></h1>\n      {{/content.fields.1 }}\n      <div class="shadow"></div>\n      <img src="{{=<% %>=}}{{<%={{ }}=%>{{{ name }}}{{=<% %>=}}}}<%={{ }}=%>" style="height:138px;display:inline" />\n      {{/position}}\n      {{/content.fields}}\n    </div>\n  </div>\n  <div class="cartodb-popup-content-wrapper">\n    <div class="cartodb-popup-content">\n      {{#content.fields}}\n      {{#position}}\n      {{#title}}\n      {{#alternative_name}}\n      <h4>{{alternative_name}}</h4>\n      {{/alternative_name}}\n      {{^alternative_name}}\n      <h4>{{name}}</h4>\n      {{/alternative_name}}\n      <p>{{=<% %>=}}{{<%={{ }}=%>{{{ name }}}{{=<% %>=}}}}<%={{ }}=%></p>\n      {{/title}}\n      {{^title}}\n      <p>{{=<% %>=}}{{<%={{ }}=%>{{{ name }}}{{=<% %>=}}}}<%={{ }}=%></p>\n      {{/title}}\n      {{/position}}\n      {{/content.fields}}\n    </div>\n  </div>\n  <div class="cartodb-popup-tip-container"></div>\n</div>', 'mustache');

this["JST"]["cartodb/table/views/infowindow/custom_templates/infowindow_light"] = cdb.core.Template.compile('<div class="cartodb-popup v2">\n  <a href="#close" class="cartodb-popup-close-button close">x</a>\n  <div class="cartodb-popup-content-wrapper">\n    <div class="cartodb-popup-content">\n      {{#content.fields}}\n      {{#title}}\n      {{#alternative_name}}\n      <h4>{{alternative_name}}</h4>\n      {{/alternative_name}}\n      {{^alternative_name}}\n      <h4>{{name}}</h4>\n      {{/alternative_name}}\n      <p>{{=<% %>=}}{{<%={{ }}=%>{{{ name }}}{{=<% %>=}}}}<%={{ }}=%></p>\n      {{/title}}\n      {{^title}}\n      <p>{{=<% %>=}}{{<%={{ }}=%>{{{ name }}}{{=<% %>=}}}}<%={{ }}=%></p>\n      {{/title}}\n      {{/content.fields}}\n    </div>\n  </div>\n  <div class="cartodb-popup-tip-container"></div>\n</div>', 'mustache');

this["JST"]["cartodb/table/views/infowindow/custom_templates/infowindow_light_header_blue"] = cdb.core.Template.compile('<div class="cartodb-popup header blue v2">\n  <a href="#close" class="cartodb-popup-close-button close">x</a>\n  <div class="cartodb-popup-header">\n    {{#content.fields.length}}\n    {{#content.fields.0.title}}\n    {{#content.fields.0.alternative_name}}\n    <h4>{{content.fields.0.alternative_name}}</h4>\n    {{/content.fields.0.alternative_name}}\n    {{^content.fields.0.alternative_name}}\n    <h4>{{content.fields.0.name}}</h4>\n    {{/content.fields.0.alternative_name}}\n    <h1>{{=<% %>=}}{{<%={{ }}=%>{{{ content.fields.0.name }}}{{=<% %>=}}}}<%={{ }}=%></h1>\n    {{/content.fields.0.title}}\n    {{^content.fields.0.title}}\n    <h1>{{=<% %>=}}{{<%={{ }}=%>{{{ content.fields.0.name }}}{{=<% %>=}}}}<%={{ }}=%></h1>\n    {{/content.fields.0.title}}\n    <span class="separator"></span>\n    {{/content.fields.length}}\n  </div>\n  <div class="cartodb-popup-content-wrapper">\n    <div class="cartodb-popup-content">\n      {{#content.fields}}\n      {{#position}}\n      {{#title}}\n      {{#alternative_name}}\n      <h4>{{alternative_name}}</h4>\n      {{/alternative_name}}\n      {{^alternative_name}}\n      <h4>{{name}}</h4>\n      {{/alternative_name}}\n      <p>{{=<% %>=}}{{<%={{ }}=%>{{{ name }}}{{=<% %>=}}}}<%={{ }}=%></p>\n      {{/title}}\n      {{^title}}\n      <p>{{=<% %>=}}{{<%={{ }}=%>{{{ name }}}{{=<% %>=}}}}<%={{ }}=%></p>\n      {{/title}}\n      {{/position}}\n      {{/content.fields}}\n    </div>\n  </div>\n  <div class="cartodb-popup-tip-container">\n  </div>\n</div>', 'mustache');

this["JST"]["cartodb/table/views/infowindow/custom_templates/infowindow_light_header_green"] = cdb.core.Template.compile('<div class="cartodb-popup header green v2">\n  <a href="#close" class="cartodb-popup-close-button close">x</a>\n  <div class="cartodb-popup-header">\n    {{#content.fields.length}}\n    {{#content.fields.0.title}}\n    {{#content.fields.0.alternative_name}}\n    <h4>{{content.fields.0.alternative_name}}</h4>\n    {{/content.fields.0.alternative_name}}\n    {{^content.fields.0.alternative_name}}\n    <h4>{{content.fields.0.name}}</h4>\n    {{/content.fields.0.alternative_name}}\n    <h1>{{=<% %>=}}{{<%={{ }}=%>{{{ content.fields.0.name }}}{{=<% %>=}}}}<%={{ }}=%></h1>\n    {{/content.fields.0.title}}\n    {{^content.fields.0.title}}\n    <h1>{{=<% %>=}}{{<%={{ }}=%>{{{ content.fields.0.name }}}{{=<% %>=}}}}<%={{ }}=%></h1>\n    {{/content.fields.0.title}}\n    <span class="separator"></span>\n    {{/content.fields.length}}\n  </div>\n  <div class="cartodb-popup-content-wrapper">\n    <div class="cartodb-popup-content">\n      {{#content.fields}}\n      {{#position}}\n      {{#title}}\n      {{#alternative_name}}\n      <h4>{{alternative_name}}</h4>\n      {{/alternative_name}}\n      {{^alternative_name}}\n      <h4>{{name}}</h4>\n      {{/alternative_name}}\n      <p>{{=<% %>=}}{{<%={{ }}=%>{{{ name }}}{{=<% %>=}}}}<%={{ }}=%></p>\n      {{/title}}\n      {{^title}}\n      <p>{{=<% %>=}}{{<%={{ }}=%>{{{ name }}}{{=<% %>=}}}}<%={{ }}=%></p>\n      {{/title}}\n      {{/position}}\n      {{/content.fields}}\n    </div>\n  </div>\n  <div class="cartodb-popup-tip-container">\n  </div>\n</div>', 'mustache');

this["JST"]["cartodb/table/views/infowindow/custom_templates/infowindow_light_header_orange"] = cdb.core.Template.compile('<div class="cartodb-popup header orange v2">\n  <a href="#close" class="cartodb-popup-close-button close">x</a>\n  <div class="cartodb-popup-header">\n    {{#content.fields.length}}\n    {{#content.fields.0.title}}\n    {{#content.fields.0.alternative_name}}\n    <h4>{{content.fields.0.alternative_name}}</h4>\n    {{/content.fields.0.alternative_name}}\n    {{^content.fields.0.alternative_name}}\n    <h4>{{content.fields.0.name}}</h4>\n    {{/content.fields.0.alternative_name}}\n    <h1>{{=<% %>=}}{{<%={{ }}=%>{{{ content.fields.0.name }}}{{=<% %>=}}}}<%={{ }}=%></h1>\n    {{/content.fields.0.title}}\n    {{^content.fields.0.title}}\n    <h1>{{=<% %>=}}{{<%={{ }}=%>{{{ content.fields.0.name }}}{{=<% %>=}}}}<%={{ }}=%></h1>\n    {{/content.fields.0.title}}\n    <span class="separator"></span>\n    {{/content.fields.length}}\n  </div>\n  <div class="cartodb-popup-content-wrapper">\n    <div class="cartodb-popup-content">\n      {{#content.fields}}\n      {{#position}}\n      {{#title}}\n      {{#alternative_name}}\n      <h4>{{alternative_name}}</h4>\n      {{/alternative_name}}\n      {{^alternative_name}}\n      <h4>{{name}}</h4>\n      {{/alternative_name}}\n      <p>{{=<% %>=}}{{<%={{ }}=%>{{{ name }}}{{=<% %>=}}}}<%={{ }}=%></p>\n      {{/title}}\n      {{^title}}\n      <p>{{=<% %>=}}{{<%={{ }}=%>{{{ name }}}{{=<% %>=}}}}<%={{ }}=%></p>\n      {{/title}}\n      {{/position}}\n      {{/content.fields}}\n    </div>\n  </div>\n  <div class="cartodb-popup-tip-container">\n  </div>\n</div>', 'mustache');

this["JST"]["cartodb/table/views/infowindow/custom_templates/infowindow_light_header_yellow"] = cdb.core.Template.compile('<div class="cartodb-popup header yellow v2">\n  <a href="#close" class="cartodb-popup-close-button close">x</a>\n  <div class="cartodb-popup-header">\n    {{#content.fields.length}}\n    {{#content.fields.0.title}}\n    {{#content.fields.0.alternative_name}}\n    <h4>{{content.fields.0.alternative_name}}</h4>\n    {{/content.fields.0.alternative_name}}\n    {{^content.fields.0.alternative_name}}\n    <h4>{{content.fields.0.name}}</h4>\n    {{/content.fields.0.alternative_name}}\n    <h1>{{=<% %>=}}{{<%={{ }}=%>{{{ content.fields.0.name }}}{{=<% %>=}}}}<%={{ }}=%></h1>\n    {{/content.fields.0.title}}\n    {{^content.fields.0.title}}\n    <h1>{{=<% %>=}}{{<%={{ }}=%>{{{ content.fields.0.name }}}{{=<% %>=}}}}<%={{ }}=%></h1>\n    {{/content.fields.0.title}}\n    <span class="separator"></span>\n    {{/content.fields.length}}\n  </div>\n  <div class="cartodb-popup-content-wrapper">\n    <div class="cartodb-popup-content">\n      {{#content.fields}}\n      {{#position}}\n      {{#title}}\n      {{#alternative_name}}\n      <h4>{{alternative_name}}</h4>\n      {{/alternative_name}}\n      {{^alternative_name}}\n      <h4>{{name}}</h4>\n      {{/alternative_name}}\n      <p>{{=<% %>=}}{{<%={{ }}=%>{{{ name }}}{{=<% %>=}}}}<%={{ }}=%></p>\n      {{/title}}\n      {{^title}}\n      <p>{{=<% %>=}}{{<%={{ }}=%>{{{ name }}}{{=<% %>=}}}}<%={{ }}=%></p>\n      {{/title}}\n      {{/position}}\n      {{/content.fields}}\n    </div>\n  </div>\n  <div class="cartodb-popup-tip-container">\n  </div>\n</div>', 'mustache');

this["JST"]["cartodb/table/views/infowindow/custom_templates/none"] = cdb.core.Template.compile('<div class="cartodb-popup v2">\n  <a href="#close" class="cartodb-popup-close-button close">x</a>\n  <div class="cartodb-popup-content-wrapper">\n    <div class="cartodb-popup-content">\n    </div>\n  </div>\n  <div class="cartodb-popup-tip-container"></div>\n</div>', 'mustache');

this["JST"]["cartodb/table/views/infowindow/templates/infowindow_dark"] = cdb.core.Template.compile('<div class="cartodb-popup dark v2">\n  <a href="#close" class="cartodb-popup-close-button close">x</a>\n  <div class="cartodb-popup-content-wrapper">\n    <div class="cartodb-popup-content">\n      {{#content.fields}}\n        {{#title}}<h4>{{title}}</h4>{{/title}}\n        {{#value}}\n          <p {{#type}}class="{{ type }}"{{/type}}>{{{ value }}}</p>\n        {{/value}}\n        {{^value}}\n          <p class="empty">null</p>\n        {{/value}}\n      {{/content.fields}}\n    </div>\n  </div>\n  <div class="cartodb-popup-tip-container"></div>\n</div>\n', 'mustache');

this["JST"]["cartodb/table/views/infowindow/templates/infowindow_header_with_image"] = cdb.core.Template.compile('<div class="cartodb-popup header with-image v2" data-cover="true">\n  <a href="#close" class="cartodb-popup-close-button close">x</a>\n  <div class="cartodb-popup-header">\n  <div class="cover">\n      <div id="spinner"></div>\n      <div class="image_not_found"> <i></i> <a href="#map" class="help">Non-valid picture URL</a></div>\n      {{#content.fields}}\n        {{#index}}\n          {{#value}}\n            <h1 class="order{{index}}">{{{ value }}}</h1>\n          {{/value}}\n          {{^value}}\n            <h1 class="order{{index}}">null</h1>\n          {{/value}}\n        {{/index}}\n        {{^index}}\n          {{^value}}\n            <h1 class="empty">null</h1>\n          {{/value}}\n          <span class="separator"></span>      \n        {{/index}}\n      {{/content.fields}}\n\n      <div class="shadow"></div>\n    </div>\n  </div>\n\n  <div class="cartodb-popup-content-wrapper">\n    <div class="cartodb-popup-content">\n      {{#content.fields}}\n        <div class="order{{index}}">\n            {{#index}}\n              {{#title}}<h4>{{title}}</h4>{{/title}}\n              {{#value}}\n                <p>{{{ value }}}</p>\n              {{/value}}\n              {{^value}}\n                <p class="empty">null</p>\n              {{/value}}\n            {{/index}}\n        </div>\n      {{/content.fields}}\n    </div>\n  </div>\n  <div class="cartodb-popup-tip-container"></div>\n</div>', 'mustache');

this["JST"]["cartodb/table/views/infowindow/templates/infowindow_light"] = cdb.core.Template.compile('<div class="cartodb-popup v2">\n  <a href="#close" class="cartodb-popup-close-button close">x</a>\n  <div class="cartodb-popup-content-wrapper">\n    <div class="cartodb-popup-content">\n      {{#content.fields}}\n        {{#title}}<h4>{{title}}</h4>{{/title}}\n        {{#value}}\n          <p {{#type}}class="{{ type }}"{{/type}}>{{{ value }}}</p>\n        {{/value}}\n        {{^value}}\n          <p class="empty">null</p>\n        {{/value}}\n      {{/content.fields}}\n    </div>\n  </div>\n  <div class="cartodb-popup-tip-container"></div>\n</div>\n', 'mustache');

this["JST"]["cartodb/table/views/infowindow/templates/infowindow_light_header_blue"] = cdb.core.Template.compile('<div class="cartodb-popup header blue v2">\n  <a href="#close" class="cartodb-popup-close-button close">x</a>\n  <div class="cartodb-popup-header">\n    {{#content.fields}}\n      {{^index}}\n        {{#title}}<h4>{{title}}</h4>{{/title}}\n        {{#value}}\n          <h1 {{#type}}class="{{ type }}"{{/type}}>{{{ value }}}</h1>\n        {{/value}}\n        {{^value}}\n          <h1 class="empty">null</h1>\n        {{/value}}\n        <span class="separator"></span>\n      {{/index}}\n    {{/content.fields}}\n  </div>\n  <div class="cartodb-popup-content-wrapper">\n    <div class="cartodb-popup-content">\n      {{#content.fields}}\n        {{#index}}\n          {{#title}}<h4>{{title}}</h4>{{/title}}\n          {{#value}}\n            <p>{{{ value }}}</p>\n          {{/value}}\n          {{^value}}\n            <p class="empty">null</p>\n          {{/value}}\n        {{/index}}\n      {{/content.fields}}\n    </div>\n  </div>\n  <div class="cartodb-popup-tip-container">\n  </div>\n</div>', 'mustache');

this["JST"]["cartodb/table/views/infowindow/templates/infowindow_light_header_green"] = cdb.core.Template.compile('<div class="cartodb-popup header green v2">\n  <a href="#close" class="cartodb-popup-close-button close">x</a>\n  <div class="cartodb-popup-header">\n    {{#content.fields}}\n      {{^index}}\n        {{#title}}<h4>{{title}}</h4>{{/title}}\n        {{#value}}\n          <h1 {{#type}}class="{{ type }}"{{/type}}>{{{ value }}}</h1>\n        {{/value}}\n        {{^value}}\n          <h1 class="empty">null</h1>\n        {{/value}}\n        <span class="separator"></span>\n      {{/index}}\n    {{/content.fields}}\n  </div>\n  <div class="cartodb-popup-content-wrapper">\n    <div class="cartodb-popup-content">\n      {{#content.fields}}\n        {{#index}}\n          {{#title}}<h4>{{title}}</h4>{{/title}}\n          {{#value}}\n            <p>{{{ value }}}</p>\n          {{/value}}\n          {{^value}}\n            <p class="empty">null</p>\n          {{/value}}\n        {{/index}}\n      {{/content.fields}}\n    </div>\n  </div>\n  <div class="cartodb-popup-tip-container">\n  </div>\n</div>', 'mustache');

this["JST"]["cartodb/table/views/infowindow/templates/infowindow_light_header_orange"] = cdb.core.Template.compile('<div class="cartodb-popup header orange v2">\n  <a href="#close" class="cartodb-popup-close-button close">x</a>\n  <div class="cartodb-popup-header">\n    {{#content.fields}}\n      {{^index}}\n        {{#title}}<h4>{{title}}</h4>{{/title}}\n        {{#value}}\n          <h1 {{#type}}class="{{ type }}"{{/type}}>{{{ value }}}</h1>\n        {{/value}}\n        {{^value}}\n          <h1 class="empty">null</h1>\n        {{/value}}\n        <span class="separator"></span>      \n      {{/index}}\n    {{/content.fields}}\n  </div>\n  <div class="cartodb-popup-content-wrapper">\n    <div class="cartodb-popup-content">\n      {{#content.fields}}\n        {{#index}}\n          {{#title}}<h4>{{title}}</h4>{{/title}}\n          {{#value}}\n            <p>{{{ value }}}</p>\n          {{/value}}\n          {{^value}}\n            <p class="empty">null</p>\n          {{/value}}\n        {{/index}}\n      {{/content.fields}}\n    </div>\n  </div>\n  <div class="cartodb-popup-tip-container">\n  </div>\n</div>', 'mustache');

this["JST"]["cartodb/table/views/infowindow/templates/infowindow_light_header_yellow"] = cdb.core.Template.compile('<div class="cartodb-popup header yellow v2">\n  <a href="#close" class="cartodb-popup-close-button close">x</a>\n  <div class="cartodb-popup-header">\n    {{#content.fields}}\n      {{^index}}\n        {{#title}}<h4>{{title}}</h4>{{/title}}\n        {{#value}}\n          <h1 {{#type}}class="{{ type }}"{{/type}}>{{{ value }}}</h1>\n        {{/value}}\n        {{^value}}\n          <h1 class="empty">null</h1>\n        {{/value}}\n        <span class="separator"></span>\n      {{/index}}\n    {{/content.fields}}\n  </div>\n  <div class="cartodb-popup-content-wrapper">\n    <div class="cartodb-popup-content">\n      {{#content.fields}}\n        {{#index}}\n          {{#title}}<h4>{{title}}</h4>{{/title}}\n          {{#value}}\n            <p>{{{ value }}}</p>\n          {{/value}}\n          {{^value}}\n            <p class="empty">null</p>\n          {{/value}}\n        {{/index}}\n      {{/content.fields}}\n    </div>\n  </div>\n  <div class="cartodb-popup-tip-container">\n  </div>\n</div>', 'mustache');

this["JST"]["cartodb/table/views/infowindow/templates/none"] = cdb.core.Template.compile('<div class="cartodb-popup v2">\n  <a href="#close" class="cartodb-popup-close-button close">x</a>\n  <div class="cartodb-popup-content-wrapper">\n    <div class="cartodb-popup-content">\n    </div>\n  </div>\n  <div class="cartodb-popup-tip-container"></div>\n</div>', 'mustache');

this["JST"]["cartodb/table/views/tooltip/custom_templates/none"] = cdb.core.Template.compile('<div class="cartodb-tooltip-content-wrapper">\n  <div class="cartodb-tooltip-content">\n  </div>\n</div>', 'mustache');

this["JST"]["cartodb/table/views/tooltip/custom_templates/tooltip_dark"] = cdb.core.Template.compile('<div class="cartodb-tooltip-content-wrapper dark">\n  <div class="cartodb-tooltip-content">\n  {{#content}}\n    {{#content.fields}}\n    {{#title}}\n    {{#alternative_name}}\n    <h4>{{alternative_name}}</h4>\n    {{/alternative_name}}\n    {{^alternative_name}}\n    <h4>{{name}}</h4>\n    {{/alternative_name}}\n    <p>{{=<% %>=}}{{<%={{ }}=%>{{{ name }}}{{=<% %>=}}}}<%={{ }}=%></p>\n    {{/title}}\n    {{^title}}\n    <p>{{=<% %>=}}{{<%={{ }}=%>{{{ name }}}{{=<% %>=}}}}<%={{ }}=%></p>\n    {{/title}}\n    {{/content.fields}}\n  {{/content}}\n  </div>\n</div>', 'mustache');

this["JST"]["cartodb/table/views/tooltip/custom_templates/tooltip_light"] = cdb.core.Template.compile('<div class="cartodb-tooltip-content-wrapper">\n  <div class="cartodb-tooltip-content">\n  {{#content}}\n    {{#content.fields}}\n    {{#title}}\n    {{#alternative_name}}\n    <h4>{{alternative_name}}</h4>\n    {{/alternative_name}}\n    {{^alternative_name}}\n    <h4>{{name}}</h4>\n    {{/alternative_name}}\n    <p>{{=<% %>=}}{{<%={{ }}=%>{{{ name }}}{{=<% %>=}}}}<%={{ }}=%></p>\n    {{/title}}\n    {{^title}}\n    <p>{{=<% %>=}}{{<%={{ }}=%>{{{ name }}}{{=<% %>=}}}}<%={{ }}=%></p>\n    {{/title}}\n    {{/content.fields}}\n  {{/content}}\n  </div>\n</div>', 'mustache');

this["JST"]["cartodb/table/views/tooltip/templates/none"] = cdb.core.Template.compile('<div class="cartodb-tooltip-content-wrapper">\n  <div class="cartodb-tooltip-content">\n  </div>\n</div>', 'mustache');

this["JST"]["cartodb/table/views/tooltip/templates/tooltip_dark"] = cdb.core.Template.compile('<div class="cartodb-tooltip-content-wrapper dark">\n  <div class="cartodb-tooltip-content">\n  {{#fields}}\n    {{#title}}\n    <h4>{{title}}</h4>\n    {{/title}}\n    <p>{{{ value }}}</p>\n  {{/fields}}\n  </div>\n</div>', 'mustache');

this["JST"]["cartodb/table/views/tooltip/templates/tooltip_light"] = cdb.core.Template.compile('<div class="cartodb-tooltip-content-wrapper">\n  <div class="cartodb-tooltip-content">\n  {{#fields}}\n    {{#title}}\n    <h4>{{title}}</h4>\n    {{/title}}\n    <p>{{{ value }}}</p>\n  {{/fields}}\n  </div>\n</div>', 'mustache');
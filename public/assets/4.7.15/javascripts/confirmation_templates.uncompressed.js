this["JST"] = this["JST"] || {};

this["JST"]["cartodb/confirmation/confirmation_info"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="js-info">\n  <h1 class="Sessions-title u-tspace-m">\n    ';
 if (state === "success") { ;
__p += '\n      Your account is ready\n    ';
 } else if (state === "failure") { ;
__p += '\n      Oops! There was a problem\n    ';
 } else { ;
__p += '\n      Your account is being created\n    ';
 } ;
__p += '\n  </h1>\n  <p class="Sessions-description">\n    ';
 if (state === "success") { ;
__p += '\n      ';
 if (googleSignup) { ;
__p += '\n        You will be redirected to your dashboard in a moment...\n      ';
 } else if (!requiresValidationEmail) { ;
__p += '\n        You will be redirected to the login page in a moment...\n      ';
 } else { ;
__p += '\n        Check your email inbox and validate your email.\n      ';
 };
__p += '\n    ';
 } else if (state === "failure") { ;
__p += '\n      Unfortunately there was a problem creating your account. ';
 if (!customHosted) { ;
__p += 'Please, <a href="mailto:support@carto.com?subject=User creation error: ' +
__e( userCreationId ) +
'">contact us</a>';
 } ;
__p += '.\n    ';
 } else { ;
__p += '\n      It will take us some time, just a few seconds.\n    ';
 } ;
__p += '\n  </p>\n</div>\n';

}
return __p
};
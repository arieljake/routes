"use strict";
Object.defineProperties(exports, {
  default: {get: function() {
      return $__default;
    }},
  __esModule: {value: true}
});
var __moduleName = "dist-es5/fns/input/collection.groupBy";
var _ = require("lodash");
function groupBy(state, config) {
  var collection = state.get(config.collectionVarName);
  var value = _.groupBy(collection, config.propertyName);
  state.set(config.saveTo, value);
  if (config.deleteOriginal === true) {
    state.unset(config.collectionVarName);
  }
}
var $__default = groupBy;
;
//# sourceURL=src/fns/input/collection.groupBy.js
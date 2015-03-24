"use strict";
Object.defineProperties(exports, {
  default: {get: function() {
      return $__default;
    }},
  humanize: {get: function() {
      return humanize;
    }},
  __esModule: {value: true}
});
var __moduleName = "dist-es5/fns/input/set.var";
var MongoDbId = require('mongodb').ObjectID;
var uuid = require('uuid');
var _ = require('lodash');
function setVar(state, config) {
  var value;
  var saveTo;
  if (config.value !== undefined) {
    value = config.value;
  } else if (config.valueVarName) {
    value = state.get(config.valueVarName);
  } else if (config.valueString) {
    value = state.translate(config.valueString);
  }
  if (config.format) {
    var formatType;
    if (_.isString(config.format))
      formatType = config.format;
    else
      formatType = config.format.type;
    switch (formatType) {
      case "integer":
        value = parseInt(value, 10);
        break;
      case "string":
        value = value.toString();
        break;
      case "boolean":
        value = (value == "true");
        break;
      case "mongoId":
        if (typeof value == "string")
          value = MongoDbId.createFromHexString(value);
        break;
      case "uuid":
        value = uuid.v1();
        break;
      case "timestamp":
        value = Date.now();
        break;
      case "regexReplace":
        var regex = new RegExp(config.format.regex, config.format.regexOptions);
        value = value.replace(regex, config.format.replace);
        break;
    }
  }
  if (config.saveTo) {
    saveTo = config.saveTo;
  } else if (config.saveToString) {
    saveTo = state.translate(config.saveToString);
  }
  if (config.valueVarName && config.deleteOriginal === true) {
    state.unset(config.valueVarName);
  }
  state.set(saveTo, value);
}
var $__default = setVar;
;
function humanize(utils, config) {
  var output;
  if (config.value) {
    output = utils.devariable("set #saveTo# to '#value#'", config);
  } else if (config.valueVarName) {
    output = utils.devariable("copy #valueVarName# to #saveTo#", config);
  } else if (config.valueString) {
    output = utils.devariable("set #saveTo# as #valueString# from state", config);
  }
  return output;
}
;
//# sourceURL=src/fns/input/set.var.js
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
var __moduleName = "dist-es5/fns/routing/run.route";
var Q = require("q");
var util = require("util");
function runRoute(state, config) {
  var routeLib = state.get("$routes");
  var routeContext = state.child();
  var route;
  if (!routeLib)
    return Q.reject("routeLib is undefined");
  if (config.routeName) {
    route = routeLib.get(config.routeName, routeContext);
    if (!route)
      return Q.reject("no route defined for " + config.routeName);
  } else if (config.route) {
    route = routeLib.create(config.desc, config.route, routeContext);
  }
  if (config.input) {
    var input;
    if (typeof config.input === "string") {
      input = state.get(config.input);
    } else {
      input = config.input;
    }
    routeContext.set("input", input);
  }
  if (config.inputs) {
    var input = routeContext.get("input") || {};
    Object.keys(config.inputs).forEach(function(key) {
      var value = config.inputs[key];
      if (typeof value === "string") {
        if (value[0] === "'" && value.substr(-1) === "'")
          input[key] = value.replace(/\'/g, "");
        else
          input[key] = state.get(value);
      } else
        input[key] = value;
    });
    routeContext.set("input", input);
  }
  var routePromise = route.run();
  if (config.output || config.outputs) {
    routePromise = routePromise.then(function() {
      var output = route.context.get("output");
      if (!output)
        return Q.reject("output expected but none defined: " + util.inspect(config.output));
      if (config.output) {
        state.set(config.output, output);
      }
      if (config.outputs) {
        Object.keys(config.outputs).map(function(outputKey) {
          var value = output[outputKey];
          var saveTo = config.outputs[outputKey];
          state.set(saveTo, value);
        });
      }
    });
  }
  if (config.fork === true)
    return undefined;
  else
    return routePromise.then(function() {
      return routeContext.get("output");
    });
}
var $__default = runRoute;
;
function humanize(utils, config) {
  var output = utils.devariable("run route #routeName#", config);
  return output;
}
;
//# sourceURL=src/fns/routing/run.route.js
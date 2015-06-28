define("config-routes/fns/routing/run.route", [], function() {
  "use strict";
  var __moduleName = "config-routes/fns/routing/run.route";
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
    } else if (config.route) {
      route = routeLib.create(config.desc, config.route, routeContext);
    }
    if (config.input) {
      var input;
      if (typeof config.input === "string") {
        input = state.get(config.input);
      } else {
        input = {};
        Object.keys(config.input).forEach(function(key) {
          var value = config.input[key];
          if (typeof value === "string")
            input[key] = state.get(value);
          else
            input[key] = value;
        });
      }
      routeContext.set("input", input);
    }
    var routePromise = route.run();
    if (config.output && (typeof config.output === "string" || Object.keys(config.output).length > 0)) {
      routePromise = routePromise.then(function() {
        var output = route.context.get("output");
        if (!output)
          return Q.reject("output expected but none defined: " + util.inspect(config.output));
        if (typeof config.output === "string") {
          state.set(config.output, output);
        } else {
          Object.keys(config.output).map(function(outputKey) {
            var value = output[outputKey];
            var saveTo = config.output[outputKey];
            state.set(saveTo, value);
          });
        }
      });
    }
    if (config.fork === true)
      return undefined;
    else
      return routePromise;
  }
  var $__default = runRoute;
  ;
  function humanize(utils, config) {
    var output = utils.devariable("run route #routeName#", config);
    return output;
  }
  ;
  return {
    get default() {
      return $__default;
    },
    get humanize() {
      return humanize;
    },
    __esModule: true
  };
});
//# sourceURL=src/fns/routing/run.route.js
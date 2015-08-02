define("config-routes/fns/database/mongo/insertMany", [], function() {
  "use strict";
  var __moduleName = "config-routes/fns/database/mongo/insertMany";
  var Q = require('q');
  var _ = require('lodash');
  function insertMany(state, config) {
    try {
      var deferred = Q.defer();
      var mongoDB = state.get(config.mongoVarName);
      var collection = config.collection;
      var records = state.get(config.recordsVarName) || config.records || [];
      var options = state.get(config.optionsVarName) || config.options || {};
      var resultHandler = function(err, result) {
        if (err) {
          state.set(config.saveErrorTo, err);
          deferred.reject(err);
        } else {
          state.set(config.saveResultTo, result);
          deferred.resolve(result);
        }
      };
      if (!records || _.isArray(records) === false || records.length === 0)
        resultHandler(null, []);
      else
        mongoDB.collection(collection).insertMany(records, options, resultHandler);
    } catch (err) {
      deferred.reject(err);
    }
    return deferred.promise;
  }
  var $__default = insertMany;
  ;
  function humanize(utils, config) {
    var output = utils.devariable("save #recordsVarName# in the #collection# table", config);
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
//# sourceURL=src/fns/database/mongo/insertMany.js
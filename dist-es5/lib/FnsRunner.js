"use strict";
Object.defineProperties(exports, {
  FnsRunner: {get: function() {
      return FnsRunner;
    }},
  __esModule: {value: true}
});
var __moduleName = "dist-es5/lib/FnsRunner";
var $__q__,
    $__eventemitter3__;
'use strict';
var Q = ($__q__ = require("q"), $__q__ && $__q__.__esModule && $__q__ || {default: $__q__}).default;
var EventEmitter = ($__eventemitter3__ = require("eventemitter3"), $__eventemitter3__ && $__eventemitter3__.__esModule && $__eventemitter3__ || {default: $__eventemitter3__}).default;
var FnsRunner = function FnsRunner(fns) {
  this.fns = fns;
};
($traceurRuntime.createClass)(FnsRunner, {
  run: function() {
    var runner = this;
    var fns = this.fns;
    var fnIndex = 0;
    var gen = $traceurRuntime.initGeneratorFunction(function $__3() {
      var err;
      return $traceurRuntime.createGeneratorInstance(function($ctx) {
        while (true)
          switch ($ctx.state) {
            case 0:
              $ctx.pushTry(21, null);
              $ctx.state = 24;
              break;
            case 24:
              runner.emit('runnerStarting');
              $ctx.state = 9;
              break;
            case 9:
              $ctx.state = (fnIndex < fns.length) ? 1 : 7;
              break;
            case 1:
              $ctx.state = 2;
              return fns[fnIndex]();
            case 2:
              $ctx.maybeThrow();
              $ctx.state = 4;
              break;
            case 4:
              runner.emit('fnComplete', fnIndex);
              fnIndex++;
              $ctx.state = 9;
              break;
            case 7:
              runner.emit('runnerComplete');
              $ctx.state = 11;
              break;
            case 11:
              $ctx.popTry();
              $ctx.state = -2;
              break;
            case 21:
              $ctx.popTry();
              err = $ctx.storedException;
              $ctx.state = 20;
              break;
            case 20:
              $ctx.state = (err && err.message == "$abort") ? 12 : 16;
              break;
            case 12:
              $ctx.state = 13;
              return runner.handleAbort(fnIndex, err);
            case 13:
              $ctx.maybeThrow();
              $ctx.state = -2;
              break;
            case 16:
              $ctx.state = 17;
              return runner.handleError(fnIndex, err);
            case 17:
              $ctx.maybeThrow();
              $ctx.state = -2;
              break;
            default:
              return $ctx.end();
          }
      }, $__3, this);
    });
    return Q.async(gen)();
  },
  handleError: function(fnIndex, err) {
    var error;
    if (!err)
      error = "unknown error";
    else if (err.stack)
      error = err.stack;
    else if (err.message)
      error = err.message;
    else
      error = err;
    this.emit('fnError', fnIndex, error);
    return Q.reject({
      fnIndex: fnIndex,
      error: error
    });
  },
  handleAbort: function(fnIndex, err) {
    return Q({
      fnIndex: fnIndex,
      abort: true
    });
  }
}, {}, EventEmitter);
;
//# sourceURL=src/lib/FnsRunner.js
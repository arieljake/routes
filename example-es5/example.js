"use strict";
var __moduleName = "example-es5/example";
'use strict';
global.$traceurRuntime = require('traceur-runtime');
var path = require("path");
var AppBase = require('./AppBase');
var routes = AppBase.createRoutes(path.join(__dirname, "routes"), path.join(__dirname, "functions"));
var route = routes.get("customer/GetCustomerLocations.json");
var req = {};
var res = {send: function(value) {
    console.dir(value);
  }};
route(req, res);
//# sourceURL=example/example.js
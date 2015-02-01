let path = require("path");
let q = require('q');
let _ = require('lodash');
let FnLibrary = require('./FnLibrary').FnLibrary;
let FnsRunner = require('./FnsRunner').FnsRunner;
let Context = require("./Context").Context;

export class Route
{
	constructor(name, definition, fnLib)
	{
		this.name = name;
		this.definition = definition;
		this.fnLib = fnLib;
	}

	get fns()
	{
		return this.definition.map((def) =>
		{
			return {
				name: def.fn,
				config: _.omit(def, "fn")
			};
		});
	}

	run(req, res)
	{
		let model = {
			req,
			res
		};
		let context = new Context(model, this.fnLib);

		let fns = this.fns.map((fn) => _.assign(fn,
		{
			exe: this.fnLib.get(fn.name)
		}));
		let boundFns = fns.map((fn) => _.bind(fn.exe, null, context, fn.config));
		let runner = new FnsRunner(boundFns);

		return runner.run();
	}
};
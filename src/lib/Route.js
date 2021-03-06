'use strict';

import {default as EventEmitter} from "eventemitter3";
import {default as Q} from 'q';
import {default as _} from 'lodash';
import {FnsRunner} from './FnsRunner';

export class Route extends EventEmitter
{
	constructor(id, name, steps, context)
	{
		this.id = id;
		this.name = name;
		this.steps = steps;
		this.context = context;
	}

	run()
	{
		var deferred = Q.defer();

		let boundFns = this.steps.map((step) => step.getExecutable(this.context));
		let runner = new FnsRunner(boundFns);

		this.attachToRunner(runner);

		runner.run()
			.then(function()
			{
				deferred.resolve();
			})
			.catch((err) =>
			{
				let erroredStep = this.steps[err.fnIndex];
				let stepObj = erroredStep.toObject();
				let routeObj = this.toObject();
			
				this.emit('stepError', err.error, stepObj, routeObj);
			
				deferred.reject({
					error: err,
					step: stepObj,
					route: routeObj
				});
			});

		return deferred.promise;
	}

	attachToRunner(fnRunner)
	{
		fnRunner.on('runnerStarting', (fnIndex) =>
		{
			this.emit('routeStarting', this.toObject());
		});

		fnRunner.on('runnerComplete', (fnIndex) =>
		{
			this.emit('routeComplete', this.toObject());
		});

		fnRunner.on('fnComplete', (fnIndex) =>
		{
			let completedStep = this.steps[fnIndex];
			this.emit('stepComplete', completedStep.toObject(), this.toObject());
		});
	}

	toObject()
	{
		return {
			id: this.id,
			name: this.name,
			state: this.context.toObject()
		};
	}
};
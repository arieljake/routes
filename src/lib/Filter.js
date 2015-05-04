'use strict';

import { default as _} from 'lodash';
import {ObjectPath} from "../utils/ObjectPath";

export var Filter = {

	filter: function(value, config, state)
	{
		if (!config)
			return true;

		if (Array.isArray(config))
		{
			var passes = true;
		
			for (var i = 0; i < config.length && passes === true; i++)
			{
				passes = Filter.filter(value, config[i], state);
			}

			return passes;
		}
		else
		{
			var filterType;

			if (_.isString(config))
				filterType = config.toString();
			else
				filterType = config.type;

			var filter = _.find(Filter.filters, function(filter)
			{
				return filter.match(filterType) === true;
			});

			if (filter)
			{
				if (config.valueVarName)
				{
					var path = new ObjectPath(config.valueVarName);
					value = path.getValueIn(value);
				}
				
				return filter.filter(value, config, state, filterType);
			}
			else
			{
				return true;
			}
		}
	},

	filters: [],
	
	createFilterMatchByName: function(type)
	{
		return function(filterType)
		{
			return filterType == type;
		};
	},
	
	addFilter: function(matchFn, filterFn)
	{
		if (typeof matchFn === "string")
		{
			matchFn = Filter.createFilterMatchByName(matchFn);
		}

		Filter.filters.push({
			match: matchFn,
			filter: filterFn
		});
	},
	
	clearFilters: function()
	{
		Filter.filters.length = 0;
	},
	
	hasFilterForType: function(filterType)
	{
		var filter = _.find(Filter.filters, function(filter)
		{
			return filter.match(filterType) === true;
		});
		
		return filter !== undefined;
	}
};
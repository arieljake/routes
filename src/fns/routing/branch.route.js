let _ = require('lodash');
let runRoute = require("./run.route").default;

export
default
function branchRoute(state, config)
{
	var value = state.get(config.valueVarName);
	var cases = config.cases;
	var defaultCase = config.defaultCase;
	var targetCase = _.find(cases, function(curCase)
	{
		return curCase.value == value;
	});

	if (!targetCase)
	{
		targetCase = defaultCase;
	}

	if (targetCase)
	{
		var buildOutput = function(branchOutput, caseOutput)
		{
			if (typeof branchOutput === "string" || typeof caseOutput === "string")
			{
				if (caseOutput)
					return caseOutput;
				else
					return branchOutput;
			}
			else
			{
				return _.defaults({}, caseOutput, branchOutput)
			}
		}
		
		var routeConfig = {
			route: targetCase.route,
			routeName: targetCase.routeName,
			desc: targetCase.desc,
			input: _.defaults({}, targetCase.input, config.input),
			output: buildOutput(config.output, targetCase.output)
		};
		
		return runRoute(state, routeConfig);
	}
};

export function humanize(utils, config)
{
	var output = utils.devariable("branch route", config);

	return output;
};
/*jslint browser: true*/
/*global Backbone*/
/*global _*/
/*global log4javascript*/
var GDP = GDP || {};

GDP.PROCESS_CLIENT = GDP.PROCESS_CLIENT || {};

$(document).ready(function() {
	"use strict";

	// Preload all templates and partials
	var TEMPLATES = [
		'hub',
		'spatial',
		'datadetail',
		'process',
		'algorithm-config',
		'data_set_details'
	];

	var PARTIALS = [];

	initializeLogging({
		LOG4JS_LOG_THRESHOLD: GDP.DEVELOPMENT === 'true' ? 'debug' : 'info'
	});
	GDP.logger = log4javascript.getLogger();

	GDP.PROCESS_CLIENT.templates = GDP.util.templateLoader(GDP.BASE_URL + 'templates/');

	var loadConfigModel = $.ajax(GDP.BASE_URL + 'config', {
		success: function (data) {
			GDP.config = new GDP.model.Config(data);
			var applicationConfig = GDP.config.get('application');

			GDP.cswClient = new GDP.OGC.CSW({
				url : applicationConfig.endpoints.csw
			});
		},
		error : function (jqXHR, textStatus) {
			GDP.logger.error('Can not read config ' + textStatus);
		}
	});

	var loadTemplates = GDP.PROCESS_CLIENT.templates.loadTemplates(TEMPLATES);
	var loadPartials = GDP.PROCESS_CLIENT.templates.registerPartials(PARTIALS);

	var loadAlgorithms = $.ajax(GDP.BASE_URL + 'algorithms', {
		success : function(data) {
			GDP.algorithms = new Backbone.Model($.parseJSON(data));
		},
		error : function(jqXHR, textStatus) {
			GDP.logger.error('Can\'t load algorithms ' + textStatus);
		}
	});

	$.when(loadTemplates, loadPartials, loadConfigModel, loadAlgorithms).always(function () {
		GDP.PROCESS_CLIENT.templates.registerHelpers();

		var jobModel = new GDP.PROCESS_CLIENT.model.Job();
		jobModel.get('processes').reset(GDP.config.get('process').processes);

		var wps = GDP.OGC.WPS(GDP.logger);
		GDP.PROCESS_CLIENT.router = new GDP.PROCESS_CLIENT.controller.ProcessClientRouter(jobModel, wps);

		var root  = GDP.BASE_URL.replace(location.origin, '');
		Backbone.history.start({pushState : true, root: root + 'client/'});
	});

});

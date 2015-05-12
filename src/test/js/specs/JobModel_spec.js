describe('GDP.ADVANCED.model.Job', function() {
	var PROCESSES = [{
			"id" : "gov.usgs.cida.gdp.wps.algorithm.FeatureCoverageIntersectionAlgorithm",
			"name" : "FeatureCoverageIntersectionAlgorithm",
			"title" : "WCS Subset",
			"abstract" : "This service returns the subset of data that intersects a set of vector polygon features and a Web Coverage Service (WCS) data source. A GeoTIFF file will be returned.",
			"inputs" : [
				{
					"identifier" : "REQUIRE_FULL_COVERAGE",
					"title" : "Require Full Coverage",
					"abstract" : "If turned on, the service will require that the dataset of interest fully cover the polygon analysis zone data.",
					"input-type" : "literal",
					"data-type" : "boolean",
					"default" : "true",
					"minOccurs" : "1",
					"maxOccurs" : "1"
				},
				{
					"identifier" : "FEATURE_COLLECTION",
					"title" : "Feature Collection",
					"abstract" : "A feature collection encoded as a WFS request or one of the supported GML profiles.",
					"input-type" : "complex",
					"minOccurs" : "1",
					"maxOccurs" : "1",
					"data-type" : [
						{
							"format" : {
								"mime-type" : "text/xml",
								"schema" : "http://schemas.opengis.net/gml/2.0.0/feature.xsd"
							}
						}
					],
					"default" : {
						"format" : {
							"mime-type" : "text/xml",
							"schema" : "http://schemas.opengis.net/gml/2.0.0/feature.xsd"
						}
					}
				},
				{
					"identifier" : "DATASET_ID",
					"title" : "Dataset Identifier",
					"abstract" : "The unique identifier for the data type or variable of interest.",
					"input-type" : "literal",
					"data-type" : "string",
					"default" : "true",
					"minOccurs" : "1",
					"maxOccurs" : "2147483647"
				}
			],
			"outputs" : [
				{
					"identifier" : "OUTPUT",
					"title" : "Output File",
					"abstract" : "A GeoTIFF file containing the requested data.",
					"output-type" : "complex",
					"format" : "image/geotiff"
				}
			]
		},
		{
			"id" : "gov.usgs.cida.gdp.wps.algorithm.FeatureWeightedGridStatisticsAlgorithm",
			"name" : "FeatureWeightedGridStatisticsAlgorithm",
			"title" : "Area Grid Statistics (weighted)",
			"abstract" : "This algorithm generates area weighted statistics of a gridded dataset for a set of vector polygon features. Using the bounding-box that encloses the feature data and the time range, if provided, a subset of the gridded dataset is requested from the remote gridded data server. Polygon representations are generated for cells in the retrieved grid. The polygon grid-cell representations are then projected to the feature data coordinate reference system. The grid-cells are used to calculate per grid-cell feature coverage fractions. Area-weighted statistics are then calculated for each feature using the grid values and fractions as weights. If the gridded dataset has a time range the last step is repeated for each time step within the time range or all time steps if a time range was not supplied.",
			"inputs" : [
				{
					"identifier" : "REQUIRE_FULL_COVERAGE",
					"title" : "Require Full Coverage",
					"abstract" : "If turned on, the service will require that the dataset of interest fully cover the polygon analysis zone data.",
					"input-type" : "literal",
					"data-type" : "boolean",
					"default" : "true",
					"minOccurs" : "1",
					"maxOccurs" : "1"
				},
				{
					"identifier" : "FEATURE_COLLECTION",
					"title" : "Feature Collection",
					"abstract" : "A feature collection encoded as a WFS request or one of the supported GML profiles.",
					"input-type" : "complex",
					"minOccurs" : "1",
					"maxOccurs" : "1",
					"data-type" : [
						{
							"format" : {
								"mime-type" : "text/xml",
								"schema" : "http://schemas.opengis.net/gml/2.0.0/feature.xsd"
							}
						}
					],
					"default" : {
						"format" : {
							"mime-type" : "text/xml",
							"schema" : "http://schemas.opengis.net/gml/2.0.0/feature.xsd"
						}
					}
				},
				{
					"identifier" : "DELIMITER",
					"title" : "Delimiter",
					"abstract" : "The delimiter that will be used to separate columns in the processing output.",
					"input-type" : "literal",
					"data-type" : "string",
					"options" : [
						"COMMA",
						"TAB",
						"SPACE"
					],
					"default" : "COMMA",
					"minOccurs" : "1",
					"maxOccurs" : "1"
				},
				{
					"identifier" : "SUMMARIZE_TIMESTEP",
					"title" : "Summarize Timestep",
					"abstract" : "If selected, processing output will include columns with summarized statistics for all feature attribute values for each timestep",
					"input-type" : "literal",
					"data-type" : "boolean",
					"default" : "false",
					"minOccurs" : "0",
					"maxOccurs" : "1"
				},
				{
					"identifier" : "STATISTICS",
					"title" : "Statistics",
					"abstract" : "Statistics that will be returned for each feature in the processing output.",
					"input-type" : "literal",
					"data-type" : "string",
					"options" : [
						"MEAN",
						"MINIMUM",
						"MAXIMUM",
						"VARIANCE",
						"STD_DEV",
						"SUM",
						"COUNT"
					],
					"minOccurs" : "1",
					"maxOccurs" : "7"
				}
			],
			"outputs" : [
				{

					"identifier" : "OUTPUT",
					"title" : "Output File",
					"abstract" : "A delimited text file containing requested process output.",
					"output-type" : "complex",
					"format" : "text/csv"
				}
			]
		}
	];

	var jobModel;
	var server;

	beforeEach(function() {
		jobModel = new GDP.ADVANCED.model.Job();
		jobModel.get('processes').reset(PROCESSES);
		server = sinon.fakeServer.create();
	});

	afterEach(function() {
		server.restore();
	});

	it('Expects getSelectedAlgorithmProcess return undefined if no algorithmId is defined', function() {
		expect(jobModel.getSelectedAlgorithmProcess()).not.toBeDefined();
	});

	it('Expects getSelectedAlgorithmProcess to return the process associated with the model\'s algorithmId', function() {
		jobModel.set('algorithmId', 'gov.usgs.cida.gdp.wps.algorithm.FeatureWeightedGridStatisticsAlgorithm');
		expect(jobModel.getSelectedAlgorithmProcess().get('name')).toEqual('FeatureWeightedGridStatisticsAlgorithm');
	});

	it('Expects getProcessInputs to return null if the algorithmId has not been set', function() {
		expect(jobModel.getProcessInputs()).toBe(null);
	});

	it('Expects getSelectedDataSourceVariables to return an array of DataSourceVariables for those in jobModel whose selected attribute is true', function() {
			var var1 = new GDP.ADVANCED.model.DataSourceVariable({text : 'Text1', value : 'value1', selected : true});
			var var2 = new GDP.ADVANCED.model.DataSourceVariable({text : 'Text2', value : 'value2', selected : true});
			var var3 = new GDP.ADVANCED.model.DataSourceVariable({text : 'Text3', value : 'value3', selected : false});

			jobModel.get('dataSourceVariables').reset([var1, var2, var3]);
			var result = jobModel.getSelectedDataSourceVariables();
			expect(result.length).toBe(2);
			expect(result).toContain(var1);
			expect(result).toContain(var2);
	});

	it('Expects getProcessInputs to return the inputs minus excluded inputs', function() {
		jobModel.set('algorithmId', 'gov.usgs.cida.gdp.wps.algorithm.FeatureWeightedGridStatisticsAlgorithm');
		var inputs = jobModel.getProcessInputs();
		expect(inputs.length).toBe(4);
	});

	describe('Tests for getMimeType', function() {
		it('Expects that if DELIMITER is not set as a process variable then a null string is returned', function() {
			expect(jobModel.getMimeType()).toEqual('');
		});

		it('Expects that if DELIMITER is set to tab, the mimetype is for tsv', function() {
			jobModel.get('processVariables').set('DELIMITER', 'TAB');
			expect(jobModel.getMimeType()).toEqual('text/tab-separated-values');
		});

		it('Expects that if DELIMITER is set to SPACE, the mimetype is for plain text', function() {
			jobModel.get('processVariables').set('DELIMITER', 'SPACE');
			expect(jobModel.getMimeType()).toEqual('text/plain');
		});

		it('Expects that if DELIMITER is set to comma, the mimetype is for csv', function() {
			jobModel.get('processVariables').set('DELIMITER', 'COMMA');
			expect(jobModel.getMimeType()).toEqual('text/csv');
		});
	});

	describe('Tests for getWCSDataSourceUrl', function() {
		var resolveSpy;

		beforeEach(function() {
			resolveSpy = jasmine.createSpy('resolveSpy');
			GDP.logger = {
				error : jasmine.createSpy('loggerErrorSpy')
			};
		});

		it('If the dataSourceUrl protocol is something other than http, https, or dods, the promise will be resolved with the null string', function() {
			jobModel.set('dataSourceUrl', 'file:///fakeservice');
			jobModel.getWCSDataSourceUrl().done(resolveSpy);
			expect(resolveSpy).toHaveBeenCalledWith('');
		});

		it('If the dataSourceUrl protocol is http or https than an ajax call is made to determine whether http or dods protocol should be used', function() {
			jobModel.set('dataSourceUrl', 'http://fakeservice');
			server.respondWith([200, {'Content-Type' : "text/html"}, "OK"]);
			jobModel.getWCSDataSourceUrl().done(resolveSpy);
			server.respond();
			expect(resolveSpy).toHaveBeenCalledWith('http://fakeservice');

			jobModel.set('dataSourceUrl', 'https://fakeservice');
			server.respondWith([500, {}, "Failed"]);
			jobModel.getWCSDataSourceUrl().done(resolveSpy);
			server.respond();
			expect(resolveSpy.mostRecentCall.args[0]).toEqual('dods://fakeservice');
		});

		it('If the dataSoureUrl protocol is dods than promise is resolve with the dataSourceUrl', function() {
			jobModel.set('dataSourceUrl', 'dods://fakeservice');
			jobModel.getWCSDataSourceUrl().done(resolveSpy);
			expect(resolveSpy).toHaveBeenCalledWith('dods://fakeservice');
		});
	});

	describe('Tests for getWPSStringInputs', function() {
		var mockGetWCSDataDeferred;
		var resolveSpy;

		var getWPSStringInputsResult = function() {
			jobModel.getWPSStringInputs().done(resolveSpy);
			mockGetWCSDataDeferred.resolve('http://fakedatasetservice');
			return resolveSpy.calls[0].args[0];
		};

		beforeEach(function() {
			mockGetWCSDataDeferred = $.Deferred();
			spyOn(jobModel, 'getWCSDataSourceUrl').andReturn(mockGetWCSDataDeferred);

			resolveSpy = jasmine.createSpy('resolveSpy');
		});

		it('Expects that the promise returned is not resolved until getWCSDataSourceUrl\'s promise has been resolved', function() {
			jobModel.getWPSStringInputs().done(function(result) {
				resolveSpy(result);
			});
			expect(resolveSpy).not.toHaveBeenCalled();
			mockGetWCSDataDeferred.resolve('http://fakedatasetservice');
			expect(resolveSpy).toHaveBeenCalled();
			expect(resolveSpy.calls[0].args[0].DATASET_URI).toEqual(['http://fakedatasetservice']);
		});

		// This does not work when running with phantomJS
		xit('Expects startDate and endDate to be formatted as ISO dates', function() {
			jobModel.set({
				startDate : '01-01-1980',
				endDate : '04-30-1988'
			});
			var result = getWPSStringInputsResult();

			expect(result.TIME_START.length).toBe(1);
			expect(result.TIME_END.length).toBe(1);
			expect(result.TIME_START[0]).toEqual('1980-01-01T00:00:00.000Z');
			expect(result.TIME_END[0]).toEqual('1988-04-30T00:00:00.000Z');
		});

		it('Expects aoiAttribute to be assigned to the FEATURE_ATTRIBUTE_NAME property', function() {
			jobModel.set({
				aoiAttribute : 'Feature1'
			});
			var result = getWPSStringInputsResult();
			expect(result.FEATURE_ATTRIBUTE_NAME.length).toBe(1);
			expect(result.FEATURE_ATTRIBUTE_NAME[0]).toEqual('Feature1');
		});

		it('Expects DATASET_ID to be assigned to the values in the selected DataSourceVariables', function() {
			var var1 = new GDP.ADVANCED.model.DataSourceVariable({text : 'Text1', value : 'value1', selected : true});
			var var2 = new GDP.ADVANCED.model.DataSourceVariable({text : 'Text2', value : 'value2', selected : true});
			var var3 = new GDP.ADVANCED.model.DataSourceVariable({text : 'Text3', value : 'value3', selected : false});

			jobModel.get('dataSourceVariables').reset([var1, var2, var3]);
			var result = getWPSStringInputsResult();
			expect(result.DATASET_ID.length).toBe(2);
			expect(result.DATASET_ID).toContain('value1');
			expect(result.DATASET_ID).toContain('value2');
		});

		it('Expects that process variables are included in the result', function() {
			jobModel.get('processVariables').set({
				"VAR1" : "value1",
				"VAR2" : "value2"
			});

			var result = getWPSStringInputsResult();

			expect(result.VAR1.length).toBe(1);
			expect(result.VAR2.length).toBe(1);
			expect(result.VAR1).toEqual(['value1']);
			expect(result.VAR2).toEqual(['value2']);
		});
	});

	describe('Tests for getSelectedFeatureIds', function() {
		var GET_FEATURE_RESULT =
			'<wfs:FeatureCollection numberOfFeatures="2" timeStamp="2015-05-05T20:12:53.928Z" xsi:schemaLocation="gov.usgs.cida.gdp.derivative http://cida-eros-gdpdev.er.usgs.gov:8082/geoserver/wfs?service=WFS&amp;version=1.1.0&amp;request=DescribeFeatureType&amp;typeName=derivative%3ACONUS_States http://www.opengis.net/wfs http://cida-eros-gdpdev.er.usgs.gov:8082/geoserver/schemas/wfs/1.1.0/wfs.xsd" xmlns:ogc="http://www.opengis.net/ogc" xmlns:draw="gov.usgs.cida.gdp.draw" xmlns:wfs="http://www.opengis.net/wfs" xmlns:waters="http://waters" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:sample="gov.usgs.cida.gdp.sample" xmlns:ows="http://www.opengis.net/ows" xmlns:gml="http://www.opengis.net/gml" xmlns:derivative="gov.usgs.cida.gdp.derivative" xmlns:upload="gov.usgs.cida.gdp.upload" xmlns:xlink="http://www.w3.org/1999/xlink">' +
			'<gml:featureMembers>' +
			'<derivative:CONUS_States gml:id="CONUS_States.39">' +
			'<derivative:STATE>South Carolina</derivative:STATE>' +
			'</derivative:CONUS_States>' +
			'<derivative:CONUS_States gml:id="CONUS_States.40"><derivative:STATE>South Dakota</derivative:STATE></derivative:CONUS_States>' +
			'</gml:featureMembers></wfs:FeatureCollection>';

		var mockWFSDeferred;
		var resolveSpy;

		beforeEach(function() {
			mockWFSDeferred = $.Deferred();
			spyOn(GDP.OGC.WFS, 'callWFS').andReturn(mockWFSDeferred.promise())
			spyOn(GDP.util.mapUtils, 'createAOICQLFilter').andReturn("Fake filter")
			GDP.logger = {
				error : jasmine.createSpy('errorLoggerSpy'),
			};

			resolveSpy = jasmine.createSpy('resolveSpy');
			jobModel.set({
				aoiName : 'derivative:CONUS_States',
				aoiAttribute : 'FeatureAttribute',
				aoiAttributeValues : ['A1', 'A2']
			});
		});

		it('Expects a callWFS to be issued with the appropriate typename, propertyname and cql_filter', function() {
			jobModel.getSelectedFeatureIds();
			expect(GDP.OGC.WFS.callWFS).toHaveBeenCalled();
			expect(GDP.OGC.WFS.callWFS.calls[0].args[0].typename).toEqual('derivative:CONUS_States');
			expect(GDP.OGC.WFS.callWFS.calls[0].args[0].propertyname).toEqual('FeatureAttribute');
			expect(GDP.OGC.WFS.callWFS.calls[0].args[0].cql_filter).toEqual('Fake filter');
		});

		it('Expects a successful callWFS to resolve the promise with an array of features', function() {
			jobModel.getSelectedFeatureIds().done(resolveSpy);
			expect(resolveSpy).not.toHaveBeenCalled();

			mockWFSDeferred.resolve($.parseXML(GET_FEATURE_RESULT));
			expect(resolveSpy).toHaveBeenCalledWith(["CONUS_States.39", "CONUS_States.40"]);
		});

		it('Expects a failed callWFS to resolve the promise with an empty array', function() {
			jobModel.getSelectedFeatureIds().done(resolveSpy);
			expect(resolveSpy).not.toHaveBeenCalled();

			mockWFSDeferred.reject();
			expect(resolveSpy).toHaveBeenCalledWith([]);
		});
	});
});
var GDP = GDP || {};

GDP.ADVANCED = GDP.ADVANCED || {};

GDP.ADVANCED.controller = GDP.ADVANCED.controller || {};

GDP.ADVANCED.controller.AdvancedRouter = Backbone.Router.extend({

	applicationContextDiv : '#advanced-page-content',

	routes : {
		'' : 'hub',
		'spatial' : 'spatial',
		'datadetail' : 'datadetail',
		'process' : 'process'
	},

	hub : function() {
		this.showView(GDP.view.HubView);
	},

	spatial : function() {
		$(this.applicationContextDiv).html('Spatial Page');
	},

	datadetail : function() {
		this.showView(GDP.view.DataDetailsView);
	},

	process : function() {
		$(this.applicationContextDiv).html('Process Page');
	},

	showView : function(view, opts) {
		var newEl = $('<div>');

		this.removeCurrentView();
		$(this.applicationContextDiv).append(newEl);
		this.currentView = new view($.extend({
			el: newEl,
			router: this
		}, opts));
	},
	removeCurrentView : function() {
		if (this.currentView) {
			this.currentView.remove();
		}
	}
});
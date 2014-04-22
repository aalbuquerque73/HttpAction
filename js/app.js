define(['jquery','underscore','knockout','utils','list'],
function($,_,ko,U, List) {
	console.log("[App] Setting up UI bidings...");
	ko.bindingHandlers.ui = {
		init: function(element, valueAccessor, allBindings, viewModel, context) {
			console.log("[ui:init]", arguments);
			console.log("[ui:init]", valueAccessor());
			var childContext = context.createChildContext(
				context.$rawData,
				null,
				function(ctx) {
					ko.utils.extend(ctx, {parent:element});
				}
			);
			ko.applyBindingsToDescendants(childContext, element);
			
			var ctrl = valueAccessor();
			if(ctrl != undefined) {
				if(ctrl.expand) {
					console.log("[ui:init] expanding element", element);
					var width = $(context.parent).width();
					var count = 1;
					console.log("[ui:init] width", width);
					var el = $(element);
					while(el.next().length) {
						el = el.next();
						console.log("[ui:init] next element", el[0], el.outerWidth());
						width -= el.outerWidth();
						++count;
					}
					el = $(element);
					while(el.prev().length) {
						el = el.prev();
						console.log("[ui:init] prev element", el[0], el.outerWidth());
						width -= el.outerWidth();
						++count;
					}
					el = $(element);
					var delta = el.outerWidth() - el.width();
					console.log("[ui:init] new width", width, delta);
					width -= count*delta;
					console.log("[ui:init] new width", width);
					el.width(width);
				}
			}
			
			return {controlsDescendantBindings:true};
		},
		update: function(element, valueAccessor, allBindings, viewModel, context) {}
	};
	
	function MainViewModel() {
		this.url = ko.observable();
		this.data = {
			request: ko.observable(),
			response: ko.observable()
		};
	}
	MainViewModel.prototype = {
		start: function() {
			ko.applyBindings(this);
		},
		
		post: function() {},
		get: function() {}
	};
	
	return new MainViewModel();
});
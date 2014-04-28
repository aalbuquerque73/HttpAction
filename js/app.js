define(['jquery','underscore','knockout','utils'],
function($,_,ko,U) {
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
	ko.bindingHandlers.attachTo = {
		init: function(element, valueAccessor, allBindings, viewModel, context) {
			console.log("[attachTo:init]", arguments);
			console.log("[attachTo:init]", valueAccessor());
			console.log("[attachTo:init]", viewModel.url===valueAccessor);
			console.log("[attachTo:init]", viewModel.url===valueAccessor());
			var actions = {
				enable: function() {
					$(element).removeAttr("disabled");
				},
				disable: function() {
					$(element).attr("disabled", "disabled");
				}
			};
			var opts = valueAccessor();
			opts.obj.subscribe(function() {
				console.log("[attachTo:init] subscribe", arguments);
				if (actions.hasOwnProperty(opts.act)) {
					actions[opts.act]();
				}
			});
		},
		update: function(element, valueAccessor, allBindings, viewModel, context) {}
	};
	
	function MainViewModel() {
		var self = this;
		this.url = ko.observable();
		this.data = {
			request: ko.observable(),
			response: ko.observable()
		};
		
		this.url.subscribe(function(newValue) {
			console.log("[Model:url:subscribe]", arguments, this, self);
		});
	}
	MainViewModel.prototype = {
		start: function() {
			ko.applyBindings(this);
		},
		
		post: function() {
			var self = this;
			var options = {
				type: "POST",
				urL: self.url(),
				data: self.data.request(),
				success: function(data, status) {
					console.log("[post:ajax]", arguments);
					if ("success" === status) {
						console.log("[get:ajax", status);
						self.data.response(data);
					}
				}
			};
			console.log("[post:ajax]", arguments, options, self);
			$.ajax(options);
		},
		get: function() {
			var self = this;
			console.log("[get:ajax]", arguments, self);
			var options = {
				urL: self.url(),
				success: function(data, status) {
					console.log("[get:ajax]", arguments);
					if ("success" === status) {
						console.log("[get:ajax", status);
						self.data.response(data);
					}
				}
			};
			$.ajax(options);
		}
	};
	
	return new MainViewModel();
});
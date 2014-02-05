/*
	Backbone ModalView
	http://github.com/amiliaapp/backbone-bootstrap-widgets

	Copyright (c) 2014 Amilia Inc.
	Written by Martin Drapeau
	Licensed under the MIT @license
 */
(function(){

	Backbone.ModalView = Backbone.View.extend({
		className: "modal hide backbone-modal",
		template: _.template([
			'<div class="modal-header">',
			'  <a type="button" class="close" aria-hidden="true">&times;</a>',
			'  <h3><%=title%></h3>',
			'</div>',
			'<div class="modal-body"></div>',
			'<div class="modal-footer">',
			'</div>'].join("\n")),
		buttonTemplate: _.template('<a href="<%=href%>" class="btn btnSet3 <%=className%>"><%=label%></a>'),
		buttonDefaults: {
			className: "",
			href: "#",
			label: "",
			close: false
		},
		defaults: {
			title: "Info",
			buttons: [{
				className: "btn-primary close",
				href: "#",
				label: "Close",
				close: true
			}]
		},
		initialize: function(options) {
			options || (options = {});
			_.defaults(this, this.defaults);
			_.extend(this, _.pick(options, _.keys(this.defaults)));
			_.bindAll(this, "close");
		},
		render: function() {
			var view = this;

			this.$el.html(this.template({
				title: this.title,
			}));
			this.$header = this.$el.find('.modal-header');
			this.$body = this.$el.find('.modal-body');
			this.$footer = this.$el.find('.modal-footer');

			_.each(this.buttons, function(button) {
				_.defaults(button, view.buttonDefaults);
				var $button = $(view.buttonTemplate(button));
				view.$footer.append($button);
				if (button.close) $button.on("click", view.close);
			});

			this.$el.modal({
				keyboard: false
			});

			this.$header.find("a.close").click(view.close);
			$('.modal-backdrop').off().click(view.close);

			this.postRender();

			return this;
		},
		postRender: function() {
			return this;
		},
		close: function(e) {
			if (e) e.preventDefault();
			this.$el.modal("hide");
			this.remove();
			return false;
		}
	});

}).call(this);
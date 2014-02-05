/*
	Backbone FormView
	http://github.com/amiliaapp/backbone-bootstrap-widgets

	Copyright (c) 2014 Amilia Inc.
	Written by Martin Drapeau
	Licensed under the MIT @license
 */
(function(){

	var empty = {
		name: "", // Name of the model attribute
		nested: "", // If model attribute is an object, nested attribute to display (and update)
		label: "",
		placeholder: "",
		className: "",
		control: undefined, // input, select, uneditableInput or spacer
		value: undefined // Do not pass in - will be fetched from model
	};
	Backbone.FormView = Backbone.View.extend({
		schema: undefined,
		inputSize: undefined, // min, small, medium, large, xlarge or xxlarge
		tagName: "form",
		className: "form-horizontal",
		templates: {
			input: _.template([
				'<div class="control-group <%=className%>">',
				'  <label class="control-label"><%=label%></label>',
				'  <div class="controls">',
				'    <input type="text" class="input-<%=inputSize%>" name="<%=name%>" data-nested="<%=nested%>" value="<%=value%>" placeholder="<%=placeholder%>" />',
				'  </div>',
				'</div>'
			].join("\n")),
			uneditableInput: _.template([
				'<div class="control-group <%=className%>">',
				'  <label class="control-label"><%=label%></label>',
				'  <div class="controls">',
				'    <span class="uneditable-input input-<%=inputSize%>"><%=value%></span>',
				'  </div>',
				'</div>'
			].join("\n")),
			spacer: _.template([
				'<div class="control-group <%=className%>">',
				'  <label class="control-label">&nbsp;</label>',
				'  <div class="controls"></div>',
				'</div>'
			].join("\n")),
			select: _.template([
				'<div class="control-group <%=className%>">',
				'  <label class="control-label"><%=label%></label>',
				'  <div class="controls">',
				'    <select type="text" class="input-<%=inputSize%>" name="<%=name%>" data-nested="<%=nested%>" value="<%=value%>" placeholder="<%=placeholder%>">',
				'      <% for (var i=0; i < options.length; i++) { %>',
				'        <% var option = options[i]; %>',
				'        <option value="<%=option.value%>" <%=option.value == value ? "selected=\'selected\'" : ""%>><%=option.label%></option>',
				'      <% } %>',
				'    </select>',
				'  </div>',
				'</div>'
			].join("\n")),
		},
		initialize: function(options) {
			Backbone.View.prototype.initialize.apply(this, arguments);
			_.defaults(this, options || {});
			if (!this.inputSize) this.inpuSize = "xlarge";
		},
		render: function() {
			var view = this,
				model = this.model;

			// Render form elements
			_.each(this.schema, function(record) {
				var data = _.extend({inputSize: view.inputSize}, empty, record),
					value = model.get(record.name);

				if (!_.isEmpty(record.name))
					data.value = record.nested ? value[record.nested] : value;

				$el = $(view.templates[record.control](data)).appendTo(view.$el);
			});

			// Transfer DOM changes to the model
			this.$el.find('input, select').off("change").on("change", function(e) {
				var $el = $(this),
					name = $el.attr("name"),
					nested = $el.attr("data-nested"),
					value = $el.val(),
					changes = {};
				if (_.isEmpty(nested)) {
					changes[name] = value;
				} else {
					changes[name] = _.clone(model.get(name));
					changes[name][nested] = value;
				}
				model.set(changes);
			});

			return this;
		}
	});

}).call(this);
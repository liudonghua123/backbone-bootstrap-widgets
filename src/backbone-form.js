/*
  Backbone FormView
  http://github.com/amiliaapp/backbone-bootstrap-widgets

  Copyright (c) 2014 Amilia Inc.
  Written by Martin Drapeau
  Licensed under the MIT @license
 */
(function(){

  Backbone.FormView = Backbone.View.extend({
      field: {
      name: "", // Name of the model attribute
      nested: "", // If model attribute is an object, nested attribute to display (and update)
      label: "",
      placeholder: "",
      className: "", // Form group class
      control: undefined, // input, select, uneditableInput or spacer
      type: "text", // input type, defaults to text
      value: undefined, // Do not pass in - will be fetched from model
      options: undefined, // If control is select, list of options as {label:<label>, value:<value>}
      labelClassName: "col-sm-4", // Control label class
      controlsClassName: "col-sm-8" // Form controls class
    },
    schema: undefined,
    tagName: "form",
    className: "form-horizontal",
    templates: {
      input: _.template([
        '<div class="form-group <%=className%>">',
        '  <label class="control-label <%=labelClassName%>"><%=label%></label>',
        '  <div class="<%=controlsClassName%>">',
        '    <input type="<%=type%>" class="form-control" name="<%=name%>" data-nested="<%=nested%>" value="<%=value%>" placeholder="<%=placeholder%>" />',
        '  </div>',
        '</div>'
      ].join("\n")),
      uneditableInput: _.template([
        '<div class="form-group <%=className%>">',
        '  <label class="control-label <%=labelClassName%>"><%=label%></label>',
        '  <div class="<%=controlsClassName%>">',
        '    <span class="form-control uneditable-input"><%=value%></span>',
        '  </div>',
        '</div>'
      ].join("\n")),
      spacer: _.template([
        '<div class="form-group <%=className%>">',
        '  <label class="control-label <%=labelClassName%>">&nbsp;</label>',
        '  <div class="<%=controlsClassName%>"></div>',
        '</div>'
      ].join("\n")),
      select: _.template([
        '<div class="form-group <%=className%>">',
        '  <label class="control-label <%=labelClassName%>"><%=label%></label>',
        '  <div class="<%=controlsClassName%>">',
        '    <select class="form-control" name="<%=name%>" data-nested="<%=nested%>" value="<%=value%>" placeholder="<%=placeholder%>">',
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
      if (options.field) _.extend(this.field, options.field);
    },
    render: function() {
      var view = this,
        model = this.model;

      // Render form elements
      _.each(this.schema, function(record) {
        var data = _.extend({}, view.field, record),
          value = model.get(record.name);

        if (!_.isEmpty(record.name))
          data.value = record.nested ? value[record.nested] : value;

        $(view.templates[record.control](data)).appendTo(view.$el);
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


  /**
    Bootstrap 2.3 use requires changes in HTML markup. In addition, we declare
    a new option inputSize to control the size of controls. It takes possible
    values min, small, medium, large, xlarge or xxlarge. Defaults to xlarge.

    Backbone.FormView.prototype.templates = {
      input: _.template([
        '<div class="control-group <%=className%>">',
        '  <label class="control-label"><%=label%></label>',
        '  <div class="controls">',
        '    <input type="<%=type%>" class="input-<%=inputSize%>" name="<%=name%>" data-nested="<%=nested%>" value="<%=value%>" placeholder="<%=placeholder%>" />',
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
        '    <select class="input-<%=inputSize%>" name="<%=name%>" data-nested="<%=nested%>" value="<%=value%>" placeholder="<%=placeholder%>">',
        '      <% for (var i=0; i < options.length; i++) { %>',
        '        <% var option = options[i]; %>',
        '        <option value="<%=option.value%>" <%=option.value == value ? "selected=\'selected\'" : ""%>><%=option.label%></option>',
        '      <% } %>',
        '    </select>',
        '  </div>',
        '</div>'
      ].join("\n"))
    };
    Backbone.FormView.prototype.field.inputSize = "xlarge";

  */

}).call(this);

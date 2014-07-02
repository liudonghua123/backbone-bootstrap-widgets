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
      disabled: false, // Set to true to disable the control
      value: undefined, // Default value when model is empty. Optional.
      options: undefined, // If control is select or radioInput, list of options as {label:<label>, value:<value>}. If control is datepicker, datepicker options.
      labelClassName: "col-sm-4", // Control label class
      controlsClassName: "col-sm-8", // Form controls class,
      controlClassName: "" // Control (input) class
    },
    schema: undefined,
    tagName: "form",
    className: "form-horizontal",
    templates: {
      input: _.template([
        '<div class="form-group <%=className%>">',
        '  <label class="control-label <%=labelClassName%>"><%-label%></label>',
        '  <div class="<%=controlsClassName%>">',
        '    <input type="<%=type%>" class="form-control <%=controlClassName%>" name="<%=name%>" data-nested="<%=nested%>" value="<%-value%>" placeholder="<%-placeholder%>" />',
        '  </div>',
        '</div>'
      ].join("\n")),
      booleanInput: _.template([
        '<div class="form-group <%=className%>">',
        '  <label class="control-label <%=labelClassName%>"></label>',
        '  <div class="<%=controlsClassName%>">',
        '    <div class="checkbox">',
        '      <label>',
        '        <input type="checkbox" class="<%=controlClassName%>" name="<%=name%>" data-nested="<%=nested%>" value="<%-value%>" /> <%-label%>',
        '      </label>',
        '    </div>',
        '  </div>',
        '</div>'
      ].join("\n")),
      uneditableInput: _.template([
        '<div class="form-group <%=className%>">',
        '  <label class="control-label <%=labelClassName%>"><%-label%></label>',
        '  <div class="<%=controlsClassName%>">',
        '    <span class="form-control uneditable-input <%=controlClassName%>"><%=value%></span>',
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
        '  <label class="control-label <%=labelClassName%>"><%-label%></label>',
        '  <div class="<%=controlsClassName%>">',
        '    <select class="form-control <%=controlClassName%>" name="<%=name%>" data-nested="<%=nested%>" value="<%-value%>" placeholder="<%-placeholder%>" >',
        '      <% for (var i=0; i < options.length; i++) { %>',
        '        <% var option = options[i]; %>',
        '        <option value="<%-option.value%>" <%=option.value == value ? "selected=\'selected\'" : ""%>><%-option.label%></option>',
        '      <% } %>',
        '    </select>',
        '  </div>',
        '</div>'
      ].join("\n")),
      radioInput: _.template([
        '<div class="form-group <%=className%>">',
        '  <label class="control-label <%=labelClassName%>"><%-label%></label>',
        '  <div class="checkbox <%=controlsClassName%>">',
        '    <% for (var i=0; i < options.length; i++) { %>',
        '      <% var option = options[i]; %>',
        '      <label class="checkbox-inline">',
        '        <input type="radio" class="<%=controlClassName%>" name="<%=name%>" data-nested="<%=nested%>" value="<%=option.value%>" /> <%-option.label%>',
        '      </label>',
        '    <% } %>',
        '  </div>',
        '</div>'
      ].join("\n")),
      textarea: _.template([
        '<div class="form-group <%=className%>">',
        '  <label class="control-label <%=labelClassName%>"><%-label%></label>',
        '  <div class="<%=controlsClassName%>">',
        '    <textarea class="form-control <%=controlClassName%>" name="<%=name%>" data-nested="<%=nested%>" placeholder="<%-placeholder%>"><%-value%></textarea>',
        '  </div>',
        '</div>'
      ].join("\n")),
      datepicker: _.template([
        '<div class="form-group <%=className%>">',
        '  <label class="control-label <%=labelClassName%>"><%-label%></label>',
        '  <div class="<%=controlsClassName%>">',
        '    <input type="<%=type%>" class="form-control datepicker <%=controlClassName%>" name="<%=name%>" data-nested="<%=nested%>" value="<%-value%>" placeholder="<%-placeholder%>" />',
        '  </div>',
        '</div>'
      ].join("\n"))
    },
    initialize: function(options) {
      Backbone.View.prototype.initialize.apply(this, arguments);
      _.defaults(this, options || {});
      if (options.field) _.extend(this.field, options.field);

      _.bindAll(this, "onChange");

      // Ensure required 'options' was passed for select and radioInput controls
      _.each(this.schema, function(record) {
        if ((record.control == 'select' || record.control == 'radioInput') && !record.options)
          throw new Error("Missing options for control " + record.control);
      });
    },
    render: function() {
      var view = this,
          model = this.model,
          isEmpty = _.isEmpty(model.toJSON());
      
      this.$el.empty();

      // Render form elements
      _.each(this.schema, function(record) {
        var data = _.extend({}, view.field, record),
          value = model.get(record.name);

        if (!isEmpty)
          data.value = record.nested && value ? value[record.nested] : value;

        record.$el = $(view.templates[record.control](data)).appendTo(view.$el);

        if (record.control == "radioInput")
          record.$el.find("input[value=" + JSON.stringify(value) + "]").attr("checked", "checked");

        if (record.control == "booleanInput" && value)
          record.$el.find("input").attr("checked", "checked");

        if (record.disabled)
          record.$el.find("input, select, textarea").attr("disabled", "disabled");

        if (record.control == "datepicker")
          record.$el.find("input").datepicker(record.options || {})
      });

      // Transfer DOM changes to the model
      this.$el.find("input, select, textarea")
        .off("change")
        .on("change", this.onChange);

      this.$el.find("input.datepicker")
        .off("changeDate")
        .on("changeDate", this.onChange);

      return this;
    },
    onChange: function(e) {
      var model = this.model,
          $el = $(e.target),
          name = $el.attr("name"),
          nested = $el.attr("data-nested"),
          value = $el.is("input[type=checkbox]") ? $el.is(":checked") : $el.val(),
          changes = {};

      if (_.isEmpty(nested)) {
        changes[name] = value;
      } else {
        changes[name] = _.clone(model.get(name)) || {};
        changes[name][nested] = value;
      }
      model.set(changes);
    }
  });

}).call(this);
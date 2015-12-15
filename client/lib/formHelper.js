FormHelper = (function() {
/**
 * @param  {Event} Fired event
 */
  var validate = function(event) {
    $(event.target).valid();
  };

  /**
   * Attach event handler to an element if not attached previously.
   * 
   * @param {Element} element    element to which the handler should be attached
   * @param {String}  eventName  event name for the handler
   * @param {function} handler   event handler to be attached
   */
  var addOnce = function(element, eventName, handler) {
    var events = $._data(element, "events");
    if (events && events[eventName] && events[eventName].some(function(h) {
      return handler == h.handler;
    })) {
      return;
    }
    $(element).on(eventName, handler);
  };

  return {
    /**
     * Add HTML 5 validation rules to the form based on the schema
     * 
     * @param (Object) form - Form to apply validation to
     * @param (Object) schema - Schema to retrieve validation rules from
     */
    addValidationToForm: function(form, schema) {
      if (!schema || !form)
        return;

      var $formInputs = $(form).find('input,select,textarea').filter(function(index, element) {
        var addValidation = !$(element).data("validationAdded") &&
                              (element.name || $(element).data("name"));
        return addValidation;
      });

      if ($formInputs.length == 0)
        return;      

      $formInputs.each(function(index, element) {
        addOnce(element, 'focusout', validate);
      });

      for (var fieldName in schema) {
        var fieldRules = schema[fieldName];                
        var matchString = "^" + fieldName.replace(/\./g, "\\.").replace(/\$/g, "[0-9]*") + "$";
        var matchStringDate = "^" + fieldName.replace(/\./g, "\\.").replace(/\$/g, "[0-9]*") + "(|_year|_month|_day){1}$";        
        var regexp = new RegExp(matchString);
        var regexpDate = new RegExp(matchStringDate);
        var $inputs = $formInputs.filter(function(index, element) {
          if (fieldRules.type == Date && this.dataset.hasOwnProperty("name")) {
            return this.dataset.name.match(regexpDate);
          } else {
            return this.name.match(regexp);
          }
        });

        // Set required by default
        $inputs.each(function() {
          this.setAttribute('required', '');
        });

        $inputs.data("validationAdded", true);

        for (var prop in fieldRules) {
          switch (prop) {
            case 'min':
              if (fieldRules.type == String) {
                $inputs.attr('minlength', fieldRules[prop]);

              } else if (fieldRules.type == Number) {
                $inputs.attr('min', fieldRules[prop]);
              }
              break;
            case 'max':
              if (fieldRules.type == String) {
                $inputs.attr('maxlength', fieldRules[prop]);
              } else if (fieldRules.type == Number) {
                $inputs.attr('max', fieldRules[prop]);

              }
              break;
            case 'optional':
              if (fieldRules[prop]) {
                $inputs.removeAttr('required');
              }
              break;
          }
        }
      }
    },
    /**
     * Refresh form validation
     * 
     * @param  {element} form   The element to find the closest form
     */
    refreshValidation: function(elem, schema) {
      var form, $childForm, $parentForm;
      if (elem.nodeName == 'FORM') {
        form = elem;
      } else {
        $childForm = $(elem).find('form');
        if ($childForm.length > 0) {
          form = $childForm[0];
        } else {
          $parentForm = $(elem).closest('form');
          form = $parentForm.length > 0 ? $parentForm[0] : null;
        }        
      }

      if (!form)
        return;

      this.addValidationToForm(form, schema);
    },
     /**
     * Retrieve name and value from form array fields.
     * @param {Object} form - The form containing the input fields
     * @param {string} field - The input name prefix to retrieve items from
     * @param {[string}] subFields - The array subfields to retrieve values from
     * @return The array of objects with name and values
     */
    getArrayFields : function(form, field, subFields) {
      var $inputs = $(form).find('[name^="' + field + '."]');
      var data = {};
      for (var i = 0; i < $inputs.length; i++) {
        var path = $($inputs[i]).attr('name');
        var value = $($inputs[i]).val();
        ObjectHelper.setDescendantProp(data, path, value);
      }
      var items = [];
      for (var prop in data[field]) {
        items.push(data[field][prop]);
      }
      return items;
    },
    /**
     * Retrieve form fields into an object
     * @param  {form}        form   - Form DOM element
     * @param {SimpleSchema} schema - Schema to parse data
     * @return {Object}      Object - containing all the properties of the form
     */
    getFields : function(form, schema) {
      var $inputs = $(form).find('input,select,textarea').filter(function(index, elem) {
        return elem.type != 'submit' && elem.type != 'file';
      });
      var data = {};
      for (var i = 0; i < $inputs.length; i++) {
        var path = $($inputs[i]).attr('name');
        if (!path)
          continue;
        
        var value = $($inputs[i]).val();        
        if (schema._schema[path].type == Date) {
          value = value ? new Date(value) : null;
        } else if (schema._schema[path].type == Number) {
          value = value ? parseFloat(value) : null;
        }

        value = value == "" ? null : value; // Convert string empty to null

        ObjectHelper.setDescendantProp(data, path, value);
      }
      return data;
    },
    /**
     * Get the validation context for the specified schema and specified keys
     */
    getValidatorContext: function(schema, keysToInclude) {
      var allKeys = schema.newContext()._schemaKeys;
      var keys = [];
      keysToInclude.forEach(function(includeKey) {
        var found = allKeys.filter(function(key) {
          return key == includeKey || key.indexOf(includeKey + '.') == 0;
        });
        keys.push.apply(keys, found);
      });

      var subSchema = schema.pick(keys);
      return subSchema.newContext();
    },
    /**
     * Create a url from the supplied file object (for local images for example)
     * @params {Object} object - File object from the input control
     */
    createObjectUrl: function(object) {
      return (window.URL) ? window.URL.createObjectURL(object) : window.webkitURL.createObjectURL(object);
    },
    /**
     * Revoke the object url creation
     */
    revokeObjectUrl: function(url) {
      return (window.URL) ? window.URL.revokeObjectURL(url) : window.webkitURL.revokeObjectURL(url);
    }
  };
})();

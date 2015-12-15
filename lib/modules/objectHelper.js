ObjectHelper = (function() {
  return {
    /**
     * Retrieve descendant properties from the specifed object
     * @param {Object} obj - Object to retrieve properties from
     * @param {string} desc - String indicating the full path (separated by dots)
     */
    getDescendantProp: function(obj, desc) {
      if (obj == null) {
        return obj;

      }
      var arr = desc.split(".");
      while (arr.length && (obj = obj[arr.shift()]));
      return obj;
    },
    /**
     * Set descendant property value for the specifed object
     * @param {Object} obj - Object to set the descendant property value
     * @param {string} desc - String indicating the full path (separated by dots)
     * @param {Object} value - Value to be set
     */
    setDescendantProp: function(obj, desc, value) {
      var arr = desc.split(".");
      var field = arr[arr.length - 1];
      arr = arr.slice(0, arr.length - 1);
      while (arr.length) {
        if (obj[arr[0]] == null) {
          obj[arr[0]] = {}
        }
        obj = obj[arr.shift()];
      }
      obj[field] = value;
    }
  };
})();
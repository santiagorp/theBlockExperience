Template.confirmationsBar.helpers({
  items: function() {
    var instance = UI.Template.instance();
    var confirmations = instance.data > 6 ? 6 : instance.data;
    var i;
    var result = [];
    for (i = 0; i < confirmations; i++) {
      result.push('confirmed');
    }
    for (i; i < 6; i++) {
      result.push('unconfirmed');
    }
    return result;
  },
  isConfirmed: function() {
    var instance = UI.Template.instance();
    return instance.data > 0;
  }
});
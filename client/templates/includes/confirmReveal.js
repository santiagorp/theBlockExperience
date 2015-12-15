Template.confirmReveal.onCreated(function() {
  var data = this.data || {};
  var model = {
    cancelButtonText: data.cancelButtonText ||  "Cancel",
    actionButtonText: data.actionButtonText || "Accept",
    onConfirm: data.onConfirm || function() {},
    message: data.message || "Please confirm"
  };
  this.dialogData = model;
});

Template.confirmReveal.helpers({
  'dialogData': function() {
    var template = UI.Template.instance();
    return template.dialogData;
  }
});

Template.confirmReveal.events({
  'click .actionButton': function(e) {
    e.preventDefault();
    var template = UI.Template.instance();
    template.data.reveal.close();
    if (template.data.onConfirm) {
      template.data.onConfirm();
    }
  },
  'click .cancelButton': function(e) {
    e.preventDefault();
    var template = UI.Template.instance();
    template.data.reveal.close();
  }
});

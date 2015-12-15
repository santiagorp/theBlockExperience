Template.appLayout.onRendered(function() {
  // Setup animations
  this.find('#content')._uihooks = {
    insertElement: function(node, next) {
      $(node)
        .hide()
        .insertBefore(next)
        .fadeIn(500);
    },
    removeElement: function(node) {
      $(node).remove();
    }
  };
});
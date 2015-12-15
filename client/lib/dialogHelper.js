DialogHelper = (function() {
  return {
    /**
    * Options:

    * message: <String>
    * cancelButtonText: <String>
    * actionButtonText: <String>
    * onConfirm: <function>
    *
    */
    confirmDialog: function(options) {
      var $wrapper = $("<div class='revealWrapper'/>");
      var view = Blaze.renderWithData(Template.confirmReveal, options, $wrapper[0]);
      $('body').append($wrapper);
      var $revealDiv = $wrapper.children().first();
      var reveal = new Foundation.Reveal($revealDiv);
      $revealDiv.on('closed.zf.reveal', function(e) {
        reveal.destroy();
        $wrapper.remove();
      });
      view.dataVar.curValue.reveal = reveal;
      reveal.open();
    }
  };
})();

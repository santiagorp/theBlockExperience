StringHelper = (function() {
  var entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
  };

  function escapeHtml(string) {
    return String(string).replace(/[&<>"'\/]/g, function(s) {
      return entityMap[s];
    });
  }
  return {
    escapeHtml: escapeHtml,
    formatHtml: function(text) {
      text = escapeHtml(text);
      text = text.replace(/(\r\n|\n|\r)/gm, '<br/>');
      return new Spacebars.SafeString(text);
    }
  }
})();
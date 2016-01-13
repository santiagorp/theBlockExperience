SearchHelper = (function() {
  return {
    search: function(term) {
      var num = Number(term);
      // Block hash
      if (term.length == 64 && term.indexOf("000000") == 0) {
        Router.go("/block/" + term);
      } else if (term.length == 64) {
        Router.go("/tx/" + term);
      } else if (!Number.isNaN(num)) {
        Router.go("/block/" + term);
      } else {
        Router.go("/notFound");
      }
    }
  };
})();
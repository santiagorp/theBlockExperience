var resizeGradients = function(e) {
  var faceWidth = parseInt($(".bar.heat-gradient .percentage").width());
  var stylesheet = document.styleSheets[0];
  var selectorText = ".bar.heat-gradient .percentage::before";

  // update rule with new width
  for (var i = 0; i < stylesheet.cssRules.length; i++) {
    var rule = stylesheet.cssRules[i];
    if (rule.selectorText == selectorText) {
      rule.style.backgroundSize = faceWidth + "px";
      break;
    }
  }
};

Template.latestBlocks.onCreated(function() {
  $(window).resize(resizeGradients);
});

Template.latestBlocks.onDestroyed(function() {
  $(window).unbind("resize", resizeGradients);
});

Template.latestBlocks.onRendered(function() {
  resizeGradients();
});

Template.latestBlocks.helpers({
  'formatUnixTime': function(unixTime) {
    var mom = moment(unixTime, "X");
    return mom.fromNow();
  },
  'percent': function() {
    var blockSize = 1024 * 1024;
    var percent = Math.floor(100 * this.s / blockSize);
    return percent > 0 ? percent : 1; // Never show 0%
  }
});

Template.latestBlocks.events({
  'submit .search-form': function(event, template) {
    // Prevent default browser form submit
    event.preventDefault();

    var data = $(event.target).serializeArray().reduce(function(obj, item) {
      obj[item.name] = item.value;
      return obj;
    }, {});

    SearchHelper.search(data.term);
  }
});
Template.progressBar.onCreated(function() {
	this.percent = Blaze.ReactiveVar(1);
});

Template.progressBar.onRendered(function() {
	var self = this;
	setTimeout(function() {
		self.percent.set(self.data.value);
	}, 200);
});

Template.progressBar.helpers({
	percent: function() {
		var template = UI.Template.instance();
		return template.percent.get();
	},
  'formatSize': function(size) {
    var suffix = "";
    if (size > 1024) {
      size /= 1024;
      suffix = "KB";
    } if (size > 1024) {
      size /= 1024;
      suffix = "MB";
    }
    size = size.toFixed(0);
    return size.toString() + " " + suffix;
  }
});

Template.progressBar.events({
	'click.progress-bar': function(event, template) {
		var n = template.data.height;
		Router.go('/block/' + n);
	}
});

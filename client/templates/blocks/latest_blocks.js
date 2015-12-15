Template.latestBlocks.helpers({
  'formatUnixTime': function(unixTime) {
    return moment(unixTime, "X").toString();
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
    size = size.toFixed(2);
    return size.toString() + " " + suffix;
  }
});
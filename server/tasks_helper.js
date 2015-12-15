TaskHelper = (function() {
  var _updatingBlockIndexes = false;
  var _updatingLatestBlocks = false;

  var updateBlockIndexes = function() {
    Meteor.defer(function() {
      if (_updatingBlockIndexes)
        return;

      console.log("Updating block indexes: START");
      _updatingBlockIndexes = true;
      try {
        var lastBlocks = Meteor.call("bitcoin.getBlockCount");
        var lastInserted = BlockIndexes.findOne({}, {
          sort: {
            h: -1
          }
        });
        var startIndex = lastInserted ? lastInserted.h + 1 : 0;
        for (var i = startIndex; i <= lastBlocks; i++) {
          var block = Meteor.call("bitcoin.getBlockByIndex", i);

          // Stop and retry later in case of error
          if (block == null)
            break;

          var blockIndex = {
            _id: i.toString(),
            h: i,
            n: block.numTx,
            s: block.size,
            t: block.time
          }
          BlockIndexes.insert(blockIndex);
        }
      } catch (ex) {
        console.log("Error updating indexses. Retry later...");
      }

      _updatingBlockIndexes = false;
      console.log("Updating block indexes: END");
    });
  };

  var updateLatestBlocks = function() {
    Meteor.defer(function() {
      if (_updatingLatestBlocks)
        return;

      try {
        var N = 15;

        var _updatingLatestBlocks = true;
        console.log("Updating latest blocks: START");

        var numBlocks = Meteor.call("bitcoin.getBlockCount");
        var lastInserted = LatestBlocks.findOne({}, {
          sort: {
            height: -1
          }
        });

        var startIndex = numBlocks - N;
        startIndex = lastInserted ? Math.max(startIndex, lastInserted.height + 1) : startIndex;
        for (var i = startIndex; i <= numBlocks; i++) {
          var block = Meteor.call("bitcoin.getBlockByIndex", i);
          if (block == null)
            break;

          LatestBlocks.insert(block);
        }

        // Delete old ones
        LatestBlocks.remove({
          height: {
            $lte: numBlocks - N
          }
        });

      } catch (ex) {
        console.log("Error updating lastest blocks. Retry later...");
      }
      _updatingLatestBlocks = false;
      console.log("Updating latest blocks: END");
    });
  };

  var cron = new Meteor.Cron({
    events: {
      "* * * * *": function() {
        updateBlockIndexes();
        updateLatestBlocks();
      }
    }
  });

  return {};
})();
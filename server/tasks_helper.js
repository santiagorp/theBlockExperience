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
            t: block.time,
            v: block.version
          }

          // Bitcon classic node. Add coinbase
          if (blockIndex.v == 805306368) {
            blockIndex.c = Meteor.call('bitcoin.getCoinbaseFromBlockIndex', i);
            blockIndex.bh = block.hash;
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

  var cron = new Meteor.Cron({
    events: {
      "* * * * *": function() {
        updateBlockIndexes();
      }
    }
  });

  return {};
})();
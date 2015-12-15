Bitcoin = Meteor.npmRequire('bitcoin');
Future = Npm.require('fibers/future');

// all config options are optional
var client = new Bitcoin.Client({
  host: Meteor.settings.bitcoinNode.host, 
  port: Meteor.settings.bitcoinNode.port,
  user: Meteor.settings.bitcoinNode.user,
  pass: Meteor.settings.bitcoinNode.pass,
  timeout: Meteor.settings.bitcoinNode.timeout
});

var bitcoinSyncCall = function() {
  var result = null;
  try {
    var args = [].slice.call(arguments);

    var future = new Future();
    var callback = function(err, result, headers) {
      if (err) {
        future.throw(err);
      } else {
        future.return(result);
      }
    };

    args.push(callback);
    client.cmd.apply(client, args);

    result = future.wait();
  } catch (ex) {
    console.log("Error invoking service.");
  }
  return result;
};

Meteor.methods({
  /*"bitcoin.cmd": function() {
    var args = [].slice.call(arguments);
    var result = bitcoinSyncCall(args.shift(), args);
    return result;
  },*/
  "bitcoin.getBlockByIndex": function(index) {
    var hash = bitcoinSyncCall('getblockhash', index);
    return Meteor.call('bitcoin.getBlock', hash);
  },
  "bitcoin.getBlockCount": function() {
    var blockCount = bitcoinSyncCall('getblockcount');
    return blockCount;
  },
  "bitcoin.getLastBlock": function() {
    var blockCount = bitcoinSyncCall('getblockcount');
    var hash = bitcoinSyncCall('getblockhash', blockCount);
    return Meteor.call('bitcoin.getBlock', hash);
  },
  "bitcoin.getBlock": function(hash, withTx) {
    var block = bitcoinSyncCall('getblock', hash);
    block.numTx = block.tx.length;
    if (!withTx) {
      delete block.tx;
    }
    return block;
  },
  "bitcoin.getBlockWithTransactions": function(hash) {
    var block = bitcoinSyncCall('getblock', hash);
    block.numTx = block.tx.length;
    return block;
  },
  "bitcoin.getTransaction": function(txid) {
    var transaction = bitcoinSyncCall('getrawtransaction', txid, 1);
    return transaction;
  },
  "bitcoin.getLatestBlocks": function() {
    var numBlocks = 15;
    var blockCount = bitcoinSyncCall('getblockcount');
    var hashes = [];
    for (var i = blockCount - numBlocks; i <= blockCount; i++) {
      var hash = bitcoinSyncCall('getblockhash', i);
      hashes.push(hash);
    }
    var blocks = [];
    hashes.forEach(function(hash) {
      var block = Meteor.call('bitcoin.getBlock', hash, true);
      blocks.push(block);
    });
    return blocks;
  }
});

Router.configure({
  layoutTemplate: 'appLayout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'pageNotFound'
});

Router.route('home', {
  path: '/',
  template: 'latestBlocks',
  waitOn: function() {
    return Meteor.subscribe('latestBlocks');
  },
  data: function() {
    return {
      blocks: BlockIndexes.find({}, {
        sort: {
          h: -1
        },
        limit: 6
      })
    };
  }
});

Router.route('/block/:_hash', {
  template: 'blockInfo',
  data: function() {
    Session.set("block", null);
    if (this.params._hash.length != 64) {
      var index = parseInt(this.params._hash);
      Meteor.call('bitcoin.getBlockHash', index, function(err, hash) {
        if (!err) {
          Meteor.call('bitcoin.getBlock', hash, function(err, block) {
            if (!err) {
              Session.set("block", block);
            }
          });
        }
      });
    } else {
      Meteor.call('bitcoin.getBlock', this.params._hash, function(err, block) {
        if (!err) {
          Session.set("block", block);
        }
      });
    }
  }
});


Router.route('/transactions/:_hash', {
  template: 'transactions',
  data: function() {
    Session.set("block", null);
    Meteor.call('bitcoin.getBlockWithTransactions', this.params._hash, function(err, block) {
      if (!err) {
        Session.set("block", block);
      }
    });
  }
});

Router.route('/tx/:_txid', {
  template: 'transaction',
  data: function() {
    Session.set("block", null);
    Session.set("transaction", null);
    Meteor.call('bitcoin.getTransaction', this.params._txid, function(err, tx) {
      if (!err) {
        Session.set("transaction", tx);
      }
    });
  }
});

Router.route('/about', {
  template: 'about'
});

Router.route('/lastClassicBlockTipInfo', function () {  
  var req = this.request;
  var res = this.response;

  res.setHeader('Content-Type', 'application/json');

  var numBlocks = Meteor.call('bitcoin.getBlockCount');
  var maxHeight = numBlocks - 1000;
  var lastClassicBlock = BlockIndexes.findOne(
    { 
      v: 805306368,
      h:  { $gt: maxHeight }
    },
    {
      sort: { h: -1 },
      limit: 1
    });

  var data = {
    block: 0,
    hash: 0,
    coinbase: 0,
    age: 0
  };

  if (lastClassicBlock != null && lastClassicBlock.c) {
    data.block = lastClassicBlock.h;    
    data.hash = lastClassicBlock.bh;
    data.age = numBlocks - lastClassicBlock.h;
    data.coinbase = lastClassicBlock.c;
  }

  res.end(JSON.stringify(data));
}, {where: 'server'});
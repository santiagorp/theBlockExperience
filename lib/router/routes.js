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
      blocks: LatestBlocks.find({}, { sort: { height: -1 }, limit: 15 })
    };
  }
});

Router.route('/block/:_hash', {
  template: 'blockInfo',
  data: function() {
    Session.set("block", null);
    Meteor.call('bitcoin.getBlock', this.params._hash, function(err, block) {
      if (!err) {
        Session.set("block", block);
      }
    });
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

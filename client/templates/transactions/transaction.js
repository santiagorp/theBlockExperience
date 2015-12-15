Template.transaction.helpers({
  'transaction': function() {
    return Session.get("transaction");
  },
  'amount': function(tx) {
    var total = 0;
    for (var i = 0; i < tx.vout.length - 1; i++) {
      total += tx.vout[i].value;
    }
    return total;
  },
  'change': function(tx) {
    return tx.vout[tx.vout.length - 1].value;    
  },
  'changeAddress': function(tx) {
    return tx.vout[tx.vout.length - 1].scriptPubKey.addresses[0];
  },
  'destination': function(tx) {
    return tx.vout[0].scriptPubKey.addresses[0];
  },
  'formatUnixTime': function(unixTime) {
    return moment(unixTime, "X").toString();
  },
  'inputs': function(tx) {
    var result = tx.vin.map(function(input) {
      return input.txid;
    });
    return result;
  }
});

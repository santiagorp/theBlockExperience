Template.transaction.onCreated(function() {  
   this.fees = Blaze.ReactiveVar("?");
   this.updatingFees = true;
});

Template.transaction.helpers({
  'transaction': function() {
    return Session.get("transaction");
  },
  'amount': function(tx) {
    return TxHelper.getAmount(tx);
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
    var mom = moment(unixTime, "X");
    return mom.format('lll');
  },
  'inputs': function(tx) {
    var result = tx.vin.map(function(input) {
      return input.txid;
    });
    return result;
  },
  'fees': function(tx) {
    var template = UI.Template.instance();
    var fees = template.fees.get();
    if (fees == "?" && !this.updatingFees) {
      console.log("Invoke bitcoin.getInputBalance....");
      Meteor.call("bitcoin.getInputBalance", tx.txid, function(err, inputBalance) {
        if (err) {
          template.fees.set(0);
        } else {
          fees = TxHelper.getFees(tx, inputBalance);
          template.fees.set(fees);
        }
      });
    }
    return fees;
  }
});

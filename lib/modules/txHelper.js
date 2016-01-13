TxHelper = (function() {
  /**
   * Basic rules on transactions (tx):
   *
   * 1. A tx consists of one or more inputs and one or more outputs.
   * 2. All tx inputs refer to an unspent output of a prior transaction.
   * 3. The full value of an input is always spent; a tx can not spend part of the value.
   * 4. Likewise all outputs are either spent or unspent, they can't be partially spent.
   * 5. A tx "spends" the outputs which are referenced in the input portion of the tx.
   * 6. A tx creates new spendable "unspent outputs" listed in the output portion of the tx.
   */
return {
  /**
   * Get the transferred amount (without change/fees)
   * @param  {Transaction} tx The bitcoin transaction
   * @return {Number}    The transferred amount
   */
  getAmount: function(tx) {
    var total = Math.round(tx.vout[0].value * 100000000);
    for (var i = 1; i < tx.vout.length - 1; i++) {
      total += Math.round(tx.vout[i].value * 100000000);
    }
    return total / 100000000;
  },
  /**
   * Get change amount from transactoin
   * @param  {Transaction} tx The transaction
   * @return {Number}    The change amount
   */
  getChange: function(tx) {
    var n = tx.vout.length;
    return n > 1 ? tx.vout[n - 1].value : 0;
  },
  /**
   * Get fees on the transaction
   * @param  {Transaction} tx Bitcoin transaction
   * @return {Number}    The fees of the transaction
   */
  getFees: function(tx, totalInputs) {
    // Total outputs
    var totalOutputs = 0;
    for (var i = 0; i < tx.vout.length; i++) {
      totalOutputs += Math.round(tx.vout[i].value * 100000000);
    }
    return (Math.round(totalInputs * 100000000) - totalOutputs) / 100000000;
  }
};
})();

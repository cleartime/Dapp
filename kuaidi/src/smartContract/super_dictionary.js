"use strict";

var SampleContract = function () {
    LocalContractStorage.defineMapProperty(this, "user");
};


SampleContract.prototype = {
    init() {
        this.to = Blockchain.transaction.to;
        this.from = Blockchain.transaction.from;
    },
    set(data) {
        this.user.set(this.from, data)
    },
    get() {
        return this.user.get(this.from)
    },
    getblock() {
        return this.from
    },
};

module.exports = SampleContract;
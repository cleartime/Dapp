"use strict";

var GxxContract = function () {
    LocalContractStorage.defineMapProperty(this, "user");
    LocalContractStorage.defineMapProperty(this, "auther");
};


GxxContract.prototype = {
    init() {
        // this.to = Blockchain.transaction.to;
        this.from = Blockchain.transaction.from;
    },
    users(data) {
        this.auther.set('auther', 'this.from')
    },
    del() {
        this.user.set(this.from)
    },
    set(data) {
        this.user.set(this.from, data)
    },
    get() {
        return this.user.get(this.from)
    },
    getusers() {
        return this.auther.get('auther')
    },
};

module.exports = GxxContract;
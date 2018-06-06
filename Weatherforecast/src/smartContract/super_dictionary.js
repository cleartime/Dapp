"use strict";

var GxxContract = function () {
    LocalContractStorage.defineMapProperty(this, "user");
    LocalContractStorage.defineMapProperty(this, "auther");
};


GxxContract.prototype = {
    init() {
        // this.to = Blockchain.transaction.to;
        // this.from = Blockchain.transaction.from;
    },
    users(obj) {
        this.auther.set('auther', obj)
    },
    del() {
        this.user.set(this.from)
    },
    set(from, data) {
        this.user.set(from, data)
    },
    get(from) {
        return this.user.get(from)
    },
    getusers(obj) {
        return this.auther.get(obj)
    },
};

module.exports = GxxContract;
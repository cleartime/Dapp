'use strict'

var Prediction = function(text) {
    if (text) {
        var o = JSON.parse(text);
        this.id = o.id
        this.author_addr = o.author_addr;
        this.author_name = o.author_name;
        this.content = o.content;
        this.published_at = parseInt(o.published_at);
        this.like = o.like;
    } else {
        this.id = null;
        this.author_addr = null;
        this.author_name = null;
        this.content = null;
        this.published_at = Blockchain.block.timestamp;
        this.like = 0;
    }
};

Prediction.prototype = {
    toString: function() {
        return JSON.stringify(this);
    },
};

var UserPredictions = function(text) {
    if (text) {
        var o = JSON.parse(text);
        this.array = o.array;
        this.size = o.size;
    } else {
        this.array = [];
        this.size = 0;
    }
};

UserPredictions.prototype = {
    toString: function() {
        return JSON.stringify(this);
    },
    append: function(id) {
        this.array.push(id);
        this.size += 1;
    },
};

var PredictorContract = function() {
    LocalContractStorage.defineMapProperty(this, "predictionMap", {
        parse: function(text) {
            return new Prediction(text);
        },
        stringify: function(o) {
            return o.toString();
        }
    });
    LocalContractStorage.defineProperty(this, "size");
    LocalContractStorage.defineMapProperty(this, "userPredictionsMap", {
        parse: function(text) {
            return new UserPredictions(text);
        },
        stringify: function(o) {
            return o.toString();
        }
    });
    LocalContractStorage.defineProperty(this, "hotPredictionIdArray");
};

PredictorContract.prototype = {
    init: function() {
        this.size = 0;
    },

    create: function(author_name, content) {
        if (author_name.length > 12) {
            throw new Error('Name Too Long')
        }
        if (content.length > 500) {
            throw new Error('Content Too Long');
        }

        var from = Blockchain.transaction.from;
        var id = this.size;
        var prediction = new Prediction();
        prediction.id = id;
        prediction.author_addr = from;
        prediction.author_name = author_name;
        prediction.content = content;

        this.predictionMap.set(id, prediction);
        this.size += 1;

        var userPredictions = this.userPredictionsMap.get(from);
        if (!userPredictions) {
            userPredictions = new UserPredictions();
        }
        userPredictions.append(id)
        this.userPredictionsMap.set(from, userPredictions)

        return prediction
    },

    getMessageById: function(id) {
        var prediction = this.predictionMap.get(id);
        return prediction
    },

    delete: function(id) {
        // 管理功能
        var allowedAddr = 'n1RmYasGTm2UT3mQNyPMuyjsdAgjcDUYB7Q';
        if (Blockchain.transaction.from != allowedAddr) {
            throw new Error('Permission Denied');
        }
        var prediction = this.getMessageById(id);
        if (!prediction) {
            throw new Error('No Such Item');
        }
        this.predictionMap.del(id); // 不做 this.size -= 1

        var userPredictions = this.userPredictionsMap.get(prediction.author_addr)
        var newArray = []
        for (var i = 0; i < userPredictions.size; i++) {
            if (userPredictions.array[i] !== id) {
                newArray.push(userPredictions.array[i]);
            }
        }
        userPredictions.array = newArray;
        userPredictions.size -= 1;
        this.userPredictionsMap.set(prediction.author_addr, userPredictions)

        // del hot listing

        return {
            id: id
        }
    },

    len: function() {
        return this.size
    },

    _pack: function(results, total, limit = 10, offset = 0) {
        return {
            total: total,
            limit: limit,
            offset: offset,
            messages: results,
        }
    },

    getAllMessages: function(limit = 10, offset = 0) {
        if (offset > this.size) {
            offset = this.size;
        }
        var end = offset + limit;
        if (end > this.size) {
            end = this.size;
        }
        var reverse_offset = this.size - 1 - offset;
        var reverse_end = this.size - 1 - end;
        var results = [];
        for (var i = reverse_offset; i > reverse_end; i--) {
            results.push(this.predictionMap.get(i));
        }
        return this._pack(results, this.size, limit, offset)
    },

    getMessagesByAuthorAddr: function(addr, limit = 10, offset = 0) {
        var from = addr ? addr : Blockchain.transaction.from;
        var myPredictions = this.userPredictionsMap.get(from);
        if (!myPredictions) {
            return this._pack([], 0, limit, offset)
        }
        if (offset > myPredictions.size) {
            offset = myPredictions.size;
        }
        var end = offset + limit;
        if (end > myPredictions.size) {
            end = myPredictions.size;
        }
        var reverse_offset = myPredictions.size - 1 - offset;
        var reverse_end = myPredictions.size - 1 - end;
        var ids = [];
        for (var i = reverse_offset; i > reverse_end; i--) {
            ids.push(myPredictions.array[i]);
        }
        var results = [];
        for (var i = 0; i < end - offset; i++) {
            results.push(this.predictionMap.get(ids[i]));
        }
        return this._pack(results, myPredictions.size, limit, offset);
    },

    like: function(id) {
        var prediction = this.getMessageById(id);
        if (!prediction) {
            throw new Error('No Such Item');
        }
        prediction.like += 1;
        this.predictionMap.set(id, prediction);
        this._updateHotMessages(prediction);
        return {
            id: id,
            like: prediction.like,
        }
    },

    _hotSort: function(l) {
        return l.sort(function(a, b) {
            return b.like - a.like
        })
    },

    _updateHotMessages: function(o) {
        var ids = this.hotPredictionIdArray || [];
        if (!ids.includes(o.id)) {
            ids.push(o.id);
        }
        var hotPredictions = [];
        for (var i = 0; i < ids.length; i++) {
            hotPredictions.push(this.predictionMap.get(ids[i]));
        }
        // hotPredictions.push(o);
        hotPredictions = this._hotSort(hotPredictions);
        if (hotPredictions.length > 100) {
            hotPredictions.pop();
        }
        ids = [];
        for (var i = 0; i < hotPredictions.length; i++) {
            ids.push(hotPredictions[i].id);
        }
        this.hotPredictionIdArray = ids;
    },

    getHotMessages: function(limit = 10, offset = 0) {
        // 热门排序
        var hotPredictions = this.hotPredictionIdArray;
        if (!hotPredictions) {
            return this._pack([], 0, limit, offset)
        }
        if (offset > hotPredictions.length) {
            offset = hotPredictions.length;
        }
        var end = offset + limit;
        if (end > hotPredictions.length) {
            end = hotPredictions.length;
        }
        var ids = [];
        for (var i = offset; i < end; i++) {
            ids.push(hotPredictions[i]);
        }
        var results = [];
        for (var i = 0; i < end - offset; i++) {
            results.push(this.predictionMap.get(ids[i]));
        }
        return this._pack(results, hotPredictions.length, limit, offset)
    },

}

module.exports = PredictorContract
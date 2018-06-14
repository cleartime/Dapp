"use strict";

var kitItem = function(text) {
    if (text) {
        var obj = JSON.parse(text);
        this.name = obj.name; //名称
        this.place = obj.place; //地址
        this.from = obj.from;
        this.kitKey = obj.kitKey;
    } else {
        this.name = "";
        this.place = "";
        this.from = "";
        this.kitKey = "";
    }
};

kitItem.prototype = {
    toString: function() {
        return JSON.stringify(this);
    }
};


var kitSys = function() {
    // 1. 先创建GoldSunStorage对象（用于存储数据）
    // 2. 定义数据结构，该行代码作用：为ApiSample创建一个属性sample_data，该属性是一个list结构，list中存储的是SampleDataItem对象
    LocalContractStorage.defineMapProperty(this, "kit_list", {
        parse: function(text) {
            return new kitItem(text);
        },
        stringify: function(o) {
            return o.toString();
        }
    });
    LocalContractStorage.defineProperty(this, "kit_list_size");
    // 定义一个存储string的list
    LocalContractStorage.defineMapProperty(this, "kit_list_array");

}
kitSys.prototype = {
    // 初始化方法，在使用ApiSample之前，务必要调用一次(而且只能调用一次)，所有的初始化逻辑都放到这里
    init: function() {
        if (this.kit_list_size == null) {
            this.kit_list_size = 0;
        }
        if (this.commentItem_list_size == null) {
            this.commentItem_list_size = 0;
        }
        if (this.goodItem_list_size == null) {
            this.goodItem_list_size = 0;
        }
    },
     // 添加一个对象到list中的例子
    add_kit_to_list: function(text) {
        var addResult = {
            success: false,
            message: ""
        };
        var obj = text;
        obj.from = Blockchain.transaction.from;
        var result = this.query_kit_by_key(obj.from);
        if (result.success) {
            addResult.success = false;
            addResult.message = "You have added a kit!";
            return addResult;
        } else {
            obj.name = obj.name.trim(); //名称
            obj.place = obj.place.trim(); //地址
            obj.from = obj.from.trim();

            if (obj.name === "" || obj.place === "") {
                addResult.success = false;
                addResult.message = "empty name / place / topic / text / image";
                return addResult;
            }
            if (obj.name.length > 64 || obj.place.length > 64 ) {
                addResult.success = false;
                addResult.message = "name / place / topic exceed limit length";
                return addResult;
            }
            var kit = new kitItem();
            kit.name = obj.name;
            kit.place = obj.place;
            kit.from = obj.from;
            kit.kitKey = kit.from;
            var index = this.kit_list_size;
            this.kit_list_array.put(index, kit.from);
            this.kit_list.put(kit.from, kit);
            this.kit_list_size += 1;
            addResult.success = true;
            addResult.message = "You successfully added a kit!";
            return addResult;
        }
    },
     //获取对象
    query_kit_by_key: function(key) {
        var result = {
            success: false,
            type: "kit_info",
            kit: ""
        };
        key = key.trim();
        if (key === "") {
            result.success = false;
            result.kit = "";
            return result;
        }
        var kit = this.kit_list.get(key);
        if (kit) {
            result.success = true;
            result.kit = kit;
        } else {
            result.success = false;
            result.kit = "";
        }
        return result;
    },
      //获取对象列表
    query_hot_kit: function(num) {
        var result = {
            success: false,
            type: "kit_list_like",
            data: ""
        };
        var length = this.goodItem_list_size;
        var list = this.goodItem_list;
        var like;
        if (length <= num) {
            for (var i = 0; i < length; i++) {
                like = goodItem_list.get(i);
                result.data.push(kit);
            }
        } else {
            //排序选出前num条
            var j;
            var k;
            var flag = length;
            while (flag > 0) {
                k = flag; //k 来记录遍历的尾边界
                flag = 0;
                for (j = 1; j < k; j++) {
                    if (list[j - 1] > list[j]) { //前面的数字大于后面的数字就交换
                        //交换a[j-1]和a[j]
                        var temp;
                        temp = list[j - 1];
                        list[j - 1] = list[j];
                        list[j] = temp;

                        //表示交换过数据;
                        flag = j; //记录最新的尾边界.
                    }
                }

            }
            var kit;
            for (var i = 0; i < num; i++) {
                kit = this.kit_list.get(list[length - i].key);
                result.data.push(kit);
            }
        }

        if (result.data === "" || result.data.length < 1) {
            result.success = false;
        } else {
            result.success = true;
        }
        return result;
    },

};

// window.kitSys = kitSys;
module.exports = kitSys;
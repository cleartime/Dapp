'use strict';

var SampleContract = function () {
   LocalContractStorage.defineMapProperty(this, "category");
};

SampleContract.prototype = {
    init: function () {
    },
    set: function (name, value) {
      this.category.set(name,value);
        LocalContractStorage.set(name, value);
        // 存储字符串
        LocalContractStorage.set("name",name);
        // 存储数字
        LocalContractStorage.set("value", value);
        // 存储对象
        LocalContractStorage.set("obj", {name:name,value:value});
    },
    getname: function(name){
        return LocalContractStorage.set(name);
    },
    getvalue: function(){
        return LocalContractStorage.get("value");
    },
    get: function (name) {
      var obj = this.category.get(name)
        return obj
    },
    delname: function (name) {
      var obj = this.category.del(name)

        var result = LocalContractStorage.delete(name);
        console.log("del result:"+result)
        return obj
    },
    delvalue: function () {
        var result = LocalContractStorage.delete("value");
        console.log("del result:"+result)
        return result
    },
    del: function () {
        var result = LocalContractStorage.delete("obj");
        console.log("del result:"+result)
        return result
    }
};

module.exports = SampleContract;
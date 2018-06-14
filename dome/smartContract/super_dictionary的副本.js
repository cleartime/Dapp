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
    set(data){
        var index = this.size;
        this.arrayMap.set(index, data);
        this.size +=1;
        return data;
    },
    updata(index, data){
        this.arrayMap.set(new BigNumber(index), data);
    },
    get(star, end){
        if(!end){
            return this.getOne(star);
        }
        var result =[];
        var number = end-star;
          if(number > this.size){
            end = this.size;
          }
          for(var i=star;i<end;i++){
            result.push(this.arrayMap.get(i))
          }
          return result
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
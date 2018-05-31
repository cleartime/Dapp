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
<<<<<<< HEAD
    getname: function(name){
        return LocalContractStorage.set(name);
    },
    getvalue: function(){
        return LocalContractStorage.get("value");
=======
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
>>>>>>> 77a4a32c341ac3ffad7df273b262777ee380ef90
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
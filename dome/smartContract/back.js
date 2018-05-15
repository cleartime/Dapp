"use strict";

var SampleContract = function () {
   LocalContractStorage.defineMapProperty(this, "arrayMap");
   LocalContractStorage.defineMapProperty(this, "dataMap");
   LocalContractStorage.defineProperty(this, "size");
};


SampleContract.prototype = {
    init: function () {
        this.size = 0;
    },
    test: function(option){
        var index = this.size;
        this.arrayMap.set(index, option);
        this.size +=1;
    },
    getTestOne: function(){
        return this.darrayMapata.get(0);
    },
    testAll(star, end){
        var result =[];
        var number = end-star;
        if(number > this.size){
          end = this.size;
        }
          for(var i=0;i<end;i++){
            result.push(this.arrayMap.get(i))
          }
          return result
    },
    set: function (key, value) {
        if(this.get(key)) return;
        var index = this.size;
        this.arrayMap.set(index, key);
        this.dataMap.set(key, value);
        this.size +=1;
    },

    get: function (key) {
        return this.dataMap.get(key);
    },

    len:function(){
      return this.size;
    },
    arrayMap: function(){
        return this.arrayMap
    },
    dataMap: function(){
        return this.arrayMap
    },
    getOne: function(){
        var result  = "";
        var i=0;
        var key = this.arrayMap.get(i);
        var object = this.dataMap.get(key);
        return  {[key]:object,};
    },
     getLast: function(){
        var i=this.size-1;
        var key = this.arrayMap.get(i);
            var object = this.dataMap.get(key);
        return  {
                    key:key,
                    value: object
                };

    },
    forEach: function(star, end){
        var _star = parseInt(star);
        var _end = parseInt(end);
       
        var number = _end-_star;
        if(number > this.size){
          _end = this.size;
        }
        var result  = [];
        for(var i=_star;i<_end;i++){
            var key = this.arrayMap.get(i);
            var object = this.dataMap.get(key);
            if(key !== 'null' && object !== 'null'){
                result.push({
                    key:key,
                    value: object
                })
                // result += '{"index":"'+i+'","key":"'+ key + '","value":"' +object+'"},';
            }
        }
        return result
    },
    forEachAll: function(){
        var result  = [];
        for(var i=0;i<this.size;i++){
            var key = this.arrayMap.get(i);
            var object = this.dataMap.get(key);
            if(key !== 'null' && object !== 'null'){
                result.push({
                    key:key,
                    value: object
                })
                // result += '{"index":"'+i+'","key":"'+ key + '","value":"' +object+'"},';
            }
        }
        return result;
    }
};

module.exports = SampleContract;
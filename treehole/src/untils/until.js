"use strict";

let nebulas = require("nebulas");
let Account = nebulas.Account;
let neb = new nebulas.Neb();
neb.setRequest(new nebulas.HttpRequest("https://Mainnet.nebulas.io"));
let from = Account.NewAccount().getAddressString();

let NebPay = require("nebpay"); //https://github.com/nebulasio/nebPay
let nebPay = new NebPay();

class Api {
  constructor(dappAddress) {
    this.dappAddress = dappAddress;
  }
  search(title) {

    return new Promise((resole, reject) => {
      this.getAll().then((r = []) => {
        if (!title) {
          r = r.filter(t => t && t.title)
        } else {
          r = r.filter(t => t && t.title === title)
        }
        resole(r)
      })
    })
  }
  set(obj) {
    let to = this.dappAddress;
    let value = "0";
    let callFunction = "set"
    let callArgs = "[" + JSON.stringify(obj) + "]"
    // var callArgs = "[\"" + JSON.stringify(str) + "\"]"
    let cbPush = this.res;
    return Promise.resolve(nebPay.call(to, value, callFunction, callArgs, { //使用nebpay的call接口去调用合约,
      listener: cbPush //设置listener, 处理交易返回信息
    }));
  }
  //  get(start,end, filter){
  //     console.log('我untile得对象是:')
  //     console.log(filter)
  //  	var value = "0";
  //     var nonce = "0"
  //     var gas_price = "1000000"
  //     var gas_limit = "2000000"
  //     var callFunction = "get";
  //     var callArgs = "[\"" + start + "\",\"" + end + "\"]"
  //     var contract = {
  //         "function": callFunction,
  //         "args": callArgs
  //     }

  //    return new Promise((resole,reject)=>{
  // 		neb.api.call(from, this.dappAddress, value, nonce, gas_price, gas_limit, contract).then( (resp) =>{
  //             if(!resp.result) {
  //                 resole([])
  //                 return
  //             }
  //             let res = JSON.parse(resp.result);
  //             if(filter){
  //                 let {key, value} = filter;
  //                 console.log('这个是key,value：')
  //                 console.log(key,value)
  //                 res = res.filter(t => t && t[key]===value)
  //             }
  //             console.log('返回查询结果如下：')
  //             console.log(res)
  //             resole(res)
  //         }).catch( (err)=> {
  //             reject(err.message)
  //         })
  //    })
  // }
  len(filter) {
    var value = "0";
    var nonce = "0"
    var gas_price = "1000000"
    var gas_limit = "2000000"
    var callFunction = "getAll";
    var callArgs = "[]"; //in the form of ["args"]
    var contract = {
      "function": callFunction,
      "args": callArgs
    }

    return new Promise((resole, reject) => {
      neb.api.call(from, this.dappAddress, value, nonce, gas_price, gas_limit, contract).then((res) => {
        if (!res.result) {
          resole(0)
          return
        }
        console.log('返回全部结果如下：')
        res = JSON.parse(res.result);
        console.log(res)

        if (filter) {
          let {
            key,
            value
          } = filter;
          res = res.filter(t => t && t[key] === value)
        }
        resole(res.length)
      }).catch((err) => {
        reject(err.message)
      })
    })
  }
  // len(){
  // 	var value = "0";
  //     var nonce = "0"
  //     var gas_price = "1000000"
  //     var gas_limit = "2000000"
  //     var callFunction = "len";
  //     var callArgs = "[]"; //in the form of ["args"]
  //     var contract = {
  //         "function": callFunction,
  //         "args": callArgs
  //     }

  //    return new Promise((resole,reject)=>{
  // 		neb.api.call(from, this.dappAddress, value, nonce, gas_price, gas_limit, contract).then( (resp) =>{
  // 		            resole(resp.result)
  // 		        }).catch( (err)=> {
  // 		            reject(err.message)
  // 		        })
  //    })
  // }
  get(start, end, filter) {
    return this.getAll(filter).then(res => {
      if (filter) {
        let {
          key,
          value
        } = filter;
        res = res.filter(t => t && t[key] === value).filter((t,index)=>index >= start && index < end)
      }
      console.log('get获取得结果')
      console.log(res)
      return res
    })
  }
  getAll(filter) {
    var value = "0";
    var nonce = "0"
    var gas_price = "1000000"
    var gas_limit = "2000000"
    var callFunction = "getAll";
    var callArgs = "[]"; //in the form of ["args"]
    var contract = {
      "function": callFunction,
      "args": callArgs
    }

    return new Promise((resole, reject) => {
      neb.api.call(from, this.dappAddress, value, nonce, gas_price, gas_limit, contract).then((res) => {
        if (!res.result) {
          resole([])
          return
        }
        console.log('返回全部结果如下：')
        res = JSON.parse(res.result);
        console.log(res)

        if (filter) {
          let {
            key,
            value
          } = filter;
          res = res.filter(t => t && t[key] === value)
        }
        resole(res)
      }).catch((err) => {
        reject(err.message)
      })
    })
  }
  res(resp) {
    console.log(JSON.parse(resp))
  }
  query(serialNumber) {
    return new Promise((resole, reject) => {
      nebPay.queryPayInfo(serialNumber) //search transaction result from server (result upload to server by app)
        .then(function (resp) {
          // console.log("交易查询得结果 " + resp) //resp is a JSON string
          var respObject = JSON.parse(resp)
          resole(respObject)

        })
        .catch(function (err) {
          reject(err.message)
        });
    })

  }
}

export default Api

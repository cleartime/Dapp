"use strict";

let nebulas = require("nebulas");
let Account = nebulas.Account;
let neb = new nebulas.Neb();
// neb.setRequest(new nebulas.HttpRequest("https://testnet.nebulas.io"));
neb.setRequest(new nebulas.HttpRequest("https://Mainnet.nebulas.io"));
let from = Account.NewAccount().getAddressString();
let NebPay = require("nebpay"); //https://github.com/nebulasio/nebPay
let nebPay = new NebPay();
class Api {
  constructor(dappAddress) {
    // n1aQzxuEARSZnrwnmwrV7WScbfgsgq6DNGh  pro5626
    // n1ZJmF8TgaRLUjGnWbQB75mSa7yc4W8qt3x   pro1047
    this.dappAddress = dappAddress;
    // n1KSbe4BdBSDxBZBp3ruF3H5pn6TWgMA4VV   test2
    // n1YnxCTq2PPzTHH2d2MXTqBoLcg1Uj4851P
    // n1Fxu7qxPhXVsGgtKLtHgHfp7cgsfjyAyNH
    // n1Xrz4P8RScKffEL8sjRd9QPDPjfCPtWvbX    test2
  }
  login(obj) {
    let to = this.dappAddress;
    let value = "0";
    let callFunction = "users";
    var arg1 = 'a';
    var arg2 = 'b';
    var callArgs = JSON.stringify([obj]);
    // let callArgs = "[" + JSON.stringify(obj) + "]"
    // var callArgs = "[\"" + JSON.stringify(str) + "\"]"
    let cbPush = this.res;
    return Promise.resolve(nebPay.call(to, value, callFunction, callArgs, { //使用nebpay的call接口去调用合约,
      listener: cbPush //设置listener, 处理交易返回信息
    }));
  }
  set(f, obj) {
    let to = this.dappAddress;
    let value = "0";
    let callFunction = "set";
    var callArgs = JSON.stringify([f, obj]);
    // let callArgs = "[" + JSON.stringify(obj) + "]"
    // var callArgs = "[\"" + JSON.stringify(str) + "\"]"
    let cbPush = this.res;
    return Promise.resolve(nebPay.call(to, value, callFunction, callArgs, { //使用nebpay的call接口去调用合约,
      listener: cbPush //设置listener, 处理交易返回信息
    }));
  }
  del() {
    let to = this.dappAddress;
    let value = "0";
    let callFunction = "del";
    var callArgs = JSON.stringify([]);
    // let callArgs = "[" + JSON.stringify(obj) + "]"
    // var callArgs = "[\"" + JSON.stringify(str) + "\"]"
    let cbPush = this.res;
    return Promise.resolve(nebPay.call(to, value, callFunction, callArgs, { //使用nebpay的call接口去调用合约,
      listener: cbPush //设置listener, 处理交易返回信息
    }));
  }
  get(f) {
    var value = "0";
    var nonce = "0"
    var arg = 'a'
    var gas_price = "1000000"
    var gas_limit = "2000000"
    var callFunction = "get";
    var callArgs = JSON.stringify([f]);
    var contract = {
      "function": callFunction,
      "args": callArgs
    }

    return new Promise((resole, reject) => {
      neb.api.call(from, this.dappAddress, value, nonce, gas_price, gas_limit, contract).then((res) => {
        res = JSON.parse(res.result);
        resole(res)
      }).catch((err) => {
        reject(err.message)
      })
    })
  }
  getuser(f) {
    var value = "0";
    var nonce = "0"
    var arg = 'a'
    var gas_price = "1000000"
    var gas_limit = "2000000"
    var callFunction = "getusers";
    var callArgs = JSON.stringify([f]);
    var contract = {
      "function": callFunction,
      "args": callArgs
    }

    return new Promise((resole, reject) => {
      neb.api.call(from, this.dappAddress, value, nonce, gas_price, gas_limit, contract).then((res) => {
        res = JSON.parse(res.result);
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
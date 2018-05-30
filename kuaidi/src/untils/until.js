"use strict";

document.addEventListener("DOMContentLoaded", function () {
  console.log("web page loaded...")
  setTimeout(checkNebpay, 100);
});

function checkNebpay() {

  //to check if the extension is installed
  //if the extension is installed, var "webExtensionWallet" will be injected in to web page
  if (typeof (webExtensionWallet) === "undefined") {
    alert("Extension wallet is not installed, please install it first.")
  } else {}
}
let nebulas = require("nebulas"),
  Account = nebulas.Account,
  neb = new nebulas.Neb();
neb.setRequest(new nebulas.HttpRequest("https://testnet.nebulas.io"));
let from = Account.NewAccount().getAddressString();

let NebPay = require("nebpay"); //https://github.com/nebulasio/nebPay
let nebPay = new NebPay();
let funcIntervalQuery
var serialNumber
class until {
  constructor(dappAddress) {
    this.dappAddress = dappAddress;
  }
  set(obj) {
    let to = this.dappAddress;
    let value = "0";
    let callFunction = "set";
    obj.switch = '1';
    var callArgs = JSON.stringify([obj]);
    // let callArgs = "[" + JSON.stringify(obj) + "]"
    // var callArgs = "[\"" + JSON.stringify(str) + "\"]"
    let cbPush = this.res;
    return Promise.resolve(nebPay.call(to, value, callFunction, callArgs, { //使用nebpay的call接口去调用合约,
      listener: cbPush //设置listener, 处理交易返回信息
    }));
  }
  updata(obj, key) {
    this.isOnly(obj, key).then(index => {
      let to = this.dappAddress;
      let value = "0";
      obj.switch = '1';
      let callFunction = "updata"
      var callArgs = JSON.stringify([index, obj]);
      // let callArgs = "[" + JSON.stringify(obj) + "]"
      // var callArgs = "[\"" + JSON.stringify(str) + "\"]"
      let cbPush = this.res;
      return Promise.resolve(nebPay.call(to, value, callFunction, callArgs, { //使用nebpay的call接口去调用合约,
        listener: cbPush //设置listener, 处理交易返回信息
      }));
    }).catch(e => {
      alert('不能修改')
    })
  }
  get(obj) {
    var value = "0";
    var nonce = "0"
    var gas_price = "1000000"
    var gas_limit = "2000000"
    var callFunction = "get";
    var callArgs = JSON.stringify([obj.title]);
    var contract = {
      "function": callFunction,
      "args": callArgs
    }

    return new Promise((resole, reject) => {
      neb.api.call(from, this.dappAddress, value, nonce, gas_price, gas_limit, contract).then((resp) => {
        resole(JSON.parse(resp.result))
      }).catch((err) => {
        reject(err.message)
      })
    })
  }
  del(obj, key) {
    this.isOnly(obj, key).then(index => {
      let to = this.dappAddress;
      let value = "0";
      let callFunction = "updata";
      obj.switch = '0';
      var callArgs = JSON.stringify([index, obj]);
      // let callArgs = "[" + JSON.stringify(obj) + "]"
      // var callArgs = "[\"" + JSON.stringify(str) + "\"]"
      let cbPush = this.res;
      return Promise.resolve(nebPay.call(to, value, callFunction, callArgs, { //使用nebpay的call接口去调用合约,
        listener: cbPush //设置listener, 处理交易返回信息
      }));
    }).catch(e => {
      alert('不能删除')
    })
  }
  len() {
    var value = "0";
    var nonce = "0"
    var gas_price = "1000000"
    var gas_limit = "2000000"
    var callFunction = "len";
    var callArgs = "[]"; //in the form of ["args"]
    var contract = {
      "function": callFunction,
      "args": callArgs
    }

    return new Promise((resole, reject) => {
      neb.api.call(from, this.dappAddress, value, nonce, gas_price, gas_limit, contract).then((resp) => {
        resole(resp.result)
      }).catch((err) => {
        reject(err.message)
      })
    })
  }
  isOnly(obj, key) {
    let i = 0,
      index = -1;
    return new Promise((resole, reject) => {
      this.getAll(1).then(r => {
        let len = r.length;
        for (; i < len; i++) {
          if (obj[key] === r[i][key]) {
            index = i;
            break
          }
        }
        if (index === -1) {
          reject()
        } else {
          resole(index)
        }
      })
    })

  }
  getAll(type) {
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
      neb.api.call(from, this.dappAddress, value, nonce, gas_price, gas_limit, contract).then((resp) => {
        let res = JSON.parse(resp.result);
        let arr = [];
        console.log('返回全部结果如下：')
        if (type) {
          console.log(res)
          resole(res)
          return
        }
        for (let i = 0, len = res.length; i < len; i++) {
          let t = res[i];
          if (t.switch && !!Number(t.switch)) {
            delete t.switch
            arr.push(t)
          }
        }
        console.log(arr)
        resole(arr)
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
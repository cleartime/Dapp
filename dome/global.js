var nebAddress ;
var  nebState;
var nebulas = require("nebulas"),
    Account = nebulas.Account,
    neb = new nebulas.Neb();
    NebPay = require("nebpay");     
    nebPay = new NebPay();
var serialNumber;

var callbackUrl = NebPay.config.mainnetUrl;


var nebConfigArr = {
    mainnet: {
        name: "主网",
        contractAddress: "n1qQhDzswApj5SmRrNQBNd6nSjqaaqmmmZi",
        txhash: "04222aa816c36a7895efd59256f4f2844fae253064ebc40c155266e3d6cc5220",
        host: "https://mainnet.nebulas.io",
        payhost: "https://pay.nebulas.io/api/mainnet/pay"
    },
    testnet: {
        name: "测试网",
        contractAddress: "n1iw6b9KtKsGaeKPi7GEyJDRLibpw4jf8f9",
        txhash: "6c9ebc2b9d1e5c6b035b05ba6448911d17599b2026c9d0bd504c372b5f8fe977",
        host: "https://testnet.nebulas.io",
        payhost: "https://pay.nebulas.io/api/pay"
    },
    localhost: {
        name: "开发网",
        contractAddress: "n1jd929vjYX7fhZMGLFEWP1H9N5cBkgFjQd",
        txhash: "6c9ebc2b9d1e5c6b035b05ba6448911d17599b2026c9d0bd504c372b5f8fe977",
        host: "http://172.18.255.36:8685",
        payhost: "http://172.18.255.36/api/pay"
    }
};
var nebNowTime = Math.round((new Date()).getTime() / 1000);
nebConfig = nebConfigArr["mainnet"];
neb.setRequest(new nebulas.HttpRequest(nebConfig["host"]));
var dinosaurRaReArr = {
    "Allosaurus": "Epic",
    "Apatosaurus": "elite",
    "Brachiosaurus": "elite",
    "Compsognathus": "Epic",
    "Corythosaurus": "Rare",
    "Dilophosaurus": "Epic",
    "Euoplocephalus": "elite",
    "Gigantspinosaurus": "Rare",
    "Lambeosaurus": "Common",
    "monolophosaurus": "Rare",
    "Ouranosaurus": "Rare",
    "Parasaurolophus": "Common",
    "plesiosaurus": "elite",
    "Saurolophus": "Common",
    "Stegosaurus": "Rare",
    "Styracosaurus": "Rare",
    "Suchomimus": "Rare",
    "Triceratops": "elite",
    "Tyrannosaurus Rex": "Legendary",
    "Velociraptor": "Legendary",
}

var weightarr = {
     "Allosaurus": "small",
    "Apatosaurus": "big",
    "Brachiosaurus": "big",
    "Compsognathus": "small",
    "Corythosaurus": "small",
    "Dilophosaurus": "small",
    "Euoplocephalus": "middle",
    "Gigantspinosaurus": "small",
    "Lambeosaurus": "big",
    "monolophosaurus": "small",
    "Ouranosaurus": "middle",
    "Parasaurolophus": "small",
    "plesiosaurus": "big",
    "Saurolophus": "big",
    "Stegosaurus": "middle",
    "Styracosaurus": "middle",
    "Suchomimus": "small",
    "Triceratops": "middle",
    "Tyrannosaurus Rex": "middle",
    "Velociraptor": "small",
}
var dinosaurCdArr = [
    12 * 3600,
    11 * 3600,
    10 * 3600,
    9 * 3600,
    8 * 3600,
    7 * 3600,
    6 * 3600,
    5 * 3600,
    4 * 3600,
    3 * 3600,
    120 * 60,
    90 * 60,
    75 * 60,
    60 * 60,
    50 * 60,
    40 * 60,
    30 * 60,
    20 * 60,
    10 * 60,
    5 * 60,
]

function IsPC() {  
               var userAgentInfo = navigator.userAgent;  
               var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");  
               var flag = true;  
               for (var v = 0; v < Agents.length; v++) {  
                   if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }  
               }  
               return flag;  
}      
var getParameterByName = function (name) {
    var url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}


var nebApiCall = function(callFunction, callArgs, callback) {
     var from = Account.NewAccount().getAddressString();
    var value = "0";
    var nonce = "0"
    var gas_price = "1000000"
    var gas_limit = "2000000"
    var contract = {
        "function": callFunction,
        "args": JSON.stringify(callArgs)
    }
    neb.api.call(from,nebConfig["contractAddress"],value,nonce,gas_price,gas_limit,contract).then(function (resp) {
        var data = null;
        try{
            data = JSON.parse(resp.result);
        } catch(e) {}
        callback(data);
    }).catch(function (err) {
        console.log("error:" + err.message)
    })
}

function onrefreshClick(cb) {
    nebPay.queryPayInfo(serialNumber,{callback: callbackUrl})   //search transaction result from server (result upload to server by app)
    .then(function (resp) {
        resp = JSON.parse(resp)
        if(resp instanceof Object){
            if(resp.msg === 'success'){
                
                cb && cb(resp.data)
            }
        }
        
    })
    .catch(function (err) {

        console.log(err);

    });
}

var nebPayCall = (function() {
    var txhash;
    var intervalQuery;
    var funcIntervalQuery = function(successCb) {
        neb.api.getTransactionReceipt({hash: txhash}).then(function(resp) {
            console.log("tx result: " + JSON.stringify(resp))
            if (resp.status == 1) {
                clearInterval(intervalQuery)
                successCb(resp)
            }
        }).catch(function (err) {
            console.log(err);
        });
    }
    return function(callFunction, callArgs, money, cb, successCb,login) {
        var to = nebConfig["contractAddress"];
        var value = money;
        var callFunction = callFunction
        var callArgs = JSON.stringify(callArgs)


        serialNumber = nebPay.call(to, value, callFunction, callArgs, {
            qrcode: {

                showQRCode: false

            },
            goods: {
                name: "test",
                desc: "test goods"
            },
            callback:callbackUrl,
            listener: function(resp) {
                if(!IsPC()){
                    return
                }
                if (resp.txhash) {
                    txhash = resp.txhash;
                    cb(txhash)
                    intervalQuery = setInterval(function () {
                        funcIntervalQuery(successCb);
                    }, 5000);
                }
            }
        });

        var timer = setInterval( () => {
            if(IsPC()){
                return
            }
            onrefreshClick(onrefreshClickcb);   //search transaction result from server (result upload to server by app)
            function onrefreshClickcb(data){
                if (data instanceof Object){
                    clearInterval(timer);

                    var nebAddress_from_app = data.from

                    if(!IsPC()){  //mobile reserve address

                        if(nebAddress_from_app != localStorage.getItem('nebAddress')){

                            alert('Your current NAS address already switched automatically to nano wallet address')

                        }

                        localStorage.setItem('nebAddress',nebAddress_from_app)
                        
                        $('#nas-address').html(nebAddress_from_app)

                    }
                    
                    cb(data.hash)

                    intervalQuery = setInterval(function () {
                        funcIntervalQuery(successCb);
                    }, 5000);
                }
               
            }
        },3000);
    }
})()

var sell = function (id) {
    dialog_sold.open()
    $('#dialog_sold a.button').off().on('click',function(){
      var sold_money = $('#sold_money').val();
      sold_money = Number(sold_money);
      if (sold_money <= 0) {

            dialog_sold.close();
            dialog_message.open();
            dialog_message.setContent('<p class="_mt25">The price of dinosaur must be numberic and can not be zero.</p>');
            return false;

      }
      nebPayCall("setDragonOnMarket", [id, sold_money], 0, function(hash) {
        dialog_sold.close();
        dialog_message.open();
        dialog_message.setContent('<p class="_mt25">Submit success, please wait for the result</p>');
      }, function() {
        dialog_sold.close()
        dialog_message.close();
      })
    })
}
var attack = function (defender_id) {
    dialog_attack.open()
    nebApiCall("getSelfDragon", [nebAddress], function(my_list) {
        console.log(JSON.stringify(my_list))
        var id_list = [];
        $.each(my_list, function(k, row) {
          if (typeof row == 'object') id_list.push(k)
        })
        id_list = id_list.reverse()
        if (!id_list.length) {
          dialog_attack.close()
          dialog_attack_no_dinosaur.open()
          return false
        }
        nebApiCall("getDragonIdList", [id_list], function(data) {
          console.log(JSON.stringify(data))
          var html = '';
          $.each(id_list, function(k, id) {
            if (data.data[id]) {
              data.data[id]["id"] = id;
              html += getDialogDinosaurItem(data.data[id])
            }
          })
          $('#dialog_dinosaur_list').html(html);
          $('#dialog_dinosaur_list a.attack_send').click(function(){
            var attacker_id = $(this).data('id');
            nebApiCall('getFightLog', [attacker_id], function(my_log) {
              console.log(JSON.stringify(my_log))
              var log_id_list = [];
              if (my_log && my_log.log) {
                $.each(my_log.log, function(k, row) {
                  if (typeof row == 'string') log_id_list.push(k)
                })
              }
              log_id_list = log_id_list.reverse();
              var max_id = -1;
              if (log_id_list.length) max_id = log_id_list[0]
              nebPayCall("fight", [attacker_id, defender_id], 0, function(hash) {
                console.log("max_id", max_id);
                location.href = 'attack_pending.html?attacker_id=' + attacker_id + '&defender_id=' + defender_id + '&hash=' + hash + '&max_id=' + max_id;
              }, function(){})
            })
          })
        })
    })
}

$(function() {


    if(!IsPC()){ //mobile
        $('#getExtension').html('Download NAS nano  ').attr('href','https://nano.nebulas.io/index_cn.html')


        nebAddress = localStorage.getItem('nebAddress') || nebAddress

        $('body').append(`  <ul id="slide-out" class="side-nav">
                                <li><div class="userView" style="height:150px;text-align:center;">
                                  <div class="background" style="top:50%;transform:translateY(-50%);">
                                     <img src="assets/pic/logo.png" style="width:50%;">
                                  </div>
                                  <!-- <a href="#!user"><img class="circle" src="assets/pic/logo.png"></a> -->
                                 
                                </div></li>
                                <li  style="color:#999;font-size:12px;padding-left:16px;"  onclick="changeAddress_mobile()"><span id="nas-address" class="email" >${nebAddress || 'you need to login'}</span></li>
                                <li><div class="divider"></div></li>
                                <li><a class="waves-effect" href="index.html">Home</a></li>
                                <li><a class="waves-effect" href="market.html">Market</a></li>
                                <li><a class="waves-effect" href="my_dinosaur_list.html">My Dinosaur</a></li>
                                <li><a class="waves-effect" href="hatch.html">Hatch</a></li>
                                <li><a class="waves-effect" href="attack.html">Attack</a></li>
                                <li><a class="waves-effect" href="top.html">Top</a></li>
                                <li><a class="waves-effect" href="readme.html">How to play</a></li>
                              </ul>
                              <a href="#" data-activates="slide-out" class="button-collapse">
                                    <i class="material-icons"><img style="border-radius:50%;" height="40" src="assets/pic/menu.png" width="40"></i>
                              </a>
                                
                                <!-- 登陆 -->
                              <div id="modal1" class="modal">
                                <div class="modal-content">
                                    <div class="input-field col s6">
                                      <input placeholder="请输入您的nas地址" id="nas-address-input" type="text" class="validate">
                                      <label for="first_name">nas address</label>
                                    </div>
                                </div>
                                <div class="modal-footer">
                                  <a href="#!" onclick="login()"  class=" modal-action modal-close waves-effect waves-green btn-flat ">confirm</a>
                                </div>
                              </div>

                                <!-- 交易提示 -->
                              <div id="modal2" class="modal">
                                <div class="modal-content">
                                    <div class="input-field col s6" id="modal2-text">
                                        Your current NAS address already switched automatically to nano wallet address 
                                    </div>
                                </div>
                                <div class="modal-footer">
                                  <a href="#!"  class=" modal-action modal-close waves-effect waves-green btn-flat">confirm</a>
                                </div>
                              </div>
                              `)
        $('.button-collapse').sideNav({
              menuWidth: 300, // Default is 240
              edge: 'left', // Choose the horizontal origin
              closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
              draggable: true // Choose whether you can drag to open on touch screens
            }
        );
        $('.modal').modal();
        
        // if(!nebAddress){
        //     $('#modal2-text').text('')
        //     $('#modal2').modal('open')
        // }

         setTimeout(function() {
            // if (!nebAddress) {
            //     if (location.href.indexOf('index.html') == -1) {  
            //             location.href = 'index.html'
            //     }
                    
                
            // } else {
            //     if (location.href.indexOf('index.html') > -1 || location.href.indexOf('.html') == -1) {
            //         location.href = 'my_dinosaur_list.html'
            //     }
            // }
        }, 800)

    }else{

            window.postMessage({
                "target": "contentscript",
                "data": {},
                "method": "getAccount",
            }, "*");
            window.addEventListener('message', function (e) {

                if (e.data && e.data.data && e.data.data.account) {
                   nebAddress = e.data.data.account;
                   $('#profile_neb_address').html(nebAddress)
                }

            })

            setTimeout(function() {
                //no wallet return index
                if (!nebAddress) {

                    if (location.href.indexOf('index.html') == -1) {  
                            location.href = 'index.html'
                    }else{

                    }
                        
                    
                } else {
                    if (location.href.indexOf('index.html') > -1 || location.href.indexOf('.html') == -1) {
                        location.href = 'my_dinosaur_list.html'
                    }
                }
            }, 800)
    }
    setTimeout(function(){
         if (typeof start != 'undefined'){
            start()
            $('#profile_neb_address').html(nebAddress)
         }   
    },100);
})


function getQueryString(name){  //截取search
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)",'i');
        var str = window.location.href
        var r = str.substr(str.indexOf('?')+1).match(reg);
        if(r!=null)return  unescape(r[2]); return null;
    }


function formateDate(num){
    console.log(num);
    var date = new Date(parseInt(num+'000'))
    var MonthArr = ['January','February','March','April','May','June','July','August','September','October','November','December']
    var mon = MonthArr[date.getMonth()]
    var day = date.getDate()
    var year = date.getFullYear()
    console.log( mon+' '+day+','+year);
    return mon+' '+day+','+year + ' '+ date.getHours() +':'+ date.getMinutes()  +':'+ date.getSeconds()
}

function getColor(type){
    var obj = {
        common:  '#9b9b9b',
        elite:  '#58c46f',
        rare:  '#5c89da',
        epic  : '#ba7aeb',
        legendary:  '#fc9e4a'
    }
    return obj[type]
}
function getTypeBg(type){

    var obj = {
        common:  '#9b9b9b',
        elite:  '#58c46f',
        rare:  '#5c89da',
        epic  : '#ba7aeb',
        legendary:  '#fc9e4a'
    }

    return obj[type]
}

// setInterval(() =>{console.log(nebAddress)},500);



function login(){
     var NewNasAddress = $('#nas-address-input').val()
     localStorage.setItem('nebAddress',NewNasAddress)
     window.location.href = 'my_dinosaur_list.html'
}

function changeAddress_mobile(){
    $('#modal1').modal('open');
}

function setDragonOffMarket(id){
    var name = confirm('Take it off the market？')
    if(name){
        nebPayCall("setDragonOffMarket", [id],0,function(hash) {
        dialog_sold.close();
        dialog_message.open();
        dialog_message.setContent('<p class="_mt25">Cancel successful, please wait 30s </p>');
      }, function() {
        dialog_sold.close()
        dialog_message.close();
      })
    }
    
}
function buy(id,price) {
     nebPayCall("tradeDragon", [id], price, function(hash) {
              window.location.href='my_dinosaur_list.html';
    }, function(){})
}

// $(document).on('click',function(e){
//     console.log(e.target.classList)
//     console.log(Array.from(e.target.classList));
// })

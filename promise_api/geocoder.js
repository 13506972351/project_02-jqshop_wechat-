var QQMapWX=require('../config_location/qqmap-wx-jssdk.min');  //引入位置服务
var qqmapsdk=new QQMapWX({
  key:"TRFBZ-YPJLD-ELM4R-P7BOK-JVPKZ-JSFCI"   //运用key
})

//根据地址获得经纬度
export const geocoder=(shop_add_str)=>{
  return new Promise(function(resolve,reject){   //api接口异步发处理包,解决回调地狱
    // console.log('*',shop_add_str.add_str)
    qqmapsdk.geocoder({
      ...shop_add_str,
      address:shop_add_str.add_str,
      
      
      success:res=>{
        var lats=res.result.location.lat
        var lngs=res.result.location.lng
        // resolve([shop_add_str.add_str,res.result.location.lat,res.result.location.lng])  //成功后返回,返回多个值时要用数组
        resolve([shop_add_str.shop_names,res.result.location.lat,res.result.location.lng])  //成功后返回,返回多个值时要用数组
      },
      fail: (err) => {
        reject(err)  //失败后返回
      },
      complete: () => {
      }
    })
  })

}

var app = getApp()   //在页面中使用全局变量，要先声明
import {request} from "../../promise_api/request" 
Page({

  data: {
    vip_info:[],    //用户会员信息
    shop_car_info:[],   //用户购物车信息
    // indexs:-1,     //用于控制第几个物品单元，显示数量操作框
    total_money:0,
    
  },
  
  //验证是否登录过
  verification_login_key(){
    console.log('我是第一次加载')
    var keystr=wx.getStorageSync('jqshopmall_Cookie')
    // console.log('keys',keystr.data)
    var keys=keystr.data
    if(keys){
      
      // console.log('有')
      //向服务器发请求验证
      request({         //调用封装的request接口
        url:'select_key',   //用户登际接口
        method:'post',
        data:{
          key:keys,
        },
      })
      .then(res=>{
        if(res.data=='N'){   //没注册
          
        }else{
          // console.log('vip',res.data)
          var res_arry=res.data
          
          // console.log('ccc',res_arry)
          app.globalData.login_circuit_changer=true  //给全局变量验证登陆节流阀赋值
          app.globalData.vip_info=res_arry[0]   //将会员信息赋值给全局变量
          app.globalData.shop_car_info=res_arry[1]
          var car_arry=res_arry[1]
          for(var i=0;i<=car_arry.length-1;i++){
            car_arry[i].push(false)
            car_arry[i].push(true)
          }
          
          this.setData({
            vip_info:app.globalData.vip_info
          })
          this.setData({
            shop_car_info:car_arry
          })
          
        }
      })
    }else{
       //没注册
      this.setData({
        eject_login_info_switch:false//弹出注册框
      })
    }
    
  },
  //点击数量显示，弹出数量增减操作框
  show_operatr_count(e){
    let index_value=e.currentTarget.dataset.indexs
    // console.log(e.currentTarget.dataset.indexs) 
    var car_str1="shop_car_info"+"["+index_value+"]"+"["+14+"]"   //拼接data的路径名
    var car_str2="shop_car_info"+"["+index_value+"]"+"["+15+"]"
    // console.log(car_str1,car_str2)
    this.setData({
      [car_str1]:true,
      [car_str2]:false
    })
  },
  //点击增加数量
  add_counts(e){
    var index=e.currentTarget.dataset.indexs
    var count=this.data.shop_car_info[index][9]
    if(count<5){
      var data_id=e.currentTarget.dataset.id
      var data_str='shop_car_info'+'['+index+']'+'['+9+']'
      this.setData({
        [data_str]:count+1
      })
      //发起网络请求，修改数据库中的数量
      var counts=this.data.shop_car_info[index][9]
      request({         //调用封装的request接口
        url:'updata_shop_car',   //用户登际接口
        method:'post',
        data:{
          id:data_id,
          count:counts
        },
      })
      .then(res=>{
       // console.log(res.data)
       })
    }
  },
  //点击减少数量
  subtract_counts(e){
    var index=e.currentTarget.dataset.indexs
    var count=this.data.shop_car_info[index][9]
    if(count>1){
      var data_id=e.currentTarget.dataset.id
      var data_id=e.currentTarget.dataset.id
      var data_str='shop_car_info'+'['+index+']'+'['+9+']'

      this.setData({
        [data_str]:count-1
      })
      //发起网络请求，修改数据库中的数量
      var counts=this.data.shop_car_info[index][9]
      request({         //调用封装的request接口
        url:'updata_shop_car',   //用户登际接口
        method:'post',
        data:{
          id:data_id,
          count:counts
        },
      })
      .then(res=>{
        // console.log(res.data)
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if(!app.globalData.login_circuit_changer){  //如果加载过就不重新加载，否则重新加载
      this.verification_login_key()//验证是否登录过
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.verification_login_key()//验证是否登录过
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})
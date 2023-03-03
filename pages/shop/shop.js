// pages/shop/shop.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    vip_info:[],    //用户会员信息
    shop_car_info:[]   //用户购物车信息

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
          // console.log('www',app.globalData.vip_info)
          this.setData({
            vip_info:app.globalData.vip_info
          })
          this.setData({
            shop_car_info:app.globalData.shop_car_info
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

  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    
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
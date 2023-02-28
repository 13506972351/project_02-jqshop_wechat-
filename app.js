// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // console.log(this.globalData.server_ip)  //在app.js本地使用全局变量
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  globalData: {     //定义全局变量
    userInfo: null, 
    server_ip:"http://192.168.0.108:5000/",   //服务器ip地址
    lately_shopnames:'',
    login_circuit_changer:'',  //验证登陆节流阀
    vip_info:[],   //会员信息保存变量
    shop_car_info:[],    //购物车信息保存变量
    evaluate_info:[],   //评论信息保存变量
  }, 
}) 

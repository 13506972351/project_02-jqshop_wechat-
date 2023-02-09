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
    server_ip:"http://192.168.109.111:5000/"   //服务器ip地址
  }, 
}) 

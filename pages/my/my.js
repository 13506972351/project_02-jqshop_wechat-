var app = getApp()   //在页面中使用全局变量，要先声明
import {request} from "../../promise_api/request" 
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  //登录
  login(){
    const latly_shop=app.globalData.lately_shopnames
    
    // console.log('****',latly_shop)
    wx.login({
      success: (res) => {
        const code_str=res.code
        // console.log('one',res.code)
        if(code_str){
          request({                  //调用封装的request接口
            url:'wx_user_login',   //商品祥情页面接口地址
            method:'post',
            data:{
              code_str:code_str,
              shop_name:latly_shop
            },
          })
          .then(res=>{
            if(res){
              wx.setStorageSync('Cookie', res)
            }
            
          })
        }
        

      },
    })
  },
  //验证登录是否过期(以后用)
  verification_login(){
    wx.checkSession({
      success:function(res){
        console.log('处理有效期',res)
      },
      fail:function(res){
        console.log('过期',res)
      }
    })
  },
  
  //验证是否登录过
  verification_login_key(){
    var keystr=wx.getStorageSync('Cookie')
    if(keystr){
      console.log('keystr',keystr.data)
      //向服务器发请求验证




    }else{
      console.log('未登录')
      this.login()   //执行登录函数
    }
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    
    // this.verification_login()
    this.verification_login_key()
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
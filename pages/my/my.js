var app = getApp()   //在页面中使用全局变量，要先声明
import {request} from "../../promise_api/request" 
Page({
  data: {
    eject_login_info_switch:false,//控制弹出注册框控制
  },
  //登录
  login(nick,sex,tel,add){
    const latly_shop=app.globalData.lately_shopnames
    
    // console.log('****',latly_shop)
    wx.login({
      success: (res) => {
        const code_str=res.code
        // console.log('one',res.code)
        if(code_str){
          request({                  //调用封装的request接口
            url:'wx_user_login',   //用户登际接口
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
      this.setData({
        eject_login_info_switch:false//弹出注册框
      })
      
    }
    
  },
  formSubmit:function(e){  //点击注册按钮
    let input_arry=e.detail.value
    let nick=input_arry.nicks
    let sex=input_arry.sexs
    let tel=input_arry.tels
    let add=input_arry.adds
    if(nick&&sex&&tel&&add){
      this.login(nick,sex,tel,add)   //执行登录函数
    }else{
      wx.showModal({   //提示弹窗
        title: '提示',
        content: '请输入注册信息',
      })
    }
  },
  
  esc_fun(){    //点击取消按钮
    this.setData({
      eject_login_info_switch:true
    })
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    
    // this.verification_login()
    this.verification_login_key()//验证是否登录过
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
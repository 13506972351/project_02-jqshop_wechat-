var app = getApp()   //在页面中使用全局变量，要先声明
import {request} from "../../promise_api/request" 
Page({
  data: {
    eject_login_info_switch:true,//控制弹出注册框控制
    vip_info:[],    //用户会员信息
    shop_car_info:[]   //用户购物车信息
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
              shop_name:latly_shop,
              nicks:nick,
              sexs:sex,
              tels:tel,
              adds:add

            },
          })
          .then(res=>{
            if(res.data=='R'){
              console.log('注册情况',res.data)
              wx.showModal({   //提示弹窗
                title: '提示',
                content: '您已经注册过了，不能重复注册',
              })
            }else if(res.data=='B'){
              wx.showModal({   //提示弹窗
                title: '提示',
                content: '获取小程序注册id失败，请重试',
              })
            }else{
              wx.setStorageSync('jqshopmall_Cookie', res)
              wx.showModal({   //提示弹窗
                title: '提示',
                content: '注册成功',
              })
              this.setData({
                eject_login_info_switch:true//关闭注册框
              })
            }
            
          })
        }
      
      },
    })
  },
  //验证登录是否过期(以后用)
  // verification_login(){
  //   wx.checkSession({
  //     success:function(res){
  //       console.log('处理有效期',res)
  //     },
  //     fail:function(res){
  //       console.log('过期',res)
  //     }
  //   })
  // },
  
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
          this.setData({
            eject_login_info_switch:false//弹出注册框
          })
        }else{
          // console.log('vip',res.data)
          var res_arry=res.data
          
          // console.log('ccc',res_arry)
          app.globalData.login_circuit_changer=true  //给全局变量验证登陆节流阀赋值
          // for(var i=0;i<=res)
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
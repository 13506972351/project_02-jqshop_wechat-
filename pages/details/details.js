import {request} from "../../promise_api/request" 
import {getlocation} from "../../promise_api/getlocation"
import{geocoder}from "../../promise_api/geocoder"
Page({

  data: {
    transition_filename:[],  //过渡参数传用于存储get_details_url函数返回的图片url列表
    details:{},
    goods_info_list:[]
  },

  // 请求服务器商品祥情图片资料
  get_goods_specific_info(goods_number,shop_name){
    // console.log('***',goods_number)
    request({                  //调用封装的request接口
      url:'load_goods_specific',   //商品祥情页面接口地址
      method:'post',
      data:{
        goods_name:goods_number,
        shop_name:shop_name
      },
    })
    .then(res=>{
      console.log(res.data)
      this.setData({
        goods_info_list:res.data 
      })
    })
    
    // wx.request({
    
    //   // url: 'http://127.0.0.1:5000/detailed_imgurl',//到时改为服务器地址
    //   url: 'http://192.168.3.15:5000/detailed_imgurl',//到时改为服务器地址
    //   method:'get',
    //   data:{
    //     img_filename:details_url,
    //   },
    //   success:(res)=>{
    //     // console.log('res.data[0]:',res.data[0])
    //     // console.log('res.data[1]:',res.data[1])
    //     this.setData({
    //       transition_filename:res.data[1],
    //       details:res.data[0]
    //     })
    //   }
    // })
  },
  //点击底部店铺图标返回主页
  geto_home(){
    wx.switchTab({
      url: '/pages/home/home',
    })
  },
  //点击底部店铺图标返回主页
  geto_shop(){
    wx.switchTab({
      url: '/pages/shop/shop',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.get_goods_specific_info(options.goods_name,options.shop_name)  //主页面跳转后执行请求服务器函数，并传商品款号参数parameter为跳转时的？后面的名
    // console.log('ooo',options.shop_name)
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
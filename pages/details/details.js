// pages/details/details.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    transition_filename:[],  //过渡参数传用于存储get_details_url函数返回的图片url列表
    details:{}
  },

  // 请求服务器商品祥情图片资料
  get_details_url(details_url){
    wx.request({
      // url: 'http://127.0.0.1:5000/detailed_imgurl',//到时改为服务器地址
      url: 'http://192.168.3.15:5000/detailed_imgurl',//到时改为服务器地址
      method:'get',
      data:{
        img_filename:details_url,
      },
      success:(res)=>{
        // console.log('res.data[0]:',res.data[0])
        // console.log('res.data[1]:',res.data[1])
        this.setData({
          transition_filename:res.data[1],
          details:res.data[0]
        })
      }
    })
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
    this.get_details_url(options.details_url)  //主页面跳转后执行请求服务器函数，并传文件路径
    // console.log('options.details_url:',options.details_url)
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
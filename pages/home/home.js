// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //定义一个空数组，用于存放轮播图的路径
    imglist:[],   //轮播图url列表
    fashshow:false,  //服装明细渲染控制
    shoeshow:false,  //鞋子明细渲染控制
    coordshow:false,  //配件明细渲染控制
    //服装品类表
    fashlist:{
      big_boy_fash:'男大童服装',
      sim_boy_fash:'男小童服装',
      big_girl_fash:'女大童服装',
      sim_girl_fash:'女小童服装',
    },
    //鞋子品类表
    shoelist:{
      big_boy_shoe:'男大童鞋子',
      sim_boy_shoe:'男小童鞋子',
      big_girl_shoe:'女大童鞋子',
      sim_girl_shoe:'女小童鞋子',
    },
    //配件品类表
    coordlist:{
      socks:'袜子',
      basketball:'篮球',
      skates:'轮滑鞋'
    },
    fash_pows:true ,  //服装明细列表显示隐藏开关
    shoes_pows:true,   //鞋子明细列表显示隐藏开关
    coord_pows:true,   //配件明细列表显示隐藏开关
    vwid:''  ,     //label背景色控制
    transition_filename:[],  //过渡参数传用于存储Central_vision_get函数返回的图片url列表,格式：[{img_url:'',describe:'',price:''}]
    details_urlstr:'',

  },
  
// 服装明细点击隐藏显示事件
  clickfashclas(){
    if (this.data.fash_pows==true){
      this.setData({
        vwid:-1,
        fash_pows:false,
        shoes_pows:true,
        coord_pows:true
      })
    }else{
      this.setData({
        vwid:-1,
        fash_pows:true,
        shoes_pows:true,
        coord_pows:true
      })
    }
  },
  // 鞋子明细点击隐藏显示事件
  shoeclickclas(){
    if (this.data.shoes_pows==true){
      this.setData({
        vwid:-1,
        shoes_pows:false,
        fash_pows:true,
        coord_pows:true
      })
    }else{
      this.setData({
        vwid:-1,
        shoes_pows:true,
        fash_pows:true,
        coord_pows:true
      })
    }
  },
  // 配件明细点击隐藏显示事件
  coordclickclas(){
    if (this.data.coord_pows==true){
      this.setData({
        vwid:-1,
        coord_pows:false,
        shoes_pows:true,
        fash_pows:true
      })
    }else{
      this.setData({
        vwid:-1,
        coord_pows:true,
        shoes_pows:true,
        fash_pows:true
      })
    }
  },
  // 手指点击分类明细列表背景色变化事件
  changcolor(e){
    const imgfilename=e.currentTarget.dataset.name
    const pows=e.currentTarget.dataset.pows
    // console.log('pows:',pows)
    // console.log(imgfilename)
    this.setData({
      vwid: e.currentTarget.dataset.index,
      [pows]:true    //用pows代替ml中hidden的值属性
    })
    this.Central_vision_get(imgfilename)  //调用函数并传参（要找文件夹名称）

  },
  // 点击图片单元进入详情页面(跳转)
  click_details(e){
    const img_details_url=e.currentTarget.dataset.name
    // console.log('img_details_url',img_details_url)
    this.setData({
      details_urlstr:img_details_url
    })
    wx.navigateTo({
      url: '/pages/details/details?details_url='+this.data.details_urlstr,
    })
  },



  //发起网络数据请求获取轮播图url数组
  get(){
    wx.request({
      url: 'http://192.168.3.15:5000/get',//到时改为服务器地址
      // url: 'http://127.0.0.1:5000/get',   //到时改为服务器地址
      method:'get',
      success:(res)=>{
        this.setData({
          imglist:res.data
        })
      }
    })
  },
//发起网络数据请求获中央主视区url数组（及分类查询）
Central_vision_get(filename){  //filename为点击选中分类名传过来要找文件夹名的参数
  // console.log('filename:',filename),
  wx.request({
    url: 'http://192.168.3.15:5000/imgurl',   //到时改为服务器地址
    // url: 'http://127.0.0.1:5000/imgurl',   //到时改为服务器地址
      method:'get',
      data:{
        img_filename:filename,
      },
      
      success:(res)=>{
        // console.log(res.data)
        this.setData({
          // [filename]:res.data ,  //此处data属性为变量(列表属性)
          transition_filename:res.data 
          
        })
      }
  })
 },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
  this.get()
  this.Central_vision_get('img_all')  //img_all是全图的文件夹名称
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
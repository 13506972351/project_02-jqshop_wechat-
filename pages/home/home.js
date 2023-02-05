
var app = getApp()   //在页面中使用全局变量，要先声明
var QQMapWX=require('../../config_location/qqmap-wx-jssdk.min');  //引入位置服务
var qqmapsdk=new QQMapWX({
  key:"TRFBZ-YPJLD-ELM4R-P7BOK-JVPKZ-JSFCI"   //运用key
})
Page({

  data: {
    swiper_imgurl_list:[],   //轮播图url列表
    user_lat:0,   //用户纬度
    user_lon:0,    //用户经度
    lately_shop_name:'' , //最近店铺名
    shop_add:'',




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
  //发起网络数据请求获取轮播图url数组
  load_load_swiper_img(){
    const server_ip=app.globalData.server_ip
    wx.request({
      url: server_ip+'load_swiper_img',                 //服务器地址
      method:'get',
      success:(res)=>{
        this.setData({
          swiper_imgurl_list:res.data 
        })
      }
    })
  },
  //打开程序获得当前位置,查找距离最近店铺
  load_current_position(){
    var _this=this  //这是因为this作用域指向问题 ，success函数实际是一个闭包 ， 无法直接通过this来setData
    var _this2=this
    const server_ip=app.globalData.server_ip
    wx.getLocation({
      type:'wgs84',
      success (res){
        const latitude_str=res.latitude //纬度
        const longitude_str=res.longitude  //经度

        //根据经纬度获取用用户地址
        qqmapsdk.reverseGeocoder({
          location:{
            latitude:latitude_str,
            longitude:longitude_str,
          },
          success:function(res){
            var province=res.result.address_component.province;
            var city=res.result.address_component.city;
            var district=res.result.address_component.district;
            var street=res.result.address_component.street;
            var street_number=res.result.address_component.street_number;
            // console.log(province,city,district,street,street_number)
            //将用户地址传送到后台处理
            wx.request({
              url: server_ip+'calc_lately_location',
              method:'post',
              data:{
                provinces:JSON.stringify(province),  //将数据格式转为JSON
                citys:JSON.stringify(city),
                districts:JSON.stringify(district),
                streets:JSON.stringify(street),
                street_numbers:JSON.stringify(street_number),
                latitude_strs:latitude_str,
                longitude_strs:longitude_str

              },
              header: {
                'content-type': 'application/x-www-form-urlencoded'  //请求头类型
                },
              success:(res)=>{
                var  ress=res.data
                // console.log(ress)  //返回离用户最近的店铺
                // console.log(typeof ress==='string');
                if(typeof ress==='string'){   //如果是本省找到匹配最近店铺，返回的为string类型，否则为objet
                  _this.setData({
                    lately_shop_name:ress
                  })
                }else{
                  // console.log(ress.length)
                  //分别获取后台传来的地址的经纬度，并返回后台
                  var lai_long_list={}  //定义字典，用于存储经纬度
                  for(var i=0;i<=ress.length-1;i++){
                    // console.log('ress[i]:',ress[i])
                    var res1=_this2.select_shop_location(ress[i])
                    console.log('res1:',res1)
                  }
                }
              }
            })
            // wx.openLocation({    //根据经纬度打开地图
            //   latitude: latitude_str,
            //   longitude: longitude_str,
            //   address: 'address',
            //   name: 'name',
            //   scale: 0,
            //   success: (res) => {},
            //   fail: (res) => {},
            //   complete: (res) => {},
            // })
          }
        })
      }

    })
  },
  //根据店铺地址得到经纬度
  select_shop_location(shop_add_str){
    console.log('*',shop_add_str)
    var lats=0
    var lngs=0
    var than=this  //将data的this指向作变更
    qqmapsdk.geocoder({
      address:shop_add_str,
      success:res=>{
        
        lats=res.result.location.lat
        lngs=res.result.location.lng
        console.log(lats,lngs)
        
        //打开地图
        // wx.openLocation({
        //   latitude: lat,
        //   longitude: lng,
        //   address: 'address',
        //   name: 'name',
        //   scale: 0,
        //   success: (res) => {},
        //   fail: (res) => {},
        //   complete: (res) => {}
        // })
      }
    })
    // console.log(lats,lngs)
    return lats
  },
  
  //测试
  cs(str){
    var at=str
    console.log(at)
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
  // this.load_load_swiper_img()
  this.load_current_position()  //获得当前经纬度
  
  // this.Central_vision_get('img_all')  //img_all是全图的文件夹名称
  // this.cs('qqqqq')
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
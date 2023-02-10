import {request} from "../../promise_api/request" 
import {getlocation} from "../../promise_api/getlocation"
import{geocoder}from "../../promise_api/geocoder"
Page({

  data: {
    transition_filename:[],  //过渡参数传用于存储get_details_url函数返回的图片url列表
    details:{},
    goods_info_list:[],

    choice_color_size_frame_hidden:true,   //颜色尺码弹窗
    click_color_img_show_big_img:true,   //点击颜色显显大图hidden属性
    flog:true,   //点击颜色大图hidden属性控制
    choice_size_list:[],   //选中颜色显示尺码列表
    count_text:1,           //数字值
    //选中颜色尺码商品的所有信息
    goods_number:'',  //款号
    goods_class:'',  //商品分类
    goods_describe:'',//商品描述
    goods_saleprice:'',//商品现价
    goods_colorid:'',//商品颜色id
    goods_colorname:'',//商品颜色名
    goods_sizeid:'',//商品尺码id 
    goods_sizename:'',//商品尺码名
    goods_imgurl:'',//商品图片地址
    goods_shopname:'',//商品所在店铺名
    goods_shopadd:'',//商品所在地址（省+市）
    size_count:-1,   //用于按制点击尺码时显示选中边框的控制
    color_count:-1   //用于按制点击颜色时显示选中边框的控制
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
      // console.log(res.data)
      this.setData({
        goods_info_list:res.data 
      })
    })
  },
  click_choice_color_size(){    //点击选择颜色尺码
    this.setData({
      choice_color_size_frame_hidden:false,
      goods_imgurl:this.data.goods_info_list[0].img_url
    })
  },
  click_close_fun(){     //点击关闭按纽
    this.setData({
      choice_color_size_frame_hidden:true
    })
  }, 
  click_color_choice_list(e){   //点击选择颜色
    const goods_number=e.currentTarget.dataset.goodsnumber
    const goods_class=e.currentTarget.dataset.goodsclass
    const goods_describe=e.currentTarget.dataset.goodsdescribe
    const goods_saleprice=e.currentTarget.dataset.saleprice
    const goods_colorid=e.currentTarget.dataset.colorid
    const goods_colorname=e.currentTarget.dataset.colorname
    const goods_shop_name=e.currentTarget.dataset.shopname
    const goods_shop_add=e.currentTarget.dataset.shopadd
    const img_urls=e.currentTarget.dataset.imgurl
    //尺码处理
    const size_id_str=e.currentTarget.dataset.sizeid.slice(0,e.currentTarget.dataset.sizename.length-1) 
    const size_name_str=e.currentTarget.dataset.sizename.slice(0,e.currentTarget.dataset.sizename.length-1)     //去掉最后一个,字符
    const new_size_id_list=size_id_str.split(',')    //将尺码字符分割成列表
    const new_size_name_list=size_name_str.split(',')   //将尺码字符分割成列表
    //循环将尺码名和id添加到字典，再加到列表中
    var size_lists=[]
    for(var i=0;i<=new_size_id_list.length-1;i++){
      var size_dic={}
      size_dic['size_id']=new_size_id_list[i]
      size_dic['size_name']=new_size_name_list[i]
      size_lists.push(size_dic)
    }
    // console.log(size_lists)
    this.setData({
      goods_imgurl:img_urls,    //选中商品的图片地址
      goods_number:goods_number,  //款号
      goods_class:goods_class,  //商品分类
      goods_describe:goods_describe,//商品描述
      goods_saleprice:goods_saleprice,//商品现价
      goods_colorid:goods_colorid,//商品颜色id
      goods_colorname:goods_colorname,//商品颜色名
      goods_shopname:goods_shop_name,//商品所在店铺名
      goods_shopadd:goods_shop_add,//商品所在地址（省+市）
      choice_size_list:size_lists    //尺码列表
    })
    if(this.data.color_count==e.currentTarget.dataset.index){   //点击颜色按钮添加边框
      this.setData({
        color_count:-1
      })
    }else{
      this.setData({
        color_count:e.currentTarget.dataset.index
      })
    }
  },

  click_show_bigimg(){    //点击颜色显显大图hidden属性
    var flogs=this.data.flog
    console.log(flogs)
    if(flogs){
      this.setData({
        click_color_img_show_big_img:false,
        flog:false
      })
    }else{
      // console.log('else')
      this.setData({
        click_color_img_show_big_img:true,
        flog:true
      })
    }
    
  },
  click_bigimg_colse_show(){  //点大图关闭hidden属性
    this.setData({
      click_color_img_show_big_img:true,
      flog:true
    })
    
  },
  click_size_btn_fun(e){   //点击选择尺码按钮给data赋值\加边框
    const size_id_str=e.currentTarget.dataset.sizeid
    const size_name_str=e.currentTarget.dataset.sizename
    this.setData({
      goods_sizeid:size_id_str,//商品尺码id 
      goods_sizename:size_name_str,//商品尺码名
    })
    if(this.data.size_count==e.currentTarget.dataset.index){   //点击尺码按钮添加边框
      this.setData({
        size_count:-1
      })
    }else{
      this.setData({
        size_count:e.currentTarget.dataset.index
      })
    }

  },

  count_red_fun(){        //数字减按钮
    const counts=this.data.count_text
    if(counts>1){
      this.setData({
        count_text:counts-1
      })
    }
  },
  count_addd_fun(){       //数字加按钮
    const counts=this.data.count_text
    if(counts<5){
      this.setData({
        count_text:counts+1
      })
    }
  },
  //祥情页面点击加入购物车
  add_shop_cart_fun(){
    this.setData({
      choice_color_size_frame_hidden:false,
      goods_imgurl:this.data.goods_info_list[0].img_url
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
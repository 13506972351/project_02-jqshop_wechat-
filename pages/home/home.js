
var app = getApp()   //在页面中使用全局变量，要先声明
//导入request接口
import {request} from "../../promise_api/request" 
import {getlocation} from "../../promise_api/getlocation"
import{geocoder}from "../../promise_api/geocoder"

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

    shop_name_str:'',   //外省店铺名
    lai_number:0,    //外省店铺纬度
    lng_number:0,    //外省店铺经度




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
    request({                  //调用封装的request接口
      url:'load_swiper_img',   //接口地址
      method:'post'
    })
    .then(res=>{
      this.setData({
        swiper_imgurl_list:res.data 
      })
    })
  },
  //打开程序获得当前位置,查找距离最近店铺
  load_current_position(){
    var _this=this  //这是因为this作用域指向问题 ，success函数实际是一个闭包 ， 无法直接通过this来setData
    var user_lai_str=0
    var user_lng_str=0
    getlocation({                  //调用封装的getlocation接口,得到当前的经纬度
    })
    .then(([a,b])=>{
        // console.log(a,b) //当返回值是多个时出要用数组来接收
        user_lai_str=a
        user_lng_str=b
        if(a&&b){        //当返回值到达后，对执行将经纬度转为地址的方法
          // console.log(a,b)
          qqmapsdk.reverseGeocoder({      //根据经纬度获取用用户地址
            location:{
              latitude:user_lai_str,
              longitude:user_lng_str
            },
            success:function(res){
              // console.log(res)
              var province=res.result.address_component.province;   //省
              var city=res.result.address_component.city;           //地
              var district=res.result.address_component.district;
              var street=res.result.address_component.street;
              var street_number=res.result.address_component.street_number;
              // console.log(province,city,district,street,street_number)

              request({                  //调用封装的request接口
                url:'calc_lately_location',   //接口地址
                method:'post',
                data:{
                  provinces:JSON.stringify(province),  //将数据格式转为JSON
                  citys:JSON.stringify(city),
                  districts:JSON.stringify(district),
                  streets:JSON.stringify(street),
                  street_numbers:JSON.stringify(street_number),
                  // latitude_strs:user_lai_str,
                  // longitude_strs:user_lng_str
                }
              })
              .then(res=>{
                //如果是本省找到匹配最近店铺，如果有找到返回的为string类型，否则在本省找不到返回为外省多店objet
                if(typeof res.data==='string'){ 
                  _this.setData({
                      lately_shop_name:res.data
                  })
                }else{
                  // console.log('店铺名：',res.data[0],res.data[1])
                  if(res.data){     //判断店铺地址是否存在
                    var allshop_list=[]
                    var single_shop_str=''
                    var single_shop_list=[]
                    var new_shop_add_name=[]
                      // console.log(res.data)
                      for(var s=0;s<=res.data.length-1;s++){
                        var newres=res.data[s].split('*')      //由于服务器返回来的信息是[‘店铺地址*店铺名’，‘店铺地址*店铺名’]，把每个元素从*分割成小列表
                        new_shop_add_name.push(newres)         //再添加到一个大列表中[[‘店铺地址，店铺名’]，[‘店铺地址,店铺名’]]
                      }
                      // console.log('new_shop_add_name=',new_shop_add_name[1][0])
                      for(var i=0;i<=new_shop_add_name.length-1;i++){
                        
                        var shop_name=''
                        shop_name=new_shop_add_name[i][0]    //店铺地址（省+地）
                        // console.log('$$',shop_name)
                        var y=0
                        geocoder({  //调用返回经纬度的方法
                          add_str:shop_name,     //店铺地址（省+地）
                          shop_names:new_shop_add_name[i][1]    //把店铺名也提交给函数，再和经纬度一起返返回来
                          //为解决异步问题，将i一起传给函数，再返回来，达到同步
                        })
                        .then(([name,a,b])=>{    //返回店铺名，经度纬度，i的值
                          y=y+1//为解决异步问题，用y计数，当循环的次数==该循环的店铺数时，打印最后一次经纬度数组的值并传给服务器，达到同步

                          // console.log('name,a,b=',name,a,b)
                          single_shop_str=name+','+a+','+b     //将店铺名与经纬度拼在一起
                          single_shop_list=single_shop_str.split(',')    //再从逗号分割成列表
                          allshop_list.push(single_shop_list)      //将每个店的店铺名+经纬度的小列表，添加到一个大列表中
                          // console.log(y)
                          if(y==res.data.length){    //当所有查询经纬度的循环完成
                            // console.log(allshop_list)
                            var shop_loaction_info=''
                            for(var i=0;i<=allshop_list.length-1;i++){  //将对象里的值取出加到字符串变量中
                              shop_loaction_info=shop_loaction_info+allshop_list[i]+'*'  //将大列表各店值取出以*分割标识拼成字符串
                            }
                            console.log('yy',shop_loaction_info)
                            request({
                              url:'calc_lately_Field_shop',   //接口地址
                              method:'post',
                              data:{
                                shop_add_info:JSON.stringify(shop_loaction_info),  //将数据格式转为JSON
                                latitude_strs:user_lai_str,  //用户所在纬度
                                longitude_strs:user_lng_str  //用户所有经度
                              }
                            })
                            .then(res=>{
                              // console.log(res.data)
                              if(res.data){
                                _this.setData({
                                  lately_shop_name:res.data
                                })
                              }

                            })
                          }
                        })
                        
                      }
                    
                    
                    
                  }
                }
             })    
            }
          })
        }
    })
    
        
    
    //           success:(res)=>{
    //             var  ress=res.data
    //             // console.log(ress)  //返回离用户最近的店铺
    //             // console.log(typeof ress==='string');
    //             if(typeof ress==='string'){   //如果是本省找到匹配最近店铺，返回的为string类型，否则为objet
    //               _this.setData({
    //                 lately_shop_name:ress
    //               })
    //             }else{
    //               // console.log(ress.length)
    //               //分别获取后台传来的地址的经纬度，并返回后台
    //               var lai_lng_list=[]  //定义列表，用于存储单个店经纬度
    //               let lai_lng_str=[]
    //               for(var i=0;i<=ress.length-1;i++){
    //                 var name_str=''
    //                 var lainumber=0
    //                 var lngnumber=0
    //                 let res1=_this2.select_shop_location(ress[i])   //pormise取数方法
    //                 let a=res1.then((res)=>{
    //                   lainumber=res[0]
    //                   lngnumber=res[1]
    //                 })
    //                 name_str=ress[i]
    //                 console.log(name_str,lainumber,lngnumber)

    //               }
                  
    //             }
                
    //           }
    //         })
    //         // wx.openLocation({    //根据经纬度打开地图
    //         //   latitude: latitude_str,
    //         //   longitude: longitude_str,
    //         //   address: 'address',
    //         //   name: 'name',
    //         //   scale: 0,
    //         //   success: (res) => {},
    //         //   fail: (res) => {},
    //         //   complete: (res) => {},
    //         // })
    //       }
    //     })
    //   }

    // })
    // })
  },
  //根据店铺地址得到经纬度
  // select_shop_location(shop_add_str){
  //   return new Promise(function(resolve,reject){   //api接口异步发处理包,解决回调地狱
  //     // console.log('*',shop_add_str)
  //     // var than=this  //将data的this指向作变更
  //     qqmapsdk.geocoder({
  //       address:shop_add_str,
  //       success:res=>{
  //         var lat_lng_arry=[]
  //         var lats=res.result.location.lat
  //         var lngs=res.result.location.lng
  //         if(lats&&lngs){
  //           lat_lng_arry.push(lats)   //纬度添加到列表
  //           lat_lng_arry.push(lngs)
  //         }
  //         // console.log(lat_lng_arry)
  //         resolve(lat_lng_arry)
  //         //打开地图
  //         // wx.openLocation({
  //         //   latitude: lat,
  //         //   longitude: lng,
  //         //   address: 'address',
  //         //   name: 'name',
  //         //   scale: 0,
  //         //   success: (res) => {},
  //         //   fail: (res) => {},
  //         //   complete: (res) => {}
  //         // })
  //       }
  //     })
  //   })
  // },
  
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
  this.load_load_swiper_img()
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
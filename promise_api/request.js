//定义公共url
var app = getApp()   //在页面中使用全局变量，要先声明
const baseUrl=app.globalData.server_ip   //引入app.js全局变量服务器ip地址
export const request=(params)=>{
  //返回promise对象
  return new Promise((resolve,reject)=>{
      wx.request({
          ...params,
          url: baseUrl + params.url, //服务器url + 参数中携带的接口具体地址
          method:params.method,
          data:params.data,
          header: {
            'content-type': 'application/x-www-form-urlencoded'  //请求头类型
          },
          success: (res) => {
              resolve(res)  //成功后返回
          },
          fail: (err) => {
              reject(err)  //失败后返回
          },
          complete: () => {
          }
      })
  })
}
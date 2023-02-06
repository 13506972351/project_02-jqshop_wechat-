export const request=(params)=>{
  //定义公共url
  const baseUrl = "http://192.168.109.110:5000/"
  //返回promise对象
  return new Promise((resolve,reject)=>{
      wx.request({
          ...params,
          url: baseUrl + params.url, //服务器url + 参数中携带的接口具体地址
          method:params.method,
          data:{
            
          },
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
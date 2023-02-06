//获取当前经纬度接口
export const getlocation=()=>{
  //返回promise对象
  return new Promise((resolve,reject)=>{
    wx.getLocation({
      type:'wgs84',
      success: (res) => {
        
        resolve([res.latitude,res.longitude])  //成功后返回,返回多个值时要用数组
      },
      fail: (err) => {
          reject(err)  //失败后返回
      },
      complete: () => {
      }
    })
  })
}
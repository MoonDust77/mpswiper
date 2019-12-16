const DOMAIN = 'http://floravita.jxpanda.com/api'
const APP_VERSION = '1.0.0'

/**
 *
 * @param {String} url 请求地址
 * @param {*=} params 请求参数
 * @param {String=} method 请求方法类型
 * @param {Objet=} options 一些可选项，如header，domainType，dataType
 * @return {Promise} 返回一个请求的promise
 */
function fetch(url = '', params = {}, method = 'GET', options = {}) {
  method = method.toUpperCase()
  let app = getApp()
  let systemInfo = {}
  let token = ''
  if (app) {
    systemInfo = app.globalData.systemInfo
    token = app.globalData.token
  } else {
    systemInfo = wx.getStorageSync('systemInfo') || {}
    token = wx.getStorageSync('user') && wx.getStorageSync('user').token
  }
  let header = {
    'X-DEFINED-appinfo': JSON.stringify({
      model: systemInfo.model, // 手机品牌型号（如：Huawei Mate 10）
      os: systemInfo.system, // 系统版本(如：Android 7.0)
      wxVersion: systemInfo.version, // 微信版本号
      version: APP_VERSION // 小程序版本号
    }),
    Authorization: token || ''
  }
  let userHeader = options.header || {}
  Object.assign(header, userHeader)

  // 拼接不同的请求头
  url = DOMAIN + url

  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      data: JSON.stringify(params),
      header: header,
      method: method,
      dataType: options.dataType || 'json',
      success: function (res) {
        if (res.statusCode >= 200 && res.statusCode < 400) {
          if (res.data.code === 403) {
            // 登录过期
            getApp().signOut()
            wx.reLaunch({
              url: '/pages/index/index'
            })
          } else {
            resolve(res.data)
          }
        } else {
          wx.showToast({
            icon: 'none',
            title: `系统异常，请稍后重试(${res.statusCode})`
          })
          console.error(url + '系统异常，statusCode:' + res.statusCode)
        }
      },
      fail: function (err) {
        reject(err)
        console.error(err)
        // wx.showToast({
        //   icon: 'none',
        //   title: '网络连接出错'
        // })
      }
    })
  })
}

export default fetch

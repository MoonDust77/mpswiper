import fetch from './fetch'

export const commonApi = {
  getBannerList() {
    return fetch('/index/banner')
  }
}

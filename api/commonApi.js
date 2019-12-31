import fetch from './fetch'

export const commonApi = {
  getBannerList() {
    return fetch('/index/banner')
  },
  login(params = {}) {
    return fetch('/auth/login', params, 'POST')
  }
}

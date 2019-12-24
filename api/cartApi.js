import fetch from './fetch'

export const cartApi = {
  getCartList() {
    return fetch('/cart/load')
  },
  add(params = {}) {
    return fetch('/cart/add', params, 'POST')
  }
}

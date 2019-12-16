import fetch from './fetch'

export const cartApi = {
  getCartList() {
    return fetch('/cart/load')
  }
}

import fetch from './fetch'

export const productionApi = {
  // 获取商品列表
  getList() {
    return fetch('/product/list')
  },
  getDetail(id = '') {
    return fetch(`/product/detail?id=${id}`)
  }
}

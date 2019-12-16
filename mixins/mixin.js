// 小程序内置属性
const originProperties = ['data', 'properties', 'options']
const originMethods = ['onLoad', 'onReady', 'onShow', 'onHide', 'onUnload', 'onPullDownRefresh', 'onReachBottom', 'onShareAppMessage', 'onPageScroll', 'onTabItemTap']

function merge(mixins, options) {
    mixins.forEach((mixin) => {
        if (Object.prototype.toString.call(mixin) !== '[object Object]') {
            throw new Error('mixin 类型必须为对象！')
        }
        // 遍历 mixin 里面的所有属性
        for (let key in mixin) {
            if (originProperties.indexOf(key) > -1) {
                // 内置对象属性混入
                options[key] = {
                    ...mixin[key],
                    ...options[key]
                }
            } else if (originMethods.indexOf(key) > -1) {
                // 内置方法属性混入，优先执行混入的部分
                const originFunc = options[key]
                options[key] = function (...args) {
                    mixin[key].call(this, ...args)
                    return originFunc && originFunc.call(this, ...args)
                }
            } else {
                // 自定义方法混入
                options[key] = mixin[key]
            }
        }
    })
}
const originPage = Page
Page = (options) => {
    const mixins = options.mixins
    // mixins 必须为数组
    if (Array.isArray(mixins)) {
        delete options.mixins
        // mixins 注入并执行相应逻辑
        merge(mixins, options)
    }
    // 释放原生 Page 函数
    originPage(options)
}
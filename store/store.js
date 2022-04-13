// 导入Vue和 Vuex
import Vue from 'vue'
import Vuex from 'vuex'
import moduleCart from './cart.js'
import moduleUser from './user.js'
Vue.use(Vuex)

//创建store的实列对象
const store = new Vuex.Store({
	modules: {
		m_cart: moduleCart,
		m_user: moduleUser
	},
	mutations: {
		AddCount(state) {
			console.log(state)
		}
	}
})

export default store

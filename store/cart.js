export default {
	namespaced: true,
	state: {
		// { goods_id, goods_name, goods_price, goods_count, goods_small_logo, goods_state }
		cart: JSON.parse(uni.getStorageSync('cart') || '[]')
	},
	mutations: {
		addToCart(state, goods) {
			// 根据提交的商品的Id，查询购物车中是否存在这件商品
			// 如果不存在，则 findResult 为 undefined；否则，为查找到的商品信息对象
			const findResult = state.cart.find((x) => x.goods_id === goods.goods_id)
			if (!findResult) {
				state.cart.push(goods)
			} else {
				findResult.goods_count++
			}
			this.commit('m_cart/saveToStoreage')
		},
		saveToStoreage(state) {
			uni.setStorageSync('cart', JSON.stringify(state.cart))
		},
		updateGoodsState(state, goods) {
			const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
			if (findResult) {
				findResult.goods_state = goods.goods_state
				this.commit('m_cart/saveToStoreage')
			}
		},
		updateGoodsCount(state, goods) {
			console.log(goods)
			console.log(state.cart)
			const findResult = state.cart.find((x) => x.goods_id === goods.goods_id)
			if (findResult) {
				findResult.goods_count = goods.goods_count
				this.commit('m_cart/saveToStoreage')
			}
		},
		updateAllGoodsState(state, newState) {
			state.cart.forEach(x => x.goods_state = newState)
			this.commit('m_cart/saveToStoreage')
		},
		removeGoodsById(state, goods_id) {
			state.cart = state.cart.filter(x => x.goods_id !== goods_id)
			this.commit('m_cart/saveToStoreage')
		}
	},
	getters: {
		//统计购物车中商品的总数量
		total(state) {
			let c = 0
			state.cart.forEach(goods => c += goods.goods_count)
			return c
		},
		checkedCount(state) {
			return state.cart.filter(x => x.goods_state).reduce((total, item) => total += item.goods_count, 0)
		},
		checkedGoodsAmount(state) {
			// return state.cart.filter(x => x.goods_state).reduce((total, item) => total += item.goods_count * item
			// 	.goods_price, 0).toFixed(2)
			return state.cart.filter(x => x.goods_state)
				.reduce((total, item) => total += item.goods_count * item.goods_price, 0)
				.toFixed(2)
		}
	}
}

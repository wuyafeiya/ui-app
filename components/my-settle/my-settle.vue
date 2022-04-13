<template>
	<view class="my-settle-container">
		<label class="radio" @click="changeAllState">
			<radio color="#c00000" :checked="isFullCheck"><text>全选</text></radio>
		</label>

		<!-- 合计区域 -->
		<view class="amount-box">
			合计：<text class="amount">￥{{checkedGoodsAmount}}</text>
		</view>
		<view class="btn-settle" @click="settlement">结算({{checkedCount}})</view>
	</view>
</template>

<script>
	import {
		mapGetters,
		mapMutations,
		mapState
	} from 'vuex'
	export default {
		name: "my-settle",
		data() {
			return {

			};
		},
		methods:{
			...mapMutations('m_cart',['updateAllGoodsState']),
			changeAllState(){
				this.updateAllGoodsState(!this.isFullCheck)
			},
			settlement(){
				//1. 先判断是否勾选了要结算的商品
				if(!this.checkedCount) return uni.$showMsg('请选择要结算的商品')
				// 判断是否选了收货地址
				if(!this.addstr) return uni.$showMsg('请选择收货地址')
				//判断是否登录
				if(!this.token) return uni.$showMsg('请先登录')
			}
		},
		computed: {
			...mapGetters('m_cart', ['checkedCount', 'total','checkedGoodsAmount']),
			// addstr 是详细的收货地址
			...mapGetters('m_user',['addstr']),
			...mapState('m_user',['token']),
			isFullCheck() {
				return this.total === this.checkedCount
			}
		}
	}
</script>

<style lang="scss">
	.my-settle-container {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 50px;
		background-color: white;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-left: 5px;
		font-size: 14px;

		.radio {
			display: flex;
			align-items: center;
		}

		.amount {
			color: #c00000;
		}

		.btn-settle {
			height: 50px;
			min-width: 100px;
			background-color: #c00000;
			color: white;
			line-height: 50px;
			text-align: center;
			padding: 0 10px;
		}
	}
</style>

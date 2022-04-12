<template>
	<view>
		<view class="goods-item">
			<!-- 左侧 -->
			<view class="goods-item-left">
				<image :src="goods.goods_small_logo || defaultPic" class="goods-pic"></image>
			</view>
			<!-- 右侧 -->
			<view class="goods-item-right">
				<view class="goods-name">{{goods.goods_name}}</view>
				<view class="goods-info-box">
					<view class="goods-price">￥{{goods.goods_price | tofixed}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			goods: {
				type: Object,
				default: {}
			}
		},
		data() {
			return {
				defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png'
			};
		},
		filters:{
			tofixed(num){
				return Number(num).toFixed(2)
			}
		},
		onLoad(options) {
			this.queryObj.query = options.query || ''
			this.queryObj.cid = options.cid || ''
			this.getGoodsList()
		},
		methods: {
			async getGoodsList() {
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/goods/search', this.queryObj)
				console.log(res)
				if (res.meta.status !== 200) return uni.$showMsg()
				this.goodsList = res.message.goods
				this.total = res.message.total
			}
		}
	}
</script>

<style lang="scss">
	.goods-list {
		.goods-item {
			display: flex;
			padding: 10px 5px;
			border: 1px solid #f0f0f0;

			.goods-item-left {
				margin-right: 5px;

				.goods-pic {
					width: 100px;
					height: 100px;
					display: block;
				}
			}

			.goods-item-right {
				display: flex;
				flex-direction: column;
				justify-content: space-between;

				.goods-name {
					font-size: 13px;
				}

				.goods-price {
					font-size: 16px;
					color: #c00000;
				}
			}

		}
	}
</style>

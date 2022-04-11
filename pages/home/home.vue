<template>
	<view>
		<!-- 轮播图 -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
			<swiper-item v-for="(item,index) in swiperList" :key="index">
				<navigator class="swiper-item" :url="`/subpkg/goods_detail/goods_detail?goods_id=`+item.goods_id">
					<image :src="item.image_src"></image>
				</navigator>
			</swiper-item>
		</swiper>
		<!-- 导航区域 -->
		<view class="nav-list">
			<view class="nav-item" v-for="(item,index) in navList" :key='index' @click="navClickHandler(item)">
				<image :src="item.image_src" class="nav-img"></image>
			</view>
		</view>
		<!-- 楼层区域 -->
		<view class="floor-list">
			<view class="floor-item" v-for="(item,i) in flooorList" :key='i'>
				<image :src="item.floor_title.image_src" class="floor-title"></image>
				<view class="floor-img-box">
					<!-- 左侧大盒子 -->
					<navigator class="left-item-box" :url="item.product_list[0].url">
						<image :src="item.product_list[0].image_src"
							:style="{width: item.product_list[0].image_width + 'rpx'}" mode="widthFix"></image>
					</navigator>
					<!-- 右侧大盒子 -->
					<view class="right-item.box">
						<navigator class="right-img-item" v-for="(item2,i2) in item.product_list" :key='i2' v-if="i2 !==0" :url="item2.url">
							<image :src="item2.image_src" mode="widthFix" :style="{width:item2.image_width+'rpx'}">
							</image>
						</navigator>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 轮播图数据
				swiperList: [],
				// 导航数据
				navList: [],
				//楼层数据
				flooorList: []
			};
		},
		onLoad() {
			this.getSwiperList()
			this.getNavList()
			this.getFloorList()
		},
		methods: {
			// 获取轮播图数据
			async getSwiperList() {
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/home/swiperdata')
				if (res.meta.status !== 200) return uni.$showMsg()
				this.swiperList = res.message
			},
			async getNavList() {
				// console.log(13)
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/home/catitems')
				if (res.meta.status !== 200) return uni.$showMsg()
				this.navList = res.message
			},
			navClickHandler(item) {
				if (item.name === '分类') {
					uni.switchTab({
						url: '/pages/cate/cate'
					})
				}
			},
			async getFloorList() {
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/home/floordata')
				if (res.meta.status !== 200) return uni.$showMsg()

				// 通过双层foreach 循环处理 url 地址
				res.message.forEach(floor => {
					floor.product_list.forEach(prod => {
						prod.url = '/subpkg/goods_list/goods_list?' + prod.navigator_url.split("?")[1]
					})
				})
				this.flooorList = res.message
			}
		},
		// 获取分类导航方法

	}
</script>
<style lang="scss">
	swiper {
		height: 330rpx;

		.swiper-item,
		image {
			width: 100%;
			height: 100%;
		}
	}

	.nav-list {
		display: flex;
		justify-content: space-around;
		margin: 15rpx 0;

		.nav-item {
			.nav-img {
				width: 128rpx;
				height: 140rpx;
			}
		}
	}

	.floor-title {
		width: 100%;
		height: 60rpx;
		display: flex;
	}

	.floor-img-box {
		display: flex;
		padding-left: 15rpx;

		.right-item.box {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-around;
		}
	}
</style>

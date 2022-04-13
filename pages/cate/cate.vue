<template>
	<view>
		<my-search :bgcolor="'#c00000'" :radius="15" @click='gotoSearch'></my-search>
		<view class="scroll-view-container">
			<!-- 左侧滑动 -->
			<scroll-view class="left-scroll-view" :style="{height: wh+'px'}" scroll-y>
				<block v-for="(item,i) in cateList" :key='i'>
					<view :class="['left-scroll-view-item', i===active?'active':'']" @click="activeChanged(i)">
						{{item.cat_name}}
					</view>
				</block>
			</scroll-view>
			<!-- 右侧滑动 -->
			<scroll-view class="right-scroll-view" :style="{height:wh+'px'}" scroll-y :scroll-top="scrollTop">
				<view class="cate-lv2" v-for="(item2,i2) in cateLevel2" :key="i2">
					<view class="cate-lv2-title">/{{item2.cat_name}}/</view>
					<view class="cate-lv3-list">
						<!-- 三级分类的item项 -->
						<view class="cate-lv3-item" v-for="(item3,i3) in item2.children" :key="i3"
							@click="gotoGoodsList(item3)">
							<!-- 图片 -->
							<image :src="item3.cat_icon"></image>
							<!-- 文本 -->
							<text>{{item3.cat_name}}</text>
						</view>
					</view>
				</view>
				<!-- 三级数据列表 -->
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import badgeMix from '../../mixins/tabbar-bage.js'
	export default {
		mixins: [badgeMix],
		data() {
			return {
				wh: 0,
				// 分类列表
				cateList: [],
				cateLevel2: [],
				active: 0,
				scrollTop: 0
			};
		},
		onLoad() {
			// 获取当前系统的信息
			const sysInfo = uni.getSystemInfoSync()
			this.wh = sysInfo.windowHeight - 50
			this.getCateList()
		},
		methods: {
			async getCateList() {
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/categories')
				if (res.meta.status !== 200) return uni.$showMsg()
				this.cateList = res.message
				this.cateLevel2 = res.message[0].children
			},
			activeChanged(i) {
				this.active = i
				this.cateLevel2 = this.cateList[i].children
				this.scrollTop = this.scrollTop === 0 ? 1 : 0
			},
			gotoGoodsList(item3) {
				uni.navigateTo({
					url: '/subpkg/goods_list/goods_list?cid=' + item3.cat_id
				})
			},
			gotoSearch() {
				uni.navigateTo({
					url: '/subpkg/search/search'
				})
			}
		}
	}
</script>

<style lang="scss">
	.scroll-view-container {
		display: flex;

		.left-scroll-view {
			width: 120px;

			.left-scroll-view-item {
				line-height: 60px;
				background-color: #e6e6e6;
				text-align: center;
				font-size: 12px;

				&.active {
					background-color: #fff;
					position: relative;

					&::before {
						content: '';
						display: block;
						width: 3px;
						height: 30px;
						background-color: #c00000;
						position: absolute;
						left: 0;
						top: 50%;
						transform: translateY(-50%);
					}
				}
			}
		}

		.right-scroll-view {
			background-color: #fff;
		}

		.cate-lv2-title {
			text-align: center;
		}

		.cate-lv3-list {
			display: flex;
			flex-wrap: wrap;

			.cate-lv3-item {
				width: 33.33%;
				display: flex;
				margin-bottom: 10px;
				flex-direction: column;
				align-items: center;

				image {
					width: 60px;
					height: 60px;
				}

				text {
					font-size: 12px;
				}
			}
		}
	}
</style>

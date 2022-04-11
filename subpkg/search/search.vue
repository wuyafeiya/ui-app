<template>
	<view>
		<view class="search-box">
			<uni-search-bar @input="input" :radius="100" cancelButton="none"></uni-search-bar>
		</view>
		<view class="sugg-list" v-if="searchResults.length !== 0">
			<view class="sugg-item" v-for="(item,i) in searchResults" :key='i' @click="gotoDetail(item.goods_id)">
				<view class="goods-name">{{item.goods_name}}</view>
				<uni-icons type="arrowright" size="16"></uni-icons>
			</view>
		</view>
		<!-- 搜索历史 -->
		<view class="history-box" v-else>
			<!-- 标题区域 -->
			<view class="history-title">
				<text>搜索历史</text>
				<uni-icons type='trash' size="17" @click="cleanHistory"></uni-icons>
			</view>
			<!-- 列表区域 -->
			<view class='history-list'>
				<uni-tag :text='item' v-for="(item, i) in historys" :key="i" inverted="true"
					@click="gotoGoodsList(item)"></uni-tag>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show: true,
				showSync: true,
				// 延迟器
				timer: null,
				// 搜索关键词
				kw: '',
				searchResults: [],
				historyList: []

			};
		},
		onLoad() {
			this.historyList = JSON.parse(uni.getStorageSync('kw') || '[]')
		},
		methods: {
			input(e) {
				clearTimeout(this.timer)
				this.timer = setTimeout(() => {
					// 如果500毫秒内 没有触发新输入的事件 就为搜索关键词赋值
					this.kw = e
					this.getSearchList()
				}, 500)
			},
			async getSearchList() {
				if (this.kw === '') {
					this.searchResults = []
					return
				}
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/goods/qsearch', {
					query: this.kw
				})
				if (res.meta.status !== 200) return uni.$showMsg()
				this.searchResults = res.message
				this.saveSearchHistory()
			},
			saveSearchHistory() {
				const set = new Set(this.historyList)
				set.delete(this.kw)
				set.add(this.kw)
				this.historyList = Array.from(set)
				uni.setStorageSync('kw', JSON.stringify(this.historyList))
			},
			gotoDetail(goods_id) {
				console.log(goods_id)
				uni.navigateTo({
					url: '/subpkg/goods_detail/goods_detail?goods_id=' + goods_id
				})
			},
			cleanHistory() {
				this.historyList = []
				uni.setStorageSync('kw', '[]')
			},
			gotoGoodsList(kw) {
				uni.navigateTo({
					url: '/subpkg/goods_list/goods_list?query=' + kw
				})
			}
		},
		computed: {
			historys() {
				return [...this.historyList].reverse()
			}
		},
	}
</script>

<style lang="scss">
	.search-container {
		background-color: #fff;
	}

	.uni-searchbar {
		display: flex;
		flex-direction: row;
		position: relative;
		padding: 16rpx;
		background-color: #c00000;
	}

	.search-box {
		position: sticky;
		top: 0;
		z-index: 999;
	}

	.sugg-list {
		padding: 0 5px;

		.sugg-item {
			font-size: 12px;
			padding: 13px 0;
			border-bottom: 1px solid #efefef;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.goods-name {
				// 文字不允许换行
				white-space: nowrap;
				// 溢出隐藏
				overflow: hidden;
				// 文本溢出后 使用...代替
				text-overflow: ellipsis;
				margin-right: 3px;
			}
		}
	}

	.history-box {
		padding: 0 5px;

		.history-title {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 40px;
			font-size: 13px;
			border-bottom: 1px solid #efefef;
		}

		.history-list {
			display: flex;
			flex-wrap: wrap;

			.uni-tag {
				margin-top: 5px;
				margin-right: 5px;
			}
		}
	}
</style>

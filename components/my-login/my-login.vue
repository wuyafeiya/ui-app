<template>
	<view class="login-container">
		<uni-icons type='contact-filled' size='100' color='#afafaf'></uni-icons>
		<!-- 登录按钮 -->
		<button type="primary" class="btn-login" open-type="getUserInfo" @getuserinfo="getUserInfo">一键登录</button>
		<!-- 登录提示 -->
		<text class="tips-text">登录后尽享更多权益</text>
	</view>
</template>

<script>
	import {
		mapMutations
	} from 'vuex'
	export default {
		name: "my-login",
		data() {
			return {

			};
		},
		methods: {
			...mapMutations('m_user', ['updateUserInfo', 'updateToken']),
			getUserInfo(e) {
				if (e.detail.errMsg === 'getUserInfo:fail auth deny') return uni.$showMsg('您取消了登录授权！')
				this.updateUserInfo(e.detail.userInfo)
				console.log(e.detail)
				//登录成功后 token 字符串
				this.getToken(e.detail)
			},
			async getToken(info) {
				//调用微信登录接口
				const [err, res] = await uni.login().catch(err => err)
				console.log(res)
				if (err || res.errMsg !== 'login:ok') return uni.$showMsg('登录失败!')

				const query = {
					code: res.code,
					encryptedData: info.encryptedData,
					iv: info.iv,
					rawData: info.rawData,
					signature: info.signature
				}
				const succ = await uni.$http.post('/api/public/v1/users/wxlogin', query)
				console.log(succ)
				// if (loginResult.meta.status !== 200) return uni.$showMsg('登录失败')
				// this.updateToken(loginResult.message.token)
			}
		}
	}
</script>
<style lang="scss">
	.login-container {
	  // 登录盒子的样式
	  height: 750rpx;
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	  justify-content: center;
	  background-color: #f8f8f8;
	  position: relative;
	  overflow: hidden;
	
	  // 绘制登录盒子底部的半椭圆造型
	  &::after {
	    content: ' ';
	    display: block;
	    position: absolute;
	    width: 100%;
	    height: 40px;
	    left: 0;
	    bottom: 0;
	    background-color: white;
	    border-radius: 100%;
	    transform: translateY(50%);
	  }
	
	  // 登录按钮的样式
	  .btn-login {
	    width: 90%;
	    border-radius: 100px;
	    margin: 15px 0;
	    background-color: #c00000;
	  }
	
	  // 按钮下方提示消息的样式
	  .tips-text {
	    font-size: 12px;
	    color: gray;
	  }
	}
</style>

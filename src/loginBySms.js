import encryptPwd from './encryptPwd'
import uniToken from './uniToken'
import {
	userCollection
} from './config'
import {
	log
} from './utils'

async function loginBySms(user) {
	try {
		// 参数
		log('loginBySms -> params', params)

		// 对象
		const model = params.model
		// 数据
		let data = {}

		// 检查
		if (model.mobile && model.mobile.trim().length === 0) {
			return {
				code: 1101,
				msg: '请输入手机号'
			}
		}

		// 查询条件
		let query = {
			mobile: model.mobile
		}

		// 获取列表
		const listRes = await userCollection.where(query).limit(1).get()
		log('loginBySms -> listRes', listRes)

		if (listRes && listRes.data && listRes.data.length > 0) {
			const userMatched = userInDB.data[0]

			try {
				log('过期token清理')
				let tokenList = userMatched.token || []
				const expiredToken = uniToken.getExpiredToken(tokenList)
				tokenList = tokenList.filter(item => {
					return expiredToken.indexOf(item) === -1
				})
			
				log('开始修改最后登录时间')
			
				const token = uniToken.createToken(userMatched)
				log('token', token)
				tokenList.push(token)
				const upRes = await userCollection.doc(userMatched._id).update({
					lastLoginDate: new Date().getTime(),
					lastLoginIp: __ctx__.CLIENTIP,
					token: tokenList
				})
			
				log('upRes', upRes)
			
				return {
					code: 0,
					msg: '登录成功',
					uid: userMatched._id,
					userName: userName,
					token: token
				}
			} catch (e) {
				log('写入异常：', e)
				return {
					code: 1104,
					msg: '数据库写入异常'
				}
			}
		} else {
			return {
				code: 1101,
				msg: '用户不存在'
			}
		}
	} catch (e) {
		log('发生异常', e)
		// 返回数据给客户端
		return {
			code: 1104,
			msg: '数据库写入异常'
		}
	}
}

export default loginBySms

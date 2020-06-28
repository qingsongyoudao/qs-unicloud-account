// import uniToken from './uniToken.js'
import {
	userCollection
} from './config.js'
import {
	log
} from './utils'

async function setAvatar(params) {
	try {
		// 数据
		let data = {}

		// 操作
		const upRes = await userCollection.doc(params.uid).update({
			avatar: params.avatar
		})
		data = upRes
		log('setAvatar -> upRes', upRes)

		// 返回数据给客户端
		return {
			code: 0,
			msg: '设置成功',
			data: data
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

export default setAvatar

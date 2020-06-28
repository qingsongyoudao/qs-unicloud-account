import encryptPwd from './encryptPwd.js'
import {
	userCollection
} from './config.js'
import uniToken from './uniToken.js'
import {
	log
} from './utils'

const db = uniCloud.database()
async function register(user) {
	const query = []
	const uniqueParam = [{
		name: 'username',
		desc: '用户名'
	}, {
		name: 'email',
		desc: '邮箱',
		extraCond: {
			email_confirmed: 1
		}
	}, {
		name: 'mobile',
		desc: '手机号',
		extraCond: {
			mobile_confirmed: 1
		}
	}]
	uniqueParam.forEach(item => {
		const paramName = item.name
		if (user[paramName] && user[paramName].trim()) {
			query.push({
				[paramName]: user[paramName],
				...item.extraCond
			})
		}
	})

	if (query.length === 0) {
		return {
			code: 1001,
			msg: '用户名、邮箱、手机号不可同时为空'
		}
	}

	user.username = user.username.trim()

	const dbCmd = db.command
	const userInDB = await userCollection.where(dbCmd.or(...query)).get()

	log('userInDB:', userInDB)

	if (userInDB && userInDB.data.length > 0) {
		const userToCheck = userInDB.data[0]
		for (let i = 0; i < uniqueParam.length; i++) {
			const paramItem = uniqueParam[i]
			let extraCondMatched = true
			if (paramItem.extraCond) {
				extraCondMatched = Object.keys(paramItem.extraCond).every((key) => {
					return userToCheck[key] === paramItem.extraCond[key]
				})
			}
			if (userToCheck[paramItem.name] === user[paramItem.name] && extraCondMatched) {
				return {
					code: 1001,
					msg: `${paramItem.desc}已存在`
				}
			}
		}
	}

	user.password = encryptPwd(user.password)
	user.register_date = new Date().getTime()
	user.register_ip = __ctx__.CLIENTIP
	const addRes = await userCollection.add(user)
	log('addRes', addRes)
	const uid = addRes.id
	const token = uniToken.createToken({
		_id: uid
	})
	await userCollection.doc(uid).update({
		token: [token]
	})

	if (addRes.id) {
		return {
			code: 0,
			uid,
			username: user.username,
			msg: '注册成功',
			token
		}
	}
}

export default register

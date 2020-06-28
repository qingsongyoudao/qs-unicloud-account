import encryptPwd from './encryptPwd.js'
import {
  userCollection
} from './config.js'
import uniToken from './uniToken.js'
import {
  log
} from './utils'

async function registerByEmail (params) {
  // 对象
  const model = params.model
  // 数据
  let data = {}

  // 检查
  if (model.email && model.email.trim().length === 0) {
    return {
      code: 1101,
      msg: '请输入邮箱'
    }
  }
  if (model.password && model.password.trim().length === 0) {
    return {
      code: 1101,
      msg: '请设置密码'
    }
  }
  const countRes = await userCollection.where({
    email: model.email
  }).count()
  if (countRes && countRes.total > 0) {
    return {
      code: 1101,
      msg: '此邮箱已被注册'
    }
  }

  // 设置
  model.password = encryptPwd(model.password)
  model.regDate = new Date().getTime()
  model.regIp = __ctx__.CLIENTIP

  // 操作
  const addRes = await userCollection.add(model)
  data = addRes
  log('addRes', addRes)

  // 设置
  const uid = addRes.id
  const token = uniToken.createToken({
    _id: uid
  })
  // 更新
  await userCollection.doc(uid).update({
    token: [token]
  })

  if (addRes.id) {
    // 返回数据给客户端
    return {
      code: 0,
      msg: '注册成功',
      uid,
      userName: '',
      token,
      data: data
    }
  }
}

export default registerByEmail

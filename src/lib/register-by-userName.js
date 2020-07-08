import encryptPwd from './encrypt-pwd'
import {
  userCollection,
  log
} from '../share/index'
import uniToken from './uni-token'

async function registerByUserName (params) {
  // 对象
  const model = {
    userName: params.userName,
    password: params.password,
    status: 'normal',
    regDate: '',
    regIp: '',
    regPlatform: ''
  }
  // 数据
  let data = {}

  // 检查
  const countRes = await userCollection.where({
    userName: model.userName
  }).count()
  if (countRes && countRes.total > 0) {
    return {
      code: 1101,
      msg: '此用户名已被注册'
    }
  }

  // 设置
  model.password = encryptPwd(model.password)
  model.regDate = new Date().getTime()
  model.regIp = __ctx__.CLIENTIP
  model.regPlatform = ''

  // 操作
  const addRes = await userCollection.add(model)
  log('addRes', addRes)

  // 设置
  const uid = addRes.id
  const {
    token,
    tokenExpired
  } = uniToken.createToken({
    _id: uid
  })
  // 更新
  await userCollection.doc(uid).update({
    token: [token]
  })

  // 设置数据
  data = {
    uid,
    username: model.username,
    token,
    tokenExpired
  }

  if (addRes.id) {
    // 返回数据给客户端
    return {
      code: 1,
      msg: '注册成功',
      data: data
    }
  }
}

export default registerByUserName

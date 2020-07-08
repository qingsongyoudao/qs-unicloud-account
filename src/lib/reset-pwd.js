import encryptPwd from './encrypt-pwd'
import {
  userCollection,
  log
} from '../share/index'

async function resetPwd ({
  uid,
  password
}) {
  try {
    const upRes = await userCollection.doc(uid).update({
      password: encryptPwd(password),
      token: []
    })

    log('upRes', upRes)

    return {
      code: 0,
      msg: '密码重置成功'
    }
  } catch (e) {
    log('发生异常', e)
    return {
      code: 1104,
      msg: '数据库写入异常'
    }
  }
}

export default resetPwd

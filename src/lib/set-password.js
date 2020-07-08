import encryptPwd from './encrypt-pwd'
import {
  userCollection,
  log
} from '../share/index'

async function setPassword (params) {
  // 对象
  const model = {
    id: params.id,
    password: params.password,
    confirmPassword: params.confirmPassword
  }
  // 数据
  let data = {}

  const userInDB = await userCollection.doc(model.id).get()

  log('userInDB:', userInDB)

  if (userInDB && userInDB.data && userInDB.data.length > 0) {
    try {
      // 操作
      const upRes = await userCollection.doc(userInDB.data[0]._id).update({
        password: encryptPwd(model.password),
        token: []
      })

      log('upRes', upRes)

      // 设置数据
      data = upRes

      // 返回数据给客户端
      return {
        code: 1,
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
  } else {
    // 返回数据给客户端
    return {
      code: 1101,
      msg: '用户不存在'
    }
  }
}

export default setPassword

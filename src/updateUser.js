import {
  userCollection
} from './config.js'
import {
  log
} from './utils'

async function updateUser (params) {
  params.password && delete params.password
  params.token && delete params.password

  try {
    // 数据
    let data = {}

    // 操作
    const upRes = await userCollection.doc(params.uid).update(params)
    data = upRes
    log('update -> upRes', upRes)

    // 返回数据给客户端
    return {
      code: 0,
      msg: '修改成功',
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

export default updateUser

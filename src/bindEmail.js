import {
  userCollection
} from './config.js'
import {
  log
} from './utils'

async function bindEmail (params) {
  try {
    // 检查
    const countRes = await userCollection.where({
      email: params.email,
      emailConfirmed: 1
    }).count()
    if (countRes && countRes.total > 0) {
      return {
        code: 1101,
        msg: '此邮箱已被绑定'
      }
    }

    // 数据
    let data = {}

    // 操作
    const upRes = await userCollection.doc(params.uid).update({
      email: params.email,
      emailConfirmed: 1
    })
    data = upRes
    log('bindEmail -> upRes', upRes)

    // 返回数据给客户端
    return {
      code: 0,
      msg: '绑定成功',
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

export default bindEmail

import { userCollection } from './config.js'
import { log } from './utils'

async function bindMobile (params) {
  try {
    const countRes = await userCollection.where({
      mobile: params.mobile,
      mobile_confirmed: 1
    }).count()
    if (countRes && countRes.total > 0) {
      return {
        code: 1101,
        msg: '此手机号已被绑定'
      }
    }
    const upRes = await userCollection.doc(params.uid).update({
      mobile: params.mobile,
      mobile_confirmed: 1
    })

    log('bindMobile -> upRes', upRes)

    return {
      code: 0,
      msg: '设置成功'
    }
  } catch (e) {
    log('发生异常', e)
    return {
      code: 1104,
      msg: '数据库写入异常'
    }
  }
}

export default bindMobile

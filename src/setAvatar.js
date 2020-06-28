// import uniToken from './uniToken.js'
import { userCollection } from './config.js'
import { log } from './utils'

/** 设置头像
 * @param {Object} params
 */
async function setAvatar (params) {
  try {
    const upRes = await userCollection.doc(params.uid).update({
      avatar: params.avatar
    })

    log('setAvatar -> upRes', upRes)

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

export default setAvatar

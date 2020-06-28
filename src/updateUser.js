import { userCollection } from './config.js'
import { log } from './utils'

/** 修改用户信息
 * @param {Object} params
 */
async function updateUser (params) {
  params.password && delete params.password
  params.token && delete params.password

  try {
    const upRes = await userCollection.doc(params.uid).update(params)

    log('update -> upRes', upRes)

    return {
      code: 0,
      msg: '修改成功'
    }
  } catch (e) {
    log('发生异常', e)
    return {
      code: 1104,
      msg: '数据库写入异常'
    }
  }
}

export default updateUser

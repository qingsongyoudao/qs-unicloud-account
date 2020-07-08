import {
  userCollection,
  log
} from '../share/index'
import uniToken from './uni-token'

/** 退出操作，从数据库中删除token
 * @param {Object} uid
 * @param {Object} context
 */
const db = uniCloud.database()
async function logout (token) {
  const payload = await uniToken.checkToken(token)

  if (payload.code && payload.code > 0) {
    return payload
  }

  const dbCmd = db.command
  const upRes = await userCollection.doc(payload.uid).update({
    token: dbCmd.pull(token)
  })

  log('logout->upRes', upRes)

  if (upRes.updated === 0) {
    return {
      code: 1101,
      msg: '用户不存在'
    }
  }

  return {
    code: 0,
    msg: '退出成功'
  }
}

export default logout

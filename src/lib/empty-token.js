import {
  userCollection,
  log
} from '../share/index'

async function emptyToken (id) {
  const upRes = await userCollection.doc(id).update({
    token: []
  })

  log('logout->upRes', upRes)

  if (upRes.updated === 0) {
    return {
      code: 1101,
      msg: '用户不存在'
    }
  }

  return {
    code: 1,
    msg: '退出成功'
  }
}

export default emptyToken

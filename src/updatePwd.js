import encryptPwd from './encryptPwd.js'
import { userCollection } from './config.js'
import { log } from './utils'

async function updatePwd (user) {
  const userInDB = await userCollection.doc(user.uid).get()

  log('userInDB:', userInDB)

  if (userInDB && userInDB.data && userInDB.data.length > 0) {
    const pwdInDB = userInDB.data[0].password

    if (encryptPwd(user.oldPassword) === pwdInDB) { // 旧密码匹配
      try {
        const upRes = await userCollection.doc(userInDB.data[0]._id).update({
          password: encryptPwd(user.newPassword),
          token: []
        })

        log('upRes', upRes)

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
    } else {
      return {
        code: 1102,
        msg: '密码错误'
      }
    }
  } else {
    return {
      code: 1101,
      msg: '用户不存在'
    }
  }
}

export default updatePwd

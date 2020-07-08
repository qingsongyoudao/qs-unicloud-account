import {
  userCollection,
  log
} from '../share/index'

async function bindEmail (params) {
  try {
    const countRes = await userCollection.where({
      email: params.email,
      email_confirmed: 1
    }).count()
    if (countRes && countRes.total > 0) {
      return {
        code: 1101,
        msg: '此邮箱已被绑定'
      }
    }
    const upRes = await userCollection.doc(params.uid).update({
      email: params.email,
      email_confirmed: 1
    })

    log('bindEmail -> upRes', upRes)

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

export default bindEmail

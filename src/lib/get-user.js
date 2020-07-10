import {
  userCollection,
  log
} from '../share/index'

async function getUser (params) {
  // 对象
  const model = {
    id: params.id
  }
  // 数据
  let resData = {}

  const userInDB = await userCollection.doc(model.id).get()

  log('userInDB:', userInDB)

  if (userInDB && userInDB.data && userInDB.data.length > 0) {
    const userMatched = userInDB.data[0]

    const userName = userMatched.userName ? userMatched.userName : ''
    const email = userMatched.email ? userMatched.email : ''
    const mobile = userMatched.mobile ? userMatched.mobile : ''
    const nickName = userMatched.nickName ? userMatched.nickName : ''
    const avatar = userMatched.avatar ? userMatched.avatar : ''

    // 设置数据
    resData = {
      userName: userName,
      email: email,
      mobile: mobile,
      nickName: nickName,
      avatar: avatar
    }

    // 返回数据给客户端
    return {
      code: 1,
      msg: '获取成功',
      data: resData
    }
  } else {
    // 返回数据给客户端
    return {
      code: 1101,
      msg: '用户不存在'
    }
  }
}

export default getUser

'use strict'

import register from './register.js'
import registerByEmail from './registerByEmail.js'
import registerByMobile from './registerByMobile.js'
import login from './login.js'
import loginByPwd from './loginByPwd.js'
import loginBySms from './loginBySms.js'
import logout from './logout.js'
import updatePwd from './updatePwd.js'
// import updateUser from './updateUser.js'
// import deleteUser from './deleteUser.js'
import setAvatar from './setAvatar.js'
import bindMobile from './bindMobile.js'
import bindEmail from './bindEmail.js'
import uniToken from './uniToken.js'

const checkToken = uniToken.checkToken

export default {
  register,
  registerByEmail,
  registerByMobile,
  login,
  loginByPwd,
  loginBySms,
  logout,
  updatePwd,
  setAvatar,
  bindMobile,
  bindEmail,
  checkToken
}

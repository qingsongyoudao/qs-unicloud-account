'use strict'

import registerByUserName from './lib/register-by-userName.js'
import registerByEmail from './lib/register-by-email.js'
import registerByMobile from './lib/register-by-mobile.js'
import login from './lib/login'
import loginByWeixin from './lib/login-by-weixin'
import bindWeixin from './lib/bind-weixin'
import unbindWeixin from './lib/unbind-weixin'
import logout from './lib/logout'
import updatePwd from './lib/update-pwd'
import updateUser from './lib/update-user'
import setAvatar from './lib/set-avatar'
import bindMobile from './lib/bind-mobile'
import bindEmail from './lib/bind-email'
import uniToken from './lib/uni-token'
import encryptPwd from './lib/encrypt-pwd'
import resetPwd from './lib/reset-pwd'

const checkToken = uniToken.checkToken

export default {
  registerByUserName,
  registerByEmail,
  registerByMobile,
  login,
  loginByWeixin,
  bindWeixin,
  unbindWeixin,
  logout,
  updatePwd,
  updateUser,
  setAvatar,
  bindMobile,
  bindEmail,
  checkToken,
  encryptPwd,
  resetPwd
}

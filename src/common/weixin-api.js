import {
  getConfig
} from '../share/index'
import platformApi from '../platforms/index'
export default function getWeixinApi () {
  const config = getConfig()
  const clientPlatform = __ctx__.PLATFORM
  if (!config.oauth || !config.oauth.weixin) {
    throw new Error(`请在公用模块uni-id的config.json内添加${clientPlatform}平台微信登录配置项`)
  }
  const argsRequired = ['appid', 'appsecret']
  argsRequired.forEach((item) => {
    if (!config.oauth.weixin[item]) {
      throw new Error(`请在公用模块uni-id的config.json内添加配置项：${clientPlatform}.oauth.weixin.${item}`)
    }
  })
  const weixinApi = platformApi.initWeixin(config.oauth.weixin)
  return weixinApi
}

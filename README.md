# qs-unicloud-account

`qs-account`为`uniCloud`开发者提供了简单、统一、可扩展的账户模块云函数类插件，支持阿里云、腾讯云。

`qs-account`作为云函数公用模块，封装了用户注册、登录、Token 校验、修改密码、设置头像等常见用户管理功能，以 API 方式调用，开发者将`qs-account`作为公用模块导入后，可在云函数中便捷调用。

对于`qs-account`还未封装的能力，欢迎大家在开源项目上提交 pr，共同完善这个开源项目。

## 打包

执行以下命令：

```npm
npm install
npm run lint
npm run build
```

## 使用方式

### 创建公用模块
1. 在`cloudfunctions`目录下创建`common`目录
2. 在`common`目录右键创建公用模块目录（本例中为`qs-account`），会自动创建入口`index.js`文件和`package.json`，不要修改此`package.json`的`name`字段
3. 在`qs-account`右键上传公用模块

### 引入公用模块
1. 在要引入公用模块的云函数目录（本例中为`account`）执行`npm init -y`生成`package.json`文件
2. 在`account`目录执行`npm install ../common/qs-account`引入`qs-account`模块
3. 在云函数中调用，示例代码：

```js
'use strict';

const qsAccount = require('qs-account')

exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ' + event)

	// 操作
	let action = event.action
	// 参数
	let params = event.params
	// 返回
	let res = {}

	switch (action) {
		case 'login-pwd':
			res = await qsAccount.loginByPwd(params);
			break;
		case 'login-sms':
			res = await qsAccount.loginBySms(params);
			break;
		case 'register-email':
			res = await qsAccount.registerByEmail(params);
			break;
		case 'register-mobile':
			res = await qsAccount.registerByMobile(params);
			break;
		default:
			res = {
				code: 403,
				msg: '非法访问'
			}
			break;
	}

	// 返回数据给客户端
	return res
};

```



const jwt = require('jsonwebtoken')
const util = require('util')
const verify = util.promisify(jwt.verify)
const config = require('../config');
const User = require('../database/user.model');
/**
 * 验证token
 */
function checkToken() {
    return async function (ctx, next) {
        if (ctx.request.url !== '/api/user/login') {
            const token = ctx.header.authorization;
            if (!token) {
                ctx.body = {
                    reuslt: false,
                    code: 301,
                    msg: 'token不存在！'
                }
            } else {
                try {
                    const payload = await verify(token, config.secret)  // 解密payload，获取用户名和ID
                    ctx.state.userInfo = await User.findOne({
                        username: payload.username
                    })
                    await next();
                } catch (err) {
                    console.log(err);
                    ctx.body = {
                        code: 302,
                        msg: 'token已过期！'
                    }
                }
            }
        } else {
            await next();
        }
    }
}

module.exports = checkToken;
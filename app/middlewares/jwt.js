// 需要用jwt来验证路由
const jwt = require('koa-jwt');
const { JWT_SECRET } = require('../../public/config');

module.exports = jwt({
    secret: JWT_SECRET
}).unless({
    path: [ /^\/api\/login/ ] // 数组中的路径不需要通过jwt验证
})
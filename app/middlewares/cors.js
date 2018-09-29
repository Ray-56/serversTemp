const cors = require('koa2-cors');

// CORS是W3c标准, 全称是 跨域资源共享(Corss-origin resource sharing)
module.exports = cors({
    origin: ctx => {
        if (ctx.url === '/test') {
            return false; // 地址为/test 不允许
        };
        return '*'; // 允许来自所有域请求
    },
    exposeHeaders: [ 'WWW-Authenticate', 'Server-Authorization' ],
    maxAge: 5,
    credentials: true,
    allowMethods: [ 'GET', 'POST', 'DELETE' ],
    allowHeaders: [ 'Content-type', 'Authorization', 'Accept' ]
});
const Koa = require('koa');
const koaSwagger = require('koa2-swagger-ui');
const routes = require('./routes');
const bodyparser = require('koa-bodyparser');
const jwt = require('./app/middlewares/jwt');
const mongoose = require('mongoose');
const corsMiddleware = require('./app/middlewares/cors');
global.log = console.log.bind(console);

// 连接数据库
mongoose.connect('mongodb://localhost:27017/serversTemp');
const db = mongoose.connection;
// mongoose.Promise = global.Promise;
db.on('error', err => {
    log('数据库连接失败', err)
}).on('open', () => {
    log('数据库连接成功!')
});

const app = new Koa();

app.use(corsMiddleware);
app.use(bodyparser());

// 手动处理401 系统错误不暴露给用户
app.use((ctx, next) => {
    return next().catch(err => {
        if (401 == err.status) {
            ctx.status = 401;
            ctx.body = '未授权!'
        } else {
            throw err;
        }
    })
});
app.use(jwt);

/* app.use( // 显示swagger文档, 需要swagger.json文件 TODO: 生成swagger.json功能
    koaSwagger({
        routePrefix: '/swagger',
        swaggerOptions: {
            url: 'http://petstore.swagger.io/v2/swagger.json'
        }
    })
); */

routes.prefix('/api');
routes.get('/', (ctx, next) => {
    ctx.body = '欢迎来到这个restful模板接口服务!'
});

app.use(routes.routes(), routes.allowedMethods());

app.listen(3333, '0.0.0.0')
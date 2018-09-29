const Router = require('koa-router');
const user = require('./user');
const login = require('./login');

const router = Router();

// routes表示的是路由的嵌套处理
router.use(user.routes(), user.allowedMethods());
router.use(login.routes(), login.allowedMethods());

module.exports = router;
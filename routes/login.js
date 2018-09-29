const Router = require('koa-router');
const authenticate = require('../app/middlewares/authenticate');

const router = Router();

router.post('/login', authenticate.login);

module.exports = router;

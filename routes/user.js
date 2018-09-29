const Router = require('koa-router');
const userController = require('../app/controllers/user');

const router = Router();

router.prefix('/user');
router.get('/', (ctx, next) => {
    ctx.body = '这是api/user'
});

router.get('/getList', userController.find);

router.post('/add', userController.add);

router.post('/update', userController.update);

router.post('/delete', userController.delete);

module.exports = router;

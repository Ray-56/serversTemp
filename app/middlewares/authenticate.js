// 进行身份验证
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../../public/config');

const userList = [
    {
        name: 'admin',
        password: '123456'
    }
];

class AuthConstroller {
    login(ctx) {
        const { name, password } = ctx.request.body;

        const user = userList.find(i => i.name == name);

        if (user && user.password == password) {
            const userToken = {role: name};
            ctx.status = 200;
            ctx.body = {
                token: jwt.sign(userToken, JWT_SECRET, { expiresIn: '24h'}), // expiresIn 有效时间
                message: '登录成功',
                success: true
            };
            return;
        };

        ctx.status = 401;
        ctx.body = {
            message: '用户名或密码错误!',
            success: false
        };
    }
};

module.exports = new AuthConstroller();
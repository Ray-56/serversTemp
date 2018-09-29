const user = require('../models/user');
const _ = require('lodash');


class User {
    async find(ctx, next) {
        const res = await user.find();
        ctx.body = res;
    }

    async add(ctx) {
        try {
            const { body } = ctx.request;
            const res = await new user(body).save();
            ctx.body = res;
        } catch (err) {
            
            if (err.code === 11000) {
                ctx.throw(422, 'name repeat');
                return;
            };
            ctx.throw(422);
        }
    }

    async update(ctx) {
        try {
            const { body } = ctx.request;
            const res = await user.findByIdAndUpdate(body.id, body);
            if (!res) {
                ctx.throw(404);
            };
            ctx.body = {
                message: '修改成功!',
                success: true,
                data: res
            };
        } catch (err) {
            ctx.throw(422)
        }
    }

    async delete(ctx) {
        try {
            let { ids } = ctx.request.body;
            ids = JSON.parse(ids);
            const res = await user.remove({ _id: { $in: ids }});
            
            if (ids.length === res.n) {
                ctx.body = {
                    success: true,
                    message: '删除成功'
                };
                return;
            };
            ctx.body = {
                success: false,
                message: '存在无法删除的'
            };
        } catch (err) {
            ctx.throw(err)
        }
    }
};

module.exports = new User();
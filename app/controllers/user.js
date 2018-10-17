const user = require('../models/user');
const _ = require('lodash');
const path = require('path');
const service = require('../service')


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

    async upload(ctx) {
        try {
            const rootPath = path.dirname(require.main.filename); // 根目录
            const serverPath = path.join(rootPath, './public/uploads/'); // 本地存储文件目录

            const result = await service.qn.uploadFile(ctx, {
                fileType: 'images', // 文件名称
                path: serverPath
            });
            const imgPath = path.join(serverPath, result.imgPath);
            const qiniu = await service.qn.uptoQiniu(imgPath, result.imgKey);
            const outUrl = 'http://pgf82afls.bkt.clouddn.com'; // http://xxxx(你的外链或者解析后的七牛的路径), 七牛生成的外链地址(一个月生命)
            ctx.body = {
                success: true,
                imgUrl: `${outUrl}/${qiniu.key}`
            };
        } catch (err) {
            ctx.throw(err)
        }
    }
};

module.exports = new User();
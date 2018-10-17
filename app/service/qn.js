/* 
 * **七牛上传文件服务**
 * 
 * 七牛对应机房对应的对象:
 * 华东 qiniu.zone.Zone_z0
 * 华北 qiniu.zone.Zone_z1
 * 华南 qiniu.zone.Zone_z2
 * 北美 qiniu.zone.Zone_na0
 */
const qiniu = require('qiniu');
const Busboy = require('busboy'); 
const path = require('path');
const fs = require('fs');
const accessKey = 'tmsWy9r5UTtiv6W5pOB6baJsQxknWqAjLxCGLt4Z';
const secretKey = 'WgMSood50k_5YaPlHRmlZ5mGIpiXaHNNSOX3DTbi';

module.exports = class Qn {
    // 写入目录 
    _mkdirsSync(dirname) {
        if(fs.existsSync(dirname)) { // 目录存在直接返回 true
            return true;
        };
        if(this._mkdirsSync(path.dirname(dirname))) {
            fs.mkdirSync(dirname);
            return true;
        };
        return false;
    }

    // 获取后缀名
    _getSuffix(fileName) {
        return fileName.split('.').pop();
    }

    // 重命名
    _rename(fileName) {
        return Math.random().toString(16).substr(2) + '.' + this._getSuffix(fileName);
    }

    // 删除文件
    _removeTemImage(path) {
        fs.unlink(path, err => {
            if (err) {
                throw err;
            };
        });
    }

    uptoQiniu(filePath, key) {
        const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
        const options = {
            scope: 'images', // 存储空间
        };
        const putPolicy = new qiniu.rs.PutPolicy(options);
        const uploadToken = putPolicy.uploadToken(mac);
        const config = new qiniu.conf.Config();
        config.zone = qiniu.zone.Zone_z0; // 机房对象 华东
        const formUploader = new qiniu.form_up.FormUploader(config);
        const localFile = filePath; // 本地文件地址
        const putExtra = new qiniu.form_up.PutExtra();
    
        // 文件上传
        return new Promise((res, rej) => {
            formUploader.putFile(uploadToken, key, localFile, putExtra, (respErr, respBody, respInfo) => {
                if(respErr) {
                    rej(respErr);
                };
                // respInfo.statusCode === 200
                res(respBody);
    
                // 删除本地文件
                this._removeTemImage(filePath);
            });
        });
    }

    // 上传到本地服务器
    uploadFile(ctx, options) {
        const _busboy = new Busboy({headers: ctx.req.headers});
        const fileType = options.fileType;
        const filePath = path.join(options.path, fileType);
        const confirm = this._mkdirsSync(filePath);
        if(!confirm) return;

        return new Promise((res, rej) => {
            _busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
                const fileName = this._rename(filename);
                const saveTo = path.join(path.join(filePath, fileName));
                file.pipe(fs.createWriteStream(saveTo));
                file.on('end', () => {
                    res({
                        imgPath: `/${fileType}/${fileName}`,
                        imgKey: fileName
                    })
                });
            });

            _busboy.on('finish', () => {
                console.log('finished...');
            });

            _busboy.on('error', (err) => {
                rej(err);
            });

            ctx.req.pipe(_busboy);
        });
    }
};

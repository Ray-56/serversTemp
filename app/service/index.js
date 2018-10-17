// 定义第三方服务: eg: 七牛云、第三方手机端型验证码等服务
const Qn = require('./qn'); // 七牛上传文件 图片等

module.exports = {
    qn: new Qn()
};
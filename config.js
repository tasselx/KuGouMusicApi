// 应用配置
module.exports = {
  // 服务器配置
  server: {
    port: 3000,
    host: '0.0.0.0',
    corsAllowOrigin: '*', // 或指定具体域名，如 'http://localhost:8080'
  },

  // 平台配置
  // 可选值: 'lite' (概念版) 或 '' (标准版)
  platform: 'lite',

  // 代理配置
  // 格式: 'http://127.0.0.1:7890' 或留空不使用代理
  proxy: '',
};


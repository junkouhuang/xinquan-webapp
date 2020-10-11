module.exports = {
  baseUrl: './',
  productionSourceMap: false,
  devServer: {
    proxy: {
      '/api': {
        target: 'https://www.xinquanjk.com',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}

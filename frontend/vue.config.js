let path = require("path");

module.exports = {
    outputDir: path.resolve('../backend/pub'),
    devServer: {
        proxy: {
            '/api': {
                target: 'http://localhost:3000/api',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }
}
module.exports = {
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
    },
    outputDir: '../backend/pub',
    pages: {
        index: {
            entry: 'src/main.js',
            template: './index.html'
        }
    }
}
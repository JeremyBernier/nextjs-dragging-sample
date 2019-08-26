const withCSS = require('@zeit/next-css')
module.exports = withCSS({
  webpack: (config, { dev }) => {
    if (dev) {
      config.module.rules.push({
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: Object.assign({ emitWarning: dev },
          require('./.eslintrc.js'))
      })
    }
    return config
  }
})
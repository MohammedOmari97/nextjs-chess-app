// module.exports = {
//   reactStrictMode: true,
//   webpack5: true,
// }

const compose = require("next-compose")

module.exports = compose([
  {
    webpack(config, options) {
      config.module.rules.push({
        test: /.mp3$/,
        use: {
          loader: "file-loader",
        },
      })
      return config
    },
  },
  {
    reactStrictMode: true,
    webpack5: true,
    images: {deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840]},
  },
])

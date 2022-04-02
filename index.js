const HtmlWebpackPlugin = require('html-webpack-plugin')
const NAME = 'InlineRuntimeChunkHtmlWebpackPlugin'

class InlineRuntimeChunkHtmlWebpackPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap(NAME, (compilation) => {
      const { runtimeChunk } = compiler.options.optimization || {}
      if (!runtimeChunk) {
        const msg = [
          '[inline-runtime-chunk-html-webpack-plugin]: optimization.runtimeChunk need to be turned on.',
          'See: https://github.com/fe-luna/inline-runtime-chunk-html-webpack-plugin',
        ]
        console.warn(msg.join('\n') + '\n')
        return
      }

      const { publicPath } = compiler.options.output || {}
      if (publicPath === undefined || publicPath === 'auto') {
        const msg = [
          '[inline-runtime-chunk-html-webpack-plugin]: output.publicPath can\'t be "auto" (default value),',
          'since publicPath can\'t not automatically determine after inline runtime chunk.',
          'For example, you can set output.publicPath to \'\' (relative to HTML page).',
          'See: https://webpack.js.org/configuration/output/#outputpublicpath',
        ]
        console.warn(msg.join('\n') + '\n')
        return
      }

      HtmlWebpackPlugin.getHooks(compilation).alterAssetTags.tapAsync(NAME, (data, cb) => {
        const runtimeFiles = Array.from(compilation.entrypoints.values()).reduce((acc, entry) => {
          const files = entry._runtimeChunk ? entry._runtimeChunk.files.values() : []
          acc.push(...files)
          return acc
        }, [])

        data.assetTags.scripts.forEach((script) => {
          const fileName = ((script.attributes && script.attributes.src) || '').replace(/.*\//, '')
          if (runtimeFiles.includes(fileName)) {
            const asset = compilation.assets[fileName]
            if (asset) {
              script.innerHTML = asset.source()
              script.attributes = {}
              delete compilation.assets[fileName]
            }
          }
        })

        cb(null, data)
      })
    })
  }
}

module.exports = InlineRuntimeChunkHtmlWebpackPlugin

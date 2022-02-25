const prodPkugins = []
if (process.env.NODE_ENV === 'prodiction') {
  prodPkugins.push('transform-remove-console')
}
module.exports = {
  'presets': [
    '@vue/app'
  ],
  'plugins': [
    [
      'component',
      {
        'libraryName': 'element-ui',
        'styleLibraryName': 'theme-chalk'
      }
    ],
    ...prodPkugins
  ]
}

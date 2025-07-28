const path = require('path')

module.exports = {
  i18n: {
    locales: ['en', 'id'],
    defaultLocale: 'id',
    localeDetection: true
  },
  localePath: path.resolve('./public/locales')
}

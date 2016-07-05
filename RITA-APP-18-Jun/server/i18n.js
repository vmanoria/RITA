'use strict';

var i18n = require('i18n');

module.exports = function (app) {
    i18n.configure({
        locales: ['en', 'es', 'ja'],
        fallbacks: {
            'es-AR': 'es',
            'es-BO': 'es',
            'es-CL': 'es',
            'es-CO': 'es',
            'es-CR': 'es',
            'es-DO': 'es',
            'es-EC': 'es',
            'es-SV': 'es',
            'es-GT': 'es',
            'es-HN': 'es',
            'es-MX': 'es',
            'es-NI': 'es',
            'es-PA': 'es',
            'es-PY': 'es',
            'es-PE': 'es',
            'es-PR': 'es',
            'es-ES': 'es',
            'es-UY': 'es',
            'es-VE': 'es',
            'ja-JP': 'ja'
        },
        directory: __dirname + '/../i18n',
        defaultLocale: 'en'
    });

    app.use(i18n.init);
    console.log("i18n module initialized. Default locale: " + i18n.getLocale());
}
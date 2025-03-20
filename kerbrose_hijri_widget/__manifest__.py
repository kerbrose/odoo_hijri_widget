{
    'name': 'Hijri Date Widget',
    'version': '15.0.1.2.0',
    'summary': 'Um Alqura Hijri date widget',
    'description': '''this module would enable hijri date widget across Odoo platform''',
    'author': 'Khaled Said (kerbrose@hotmail.com)',
    'website': 'https://kerbrose.github.io/',
    'license': 'LGPL-3',
    'category': 'Tools',
    'depends': [
        'account',
        'base',
        'web'
    ],
    'data': [
    ],
    'demo': [
        ''
    ],
    'auto_install': False,
    'application': True,
    'installable': True,
    'assets': {
        'web._assets_common_styles': [
            'kerbrose_hijri_widget/static/lib/tempusdominus6/tempusdominus.css',
        ],
        'web._assets_common_scripts': [
            'kerbrose_hijri_widget/static/lib/popper/popper.js',
            'kerbrose_hijri_widget/static/lib/fontawesome/fontawesome.js',
            'kerbrose_hijri_widget/static/lib/tempusdominus6/tempusdominus.js',
        ],
        'web.assets_backend': [
            'kerbrose_hijri_widget/static/src/js/k_td_hijri_date_picker.js',
        ],
    },
    'qweb': [

    ],
    'images': ['static/description/icon.png'],
    # 'currency ': 'USD',
    # 'price': 60,
    'support': 'kerbrose@hotmail.com',
}

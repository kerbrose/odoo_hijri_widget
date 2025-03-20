{
    'name': 'Hijri Date Widget',
    'version': '16.0.0.0.1',
    'summary': 'Um Alqura Hijri date widget',
    'description': '''this module would enable hijri date widget across Odoo platform''',
    'author': 'Khaled Said (kerbrose)',
    'website': 'https://kerbrose.github.io/',
    'category': 'Hidden/Tools',
    'depends': [
        'account',
        'base',
        'web'
    ],
    'data': [
        'views/account_move.xml',
    ],
    'demo': [
        ''
    ],
    'auto_install': False,
    'application': False,
    'installable': True,
    'assets': {
        'web.assets_common': [
            'kerbrose_hijri_widget/static/lib/tempusdominus6/tempusdominus.css',
            'kerbrose_hijri_widget/static/lib/popper/popper.js',
            # 'kerbrose_hijri_widget/static/lib/fontawesome/fontawesome.js',
            'kerbrose_hijri_widget/static/lib/tempusdominus6/tempusdominus.js',
        ],
        'web.assets_backend': [
            'kerbrose_hijri_widget/static/src/datepicker_hijri/datepicker_hijri.js',
            'kerbrose_hijri_widget/static/src/datepicker_hijri/datepicker_hijri.xml',
            'kerbrose_hijri_widget/static/src/fields/date_field_hijri.js',
            'kerbrose_hijri_widget/static/src/fields/date_field_hijri.xml',
            'kerbrose_hijri_widget/static/src/fields/datetime_field_hijri.js',
            'kerbrose_hijri_widget/static/src/fields/datetime_field_hijri.xml',
        ]
    },
    'qweb': [],
    'images': ['static/description/icon.svg'],
    'license': 'OPL-1',
    'currency ': 'USD',
    'price': 16,
    'support': 'contact the developer',
}

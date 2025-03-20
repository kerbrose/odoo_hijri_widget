from odoo import fields, models


class AccountMove(models.Model):
    _inherit = "account.move"

    date_hijri = fields.Date()
/** @odoo-module **/

import { DateTimePickerHijri } from "@kerbrose_hijri_widget/datepicker_hijri/datepicker_hijri";
import { areDateEquals, formatDateTime } from "@web/core/l10n/dates";
import { _lt } from "@web/core/l10n/translation";
import { registry } from "@web/core/registry";
import { standardFieldProps } from "@web/views/fields/standard_field_props";

import { Component } from "@odoo/owl";


class DateTimeFieldHijri extends Component {
    setup() {
        /**
         * The last value that has been commited to the model.
         * Not changed in case of invalid field value.
         */
        this.lastSetValue = null;
        this.revId = 0;
    }
    get formattedValue() {
        // return formatDateTime(this.props.value);
        return this.props.value;
    }

    onDateTimeChanged(date) {
        if (!areDateEquals(this.props.value || "", date)) {
            this.revId++;
            this.props.update(date);
        }
    }
    onDatePickerInput(ev) {
        this.props.setDirty(ev.target.value !== this.lastSetValue);
    }
    onUpdateInput(date) {
        this.props.setDirty(false);
        this.lastSetValue = date;
    }
}

DateTimeFieldHijri.template = "kerbrose_hijri_widget.DateTimeFieldHijri";
DateTimeFieldHijri.components = {
    DateTimePickerHijri,
};
DateTimeFieldHijri.props = {
    ...standardFieldProps,
    pickerOptions: { type: Object, optional: true },
    placeholder: { type: String, optional: true },
};
DateTimeFieldHijri.defaultProps = {
    pickerOptions: {},
};

DateTimeFieldHijri.displayName = _lt("Date & Time");
DateTimeFieldHijri.supportedTypes = ["datetime"];

DateTimeFieldHijri.extractProps = ({ attrs }) => {
    return {
        pickerOptions: attrs.options.datepicker,
        placeholder: attrs.placeholder,
    };
};

registry.category("fields").add("hijridt", DateTimeFieldHijri);
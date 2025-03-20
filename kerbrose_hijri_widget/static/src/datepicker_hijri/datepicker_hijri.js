/** @odoo-module **/

import {
    Component,
    onMounted,
    onWillUnmount,
    onWillUpdateProps,
    useExternalListener,
    useRef,
    useState,
} from "@odoo/owl";;
import { isMobileOS } from "@web/core/browser/feature_detection";
import {
    formatDate,
    formatDateTime,
    luxonToMoment,
    luxonToMomentFormat,
    momentToLuxon,
    parseDate,
    parseDateTime,
} from "@web/core/l10n/dates";
import { localization } from "@web/core/l10n/localization";
import { useAutofocus } from "@web/core/utils/hooks";
import { pick } from "@web/core/utils/objects";

const { DateTime } = luxon;

let datePickerId = 0;

/**
 * @param {unknown} value1
 * @param {unknown} value2
 */
function areEqual(value1, value2) {
    if (value1 && value2) {
        // Only compare date values
        return Number(value1) === Number(value2);
    } else {
        return value1 === value2;
    }
}

/**
 * @template {(...args: any[]) => any} F
 * @template T
 * @param {F} fn
 * @param {T} defaultValue
 * @returns {[any, null] | [null, Error]}
 */
function wrapError(fn, defaultValue) {
    return (...args) => {
        const result = [defaultValue, null];
        try {
            result[0] = fn(...args);
        } catch (_err) {
            result[1] = _err;
        }
        return result;
    };
}


export class DatePickerHijri extends Component {

    setup() {
        this.rootRef = useRef("root");
        this.inputRef = useRef("input");
        this.hiddenInputRef = useRef("hiddenInput");
        this.state = useState({ warning: false });

        this.datePickerId = `o_datepicker_hijri_${datePickerId++}`;
        this.isPickerOpen = false;
        this.isPickerChanged = false;
        /** @type {DateTime | null} */
        this.pickerDate = this.props.date;
        this.ignorePickerEvents = true;
        this.td = {};
        this.localeFormat = "ar-SA-islamic-umalqura";
        this.td_settings = {
            localization: {
                today: "اليوم",
                clear: "مسح",
                close: "إغلاق",
                selectMonth: "اختر الشهر",
                previousMonth: "الشهر السابق",
                nextMonth: "الشهر التالي",
                selectYear: "اختر السنة",
                previousYear: "العام السابق",
                nextYear: "العام التالي",
                selectDecade: "اختر العقد",
                previousDecade: "العقد السابق",
                nextDecade: "العقد التالي",
                previousCentury: "القرن السابق",
                nextCentury: "القرن التالي",
                pickHour: "اختر الساعة",
                incrementHour: "أضف ساعة",
                decrementHour: "أنقص ساعة",
                pickMinute: "اختر الدقيقة",
                incrementMinute: "أضف دقيقة",
                decrementMinute: "أنقص دقيقة",
                pickSecond: "اختر الثانية",
                incrementSecond: "أضف ثانية",
                decrementSecond: "أنقص ثانية",
                toggleMeridiem: "تبديل الفترة",
                selectTime: "اخر الوقت",
                selectDate: "اختر التاريخ",
                dayViewHeaderFormat: { month: "long", year: "2-digit" },
                locale: this.localeFormat,
                startOfTheWeek: 0
            },
            display: {
                components: {
                    clock: false
                }
            }
        };

        this.initFormat();
        this.setDateAndFormat(this.props);

        useAutofocus();
        useExternalListener(window, "click", this.onWindowClick, { capture: true });
        useExternalListener(window, "scroll", this.onWindowScroll, { capture: true });

        onMounted(this.onMounted);
        onWillUpdateProps(this.onWillUpdateProps);
        onWillUnmount(this.onWillUnmount);
    }

    onMounted() {
        this.bootstrapTD(this.props);
        this.updateInput(this.date);

        this.addPickerListener("show", () => {
            this.isPickerOpen = true;
            this.inputRef.el.select();
        });
        this.addPickerListener("change", ({ date }) => {
            if (date && this.isPickerOpen) {
                const { locale } = this.getOptions();
                this.isPickerChanged = true;
                this.pickerDate = momentToLuxon(date).setLocale(locale);
                this.updateInput(this.pickerDate);
            }
        });
        this.addPickerListener("hide", () => {
            this.isPickerOpen = false;
            this.onDateChange();
            this.isPickerChanged = false;
        });
        this.addPickerListener("error", () => false);

        this.ignorePickerEvents = false;
    }

    onWillUpdateProps(nextProps) {
        this.ignorePickerEvents = true;
        this.setDateAndFormat(nextProps);
        const shouldUpdate =
            this.props.revId !== nextProps.revId ||
            Object.entries(pick(nextProps, "date", "format")).some(
                ([key, val]) => !areEqual(this.props[key], val)
            );
        if (shouldUpdate && !areEqual(this.pickerDate, nextProps.date)) {
            if (nextProps.date) {
                this.bootstrapTD("date", luxonToMoment(nextProps.date));
            } else {
                this.bootstrapTD("clear");
            }
        }
        if (shouldUpdate) {
            this.updateInput(this.date);
        }
        if (this.isPickerOpen) {
            this.bootstrapTD("hide");
            this.bootstrapTD("show");
        }
        this.ignorePickerEvents = false;
    }

    onWillUnmount() {
        window.$(this.rootRef.el).off(); // Removes all jQuery events
        this.td.dispose();
    }

    addPickerListener(type, listener) {
        return window.$(this.rootRef.el).on(`${type}.datetimepicker`, (ev) => {
            if (this.ignorePickerEvents) {
                return false;
            }
            return listener(ev);
        });
    }

    getOptions() {
        let options = {
            format: this.format,
            locale: this.localeFormat,
        };
        return options;
    }

    initFormat() {
        this.defaultFormat = localization.dateFormat;
        this.formatValue = wrapError(formatDate, "");
        this.parseValue = wrapError(parseDate, false);
        this.isLocal = false;
    }

    setDateAndFormat({ date, locale, format }) {
        if (date && locale) {
            this.date = date.setLocale(locale);
        } else if (date) {
            this.date = date.setLocale(this.localeFormat);
        } else {
            this.date = date;
        }
        // Fallback to default localization format in `@web/core/l10n/dates.js`.
        this.format = format || this.defaultFormat;
        this.staticFormat = "yyyy-MM-dd";
    }

    updateInput(value) {
        value = value || false;
        const options = this.getOptions();
        const [formattedValue, error] = this.formatValue(value, options);

        if (!error) {
            // this.inputRef.el.value = formattedValue;
            this.inputRef.el.value = value.toLocaleString();
            [this.hiddenInputRef.el.value] = this.formatValue(value, {
                ...options,
                format: this.staticFormat,
            });
            this.props.onUpdateInput(formattedValue);
        }
        return formattedValue;
    }

    bootstrapTD(commandOrParams, ...commandArgs) {
        if (typeof commandOrParams === "object") {
            this.td = new tempusDominus.TempusDominus(this.rootRef.el, this.td_settings);
            const params = {
                ...commandOrParams,
                date: this.date || null,
                format: luxonToMomentFormat(this.staticFormat),
                locale: commandOrParams.locale || (this.date && this.date.locale),
            };
            for (const prop in params) {
                if (params[prop] instanceof DateTime) {
                    params[prop] = luxonToMoment(params[prop]);
                }
            }
            commandOrParams = params;
        }
        if (commandOrParams === "hide") {
            this.td.hide();
        }
    }

    onDateChange() {
        let tdValue = this.td.value;

        // const [value, error] = this.isPickerChanged
        //     ? [this.pickerDate, null]
        //     : this.parseValue(this.inputRef.el.value, this.getOptions());
        let error = false;
        let value = luxon.DateTime.fromJSDate(this.td.dates._dates[0], { "locale": this.localeFormat });
        this.state.warning = value && value > DateTime.local();

        if (error || areEqual(this.date, value)) {
            // Force current value
            this.updateInput(this.date);
        } else {
            this.props.onDateTimeChanged(value);
        }

        if (this.pickerDate) {
            this.inputRef.el.select();
        }
    }

    onInputChange() {
        this.onDateChange();
    }

    onInputInput(ev) {
        this.isPickerChanged = false;
        return this.props.onInput(ev);
    }

    onInputKeydown(ev) {
        switch (ev.key) {
            case "Escape": {
                if (this.isPickerOpen) {
                    ev.preventDefault();
                    ev.stopPropagation();
                    this.bootstrapTD("hide");
                    this.inputRef.el.select();
                }
                break;
            }
            case "Tab": {
                this.bootstrapTD("hide");
                break;
            }
            case "Enter": {
                this.onInputChange();
                break;
            }
        }
    }

    onWindowClick({ target }) {
        if (target.closest(".bootstrap-datetimepicker-widget") || target.closest(".tempus-dominus-widget")) {
            return;
        } else if (this.rootRef.el.contains(target)) {
            this.bootstrapTD("toggle");
        } else {
            this.bootstrapTD("hide");
        }
    }

    onWindowScroll(ev) {
        if (!isMobileOS() && ev.target !== this.inputRef.el) {
            this.bootstrapTD("hide");
        }
    }
}

DatePickerHijri.defaultProps = {
    calendarWeeks: true,
    icons: {
        clear: "fa fa-delete",
        close: "fa fa-check primary",
        date: "fa fa-calendar",
        down: "fa fa-chevron-down",
        next: "fa fa-chevron-right",
        previous: "fa fa-chevron-left",
        time: "fa fa-clock-o",
        today: "fa fa-calendar-check-o",
        up: "fa fa-chevron-up",
    },
    inputId: "",
    maxDate: DateTime.fromObject({ year: 9999, month: 12, day: 31 }),
    minDate: DateTime.fromObject({ year: 1000 }),
    useCurrent: false,
    widgetParent: "body",
    onInput: () => { },
    onUpdateInput: () => { },
    revId: 0,
};
DatePickerHijri.props = {
    // Components props
    onDateTimeChanged: Function,
    date: { type: [DateTime, { value: false }], optional: true },
    warn_future: { type: Boolean, optional: true },
    // Bootstrap datepicker options
    buttons: {
        type: Object,
        shape: {
            showClear: Boolean,
            showClose: Boolean,
            showToday: Boolean,
        },
        optional: true,
    },
    calendarWeeks: { type: Boolean, optional: true },
    format: { type: String, optional: true },
    icons: {
        type: Object,
        shape: {
            clear: String,
            close: String,
            date: String,
            down: String,
            next: String,
            previous: String,
            time: String,
            today: String,
            up: String,
        },
        optional: true,
    },
    inputId: { type: String, optional: true },
    keyBinds: { validate: (kb) => typeof kb === "object" || kb === null, optional: true },
    locale: { type: String, optional: true },
    maxDate: { type: DateTime, optional: true },
    minDate: { type: DateTime, optional: true },
    readonly: { type: Boolean, optional: true },
    useCurrent: { type: Boolean, optional: true },
    widgetParent: { type: String, optional: true },
    daysOfWeekDisabled: { type: Array, optional: true },
    placeholder: { type: String, optional: true },
    onInput: { type: Function, optional: true },
    onUpdateInput: { type: Function, optional: true },
    revId: { type: Number, optional: true },
};

DatePickerHijri.template = "kerbrose_hijri_widget.DatePickerHijri";

const DateTimePickerHijri = __exports.DateTimePickerHijri = class DateTimePickerHijri extends DatePickerHijri {
    setup() {
        this.rootRef = useRef("root");
        this.inputRef = useRef("input");
        this.hiddenInputRef = useRef("hiddenInput");
        this.state = useState({ warning: false });

        this.datePickerId = `o_datepicker_hijri_${datePickerId++}`;
        this.isPickerOpen = false;
        this.isPickerChanged = false;
        /** @type {DateTime | null} */
        this.pickerDate = this.props.date;
        this.ignorePickerEvents = true;
        this.td = {};
        this.localeFormat = "ar-SA-islamic-umalqura";
        this.td_settings = {
            localization: {
                today: "اليوم",
                clear: "مسح",
                close: "إغلاق",
                selectMonth: "اختر الشهر",
                previousMonth: "الشهر السابق",
                nextMonth: "الشهر التالي",
                selectYear: "اختر السنة",
                previousYear: "العام السابق",
                nextYear: "العام التالي",
                selectDecade: "اختر العقد",
                previousDecade: "العقد السابق",
                nextDecade: "العقد التالي",
                previousCentury: "القرن السابق",
                nextCentury: "القرن التالي",
                pickHour: "اختر الساعة",
                incrementHour: "أضف ساعة",
                decrementHour: "أنقص ساعة",
                pickMinute: "اختر الدقيقة",
                incrementMinute: "أضف دقيقة",
                decrementMinute: "أنقص دقيقة",
                pickSecond: "اختر الثانية",
                incrementSecond: "أضف ثانية",
                decrementSecond: "أنقص ثانية",
                toggleMeridiem: "تبديل الفترة",
                selectTime: "اخر الوقت",
                selectDate: "اختر التاريخ",
                dayViewHeaderFormat: { month: "long", year: "2-digit" },
                locale: this.localeFormat,
                startOfTheWeek: 0
            },
            display: {
                components: {
                    clock: true,
                    hours: true,
                    minutes: true,
                    seconds: true
                }
            }
        };

        this.initFormat();
        this.setDateAndFormat(this.props);

        useAutofocus();
        useExternalListener(window, "click", this.onWindowClick, { capture: true });
        useExternalListener(window, "scroll", this.onWindowScroll, { capture: true });

        onMounted(this.onMounted);
        onWillUpdateProps(this.onWillUpdateProps);
        onWillUnmount(this.onWillUnmount);
    }
    /**
     * @override
     */
    initFormat() {
        this.defaultFormat = localization.dateTimeFormat;
        this.formatValue = wrapError(formatDateTime, "");
        this.parseValue = wrapError(parseDateTime, false);
        this.isLocal = true;
    }

    /**
     * @override
     */
    setDateAndFormat(nextProps) {
        super.setDateAndFormat(nextProps);
        this.staticFormat += ` ${/h/.test(this.format) ? "hh" : "HH"}:mm:ss`;
    }
}

DateTimePickerHijri.defaultProps = {
    ...DatePickerHijri.defaultProps,
    buttons: {
        showClear: false,
        showClose: true,
        showToday: false,
    },
};
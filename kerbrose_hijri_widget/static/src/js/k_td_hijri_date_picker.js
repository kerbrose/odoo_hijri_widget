odoo.define("kerbrose_hijri_widget.basic_fields", function (require) {
    "use strict";

    var core = require("web.core");
    var fields = require("web.basic_fields");
    var registry = require("web.field_registry");

    var _lt = core._lt;

    var HijriDate = fields.InputField.extend({
        description: _lt("Hijri Date"),
        className: "o_field_date",
        tagName: "span",
        supportedFieldTypes: ["date"],
        isQuickEditable: true,
        events: _.defaults(fields.InputField.prototype.events, {}),

        init: function () {
            this._super.apply(this, arguments);
            this.formatOptions.timezone = true;
            this.relatedGeorgianDate = this.nodeOptions.related_georgian_date;
            this.datepickerOptions = _.defaults(
                {},
                this.nodeOptions.datepicker || {},
                { defaultDate: this.value }
            );
            this.localeFormat = "ar-SA-islamic-umalqura"; // BCP 47  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl
            this.td_clock = this.field.type === "datetime" ? true : false;
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
                    startOfTheWeek: 0,
                },
                display: {
                    components: {
                        clock: this.td_clock,
                    },
                },
            };
        },
        start: function () {
            var self = this;
            var prom;
            if (this.mode === "edit") {
                this.datewidget = this._makeDatePicker();
            }
            return Promise.resolve(prom).then(this._super.bind(this));
        },
        _getValue: function () {
            if (this.tdvalue && this.tdvalue instanceof Date) {
                return moment(this.tdvalue).format("YYYY-MM-DD");
            }
            return this.$input.val();
        },
        _makeDatePicker: function () {
            if (this.value && this.value._d) {
                this.td_settings["defaultDate"] = this.value._d;
            }
            let picker = new tempusDominus.TempusDominus(this.$el[0], this.td_settings);
        },
        _renderEdit: function () {
            this._super.apply(this, arguments);
            if (this.value && this.value._d) {
                let fDate = Intl.DateTimeFormat(this.localeFormat).format(this.value._d);
                this.$input.val(fDate);
            }
        },
        _renderReadonly: function () {
            let date = this.value._d;
            if (date && date instanceof Date) {
                let fValue = Intl.DateTimeFormat(this.localeFormat).format(date);
                this.$el.text(fValue);
            } else {
                this.$el.text(this._formatValue(this.value));
            }
        },
        _parseValue: function (value) {
            let date = false;
            if (this.tdvalue && this.tdvalue instanceof Date) {
                date = moment(this.tdvalue);
            }
            return date;
        },
        isValid: function () {
            let isValid = false;
            if (this.$input[0].tdvalue && this.$input[0].tdvalue instanceof Date) {
                isValid = true;
            }
            return isValid;
        },
        _onChange: function (ev) {
            this._super(...arguments);
            if (ev.originalEvent.detail) {
                let isValid = ev.originalEvent.detail.isValid;
                let date = ev.originalEvent.detail.date;
                if (isValid && date !== undefined) {
                    this.$input[0].tdvalue = date;
                    this.tdvalue = date;
                }
                let changes = {};
                if (this.relatedGeorgianDate) {
                    changes[this.name] = moment(date).format("YYYY-MM-DD");
                    changes[this.relatedGeorgianDate] = moment(date);
                    this.trigger_up("field_changed", {
                        dataPointID: this.dataPointID,
                        viewType: this.viewType,
                        changes: changes,
                    });
                }
            }
            this._isDirty = true;
        },
    });

    registry.add("hijri", HijriDate);
});

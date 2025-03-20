<h1>﷽</h1>

<div align="center">
  <img src="kerbrose_hijri_widget/static/description/hijri_demo.gif" alt="Widget Demo" width="100%">
</div>

<p align="center">
  <a href="#intro">مقدمة</a> &#xa0; | &#xa0;
  <a href="#how-to-use">طريقة الإستخدام</a> &#xa0; | &#xa0;
  <a href="#your-support">ادعمنا</a> &#xa0;
</p>

<h2 id="intro">مقدمة</h2>
هذه الوحدة البرمجية للتقويم الهجري لنظام أودو، التابع لتقويم أم القري. حيث أن تقويم أم القري هو حساب مسبق للتقويم القمري تستخدمه السعودية بين المنشآت و لا يعتمد علي التقويم الشرعي.

[للمزيد من المعلومات عن تقويم أم القري.](https://ar.wikipedia.org/wiki/%D8%AA%D9%82%D9%88%D9%8A%D9%85_%D9%87%D8%AC%D8%B1%D9%8A#%D8%AA%D9%82%D9%88%D9%8A%D9%85_%D8%A3%D9%85_%D8%A7%D9%84%D9%82%D8%B1%D9%89)


<h2 id="how-to-use">طريقة الإستخدام</h2>

تقوم بإضافة  `hijri`  ﻷي حقل من نوع  `date`
```xml
<field name="start_date" widget="hijri" />
```
ولو كان هناك حقل آخر مرتبط به عليك إستخدام `related_georgian_date`
```xml
<field name="start_date" widget="hijri" options="{'related_georgian_date':'invoice_date'}"/>
```

<h2 id="your-support">ادعمنا</h2>
<a href="https://www.buymeacoffee.com/kerbrose" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>


<hr />

<h2>Intro</h2>
This is the hijri date widget Odoo module. this is to add support for Umm al-Qura calendar to Odoo system. Saudi Arabia is using such calendar between governemental & commercial entities.


<h2>How to use</h2>

Just add `wiget="hijri"` to the field definition
```xml
<field name="start_date" widget="hijri" />
```
if you want to update another georgian field, use `related_georgian_date`.
```xml
<field name="start_date" widget="hijri" options="{'related_georgian_date':'invoice_date'}"/>
```

<h2>Support Us</h2>
<a href="https://www.buymeacoffee.com/kerbrose" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>



from django.contrib import admin
from django.utils.html import format_html
from jalali_date.admin import ModelAdminJalaliMixin
from jalali_date.widgets import AdminJalaliDateWidget
from django_jalali.db import models as jmodels
from .models import Product


@admin.register(Product)
class ProductAdmin(ModelAdminJalaliMixin, admin.ModelAdmin):
    """
    Production-ready Product admin with full Persian localization
    """
    list_display = [
        'name',
        'get_toman_price',
        'get_jalali_date',
        'is_active'
    ]
    list_filter = [
        'is_active',
        'created_at',
    ]
    search_fields = ['name']
    list_editable = ['is_active']
    readonly_fields = ['created_at']

    # Override formfield for jDateTimeField to use Persian widget
    formfield_overrides = {
        jmodels.jDateTimeField: {'widget': AdminJalaliDateWidget},
    }

    def get_toman_price(self, obj):
        """Format price with thousand separators and Toman suffix"""
        formatted_price = "{:,}".format(obj.price)
        return format_html('<strong>{} تومان</strong>', formatted_price)

    get_toman_price.short_description = "قیمت"
    get_toman_price.admin_order_field = "price"

    def get_jalali_date(self, obj):
        """Format Jalali date as YYYY/MM/DD"""
        if obj.created_at:
            return obj.created_at.strftime('%Y/%m/%d')
        return "-"

    get_jalali_date.short_description = "تاریخ ثبت"
    get_jalali_date.admin_order_field = "created_at"

from django.db import models
from django_jalali.db import models as jmodels


class Product(models.Model):
    """Product model with Persian localization"""
    name = models.CharField(
        max_length=200,
        verbose_name="نام محصول"
    )
    price = models.PositiveIntegerField(
        verbose_name="قیمت (تومان)",
        help_text="قیمت را به تومان وارد کنید"
    )
    created_at = jmodels.jDateTimeField(
        verbose_name="تاریخ ایجاد",
        auto_now_add=True
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name="فعال"
    )

    class Meta:
        verbose_name = "محصول"
        verbose_name_plural = "محصولات"
        ordering = ['-created_at']

    def __str__(self):
        return self.name

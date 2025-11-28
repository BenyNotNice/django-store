"""
Custom template tags and filters for Jalali date conversion
"""
from django import template
from jalali_date import datetime2jalali

register = template.Library()


@register.filter(name='jalali_datetime')
def jalali_datetime(value):
    """
    Convert a Gregorian datetime to Jalali format.

    Usage in template:
        {{ action.action_time|jalali_datetime }}

    Returns a formatted Jalali date/time string in the format: YYYY/MM/DD - HH:MM:SS
    """
    if value is None:
        return ""

    try:
        # Convert to Jalali and format consistently
        jalali_date = datetime2jalali(value)
        return jalali_date.strftime('%Y-%m-%d %H:%M:%S')
    except (ValueError, AttributeError):
        # If conversion fails, return the original value
        return value

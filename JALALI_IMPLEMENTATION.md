# Jalali Calendar Implementation Documentation

## Overview

This document describes the complete implementation of Jalali (Persian) calendar support in the Django Admin Panel, including direct date/time input capabilities and proper display in the user edit history.

## Implementation Components

### 1. Jalali Date/Time Editor with Direct Text Input

**Location:** `store/admin.py`

**Changes Made:**
- Updated `ProductAdmin` to use `SplitJalaliDateTimeField` form class
- Configured `AdminSplitJalaliDateTime` widget for all `jDateTimeField` fields
- This allows users to:
  - Use the calendar widget to select dates
  - Directly type dates in Jalali format (YYYY-MM-DD)
  - Input time separately in HH:MM:SS format

**Code:**
```python
from jalali_date.widgets import AdminSplitJalaliDateTime
from jalali_date.fields import SplitJalaliDateTimeField

formfield_overrides = {
    jmodels.jDateTimeField: {
        'form_class': SplitJalaliDateTimeField,
        'widget': AdminSplitJalaliDateTime
    },
}
```

### 2. Form Field Validation

**Validation is handled automatically by:**
- `JalaliDateField` (from `jalali_date.fields`)
- `SplitJalaliDateTimeField` (from `jalali_date.fields`)

**Supported Input Formats:**
- Date: `YYYY-MM-DD` or `YYYY-M-D` (e.g., `1403-09-07` or `1403-9-7`)
- Time: `HH:MM:SS` or `HH:MM` (e.g., `14:30:00` or `14:30`)

**Validation Features:**
- Automatically converts user-entered Jalali dates to internal datetime objects
- Validates day/month ranges according to Persian calendar rules
- Handles leap years correctly
- Provides Persian error messages for invalid inputs

### 3. User Edit History with Jalali Dates

**Location:** `store/templates/admin/object_history.html`

**Changes Made:**
- Created custom `object_history.html` template that overrides Django's default
- Applied custom `jalali_datetime` filter to all timestamps in history log
- All dates and times now display in Jalali format: `YYYY/MM/DD - HH:MM:SS`

**Template Filter Location:** `store/templatetags/jalali_filters.py`

**Filter Code:**
```python
@register.filter(name='jalali_datetime')
def jalali_datetime(value):
    """Convert a Gregorian datetime to Jalali format"""
    if value is None:
        return ""
    try:
        jalali_date = datetime2jalali(value)
        return jalali_date.strftime('%Y/%m/%d - %H:%M:%S')
    except (ValueError, AttributeError):
        return value
```

## File Structure

```
store/
├── admin.py                          # Updated with Jalali widgets
├── models.py                         # Uses jDateTimeField
├── templatetags/
│   ├── __init__.py                   # Template tags package
│   └── jalali_filters.py             # Custom Jalali date filter
└── templates/
    └── admin/
        └── object_history.html       # Override for history view

config/
└── settings.py                       # Updated TEMPLATES DIRS
```

## Configuration

### Settings (config/settings.py)

**Templates Configuration:**
```python
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "store" / "templates"],  # Added custom templates directory
        "APP_DIRS": True,
        ...
    },
]
```

**Existing Jalali Configuration:**
```python
JALALI_DATE_DEFAULTS = {
    'Strftime': {
        'date': '%Y/%m/%d',
        'datetime': '%Y/%m/%d - %H:%M:%S',
    },
    ...
}
```

## Testing

### Test Script

A comprehensive test script is provided: `test_jalali_implementation.py`

**Run tests:**
```bash
source venv/bin/activate
python test_jalali_implementation.py
```

**Test Coverage:**
1. Jalali date/time conversion
2. Product date display
3. Admin log entry conversion
4. Form field validation
5. Template filter functionality

### Manual Testing

1. **Start the development server:**
   ```bash
   source venv/bin/activate
   python manage.py runserver
   ```

2. **Access admin panel:**
   ```
   http://127.0.0.1:8000/admin/
   ```

3. **Test Direct Date Input:**
   - Navigate to a product edit page
   - Find the date/time field (if editable)
   - Type a Jalali date directly: `1403-09-07`
   - Type a time: `14:30:00`
   - Save and verify conversion

4. **Test Object History:**
   - Edit any product
   - Navigate to History button
   - Verify all timestamps are in Jalali format: `YYYY/MM/DD - HH:MM:SS`

## Technical Details

### Date Storage

- **Database:** Stores dates as Gregorian datetime (Django standard)
- **Display:** Converts to Jalali on-the-fly
- **Input:** Accepts Jalali format, converts to Gregorian before saving

### Conversion Process

```
User Input (Jalali) → Form Validation → Conversion to Gregorian → Database Storage
Database Retrieval → Conversion to Jalali → Display to User
```

### Widget Behavior

**AdminSplitJalaliDateTime:**
- Splits date and time into separate input fields
- Date field includes calendar picker widget
- Date field accepts direct text input
- Time field is a standard time input
- Both fields support Persian/Farsi localization

## Known Limitations

1. **Read-only fields:** The `created_at` field is read-only, so direct input is not available for that field
2. **Calendar widget:** The calendar widget is currently implemented for date selection
3. **Date formats:** Primary format is `YYYY-MM-DD` with hyphens (slashes are converted to hyphens internally)

## Benefits of This Implementation

1. **User Experience:**
   - Users can type dates directly without clicking through calendar
   - Familiar Persian date format
   - Consistent Jalali dates throughout admin interface

2. **Data Integrity:**
   - Proper validation prevents invalid dates
   - Correct handling of Persian calendar rules
   - Leap year support

3. **Consistency:**
   - All dates in admin panel use same format
   - History log matches form input format
   - Configuration centralized in settings

## Future Enhancements

Possible improvements:
1. Add support for multiple date input formats (e.g., `1403/9/7` with slashes)
2. Add date range validation
3. Implement autocomplete for date input
4. Add keyboard shortcuts for date navigation
5. Support for Hijri calendar alongside Jalali

## Troubleshooting

### Common Issues

**Issue:** Template filter not found
- **Solution:** Ensure `store` app is in `INSTALLED_APPS`
- **Solution:** Restart development server after adding template tags

**Issue:** Date validation errors
- **Solution:** Use format `YYYY-MM-DD` (e.g., `1403-09-07`)
- **Solution:** Ensure month is 1-12 and day is valid for that month

**Issue:** History dates still showing Gregorian
- **Solution:** Verify template is in correct location: `store/templates/admin/object_history.html`
- **Solution:** Check `TEMPLATES[0]['DIRS']` includes templates directory
- **Solution:** Clear browser cache

## References

- **django-jalali:** https://github.com/slashmili/django-jalali
- **django-jalali-date:** https://github.com/a-roomana/django-jalali-date
- **jdatetime:** Python Jalali datetime library

## Conclusion

This implementation provides a complete Jalali calendar solution for the Django admin panel, supporting both direct text input and calendar widget selection, with proper validation and consistent display throughout the interface including the user edit history.

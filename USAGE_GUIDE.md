# Jalali Calendar Admin Panel - Usage Guide

## Quick Start

### 1. Running the Server

```bash
# Activate virtual environment
source venv/bin/activate

# Run development server
python manage.py runserver

# Access admin panel
# Open browser: http://127.0.0.1:8000/admin/
```

### 2. Using Direct Date Input in Admin Forms

When editing a product (or any model with Jalali date fields):

**Date Field:**
- **Calendar Widget:** Click the calendar icon to select a date visually
- **Direct Input:** Type the date directly in format: `YYYY-MM-DD`
  - Example: `1403-09-07` (7th of Azar, 1403)
  - Example: `1404-01-01` (1st of Farvardin, 1404)

**Time Field:**
- Type time in format: `HH:MM:SS` or `HH:MM`
  - Example: `14:30:00` (2:30 PM)
  - Example: `09:15` (9:15 AM)

**Combined Example:**
```
Date: 1403-09-07
Time: 14:30:00
```
This represents: 7th Azar 1403 at 2:30 PM

### 3. Viewing Object History

**Steps:**
1. Navigate to any product in admin
2. Click the "History" button (top right)
3. View all changes with Jalali timestamps

**History Display Format:**
```
تاریخ/زمان                    کاربر          عملیات
1404/09/06 - 19:52:24         admin          Changed name and price
1404/09/06 - 19:37:55         admin          Added
```

### 4. Supported Date Formats

**Input Formats (for forms):**
- `YYYY-MM-DD` (primary format)
- `YYYY-M-D` (single digit month/day)
- Examples:
  - `1403-09-07` ✓
  - `1403-9-7` ✓
  - `1403-12-29` ✓

**Display Formats (in lists and history):**
- Date only: `YYYY/MM/DD` (e.g., `1403/09/07`)
- Date + Time: `YYYY/MM/DD - HH:MM:SS` (e.g., `1403/09/07 - 14:30:00`)

## Persian Calendar Reference

### Month Names and Numbers

| Number | Persian Name | Days | English Equivalent (approx) |
|--------|-------------|------|----------------------------|
| 01     | فروردین     | 31   | March-April               |
| 02     | اردیبهشت    | 31   | April-May                 |
| 03     | خرداد       | 31   | May-June                  |
| 04     | تیر         | 31   | June-July                 |
| 05     | مرداد       | 31   | July-August               |
| 06     | شهریور      | 31   | August-September          |
| 07     | مهر         | 30   | September-October         |
| 08     | آبان        | 30   | October-November          |
| 09     | آذر         | 30   | November-December         |
| 10     | دی          | 30   | December-January          |
| 11     | بهمن        | 30   | January-February          |
| 12     | اسفند       | 29/30* | February-March           |

*اسفند has 30 days in leap years, 29 in regular years

### Current Date Reference

As of this implementation:
- Gregorian: November 27, 2025
- Jalali: 06 Azar 1404 (1404/09/06)

### Leap Year Rules

The Persian calendar has leap years every 4-5 years following a 33-year cycle.

**Recent and upcoming leap years:**
- 1399 (30 days in اسفند)
- 1403 (30 days in اسفند)
- 1407 (30 days in اسفند)
- 1412 (30 days in اسفند)

## Common Tasks

### Adding a New Product

1. Go to Admin → Products → Add Product
2. Fill in:
   - نام محصول (Name): Enter product name
   - قیمت (Price): Enter price in Tomans
   - فعال (Active): Check if product is active
3. The creation date is automatically set to current Jalali date/time
4. Click "ذخیره" (Save)

### Editing a Product

1. Go to Admin → Products
2. Click on product name
3. Modify fields as needed
4. If you need to change date/time fields (for non-readonly fields):
   - Use calendar widget OR
   - Type date directly: `1403-09-07`
   - Type time separately: `14:30:00`
5. Click "ذخیره" (Save)

### Checking Edit History

1. Open any product
2. Click "تاریخچه" (History) button
3. View all changes with:
   - Jalali date/time of change
   - Username who made the change
   - Description of what changed

## Validation Rules

### Date Validation

**Valid Examples:**
- `1403-01-01` - First day of Farvardin
- `1403-06-31` - Last day of Shahrivar
- `1403-12-29` - Valid in non-leap year
- `1403-12-30` - Valid ONLY in leap years

**Invalid Examples:**
- `1403-00-01` - Month cannot be 0
- `1403-13-01` - Month cannot be > 12
- `1403-01-32` - Day cannot be > 31
- `1403-07-31` - Mehr only has 30 days
- `1403-12-30` - اسفند has 30 days only in leap years

### Time Validation

**Valid Examples:**
- `00:00:00` - Midnight
- `12:30:00` - 12:30 PM
- `23:59:59` - One second before midnight
- `14:30` - 2:30 PM (seconds optional)

**Invalid Examples:**
- `24:00:00` - Hour cannot be 24
- `12:60:00` - Minute cannot be >= 60
- `12:30:60` - Second cannot be >= 60

## Troubleshooting

### "Enter a valid date" error

**Problem:** You entered an invalid date
**Solutions:**
- Check format is `YYYY-MM-DD`
- Verify month is between 1-12
- Verify day is valid for that month
- Check if it's a leap year for اسفند 30

### Date widget not showing

**Problem:** Calendar widget is not appearing
**Solutions:**
- Clear browser cache
- Check JavaScript console for errors
- Ensure static files are loaded: `python manage.py collectstatic`
- Restart development server

### History showing Gregorian dates

**Problem:** Object history still shows Gregorian calendar
**Solutions:**
- Verify you're accessing the correct history page
- Clear browser cache and refresh
- Check server logs for template errors
- Ensure template override is in correct location

### Cannot input date manually

**Problem:** Date input field is read-only
**Solutions:**
- Check if field is marked as `readonly_fields` in admin
- Some fields like `auto_now_add` cannot be edited
- For `created_at`, this is intentional (auto-set on creation)

## Tips and Best Practices

1. **Date Entry:**
   - Use leading zeros for consistency: `1403-09-07` not `1403-9-7`
   - Use 24-hour time format
   - Include seconds for precision: `14:30:00` not just `14:30`

2. **Validation:**
   - Double-check month and day ranges before submitting
   - Be aware of leap year differences for اسفند
   - Time fields are separate from date fields

3. **History Tracking:**
   - Every change is recorded with precise Jalali timestamp
   - History is automatically maintained by Django
   - Use history to track when changes were made

4. **Performance:**
   - Date conversion happens on-the-fly
   - Database stores Gregorian dates (standard)
   - No performance impact on queries or filtering

## Support and Documentation

**Technical Documentation:**
- Full implementation details: `JALALI_IMPLEMENTATION.md`
- Test script: `test_jalali_implementation.py`

**Package Documentation:**
- django-jalali: https://github.com/slashmili/django-jalali
- django-jalali-date: https://github.com/a-roomana/django-jalali-date

**Running Tests:**
```bash
source venv/bin/activate
python test_jalali_implementation.py
```

## Examples

### Example 1: Adding Product with Current Date

```
Navigate to: Admin → Products → Add Product

نام محصول: لپ‌تاپ دل
قیمت: 25000000
فعال: ✓

تاریخ ایجاد: 1404/09/06 - 19:37:55 (automatically set)

Click: ذخیره
```

### Example 2: Viewing History

```
Navigate to: Product → History

تاریخ/زمان                    کاربر          عملیات
1404/09/06 - 19:52:24         admin          Changed price from 20000000 to 25000000
1404/09/06 - 19:37:55         admin          Added product
```

### Example 3: Manual Date Input (if field is editable)

```
Navigate to: Product → Edit

Date Input Field:
[1403-09-07] [📅] ← Type here or click calendar

Time Input Field:
[14:30:00] ← Type time here

Combined result: 7th Azar 1403 at 2:30 PM
```

## Conclusion

The Jalali calendar integration provides a seamless Persian localization experience in the Django admin panel. Users can input dates naturally using Persian calendar conventions, and all historical data is displayed consistently in Jalali format.

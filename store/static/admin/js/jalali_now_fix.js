/**
 * Fix for the "Now" (اکنون) button to work with Jalali dates
 * This script converts the current Gregorian date/time to Jalali format
 * and populates both date and time fields correctly
 */

// Wait for DOM to be ready and Django's DateTimeShortcuts to load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initJalaliNowFix);
} else {
    initJalaliNowFix();
}

function initJalaliNowFix() {
    // Wait for Django's DateTimeShortcuts to fully initialize
    setTimeout(function() {
        // Check if DateTimeShortcuts is available
        if (typeof DateTimeShortcuts === 'undefined') {
            console.error('DateTimeShortcuts not found');
            return;
        }

        // Store the original handleClockQuicklink function
        const originalHandleClockQuicklink = DateTimeShortcuts.handleClockQuicklink;

        // Override the handleClockQuicklink function
        DateTimeShortcuts.handleClockQuicklink = function(num, val) {
            // Call the original function first to handle the time
            originalHandleClockQuicklink.call(this, num, val);

            // If this is the "Now" button (val === -1), also set the date field
            if (val === -1) {
                // Get the time input field
                const timeInput = DateTimeShortcuts.clockInputs[num];
                if (!timeInput) return;

                // Find the corresponding date input field
                // The time field usually has id ending with _1, date field ends with _0
                const timeInputId = timeInput.id;
                const dateInputId = timeInputId.replace(/_1$/, '_0');
                const dateInput = document.getElementById(dateInputId);

                if (dateInput) {
                    // Get current date/time
                    const now = new Date();

                    // Convert to Jalali
                    const jalaliDate = gregorianToJalali(
                        now.getFullYear(),
                        now.getMonth() + 1,
                        now.getDate()
                    );

                    // Format date as YYYY-MM-DD
                    const dateStr = jalaliDate.year + '-' +
                                   String(jalaliDate.month).padStart(2, '0') + '-' +
                                   String(jalaliDate.day).padStart(2, '0');

                    // Set the date field value
                    dateInput.value = dateStr;

                    // Trigger change event
                    dateInput.dispatchEvent(new Event('change', { bubbles: true }));
                }
            }
        };

        console.log('Jalali Now fix initialized');
    }, 500); // Give Django time to initialize DateTimeShortcuts
}

/**
 * Convert Gregorian date to Jalali (Persian/Solar Hijri calendar)
 * Algorithm from: https://github.com/jalaali/jalaali-js
 */
function gregorianToJalali(gy, gm, gd) {
    const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];

    let jy = (gy <= 1600) ? 0 : 979;
    gy -= (gy <= 1600) ? 621 : 1600;

    const gy2 = (gm > 2) ? (gy + 1) : gy;
    let days = (365 * gy) + Math.floor((gy2 + 3) / 4) - Math.floor((gy2 + 99) / 100) +
               Math.floor((gy2 + 399) / 400) - 80 + gd + g_d_m[gm - 1];

    jy += 33 * Math.floor(days / 12053);
    days %= 12053;

    jy += 4 * Math.floor(days / 1461);
    days %= 1461;

    if (days > 365) {
        jy += Math.floor((days - 1) / 365);
        days = (days - 1) % 365;
    }

    let jm, jd;
    if (days < 186) {
        jm = 1 + Math.floor(days / 31);
        jd = 1 + (days % 31);
    } else {
        jm = 7 + Math.floor((days - 186) / 30);
        jd = 1 + ((days - 186) % 30);
    }

    return { year: jy, month: jm, day: jd };
}

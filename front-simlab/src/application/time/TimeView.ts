import { Time } from "@/domain/time/Time"
import { Timezone } from "@/domain/time/Timezone"

type TimeViewDisplayOptions = {
    time?: 'show' | 'hide'
    day?: 'long' | 'short' | 'hide'
    date?: 'show' | 'hide'
    month?: 'long' | 'short' | 'hide'
    year?: 'show' | 'hide'
    timezone?: 'show' | 'hide'
}

export class TimeView {
    private static readonly MONTH_ABBR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    private static readonly MONTH = [
        'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October',
        'November', 'December'
    ]
    private static readonly DAY_ABBR = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    private static readonly DAY = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    private static readonly TIMEZONE = {
        7: 'WIB',
        8: 'WITA',
        9: 'WIT',
        0: 'UTC'
    }

    public readonly timezone: Timezone
    public date: Date

    private constructor(
        timezone: Timezone,
        date: Date,
    ) {
        this.timezone = timezone
        this.date = date
    }

    static fromDomain(entity: Time): TimeView {
        return new TimeView(
            entity.timezone,
            entity.date
        )
    }

    getTargetCountdownTime(minutes: number): Date {
        // Convert input to Date object if it's a string
        const startTime = new Date(this.date);

        // Add 2 hours
        const targetTime = new Date(startTime.getTime() + minutes * 60 * 1000);

        return targetTime
    }

    getDateISOString(): string {
        const date = new Date(this.date)
        date.setHours(date.getHours() - this.timezone + (date.getTimezoneOffset() / -60))
        return date.toISOString()
    }

    getDateString(): string {
        return this.getDateISOString().split('T')[0]
    }

    getMinutesBetweenISOStrings(): number {
        // Parse the ISO strings into Date objects
        const date1 = new Date(this.date);
        const date2 = new Date();

        // Calculate difference in milliseconds
        const diffInMs = Math.abs(date2.getTime() - date1.getTime());

        // Convert milliseconds to minutes
        const diffInMinutes = diffInMs / (1000 * 60);

        return Number(diffInMinutes.toFixed(0));
    }

    getTimezone(): string {
        return TimeView.TIMEZONE[this.timezone]
    }

    formatForDay(): string {
        return this.formatToDisplay({ day: 'long' })
    }

    formatForTime(): string {
        return this.formatToDisplay({ day: 'hide', month: 'hide', year: 'hide', date: 'hide' })
    }

    formatForHeaderSubtitle(): string {
        return this.formatToDisplay({ day: 'hide', time: 'hide', timezone: 'hide' })
    }

    formatForDatePicker(showTime?: boolean): string {
        return this.formatToDisplay({ day: 'hide', time: showTime ? 'show' : 'hide' })
    }

    formatForAlertBanner(): string {
        return this.formatToDisplay({ day: 'hide' })
    }

    formatForPositionsTimeRange(): string {
        return this.formatToDisplay({ day: 'hide' })
    }

    formatForInformation() {
        return this.formatToDisplay({})
    }

    fomatForOptionalTimeInformation(showTime?: boolean) {
        return this.formatToDisplay({ time: showTime ? 'show' : 'hide', timezone: showTime ? 'show' : 'hide' })
    }

    // formatForRunningHourTable(): string {
    //     return this.formatToDisplay({ day: 'hide', time: 'hide' })
    // }

    // formatForDataLogTable(): string {
    //     return this.formatToDisplay({})
    // }

    /**
     * Short: Wed, 25 Sep 2024
     * 
     * Short w/o day: 25 Sep 2024
     * 
     * Long: Wednesday, 25 September 2024
     * 
     * @param options defines how date is displayed.
     */
    formatToDisplay(options: TimeViewDisplayOptions): string {
        const timeOpt = options.time ?? 'show'
        const dayOpt = options.day ?? 'short'
        const dateOpt = options.date ?? 'show'
        const monthOpt = options.month ?? 'short'
        const yearOpt = options.year ?? 'show'
        const timezoneOpt = options.timezone ?? 'show'

        let format = ''
        if (dayOpt != 'hide') {
            switch (dayOpt) {
                case 'long':
                    format += TimeView.DAY[this.date.getDay()]
                    break
                case 'short':
                    format += TimeView.DAY_ABBR[this.date.getDay()]
                    break
            }
            format += ', '
        }
        if (dateOpt != 'hide') {
            format += this.date.getDate()
            format += ' '
        }
        if (monthOpt != 'hide') {
            switch (monthOpt) {
                case 'long':
                    format += TimeView.MONTH[this.date.getMonth()]
                    break
                case 'short':
                    format += TimeView.MONTH_ABBR[this.date.getMonth()]
                    break
            }
            format += ' '
        }
        if (yearOpt != 'hide') {
            format += this.date.getFullYear()
            format += ' '
        }
        if (timeOpt != 'hide') {
            format += this.getFormattedTime(this.date)
            format += ' '
        }
        if (timezoneOpt != 'hide') {
            format += TimeView.TIMEZONE[this.timezone]
        }

        return format.trim()
    }

    formatToAPI(withTime?: boolean, withSecond?: boolean): string {
        let format = ''
        format += this.date.getFullYear()
        format += '-'
        format += this.as2Digits(this.date.getMonth() + 1)
        format += '-'
        format += this.as2Digits(this.date.getDate())

        if (withTime) {
            if (withSecond) {
                format += ' ' + this.getFormattedTime(this.date, true)
            } else {
                format += ' ' + this.getFormattedTime(this.date)
            }
        }

        return format.trim()
    }

    private getFormattedTime(date: Date, withSecond?: boolean): string {
        if (withSecond) {
            return `${this.as2Digits(date.getHours())}:${this.as2Digits(date.getMinutes())}:${this.as2Digits(date.getSeconds())}`
        }
        return `${this.as2Digits(date.getHours())}:${this.as2Digits(date.getMinutes())}`
    }

    private as2Digits(value: number): string {
        return value > 9 ? `${value}` : `0${value}`
    }

    getDateRangeIndicatorColor() {
        const minutes = this.getMinutesBetweenISOStrings();

        if (minutes > 360) {
            return 'bg-red-600';
        }

        if (minutes > 60) {
            return 'bg-yellow-600';
        }

        return 'bg-green-600';
    }
}
import { Timezone } from "./Timezone"

export class Time {
    public readonly timezone: Timezone
    public readonly date: Date

    constructor(
        isoTime: string,
        timezone?: Timezone
    ) {
        const tz = Time.getTimezone(isoTime)
        this.timezone = timezone ?? tz
        this.date = new Date(isoTime)
        this.date.setHours(this.date.getHours() + (this.timezone - this.getLocalTimezone()))
    }

    convertTime(inTimezone: Timezone): Time {
        const date = new Date(this.date)
        date.setHours(date.getHours() + this.getLocalTimezone() - this.timezone + inTimezone)
        return new Time(date.toISOString(), inTimezone)
    }

    private getLocalTimezone(): Timezone {
        return this.date.getTimezoneOffset() / -60
    }

    private static getTimezone(isoTime: string): Timezone {
        let timezone: string | null = null

        // if timezone offset exist
        const timezoneOffsetIndex = isoTime.search(/(\+|-)[0-9][0-9]:[0-9][0-9]/)
        if (timezoneOffsetIndex !== -1) {
            timezone = isoTime.substring(timezoneOffsetIndex)
        }
        // if timezone Z exist
        const timezoneZIndex = isoTime.lastIndexOf('Z')
        if (timezoneZIndex !== -1) {
            timezone = "Z"
        }
        if (timezone == null) {
            throw new Error('Invalid date format')
        }

        switch (timezone) {
            case "+07:00": return Timezone.WIB
            case "+08:00": return Timezone.WITA
            case "+09:00": return Timezone.WIT
            case "Z": return Timezone.UTC
            default: return Timezone.WITA
        }
    }
}
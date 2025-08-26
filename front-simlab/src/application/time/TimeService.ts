import { Time } from "@/domain/time/Time";
import { TimeView } from "./TimeView";
import { Timezone } from "@/domain/time/Timezone";

export class TimeService {
    constructor() {}
    
    getTimeNow(timezone?: string): TimeView {
        return this.getTime(new Date(), timezone)
    }

    getTime(date: Date, timezone?: string): TimeView {        
        const d = new Date(date)

        if (timezone == null) {
            d.setHours(date.getHours() + (date.getTimezoneOffset() / -60))
            const theTime = new Time(d.toISOString())
            return TimeView.fromDomain(theTime)
        }
        
        const theTime = new Time(d.toISOString(), this.getTimezone(timezone))
        return TimeView.fromDomain(theTime)
    }

    convertTime(time: TimeView, toTimezone: string): TimeView {
        
        if (time.getTimezone() !== toTimezone) {
            const theTime = new Time(time.getDateISOString()).convertTime(this.getTimezone(toTimezone))
            return TimeView.fromDomain(theTime)
        }
        return time
    }

    private getTimezone(from: string): Timezone {
        let tz: Timezone
        switch (from) {
            case 'WIB': 
                tz = Timezone.WIB
                break
            case 'WITA':
                tz = Timezone.WITA
                break
            case 'WIT':
                tz = Timezone.WIT
                break
            case 'UTC':
                tz = Timezone.UTC
                break
            default:
                tz = Timezone.WITA
        }
        return tz
    }
}
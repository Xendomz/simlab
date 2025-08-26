import { ChevronDownIcon } from "lucide-react"
import { Button } from "@/presentation/components/ui/button"
import { Calendar } from "@/presentation/components/ui/calendar"
import { Label } from "@/presentation/components/ui/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/presentation/components/ui/popover"
import TimePicker from "./TimePicker"
import { useEffect, useState } from "react"


type DateTimePickerProps = {
    onChange: (e: { target: { name: "start_time" | "end_time"; value: Date } }) => void;
    startDateTime?: Date;
    endDateTime?: Date;
};

export default function DateTimePicker({
    onChange,
    startDateTime,
    endDateTime,
}: DateTimePickerProps) {
    const [open, setOpen] = useState(false);
    const [dateRange, setDateRange] = useState<{
        from: Date;
        to: Date;
    }>({
        from: startDateTime ?? new Date(),
        to: endDateTime ?? new Date(),
    });

    const [startTime, setStartTime] = useState(
        startDateTime ? startDateTime.toTimeString().slice(0, 8) : "08:00:00"
    );
    const [endTime, setEndTime] = useState(
        endDateTime ? endDateTime.toTimeString().slice(0, 8) : "17:00:00"
    );

    useEffect(() => {
        if (dateRange.from) {
            const [sh, sm, ss] = startTime.split(":").map(Number);
            const start = new Date(
                dateRange.from.getFullYear(),
                dateRange.from.getMonth(),
                dateRange.from.getDate(),
                sh, sm, ss
            );
            onChange({ target: { name: "start_time", value: start } });
        }

        if (dateRange.to) {
            const [eh, em, es] = endTime.split(":").map(Number);
            const end = new Date(
                dateRange.to.getFullYear(),
                dateRange.to.getMonth(),
                dateRange.to.getDate(),
                eh, em, es
            );
            onChange({ target: { name: "end_time", value: end } });
        }
    }, [startTime, endTime]);

    return (
        <div className="flex gap-4">
            <Label className="px-1">Date Range</Label>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-between font-normal">
                        {dateRange.from && dateRange.to
                            ? `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`
                            : "Select date range"}
                        <ChevronDownIcon className="ml-2 h-4 w-4" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="range"
                        selected={dateRange}
                        onSelect={(range) =>
                            setDateRange({
                                from: range?.from ?? dateRange.from,
                                to: range?.to ?? dateRange.to,
                            })
                        }
                        numberOfMonths={2}
                        captionLayout="dropdown"
                    />
                </PopoverContent>
            </Popover>

            <TimePicker
                id="start_time"
                label="Start Time"
                value={startTime}
                onChange={(v) => setStartTime(v)}
            />
            <TimePicker
                id="end_time"
                label="End Time"
                value={endTime}
                onChange={(v) => setEndTime(v)}
            />
        </div>
    );
}


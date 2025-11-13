import { ChevronDownIcon } from "lucide-react"
import { Button } from "@/presentation/components/ui/button"
import { Calendar } from "@/presentation/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/presentation/components/ui/popover"
import { useEffect, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/presentation/components/ui/select';


type BookingDateTimeRangePickerProps = {
  onChange: (e: { target: { name: "start_time" | "end_time"; value: Date } }) => void;
  startDateTime?: Date;
  endDateTime?: Date;
};

export default function BookingDateTimeRangePicker({
  onChange,
  startDateTime,
  endDateTime,
}: BookingDateTimeRangePickerProps) {
  const [open, setOpen] = useState(false);
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: startDateTime ?? undefined,
    to: endDateTime ?? undefined,
  });

  const [startTime, setStartTime] = useState(
    startDateTime ? startDateTime.toTimeString().slice(0, 8) : "08:00:00"
  );
  const [endTime, setEndTime] = useState(
    endDateTime ? endDateTime.toTimeString().slice(0, 8) : "17:00:00"
  );

  // helper arrays for select controls
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  const parseTime = (t: string) => {
    const [h = "0", m = "0", s = "0"] = t.split(":");
    return { h: Number(h), m: Number(m), s: Number(s) };
  };

  const pad = (n: number) => n.toString().padStart(2, "0");

  const handleStartTimeChange = (h: number, m: number) => {
    const newTime = `${pad(h)}:${pad(m)}:00`;
    setStartTime(newTime);
  };

  const handleEndTimeChange = (h: number, m: number) => {
    const newTime = `${pad(h)}:${pad(m)}:00`;
    setEndTime(newTime);
  };

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

  }, [dateRange, startTime, endTime]);

  return (
    <div className="flex flex-col gap-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          {dateRange.from && dateRange.to ? (
            <Button variant="outline" className="justify-between font-normal">
              {`${dateRange.from.toLocaleDateString()} ${startTime.slice(0, 5)} - ${dateRange.to.toLocaleDateString()} ${endTime.slice(0, 5)}`}
              <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button variant="outline" className="justify-between font-normal text-muted-foreground">
              Pilih Tanggal & Waktu
              <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          )}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4 flex flex-col gap-3" align="start">
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
          <div className="flex flex-col gap-4 mt-2">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold mb-1">Waktu Mulai</label>
              <div className="flex gap-2 items-center">
                <Select value={parseTime(startTime).h.toString()} onValueChange={val => handleStartTimeChange(Number(val), parseTime(startTime).m)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Jam" />
                  </SelectTrigger>
                  <SelectContent>
                    {hours.map(h => (
                      <SelectItem key={h} value={h.toString()}>{h.toString().padStart(2, "0")}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span>:</span>
                <Select value={parseTime(startTime).m.toString()} onValueChange={val => handleStartTimeChange(parseTime(startTime).h, Number(val))}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Menit" />
                  </SelectTrigger>
                  <SelectContent>
                    {minutes.map(m => (
                      <SelectItem key={m} value={m.toString()}>{m.toString().padStart(2, "0")}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold mb-1">Waktu Selesai</label>
              <div className="flex gap-2 items-center">
                <Select value={parseTime(endTime).h.toString()} onValueChange={val => handleEndTimeChange(Number(val), parseTime(endTime).m)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Jam" />
                  </SelectTrigger>
                  <SelectContent>
                    {hours.map(h => (
                      <SelectItem key={h} value={h.toString()}>{h.toString().padStart(2, "0")}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span>:</span>
                <Select value={parseTime(endTime).m.toString()} onValueChange={val => handleEndTimeChange(parseTime(endTime).h, Number(val))}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Menit" />
                  </SelectTrigger>
                  <SelectContent>
                    {minutes.map(m => (
                      <SelectItem key={m} value={m.toString()}>{m.toString().padStart(2, "0")}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}


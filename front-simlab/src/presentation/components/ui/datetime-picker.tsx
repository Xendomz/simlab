import * as React from 'react';
import { Calendar } from '@/presentation/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/presentation/components/ui/popover';
import { Button } from '@/presentation/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/presentation/components/ui/select';
import { CalendarClock } from 'lucide-react';

interface DateTimePickerProps {
  value?: { date?: Date; startTime?: string; endTime?: string };
  onChange: (val: { date?: Date; startTime?: string; endTime?: string }) => void;
  placeholder?: string;
}

export const DateTimePicker: React.FC<DateTimePickerProps> = ({ value, onChange, placeholder }) => {
  const [open, setOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(value?.date);
  const [startTime, setStartTime] = React.useState<string>(value?.startTime || '08:00');
  const [endTime, setEndTime] = React.useState<string>(value?.endTime || '17:00');

  React.useEffect(() => {
    if (value?.date) setSelectedDate(value.date);
    if (value?.startTime) setStartTime(value.startTime);
    if (value?.endTime) setEndTime(value.endTime);
  }, [value]);

  const handleDateSelect = (date?: Date) => {
    if (!date) return;
    setSelectedDate(date);
    onChange({ date, startTime, endTime });
  };

  // Helper for select options
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  const parseTime = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    return { h, m };
  };

  const handleStartTimeChange = (h: number, m: number) => {
    const newTime = `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
    setStartTime(newTime);
    onChange({ date: selectedDate, startTime: newTime, endTime });
  };

  const handleEndTimeChange = (h: number, m: number) => {
    const newTime = `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
    setEndTime(newTime);
    onChange({ date: selectedDate, startTime, endTime: newTime });
  };

  return (
    <div className="flex gap-2 items-center w-full">
      <Popover open={open} onOpenChange={setOpen} modal={true}>
        <PopoverTrigger asChild>
          {selectedDate ? (
            <Button type="button" className='w-full font-normal' variant="outline" onClick={() => setOpen(true)}>
              {selectedDate.toLocaleDateString() + ` (${startTime} - ${endTime})`}
            </Button>
          ) : (
            <Button type="button" className='w-full text-muted-foreground font-normal' variant="outline" onClick={() => setOpen(true)}>
              <CalendarClock/>
              {(placeholder || 'Pilih Tanggal & Waktu')}
            </Button>
          )}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4 flex flex-col gap-3">
          <Calendar
            className='p-0'
            mode="single"
            selected={selectedDate}
            onSelect={date => handleDateSelect(date)}
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
};

import * as React from 'react';
import { Calendar } from '@/presentation/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/presentation/components/ui/popover';
import { Button } from '@/presentation/components/ui/button';

interface DateTimeRange {
  start?: Date;
  end?: Date;
}

interface DateTimeRangePickerProps {
  value: DateTimeRange;
  onChange: (range: DateTimeRange) => void;
  placeholder?: string;
}

export const DateTimeRangePicker: React.FC<DateTimeRangePickerProps> = ({ value, onChange, placeholder }) => {
  const [open, setOpen] = React.useState(false);
  const [selectedRange, setSelectedRange] = React.useState<DateTimeRange>(value);
  const [startTime, setStartTime] = React.useState<string>(value.start ? value.start.toTimeString().slice(0,5) : '');
  const [endTime, setEndTime] = React.useState<string>(value.end ? value.end.toTimeString().slice(0,5) : '');

  React.useEffect(() => {
    setSelectedRange(value);
    setStartTime(value.start ? value.start.toTimeString().slice(0,5) : '');
    setEndTime(value.end ? value.end.toTimeString().slice(0,5) : '');
  }, [value]);

  const handleDateSelect = (dates: Date[] | undefined) => {
    if (!dates || dates.length === 0) return;
    let [start, end] = dates;
    if (start && startTime) {
      const [h, m] = startTime.split(':').map(Number);
      start = new Date(start);
      start.setHours(h, m, 0, 0);
    }
    if (end && endTime) {
      const [h, m] = endTime.split(':').map(Number);
      end = new Date(end);
      end.setHours(h, m, 0, 0);
    }
    setSelectedRange({ start, end });
    onChange({ start, end });
    setOpen(false);
  };

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setStartTime(newTime);
    if (selectedRange.start) {
      const [h, m] = newTime.split(':').map(Number);
      const newStart = new Date(selectedRange.start);
      newStart.setHours(h, m, 0, 0);
      setSelectedRange(r => ({ ...r, start: newStart }));
      onChange({ ...selectedRange, start: newStart });
    }
  };

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setEndTime(newTime);
    if (selectedRange.end) {
      const [h, m] = newTime.split(':').map(Number);
      const newEnd = new Date(selectedRange.end);
      newEnd.setHours(h, m, 0, 0);
      setSelectedRange(r => ({ ...r, end: newEnd }));
      onChange({ ...selectedRange, end: newEnd });
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button type="button" variant="outline" onClick={() => setOpen(true)}>
            {selectedRange.start && selectedRange.end
              ? `${selectedRange.start.toLocaleString()} - ${selectedRange.end.toLocaleString()}`
              : (placeholder || 'Pilih Rentang Tanggal & Waktu')}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="range"
            selected={selectedRange.start && selectedRange.end ? [selectedRange.start, selectedRange.end] : undefined}
            onSelect={handleDateSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <div className="flex gap-2 items-center">
        <input
          type="time"
          value={startTime}
          onChange={handleStartTimeChange}
          className="border rounded px-2 py-1"
          placeholder="Waktu Mulai"
        />
        <span>-</span>
        <input
          type="time"
          value={endTime}
          onChange={handleEndTimeChange}
          className="border rounded px-2 py-1"
          placeholder="Waktu Selesai"
        />
      </div>
    </div>
  );
};

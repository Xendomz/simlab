import * as React from 'react';
import { Calendar } from '@/presentation/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/presentation/components/ui/popover';
import { Button } from '@/presentation/components/ui/button';

interface DateTimePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
}

export const DateTimePicker: React.FC<DateTimePickerProps> = ({ value, onChange, placeholder }) => {
  const [open, setOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(value);
  const [time, setTime] = React.useState<string>(value ? value.toTimeString().slice(0,5) : '');

  React.useEffect(() => {
    if (value) {
      setSelectedDate(value);
      setTime(value.toTimeString().slice(0,5));
    }
  }, [value]);

  const handleDateSelect = (date?: Date) => {
    if (!date) return;
    const newDate = new Date(date);
    if (time) {
      const [hours, minutes] = time.split(':').map(Number);
      newDate.setHours(hours, minutes, 0, 0);
    }
    setSelectedDate(newDate);
    onChange(newDate);
    setOpen(false);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setTime(newTime);
    if (selectedDate) {
      const [hours, minutes] = newTime.split(':').map(Number);
      const newDate = new Date(selectedDate);
      newDate.setHours(hours, minutes, 0, 0);
      setSelectedDate(newDate);
      onChange(newDate);
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button type="button" variant="outline" onClick={() => setOpen(true)}>
            {selectedDate ? selectedDate.toLocaleString() : (placeholder || 'Pilih Tanggal & Waktu')}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={date => handleDateSelect(date)}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <input
        type="time"
        value={time}
        onChange={handleTimeChange}
        className="border rounded px-2 py-1"
      />
    </div>
  );
};

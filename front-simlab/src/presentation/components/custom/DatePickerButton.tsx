import * as React from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '@/presentation/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/presentation/components/ui/button';
import { Calendar } from '@/presentation/components/ui/calendar';

interface DatePickerButtonProps {
  date?: Date;
  onChange: (date?: Date) => void;
}

const DatePickerButton: React.FC<DatePickerButtonProps> = ({ date, onChange }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setOpen(true)}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? date.toLocaleDateString() : <span className="text-muted-foreground">Pilih tanggal</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={d => { onChange(d); setOpen(false); }}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePickerButton;

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/presentation/components/ui/select"
import { Input } from "@/presentation/components/ui/input"
import { useMemo, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/presentation/components/ui/popover"
import { Button } from "@/presentation/components/ui/button"
import { ChevronDownIcon } from "lucide-react";
import { Label } from "../ui/label";

// --- Custom Time Picker Subcomponent ------------------------------------
interface TimePickerProps {
    id: string;
    label?: string;
    value: string; // format HH:MM:SS
    onChange: (v: string) => void;
}

const TimePicker: React.FC<TimePickerProps> = ({ id, label, value, onChange }) => {
    const [open, setOpen] = useState(false);
    const [h, m, s] = value.split(":");

    const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0")), []);
    const minutes = useMemo(() => Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0")), []);
    const seconds = minutes; // same 0-59

    const update = (nh: string, nm: string, ns: string) => {
        const next = `${nh}:${nm}:${ns}`;
        onChange(next);
    };

    return (
        <div className="flex flex-col gap-2">
            <Label htmlFor={id}>{label}</Label>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button type="button" variant="outline" className="justify-between font-mono" id={id} aria-label={`${label} picker`}>
                        {value}
                        <ChevronDownIcon className="ml-2 h-4 w-full" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[260px]" align="start">
                    <div className="grid grid-cols-3 gap-2">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-medium px-1">Jam</span>
                            <Select value={h} onValueChange={(val) => update(val, m, s)}>
                                <SelectTrigger className="h-9">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="max-h-52">
                                    {hours.map((hr) => (
                                        <SelectItem key={hr} value={hr}>{hr}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-medium px-1">Menit</span>
                            <Select value={m} onValueChange={(val) => update(h, val, s)}>
                                <SelectTrigger className="h-9">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="max-h-52">
                                    {minutes.map((mm) => (
                                        <SelectItem key={mm} value={mm}>{mm}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-medium px-1">Detik</span>
                            <Select value={s} onValueChange={(val) => update(h, m, val)}>
                                <SelectTrigger className="h-9">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="max-h-52">
                                    {seconds.map((ss) => (
                                        <SelectItem key={ss} value={ss}>{ss}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="mt-3 flex justify-end">
                        <Button size="sm" onClick={() => setOpen(false)} type="button">Tutup</Button>
                    </div>
                </PopoverContent>
            </Popover>
            {/* Hidden native input for accessibility / forms if needed */}
            <Input type="hidden" name={id} value={value} readOnly />
        </div>
    );
};

export default TimePicker;
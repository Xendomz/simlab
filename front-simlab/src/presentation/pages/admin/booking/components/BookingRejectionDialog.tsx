import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/presentation/components/ui/dialog";
import { Button } from "@/presentation/components/ui/button";
import { Label } from "@/presentation/components/ui/label";
import { useEffect, useState } from "react";
import { BookingVerifyDTO } from "@/application/booking/dto/BookingDTO";
import { Textarea } from "@/presentation/components/ui/textarea";
import { ApiResponse } from "@/shared/Types";
import { useValidationErrors } from "@/presentation/hooks/useValidationError";
import { toast } from "sonner";

interface BookingRejectionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    handleRejection: (data: BookingVerifyDTO) => Promise<void>;
}

const BookingRejectionDialog: React.FC<BookingRejectionDialogProps> = ({ open, onOpenChange, handleRejection }) => {
    const [reason, setReason] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { errors, processErrors } = useValidationErrors()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true)
        try {
            await handleRejection({
                action: 'reject',
                information: reason
            });
        } catch (e) {
            const error = e as ApiResponse
            toast.error(error.message || 'Gagal submit')

            if (error.errors) {
                processErrors(error.errors);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (!open) setReason("");
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Konfirmasi Penolakan</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-2 py-4">
                        <Label htmlFor="rejection-reason">Alasan Penolakan</Label>
                        <div className="flex flex-col gap-1">
                            <Textarea
                                id="rejection-reason"
                                value={reason}
                                onChange={e => setReason(e.target.value)}
                                placeholder="Masukkan alasan penolakan..."
                                rows={4}
                            />
                            {errors['information'] && (
                                <p className=" text-xs italic text-red-500">{errors['information']}</p>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="secondary" onClick={() => onOpenChange(false)} disabled={isSubmitting}>Batal</Button>
                        <Button type="submit" variant="destructive" disabled={isSubmitting}>
                            {isSubmitting ? 'Memproses...' : 'Tolak Peminjaman'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default BookingRejectionDialog;

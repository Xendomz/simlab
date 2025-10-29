import { Button } from "@/presentation/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/presentation/components/ui/dialog"
import { useState } from "react"

interface ConfirmationDialogProps {
    open: boolean,
    onOpenChange: (open: boolean) => void,
    onConfirm: () => Promise<void>
    confirmVariant?: "default" | "destructive"
    title?: string,
    message?: string
}

export default function ConfirmationDialog({ open, onOpenChange, onConfirm, confirmVariant, title, message }: ConfirmationDialogProps) {
    const [isLoading, setIsLoading] = useState(false)
    async function submit() {
        setIsLoading(true)
        try {
            
            await onConfirm()
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{ title ?? 'Apakah kamu yakin?' }</DialogTitle>
                    <DialogDescription>
                        { message ?? 'Tindakan ini tidak dapat dibatalkan. Melanjutkan akan secara permanen memengaruhi data kamu.' }
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant='secondary'>
                            Tutup
                        </Button>
                    </DialogClose>
                    <Button type="button" variant={confirmVariant} disabled={isLoading} onClick={submit}>
                        { isLoading ? 'Memproses...' : 'Lanjut' }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

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
}

export default function ConfirmationDialog({ open, onOpenChange, onConfirm, confirmVariant }: ConfirmationDialogProps) {
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
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. Proceeding will permanently affect your data.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant='secondary'>
                            Close
                        </Button>
                    </DialogClose>
                    <Button type="button" variant={confirmVariant} disabled={isLoading} onClick={submit}>
                        { isLoading ? 'Submitting...' : 'Continue' }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

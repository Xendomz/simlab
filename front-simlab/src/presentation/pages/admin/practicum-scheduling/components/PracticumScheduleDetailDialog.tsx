import { PracticumSchedulingView } from '@/application/practicum-scheduling/PracticumSchedulingView'
import React from 'react'
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
import Item from '@/presentation/components/Item'


interface PracticumScheduleDetailDialogProps {
    open: boolean,
    onOpenChange: (open: boolean) => void,
    practicumScheduling: PracticumSchedulingView | undefined
}

const PracticumScheduleDetailDialog: React.FC<PracticumScheduleDetailDialogProps> = ({ open, onOpenChange, practicumScheduling }) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-xl grid-rows-[auto_minmax(0,1fr)_auto] max-h-[90dvh] p-0">
                <DialogHeader className="px-6 pt-6">
                    <DialogTitle>Informasi Peminjaman</DialogTitle>
                    <DialogDescription>

                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col px-6 gap-5 overflow-y-scroll scrollbar-hidden">
                    {practicumScheduling && (
                        <>
                            <div className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-5">
                                    <Item title='Nama Pemohon' value={practicumScheduling.user?.name}/>
                                    <Item title='Nama Identitas Peminjam' value={practicumScheduling.user?.identityNum}/>
                                    <Item title='Program Studi' value={practicumScheduling.user?.studyProgram?.name}/>
                                    <Item title='Nomor Hp (Whatsapp)' value={practicumScheduling.phoneNumber}/>
                                    <Item title='Mata Kuliah / Praktikum' value={practicumScheduling.practicum?.name}/>
                                    <Item title='Total Kelas yang Diajukan' value={practicumScheduling.practicumClasses?.length} />
                                </div>
                            </div>
                        </>
                    )}
                </div>
                <DialogFooter className="p-6">
                    <DialogClose asChild>
                        <Button type="button" variant='secondary'>
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default PracticumScheduleDetailDialog

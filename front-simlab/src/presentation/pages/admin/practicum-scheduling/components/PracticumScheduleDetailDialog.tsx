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
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Nama Peminjam</label>
                                        <span className="text-sm font-medium text-gray-800">{practicumScheduling.user?.name}</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Nomor Identitas Peminjam</label>
                                        <span className="text-sm font-medium text-gray-800">{practicumScheduling.user?.identityNum}</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Program Studi</label>
                                        <span className="text-sm font-medium text-gray-800">{practicumScheduling.user?.studyProgram?.name}</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Nomor Hp (Whatsapp)</label>
                                        <span className="text-sm font-medium text-gray-800">{practicumScheduling.phoneNumber}</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Ruangan</label>
                                        <span className="text-sm font-medium text-gray-800">{practicumScheduling.laboratoryRoom?.name}</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Mata Kuliah Praktikum</label>
                                        <span className="text-sm font-medium text-gray-800">{practicumScheduling.practicum?.name}</span>
                                    </div>
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

import React from 'react'
import { Button } from '@/presentation/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/presentation/components/ui/dialog';
import { ScrollArea } from '@/presentation/components/ui/scroll-area';
import { PracticumSchedulingEquipmentView } from '@/application/practicum-scheduling/PracticumSchedulingEquipmentView';
import { PracticumScheduleEquipmentColumn } from '../column/PracticumScheduleEquipmentColumn';
import { DataTable } from '@/presentation/components/custom/Datatable';

interface PracticumSchedulingEquipmentDialogProps {
    open: boolean,
    onOpenChange: (open: boolean) => void,
    data: PracticumSchedulingEquipmentView[]
}

const PracticumSchedulingEquipmentDialog: React.FC<PracticumSchedulingEquipmentDialogProps> = ({
    open,
    onOpenChange,
    data
}) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Daftar Alat yang Dipinjam</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <ScrollArea className='h-full max-h-[70vh]'>
                    <div className="p-1">
                        <DataTable columns={PracticumScheduleEquipmentColumn()} data={data} loading={false} />
                    </div>
                </ScrollArea>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Tutup
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default PracticumSchedulingEquipmentDialog
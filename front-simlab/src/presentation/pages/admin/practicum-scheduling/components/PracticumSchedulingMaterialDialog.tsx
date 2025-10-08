import { PracticumSchedulingMaterialView } from '@/application/practicum-scheduling/PracticumSchedulingMaterialView'
import React from 'react'
import { Button } from '@/presentation/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/presentation/components/ui/dialog';
import { ScrollArea } from '@/presentation/components/ui/scroll-area';
import { DataTable } from '@/presentation/components/custom/Datatable';
import { PracticumScheduleMaterialColumn } from '../column/PracticumScheduleMaterialColumn';

interface PracticumSchedulingMaterialDialogProps {
    open: boolean,
    onOpenChange: (open: boolean) => void,
    data: PracticumSchedulingMaterialView[]
}

const PracticumSchedulingMaterialDialog: React.FC<PracticumSchedulingMaterialDialogProps> = ({
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
                    <div className='p-1'>
                        <DataTable columns={PracticumScheduleMaterialColumn()} data={data} loading={false} />
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

export default PracticumSchedulingMaterialDialog
import { BookingEquipmentView } from '@/application/booking/BookingEquipmentView'
import { DataTable } from '@/presentation/components/custom/Datatable';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/presentation/components/ui/dialog';
import React from 'react'
import { BookingEquipmentColumn } from '../column/BookingEquipmentColumn';
import { ScrollArea } from '@/presentation/components/ui/scroll-area';
import { Button } from '@/presentation/components/ui/button';
import { Eye } from 'lucide-react';

interface BookingEquipmentDialogProps {
    data: BookingEquipmentView[]
    is_allowed_offsite?: boolean
}

const BookingEquipmentDialog: React.FC<BookingEquipmentDialogProps> = ({
    data,
    is_allowed_offsite
}) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Lihat Daftar Alat <Eye /></Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Daftar Alat yang Dipinjam</DialogTitle>
                    <DialogDescription>Berikut merupakan daftar alat yang telah diajukan.</DialogDescription>
                </DialogHeader>
                <ScrollArea className='h-full max-h-[70vh]'>
                    <DataTable columns={BookingEquipmentColumn()} data={data} loading={false} />
                    {is_allowed_offsite !== undefined && (
                        <span className='text-sm text-muted-foreground'><span className='font-bold'>Keterangan:</span> {is_allowed_offsite ? 'Alat dapat dibawa di luar ruangan' : 'Alat tidak dapat dibawa di luar ruangan'}</span>
                    )}
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

export default BookingEquipmentDialog
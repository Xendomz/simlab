import { BookingMaterialtView } from '@/application/booking/BookingMaterialView'
import { DataTable } from '@/presentation/components/custom/Datatable';
import { Button } from '@/presentation/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/presentation/components/ui/dialog';
import { ScrollArea } from '@/presentation/components/ui/scroll-area';
import { Eye } from 'lucide-react';
import React from 'react'
import { BookingMaterialColumn } from '../column/BookingMaterialColumn';

interface BookingMaterialDialogProps {
    data: BookingMaterialtView[]
}

const BookingMaterialDialog: React.FC<BookingMaterialDialogProps> = ({
    data
}) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    Lihat Daftar Bahan <Eye />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Daftar Bahan yang Dipinjam</DialogTitle>
                    <DialogDescription>Berikut merupakan daftar bahan yang diajukan.</DialogDescription>
                </DialogHeader>
                <ScrollArea className='h-full max-h-[70vh]'>
                    <DataTable columns={BookingMaterialColumn()} data={data} loading={false} />
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

export default BookingMaterialDialog
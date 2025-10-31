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
}

const BookingEquipmentDialog: React.FC<BookingEquipmentDialogProps> = ({
    data
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
                    <div className="p-1 flex flex-col gap-5">
                        {data.length > 0 ? (
                            <div>
                                <span className='font-semibold'>Alat Laboratorium </span>
                                <DataTable columns={BookingEquipmentColumn()} data={data} loading={false} />
                            </div>
                        ) : (
                            <div>
                                <span className='font-semibold'>Alat Laboratorium </span>
                                <p className='mb-2 text-sm text-muted-foreground'>Tidak ada alat dari daftar inventaris.</p>
                            </div>
                        )}
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

export default BookingEquipmentDialog
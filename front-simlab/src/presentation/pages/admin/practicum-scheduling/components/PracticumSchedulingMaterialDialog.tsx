import { PracticumSchedulingMaterialView } from '@/application/practicum-scheduling/PracticumSchedulingMaterialView'
import React from 'react'
import { Button } from '@/presentation/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/presentation/components/ui/dialog';
import { ScrollArea } from '@/presentation/components/ui/scroll-area';
import { DataTable } from '@/presentation/components/custom/Datatable';
import { PracticumScheduleMaterialColumn } from '../column/PracticumScheduleMaterialColumn';
import { Eye } from 'lucide-react';

interface PracticumSchedulingMaterialDialogProps {
    data: PracticumSchedulingMaterialView[]
}

const PracticumSchedulingMaterialDialog: React.FC<PracticumSchedulingMaterialDialogProps> = ({
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
                    <DialogDescription>Berikut merupakan daftar bahan yang diajukan untuk semua kelas. Harap hubungi kepala jurusan yang mengajukan untuk pembagian bahan per kelas</DialogDescription>
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
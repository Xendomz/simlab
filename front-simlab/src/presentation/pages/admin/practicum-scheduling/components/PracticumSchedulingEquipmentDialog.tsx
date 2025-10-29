import React from 'react'
import { Button } from '@/presentation/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/presentation/components/ui/dialog';
import { ScrollArea } from '@/presentation/components/ui/scroll-area';
import { PracticumSchedulingEquipmentView } from '@/application/practicum-scheduling/PracticumSchedulingEquipmentView';
import { PracticumScheduleEquipmentColumn } from '../column/PracticumScheduleEquipmentColumn';
import { DataTable } from '@/presentation/components/custom/Datatable';
import { PracticumSchedulingEquipmentType } from '@/domain/practicum-scheduling/PracticumSchedulingEquipmentType';
import { Eye } from 'lucide-react';

interface PracticumSchedulingEquipmentDialogProps {
    data: PracticumSchedulingEquipmentView[]
}

const PracticumSchedulingEquipmentDialog: React.FC<PracticumSchedulingEquipmentDialogProps> = ({
    data
}) => {
    const laboratoryEquipment = data.filter((equipment) => equipment.type === PracticumSchedulingEquipmentType.LaboratoryEquipment)
    const laboratoryTemporaryEquipment = data.filter((equipment) => equipment.type === PracticumSchedulingEquipmentType.LaboratoryTemporaryEquipment)

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Lihat Daftar Alat <Eye /></Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Daftar Alat yang Dipinjam</DialogTitle>
                    <DialogDescription>Berikut merupakan daftar alat serta usulan alat yang dapat digunakan pada setiap kelas praktikum.</DialogDescription>
                </DialogHeader>
                <ScrollArea className='h-full max-h-[70vh]'>
                    <div className="p-1 flex flex-col gap-5">
                        {laboratoryEquipment.length > 0 ? (
                            <div>
                                <span className='font-semibold'>Alat Laboratorium </span>
                                <DataTable columns={PracticumScheduleEquipmentColumn()} data={laboratoryEquipment} loading={false} />
                            </div>
                        ) : (
                            <div>
                                <span className='font-semibold'>Alat Laboratorium </span>
                                <p className='mb-2 text-sm text-muted-foreground'>Tidak ada alat dari daftar inventaris.</p>
                            </div>
                        )}

                        {laboratoryTemporaryEquipment.length > 0 ? (
                            <div>
                                <span className='font-semibold'>Usulan Alat Laboratorium </span>
                                <DataTable columns={PracticumScheduleEquipmentColumn()} data={laboratoryTemporaryEquipment} loading={false} />
                            </div>
                        ) : (
                            <div>
                                <span className='font-semibold'>Usulan Alat Laboratorium </span>
                                <p className='mb-2 text-sm text-muted-foreground'>Tidak ada alat usulan.</p>
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

export default PracticumSchedulingEquipmentDialog
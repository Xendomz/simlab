import { ColumnDef } from '@tanstack/react-table';
import { LaboratoryRoomView } from '@/application/laboratory-room/LaboratoryRoomView';
import { Button } from '@/presentation/components/ui/button';

interface ColumnProps {
    openModal: (type: 'Add' | 'Edit', id?: number) => void;
    openConfirm: (id: number) => void;
}

export const LaboratoryRoomColumn = ({ openModal, openConfirm }: ColumnProps): ColumnDef<LaboratoryRoomView>[] => [
    { header: 'Nama Ruangan', accessorKey: 'name' as keyof LaboratoryRoomView },
    { header: 'Lantai', accessorKey: 'floor' as keyof LaboratoryRoomView },
    { header: 'Petugas Laboran', accessorKey: 'user' as keyof LaboratoryRoomView, cell: ({ row }) => row.original.user?.name },
    {
        header: 'Harga Mahasiswa',
        accessorKey: 'studentPrice',
        cell: ({ row }) => row.original.studentPrice.formatToIDR()
    },
    {
        header: 'Harga Dosen',
        accessorKey: 'lecturerPrice',
        cell: ({ row }) => row.original.lecturerPrice.formatToIDR()
    },
    {
        header: 'Harga External',
        accessorKey: 'externalPrice',
        cell: ({ row }) => row.original.externalPrice.formatToIDR()
    },
    {
        header: 'Action',
        accessorKey: 'id' as keyof LaboratoryRoomView,
        cell: ({ row }) => (
            <div className='flex gap-2'>
                <Button size={'sm'} onClick={() => openModal('Edit', row.original.id)}>
                    Edit
                </Button>
                <Button size={'sm'} variant={'destructive'} onClick={() => openConfirm(row.original.id)}>
                    Delete
                </Button>
            </div>
        )
    },
];

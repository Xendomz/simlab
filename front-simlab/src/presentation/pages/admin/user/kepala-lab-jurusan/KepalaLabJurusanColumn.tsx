import { ColumnDef } from '@tanstack/react-table';
import { UserView } from '@/application/user/UserView';
import { Button } from '@/presentation/components/ui/button';

interface ColumnProps {
    openModal: (type: 'Add' | 'Edit', id?: number) => void;
    openConfirm: (id: number) => void;
}

export const KepalaLabJurusanColumn = ({ openModal, openConfirm }: ColumnProps): ColumnDef<UserView>[] => [
    { header: 'Email', accessorKey: 'email' as keyof UserView  },
    { header: 'Nama', accessorKey: 'name' as keyof UserView  },
    { header: 'NIM / NIP / NIPH / Lainnya', accessorKey: 'identityNum' as keyof UserView, cell: ({ row }) => row.original.identityNum ?? '-' },
    { header: 'Prodi', accessorKey: 'studyProgram' as keyof UserView, cell: ({ row }) => row.original.studyProgram?.name },
    {
        header: 'Action',
        accessorKey: 'id' as keyof UserView,
        cell: ({ row }) => (
            <div className='flex gap-2'>
                <Button size={'sm'} onClick={() => openModal('Edit', row.original.id)}>
                    Edit
                </Button>
                <Button size={'sm'} variant={'destructive'} onClick={() => openConfirm(row.original.id)}>
                    Change to Dosen
                </Button>
            </div>
        )
    },
];

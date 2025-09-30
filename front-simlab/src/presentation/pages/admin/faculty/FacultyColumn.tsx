import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/presentation/components/ui/button';
import { FacultyView } from '@/application/faculty/FacultyView';

interface ColumnProps {
    openModal: (type: 'Add' | 'Edit', id?: number) => void;
    openConfirm: (id: number) => void
}

export const FacultyColumn = ({ openModal, openConfirm }: ColumnProps): ColumnDef<FacultyView>[] => [
    { header: 'Kode Fakultas', accessorKey: 'code' as keyof FacultyView},
    { header: 'Fakultas', accessorKey: 'name' as keyof FacultyView},
    {
      header: 'Action',
      accessorKey: 'id' as keyof FacultyView,
      cell: ({row}) => (
        <div className='flex gap-2'>
          <Button size={'sm'} variant={'warning'} onClick={() => openModal('Edit' ,row.original.id)}>
            Edit
          </Button>
          <Button variant={'destructive'} size={'sm'} onClick={() => openConfirm(row.original.id)}>
            Delete
          </Button>
        </div>
      )
    },
];

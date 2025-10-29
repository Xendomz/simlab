import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/presentation/components/ui/badge';
import { Button } from '@/presentation/components/ui/button';
import { AcademicYearView } from '@/application/academic-year/AcademicYearView';

interface ColumnProps {
    openModal: (type: 'Add' | 'Edit', id?: number) => void;
    openConfirm: (type: "delete" | "status", id: number) => void
}

export const AcademicYearColumn = ({ openModal, openConfirm }: ColumnProps): ColumnDef<AcademicYearView>[] => [
    { header: 'Tahun Akademik', accessorKey: 'name' as keyof AcademicYearView},
    {
      header: 'Status',
      accessorKey: 'status' as keyof AcademicYearView,
      cell: ({row}) => (
        <Badge variant={row.original.status === 'Active' ? 'default' : 'destructive'}  className='cursor-pointer' onClick={() => openConfirm('status', row.original.id)}>{row.original.status}</Badge>
      )
    },
    {
      header: 'Action',
      accessorKey: 'id' as keyof AcademicYearView,
      cell: ({row}) => (
        <div className='flex gap-2'>
          <Button size={'sm'} variant={'warning'} onClick={() => openModal('Edit' ,row.original.id)}>
            Edit
          </Button>
          <Button variant={'destructive'} size={'sm'} onClick={() => openConfirm('delete', row.original.id)}>
            Delete
          </Button>
        </div>
      )
    },
];

import { PracticumModuleView } from "@/application/practicum-module/PracticumModuleView";
import { Badge } from "@/presentation/components/ui/badge";
import { Button } from "@/presentation/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";

interface ColumnProps {
    openModal: (type: 'Add' | 'Edit', id?: number) => void;
    openConfirm: (type: "delete" | "status", id: number) => void
}

export const PracticumModuleColumn = ({ openModal, openConfirm }: ColumnProps): ColumnDef<PracticumModuleView>[] => [
    { header: 'Praktikum', accessorKey: 'practicum', cell: ({ row }) => row.original.practicum?.name},
    { header: 'Modul Praktikum', accessorKey: 'name'},
    {
      header: 'Status',
      accessorKey: 'status' as keyof PracticumModuleView,
      cell: ({row}) => (
        <Badge variant={row.original.status === 'Active' ? 'default' : 'destructive'}  className='cursor-pointer' onClick={() => openConfirm('status', row.original.id)}>{row.original.status}</Badge>
      )
    },
    {
      header: 'Action',
      accessorKey: 'id' as keyof PracticumModuleView,
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
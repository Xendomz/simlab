import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/presentation/components/ui/button";
import { TestingTypeView } from "@/application/testing-type/TestingTypeView";

interface ColumnProps {
  openModal: (type: 'Add' | 'Edit', id?: number) => void;
  openConfirm: (id: number) => void
}

export const TestingTypeColumn = ({ openModal, openConfirm }: ColumnProps): ColumnDef<TestingTypeView>[] => [
  {
    header: 'Jenis Pengujian',
    accessorKey: 'name',
    cell: ({row}) => ( <div className="text-pretty">{row.original.name}</div> )
  },
  {
    header: 'Satuan Pengujian',
    accessorKey: 'unit',
  },
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
    accessorKey: 'id',
    cell: ({row}) => (
      <div className="flex gap-2">
        <Button
          size={'sm'}
          onClick={() => openModal('Edit', row.original.id)}
        >
          Edit
        </Button>
        <Button
          size={'sm'}
          variant={"destructive"}
          onClick={() => openConfirm(row.original.id)}
        >
          Delete
        </Button>
      </div>
    ),
  },
];

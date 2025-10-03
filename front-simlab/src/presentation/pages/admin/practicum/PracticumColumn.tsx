import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/presentation/components/ui/button";
import { PracticumView } from "@/application/practicum/PracticumView";

interface ColumnProps {
    openModal: (type: 'Add' | 'Edit', id?: number) => void;
    openConfirm: (id: number) => void;
}

export const PracticumColumn = ({ openModal, openConfirm }: ColumnProps): ColumnDef<PracticumView>[] => [
    { header: 'Kode Mata Kuliah', accessorKey: 'code' },
    { header: 'Nama Praktikum', accessorKey: 'name' },
    { header: 'Prodi', accessorKey: 'studyProgram', cell: ({ row }) => row.original.studyProgram?.name },
    { header: 'SKS', accessorKey: 'sks' },
    {
        header: 'Action',
        accessorKey: 'id' as keyof PracticumView,
        cell: ({ row }) => (
            <div className="flex gap-2">
                <Button size={"sm"} variant={'warning'} onClick={() => openModal('Edit', row.original.id)}>
                    Edit
                </Button>
                <Button size={"sm"} variant={"destructive"} onClick={() => openConfirm(row.original.id)}>
                    Delete
                </Button>
            </div>
        )
    },
];
